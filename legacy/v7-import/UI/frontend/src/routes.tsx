/*** Routes - single source of truth, all screens lazy-loaded ***/
import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Spinner from './components/ui/Spinner';

const Dashboard = lazy(() => import('./screens/Dashboard'));
const Pipeline = lazy(() => import('./screens/Pipeline'));
const Agents = lazy(() => import('./screens/Agents'));
const Skills = lazy(() => import('./screens/Skills'));
const Chat = lazy(() => import('./screens/Chat'));
const Voice = lazy(() => import('./screens/Voice'));
const Knowledge = lazy(() => import('./screens/Knowledge'));
const Gaps = lazy(() => import('./screens/Gaps'));
const Tests = lazy(() => import('./screens/Tests'));
const Settings = lazy(() => import('./screens/Settings'));

export const routeMap = [
  { path: '/dashboard', label: 'Dashboard' },
  { path: '/pipeline', label: 'Pipeline' },
  { path: '/agents', label: 'Agents' },
  { path: '/skills', label: 'Skills' },
  { path: '/chat', label: 'Chat' },
  { path: '/voice', label: 'Voice' },
  { path: '/knowledge', label: 'Knowledge' },
  { path: '/gaps', label: 'Gaps' },
  { path: '/tests', label: 'Tests' },
  { path: '/settings', label: 'Settings' },
] as const;

export default function AppRoutes() {
  return (
    <Suspense
      fallback={
        <div className="grid place-items-center h-full">
          <Spinner />
        </div>
      }
    >
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/agents" element={<Agents />} />
        <Route path="/skills" element={<Skills />} />
        <Route path="/chat" element={<Chat />} />
        <Route path="/voice" element={<Voice />} />
        <Route path="/knowledge" element={<Knowledge />} />
        <Route path="/gaps" element={<Gaps />} />
        <Route path="/tests" element={<Tests />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Suspense>
  );
}
