# falcon-checkbox-group — API

## Selectors

- Angular: `falcon-angular-checkbox-group` (composes Angular `<falcon-angular-checkbox>` children — the Angular code path).
- Stencil Shadow: `<falcon-checkbox-group>` / Light: `<falcon-checkbox-group-tw>` — a **separate self-contained implementation** (raw native `<input>` rows, JSON-string `selectedValues`, `falcon-checkbox-group-change` event). React/Vue/Studio only; NOT rendered by the Angular wrapper.

## Import

```ts
import { FalconAngularCheckboxGroupComponent, FalconCheckboxGroupOption } from '@falcon/ui-core';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `options` | `FalconCheckboxGroupOption[]` | `[]` | Required. |
| `selectedValues` (setter) | `ReadonlyArray<string \| number> \| null \| undefined` | `[]` | Two-way via `selectedValuesChange`. Wrapper also implements CVA. |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | |
| `groupLabel` | `string?` | — | |
| `helperText` | `string?` | — | |
| `errorText` | `string?` | — | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Passed to each child checkbox. |
| `disabled` | `boolean` | `false` | |
| `useTailwind` | `boolean` | `true` | Forwarded to each child checkbox. |
| `name` | `string?` | — | |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `selectedValuesChange` | `Array<string \| number>` | Mirrors CVA write. |

## TypeScript types

```ts
// Angular wrapper (falcon-checkbox-group.component.ts:20-24) — value is string | number:
export interface FalconCheckboxGroupOption { value: string | number; label: string; disabled?: boolean; }
```

> **Type drift:** the **Stencil** type (`falcon-checkbox-group.types.ts:5-9`) uses `value: string` (string-only) + `selectedValues: string[]`, and the Stencil tags accept `selectedValues` as a JSON-serialised string OR array, emitting `FalconCheckboxGroupChangeDetail { values: string[] }` via `falcon-checkbox-group-change`. Angular consumers get the wider `string | number` wrapper type and never touch the Stencil contract. (GAP G10.)

## Stencil twin API (NOT the Angular path — for React/Vue/Studio)

| Aspect | `<falcon-checkbox-group(-tw)>` |
|---|---|
| `options` | `FalconCheckboxGroupOption[] \| string` (JSON parsed) |
| `selectedValues` | `string[] \| string` (JSON parsed; `@Prop({ mutable: true })`) |
| `orientation` / `size` / `disabled` | reflected `@Prop`s |
| `groupLabel` / `helperText` / `errorText` / `name` | `@Prop`s |
| Event | `falcon-checkbox-group-change` → `{ values: string[] }` |
| Rows | raw native `<input type="checkbox">` (NOT `<falcon-checkbox>`) |

## CVA / Reactive Forms

YES. Wrapper implements `ControlValueAccessor`. `writeValue([])` accepts the array; `registerOnChange` invoked on toggle; `setDisabledState` honors CVA disabled.

## Methods

None.

## Slots / template inputs

- None on Angular wrapper. Per-option label is `option.label` text only — no template / icon.

## Constraints

- Manages selection by value comparison via `Array.includes(value)`.
- Disables children when wrapper `disabled` OR CVA disabled OR per-option `disabled`.
- Uses `trackByValue` for *ngFor identity (now @for in templates).

## Accessibility

- Per-checkbox A11y inherited from `<falcon-angular-checkbox>` (real native inputs).
- `[CODE]` html:14-19 — the options container IS `role="group"` with `[attr.aria-label]="groupLabel ?? null"` (confirmed — resolves the prior "verify" flag). Note it uses `aria-label` (not `aria-labelledby` pointing at the rendered label span) — a minor refinement opportunity.
- Error text under the group has `role="alert"` (html:37-39); helper text has none.

## Verification
🟢 code-verified against the Angular wrapper + both Stencil group tags + types (read 2026-06-03). `role="group"` + `aria-label` 🟢 confirmed. Stencil-twin separate API + `value:string` type drift 🟢 confirmed.
