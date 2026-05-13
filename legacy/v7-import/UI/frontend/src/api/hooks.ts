/*** TanStack Query hooks - aligned to backend canonical (camelCase, flat arrays) ***/
/*** Wave 1.6: removed Paged<T> envelopes; list endpoints return T[] directly. ***/

import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import api from './client';
import type {
  AgentAuditEntry,
  AgentRun,
  Gap,
  Job,
  KnowledgeHistoryEntry,
  KnowledgeNode,
  SkillsCatalog,
  Task,
  TaskBundle,
  TestCase,
  VoiceAlert,
} from './types';

type QueryOpts<T> = Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'>;

async function getJson<T>(url: string): Promise<T> {
  const r = await api.get<T>(url);
  return r.data;
}

/*** Tasks ***/

export function useTasks(opts?: QueryOpts<Task[]>) {
  return useQuery({
    queryKey: ['tasks'],
    queryFn: () => getJson<Task[]>('/api/tasks'),
    ...opts,
  });
}

export function useTask(id: string | undefined, opts?: QueryOpts<TaskBundle>) {
  return useQuery({
    queryKey: ['tasks', id],
    queryFn: () => getJson<TaskBundle>(`/api/tasks/${id}`),
    enabled: !!id,
    ...opts,
  });
}

/*** Agents ***/

export function useAgents(opts?: QueryOpts<AgentRun[]>) {
  return useQuery({
    queryKey: ['agents'],
    queryFn: () => getJson<AgentRun[]>('/api/agents'),
    ...opts,
  });
}

export function useAgentAudit(limit = 20, opts?: QueryOpts<AgentAuditEntry[]>) {
  return useQuery({
    queryKey: ['agents', 'audit', limit],
    queryFn: () => getJson<AgentAuditEntry[]>(`/api/admin/agents/audit?limit=${limit}`),
    ...opts,
  });
}

/*** Skills ***/

export function useSkills(opts?: QueryOpts<SkillsCatalog>) {
  return useQuery({
    queryKey: ['skills'],
    queryFn: () => getJson<SkillsCatalog>('/api/skills'),
    ...opts,
  });
}

export function useSkillMd(name: string | undefined, opts?: QueryOpts<string>) {
  return useQuery({
    queryKey: ['skills', name, 'md'],
    queryFn: () => getJson<string>(`/api/skills/${name}/md`),
    enabled: !!name,
    ...opts,
  });
}

/*** Jobs ***/

export function useJobs(opts?: QueryOpts<Job[]>) {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: () => getJson<Job[]>('/api/jobs'),
    ...opts,
  });
}

/*** Voice (flat array per Wave 1.6) ***/

export function useVoiceAlerts(opts?: QueryOpts<VoiceAlert[]>) {
  return useQuery({
    queryKey: ['voice', 'alerts'],
    queryFn: () => getJson<VoiceAlert[]>('/api/voice/alerts'),
    ...opts,
  });
}

/*** Gaps ***/

export function useGaps(opts?: QueryOpts<Gap[]>) {
  return useQuery({
    queryKey: ['gaps'],
    queryFn: () => getJson<Gap[]>('/api/gaps'),
    ...opts,
  });
}

/*** Tests ***/

export function useTests(module?: string, opts?: QueryOpts<TestCase[]>) {
  return useQuery({
    queryKey: ['tests', module ?? '*'],
    queryFn: () =>
      getJson<TestCase[]>(
        module ? `/api/tests?module=${encodeURIComponent(module)}` : '/api/tests'
      ),
    ...opts,
  });
}

/*** Knowledge ***/

export function useKnowledge(opts?: QueryOpts<KnowledgeNode[]>) {
  return useQuery({
    queryKey: ['knowledge'],
    queryFn: () => getJson<KnowledgeNode[]>('/api/knowledge/nodes'),
    ...opts,
  });
}

export function useKnowledgeHistory(
  module: string | undefined,
  layer: string | undefined,
  opts?: QueryOpts<KnowledgeHistoryEntry[]>
) {
  return useQuery({
    queryKey: ['knowledge', 'history', module, layer],
    queryFn: () =>
      getJson<KnowledgeHistoryEntry[]>(
        `/api/admin/knowledge/${module}/${layer}/history`
      ),
    enabled: !!module && !!layer,
    ...opts,
  });
}

/*** Health ***/

export function useBackendHealth() {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => getJson<{ status: string; version?: string }>('/api/health'),
    refetchInterval: 15_000,
  });
}
