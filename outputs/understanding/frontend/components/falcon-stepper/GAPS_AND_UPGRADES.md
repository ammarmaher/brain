# falcon-angular-stepper — GAPS & UPGRADES

## Missing capabilities

### 1. (P0) Real consumers not migrated yet
- **Gap:** the active wizards in admin-console + management-console still import the LEGACY bespoke `FalconStepperComponent` from `@falcon` (the bespoke component under `libs/falcon/src/shared-ui/lib/components/falcon-stepper/`), not this new Stencil-paired one.
- **Where:** `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/add-client-wizard.component.ts:6-14` (and the parallel `add-user-wizard` + management-console mirrors).
- **Impact:** the Falcon UI core component has not seen production traffic yet — first migration is the de-risking moment.
- **Recommendation:** plan a Wave that swaps the legacy stepper import for `FalconAngularStepperComponent`; reuse `FalconStepperStep[]` shape directly (it is more expressive than the legacy directive-based content-projection).
- **Risk:** the legacy component uses `<falcon-step>` content directives with TemplateRef — the migration must convert each step body into a slotted `<div slot="content-{value}">`.

### 2. (P1) No per-step custom indicator slot
- **Gap:** the dot content is hard-coded (number / check / pulse / icon). There is no `ng-template` or slot for a fully custom dot (e.g., a small avatar for a "person who completed the step").
- **Recommendation:** add `<slot name="dot-{value}">` in Stencil + matching `*falconStepperDot` directive on the Angular wrapper. Falls back to the current logic when no slot is provided.
- **API proposal (Angular side):**
  ```ts
  @Directive({ selector: '[falconStepperDot]' })
  export class FalconStepperDotDirective {
    @Input('falconStepperDot') value!: string | number;
    readonly tpl = inject(TemplateRef);
  }
  ```
  Then in the wrapper: query `@ContentChildren(FalconStepperDotDirective)` and render the template inside `<div slot="dot-{value}">` for each match.

### 3. (P1) No per-step custom label slot
- **Gap:** label text is `step.label` only. There is no slot for label + small chip + tooltip.
- **Recommendation:** add `<slot name="label-{value}">` plus matching Angular directive. Same pattern as dot slot.

### 4. (P2) `step.icon` collides with number rendering
- **Gap:** when both `icon` is set and `showStepNumbers=true`, the icon is hidden on the active state but shown on upcoming/completed/error states — inconsistent semantics. See `renderDotContent()` in `falcon-stepper.tsx` lines 227-264.
- **Recommendation:** treat `icon` as a "replacement for the number entirely". Either:
  - Always render icon when present (drop the `state !== 'active'` guard), OR
  - Add a separate `iconBehavior: 'always' | 'when-completed' | 'when-non-active'` prop.

### 5. (P2) No validation hook
- **Gap:** the stepper does not gate forward navigation on a validation callback. Linear mode only blocks "skip past current+1"; it doesn't block "go forward from current" when the current step's form is invalid.
- **Where stepped around today:** `<falcon-angular-wizard>` adds `validateStep?: (step: number) => boolean | Promise<boolean>` and a `stepControls` bridge — but pure stepper consumers (without the wizard wrapper) cannot block forward nav.
- **Recommendation:** add `canAdvance?: (currentValue, nextValue) => boolean | Promise<boolean>` Prop on the Stencil component (Light + Shadow). Wrapper exposes the same. Emit `falcon-blocked` event when validation fails so consumers can show a toast.

### 6. (P2) `errorMessage` shows under the WHOLE stepper, but per-step error has no visual error message location
- **Gap:** `step.errorMessage` paints the dot red but the message text is invisible. Users see "this step is broken" but no hint of why.
- **Recommendation:** render `step.errorMessage` either as a tooltip on the dot OR inline next to the per-step label (`<span class="falcon-stepper-step-error">`). Add `--falcon-stepper-step-error-*` tokens.

### 7. (P2) Vertical orientation does not support `labelPosition`
- **Gap:** `labelPosition` is honored only in horizontal mode. Vertical always renders labels beside the dot (effectively `'side'`).
- **Recommendation:** support `labelPosition="top"` for vertical (renders label above the dot) since some workflows want the label visually before the dot.

