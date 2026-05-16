# Routing — auth feature

## Routes (lazy-loaded by host)
The `/login` segment in `app.routes.ts:73-76` lazy-loads `AUTH_ROUTES` from `features/auth/auth.routes.ts`:

```typescript
{
  path: 'login',
  loadChildren: () => import('./features/auth/auth.routes').then((m) => m.AUTH_ROUTES),
}
```

## AUTH_ROUTES table (`auth.routes.ts:10-32`)

| Path | Component | Lazy? | Guards | Resolvers | Params |
|---|---|---|---|---|---|
| `''` (= /login) | `LoginLayoutComponent` (parent) | (already lazy via host) | — | — | — |
| `''` (default child) | `GetStartedComponent` | no | — | — | — |
| `verify-otp` (= /login/verify-otp) | `EnterOtpComponent` | no | `otpGuard` | — | — |
| `change-password` (= /login/change-password) | `ChangePasswordComponent` | no | `changePasswordGuard` | — | — |
| `forgot-password` (= /login/forgot-password) | `ForgotPasswordFlowComponent` | no | — | — | — |

## Guard implementations

### `otpGuard` (`features/auth/guards/otp.guard.ts:10-20`)
```typescript
export const otpGuard: CanActivateFn = () => {
  const authFlowState = inject(AuthFlowStateService);
  const router = inject(Router);
  const session = authFlowState.getTempSession();
  if (session.sessionId) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
```
- Reads `sessionStorage.getItem('falcon_auth_flow')` via `AuthFlowStateService.getTempSession()`.
- Allows route only when a `sessionId` exists (was set by `GetStartedComponent.onLogin()` after stage-2 backend response).
- Redirects to `/login` otherwise (prevents URL-jumping directly to `/login/verify-otp`).

### `changePasswordGuard` (`features/auth/guards/change-password.guard.ts:10-20`)
```typescript
export const changePasswordGuard: CanActivateFn = () => {
  const authFlowState = inject(AuthFlowStateService);
  const router = inject(Router);
  const session = authFlowState.getTempSession();
  if (session.sessionId && session.firstLogin) {
    return true;
  }
  return router.createUrlTree(['/login']);
};
```
- Requires both `sessionId` AND `firstLogin === true`.
- `firstLogin` is set by `GetStartedComponent` when backend returns `requiresPasswordChange === true` or `stage === PasswordChangeRequired`, and by `EnterOtpComponent` after successful OTP if a password change is still required.

## Navigation transitions (state machine)

```
   /login (GetStartedComponent)
       │
       │ onLogin() → POST auth/login
       │
       ├─ stage: Authenticated (4) + tokens   → AuthService.handleLoginSuccess() → '/'
       │
       ├─ requiresOtp OR stage: OtpPending (2) → set sessionId + otpConfig
       │     → router.navigate(['/login/verify-otp'])
       │
       ├─ requiresPasswordChange OR stage: PasswordChangeRequired (3) → set firstLogin=true
       │     → router.navigate(['/login/change-password'])
       │
       └─ stage: Failed (5) → inline error banner, stay on screen
   
   /login/verify-otp (EnterOtpComponent)
       │
       │ onVerify() → POST auth/verify-otp
       │
       ├─ stage: Failed (5)                                  → reset OTP, show error, stay
       ├─ requiresPasswordChange + tokens null               → setFirstLogin(true), navigate /login/change-password
       ├─ tokens present                                     → AuthService.handleLoginSuccess() → '/'
       └─ success but no tokens + no password change         → reset OTP, show error
   
   /login/change-password (ChangePasswordComponent, isFirstLoginMode = true)
       │
       │ onSave() → POST auth/first-login
       │
       ├─ stage: Failed (5)                  → stay (toast handled by interceptor)
       ├─ tokens present                     → AuthService.handleLoginSuccess() → '/'
       └─ isSuccessful=false                 → stay
   
   /login/forgot-password (ForgotPasswordFlowComponent, internal FlowStep state)
       │
       │ FlowStep.Form: onSubmitRequest() → POST auth/forgot-password
       │     → set sessionId, transition FlowStep.Otp
       │
       │ FlowStep.Otp: onVerifyOtp() → POST auth/verify-otp
       │     → transition FlowStep.ResetPassword
       │
       │ FlowStep.ResetPassword: onSaveNewPassword() → POST auth/forgot-password/set-password
       │     → router.navigate(['/login'])
       │
       └─ onBackToLogin() at any stage → router.navigate(['/login'])
```

## Pre-route setup
- `AuthService.login(setState=true)` (called by `authGuard` for un-authed protected routes) saves `window.location.pathname` (base64) to `sessionStorage['auth_redirect']` then navigates to `/login`. After successful authentication, `AuthService.handleLoginSuccess()` reads and clears that key, then navigates to the saved path (or `/` if none).
