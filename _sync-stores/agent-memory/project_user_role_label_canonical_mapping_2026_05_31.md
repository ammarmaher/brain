---
name: project_user_role_label_canonical_mapping_2026_05_31
description: User-role DISPLAY LABEL inconsistency root cause + FE-only canonical fix — list/dropdowns now all map roleKey via getRoleDisplayNameFromRoleKey (=PES BuiltInRoleCatalog englishName = origin/main). Role KEY untouched.
metadata: 
  node_type: memory
  type: project
  originSessionId: 9dcec64a-2eeb-4bc7-8273-f9b392a9bedd
---

🟢 DONE 2026-05-31 (via ammar-web-platform-ui, code-read-VERIFIED), branch `polishing-v0.4`, **NO COMMITS**, build-green (admin+mgmt dev exit 0), new test 9/9 + full validation 11/11.

**Problem (user/Ammar):** in the user-profile/org-hierarchy area the role shown in the LIST differed from the role in the DROPDOWN. User decision: converge on the **main + PES canonical mapping**, FE-ONLY (do NOT change PES/backend — PES already returns the right englishName/arabicName; FE must map/consume correctly). The role **KEY** was always consistent; only the **display LABEL** diverged.

**Root cause:** no single FE source of truth for the role LABEL. `origin/main` rendered the users-list role via `getRoleDisplayNameFromRoleKey(user.roleKey)` (`[CODE] origin/main:apps/admin-console/.../organization-hierarchy/services/org-hierarchy.api.service.ts:125` + mgmt `:110`). The new UI dropped that call → list rendered the **raw roleKey** (`mapUserWireToUser` `role: roleKey`, data-table column had a cell template only for `status`, none for `role`). Meanwhile each dropdown used its own drifting label source. `getRoleDisplayNameFromRoleKey`/`BUILT_IN_ROLE_KEY_LABELS` (`[CODE] libs/falcon/src/shared-types/lib/constants/role-key.constants.ts:57-69`, exported via `@falcon`) existed but was UNUSED (role-key.constants.ts is byte-identical main vs branch).

**CANONICAL MAP (the SoT — keep):** backend PES `[CODE] falcon-core-access-svc/src/T2.PES/Authorization/BuiltInRoleCatalog.cs` englishName (lines 156/214/259/318/384/448) == FE `BUILT_IN_ROLE_KEY_LABELS` == main's list:
| roleKey | EN | AR (PES arabicName) |
|---|---|---|
| sys-admin | System Administrator | مدير النظام |
| sys-ops | System Operation | إدارة العمليات التقنية |
| sys-products | Products | المشتريات |
| acc-owner | Account Owner | — |
| acc-admin | **Account Admin** ⚠️FE-override (PES says "Node Admin") | مسؤول الحساب |
| acc-user | **Account User** ⚠️FE-override (PES says "Normal User") | مستخدم الحساب |
Backend enum `eUserRoles` 1..6 = SystemAdministrator/Product/Operation/AccountOwner/NodeAdmin/NormalUser → role keys via `ROLE_KEY_BY_ENUM`.

**6 FE label surfaces (all now converged):** (1) admin Users-list table cell, (2) mgmt Users-list table cell, (3) admin org-chart user card (was raw `{{u.role}}`), (4) mgmt org-chart user card, (5) Add-User wizard dropdown i18n `hierarchy.addUser.role.*`, (6) User-Details Role tab — PES catalog englishName is PRIMARY (already correct), i18n `hierarchy.userDetails.roles.*` is only the FALLBACK. Plus dead map `enum.userRoles` (`UserRolesI18n`, no live consumer) aligned defensively.

