# falcon-stepper (LEGACY) — Integration & Validation Layer

> Layer 3 of 3. UI → `OVERVIEW.md`. Business → `BUSINESS.md`.
> ⚠️ **LEGACY — DELETED COMPONENT.** This dossier documents a component that **no longer exists.** See `BUSINESS.md` § "Status correction."

## Status correction (read first)
`[CODE]` verified 2026-05-18 — `libs/falcon/src/shared-ui/lib/components/falcon-stepper/` is absent; `find libs/falcon/src -name "*stepper*"` returns 0 files. The legacy bespoke Angular stepper was deleted in Wave 7.13 (`[MEMORY]` project_falcon_stepper_legacy_deletion_2026_05_17). The modern replacement is the Stencil-paired `<falcon-angular-stepper>` (source present: `libs/falcon-ui-core/src/components/falcon-stepper/` + `falcon-stepper-tw/` + `angular-wrapper/components/falcon-stepper/`).

## Owning backend module(s)
The legacy stepper was **presentational — it owned no data and bound to no endpoint.** A stepper is a navigation/progress widget; the *data* lived in the step-body form components it projected. For the Add Client / Add User wizards the bodies bind to:
- **Identity** — user lifecycle (Add User: personal / role-status / permissions steps).
- **Commerce** — account/node data (Add Client: information / settings steps).
The stepper itself never touched these — it only rendered the rail and switched panels.

## Backend wiring
**None.** The legacy stepper made no HTTP calls. `currentStep` (1-indexed) was view state; `back` / `cancel` / `finish` were UI intents the consuming wizard handled. The actual create-the-record requests were fired by the wizard component on `finish`, calling the owning module's endpoint with the accumulated step-body form values.

The modern `<falcon-angular-stepper>` is the same — presentational, no endpoints; `<falcon-angular-wizard>` (which wraps it) owns the Next/Back/Finish/Draft footer and the submission orchestration.

## Validation rules (V-*)
The legacy stepper ran **no validation rules itself.** It *consumed* a validity verdict:
- `[API]` `[valid]` input — the consuming wizard combined per-step validity signals (`step1Valid()…step5Valid()`) into `isCurrentStepValid()` and fed the boolean in; `[valid]=false` disabled Next. The stepper never knew *why* a step was invalid — it only honored the gate.
- `[API]` `linear` input — blocked forward jumps past undone steps.

The V-rules for the wizard fields (e.g. the Organization Hierarchy validation set — 25 V-rules per `[BRAIN-OUT]` VALIDATION_INDEX) lived on the step-body form components, not the stepper.

The modern `<falcon-angular-stepper>` improves this: `[CODE]` falcon-stepper.types.ts — a declarative `forwardLockedFrom` array (consumer passes `[currentStep]` when the form is invalid, `[]` when valid) plus a `falcon-navigation-blocked` event with a typed `reason` (`'linear' | 'disabled' | 'forward-locked'`) so the wizard can reveal the offending validation errors.

## PES keys gating this component
**None.** A stepper rail is not PES-gated. Whole-wizard access was gerned by route guards / PES on the *page*, not the stepper. Per-step field-level PES gates (e.g. Falcon-only attributes) lived on the step-body components.

## State / signal pattern
`[API]` The legacy stepper used Angular signal inputs — `currentStep` as a `model<number>()` (two-way `[(currentStep)]`, 1-indexed), `valid` / `linear` / the four label keys as `input()`. Internal `computed()` signals: `count`, `isFirst`, `isLast`, `pct` (fill width). It was NOT a `ControlValueAccessor`.

The modern `<falcon-angular-stepper>` IS a CVA (`NG_VALUE_ACCESSOR`) — `activeValue` flows through `[(ngModel)]` / `formControlName`; values are `string | number` (not forced 1-indexed); `syncProps()` pushes props onto the Stencil element after `componentOnReady()`.

## Skeleton ↔ app-wrapper layering
- **Legacy** — pure Angular bespoke component in `libs/falcon/src/shared-ui/` — no Stencil skeleton, single render path. Companion directives `FalconStepDirective` (`<falcon-step>`) and `FalconStepperFooterDirective` (`[falconStepperFooter]`).
- **Modern** — Stencil skeleton `<falcon-stepper>` (Shadow) / `<falcon-stepper-tw>` (Light) + Angular wrapper `<falcon-angular-stepper>` (`libs/falcon-ui-core/`). `<falcon-angular-wizard>` composes the wrapper plus a footer. This is the layering pattern per `feedback_library_skeleton_app_api`.

## Integration gotchas
- **The component is gone — do not import it.** `import { FalconStepperComponent, FalconStepDirective, FalconStepperFooterDirective } from '@falcon'` will fail; those exports were removed with the Wave 7.13 deletion.
- **Selector collision (historical, now resolved by deletion)** — the legacy selector string was `'falcon-stepper'`, identical to the Stencil tag `<falcon-stepper>`. With the legacy component deleted, `<falcon-stepper>` now unambiguously means the modern Stencil tag.
- **Migration mapping** (for reading old wizard code): legacy `[(currentStep)]` (1-indexed) → modern `[(activeValue)]` (`string|number`); legacy `[valid]` → wizard `[canProceed]` / stepper `forwardLockedFrom`; legacy `[linear]` → stepper `mode="linear"`; legacy `(back)`/`(cancel)`/`(finish)` → wizard `(falconWizardBack)`/draft/`(falconWizardFinish)`; legacy `<falcon-step label><ng-template>…</ng-template></falcon-step>` → `[steps]` array + `<div slot="content-{value}">`; legacy `<ng-template falconStepperFooter>` → wizard built-in footer or `slot="footer-extra"`.

## Verification
🔴 HISTORICAL — component DELETED. Deletion ✅ VERIFIED ([CODE] filesystem check 2026-05-18). Modern-stepper facts ✅ VERIFIED against live `[CODE]` falcon-stepper.types.ts + falcon-stepper.component.ts. Legacy historical behavior 🟡 CODE-DERIVED from the surviving UI-layer dossiers (no live legacy source).
