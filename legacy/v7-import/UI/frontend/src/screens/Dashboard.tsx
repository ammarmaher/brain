/*** Dashboard - KPI tiles + severity/priority charts + live activity + GAP-CC-002 launcher ***/
/*** Wave 3 of 5; reads /api/tasks /api/gaps /api/tests /api/voice/alerts ***/

import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Play, Loader2 } from 'lucide-react';
import api from '../api/client';
import Card from '../components/ui/Card';
import StatTile from '../components/ui/StatTile';
import Spinner from '../components/ui/Spinner';
import {
  useDashboardTasks,
  useDashboardGaps,
  useDashboardTests,
  useDashboardVoice,
  buildSeverityByModule,
  buildPriorityPie,
  countVoiceAlerts,
  countModulesAnalyzed,
} from './dashboard/useDashboardData';
import GapSeverityChart from './dashboard/GapSeverityChart';
import ScenarioPriorityChart from './dashboard/ScenarioPriorityChart';
import ActivityFeed from './dashboard/ActivityFeed';
import ScreenError from './dashboard/ScreenError';

const TARGET_TASK_ID = 'TASK-20260501-001';

export default function Dashboard() {
  const tasksQ = useDashboardTasks();
  const gapsQ = useDashboardGaps();
  const testsQ = useDashboardTests();
  const voiceQ = useDashboardVoice();
  const qc = useQueryClient();

  const tasks = tasksQ.data ?? [];
  const gaps = gapsQ.data ?? [];
  const tests = testsQ.data ?? [];

  const activeTasks = tasks.filter((t) => {
    const s = (t.currentState || '').toLowerCase();
    return ![
      'received',
      'completed',
      'cancelled',
      'failed',
      'ready_to_push',
    ].includes(s);
  }).length;

  const totalGaps = gaps.length;
  const criticalGaps = gaps.filter(
    (g) => (g.severity || '').toLowerCase() === 'critical'
  ).length;
  const totalTests = tests.length;
  const voiceCount = countVoiceAlerts(voiceQ.data);
  const modulesAnalyzed = countModulesAnalyzed(gaps);

  const severityByModule = useMemo(() => buildSeverityByModule(gaps), [gaps]);
  const priorityPie = useMemo(() => buildPriorityPie(tests), [tests]);

  const targetTask = tasks.find((t) => t.taskId === TARGET_TASK_ID);
  const canLaunch = (targetTask?.currentState || '').toLowerCase() === 'received';

  const launch = useMutation({
    mutationFn: async () => {
      const r = await api.post('/api/orchestrator/event', {
        taskId: TARGET_TASK_ID,
        event: 'task_received',
      });
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['dashboard', 'tasks'] });
    },
  });

  const anyError = tasksQ.error ?? gapsQ.error ?? testsQ.error ?? voiceQ.error;
  const anyLoading =
    tasksQ.isLoading || gapsQ.isLoading || testsQ.isLoading || voiceQ.isLoading;

  if (anyError) {
    return (
      <div className="grid gap-4">
        <ScreenError
          title="Dashboard data unavailable"
          error={anyError}
          onRetry={() => {
            qc.invalidateQueries({ queryKey: ['dashboard'] });
          }}
        />
      </div>
    );
  }

  if (anyLoading) {
    return (
      <div className="grid place-items-center h-full p-12">
        <Spinner size={36} />
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-3 lg:grid-cols-4">
      {/*** Top row: KPI tiles ***/}
      <StatTile label="Active Tasks" value={activeTasks} />
      <StatTile label="Total Gaps" value={totalGaps} />
      <StatTile label="Critical Gaps" value={criticalGaps} />
      <StatTile label="Test Scenarios" value={totalTests} />
      <StatTile label="Voice Alerts" value={voiceCount} />
      <StatTile label="Modules Analyzed" value={modulesAnalyzed} />

      {/*** Launcher tile spans 2 cols on lg ***/}
      <Card
        title="Pipeline Trigger"
        subtitle={
          targetTask
            ? `${TARGET_TASK_ID} - ${targetTask.currentState}`
            : `${TARGET_TASK_ID} (no task-state.json yet)`
        }
        className="md:col-span-3 lg:col-span-2"
      >
        <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] items-center gap-3">
          <p className="text-sm text-slate-300">
            {canLaunch
              ? 'Task is in "received" state. Launching will fire task_received into the orchestrator.'
              : 'Launcher is enabled only when task-state.json shows currentState: received.'}
          </p>
          <button
            type="button"
            onClick={() => launch.mutate()}
            disabled={!canLaunch || launch.isPending}
            aria-disabled={!canLaunch || launch.isPending}
            className={`grid grid-flow-col auto-cols-max items-center gap-2 px-4 py-2 rounded border text-sm font-medium ${
              canLaunch && !launch.isPending
                ? 'bg-falcon-blue text-white border-falcon-blue hover:bg-falcon-blue/90'
                : 'bg-slate-700/40 text-slate-500 border-slate-700 cursor-not-allowed'
            }`}
          >
            {launch.isPending ? <Loader2 size={14} className="animate-spin" /> : <Play size={14} />}
            <span>Start GAP-CC-002 pipeline</span>
          </button>
        </div>
        {launch.isError && (
          <p className="mt-3 text-xs text-falcon-red">
            Failed to launch: {(launch.error as Error)?.message ?? 'unknown error'}
          </p>
        )}
        {launch.isSuccess && (
          <p className="mt-3 text-xs text-falcon-green">Event accepted by orchestrator.</p>
        )}
      </Card>

      {/*** Middle row: charts ***/}
      <div className="md:col-span-3 lg:col-span-2">
        <GapSeverityChart data={severityByModule} />
      </div>
      <div className="md:col-span-3 lg:col-span-2">
        <ScenarioPriorityChart data={priorityPie} />
      </div>

      {/*** Bottom row: live activity ***/}
      <div className="md:col-span-3 lg:col-span-4">
        <ActivityFeed />
      </div>
    </div>
  );
}
