# falcon-stepper (LEGACY) — GAPS & UPGRADES

## Missing capabilities

### 1. (P0) Selector collides with `<falcon-stepper>` Stencil tag
- The Angular component selector is `'falcon-stepper'` — the same string as the Falcon UI core Stencil Shadow tag `<falcon-stepper>`. When both are loaded in the same page (e.g., a playground showcase + a wizard), the Custom-Elements registry and the Angular template parser have ambiguous resolution.
- The current safe answer: any consumer that imports `FalconStepperComponent` from `@falcon` resolves to the legacy Angular component. The Falcon UI core Stencil tag is registered globally via `defineFalconTwComponent('falcon-stepper')` — Angular's template parser usually wins because the import is explicit. But it is fragile.
- **Recommendation:** rename the legacy selector to `'falcon-stepper-legacy'` (or `'app-legacy-stepper'`) as part of the migration cleanup.

### 2. (P0) Legacy *.scss file violates project rule
- `falcon-stepper.component.scss` still exists. The Falcon project standard since Wave PR-8 + the Noor Instructions is "Tailwind utilities in templates only — no SCSS".
- **Recommendation:** rewrite the visual rules as Tailwind utilities inside the HTML template, or move them into a per-component token file (`stepper-legacy.tokens.css`) and consume via `:where(falcon-stepper-legacy) { … }`.

### 3. (P1) No keyboard navigation
- Arrow keys, Home, End don't move dot focus. Tab traversal works but jumps directly between dots (not very intuitive).
- **Recommendation:** add `@HostListener('keydown')` or `(keydown)` on the dot button that mirrors the `<falcon-angular-stepper>` arrow-key behavior.

### 4. (P1) Footer is a TemplateRef, not a fixed slot
- The footer template lives in `<ng-template falconStepperFooter>` and is conditionally rendered with `*ngTemplateOutlet`. Migration to `<falcon-angular-wizard>` requires extracting that template into either:
  - Wizard's built-in footer (Next/Back/Finish/Draft), OR
  - `slot="footer-extra"` for custom add-ons.
- **Recommendation:** plan the migration carefully — preserve `valid`, `isFirst`, `isLast` semantics.

### 5. (P1) No per-step error visual
- `dotState()` is `'idle' | 'active' | 'done'` — no `'error'`. Per-step validation failure is invisible on the dot.
- **Recommendation:** since the component is REFERENCE-ONLY, do NOT add this — implement it in `<falcon-angular-stepper>` and migrate.

### 6. (P2) Uses `*ngTemplateOutlet`
- Template uses `<ng-container *ngTemplateOutlet="step.content()" />` — that's the old directive-style syntax. Per project rules `@if/@for/@switch` are the canonical control flow.
- Not a hard violation — `*ngTemplateOutlet` is still permitted — but the file shows a mix that suggests partial migration.

### 7. (P2) `linear` mode is true by default, no escape hatch
- The `(click)` handler short-circuits when `dotState !== 'done'`. There is no way to allow jumping to a future step (even with explicit user opt-in).

### 8. (P2) `cancel` vs `back` semantics are conflated
- `onBack()` emits `back` when on the first step, otherwise decrements `currentStep`. `onCancel()` emits `cancel` only from the first step. Consumers need to listen to both; the wizard wrapper would simplify.

### 9. (P3) The `step.icon()` input is declared but never rendered
- `FalconStepDirective.icon` is unused in the template. Dead input.
- **Recommendation:** either render it (left of the label, or inside the dot) or remove the input.

### 10. (P3) Translation is mandatory
- Every label is run through `TranslatePipe`. If the consumer wants a literal English label, they must register an i18n key. The Falcon UI core stepper does not enforce this.

## Missing accessibility features
- **(P1) Roving tabindex** — Tab moves through every dot. Should be roving (only the active dot gets tabindex=0).
- **(P2) No `aria-label` fallback for the outer container** — only the inner role=tablist has aria-orientation.

## Missing tests
- _None observed in active source._

## Missing Tailwind / token parity
- Legacy SCSS classes (`.fs-rail`, `.fs-dot`, etc.) do not share any `--falcon-stepper-*` token names with the new Falcon UI core stepper. Full divergence — intentional given migration plan.

## Performance risks
- `dotState(i)` and `dotPos(i)` are called per render per dot per template expression evaluation. Without memoization, each CD cycle re-computes O(n) calls. With OnPush + signal, this is OK for n ≤ 10 but could be cleaner with computed signals returning a `Map<number, DotState>`.

## Visual / interaction risks
- The "dot pulse" on the active state is implemented as a `<span class="fs-dot-pulse">` element with CSS animation. With `prefers-reduced-motion: reduce` enabled, it should stop — UNVERIFIED.

## Reusable upgrade priority
- **DO NOT upgrade this legacy component.** Migrate all consumers to `<falcon-angular-stepper>` / `<falcon-angular-wizard>` and delete this file.

## Workaround availability
- Today: the wizards work. The migration is the only outstanding task — it is large (each step body wraps a complex form component).
