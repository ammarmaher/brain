/*** Sidebar - 9 domain links + Settings; lucide icons ***/
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  GitBranch,
  Bot,
  Sparkles,
  MessageSquare,
  Mic,
  BookOpen,
  AlertTriangle,
  FlaskConical,
  Settings as SettingsIcon,
  type LucideIcon,
} from 'lucide-react';
import cx from '../../lib/classnames';
import { useAppStore } from '../../store';

interface NavEntry {
  to: string;
  label: string;
  Icon: LucideIcon;
}

const NAV: NavEntry[] = [
  { to: '/dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { to: '/pipeline', label: 'Pipeline', Icon: GitBranch },
  { to: '/agents', label: 'Agents', Icon: Bot },
  { to: '/skills', label: 'Skills', Icon: Sparkles },
  { to: '/chat', label: 'Chat', Icon: MessageSquare },
  { to: '/voice', label: 'Voice', Icon: Mic },
  { to: '/knowledge', label: 'Knowledge', Icon: BookOpen },
  { to: '/gaps', label: 'Gaps', Icon: AlertTriangle },
  { to: '/tests', label: 'Tests', Icon: FlaskConical },
  { to: '/settings', label: 'Settings', Icon: SettingsIcon },
];

export default function Sidebar() {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);

  return (
    <nav
      data-testid="sidebar"
      className={cx(
        'h-full grid grid-rows-[auto_1fr_auto] gap-3 p-2 border-r border-brain-bg-border bg-brain-bg-surface'
      )}
    >
      <div className="px-2 py-3 text-sm font-semibold text-falcon-blue">
        {collapsed ? 'B' : 'Brain'}
      </div>
      <ul className="grid gap-1 content-start">
        {NAV.map(({ to, label, Icon }) => (
          <li key={to}>
            <NavLink
              to={to}
              className={({ isActive }) =>
                cx('nav-link', isActive && 'nav-link-active')
              }
            >
              <Icon size={18} />
              {!collapsed && <span className="truncate">{label}</span>}
            </NavLink>
          </li>
        ))}
      </ul>
      <div className="px-3 py-2 text-[10px] text-slate-500">
        {!collapsed && 'Wave 2 skeleton'}
      </div>
    </nav>
  );
}
