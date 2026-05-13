/*** Gap draft + raw API row types ***/

export interface GapDraft {
  id: string;
  module?: string;
  severity?: string;
  category?: string;
  description?: string;
  title?: string;
  evidence?: string;
  suggestedFix?: string;
  tracesTo?: string[];
  status?: string;
}

export interface GapRow {
  id: string;
  module?: string;
  severity?: string;
  category?: string;
  type?: string;
  title?: string;
  description?: string;
  affectedServices?: string[];
  sourcePath?: string;
  extra?: Record<string, unknown>;
}

export const SEVERITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
  info: 4,
};

export function gapStatus(g: GapRow): string {
  const ex = (g.extra ?? {}) as Record<string, unknown>;
  return (ex.status as string) ?? 'open';
}

export function gapCategory(g: GapRow): string {
  const ex = (g.extra ?? {}) as Record<string, unknown>;
  return (ex.category as string) ?? g.type ?? '';
}

export function gapEvidence(g: GapRow): string {
  return ((g.extra ?? {}).evidence as string) ?? '';
}

export function gapSuggestedFix(g: GapRow): string {
  return ((g.extra ?? {}).suggestedFix as string) ?? '';
}

export function gapTracesTo(g: GapRow): string[] {
  const t = (g.extra ?? {}).tracesTo as unknown;
  if (Array.isArray(t)) return t.map(String);
  return [];
}
