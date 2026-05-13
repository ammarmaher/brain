# falcon-stepper (LEGACY) — OVERVIEW

## Purpose
Bespoke Angular-only stepper component used by org-hierarchy wizards in admin-console and management-console. Originally wrapped PrimeNG `<p-stepper>` (Wave 29 era) and was refactored in **Wave 3** to drop PrimeNG entirely while preserving the public selector + inputs/outputs. Now renders a custom horizontal rail + `@switch` content panel + footer template.

## Business / UI use case
- Current consumer in production: `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/` + `add-user-wizard/`.
- Mirror consumer: `apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/`.
- Provides a step rail, per-step panel projection via `<falcon-step>` TemplateRef directives, and a customizable footer via `falconStepperFooter`.

## When to use it / when NOT to use it
- DO NOT use this for new code — `<falcon-angular-stepper>` (Stencil-paired, dual-render) is the preferred replacement.
- Keep this component compiling for the existing wizard consumers until a migration wave moves them onto `<falcon-angular-stepper>`.

## Status
- **LEGACY-IN-USE.** Wave 3 refactor preserved the public API but removed PrimeNG (no `primeng/*` imports remain).
- The selector + inputs/outputs are intact — consumers do not need to change anything until the migration to Falcon UI core ships.
- Long-term: marked for deprecation once admin-console + management-console wizards migrate to `<falcon-angular-stepper>`.

## Selector / Tags
- **Selector:** `falcon-stepper` (same string as the Falcon UI core component; namespace collision resolved at the import level — apps import `FalconStepperComponent` from `@falcon` barrel which resolves to this bespoke one).
- **No Stencil tag** — pure Angular bespoke component.
- **Companion directives:**
  - `<falcon-step>` selector, registered via `FalconStepDirective` — `label`, `icon`, `content` (TemplateRef).
  - `[falconStepperFooter]` attribute selector, registered via `FalconStepperFooterDirective` — provides a TemplateRef with context `{ $implicit: currentStep, valid, isFirst, isLast }`.

## Source paths
| Layer | Path |
|---|---|
| Component class | `libs/falcon/src/shared-ui/lib/components/falcon-stepper/falcon-stepper.component.ts` |
| Template | `libs/falcon/src/shared-ui/lib/components/falcon-stepper/falcon-stepper.component.html` |
| SCSS (legacy carry-over) | `libs/falcon/src/shared-ui/lib/components/falcon-stepper/falcon-stepper.component.scss` |
| Step directive | `libs/falcon/src/shared-ui/lib/components/falcon-stepper/falcon-step.directive.ts` |
| Footer directive | `libs/falcon/src/shared-ui/lib/components/falcon-stepper/falcon-stepper-footer.directive.ts` |
| Plan doc | `libs/falcon/src/shared-ui/lib/components/falcon-stepper/PLAN.md` |
| Barrel | `libs/falcon/src/shared-ui/lib/components/falcon-stepper/index.ts` |

The component file does NOT have a `*.scss` removal commit yet — Wave 3 left the SCSS in place even after the PrimeNG drop. This violates the project rule "no per-component SCSS" (see `feedback_no_inline_styles_tokens_only.md`). Confirmed by direct file presence.

## Known consumers
- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/add-client-wizard.component.ts` — imports `FalconStepperComponent, FalconStepDirective, FalconStepperFooterDirective` from `@falcon` barrel.
- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-user-wizard/add-user-wizard.component.ts` — same import.
- `apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.ts` — same.
- `apps/management-console/src/app/features/organization-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.ts` — same.

The `react-*` wrappers in `organization-hierarchy-page/components/wizard-components/` (admin-console) delegate to the org-hierarchy folder's wizards — so they indirectly consume the legacy stepper as well.

## Related components
- `<falcon-angular-stepper>` (Stencil-paired) — the modern replacement. See `falcon-stepper/`.
- `<falcon-angular-wizard>` — composes `<falcon-angular-stepper>` plus a Next/Back/Finish/Draft footer (analog to this legacy's `falconStepperFooter` directive). See `falcon-wizard/`.

## Ownership / Responsibility
- Owned by `libs/falcon/src/shared-ui/` legacy bespoke component layer.
- Considered REFERENCE-ONLY for the project — keep compiling, plan to delete after migration.
