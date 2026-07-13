# falcon-stepper — API

## Selectors
- **Angular wrapper:** `<falcon-angular-stepper>` — `libs/falcon-ui-core/src/angular-wrapper/components/falcon-stepper/falcon-stepper.component.ts`
- **Shadow tag:** `<falcon-stepper>` (`tag: 'falcon-stepper'`, `shadow: true`) — `falcon-stepper.tsx`
- **Light tag:** `<falcon-stepper-tw>` (`tag: 'falcon-stepper-tw'`, `shadow: false`) — `falcon-stepper-tw.tsx`

## Import / export path
```ts
import { FalconAngularStepperComponent } from '@falcon/ui-core';
// or via the wrapper barrel which also re-exports the types:
import { FalconAngularStepperComponent } from '@falcon/ui-core/angular';
```
Add `FalconAngularStepperComponent` to the consuming standalone component's `imports: []`. `CUSTOM_ELEMENTS_SCHEMA` is set internally on the wrapper (`[CODE]` falcon-stepper.component.ts:63) — the host does NOT need it.

Type exports (`[CODE]` angular-wrapper/components/falcon-stepper/index.ts):
```ts
import type {
  FalconStepperStep, FalconStepperMode, FalconStepperOrientation,
  FalconStepperSize, FalconStepperLabelPosition, FalconStepperChangeDetail,
  FalconStepperStepClickDetail, FalconStepperCompleteDetail,
  FalconStepperBlurDetail, FalconStepperNavigationBlockedDetail,
  FalconStepperNavigationBlockedReason,
} from '@falcon/ui-core';
```

## TypeScript types
`[CODE]` `libs/falcon-ui-core/src/components/falcon-stepper/falcon-stepper.types.ts`:
```ts
type FalconStepperMode = 'linear' | 'non-linear';
type FalconStepperOrientation = 'horizontal' | 'vertical';
type FalconStepperSize = 'sm' | 'md' | 'lg';
type FalconStepperLabelPosition = 'top-center' | 'bottom-center' | 'side';
type FalconStepperNavigationBlockedReason = 'linear' | 'disabled' | 'forward-locked';

interface FalconStepperStep {
  readonly value: string | number;
  readonly label: string;
  readonly description?: string;
  readonly icon?: string;           // CSS class or font-icon class
  readonly disabled?: boolean;
  readonly optional?: boolean;
  readonly errorMessage?: string;   // per-step error indicator (visual only — paints the circle red)
}
interface FalconStepperChangeDetail { value; previousValue: …|null; direction: 'forward'|'back'|'jump'; }
interface FalconStepperStepClickDetail { value: string|number; }
interface FalconStepperCompleteDetail  { value: string|number; }
interface FalconStepperBlurDetail      { value: string|number|null; }
interface FalconStepperNavigationBlockedDetail { attemptedValue; currentValue: …|null; direction: 'forward'|'back'; reason: FalconStepperNavigationBlockedReason; }
```

## Inputs (all on `FalconAngularStepperComponent`)

