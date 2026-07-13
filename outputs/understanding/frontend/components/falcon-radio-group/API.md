# falcon-radio-group — API

## Selectors

- Angular: `falcon-angular-radio-group` (composes `<falcon-angular-radio>` children — does NOT render a Stencil element).
- Stencil Shadow: `<falcon-radio-group>` (tag `'falcon-radio-group'`, `shadow:true`) — **exists but unused by the Angular wrapper**.
- Stencil Light: `<falcon-radio-group-tw>` (`shadow:false`) — **exists but unused by the Angular wrapper**.

## Import

```ts
import { FalconAngularRadioGroupComponent, FalconRadioGroupOption } from '@falcon/ui-core';
```

Add `FalconAngularRadioGroupComponent` to the consuming standalone component's `imports: []`. It internally imports `FalconAngularRadioComponent` and sets `CUSTOM_ELEMENTS_SCHEMA`.

## Inputs (all on `FalconAngularRadioGroupComponent`)

`[CODE]` 11 `@Input`s (one is a setter).

| Name | Type | Default | Notes |
|---|---|---|---|
| `options` | `FalconRadioGroupOption[]` | `[]` | The choice set. Each `{ value, label, disabled? }`. `[CODE]` ts:48 |
| `selectedValue` (getter/setter) | `string \| number \| boolean \| null \| undefined` | `null` | Setter writes the `selected` signal; getter returns it. **One-way input + separate `(selectedValueChange)` output — NOT a banana-box `[(selectedValue)]`** (no `model()`). `[CODE]` ts:51-56 |
| `orientation` | `'vertical' \| 'horizontal'` | `'vertical'` | Toggles `.is-vertical` / `.is-horizontal` on the options `<div>`. `[CODE]` ts:59 + html:20-21 |
| `groupLabel` | `string \| undefined` | `undefined` | Renders a `<span>` label + `aria-label` on the radiogroup. `[CODE]` ts:60 |
| `helperText` | `string \| undefined` | `undefined` | Helper `<p>` (hidden when `errorText` is set). `[CODE]` ts:61 |
| `errorText` | `string \| undefined` | `undefined` | Error `<p>` with `role="alert"`; also sets `aria-invalid`. `[CODE]` ts:62 + html:25,43 |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Forwarded to every child radio. `[CODE]` ts:63 + html:30 |
| `disabled` | `boolean` | `false` | Disables all radios (OR'd with CVA disabled + per-option disabled). `[CODE]` ts:64,103-105 |
| `required` | `boolean` | `false` | Renders `*` on the group label + `aria-required`. `[CODE]` ts:65 |
| `useTailwind` | `boolean` | `true` | Forwarded to each child radio's render path. `[CODE]` ts:66 + html:32 |
| `name` | `string` | auto `falcon-radio-group-{seq}` | **Shared `name` for native radio exclusivity** — forwarded to every child. `[CODE]` ts:68 + html:31 |

> `[CODE]` Per-option `disabled` comes from the `FalconRadioGroupOption.disabled` field, not a top-level input. `isDisabled(option)` = `this.disabled || cvaDisabled() || option.disabled` (ts:103-105).

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `(selectedValueChange)` | `string \| number \| boolean \| null` | `[CODE]` ts:71,112 — emitted by `handleSelect` when a child radio becomes checked and the value actually changed. Also drives the CVA `onChange` + `onTouched`. |

## TypeScript types

`[CODE]` **Two different `FalconRadioGroupOption` interfaces exist** (a drift, FINDINGS/B06):

```ts
// The one consumers import (wrapper, falcon-radio-group.component.ts:21-25):
export interface FalconRadioGroupOption {
  value: string | number | boolean;
  label: string;
  disabled?: boolean;
}

// The Stencil one (falcon-radio-group.types.ts:5-9) — value is string-only:
export interface FalconRadioGroupOption { value: string; label: string; disabled?: boolean; }
```

The wrapper's wider `value` type is the live contract for Angular consumers.

## Reflected props (Stencil only)

`[CODE]` On the unused Stencil group: `orientation`, `size`, `disabled` are `@Prop({reflect:true})`. Irrelevant to the Angular path (the Angular wrapper uses plain `<div>` class toggles instead).

## Mutable props (Stencil)

`[CODE]` Stencil group `selectedValue` is `@Prop({mutable:true})` + `@Watch`ed. The Angular wrapper instead holds a `selected = signal()` (ts:75).

## CVA / ngModel / Reactive Forms

**YES — full ControlValueAccessor (single value).**

```ts
providers: [{ provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => FalconAngularRadioGroupComponent), multi: true }],
```

- `[CODE]` `writeValue(value)` → `selected.set(value ?? null)` (ts:86-88).
- `registerOnChange(fn)` — fired by `handleSelect` with the chosen option's `value` (ts:107-114).
- `registerOnTouched(fn)` — fired by `handleSelect` after a change.
- `setDisabledState(isDisabled)` → `cvaDisabled` signal (ts:95-97).

`[(ngModel)]`, `formControl`, `formControlName` all work; the bound value is the selected option's `value`.

## Signal compatibility

Internal state uses Angular signals (`selected`, `cvaDisabled` — ts:75-76). External binding is via `@Input`s/CVA; no `model()` / signal-input. `OnPush` enforced.

## Methods (call via element ref)

None on the Angular wrapper. (The orphaned Stencil group exposes none either.)

## Slots / template inputs

`[CODE]` None — options are label-only (driven by `option.label`). No per-option template / `ng-template` input (GAP G1). The child radios get only `[label]` text.

## Supported sizes / states / variants / appearances

- Sizes: `sm` / `md` / `lg` (forwarded to children).
- Orientation: `vertical` (default) / `horizontal`.
- No `variant` / `appearance` axis (e.g. no "card" appearance — GAP G3).

## Constraints

- `[CODE]` Single value (radio semantics). For multi-value use a checkbox-group.
- `[CODE]` The group renders a plain Angular `<div>` (NOT the Stencil element). Its class names (`falcon-radio-group-options`, `is-vertical`, etc.) have **no Light-DOM stylesheet** — supply layout via the consumer (GAP G2).
- `[CODE]` `selectedValue` is a one-way input + `(selectedValueChange)` output, not a two-way `model()`. Use `[selectedValue]` + `(selectedValueChange)` or bind via CVA.
- `[CODE]` Disabled is the OR of the top-level `disabled`, CVA disabled, and per-option `disabled`.
- `[CODE]` `name` is shared across children for native exclusivity — do not override per child.

## Accessibility

- `[CODE]` html:18-25 — the options container has `role="radiogroup"`, `aria-label` (= `groupLabel`), `aria-required` (when required), `aria-invalid` (when `errorText`).
- `[CODE]` Each child radio is a real native `<input type="radio">` sharing the group `name` → the **browser** provides single-selection exclusivity and arrow-key movement among same-`name` radios.
- `[CODE]` There is **no explicit roving-tabindex** and no group-level keydown handler — keyboard nav is delegated entirely to native same-`name` grouping (GAP A3 / FINDINGS/B06 — verify at runtime).
- Error `<p>` has `role="alert"`; required `*` is `aria-hidden="true"`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-radio-group.component.ts (117 ln) + .component.html (46 ln) + .types.ts. Corrected prior dossier: `selectedValue` is one-way input + output (not two-way); documented the child-forwarding (`[name]`/`[checkedInput]`/`(valueChange)`), the two divergent `FalconRadioGroupOption` types, the orphaned Stencil group, and the delegated (non-roving) keyboard model.
