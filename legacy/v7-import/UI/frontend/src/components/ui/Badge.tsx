/*** Badge - canonical severity colors per claims taxonomy ***/
import { ReactNode } from 'react';
import cx from '../../lib/classnames';
import type { Severity } from '../../api/types';

interface BadgeProps {
  severity?: Severity;
  className?: string;
  children: ReactNode;
}

const severityClass: Record<Severity, string> = {
  critical: 'bg-falcon-red/15 text-falcon-red border-falcon-red/40',
  high: 'bg-orange-500/15 text-orange-400 border-orange-500/40',
  medium: 'bg-yellow-500/15 text-yellow-400 border-yellow-500/40',
  low: 'bg-falcon-blue/15 text-falcon-blue border-falcon-blue/40',
  info: 'bg-slate-500/15 text-slate-300 border-slate-500/40',
};

export default function Badge({
  severity = 'info',
  className,
  children,
}: BadgeProps) {
  return (
    <span
      className={cx(
        'inline-grid grid-flow-col auto-cols-max items-center gap-1 px-2 py-0.5 text-xs font-medium rounded border',
        severityClass[severity],
        className
      )}
    >
      {children}
    </span>
  );
}
