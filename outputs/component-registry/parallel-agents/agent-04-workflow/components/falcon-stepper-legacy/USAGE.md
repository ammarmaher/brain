# falcon-stepper (LEGACY) — USAGE

## Real usage in active codebase

### admin-console add-client wizard
`apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/add-client-wizard.component.ts:6-14`
```ts
import {
  FalconAngularButtonComponent,
  FalconStepDirective,
  FalconStepperComponent,
  FalconStepperFooterDirective,
  TranslatePipe,
  TranslateService,
} from '@falcon';
```
Used in the template via:
```html
<falcon-stepper [currentStep]="currentStep()" [valid]="isCurrentStepValid()" (back)="onCancel()" (finish)="…">
  <falcon-step label="hierarchy.addClient.steps.info">
    <ng-template>
      <app-client-information-step …/>
    </ng-template>
  </falcon-step>
  <falcon-step label="hierarchy.addClient.steps.settings">
    <ng-template>
      <app-client-settings-step …/>
    </ng-template>
  </falcon-step>
  …
  <ng-template falconStepperFooter let-step let-valid="valid" let-isFirst="isFirst" let-isLast="isLast">
    <div class="…footer row…">
      <falcon-angular-button (click)="onPrev()" [disabled]="isFirst">Back</falcon-angular-button>
      <falcon-angular-button (click)="onNext()" [disabled]="!valid">{{ isLast ? 'Save' : 'Next' }}</falcon-angular-button>
    </div>
  </ng-template>
</falcon-stepper>
```
The `step1Valid()` / `step2Valid()` / `step3Valid()` / `step4Valid()` / `step5Valid()` signals are combined in `isCurrentStepValid()` (`switch (currentStep())`) and fed into `[valid]`.

### admin-console add-user wizard
`apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-user-wizard/add-user-wizard.component.ts` — same import pattern, 3 steps (personal / role-status / permissions).

### management-console mirror
`apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.ts` — identical 5-step structure, identical legacy stepper consumption.

`apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.ts` — same.

### react-* prefix wrappers (admin-console organization-hierarchy-page)
`apps/admin-console/src/app/features/organization-hierarchy-page/components/wizard-components/add-client-wizard/react-add-client-wizard.component.ts` — delegates to the org-hierarchy folder's AddClientWizardComponent (which uses the legacy stepper indirectly via the import barrel).

## Recommended usage for NEW Angular pages
- **DO NOT use this legacy component for new pages.** Use `<falcon-angular-wizard>` instead, which wraps `<falcon-angular-stepper>` and supplies a Next/Back/Finish/Draft footer plus optional Reactive Forms validation gates.
- For migration, the public API maps fairly cleanly:
  - `<falcon-step label="…">` → `step.label` + `slot="content-{value}"`.
  - `[(currentStep)]` (1-indexed) → `[(activeValue)]` (any string|number, NOT necessarily 1-indexed).
  - `<ng-template falconStepperFooter>` → wizard footer rendered automatically OR `slot="footer-extra"` for additions.

## Reactive Forms / ngModel
- The legacy stepper does NOT implement CVA. Use Reactive Forms ONLY on the step bodies (inputs inside `<falcon-step>` `<ng-template>`).

## Tailwind / token usage
- The template mixes Tailwind utilities (`flex`, `flex-col`, `gap-2`, etc.) AND raw `var(--color-falcon-neutral-150, …)` arbitrary values.
- The `*.component.scss` file (legacy) is still present and likely contains the `.fs-rail`, `.fs-track`, `.fs-fill`, `.fs-dot`, `.fs-labels`, `.fs-label`, `.fs-panels`, `.fs-footer-btn` rules referenced in the template.
- **Violates the project's "no per-component SCSS" rule.** The SCSS file must be deleted as part of the migration / deletion plan.

## Bad usage to avoid
- DO NOT add new `<falcon-step>` consumers in new code.
- DO NOT extend `FalconStepperComponent` with subclasses or augment its template.
- DO NOT remove or rename the directives until all consumers migrate — a `dangling import` error blocks the build.

## Do / Don't
- DO keep this compiling.
- DO bookmark the Wave 3 PLAN.md (`libs/falcon/src/shared-ui/lib/components/falcon-stepper/PLAN.md`) — it documents the design intent and the rationale for dropping PrimeNG.
- DON'T add features to this component — invest in `<falcon-angular-stepper>` instead.
- DON'T mix this legacy stepper with the Stencil-paired one in the same page (the selectors collide; pick one import).
