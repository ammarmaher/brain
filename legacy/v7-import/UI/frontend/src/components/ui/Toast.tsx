/*** Toast - ephemeral notifications; subscribes to liveStore events ***/
import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import cx from '../../lib/classnames';
import { useLiveStore } from '../../store';

interface ToastItem {
  id: string;
  text: string;
  ts: number;
}

const TOAST_LIFETIME_MS = 5000;

export default function ToastHost() {
  const events = useLiveStore((s) => s.events);
  const [items, setItems] = useState<ToastItem[]>([]);

  useEffect(() => {
    const latest = events[0];
    if (!latest) return;
    const text =
      typeof latest.payload === 'object' &&
      latest.payload !== null &&
      'message' in (latest.payload as Record<string, unknown>)
        ? String((latest.payload as Record<string, unknown>).message)
        : latest.type;

    const item: ToastItem = { id: latest.id, text, ts: Date.now() };
    setItems((prev) => [item, ...prev].slice(0, 5));

    const timer = window.setTimeout(() => {
      setItems((prev) => prev.filter((p) => p.id !== item.id));
    }, TOAST_LIFETIME_MS);

    return () => window.clearTimeout(timer);
  }, [events]);

  if (items.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 grid gap-2 z-50">
      {items.map((it) => (
        <div
          key={it.id}
          className={cx(
            'panel grid grid-cols-[20px_1fr] items-center gap-2 px-3 py-2 text-sm shadow-lg'
          )}
        >
          <Bell size={16} className="text-falcon-blue" />
          <span className="truncate max-w-xs">{it.text}</span>
        </div>
      ))}
    </div>
  );
}
