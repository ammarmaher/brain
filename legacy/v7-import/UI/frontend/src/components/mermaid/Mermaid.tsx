/*** Mermaid - renders mermaid diagrams from a code string ***/
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  securityLevel: 'strict',
  fontFamily: 'Inter, system-ui, sans-serif',
});

interface MermaidProps {
  code: string;
  id?: string;
  className?: string;
}

export default function Mermaid({ code, id, className }: MermaidProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const diagramId = id ?? `mmd-${Math.random().toString(36).slice(2, 9)}`;
    setError(null);

    mermaid
      .render(diagramId, code)
      .then(({ svg }) => {
        if (cancelled) return;
        if (ref.current) ref.current.innerHTML = svg;
      })
      .catch((e: unknown) => {
        if (cancelled) return;
        setError(e instanceof Error ? e.message : 'Diagram error');
      });

    return () => {
      cancelled = true;
    };
  }, [code, id]);

  if (error) {
    return (
      <div className="panel p-3 text-xs text-falcon-red">
        Mermaid: {error}
      </div>
    );
  }

  return <div ref={ref} className={className} />;
}
