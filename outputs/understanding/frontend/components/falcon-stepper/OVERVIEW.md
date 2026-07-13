# falcon-stepper — OVERVIEW

## Component purpose
Active dual-render-path step-progress indicator — the **live multi-step rail every Falcon wizard runs on**. Renders an evenly-spaced row (horizontal) or column (vertical) of dots connected by a teal fill track, plus optional labels, descriptions, optional tags, a per-step completed-check / active-pulse, helper text, and a stepper-wide error message. Owns the visual feedback for a multi-step process plus a consumer-driven forward-navigation gate; the wider Next/Back orchestration lives in the consumer or in `<falcon-angular-wizard>` (which wraps it).

## Business / UI use case
- Multi-step **Add Client** / **Add User** / **Add Node** wizard headers in admin-console and management-console org-hierarchy-page.
- The step rail of the **Templates** wizard (admin + management) and the **Contracts Add** wizard (admin).
- The step rail of the **Create Contact Group** flow (management).
- Any sequential workflow where the user must see "where am I in the process" and is blocked from skipping ahead until each step is valid.
- `[CODE]` It renders the rail ONLY; consumers mount the active step's panel content externally (add-client-wizard.component.html:67-72 "Panels — rendered outside the rail (the new wrapper is rail-only by design)"). The React visual contract it ports is `admin/addclient.css` `.ac-stepper*` + `admin/styles.css` `.au-stepper*` (`[CODE]` falcon-stepper.tsx:2-9): 18px dot, 4px teal fill, halo.

## When to use it / when NOT to use it
- USE for finite, sequential, ordered steps with a known total count where the visual order matches user progression.
- USE when the user must understand which step they are on AND which steps are completed.
- USE when forward navigation must be gated on per-step validity (`[forwardLockedFrom]`).
- DO NOT use for tab-style navigation (use `<falcon-angular-tabs>`).
- DO NOT use as a free-form menu — the stepper enforces a linear/non-linear model with completion semantics.
- DO NOT use for hierarchical or nested flows.
- DO NOT bolt your own Next/Back/Finish buttons onto a bare stepper — use `<falcon-angular-wizard>` which composes it.

## Status
- **ACTIVE / PREFERRED.** First-class dual-render-path Stencil component with a full Angular CVA wrapper. `[CODE]` Registered via `defineFalconTwComponent('falcon-stepper')` (falcon-stepper.component.ts:81); exported from the Angular barrel `[CODE]` angular-wrapper/index.ts:31.
- **Migration COMPLETE (2026-06-03 correction):** the prior dossier claimed the org-hierarchy wizards still used the legacy bespoke stepper. That is now STALE — the legacy `dynamic-stepper` was DELETED 2026-05-17 (`[CODE]` libs/falcon/src/shared-ui/index.ts:11-13: "Legacy Falcon Stepper … DELETED 2026-05-17 — was dead code (0 consumers). Both wizards consume FalconAngularStepperComponent (Stencil-backed)") and `<falcon-angular-stepper>` is now the live consumer across **21 occurrences / 13 files** (grep 2026-06-03).

## Replaces
- The legacy bespoke `dynamic-stepper` Angular component (`libs/falcon/src/shared-ui/lib/components/dynamic-stepper/`), DELETED 2026-05-17 — see `falcon-stepper-legacy/` (DEPRECATED/SUPERSEDED). Architecture notes archived at `[BRAIN-OUT]` Brain Outputs/strategies/falcon-stepper-legacy/PLAN.md.
- The old React `ACStepBar` (`admin/addclient.css:95-169`) — Falcon Stencil ports the same visual contract so V0.2 reference parity holds (`[CODE]` falcon-stepper.tsx:2-9).

## Selectors / Tags
- **Angular selector:** `falcon-angular-stepper`
- **Stencil Shadow tag:** `<falcon-stepper>` (token-driven; rendered when `useTailwind=false`)
- **Stencil Light tag:** `<falcon-stepper-tw>` (Tailwind utility classes from `stepper-tailwind-classes.ts`; DEFAULT — rendered when `useTailwind=true`)

## Source paths
| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-stepper/falcon-stepper.component.ts` (253 ln) |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-stepper/falcon-stepper.component.html` (31 ln) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-stepper/falcon-stepper.component.css` (`:host { display:block }` only — pass-through) |
| Angular index barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-stepper/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-stepper/falcon-stepper.tsx` (551 ln) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-stepper/falcon-stepper.css` (413 ln; token-only — no raw hex) |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-stepper-tw/falcon-stepper-tw.tsx` (531 ln) |
| Types | `libs/falcon-ui-core/src/components/falcon-stepper/falcon-stepper.types.ts` (66 ln) |
| Utils | `libs/falcon-ui-core/src/components/falcon-stepper/falcon-stepper.utils.ts` (108 ln; pure, no DOM) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/stepper-tailwind-classes.ts` (334 ln; token-chain only) |
| Tokens | `libs/falcon-ui-tokens/src/components/stepper.tokens.css` (238 ln; `:where()`-scoped, gate-12 compliant) |
| Showcase doc | `libs/falcon-ui-showcase-data/src/docs/stepper.md` |
| Spec / e2e | **NONE** — no `falcon-stepper.spec.ts` / `.e2e.ts` / wrapper spec on disk (GAP). |

## Known consumers (grep verified 2026-06-03)
`[CODE]` `<falcon-angular-stepper` across `apps/` = **21 occurrences / 13 files** (HTML render sites + TS imports). All use the default Tailwind render path and pass `labelPosition="bottom-center"`, `mode="linear"`, `orientation="horizontal"`, `[forwardLockedFrom]`. Representative render sites:
- `apps/admin-console/.../org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html:54` — flagship (rail-only + external `@switch` panels).
- `apps/{admin,management}-console/.../org-hierarchy-page/components/wizard-components/add-user-wizard/add-user-wizard.component.html`.
- `apps/{admin,management}-console/.../templates-page/components/templates-wizard/templates-wizard.component.html:93`.
- `apps/admin-console/.../contracts-cost-management/components/contracts-add-wizard/contracts-add-wizard.component.html`.
- `apps/management-console/.../contact-groups/create-contact-group/create-contact-group.component.html`.

(NOTE: the prior dossier's `host-shell/.../playground/playground.page.html` consumer is GONE — playground removed.) See `USAGE.md` Consumer Sweep for the enumerated list.

## Related components
- `<falcon-angular-wizard>` — composes this stepper plus step-content + footer Next/Back/Finish/Draft navigation.
- `<falcon-angular-tabs>` — alternative when navigation is non-sequential.
- `falcon-stepper-legacy` (deleted bespoke `dynamic-stepper`) — predecessor, DEPRECATED/SUPERSEDED (see that dossier).

## Ownership / Responsibility
- Owned by Falcon UI core (Stencil + Angular wrapper).
- Behaviour + a11y semantics live in the Stencil class (`FalconStepper` / `FalconStepperTw`).
- Token contract lives in `stepper.tokens.css` (SSOT — Tailwind helper mirrors).
- Studio surfaces label-position + size + shape via the dedicated stepper token panel.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B21 sweep). All source layers re-read on disk (wrapper 253 ln, Shadow .tsx 551 ln, `-tw` .tsx 531 ln, types/utils/tailwind-helper/tokens). Consumer count grep'd: 21 occurrences / 13 files. **Drift corrected vs prior dossier:** migration is DONE (not pending); legacy deleted 2026-05-17; playground consumer removed; `showStepNumbers` default is `false` (not `true`); `navigationBlocked` IS a wrapper Output.
