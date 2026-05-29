// Wave-1 capture: drive the React SoT reference into Contact Groups (both modes)
// and step into the Add wizard. Click-driven because the hash does not deep-link on load.
import { chromium, Page } from 'playwright';
import * as fs from 'node:fs';
import * as path from 'node:path';

const BASE = 'http://127.0.0.1:5173/T2%20Falcon%20Admin.html';
const OUT_ROOT = 'C:\\Falcon\\Brain Outputs\\reports\\web-scrub';

function stampNow(): string {
  const d = new Date();
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}-${p(d.getHours())}${p(d.getMinutes())}`;
}

async function captureState(page: Page, dir: string, label: string) {
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${label}-full.png`), fullPage: true }).catch(() => {});
  const text = await page.evaluate(() =>
    (document.body.innerText || '').split('\n').map((s) => s.trim()).filter(Boolean).join('\n')
  );
  fs.writeFileSync(path.join(dir, `${label}-visible-text.txt`), text, 'utf8');
  const interactive = await page.evaluate(() => {
    const els = Array.from(
      document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="tab"], [role="dialog"] *')
    );
    const seen = new Set<string>();
    const out: any[] = [];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) continue;
      const he = el as HTMLElement;
      const rec = {
        tag: el.tagName.toLowerCase(),
        role: el.getAttribute('role'),
        type: el.getAttribute('type'),
        placeholder: el.getAttribute('placeholder'),
        ariaLabel: el.getAttribute('aria-label'),
        text: (he.innerText || '').trim().slice(0, 70),
        box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
      };
      const key = `${rec.tag}|${rec.text}|${rec.box.x},${rec.box.y}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(rec);
    }
    return out;
  });
  fs.writeFileSync(path.join(dir, `${label}-interactive-map.json`), JSON.stringify(interactive, null, 2), 'utf8');
  const html = await page.evaluate(() => {
    const main = document.querySelector('main') || document.querySelector('[class*="content"]') || document.body;
    return (main as HTMLElement).outerHTML;
  });
  fs.writeFileSync(path.join(dir, `${label}-content.html`), html, 'utf8');
  return { text, interactive };
}

async function clickByText(page: Page, text: string, timeout = 4000): Promise<boolean> {
  try {
    await page.getByRole('button', { name: text, exact: true }).first().click({ timeout });
    return true;
  } catch {}
  try {
    await page.locator(`button:has-text("${text}")`).first().click({ timeout: 1500 });
    return true;
  } catch {}
  try {
    await page.locator(`text="${text}"`).first().click({ timeout: 1500 });
    return true;
  } catch {}
  return false;
}

(async () => {
  const stamp = stampNow();
  const browser = await chromium.launch();
  const log: string[] = [];
  for (const mode of ['falcon', 'client']) {
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const dir = path.join(OUT_ROOT, `${stamp}_contact-groups-${mode}-deep`);
    log.push(`\n=== MODE ${mode} -> ${dir} ===`);
    await page.goto(`${BASE}#contactGroups=${mode}`, { waitUntil: 'networkidle' }).catch((e) => log.push('goto err ' + e.message));
    await page.waitForTimeout(1500);
    let clicked = await clickByText(page, 'Contact Groups');
    if (!clicked) {
      try { await page.mouse.click(112, 177); clicked = true; log.push('coord-click fallback'); } catch {}
    }
    log.push('contact-groups nav click: ' + clicked + ' | url=' + page.url());
    await page.waitForTimeout(2500);
    const listState = await captureState(page, dir, 'list');
    log.push('list interactive count: ' + listState.interactive.length);
    log.push('list buttons: ' + listState.interactive.filter((e) => e.tag === 'button' && e.text).map((e) => e.text).join(' | '));
    log.push('list tabs: ' + listState.interactive.filter((e) => e.role === 'tab').map((e) => e.text).join(' | '));
    // attempt to open the Add / Create wizard
    const addLabels = ['Add Contact Group', 'Create Contact Group', 'New Contact Group', 'Add Group', 'Create Group', '+ Add', 'Add', 'Create', 'Upload', 'New'];
    let opened = '';
    for (const lbl of addLabels) {
      const ok = await clickByText(page, lbl, 1200);
      if (ok) {
        await page.waitForTimeout(2000);
        await captureState(page, dir, 'wizard-step1');
        opened = lbl;
        log.push(`opened Add via "${lbl}"`);
        for (let step = 2; step <= 6; step++) {
          const next = (await clickByText(page, 'Next', 1000)) || (await clickByText(page, 'Continue', 1000));
          if (!next) { log.push(`step ${step} Next blocked/absent (expected if validation gates)`); break; }
          await page.waitForTimeout(1200);
          await captureState(page, dir, `wizard-step${step}`);
          log.push(`advanced to wizard step ${step}`);
        }
        break;
      }
    }
    if (!opened) log.push('NO Add/Create button found (expected for falcon read-only mode)');
    await page.close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT_ROOT, `${stamp}_contact-groups-CAPTURE-LOG.txt`), log.join('\n'), 'utf8');
  console.log(log.join('\n'));
  console.log('\nSTAMP=' + stamp);
})();
