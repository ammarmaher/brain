/*** Chat store - per-mindset conversation persisted to localStorage ***/
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Mindset = 'chatgpt' | 'claude' | 'gemini' | 'brain';

export interface ChatMessage {
  id: string;
  mindset: Mindset;
  role: 'user' | 'assistant' | 'system';
  body: string;
  ts: number;
  pending?: boolean;
  failed?: boolean;
  voiceCategory?: string;
  voiceIdx?: number;
}

interface ChatState {
  active: Mindset;
  voiceEnabled: boolean;
  messages: Record<Mindset, ChatMessage[]>;
  setActive: (m: Mindset) => void;
  setVoiceEnabled: (v: boolean) => void;
  append: (m: Mindset, msg: ChatMessage) => void;
  patch: (m: Mindset, id: string, patch: Partial<ChatMessage>) => void;
  reset: (m: Mindset) => void;
}

const MAX_PER_MINDSET = 50;

const empty: Record<Mindset, ChatMessage[]> = {
  chatgpt: [],
  claude: [],
  gemini: [],
  brain: [],
};

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      active: 'chatgpt',
      voiceEnabled: false,
      messages: empty,
      setActive: (active) => set({ active }),
      setVoiceEnabled: (voiceEnabled) => set({ voiceEnabled }),
      append: (m, msg) =>
        set((s) => {
          const list = [...(s.messages[m] ?? []), msg].slice(-MAX_PER_MINDSET);
          return { messages: { ...s.messages, [m]: list } };
        }),
      patch: (m, id, patch) =>
        set((s) => {
          const list = (s.messages[m] ?? []).map((x) =>
            x.id === id ? { ...x, ...patch } : x
          );
          return { messages: { ...s.messages, [m]: list } };
        }),
      reset: (m) =>
        set((s) => ({ messages: { ...s.messages, [m]: [] } })),
    }),
    { name: 'brain-ui-chat' }
  )
);

export function newMessageId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
