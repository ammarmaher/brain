# falcon-dropdown — API

> Sweep-refreshed 2026-06-03 (B04). Corrected vs prior dossier: the Angular wrapper DOES forward `slot="options"` (and `slot="icon-left"`) in the Shadow branch; auto-id prefix is `falcon-ad-{seq}`; `iconLeft` input documented; `loading` input documented.

## Selectors / tags

- Angular: `falcon-angular-dropdown`
- Stencil Shadow: `<falcon-dropdown>` (`shadow:true`) — `[CODE]` `falcon-dropdown.tsx:39-43`
- Stencil Light: `<falcon-dropdown-tw>` (`shadow:false`) — `[CODE]` `falcon-dropdown-tw.tsx:73-77`

## Import

```ts
import { FalconAngularDropdownComponent, FalconDropdownOption } from '@falcon/ui-core';
```

Add `FalconAngularDropdownComponent` to the host standalone component's `imports`. `CUSTOM_ELEMENTS_SCHEMA` is set internally on the wrapper (`[CODE]` `falcon-dropdown.component.ts:75`) — the host does NOT need it.

## Inputs (Angular wrapper `FalconAngularDropdownComponent`)

`[CODE]` `falcon-dropdown.component.ts:120-189`.

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string?` | `undefined` | Renders `<label>` above; tied to trigger via `htmlFor`. |
| `placeholder` | `string?` | `undefined` | Shown in trigger when no value. |
| `helperText` | `string?` | `undefined` | Helper paragraph; hidden when error present. |
| `errorText` | `string?` | `undefined` | **Wrapper input name is `errorText`** → mapped to the Stencil `error-message` attr in the template (`[CODE]` `.html:16,52`). The Stencil prop is `errorMessage`. Naming inconsistency vs `<falcon-input>`/`<falcon-textarea>` (`errorMessage`) — GAP G2. |
| `options` | `FalconDropdownOption[] \| null \| undefined` | `[]` | Setter (`[CODE]` `.ts:128-133`) stores `_options` and calls `pushOptions()` to the live Stencil element with a race-guarded async assign. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Maps to `--falcon-dropdown-height-*`. |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | Visual validation state. |
| `variant` | `'form' \| 'search' \| 'grid'` | `'form'` | Wave 9.C visual variant (same family as `<falcon-input>`). |
| `appearance` | `'default' \| 'filled' \| 'ghost'` | `'default'` | Wave 9.C surface appearance. |
| `readonly` | `boolean` | `false` | |
| `required` | `boolean` | `false` | Red asterisk after label + `aria-required`. |
| `clearable` | `boolean` | `false` | X clear-button when a value is selected. |
| `searchable` | `boolean` | `false` | Renders a search input inside the panel; auto-focuses it on open. |
| `name` | `string?` | `undefined` | Native name attr on trigger button. |
| `inputId` | `string?` | auto `falcon-ad-{seq}` | `[CODE]` `.ts:190-193`. Drives label `for` + trigger id. |
| `searchPlaceholder` | `string` | `'Search…'` | |
| `emptyMessage` | `string` | `'No results'` | |
| `iconLeft` | `boolean` | `false` | Wave 2026-05-17 unified icon-slot. Shows a leading icon region fed by `ng-content select="[slot=icon-left]"`. `iconRight` is intentionally skipped (chevron owns the end edge). |
| `loading` | `boolean` | `false` | Wave 15 follow-up. Adds host class `.falcon-angular-dropdown-loading` + `aria-busy="true"` on the host (`[CODE]` `.ts:164-166`). Visual treatment is host-class-driven; pass-through only. |
| `useTailwind` | `boolean` | `true` | **Render-path switch.** `true` → `<falcon-dropdown-tw>` (Light DOM, body-portaled panel). `false` → `<falcon-dropdown>` (Shadow DOM, inline panel). |
| `disabled` | `boolean \| string` | `false` | **Property-binding setter** `disabledFromInput` (`[CODE]` `.ts:186-189`). Accepts boolean OR string-truthy (`''`/`'true'`). Writes the same internal `disabled` signal that CVA's `setDisabledState` uses. ⚠️ MUST be a property binding — see Constraints. |
| `wrapperClass` | `string` | `''` | Extra Tailwind classes on wrapper. **Tailwind path only.** |
| `triggerClass` | `string` | `''` | Extra classes on trigger button. **Tailwind path only.** |
| `panelClass` | `string` | `''` | Extra classes on panel. **Tailwind path only.** |
| `optionClass` | `string` | `''` | Extra classes on each option. **Tailwind path only.** |
| `labelClass` | `string` | `''` | Extra classes on label. **Tailwind path only.** |

### Stencil-only props (NOT on the Angular wrapper; available on the raw tags)

| Prop | Type | Default | Where |
|---|---|---|---|
| `appendTo` | `'body' \| 'inline'` | `'body'` | **`<falcon-dropdown-tw>` ONLY** (`[CODE]` `falcon-dropdown-tw.tsx:118`). Selects body-portal vs legacy inline. The Shadow `<falcon-dropdown>` has NO `appendTo` (always inline). |

> Mutable prop `value: string | number | null` exists on both Stencil tags (`@Prop({mutable:true, reflect:false})`) but the Angular wrapper drives it via CVA — do not bind directly.

## Outputs

`[CODE]` `falcon-dropdown.component.ts:169-171`.

| Name | Payload | Notes |
|---|---|---|
| `valueChange` | `string \| number \| null` | Mirrors the CVA write (canonical). Emitted by `handleChange` / `handleClear`. |
| `opened` | `void` | Panel opened (`handleOpen` also schedules Top-Layer acquire). |
| `closed` | `void` | Panel closed (`handleClose` also releases Top-Layer). |

### Stencil events on the bare tags (consumed internally by the wrapper)

`[CODE]` `falcon-dropdown.tsx:81-92` / `falcon-dropdown-tw.tsx:128-139`. All `bubbles:true, composed:true`.

| Event | Detail | Re-emitted by wrapper? |
|---|---|---|
| `falcon-change` | `{ value: string\|number\|null }` | → `valueChange` |
| `falcon-clear` | `{ value: null }` | → treated as change → `valueChange` |
| `falcon-open` | `{ value: null }` | → `opened` |
| `falcon-close` | `{ value: null }` | → `closed` |
| `falcon-blur` | `{ value }` | invokes `onTouched()` (CVA) — NOT re-emitted as an `@Output`. |
| `falcon-search` | `{ value: string }` | **NOT bound by the wrapper** (GAP G7) — wire server-side filtering only via the raw tag. |

## TypeScript types

`[CODE]` `falcon-dropdown.types.ts`:

```ts
export interface FalconDropdownOption {
  value: string | number;
  label: string;
  disabled?: boolean;
  iconUrl?: string;     // Wave 4 — leading image in option AND in trigger's selected-value slot
  iconSrcset?: string;  // explicit hi-DPI control
  iconAlt?: string;     // overrides auto alt (defaults to label)
}
type FalconDropdownSize = 'sm' | 'md' | 'lg';
type FalconDropdownState = 'default' | 'error' | 'success' | 'warning';
type FalconDropdownVariant = 'form' | 'search' | 'grid';
type FalconDropdownAppearance = 'default' | 'filled' | 'ghost';
type FalconDropdownChangeDetail = FalconEventDetail<string | number | null>;
type FalconDropdownSearchDetail = FalconEventDetail<string>;
type FalconDropdownToggleDetail = FalconEventDetail<null>;
```

> `[CODE]` `FalconDropdownOption` is also declared a **second time** verbatim inside the wrapper TS (`.ts:52-59`) and re-exported. Two identical definitions exist (wrapper + types file) — minor drift (GAP).

## Reflected props (Stencil)

`[CODE]` Both tags: `size`, `state`, `variant`, `appearance`, `disabled`, `readonly`, `required`, `clearable`, `searchable` are `@Prop({reflect:true})` so `:host([state='error'])`, `:host([appearance='filled'])`, `:host([variant='search'])` CSS rules target them. `value`, `options`, `label`, `placeholder`, `helperText`, `errorMessage`, `name`, `inputId`, `searchPlaceholder`, `emptyMessage`, `iconLeft` are NOT reflected.

## Mutable props (Stencil)

`value` — `@Prop({mutable:true, reflect:false})`, `@Watch('options')` re-seeds active index but `value` itself is not watched (the wrapper re-pushes it after options arrive — see State pattern).

## CVA / ngModel / Reactive Forms

**YES — full ControlValueAccessor.** `[CODE]` `.ts:76-82,265-293`.

```ts
providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FalconAngularDropdownComponent), multi: true }]
```

- `writeValue(value)` — sets the internal `value` signal AND re-pushes the value into the live Stencil element via `componentOnReady().then(...)` (Wave 7.4 cell-remount race fix, `.ts:269-284`).
- `registerOnChange` / `registerOnTouched` — `onChange` fires on `falcon-change`/`falcon-clear`; `onTouched` fires on `falcon-blur`.
- `setDisabledState(isDisabled)` — toggles the `disabled` signal (same one `disabledFromInput` writes).

`[(ngModel)]`, `[ngModel]+(ngModelChange)`, `formControl`, `formControlName` all work.

## Signal compatibility

`[CODE]` Internal state uses signals (`value`, `disabled`). External binding is `@Input` + CVA; no signal-input variant. `OnPush` enforced (`.ts:74`).

## Methods (Stencil only — call via the inner tag)

`[CODE]` Both tags expose `@Method()`: `openPanel()`, `closePanel()`, `setFocus()` (focuses trigger button), `clear()` (applies clear).

> The Angular wrapper does **NOT** proxy these — there is no Angular-side `openPanel()`/`setFocus()`/`clear()` (GAP G6). To call them, reach into `ViewChild` → the inner `<falcon-dropdown(-tw)>` element.

## Slots / ng-content

`[CODE]` `falcon-dropdown.component.html`:
- **Shadow branch** (`useTailwind=false`): forwards BOTH `<ng-content select="[slot=options]" slot="options">` (full-panel custom option list, `.html:73`) AND `<ng-content select="[slot=icon-left]">` (`.html:74`). The Stencil Shadow renders `<slot name="options">` (`.tsx:526`) + `<slot name="icon-left">` (`.tsx:399`).
- **Tailwind branch** (`useTailwind=true`, default): forwards ONLY `<ng-content select="[slot=icon-left]">` (`.html:42`). The `-tw` twin renders `<slot name="icon-left">` (`falcon-dropdown-tw.tsx:498`) but has **NO `<slot name="options">`** → custom-panel option projection is Shadow-path-only (GAP G1 / parity break).

> Correction vs prior dossier: the wrapper DOES surface `slot="options"` (in Shadow mode) — the earlier "doesn't propagate" claim was wrong. What is genuinely missing is (a) the Tailwind-path `options` slot, and (b) any per-option `ng-template`/directive for structured rows.

## Supported sizes / states / variants / appearances

- Sizes: `sm` / `md` / `lg` (heights from `--falcon-density-input-height-*`: 34 / 40 / 44 px).
- States: `default` / `error` / `success` / `warning`.
- Variants: `form` (default) / `search` (rounded pill) / `grid` (compact in-grid).
- Appearances: `default` (bordered) / `filled` (tinted bg) / `ghost` (no border).

## Constraints

- `[CODE]` `[disabled]` MUST be a **property** binding (`disabledFromInput` setter). `[attr.disabled]` bypasses the setter and the disabled signal never updates → trigger stays interactive. Same trap as `<falcon-input>`.
- `[CODE]` `wrapperClass`/`triggerClass`/`panelClass`/`optionClass`/`labelClass` flow ONLY to the Tailwind path (mapped to `*-extra-class` attrs at `.html:30-34`); the Shadow branch does not forward them (GAP G8).
- `[CODE]` `slot="options"` works ONLY in Shadow mode; Tailwind mode has no option slot.
- `[CODE]` `falcon-search` event is not re-emitted by the wrapper (no `(searched)` @Output) — GAP G7.
- `[CODE]` Single-value only; use `<falcon-angular-multi-select>` for multi.
- `[CODE]` Closed-mode type-ahead drains 600ms after the last keypress (`.tsx:344`), matching native `<select>`. Outside-click (`composedPath`/`isOutsideClick`) + Escape close the panel.
- `[CODE]` `appendTo='inline'` is the only way to opt out of body-portaling, and it exists ONLY on the raw `<falcon-dropdown-tw>` tag — not surfaced on the Angular wrapper.

## Accessibility

`[CODE]` `falcon-dropdown.tsx:402-484` / `falcon-dropdown-tw.tsx:501-578`:
- `role="combobox"` on the trigger button; `aria-haspopup="listbox"`, `aria-expanded`, `aria-controls` (listbox id), `aria-invalid` (on error), `aria-required`, `aria-describedby` (helper+error ids), `aria-disabled`, native `disabled`.
- `role="listbox"` on the panel listbox; `role="option"` per option with `aria-selected` + `aria-disabled`; `aria-labelledby` → trigger id.
- Error paragraph has `role="alert"`; required asterisk is `aria-hidden="true"`.
- Clear button: `aria-label="Clear selection"`, `tabindex={-1}`, `onMouseDown preventDefault` (focus stays on trigger).
- Full keyboard nav (both paths): ArrowUp/Down (skip disabled, wrap), Home, End, Enter (select active), Tab (closes), Esc (closes + refocus trigger), printable chars (type-ahead closed / search-seed when `searchable`).
- ⚠️ `[CODE]` Trigger does **NOT** set `aria-activedescendant` — the active option is highlighted by CSS class only (GAP A2). No live region announces the filtered match count (GAP A1). (Contrast: `<falcon-combobox>` DOES set `aria-activedescendant`.)

## Verification
🟢 code-verified against `falcon-dropdown.component.{ts,html}` + `falcon-dropdown.tsx` + `falcon-dropdown-tw.tsx` + `falcon-dropdown.types.ts` (read 2026-06-03). 🟢 RE-VERIFIED 2026-06-03 (W1-b) against the live wrapper `.ts`+`.html`+`index.ts` — every `@Input`/`@Output`, the `options` setter, full CVA (`writeValue`/`registerOnChange`/`registerOnTouched`/`setDisabledState`), the `disabledFromInput` property-setter trap, and the Shadow-only `slot="options"` projection all confirmed accurate. No corrections needed to API.md.
