/*** WebSocket hook - auto-reconnect with backoff, pushes events into liveStore ***/
import { useEffect, useRef } from 'react';
import { useLiveStore, useAppStore } from '../store';

interface UseWebSocketOptions {
  filters?: string[];
  enabled?: boolean;
}

const MAX_BACKOFF_MS = 30_000;
const MIN_BACKOFF_MS = 500;

export function useWebSocket(opts: UseWebSocketOptions = {}) {
  const { filters = ['*'], enabled = true } = opts;
  const wsRef = useRef<WebSocket | null>(null);
  const backoffRef = useRef<number>(MIN_BACKOFF_MS);
  const stoppedRef = useRef<boolean>(false);

  useEffect(() => {
    if (!enabled) return;
    stoppedRef.current = false;

    const url = import.meta.env.VITE_WS_URL || 'ws://localhost:8000/ws';

    function connect() {
      if (stoppedRef.current) return;
      try {
        const ws = new WebSocket(url);
        wsRef.current = ws;

        ws.onopen = () => {
          backoffRef.current = MIN_BACKOFF_MS;
          const token = useAppStore.getState().brainUiToken;
          ws.send(
            JSON.stringify({
              type: 'subscribe',
              filters,
              token: token ?? undefined,
            })
          );
        };

        ws.onmessage = (msg) => {
          try {
            const data = JSON.parse(msg.data as string);
            const ev = {
              id:
                data.id ??
                `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
              type: data.type ?? 'unknown',
              channel: data.channel,
              payload: data.payload ?? data,
              ts: Date.now(),
            };
            useLiveStore.getState().pushEvent(ev);

            if (data.type === 'task.progress' && data.payload) {
              const p = data.payload as {
                task_id: string;
                state: string;
                progress: number;
              };
              useLiveStore
                .getState()
                .setActiveTask(p.task_id, p.state, p.progress);
            }
          } catch {
            /*** ignore malformed frames ***/
          }
        };

        ws.onclose = () => {
          if (stoppedRef.current) return;
          const wait = backoffRef.current;
          backoffRef.current = Math.min(wait * 2, MAX_BACKOFF_MS);
          window.setTimeout(connect, wait);
        };

        ws.onerror = () => {
          ws.close();
        };
      } catch {
        const wait = backoffRef.current;
        backoffRef.current = Math.min(wait * 2, MAX_BACKOFF_MS);
        window.setTimeout(connect, wait);
      }
    }

    connect();

    return () => {
      stoppedRef.current = true;
      wsRef.current?.close();
      wsRef.current = null;
    };
  }, [enabled, filters.join(',')]);

  return wsRef;
}
