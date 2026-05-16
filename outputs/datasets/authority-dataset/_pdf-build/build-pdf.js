#!/usr/bin/env node
// *** build-pdf.js — Falcon Authority Knowledge PDF builder ***
// MD → HTML (marked) → Chrome --print-to-pdf via puppeteer-core
// Uses pre-cached Chromium at C:\Users\User\.cache\puppeteer\chrome\win64-148.0.7778.97\chrome-win64\chrome.exe

const fs = require('fs');
const path = require('path');

async function main() {
  const mdPath  = process.argv[2] || 'KNOWLEDGE-DUMP.build.md';
  const cssPath = process.argv[3] || 'falcon-knowledge.css';
  const outPath = process.argv[4] || 'output.pdf';

  console.log(`[build-pdf] reading ${mdPath}`);
  const md = fs.readFileSync(mdPath, 'utf8');

  console.log(`[build-pdf] reading ${cssPath}`);
  const css = fs.readFileSync(cssPath, 'utf8');

  console.log(`[build-pdf] converting markdown -> html via marked`);
  const { marked } = require('marked');
  marked.setOptions({ gfm: true, breaks: false });
  const bodyHtml = marked.parse(md);

  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Falcon Authority Knowledge</title>
<style>${css}</style>
</head>
<body>
${bodyHtml}
</body>
</html>`;

  // Write the intermediate HTML next to the output for inspection
  const htmlPath = outPath.replace(/\.pdf$/i, '.html');
  fs.writeFileSync(htmlPath, html, 'utf8');
  console.log(`[build-pdf] intermediate html: ${htmlPath} (${html.length} chars)`);

  // Locate cached Chrome
  const chromeRoot = path.join(process.env.USERPROFILE, '.cache', 'puppeteer', 'chrome');
  const versions = fs.readdirSync(chromeRoot).sort().reverse();
  if (versions.length === 0) throw new Error(`No Chrome found in ${chromeRoot}`);
  const chromeExe = path.join(chromeRoot, versions[0], 'chrome-win64', 'chrome.exe');
  if (!fs.existsSync(chromeExe)) throw new Error(`chrome.exe missing: ${chromeExe}`);
  console.log(`[build-pdf] using chrome at: ${chromeExe}`);

  console.log(`[build-pdf] launching puppeteer-core...`);
  const puppeteer = require('puppeteer-core');
  const browser = await puppeteer.launch({
    executablePath: chromeExe,
    headless: 'new',
    args: ['--no-sandbox', '--disable-dev-shm-usage', '--font-render-hinting=none'],
  });

  const page = await browser.newPage();
  await page.emulateMediaType('print');

  console.log(`[build-pdf] loading html...`);
  const fileUrl = 'file:///' + htmlPath.replace(/\\/g, '/');
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 60000 });

  console.log(`[build-pdf] rendering pdf...`);
  await page.pdf({
    path: outPath,
    format: 'A4',
    printBackground: true,
    displayHeaderFooter: false,
    margin: { top: '22mm', bottom: '22mm', left: '18mm', right: '18mm' },
    preferCSSPageSize: true,
  });

  await browser.close();

  const stats = fs.statSync(outPath);
  console.log(`[build-pdf] ✓ PDF written: ${outPath} (${stats.size.toLocaleString()} bytes)`);
}

main().catch(err => {
  console.error('[build-pdf] FAIL:', err && err.stack || err);
  process.exit(1);
});
