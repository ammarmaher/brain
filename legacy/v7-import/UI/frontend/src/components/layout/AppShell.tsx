/*** AppShell - Tailwind grid sidebar/header/canvas; responsive collapse ***/
import { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import ToastHost from '../ui/Toast';
import { useAppStore } from '../../store';
import { useWebSocket } from '../../api/ws';
import cx from '../../lib/classnames';

interface AppShellProps {
  children: ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const collapsed = useAppStore((s) => s.sidebarCollapsed);
  useWebSocket({ filters: ['*'], enabled: true });

  return (
    <div
      data-testid="app-shell"
      className={cx(
        'h-full w-full grid',
        'grid-rows-[56px_1fr_24px]',
        collapsed
          ? 'md:grid-cols-[64px_1fr]'
          : 'md:grid-cols-[240px_1fr]',
        'grid-cols-1'
      )}
    >
      <aside className="hidden md:block row-span-3">
        <Sidebar />
      </aside>
      <Header />
      <main
        data-testid="app-main"
        className="overflow-auto bg-brain-bg p-4"
      >
        {children}
      </main>
      <Footer />
      <ToastHost />
    </div>
  );
}
