---
name: project_wallet_admin_tree_autoselect_first_child_else_root_2026_06_06
description: "Admin Wallet & Balance Mgmt now auto-selects the org-hierarchy tree's FIRST CHILD (else ROOT) on landing — added onTreeChange to the view store, mirroring contracts/comm-channels/marketplace; mgmt wallet has NO tree (untouched)."
metadata: 
  node_type: memory
  type: project
  originSessionId: c51cce08-f461-4d1f-bb4a-06f98e82b459
---

# Admin Wallet — landing auto-select of org-hierarchy tree (first child, else root) — DONE 2026-06-06 (claude)

**Request (user):** on landing/opening Wallet & Balance Management, the org-hierarchy tree must ALWAYS select the **first child**; if no child, select the **root** at the top. Follow the existing component structure/design/implementation (mirror other components).

**Scope = admin-console ONLY.** [CODE] `apps/management-console/.../wallet-balance-management.component.ts` is the CLIENT view — single-tenant, **NO tree picker** (resolves the account from the session; its `selectedNode` computed already does `root.type==='client' ? root : root.children[0] ?? null`). Only [CODE] `apps/admin-console/.../wallet-balance-management` has the LEFT `<app-organization-hierarchy-tree mode="falcon-full">` picker (from `@host-shell/shared/organization-hierarchy-tree`), with all state in `WalletBalanceManagementViewStore` ([CODE] `.../services/wallet.service.ts`). The admin store did **NOT** auto-select anything before — `accountId` stayed null until a manual click; the FETCH effect no-ops on null id.

**Canonical pattern mirrored (the "other components"):**
- [CODE] `apps/admin-console/.../contracts-cost-management.component.ts:321-354` — gold "wallet parity" ref: `onTreeChange` (once-guard) → `firstSelectableNode` = `tree.type!=='root' ? tree : children[0] ?? null` → fed back via `[selectedIdInput]`.
- [CODE] `apps/admin-console/.../comm-channels-services/services/page-state.service.ts:61-106` + marketplace — `firstChildOf(root)=children[0]??null`, auto-select on `(treeReady)`/`(treeChange)` when none selected.
- Tree root shape [CODE] `host-shell/.../organization-hierarchy-tree/services/services.ts:156-179 toRoot()`: Falcon admin user → **synthetic** root `{id:'FALCON_ROOT_NODE', type:'root', children:[clients]}` (clients EAGER-loaded, present at first treeChange); client-rooted tree → root is a real account (`type:'client'`). Admin console is Falcon-only (adminConsoleGuard) → always synthetic root.

**Implementation (3 wallet files, isolated from the concurrent contracts/date-picker session):**
1. [CODE] `services/wallet.service.ts` (the `WalletBalanceManagementViewStore`):
   - + `onTreeChange(tree)`: once-guard `autoSelectApplied`; if `accountId()!==null || selectedId()!==null` → latch+return (respect a manual click / PES session-seed); else `target = firstChildElseRoot(tree)`; if null → return WITHOUT latching (retry on next emit); else latch + `accountId.set(target.id)` + `selectedId.set(target.id)`.
   - + module-scope `firstChildElseRoot(tree)` = `!tree?null : tree.type!=='root'?tree : (tree.children?.[0] ?? tree)` — **first child, else root** (contracts' helper with `?? tree` instead of `?? null` to honor the explicit root fallback).
   - FETCH effect guard changed `if(!id)return` → **`if(!isRealNodeId(id))return`** (`isRealNodeId` from `@falcon`, [CODE] `libs/falcon/.../node-scope.util.ts:13`): skips null AND the synthetic `FALCON_ROOT_NODE` so the zero-clients root **highlights but fires NO doomed `GET .../accounts/{id}/hierarchy`** (non-ObjectId id would 400/500). Real client id always passes. Also imported type `OrgHierarchyTreeFetchNode`.
2. [CODE] `wallet-balance-management.component.html`: added `(treeChange)="store.onTreeChange($event)"` to the tree element (reuses the already-bound `[selectedIdInput]="store.accountId()"` for the highlight). `(nodeSelect)`/`(nodeIdReady)` unchanged.
3. NEW [CODE] `__tests__/tree-auto-select.spec.ts` — established wallet style (faithful HARNESS over the pure rule + once-guard/isRealNodeId behavior + SOURCE-LEVEL guards on store+html). 10 tests.

**Behavior after:** land admin wallet → tree settles (treeChange) → first client auto-selected + highlighted + its wallet hierarchy GET fires. Zero clients → synthetic Falcon root highlighted (no GET). Manual click / PES session-seed before settle → never overridden. Lazy-merge treeChange → never re-selects.

**Verification (runtime evidence):** `nx build admin-console --configuration=development --skip-nx-cache` **EXIT 0** (Hash 84b8e348abfc7312) = compile + template type-check. `NX_DAEMON=false node node_modules/nx/dist/bin/nx.js test admin-console --skip-nx-cache` = **39 files / 785 tests PASS** (incl. new tree-auto-select 10, transfer-wiring 17, pes-gating 37, split-pane-math 33). ⚠️ **LESSON:** appending `-- wallet-balance-management` to the nx test cmd is NOT honored as a filter and triggers an order-dependent Stencil `defineCustomElement is not a function` collection failure in ~22 suites (false RED) — run the bare baseline command; a stash-revert baseline run confirmed GREEN both with and without my change. ⚠️ Live click-through pending (admin needs Zitadel login + local stack; assistant can't type passwords). **NO COMMITS.** Branch `feature/contracts-consumed-offered-falcon-tables`.

Related [[project_org_hierarchy_root_child_refresh_select_2026_06_06]] · [[project_org_hierarchy_add_node_session_hasChildren_stale_rootcause_2026_06_06]] · [[reference_wallet_main_vs_now_transfer_gap_plan_2026_06_06]] · [[reference_fe_structure_standard_angular21_2026_06_02]].
