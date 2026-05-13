# falcon-angular-wizard — GAPS & UPGRADES

## Missing capabilities

### 1. (P0) `step.status` is declared but not visualized
- **Gap:** the `FalconWizardStep.status?: 'active'|'completed'|'pending'|'error'` field is part of the public type but the Stencil source uses `currentStep` index for state rendering. So even if a consumer flags `step.status = 'error'`, the embedded stepper does not paint the dot red.
- **Recommendation:** thread `step.status` through to the embedded `<falcon-stepper>` by deriving `completedValues` and per-step `errorMessage` from `steps[i].status`. OR remove the `status` field from the type and document `currentStep` as the only state signal.

### 2. (P0) `currentStep` is 0-indexed; legacy bespoke is 1-indexed
- **Gap:** migration from `FalconStepperComponent` requires remapping every `step1 / step2 / step3` reference to 0-indexed. There is no compat shim.
- **Recommendation:** keep 0-indexed (it matches `steps` array index) and document loudly. Add a `stepIndexOffset?: 0 | 1` Input as a migration aid.

### 3. (P1) No per-step header
- **Gap:** `slot="header"` is single. Each step might want its own title (e.g., "Step 1: Account Information" vs "Step 2: Settings"). Consumer must wire this manually inside the step body.
- **Recommendation:** add `slot="header-{index}"` OR derive automatic title from `steps[currentStep].label` and expose a `showStepTitle?: boolean` Input.

### 4. (P1) No "Skip" button
- **Gap:** for optional steps (`step.optional === true`), no built-in skip affordance.
- **Recommendation:** when on a step where `steps[currentStep].optional === true`, show a `Skip` button (with translatable label) in the footer; emit `falconWizardStepChange` with `via: 'jump'`.

### 5. (P1) No "Save & Close" combination button
- **Gap:** the Draft button saves but does NOT close. Add an explicit "Save & Exit" Output.

### 6. (P2) Validation gate is synchronous-friendly only when using `stepControls`
- **Gap:** `stepControls` bridge calls `ctrl.markAllAsTouched(); return ctrl.valid;` — synchronous. If the step has async validators (e.g., `falconCheckExists`), `ctrl.valid` may be temporarily false. The wrapper does NOT await the async result.
- **Recommendation:** when `ctrl.pending`, the resolved validator should await `statusChanges.pipe(filter(s => s !== 'PENDING'), take(1))` before returning.

### 7. (P2) No "Reset Wizard" method
- **Gap:** no way to programmatically reset the wizard back to step 0 (e.g., after a successful submit).
- **Recommendation:** add `@Method() async reset(): Promise<void>` that sets `currentStep = 0` and emits a `falconWizardStepChange` with `via: 'jump'`.

### 8. (P2) No `disabled` overall flag
- **Gap:** while in-flight (async submit), the wizard cannot be greyed-out as a whole. Consumer must wrap it in a custom `<div [class.opacity-50]="loading">`.
- **Recommendation:** add `disabled?: boolean` Input that disables all footer buttons and the stepper navigation.

### 9. (P2) No "wizard busy" overlay
- **Gap:** no spinner overlay during async validation or step transition.
- **Recommendation:** add `busy?: boolean` Input that overlays a spinner; tokens via `--falcon-wizard-overlay-*`.

### 10. (P3) `nextLabel` etc. are bare strings — no i18n integration
- **Gap:** consumer must pre-translate. The legacy bespoke stepper accepted `nextLabelKey` (translation key) and translated internally.
- **Recommendation:** keep current behavior (consumer responsibility) BUT document the recommended pattern. Add a documentation example for using `(translateKey | translate)` on the inputs.

### 11. (P3) `slot="step-{currentStep}"` is the only rendered body — sibling slots ignored
- **Gap:** the wizard does NOT lazily destroy non-current step bodies. They render in the consumer's `<ng-content select="[slot=step-{i}]">` and the un-matched slot bodies are simply not displayed. For heavy step bodies (charts, tables), this is fine on memory but renders DOM that may run lifecycle hooks.
- **Recommendation:** document this clearly (no surprise). Add an opt-in `lazyStepBodies?: boolean` that uses `<ng-template>` projection and only stamps the active step's template.

## Missing accessibility features
- **(P1) `aria-current="step"` on the footer "Next/Back" buttons** — fix: rely on the embedded stepper's a11y instead, but verify announcement.
- **(P1) The validation-fail event does NOT focus the first invalid field** — consumers must do this themselves. Recommendation: on `falconStepValidationFail`, attempt to focus `[aria-invalid="true"]` first.
- **(P2) The content `<div role="region" aria-live="polite">` may double-announce when the step body has its own `role="region"`.** Audit.

## Missing tests
- _None observed in active source._
- Recommendation: Vitest tests for:
  - `next()` flow with `canProceed=false` (should no-op).
  - `validateStep` returning false → emits `falconStepValidationFail`.
  - `stepControls` with one invalid ctrl → blocks Next + marks touched.
  - `back()` at step 0 (no-op).
  - `goTo()` bounds check.

## Missing Tailwind / token parity
- The token file (`wizard.tokens.css`) likely exists but is smaller than the stepper's. Audit for: footer button colors per state, content padding, header margin-bottom.

## Performance risks
- Re-emitting `currentStep` via mutable Stencil prop triggers a full re-render of the embedded stepper element. With 5+ steps and frequent navigation, this is negligible — but with 20+ steps it could be measurable.

## Visual / interaction risks
- The footer always renders the buttons in the order `Back | <footer-extra> | Draft | Next/Finish`. There's no reorder option. RTL users see `Next/Finish | Draft | <footer-extra> | Back` which is correct.
- The Back button is suppressed on the first step but the Cancel button (consumer-supplied via `footer-extra`) is not — consumer must conditionally hide it.

## Reusable upgrade priority
- All of items 1–11 should live in the shared component, not per-page.

## Workaround availability
- For #1 (`step.status` not visualized): consumer can drive `[steps]` with a derived array that uses `currentStep` to compute the displayed state via the embedded stepper's `completedValues` — but this is awkward and should be eliminated by fixing the wizard.
- For #4 (Skip button): consumer can place a Skip button in `slot="footer-extra"` and call `wizardRef.next()` imperatively.
- For #7 (Reset): consumer can `currentStep.set(0)` directly (2-way binding works).
