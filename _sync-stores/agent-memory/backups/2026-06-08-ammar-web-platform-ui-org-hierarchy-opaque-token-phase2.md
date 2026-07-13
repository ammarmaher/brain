---
name: session-backup-org-hierarchy-opaque-navigation-token-phase-2
description: "Replaced org-hierarchy ?node/user URLs with opaque /{app}/h/{token} in both consoles"
metadata: 
  node_type: memory
  type: project
  agent: ammar-web-platform-ui
  date: 2026-06-08
  status: completed
  originSessionId: a412d47b-0587-4ffc-b635-48ab4ceedfce
---

## What Was Done
Phase 2 of the opaque-navigation-token feature for the Org Hierarchy page, BOTH consoles.
Replaced the URLs that exposed business ids:
- admin: `/#/admin-console/org-hierarchy-page?node={nodeId}` and `…/org-hierarchy-page/user/{userId}?node={nodeId}`
- mgmt: the `organization-hierarchy` equivalents
with a single opaque-token URL `/#/{app}/h/{token}`. The node-vs-user VIEW now comes from the
TOKEN STATE, not the URL path. Built ON Phase 1 `NavigationTokenService` (@falcon, scope
`'organization-hierarchy'`, sessionStorage, crypto-UUID token). NOT backend security — only keeps
editable ids off the address bar. cwd `C:\Falcon\Falcon\falcon-web-platform-ui`, branch
`polishing-v0.4` (NOT a worktree). NO git commits. Admin done first as reference, then mirrored to mgmt.

## Token shape (per console, in route-state.ts)
```ts
export const ORG_HIERARCHY_TOKEN_SCOPE = 'organization-hierarchy';
export interface OrganizationHierarchyRouteState {
  app: 'admin-console' | 'management-console';
  view: 'node' | 'user';
  nodeId: string;        // '' = "page picks its default node after the tree loads"
  userId?: string;       // only when view==='user'
}
export const ORG_HIERARCHY_APP = 'admin-console' /* or 'management-console' */ as const;
```

## Routes (per console)
- `app.routes.ts`: replaced the old mount with `{ path:'h', loadChildren: orgHierarchyPageRoutes }`.
  Added a legacy-compat route at the OLD slug (`org-hierarchy-page` admin / `organization-hierarchy`
  mgmt) with `canActivate:[orgHierarchyLegacyRedirectGuard]` and a `{path:'user/:userId',children:[]}`
  child so old bookmarks (with/without `?node`/`user`) redirect to `/{app}/h/{token}` (NO ?node/user re-emitted).
- `orgHierarchyPageRoutes`:
  - shell `path:''` — `providers:[HierarchyPageStateService, ...HIERARCHY_PAGE_STATE_PROVIDERS]`,
    `canActivate:[shellAccessGuard]`, `canDeactivate:[orgHierarchyPageCanDeactivate]`, `data:{access,breadcrumb}`.
  - child `{ path:'', pathMatch:'full', canActivate:[orgHierarchyBootstrapGuard], children:[] }` —
    bootstrap mints `{app,view:'node',nodeId:''}` token and returns a **UrlTree redirect** to the
    sibling `:navigationToken` (parent absolute path via `pathFromRoot` + token segment).
  - child `{ path:':navigationToken', loadComponent: OrgHierarchyPageMenuComponent }`.

## Menu component (hosts BOTH views from the token)
- Reads `:navigationToken` REACTIVELY via `route.paramMap` →
  `resolveToken<OrganizationHierarchyRouteState>(scope, token)`.
- INVALID (null) OR `state.app !== thisApp` → `replaceWithFreshToken()` (mint fresh `{view:'node',nodeId:''}`,
  `router.navigate([fresh],{relativeTo:route.parent, replaceUrl:true})`).
- VALID + `nodeId===''` (bootstrap) → `refineBootstrapToken()`: once tree loaded (called from `onTreeReady`),
  take `state.selectedNodeId()` default and `replaceUrl` to a refined `{view:'node',nodeId:<default>}` token
  (guarded by `suppressBootstrapRefine` flag to avoid re-entry).
