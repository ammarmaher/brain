/*** Header - logo, live state badge, bell, theme toggle, user menu ***/
import { Bell, Moon, Sun, User, PanelLeft } from 'lucide-react';
import cx from '../../lib/classnames';
import { useAppStore, useLiveStore } from '../../store';
import { formatPercent } from '../../lib/formatters';

export default function Header() {
  const theme = useAppStore((s) => s.theme);
  const toggleTheme = useAppStore((s) => s.toggleTheme);
  const toggleSidebar = useAppStore((s) => s.toggleSidebar);
  const unread = useLiveStore((s) => s.unreadCount);
  const markRead = useLiveStore((s) => s.markRead);
  const taskId = useLiveStore((s) => s.activeTaskId);
  const taskState = useLiveStore((s) => s.activeTaskState);
  const taskPct = useLiveStore((s) => s.activeTaskProgress);

  return (
    <header
      data-testid="header"
      className="grid grid-cols-[auto_1fr_auto] items-center gap-4 px-4 border-b border-brain-bg-border bg-brain-bg-surface"
    >
      <button
        type="button"
        onClick={toggleSidebar}
        className="grid place-items-center w-8 h-8 rounded text-slate-300 hover:bg-brain-bg-panel"
        aria-label="Toggle sidebar"
      >
        <PanelLeft size={18} />
      </button>

      <div className="grid grid-flow-col auto-cols-max items-center gap-3">
        {taskId && (
          <div
            className={cx(
              'grid grid-flow-col auto-cols-max items-center gap-2 px-3 py-1 rounded border text-xs',
              'border-falcon-blue/40 bg-falcon-blue/10 text-falcon-blue'
            )}
          >
            <span className="font-mono">{taskId.slice(0, 8)}</span>
            <span className="text-slate-400">{taskState ?? '-'}</span>
            <span className="font-mono">{formatPercent(taskPct)}</span>
          </div>
        )}
      </div>

      <div className="grid grid-flow-col auto-cols-max items-center gap-2">
        <button
          type="button"
          onClick={markRead}
          className="relative grid place-items-center w-8 h-8 rounded text-slate-300 hover:bg-brain-bg-panel"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute -top-1 -right-1 grid place-items-center min-w-4 h-4 px-1 bg-falcon-red text-white text-[10px] rounded-full">
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </button>
        <button
          type="button"
          onClick={toggleTheme}
          className="grid place-items-center w-8 h-8 rounded text-slate-300 hover:bg-brain-bg-panel"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button
          type="button"
          className="grid place-items-center w-8 h-8 rounded text-slate-300 hover:bg-brain-bg-panel"
          aria-label="User menu"
        >
          <User size={18} />
        </button>
      </div>
    </header>
  );
}
