---
name: Components Migration to Host-Shell
description: 3-wave migration of falcon-brand-logo (shared), otp-dialog (shared, renamed from verify), user-details (routed feature with /user-details/:id) from admin-console into host-shell.
type: project
originSessionId: 560e63c0-6d7d-4009-aa85-ba23b6c9609a
---
# 🟢 LANDED 2026-05-17 — Components Migration to Host-Shell

Three components migrated from `apps/admin-console/.../org-hierarchy-page/components/` into `apps/host-shell/` across 3 wave-gated subagent runs. All builds green at every gate.

## Wave 1 — `falcon-brand-logo` → `apps/host-shell/.../shared-components/falcon-brand-logo/`
- Pure SVG glyph, **zero deps**. Alias `@host-shell/shared/falcon-brand-logo` (auto-resolved via `tsconfig.base.json:19-21` wildcard).
- 3 admin-console consumers rewired: `falcon-org-node-context-card.ts:40`, `falcon-org-node-sibling-chip.ts:22`, `falcon-org-node-header.ts:8` — all import paths swapped from `'../../../falcon-brand-logo'` → `'@host-shell/shared/falcon-brand-logo'`.
- Hashes: admin-console `5d0860a266a3ecea` → `a52d818d45a37fc9` (post-delete), host-shell `dc008c880190b477`.

## Wave 2 — `verify/` → `otp-dialog/` in `apps/host-shell/.../shared-components/otp-dialog/`
- Folder renamed `verify` → `otp-dialog` to match the component class name (`OtpDialogComponent`) and align with existing convention (`org-node-avatar`, `do-payment-priority-popup`).
- `OtpMockService` co-located under `services/otp-mock.service.ts` per Falcon component-folder doctrine. One edit on copy: line 19 import path `'../../services/otp-mock.service'` → `'./services/otp-mock.service'`.
- `index.ts` re-exports both `OtpDialogComponent` AND `OtpMockService` + `OtpValidationMode` so external consumers can configure the mock mode.
- Old admin-console copies kept for Wave 3 transitional coexistence (deletes deferred — `UserDetailsPageComponent` still imported from old location until Wave 3 rewired it).
- Hashes: host-shell `c9ff1e4b0d4a3aa1`, admin-console untouched (`a52d818d45a37fc9`).

## Wave 3 — `user-details` → routed page at `apps/host-shell/src/app/features/user-details/`
- **Behavioral change**: was inline drilldown (input-driven `[user]`); now a routed page (`/user-details/:id`, child of `LayoutComponent` under `authGuard + shellPrimeAccessGuard` per `app.routes.ts:21-28`).
- On landing: reads `:id` from `ActivatedRoute.paramMap`, calls `UserApiService.getById(id)` (existing API at `apps/host-shell/.../core/user/user-api.service.ts:52-57`), maps response via local `mapUserResponseToUser` to local `User` shape.
- Local `User` model + mapper in `models/user-details.models.ts` (self-contained; does NOT reach into admin-console's `org-hierarchy-page/models/models.ts`).
- Template gating: `@if (loading) { spinner } @else if (errorMsg) { error+back } @else if (userSig) { existing verbatim template }`. Existing `user()` references continue to work via `user = computed(() => userSig() ?? EMPTY_USER)` shim — zero inner-template edits.
- Admin-console row click rewired: `onUserRowActionLocal()` in `org-hierarchy-page-menu.component.ts:295` injects `Router` and calls `router.navigate(['/user-details', u.id])`. Module-federation singleton Router lands the route on host-shell's outlet.
- Full cleanup in admin-console: removed `userDetails` signal, `onUserDetailsClose`, `onUserDetailsSave`, `UserDetailsPageComponent` import + imports[] entry, inline `<app-user-details-page>` template branch (was at `.html:82-87`).
- 7 files deleted: `components/user-details/*` (3) + `components/verify/*` (3) + `services/otp-mock.service.ts` (1).
- Hashes post-delete: admin-console `1b6bf89e7074868b`, host-shell `3cc8fb9cf50d25c2`, management-console `9bd7f7203946fd12`.

## Validation
- All 8 leftover-ref greps return 0 matches.
- All 3 apps prod-build GREEN post-delete.
- Coexistence-then-delete sequence (Wave 2 deferring deletion to Wave 3) prevented compile failures during transitional state.

## Caught during execution (subagent `[INFERRED]` findings)
- **ServiceOperationResult field-name discrepancy**: `@falcon` lib's `ServiceOperationResult<T>` uses `errors: string[]` + `errorCodes: any[]`; admin-console's local `ServiceOperationResult` interface (`org-hierarchy-page/models/models.ts:148-153`) has `errorMessages: string[]`. The host-shell mapper uses `res.errors?.[0]` for compatibility with the `@falcon` shape that `UserApiService` returns.
- **Phantom token TODO** at the moved `user-details-page.component.html:3` preserved verbatim (`bg-falcon-warning-*` / `bg-falcon-success-*` tokens) — defer to token-unification track per existing deferral chain (`project_token_unification_plan`).
- Pre-existing `NG8113` dead-import warning on `FalconAngularInputComponent` in `OrgHierarchyPageMenuComponent` flagged but out of scope (was present before this migration).

## Future work
- Backend does not yet expose `checkerWhatsapp` / `checkerVoice` — mapper defaults to `'none'`. Wire when backend ships these fields.
- `UserApiService.updateUserProfile` + `updateUserRole` are called from `onSave()`; verify against the actual UI flow once runtime testing is approved by the user.
- Runtime smoke test not executed per CLAUDE.md hard rule (no QA claims without evidence). User to verify: Org Hierarchy → click user row → expect `/user-details/<id>` → spinner → 3 tabs → Edit + OTP `000000` → save.

## How to resume / extend
Trigger phrase: `extend user-details routed page` or `add edit-user POST to user-details`. The feature folder is self-contained; new flows add to `services/` inside the feature without touching admin-console.
