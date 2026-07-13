# falcon-angular-wizard — API

## Selectors
- **Angular wrapper:** `<falcon-angular-wizard>` — `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard/falcon-wizard.component.ts`
- **Shadow tag:** `<falcon-wizard>` — `libs/falcon-ui-core/src/components/falcon-wizard/falcon-wizard.tsx`
- **Light tag:** `<falcon-wizard-tw>` — `libs/falcon-ui-core/src/components/falcon-wizard-tw/falcon-wizard-tw.tsx`

## Import path
```ts
import { FalconAngularWizardComponent } from '@falcon/ui-core';
// types re-exported through the wrapper barrel + the component file itself:
import type {
  FalconWizardStep,
  FalconWizardNavigateDetail,
  FalconWizardStepChangeDetail,
  FalconWizardStepValidationFailDetail,
  FalconWizardSize,
} from '@falcon/ui-core';
```
> `[CODE]` index.ts re-exports `FalconAngularWizardComponent` + 4 of the 5 types; `falcon-wizard.component.ts:28-34` re-exports all 5 (including `FalconWizardStepValidationFailDetail`). The wrapper imports the type unions from `../../../components/falcon-wizard/falcon-wizard.types.ts`.

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

## Stencil-only props NOT surfaced on the Angular wrapper (2026-06-03)
`[CODE]` Two Stencil props exist on the tags but are **not exposed** by `FalconAngularWizardComponent` (the wrapper has no matching `@Input`):

| Prop | Type | Default | Available on | Gap |
|---|---|---|---|---|
| `ariaLabel` | `string` | `undefined` (→ `'Wizard'`) | **Shadow `<falcon-wizard>` ONLY** `[CODE]` falcon-wizard.tsx:50 | The wrapper does not let a consumer name the region landmark; `-tw` lacks the prop entirely (see parity gap). |
| `rootExtraClass` | `string` | `undefined` | **Light `<falcon-wizard-tw>` ONLY** `[CODE]` falcon-wizard-tw.tsx:39 | The wrapper does not forward extra classes to the `-tw` root; Shadow lacks the prop. Consumers add `class=` on the host instead. |

## Dual-render parity divergences (Shadow vs `-tw`)
`[CODE]` The two Stencil tags share the prop set + ALL six events + `goTo`/`next`/`back` methods, but diverge in three ways:
1. **`ariaLabel`** — Shadow has it (falcon-wizard.tsx:50); `-tw` does NOT (no `ariaLabel` prop).
2. **Region semantics** — Shadow wraps the root in `role="region"` + `aria-label` AND the content in `role="region"` + `aria-live="polite"` (falcon-wizard.tsx:131-153). The `-tw` twin renders **NO `role`/`aria-label`/`aria-live`** on root or content (falcon-wizard-tw.tsx:104-122) — an a11y parity break, and the `-tw` path is the wrapper DEFAULT (`useTailwind=true`). **GAP (see GAPS_AND_UPGRADES).**
3. **`rootExtraClass`** — `-tw` only.

The Shadow `handleFinish` method is `private`; the `-tw` finish handler is identical. Footer buttons: Shadow uses class-string buttons (`.falcon-wizard-btn--*`); `-tw` uses `falconWizardBtnClasses({variant})` helpers — same visual contract.

## Reflected / mutable props
- Both tags: `@Prop({ mutable: true }) currentStep` (falcon-wizard.tsx:25 / -tw:27) — consumer can drive externally; `[(currentStep)]` two-way works through the wrapper's `@Input currentStep` (one-way) — see note below.
- Both tags: `@Prop({ reflect: true }) size` (falcon-wizard.tsx:46 / -tw:36) — reflected so `:host([size='sm'])` CSS targets it.
- `[CODE]` **Wrapper `currentStep` is a one-way `@Input`, NOT a two-way `model`** (falcon-wizard.component.ts:45). The Stencil `currentStep` is `mutable`, so the inner element advances itself on next/back, but the wrapper does NOT push the new index back out as `currentStepChange`. Consumers track the step via `(falconWizardStepChange)`, not `[(currentStep)]` banana-box on the wrapper (the prior USAGE `[(currentStep)]` example is aspirational — see GAPS).

## Stencil `@Method`s (on the inner element — NOT proxied by the Angular wrapper)
- `goTo(step: number): Promise<void>` — programmatically jump to a step (bounds-checked). BOTH tags `[CODE]` falcon-wizard.tsx:67 / -tw:51.
- `next(): Promise<void>` — async; runs `validateStep` if present, emits `falconStepValidationFail` if it fails, otherwise advances + emits `falconWizardNext` + `falconWizardStepChange`. BOTH tags.
- `back(): Promise<void>` — emits `falconWizardBack` + `falconWizardStepChange`. BOTH tags.

> `[CODE]` The Angular wrapper does NOT proxy `goTo`/`next`/`back` as Angular methods. To call them imperatively, grab the inner element via `@ViewChild('wizardRef', { read: ElementRef })` (the wrapper tags both branches `#wizardRef` — falcon-wizard.component.html:7/32) and call `wizardRef.nativeElement.next()`. See USAGE "Imperative Next/Back". (GAP — wrapper method proxies.)

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
- **Shadow `<falcon-wizard>` ONLY:** outer root `role="region"` + `aria-label={ariaLabel ?? 'Wizard'}`; content region `role="region"` + `aria-label={step.label ?? "Step N+1"}` + `aria-live="polite"` (announces step changes). `[CODE]` falcon-wizard.tsx:131-153.
- **Light `<falcon-wizard-tw>` (the wrapper DEFAULT): NONE of the above** — no `role`, no `aria-label`, no `aria-live` on root or content (`[CODE]` falcon-wizard-tw.tsx:104-122). So in the default render path the wizard exposes **no region landmark and announces no step change** to screen readers. **HIGH-RISK-QUEUE a11y parity gap — see GAPS_AND_UPGRADES.md.**
- Footer buttons (both paths): native `<button type="button">` with `disabled={!canProceed}` on Next/Finish.
- _Gap_: no `aria-current` on the active step button inside the wizard's own footer (the embedded stepper handles its own ARIA).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B20 REFRESH) against falcon-wizard.component.ts (114 ln), .component.html (55 ln), falcon-wizard.tsx (196 ln), falcon-wizard-tw.tsx (171 ln), falcon-wizard.types.ts (31 ln). Drift corrected vs prior dossier: import path → `@falcon/ui-core`; added the `ariaLabel` (Shadow-only) + `rootExtraClass` (`-tw`-only) wrapper-omission table; flagged the **`-tw` a11y region/aria-live parity break** (the prior API.md claimed region semantics universally); clarified wrapper `currentStep` is one-way (no `currentStepChange`) + methods are NOT proxied. Inputs/Outputs/types tables re-confirmed accurate.
