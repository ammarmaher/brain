/*** ActivityFeed - newest-first list of last 20 WS events from liveStore ***/
/*** No own subscription; the AppShell's useWebSocket fills the store ***/

import { useLiveStore } from '../../store';
import Card from '../../components/ui/Card';
import EmptyState from '../../components/ui/EmptyState';
import { Activity } from 'lucide-react';
import { formatRelative } from '../../lib/formatters';

function summarizePayload(payload: unknown): string {
  if (payload == null) return '';
  if (typeof payload === 'string') return payload.slice(0, 120);
  if (typeof payload !== 'object') return String(payload);
  const obj = payload as Record<string, unknown>;
  const keys = ['message', 'taskId', 'path', 'name', 'id', 'action'];
  for (const k of keys) {
    if (k in obj && obj[k] != null) return `${k}: ${String(obj[k]).slice(0, 100)}`;
  }
  try {
    return JSON.stringify(obj).slice(0, 120);
  } catch {
    return '';
  }
}

function typeColor(type: string): string {
  if (type.startsWith('task.')) return 'text-falcon-blue border-falcon-blue/40 bg-falcon-blue/10';
  if (type.startsWith('agent.')) return 'text-emerald-400 border-emerald-400/40 bg-emerald-400/10';
  if (type.startsWith('skill') || type.startsWith('mindset'))
    return 'text-purple-400 border-purple-400/40 bg-purple-400/10';
  if (type.startsWith('gap')) return 'text-falcon-red border-falcon-red/40 bg-falcon-red/10';
  if (type.startsWith('voice')) return 'text-pink-400 border-pink-400/40 bg-pink-400/10';
  if (type.startsWith('settings')) return 'text-amber-400 border-amber-400/40 bg-amber-400/10';
  return 'text-slate-300 border-slate-500/40 bg-slate-500/10';
}

export default function ActivityFeed() {
  const events = useLiveStore((s) => s.events).slice(0, 20);

  return (
    <Card title="Live Activity" subtitle="Last 20 events" className="h-full">
      {events.length === 0 ? (
        <EmptyState
          icon={<Activity size={32} />}
          title="Listening"
          message="WebSocket connected. Events will stream here as the orchestrator works."
        />
      ) : (
        <div className="grid gap-2 max-h-[420px] overflow-auto">
          {events.map((e) => (
            <div
              key={e.id}
              className="grid grid-cols-[120px_140px_1fr] items-start gap-2 text-xs py-1 border-b border-brain-bg-border/40 last:border-b-0"
            >
              <span className="text-slate-500 font-mono">{formatRelative(new Date(e.ts))}</span>
              <span
                className={`inline-block px-2 py-0.5 rounded border text-[10px] uppercase tracking-wide ${typeColor(
                  e.type
                )}`}
              >
                {e.type}
              </span>
              <span className="text-slate-300 truncate" title={summarizePayload(e.payload)}>
                {summarizePayload(e.payload) || '-'}
              </span>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
