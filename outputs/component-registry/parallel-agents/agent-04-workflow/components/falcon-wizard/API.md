# falcon-angular-wizard — API

## Selectors
- **Angular wrapper:** `<falcon-angular-wizard>` — `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard/falcon-wizard.component.ts`
- **Shadow tag:** `<falcon-wizard>` — `libs/falcon-ui-core/src/components/falcon-wizard/falcon-wizard.tsx`
- **Light tag:** `<falcon-wizard-tw>` — `libs/falcon-ui-core/src/components/falcon-wizard-tw/falcon-wizard-tw.tsx`

## Import path
```ts
import { FalconAngularWizardComponent } from '@falcon/ui-core/angular';
import type {
  FalconWizardStep,
  FalconWizardNavigateDetail,
  FalconWizardStepChangeDetail,
  FalconWizardStepValidationFailDetail,
  FalconWizardSize,
} from '@falcon/ui-core/angular'; // re-exported through the wrapper barrel
```

## TypeScript types involved
```ts
// libs/falcon-ui-core/src/components/falcon-wizard/falcon-wizard.types.ts
export type FalconWizardStepStatus = 'active' | 'completed' | 'pending' | 'error';

export interface FalconWizardStep {
  label: string;
  status?: FalconWizardStepStatus;
  disabled?: boolean;
  optional?: boolean;
}

export type FalconWizardSize = 'sm' | 'md' | 'lg';

export interface FalconWizardStepChangeDetail { step: number; via: 'next' | 'back' | 'jump'; }
export interface FalconWizardNavigateDetail   { from: number; to: number; }
export interface FalconWizardStepValidationFailDetail { step: number; message?: string; }
```

## @Inputs (Angular wrapper)

| Name | Type | Default | Notes |
|---|---|---|---|
| `steps` | `FalconWizardStep[]` | `[]` | Step descriptors used by the embedded `<falcon-stepper>`. |
| `currentStep` | `number` | `0` | 0-indexed. Two-way via Stencil's `mutable: true`. |
| `canProceed` | `boolean` | `true` | Disables Next/Finish when false. Combine with `validateStep` for async checks. |
| `showDraft` | `boolean` | `false` | Toggles Save-Draft button in footer. |
| `showBack` | `boolean` | `true` | First-step suppression overrides this. |
| `showFinish` | `boolean` | `true` | Renders Finish on the last step. |
| `nextLabel` | `string` | `'Next'` | Consumer responsible for i18n (no built-in translation). |
| `backLabel` | `string` | `'Back'` | Same. |
| `finishLabel` | `string` | `'Finish'` | Same. |
| `draftLabel` | `string` | `'Save Draft'` | Same. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | Forwarded to the embedded stepper. |
| `useTailwind` | `boolean` | `true` | Light DOM `<falcon-wizard-tw>` vs Shadow `<falcon-wizard>`. |
| `validateStep` | `(step: number) => boolean \| Promise<boolean>` | — | Direct override. Takes precedence over `stepControls`. |
| `stepControls` | `ReadonlyArray<AbstractControl \| null>` | — | One `AbstractControl` per step index. Derived validator runs `ctrl.markAllAsTouched(); return ctrl.valid;` |

## @Outputs (Angular wrapper)

| Name | Payload | Description |
|---|---|---|
| `falconWizardNext` | `FalconWizardNavigateDetail` | Emitted on Next click (after passing validation). |
| `falconWizardBack` | `FalconWizardNavigateDetail` | Emitted on Back. |
| `falconWizardFinish` | `void` | Emitted from the Finish button on the last step. |
| `falconWizardDraft` | `void` | Emitted from Save-Draft. |
| `falconWizardStepChange` | `FalconWizardStepChangeDetail` | Emitted on any step transition (`via: 'next'|'back'|'jump'`). |
| `falconStepValidationFail` | `FalconWizardStepValidationFailDetail` | Emitted when the validation gate blocks Next/Finish. |

## Reflected / mutable props
- Shadow Stencil: `@Prop({ mutable: true }) currentStep` — consumer can drive externally.
- Others (`size`, etc.) are normal props.

## Stencil `@Method`s
- `goTo(step: number): Promise<void>` — programmatically jump to a step (bounds-checked).
- `next(): Promise<void>` — async; runs `validateStep` if present, emits `falconStepValidationFail` if it fails, otherwise advances + emits `falconWizardNext` + `falconWizardStepChange`.
- `back(): Promise<void>` — emits `falconWizardBack` + `falconWizardStepChange`.

## CVA / Forms support
- **Not a CVA.** The wizard is not a form control; it composes form controls inside slot bodies.
- Reactive Forms support is via `[stepControls]` bridge — feed `[ctrl1, ctrl2, ctrl3]` (one per step), and the wizard internally builds `validateStep` from them.

## Slots / ng-template inputs
- `slot="header"` — content above the stepper rail (e.g., title + close button).
- Default content (un-named slot) is for the step bodies; consumer projects each step body with `slot="step-{index}"` matching the active step's index.
- `slot="footer-extra"` — extra footer content (e.g., a side action button next to Next/Back).

The Stencil Light template (Wizard-tw) renders:
```
<div class="falcon-wizard-root">
  <div class="falcon-wizard-header"><slot name="header"></slot></div>
  <div class="falcon-wizard-stepper"><falcon-stepper :steps :activeIndex /></div>
  <div class="falcon-wizard-content"><slot name="step-{currentStep}"></slot></div>
  <div class="falcon-wizard-footer">
    [Back] [<slot name="footer-extra"></slot>] [Save Draft?] [Next | Finish]
  </div>
</div>
```

## Supported sizes / modes / variants
- **size:** `sm` / `md` / `lg`.
- **render path:** Shadow or Light via `useTailwind`.
- **No orientation toggle** — the wizard is always horizontal stepper on top, content below, footer at bottom.

## Lazy / server mode
- _None observed in active source._

## Important constraints
- `currentStep` is 0-indexed — different from the legacy bespoke stepper (which is 1-indexed). Migration must remap.
- The wizard's internal `<falcon-stepper>` receives `[activeIndex]="currentStep"` — note this differs from the public Stencil stepper's `activeValue` (string|number). The wizard composes a numeric activeIndex; this asymmetry is a small migration footnote.
- The validation gate runs ONLY on Next/Finish — Back is always allowed.
- Per-step `status` field on `FalconWizardStep` is exposed but the rendering currently relies on `currentStep` index, not `status`. The Stencil component does not yet visualize `'error'` / `'completed'` distinctly via `status`. GAP — see `GAPS_AND_UPGRADES.md`.
- The `stepControls` bridge marks the WHOLE control tree as touched — for nested forms with controls inside FormArrays, ensure the structure is a single AbstractControl per step.

## Accessibility (from the Stencil source)
- Outer root: `role="region"`, `aria-label={ariaLabel ?? 'Wizard'}`.
- Content region: `role="region"`, `aria-label={step.label ?? "Step N+1"}`, `aria-live="polite"` (announces step changes).
- Footer buttons: native `<button type="button">` with `disabled={!canProceed}` on Next/Finish.
- _Gap_: no `aria-current` on the active step button inside the wizard's own footer (the embedded stepper handles its own ARIA).