- VALID + concrete `nodeId` → `state.applyTreeSelection(nodeId)` + set `view`/`selectedUserId` signals.
- `<main>` renders INLINE (NO `<router-outlet>`, NO user child route):
  `@if(view()==='user'){ @for(id of [selectedUserId()]; track id){ @if(id){<app-user-details-page [userId]="id" [includeDeleted]="false" (dirtyChange)="state.setUserInfoDirty($event)" (back)="onUserBack()"/>} } } @else { <app-node-workspace (openUserDetails)="onOpenUserDetails($event)"/> }`
- Imports `UserDetailsPageComponent` from `@falcon/user-details` (selector `app-user-details-page`,
  inputs `[userId]`/`[includeDeleted]`, outputs `(back)`/`(dirtyChange)`) + local `NodeWorkspaceComponent`.

## Navigation (single primitive)
`navigateToState(next: OrganizationHierarchyRouteState)`: `createToken(scope, next)` then
`router.navigate([token], { relativeTo: this.route.parent })` (menu's `route` is `:navigationToken`;
its parent `''` sits at `/{app}/h`, so `[token]` relative to parent → `/{app}/h/{token}` — VERIFIED via
RouterTestingHarness in the routing spec).
- Tree node click (`onNodeSelect`) → gate `confirmDiscardIfDirty()` then `navigateToState({view:'node',nodeId:clicked})`.
- "More details" row → node-workspace emits `openUserDetails` → menu `onOpenUserDetails` gates then
  `navigateToState({view:'user',nodeId:current,userId})`.
- Back (`onUserBack`) → `setUserInfoDirty(false)` FIRST then `navigateToState({view:'node',nodeId:current})`.
- Post-create-node selection (`onSendCredentialsSuccessDismissed`, admin only) → `navigateToState({view:'node',nodeId:newId})`.

## Freshness
- user→node `@if` false→true swap destroys+recreates `<app-node-workspace>` → its ctor `reloadUsers()`
  refetches the list (structural — the load-bearing guarantee).
- node→node (view stays 'node') is covered by the users-slice reactive refetch on selected-node change
  (TreeStateSlice selection drives UsersStateSlice combineLatest→switchMap).
- user-view keyed-recreate by `userId` (`@for ... track id`) → new user always loads fresh.

## Unsaved-changes gate (preserved, one popup per leave)
- node↔user is a SAME-route token-param change → NO CanDeactivate fires → gate IN-HANDLER via
  `state.confirmDiscardIfDirty()` before any view-changing nav; navigate only on `leave===true`.
- `onUserBack` clears `setUserInfoDirty(false)` BEFORE navigating (shared `<app-user-details-page>`
  already ran its own Back gate) → no double popup.
- whole-page `orgHierarchyPageCanDeactivate` STAYS for sidebar / cross-feature leaves (route changes → fires).
- `orgUserDetailsCanDeactivate` REMOVED (no user child route anymore).

## Files Changed (admin = reference, mgmt = mirror, app='management-console', no AddClient)
CREATED (both consoles): `route-state.ts`, `org-hierarchy-bootstrap.guard.ts`, `org-hierarchy-legacy-redirect.guard.ts`
REWROTE (both): `org-hierarchy-page.routes.ts`, `components/org-hierarchy-page-menu.component.ts`,
  `components/org-hierarchy-page-menu.component.html` (`<main>` `@else` → inline view conditional),
  `org-hierarchy-page.can-deactivate.guard.ts` (drop orgUserDetailsCanDeactivate),
  `org-hierarchy-routing.spec.ts` (token topology), `org-hierarchy-page.can-deactivate.guard.spec.ts` (whole-page only)
EDITED (both): `components/node-workspace/node-workspace.component.ts` (More-details → `openUserDetails` output;
  removed Router/ActivatedRoute inject + the `['user',id]` navigation), `app.routes.ts` (`h` mount + legacy redirect)
