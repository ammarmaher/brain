/*** Agents - control center for spawned + completed agent runs ***/
/*** Wave 3 of 5; reads /api/agents and POSTs /api/admin/agents/spawn ***/

import { useEffect, useMemo } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Bot, Activity } from 'lucide-react';
import api from '../api/client';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import ScreenError from './dashboard/ScreenError';
import AgentCard from './agents/AgentCard';
import SpawnForm from './agents/SpawnForm';
import { type BackendAgentRun } from './agents/agentTypes';
import { useLiveStore } from '../store';
import { formatRelative } from '../lib/formatters';

async function fetchAgents(): Promise<BackendAgentRun[]> {
  const r = await api.get<BackendAgentRun[]>('/api/agents');
  return r.data;
}

export default function Agents() {
  const qc = useQueryClient();
  const events = useLiveStore((s) => s.events);

  const agentsQ = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
    refetchInterval: 15_000,
  });

  /*** Live: refetch on agent.* WS events ***/
  useEffect(() => {
    const last = events[0];
    if (!last) return;
    if (last.type.startsWith('agent.')) {
      qc.invalidateQueries({ queryKey: ['agents'] });
    }
  }, [events, qc]);

  const split = useMemo(() => {
    const data = agentsQ.data ?? [];
    const active: BackendAgentRun[] = [];
    const done: BackendAgentRun[] = [];
    for (const r of data) {
      if (r.status === 'running' || r.status === 'queued' || r.status === 'unknown') {
        active.push(r);
      } else {
        done.push(r);
      }
    }
    return { active, done };
  }, [agentsQ.data]);

  const auditTail = useMemo(() => {
    /*** /api/admin/agents/audit endpoint not in catalog; fall back to recent agent.* WS events ***/
    return events
      .filter((e) => e.type.startsWith('agent.'))
      .slice(0, 20);
  }, [events]);

  if (agentsQ.error) {
    return (
      <ScreenError
        title="Cannot load agents"
        error={agentsQ.error}
        onRetry={() => qc.invalidateQueries({ queryKey: ['agents'] })}
      />
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 lg:grid-cols-[2fr_1fr]">
      <div className="grid gap-4 content-start">
        <Card
          title={`Agents (${(agentsQ.data ?? []).length})`}
          subtitle={`${split.active.length} active - ${split.done.length} done`}
        >
          {agentsQ.isLoading ? (
            <div className="grid place-items-center p-6">
              <Spinner />
            </div>
          ) : (agentsQ.data ?? []).length === 0 ? (
            <EmptyState
              icon={<Bot size={32} />}
              title="No agent runs"
              message="Once an agent is spawned the orchestrator records it under Brain/state/<task>/tasks/."
            />
          ) : (
            <div className="grid gap-3 grid-cols-1 md:grid-cols-2">
              {split.active.length > 0 && (
                <div className="md:col-span-2 grid gap-2">
                  <h4 className="text-xs uppercase tracking-wide text-slate-400">Active</h4>
                  <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                    {split.active.map((r) => (
                      <AgentCard key={r.id} run={r} />
                    ))}
                  </div>
                </div>
              )}
              {split.done.length > 0 && (
                <div className="md:col-span-2 grid gap-2">
                  <h4 className="text-xs uppercase tracking-wide text-slate-400">Completed</h4>
                  <div className="grid gap-2 grid-cols-1 md:grid-cols-2">
                    {split.done.map((r) => (
                      <AgentCard key={r.id} run={r} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Card>

        <Card title="Audit Trail" subtitle="Last 20 agent.* WS events">
          {auditTail.length === 0 ? (
            <EmptyState
              icon={<Activity size={28} />}
              title="No agent events yet"
              message="agent.spawn.requested / started / completed / failed events show here as they fire."
            />
          ) : (
            <div className="grid gap-1 text-xs max-h-[260px] overflow-auto">
              {auditTail.map((e) => (
                <div
                  key={e.id}
                  className="grid grid-cols-[100px_180px_1fr] gap-2 py-1 border-b border-brain-bg-border/40 last:border-b-0"
                >
                  <span className="text-slate-500 font-mono">
                    {formatRelative(new Date(e.ts))}
                  </span>
                  <span className="text-falcon-blue truncate">{e.type}</span>
                  <span className="text-slate-300 truncate">
                    {(() => {
                      const p = e.payload as Record<string, unknown> | null;
                      if (!p) return '';
                      const id = (p.id as string) ?? '';
                      const desc = (p.description as string) ?? '';
                      return [id, desc].filter(Boolean).join(' - ');
                    })()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-4 content-start">
        <SpawnForm />
      </div>
    </div>
  );
}
