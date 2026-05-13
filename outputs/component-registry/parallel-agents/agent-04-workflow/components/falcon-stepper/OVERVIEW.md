# falcon-angular-stepper — OVERVIEW

## Purpose
Active dual-render-path step-progress indicator. Renders an evenly-spaced row (horizontal) or column (vertical) of dots connected by a fill track, plus optional labels, descriptions, optional tags, helper text, and an error message. Owns the visual feedback for a multi-step process; navigation business logic lives in the consumer or in `<falcon-angular-wizard>` (which wraps it).

## Business / UI use case
- Multi-step "Add Client" / "Add User" wizard headers in admin-console and management-console.
- Any sequential workflow where the user needs to see "where am I in the process".
- Replaces the legacy PrimeNG `<p-stepper>` and the old custom React `ACStepBar` (admin/addclient.css:95-169) — Falcon Stencil ports the same visual contract (18 px dot, 4 px teal fill, halo) so V0.2 reference parity holds.

## When to use it / when NOT to use it
- USE for finite, sequential, ordered steps with a known total count where the visual order matches user progression.
- USE when the user must understand which step they are on AND which steps are completed.
- DO NOT use for tab-style navigation (use `<falcon-angular-tabs>` `mode="navigation"`).
- DO NOT use as a free-form menu — the stepper enforces a linear/non-linear model with completion semantics.
- DO NOT use for hierarchical or nested flows — use a wizard with a single linear stepper that resets per-flow instead.

## Status
- **ACTIVE / PREFERRED.** First-class dual-render-path Stencil component with full Angular CVA wrapper.
- Replaces legacy PrimeNG `<p-stepper>` (uninstalled in Wave PR-8) and the old bespoke `libs/falcon/src/shared-ui/lib/components/falcon-stepper/` Angular component (now considered LEGACY — see `falcon-stepper-legacy/`).

## Selectors / Tags
- **Angular selector:** `falcon-angular-stepper`
- **Stencil Shadow tag:** `<falcon-stepper>` (token-driven, default when `useTailwind=false`)
- **Stencil Light tag:** `<falcon-stepper-tw>` (Tailwind utility classes from `stepper-tailwind-classes.ts`; default when `useTailwind=true`)

## Source paths
| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-stepper/falcon-stepper.component.ts` |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-stepper/falcon-stepper.component.html` |
| Angular index barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-stepper/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-stepper/falcon-stepper.tsx` |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-stepper/falcon-stepper.css` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-stepper-tw/falcon-stepper-tw.tsx` |
| Types | `libs/falcon-ui-core/src/components/falcon-stepper/falcon-stepper.types.ts` |
| Utils | `libs/falcon-ui-core/src/components/falcon-stepper/falcon-stepper.utils.ts` |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/stepper-tailwind-classes.ts` |
| Tokens | `libs/falcon-ui-tokens/src/components/stepper.tokens.css` |

## Known consumers
- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-client-wizard/` — used INDIRECTLY through legacy `FalconStepperComponent` from `@falcon` barrel (the bespoke `libs/falcon/src/shared-ui/lib/components/falcon-stepper/`); not the Falcon UI core `falcon-angular-stepper` directly. GAP/OPPORTUNITY: migration path.
- `apps/admin-console/src/app/features/organization-hierarchy/components/wizard-components/add-user-wizard/`
- Mirror folders inside `apps/management-console/src/app/features/organization-hierarchy-page/`
- `apps/host-shell/src/app/playground/playground.page.html` — exposes a playground showcase.

Important finding: **the active wizard consumers still use the LEGACY bespoke `<falcon-stepper>` from `libs/falcon/src/shared-ui/`** (see `falcon-stepper-legacy/` folder). The new `<falcon-angular-stepper>` is not yet wired into the org-hierarchy wizards as of this audit. This is the highest-priority migration candidate.

## Related components
- `falcon-angular-wizard` — composes this stepper plus step content slot plus footer Next/Back/Finish/Draft navigation.
- `falcon-angular-tabs` — alternative when navigation is non-sequential.
- `falcon-stepper` (legacy bespoke under `libs/falcon/src/shared-ui/`) — predecessor (REFERENCE-ONLY).

## Ownership / Responsibility
- Owned by Falcon UI core (Stencil + Angular wrapper).
- Behaviour and a11y semantics live in the Stencil class (`FalconStepper`).
- Token contract lives in `stepper.tokens.css` (SSOT — Tailwind helper mirrors).
- Studio surfaces label-position + size + shape via the dedicated stepper token panel.
