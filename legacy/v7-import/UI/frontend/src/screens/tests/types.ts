/*** Test draft + raw API row types ***/

export interface TestDraft {
  tcId: string;
  module: string;
  title: string;
  category: string;
  priority: string;
  given: string;
  when: string;
  then: string;
  tracesTo: string[];
  claims: string[];
}

export interface TestRow {
  tcId: string;
  module?: string;
  title?: string;
  priority?: string;
  type?: string;
  preconditions?: string[];
  steps?: string[];
  expected?: string[];
  requirements?: string[];
  extra?: Record<string, unknown>;
}

export const PRIORITY_ORDER: Record<string, number> = {
  P0: 0,
  P1: 1,
  P2: 2,
  P3: 3,
};

export function getCategory(t: TestRow): string {
  const ex = t.extra ?? {};
  return (ex.category as string) ?? t.type ?? '';
}

export function getGiven(t: TestRow): string {
  const ex = t.extra ?? {};
  return (
    (ex.given as string) ||
    (Array.isArray(t.preconditions) ? t.preconditions.join('\n') : '') ||
    ''
  );
}

export function getWhen(t: TestRow): string {
  const ex = t.extra ?? {};
  return (
    (ex.when as string) ||
    (Array.isArray(t.steps) ? t.steps.join('\n') : '') ||
    ''
  );
}

export function getThen(t: TestRow): string {
  const ex = t.extra ?? {};
  return (
    (ex.then as string) ||
    (Array.isArray(t.expected) ? t.expected.join('\n') : '') ||
    ''
  );
}

export function getTracesTo(t: TestRow): string[] {
  const ex = t.extra ?? {};
  const v = ex.tracesTo as unknown;
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === 'string') return v.split('|').filter(Boolean);
  if (Array.isArray(t.requirements)) return t.requirements;
  return [];
}

export function getClaims(t: TestRow): string[] {
  const ex = t.extra ?? {};
  const v = ex.claims as unknown;
  if (Array.isArray(v)) return v.map(String);
  if (typeof v === 'string') return v.split('|').filter(Boolean);
  return [];
}

export function priorityBadge(p?: string): 'critical' | 'high' | 'medium' | 'low' | 'info' {
  switch ((p ?? '').toUpperCase()) {
    case 'P0':
      return 'critical';
    case 'P1':
      return 'high';
    case 'P2':
      return 'medium';
    case 'P3':
      return 'low';
    default:
      return 'info';
  }
}
