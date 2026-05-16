# Components — auth feature

## Tree
```
LoginLayoutComponent (selector: app-login-layout) — routed parent for /login/**
├── <aside class="login-brand">  (logo + tagline + description)
├── <main class="login-main">
│   └── <div class="login-card">
│       ├── notch decoration
│       ├── <router-outlet>
│       │     ├── GetStartedComponent (app-get-started)
│       │     ├── EnterOtpComponent (app-enter-otp)
│       │     ├── ChangePasswordComponent (app-change-password)
│       │     └── ForgotPasswordFlowComponent (app-forgot-password-flow)
│       │
│       └── <div class="login-footer">  (copyright + p-select language)
```

## Per-component

### LoginLayoutComponent
- File: `apps/host-shell/src/app/features/auth/login-layout/login-layout.component.ts:9-90`
- Selector: `app-login-layout`
- Standalone: yes
- Imports: `CommonModule`, `RouterOutlet`, `FormsModule`, `SelectModule` (PrimeNG)
- Inputs / Outputs: none
- Services injected: `FALCON_LANGUAGE` token (cast to `HostLanguageFacade`)
- State: `currentLang`, `langDropdownOpen`, hard-coded `languages` array `[{en, label:'English', flag:'🇺🇸', countryCode:'us'}, {ar, label:'العربية', flag:'🇸🇦', countryCode:'sa'}]`.
- Behavior: p-select with image flags from `flagcdn.com/{20x15,40x30}/{countryCode}.png`. On change, calls `hostLanguage.setLanguage(code)` and sets `<html lang dir>` (rtl for ar).
- Template (`login-layout.component.html:1-105`):
  - Full-page background with `assets/images/login-bg-pattern.svg`
  - Left panel: inline SVG Falcon logo (58×46 path), "Hey, Hello!" title, tagline, description
  - Right panel: card with notch + router-outlet + footer (copyright + p-select)

### GetStartedComponent
- File: `apps/host-shell/src/app/features/auth/get-started/get-started.component.ts:21-211`
- Selector: `app-get-started`
- Standalone: yes
- Imports: `CommonModule`, `ReactiveFormsModule`, `ButtonModule`, `InputTextModule`, `TranslatePipe`
- Inputs / Outputs: none
- Services injected: `FormBuilder`, `Router`, `DestroyRef`, `LoginService`, `AuthFlowStateService`, `TranslateService`, `AuthService`
- Form: Reactive `FormGroup({ userName: [Validators.required], password: [Validators.required] })`
- State: `isLoading`, `showPassword`, `loginError` (inline string banner)
- Submit (`onLogin`):
  1. Trim username + lowercase before sending to backend
  2. Call `loginService.login({ userName, password })` (wraps `AuthApiService.login`)
  3. `notShowToaster: 'true'` so HTTP errors are caught here and shown in `loginError` banner (extracted via `extractHttpError()` / `extractBodyError()` helpers — same priority as ResponseInterceptor)
  4. Dispatch by `r.stage`/`r.requiresOtp`/`r.requiresPasswordChange`/`r.tokens` → see ROUTING.md state machine

### EnterOtpComponent
- File: `apps/host-shell/src/app/features/auth/enter-otp/enter-otp.component.ts:22-404`
- Selector: `app-enter-otp`
- Standalone: yes
- Imports: `CommonModule`, `FormsModule`, `InputOtpModule` (PrimeNG), `TranslatePipe`
- Inputs:
  - `inputOtpLength: number | null = null` — overrides AuthFlowState.otpConfig.length
  - `inputOtpSeconds: number | null = null` — overrides AuthFlowState.otpConfig.seconds
  - `inputOtpDestination: string | null = null` — overrides masked phone/email
- Outputs: none
- Services injected: `Router`, `DestroyRef`, `ElementRef`, `OtpService`, `AuthFlowStateService`, `TranslateService`, `AuthService`
- ViewChildren: focuses first input via `el.nativeElement.querySelector('.p-inputotp input, p-inputotp input')`
- State machine: `OtpScreenState.Input | Verifying | Success | Error | Expired`
- Timer: rxjs `interval(1000).pipe(takeUntil(stopTimer$))` — display `MM:SS` for ≥60s, `SS` for <60s
- Auto-submit: tracks `previouslyComplete` boolean; on `incomplete → complete` transition, calls `onVerify()` automatically.
- Resend: calls `otpService.resendOtp({ sessionId })`; on success, updates `otpLength` + `otpSeconds` from server response, restarts timer.
- Destination masking (`formatOtpDestination`): email → first+last char visible, middle stars; phone → midpoint dash.