**Fix (FE-only, 10 files + 1 test, NO COMMITS):**
- LIST + org-chart (both consoles): keep `User.role`/`ChartUser.role` = KEY; render label at VIEW layer via `<ng-template falconDataTableCell="role" let-value="value">{{ roleLabel(value) }}</ng-template>` + `protected roleLabel(k){return getRoleDisplayNameFromRoleKey(k)}` (EN-only, matches main). data-table cell ctx gives `value: row['role']` (`[CODE] libs/falcon-ui-core/.../falcon-data-table.component.ts:959-961`).
- i18n en+ar: `addUser.role.systemAdmin` "System Admin"→"System Administrator"; `addUser.role.operation` & `userDetails.roles.operation` →"System Operation"; `userDetails.roles.accountAdmin` "Account Admin"→"Node Admin"; `userDetails.roles.accountUser` "Account User"→"Normal User"; `enum.userRoles` product→Products/operation→System Operation/nodeAdmin→Node Admin/normalUser→Normal User. Left PES `getRoleCatalog` path + `roleDesc.*` + permission-group `options.role`(adminGroup) untouched.
- Test: `tools/validation-tests/role-label-canonical.test.ts` (glob is `*.test.ts` NOT `*.spec.ts`).

**HARD RULES learned:** (a) `user.role` MUST stay the roleKey — it's compared as a key by PES role-flags/`isFalconUser`/role-catalog resolution; never store a label in the model, render labels at the view layer only. (b) `getRoleDisplayNameFromRoleKey` is EN-only (main parity); dropdowns keep localization via i18n/PES. (c) PES `BuiltInRoleCatalog.cs` is the ultimate SoT; FE `BUILT_IN_ROLE_KEY_LABELS` mirrors it.

**⚠️ UPDATE 2026-05-31 #2 (user business OVERRIDE — implemented + code-verified, NO COMMITS):** user reversed the acc-admin/acc-user DISPLAY: `acc-admin`→**"Account Admin"** / "مسؤول الحساب", `acc-user`→**"Account User"** / "مستخدم الحساب" — in ALL surfaces. This DELIBERATELY makes the FE DISPLAY diverge from PES `BuiltInRoleCatalog.cs` englishName ("Node Admin"/"Normal User") for these 2 keys (key + backend UNCHANGED). Do NOT "fix" back to PES — it's an intentional FE-only display override; dated comments added at the override sites. Changes: `BUILT_IN_ROLE_KEY_LABELS` acc-admin/acc-user (constants), i18n en+ar `enum.userRoles`+`userDetails.roles`+`addUser.role` (all 3 → Account Admin/Account User). **The User-Details edit dropdown + view label sources its label from the PES catalog englishName, so a plain i18n swap is NOT enough** — added `displayRoleLabel(key,catalogLabel)` + reworked `roleLabel()` in `user-details-page.component.ts`: a BUILT-IN key (in `ROLE_OPTION_KEYS`) renders the FE i18n label (`hierarchy.userDetails.roles.*`), tenant-custom keys keep the PES catalog label; dropdown VALUE stays roleKey. Sweep: `share.normalUser` (en.json:1342) + `templates.step3.roleSub` are ORPHAN/non-role strings → left. Builds admin+mgmt+host-shell EXIT 0; validation suite 11/11. RULE LEARNED: when a label must override PES, the user-details dropdown needs an explicit FE remap (built-in→i18n), not just i18n string edits, because options come from `state.roleOptions()`←PES catalog. ⚠️ NOTE the working tree on polishing-v0.4 holds MANY unrelated dirty files (uploader migration, comm-mkt, settings, contact-groups) from prior sessions — a commit must cherry-pick ONLY the ~12 role-label files, never `git add -A`.

**Residual (optional follow-up, NOT done — out of scope):** a few AR strings for keys whose EN was already canonical still differ from PES arabicName — `userDetails.roles.systemAdmin` AR "مسؤول النظام" (PES "مدير النظام"), `.products` AR "المنتجات" (PES "المشتريات"). A future full AR↔PES alignment pass could reconcile. Related [[reference_falcon_root_node_has_tabs_keep_2026_05_30]].