| Name | Type | Default | Notes |
|---|---|---|---|
| `steps` | `ReadonlyArray<FalconStepperStep>` | `[]` | `[CODE]` ts:88-94 — a custom setter pushes the array imperatively to the live Stencil element (`el.steps = …`) on every change because Angular's attribute fallback stringifies arrays. |
| `activeValue` (CVA value) | `string \| number \| null` | `null` | `[CODE]` ts:139-145 — two-way; also via `writeValue` / `[(ngModel)]` / `formControlName`. Setter feeds an internal `signal()` so OnPush sees the change. |
| `completedValues` | `ReadonlyArray<string \| number>` | `[]` | Drives "completed" dot state + fill-bar progress. |
| `mode` | `'linear' \| 'non-linear'` | `'linear'` | Linear blocks skipping past `activeIdx + 1`. Completed steps stay reachable. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Vertical renders connector lines + a per-step panel slot. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Toggles dot (16/18/22px), label, number, check sizes via token sets. |
| `labelPosition` | `'top-center' \| 'bottom-center' \| 'side'` | **`'top-center'` (wrapper + Shadow)** / **`'bottom-center'` (`-tw`)** | `[CODE]` ts:100, tsx:69, falcon-stepper-tw.tsx:85 — DEFAULT DIVERGES per render path (Wave 10D); `bottom-center` absolutely-centres each label under its own dot. `side` reserved for vertical. |
| `showStepNumbers` | `boolean` | **`false`** | `[CODE]` ts:102, tsx:71 — Falcon design shows numberless dots. (Prior dossier's `true` was WRONG.) Consumers explicitly pass `[showStepNumbers]="false"`. |
| `showCheckOnComplete` | `boolean` | `true` | `[CODE]` ts:103 — replaces number/pulse with a check SVG on completed dots. |
| `disabled` | `boolean` | `false` | `[CODE]` ts:147-153 — disables the whole stepper; setter writes the `disabledSig` signal. CVA `setDisabledState` writes the same. |
| `helperText` | `string?` | — | Shown below the rail when there is no error. |
| `errorMessage` | `string?` | — | Renders as a stepper-wide `<p role="alert">`, overrides `helperText`. |
| `groupLabel` | `string?` | — | Small label above the stepper. |
| `ariaLabel` | `string?` | — | Falls back to `groupLabel ?? 'Progress steps'`. |
| `forwardLockedFrom` | `ReadonlyArray<string \| number>?` | `undefined` | `[CODE]` ts:111 — consumer-driven forward-nav gate. Typically a computed like `validityBlock()` returning `[currentStep]` when invalid, `[]` otherwise. A forward click from any locked value is rejected at the library level (no `activeValue` mutation, no flash) and `(navigationBlocked)` fires with reason `'forward-locked'`. **This is the canonical step-validity gate.** |
| `useTailwind` | `boolean` | `true` | `[CODE]` ts:114 — Render-path switch. `true` → `<falcon-stepper-tw>` (Light DOM, default). `false` → `<falcon-stepper>` (Shadow). |
| `rootClass` | `string` | `''` | `[CODE]` ts:115 — caller class extensions, bound `[class]` onto the live Stencil element (BOTH paths). |

## Outputs (Angular wrapper)

| Name | Payload | Description |
|---|---|---|
| `valueChange` | `string \| number \| null` | `[CODE]` ts:118 — two-way sugar for `[(activeValue)]`; mirrors `falcon-change.detail.value`. |
| `stepClick` | `FalconStepperStepClickDetail` | `[CODE]` ts:119 — fires BEFORE navigation logic (and even when a click is ultimately blocked). Use for analytics, NOT to detect a transition. |
| `stepComplete` | `FalconStepperCompleteDetail` | `[CODE]` ts:120 — fires when `next()` is called from the last step. |
| `navigationBlocked` | `FalconStepperNavigationBlockedDetail` | `[CODE]` ts:124 + html:14/27 — re-emit of the Stencil `falcon-navigation-blocked` event. Fires when a click was rejected (linear / disabled / forward-locked). **CORRECTION 2026-06-03: this Output EXISTS** (the prior dossier wrongly said "no wrapper Output yet"). Consumers wire it to reveal validation errors on the current step. |

> `[CODE]` The wrapper binds 5 Stencil events (`falcon-change` → `valueChange`, `falcon-step-click` → `stepClick`, `falcon-complete` → `stepComplete`, `falcon-navigation-blocked` → `navigationBlocked`, `falcon-blur` → CVA `onTouched()` only). `falcon-blur` has no public Output.

## Stencil-only props (NOT on the Angular wrapper)
None of significance — every Stencil prop is mirrored by a wrapper `@Input`. The wrapper does NOT proxy `[CODE]` the `@Method`s (see below).

## Reflected / mutable props (Stencil)
`[CODE]` falcon-stepper.tsx / falcon-stepper-tw.tsx:
- `@Prop({ mutable: true, reflect: true }) activeValue` — attribute mirrors the live property.
- `@Prop({ mutable: true }) completedValues` — mutable, NOT reflected.
- Reflected (DOM attrs for `:host([…])` CSS): `mode`, `orientation`, `size`, `labelPosition`, `disabled`.

## Stencil `@Method`s (call via element ref after `componentOnReady()`)
`[CODE]` falcon-stepper.tsx:123/136/145 (same on `-tw`):
- `next(): Promise<void>` — advance to next enabled step, or emit `falcon-complete` from the last step.
- `prev(): Promise<void>` — retreat to the previous enabled step.
- `goTo(value): Promise<void>` — jump; respects linear rules (completed / current / activeIdx+1).

> `[CODE]` The Angular wrapper does NOT proxy these — to call them, reach the inner Stencil element via `@ViewChild('stepperEl')` (the wrapper tags it `#stepperEl`).

## CVA / Forms support
`[CODE]` ts:64-70, 205-216 — full `ControlValueAccessor` via `NG_VALUE_ACCESSOR` + `forwardRef`. `[(ngModel)]` / `formControlName` bind `activeValue`. `writeValue(v)` → internal signal; `setDisabledState` → `disabledSig`; `onTouched()` fires on `falcon-blur`.

## Signal compatibility
Internal state (`value`, `disabledSig`) uses Angular signals; `OnPush` enforced. External binding is `@Input` + `(valueChange)` / CVA — no signal-input variant yet.

## Slots / template inputs
`[CODE]` falcon-stepper.component.html — the wrapper projects a single `<ng-content />` into the active Stencil tag (one of the two `@if` branches).
- **Per-step panel slots:** `slot="content-{value}"` (helper `formatStepPanelSlot()`). Horizontal: panels render in a `<falcon-stepper-panels>` region below the dot row (`[CODE]` Shadow uses `hidden={!isActive}`; `-tw` renders all + `falconStepperPanelClasses(isActive)`). Vertical: panel renders inline under each label.
- Consumers must annotate each projected node with `slot="content-{value}"`.
- NO `ng-template` inputs; NO dot/label custom slots (GAP).

## Supported sizes / states / variants / modes
- **size:** `sm` (16px dot) / `md` (18px) / `lg` (22px).
- **state per step:** `upcoming` / `active` / `completed` / `error` / `disabled` (`[CODE]` resolveStepState() — falcon-stepper.utils.ts:69-79).
- **mode:** `linear` / `non-linear`.
- **orientation:** `horizontal` / `vertical`.
- **labelPosition:** `top-center` / `bottom-center` / `side`.
- **render path:** Shadow (`<falcon-stepper>`) vs Light (`<falcon-stepper-tw>`, default) via `useTailwind`.

## Lazy / server mode
_None._ The stepper is presentation + navigation-gating only — no async data path.

## Constraints
- Steps array must use a UNIQUE `value` per step; duplicates break the active/completed selectors and the dot-ref map.
- Linear mode prevents jumping past `activeIdx + 1` unless the target is in `completedValues`.
- `errorMessage` (wrapper) is a TOP-LEVEL stepper-wide error; per-step error is `step.errorMessage` and paints only that dot red (the message text is NOT rendered — GAP).
- `[disabled]` MUST be a property binding — `[attr.disabled]` bypasses the wrapper setter.
- `[CODE]` Block-check ORDER is fixed in `resolveNavigationBlock()` (falcon-stepper.tsx:176-196): per-step `disabled` → `forward-locked` → `linear`. Forward-lock precedes linear deliberately so the consumer gate wins on adjacent-step clicks.
- `[CODE]` A blocked dot keeps native `disabled={step.disabled || this.disabled}` only (tsx:376) — linear/forward-locked blocks leave the button clickable so the click fires and emits `falcon-navigation-blocked`; `aria-disabled` reflects ALL block reasons.

## Accessibility
`[CODE]` falcon-stepper.tsx / falcon-stepper-tw.tsx:
- Outer container: `role="group"` + `aria-label={ariaLabel ?? groupLabel ?? 'Progress steps'}`. Rail `<header role="tablist" aria-orientation="horizontal">`.
- Each dot: `<button type="button">` with `aria-label={stepAriaLabel(...)}`, `aria-current="step"` on active, `aria-controls={panelId}`, `aria-disabled` (all block reasons), roving `tabIndex` (0 only on active). `data-step-blocked` mirrors the reason.
- Each panel: `<div role="region" aria-labelledby={headerId}>` (Shadow `hidden={!isActive}`).
- Keyboard (`handleDotKeyDown`): ArrowRight/Left (horizontal) or ArrowDown/Up (vertical) move focus to next/prev enabled dot; Home/End → first/last; Enter/Space → `handleDotClick`.
- Helper `<p part="helper-text">`; error `<p part="error-message" role="alert">`.
- **GAP:** vertical mode does NOT emit `aria-orientation="vertical"` on the outer group; arrow-key intent is not flipped in RTL.

## Verification
🟢 CODE-VERIFIED 2026-06-03 against falcon-stepper.component.ts (253 ln), .html (31 ln), falcon-stepper.tsx (551 ln), falcon-stepper-tw.tsx (531 ln), .types.ts (66 ln). **Drift corrected:** `navigationBlocked` is the 4th wrapper `@Output` (was wrongly "no Output yet"); `showStepNumbers` default `false` (was `true`); `forwardLockedFrom`/`navigationBlocked` fully documented.
