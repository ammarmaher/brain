# PES — auth feature

## Permission keys used
None. All auth screens are pre-authentication (user has no JWT yet).

## AccessControlFacade usage
None.

## Route guards
- `otpGuard` (`features/auth/guards/otp.guard.ts`) — gates `/login/verify-otp` on presence of `sessionId` in `AuthFlowStateService`. NOT a PES guard.
- `changePasswordGuard` (`features/auth/guards/change-password.guard.ts`) — gates `/login/change-password` on `sessionId + firstLogin === true`. NOT a PES guard.

## Eligibility / Subscription checks
None.

## Implicit gating
- The whole `/login` parent route is implicitly "unauthenticated" — the `authGuard` on the root layout (`app.routes.ts:17`) only allows authenticated users to access `''`, `/shell`, `/auth-view`, `/profile/*`. Unauthenticated users get redirected to `/login`, which has NO `authGuard`.
- `LoginLayoutComponent` itself has no guard — anyone can reach `/login` regardless of session state. `[INFERRED]` This means a logged-in user could navigate back to `/login`; nothing prevents them visually, but the next backend call would still validate the JWT.
