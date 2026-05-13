/*** Lightweight markdown renderer - no extra deps; preserves whitespace, fences, links ***/
import { ReactNode } from 'react';

const FENCE_RX = /^```([a-zA-Z0-9_+-]*)$/;
const LINK_RX = /\[([^\]]+)\]\(([^)\s]+)\)/g;
const INLINE_CODE_RX = /`([^`]+)`/g;
const BOLD_RX = /\*\*([^*]+)\*\*/g;
const HEADING_RX = /^(#{1,6})\s+(.*)$/;

interface Token {
  type: 'p' | 'h' | 'code' | 'list' | 'blank';
  level?: number;
  lang?: string;
  text?: string;
  items?: string[];
  lines?: string[];
}

function tokenize(src: string): Token[] {
  const lines = src.replace(/\r\n/g, '\n').split('\n');
  const tokens: Token[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    const fence = line.match(FENCE_RX);
    if (fence) {
      const lang = fence[1] || '';
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].match(FENCE_RX)) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      tokens.push({ type: 'code', lang, text: buf.join('\n') });
      continue;
    }
    const heading = line.match(HEADING_RX);
    if (heading) {
      tokens.push({ type: 'h', level: heading[1].length, text: heading[2] });
      i++;
      continue;
    }
    if (line.trim() === '') {
      tokens.push({ type: 'blank' });
      i++;
      continue;
    }
    if (line.match(/^\s*[-*]\s+/)) {
      const items: string[] = [];
      while (i < lines.length && lines[i].match(/^\s*[-*]\s+/)) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''));
        i++;
      }
      tokens.push({ type: 'list', items });
      continue;
    }
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].match(FENCE_RX) &&
      !lines[i].match(HEADING_RX) &&
      !lines[i].match(/^\s*[-*]\s+/)
    ) {
      buf.push(lines[i]);
      i++;
    }
    tokens.push({ type: 'p', text: buf.join('\n') });
  }
  return tokens;
}

function renderInline(text: string): ReactNode {
  const escaped = text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  const html = escaped
    .replace(BOLD_RX, '<strong>$1</strong>')
    .replace(INLINE_CODE_RX, '<code class="px-1 py-0.5 bg-brain-bg-panel rounded text-xs font-mono">$1</code>')
    .replace(
      LINK_RX,
      '<a href="$2" target="_blank" rel="noreferrer" class="text-falcon-blue underline">$1</a>'
    );
  return <span dangerouslySetInnerHTML={{ __html: html }} />;
}

interface MarkdownProps {
  source: string;
  className?: string;
}

export default function Markdown({ source, className }: MarkdownProps) {
  const tokens = tokenize(source ?? '');
  return (
    <div className={className}>
      {tokens.map((t, idx) => {
        switch (t.type) {
          case 'h':
            return (
              <div
                key={idx}
                className="font-semibold text-slate-100 mt-2"
                style={{ fontSize: `${1.1 - (t.level ?? 1) * 0.05}rem` }}
              >
                {renderInline(t.text ?? '')}
              </div>
            );
          case 'code':
            return (
              <pre
                key={idx}
                className="bg-brain-bg-panel border border-brain-bg-border rounded p-3 my-2 overflow-x-auto text-xs font-mono whitespace-pre"
              >
                <code>{t.text}</code>
              </pre>
            );
          case 'list':
            return (
              <ul
                key={idx}
                className="list-disc pl-5 my-1 grid gap-0.5 text-sm"
              >
                {(t.items ?? []).map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ul>
            );
          case 'blank':
            return <div key={idx} className="h-2" />;
          case 'p':
          default:
            return (
              <p
                key={idx}
                className="text-sm whitespace-pre-wrap leading-relaxed"
              >
                {renderInline(t.text ?? '')}
              </p>
            );
        }
      })}
    </div>
  );
}
