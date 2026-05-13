# falcon-angular-stepper — API

## Selectors
- **Angular wrapper:** `<falcon-angular-stepper>` — `libs/falcon-ui-core/src/angular-wrapper/components/falcon-stepper/falcon-stepper.component.ts`
- **Shadow tag:** `<falcon-stepper>` — `libs/falcon-ui-core/src/components/falcon-stepper/falcon-stepper.tsx`
- **Light tag:** `<falcon-stepper-tw>` — `libs/falcon-ui-core/src/components/falcon-stepper-tw/falcon-stepper-tw.tsx`

## Import / export path
```ts
import { FalconAngularStepperComponent } from '@falcon/ui-core/angular';
// or
import { FalconAngularStepperComponent } from '@falcon/ui-core/angular/falcon-stepper';
```
Type exports:
```ts
import type {
  FalconStepperStep,
  FalconStepperMode,
  FalconStepperOrientation,
  FalconStepperSize,
  FalconStepperLabelPosition,
  FalconStepperChangeDetail,
  FalconStepperStepClickDetail,
  FalconStepperCompleteDetail,
  FalconStepperBlurDetail,
} from '@falcon/ui-core/angular'; // re-exported through the wrapper barrel
```

## TypeScript types involved
```ts
// libs/falcon-ui-core/src/components/falcon-stepper/falcon-stepper.types.ts
export type FalconStepperMode = 'linear' | 'non-linear';
export type FalconStepperOrientation = 'horizontal' | 'vertical';
export type FalconStepperSize = 'sm' | 'md' | 'lg';
export type FalconStepperLabelPosition = 'top-center' | 'bottom-center' | 'side';

export interface FalconStepperStep {
  readonly value: string | number;
  readonly label: string;
  readonly description?: string;
  readonly icon?: string;           // CSS class or font-icon class
  readonly disabled?: boolean;
  readonly optional?: boolean;
  readonly errorMessage?: string;   // per-step error indicator (visual only)
}

export interface FalconStepperChangeDetail {
  readonly value: string | number;
  readonly previousValue: string | number | null;
  readonly direction: 'forward' | 'back' | 'jump';
}

export interface FalconStepperStepClickDetail { readonly value: string | number; }
export interface FalconStepperCompleteDetail  { readonly value: string | number; }
export interface FalconStepperBlurDetail      { readonly value: string | number | null; }
```

## @Inputs (Angular wrapper)

| Name | Type | Default | Notes |
|---|---|---|---|
| `steps` | `ReadonlyArray<FalconStepperStep>` | `[]` | Step definitions; pushed imperatively to live Stencil element via `el.steps = …` because Angular attribute fallback stringifies arrays. |
| `activeValue` (CVA value) | `string \| number \| null` | `null` | Two-way; also writable via `writeValue` / `[(ngModel)]` / `formControlName`. Setter feeds an internal `signal()` so OnPush sees the change. |
| `completedValues` | `ReadonlyArray<string \| number>` | `[]` | Drives "completed" dot state + fill bar progress. |
| `mode` | `'linear' \| 'non-linear'` | `'linear'` | Linear blocks skipping past the current step + 1. Completed steps remain reachable. |
| `orientation` | `'horizontal' \| 'vertical'` | `'horizontal'` | Vertical renders connector lines between dots and a per-step panel slot. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Toggles dot, label, number, and check sizes via token sets. |
| `labelPosition` | `'top-center' \| 'bottom-center' \| 'side'` | `'top-center'` (Shadow) / `'bottom-center'` (Light, Wave 10D) | `bottom-center` puts each label directly under its own dot via absolute positioning. `side` is reserved for vertical layout. |
| `showStepNumbers` | `boolean` | `true` | Renders the 1-indexed number inside the dot. |
| `showCheckOnComplete` | `boolean` | `true` | Replaces the number with a check SVG on completed dots. |
| `disabled` | `boolean` | `false` | Disables the whole stepper; setter writes the internal `disabledSig` signal. |
| `helperText` | `string?` | — | Shown below the dots when there is no error. |
| `errorMessage` | `string?` | — | Renders as `<p role="alert">`, overrides `helperText`. |
| `groupLabel` | `string?` | — | Rendered as a small label above the stepper. |
| `ariaLabel` | `string?` | — | Falls back to `groupLabel ?? 'Progress steps'`. |
| `useTailwind` | `boolean` | `true` | Renders Light DOM `<falcon-stepper-tw>`. Switch to `false` for token-driven Shadow render. |
| `rootClass` | `string` | `''` | Caller class extensions on the live Stencil element. |

## @Outputs (Angular wrapper)

