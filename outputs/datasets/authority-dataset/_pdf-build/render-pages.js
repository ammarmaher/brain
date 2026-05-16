// Render specific pages of a PDF to PNG via puppeteer for visual verification
const fs = require('fs');
const path = require('path');

async function main() {
  const pdfPath = process.argv[2];
  const outDir  = process.argv[3] || './preview';

  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const chromeRoot = path.join(process.env.USERPROFILE, '.cache', 'puppeteer', 'chrome');
  const versions = fs.readdirSync(chromeRoot).sort().reverse();
  const chromeExe = path.join(chromeRoot, versions[0], 'chrome-win64', 'chrome.exe');

  const puppeteer = require('puppeteer-core');
  const browser = await puppeteer.launch({
    executablePath: chromeExe,
    headless: 'new',
    args: ['--no-sandbox','--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  const fileUrl = 'file:///' + path.resolve(pdfPath).replace(/\\/g, '/');

  // Chrome can render PDFs in a viewer iframe — load it and screenshot the visible page
  await page.setViewport({ width: 1200, height: 1600, deviceScaleFactor: 1.5 });
  await page.goto(fileUrl, { waitUntil: 'load', timeout: 30000 });
  // Wait for PDF viewer to load
  await new Promise(r => setTimeout(r, 2000));

  const pages = [1, 4, 8]; // first, middle, last
  for (const p of pages) {
    const url = `${fileUrl}#page=${p}&zoom=fit`;
    await page.goto(url, { waitUntil: 'load', timeout: 30000 });
    await new Promise(r => setTimeout(r, 1500));
    const outFile = path.join(outDir, `page-${String(p).padStart(2,'0')}.png`);
    await page.screenshot({ path: outFile, fullPage: false });
    const stat = fs.statSync(outFile);
    console.log(`[render] page ${p} -> ${outFile} (${stat.size.toLocaleString()} bytes)`);
  }

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
