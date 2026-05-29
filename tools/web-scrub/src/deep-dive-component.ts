import { chromium, type Page } from 'playwright';
import { mkdirSync, writeFileSync, readFileSync, existsSync } from 'node:fs';
import { join, resolve } from 'node:path';

type CliArgs = { url: string; selector: string; out?: string; name?: string; states?: string };

function parseArgs(): CliArgs {
  const argv = process.argv.slice(2);
  const args: CliArgs = { url: '', selector: '' };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--url') args.url = argv[++i];
    else if (a === '--selector') args.selector = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--name') args.name = argv[++i];
    else if (a === '--states') args.states = argv[++i];
  }
  if (!args.url || !args.selector) {
    console.error('usage: tsx src/deep-dive-component.ts --url <url> --selector <css> [--name <slug>] [--out <dir>] [--states default,hover,focus]');
    process.exit(64);
  }
  return args;
}

function loadConfig(): any {
  const p = resolve(import.meta.dirname, '..', 'web-scrub.config.json');
  if (!existsSync(p)) return {};
  return JSON.parse(readFileSync(p, 'utf8'));
}

function isoStamp(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}-${pad(d.getHours())}${pad(d.getMinutes())}`;
}

async function captureComputedStyles(page: Page, selector: string, props: string[]) {
  return await page.evaluate(
    ({ sel, props }) => {
      const el = document.querySelector(sel);
      if (!el) return null;
      const cs = window.getComputedStyle(el as Element);
      const out: Record<string, string> = {};
      for (const p of props) out[p] = cs.getPropertyValue(p);
      return out;
    },
    { sel: selector, props }
  );
}

async function captureDomSubtree(page: Page, selector: string) {
  return await page.evaluate((sel) => {
    const el = document.querySelector(sel);
    if (!el) return null;
    return (el as HTMLElement).outerHTML;
  }, selector);
}

async function captureBoundingBox(page: Page, selector: string) {
  const loc = page.locator(selector).first();
  return await loc.boundingBox();
}

async function applyStateAndCapture(page: Page, state: string, selector: string, outDir: string, props: string[]) {
  const loc = page.locator(selector).first();
  try {
    if (state === 'hover') await loc.hover({ timeout: 3000 });
    else if (state === 'focus') await loc.focus({ timeout: 3000 });
    else if (state === 'active') {
      const box = await loc.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
        await page.mouse.down();
      }
    } else if (state === 'disabled') {
      await loc.evaluate((el: HTMLElement) => el.setAttribute('disabled', 'true'));
    }
  } catch {
    /* state may not apply to this element — capture default visual anyway */
  }
  const styles = await captureComputedStyles(page, selector, props);
  const png = join(outDir, `state-${state}.png`);
  await loc.screenshot({ path: png });
  if (state === 'active') await page.mouse.up();
  return { state, styles, png };
}

async function main() {
  const args = parseArgs();
  const cfg = loadConfig();
  const stamp = isoStamp();
  const name = args.name || 'component';
  const baseOut = args.out || cfg.outputsRoot || 'C:\\Falcon\\Brain Outputs\\reports\\web-scrub';
  const outDir = join(baseOut, `${stamp}_deep-dive_${name}`);
  mkdirSync(outDir, { recursive: true });

  const states = (args.states ?? cfg.deepDive?.captureStates ?? ['default', 'hover', 'focus']).toString().split(',').map((s) => s.trim()).filter(Boolean);
  const props: string[] = cfg.deepDive?.captureComputedStyleProps ?? ['display', 'color', 'background-color', 'font-size', 'padding', 'margin', 'border', 'border-radius'];

  console.log('[deep-dive] target:', args.url, 'selector:', args.selector);
  console.log('[deep-dive] output:', outDir, 'states:', states);

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport: cfg.playwright?.viewport ?? { width: 1440, height: 900 },
    deviceScaleFactor: cfg.playwright?.deviceScaleFactor ?? 1,
    userAgent: cfg.playwright?.userAgent,
  });
  const page = await ctx.newPage();
  await page.goto(args.url, { waitUntil: 'load', timeout: 30000 });
  try {
    await page.waitForLoadState('networkidle', { timeout: 8000 });
  } catch {
    /* tolerate */
  }

  const dom = await captureDomSubtree(page, args.selector);
  if (!dom) {
    console.error('[deep-dive] FAIL — selector not found:', args.selector);
    await browser.close();
    process.exit(2);
  }
  writeFileSync(join(outDir, 'subtree.html'), dom, 'utf8');

  const box = await captureBoundingBox(page, args.selector);
  writeFileSync(join(outDir, 'box.json'), JSON.stringify(box, null, 2), 'utf8');

  const captures: Array<{ state: string; styles: Record<string, string> | null; png: string }> = [];
  for (const s of states) captures.push(await applyStateAndCapture(page, s, args.selector, outDir, props));

  await browser.close();

  writeFileSync(
    join(outDir, 'computed-styles.json'),
    JSON.stringify(
      captures.reduce<Record<string, any>>((acc, c) => {
        acc[c.state] = c.styles;
        return acc;
      }, {}),
      null,
      2
    ),
    'utf8'
  );

  const report = [
    `# Deep-Dive Report — ${name}`,
    ``,
    `- URL: ${args.url}`,
    `- Selector: \`${args.selector}\``,
    `- Stamp: ${stamp}`,
    `- BoundingBox: ${JSON.stringify(box)}`,
    `- States captured: ${captures.map((c) => c.state).join(', ')}`,
    ``,
    `## Output files`,
    `- subtree.html — outerHTML of matched element`,
    `- box.json — bounding box`,
    `- computed-styles.json — per-state computed CSS`,
    ...captures.map((c) => `- ${c.png.split(/[\\/]/).pop()}`),
    ``,
    `## Next step`,
    `Map this subtree to a Falcon component using:`,
    `  npm run react-map -- --component <ReactComponentName>`,
    ``,
  ].join('\n');
  writeFileSync(join(outDir, 'REPORT.md'), report, 'utf8');
  console.log('[deep-dive] DONE →', outDir);
}

main().catch((err) => {
  console.error('[deep-dive] CRASH', err);
  process.exit(1);
});
