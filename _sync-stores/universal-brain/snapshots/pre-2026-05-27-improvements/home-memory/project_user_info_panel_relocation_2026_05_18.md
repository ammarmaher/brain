---
name: User Information panel relocation into org-hierarchy right panel
description: User-details view extracted to @falcon/user-details shared lib and embedded in admin-console org-hierarchy right panel as state-driven master-detail
type: project
originSessionId: a51a3ffb-d940-4ced-a73a-e404fb1a4f76
---
🟢 COMPLETE 2026-05-18. Relocated the host-shell `user-details/:id` view into the admin-console org-hierarchy page's right panel as an in-place master-detail view (tree stays visible on the left).

**Why:** Clicking a user row used to `router.navigate(['/user-details', id])` — a full-shell navigation that replaced the page and lost the org-hierarchy tree. User wanted the User Information to load in-place, with working Back, tree always usable.

**How to apply:** when touching this area —
- Shared component: `@falcon/user-details` → `UserDetailsPageComponent` (selector `app-user-details-page`, standalone). Route-agnostic: inputs `userId` (required) + `includeDeleted`; outputs `back` + `dirtyChange`. Lives at `libs/falcon/src/shared-features/user-details/` (new `shared-features/` lib category).
- host-shell route `user-details/:id` now lazy-loads a thin wrapper `UserDetailsRouteComponent` that reads the route param and renders the shared component. management-console still routes to that host-shell route — do not break it.
- `OtpDialogComponent` hoisted to `libs/falcon/src/shared-ui/lib/components/otp-dialog/` (its `otp-mock.service.ts` is a pure in-memory test-double — no backend, correctly library-resident).
- ARCHITECTURE RULE (corrected after a violation): a library is presentational only — component + types + a PORT (interface + InjectionToken). It must NEVER contain a backend/HTTP service. The user-details port is `UserDetailsGateway` interface + `USER_DETAILS_GATEWAY` token in `@falcon/sdk` (`libs/sdk/src/types/` + `tokens/`). `UserApiService` lives in the HOST APP (`apps/host-shell/src/app/core/user/user-api.service.ts`), `implements UserDetailsGateway`, provided in host-shell `app.config.ts` via `{provide: USER_DETAILS_GATEWAY, useExisting: UserApiService}`. The embedded admin-console component injects the host-shell singleton via MF eager-singleton sharing of `@falcon/sdk` — same mechanism as `FALCON_NOTIFIER`. Wire/DTO types are pure data contracts and may live in the library/SDK; only the SERVICE must be in the host app.
- GATEWAY ROUTING: every HTTP call MUST attach a `useGateway()` HttpContext or `RuntimeBaseUrlInterceptor` falls back to `environment.baseURL` (= `http://localhost:7045` in dev) instead of the QA gateway (`*-api.falconhub.space`). Declaring a `useGateway()` field but not passing it to the call is the classic localhost bug.
- admin-console embed: `UserInfoStateSlice` (`services/state/user-info-state.signals.ts`) holds `userInfoOpen`/`selectedUserId`/`includeDeleted`/`userInfoDirty`; `HierarchyPageStateService` facade exposes `openUserInfo()/closeUserInfo()`. The `@if (state.userInfoOpen())` branch in `org-hierarchy-page-menu.component.html` takes over `<main>` like the Add-Client/Add-User wizards.
- Navigation guard: Back, tree-click, tab-switch, router-leave all funnel through the one existing `confirmDiscardIfDirty()` gate; `pageHasUnsavedEdits` ORs in user-info dirty.
- Permissions: role-change UI gated with real PES keys `FalconAccess.userRole.self/other` (registry at `libs/falcon/src/shared-types/lib/constants/falcon-access.registry.ts`). Profile-field editing is intentionally left ungated on FE (backend-enforced) — there is NO `adminConsole.user.edit` PES key; do not invent one.
- Info page is 100% Falcon library components (zero native interactive DOM). `falcon-warning-*` token scale does NOT exist — use `falcon-amber-*` / `falcon-green-100/700`.

**Edit User V2 (2026-05-18, second iteration — aligns with PR #40937 / branch `feature/120380-edit-user-v2`):**
- PES keys: lifted PR Wave A — `FalconAccess.user.edit(field)`, `user.editStatus/editRole/editPermissionGroup/verifyEmail/verifyPhone`, `userStatus.other(cur,tgt)` in the registry (`falcon-access.registry.ts`).
- `CurrentUserService` (host-shell `core/user/`) exposes `canSkipPendingVerification` (Falcon/owner/node-admin may save a Pending user without OTP). It reaches the library component via the `UserDetailsGateway` port — `canSkipPendingVerification()` added to the interface; host-shell `UserApiService` delegates to `CurrentUserService` via lazy `inject(Injector)` (avoids a DI cycle).
- Phone/email use `falcon-angular-phone-field` / `falcon-angular-email-field` with built-in `verifyButton` (`size="md"`, `state="success"` when verified, `(falcon-verify)`→`app-otp-dialog`). Standalone verify buttons deleted. Added a `verifyDisabled` prop to the Stencil `falcon-phone-field` primitive for parity with email-field.
- Save gating: blocked while phone/email need verification unless `canSkipPendingVerification` && status `pending`; all field validations run on Save; per-field PES gates applied.
- Component restructured to the folder doctrine: `user-details/validations/validations.ts` (pure fns) + `user-details/signals/signals.ts` (`UserDetailsStateSlice`); component is a thin orchestrator (~506→250 lines).
- Top bar: user-avatar icon deleted; Back kept; Save/Cancel moved into the top bar (Edit→Cancel/Save action pattern).
- PES 404: `AccessControlClient.authorizeResources` builds the URL from `baseURLPes` — env config on `polishing-v0.4` is already correct; the client now THROWS a clear error instead of silently falling back to a relative URL (which hit `localhost:7045` → 404). A live 404 = stale cached `window.FalconRuntimeConfig`; rebuild host-shell + hard-refresh.

**Real OTP integration (2026-05-18, third iteration — from PR branch `feature/120380-edit-user-v2-verify-new-contact`):**
- The OTP dialog was mock-backed (`otp-mock.service.ts`, `code === '000000'`) — now deleted. Real flow wired.
- OTP port: `OtpGateway` interface + `OTP_GATEWAY` token + OTP DTOs in `@falcon/sdk`. `ProfileOtpService` (host-shell `core/user/`) implements it, provided in host-shell `app.config.ts` next to `USER_DETAILS_GATEWAY`.
- OTP API (all via `useGateway(Gateway.IdentityGateway)`): send `POST /user/me/verify-{email|phone}` body `{email}`/`{phoneNumber}` → `VerificationCodeResponse{otpCodeLength,otpExpiresInSeconds,devOtpCode}`; confirm `.../confirm` body `{code}`; resend `.../resend` empty body.
- `app-otp-dialog` (library) injects `OTP_GATEWAY`, inputs `field`+`fieldValue`, drives 6-state flow (Sending/Input/Verifying/Success/Error/Expired) + countdown + resend; auto-sends on open. PrimeNG from the PR's `profile-otp-modal` NOT copied — Falcon `<falcon-angular-otp>` markup kept.

⚠ `polishing-v0.4` has concurrent multi-session WIP — `applications-table.component.ts` etc. may be mid-edit and fail a clean build transiently (not a regression). Re-run the build; it settles.

Verified: `nx build host-shell + admin-console + management-console` all GREEN (admin-console clean `ebc178dd36e13bbf`). No runtime/browser test performed.
