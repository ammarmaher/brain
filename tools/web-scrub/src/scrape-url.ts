import { chromium, type Page } from 'playwright';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { readFileSync, existsSync } from 'node:fs';

type CliArgs = { url: string; out?: string; name?: string; viewport?: string; clicks: string[]; waitMs?: number };

function parseArgs(): CliArgs {
  const argv = process.argv.slice(2);
  const args: CliArgs = { url: '', clicks: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === '--url') args.url = argv[++i];
    else if (a === '--out') args.out = argv[++i];
    else if (a === '--name') args.name = argv[++i];
    else if (a === '--viewport') args.viewport = argv[++i];
    else if (a === '--click' || a === '--clickText' || a === '--clickSelector') args.clicks.push(argv[++i]);
    else if (a === '--bearer') (args as any).bearer = argv[++i];
    else if (a === '--refresh') (args as any).refresh = argv[++i];
    else if (a === '--waitMs') args.waitMs = parseInt(argv[++i], 10);
    else if (!args.url && /^https?:\/\//i.test(a)) args.url = a;
  }
  if (!args.url) {
    console.error('usage: tsx src/scrape-url.ts --url <url> [--name <slug>] [--out <dir>] [--viewport 1440x900] [--click "text=<label>"]... [--waitMs 1500]');
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

function slugFromUrl(u: string): string {
  try {
    const x = new URL(u);
    return `${x.hostname}${x.pathname}`.replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase().slice(0, 80);
  } catch {
    return 'unknown';
  }
}

function parseViewport(s: string | undefined, def: { width: number; height: number }) {
  if (!s) return def;
  const m = /(\d+)\s*x\s*(\d+)/i.exec(s);
  if (!m) return def;
  return { width: parseInt(m[1], 10), height: parseInt(m[2], 10) };
}

async function captureAll(page: Page, outDir: string, url: string, opts: { clicks: string[]; waitMs?: number }) {
  /*** SPA-tolerant: 'load' never fires when a persistent SignalR/websocket is open,
       so use 'domcontentloaded' + a bounded networkidle wait. ***/
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 });
  try {
    await page.waitForLoadState('networkidle', { timeout: 8000 });
  } catch {
    /* tolerate keepalive / long-lived sockets */
  }
  for (const step of opts.clicks) {
    console.log('[scrape-url] click step:', JSON.stringify(step));
    try {
      if (step.startsWith('text=')) {
        await page.getByText(step.slice(5), { exact: false }).last().click({ timeout: 8000, force: true });
      } else {
        await page.locator(step).first().click({ timeout: 8000, force: true });
      }
    } catch (e) {
      /*** Fallback: deep shadow-DOM-piercing click via JS for Stencil sidebar nav.
           NOTE: passed as a STRING (not a function) so tsx/esbuild's keepNames
           transform never wraps it with the `__name` helper — that helper is
           undefined in the page context and would throw `__name is not defined`.
           The other two page.evaluate calls below already use string form. ***/
      const needle = step.startsWith('text=') ? step.slice(5) : step;
      const clicked = await page.evaluate(`
        (function() {
          var txt = ${JSON.stringify(needle)};
          var matches = [];
          function walk(root) {
            var els = root.querySelectorAll('*');
            for (var i = 0; i < els.length; i++) {
              var he = els[i];
              if ((he.innerText || he.textContent || '').trim().indexOf(txt) !== -1) matches.push(he);
              if (he.shadowRoot) walk(he.shadowRoot);
            }
          }
          walk(document);
          if (!matches.length) return false;
          /* Prefer a clickable-tag match; else the deepest leaf text match
             (org-tree nodes are <div>s with framework (click) handlers, not <a>/<button>). */
          var target = null;
          for (var i = 0; i < matches.length; i++) {
            var he = matches[i];
            if (he.tagName === 'A' || he.tagName === 'BUTTON' || he.getAttribute('role') === 'menuitem' ||
                he.getAttribute('role') === 'treeitem' || he.onclick) { target = he; break; }
          }
          if (!target) {
            for (var i = 0; i < matches.length; i++) {
              var m = matches[i], hasInner = false;
              for (var j = 0; j < matches.length; j++) { if (i !== j && m.contains(matches[j])) { hasInner = true; break; } }
              if (!hasInner) { target = m; break; }
            }
          }
          if (!target) target = matches[matches.length - 1];
          try { target.scrollIntoView({ block: 'center' }); } catch (e) {}
          try { target.click(); } catch (e) {}
          try { target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window })); } catch (e) {}
          return true;
        })()
      `);
      console.log('[scrape-url] JS-fallback click for', JSON.stringify(needle), '→', clicked);
    }
    await page.waitForTimeout(opts.waitMs ?? 1500);
  }

  const fullPng = join(outDir, 'screenshot-full.png');
  const viewportPng = join(outDir, 'screenshot-viewport.png');
  await page.screenshot({ path: fullPng, fullPage: true });
  await page.screenshot({ path: viewportPng, fullPage: false });

  const html = await page.content();
  writeFileSync(join(outDir, 'dom.html'), html, 'utf8');

  const visibleText = await page.evaluate(`
    (function() {
      var acc = [];
      var stack = [document.body];
      while (stack.length) {
        var node = stack.pop();
        if (!node) continue;
        if (node.nodeType === 3) {
          var t = (node.textContent || '').trim();
          if (t) acc.push(t);
        } else if (node.nodeType === 1) {
          var el = node;
          var tag = el.tagName.toLowerCase();
          if (tag === 'script' || tag === 'style' || tag === 'noscript' || tag === 'svg' || tag === 'template') continue;
          var style = window.getComputedStyle(el);
          if (style.visibility === 'hidden' || style.display === 'none') continue;
          var kids = el.childNodes;
          for (var i = kids.length - 1; i >= 0; i--) stack.push(kids[i]);
        }
      }
      return acc;
    })()
  `) as string[];
  writeFileSync(join(outDir, 'visible-text.txt'), visibleText.join('\n'), 'utf8');

  const interactiveMap = await page.evaluate(`
    (function() {
      var sel = 'a,button,input,select,textarea,[role="button"],[role="tab"],[role="menuitem"],[contenteditable="true"]';
      var nodes = document.querySelectorAll(sel);
      var out = [];
      var max = Math.min(nodes.length, 500);
      for (var i = 0; i < max; i++) {
        var e = nodes[i];
        var r = e.getBoundingClientRect();
        out.push({
          tag: e.tagName.toLowerCase(),
          role: e.getAttribute('role'),
          type: e.getAttribute('type'),
          id: e.id || null,
          name: e.getAttribute('name'),
          ariaLabel: e.getAttribute('aria-label'),
          text: (e.innerText || '').trim().slice(0, 80),
          box: { x: r.x, y: r.y, w: r.width, h: r.height }
        });
      }
      return out;
    })()
  `) as any[];
  writeFileSync(join(outDir, 'interactive-map.json'), JSON.stringify(interactiveMap, null, 2), 'utf8');

  const networkLog: Array<{ url: string; method: string; status: number; type: string }> = [];
  return { fullPng, viewportPng, visibleTextCount: visibleText.length, interactiveCount: interactiveMap.length, networkLog };
}

