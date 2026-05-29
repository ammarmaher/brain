import { chromium } from 'playwright';

async function main() {
  console.log('[playwright-smoke] launching chromium...');
  const browser = await chromium.launch({ headless: true });
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await ctx.newPage();
  await page.goto('about:blank');
  await page.setContent('<h1 id="hello">Falcon Web-Scrub smoke OK</h1>');
  const text = await page.locator('#hello').innerText();
  const box = await page.locator('#hello').boundingBox();
  await browser.close();
  if (text !== 'Falcon Web-Scrub smoke OK') {
    console.error('[playwright-smoke] FAIL — text mismatch:', text);
    process.exit(2);
  }
  console.log('[playwright-smoke] PASS — innerText="%s" boundingBox=%s', text, JSON.stringify(box));
}

main().catch((err) => {
  console.error('[playwright-smoke] CRASH', err);
  process.exit(1);
});
