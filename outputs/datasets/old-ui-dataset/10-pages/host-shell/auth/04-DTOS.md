# DTOs — auth feature

## Screen-level Request DTOs

### LoginRequest (`get-started/models/login.models.ts:6-9`)
```typescript
interface LoginRequest {
  userName: string;   // form-control name; mapped to backend "username" in LoginService
  password: string;
}
```
- Used by: `LoginService.login()`
- Note: also re-imported by `ChangePasswordComponent.onVerifyCurrentPassword` (line 142-146) for "verify current password by attempting login".

### CheckOtpRequest (`enter-otp/models/otp.models.ts:5-8`)
```typescript
interface CheckOtpRequest {
  sessionId: string;
  otp: string;        // screen-level alias; mapped to backend "code" in OtpService
}
```

### ResendOtpRequest (screen — `enter-otp/models/otp.models.ts:13-15`)
```typescript
interface ResendOtpRequest {
  sessionId: string;
}
```

### ChangePasswordRequest (screen — `change-password/models/change-password.models.ts:4-9`)
```typescript
interface ChangePasswordRequest {
  userName: string;
  password: string;        // current (old) password
  newPassword: string;
  confirmPassword: string;
}
```
- NOTE: this is the regular-flow shape. The actual backend call in first-login mode uses `FirstLoginSetupRequest` (sessionId + newPassword only).

### ForgotPasswordRequestPayload (`forgot-password-flow/models/forgot-password-flow.models.ts:3-7`)
```typescript
interface ForgotPasswordRequestPayload {
  userName: string;
  phoneNumber: string;     // E.164 format, e.g. '+966512345678'
  deliveryMethod: number;  // 1=Email, 2=SMS, 3=Both
}
```

### ForgotPasswordVerifyOtpPayload (`forgot-password-flow/models/forgot-password-flow.models.ts:10-13`)
```typescript
interface ForgotPasswordVerifyOtpPayload {
  sessionId: string;
  otp: string;
}
```

### ForgotPasswordSetPasswordPayload (`forgot-password-flow/models/forgot-password-flow.models.ts:16-19`)
```typescript
interface ForgotPasswordSetPasswordPayload {
  sessionId: string;
  newPassword: string;
}
```

## Re-exports (from `core/auth/auth.models.ts`)
- `LoginRequest` (backend shape, `{username, password}`) — re-imported in `get-started/models/login.models.ts:11` as `LoginResponse = LoginStepResult`.
- `LoginStepResult` re-exported as `CheckOtpResponse` and `ResendOtpResponse` in `enter-otp/models/otp.models.ts:17-18`.
- `FirstLoginSetupRequest`, `SetPasswordRequest`, `LoginStepResult` re-exported in `change-password/models/change-password.models.ts:11-13`.

## Internal state DTOs (`auth-flow-state.service.ts`)

### LoginDTO (line 3-6)
```typescript
interface LoginDTO {
  userName: string;
  password: string;
}
```

### OtpConfig (line 8-13)
```typescript
interface OtpConfig {
  seconds: number;
  length: number;
}
```

### AuthFlowState (line 18-23)
```typescript
interface AuthFlowState {
  credentials: LoginDTO | null;
  sessionId: string | null;
  otpConfig: OtpConfig;
  firstLogin: boolean;
}
```
- Default: `{ credentials: null, sessionId: null, otpConfig: { seconds: 120, length: 6 }, firstLogin: false }`.
- Persisted to `sessionStorage['falcon_auth_flow']`.

## Component-internal interfaces

### LoginLayoutComponent.languages (`login-layout.component.ts:27-30`)
Hardcoded:
```typescript
languages = [
  { code: 'en', label: 'English', flag: '🇺🇸', countryCode: 'us' },
  { code: 'ar', label: 'العربية', flag: '🇸🇦', countryCode: 'sa' },
];
```
No interface declared; structural typing from PrimeNG p-select.