| Name | Payload | Description |
|---|---|---|
| `valueChange` | `string \| number \| null` | Two-way sugar for `[(activeValue)]`. Mirrors the underlying `falcon-change.detail.value`. |
| `stepClick` | `FalconStepperStepClickDetail` | Fired before navigation logic runs (useful for analytics / per-step click metrics). |
| `stepComplete` | `FalconStepperCompleteDetail` | Fired when `next()` is called from the last step (or the Stencil method `complete` fires). |

NOTE: the underlying Stencil events `falcon-change`, `falcon-step-click`, `falcon-complete`, `falcon-blur` are intercepted by the wrapper and re-emitted as Angular Outputs. `falcon-blur` triggers `onTouched()` for CVA only (no public Output).

## Reflected / mutable props
- Shadow Stencil: `@Prop({ mutable: true, reflect: true }) activeValue` — attribute mirrors the live property.
- Shadow Stencil: `@Prop({ mutable: true }) completedValues` — mutable, not reflected.
- Shadow Stencil reflected props (DOM attributes): `mode`, `orientation`, `size`, `labelPosition`, `disabled`.

## Stencil `@Method`s (callable via `componentOnReady()` then property access on the element)
- `next(): Promise<void>` — advance to next enabled step or emit `falcon-complete` from the last step.
- `prev(): Promise<void>` — retreat to the previous enabled step.
- `goTo(value: string | number): Promise<void>` — jump; respects linear-mode rules (completed or current or activeIdx+1).

## CVA / Forms support
- `NG_VALUE_ACCESSOR` is provided; `[(ngModel)]` / `formControlName` bind `activeValue`.
- `writeValue(value)` writes `value` to the internal `signal<string|number|null>`.
- `setDisabledState(isDisabled)` writes `disabledSig`.
- `onTouched()` fires on `falcon-blur`.

## Slots / ng-template inputs
- **Horizontal mode:** one slot per step, named `content-{value}` (helper `formatStepPanelSlot()` in utils). The Stencil component emits the slot region `<falcon-stepper-panels>` with one panel per step; only the active panel is `hidden={false}`.
- **Vertical mode:** same slot naming; the panel renders inline under each label.
- Angular wrapper uses `<ng-content>` so consumers must annotate each projected node with `slot="content-{value}"` to land in the correct panel.

## Supported sizes / states / variants / appearances / modes
- **size:** `sm` (16 px dot) / `md` (18 px dot) / `lg` (22 px dot).
- **state per step:** `upcoming`, `active`, `completed`, `error`, `disabled` (resolved by `resolveStepState()` from `step.disabled`, `activeValue`, `completedValues`, `errorMessage`).
- **mode:** `linear` / `non-linear`.
- **orientation:** `horizontal` / `vertical`.
- **labelPosition:** `top-center` / `bottom-center` / `side`.
- **render mode:** Shadow (`<falcon-stepper>`) vs Light (`<falcon-stepper-tw>`) via `useTailwind` flag.

## Lazy / server mode
- _None observed in active source._ The stepper is presentation-only — there is no async data fetch path.

## Important constraints
- Steps array must use unique `value` per step; duplicate `value`s break the active/completed selectors.
- Linear mode prevents jumping past `activeIdx + 1` unless the target value is already in `completedValues`.
- `errorMessage` on the wrapper is a TOP-LEVEL error (renders as a stepper-wide `<p role="alert">`); per-step error is `step.errorMessage` and paints only that dot red.
- The Angular wrapper imperatively syncs all props via `componentOnReady().then(assign)` to avoid Angular's attribute-mode fallback (which stringifies the steps array).
- `@Input() steps` setter pushes to the live element on every change so a parent array re-emission re-populates the dot row.

## Accessibility (from the Stencil source)
- Outer container: `role="group"`, `aria-label={ariaLabel ?? groupLabel ?? 'Progress steps'}`.
- Each dot: `<button type="button">` with `aria-label={stepAriaLabel(step, idx, state)}`, `aria-current="step"` on the active step, `aria-controls={panelId}`, `aria-disabled`, `tabindex` 0 only on the active dot (roving tabindex pattern).
- Each panel (`<div role="region" aria-labelledby={headerId} hidden={!isActive}>`) is reachable by AT only when active.
- Keyboard support inside `handleDotKeyDown`:
  - `ArrowRight` / `ArrowLeft` (horizontal) or `ArrowDown` / `ArrowUp` (vertical) — move focus to next/previous enabled dot.
  - `Home` / `End` — focus first / last enabled dot.
  - `Enter` / `Space` — invoke `handleDotClick(step, idx)`.
- Helper text: `<p part="helper-text">`; error message: `<p part="error-message" role="alert">`.

## Studio surface
- Tokens for shape, label position, label visibility, animation toggle, size, dot fill, halo, and motion duration are exposed in the Studio's left-rail stepper panel (per `stepper.tokens.css` 14 categories).
