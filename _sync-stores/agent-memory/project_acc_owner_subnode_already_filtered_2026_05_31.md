---
name: project_acc_owner_subnode_already_filtered_2026_05_31
description: "Add User 'Account Owner' role on SUB-NODES — reported as admin bug but ALREADY correctly filtered in committed code AND verified live; admin sub-node offers only Account Admin/User; account-main offers all 3; mgmt offers none. Reported bug = stale MF bundle, not code."
metadata: 
  node_type: memory
  type: project
  originSessionId: 98c6316f-b53c-45cb-b222-52bd0d01f593
---

🔵 RUNTIME-VERIFIED 2026-05-31 (live browser via ammar-qa-web, servers 4200/4204/4301), branch `polishing-v0.4`, NO code change made. User reported: "admin Add User on a sub-node shows Account Owner; should be main-node only." Investigation proved the committed code ALREADY does this correctly and the running build behaves correctly → the report is a **stale admin MF bundle** (dev MF remotes serve nx-cached bytes per [[reference_504_admin_console_mf_duplicate_servers_2026_05_31]]; the fix is BUG-13 dated 2026-05-29).

**RULE:** `acc-owner` ("Account Owner") allowed on the ACCOUNT MAIN/root node only; NEVER on sub-nodes (exactly one owner per tenant, seated at the tenant root). User = business authority; matches BUG-13 comments.

**Where implemented (both consoles):** Add-User wizard parent computes `targetRoles = roleOptionsForNode(selectedNode).map(o=>o.value)`; passes `grantableRoles = targetRoles.filter(PES userRole.other)` into `user-role-status-step`, whose dropdown = `ROLE_OPTIONS.filter(o => grantableRoles.includes(o.value))`. So acc-owner can ONLY appear if `roleOptionsForNode` returns it. `[CODE]`:
- admin `apps/admin-console/.../add-user-wizard/models/models.ts:108-119` → `isMainNode = type==='client' || level===1`; `roleOptionsForNode`: root→SYSTEM; main→ACCOUNT(incl owner); else→ACCOUNT minus owner.
- mgmt `apps/management-console/.../add-user-wizard/models/models.ts:108-118` → `isMainNode = type==='root' || level===0`; main→ACCOUNT; else→ACCOUNT minus owner.
- admin wizard `add-user-wizard.component.ts:266-350` (resolveAccessAndSettings, fail-open path); mgmt `:266-350` (getMe→roleKey, fail-closed). Both call `roleOptionsForNode(selectedNode ?? {id,type:undefined,level:undefined})`.

**NODE-TYPE GROUND TRUTH (shared tree is the SoT, NOT per-console mapGetNodeResponseToClientNode which is legacy since Wave-20).** `[CODE] apps/host-shell/.../organization-hierarchy-tree/services/services.ts:156-195`: type derived by depth, **`level` is NEVER set** (always undefined → admin/mgmt isMainNode reduce to the type check). `selectedNode().data` = `OrgHierarchyTreeFetchNode` cast to ClientNode.
- ADMIN (Falcon user): synthetic Falcon root `type 'root'`; accounts (depth1) `type 'client'`; sub-nodes (depth2+, eager or lazy via getChildren(_,2)) `type 'sub-node'`.
- MGMT (client user): the tenant root itself = `type 'client'` (toFetchNode(rows[0],1) or orgNodeToFetchNode hardcodes 'client') — **NOT 'root'**; sub-nodes `type 'sub-node'`.
- ⇒ admin isMainNode('client')=TRUE on account-main → offers owner (CORRECT); mgmt isMainNode needs 'root' but main is 'client' → FALSE → mgmt offers owner NOWHERE (over-filter, by-design-ish: client can't mint a 2nd owner).

**BACKEND GROUND TRUTH (live, sysadmin via system-gw :7256; accowner via core-gw :7038):** `commerce/Node` (no NodeId) returns ACCOUNTS at top level, each `path`=single-segment (own id, no '.'); `commerce/Node?NodeId=<acct>` returns sub-nodes with `path`=multi-segment `"<acctId>.<subId>"`. So a robust main-vs-sub signal = path has a '.' → sub-node. Test Tenant 001 = `000000000000000000a11001`; sub-node Human Resources = `000000000000000000a11002` (path `...a11001.000...a11002`).

**LIVE VERIFICATION (ammar-qa-web, verbatim dropdown + data-values, no console errors):**
| Scenario | Console | Node | Role options | Account Owner? |
|---|---|---|---|---|
| A1 | admin (sysadmin) | sub-node Human Resources | Account Admin, Account User | NO ✓ |
| A2 | admin | main Test Tenant 001 | Account Owner, Account Admin, Account User | YES ✓ |
| M1 | mgmt (accowner) | sub-node | Account Admin, Account User | NO ✓ |
| M2 | mgmt | main | Account Admin, Account User | NO (over-filter) |
Corroborated by tab visibility: sub-nodes show only Hierarchy; main shows 4 tabs (independently confirms runtime node-type = 'sub-node').

**Test users:** sysadmin / accowner, pwd `Admin@1234`, OTP off (lands stage:4). `[BRAIN-OUT] authority-dataset/07-cross-cutting/test-users.md`. Gateways: identity :7777/api, core :7038, system :7256, pes :5296. `[CODE] host-shell/src/environments/environment.ts:20-27`.

**OPTIONAL hardening (NOT applied — offered to user):** admin-only defense-in-depth — make `isMainNode`/sub-node detection ALSO consult `path` (`node.path.includes('.')` ⇒ sub-node) so acc-owner can never leak even if depth-typing ever regressed. Zero behavior change now (account-main path is single-segment; sub-node path is multi-segment), purely additive, can't regress. Do NOT unify mgmt to the same logic (would start offering owner on mgmt main). Related [[project_org_hierarchy_subnode_hide_comm_app_tabs_2026_05_31]] (same selectedNode().type==='sub-node' gate, also shipped 2026-05-31) · [[project_user_role_label_canonical_mapping_2026_05_31]] (acc-owner label).
