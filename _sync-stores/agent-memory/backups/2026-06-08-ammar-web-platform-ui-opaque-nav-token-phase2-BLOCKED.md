---
name: Session Backup - Opaque Navigation Token Phase 2 (Org Hierarchy)
description: Phase 2 opaque-nav-token implementation could not start — Phase 1 absent + target feature lives in a different worktree than cwd
type: project
agent: ammar-web-platform-ui
date: 2026-06-08
status: blocked
---
## What Was Done
- Inspection only. NO code written, NO files edited/created/deleted in any app/lib. (This is the ONLY file written, under memory/backups.)

## Blocker (why Phase 2 did not start)
Task = implement Phase 2 opaque-nav-token for the Organization Hierarchy page in cwd `C:\Falcon\Falcon\falcon-web-platform-ui` (branch `main`), assuming Phase 1 `NavigationTokenService` is DONE and an `org-hierarchy-page/` feature exists with a routed parent-shell + `?node`/`user/:userId` children. THREE mismatches make that impossible as written:

1. **Phase 1 does NOT exist in this repo (either tree).** Exhaustive search (`NavigationTokenService`, `OpaqueNavigationEntry`, `createToken`/`resolveToken` with `scope`/`ttlMs`, `cleanupExpiredTokens`, `clearToken`, sessionStorage key `falcon:navigation-state`) found nothing in source. The only `ttlMs`/`clearToken` hits are the OAuth `token-storage.service.ts` (unrelated). The prompt's path `libs/falcon/src/core/lib/services/navigation-token.service.ts` is absent in both worktrees. Rebuilding it is explicitly forbidden by the task.

2. **cwd is the WRONG tree.** The feature in cwd `main` is the OLD `apps/admin-console/src/app/features/organization-hierarchy/` (single `organization-hierarchy.component.ts` + `tabs-layout/` substructure). There is NO `org-hierarchy-page/`, no `HierarchyPageStateService`, no `*.can-deactivate.guard.ts`, no `?node`/`user/:userId` routing here at all.

3. **The `org-hierarchy-page/` feature the prompt describes lives in a SEPARATE worktree:** `C:/Falcon/Brain Outputs/worktrees/night-shift-token-migration` (branch `night-shift-token-migration`, HEAD ffc723c4). That tree HAS `apps/{admin,management}-console/src/app/features/org-hierarchy-page/` with `org-hierarchy-page.routes.ts`, `services/hierarchy-page-state.service.ts`, `components/org-hierarchy-page-menu.component.{ts,html}`. BUT it is also BEHIND the prompt's "current state":
   - `org-hierarchy-page.routes.ts` there is the EARLY single-route form (loadComponent → OrgHierarchyPageMenuComponent, breadcrumb only). No `children`, no `shellAccessGuard`, no `canDeactivate`, no `HIERARCHY_PAGE_STATE_PROVIDERS` on the route's `providers` beyond the facade+slices.
   - NO `components/node-workspace/`, NO `components/user-details-route/`, NO `*.can-deactivate.guard.ts`.
   - Menu has NO `reconcileSelectionFromUrl`/`navigateToNode`/`queryParamMap` (the `?node` routing the prompt says to REMOVE is not present yet).
   - And it still lacks Phase 1 `NavigationTokenService`.
   The 2026-06-08 active-session-log entry (the routed parent-shell + 2-children + orgUserDetailsCanDeactivate refactor that the prompt's "Current state" describes) is NOT reflected in this worktree's committed code — it was working-tree-only in a prior session and is not present here.

## What Remains (needs user decision before any code)
Cannot proceed without disambiguation:
- **Which tree/branch** is the real target? Almost certainly `night-shift-token-migration` worktree, NOT cwd `main`. Confirm, or point me at the branch/worktree that actually has Phase 1 + the routed parent-shell state the prompt's "Current state" section describes.
- **Phase 1 status:** is `NavigationTokenService` actually committed somewhere I should pull/rebase onto? If it truly is not built, the "Phase 1 DONE, don't rebuild" premise is wrong and Phase 1 must be built first (needs explicit go-ahead since the task forbids it).
- The prompt's Phase-2 design (routes `h/:navigationToken`, bootstrap guard, in-handler `confirmDiscardIfDirty`, old-route redirects) presupposes the routed parent-shell + node-workspace/user-details-route children exist. They don't exist in the target worktree → that intermediate refactor would have to be (re)applied first.

## Key Decisions
- Did NOT write any feature/lib code. Did NOT rebuild Phase 1 (forbidden). Did NOT edit the wrong-tree `organization-hierarchy` feature in cwd. Did NOT touch the separate worktree. Stopped at investigation to avoid destructive/wrong-target work and a likely-failing build.

## Files Changed
- None (this memory backup only).

## Context for Next Agent
- Worktrees: `git worktree list` from cwd shows main (cwd, 62a883fa), `_wt/ns-fe` (254a1d8f detached), `Brain Outputs/worktrees/falcon-old-ui-main` (detached), `Brain Outputs/worktrees/night-shift-token-migration` (ffc723c4, the org-hierarchy-page tree).
- Stashes on main: stash@{0} EDIT-USER-V2 WIP (polishing-v0.4), stash@{1} due-payment WIP. Neither looked token-related but were NOT inspected in depth.
- If the user confirms the night-shift-token-migration worktree + supplies/locates Phase 1, the Phase-2 plan in the original prompt is sound and can be executed admin-first then mirrored to mgmt — but the intermediate routed-parent-shell refactor (node-workspace + user-details-route children + can-deactivate guards) must be present first.
