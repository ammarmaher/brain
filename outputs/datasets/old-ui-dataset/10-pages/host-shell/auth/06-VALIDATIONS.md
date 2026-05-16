# Validations — auth feature

## Form validators (sync)

### GetStartedComponent — login form
| Form | Field | Validator | Message key |
|---|---|---|---|
| login | `userName` | `Validators.required` | (no inline message — `hasError()` only enables visual state) |
| login | `password` | `Validators.required` | (no inline message) |

Defined: `get-started.component.ts:44-47`.

### EnterOtpComponent — OTP input
- Not a Reactive form; uses `ngModel` on `otpValue` string.
- Validity:
  - `isOtpComplete` getter (`enter-otp.component.ts:211-213`) — `value.length === otpLength` (default 6).
- Verify trigger:
  - Auto-submit on `incomplete → complete` transition.
  - Manual: Enter key press (when `isOtpComplete && otpDirtySinceLastVerify`).
- Inline server error rendered when `screenState === OtpScreenState.Error`.

### ChangePasswordComponent (first-login mode)
| Form | Field | Validator | Message key |
|---|---|---|---|
| password (first-login) | `newPassword` | `Validators.required` | — |
| password (first-login) | `confirmPassword` | `Validators.required` | — |
| password (first-login) | (group) | `passwordMatchValidator` → `{ passwordMismatch: true }` | template-bound `showPasswordMismatch` getter |

### ChangePasswordComponent (regular mode — currently used only for "verify current password")
| Form | Field | Validator | Message key |
|---|---|---|---|
| password (regular) | `currentPassword` | `Validators.required` | — |
| password (regular) | `newPassword` | `Validators.required` (initially disabled) | — |
| password (regular) | `confirmPassword` | `Validators.required` (initially disabled) | — |
| password (regular) | (group) | `passwordMatchValidator` | — |

Cross-field validator (`change-password.component.ts:82-89`):
```typescript
private passwordMatchValidator(group: AbstractControl): ValidationErrors | null {
  const newPw = group.get('newPassword')?.value;
  const confirmPw = group.get('confirmPassword')?.value;
  if (!newPw || !confirmPw) return null;
  return newPw === confirmPw ? null : { passwordMismatch: true };
}
```
- Same validator used in `ForgotPasswordFlowComponent.passwordForm` (`forgot-password-flow.component.ts:358-365`).

### ForgotPasswordFlowComponent — step 1 (requestForm)
| Form | Field | Validator | Message key |
|---|---|---|---|
| request | `userName` | `Validators.required` | — |
| request | `phoneNumber` | `Validators.required` (FalconMobileNumberComponent enforces E.164 internally) | — |

### ForgotPasswordFlowComponent — step 3 (passwordForm)
Same shape and validators as `ChangePasswordComponent` (first-login mode):
- `newPassword: ['', required]`
- `confirmPassword: ['', required]`
- `passwordMatchValidator` group validator.

## Async validators
None at the auth-feature level.

## Business rules captured in code

### GetStartedComponent.onLogin (`get-started.component.ts:70-137`)
- Username transform: `.trim().toLowerCase()` before sending to backend.
- Inline error display: HTTP errors bypass toast (via `notShowToaster: 'true'` header). Error extraction follows the same priority as `ResponseInterceptor`:
  1. `body.ErrorMessages ?? errorMessages ?? Errors ?? errors` → joined with `. `
  2. `body.Message ?? message ?? Error ?? error`
  3. Plain string body
  4. Fallback i18n key `'login.getStarted.errors.invalidCredentials'`

### EnterOtpComponent.onVerify (`enter-otp.component.ts:292-358`)
- Guards: `!isOtpComplete || screenState === Verifying || Success` → no-op.
- Marks `otpDirtySinceLastVerify = false` before call to prevent re-trigger.
- `resetOtpForRetry` (`enter-otp.component.ts:265-278`) destroys and recreates the p-inputOtp via `showOtpInput = false → true` to guarantee PrimeNG state cleanup; then focuses the first input.

### Timer behavior
- Default expiry: 120 s, default length: 6 (from `AuthFlowStateService` defaults).
- API overrides via `otpExpiresInSeconds` and `otpCodeLength` in `LoginStepResult`.
- Display:
  - >=60s → `MM:SS` (`01:45`)
  - <60s → `SS` (`46`)

### ChangePasswordComponent guards
- `isSaveDisabled` (`change-password.component.ts:114-131`):
  - First-login mode: `newPassword.invalid OR confirmPassword.invalid OR passwordMismatch OR isSaving`.
  - Regular mode: ALL ABOVE + `!currentPasswordVerified`.
- Reset on current-password change (`onCurrentPasswordInput`, `change-password.component.ts:177-186`):
  - Resets `currentPasswordVerified = false`, disables + clears `newPassword` and `confirmPassword`.

### ForgotPasswordFlowComponent
- Always sends `deliveryMethod: 2` (SMS) in step-1 payload. Email/Both not exposed in UI.
- After successful OTP verify: `setTimeout(1500)` before transitioning to `FlowStep.ResetPassword` for animation.
- After successful set-password (`isSuccessful && result === true`): navigate `/login`. On failure: inline `resetError` (no toast).
- Resend in step 2 reuses the stored `lastRequestPayload` (the original step-1 form) — backend treats this as a fresh forgot-password request and returns a new sessionId.

### Email + phone format (UserProfileComponent regex — referenced for cross-cutting context)
The email regex `/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/` and phone `digits.length >= 7` validation live in `UserProfileComponent` for the email/phone-OTP verify flow. Auth screens don't validate these formats locally — they rely on the backend.
