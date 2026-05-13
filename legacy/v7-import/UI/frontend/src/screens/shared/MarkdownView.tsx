/*** Render markdown with mermaid fences split into <Mermaid> blocks ***/
import { useMemo } from 'react';
import Mermaid from '../../components/mermaid/Mermaid';
import { renderMarkdown, splitMermaid } from './markdown';
import cx from '../../lib/classnames';

interface MarkdownViewProps {
  source: string;
  className?: string;
}

export default function MarkdownView({ source, className }: MarkdownViewProps) {
  const chunks = useMemo(() => splitMermaid(source), [source]);
  return (
    <div className={cx('grid gap-4', className)}>
      {chunks.map((c, i) =>
        c.kind === 'mermaid' ? (
          <Mermaid key={i} code={c.content} />
        ) : (
          <article
            key={i}
            className="prose-brain"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(c.content) }}
          />
        )
      )}
    </div>
  );
}
