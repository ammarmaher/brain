/*** Table - generic sortable table on Tailwind grid ***/
import { ReactNode, useMemo, useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import cx from '../../lib/classnames';

export interface TableColumn<T> {
  key: keyof T | string;
  header: ReactNode;
  width?: string;
  render?: (row: T) => ReactNode;
  sortable?: boolean;
  accessor?: (row: T) => string | number;
}

interface TableProps<T> {
  columns: TableColumn<T>[];
  rows: T[];
  rowKey: (row: T, i: number) => string;
  className?: string;
  empty?: ReactNode;
  onRowClick?: (row: T) => void;
}

export default function Table<T>({
  columns,
  rows,
  rowKey,
  className,
  empty,
  onRowClick,
}: TableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const sorted = useMemo(() => {
    if (!sortKey) return rows;
    const col = columns.find((c) => String(c.key) === sortKey);
    if (!col) return rows;
    const accessor =
      col.accessor ??
      ((r: T) => (r as unknown as Record<string, unknown>)[sortKey] as string | number);
    return [...rows].sort((a, b) => {
      const av = accessor(a);
      const bv = accessor(b);
      if (av == null) return 1;
      if (bv == null) return -1;
      if (av < bv) return sortDir === 'asc' ? -1 : 1;
      if (av > bv) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
  }, [rows, sortKey, sortDir, columns]);

  const gridTemplate = columns
    .map((c) => c.width ?? '1fr')
    .join(' ');

  function toggleSort(k: string) {
    if (sortKey === k) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(k);
      setSortDir('asc');
    }
  }

  if (rows.length === 0) {
    return (
      <div className={cx('panel grid place-items-center p-8', className)}>
        {empty ?? <span className="text-slate-400 text-sm">No rows</span>}
      </div>
    );
  }

  return (
    <div className={cx('panel overflow-hidden', className)}>
      <div
        className="grid sticky top-0 bg-brain-bg-panel border-b border-brain-bg-border text-xs uppercase tracking-wide text-slate-400"
        style={{ gridTemplateColumns: gridTemplate }}
      >
        {columns.map((c) => {
          const k = String(c.key);
          const isSort = sortKey === k;
          return (
            <button
              type="button"
              key={k}
              disabled={!c.sortable}
              onClick={() => c.sortable && toggleSort(k)}
              className={cx(
                'grid grid-cols-[1fr_16px] items-center gap-1 px-3 py-2 text-left',
                c.sortable && 'hover:text-slate-200 cursor-pointer'
              )}
            >
              <span>{c.header}</span>
              {c.sortable && isSort && (
                <span>
                  {sortDir === 'asc' ? (
                    <ChevronUp size={14} />
                  ) : (
                    <ChevronDown size={14} />
                  )}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="divide-y divide-brain-bg-border/60">
        {sorted.map((row, i) => (
          <div
            key={rowKey(row, i)}
            role={onRowClick ? 'button' : undefined}
            onClick={onRowClick ? () => onRowClick(row) : undefined}
            className={cx(
              'grid items-center text-sm text-slate-200',
              onRowClick && 'hover:bg-brain-bg-panel cursor-pointer'
            )}
            style={{ gridTemplateColumns: gridTemplate }}
          >
            {columns.map((c) => (
              <div
                key={String(c.key)}
                className="px-3 py-2 truncate"
              >
                {c.render
                  ? c.render(row)
                  : String(
                      (row as unknown as Record<string, unknown>)[
                        String(c.key)
                      ] ?? ''
                    )}
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
