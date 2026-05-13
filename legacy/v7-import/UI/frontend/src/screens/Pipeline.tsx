/*** Pipeline - state-machine visualization, progress, plan viewer, gated actions ***/
/*** Wave 3 of 5; bound to a single task selected via dropdown (default first task) ***/

import { useEffect, useMemo, useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import Card from '../components/ui/Card';
import ProgressBar from '../components/ui/ProgressBar';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import { GitBranch } from 'lucide-react';
import StateGraph from './pipeline/StateGraph';
import PlanViewer from './pipeline/PlanViewer';
import ActionsPanel from './pipeline/ActionsPanel';
import ScreenError from './dashboard/ScreenError';
import { useLiveStore } from '../store';
import type { BackendTask } from './dashboard/useDashboardData';

interface TaskBundle {
  taskId: string;
  state: {
    currentState?: string;
    title?: string;
    blockers?: unknown[];
  } | null;
  progress: {
    percent?: number;
    label?: string;
    step?: string;
  } | null;
}

interface ProgressData {
  percent?: number;
  label?: string;
  step?: string;
}

async function fetchTaskList(): Promise<BackendTask[]> {
  const r = await api.get<BackendTask[]>('/api/tasks');
  return r.data;
}

async function fetchTaskBundle(id: string): Promise<TaskBundle> {
  const r = await api.get<TaskBundle>(`/api/tasks/${id}`);
  return r.data;
}

async function fetchProgress(id: string): Promise<ProgressData> {
  const r = await api.get<ProgressData>(`/api/tasks/${id}/progress`);
  return r.data;
}

export default function Pipeline() {
  const qc = useQueryClient();
  const events = useLiveStore((s) => s.events);
  const [selected, setSelected] = useState<string | null>(null);

  const tasksQ = useQuery({
    queryKey: ['pipeline', 'tasks'],
    queryFn: fetchTaskList,
  });

  /*** auto-select first task once available ***/
  useEffect(() => {
    if (!selected && tasksQ.data && tasksQ.data.length > 0) {
      setSelected(tasksQ.data[0].taskId);
    }
  }, [selected, tasksQ.data]);

  const bundleQ = useQuery({
    queryKey: ['task', selected],
    queryFn: () => fetchTaskBundle(selected!),
    enabled: !!selected,
  });

  const progressQ = useQuery({
    queryKey: ['task', selected, 'progress'],
    queryFn: () => fetchProgress(selected!),
    enabled: !!selected,
    retry: false,
  });

  /*** Live re-fetch on task.* events from WS ***/
  useEffect(() => {
    if (!selected) return;
    const last = events[0];
    if (!last) return;
    if (last.type === 'task.state.changed' || last.type === 'task.progress.changed') {
      qc.invalidateQueries({ queryKey: ['task', selected] });
    }
  }, [events, selected, qc]);

  const currentState = (bundleQ.data?.state?.currentState ?? 'received').toString();
  const blockers = (bundleQ.data?.state?.blockers ?? []) as unknown[];
  const title = bundleQ.data?.state?.title ?? selected ?? '';

  const stepLabel = useMemo(() => {
    const p = progressQ.data;
    if (!p) return currentState;
    return [p.label, p.step].filter(Boolean).join(' - ') || currentState;
  }, [progressQ.data, currentState]);

  if (tasksQ.isLoading) {
    return (
      <div className="grid place-items-center h-full p-12">
        <Spinner size={36} />
      </div>
    );
  }

  if (tasksQ.error) {
    return (
      <ScreenError
        title="Cannot load tasks"
        error={tasksQ.error}
        onRetry={() => qc.invalidateQueries({ queryKey: ['pipeline', 'tasks'] })}
      />
    );
  }

  if (!tasksQ.data || tasksQ.data.length === 0) {
    return (
      <Card title="Pipeline">
        <EmptyState
          icon={<GitBranch size={36} />}
          title="No tasks yet"
          message="Create a task under Brain/state/<task-id>/task-state.json to see it here."
        />
      </Card>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-[2fr_1fr]">
      <div className="grid gap-4">
        {/*** Header card with task selector ***/}
        <Card
          title={title || 'Pipeline'}
          subtitle={selected ? `${selected} - state: ${currentState}` : undefined}
          action={
            <label className="grid grid-cols-[auto_1fr] items-center gap-2 text-xs">
              <span className="text-slate-400">Task</span>
              <select
                className="bg-brain-bg-panel border border-brain-bg-border rounded px-2 py-1 text-xs text-slate-200"
                value={selected ?? ''}
                onChange={(e) => setSelected(e.target.value)}
                aria-label="Select task"
              >
                {tasksQ.data.map((t) => (
                  <option key={t.taskId} value={t.taskId}>
                    {t.taskId}
                  </option>
                ))}
              </select>
            </label>
          }
        >
          {bundleQ.isLoading ? (
            <div className="grid place-items-center p-6">
              <Spinner />
            </div>
          ) : bundleQ.error ? (
            <ScreenError
              error={bundleQ.error}
              onRetry={() => qc.invalidateQueries({ queryKey: ['task', selected] })}
            />
          ) : (
            <StateGraph currentState={currentState} blockers={blockers} />
          )}
        </Card>

        {/*** Plan viewer ***/}
        {selected && <PlanViewer taskId={selected} />}
      </div>

      <div className="grid gap-4 content-start">
        <Card title="Progress">
          <ProgressBar
            value={Number(progressQ.data?.percent ?? 0)}
            label={stepLabel}
          />
          {blockers.length > 0 && (
            <div className="mt-3 text-xs text-falcon-red">
              {blockers.length} blocker(s) on this task
            </div>
          )}
        </Card>
        {selected && <ActionsPanel taskId={selected} currentState={currentState} />}
      </div>
    </div>
  );
}
