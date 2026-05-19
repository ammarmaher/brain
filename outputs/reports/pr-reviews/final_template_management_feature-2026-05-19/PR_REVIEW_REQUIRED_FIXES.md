# PR Review — Required Fixes — PR #41631 (`final_template_management_feature`)

> Reviewer: Brain SK · 2026-05-19
> "Required" = must be resolved before merge. "Recommended" = should be addressed.

## Required fixes (block merge until resolved)

| # | Severity | File / location | Fix needed | Source rule | Owner | Status |
|---|---|---|---|---|---|---|
| R1 | P1 | `apps/admin-console/.../template-management/**` + `apps/management-console/.../template-management/**` | De-duplicate the Template Management shared layer. Move `template-management.models.ts`, `template-management.mappers.ts`, `template-management-api.service.ts`, and the reusable sub-components (`body-type-section`, `body-type-view`, `channel-tabs`, `checker-level-picker`, `unrestricted-banner`) into `libs/falcon` (`shared-data-access` for models/mappers/API, `shared-ui` for components). Each app keeps only its app-specific shell (`template-management.component`, `template-config-editor`, `routes.ts`). | Architecture/structure governance — no duplicated logic; Nx lib boundaries | PR author | open |

## Recommended fixes (non-blocking)

| # | Severity | File / location | Fix suggested | Rationale | Status |
|---|---|---|---|---|---|
| R2 | P2 | whole PR | Add `*.spec.ts` for `template-form.service`, `template-management.mappers`, `checker-assignment-api.service`, and the permissions/checker step. | 5860 LOC shipped with 0 tests; duplication (R1) raises regression risk. | open |
| R3 | P2 | `host-shell/.../permissions-privilege-step`, `checker-level-rows`, `checker-assignment-api.service.ts`, `libs/falcon/.../falcon-access.registry.ts` | Run a dedicated PES pass — verify checker-level subject IDs use `u:<ZitadelUserId>@<ns>`, `authorizeResources` keys exist, and the FE-before-BE fallback (per `docs` proposal §1) denies gracefully. | Security/PES correctness not verifiable from diff alone. | open |
| R4 | P2 | Template Management feature | Locate / link the Template Management PRD so lifecycle, statuses, and maker-checker rules can be confirmed. | Business-rule alignment currently UNVERIFIED; relates to Atlas Wave 4 gap "Templates CRUD missing". | open |
| R5 | P2 | DTO layer (`checker-assignment.models.ts`, `templates-base.ts`, mappers) | Generate `understanding/backend/` for the Core Templates service and verify FE DTOs match. | No backend contract reference exists for the new gateway. | open |
| R6 | P3 | `checker-assignment-api.service.ts` | Optionally route `console.error` through a shared logger. | Minor — current logging is acceptable. | open |
| R7 | P3 | 8 PrimeNG-importing files | Track for PrimeNG removal when this repo adopts the platform-wide migration. | Consistent with this repo today; not blocking. | open |

## Verification after fixes

| Fix # | How to verify | Re-review needed? |
|---|---|---|
| R1 | `libs/falcon` holds one copy of the shared layer; both apps import it; `nx build admin-console management-console` green; no duplicate `template-management.models.ts` under `apps/`. | Yes — re-run PR Review Governance Skill |
| R2 | `nx test` covers the new services/mappers/step. | Spot-check |
| R3 | PES pass report confirms subject contract + fallback. | Spot-check |
| R4 | PRD linked; business rules table in report filled. | Spot-check |
| R5 | `understanding/backend/<core-templates>/` exists; DTO diff clean. | Spot-check |
