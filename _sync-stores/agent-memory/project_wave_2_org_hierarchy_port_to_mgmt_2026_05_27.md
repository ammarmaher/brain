---
name: wave-2-org-hierarchy-port-admin-mgmt
description: Wave 2 of the Admin→Mgmt port plan (2026-05-27). Bulk-copy current admin org-hierarchy-page (108 files) into live mgmt-console with surgical drops + 12-step transformations.
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-05-27
  status: build-green
  build: nx build management-console → SUCCESS (skip-nx-cache verified)
  originSessionId: 25972c96-56f6-47b9-b1ee-a0d5bc4ea595
---

# Wave 2 — Organization Hierarchy port to management-console

🟢 BUILD-GREEN · 73 files landed in `apps/management-console/src/app/features/org-hierarchy-page/` after dropping the 35-file Add Client wizard + mock-tree.ts from the 108-file admin source.

## Decision
Per `[CODE] C:\Falcon\plans\audit-2026-05-27.md §4.2` — RE-PORT from current admin (admin had 22 NEW files since 2026-05-18 worktree port, including `falcon-org-chart/`, `falcon-org-node-*` widgets, can-deactivate guard, and the Wave-2 service-pricing consolidation). The worktree port was lift-eligible for other waves but stale for Wave 2.

## Files
- **Total ported:** 73 (admin had 108; dropped 35 Add Client wizard files + mock-tree.ts).
- **Per-sub-feature:** tab-components/hierarchy-tab (33), settings-tab (7), add-user-wizard (17), services (9), models (1), root (2 = routes + can-deactivate guard) + skeleton + stencil-prop-patches + page-menu (3).

## 12-step transformations applied
1. **Step 3 namespace flip** — all `FalconAccess.adminConsole.X` → `FalconAccess.managementConsole.X` where a counterpart exists; `adminConsole.userPermissionGroup.assign` + `adminConsole.userProfilePicture.upload` DROPPED (no mgmt counterpart, default-allow with backend SoT). Add User wizard now queries `accountUser.add` (for tenant root) or `orgUser.add` (for sub-node) based on selected node type — per `[CODE] falcon-access.registry.ts:66-71`.
2. **Step 4 gateway flip** — every `useGateway(Gateway.SystemGateway)` flipped to arg-less `useGateway()` (4 sites: services/services.ts, settings.service.ts, information.service.ts, user.service.ts already arg-less). `provideAppDefaultGateway(Gateway.CoreGateway)` from app.config.ts handles the rest.
3. **Step 7 session id** — `FALCON_ROOT_NODE` + `getRootNodes()` + synthetic-root branches REMOVED everywhere. `mock-tree.ts` deleted. Add User wire builder no longer applies Falcon-root nodeId/tenantId overrides — every selected node has a real backend id.
4. **Step 8 drops applied:**
   - Add Client wizard (35 files) — entire `wizard-components/add-client-wizard/` folder removed.
   - `FALCON_ROOT_NODE` synthetic root — dropped from all 8 ts files.
   - Root-level Settings → mgmt account-* PES keys only (no `rootPasswordSecurityLevel` / `rootAllowedIps`).
   - Add Client header button + tree-menu item + facade methods removed.
   - `NodeContextAction` union narrowed: `'addClient'` removed.
   - `isFalconUser` / `isFalconNode` / `isFalconRoot` branches collapsed to their no-Falcon equivalents.
5. **Step 9 route** — `path: 'organization-hierarchy'`, `canActivate: [shellAccessGuard]`, `canDeactivate: [orgHierarchyPageCanDeactivate]`, `data.access: FalconAccess.managementConsole.accountHierarchy.view()`. NOT wired into `app.routes.ts` per brief constraint — reported as fragment in summary.
6. **Step 10 validation rewire** — `isFalconRoot` branches in `settings-tab.signals.ts` (3 sites) collapsed to always-account-scope; users-list query uses `ACCOUNT_USER_ROLES` only.

## Memory entries honoured
- `project_validation_input_caps_wave_g_2026_05_24.md` (Price 15 / User Limits 3 digit caps — carried over via admin Wave G source).
- `project_validation_xlsx_sot_flip_wave_f_2026_05_24.md` (charset relax + priceValue integer-only + IPv6 — carried over).
- `project_validation_whitespace_wave_d_2026_05_24.md` (`whitespace(mode)` primitive — carried over).
- `project_service_pricing_per_row_loader_wave_12_2026_05_21.md` — page-menu imports `ServicePricingComponent` from `@host-shell/shared/service-pricing` (consolidated wrapper).
- `project_info_panel_validation_parity_2026_05_21.md` (11 fields + async account-name uniqueness — carried over).
- `project_node_drawer_save_validation_fix_2026_05_18.md` (4 root causes + sibling-uniqueness — carried over).
- `project_org_hierarchy_fe_be_integration_realign_2026_05_21.md` (8 gaps — services.ts contract preserved).
- `project_user_list_pathprefix_fix_2026_05_18.md` (PathPrefix preserved + sent only when path present).
- `project_add_user_role_scope_phone_fix_2026_05_19.md` (role scope to acc-* — `roleOptionsForNode` always returns ACCOUNT_ROLE_OPTIONS; FLAG B-1 carries backend-side filter).

## Backend FLAGs surfaced
- **FLAG B-1 (existing, Wave 0)** — `/api/role` Identity endpoint must filter by JWT context to return only `acc-*` roles for tenant calls. FE filters client-side as fallback (`ACCOUNT_ROLE_OPTIONS` is hard-coded in `add-user-wizard/models/models.ts`). Backend verification still pending. NOT blocking the build.

## Grep gate result
All probes returned zero REAL hits (only port-delta docstring comments mentioning the drops):
- `add-client-wizard/` folder — does NOT exist (Test-Path PASS).
- `FALCON_ROOT_NODE | getRootNodes` — no real hits.
- `isFalconUser | isFalconNode | isFalconRoot` — no real hits.
- `FalconAccess.adminConsole` — no hits at all.
- `useGateway(Gateway.SystemGateway)` — no real hits (only port-delta docstring in services.ts).
- `rootPasswordSecurityLevel | rootAllowedIps | account.add` — no real hits.

## Route fragment (not wired per brief constraint)
```typescript
// To add to apps/management-console/src/app/app.routes.ts inside `children`:
{
  path: 'organization-hierarchy',
  loadChildren: () =>
    import('./features/org-hierarchy-page/org-hierarchy-page.routes').then(
      (m) => m.orgHierarchyPageRoutes,
    ),
},
```

## Build
- `npx nx build management-console --skip-nx-cache` → ✅ SUCCESS
- `npx nx build host-shell --skip-nx-cache` → ✅ SUCCESS (sanity-check; no transitive break)

## Key file locations
- Live target: `C:\Falcon\Falcon\falcon-web-platform-ui\apps\management-console\src\app\features\org-hierarchy-page\`
- Routes file: `org-hierarchy-page.routes.ts` (43 lines)
- Can-deactivate guard: `org-hierarchy-page.can-deactivate.guard.ts` (unchanged from admin)
- Page facade: `services/hierarchy-page-state.service.ts` (487 lines, AddClient surface fully stripped)
- HierarchyService: `services/services.ts` (250 lines, rewritten clean — no MOCK_TREE / FALCON_ROOT_NODE / SystemGateway)
