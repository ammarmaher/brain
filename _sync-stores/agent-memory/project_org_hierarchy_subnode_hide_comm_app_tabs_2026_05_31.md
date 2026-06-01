---
name: project_org_hierarchy_subnode_hide_comm_app_tabs_2026_05_31
description: "Org Hierarchy — CommChannels + Apps tabs now restricted to the account-top node (type 'client') in BOTH consoles; HIDDEN on all sub-nodes. Deliberate business override of UIUX-016/PRD-02/React-SoT. One-branch fix in each visibleTabs computed. Build-green + 7 unit tests, NO COMMITS."
metadata: 
  node_type: memory
  type: project
  originSessionId: 87697412-dfae-4839-902d-fd5e4d9f8e0d
---

🟢 IMPLEMENTED + build-green + 7 passing regression unit tests 2026-05-31. Branch `polishing-v0.4`, **NO COMMITS**. Plan-approved (`C:/Users/User/.claude/plans/luminous-singing-lightning.md`) via ExitPlanMode. Implemented through the `ammar-web-platform-ui` specialist (per user), code directly verified by reading the diffs.

**Rule (NEW business override):** On the Organization Hierarchy page, the **Communication Channels** (`commChannels`) + **Applications** (`apps`) tabs appear ONLY on the **account-top node** (`node.type === 'client'`) and are HIDDEN on every deeper **sub-node** (`node.type === 'sub-node'`, depth ≥ 2). Mgmt: shown on the account's own root/Main node only. Admin: shown on the first-layer account/tenant nodes only (children of the synthetic Falcon root). Falcon synthetic `'root'` branch unchanged (never had them).

**Why this is the whole fix — node.type is depth-derived:** `[CODE]` shared tree `host-shell/.../organization-hierarchy-tree/services/services.ts:188` → `type: depth === 1 ? 'client' : 'sub-node'` (synthetic Falcon top = `'root'`, admin-only; suppressed in mgmt). Mirrored by `[CODE] org-hierarchy-page/models/models.ts:391 (mgmt) / :404 (admin)` → `level 0='root', 1='client', 2+='sub-node'`. So admin "first layer" == mgmt "root/Main node" == `type 'client'`; everything deeper == `'sub-node'`. The user's per-console spec collapses to ONE identical change in both consoles.

**The change (2 files, one branch each):** in `UsersStateSlice.visibleTabs`, the `node.type === 'sub-node'` branch went from `new Set<ClientTab>(['hierarchy','commChannels','apps'])` → `new Set<ClientTab>(['hierarchy'])`.
- admin `apps/admin-console/src/app/features/org-hierarchy-page/services/state/users-state.signals.ts` (~L116-125)
- mgmt `apps/management-console/src/app/features/org-hierarchy-page/services/state/users-state.signals.ts` (~L154-168)
`'client'` branch (`['hierarchy','commChannels','apps','settings']`) and admin `isRootSelected()`/mgmt `'root'` branches UNCHANGED.

**KEY — `visibleTabs` is the ONLY gate.** The menu template binds `[tabs]="visibleTabsForFalcon()"` which is a pure label-projection of `state.visibleTabs()`; the constructor's tab-fallback effect snaps `activeClientTab` back to `'hierarchy'` when the active tab disappears → removing comm/apps from sub-nodes is self-healing, **no template edit needed**. No other code gates comm/app tab visibility (the separate sidebar pages `comm-channels-services` + `marketplace-applications` are standalone routes, NOT these node tabs — untouched).

**Mgmt PES gate PRESERVED:** the existing `if (!this._canViewServices()) { allowed.delete('commChannels'); allowed.delete('apps'); }` (PES `acc.services.view`, acc-owner only) stays verbatim; it now meaningfully affects only the `'client'` branch (harmless no-op on root/sub-node). Admin gets NO new PES gate (out of scope; never had one here).

**⚠️ DELIBERATE OVERRIDE of documented authority** (all say client AND sub-node get 4 tabs): `[BRAIN-OUT]` UIUX-016 (`understanding/pages/organization-hierarchy/UI_UX_RULES.md:48`); `[PRD]` `prd/modules/01-account-management/OVERVIEW.md:27`; `[SoT]` React `new react/admin/hierarchy.jsx:1191-1200`. User is the business authority; plan approval = override approval. **Future "restore sub-node CommChannels/Apps" request needs fresh authority.** Comment blocks above both `visibleTabs` updated with a dated `2026-05-31 (per Ammar)` override note that preserves the still-valid Settings-main-node-only (`UpdateSettingsHandler.cs:53-54`) + Falcon-root (BIZ-014) rationale and all citations.

**Verification:** `nx run-many --target=build --projects=admin-console,management-console --configuration=development --skip-nx-cache` EXIT 0 (no new warnings on the edited files). 7 new regression tests: `apps/admin-console/tests/users-state-visible-tabs.spec.ts` (3 pass: sub-node→`['hierarchy']`, client→4 tabs, root→`['hierarchy','settings']`) + `apps/management-console/tests/org-hierarchy/users-state-visible-tabs.spec.ts` (4 pass: sub-node hidden even when PES-allowed, client shows when PES-allowed, client stripped when PES-denied, root→`['hierarchy']`). Test pattern: TestBed DI + signal-stubbed TreeStateSlice, read `computed` directly with NO `flushEffects()` (documented heap risk per `vite.config.mts`); mgmt sets `_canViewServices` via `tests/contracts/_support.ts setSignal`. Runtime not driven (local login env-flaky per memory; build+unit tests are the gate per approved plan).

**Out-of-scope flag (raised by the FE agent, NOT mine to fix):** pre-existing UNRELATED failure in `apps/admin-console/tests/wire-builders.spec.ts` — add-client wizard `priceType` enum-int assertions (Monthly/OneTime/Yearly expect 2/1/4 but builder emits 1/3/2). Possible real wire-builder vs spec drift; spin-off task raised. No connection to `visibleTabs`.

Related: [[reference_falcon_root_node_has_tabs_keep_2026_05_30]] (root keeps Hierarchy+Settings — still true), [[project_settings_tab_per_section_view_gating_2026_05_30]] (the per-node Settings-tab gating pattern this mirrors).
