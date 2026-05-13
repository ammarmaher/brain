/*** ActionsPanel - approve/reject + orchestrator transitions for the active task ***/

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Check, X, Send, FlaskConical, Upload, Loader2 } from 'lucide-react';
import api from '../../api/client';
import Card from '../../components/ui/Card';
import { isAllowed } from './stateMachine';

interface Props {
  taskId: string;
  currentState: string;
}

interface PlanGateBody {
  taskId: string;
  layer: 'L1' | 'L2' | 'L3';
  action: 'approve' | 'reject';
  reason?: string;
}

interface OrchestratorBody {
  taskId: string;
  event: string;
}

interface ActionDef {
  key: keyof typeof actionEndpoints;
  label: string;
  icon: React.ReactNode;
  variant: 'primary' | 'danger' | 'secondary';
  guardKey: string;
}

const actionEndpoints = {
  approveL1: 'plan-gate',
  rejectL1: 'plan-gate',
  approveL2: 'plan-gate',
  rejectL2: 'plan-gate',
  approveL3: 'plan-gate',
  rejectL3: 'plan-gate',
  sendScenarios: 'orchestrator',
  submitQa: 'orchestrator',
  requestPush: 'orchestrator',
} as const;

const ROWS: ActionDef[][] = [
  [
    { key: 'approveL1', label: 'Approve L1', icon: <Check size={14} />, variant: 'primary', guardKey: 'approveL1' },
    { key: 'rejectL1', label: 'Reject L1', icon: <X size={14} />, variant: 'danger', guardKey: 'rejectL1' },
  ],
  [
    { key: 'approveL2', label: 'Approve L2', icon: <Check size={14} />, variant: 'primary', guardKey: 'approveL2' },
    { key: 'rejectL2', label: 'Reject L2', icon: <X size={14} />, variant: 'danger', guardKey: 'rejectL2' },
  ],
  [
    { key: 'approveL3', label: 'Approve L3', icon: <Check size={14} />, variant: 'primary', guardKey: 'approveL3' },
    { key: 'rejectL3', label: 'Reject L3', icon: <X size={14} />, variant: 'danger', guardKey: 'rejectL3' },
  ],
  [
    {
      key: 'sendScenarios',
      label: 'Send to ChatGPT for scenarios',
      icon: <Send size={14} />,
      variant: 'secondary',
      guardKey: 'sendScenarios',
    },
  ],
  [
    {
      key: 'submitQa',
      label: 'Submit for QA',
      icon: <FlaskConical size={14} />,
      variant: 'secondary',
      guardKey: 'submitQa',
    },
  ],
  [
    {
      key: 'requestPush',
      label: 'Request Push Approval',
      icon: <Upload size={14} />,
      variant: 'secondary',
      guardKey: 'requestPush',
    },
  ],
];

const VARIANT_CLASS = {
  primary: 'bg-falcon-blue text-white border-falcon-blue hover:bg-falcon-blue/90',
  danger: 'bg-falcon-red text-white border-falcon-red hover:bg-falcon-red/90',
  secondary: 'bg-brain-bg-panel text-slate-200 border-brain-bg-border hover:bg-brain-bg-border',
};

export default function ActionsPanel({ taskId, currentState }: Props) {
  const qc = useQueryClient();
  const [feedback, setFeedback] = useState<{ kind: 'ok' | 'err'; message: string } | null>(null);

  const planGate = useMutation({
    mutationFn: async (body: PlanGateBody) => {
      const r = await api.post('/api/plan-gate', body);
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['task', taskId] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'tasks'] });
      setFeedback({ kind: 'ok', message: 'Plan-gate request accepted.' });
    },
    onError: (e: Error) =>
      setFeedback({ kind: 'err', message: e.message ?? 'plan-gate failed' }),
  });

  const orchestrator = useMutation({
    mutationFn: async (body: OrchestratorBody) => {
      const r = await api.post('/api/orchestrator/event', body);
      return r.data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['task', taskId] });
      qc.invalidateQueries({ queryKey: ['dashboard', 'tasks'] });
      setFeedback({ kind: 'ok', message: 'Orchestrator event accepted.' });
    },
    onError: (e: Error) =>
      setFeedback({ kind: 'err', message: e.message ?? 'orchestrator failed' }),
  });

  const pending = planGate.isPending || orchestrator.isPending;

  function handle(action: ActionDef) {
    if (!isAllowed(action.guardKey as keyof typeof actionEndpoints, currentState)) return;
    setFeedback(null);

    if (action.key.startsWith('approve') || action.key.startsWith('reject')) {
      const layer = action.key.slice(-2) as 'L1' | 'L2' | 'L3';
      const verb = action.key.startsWith('approve') ? 'approve' : 'reject';
      let reason: string | undefined;
      if (verb === 'reject') {
        const input = window.prompt(`Reason for rejecting ${layer}?`);
        if (!input) return;
        reason = input;
      }
      planGate.mutate({ taskId, layer, action: verb, reason });
      return;
    }

    if (action.key === 'sendScenarios') {
      orchestrator.mutate({ taskId, event: 'scenarios_pending' });
      return;
    }
    if (action.key === 'submitQa') {
      orchestrator.mutate({ taskId, event: 'qa_pending' });
      return;
    }
    if (action.key === 'requestPush') {
      orchestrator.mutate({ taskId, event: 'ready_to_push' });
      return;
    }
  }

  return (
    <Card title="Actions">
      <div className="grid gap-2">
        {ROWS.map((row, i) => (
          <div key={i} className="grid grid-flow-col auto-cols-fr gap-2">
            {row.map((a) => {
              const allowed = isAllowed(a.guardKey as keyof typeof actionEndpoints, currentState);
              return (
                <button
                  key={a.key}
                  type="button"
                  onClick={() => handle(a)}
                  disabled={!allowed || pending}
                  aria-disabled={!allowed || pending}
                  className={`grid grid-flow-col auto-cols-max items-center gap-2 px-3 py-2 rounded border text-xs font-medium ${
                    allowed && !pending
                      ? VARIANT_CLASS[a.variant]
                      : 'bg-slate-700/30 text-slate-500 border-slate-700 cursor-not-allowed'
                  }`}
                >
                  {pending ? <Loader2 size={14} className="animate-spin" /> : a.icon}
                  <span>{a.label}</span>
                </button>
              );
            })}
          </div>
        ))}
      </div>
      {feedback && (
        <p
          className={`mt-3 text-xs ${
            feedback.kind === 'ok' ? 'text-falcon-green' : 'text-falcon-red'
          }`}
          role="status"
        >
          {feedback.message}
        </p>
      )}
    </Card>
  );
}
