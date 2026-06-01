---
name: PR #40937 IncludeDeleted lift (Wave B+E)
description: Lifted the IncludeDeleted soft-delete visibility feature from PR #40937 (FE-120380 Edit User V2) into the new UI — Falcon admins now see + open soft-deleted users.
type: project
originSessionId: bbf47061-e8dc-42e8-ba10-12bb9689474b
---
# PR #40937 — IncludeDeleted lift (Wave B + Wave E) — 2026-05-17

🟢 **LANDED 2026-05-17.** Two parallel app builds GREEN:
- `nx build admin-console` — hash `cc7dc852427b4c2c` / 16.97s
- `nx build host-shell` — hash `1cd6580299116164` / 13.31s

## Source PR
- **PR #40937** — `FE-120380 Edit User V2 — status-aware edit form + OTP verification`
- Author: Ammar Mk · merged to OLD-UI `main` on 2026-04-28 · source `feature/120380-edit-user-v2`
- The PR's full diff is at `C:\Users\User\AppData\Local\Temp\pr40937\diff\*.diff` (25 files)
- This integration cherry-picks **only the IncludeDeleted soft-delete visibility feature** (Waves B + E from the integration plan); A/C/D deferred to the Edit-User epic when they have real consumers.

## What landed — 4 file edits across new UI

### Wave B — IncludeDeleted on the wire

**B.1** `apps/host-shell/src/app/core/user/user-api.service.ts`
- Imports `SessionProvider`, `USER_TYPE_STRINGS` from `@falcon`
- Injects `SessionProvider`
- **`getById(id, includeDeleted = false)`** — when `true`, sends `?includeDeleted=true` query param. Default preserves prior contract.
- **`listByNode(...)`** — auto-adds `IncludeDeleted=true` when `session.userType === FALCON_USER`. Defensive: BE enforces the same rule so passing the flag from a client session is a no-op.

**B.2** `apps/admin-console/src/app/features/org-hierarchy-page/services/services.ts`
- Same import + injection
- `HierarchyService.getUsers` — same Falcon-only `IncludeDeleted=true` auto-append on the page-level list endpoint

### Wave E — `includeDeleted` query-param propagation through the user-details navigation

**E.1** `apps/admin-console/.../components/org-hierarchy-page-menu.component.ts`
- `onUserRowActionLocal(event)` — when `u.status === 'deleted'`, pass `{ queryParams: { includeDeleted: 'true' } }` to `router.navigate(['/user-details', u.id], …)`. Default omitted so non-deleted entry paths stay on prior contract.

**E.2** `apps/host-shell/.../user-details/user-details-page.component.ts`
- Constructor's `paramMap` subscriber now also reads `route.snapshot.queryParamMap.get('includeDeleted') === 'true'`
- `fetchUser(id, includeDeleted = false)` — forwards the flag to `userApi.getById(id, includeDeleted)`

## End-to-end flow
1. Falcon admin opens the org-hierarchy page.
2. `HierarchyService.getUsers()` auto-adds `IncludeDeleted=true` → user list now contains soft-deleted rows.
3. Admin clicks a deleted row (status = `'deleted'`).
4. `onUserRowActionLocal` navigates to `/user-details/<id>?includeDeleted=true`.
5. `UserDetailsPageComponent` constructor reads the query param.
6. `userApi.getById(id, true)` hits `GET identity/user/<id>?includeDeleted=true`.
7. Identity backend returns the soft-deleted user instead of 404.

## Source-prefixed citations

- [CODE] PR #40937 metadata: `C:\Users\User\AppData\Local\Temp\pr_40937_meta.json`
- [CODE] OLD UI `apps/host-shell/.../user-api.service.ts:48-79` (PR diff) — model for new-UI Wave B.1
- [CODE] OLD UI `apps/admin-console/.../organization-hierarchy/services/user-api.service.ts:82-89` (PR diff) — model for new-UI Wave B.2
- [CODE] OLD UI `apps/admin-console/.../organization-hierarchy.component.ts:411-425` (PR diff) — model for new-UI Wave E.1
- [CODE] OLD UI `apps/host-shell/.../user-profile.component.ts:469-470` (PR diff) — model for new-UI Wave E.2 `queryParamMap.get('includeDeleted')`

## Verification level
- 🟢 **Build-verified.** admin-console + host-shell compile clean. No new warnings introduced by these 4 edits.
- 🔴 **NOT runtime-verified.** FE-runtime smoke still gated by the workspace's 40+ pre-existing Stencil/Angular compile errors per `Brain Outputs/datasets/authority-dataset/VERIFICATION-STATUS.md:99-115`. Wire shape is correct end-to-end; runtime POST/GET-body confirmation defers until that blocker clears.

## Doctrine extracted
**Soft-delete visibility is a role-scoped query toggle, not a UI filter.** The right place is at the HTTP-service boundary so EVERY consumer of `listByNode`/`getUsers` benefits without re-asking. The receiving page just propagates the flag back via `?includeDeleted=true` query param when the user clicks a deleted row — keeps every other entry path on the default contract and means the BE can stay strict on its 404 behavior for non-flagged GETs.

## Build forensics — one weird thing worth flagging
During the first build attempt admin-console failed with a `TS2322` on `settings.service.ts:103` (`SecuritySettings` PascalCase vs camelCase). That file is in an untracked WIP folder created by another agent at `22:29:14` today. While I was investigating (stash-pop cycle), the file got auto-corrected to camelCase by an external editor/agent. After restore the build went GREEN with my Wave B+E changes intact. The error was **not caused by Wave B+E** — confirmed by:
1. Baseline build without my changes (during stash): GREEN, hash `d2a5529b59c42714`
2. The error was in PascalCase literal keys NEVER in any file I touched
3. After fix landed (external), re-build with my changes: GREEN

If similar errors reappear in this folder (`settings-tab/services/`, `settings-tab/models/`, `settings-tab/signals/`, `settings-tab/validations/`), they're parallel-session WIP — not regressions from this wave.

## What's intentionally NOT in this wave (deferred)
Per the user-approved scope ("go B+E"), the following PR #40937 carries are **deferred** to the Edit User epic:
- **Wave A** — `FalconAccess.user.*` PES namespace (zero consumers in new UI today)
- **Wave C** — `CurrentUserService` (no consumer until Edit User reads `canSkipPendingVerification`)
- **Wave D** — `targetNodeIsRoot` acc-owner role gate (new UI's `ROLE_OPTIONS` is sys-* only, the guard would be dormant)

## Trigger phrases to reload this knowledge
- `IncludeDeleted soft-delete users` / `soft-deleted user-details navigation`
- `PR 40937 IncludeDeleted lift` / `Falcon admin see deleted users`
- `includeDeleted query param user-details`

## Files touched
| File | Edit |
|---|---|
| `apps/host-shell/src/app/core/user/user-api.service.ts` | +SessionProvider inject; widened `getById(id, includeDeleted?)`; auto-IncludeDeleted in `listByNode` |
| `apps/admin-console/.../org-hierarchy-page/services/services.ts` | +SessionProvider inject; auto-IncludeDeleted in `getUsers` |
| `apps/admin-console/.../org-hierarchy-page/components/org-hierarchy-page-menu.component.ts` | `onUserRowActionLocal` passes `includeDeleted=true` queryParam for deleted rows |
| `apps/host-shell/src/app/features/user-details/user-details-page.component.ts` | Reads `queryParamMap.get('includeDeleted')` + forwards to `fetchUser` + `userApi.getById` |
