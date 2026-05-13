/*** Footer - backend health pulse + version ***/
import cx from '../../lib/classnames';
import { useBackendHealth } from '../../api/hooks';

export default function Footer() {
  const { data, isError } = useBackendHealth();
  const ok = !isError && data?.status === 'ok';
  const dotClass = ok
    ? 'bg-falcon-green'
    : isError
    ? 'bg-falcon-red'
    : 'bg-yellow-500';

  return (
    <footer
      data-testid="footer"
      className="grid grid-cols-[1fr_auto] items-center px-4 py-1 text-xs text-slate-500 border-t border-brain-bg-border bg-brain-bg-surface"
    >
      <div className="grid grid-flow-col auto-cols-max items-center gap-2">
        <span
          className={cx('inline-block w-2 h-2 rounded-full', dotClass)}
          aria-label="backend status"
        />
        <span>backend {ok ? 'online' : isError ? 'offline' : 'checking'}</span>
      </div>
      <div>brain-ui v0.1.0</div>
    </footer>
  );
}
