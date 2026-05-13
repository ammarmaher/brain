/*** Settings - vertical tabs covering token/theme, voice JSON, mindsets, memory, backend ***/
import { ChangeEvent, useEffect, useMemo, useState } from 'react';
import {
  Activity,
  AlertCircle,
  CheckCircle2,
  CircleDashed,
  FileText,
  Layers,
  Loader2,
  Plus,
  RefreshCw,
  Save,
  Server,
  Settings as SettingsIcon,
  SlidersHorizontal,
  Volume2,
} from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../api/client';
import cx from '../lib/classnames';
import Card from '../components/ui/Card';
import EmptyState from '../components/ui/EmptyState';
import Spinner from '../components/ui/Spinner';
import { useAppStore } from '../store';
import { useChatStore, Mindset } from './chat/chatStore';
import MemoryEditor, { MemoryCreate, MemoryFile } from './settings/MemoryEditor';
import MindsetsEditor from './settings/MindsetsEditor';
import { formatRelative } from '../lib/formatters';

type TabKey =
  | 'general'
  | 'voice-config'
  | 'mindsets'
  | 'memory'
  | 'backend';

const TABS: { key: TabKey; label: string; icon: JSX.Element }[] = [
  { key: 'general', label: 'General', icon: <SlidersHorizontal size={14} /> },
  { key: 'voice-config', label: 'Voice config', icon: <Volume2 size={14} /> },
  { key: 'mindsets', label: 'Mindsets', icon: <Layers size={14} /> },
  { key: 'memory', label: 'Memory notes', icon: <FileText size={14} /> },
  { key: 'backend', label: 'Backend', icon: <Server size={14} /> },
];

export default function Settings() {
  const [tab, setTab] = useState<TabKey>('general');

  return (
    <div className="grid grid-cols-[200px_1fr] gap-4 h-full min-h-0">
      <nav className="panel grid grid-rows-[auto_1fr] overflow-hidden">
        <div className="px-3 py-3 text-xs uppercase tracking-wide text-slate-400 border-b border-brain-bg-border grid grid-cols-[16px_1fr] items-center gap-2">
          <SettingsIcon size={14} />
          <span>Settings</span>
        </div>
        <div className="grid auto-rows-max">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => setTab(t.key)}
              className={cx(
                'grid grid-cols-[16px_1fr] items-center gap-2 px-3 py-2 text-sm text-left',
                tab === t.key
                  ? 'bg-falcon-blue/15 text-falcon-blue border-r-2 border-falcon-blue'
                  : 'text-slate-300 hover:text-slate-100 hover:bg-brain-bg-panel'
              )}
            >
              {t.icon}
              <span>{t.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <div className="grid overflow-y-auto min-h-0 pr-1">
        {tab === 'general' && <GeneralTab />}
        {tab === 'voice-config' && <VoiceConfigTab />}
        {tab === 'mindsets' && (
          <Card title="Mindsets">
            <MindsetsEditor />
          </Card>
        )}
        {tab === 'memory' && <MemoryTab />}
        {tab === 'backend' && <BackendTab />}
      </div>
    </div>
  );
}

