/*** Test case form — Gherkin Given/When/Then ***/
import { Field, Select, TextArea, TextInput } from '../shared/Field';
import type { TestDraft } from './types';

const PRIORITIES = ['P0', 'P1', 'P2', 'P3'] as const;
const CATEGORIES = [
  'happy_path',
  'edge_case',
  'negative',
  'error_handling',
  'integration',
  'performance',
  'security',
  'regression',
];

interface TestFormProps {
  value: TestDraft;
  onChange: (next: TestDraft) => void;
  modules: string[];
  lockId?: boolean;
  lockModule?: boolean;
}

export default function TestForm({
  value,
  onChange,
  modules,
  lockId,
  lockModule,
}: TestFormProps) {
  const set = (patch: Partial<TestDraft>) => onChange({ ...value, ...patch });

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <Field label="TC ID" required>
        <TextInput
          value={value.tcId}
          onChange={(e) => set({ tcId: e.target.value.toUpperCase() })}
          disabled={lockId}
          placeholder="TC-CG-001"
        />
      </Field>
      <Field label="Module" required>
        <Select
          value={value.module}
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
      <Field label="Priority" required>
        <Select value={value.priority} onChange={(e) => set({ priority: e.target.value })}>
          {PRIORITIES.map((p) => (
            <option key={p} value={p}>
              {p}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Category" required>
        <Select value={value.category} onChange={(e) => set({ category: e.target.value })}>
          <option value="">— select —</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </Select>
      </Field>
      <Field label="Title" required className="md:col-span-2">
        <TextInput value={value.title} onChange={(e) => set({ title: e.target.value })} />
      </Field>
      <Field label="Given" required className="md:col-span-2">
        <TextArea
          rows={3}
          value={value.given}
          onChange={(e) => set({ given: e.target.value })}
          placeholder="The starting state"
        />
      </Field>
      <Field label="When" required className="md:col-span-2">
        <TextArea
          rows={3}
          value={value.when}
          onChange={(e) => set({ when: e.target.value })}
          placeholder="The action under test"
        />
      </Field>
      <Field label="Then" required className="md:col-span-2">
        <TextArea
          rows={3}
          value={value.then}
          onChange={(e) => set({ then: e.target.value })}
          placeholder="The expected outcome"
        />
      </Field>
      <Field label="Traces to (PRD IDs, comma-separated)" className="md:col-span-2">
        <TextInput
          value={value.tracesTo.join(', ')}
          onChange={(e) =>
            set({
              tracesTo: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </Field>
      <Field label="Claims (comma-separated)" className="md:col-span-2">
        <TextInput
          value={value.claims.join(', ')}
          onChange={(e) =>
            set({
              claims: e.target.value
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean),
            })
          }
        />
      </Field>
    </div>
  );
}
