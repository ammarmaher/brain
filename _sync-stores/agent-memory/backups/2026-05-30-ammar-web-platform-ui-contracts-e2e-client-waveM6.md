---
name: session-backup-contracts-e2e-client-scenarios-wave-m6
description: "Authored the management-console (client) Contracts E2E scenarios CL-01..CL-09, extending the Wave-8 admin suite. Authored-not-run; strict-typechecked green."
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-05-30
  status: completed
  originSessionId: 2479810e-ac31-4f30-b718-0153e3ee8d66
---

## What Was Done
Extended `tools/contracts-e2e/` with CLIENT (management-console) Contracts scenarios (brief Wave M6).
AUTHORED-NOT-RUN (no Docker here). Whole suite strict-typechecks GREEN (0 errors) via a new
`tsconfig.typecheck.json` + a minimal `@playwright/test` ambient stub (the real pkg isn't installed
in the tool dir; stub is shadowed once `npm install` runs).

### Files created
- `tools/contracts-e2e/fixtures/mgmt-selectors.ts` — CLIENT routes/testids/labels(en+ar)/API regex +
  STUB fixtures (STUB_LIST_BODY/STUB_DETAIL_BODY/STUB_EMPTY_LIST_BODY). MGMT URL =
  `/management-console/contracts-cost-management`. List API = `GET api/commerce/contracts` (Core
  Gateway, lowercase + `api/` prefix — DIVERGES from admin `commerce/Contracts` System Gateway).
- `tools/contracts-e2e/fixtures/mgmt-helpers.ts` — client UI login, DIRECT-URL nav (no mgmt sidebar
  nav item exists), table helpers, stub installers (E2E_NO_STUB=1 disables), `assertContractsDenied`.
- `tools/contracts-e2e/tests/contracts-client.e2e.ts` — CL-01 (list+Remaining), CL-02 (no Add),
  CL-03 (4-tab read-only detail), CL-04 (no Edit/no PUT), CL-08 (dark), CL-09 (shared-section parity).
  Project `mgmt-ltr` (acc-owner storageState).
- `tools/contracts-e2e/tests/contracts-client-deny.e2e.ts` — CL-05 (acc-admin DENY→/401),
  CL-06 (acc-user DENY→/401). Project `mgmt-deny` (NO storageState; logs in fresh per test).
- `tools/contracts-e2e/tests/contracts-client.rtl.e2e.ts` — CL-07a/b/c/d (RTL dir flip, Arabic
  labels, lock legend, matrix sticky-col inline-start). Project `mgmt-rtl` (acc-owner + locale ar).
- `tools/contracts-e2e/typings/playwright-test-stub.d.ts` + `tsconfig.typecheck.json`.

### Files edited
- `apps/management-console/.../components/contracts-view-contract/contracts-view-contract.component.html`
  — added 3 behavior-free testids on the read-only detail's `@switch` panels:
  `contracts-view-tab-rate-card` / `-contract-details` / `-addons`. (Information panel + tab strip +
  Back button already had testids from M3; list table needs none — Stencil `td[data-cell-mount]`.)
- `tools/contracts-e2e/auth.setup.ts` — added 2nd setup test: logs `accowner` → `.auth/accowner.json`.
- `tools/contracts-e2e/playwright.config.ts` — added `mgmt-ltr` / `mgmt-rtl` / `mgmt-deny` projects;
  admin projects now exclude `contracts-client*` via testIgnore.
- `tools/contracts-e2e/README.md` — CL-01..09 matrix→spec table, client auth/storageState section,
  client testids, projects table, typecheck cmd.
- `C:/Falcon/qa/runs/contracts-scrape-2026-05-29/E2E-RUN-RECIPE.md` — client creds table (3 users),
  client smoke (direct URL + deny), env overrides, mgmt project invocations, CL-01..09 PASS criteria.

## Key Decisions
- CLIENT structure specs are STUBBED by default: acc-owner is view-only (can't create contracts via
  UI) and NO seed creates Commerce `Contracts` docs for test-tenant-001 (recipe §2b caveat). Stubs
  make CL-01/03/04/09 deterministic without a seed; E2E_NO_STUB=1 + seed for live round-trip.
- DENY (CL-05/06) uses fresh contexts (no storageState) → shellAccessGuard redirects to /401
  (APP_ROUTES.UNAUTHORIZED). `acc.contract.view` is the ONLY acc-* PES explicit-deny for acc-admin
  (strongest asymmetry). guard = libs/falcon/.../access-control/shell-access.guard.ts:116.
- Addons read-only view does NOT emit `contracts-addon-quota-*` (that testid is EDIT-branch only);
  CL-09 parity asserts the addons panel wrapper + the always-painted card titles ("Addons" /
  "Addons Rate Card") instead.

## Verified facts (source)
- mgmt ContractRow uses `remainingValue` (NOT admin `remainingSar`); cols lead with `id`. mapper:
  `id=wire.contractId`, `remainingValue=wire.remainingBalance`, `status=normalizeContractStatus()`.
- Stencil falcon-table-tw emits `td[data-cell-mount][data-row-id][data-row-index]` (when
  hostsExternalCells=custom templates present) + kebab `button[aria-label="Actions for row N"]`.
- Read-only matrix renders 0 `<input>` (editable() false → plain <div>); table testid always present.
- Client test users: accowner/accadmin/accuser, test-tenant-001, USERNAME login, Admin@1234, OTP off.

## What Remains (for the LIVE run pass = W7)
- Run against live Docker stack (bring-up + seed per recipe). `cd tools/contracts-e2e; npm install;
  npx playwright install chromium; npx playwright test`.
- mgmt-ltr/rtl need accowner storageState (setup writes it). mgmt-deny needs accadmin+accuser seeded.
- Optional: seed Commerce contracts for test-tenant-001 + run mgmt-ltr with E2E_NO_STUB=1 for the
  live Core-Gateway round-trip (else stubbed). Once real types installed, prefer
  `tsc -p tsconfig.json --noEmit` over the typecheck stub.

## Context for Next Agent
NO COMMITS — all in working tree. Build NOT run (authoring only; brief said no nx build/live).
Mirrors the Wave-8 admin suite conventions exactly (storageState auth, testid selectors, Stencil DOM).
