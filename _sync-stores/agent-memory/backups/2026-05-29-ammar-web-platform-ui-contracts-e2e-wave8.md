---
name: session-backup-contracts-admin-e2e-suite-wave-8
description: Authored the full Playwright E2E suite + run recipe for admin-console Contracts & Cost Management; added 50 data-testids to the feature
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-05-29
  status: completed
  originSessionId: 2479810e-ac31-4f30-b718-0153e3ee8d66
---

## What Was Done
WAVE 8 (E2E) for the admin-console Contracts & Cost Management feature. AUTHORED-NOT-RUN
(no Docker stack in this env). Delivered a complete, strict-typecheck-clean Playwright suite
+ a run recipe, and added minimal data-testids to the feature for stable selectors.

**Repo convention learned:** there is NO `*-e2e` nx project and NO root `@playwright/test`
dependency. The ONLY Playwright install in the repo is `tools/visual-regression/` (own
`package.json`, `@playwright/test ^1.44.0`, targets a Vite playground :5175, no auth/storageState,
no webServer). I mirrored that exactly → new tool dir `tools/contracts-e2e/`.

**Suite files (all under `C:\Falcon\Falcon\falcon-web-platform-ui\tools\contracts-e2e\`):**
- `package.json` (@playwright/test ^1.44.0, local install only — no root churn)
- `playwright.config.ts` — baseURL `http://localhost:4200` (E2E_BASE_URL override); 3 projects:
  `setup` (auth) → `admin-ltr` (all functional specs, storageState) + `admin-rtl` (RTL spec).
  No webServer (stack must be pre-running).
- `project.json` — nx project `contracts-e2e`, targets e2e/install/report, implicitDependencies host-shell+admin-console.
- `tsconfig.json`, `.gitignore`
- `auth.setup.ts` — logs `sysadmin`/`Admin@1234` in via the REAL UI (sessionStorage JWT can't be
  hand-crafted), persists `.auth/sysadmin.json`. USERNAME not email. OTP-disabled single-step path.
- `fixtures/selectors.ts` — single source of truth (testids + Stencil DOM + labels en/ar + API regexes + catalog codes)
- `fixtures/helpers.ts` — page-object helpers (login, gotoContracts, org-tree select, table row-ids via data-row-id, wizard fills, matrix cell commit, field disabled/error checks, dark toggle)
- 6 specs (24 tests): `contracts-happy-paths` (C-01/02/04/04b/05), `contracts-create-wizard` (C-03 full 4-step),
  `contracts-view-edit` (C-09 status-freeze a/b/c + C-04c), `contracts-validation` (C-06a-e/07/10),
  `contracts-edge-empty-states` (C-08/08b/11/02b), `contracts-cross-cutting` (C-13 dark/C-14 role/C-14b client-deny),
  `contracts-rtl.rtl.e2e.ts` (C-12 a-d Arabic/RTL, runs in admin-rtl project).
- `README.md` — case-matrix→spec table + full testid add-list + auth model + why-this-location.

**Run recipe:** `C:\Falcon\qa\runs\contracts-scrape-2026-05-29\E2E-RUN-RECIPE.md` — Docker bring-up,
seed (seed-test-users.sh + seed-service-scenarios.js + seed-wallet-e2e.js), creds, npx playwright test,
per-scenario PASS criteria table (all 16 brief scenarios + sub-cases), SoT URL `http://localhost:8765/...#contracts=falcon`
+ scraped sot-react/ path.

**50 data-testids added to the feature (+1 topbar):** see README add-list. Behavior-free anchors.
Static testids on `<falcon-angular-*>` wrappers forward to host elements; dynamic `[attr.data-testid]`
on matrix/rate-card/addon rows keyed by loop-local row.code/row.priority/cell.destination/item.code.
Added `data-testid="topbar-theme-toggle"` to host-shell topbar for the dark-mode test.

## Validation done
- `selectors.ts` strict-typechecks standalone (EXIT 0).
- ALL specs + fixtures + auth.setup strict-typecheck CLEAN against a faithful @playwright/test
  type stub (built a throwaway `.tmp-typecheck` stub for Page/Locator/Response/Route/test/expect,
  ran repo tsc 5.9.3 --strict, EXIT 0, then deleted the harness). Caught + fixed: 2 untyped
  waitForResponse predicate params (annotated `(r: Response)`), removed an unused CATALOG import.
- testid grep confirms 50 landed across 7 contracts templates, all well-formed.
- Did NOT run `nx build` or live tests (no stack, per brief).

## Key Decisions
- Location = `tools/contracts-e2e/` (mirror visual-regression) NOT `apps/admin-console-e2e/` —
  the nx-generator path would add `@nx/playwright` + root devDep + rewrite the nx graph (high blast radius).
- Auth via UI-login→storageState (Falcon JWT lives in sessionStorage via TokenStorageService;
  can't inject a raw token). `setup` project seeds it once; functional projects reuse it.
- Selector strategy: PRIMARY = data-testids I added; the list TABLE needed NONE (Stencil
  `<falcon-table-tw>` already renders `td[data-cell-mount][data-row-id]` + kebab `button[aria-label^="Actions for row"]`).
- Data-dependent specs (C-02/04/05/09) SKIP cleanly when the seed lacks contracts/statuses, so
  the suite is green-by-default; deterministic specs (C-06/07/08/10/11/13/14) are network-stubbed.
- C-14b uses a FRESH no-storageState context to log accowner in and prove admin URL is denied.

## Files Changed (working tree, NO COMMITS)
Feature templates (testids only, behavior-free):
- apps/admin-console/.../contracts-cost-management/contracts-cost-management.component.html
- .../components/contracts-add-wizard/contracts-add-wizard.component.html
- .../components/contracts-rate-card-section/...component.html
- .../components/contracts-contract-details-section/...component.html
- .../components/contracts-addons-section/...component.html
- .../components/contracts-view-contract/...component.html
- .../components/contracts-edit-contract/...component.html
- apps/host-shell/src/app/layout/components/topbar/topbar.component.html (topbar-theme-toggle)
New suite: tools/contracts-e2e/** (package.json, playwright.config.ts, project.json, tsconfig.json,
.gitignore, auth.setup.ts, fixtures/{selectors,helpers}.ts, tests/6 specs, README.md)
New doc: qa/runs/contracts-scrape-2026-05-29/E2E-RUN-RECIPE.md

## What Remains / Context for Next Agent (W9 ammar-qa-web)
- RUN the suite against the live stack (see recipe). Everything is authored-not-run = ZERO runtime evidence.
- Provision Commerce `Contracts` documents for a test node so the data-dependent specs ASSERT
  not skip. FLAG: the existing seeds create charging funded buckets (CONTRACT_FUNDED:*) but may NOT
  create Commerce-side Contracts docs — if list is empty everywhere, create via the C-03 wizard
  first, then re-run read-side specs. Confirm which seed (if any) provisions Commerce contracts.
- After install, `npm install` in tools/contracts-e2e pulls @playwright/test locally (NOT repo root).
- Org-tree node selection in helpers selects by text/role (no testid on shared tree component) —
  if tree ordering is non-deterministic, pin selectFirstClientNode to the seeded account id.
- Toast selector in helpers.toast() is broad — pin to the exact `<falcon-notification-stack>` testid once confirmed live.
- NO COMMITS made. Files await user "commit".
