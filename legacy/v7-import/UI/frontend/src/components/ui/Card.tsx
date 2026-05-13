/*** Card - panel container with optional title/subtitle/action ***/
import { ReactNode } from 'react';
import cx from '../../lib/classnames';

interface CardProps {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
  bodyClassName?: string;
  children?: ReactNode;
}

export default function Card({
  title,
  subtitle,
  action,
  className,
  bodyClassName,
  children,
}: CardProps) {
  return (
    <section className={cx('panel grid grid-rows-[auto_1fr]', className)}>
      {(title || action) && (
        <header className="grid grid-cols-[1fr_auto] items-center gap-3 px-4 py-3 border-b border-brain-bg-border">
          <div className="grid">
            {title && <h3 className="text-sm font-semibold text-slate-100">{title}</h3>}
            {subtitle && (
              <p className="text-xs text-slate-400">{subtitle}</p>
            )}
          </div>
          {action && <div>{action}</div>}
        </header>
      )}
      <div className={cx('p-4', bodyClassName)}>{children}</div>
    </section>
  );
}