function GeneralTab() {
  const token = useAppStore((s) => s.brainUiToken);
  const setToken = useAppStore((s) => s.setToken);
  const theme = useAppStore((s) => s.theme);
  const setTheme = useAppStore((s) => s.setTheme);
  const [draft, setDraft] = useState(token ?? '');

  const chatActive = useChatStore((s) => s.active);
  const setChatActive = useChatStore((s) => s.setActive);
  const [language, setLanguage] = useState<'en' | 'ar'>('en');

  const mindsetOptions: Mindset[] = ['chatgpt', 'claude', 'gemini', 'brain'];

  return (
    <div className="grid gap-4 max-w-2xl">
      <Card title="Authentication">
        <div className="grid gap-1">
          <label className="text-xs uppercase tracking-wide text-slate-400">
            Brain UI Bearer token (admin)
          </label>
          <input
            type="password"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Bearer token (optional in dev mode)"
            className="bg-brain-bg-surface border border-brain-bg-border rounded px-3 py-2 text-sm font-mono"
          />
          <button
            type="button"
            onClick={() => setToken(draft || null)}
            className="justify-self-start mt-2 grid grid-flow-col items-center gap-2 px-3 py-1.5 text-sm rounded bg-falcon-blue text-white hover:bg-falcon-blue-600"
          >
            <Save size={14} />
            Save token
          </button>
        </div>
      </Card>

      <Card title="Appearance">
        <div className="grid gap-3">
          <div className="grid gap-1">
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Theme
            </label>
            <div className="grid grid-flow-col auto-cols-max gap-2">
              {(['dark', 'light'] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTheme(t)}
                  className={cx(
                    'px-3 py-1.5 text-sm rounded border capitalize',
                    theme === t
                      ? 'bg-falcon-blue text-white border-falcon-blue'
                      : 'border-brain-bg-border text-slate-300 hover:text-slate-100'
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div className="grid gap-1">
            <label className="text-xs uppercase tracking-wide text-slate-400">
              Language
            </label>
            <div className="grid grid-flow-col auto-cols-max gap-2">
              {(['en', 'ar'] as const).map((l) => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLanguage(l)}
                  className={cx(
                    'px-3 py-1.5 text-sm rounded border uppercase font-mono',
                    language === l
                      ? 'bg-falcon-blue text-white border-falcon-blue'
                      : 'border-brain-bg-border text-slate-300 hover:text-slate-100'
                  )}
                >
                  {l}
                </button>
              ))}
            </div>
            <span className="text-xs text-slate-500">
              Language is local to this view; full i18n persists in Wave 5.
            </span>
          </div>
        </div>
      </Card>

      <Card title="Chat defaults">
        <div className="grid gap-1">
          <label className="text-xs uppercase tracking-wide text-slate-400">
            Default mindset
          </label>
          <div className="grid grid-flow-col auto-cols-max gap-2">
            {mindsetOptions.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setChatActive(m)}
                className={cx(
                  'px-3 py-1.5 text-sm rounded border capitalize',
                  chatActive === m
                    ? 'bg-falcon-blue text-white border-falcon-blue'
                    : 'border-brain-bg-border text-slate-300 hover:text-slate-100'
                )}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}

function VoiceConfigTab() {
  const qc = useQueryClient();
  const q = useQuery({
    queryKey: ['admin', 'settings', 'full'],
    queryFn: async () => {
      const r = await api.get<Record<string, unknown>>('/api/admin/settings/full');
      return r.data;
    },
  });

  const [draft, setDraft] = useState('');
  const [parseError, setParseError] = useState<string | null>(null);

  useEffect(() => {
    if (q.data) {
      setDraft(JSON.stringify(q.data, null, 2));
      setParseError(null);
    }
  }, [q.data]);

  const save = useMutation({
    mutationFn: async (vars: { json: Record<string, unknown> }) => {
      const r = await api.put('/api/admin/settings/full', { settingsJson: vars.json });
      return r.data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'settings', 'full'] }),
  });

  const apply = useMutation({
    mutationFn: async () => {
      const r = await api.post('/api/admin/settings/apply');
      return r.data;
    },
  });

  function onChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setDraft(e.target.value);
    try {
      JSON.parse(e.target.value);
      setParseError(null);
    } catch (err) {
      setParseError(String((err as Error).message));
    }
  }

  function onSave() {
    try {
      const parsed = JSON.parse(draft);
      save.mutate({ json: parsed });
    } catch (err) {
      setParseError(String((err as Error).message));
    }
  }

  if (q.isLoading) {
    return (
      <div className="grid place-items-center py-12">
        <Spinner />
      </div>
    );
  }
  if (q.error) {
    return (
      <Card title="Voice config">
        <EmptyState
          icon={<AlertCircle size={28} className="text-falcon-red" />}
          title="Failed to load settings.json"
          message={String(q.error)}
        />
      </Card>
    );
  }

  const lines = draft.split('\n').length;

  return (
    <Card
      title="Voice configuration (settings.json)"
      action={
        <div className="grid grid-flow-col auto-cols-max gap-2">
          <button
            type="button"
            onClick={onSave}
            disabled={save.isPending || !!parseError}
            className="grid grid-flow-col items-center gap-2 px-3 py-1.5 text-sm rounded bg-falcon-blue text-white hover:bg-falcon-blue-600 disabled:opacity-50"
          >
            {save.isPending ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            Save
          </button>
          <button
            type="button"
            onClick={() => apply.mutate()}
            disabled={apply.isPending}
            className="grid grid-flow-col items-center gap-2 px-3 py-1.5 text-sm rounded border border-falcon-green/40 text-falcon-green hover:bg-falcon-green/10 disabled:opacity-50"
          >
            {apply.isPending ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
            Apply Settings
          </button>
        </div>
      }
      bodyClassName="grid gap-2"
    >
      <div className="grid grid-cols-[40px_1fr] gap-0 panel overflow-hidden">
        <div className="bg-brain-bg-surface text-right text-xs font-mono text-slate-600 py-2 px-2 select-none">
          {Array.from({ length: lines }, (_, i) => (
            <div key={i}>{i + 1}</div>
          ))}
        </div>
        <textarea
          value={draft}
          onChange={onChange}
          rows={Math.max(20, Math.min(40, lines))}
          spellCheck={false}
          className="bg-brain-bg-surface text-xs font-mono text-slate-200 px-3 py-2 resize-y focus:outline-none whitespace-pre"
        />
      </div>
      <div className="grid grid-cols-[1fr_auto] items-center text-xs">
        <span className={cx(parseError ? 'text-falcon-red' : 'text-slate-500')}>
          {parseError ?? `${draft.length} chars · ${lines} lines · valid JSON`}
        </span>
        <span className="text-slate-500 font-mono">
          {save.isSuccess && (
            <span className="grid grid-flow-col items-center gap-1 text-falcon-green">
              <CheckCircle2 size={12} />
              saved
            </span>
          )}
          {apply.isSuccess && (
            <span className="grid grid-flow-col items-center gap-1 text-falcon-green">
              <CheckCircle2 size={12} />
              applied
            </span>
          )}
        </span>
      </div>
      {(save.error || apply.error) && (
        <div className="text-xs text-falcon-red">
          {String(save.error ?? apply.error)}
        </div>
      )}
      <span className="text-xs text-slate-500">
        Sensitive keys (apiKey/token/secret) are stripped on GET. PUT validates that
        at least one of `global`, `skills`, `mindsets`, or `agentTts` is present.
      </span>
    </Card>
  );
}

function MemoryTab() {
  const q = useQuery({
    queryKey: ['admin', 'memory'],
    queryFn: async () => {
      const r = await api.get<MemoryFile[]>('/api/admin/memory');
      return r.data;
    },
  });

  const [editing, setEditing] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  return (
    <Card
      title="Feedback memory notes"
      action={
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="grid grid-flow-col items-center gap-2 px-3 py-1.5 text-sm rounded bg-falcon-blue text-white hover:bg-falcon-blue-600"
        >
          <Plus size={14} />
          Add memory note
        </button>
      }
      bodyClassName="grid gap-2"
    >
      {q.isLoading ? (
        <div className="grid place-items-center py-8">
          <Spinner />
        </div>
      ) : q.error ? (
        <EmptyState
          icon={<AlertCircle size={28} className="text-falcon-red" />}
          title="Failed to load"
          message={String(q.error)}
        />
      ) : (q.data ?? []).length === 0 ? (
        <EmptyState title="No memory notes" />
      ) : (
        <div className="panel overflow-hidden">
          <div className="grid grid-cols-[1fr_2fr_120px] text-xs uppercase tracking-wide text-slate-400 border-b border-brain-bg-border">
            <div className="px-3 py-2">file</div>
            <div className="px-3 py-2">description</div>
            <div className="px-3 py-2">type</div>
          </div>
          <div className="divide-y divide-brain-bg-border/60">
            {(q.data ?? []).map((m) => (
              <button
                key={m.filename}
                type="button"
                onClick={() => setEditing(m.filename)}
                className="grid grid-cols-[1fr_2fr_120px] items-center text-sm text-slate-200 text-left hover:bg-brain-bg-panel"
              >
                <div className="px-3 py-2 font-mono truncate">{m.filename}</div>
                <div className="px-3 py-2 truncate text-slate-400">
                  {m.description ?? m.name ?? '—'}
                </div>
                <div className="px-3 py-2 text-xs text-slate-500 truncate">
                  {m.type ?? '—'}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      <MemoryEditor filename={editing} onClose={() => setEditing(null)} />
      <MemoryCreate open={creating} onClose={() => setCreating(false)} />
    </Card>
  );
}

interface AuditEntry {
  ts?: string | number;
  actor?: string;
  action?: string;
  target?: string;
}

function BackendTab() {
  const healthQ = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const r = await api.get('/api/health');
      return r.data as Record<string, unknown>;
    },
    refetchInterval: 15_000,
  });

  /*** Try /api/admin/audit; fall back to /api/jobs as data source if 404 ***/
  const auditQ = useQuery({
    queryKey: ['admin', 'audit'],
    queryFn: async () => {
      try {
        const r = await api.get('/api/admin/audit?limit=20');
        return { source: 'audit', items: (r.data as AuditEntry[]) ?? [] };
      } catch {
        /*** Fallback: list jobs as a placeholder activity feed ***/
        const r = await api.get('/api/jobs');
        const items = (r.data?.items ?? []) as Array<{ name: string; state: string; last_run_at?: string }>;
        return {
          source: 'jobs',
          items: items.slice(0, 20).map<AuditEntry>((j) => ({
            ts: j.last_run_at,
            actor: 'job',
            action: j.state,
            target: j.name,
          })),
        };
      }
    },
    refetchInterval: 30_000,
  });

  const checks = useMemo(() => buildHealthChecks(healthQ.data), [healthQ.data]);

  return (
    <div className="grid gap-4 max-w-3xl">
      <Card
        title="Health"
        action={
          <button
            type="button"
            onClick={() => healthQ.refetch()}
            className="grid grid-flow-col items-center gap-2 px-3 py-1.5 text-sm rounded border border-brain-bg-border text-slate-300 hover:text-slate-100"
          >
            <RefreshCw size={14} />
            Refresh
          </button>
        }
      >
        {healthQ.isLoading ? (
          <Spinner />
        ) : (
          <div className="grid gap-2">
            {checks.map((c) => (
              <div
                key={c.label}
                className="grid grid-cols-[20px_1fr_auto] items-center gap-2 panel px-3 py-2"
              >
                {c.ok ? (
                  <CheckCircle2 size={16} className="text-falcon-green" />
                ) : c.unknown ? (
                  <CircleDashed size={16} className="text-slate-500" />
                ) : (
                  <AlertCircle size={16} className="text-falcon-red" />
                )}
                <span className="text-sm">{c.label}</span>
                <span className="text-xs font-mono text-slate-500">
                  {c.detail ?? (c.ok ? 'ok' : c.unknown ? 'unknown' : 'down')}
                </span>
              </div>
            ))}
          </div>
        )}
      </Card>

      <Card
        title={
          <span className="grid grid-flow-col auto-cols-max items-center gap-2">
            <Activity size={14} />
            <span>Recent activity</span>
            {auditQ.data?.source === 'jobs' && (
              <span className="text-xs text-yellow-400">
                (audit endpoint not present; showing /api/jobs — TODO Wave 1.6)
              </span>
            )}
          </span>
        }
      >
        {auditQ.isLoading ? (
          <Spinner />
        ) : (auditQ.data?.items ?? []).length === 0 ? (
          <EmptyState title="No activity" />
        ) : (
          <div className="panel overflow-hidden">
            <div className="grid grid-cols-[120px_120px_1fr_120px] text-xs uppercase tracking-wide text-slate-400 border-b border-brain-bg-border">
              <div className="px-3 py-2">when</div>
              <div className="px-3 py-2">actor</div>
              <div className="px-3 py-2">action</div>
              <div className="px-3 py-2">target</div>
            </div>
            <div className="divide-y divide-brain-bg-border/60 max-h-[300px] overflow-y-auto">
              {(auditQ.data?.items ?? []).map((row, i) => (
                <div
                  key={i}
                  className="grid grid-cols-[120px_120px_1fr_120px] items-center text-sm text-slate-200"
                >
                  <div className="px-3 py-2 text-xs text-slate-500 font-mono">
                    {row.ts ? formatRelative(typeof row.ts === 'number' ? new Date(row.ts * 1000) : row.ts) : '—'}
                  </div>
                  <div className="px-3 py-2 text-xs font-mono">{row.actor ?? '—'}</div>
                  <div className="px-3 py-2 text-xs truncate">{row.action ?? '—'}</div>
                  <div className="px-3 py-2 text-xs font-mono truncate">{row.target ?? '—'}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}

interface HealthCheck {
  label: string;
  ok: boolean;
  unknown?: boolean;
  detail?: string;
}

function buildHealthChecks(data: unknown): HealthCheck[] {
  if (!data || typeof data !== 'object') {
    return [
      { label: 'Backend', ok: false, detail: 'no response' },
    ];
  }
  const d = data as Record<string, unknown>;
  const checks: HealthCheck[] = [];
  const status = String(d.status ?? '').toLowerCase();
  checks.push({
    label: 'Brain UI backend',
    ok: status === 'ok' || status === 'healthy',
    detail: typeof d.version === 'string' ? `v${d.version}` : status || undefined,
  });

  const known = [
    { key: 'orchestrator', label: 'Orchestrator' },
    { key: 'kokoro', label: 'Kokoro TTS' },
    { key: 'chatgpt', label: 'ChatGPT key' },
    { key: 'gemini', label: 'Gemini key' },
    { key: 'voice_config', label: 'Voice config' },
    { key: 'file_watcher', label: 'File watcher' },
  ];
  for (const k of known) {
    const v = d[k.key];
    if (v === undefined) {
      checks.push({ label: k.label, ok: false, unknown: true });
    } else if (typeof v === 'boolean') {
      checks.push({ label: k.label, ok: v, detail: v ? 'ok' : 'down' });
    } else if (typeof v === 'object' && v !== null) {
      const sub = v as Record<string, unknown>;
      const ok = Boolean(sub.ok ?? sub.reachable ?? sub.healthy);
      checks.push({
        label: k.label,
        ok,
        detail: typeof sub.detail === 'string' ? sub.detail : undefined,
      });
    } else {
      checks.push({ label: k.label, ok: !!v, detail: String(v) });
    }
  }
  return checks;
}
