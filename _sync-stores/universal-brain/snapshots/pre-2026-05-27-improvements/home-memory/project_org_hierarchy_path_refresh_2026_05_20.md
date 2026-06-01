---
name: project_org_hierarchy_path_refresh_2026_05_20
description: "Org-hierarchy wrapper now accepts [refreshPath] — sequential path walk with toggles + loader; Add/Edit Node refreshes selectedNode.path (parent stays selected)"
metadata: 
  node_type: memory
  type: project
  originSessionId: 23c84d43-75c9-4c59-98a2-1d4c28bfcf36
---

🟢 BUILD-GREEN 2026-05-20. Org-hierarchy wrapper `<app-organization-hierarchy-tree>` now exposes a `[refreshPath]` input that drives a sequential, path-scoped tree refresh.

**Contract:** Caller pushes `{ path: string | null }` (object wrapping for input equality re-fire). Wrapper splits the dot-joined path (`grandfather.father.son`), calls `loadNodeChildren(id)` for each segment **sequentially** (`concatMap` awaits each), merges children, opens that segment's toggle ONLY after children land, then selects the leaf and emits `(nodeSelect)` — the SAME event a manual row click produces.

**Loader:** ONE `FalconLoaderService.showOverlay()` at walk start. ONE dismiss inside `finalize()` — guarantees close on success, error, cancellation (new push mid-walk), or destroy. No flicker, no orphans.

**Add/Edit Node:** `node-drawer-state.signals.ts:137` now calls `tree.refreshSelectedPath()` instead of `refetchTree()`. Refreshes the SELECTED PARENT's path (the drawer's anchor), not the new child's — selection stays put, new child appears in parent's children list. Edit: same path re-fetches and renames in place.

**Files:**
- [CODE] `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/organization-hierarchy-tree.component.ts` — `refreshPath` input (152), effect (366-369), `startPathRefresh()` (490)
- [CODE] `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/models/models.ts` — `OrgHierarchyPathRefreshRequest` interface
- [CODE] `apps/admin-console/.../services/state/tree-state.signals.ts` — `refreshPath` signal (252), `refreshSelectedPath()` (282)
- [CODE] `apps/admin-console/.../services/state/node-drawer-state.signals.ts:137` — replaces `refetchTree()` call
- [CODE] `apps/admin-console/.../services/hierarchy-page-state.service.ts:147` — facade re-export
- [CODE] `apps/admin-console/.../components/org-hierarchy-page-menu.component.html:73` — `[refreshPath]` template binding

**Net lint:** zero novel violations. Pre-existing module-boundary patterns (cross-app type imports, `@falcon/studio` static import) match existing codebase conventions (`do-payment-priority-popup` for the latter).

**Library `falcon-tree-panel`: untouched.** Stays presentational per [[feedback_api_code_stays_in_host_app]] — all API + state work lands in the host-shell wrapper, never in the lib.

Related: [[project_node_drawer_save_validation_fix_2026_05_18]], [[project_falcon_loader_inline_config_2026_05_19]], [[project_org_hierarchy_tree_shared_component]]
