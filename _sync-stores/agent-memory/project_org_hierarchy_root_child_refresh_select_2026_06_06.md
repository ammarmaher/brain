---
name: project_org_hierarchy_root_child_refresh_select_2026_06_06
description: "Org Hierarchy — adding a level-1 node (child of root) didn't refresh/select; root.path=null no-op'd the wrapper path-walk. Fixed via whole-tree refetch + by-name selection, both consoles."
metadata: 
  node_type: memory
  type: project
  originSessionId: e89c1a52-a4bb-4ee5-84a9-1d56931bd370
---

# Org Hierarchy — "add a node under the ROOT (level-1 child) doesn't refresh / select the new node" — FIXED 2026-06-06 (claude)

**Symptom (user):** adding a node whose level is a direct child of the root does NOT refresh the org-hierarchy page; deeper children work. Also wanted the newly-added node SELECTED after refresh.

**Root cause** (code-traced, repo `C:/Falcon/Falcon/falcon-web-platform-ui`, branch polishing-v0.4):
- After Add Node, `NodeDrawerStateSlice.onNodeDrawerSave` (org-hierarchy-page/services/state/node-drawer-state.signals.ts) called `tree.refreshSelectedPath()`, which pushes `selectedNode().path` to `<app-organization-hierarchy-tree>` (host-shell wrapper).
- Wrapper `startPathRefresh(path)` does `if (!path) { ...; return; }` — a SILENT NO-OP on null/empty path.
- The **ROOT node's `path` is null**: mgmt client root is built from the session node via `orgNodeToFetchNode` which hardcodes `path:null` (host-shell `.../organization-hierarchy-tree/services/services.ts`); admin synthetic Falcon root has no path. Deeper nodes carry a real backend `path` (from `getChildren`→`toFetchNode`) so their path-walk fires → "works for children".
- **Manifests in the MANAGEMENT console** (`mode="client"`): root IS the user's own account and the client-mode root kebab exposes "Add Node" → parent of the new node = root → null path → no refresh. Admin (`mode="falcon-full"`) gates "Add Node" behind `!isRootSelected()` and adds level-1 *clients* via the Add Client wizard (which already refetches + reselects), so admin's level-1 already worked.
- `create-SubNode` backend response = `{ success }` ONLY — **no new node id** (`CreateSubNodeWireResult`; `mapBackendEnvelope` drops result on success). So selecting the new node must be by **unique sibling name** (backend rejects DuplicateNodeName).

**Fix** (scoped to level-1/root-parent ONLY; deeper-add + ALL edits keep the original `refreshSelectedPath` path-walk → no regression):
- `services/shared/tree-helpers.ts`: + pure `findChildByName(root, parentId, name)` (trim-tolerant, unique-sibling match).
- `services/state/tree-state.signals.ts`: + private `pendingAddSelection` signal; + `queueRootChildSelection(parentId, name)` (sets pending, calls `refetchTree()` = whole-tree refetch via treeRefreshTick, the same mechanism Add Client uses); `applyTreeUpdate()` resolves pending by name-match → selects the new node + returns (skips selection-preservation); `applyTree()` clears pending on full reset.
- `services/state/node-drawer-state.signals.ts`: `onNodeDrawerSave` success — `if (ctx.mode==='add' && rootId!==null && ctx.targetId===rootId) queueRootChildSelection(ctx.targetId, name); else refreshSelectedPath();` (rootId = `this.tree.tree()?.id`).
- Applied IDENTICALLY to admin + mgmt (the two slices were byte-identical). NO wrapper / backend change.
- NEW `tree-state.signals.spec.ts` ×2 (8 tests each): findChildByName matrix + queue→refetch tick + select-new-after-refetch + queued-across-interim-update + no-hijack-when-nothing-queued + clear-on-applyTree-reset.

**Verification:** mgmt 555 tests pass (547+8), admin 721 (713+8); both `nx build --configuration=development --skip-nx-cache` EXIT 0. ⚠️ `npx nx` broken in shell → use `node node_modules/nx/dist/bin/nx.js`. ⚠️ Live click-through PENDING (no browser + needs login); a dev-server rebuild/restart may be needed to clear stale dist. **NO COMMITS.**

Flow after fix (mgmt): select root account → root kebab "Add Node" → save → `queueRootChildSelection(root.id, name)` → `refetchTree` → wrapper `getTree` (root + getChildren(root.id), new node appears) → `treeChange` → `applyTreeUpdate` → name-match → select new node → wrapper `[selectedIdInput]` highlights it.

Related [[reference_static_remote_rebuild_after_app_edit_2026_06_04]] · [[reference_fe_structure_standard_angular21_2026_06_02]] · [[reference_wallet_transfer_source_destination_matrix_2026_06_06]].
