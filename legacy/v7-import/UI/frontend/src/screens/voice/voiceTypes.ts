/*** Voice screen shared types - alerts, claims, settings shapes ***/
export type AlertsBlock = Record<string, Record<string, string[]>>;

export type ClaimsBlock = Record<
  string,
  Record<string, Record<string, { claims: string[] }>>
>;

export interface PhrasesResponse {
  alerts: AlertsBlock;
  claims: ClaimsBlock;
}

export interface MindsetMeta {
  voice?: string;
  speed?: number;
  volumeMultiplier?: number;
}

export interface SettingsJson {
  global?: Record<string, unknown>;
  skills?: Record<string, MindsetMeta>;
  mindsets?: Record<string, MindsetMeta>;
  agentTts?: Record<string, unknown>;
}

export const CLAIM_TAXONOMY: string[] = [
  'tested',
  'reviewed',
  'deployed',
  'validated',
  'tests_authored',
  'approved',
];

export interface PhraseRef {
  mindset: string;
  category: string;
  /*** 1-based index, displayed as 01..NN ***/
  idx: number;
}
