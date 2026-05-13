/*** Skills + Mindsets screen - shared types matching backend admin endpoints ***/

export interface SkillSettingsBlock {
  voice: string;
  speed?: number;
  volumeMultiplier?: number;
  phrases?: Record<string, string>;
  triggers?: string[];
  beep?: unknown[];
  beepGapMs?: number | null;
  disabled?: boolean;
  /*** allow forward-compat extras ***/
  [k: string]: unknown;
}

export type SkillsBlock = Record<string, SkillSettingsBlock>;

export interface MindsetBlock {
  voice: string;
  speed?: number;
  volumeMultiplier?: number;
  phrases?: Record<string, string>;
  [k: string]: unknown;
}

export type MindsetsBlock = Record<string, MindsetBlock>;

export interface SkillCatalogEntry {
  name: string;
  category: string;
  path: string;
  triggers: string[];
  description?: string | null;
}

export interface JobCard extends SkillCatalogEntry {}

export interface SkillsCatalogResponse {
  skills: SkillCatalogEntry[];
  jobs: JobCard[];
}

/*** Merged row used by the Skills tab table ***/
export interface SkillRow {
  name: string;
  category: string;
  path: string;
  triggers: string[];
  description?: string | null;
  voice?: string;
  voiceFull?: string;
  enabled: boolean;
  block?: SkillSettingsBlock;
}
