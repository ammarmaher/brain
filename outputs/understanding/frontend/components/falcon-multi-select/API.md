# falcon-multi-select — API

## Selectors

- Angular: `falcon-angular-multi-select`
- Stencil Shadow: `<falcon-multi-select>` (tag `'falcon-multi-select'`, `shadow: true`)
- Stencil Light: `<falcon-multi-select-tw>` (tag `'falcon-multi-select-tw'`, `shadow: false`)

## Import

```ts
import { FalconAngularMultiSelectComponent, FalconMultiSelectOption } from '@falcon/ui-core';
```

Add `FalconAngularMultiSelectComponent` to the consuming standalone component's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is already declared on the wrapper internally — the host does NOT need it.

## Inputs (all on `FalconAngularMultiSelectComponent`)

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string?` | `undefined` | Renders a `<label>` above the field (selection mode). |
| `placeholder` | `string?` | `undefined` | Shown in the trigger when nothing is selected. |
| `helperText` | `string?` | `undefined` | Helper paragraph below; hidden when `errorText` set. |
| `errorText` | `string?` | `undefined` | Error paragraph below with `role="alert"`. **Naming inconsistency vs `errorMessage` on dropdown/input — GAP G2.** Forwarded to Stencil as `error-message`. |
| `options` | `FalconMultiSelectOption[] \| null` (setter) | `[]` | Push-options-on-ready setter; re-pushes onto the live Stencil element — `[CODE]` ts:98-103,168-188. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Maps to `--falcon-multi-select-min-height-*`. |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | Visual validation state. |
| `readonly` | `boolean` | `false` | Freezes selection. In chip-list mode makes the +N badge non-clickable + dims the strip. |
| `required` | `boolean` | `false` | Red asterisk + `aria-required`. |
| `clearable` | `boolean` | `false` | Clear-all X (selection mode). |
| `searchable` | `boolean` | `false` | In-panel search field (selection mode). |
| `name` | `string?` | `undefined` | Native name attr. |
| `inputId` | `string?` | auto `falcon-ams-{seq}` | Tie label `for` + custom id. |
| `searchPlaceholder` | `string` | `'Search…'` | Search field placeholder. |
| `emptyMessage` | `string` | `'No results'` | Shown when the filtered list is empty. |
| `maxChipsVisible` | `number` | `3` | Chips shown before the "+N more" overflow pill (selection) / before "+N" button (chip-list). |
| `showSelectAll` | `boolean` | `false` | Tri-state "Select all" row at the panel top. |
| `selectAllLabel` | `string` | `'Select all'` | |
| `displayMode` | `'default' \| 'chip-list'` | `'default'` | **Wrapper-only render switch.** `default` = Stencil selection picker; `chip-list` = display-only Angular chip strip + dialog popover (Stencil NOT rendered) — `[CODE]` ts:56, html:12-97. |
| `popoverTitle` | `string?` | `undefined` | chip-list popover heading (consumer pre-translates). When unset the dialog uses `aria-label="Shared with more"`. |
| `iconLeft` | `boolean` | `false` | Unified icon-slot toggle (2026-05-17). `iconRight` intentionally skipped — the chevron occupies it. |
| `useTailwind` | `boolean` | `true` | **Render-path switch (selection mode).** `true` → `<falcon-multi-select-tw>` (Light, portaled panel). `false` → `<falcon-multi-select>` (Shadow, inline panel). |
| `wrapperClass / triggerClass / panelClass / optionClass / labelClass` | `string` | `''` | Extra Tailwind classes; **Tailwind/Light path only**, forwarded as `*-extra-class` attrs. |

### Stencil-only props (NOT exposed on the Angular wrapper)

| Prop | Tag | Type | Default | Notes |
|---|---|---|---|---|
| `appendTo` | `-tw` only | `'body' \| 'inline'` | `'body'` | Portal target. `'body'` portals the panel into `.falcon-overlay-container`; `'inline'` opts back to legacy inline render — `[CODE]` falcon-multi-select-tw.tsx:131. The Shadow tag has NO `appendTo` (always inline). |

> Mutable prop `values: ReadonlyArray<string|number>` exists on both Stencil tags but the Angular wrapper drives it via CVA + `[values]` property binding — do not bind directly.

## Outputs (Angular wrapper)

| Name | Payload | Notes |
|---|---|---|
| `valuesChange` | `ReadonlyArray<string \| number>` | Canonical CVA write; fires on toggle / remove / clear / select-all. |
| `opened` | `void` | Panel opened (selection mode). Also triggers the Top-Layer acquire. |
| `closed` | `void` | Panel closed (selection mode). Releases the Top-Layer promotion. |
| `showMoreClick` | `void` | Fired when the chip-list "+N" button opens the popover — `[CODE]` ts:136,308. |

## Stencil events (raw tags — both Shadow + `-tw`, 1:1)

| Event | Detail | Surfaced as wrapper `@Output`? |
|---|---|---|
| `falcon-change` | `{ value: ReadonlyArray<string\|number> }` | → `valuesChange` (via `handleChange`). |
| `falcon-clear` | `{ value: [] }` | → folded into `valuesChange` (`handleClear` = `handleChange`). |
| `falcon-open` | `{ value: null }` | → `opened`. |
| `falcon-close` | `{ value: null }` | → `closed`. |
| `falcon-add` | `{ value: string\|number }` | **NOT surfaced** (GAP G6). |
| `falcon-remove` | `{ value: string\|number }` | **NOT surfaced** (GAP G6/G10). |
| `falcon-search` | `{ value: string }` | **NOT surfaced** (GAP G6). |
| `falcon-blur` | `{ value: values[] }` | → `onTouched()` (CVA), no public output. |

## TypeScript types

`libs/falcon-ui-core/src/components/falcon-multi-select/falcon-multi-select.types.ts`:

```ts
interface FalconMultiSelectOption { value: string | number; label: string; disabled?: boolean; }
type FalconMultiSelectSize  = 'sm' | 'md' | 'lg';
type FalconMultiSelectState = 'default' | 'error' | 'success' | 'warning';
type FalconMultiSelectValue = ReadonlyArray<string | number>;
type FalconMultiSelectChangeDetail = FalconEventDetail<ReadonlyArray<string | number>>;
type FalconMultiSelectItemDetail   = FalconEventDetail<string | number>;   // add/remove
type FalconMultiSelectSearchDetail = FalconEventDetail<string>;
type FalconMultiSelectToggleDetail = FalconEventDetail<null>;              // open/close
// Wrapper-local:
export type FalconMultiSelectDisplayMode = 'default' | 'chip-list';
```

> ⚠️ `[CODE]` Export drift (verified 2026-06-03 W1-b): `FalconMultiSelectDisplayMode` is `export`ed from `falcon-multi-select.component.ts:56`, but the component barrel `falcon-multi-select/index.ts` re-exports ONLY `FalconAngularMultiSelectComponent` + `FalconMultiSelectOption` — it does NOT re-export the display-mode type. The `@falcon/ui-core/angular` barrel uses `export * from './components/falcon-multi-select'`, so `import { FalconMultiSelectDisplayMode } from '@falcon/ui-core'` does **NOT resolve**. Bind `displayMode="chip-list"` as a string literal (template), or type the field with the inline union, until the component `index.ts` re-exports the type.

## Reflected props (Stencil)

`size`, `state`, `disabled`, `readonly`, `required`, `clearable`, `searchable` are `@Prop({ reflect: true })` on BOTH tags → `:host([state='error'])`, `:host([searchable])`, etc. CSS rules can target them. `values`/`options`/`label`/`placeholder`/`maxChipsVisible`/`showSelectAll` are NOT reflected.

## Mutable props (Stencil)

`values` is `@Prop({ mutable: true, reflect: false })` and `@Watch`ed (`onValuesChange` keeps the select-all master tri-state in sync). `options` is `@Watch`ed (`onOptionsChange` re-seeds `activeIndex`).

## CVA / ngModel / Reactive Forms

**YES — full ControlValueAccessor support.**

```ts
providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FalconAngularMultiSelectComponent), multi: true }],
```

- `writeValue(value)` — coerces to array, sets the `values` signal, AND calls `pushOptions()` so the Stencil `values` prop re-syncs — `[CODE]` ts:194-198.
- `registerOnChange(fn)` — invoked on every `falcon-change` (toggle/remove/clear/select-all).
- `registerOnTouched(fn)` — invoked on `falcon-blur`.
- `setDisabledState(isDisabled)` — toggles the internal `disabled` signal.

`[(ngModel)]`, `formControl`, `formControlName` all work. The value is always an array (possibly empty), never a scalar.

## Methods (Stencil only — call via element ref)

| Method | Tag | Description |
|---|---|---|
| `openPanel()` | both | Programmatically open the panel. |
| `closePanel()` | both | Programmatically close. |
| `setFocus()` | both | Focus the trigger button. |
| `clear()` | both | Clear all values (same as clear-X). |

> The Angular wrapper does NOT proxy any of these. To call them, reach the inner Stencil element via the `multiSelectEl` ViewChild — **GAP G7**. There is no Angular-side `openPanel()`/`clear()`.

## Slots / template inputs

- **Stencil Shadow (`<falcon-multi-select>`)**: `slot="options"` (custom option markup — wrapper projects `<ng-content select="[slot=options]" slot="options">`), `slot="icon-left"`.
- **Stencil Light (`<falcon-multi-select-tw>`)**: `slot="icon-left"` only. **NO `slot="options"`** — the listbox in the `-tw` path always renders the built-in option rows. The wrapper's Tailwind branch only projects `<ng-content select="[slot=icon-left]">` — divergence, **GAP G11**.
- **Angular wrapper**: no `ng-template`/`ContentChild` per-option or per-chip template — **GAP G1**.

## Sizes / states / variants / appearances

- Sizes: `sm` / `md` / `lg` (control **min-height** — chips can grow it; not a fixed height like input).
- States: `default` / `error` / `success` / `warning`.
- No `variant` / `appearance` axis (unlike input). `displayMode` (`default` / `chip-list`) is the only render-shape switch and is wrapper-only.

## Constraints

- The two real consumers use `displayMode="chip-list"` exclusively — selection-mode inputs (`searchable`, `showSelectAll`, `clearable`, `panelClass`, …) are **no-ops** in chip-list mode (`[CODE]` html:7-10).
- Tailwind/Light path lacks `slot="options"` (Shadow-only).
- `appendTo` is `-tw`-only and not surfaced on the wrapper.
- `maxChipsVisible` is a **display** cap, not a selection cap — the full set is still committed.
- No `maxSelected` count cap (GAP G8); no grouped options (GAP G5); no `iconUrl` on the option type (GAP G9).

## Accessibility

Selection trigger (both tags):
- `role="combobox"` + `aria-haspopup="listbox"` + `aria-expanded` + `aria-controls={listboxId}`.
- `aria-invalid` / `aria-required` / `aria-describedby` (helper+error ids) / `aria-disabled`.
- Listbox: `role="listbox"` + `aria-multiselectable="true"` + `aria-labelledby={triggerId}`; each row `role="option"` + `aria-selected` + `aria-disabled`.
- Select-all master: real `<input type="checkbox">` with `aria-checked` cycling `false`/`mixed`/`true` + JS `indeterminate` DOM property synced in `componentDidRender` — `[CODE]` tsx:265-270.
- Chips' remove buttons: `aria-label="Remove {label}"`, `tabindex={-1}`, `onMouseDown=preventDefault`. Clear-all: `aria-label="Clear all selections"`, `tabindex={-1}`.
- Error paragraph `role="alert"`; required asterisk `aria-hidden`.
- Keyboard (trigger/search): ArrowUp/Down move active (skip disabled, wrap), Home/End, Enter/Space toggle, Esc closes + refocuses trigger, Tab closes — `[CODE]` tsx:310-349.

chip-list dialog (`displayMode="chip-list"`, Angular template):
- "+N" is a real `<button>` with `aria-haspopup="dialog"` + `aria-expanded` + `aria-controls` + `aria-disabled` when readonly — `[CODE]` html:32-48.
- Popover is `role="dialog"`, `tabindex="-1"` (programmatically focused on open), `aria-labelledby` (title) or `aria-label="Shared with more"`. Outside-click + Esc close, focus restored to the trigger — `[CODE]` ts:312-382. Each name row is decorative (no role="option" — it is informational, not a listbox).

## Verification
🟢 code-verified against the wrapper + both Stencil tags + types (read 2026-06-03). Selection-mode a11y + chip-list dialog a11y both 🟢 code-verified. Slot divergence (G11) + method-proxy gap (G7) 🟢 confirmed. 🟢 RE-VERIFIED 2026-06-03 (W1-b) against the live wrapper `.ts`+`.html`+`index.ts`: all `@Input`/`@Output`, the array-coercing `writeValue`, full CVA, `[values]` property binding, `displayMode` chip-list path, and `showMoreClick` confirmed. ONE correction applied: documented that `FalconMultiSelectDisplayMode` is NOT re-exported by the component `index.ts` (not importable from `@falcon/ui-core`). Note: the multi-select wrapper has NO `disabledFromInput` property setter — unlike dropdown, `[disabled]` works ONLY via CVA `setDisabledState` (the live consumers are all `displayMode="chip-list"` which uses its own `readonly`-gated path, so this is latent, not currently exercised).
