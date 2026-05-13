/*** TS types mirroring backend canonical shapes (camelCase, flat arrays). ***/
/*** Wave 1.6: aligned to backend pydantic models; legacy snake_case dropped. ***/

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

/*** Falcon orchestrator state vocabulary; backend stores strings without enforcement. ***/
export type TaskState =
  | 'received'
  | 'analyzing'
  | 'planning'
  | 'planned'
  | 'building'
  | 'testing'
  | 'ready_to_push'
  | 'completed'
  | 'failed'
  | 'cancelled'
  | (string & {});

/*** /api/tasks element (flat array). ***/
export interface Task {
  taskId: string;
  title: string;
  currentState: TaskState;
  progressPercent: number;
  progressLabel: string;
  cardPath?: string | null;
}

/*** /api/tasks/{id}/state body. ***/
export interface TaskStateRecord {
  taskId: string;
  title: string;
  currentState: TaskState;
  history: Array<Record<string, unknown>>;
  gates: TaskGates;
  artifacts: TaskArtifacts;
  timestamps: TaskTimestamps;
  blockers: unknown[];
  notes: string[];
}

export interface TaskGates {
  l1Approved: boolean;
  l2Approved: boolean;
  l3Approved: boolean;
  scenariosBuilt: boolean;
  codeWritten: boolean;
  qaPassed: boolean;
  pushRequested: boolean;
  pushApproved: boolean;
}

export interface TaskArtifacts {
  planL1Path: string;
  planL2Path: string;
  planL3Path: string;
  scenariosPath: string;
  codeChanges: unknown[];
  qaReportPath: string;
}

export interface TaskTimestamps {
  created?: string | null;
  updated?: string | null;
  eachStateEntered: Record<string, string>;
}

export interface ProgressSnapshot {
  taskId: string;
  label: string;
  percent: number;
  step: string;
  totalSteps: number;
  etaSeconds?: number | null;
  updatedAt?: string | null;
}

/*** /api/tasks/{id} bundle: state + progress (both nullable). ***/
export interface TaskBundle {
  taskId: string;
  state: TaskStateRecord | null;
  progress: ProgressSnapshot | null;
}

/*** /api/agents element (flat array). ***/
export interface AgentRun {
  id: string;
  name: string;
  taskId?: string | null;
  status: string;
  outputDir?: string | null;
  startedAt?: string | null;
  finishedAt?: string | null;
}

/*** /api/skills response (object with skills + jobs arrays). ***/
export interface SkillInfo {
  name: string;
  category: string;
  path: string;
  triggers: string[];
  description?: string | null;
}

export interface SkillsCatalog {
  skills: SkillInfo[];
  jobs: SkillInfo[];
}

/*** /api/jobs element. ***/
export interface Job {
  name: string;
  path: string;
  triggers: string[];
  description?: string | null;
  /*** Forward-compat: jobs may surface schedule/status fields later. ***/
  [extra: string]: unknown;
}

/*** /api/voice/alerts: flat array, pinned shape (Wave 1.6). ***/
export interface VoiceAlert {
  mindset: string;
  category: string;
  index: string;
  text: string;
  claims: string[];
  mp3Url: string;
}

/*** /api/gaps element. Backend coerces unrecognized fields into `extra`. ***/
export interface Gap {
  id: string;
  module?: string | null;
  severity?: Severity | string | null;
  type?: string | null;
  title?: string | null;
  description?: string | null;
  affectedServices: string[];
  sourcePath?: string | null;
  extra: Record<string, unknown>;
}

/*** /api/tests element. Same `extra` bag pattern. ***/
export interface TestCase {
  tcId: string;
  module?: string | null;
  title?: string | null;
  priority?: string | null;
  type?: string | null;
  preconditions: string[];
  steps: string[];
  expected: string[];
  requirements: string[];
  /*** tracesTo / suggestedFix etc. are surfaced via this bag. ***/
  extra: Record<string, unknown>;
}

/*** Knowledge graph (placeholder while Wave 2 lands). ***/
export interface KnowledgeNode {
  id: string;
  type: string;
  label: string;
  edges?: Array<{ target: string; relation: string }>;
}

export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

/*** Wave 1.6: agent audit-log row. ***/
export interface AgentAuditEntry {
  timestamp: number | null;
  actor: string | null;
  action: string;
  target: string | null;
  before?: unknown;
  after?: unknown;
}

/*** Wave 1.6: knowledge history row. ***/
export interface KnowledgeHistoryEntry {
  filename: string;
  sizeBytes: number;
  mtime: number;
}
