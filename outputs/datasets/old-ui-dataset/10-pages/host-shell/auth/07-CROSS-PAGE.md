# Cross-page dependencies — auth feature

## Inbound (auth feature depends on)
- `AuthService` from `../../core/auth/auth.service` — orchestrates `handleLoginSuccess(tokens)` at the end of every successful flow.
- `AuthApiService` from `../../../core/auth/auth-api.service` — every screen-level service delegates to it.
- `AuthenticationStage` enum from `../../../core/auth/auth.models` — used in switch/if logic in `GetStartedComponent`, `EnterOtpComponent`, `ChangePasswordComponent`.
- `TranslateService` + `TranslatePipe` from `@falcon` — used in every component.
- `FalconMobileNumberComponent` from `@falcon` — phone input in `ForgotPasswordFlowComponent` step 1.
- `OtpScreenState`, `FlowStep` enums from `@falcon` — drives state machines.
- PrimeNG: `ButtonModule`, `InputTextModule`, `InputOtpModule`, `SelectModule`.
- `@angular/forms` — `ReactiveFormsModule` for login/change-password forms; `FormsModule` for OTP `ngModel`.

## Outbound (other features depend on auth)
- `AuthFlowStateService` is consumed by:
  - `otpGuard`, `changePasswordGuard` (host-level guards).
  - `GetStartedComponent`, `EnterOtpComponent`, `ChangePasswordComponent` (screens).
- The `AUTH_ROUTES` export is the only public API surface — consumed by the host's lazy `loadChildren`.

## Shared state
- **Reads:**
  - `sessionStorage['falcon_auth_flow']` — via `AuthFlowStateService.loadState()`.
  - `sessionStorage['auth_redirect']` (read by `AuthService.handleLoginSuccess`).
- **Writes:**
  - `sessionStorage['falcon_auth_flow']` — via `AuthFlowStateService.saveState()`.
  - sessionStorage tokens via `AuthService.handleLoginSuccess` → `TokenStorageService.setTokens()`.
  - Clears `falcon_auth_flow` via `AuthFlowStateService.clear()` (called on success or back-to-login).

## Navigation entry points
- `/login` (default) — entered from `authGuard` redirect, or from `AuthService.login()` (called by another guard).
- `/login/verify-otp` — only reachable via state transition from `GetStartedComponent`.
- `/login/change-password` — only reachable via state transition from `GetStartedComponent` (password change required without OTP) or `EnterOtpComponent` (password change required after OTP).
- `/login/forgot-password` — reachable via the "Forgot Password?" link on `GetStartedComponent` (`get-started.component.ts:66`).

## Cross-MFE auth wiring
- `AuthService.handleLoginSuccess` calls `authFacad.emmitSubjects()` — pushes the new tokens onto the `FalconAuthFacade`'s observables so remote MFEs that have subscribed receive the JWT.
- `AuthService.logout` does the same after clearing — remotes see the token go to `null`.
- The `HostAuthFacade` (`apps/host-shell/falcon-facades/host-auth.facade.ts`, not directly read in this dataset) is the local implementation.
