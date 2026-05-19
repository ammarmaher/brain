# PR Review — Required Fixes — PR #41631 (Re-review v2)

> Reviewer: Brain SK · 2026-05-19 · Silent review.

## Required — blocks merge

| # | Sev | File / location | Fix | Verify by |
|---|---|---|---|---|
| R1 | P1 | `apps/{admin,management}-console/.../template-management/**` | De-duplicate the shared layer — move models, mappers, `template-management-api.service`, and the reusable sub-components into `libs/falcon` (`shared-data-access` + `shared-ui`). Each app keeps only its shell. | One copy in `libs/falcon`; both apps import it; `nx build` green; no duplicate `template-management.models.ts` under `apps/`. **Re-review required.** |

## Recommended — non-blocking

| # | Sev | Fix | Notes |
|---|---|---|---|
| R2 | P2 | Add specs for `template-form.service`, `template-management.mappers`, `mergeForEdit`/`buildRowsForCreate`, the permissions/checker step. | `mergeForEdit` is even documented "Exported for unit tests" — yet untested. |
| R3 | P2 | Dedicated PES pass on checker-level + `falcon-access.registry.ts`. | Security-sensitive — advised before merge. |
| R4 | P2 | Locate / link the Template Management PRD. | Business lifecycle currently unverified. |
| R5 | P2 | Refresh `Brain Outputs/understanding/backend/templates/` against live `falcon-core-templates-svc` source (`eBodyType.cs` + response DTO files). | Resolves B1. If the doc was stale, no PR change needed. If the PR is wrong, `bodyType === 2` returns zero channels → re-classify to P1. |
| R6 | P2 | Verify Templates is reachable from the browser — gateway route (`templates-cluster`) or direct host + CORS policy for the web-platform origin. | Resolves B2. The feature cannot work in a deployed browser without this. |
| R7 | P3 | Make `serializeChannels` order-insensitive (sort `userIds` + channels before `JSON.stringify`). | Resolves C1 — stops spurious unsaved-changes prompts. |
| R8 | P3 | Optionally route `console.error` through a shared logger. | Minor. |

## Verification after fixes

| Fix | How to verify | Re-review? |
|---|---|---|
| R1 | Single shared copy in `libs/falcon`; `nx build admin-console management-console` green | Yes — re-run the skill |
| R5 | `understanding/backend/templates/` refreshed; `bodyType` encoding confirmed | Spot-check |
| R6 | Browser network tab: Templates call returns 200, no CORS error | Spot-check |
| R2/R3/R7 | `nx test` green; PES pass report; dirty-tracking no longer order-sensitive | Spot-check |
