/*** Dashboard data hook - fetches tasks, gaps, tests, voice alerts in parallel ***/
/*** Returns counts, severity breakdown by module, scenario priority distribution ***/
/*** Wave 1.6: Backend* aliases re-exported from shared canonical types. ***/

import { useQuery } from '@tanstack/react-query';
import api from '../../api/client';
import type { Gap, Task, TestCase, VoiceAlert } from '../../api/types';

/*** Aliases retained for screen-local readability; type body lives in api/types.ts. ***/
export type BackendGap = Gap;
export type BackendTest = TestCase;
export type BackendTask = Task;
export type BackendVoiceAlertEntry = VoiceAlert;
export type BackendVoiceList = VoiceAlert[];

const SEVERITIES = ['critical', 'high', 'medium', 'low', 'info'] as const;
export type SeverityKey = (typeof SEVERITIES)[number];

export const SEVERITY_COLORS: Record<SeverityKey, string> = {
  critical: '#ef4444',
  high: '#f97316',
  medium: '#eab308',
  low: '#3b82f6',
  info: '#94a3b8',
};

export const PRIORITY_COLORS: Record<string, string> = {
  P0: '#ef4444',
  P1: '#f97316',
  P2: '#eab308',
  P3: '#3b82f6',
  unknown: '#94a3b8',
};

async function getJson<T>(url: string): Promise<T> {
  const r = await api.get<T>(url);
  return r.data;
}

export function useDashboardTasks() {
  return useQuery<BackendTask[]>({
    queryKey: ['dashboard', 'tasks'],
    queryFn: () => getJson<BackendTask[]>('/api/tasks'),
    refetchInterval: 30_000,
  });
}

export function useDashboardGaps() {
  return useQuery<BackendGap[]>({
    queryKey: ['dashboard', 'gaps'],
    queryFn: () => getJson<BackendGap[]>('/api/gaps'),
    refetchInterval: 60_000,
  });
}

export function useDashboardTests() {
  return useQuery<BackendTest[]>({
    queryKey: ['dashboard', 'tests'],
    queryFn: () => getJson<BackendTest[]>('/api/tests'),
    refetchInterval: 60_000,
  });
}

export function useDashboardVoice() {
  return useQuery<BackendVoiceList>({
    queryKey: ['dashboard', 'voice'],
    queryFn: () => getJson<BackendVoiceList>('/api/voice/alerts'),
    refetchInterval: 5 * 60_000,
  });
}

/*** Build stacked-bar dataset: row per module, bar segments per severity ***/
export function buildSeverityByModule(gaps: BackendGap[] = []) {
  const byModule = new Map<string, Record<SeverityKey, number>>();
  for (const g of gaps) {
    const mod = (g.module || 'unknown').toString();
    const sev = (g.severity || 'info').toLowerCase() as SeverityKey;
    const validSev: SeverityKey = (SEVERITIES as readonly string[]).includes(sev)
      ? sev
      : 'info';
    if (!byModule.has(mod)) {
      byModule.set(mod, { critical: 0, high: 0, medium: 0, low: 0, info: 0 });
    }
    const row = byModule.get(mod)!;
    row[validSev] += 1;
  }
  return Array.from(byModule.entries()).map(([module, counts]) => ({
    module,
    ...counts,
  }));
}

/*** Build pie dataset: scenario priority count ***/
export function buildPriorityPie(tests: BackendTest[] = []) {
  const counts: Record<string, number> = {};
  for (const t of tests) {
    const p = (t.priority || 'unknown').toString().toUpperCase();
    counts[p] = (counts[p] || 0) + 1;
  }
  return Object.entries(counts).map(([name, value]) => ({ name, value }));
}

/*** Approximate voice alert count from /api/voice/alerts response shape ***/
export function countVoiceAlerts(v: BackendVoiceList | undefined): number {
  if (!v) return 0;
  if (Array.isArray(v)) return v.length;
  const obj = v as Record<string, unknown>;
  if (Array.isArray(obj.alerts)) return (obj.alerts as unknown[]).length;
  /*** flatten any nested mindset->category->[entries] structure ***/
  let total = 0;
  for (const val of Object.values(obj)) {
    if (Array.isArray(val)) total += val.length;
    else if (val && typeof val === 'object') {
      for (const inner of Object.values(val as Record<string, unknown>)) {
        if (Array.isArray(inner)) total += (inner as unknown[]).length;
      }
    }
  }
  return total;
}

/*** Count distinct module slugs across the gap dataset ***/
export function countModulesAnalyzed(gaps: BackendGap[] = []): number {
  const set = new Set<string>();
  for (const g of gaps) {
    if (g.module) set.add(g.module);
  }
  return set.size;
}
