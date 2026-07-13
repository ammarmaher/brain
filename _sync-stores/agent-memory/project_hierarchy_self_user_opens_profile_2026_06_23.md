---
name: project_hierarchy_self_user_opens_profile_2026_06_23
description: "Hierarchy-tab \"More details\" on the logged-in user's own row now routes to /profile (self) instead of the inline admin user-details drilldown — FE-only, both consoles."
metadata: 
  node_type: memory
  type: project
  originSessionId: d19656f0-91a8-4046-8bbc-24b7435df755
---

**Hierarchy tab → clicking the LOGGED-IN user's own row now opens the self-profile page (`/profile`) instead of the inline admin user-details view.**

Flow: `node-workspace.component.ts` users-list "More details" → `openUserDetails.emit(u.id)` → `org-hierarchy-page-menu.component.ts onOpenUserDetails(userId)`. Previously it ALWAYS minted a `view:'user'` token and rendered `<app-user-details-page>` inline (admin drilldown). The dedicated self profile is the HOST route `/profile` (`UserProfileRouteComponent`, `selfMode=true`, GET user/me, personal-info-only) — the same target the topbar "My Profile" uses.

FIX (FE-only, both `apps/admin-console` + `apps/management-console` copies of `org-hierarchy-page-menu.component.ts`):
- Inject `SessionProvider` (from `@falcon`); add private `isSelf(userId) = !!selfId && userId === session.session?.identityUserId`. Uses the EXACT same equality the shared page already uses (`UserDetailsPageComponent.isEditingSelf`: row.id === identityUserId; user-list row id and identityUserId share the backend identity-user-id space).
- `onOpenUserDetails`: if `isSelf` → `router.navigate(['/profile'])` and return; else keep existing inline `confirmDiscardIfDirty()` → `navigateToState({view:'user',...})`.
- `/profile` reachable from the remote because both remotes are mounted as CHILDREN of the host `LayoutComponent` (`apps/host-shell/src/bootstrap.ts:32` applyRemoteRoutes inserts remote routes into `appRoutes[0].children`). So absolute `['/profile']` resolves to the sibling host route.
- Self path is a REAL route change → the page's `orgHierarchyPageCanDeactivate` guard already runs the unsaved-changes gate, so do NOT also call inline `confirmDiscardIfDirty()` (avoids double popup). Other-user path stays a same-route token swap (no CanDeactivate) → inline gate kept.
- `identityUserId` is nullable (Zitadel `user-id` metadata claim); when absent `isSelf` returns false → safe fall-through to the existing admin drilldown (no false match, no regression).

`nx build admin-console` + `nx build management-console` (dev) BOTH GREEN. No commit (FE no-commit-without-instruction rule [[feedback_fe_no_commit_no_branch_without_instruction_2026_06_22]]). Live click-through is auth + seeded-data gated (logged-in user must appear in a node user list) → user-gated. Related: [[project_pr41131_edituser_v2_pes_status_seed_review_2026_06_08]] (user-details/self edit model).
