#!/usr/bin/env node
// One-shot MD → HTML converter for Falcon Knowledge Graph Final Report.
// Self-contained (no npm deps). Generates TOC from headings. A4-styled output.

const fs = require('fs');
const path = require('path');

if (process.argv.length < 4) {
  console.error('Usage: node md-to-html.js <input.md> <output.html>');
  process.exit(1);
}

const inFile = process.argv[2];
const outFile = process.argv[3];
const md = fs.readFileSync(inFile, 'utf8');

// -------- Helpers --------
function esc(s) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function slug(s) {
  return s
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
}

// -------- Inline pass --------
function inline(s) {
  // Code first to protect contents
  s = s.replace(/`([^`]+)`/g, (_, c) => `<code>${esc(c)}</code>`);
  // Bold
  s = s.replace(/\*\*([^*\n]+)\*\*/g, '<strong>$1</strong>');
  s = s.replace(/__([^_\n]+)__/g, '<strong>$1</strong>');
  // Italic
  s = s.replace(/(?<!\*)\*([^*\n]+)\*(?!\*)/g, '<em>$1</em>');
  // Wikilinks [[target|alt]] or [[target]]
  s = s.replace(/\[\[([^\]|]+)(?:\|([^\]]+))?\]\]/g, (_, t, alt) => {
    const label = alt || t.replace(/^.*\//, '');
    return `<a class="wikilink" href="#">${esc(label)}</a>`;
  });
  // Auto-emoji safe-pass (already in)
  return s;
}

// -------- Block pass --------
const lines = md.split(/\r?\n/);
const out = [];
const toc = [];
let i = 0;

function flushParagraph(buf) {
  if (buf.length === 0) return;
  out.push(`<p>${inline(buf.join(' '))}</p>`);
}

function parseTable(startIdx) {
  // Header row at startIdx; separator at startIdx+1; rows after
  const headerLine = lines[startIdx];
  const sepLine = lines[startIdx + 1];
  if (!sepLine || !/^\s*\|?[\s:-]+\|/.test(sepLine)) return null;
  const headers = headerLine.split('|').slice(1, -1).map(c => c.trim());
  let j = startIdx + 2;
  const rows = [];
  while (j < lines.length && /^\s*\|.*\|/.test(lines[j])) {
    const row = lines[j].split('|').slice(1, -1).map(c => c.trim());
    rows.push(row);
    j++;
  }
  // Detect alignment from separator
  const aligns = sepLine.split('|').slice(1, -1).map(s => {
    s = s.trim();
    if (/^:.*:$/.test(s)) return 'center';
    if (/:$/.test(s)) return 'right';
    return 'left';
  });
  let html = '<table>\n<thead>\n<tr>';
  headers.forEach((h, k) => {
    html += `<th style="text-align:${aligns[k] || 'left'}">${inline(h)}</th>`;
  });
  html += '</tr>\n</thead>\n<tbody>\n';
  rows.forEach(r => {
    html += '<tr>';
    r.forEach((c, k) => {
      html += `<td style="text-align:${aligns[k] || 'left'}">${inline(c)}</td>`;
    });
    html += '</tr>\n';
  });
  html += '</tbody>\n</table>';
  return { html, next: j };
}

let paraBuf = [];

while (i < lines.length) {
  const line = lines[i];

  // Code fence
  if (/^```/.test(line)) {
    flushParagraph(paraBuf);
    paraBuf = [];
    const codeLines = [];
    i++;
    while (i < lines.length && !/^```/.test(lines[i])) {
      codeLines.push(lines[i]);
      i++;
    }
    out.push(`<pre><code>${esc(codeLines.join('\n'))}</code></pre>`);
    i++;
    continue;
  }

  // Horizontal rule
  if (/^---+\s*$/.test(line) || /^\*\*\*+\s*$/.test(line)) {
    flushParagraph(paraBuf);
    paraBuf = [];
    out.push('<hr/>');
    i++;
    continue;
  }

  // Headings
  const hMatch = /^(#{1,6})\s+(.+)$/.exec(line);
  if (hMatch) {
    flushParagraph(paraBuf);
    paraBuf = [];
    const lvl = hMatch[1].length;
    const text = hMatch[2].replace(/\s+#+\s*$/, '').trim();
    const id = slug(text);
    out.push(`<h${lvl} id="${id}">${inline(text)}</h${lvl}>`);
    if (lvl <= 3) toc.push({ lvl, text, id });
    i++;
    continue;
  }

  // Blockquote / callout
  if (/^>\s*/.test(line)) {
    flushParagraph(paraBuf);
    paraBuf = [];
    const bqLines = [];
    let calloutType = null;
    while (i < lines.length && /^>\s*/.test(lines[i])) {
      const stripped = lines[i].replace(/^>\s?/, '');
      const calloutMatch = /^\[!(\w+)\]\s*(.*)/i.exec(stripped);
      if (calloutMatch && bqLines.length === 0) {
        calloutType = calloutMatch[1].toLowerCase();
        if (calloutMatch[2]) bqLines.push(calloutMatch[2]);
      } else {
        bqLines.push(stripped);
      }
      i++;
    }
    const inner = bqLines.length ? inline(bqLines.join(' ')) : '';
    if (calloutType) {
      out.push(`<div class="callout callout-${calloutType}"><div class="callout-title">${calloutType.toUpperCase()}</div><div class="callout-body">${inner}</div></div>`);
    } else {
      out.push(`<blockquote>${inner}</blockquote>`);
    }
    continue;
  }

  // Table
  if (/^\s*\|.*\|\s*$/.test(line)) {
    const t = parseTable(i);
    if (t) {
      flushParagraph(paraBuf);
      paraBuf = [];
      out.push(t.html);
      i = t.next;
      continue;
    }
  }

  // Unordered list
  if (/^\s*[-*+]\s+/.test(line)) {
    flushParagraph(paraBuf);
    paraBuf = [];
    const items = [];
    while (i < lines.length && /^\s*[-*+]\s+/.test(lines[i])) {
      items.push(lines[i].replace(/^\s*[-*+]\s+/, ''));
      i++;
    }
    out.push('<ul>' + items.map(it => `<li>${inline(it)}</li>`).join('') + '</ul>');
    continue;
  }

  // Ordered list
  if (/^\s*\d+\.\s+/.test(line)) {
    flushParagraph(paraBuf);
    paraBuf = [];
    const items = [];
    while (i < lines.length && /^\s*\d+\.\s+/.test(lines[i])) {
      items.push(lines[i].replace(/^\s*\d+\.\s+/, ''));
      i++;
    }
    out.push('<ol>' + items.map(it => `<li>${inline(it)}</li>`).join('') + '</ol>');
    continue;
  }

  // Empty line → paragraph break
  if (line.trim() === '') {
    flushParagraph(paraBuf);
    paraBuf = [];
    i++;
    continue;
  }

  // Default: accumulate as paragraph
  paraBuf.push(line);
  i++;
}
flushParagraph(paraBuf);

// -------- Build TOC --------
let tocHtml = '<nav class="toc"><h2>Table of Contents</h2><ol>';
let lastLvl = 1;
toc.forEach(t => {
  while (lastLvl < t.lvl) { tocHtml += '<ol>'; lastLvl++; }
  while (lastLvl > t.lvl) { tocHtml += '</ol>'; lastLvl--; }
  tocHtml += `<li><a href="#${t.id}">${esc(t.text)}</a></li>`;
});
while (lastLvl > 1) { tocHtml += '</ol>'; lastLvl--; }
tocHtml += '</ol></nav>';

// -------- HTML wrapper with print styles --------
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8"/>
<title>Falcon Knowledge Graph — Final Report</title>
<style>
@page { size: A4; margin: 20mm 18mm; }
* { box-sizing: border-box; }
html, body { margin: 0; padding: 0; }
body {
  font-family: 'Segoe UI', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
  font-size: 10.5pt;
  line-height: 1.5;
  color: #1a1a1a;
  max-width: 100%;
}
.container { padding: 0; }

h1 { font-size: 22pt; margin: 0 0 6mm; color: #0d3f44; border-bottom: 2px solid #0d3f44; padding-bottom: 3mm; page-break-after: avoid; }
h2 { font-size: 15pt; margin: 8mm 0 3mm; color: #0d3f44; border-bottom: 1px solid #d0d7de; padding-bottom: 1.5mm; page-break-after: avoid; }
h3 { font-size: 12pt; margin: 5mm 0 2mm; color: #1f4f56; page-break-after: avoid; }
h4 { font-size: 10.5pt; margin: 3mm 0 1.5mm; color: #1f4f56; font-weight: 600; page-break-after: avoid; }

p { margin: 0 0 2.5mm; orphans: 3; widows: 3; }
ul, ol { margin: 1mm 0 3mm 6mm; padding: 0; }
li { margin-bottom: 0.8mm; }

code {
  font-family: 'Cascadia Mono', 'Consolas', 'Courier New', monospace;
  font-size: 9pt;
  background: #f4f6f8;
  padding: 0.4mm 1mm;
  border-radius: 1mm;
  color: #b8244a;
}
pre {
  background: #f4f6f8;
  border: 1px solid #e3e8ec;
  border-radius: 2mm;
  padding: 3mm;
  font-size: 8.5pt;
  line-height: 1.4;
  overflow-x: auto;
  page-break-inside: avoid;
  margin: 2mm 0;
}
pre code { background: none; padding: 0; color: #1a1a1a; }

table {
  border-collapse: collapse;
  width: 100%;
  margin: 2mm 0 4mm;
  font-size: 9pt;
  page-break-inside: avoid;
  table-layout: fixed;
}
th, td {
  border: 1px solid #d0d7de;
  padding: 1.4mm 2mm;
  text-align: left;
  vertical-align: top;
  word-break: break-word;
}
th { background: #eef3f5; color: #0d3f44; font-weight: 600; }
tbody tr:nth-child(even) { background: #fafbfc; }

blockquote {
  border-left: 3px solid #0d3f44;
  margin: 2mm 0;
  padding: 1mm 4mm;
  background: #f7faf9;
  color: #2c2c2c;
  page-break-inside: avoid;
}

.callout {
  border: 1px solid #d0d7de;
  border-left: 4px solid #0d3f44;
  border-radius: 2mm;
  padding: 2mm 3mm;
  margin: 2.5mm 0;
  background: #f7faf9;
  page-break-inside: avoid;
}
.callout-title { font-weight: 700; color: #0d3f44; margin-bottom: 1mm; font-size: 9pt; letter-spacing: 0.3pt; }
.callout-body { font-size: 10pt; }
.callout-warning { border-left-color: #d97706; background: #fffbeb; }
.callout-warning .callout-title { color: #92400e; }
.callout-info { border-left-color: #2563eb; background: #eff6ff; }
.callout-info .callout-title { color: #1e3a8a; }
.callout-tldr, .callout-summary { border-left-color: #16a34a; background: #f0fdf4; }
.callout-tldr .callout-title, .callout-summary .callout-title { color: #14532d; }
.callout-note { border-left-color: #6366f1; background: #f5f3ff; }
.callout-note .callout-title { color: #3730a3; }

a, a.wikilink { color: #0d3f44; text-decoration: none; border-bottom: 1px dotted #0d3f44; }

hr { border: 0; border-top: 1px solid #d0d7de; margin: 6mm 0; }

strong { color: #0d3f44; }

.toc {
  page-break-after: always;
  background: #f7faf9;
  border: 1px solid #d0d7de;
  border-radius: 2mm;
  padding: 5mm;
  margin-bottom: 6mm;
}
.toc h2 { margin-top: 0; border-bottom: none; color: #0d3f44; }
.toc ol { margin: 1.5mm 0 1.5mm 5mm; padding: 0; }
.toc li { font-size: 10pt; line-height: 1.4; margin-bottom: 0.8mm; }
.toc a { color: #1f4f56; border-bottom: none; }

.cover {
  text-align: center;
  padding: 50mm 10mm 25mm;
  page-break-after: always;
}
.cover-title { font-size: 26pt; font-weight: 700; color: #0d3f44; margin-bottom: 4mm; line-height: 1.2; }
.cover-subtitle { font-size: 13pt; color: #4a6c70; margin-bottom: 8mm; }
.cover-meta { font-size: 10pt; color: #6a8489; margin-bottom: 2mm; }
.cover-badge {
  display: inline-block;
  background: #0d3f44;
  color: white;
  padding: 2mm 6mm;
  border-radius: 5mm;
  font-size: 10pt;
  margin-top: 6mm;
}
</style>
</head>
<body>
<div class="container">
<div class="cover">
  <div class="cover-title">Falcon Knowledge Graph</div>
  <div class="cover-subtitle">Final Report — 9-Wave Autopilot Loop</div>
  <div class="cover-meta">Generated 2026-05-27 · Claude Opus 4.7 orchestrator</div>
  <div class="cover-meta">Canonical home: <code>C:/Falcon/falcon-wiki/200-Graph/</code></div>
  <div class="cover-badge">Brain understanding: 57% → 94% &nbsp;|&nbsp; +37 pts</div>
</div>
${tocHtml}
${out.join('\n')}
</div>
</body>
</html>`;

fs.writeFileSync(outFile, html, 'utf8');
console.log(`OK: wrote ${outFile} (${html.length} bytes, ${toc.length} TOC entries)`);
