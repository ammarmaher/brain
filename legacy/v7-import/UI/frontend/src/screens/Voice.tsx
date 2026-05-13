/*** Voice - phrase editor + alert library + Kokoro regenerate (Wave 1.5 admin endpoints) ***/
import {
  ChangeEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Layers,
  Loader2,
  Music,
  Play,
  RefreshCw,
  Save,
  Search,
  Wand2,
} from 'lucide-react';
import {
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import api from '../api/client';
import cx from '../lib/classnames';
import Card from '../components/ui/Card';
import Spinner from '../components/ui/Spinner';
import EmptyState from '../components/ui/EmptyState';
import {
  AlertsBlock,
  CLAIM_TAXONOMY,
  ClaimsBlock,
  MindsetMeta,
  PhraseRef,
  PhrasesResponse,
  SettingsJson,
} from './voice/voiceTypes';
import { useLiveStore } from '../store';

const ENVELOPE_MINDSETS = ['brain', 'chatgpt', 'claude', 'gemini'];
const ENVELOPE_STATES = ['running', 'working', 'complete'];
const GLOBAL_FILES = ['starting-boss', 'finishing-boss'];

export default function Voice() {
  const qc = useQueryClient();
  const phrasesQ = useQuery({
    queryKey: ['admin', 'voice', 'phrases'],
    queryFn: async () => {
      const r = await api.get<PhrasesResponse>('/api/admin/voice/phrases');
      return r.data;
    },
  });

  const settingsQ = useQuery({
    queryKey: ['voice', 'settings'],
    queryFn: async () => {
      const r = await api.get<SettingsJson>('/api/voice/settings');
      return r.data;
    },
    staleTime: 60_000,
  });

  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<PhraseRef | null>(null);
  const [text, setText] = useState('');
  const [claimsDraft, setClaimsDraft] = useState<string[]>([]);
  const [overrideEnabled, setOverrideEnabled] = useState(false);
  const [overrideVoice, setOverrideVoice] = useState('');
  const [overrideSpeed, setOverrideSpeed] = useState<number>(1.0);
  const [audioBust, setAudioBust] = useState<number>(Date.now());
  const [statusFlags, setStatusFlags] = useState({
    Tested: false,
    Reviewed: false,
    Validated: false,
  });
  const [restartTooltip, setRestartTooltip] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const alerts = phrasesQ.data?.alerts ?? {};
  const claims = phrasesQ.data?.claims ?? {};
  const mindsets = (settingsQ.data?.mindsets ?? {}) as Record<string, MindsetMeta>;

  /*** Bind selection -> form state ***/
  useEffect(() => {
    if (!selected) return;
    const arr = alerts[selected.mindset]?.[selected.category] ?? [];
    const phrase = arr[selected.idx - 1] ?? '';
    setText(phrase);
    const padded = String(selected.idx).padStart(2, '0');
    const c = claims[selected.mindset]?.[selected.category]?.[padded]?.claims ?? [];
    setClaimsDraft([...c]);
    setOverrideEnabled(false);
    setOverrideVoice('');
    setOverrideSpeed(1.0);
    setAudioBust(Date.now());
  }, [selected, alerts, claims]);

  /*** WS: refresh on regenerate ***/
  const events = useLiveStore((s) => s.events);
  useEffect(() => {
    const latest = events[0];
    if (!latest) return;
    if (latest.type === 'voice.regenerated' || latest.type === 'voice.phrase.updated') {
      void qc.invalidateQueries({ queryKey: ['admin', 'voice', 'phrases'] });
      setAudioBust(Date.now());
    }
  }, [events, qc]);

  const filteredAlerts: AlertsBlock = useMemo(() => {
    if (!search.trim()) return alerts;
    const q = search.trim().toLowerCase();
    const out: AlertsBlock = {};
    for (const [mindset, cats] of Object.entries(alerts)) {
      const filteredCats: Record<string, string[]> = {};
      for (const [cat, arr] of Object.entries(cats)) {
        const matchedIdxs = arr
          .map((t, i) => ({ t, i }))
          .filter((x) => x.t.toLowerCase().includes(q));
        if (matchedIdxs.length > 0) {
          filteredCats[cat] = arr;
        }
      }
      if (Object.keys(filteredCats).length > 0) {
        out[mindset] = filteredCats;
      }
    }
    return out;
  }, [alerts, search]);

  const savePhrase = useMutation({
    mutationFn: async (vars: { ref: PhraseRef; text: string; claims: string[] }) => {
      const padded = String(vars.ref.idx).padStart(2, '0');
      const r = await api.put(
        `/api/admin/voice/phrases/${encodeURIComponent(vars.ref.mindset)}/${encodeURIComponent(vars.ref.category)}/${padded}`,
        { text: vars.text, claims: vars.claims }
      );
      return r.data;
    },
    onMutate: async (vars) => {
      await qc.cancelQueries({ queryKey: ['admin', 'voice', 'phrases'] });
      const prev = qc.getQueryData<PhrasesResponse>(['admin', 'voice', 'phrases']);
      if (prev) {
        const next: PhrasesResponse = {
          alerts: cloneAlerts(prev.alerts),
          claims: cloneClaims(prev.claims),
        };
        const arr = next.alerts[vars.ref.mindset]?.[vars.ref.category];
        if (arr) arr[vars.ref.idx - 1] = vars.text;
        const padded = String(vars.ref.idx).padStart(2, '0');
        next.claims[vars.ref.mindset] ??= {};
        next.claims[vars.ref.mindset][vars.ref.category] ??= {};
        next.claims[vars.ref.mindset][vars.ref.category][padded] = { claims: vars.claims };
        qc.setQueryData<PhrasesResponse>(['admin', 'voice', 'phrases'], next);
      }
      return { prev };
    },
    onError: (_e, _v, ctx) => {
      if (ctx?.prev) qc.setQueryData(['admin', 'voice', 'phrases'], ctx.prev);
    },
    onSettled: () => {
      void qc.invalidateQueries({ queryKey: ['admin', 'voice', 'phrases'] });
    },
  });

  const regenerate = useMutation({
    mutationFn: async (ref: PhraseRef) => {
      const padded = String(ref.idx).padStart(2, '0');
      const r = await api.post(
        `/api/admin/voice/regenerate/${encodeURIComponent(ref.mindset)}/${encodeURIComponent(ref.category)}/${padded}`
      );
      return r.data as { ok: boolean; bytes: number };
    },
    onSuccess: () => {
      setAudioBust(Date.now());
      const a = audioRef.current;
      if (a) {
        a.load();
        void a.play().catch(() => {});
      }
    },
  });

  const playRandom = useMutation({
    mutationFn: async (vars: { mindset: string; state: string }) => {
      const r = await api.post('/api/voice/play', {
        mindset: vars.mindset,
        category: stateToCategory(vars.state),
        state: vars.state,
      });
      return r.data;
    },
  });

  function selectPhrase(ref: PhraseRef) {
    setSelected(ref);
  }

  function toggleClaim(c: string) {
    setClaimsDraft((arr) =>
      arr.includes(c) ? arr.filter((x) => x !== c) : [...arr, c]
    );
  }

  function onSave() {
    if (!selected) return;
    savePhrase.mutate({ ref: selected, text, claims: claimsDraft });
  }

  function onRegenerate() {
    if (!selected) return;
    regenerate.mutate(selected);
  }

  const selectedSrc = useMemo(() => {
    if (!selected) return '';
    const padded = String(selected.idx).padStart(2, '0');
    return `/api/voice/alerts/${encodeURIComponent(selected.mindset)}/${encodeURIComponent(selected.category)}/${padded}?b=${audioBust}`;
  }, [selected, audioBust]);

  const mindsetMeta = selected ? mindsets[selected.mindset] ?? {} : {};
  const tooLong = text.length > 100;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[300px_1fr] gap-4 h-full min-h-0">
      {/*** Left: tree library ***/}
      <Card
        title={<span>Voice library</span>}
        bodyClassName="grid grid-rows-[auto_1fr] gap-2 overflow-hidden p-0"
        className="min-h-0"
      >
        <div className="grid grid-cols-[16px_1fr] items-center gap-2 px-3 pt-3 pb-2 border-b border-brain-bg-border">
          <Search size={14} className="text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search phrases..."
            className="bg-transparent text-sm focus:outline-none"
          />
        </div>
        <div className="overflow-y-auto px-3 py-2 grid gap-2">
          {phrasesQ.isLoading ? (
            <div className="grid place-items-center py-8">
              <Spinner />
            </div>
          ) : phrasesQ.error ? (
            <EmptyState
              icon={<AlertCircle size={28} className="text-falcon-red" />}
              title="Failed to load"
              message={String(phrasesQ.error)}
            />
          ) : (
            <>
              {Object.entries(filteredAlerts).map(([mindset, cats]) => (
                <details key={mindset} open className="grid">
                  <summary className="cursor-pointer text-xs uppercase tracking-wide text-slate-300 py-1">
                    {mindset}
                  </summary>
                  <div className="grid gap-1 pl-3 pt-1">
                    {Object.entries(cats).map(([cat, arr]) => (
                      <details key={cat} className="grid">
                        <summary className="cursor-pointer text-xs text-slate-400 py-0.5">
                          {cat} ({arr.length})
                        </summary>
                        <div className="grid gap-0.5 pl-3 pt-0.5">
                          {arr.map((phrase, i) => {
                            const idx = i + 1;
                            const padded = String(idx).padStart(2, '0');
                            const isSel =
                              selected?.mindset === mindset &&
                              selected?.category === cat &&
                              selected?.idx === idx;
                            const lc = phrase.toLowerCase();
                            if (
                              search.trim() &&
                              !lc.includes(search.trim().toLowerCase())
                            ) {
                              return null;
                            }
                            return (
                              <button
                                key={idx}
                                type="button"
                                onClick={() => selectPhrase({ mindset, category: cat, idx })}
                                className={cx(
                                  'grid grid-cols-[28px_1fr] items-center gap-2 text-left px-2 py-1 rounded text-xs',
                                  isSel
                                    ? 'bg-falcon-blue/15 text-falcon-blue ring-1 ring-falcon-blue/40'
                                    : 'text-slate-300 hover:bg-brain-bg-panel'
                                )}
                              >
                                <span className="font-mono text-slate-500">{padded}</span>
                                <span className="truncate">{phrase}</span>
                              </button>
                            );
                          })}
                        </div>
                      </details>
                    ))}
                  </div>
                </details>
              ))}

              <details className="grid">
                <summary className="cursor-pointer text-xs uppercase tracking-wide text-slate-300 py-1">
                  envelopes
                </summary>
                <div className="grid gap-1 pl-3 pt-1">
                  {ENVELOPE_MINDSETS.map((m) => (
                    <details key={m} className="grid">
                      <summary className="cursor-pointer text-xs text-slate-400 py-0.5">
                        {m}
                      </summary>
                      <div className="grid gap-0.5 pl-3 pt-0.5">
                        {ENVELOPE_STATES.map((s) => (
                          <span
                            key={s}
                            className="grid grid-cols-[14px_1fr] items-center gap-2 text-xs text-slate-500 px-2 py-1"
                          >
                            <Music size={12} />
                            {m}-{s}.mp3
                          </span>
                        ))}
                      </div>
                    </details>
                  ))}
                </div>
              </details>

              <details className="grid">
                <summary className="cursor-pointer text-xs uppercase tracking-wide text-slate-300 py-1">
                  global
                </summary>
                <div className="grid gap-0.5 pl-3 pt-1">
                  {GLOBAL_FILES.map((f) => (
                    <span
                      key={f}
                      className="grid grid-cols-[14px_1fr] items-center gap-2 text-xs text-slate-500 px-2 py-1"
                    >
                      <Music size={12} />
                      {f}.mp3
                    </span>
                  ))}
                </div>
              </details>
            </>
          )}
        </div>
      </Card>

      {/*** Right: editor + actions ***/}
      <div className="grid grid-rows-[auto_1fr_auto] gap-4 min-h-0">
        {!selected ? (
          <Card title="Phrase editor">
            <EmptyState
              icon={<Layers size={28} />}
              title="Select a phrase from the library"
              message="Pick any leaf in the tree on the left to edit phrase text, claims, and regenerate the mp3."
            />
          </Card>
        ) : (
          <>
            <Card
              title={
                <span className="grid grid-flow-col auto-cols-max items-center gap-2">
                  <span className="font-mono text-falcon-blue">
                    {selected.mindset}/{selected.category}/
                    {String(selected.idx).padStart(2, '0')}
                  </span>
                </span>
              }
              action={
                <button
                  type="button"
                  onClick={() => audioRef.current?.play().catch(() => {})}
                  className="grid grid-flow-col items-center gap-2 px-3 py-1.5 text-sm rounded bg-falcon-blue text-white hover:bg-falcon-blue-600"
                >
                  <Play size={14} />
                  Play
                </button>
              }
              bodyClassName="grid gap-2"
            >
              <audio
                ref={audioRef}
                key={selectedSrc}
                src={selectedSrc}
                controls
                preload="metadata"
                className="w-full"
              />
            </Card>

            <Card title="Phrase + claims" className="overflow-y-auto min-h-0">
              <div className="grid gap-4">
                <div className="grid gap-1">
                  <label className="text-xs uppercase tracking-wide text-slate-400">
                    Phrase text
                  </label>
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={3}
                    className={cx(
                      'bg-brain-bg-surface border rounded px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-1',
                      tooLong
                        ? 'border-yellow-500/60 focus:ring-yellow-500'
                        : 'border-brain-bg-border focus:ring-falcon-blue'
                    )}
                  />
                  <span
                    className={cx(
                      'text-xs font-mono',
                      tooLong ? 'text-yellow-400' : 'text-slate-500'
                    )}
                  >
                    {text.length} chars
                    {tooLong ? ' (consider shortening for TTS)' : ''}
                  </span>
                </div>

                <div className="grid gap-1">
                  <label className="text-xs uppercase tracking-wide text-slate-400">
                    Claims
                  </label>
                  <div className="grid grid-flow-col auto-cols-max gap-2">
                    {CLAIM_TAXONOMY.map((c) => {
                      const on = claimsDraft.includes(c);
                      return (
                        <button
                          key={c}
                          type="button"
                          onClick={() => toggleClaim(c)}
                          className={cx(
                            'px-2 py-1 text-xs rounded border transition-colors',
                            on
                              ? 'bg-falcon-green/15 text-falcon-green border-falcon-green/40'
                              : 'border-brain-bg-border text-slate-400 hover:text-slate-200'
                          )}
                        >
                          {c}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="grid gap-1">
                    <label className="text-xs uppercase tracking-wide text-slate-400">
                      Voice (from mindset)
                    </label>
                    <input
                      type="text"
                      value={overrideEnabled ? overrideVoice : mindsetMeta.voice ?? '—'}
                      onChange={(e) => setOverrideVoice(e.target.value)}
                      readOnly={!overrideEnabled}
                      className={cx(
                        'bg-brain-bg-surface border border-brain-bg-border rounded px-2 py-1.5 text-sm font-mono',
                        !overrideEnabled && 'text-slate-500'
                      )}
                    />
                  </div>
                  <div className="grid gap-1">
                    <label className="text-xs uppercase tracking-wide text-slate-400">
                      Speed
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="4"
                      value={overrideEnabled ? overrideSpeed : mindsetMeta.speed ?? 1}
                      onChange={(e) => setOverrideSpeed(parseFloat(e.target.value))}
                      readOnly={!overrideEnabled}
                      className={cx(
                        'bg-brain-bg-surface border border-brain-bg-border rounded px-2 py-1.5 text-sm font-mono',
                        !overrideEnabled && 'text-slate-500'
                      )}
                    />
                  </div>
                </div>
                <label className="grid grid-cols-[16px_1fr] items-center gap-2 text-xs text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={overrideEnabled}
                    onChange={(e) => setOverrideEnabled(e.target.checked)}
                    className="accent-falcon-blue"
                  />
                  <span>
                    Override for this phrase (rare — overrides not persisted by Wave 1.5
                    backend; will be respected when admin/voice/regenerate gains an
                    override field).
                  </span>
                </label>

                <div className="grid grid-cols-[auto_auto_1fr_auto] gap-2 items-center">
                  <button
                    type="button"
                    onClick={onSave}
                    disabled={savePhrase.isPending}
                    className="grid grid-flow-col items-center gap-2 px-3 py-2 text-sm rounded bg-falcon-blue text-white hover:bg-falcon-blue-600 disabled:opacity-50"
                  >
                    {savePhrase.isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <Save size={14} />
                    )}
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={onRegenerate}
                    disabled={regenerate.isPending}
                    className="grid grid-flow-col items-center gap-2 px-3 py-2 text-sm rounded bg-falcon-green/20 text-falcon-green border border-falcon-green/40 hover:bg-falcon-green/30 disabled:opacity-50"
                  >
                    {regenerate.isPending ? (
                      <Loader2 size={14} className="animate-spin" />
                    ) : (
                      <RefreshCw size={14} />
                    )}
                    Regenerate mp3
                  </button>
                  <span className="text-xs text-slate-500 font-mono">
                    {savePhrase.isSuccess && (
                      <span className="grid grid-flow-col items-center gap-1 text-falcon-green">
                        <CheckCircle2 size={12} />
                        saved
                      </span>
                    )}
                    {regenerate.isSuccess && (
                      <span className="grid grid-flow-col items-center gap-1 text-falcon-green">
                        <CheckCircle2 size={12} />
                        {regenerate.data?.bytes ?? 0} bytes
                      </span>
                    )}
                  </span>
                </div>

                {(savePhrase.error || regenerate.error) && (
                  <div className="text-xs text-falcon-red">
                    {String(savePhrase.error ?? regenerate.error)}
                  </div>
                )}
              </div>
            </Card>
          </>
        )}

        {/*** Quick actions panel ***/}
        <Card title="Quick actions" bodyClassName="grid gap-3">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            <div className="grid gap-2 panel p-3">
              <span className="text-xs uppercase tracking-wide text-slate-400">
                Play random `finished` alert
              </span>
              <div className="grid grid-flow-col auto-cols-max gap-2">
                {Object.keys(alerts).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() =>
                      playRandom.mutate({ mindset: m, state: 'finished' })
                    }
                    disabled={playRandom.isPending}
                    className="grid grid-flow-col items-center gap-2 px-3 py-1.5 text-sm rounded border border-brain-bg-border text-slate-300 hover:text-slate-100 hover:bg-brain-bg-panel disabled:opacity-50"
                  >
                    <Play size={14} />
                    {m}
                  </button>
                ))}
              </div>
              <div className="grid grid-flow-col auto-cols-max gap-2 pt-1">
                {Object.keys(statusFlags).map((k) => (
                  <label
                    key={k}
                    className="grid grid-cols-[14px_1fr] items-center gap-2 text-xs text-slate-400 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={statusFlags[k as keyof typeof statusFlags]}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        setStatusFlags((prev) => ({
                          ...prev,
                          [k]: e.target.checked,
                        }))
                      }
                      className="accent-falcon-blue"
                    />
                    <span>{k}</span>
                  </label>
                ))}
              </div>
              {playRandom.isError && (
                <span className="text-xs text-falcon-red">
                  {String(playRandom.error)}
                </span>
              )}
            </div>

            <div className="grid gap-2 panel p-3">
              <span className="text-xs uppercase tracking-wide text-slate-400">
                Play full demo (skill)
              </span>
              <div className="grid gap-2">
                <button
                  type="button"
                  onClick={() =>
                    playRandom.mutate({ mindset: 'brain', state: 'running' })
                  }
                  className="grid grid-flow-col items-center gap-2 justify-self-start px-3 py-1.5 text-sm rounded border border-brain-bg-border text-slate-300 hover:text-slate-100 hover:bg-brain-bg-panel"
                >
                  <Wand2 size={14} />
                  Trigger demo (running)
                </button>
                <span className="text-xs text-slate-500">
                  Per-skill demo invocation routes through the generic
                  /api/voice/play endpoint. A dedicated demo-announcer endpoint
                  will land in Wave 1.6.
                </span>
              </div>
              <div className="border-t border-brain-bg-border pt-2 grid gap-1 relative">
                <span className="text-xs uppercase tracking-wide text-slate-400">
                  agent-tts daemon
                </span>
                <button
                  type="button"
                  disabled
                  onMouseEnter={() => setRestartTooltip(true)}
                  onMouseLeave={() => setRestartTooltip(false)}
                  className="grid grid-flow-col items-center gap-2 justify-self-start px-3 py-1.5 text-sm rounded border border-brain-bg-border text-slate-500 cursor-not-allowed"
                >
                  <RefreshCw size={14} />
                  Restart daemon (501)
                </button>
                {restartTooltip && (
                  <span className="absolute -bottom-6 left-0 text-xs text-yellow-400 bg-brain-bg-panel border border-yellow-500/40 px-2 py-0.5 rounded">
                    Implement in Wave 1.6 — currently restart manually.
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

function cloneAlerts(a: AlertsBlock): AlertsBlock {
  const out: AlertsBlock = {};
  for (const [k, v] of Object.entries(a)) {
    out[k] = {};
    for (const [k2, v2] of Object.entries(v)) {
      out[k][k2] = [...v2];
    }
  }
  return out;
}

function cloneClaims(c: ClaimsBlock): ClaimsBlock {
  const out: ClaimsBlock = {};
  for (const [k, v] of Object.entries(c)) {
    out[k] = {};
    for (const [k2, v2] of Object.entries(v)) {
      out[k][k2] = {};
      for (const [k3, v3] of Object.entries(v2)) {
        out[k][k2][k3] = { claims: [...(v3?.claims ?? [])] };
      }
    }
  }
  return out;
}

function stateToCategory(state: string): string {
  const map: Record<string, string> = {
    finished: 'completion',
    running: 'processing',
    starting: 'processing',
    complete: 'completion',
  };
  return map[state] ?? 'completion';
}
