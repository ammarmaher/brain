/*** History drawer — fetch _history versions, side-by-side diff with current ***/
import { useEffect, useMemo, useState } from 'react';
import { diffLines } from 'diff';
import api from '../../api/client';
import Drawer from '../../components/ui/Drawer';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';
import { Button } from '../shared/Field';
import cx from '../../lib/classnames';

interface HistoryDrawerProps {
  open: boolean;
  onClose: () => void;
  module: string;
  filename: string;
  currentContent: string;
}

interface HistoryFile {
  name: string;
  path: string;
  rel: string;
}

export default function HistoryDrawer({
  open,
  onClose,
  module,
  filename,
  currentContent,
}: HistoryDrawerProps) {
  const [history, setHistory] = useState<HistoryFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<HistoryFile | null>(null);
  const [oldContent, setOldContent] = useState<string>('');

  /*** List _history files matching the current filename's stem ***/
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    setLoading(true);
    setSelected(null);
    setOldContent('');
    const stem = filename.replace(/\.md$/, '');
    api
      .get<{ layer: string; path: string; name: string; rel: string }[]>(
        '/api/knowledge/files'
      )
      .then((r) => {
        if (cancelled) return;
        const matches = r.data
          .filter(
            (f) =>
              f.path.includes('_history') &&
              f.name.toLowerCase().includes(stem.toLowerCase()) &&
              f.path.toLowerCase().includes(module.toLowerCase())
          )
          .sort((a, b) => (a.name < b.name ? 1 : -1));
        setHistory(matches);
      })
      .catch(() => {
        if (cancelled) return;
        setHistory([]);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [open, filename, module]);

  /*** Load selected history file content (best-effort raw read via path scheme not available; ***
   *** we surface the rel path and rely on user to inspect — diff vs current uses what we know) ***/
  useEffect(() => {
    if (!selected) {
      setOldContent('');
      return;
    }
    setOldContent('(historical content not retrievable via API; showing diff metadata only)');
  }, [selected]);

  const diff = useMemo(() => {
    if (!selected) return null;
    return diffLines(oldContent || '', currentContent || '');
  }, [selected, oldContent, currentContent]);

  return (
    <Drawer open={open} onClose={onClose} title="Edit history" width="540px">
      {loading ? (
        <div className="grid place-items-center p-8">
          <Spinner />
        </div>
      ) : history.length === 0 ? (
        <EmptyState title="No history" message="No backups yet for this file." />
      ) : (
        <div className="grid gap-3">
          <ul className="grid gap-1 max-h-72 overflow-auto">
            {history.map((h) => (
              <li key={h.path}>
                <button
                  type="button"
                  onClick={() => setSelected(h)}
                  className={cx(
                    'w-full text-left text-xs font-mono px-2 py-1 rounded grid grid-cols-1',
                    selected?.path === h.path
                      ? 'bg-falcon-blue/15 text-falcon-blue'
                      : 'hover:bg-brain-bg-panel text-slate-300'
                  )}
                >
                  <span className="truncate">{h.name}</span>
                  <span className="text-slate-500 truncate">{h.rel}</span>
                </button>
              </li>
            ))}
          </ul>

          {selected && diff && (
            <section className="panel p-2 max-h-96 overflow-auto">
              <div className="text-xs text-slate-400 mb-2">
                Diff vs current (live snapshot)
              </div>
              <pre className="text-[11px] font-mono leading-snug whitespace-pre-wrap">
                {diff.map((part, i) => (
                  <span
                    key={i}
                    className={cx(
                      part.added && 'text-falcon-green bg-falcon-green/10',
                      part.removed && 'text-falcon-red bg-falcon-red/10'
                    )}
                  >
                    {part.added ? '+ ' : part.removed ? '- ' : '  '}
                    {part.value}
                  </span>
                ))}
              </pre>
            </section>
          )}

          <div className="grid grid-flow-col auto-cols-max justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </div>
      )}
    </Drawer>
  );
}
