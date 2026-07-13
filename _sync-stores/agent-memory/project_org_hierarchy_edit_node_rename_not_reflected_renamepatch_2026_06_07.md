---
name: project_org_hierarchy_edit_node_rename_not_reflected_renamepatch_2026_06_07
description: "Edit Node (rename) not reflected after save for TOP-LEVEL/Main nodes — root cause (Main node Path = single segment) + Option B optimistic [renamePatch] fix, build+unit green, no commits."
metadata: 
  node_type: memory
  type: project
  originSessionId: fa6a895c-0368-4a7c-a879-30f39e469563
---

# Edit Node (rename) "not reflected after save" — top-level nodes — FIXED (Option B optimistic patch)

**Date** 2026-06-07 (claude). **Repo** `C:/Falcon/Falcon/falcon-web-platform-ui`, branch polishing-v0.4 (assumed). **FE-only, NO commits.** User chose Option B (optimistic in-place patch) over Option A (depth-aware refetch).

## Verdict (code-verified, then build+unit-verified)
Renaming a node via the **Edit-Node drawer did NOT reflect after save for TOP-LEVEL / Main (client) nodes** — it showed the old name until a manual reload. **Sub-node renames already reflected; info-panel field edits already reflect; backend has NO read-DTO drift** (all Commerce node/settings GETs return every field the PUTs write — verified, unlike the Identity NationalId bug [[project_edituser_nationalid_iqama_not_reflected_readdto_drift_2026_06_07]]).

## Root cause
- node-drawer save edit branch called `tree.refreshSelectedPath()` ([CODE] `node-drawer-state.signals.ts:135`) → pushed `selectedNode().path` to the shared wrapper's `[refreshPath]` ([CODE] `tree-state.signals.ts:317`).
- Wrapper `startPathRefresh()` walks `path.split('.')` and for **each segment** calls `getChildren(id)` ([CODE] `organization-hierarchy-tree.component.ts:507-541`). A renamed node's new label only re-enters via its **parent's** children fetch; `if (!path) return` no-ops on null.
- **A Main node's `Path` is a single segment = its own id** ([CODE] `Node.Operations.cs:26` `Path = id`; sub-nodes get `Path = parent.Path + '.' + id` at `:53-55`). So `getChildren(mainId)` re-fetched only the Main node's CHILDREN, never the root main-node list where its renamed label lives → stale. (Client-console root is mapped `path: null` at [CODE] `services.ts:221` → same no-op.) This is the EXACT analog of the 2026-06-06 add-under-root fix, which was never applied to edit.

## Fix (Option B — additive, depth-agnostic, zero-HTTP)
Added an **optional** `[renamePatch]={id,name}` input to the shared host-shell wrapper (mirrors `[refreshPath]` plumbing 1:1): wrapper applies a pure `renameNodeInTree` (immutable spine rebuild, like `mergeChildren`) to its internal `tree()` signal and emits `(treeChange)` so the page mirror/header/selection update too. node-drawer **edit** branch now calls `tree.applyRenamePatch(ctx.targetId, name)` (uses the already-trimmed `name` the drawer emitted — see gotcha) instead of the path-walk. Works at every depth, no flicker, no tree-collapse, no spurious user-list refetch (path-walk re-emitted nodeSelect). Default-null input ⇒ other wrapper consumers unaffected.

**12 files:** host-shell wrapper models.ts (+`OrgHierarchyRenamePatchRequest`) + component.ts (input+effect+`applyRenamePatch`+`renameNodeInTree`); admin+mgmt × {`tree-state.signals.ts` (+`renamePatch` signal +`applyRenamePatch`), `hierarchy-page-state.service.ts` (+re-export), `org-hierarchy-page-menu.component.html` (+`[renamePatch]` binding), `node-drawer-state.signals.ts` (edit→applyRenamePatch), `tree-state.signals.spec.ts` (+3 tests, scope-guard comment refresh)}.

## GOTCHA (build error caught + fixed mid-flight)
`res.result` types as **`never`** in the success handler: `result$ = mode==='add' ? createSubNode():changeNodeName()` is `Observable<BackendSOR<bool>> | Observable<BackendSOR<string>>`; RxJS's observer `next` param is contravariant → `res` becomes the **intersection** `BackendSOR<bool> & BackendSOR<string>` → `res.result` = `boolean & string` = `never`. So you CANNOT read `res.result` off a unioned add/edit observable. Used the already-trimmed `name` param instead (it equals what was persisted; backend ChangeNodeName returns the name in res.result but it's untyped here).

## Verification
`nx run-many build host-shell,admin-console,management-console --skip-nx-cache` → SUCCESS (3 projects, only pre-existing warnings). `nx run-many test admin-console,management-console` → SUCCESS (2 projects); mgmt 635 tests pass, `tree-state.signals.spec.ts` 11 tests (8 + 3 new). **✋ User-confirmed working live (2026-06-07)** — user verified the rename now reflects after save ("it's working fine"). (Originally build+unit green; live was pending login.)

## Lessons
- "Saves but not reflected" on a tree ⇒ check the post-save REFRESH mechanism per node tier, not just the backend. Path-walk refresh fails for single-segment-path (top-level) nodes; whole-tree refetch or in-place patch is needed.
- The org-hierarchy tree is **owned by the host-shell wrapper**; the page can only update the rendered labels via wrapper `@Input`s (`refreshTick`/`refreshPath`/now `renamePatch`), not by patching the page's `state.tree` mirror.
- Don't read a generic `result` field off a union-of-observables in the observer callback — it collapses to the intersection (`never`).

Related [[project_org_hierarchy_account_name_trailing_space_validation_2026_06_07]] · [[project_edituser_nationalid_iqama_not_reflected_readdto_drift_2026_06_07]] · [[reference_fe_structure_standard_angular21_2026_06_02]].
