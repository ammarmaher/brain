/*** Subscribe to WS event types and invalidate query keys on match ***/
import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useLiveStore } from '../../store';

export function useWsRefresh(types: string[], queryKeys: string[][]) {
  const events = useLiveStore((s) => s.events);
  const qc = useQueryClient();

  useEffect(() => {
    const latest = events[0];
    if (!latest) return;
    if (!types.includes(latest.type)) return;
    for (const key of queryKeys) qc.invalidateQueries({ queryKey: key });
  }, [events, types, queryKeys, qc]);
}
