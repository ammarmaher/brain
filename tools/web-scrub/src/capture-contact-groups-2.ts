// Wave-2 deep capture: advance the Client wizard through all 4 steps (fill fields),
// capture row actions + detail; capture Falcon read-only detail/download.
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

async function cap(page: Page, dir: string, label: string) {
  fs.mkdirSync(dir, { recursive: true });
  await page.screenshot({ path: path.join(dir, `${label}-full.png`), fullPage: true }).catch(() => {});
  const text = await page.evaluate(() => (document.body.innerText || '').split('\n').map((s) => s.trim()).filter(Boolean).join('\n')).catch(() => '');
  fs.writeFileSync(path.join(dir, `${label}-visible-text.txt`), text, 'utf8');
  const inter = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('button, a, input, select, textarea, [role="button"], [role="tab"], [role="switch"], [role="checkbox"]'));
    const out: any[] = [];
    for (const el of els) {
      const r = el.getBoundingClientRect();
      if (r.width <= 0 || r.height <= 0) continue;
      const he = el as HTMLElement;
      out.push({ tag: el.tagName.toLowerCase(), role: el.getAttribute('role'), type: el.getAttribute('type'), placeholder: el.getAttribute('placeholder'), ariaLabel: el.getAttribute('aria-label'), text: (he.innerText || '').trim().slice(0, 70), box: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) } });
    }
    return out;
  }).catch(() => []);
  fs.writeFileSync(path.join(dir, `${label}-interactive-map.json`), JSON.stringify(inter, null, 2), 'utf8');
}

async function click(page: Page, text: string, t = 2500): Promise<boolean> {
  for (const loc of [page.getByRole('button', { name: text, exact: true }), page.locator(`button:has-text("${text}")`), page.locator(`text="${text}"`)]) {
    try { await loc.first().click({ timeout: t }); return true; } catch {}
  }
  return false;
}

(async () => {
  const stamp = stampNow();
  const csv = 'C:\\Falcon\\Brain SK\\tools\\web-scrub\\storage\\sample-contacts.csv';
  fs.mkdirSync(path.dirname(csv), { recursive: true });
  fs.writeFileSync(csv, 'FirstName,LastName,Mobile,Email\nSara,Ahmad,966500000001,sara@t2.sa\nOmar,Hassan,966500000002,omar@t2.sa\nLeen,Ali,966500000003,leen@t2.sa\n');
  const browser = await chromium.launch();
  const log: string[] = [];

  // ---------- CLIENT (mgmt) full wizard ----------
  {
    const mode = 'client';
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const dir = path.join(OUT_ROOT, `${stamp}_contact-groups-${mode}-deep2`);
    log.push(`\n=== CLIENT deep2 -> ${dir} ===`);
    await page.goto(`${BASE}#contactGroups=${mode}`, { waitUntil: 'networkidle' }).catch((e) => log.push('goto ' + e.message));
    await page.waitForTimeout(1200);
    await click(page, 'Contact Groups');
    await page.waitForTimeout(2000);
    // row actions: click first Actions-cell button/kebab in the table area (x>1380)
    try {
      const acts = await page.locator('table button, [class*="action"] button, [aria-label*="action" i]').all();
      if (acts.length) { await acts[0].click({ timeout: 1500 }); await page.waitForTimeout(800); await cap(page, dir, 'row-actions-menu'); log.push('captured row-actions-menu'); await page.keyboard.press('Escape'); }
    } catch (e: any) { log.push('row-actions err ' + e.message); }
    await page.waitForTimeout(500);
    // open wizard
    const opened = await click(page, 'Create Contact Group');
    log.push('wizard opened: ' + opened);
    await page.waitForTimeout(1500);
    await cap(page, dir, 'wizard-1-upload');
    // fill group name
    let named = false;
    for (const ph of ['e.g. NewlyJoining (max 30 characters)', 'NewlyJoining']) {
      try { await page.getByPlaceholder(ph, { exact: false }).first().fill('QA Parity Group'); named = true; break; } catch {}
    }
    if (!named) { try { await page.locator('input[type="text"]').first().fill('QA Parity Group'); named = true; } catch {} }
    // reference id (2nd text input)
    try { await page.locator('input[type="text"]').nth(1).fill('REF-QA-001'); } catch {}
    // set file
    try { await page.setInputFiles('input[type="file"]', csv); log.push('file set'); } catch (e: any) { log.push('file set err ' + e.message); }
    await page.waitForTimeout(1200);
    await cap(page, dir, 'wizard-1-filled');
    log.push('named=' + named);
    // step through
    const labels = ['Preview & Map', 'Share', 'Review & Submit', 'Create', 'Submit'];
    for (let i = 2; i <= 5; i++) {
      const ok = (await click(page, 'Next', 1500)) || (await click(page, 'Continue', 1500));
      if (!ok) { log.push(`step ${i}: Next absent/blocked`); break; }
      await page.waitForTimeout(1600);
      await cap(page, dir, `wizard-${i}`);
      log.push(`captured wizard-${i}`);
    }
    await page.close();
  }

  // ---------- FALCON (admin) read-only detail ----------
  {
    const mode = 'falcon';
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const dir = path.join(OUT_ROOT, `${stamp}_contact-groups-${mode}-deep2`);
    log.push(`\n=== FALCON deep2 -> ${dir} ===`);
    await page.goto(`${BASE}#contactGroups=${mode}`, { waitUntil: 'networkidle' }).catch((e) => log.push('goto ' + e.message));
    await page.waitForTimeout(1200);
    await click(page, 'Contact Groups');
    await page.waitForTimeout(2000);
    await cap(page, dir, 'list');
    // click first data row to open detail
    try { await page.locator('table tbody tr').first().click({ timeout: 2000 }); await page.waitForTimeout(1800); await cap(page, dir, 'detail'); log.push('captured falcon detail'); } catch (e: any) { log.push('falcon row-click err ' + e.message); }
    // try row actions menu
    try { const a = await page.locator('table button, [aria-label*="action" i]').all(); if (a.length) { await a[0].click({ timeout: 1500 }); await page.waitForTimeout(700); await cap(page, dir, 'row-actions-menu'); log.push('captured falcon row-actions'); } } catch {}
    await page.close();
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT_ROOT, `${stamp}_contact-groups-deep2-LOG.txt`), log.join('\n'), 'utf8');
  console.log(log.join('\n'));
  console.log('\nSTAMP=' + stamp);
})();
