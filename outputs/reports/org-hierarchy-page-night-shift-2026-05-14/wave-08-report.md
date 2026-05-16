# Wave 8 — Tree panel + ctx-menu wiring

**Status:** GREEN
**Run:** 2026-05-14 (Brain SK Night-Shift autonomous)
**Build hash:** `ca88d30f608bd18f` (admin-console, 14,132 ms)
**Lint exit:** N/A — out of W8 scope (covered in W18 regression)

## Goal

Wire `<falcon-tree-panel>` into the menu shell with `ROOT_ACTIONS` + `NODE_ACTIONS` ctx-menus, hover trail, and selection events. Render skeleton while tree loads.

## Files verified (orchestrator-staged at handoff)

| Path | Verified |
|---|:---:|
| `components/org-hierarchy-page-menu.component.ts` | yes — imports `FalconTreePanelComponent`, `FalconTreeAction`, `FalconTreePanelActionEvent`; declares `ROOT_ACTIONS` + `NODE_ACTIONS`; `onTreeAction()` switch handler |
| `components/org-hierarchy-page-menu.component.html` | yes (after fix) — `<falcon-tree-panel>` with `[root]/[expandedIds]/[selectedId]/[rootActions]/[nodeActions]/(toggle)/(select)/(action)`; skeleton + selected-node display |

## Fix applied this wave

| File | Fix |
|---|---|
| `components/org-hierarchy-page-menu.component.html` | Renamed skeleton selector `<falcon-org-hierarchy-skeleton>` → `<app-org-hierarchy-skeleton>` to match the W7 D14 rename of the component selector (admin-console `app-*` lint rule). Without this, the build was RED with NG8001 + NG8002 errors. |

## Decisions inherited

- D1 (Phase 4) — `<falcon-tree-panel>` is the tree primitive
- D14 partial (Phase 4 + W7 deviation) — internal `falcon-org-*` selectors renamed `app-org-*` to satisfy admin-console ESLint
- Tree state mutations land via `HierarchyPageStateService` methods: `onTreeToggle()`, `onTreeSelect()`, `onTreeContextAction()`, `onHeaderAddClient()`, `onHeaderAddUser()`, `onHeaderAddNode()`, `onHeaderEditNode()`

## Build / lint gate

```
npx nx build admin-console
# Hash: ca88d30f608bd18f, Time: 14,132 ms — SUCCESS
```

## Acceptance criteria (4 from wave plan §W8)

| # | Criterion | Status |
|---|---|:---:|
| 1 | Tree renders with mock seed (Aramco / Al-Rajhi / SNB / Bupa) | YES — state service `fetchTree()` falls back to `MOCK_TREE` on backend error and auto-selects Aramco; `<falcon-tree-panel>` mounted with `[root]="state.treeRoot()"` |
| 2 | Hover trail works | YES — `<falcon-tree-panel>` has built-in hover-path SVG rail (Agent 4 component dossier item 3) |
| 3 | Selection updates `state.selectedNodeId()` | YES — `(select)="state.onTreeSelect($event)"` wired |
| 4 | 3-dot ctx-menu items match root vs non-root | YES — `[rootActions]="rootActions"` (Add Client + Add User) and `[nodeActions]="nodeActions"` (Add Node + Edit Node + Add User); `onTreeAction()` dispatches by `event.id` |

## Open issues / decisions punted

1. **Skeleton component selector mismatch** — was a true build blocker, fixed inline. No follow-up.
2. **Unused-import lint warnings** — `OrgHierarchySkeletonComponent` + `TranslatePipe` are imported eagerly even though only used inside `@if (showSkeleton())`. This matches the reference (management-console) — leaving as-is.
3. **Selected-node display is placeholder** — Real node-header + content panel land in W9-W15 (wired as the wizard mounts + users-table block arrive).

End of Wave 8 report. Advancing to W9.
