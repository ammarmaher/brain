/*** Mutation helpers shared across Wave 5 screens ***/
import api from '../../api/client';

export interface PutKnowledgeBody {
  content: string;
}

export async function putKnowledge(
  module: string,
  layer: string,
  filename: string,
  body: PutKnowledgeBody
) {
  const url = `/api/admin/knowledge/${encodeURIComponent(module)}/${encodeURIComponent(layer)}/${encodeURIComponent(filename)}`;
  const r = await api.put(url, body);
  return r.data;
}

export interface JobCreateBody {
  slug: string;
  title: string;
  statusLine: string;
  body: string;
}

export interface JobUpdateBody {
  title?: string;
  statusLine?: string;
  body?: string;
}

export async function createJob(body: JobCreateBody) {
  const r = await api.post('/api/admin/jobs', body);
  return r.data;
}

export async function updateJob(slug: string, body: JobUpdateBody) {
  const r = await api.put(`/api/admin/jobs/${encodeURIComponent(slug)}`, body);
  return r.data;
}

export async function deleteJob(slug: string) {
  const r = await api.delete(`/api/admin/jobs/${encodeURIComponent(slug)}`);
  return r.data;
}

export async function runJob(name: string, target = 'DONE') {
  const r = await api.post(`/api/jobs/${encodeURIComponent(name)}/run`, { target });
  return r.data;
}

export interface GapBody {
  id: string;
  severity?: string;
  category?: string;
  description?: string;
  title?: string;
  evidence?: string;
  suggestedFix?: string;
  tracesTo?: string[];
  status?: string;
}

export async function createGap(module: string, body: GapBody | Record<string, unknown>) {
  const r = await api.post(`/api/admin/gaps/${encodeURIComponent(module)}`, body);
  return r.data;
}

export async function updateGap(
  module: string,
  gapId: string,
  body: Partial<GapBody> | Record<string, unknown>
) {
  const r = await api.put(
    `/api/admin/gaps/${encodeURIComponent(module)}/${encodeURIComponent(gapId)}`,
    body
  );
  return r.data;
}

export async function archiveGap(module: string, gapId: string) {
  const r = await api.delete(
    `/api/admin/gaps/${encodeURIComponent(module)}/${encodeURIComponent(gapId)}`
  );
  return r.data;
}

export interface TestCaseBody {
  tcId: string;
  title: string;
  category: string;
  priority: string;
  given: string;
  when: string;
  then: string;
  tracesTo: string[];
  claims: string[];
}

export async function createTest(module: string, body: TestCaseBody) {
  const r = await api.post(`/api/admin/tests/${encodeURIComponent(module)}`, body);
  return r.data;
}

export async function updateTest(module: string, tcId: string, body: TestCaseBody) {
  const r = await api.put(
    `/api/admin/tests/${encodeURIComponent(module)}/${encodeURIComponent(tcId)}`,
    body
  );
  return r.data;
}

export async function archiveTest(module: string, tcId: string) {
  const r = await api.delete(
    `/api/admin/tests/${encodeURIComponent(module)}/${encodeURIComponent(tcId)}`
  );
  return r.data;
}

export async function fetchKnowledgeFile(module: string, layer: string, filename: string) {
  const url = `/api/admin/knowledge/${encodeURIComponent(module)}/${encodeURIComponent(layer)}/${encodeURIComponent(filename)}`;
  const r = await api.get<{ content: string; path: string }>(url);
  return r.data;
}

export async function fetchModuleSummary(slug: string) {
  const r = await api.get<{ slug: string; files: { layer: string; path: string; name: string }[] }>(
    `/api/knowledge/modules/${encodeURIComponent(slug)}`
  );
  return r.data;
}

export async function fetchModules() {
  const r = await api.get<{ slug: string; layer: string; path: string }[]>('/api/knowledge/modules');
  return r.data;
}

export async function fetchKnowledgeFiles(layer?: string) {
  const url = layer ? `/api/knowledge/files?layer=${encodeURIComponent(layer)}` : '/api/knowledge/files';
  const r = await api.get<{ layer: string; path: string; name: string; rel: string }[]>(url);
  return r.data;
}

export async function fetchJobs() {
  const r = await api.get<unknown>('/api/admin/jobs');
  return r.data;
}

export async function fetchGapsList() {
  const r = await api.get<unknown[]>('/api/gaps');
  return r.data;
}

export async function fetchTestsList() {
  const r = await api.get<unknown[]>('/api/tests');
  return r.data;
}