### 8. (P2) No "click on completed step jumps to it" affordance signal
- **Gap:** the dot is clickable on completed steps but there's no hover-cursor change or visual hint to suggest "you can click this".
- **Recommendation:** add `cursor: pointer` plus `:hover` token state for completed dots, and document that completed dots are interactive even in linear mode.

### 9. (P3) No "Pause/Resume" semantics
- **Gap:** there's no way to mark a step as "in progress" distinct from "active". For long-running async flows where the active step is doing work, the dot should pulse or show a spinner.
- **Recommendation:** add `step.status?: 'in-progress' | undefined` for fine-grained dot decoration.

### 10. (P3) No `currentPageReportTemplate`-style helper for "Step X of Y"
- **Gap:** consumers must build this string manually.
- **Recommendation:** expose a `stepIndicatorFormat?: string` Prop with `{current}` / `{total}` tokens, rendered above or below the stepper as opt-in.

## Missing accessibility features
- **(P1) `role="region"` panels are not always announced.** When orientation switches mid-flight, the hidden/active panel transition may not trigger an SR re-announce. Recommendation: bump a unique `aria-labelledby` per orientation change.
- **(P1) Vertical mode does not expose the `aria-orientation="vertical"` attribute on the outer `<div role="group">`.** Recommendation: add `aria-orientation={this.orientation === 'vertical' ? 'vertical' : 'horizontal'}`.
- **(P2) No `aria-describedby` linking to `helperText` when present.** Recommendation: assign an ID to the helper `<p>` and reference it via `aria-describedby` on the outer group.
- **(P2) The dot button announces `aria-current="step"` only on active; it would be richer to announce "Completed, step 2 of 5" via combined label.** Recommendation: extend `stepAriaLabel()` to include the state descriptor.

## Missing tests
- _None observed in active source._ No `*.spec.ts` next to the wrapper or Stencil file. Wider gap: the parity audit between Shadow and Light DOM rendering is not exercised by automated tests.
- Recommendation: add Vitest tests for:
  - `resolveStepState()` matrix (upcoming/active/completed/error/disabled).
  - `computeFillPercent()` (edge cases: empty steps array, single step, all completed).
  - Keyboard navigation (Arrow keys, Home, End).
  - Linear mode `canNavigateTo()` rules.
  - Shadow/Light parity (snapshot the DOM under both modes).

## Missing Tailwind / token parity
- **Drag:** `falcon-stepper-tw` has a Wave 10D default of `labelPosition='bottom-center'` while the Shadow default is `'top-center'`. Visual divergence between the two render paths for the same `steps` input. The Tailwind helper compensates but the contract is now non-symmetric.
- **Recommendation:** align defaults — pick one (`'bottom-center'` matches React reference parity) and document the change.

## Performance risks
- `_steps` setter pushes to the live element on every parent ref change. If the parent component re-creates the array on every CD cycle, this re-renders the dot row each time. Currently mitigated by `OnPush` + immutable signals in real consumers, but a `trackBy(value)` semantic is missing inside Stencil's `this.steps.map()`. The Stencil `key={String(step.value)}` is present (good), but if `step.value` changes (which it shouldn't) the dot would re-create instead of reuse.

## Visual / interaction risks
- The 18 px solid-fill dot has NO border ring — fill IS the state. This is fine for `bg-active` vs `bg-upcoming` contrast but breaks down in dark mode if `--falcon-stepper-circle-bg-upcoming` is not overridden. Dark mode override is missing in `stepper.tokens.css`.
- The pulse animation runs continuously when `showStepNumbers=false` and the dot is active. On reduced-motion preference users (prefers-reduced-motion: reduce), this should pause. _None observed in active source._

## Reusable upgrade priority — fix in shared component vs per-page
- All of items 1–10 SHOULD be implemented in the shared Falcon component, NOT per-page. Per-page workarounds (custom CSS, overlay buttons, bespoke validation gates) would fragment the visual contract.

## Workaround availability
- For validation gating today: use `<falcon-angular-wizard>` which wraps this stepper and adds `validateStep` plus `stepControls`. The wizard is the canonical "stepper + nav + validation" composition.
