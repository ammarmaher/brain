/*** Agents screen - shared local types + spawn types ***/
/*** Wave 1.6: BackendAgentRun re-aliased to AgentRun from shared canonical types. ***/

import type { AgentRun } from '../../api/types';

export type BackendAgentRun = AgentRun;

export interface SpawnRequestBody {
  type: string;
  description: string;
  prompt: string;
  runInBackground: boolean;
}

export interface SpawnResponse {
  ok: boolean;
  id: string;
  status: string;
}

export const AGENT_TYPES = [
  'general-purpose',
  'ammar-auth',
  'ammar-core-commerce',
  'ammar-core-charging',
  'ammar-core-provisioning',
  'ammar-core-gateway',
  'ammar-system-gateway',
  'ammar-web-platform-ui',
  'ammar-essentials',
] as const;

export type AgentType = (typeof AGENT_TYPES)[number];

export const STATUS_TONE: Record<string, string> = {
  queued: 'bg-slate-500/15 text-slate-300 border-slate-500/40',
  running: 'bg-falcon-blue/15 text-falcon-blue border-falcon-blue/40',
  completed: 'bg-falcon-green/15 text-falcon-green border-falcon-green/40',
  failed: 'bg-falcon-red/15 text-falcon-red border-falcon-red/40',
  killed: 'bg-amber-500/15 text-amber-400 border-amber-500/40',
  unknown: 'bg-slate-500/15 text-slate-300 border-slate-500/40',
};
