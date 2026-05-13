# falcon-angular-wizard — OVERVIEW

## Purpose
Multi-step workflow shell that composes `<falcon-stepper>` plus a `[slot="step-{index}"]` content area plus a Next/Back/Finish/Draft footer. Adds optional per-step validation gating: `validateStep` callback OR Angular Reactive Forms `AbstractControl[]` (`stepControls`) bridge — Wave 5 contract.

## Business / UI use case
- Any multi-step business form (Add Client, Add User, Add Subscription, etc.) where each step has its own form.
- The wizard owns the chrome (stepper + body + footer) so the consumer only writes per-step body components.
- Validation gate prevents the user from clicking Next until the current step's form is valid (mark-all-touched + return `control.valid`).

## When to use it / when NOT to use it
- USE for any new wizard / multi-step form. Default the import to `FalconAngularWizardComponent` in `imports: []`.
- USE when you want a single component to own stepper + body + footer (and you accept slot-based body projection).
- DO NOT use when the steps are non-sequential, free-form, or contextual (use tabs instead).
- DO NOT use when each step needs entirely different chrome (e.g., one full-screen page + one drawer) — the wizard expects a single content area.
- DO NOT use for a single-step form (just use the form + a normal button row).

## Status
- **ACTIVE / PREFERRED** for any new wizard.
- Architect §5.12.3 wizard contract. Wave 9.G + Wave 5 (validation bridge).

## Selectors / Tags
- **Angular selector:** `falcon-angular-wizard`
- **Stencil Shadow tag:** `<falcon-wizard>` (default when `useTailwind=false`)
- **Stencil Light tag:** `<falcon-wizard-tw>` (default when `useTailwind=true`)

## Source paths
| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard/falcon-wizard.component.ts` |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard/falcon-wizard.component.html` |
| Angular index | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-wizard/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-wizard/falcon-wizard.tsx` |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-wizard/falcon-wizard.css` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-wizard-tw/falcon-wizard-tw.tsx` |
| Types | `libs/falcon-ui-core/src/components/falcon-wizard/falcon-wizard.types.ts` |
| Tokens | `libs/falcon-ui-tokens/src/components/wizard.tokens.css` |

## Known consumers
- `apps/host-shell/src/app/playground/playground.page.html` — playground showcase.
- **No production consumer yet** in admin-console or management-console org-hierarchy wizards — they still use the legacy bespoke `<falcon-stepper>` + manual Next/Back/Cancel buttons + `<falcon-angular-popup>` for unsaved-changes confirm.
- **Migration opportunity** — the wizards in `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/` are the primary target consumers (see `falcon-stepper-legacy/USAGE.md`).

## Related components
- `<falcon-angular-stepper>` — internal composition (the wizard renders one inside its `<div class="falcon-wizard-stepper">`).
- `<falcon-angular-popup>` — recommended for the unsaved-changes confirmation modal (consumer-owned, not embedded by the wizard).
- `<falcon-angular-button>` — used inside the wizard footer.

## Ownership / Responsibility
- Owned by Falcon UI core (Stencil + Angular wrapper).
- The Stencil component owns the slot layout + footer button rendering (header / step-{i} / footer-extra).
- The Angular wrapper adds the `stepControls` Reactive-Forms bridge — a derived `resolvedValidateStep` callback that marks the matching `AbstractControl` as touched and returns `control.valid`.
- Token contract: `wizard.tokens.css`.
