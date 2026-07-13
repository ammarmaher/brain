# falcon-combobox — API

> Sweep-refreshed 2026-06-03 (B04). Corrected vs prior dossier: `filterChange` is internally debounced 250ms (NOT every keystroke); the combobox renders NO helper/error/required (so "error message has role=alert" was wrong); there is NO `aria-busy`; there are NO Stencil `@Method()`s; Stencil events use **camelCase** names; auto-id is `falcon-acbx-{seq}`.

## Selectors / tags

- Angular: `falcon-angular-combobox`
- Stencil Shadow: `<falcon-combobox>` (`shadow:true`) — `[CODE]` `falcon-combobox.tsx:24-28`
- Stencil Light: `<falcon-combobox-tw>` (`shadow:false`) — `[CODE]` `falcon-combobox-tw.tsx:32-35`

## Import

```ts
import { FalconAngularComboboxComponent, FalconComboboxItem } from '@falcon/ui-core';
```

`CUSTOM_ELEMENTS_SCHEMA` is set on the wrapper (`[CODE]` `.ts:51`) — host does not need it.

## Inputs (Angular wrapper `FalconAngularComboboxComponent`)

`[CODE]` `falcon-combobox.component.ts:96-112`.

| Name | Type | Default | Notes |
|---|---|---|---|
| `items` | `FalconComboboxItem[]` | `[]` | Suggestion list. NOT a setter — bound as a property (`[items]` at `.html:24,42`). |
| `placeholder` | `string?` | `undefined` | |
| `label` | `string?` | `undefined` | Renders `<label htmlFor>`. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `allowFreeText` | `boolean` | `false` | When true, Enter commits the typed query as the value even if not in `items`. |
| `clearable` | `boolean` | **`true`** | ⚠️ Defaults to TRUE (unlike dropdown's `false`). |
| `loading` | `boolean` | `false` | Shows a CSS spinner in the trailing icon area; suppresses the clear-X while spinning. Visual hint only. |
| `noResultsMessage` | `string` | `'No matches'` | Empty-panel text. |
| `inputId` | `string?` | auto `falcon-acbx-{seq}` | `[CODE]` `.ts:122`. |
| `useTailwind` | `boolean` | `true` | Render-path switch → `<falcon-combobox-tw>` (default) / `<falcon-combobox>`. |
| `wrapperClass` | `string` | `''` | Tailwind path only (→ `wrapper-extra-class`). |
| `inputClass` | `string` | `''` | Tailwind path only (→ `input-extra-class`). |
| `panelClass` | `string` | `''` | Tailwind path only (→ `panel-extra-class`). |
| `optionClass` | `string` | `''` | Tailwind path only (→ `option-extra-class`). |
| `labelClass` | `string` | `''` | Tailwind path only (→ `label-extra-class`). |
| `disabled` | (via CVA only) | `false` | ⚠️ **No `@Input() disabled` property setter.** The internal `disabled` signal is written ONLY by CVA's `setDisabledState` (`.ts:130`); the template binds `[attr.disabled]="disabled()?'':null"`. A non-Forms `[disabled]="true"` will NOT work (GAP G3) — contrast dropdown's `disabledFromInput` setter. |

> **NOT present** (vs `<falcon-input>`/`<falcon-dropdown>`): `helperText`, `errorMessage`/`errorText`, `state`, `required`, `variant`, `appearance`, `readonly`, `name`, `searchable`. See GAPS.

### Stencil-only props (NOT on the wrapper; on the raw tags)

`[CODE]` `falcon-combobox.tsx:43` / `falcon-combobox-tw.tsx:49`:

| Prop | Type | Default | Notes |
|---|---|---|---|
| `clearAriaLabel` | `string` | `'Clear'` | aria-label on the clear-X. Not surfaced on the wrapper (GAP). |
| `wrapperExtraClass` / `inputExtraClass` / `panelExtraClass` / `optionExtraClass` / `labelExtraClass` | `string` | `''` | `-tw` ONLY (`-tw.tsx:51-56`); fed by the wrapper's `*Class` inputs. The Shadow `<falcon-combobox>` has none. |

> Mutable prop `value: string` (`@Prop({mutable:true, reflect:false})`) on both tags — wrapper drives it via CVA.

## Outputs

`[CODE]` `falcon-combobox.component.ts:114-116`.

| Name | Payload | Notes |
|---|---|---|
| `valueChange` | `string` | Canonical CVA write (emitted from `handleSelect` and `handleClear`). |
| `filterChange` | `string` | The typed query. Emitted by the wrapper's `handleFilter` off the Stencil's **debounced** filter event (250ms). |
| `cleared` | `void` | Clear-X pressed (also emits `valueChange('')` + calls `onTouched`). |

### Stencil events on the bare tags (camelCase — divergence from `falcon-*` convention)

`[CODE]` `falcon-combobox.tsx:53-60` / `falcon-combobox-tw.tsx:63-70`. All `bubbles:true, composed:true`:

| Event | Detail | Re-emitted by wrapper |
|---|---|---|
| `falconComboboxFilter` | `{ query: string }` | → `filterChange` (debounced 250ms inside Stencil — `.tsx:197-201`) |
| `falconComboboxSelect` | `{ value: string; label: string }` | → `valueChange` |
| `falconComboboxClear` | `void` | → `cleared` + `valueChange('')` |

> ⚠️ `[CODE]` These use camelCase event names (`falconComboboxSelect`), NOT the kebab `falcon-*` convention every other Falcon component uses (`falcon-change`, etc.). The wrapper binds `(falconComboboxSelect)` directly (`.html:25-27,43-45`). Naming-convention divergence — see GAPS.
> The Stencil emits **NO open/close event** for the listbox panel — the wrapper drives Top-Layer promotion via a `MutationObserver` instead (see INTEGRATION_VALIDATION).

## TypeScript types

⚠️ `[CODE]` **Two near-identical item shapes exist (drift):**
- `FalconComboboxItem` — declared in the **wrapper** (`.ts:36-40`) and re-exported by the barrel (`index.ts:3`); this is what `@falcon/ui-core` exposes.
- `ComboboxItem` — declared in `falcon-combobox.types.ts:5-9`; this is what BOTH Stencil components import and use internally.

```ts
// wrapper-exported (and the one in `import { FalconComboboxItem }`)
export interface FalconComboboxItem { value: string; label: string; disabled?: boolean; }
// types-file (used by the .tsx components)
export interface ComboboxItem { value: string; label: string; disabled?: boolean; }
export type FalconComboboxSize = 'sm' | 'md' | 'lg';
export interface FalconComboboxFilterDetail { query: string; }
export interface FalconComboboxSelectDetail { value: string; label: string; }
```

They are structurally identical today; keeping two names is a drift hazard (GAP).

## Reflected props (Stencil)

`[CODE]` Both tags reflect only `size` and `disabled` (`@Prop({reflect:true})`). `value`, `items`, `label`, `placeholder`, `allowFreeText`, `clearable`, `loading`, `noResultsMessage`, `clearAriaLabel`, `inputId` are NOT reflected.

## CVA / ngModel / Reactive Forms

**YES.** `[CODE]` `.ts:52-58,124-130`. `writeValue(value:string)` sets the internal signal; `registerOnChange` fires on select/clear; `registerOnTouched` fires on blur/clear; `setDisabledState` toggles the disabled signal. Value type is **`string`** only (not `string | number` like dropdown — GAP G9). `[(ngModel)]` / `formControlName` work.

## Methods

`[CODE]` **NONE on the wrapper AND none on the Stencil components.** `falcon-combobox.tsx` / `-tw.tsx` define `openPanel`/`closePanel`/`selectItem` etc. as **private** methods — there are NO `@Method()` decorators (unlike dropdown). So there is nothing to proxy and no public imperative API. (Correction vs prior dossier, which assumed "Stencil exposes openPanel presumably".)

## Slots / template inputs

`[CODE]` **NONE.** Neither the wrapper nor either Stencil component declares any `<slot>` or `ng-content` — only `label` text + the item `label` string are rendered (no per-item template, no icon — GAP G6). (Correction: prior dossier said "Stencil might support slot=options — verify"; confirmed NO.)

## Supported sizes / states / variants

- Sizes: `sm` / `md` / `lg` (heights from `--falcon-combobox-height-*`: 34 / 40 / 44 px).
- States: **none** (no `state` input — GAP G2).
- Variants / appearances: **none** (GAP G5).

## Constraints

- `[CODE]` `filterChange` is debounced 250ms **inside the Stencil** (`.tsx:197-201`) — do NOT add a second debounce in the handler; you MAY still pipe it through RxJS for switchMap cancellation.
- `[CODE]` `allowFreeText=false` does NOT block typing — the user can type anything; on `Enter`/`Tab` only an active suggestion is committed (free text is discarded unless `allowFreeText`). While typing with `allowFreeText=false`, `this.value` is set to `''` (`.tsx:193`).
- `[CODE]` No `@Input() disabled` — disable via Reactive Forms `control.disable()` (CVA), not `[disabled]`.
- `[CODE]` Panel renders **inline** (no body-portal) — uses the native Popover API (via the wrapper's MutationObserver) for Top-Layer escape; on browsers without the Popover API the panel stays inline and can be clipped by an `overflow:hidden` ancestor.
- `[CODE]` `clearable` defaults to `true`.

## Accessibility

`[CODE]` `falcon-combobox.tsx:231-308` / `falcon-combobox-tw.tsx:215-294`:
- `role="combobox"` on the input; `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` (listbox id), **`aria-autocomplete="list"`** (present — corrects prior "verify"), **`aria-activedescendant`** → active option id (present; BETTER than dropdown, which lacks it), `aria-disabled`, native `disabled`.
- `role="listbox"` on the panel with `aria-label={label ?? 'Options'}`; `role="option"` per item with `aria-selected` + `aria-disabled`; each option has an `id` `{resolvedId}-opt-{idx}`.
- Clear button: `aria-label={clearAriaLabel}` (default 'Clear'), `tabindex={-1}`, `onMouseDown preventDefault`.
- Keyboard: ArrowDown/Up (clamped, no wrap), Enter (select active OR commit free text if `allowFreeText`), Tab (select active + close), Esc (close + refocus input). The Shadow path also scrolls the active option into view (`scrollActiveOptionIntoView`, `.tsx:178-187`); the `-tw` path does NOT scroll-into-view (minor parity gap).
- ⚠️ `[CODE]` **No `aria-busy`** when `loading` (the spinner is `aria-hidden`) — corrects prior dossier. No live region for result count. **No `role="alert"` error** (there is no error element at all).

## Verification
🟢 code-verified against `falcon-combobox.component.{ts,html}` + `falcon-combobox.tsx` + `falcon-combobox-tw.tsx` + `falcon-combobox.types.ts` (read 2026-06-03). 🟢 RE-VERIFIED 2026-06-03 (W1-b) against the live wrapper `.ts`+`.html`+`index.ts`: confirmed (a) camelCase Stencil events `falconComboboxSelect`/`falconComboboxFilter`/`falconComboboxClear` bound directly in the template (NOT `falcon-change`); (b) NO `@Input() disabled` property setter — the `disabled` signal is written ONLY by CVA `setDisabledState`, template binds `[attr.disabled]="disabled()?'':null"`, so `[disabled]="true"` outside Forms is inert (GAP G3 holds); (c) `items` is a plain property binding (not a setter), `FalconComboboxItem.value` is `string`-only; (d) `clearable` default `true`; (e) NO helper/error/state/required/readonly/name/searchable inputs; (f) full CVA with `string` value; (g) Top-Layer driven by `MutationObserver` (no Stencil open/close event). Accurate — no corrections to API.md.
