/*** ProgressBar - 0..100% bar; reads liveStore active task by default ***/
import cx from '../../lib/classnames';
import { useLiveStore } from '../../store';
import { formatPercent } from '../../lib/formatters';

interface ProgressBarProps {
  value?: number;
  label?: string;
  className?: string;
  bindToActiveTask?: boolean;
}

export default function ProgressBar({
  value,
  label,
  className,
  bindToActiveTask = false,
}: ProgressBarProps) {
  const liveValue = useLiveStore((s) => s.activeTaskProgress);
  const liveLabel = useLiveStore((s) => s.activeTaskState);
  const v = value ?? (bindToActiveTask ? liveValue : 0);
  const l = label ?? (bindToActiveTask ? liveLabel ?? 'idle' : '');
  const clamped = Math.max(0, Math.min(100, v));

  return (
    <div className={cx('grid gap-1', className)}>
      <div className="grid grid-cols-[1fr_auto] items-center text-xs text-slate-400">
        <span className="truncate">{l}</span>
        <span className="font-mono">{formatPercent(clamped)}</span>
      </div>
      <div className="h-2 bg-brain-bg-panel rounded overflow-hidden">
        <div
          className="h-full bg-falcon-blue transition-all"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
