/*** Build TASK_REPORT_R4.pdf — Round 4 variant. Reuses pdf-creator theme + Chrome headless. ***/

const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const MARKED = require('C:/Falcon/Falcon/falcon-web-platform-ui/node_modules/marked');
const SKILL_THEME = 'C:/Users/User/.claude/skills/pdf-creator/themes/falcon-audit-v3.css';
const CHROME = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const REPORT_DIR = __dirname;
const MD = path.join(REPORT_DIR, 'TASK_REPORT_R4.md');
const HTML = path.join(REPORT_DIR, 'TASK_REPORT_R4.html');
const PDF_LOCAL = path.join(REPORT_DIR, 'TASK_REPORT_R4.pdf');
const PDF_FALCON_SPECS = 'C:\\Falcon\\Falcon Specs v1.3 - Organization Hierarchy Visual Repair.pdf';

function rewriteImagePaths(md, baseDir) {
  return md.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (m, alt, src) => {
    if (/^(https?:|file:|data:)/i.test(src)) return m;
    const abs = path.resolve(baseDir, src).replace(/\\/g, '/');
    return `![${alt}](file:///${abs})`;
  });
}

const md = fs.readFileSync(MD, 'utf8');
const body = MARKED.parse(rewriteImagePaths(md, REPORT_DIR));
const theme = fs.existsSync(SKILL_THEME) ? fs.readFileSync(SKILL_THEME, 'utf8') : '';

const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Falcon Specs v1.3 — Organization Hierarchy Visual Repair</title>
<style>
${theme}
@page { size: A4; margin: 18mm 16mm 18mm 16mm; }
html, body { background: #ffffff; }
img { max-width: 100%; height: auto; page-break-inside: avoid; border: 1px solid #e0e6ed; border-radius: 4px; box-shadow: 0 1px 3px rgba(0,0,0,0.06); }
table { page-break-inside: auto; }
tr { page-break-inside: avoid; page-break-after: auto; }
h1, h2, h3 { page-break-after: avoid; }
pre { page-break-inside: avoid; }
</style>
</head>
<body><article class="report">${body}</article></body>
</html>`;

fs.writeFileSync(HTML, html, 'utf8');
console.log('HTML written:', HTML, '(', html.length, 'bytes )');

const args = [
  '--headless=new',
  '--disable-gpu',
  '--no-pdf-header-footer',
  '--no-margins',
  '--print-to-pdf=' + PDF_LOCAL,
  '--virtual-time-budget=5000',
  'file:///' + HTML.replace(/\\/g, '/'),
];

try {
  execFileSync(CHROME, args, { stdio: 'inherit', timeout: 90000 });
} catch (e) {
  console.error('Chrome failed:', e.message);
  process.exit(1);
}

if (!fs.existsSync(PDF_LOCAL)) { console.error('PDF not produced'); process.exit(2); }
console.log('PDF written:', PDF_LOCAL, '(', fs.statSync(PDF_LOCAL).size, 'bytes )');

fs.copyFileSync(PDF_LOCAL, PDF_FALCON_SPECS);
console.log('PDF copied:', PDF_FALCON_SPECS);
