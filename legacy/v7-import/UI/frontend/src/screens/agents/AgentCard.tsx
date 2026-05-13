/*** AgentCard - single agent run summary with elapsed + expand ***/

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronDown, ChevronUp, Square, Loader2 } from 'lucide-react';
import api from '../../api/client';
import { formatRelative } from '../../lib/formatters';
import { type BackendAgentRun, STATUS_TONE } from './agentTypes';

interface Props {
  run: BackendAgentRun;
}

function elapsed(run: BackendAgentRun): string {
  const start = run.startedAt ? new Date(run.startedAt).getTime() : null;
  const end = run.finishedAt ? new Date(run.finishedAt).getTime() : Date.now();
  if (!start) return '-';
  const ms = Math.max(0, end - start);
  const s = Math.floor(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const sr = s % 60;
  if (m < 60) return `${m}m ${sr}s`;
  const h = Math.floor(m / 60);
  const mr = m % 60;
  return `${h}h ${mr}m`;
}

function shortId(id: string): string {
  if (id.length <= 22) return id;
  return id.slice(0, 10) + '...' + id.slice(-8);
}

export default function AgentCard({ run }: Props) {
  const [open, setOpen] = useState(false);
  const qc = useQueryClient();

  const stop = useMutation({
    mutationFn: async () => {
      const r = await api.post(`/api/agents/${run.id}/stop`);
      return r.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['agents'] }),
  });

  const tone = STATUS_TONE[run.status] ?? STATUS_TONE.unknown;
  const isActive = run.status === 'running' || run.status === 'queued';

  return (
    <div className="panel grid grid-rows-[auto_auto] gap-2 p-3">
      <div className="grid grid-cols-[1fr_auto] items-start gap-2">
        <div className="grid gap-1">
          <div className="grid grid-cols-[1fr_auto] items-center gap-2">
            <span className="font-mono text-xs text-slate-400">{shortId(run.id)}</span>
            <span className={`text-[10px] uppercase px-2 py-0.5 rounded border ${tone}`}>
              {run.status}
            </span>
          </div>
          <div className="text-sm text-slate-200">{run.name}</div>
          {run.taskId && (
            <div className="text-xs text-slate-500">task: {run.taskId}</div>
          )}
          <div className="text-xs text-slate-500">
            elapsed {elapsed(run)}
            {run.startedAt && <> - started {formatRelative(run.startedAt)}</>}
          </div>
        </div>
        <div className="grid gap-1">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-label={open ? 'Collapse details' : 'Expand details'}
            className="grid place-items-center w-7 h-7 rounded border border-brain-bg-border text-slate-300 hover:bg-brain-bg-panel"
          >
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
          {isActive && (
            <button
              type="button"
              onClick={() => stop.mutate()}
              disabled={stop.isPending}
              aria-label="Stop agent"
              className="grid place-items-center w-7 h-7 rounded border border-falcon-red/40 text-falcon-red hover:bg-falcon-red/15 disabled:opacity-50"
            >
              {stop.isPending ? <Loader2 size={12} className="animate-spin" /> : <Square size={12} />}
            </button>
          )}
        </div>
      </div>
      {open && (
        <div className="grid gap-1 text-xs text-slate-400 border-t border-brain-bg-border/60 pt-2">
          <div>
            <span className="text-slate-500">output: </span>
            <span className="font-mono break-all">{run.outputDir ?? '(none)'}</span>
          </div>
          {run.finishedAt && (
            <div>
              <span className="text-slate-500">finished: </span>
              {run.finishedAt}
            </div>
          )}
          {stop.isError && (
            <div className="text-falcon-red">
              stop failed: {(stop.error as Error)?.message ?? 'unknown'}
            </div>
          )}
          {stop.isSuccess && (
            <div className="text-falcon-green">stop request acknowledged</div>
          )}
        </div>
      )}
    </div>
  );
}
