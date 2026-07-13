---
name: session-backup-org-hierarchy-users-list-user-details-routing-refactor-admin-console
description: Replaced the in-place master-detail (fragile (saved)->reloadUsers chain) with a routed parent-shell + 2 children so Back STRUCTURALLY re-mounts the list and refetches; selected node mirrored to ?node query param.
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-06-08
  status: completed
  originSessionId: a412d47b-0587-4ffc-b635-48ab4ceedfce
---

## What Was Done
Refactored `apps/admin-console/src/app/features/org-hierarchy-page` so the **users-list ⟷ user-details** pair is ROUTED instead of an in-place `@if/@else` master-detail. The page is now a PARENT shell (tree + header + wizard/drawer overlays + `<router-outlet>`) with two CHILD routes:
- `''` (pathMatch full) -> **NodeWorkspaceComponent** (tabs + view toggle + node header + all tab bodies incl. users list)
- `user/:userId` -> **UserDetailsRouteComponent** (routed wrapper around shared `@falcon/user-details` `<app-user-details-page>`), with `canDeactivate: [orgUserDetailsCanDeactivate]`.

The whole reason: navigating Back now STRUCTURALLY re-mounts NodeWorkspaceComponent, whose constructor calls `state.reloadUsers()` -> refetches the users list for the `?node`-selected node (replaces the stale `(saved)->reloadUsers()` event chain). Selected node lives in the URL as `?node=<id>` (URL = source of truth). Wizards (Add Client/Add User) + Add/Edit Node drawer stay signal-driven overlays exactly as before.

## Files Changed
CREATED:
- `components/node-workspace/node-workspace.component.ts` + `.html` — extracted the ENTIRE final `@else` workspace branch out of the menu component. Injects the SAME page-scoped `HierarchyPageStateService` from the PARENT route injector (no providers). Constructor: `this.state.reloadUsers()` (load-bearing). Row "More details" => `router.navigate(['user', id], { relativeTo: this.route.parent, queryParamsHandling: isDeleted ? 'merge' : 'preserve', queryParams: isDeleted ? { includeDeleted: 'true' } : undefined })`. Owns the tabs + paginator Stencil prop-patch effects (moved with the workspace).
- `components/user-details-route/user-details-route.component.ts` — admin copy of `apps/host-shell/.../user-details-route.component.ts`. Reads `:userId` (param) + `?includeDeleted` (query) via ActivatedRoute; keyed-recreate `@for (id of [userId()]; track id)`; `(back)` => `router.navigate(['../'], { relativeTo: route, queryParamsHandling: 'preserve' })`; `(dirtyChange)` => `inject(HierarchyPageStateService).setUserInfoDirty($event)`. NO `(saved)` binding needed (structural remount handles reload).

EDITED:
- `org-hierarchy-page.routes.ts` — parent (unchanged providers/guards/data) + `children: [{ path:'', pathMatch:'full', loadComponent: NodeWorkspaceComponent }, { path:'user/:userId', loadComponent: UserDetailsRouteComponent, canDeactivate:[orgUserDetailsCanDeactivate], data:{breadcrumb:'User Details'} }]`.
- `org-hierarchy-page.can-deactivate.guard.ts` — ADDED `orgUserDetailsCanDeactivate` (delegates to the SAME `confirmDiscardIfDirty()`).
- `components/org-hierarchy-page-menu.component.ts` + `.html` — `<main>` now `@if(addClientOpen){wizard} @else if(addUserOpen){wizard} @else {<router-outlet/>}`. Removed the in-place `@else if(userInfoOpen)` `<app-user-details-page>` branch, the whole final `@else` workspace, and `onUserInfoBack/onUserInfoSaved` + all workspace-only members (now in node-workspace). Added selection<=>URL: `reconcileSelectionFromUrl(?node)` called from BOTH the `route.queryParamMap` subscription AND `(treeReady)`; tree-click now NAVIGATES via `navigateToNode(id)` (queryParams `{node:id}`, merge) instead of setting selection directly; `userRouteActive` tracked from the ROUTER (`NavigationEnd` + `route.firstChild?.routeConfig?.path.startsWith('user/')`), NOT a facade signal.
- `services/hierarchy-page-state.service.ts` — ADDED `applyTreeSelection(nodeId)` facade delegate to `TreeStateSlice.applyTreeSelection` (the design assumed it existed; it didn't — build error caught it).

SPECS (all green): `org-hierarchy-page.can-deactivate.guard.spec.ts` (4), `services/state/users-reload-on-mount.spec.ts` (4), `org-hierarchy-routing.spec.ts` (6, RouterTestingHarness topology + guard), `services/state/tree-state.signals.spec.ts` +2 (applyTreeSelection).

## Gates (evidence)
- `nx build admin-console` (PRODUCTION default): SUCCESS. dev build SUCCESS. Only a PRE-EXISTING bundle-size WARNING `bundle initial exceeded maximum budget. Budget 10.00 MB was not met by 328.00 kB with a total of 10.33 MB` (warn threshold 10MB; ERROR threshold 11MB) — not introduced here, not an error.
- `nx test admin-console`: `Test Files 46 passed (46)` / `Tests 853 passed (853)` (baseline was 837/45; +16 new).
- `eslint` on all 11 touched files: 0 problems. (Full-app lint has 51 PRE-EXISTING problems in OTHER files — none mine.)

## Key Decisions / Gotchas for Next Agent
- **MF nested routing is fine**: `remote-route.service.ts` hands the WHOLE admin routes array to Angular's router as `loadChildren`, so parent+children+`<router-outlet>` is plain Angular routing — the Module-Federation boundary is app-level, above this feature. Proven green via RouterTestingHarness (6 topology tests). `contact-groups` (`'' + :groupId`) was the existing precedent.
- **Single-gate reconcile**: from the user route, a tree-click just `navigateToNode` (empty `[]` relativeTo parent + new `?node`) which DEACTIVATES `user/:userId` and activates `''` workspace -> `orgUserDetailsCanDeactivate` is the SOLE popup. "Stay" (gate=false) aborts the nav (URL + tree highlight, bound to `selectedNodeId()`, don't move). Workspace surfaces (info-panel/settings) are mutually exclusive with the user route, so no double-pop.
- **Test harness rules (admin-console vitest)**: `vite.config.mts` strips `analogjs-router-optimization` so `@falcon` barrel imports work; NEVER mount heavy Stencil components, NEVER call `TestBed.flushEffects()` (documented OOM). The users pipe uses `toObservable` combineLatest => emits on a microtask => spec must `await new Promise(r=>setTimeout(r,0))` before asserting on `getUsers`. RouterTestingHarness from `@angular/router/testing` works for topology tests with dummy (non-Stencil) components.
- **Cold deep-link / F5 on a deep lazy node** falls back to the default selection BY DESIGN (lazy-tree-path-from-URL reconstruction is out of scope); the URL is re-pointed to the default via `replaceUrl:true`.
- Facade still re-exports `openUserInfo`/`userInfoOpen` (now DEAD — nothing calls/renders them) per the "keep `UserInfoStateSlice` on disk" instruction. `setUserInfoDirty`/`userInfoDirty` ARE still wired (the routed child feeds them for the gate).

## What Remains
- Live in-browser E2E walkthrough (BMW -> users load -> click user -> edit name/username -> verify/save -> Back -> list refetches + reflects) — pending a running stack/login (user-gated; gates are static-green).
- **management-console mirror** is the explicit NEXT pass (after review). Same shape; mgmt currently uses CoreGateway + 'acc' PES scope + its own balance components.
- NO commits made (working tree only).
