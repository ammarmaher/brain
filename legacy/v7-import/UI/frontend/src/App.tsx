/*** App root - mounts AppShell + routes ***/
import { useEffect } from 'react';
import AppShell from './components/layout/AppShell';
import AppRoutes from './routes';
import { useAppStore } from './store';

export default function App() {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    if (theme === 'dark') {
      root.classList.add('dark');
      body.classList.remove('light');
    } else {
      root.classList.remove('dark');
      body.classList.add('light');
    }
  }, [theme]);

  return (
    <AppShell>
      <AppRoutes />
    </AppShell>
  );
}