DELETED (both): `components/user-details-route/user-details-route.component.ts` + `.spec.ts`
HOST-SHELL: `apps/host-shell/src/app/layout/layout.component.ts` — admin nav constant
  `admin_console_PATH_ORG_HIERARCHY_PAGE` → `${admin_console_BASE}/h`; mgmt
  `management_console_PATH_ORGANIZATION_HIERARCHY` → `${MANAGEMENT_CONSOLE_BASE}/h`. (Sidebar active-path
  prefix-match still works via `url.startsWith(path + '/')`.)

## Gates (evidence)
- `nx build admin-console` GREEN, `nx build management-console` GREEN, `nx build host-shell` GREEN
  (only pre-existing unused-file + bundle-budget warnings; the `falcon-org-node-header` unused-file
  warnings are pre-existing, not introduced).
- `nx test admin-console` = **861/861 GREEN** (46 files). New `org-hierarchy-routing.spec.ts` = 8/8.
- falcon lib `navigation-token.service.spec.ts` = **11/11 GREEN** (`npx vitest run --root libs/falcon navigation-token`).
- mgmt `nx test` / vitest = BLOCKED by PRE-EXISTING `@falcon/ui-core/angular` vite resolver error in
  `libs/falcon/src/shared-ui/index.ts` — CONFIRMED identical failure on the UNTOUCHED
  `tree-state.signals.spec.ts`, so it is NOT introduced by this work. mgmt routing + can-deactivate specs
  are byte-structural mirrors of the passing admin specs (differ only in the `app` discriminator string +
  node-id literals).

## Walk-throughs (reasoned)
- same-tab refresh: token in URL → sessionStorage hit → resolveToken returns state → view re-renders (survives refresh, gone on tab close). ✓
- invalid token: resolveToken null → replaceWithFreshToken → fresh `{view:'node',nodeId:''}` → refine to default on tree-ready. No crash. ✓ (admin routing spec d.1)
- expired token: resolveToken null (TTL) → same fresh-token path. ✓ (d.2)
- wrong-app token (admin token opened in mgmt or vice-versa): `state.app !== thisApp` → fresh token. ✓ (d.3)
- node route: concrete nodeId token → applyTreeSelection + node workspace. ✓ (b)
- user route: user token → user-details inline by userId. ✓ (c)
- admin + mgmt: both build green; admin tests green; mgmt specs are mirrors.

## What Remains
- Live login UI walkthrough is USER-GATED (no password typing in this session). Recommend: log into both
  consoles, click Org Hierarchy in sidebar (→ `/{app}/h` → bootstrap → `/{app}/h/{token}`), verify default
  node loads, click a node (URL = new token only, no ?node), open a user's More details (token only, no
  /user), Back (returns to list, list refetched), refresh mid-user-view (user persists), edit a user +
  click another node / sidebar (ONE unsaved popup), paste an old `/{app}/org-hierarchy-page?node=x` URL
  (redirects to token), tamper the token in the URL (redirects to fresh default).
- mgmt vitest resolver block is a separate pre-existing infra issue (follow-up, not this feature).

## Key Decisions
- UrlTree redirect from the bootstrap guard (composes with the guard pipeline; no double-nav).
- Parent-absolute path via `pathFromRoot` for the bootstrap/legacy redirect targets (mount-depth-independent),
  but `relativeTo: route.parent` for the menu's in-page `navigateToState` (verified correct by harness).
- More-details raised as an OUTPUT from node-workspace (it has no route now) so the central gate stays in
  the menu and node-workspace stays route-agnostic.
- `includeDeleted` hardcoded `false` on the inline user-details (per Phase-2 spec) — dropped the old
  soft-deleted `?includeDeleted=true` query carry-over.

## Context for Next Agent
- Phase 1 `NavigationTokenService` is generic; ANY feature can adopt this exact pattern (own scope + typed
  state + bootstrap guard + reactive paramMap resolve + inline view-from-state). This is the first consumer.
- The org-hierarchy `user-info-state.signals.ts` still has a STALE comment mentioning
  `UserDetailsRouteComponent` (the deleted component) in both consoles — harmless (comment only), drop on a
  cleanup pass.
- Pattern doc lives in [MEMORY] project_org_hierarchy_routed_userdetails_urlstate_2026_06_08 (the Phase-0
  routed version this REPLACES) — this Phase 2 supersedes the `?node`+child-route design.