async function main() {
  const args = parseArgs();
  const cfg = loadConfig();
  const stamp = isoStamp();
  const name = args.name || slugFromUrl(args.url);
  const baseOut = args.out || cfg.outputsRoot || 'C:\\Falcon\\Brain Outputs\\reports\\web-scrub';
  const outDir = join(baseOut, `${stamp}_${name}`);
  mkdirSync(outDir, { recursive: true });

  const viewport = parseViewport(args.viewport, cfg.playwright?.viewport ?? { width: 1440, height: 900 });

  console.log('[scrape-url] target:', args.url);
  console.log('[scrape-url] output:', outDir);
  console.log('[scrape-url] viewport:', viewport);

  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({
    viewport,
    deviceScaleFactor: cfg.playwright?.deviceScaleFactor ?? 1,
    userAgent: cfg.playwright?.userAgent,
  });
  /*** Authenticated capture: inject a real JWT into sessionStorage BEFORE app boot,
       matching TokenStorageService keys ('access_token' / 'refresh_token'). ***/
  const bearer = (args as any).bearer as string | undefined;
  const refresh = (args as any).refresh as string | undefined;
  if (bearer) {
    console.log('[scrape-url] injecting bearer token into sessionStorage (authenticated capture)');
    await ctx.addInitScript(
      ({ at, rt }: { at: string; rt: string | null }) => {
        try {
          sessionStorage.setItem('access_token', at);
          if (rt) sessionStorage.setItem('refresh_token', rt);
        } catch { /* noop */ }
      },
      { at: bearer, rt: refresh ?? null },
    );
  }

  const page = await ctx.newPage();

  /*** Capture console + page errors for FE render diagnosis. ***/
  const consoleLogs: Array<{ type: string; text: string }> = [];
  page.on('console', (msg) => consoleLogs.push({ type: msg.type(), text: msg.text().slice(0, 300) }));
  page.on('pageerror', (err) => consoleLogs.push({ type: 'pageerror', text: String(err).slice(0, 400) }));

  const network: Array<{ url: string; method: string; status: number; type: string }> = [];
  page.on('response', (resp) => {
    const req = resp.request();
    network.push({ url: req.url(), method: req.method(), status: resp.status(), type: req.resourceType() });
  });

  let result: any;
  try {
    result = await captureAll(page, outDir, args.url, { clicks: args.clicks, waitMs: args.waitMs });
  } finally {
    writeFileSync(join(outDir, 'network.json'), JSON.stringify(network, null, 2), 'utf8');
    writeFileSync(join(outDir, 'console.json'), JSON.stringify(consoleLogs, null, 2), 'utf8');
    await browser.close();
  }

  const report = [
    `# Scrape Report — ${name}`,
    ``,
    `- URL: ${args.url}`,
    `- Stamp: ${stamp}`,
    `- Viewport: ${viewport.width}x${viewport.height}`,
    `- Visible text lines: ${result.visibleTextCount}`,
    `- Interactive elements: ${result.interactiveCount}`,
    `- Network requests: ${network.length}`,
    ``,
    `## Output files`,
    `- screenshot-full.png`,
    `- screenshot-viewport.png`,
    `- dom.html`,
    `- visible-text.txt`,
    `- interactive-map.json`,
    `- network.json`,
    ``,
  ].join('\n');
  writeFileSync(join(outDir, 'REPORT.md'), report, 'utf8');
  console.log('[scrape-url] DONE →', outDir);
}

main().catch((err) => {
  console.error('[scrape-url] CRASH', err);
  process.exit(1);
});
