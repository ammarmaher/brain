/*** Markdown helpers — split mermaid fences; extract scenarios ***/
import { marked } from 'marked';

export interface MarkdownChunk {
  kind: 'html' | 'mermaid';
  content: string;
}

const MERMAID_RX = /```mermaid\s*\n([\s\S]*?)\n```/g;

/*** Split markdown into html + mermaid chunks so each fence can be component-rendered ***/
export function splitMermaid(md: string): MarkdownChunk[] {
  const chunks: MarkdownChunk[] = [];
  let last = 0;
  let m: RegExpExecArray | null;
  MERMAID_RX.lastIndex = 0;
  while ((m = MERMAID_RX.exec(md)) !== null) {
    if (m.index > last) {
      chunks.push({ kind: 'html', content: md.slice(last, m.index) });
    }
    chunks.push({ kind: 'mermaid', content: m[1] });
    last = m.index + m[0].length;
  }
  if (last < md.length) {
    chunks.push({ kind: 'html', content: md.slice(last) });
  }
  return chunks;
}

/*** marked configured for safe-ish dark-mode rendering ***/
marked.setOptions({ breaks: false, gfm: true });

export function renderMarkdown(md: string): string {
  return marked.parse(md, { async: false }) as string;
}

/*** CSV download (no xlsx dep) ***/
export function downloadCsv(rows: (string | number | null | undefined)[][], filename: string) {
  const escape = (v: string | number | null | undefined): string => {
    if (v == null) return '';
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const csv = rows.map((r) => r.map(escape).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
