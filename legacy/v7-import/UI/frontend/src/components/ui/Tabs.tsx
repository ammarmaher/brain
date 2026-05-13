/*** Tabs - simple Tailwind tabs with controlled value ***/
import { ReactNode } from 'react';
import cx from '../../lib/classnames';

export interface TabItem {
  value: string;
  label: ReactNode;
  badge?: ReactNode;
}

interface TabsProps {
  items: TabItem[];
  value: string;
  onChange: (v: string) => void;
  className?: string;
}

export default function Tabs({ items, value, onChange, className }: TabsProps) {
  return (
    <div
      className={cx(
        'grid grid-flow-col auto-cols-max border-b border-brain-bg-border',
        className
      )}
    >
      {items.map((it) => {
        const active = it.value === value;
        return (
          <button
            type="button"
            key={it.value}
            onClick={() => onChange(it.value)}
            className={cx(
              'grid grid-flow-col items-center gap-2 px-4 py-2 text-sm border-b-2 -mb-px',
              active
                ? 'border-falcon-blue text-falcon-blue'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            )}
          >
            <span>{it.label}</span>
            {it.badge != null && <span className="text-xs">{it.badge}</span>}
          </button>
        );
      })}
    </div>
  );
}
