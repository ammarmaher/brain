/*** Gap form — used by both add modal and detail-pane edit ***/
import { Field, Select, TextArea, TextInput } from '../shared/Field';
import type { GapDraft } from './types';

interface GapFormProps {
  value: GapDraft;
  onChange: (next: GapDraft) => void;
  modules: string[];
  lockId?: boolean;
  lockModule?: boolean;
}

const SEVERITIES = ['critical', 'high', 'medium', 'low', 'info'] as const;
const STATUSES = ['open', 'in_progress', 'archived'] as const;
const CATEGORIES = [
  'missing-feature',
  'missing-edge-case',
  'inconsistency',
  'spec-conflict',
  'performance',
  'security',
  'usability',
  'docs',
  'other',
];

export default function GapForm({ value, onChange, modules, lockId, lockModule }: GapFormProps) {
  const set = (patch: Partial<GapDraft>) => onChange({ ...value, ...patch });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Field label="ID" required className="md:col-span-1">
        <TextInput
          value={value.id}
          onChange={(e) => set({ id: e.target.value })}
          disabled={lockId}
          placeholder="GAP-XX-001"
        />
      </Field>
      <Field label="Module" required>
        <Select
          value={value.module ?? ''}
          onChange={(e) => set({ module: e.target.value })}
          disabled={lockModule}
        >
          <option value="">— select —</option>
          {modules.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Severity" required>
        <Select
          value={value.severity ?? 'medium'}
          onChange={(e) => set({ severity: e.target.value })}
        >
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Category">
        <Select
          value={value.category ?? ''}
          onChange={(e) => set({ category: e.target.value })}
        >
          <option value="">— select —</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Status">
        <Select value={value.status ?? 'open'} onChange={(e) => set({ status: e.target.value })}>
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Title" className="md:col-span-2">
        <TextInput
          value={value.title ?? ''}
          onChange={(e) => set({ title: e.target.value })}
        />
      </Field>
      <Field label="Description" required className="md:col-span-2">
        <TextArea
          rows={4}
          value={value.description ?? ''}
          onChange={(e) => set({ description: e.target.value })}
        />
      </Field>
      <Field label="Evidence" className="md:col-span-2">
        <TextArea
          rows={3}
          value={value.evidence ?? ''}
          onChange={(e) => set({ evidence: e.target.value })}
        />
      </Field>
      <Field label="Suggested fix" className="md:col-span-2">
        <TextArea
          rows={3}
          value={value.suggestedFix ?? ''}
          onChange={(e) => set({ suggestedFix: e.target.value })}
        />
      </Field>
      <Field label="Traces to (comma-separated PRD IDs)" className="md:col-span-2">
        <TextInput
          value={(value.tracesTo ?? []).join(', ')}
          onChange={(e) =>
            set({
              tracesTo: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
          placeholder="PRD-CG-3.2, PRD-CG-4.1"
        />
      </Field>
    </div>
  );
}
