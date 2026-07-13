---
name: project_org_hierarchy_pes_button_locks_main_parity_2026_06_08
description: org-hierarchy-page admin PES button locks restored to origin/main parity — Add-Client account.add() gate + Edit-Info fail-closed; build + 863 tests green
metadata: 
  node_type: memory
  type: project
  originSessionId: 60b3f567-56d9-4da9-aed0-6e355fc28974
---

**Org Hierarchy (admin-console `org-hierarchy-page`) — PES button-lock parity with origin/main RESTORED** (2026-06-08, claude, FE-only, NO commits, branch `polishing-v0.4`).

**Context / audit first.** User asked to confirm PES is implemented in `apps/admin-console/.../features/org-hierarchy-page`, compare vs `origin/main`, give a %. KEY: the folder is NEW on our branch — on `origin/main` the feature is `organization-hierarchy` (0 files at our path). Both branches use the SAME mechanism: `AccessControlFacade.resolveFlags({ key: FalconAccess.adminConsole.<res>.<action>() })`. Our branch decentralizes resolution into per-component signal stores (info-panel-state.signals, settings-tab.signals, add-user-wizard) + a route guard, and ADDS user-level gates main never had in-folder. **PES gate parity = ~88% (7/8 of main's gates identical)**: accountProfile.edit, root/account passwordSecurityLevel, root/account allowedIps, accountQuota all identical; **+5 NEW** (accountHierarchy.view route guard, user.add, userPermissionGroup.assign, userProfilePicture.upload, userRole.other). The ONE regression = `account.add()` dropped on Add-Client.

**The "lock" is LOGIC, not SCSS.** Our `org-hierarchy-page` has **0 .scss / 0 styleUrl** (deliberate Tailwind-only); main has 13 .scss but NONE implement the button lock (main's only `lock` SCSS = `status-dot--locked`, a node-status dot). Both branches lock buttons via `@if`/`*ngIf` (hide) + `[disabled]` (fields). Action buttons use shared `<falcon-angular-button>` (main used `<p-button>`) → no SCSS port needed. User chose (AskUserQuestion ×2): "Tailwind, match main's look" + "Add-Client + hide/disable audit, keep fail-open for un-seeded NEW resources".

**FIXES (3 files, +50/-21, admin-console ONLY — mgmt has no Add-Client by design, "clients don't create clients"):**
1. **Add-Client `account.add()` gate restored** in `services/hierarchy-page-state.service.ts`: was `canAddClient = isRootSelected()` (positional only, PES DROPPED). Added `accessControl=inject(AccessControlFacade)` + `canAddAccountPes=signal(false)` (fail-CLOSED) + ctor `resolveFlags({canAddAccount: FalconAccess.adminConsole.account.add()})`. `canAddClient = isRootSelected() && canAddAccountPes()`. ALSO gated the tree right-click `addClient` item in `buildMenu()` (spread-conditional) — main gated both the button AND the `allowedTreeActions` add-client.
2. **info-panel fail-open→fail-CLOSED** in `falcon-org-info-panel/signals/info-panel-state.signals.ts`: old `const failOpen = !f['editInfo']; canEditInfo = failOpen ? true : ...` made `canEditInfo` ALWAYS true (PES neutralized). Now `canEditInfo = !!f['editInfo']`. Safe because `sys.account-profile` is SEEDED and the query carries NO path attrs → NOT subject to the owner false-negative ([[reference_wallet_balance_knowledge_map_2026_06_07]] documents that false-negative is path-attr-only). Matches main's `canShowEditButton ⇐ accountProfile.edit()` + the slice's OWN model doc ("hides Edit button when false").
3. **Edit-Info button PES-gated** in `node-workspace/node-workspace.component.html`: wrapped the Edit-Info `<falcon-angular-button>` in `@if (state.infoPesFlags().canEditInfo)` (Back stays). Fields already react via `[disabled]="!pesFlags().canEditFalconOnly"`.

**KEPT fail-open (per user): add-user-wizard** user.add / userPermissionGroup.assign / userProfilePicture.upload / userRole.other — these are the un-seeded NEW `sys.user*` resources (documented `TODO(v1.4)` to remove once PES catalog confirms).

**Registry truth** `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts`: `adminConsole.account.add()`→`{action:'add',resource:'sys.account'}` (line 171); managementConsole namespace uses `acc.*`. `adminConsole.accountProfile.edit()`→`sys.account-profile`.

**GATES:** `nx build admin-console --skip-nx-cache` GREEN (hash `29b136d68bedb926`, 30s, 7 dep tasks) + `nx test admin-console` **863/863 GREEN (46 files)**. No spec broke (2 org-hierarchy specs mock the service via useValue; users-reload spec builds UsersStateSlice not the facade). NO regression test ADDED for the gate (facade has ~13 slice deps → heavy TestBed; offered as follow-up). Live UI verify user-gated (MF app needs Zitadel login; no password typing). NO COMMITS.

Related [[project_org_hierarchy_routed_userdetails_urlstate_2026_06_08]] · [[project_org_hierarchy_users_canceled_calls_combinelatest_fanout_fix_2026_06_08]] · [[reference_fe_structure_standard_angular21_2026_06_02]] · [[project_clean_client_one_owner_created_2026_06_06]].
