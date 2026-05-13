/*** MindsetsEditor - inline table editor for settings.json mindsets block ***/
import { useEffect, useState } from 'react';
import { CheckCircle2, Loader2, Plus, Save, Trash2 } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../../api/client';
import Spinner from '../../components/ui/Spinner';
import EmptyState from '../../components/ui/EmptyState';

interface MindsetBlock {
  voice?: string;
  speed?: number;
  volumeMultiplier?: number;
  phrases?: Record<string, string>;
  triggers?: string[];
  beep?: unknown[];
  beepGapMs?: number;
}

type MindsetsResp = Record<string, MindsetBlock>;

export default function MindsetsEditor() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ['admin', 'mindsets'],
    queryFn: async () => {
      const r = await api.get<MindsetsResp>('/api/admin/mindsets');
      return r.data;
    },
  });

  const [draft, setDraft] = useState<MindsetsResp>({});
  const [editingKey, setEditingKey] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  useEffect(() => {
    if (q.data) setDraft(q.data);
  }, [q.data]);

  const save = useMutation({
    mutationFn: async (vars: { name: string; body: MindsetBlock }) => {
      const r = await api.put(`/api/admin/mindsets/${encodeURIComponent(vars.name)}`, vars.body);
      return r.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'mindsets'] }),
  });

  const create = useMutation({
    mutationFn: async (vars: { name: string }) => {
      const r = await api.post('/api/admin/mindsets', {
        name: vars.name,
        voice: 'bm_george',
        speed: 1.0,
        volumeMultiplier: 1.0,
        phrases: {},
        triggers: [],
        beep: [],
      });
      return r.data;
    },
    onSuccess: () => {
      setNewName('');
      qc.invalidateQueries({ queryKey: ['admin', 'mindsets'] });
    },
  });

  const remove = useMutation({
    mutationFn: async (name: string) => {
      const r = await api.delete(`/api/admin/mindsets/${encodeURIComponent(name)}`);
      return r.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'mindsets'] }),
  });

  function update(key: string, patch: Partial<MindsetBlock>) {
    setDraft((s) => ({ ...s, [key]: { ...s[key], ...patch } }));
  }

  if (q.isLoading) {
    return (
      <div className="grid place-items-center py-12">
        <Spinner />
      </div>
    );
  }
  if (q.error) {
    return <div className="text-falcon-red text-sm">{String(q.error)}</div>;
  }

  const entries = Object.entries(draft);

  return (
    <div className="grid gap-3">
      <div className="grid grid-cols-[1fr_auto] items-center gap-2">
        <input
          type="text"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="new mindset name"
          className="bg-brain-bg-surface border border-brain-bg-border rounded px-3 py-2 text-sm font-mono"
        />
        <button
          type="button"
          onClick={() => newName && create.mutate({ name: newName })}
          disabled={!newName || create.isPending}
          className="grid grid-flow-col items-center gap-2 px-3 py-2 text-sm rounded bg-falcon-blue text-white hover:bg-falcon-blue-600 disabled:opacity-50"
        >
          <Plus size={14} />
          Add
        </button>
      </div>

      {entries.length === 0 ? (
        <EmptyState title="No mindsets" message="Add one above to get started." />
      ) : (
        <div className="panel overflow-hidden">
          <div className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] text-xs uppercase tracking-wide text-slate-400 border-b border-brain-bg-border">
            <div className="px-3 py-2">name</div>
            <div className="px-3 py-2">voice</div>
            <div className="px-3 py-2">speed</div>
            <div className="px-3 py-2">vol</div>
            <div className="px-3 py-2"></div>
          </div>
          <div className="divide-y divide-brain-bg-border/60">
            {entries.map(([name, block]) => {
              const editing = editingKey === name;
              return (
                <div
                  key={name}
                  className="grid grid-cols-[2fr_2fr_1fr_1fr_auto] items-center text-sm text-slate-200"
                >
                  <div className="px-3 py-2 font-mono truncate">{name}</div>
                  <div className="px-3 py-2">
                    <input
                      type="text"
                      value={block.voice ?? ''}
                      onChange={(e) => update(name, { voice: e.target.value })}
                      onFocus={() => setEditingKey(name)}
                      className="w-full bg-brain-bg-surface border border-brain-bg-border rounded px-2 py-1 text-xs font-mono"
                    />
                  </div>
                  <div className="px-3 py-2">
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="4"
                      value={block.speed ?? 1.0}
                      onChange={(e) => update(name, { speed: parseFloat(e.target.value) })}
                      onFocus={() => setEditingKey(name)}
                      className="w-full bg-brain-bg-surface border border-brain-bg-border rounded px-2 py-1 text-xs font-mono"
                    />
                  </div>
                  <div className="px-3 py-2">
                    <input
                      type="number"
                      step="0.5"
                      min="0.1"
                      max="20"
                      value={block.volumeMultiplier ?? 1.0}
                      onChange={(e) =>
                        update(name, { volumeMultiplier: parseFloat(e.target.value) })
                      }
                      onFocus={() => setEditingKey(name)}
                      className="w-full bg-brain-bg-surface border border-brain-bg-border rounded px-2 py-1 text-xs font-mono"
                    />
                  </div>
                  <div className="px-3 py-2 grid grid-flow-col auto-cols-max gap-1">
                    <button
                      type="button"
                      onClick={() => save.mutate({ name, body: block })}
                      disabled={save.isPending}
                      className="grid place-items-center w-7 h-7 rounded bg-falcon-blue/15 text-falcon-blue hover:bg-falcon-blue/30 disabled:opacity-50"
                      aria-label="Save"
                    >
                      {save.isPending && save.variables?.name === name ? (
                        <Loader2 size={12} className="animate-spin" />
                      ) : editing && save.isSuccess && save.variables?.name === name ? (
                        <CheckCircle2 size={12} />
                      ) : (
                        <Save size={12} />
                      )}
                    </button>
                    <button
                      type="button"
                      onClick={() => remove.mutate(name)}
                      disabled={remove.isPending}
                      className="grid place-items-center w-7 h-7 rounded border border-falcon-red/40 text-falcon-red hover:bg-falcon-red/10 disabled:opacity-50"
                      aria-label="Delete"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(save.error || create.error || remove.error) && (
        <div className="text-xs text-falcon-red">
          {String(save.error ?? create.error ?? remove.error)}
        </div>
      )}
    </div>
  );
}