### ChangePasswordComponent (auth feature, first-login)
- File: `apps/host-shell/src/app/features/auth/change-password/change-password.component.ts:23-262`
- Selector: `app-change-password`
- Standalone: yes
- Imports: `CommonModule`, `ReactiveFormsModule`, `ButtonModule`, `InputTextModule`, `TranslatePipe`
- Inputs / Outputs: none
- Services injected: `FormBuilder`, `Router`, `DestroyRef`, `ChangePasswordService`, `LoginService`, `AuthFlowStateService`, `TranslateService`, `AuthService`
- Mode flag: `isFirstLoginMode = authFlowState.isFirstLogin()`
- Form (first-login mode — `newPassword`, `confirmPassword` enabled from the start):
```typescript
FormGroup({
  newPassword: ['', Validators.required],
  confirmPassword: ['', Validators.required],
}, { validators: this.passwordMatchValidator })
```
- Form (regular mode — `newPassword` + `confirmPassword` start disabled, enabled only after current password verified):
```typescript
FormGroup({
  currentPassword: ['', Validators.required],
  newPassword: [{ value: '', disabled: true }, Validators.required],
  confirmPassword: [{ value: '', disabled: true }, Validators.required],
}, { validators: this.passwordMatchValidator })
```
- Cross-field validator `passwordMatchValidator` returns `{ passwordMismatch: true }` when both fields are non-empty and don't match.
- State: `isSaving`, `isVerifyingCurrent`, `currentPasswordVerified`, `currentPasswordError`, `showCurrentPassword/NewPassword/ConfirmPassword`.
- Submit (first-login): `changePasswordService.firstLoginSetup({ sessionId, newPassword })` → on tokens → `authService.handleLoginSuccess()`.
- Submit (regular — NOT currently used in the first-login flow but path exists): redirect to `/login` for re-auth.

### ForgotPasswordFlowComponent (3-step internal state machine)
- File: `apps/host-shell/src/app/features/auth/forgot-password-flow/forgot-password-flow.component.ts:28-449`
- Selector: `app-forgot-password-flow`
- Standalone: yes
- Imports: `CommonModule`, `ReactiveFormsModule`, `FormsModule`, `ButtonModule`, `InputTextModule`, `InputOtpModule`, `TranslatePipe`, `FalconMobileNumberComponent`
- Inputs / Outputs: none
- Services injected: `FormBuilder`, `Router`, `DestroyRef`, `ElementRef`, `ForgotPasswordFlowService`, `TranslateService`
- Three internal steps via `FlowStep` enum from `@falcon`: `Form | Otp | ResetPassword`
- Forms:
  1. `requestForm`: `{ userName: [required], phoneNumber: [required] }` (FalconMobileNumberComponent provides E.164-formatted value)
  2. (no form for OTP — uses `ngModel` on `otpValue`)
  3. `passwordForm`: `{ newPassword: [required], confirmPassword: [required] }` + `passwordMatchValidator`
- Step 1 submit: `requestOtp({ userName, phoneNumber, deliveryMethod: 2 })` → moves to OTP step on success
- Step 2 submit: identical to `EnterOtpComponent` — timer, auto-submit, resend (calls `requestOtp` again with stored payload)
- Step 3 submit: `setNewPassword({ sessionId, newPassword })` → navigates `/login` on success
- Local error states per step: `formError`, `otpError`, `resetError`.

## Sub-components used
- `<falcon-mobile-number>` (from `@falcon`) — phone-number input in Step 1.
- `<p-button>`, `<p-inputtext>`, `<p-inputotp>` (PrimeNG).
- `<falcon-svg-icon>` (via the layout/topbar — not in auth components directly, but the login-layout uses inline SVG for the Falcon logo).
