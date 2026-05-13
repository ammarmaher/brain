/*** SpawnForm - admin agent spawn (POST /api/admin/agents/spawn) ***/

import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2, Rocket } from 'lucide-react';
import api from '../../api/client';
import Card from '../../components/ui/Card';
import {
  AGENT_TYPES,
  type AgentType,
  type SpawnRequestBody,
  type SpawnResponse,
} from './agentTypes';

export default function SpawnForm() {
  const qc = useQueryClient();
  const [type, setType] = useState<AgentType>('general-purpose');
  const [description, setDescription] = useState('');
  const [prompt, setPrompt] = useState('');
  const [runInBackground, setRunInBackground] = useState(true);
  const [success, setSuccess] = useState<string | null>(null);

  const spawn = useMutation<SpawnResponse, Error, SpawnRequestBody>({
    mutationFn: async (body) => {
      const r = await api.post<SpawnResponse>('/api/admin/agents/spawn', body);
      return r.data;
    },
    onSuccess: (data) => {
      setSuccess(`Queued agent ${data.id}`);
      setDescription('');
      setPrompt('');
      qc.invalidateQueries({ queryKey: ['agents'] });
    },
  });

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setSuccess(null);
    if (!description.trim() || !prompt.trim()) return;
    spawn.mutate({ type, description: description.trim(), prompt: prompt.trim(), runInBackground });
  }

  const pending = spawn.isPending;

  return (
    <Card title="Spawn Agent" subtitle="Queues a request for the orchestrator session">
      <form onSubmit={submit} className="grid gap-3">
        <label className="grid gap-1 text-xs">
          <span className="text-slate-400">Type</span>
          <select
            value={type}
            onChange={(e) => setType(e.target.value as AgentType)}
            className="bg-brain-bg-panel border border-brain-bg-border rounded px-2 py-1.5 text-sm text-slate-200"
            disabled={pending}
          >
            {AGENT_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>

        <label className="grid gap-1 text-xs">
          <span className="text-slate-400">Description</span>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={200}
            placeholder="Short purpose (e.g. refactor X)"
            className="bg-brain-bg-panel border border-brain-bg-border rounded px-2 py-1.5 text-sm text-slate-200"
            disabled={pending}
            required
          />
        </label>

        <label className="grid gap-1 text-xs">
          <span className="text-slate-400">Prompt</span>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={8}
            placeholder="Multi-line. Markdown OK."
            className="bg-brain-bg-panel border border-brain-bg-border rounded px-2 py-1.5 text-sm text-slate-200 font-mono"
            disabled={pending}
            required
          />
        </label>

        <label className="grid grid-cols-[auto_1fr] items-center gap-2 text-xs text-slate-300">
          <input
            type="checkbox"
            checked={runInBackground}
            onChange={(e) => setRunInBackground(e.target.checked)}
            disabled={pending}
          />
          <span>Run in background</span>
        </label>

        <button
          type="submit"
          disabled={pending || !description.trim() || !prompt.trim()}
          className="grid grid-flow-col auto-cols-max items-center gap-2 px-4 py-2 rounded border bg-falcon-blue border-falcon-blue text-white text-sm font-medium hover:bg-falcon-blue/90 disabled:bg-slate-700/40 disabled:text-slate-500 disabled:border-slate-700 w-fit"
        >
          {pending ? <Loader2 size={14} className="animate-spin" /> : <Rocket size={14} />}
          <span>Spawn agent</span>
        </button>

        {success && <p className="text-xs text-falcon-green">{success}</p>}
        {spawn.isError && (
          <p className="text-xs text-falcon-red">
            {(spawn.error as Error)?.message ?? 'spawn failed'}
          </p>
        )}
      </form>
    </Card>
  );
}
