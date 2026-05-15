/*** Build TASK_REPORT.pdf from TASK_REPORT_FINAL.md via marked + Chrome headless ***/

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const MARKED = require('C:/Falcon/Falcon/falcon-web-platform-ui/node_modules/marked');
const SKILL_THEME = 'C:/Users/User/.claude/skills/pdf-creator/themes/falcon-audit-v3.css';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const REPORT_DIR = __dirname;
const MD = path.join(REPORT_DIR, 'TASK_REPORT_FINAL.md');
const HTML = path.join(REPORT_DIR, 'TASK_REPORT.html');
const PDF_LOCAL = path.join(REPORT_DIR, 'TASK_REPORT.pdf');
const PDF_FALCON_SPECS = 'C:\\Falcon\\Falcon Specs v1.1 - Organization Hierarchy Visual Repair.pdf';

/*** Convert local image paths to file:// URLs Chrome can load ***/
function rewriteImagePaths(md, baseDir) {
  return md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (match, alt, src) => {
    if (/^(https?:|file:|data:)/i.test(src)) return match;
    const abs = path.resolve(baseDir, src).replace(/\\/g, '/');
    return `![${alt}](file:///${abs})`;
  });
}

const md = fs.readFileSync(MD, 'utf8');
const mdRewritten = rewriteImagePaths(md, REPORT_DIR);
const body = MARKED.parse(mdRewritten);

const theme = fs.readFileSync(SKILL_THEME, 'utf8');

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Falcon Specs v1.1 — Organization Hierarchy Visual Repair</title>
<style>
${theme}

/*** Tweaks for Chrome --print-to-pdf rendering ***/
@page {
  size: A4;
  margin: 18mm 16mm 18mm 16mm;
}
html, body { background: #ffffff; }
img { max-width: 100%; height: auto; page-break-inside: avoid; border: 1px solid #e0e6ed; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
table { page-break-inside: auto; }
tr { page-break-inside: avoid; page-break-after: auto; }
h1, h2, h3 { page-break-after: avoid; }
pre { page-break-inside: avoid; }
</style>
</head>
<body>
<article class="report">
${body}
</article>
</body>
</html>`;

fs.writeFileSync(HTML, html, 'utf8');
console.log('HTML written:', HTML, '(', html.length, 'bytes)');

/*** Invoke Chrome headless to print PDF ***/
const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--no-margins',
  '--print-to-pdf=' + PDF_LOCAL,
  '--virtual-time-budget=5000',
  'file:///' + HTML.replace(/\\/g, '/'),
];

console.log('Invoking Chrome headless ...');
try {
  execFileSync(CHROME, args, { stdio: 'inherit', timeout: 90000 });
} catch (e) {
  console.error('Chrome failed:', e.message);
  process.exit(1);
}

if (!fs.existsSync(PDF_LOCAL)) {
  console.error('PDF not produced at', PDF_LOCAL);
  process.exit(2);
}

const size = fs.statSync(PDF_LOCAL).size;
console.log('PDF written:', PDF_LOCAL, '(', size, 'bytes )');

fs.copyFileSync(PDF_LOCAL, PDF_FALCON_SPECS);
console.log('PDF copied:', PDF_FALCON_SPECS);
