---
name: project_contracts_sidebar_both_consoles_2026_05_30
description: Contracts nav item added to host-shell sidebar for management-console (admin already had it); both route to their contract components; host-shell build green
metadata: 
  node_type: memory
  type: project
  originSessionId: 1797e928-eb8c-4f9b-88f0-057553ce7dd3
---

Task (2026-05-30): "Make sure we have a Contracts item in the left sidebar for admin AND management console, routing to the right contract components."

**The ONE source of sidebar nav for BOTH consoles** = `[CODE] apps/host-shell/src/app/layout/layout.component.ts` `createNavItems(userType)`. Host-shell wraps both MF remotes; the sidebar switches items by `userType` (FALCON_USER vs CLIENT_USER), it is NOT two separate sidebars.

**State found:**
- Admin contracts nav item ALREADY present (Falcon side) → path `/admin-console/contracts-cost`, `requiredUserTypes:[FALCON_USER]`, `hidden:isClient`, no feature PES (every sys-* role that reaches admin-console sees it — authority-dataset compare.md:61). ✅
- Management contracts nav item was **MISSING** — route + feature + access key all existed, but no sidebar link → mgmt acc-owner could only reach contracts by direct URL. **This was the gap.**

**Fix (2 edits, layout.component.ts, host-shell):**
1. Added path const `management_console_PATH_CONTRACTS_COST_MANAGEMENT = ${MANAGEMENT_CONSOLE_BASE}/contracts-cost-management`.
2. Added mgmt nav item: `label 'Contracts & Cost .Mng'`, `scope ManagementConsole`, `access: FalconAccess.managementConsole.contract.view()`, `requiredUserTypes:[CLIENT_USER]`, `hidden:isFalcon`. Mirrors the existing mgmt org-hierarchy item pattern.

**Visibility grounding (authority dataset 04-feature-parity-matrix/contracts-cost-management.compare.md:55-64):** `acc.contract.view` is the STRONGEST authority asymmetry in the dataset — acc-owner ALLOW; acc-admin + acc-user EXPLICIT-DENY. The `access` query on the nav item drives menu visibility via `applyItemAccess` (hides when PES check fails), so only acc-owner sees it. Route's own `shellAccessGuard` enforces direct-URL access independently. mgmt is VIEW-ONLY (`canEdit:false` hardcoded).

**Routing verified end-to-end (both correct):**
- `admin_console_BASE='/admin-console'`, `MANAGEMENT_CONSOLE_BASE='/management-console'` (`[CODE] libs/falcon/.../route-scope.constants.ts:17-18`).
- MF mounts via `REMOTE_CONTRACTS` (`[CODE] host-shell/.../mf-contract.ts`): admin-console@`admin-console`, management-console@`management-console`; remotes export `routes` for dynamic registration.
- Admin: `/admin-console/contracts-cost` → admin `contracts-cost-management.routes.ts` → admin `ContractsCostManagementComponent`.
- Mgmt: `/management-console/contracts-cost-management` → mgmt `contracts-cost-management.routes.ts` (shellAccessGuard + `managementConsole.contract.view()`) → mgmt `ContractsCostManagementComponent`.
- `FalconAccess.managementConsole.contract.view()` = `{action:'view',resource:'acc.contract'}` (`[CODE] falcon-access.registry.ts:102-104`, inside managementConsole block 53-142).

**Verification:** `nx build host-shell --skip-nx-cache --configuration=development` exit 0, hash `97d0988b078ca1cb` (only pre-existing unused-tsconfig warnings). NOT runtime/browser-verified (needs full MF stack + acc-owner auth). NO COMMITS. Diff: 22+/1-, one file.

**Concurrency:** a sibling Claude session held `universal-brain/state/current-task.json` (task `fe-build-fix-commkt-card-backtick`, scope mgmt comm-mkt-view card) — DIFFERENT file from mine; I did NOT hijack its brain state. Builds on [[project_contracts_feature_both_consoles_2026_05_30]].
