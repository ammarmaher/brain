/*** Chat - multi-mindset router (ChatGPT/Gemini live, Claude=501 paste, Brain=orchestrator) ***/
import {
  KeyboardEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Bot,
  Brain as BrainIcon,
  Copy,
  History,
  Loader2,
  Send,
  Sparkles,
  Trash2,
  Volume2,
  X,
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '../api/client';
import cx from '../lib/classnames';
import Badge from '../components/ui/Badge';
import Card from '../components/ui/Card';
import {
  ChatMessage,
  Mindset,
  newMessageId,
  useChatStore,
} from './chat/chatStore';
import Markdown from './chat/markdown';
import { formatRelative } from '../lib/formatters';

interface MindsetMeta {
  voice?: string;
  speed?: number;
  alertCategoryHint?: string;
}

const MINDSET_ORDER: Mindset[] = ['chatgpt', 'claude', 'gemini', 'brain'];
const MINDSET_LABEL: Record<Mindset, string> = {
  chatgpt: 'ChatGPT',
  claude: 'Claude',
  gemini: 'Gemini',
  brain: 'Brain',
};
const MINDSET_ICON: Record<Mindset, JSX.Element> = {
  chatgpt: <Bot size={16} />,
  claude: <Sparkles size={16} />,
  gemini: <Sparkles size={16} />,
  brain: <BrainIcon size={16} />,
};
const MINDSET_TONE: Record<Mindset, string> = {
  chatgpt: 'bg-falcon-green/15 text-falcon-green border-falcon-green/40',
  claude: 'bg-orange-500/15 text-orange-400 border-orange-500/40',
  gemini: 'bg-falcon-blue/15 text-falcon-blue border-falcon-blue/40',
  brain: 'bg-purple-500/15 text-purple-300 border-purple-500/40',
};

const BRAIN_TRIGGER_RX = /^let'?s go\b/i;

export default function Chat() {
  const active = useChatStore((s) => s.active);
  const setActive = useChatStore((s) => s.setActive);
  const voiceEnabled = useChatStore((s) => s.voiceEnabled);
  const setVoiceEnabled = useChatStore((s) => s.setVoiceEnabled);
  const messages = useChatStore((s) => s.messages[active]);
  const append = useChatStore((s) => s.append);
  const patch = useChatStore((s) => s.patch);
  const reset = useChatStore((s) => s.reset);
  const allMessages = useChatStore((s) => s.messages);

  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const composerRef = useRef<HTMLTextAreaElement>(null);

  const settingsQ = useQuery({
    queryKey: ['voice', 'settings'],
    queryFn: async () => {
      const r = await api.get('/api/voice/settings');
      return r.data as Record<string, unknown>;
    },
    staleTime: 60_000,
  });

  const mindsetMeta: Record<Mindset, MindsetMeta> = useMemo(() => {
    const cfg = settingsQ.data as { mindsets?: Record<string, MindsetMeta> } | undefined;
    const block = cfg?.mindsets ?? {};
    return {
      chatgpt: block.chatgpt ?? {},
      claude: block.claude ?? {},
      gemini: block.gemini ?? {},
      brain: block.brain ?? {},
    };
  }, [settingsQ.data]);

  /*** Auto-scroll on new messages ***/
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [messages?.length, active]);

  function handleKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      void submit();
    }
  }

  async function submit() {
    const prompt = draft.trim();
    if (!prompt || sending) return;
    const userMsg: ChatMessage = {
      id: newMessageId(),
      mindset: active,
      role: 'user',
      body: prompt,
      ts: Date.now(),
    };
    append(active, userMsg);
    setDraft('');
    setSending(true);

    if (active === 'claude') {
      const note: ChatMessage = {
        id: newMessageId(),
        mindset: active,
        role: 'system',
        body:
          'Claude responses come from your active Claude session — paste this prompt there. Use the Copy button below.',
        ts: Date.now(),
      };
      append(active, note);
      setSending(false);
      if (voiceEnabled) playVoice(active, 'starting', 1).catch(() => {});
      return;
    }

    const pendingId = newMessageId();
    append(active, {
      id: pendingId,
      mindset: active,
      role: 'assistant',
      body: '',
      ts: Date.now(),
      pending: true,
    });

    try {
      let body = '';
      if (active === 'brain') {
        if (BRAIN_TRIGGER_RX.test(prompt)) {
          const r = await api.post('/api/orchestrator/event', {
            taskId: `chat-${Date.now()}`,
            event: 'go',
            payload: { prompt },
          });
          body = formatOrchestratorReply(r.data);
        } else {
          const r = await api.post('/api/chat', {
            mindset: 'chatgpt',
            prompt: `[Brain orchestrator fallback] ${prompt}`,
          });
          body = String(r.data?.response ?? '').trim();
        }
      } else {
        const r = await api.post('/api/chat', {
          mindset: active,
          prompt,
        });
        body = String(r.data?.response ?? '').trim();
      }
      patch(active, pendingId, { body, pending: false });
      if (voiceEnabled) playVoice(active, 'finished', 1).catch(() => {});
    } catch (err: unknown) {
      const msg = errorText(err);
      patch(active, pendingId, {
        body: msg,
        pending: false,
        failed: true,
      });
    } finally {
      setSending(false);
      composerRef.current?.focus();
    }
  }

  async function playVoice(m: Mindset, category: string, idx: number) {
    const audio = new Audio(
      `/api/voice/alerts/${encodeURIComponent(m)}/${encodeURIComponent(category)}/${String(idx).padStart(2, '0')}`
    );
    await audio.play().catch(() => {});
  }

  async function copyText(t: string) {
    try {
      await navigator.clipboard.writeText(t);
    } catch {
      /*** ignore ***/
    }
  }

  const charCount = draft.length;
  const overLimit = charCount > 20000;

  return (
    <div className="grid grid-rows-[auto_1fr_auto] grid-cols-[1fr] h-full gap-3">
      {/*** Mindset tab strip ***/}
      <div className="grid grid-cols-[1fr_auto] items-center gap-3">
        <div
          className="grid grid-flow-col auto-cols-fr gap-1 p-1 panel"
          role="tablist"
        >
          {MINDSET_ORDER.map((m) => {
            const meta = mindsetMeta[m];
            const isActive = m === active;
            return (
              <button
                key={m}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setActive(m)}
                className={cx(
                  'grid grid-rows-[auto_auto] gap-0.5 px-3 py-2 rounded text-left transition-colors',
                  isActive
                    ? 'bg-falcon-blue/15 ring-1 ring-falcon-blue text-slate-100'
                    : 'hover:bg-brain-bg-panel text-slate-300'
                )}
              >
                <span className="grid grid-cols-[16px_1fr_auto] items-center gap-2">
                  {MINDSET_ICON[m]}
                  <span className="text-sm font-medium">{MINDSET_LABEL[m]}</span>
                  {(allMessages[m]?.length ?? 0) > 0 && (
                    <span className="text-xs text-slate-500 font-mono">
                      {allMessages[m].length}
                    </span>
                  )}
                </span>
                <span className="text-[10px] text-slate-500 font-mono truncate">
                  {meta.voice ?? '—'} · {meta.speed ?? '—'}x
                </span>
              </button>
            );
          })}
        </div>
        <div className="grid grid-flow-col auto-cols-max gap-2">
          <button
            type="button"
            onClick={() => setHistoryOpen((v) => !v)}
            className={cx(
              'grid grid-flow-col items-center gap-2 px-3 py-2 text-sm rounded border',
              historyOpen
                ? 'border-falcon-blue text-falcon-blue'
                : 'border-brain-bg-border text-slate-300 hover:text-slate-100'
            )}
          >
            <History size={14} />
            History
          </button>
          <button
            type="button"
            onClick={() => reset(active)}
            className="grid grid-flow-col items-center gap-2 px-3 py-2 text-sm rounded border border-brain-bg-border text-slate-300 hover:text-slate-100"
          >
            <Trash2 size={14} />
            New
          </button>
        </div>
      </div>

      {/*** Body: messages + optional history rail ***/}
      <div
        className={cx(
          'grid h-full min-h-0 gap-3',
          historyOpen ? 'grid-cols-[1fr_280px]' : 'grid-cols-[1fr]'
        )}
      >
        <div
          ref={listRef}
          className="panel grid grid-rows-[1fr] overflow-y-auto min-h-0"
        >
          <div className="grid gap-3 p-4 content-start">
            {(messages ?? []).length === 0 && (
              <div className="grid place-items-center text-slate-500 text-sm py-12">
                <span>
                  No messages yet. Type below and press Cmd/Ctrl+Enter to send.
                </span>
              </div>
            )}
            {(messages ?? []).map((msg) => (
              <Bubble
                key={msg.id}
                msg={msg}
                onCopy={() => void copyText(msg.body)}
                onPlayVoice={() =>
                  void playVoice(msg.mindset, msg.voiceCategory ?? 'finished', msg.voiceIdx ?? 1)
                }
              />
            ))}
          </div>
        </div>

        {historyOpen && (
          <Card
            title={<span className="text-xs uppercase tracking-wide">Conversations</span>}
            action={
              <button
                type="button"
                onClick={() => setHistoryOpen(false)}
                className="text-slate-400 hover:text-slate-200"
                aria-label="Close history"
              >
                <X size={14} />
              </button>
            }
            bodyClassName="grid gap-2 max-h-[60vh] overflow-y-auto"
          >
            {MINDSET_ORDER.map((m) => {
              const list = allMessages[m] ?? [];
              return (
                <div key={m} className="grid gap-1">
                  <div className="grid grid-cols-[1fr_auto] items-center text-xs text-slate-400">
                    <span className="uppercase tracking-wide">{MINDSET_LABEL[m]}</span>
                    <span className="font-mono">{list.length}</span>
                  </div>
                  {list.length === 0 ? (
                    <span className="text-xs text-slate-600">empty</span>
                  ) : (
                    <div className="grid gap-1">
                      {list.slice(-4).map((it) => (
                        <button
                          key={it.id}
                          type="button"
                          onClick={() => setActive(m)}
                          className="text-left text-xs text-slate-400 hover:text-slate-200 truncate"
                        >
                          {it.role === 'user' ? '→ ' : '← '}
                          {it.body.slice(0, 64)}
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    type="button"
                    onClick={() => reset(m)}
                    className="justify-self-start text-[10px] text-slate-500 hover:text-falcon-red"
                  >
                    clear
                  </button>
                </div>
              );
            })}
          </Card>
        )}
      </div>

      {/*** Composer ***/}
      <div className="panel grid gap-2 p-3">
        <textarea
          ref={composerRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={handleKey}
          rows={Math.min(8, Math.max(2, draft.split('\n').length))}
          placeholder={
            active === 'claude'
              ? 'Type a prompt — will be staged for paste into your Claude session.'
              : active === 'brain'
              ? 'Type a prompt. Phrases like "let\'s go ..." trigger the orchestrator.'
              : 'Type a prompt. Cmd/Ctrl+Enter to send.'
          }
          className="bg-brain-bg-surface border border-brain-bg-border rounded px-3 py-2 text-sm font-mono resize-none focus:outline-none focus:ring-1 focus:ring-falcon-blue"
        />
        <div className="grid grid-cols-[auto_1fr_auto_auto] items-center gap-3">
          <label className="grid grid-cols-[16px_1fr] items-center gap-2 text-xs text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={voiceEnabled}
              onChange={(e) => setVoiceEnabled(e.target.checked)}
              className="accent-falcon-blue"
            />
            <span className="grid grid-cols-[14px_1fr] items-center gap-1">
              <Volume2 size={12} />
              Use voice
            </span>
          </label>
          <span
            className={cx(
              'text-xs font-mono justify-self-start',
              overLimit ? 'text-falcon-red' : 'text-slate-500'
            )}
          >
            {charCount}/20000
          </span>
          <span className="text-xs text-slate-500 font-mono justify-self-end">
            Cmd/Ctrl+Enter
          </span>
          <button
            type="button"
            onClick={() => void submit()}
            disabled={sending || overLimit || draft.trim().length === 0}
            className={cx(
              'grid grid-flow-col items-center gap-2 px-4 py-2 text-sm rounded text-white transition-colors',
              sending || overLimit || draft.trim().length === 0
                ? 'bg-falcon-blue/40 cursor-not-allowed'
                : 'bg-falcon-blue hover:bg-falcon-blue-600'
            )}
          >
            {sending ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
            <span>{sending ? 'Sending' : 'Send'}</span>
          </button>
        </div>
      </div>
    </div>
  );

  function Bubble({
    msg,
    onCopy,
    onPlayVoice,
  }: {
    msg: ChatMessage;
    onCopy: () => void;
    onPlayVoice: () => void;
  }) {
    const isUser = msg.role === 'user';
    const isSystem = msg.role === 'system';
    const tone = MINDSET_TONE[msg.mindset];
    return (
      <div
        className={cx(
          'grid gap-1',
          isUser ? 'justify-items-end' : 'justify-items-start'
        )}
      >
        <div className="grid grid-flow-col auto-cols-max items-center gap-2 text-xs text-slate-500">
          <Badge severity="info" className={cx('!border', tone)}>
            {MINDSET_ICON[msg.mindset]}
            <span>
              {isUser ? 'You' : isSystem ? 'System' : MINDSET_LABEL[msg.mindset]}
            </span>
          </Badge>
          <span className="font-mono">{formatRelative(new Date(msg.ts))}</span>
          {!isUser && !msg.pending && (
            <button
              type="button"
              onClick={onPlayVoice}
              className="text-slate-500 hover:text-slate-200"
              aria-label="Play voice"
            >
              <Volume2 size={12} />
            </button>
          )}
          {!msg.pending && (
            <button
              type="button"
              onClick={onCopy}
              className="text-slate-500 hover:text-slate-200"
              aria-label="Copy"
            >
              <Copy size={12} />
            </button>
          )}
        </div>
        <div
          className={cx(
            'panel max-w-[80%] px-3 py-2',
            isUser
              ? 'bg-falcon-blue/10 border-falcon-blue/30'
              : msg.failed
              ? 'bg-falcon-red/10 border-falcon-red/40'
              : isSystem
              ? 'bg-yellow-500/10 border-yellow-500/40'
              : 'bg-brain-bg-panel'
          )}
        >
          {msg.pending ? (
            <span className="grid grid-flow-col items-center gap-2 text-xs text-slate-400">
              <Loader2 size={12} className="animate-spin" />
              thinking
            </span>
          ) : (
            <Markdown source={msg.body} className="grid gap-1" />
          )}
        </div>
      </div>
    );
  }
}

function errorText(err: unknown): string {
  const e = err as { response?: { data?: { detail?: unknown }; status?: number }; message?: string };
  const detail = e?.response?.data?.detail;
  if (typeof detail === 'string') return detail;
  if (detail && typeof detail === 'object') return JSON.stringify(detail);
  if (e?.response?.status === 501) {
    return 'Endpoint returned 501 — feature not implemented in backend.';
  }
  return e?.message ?? 'Request failed.';
}

function formatOrchestratorReply(data: unknown): string {
  if (!data || typeof data !== 'object') return '(no orchestrator response)';
  const d = data as { ok?: boolean; result?: { stdout?: string; stderr?: string; returncode?: number } };
  const out = d.result?.stdout?.trim() ?? '';
  const err = d.result?.stderr?.trim() ?? '';
  const rc = d.result?.returncode ?? 0;
  const lines: string[] = [];
  lines.push(`**Orchestrator** rc=${rc} ok=${d.ok ?? false}`);
  if (out) lines.push('```\n' + out + '\n```');
  if (err) lines.push('_stderr:_\n```\n' + err + '\n```');
  return lines.join('\n\n');
}
