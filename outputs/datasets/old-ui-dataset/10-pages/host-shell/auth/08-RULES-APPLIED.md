# Rules / patterns — auth feature

## Observed (good)
- **Standalone components** for every screen — `standalone: true` consistently.
- **Reactive forms** for login + change-password + forgot-password (request + reset). Template-driven only for OTP `ngModel` and the unused `LoginLayoutComponent` p-select.
- **`takeUntilDestroyed(destroyRef)`** for every observable subscription in screens.
- **State machine via `OtpScreenState` enum** — single-source-of-truth screen state in `EnterOtpComponent` and `ForgotPasswordFlowComponent` (Step 2).
- **Auto-submit on OTP completion** with `previouslyComplete` flag — avoids double-submit while still being responsive.
- **Centralized state via `AuthFlowStateService`** + `sessionStorage` — survives page refresh on OTP/change-password screens.
- **Cross-field validator** (`passwordMatchValidator`) defined once, reused in both ChangePassword and ForgotPasswordFlow.
- **Inline error banner** with same extraction logic as `ResponseInterceptor` (`GetStartedComponent.extractHttpError` / `extractBodyError`).
- **`notShowToaster: 'true'` header opt-out** — clean way to suppress toasts when an inline UI exists.
- **i18n keys for every label/error** via `TranslateService` + `TranslatePipe`.

## Observed (bad — would be flagged by the night-shift digest)

- **`*ngIf` / `*ngFor`** instead of `@if/@for` (in HTML files not shown but used per imports in TS — `CommonModule` is in every standalone component's imports).
- **`@Input()` / `@Output()` decorators** instead of `input()/output()` signal queries (e.g. `EnterOtpComponent.@Input() inputOtpLength`).
- **`@ViewChild`** in `ForgotPasswordFlowComponent` (not in this code but the pattern is decorator-based).
- **SCSS files**: every component has a `.component.scss` — would be flagged by the "Tailwind utilities + tokens only" rule.
- **`setTimeout`** without `runOutsideAngular` for screen-transition animations (e.g. `EnterOtpComponent.onVerify` → `setTimeout(handleLoginSuccess, 1500)`; `ForgotPasswordFlowComponent.onVerifyOtp` → `setTimeout(FlowStep.ResetPassword, 1500)`).
- **`document.documentElement.setAttribute('dir', ...)`** inside `LoginLayoutComponent._applyLanguage` — direct DOM mutation. Would be flagged in favor of Renderer2.
- **`as any` casts** repeatedly: `(res as any).errorMessages?.[0]` in `EnterOtpComponent`, `ForgotPasswordFlowComponent`. Indicates the `ServiceOperationResult` type isn't fully expressing error fields.
- **Hardcoded `deliveryMethod: 2` (SMS)** in `ForgotPasswordFlowComponent.onSubmitRequest` — no UI for Email or Both, even though the backend supports them.
- **Logo as inline 58×46 SVG with hardcoded `<path d="...">`** in `login-layout.component.html` — would be a shared `<falcon-icon>` or asset in a cleaner build.
- **Country flags from external CDN** (`flagcdn.com`) — runtime dependency on third-party host. Would prefer bundled SVG flags.
- **`querySelector('.p-inputotp input, p-inputotp input')`** in `EnterOtpComponent.focusFirstInput` — DOM-walking through ElementRef. Tied to PrimeNG internals.
- **`btoa(window.location.pathname)`** in `AuthService.login` and `atob(...)` on read — base64 of a URL is purely cosmetic; standard `encodeURIComponent` would be cleaner. (`auth.service.ts:84`, line 132).
- **Two error-extraction paths** — `GetStartedComponent.extractHttpError/extractBodyError` duplicate logic that already exists in `ResponseInterceptor`. DRY violation.
- **`AuthFlowStateService` exports `LoginDTO` and `OtpConfig`** but they're already shadowed by similar types in `auth.models.ts` (`LoginRequest`) — multiple shapes for the same concept.
- **`isFirstLoginMode`** branch in `ChangePasswordComponent` — the "regular" path is dead code (always re-auths via `/login`). Should be pruned or extracted into a separate route/component.
- **Mixed validators in same form**: `disabled: true` in the initial form value is a known foot-gun (FormControl warning). `Validators.required` paired with `disabled: true` still flags as invalid.
- **`(window.history.state || {}) as Record<string, unknown>`** in `UserProfileComponent` (cross-page concern) — fragile reliance on browser API.

## Patterns worth porting

- **Three-stage state machine on a single component** (`ForgotPasswordFlowComponent`) — keeps the page-level routing simple (one route, internal `FlowStep`). Avoids polluting `auth.routes.ts` with sub-routes that are only valid in a specific flow.
- **`AuthFlowStateService` pattern** — typed transient state with `loadState/saveState` JSON helpers + default-merge, persisted in `sessionStorage`. Reusable for any multi-screen flow.
- **`enterInputState(otpLength, expirySeconds)`** in `ProfileOtpModalComponent` (user-profile feature) — single transition function for an OTP screen.
- **`@Input() inputOtpLength/Seconds/Destination`** override on `EnterOtpComponent` — allows the same component to be re-used outside the AuthFlowState context.
- **Centralized backend mapping** via `AuthApiService` (one method per endpoint, no business logic) → screen-level services that transform shapes only → components that own UX. Clean three-layer split.

## Anti-patterns to NOT port to new theme
- **Two `ChangePasswordComponent`s** (one in `auth/` feature for first-login, one in `layout/components/user-profile-menu/change-password-modal/` for logged-in re-set). Same concept, different implementations, different DTOs (`{newPassword, confirmPassword}` vs `{oldPassword, newPassword, confirmNewPassword}`). Consolidate.
- **`forgot-password-flow` is a single 449-line component**. Each step should be its own component with a shared parent that owns the state machine.
- **State machine via `if-else` cascade** (`GetStartedComponent.onLogin.subscribe`) — fragile when more stages are added. A typed reducer or `switch (stage)` is preferable.
- **Inline server-error message extraction** in components — should always go through `ResponseInterceptor` and never duplicate.
- **Email regex inline in component**: `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` lives in `UserProfileComponent` as a getter. Move to `@falcon/FALCON_PATTERNS.EMAIL` (which already exists per `personal-information-step.component.ts:15` — `FALCON_PATTERNS.EMAIL_STRING`).
