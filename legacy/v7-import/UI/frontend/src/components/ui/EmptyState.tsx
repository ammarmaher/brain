/*** EmptyState - icon + message + optional action ***/
import { ReactNode } from 'react';
import { Inbox } from 'lucide-react';
import cx from '../../lib/classnames';

interface EmptyStateProps {
  icon?: ReactNode;
  title?: ReactNode;
  message?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export default function EmptyState({
  icon,
  title = 'Nothing here yet',
  message,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cx(
        'grid place-items-center gap-3 p-8 text-center',
        className
      )}
    >
      <div className="text-slate-500">{icon ?? <Inbox size={36} />}</div>
      <div className="grid gap-1">
        <div className="text-base font-medium text-slate-200">{title}</div>
        {message && (
          <div className="text-sm text-slate-400 max-w-md">{message}</div>
        )}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
