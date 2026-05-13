/*** Zustand stores - app preferences + live WS event buffer ***/
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Theme = 'dark' | 'light';

interface AppState {
  theme: Theme;
  sidebarCollapsed: boolean;
  brainUiToken: string | null;
  setTheme: (t: Theme) => void;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setToken: (t: string | null) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      theme: 'dark',
      sidebarCollapsed: false,
      brainUiToken: null,
      setTheme: (theme) => set({ theme }),
      toggleTheme: () =>
        set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),
      toggleSidebar: () =>
        set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
      setToken: (brainUiToken) => set({ brainUiToken }),
    }),
    { name: 'brain-ui-app' }
  )
);

/*** Live store - in-memory only, ring buffer of last 100 WS events ***/
export interface LiveEvent {
  id: string;
  type: string;
  channel?: string;
  payload: unknown;
  ts: number;
}

interface LiveState {
  events: LiveEvent[];
  unreadCount: number;
  activeTaskId: string | null;
  activeTaskState: string | null;
  activeTaskProgress: number;
  pushEvent: (e: LiveEvent) => void;
  markRead: () => void;
  setActiveTask: (id: string | null, state: string | null, pct: number) => void;
  clear: () => void;
}

export const useLiveStore = create<LiveState>((set) => ({
  events: [],
  unreadCount: 0,
  activeTaskId: null,
  activeTaskState: null,
  activeTaskProgress: 0,
  pushEvent: (e) =>
    set((s) => ({
      events: [e, ...s.events].slice(0, 100),
      unreadCount: s.unreadCount + 1,
    })),
  markRead: () => set({ unreadCount: 0 }),
  setActiveTask: (id, state, pct) =>
    set({ activeTaskId: id, activeTaskState: state, activeTaskProgress: pct }),
  clear: () => set({ events: [], unreadCount: 0 }),
}));
