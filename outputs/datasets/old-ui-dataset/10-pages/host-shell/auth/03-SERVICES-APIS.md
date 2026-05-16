# Services & APIs — auth feature

## Services
| Service | File | Singleton? | Purpose |
|---|---|---|---|
| `LoginService` | `features/auth/get-started/services/login.service.ts` | `providedIn: 'root'` | Screen wrapper that trims+lowercases username before calling AuthApiService |
| `OtpService` | `features/auth/enter-otp/services/otp.service.ts` | `providedIn: 'root'` | Maps screen `{sessionId, otp}` → backend `{sessionId, code}` |
| `ChangePasswordService` (auth feature, first-login) | `features/auth/change-password/services/change-password.service.ts` | `providedIn: 'root'` | Wraps first-login + set-password |
| `ForgotPasswordFlowService` | `features/auth/forgot-password-flow/services/forgot-password-flow.service.ts` | `providedIn: 'root'` | Wraps forgot-password + verify-otp + forgot-set-password |
| `AuthFlowStateService` | `features/auth/services/auth-flow-state.service.ts` | `providedIn: 'root'` | sessionStorage-backed transient state |

## HTTP endpoints called (all go through `AuthApiService` → Identity Gateway)

| Method | URL pattern | Service.Method | Backend method called | Source file:line |
|---|---|---|---|---|
| POST | `auth/login` | `LoginService.login(payload)` | `AuthApiService.login({username, password})` | `login.service.ts:16-23` |
| POST | `auth/verify-otp` | `OtpService.checkOtp(payload)` | `AuthApiService.verifyOtp({sessionId, code})` | `otp.service.ts:16-23` |
| POST | `auth/resend-otp` | `OtpService.resendOtp(payload)` | `AuthApiService.resendOtp({sessionId})` | `otp.service.ts:28-34` |
| POST | `auth/forgot-password` | `ForgotPasswordFlowService.requestOtp(payload)` | `AuthApiService.forgotPassword({username, phoneNumber, deliveryMethod})` | `forgot-password-flow.service.ts:20-28` |
| POST | `auth/verify-otp` | `ForgotPasswordFlowService.verifyOtp(payload)` | `AuthApiService.verifyOtp({sessionId, code})` | `forgot-password-flow.service.ts:34-41` |
| POST | `auth/forgot-password/set-password` | `ForgotPasswordFlowService.setNewPassword(payload)` | `AuthApiService.forgotPasswordSetPassword({sessionId, newPassword})` | `forgot-password-flow.service.ts:47-54` |
| POST | `auth/first-login` | `ChangePasswordService.firstLoginSetup(payload)` | `AuthApiService.firstLogin({sessionId, newPassword})` | `change-password.service.ts:14-22` |
| POST | `auth/set-password` | `ChangePasswordService.setPassword(payload)` | `AuthApiService.setPassword(payload)` | `change-password.service.ts:28-32` |

### LoginService.login (transform)
```typescript
return this.authApi.login({
  username: (payload.userName ?? '').trim().toLowerCase(),
  password: payload.password,
});
```

### OtpService.checkOtp (transform — `otp` → `code`)
```typescript
return this.authApi.verifyOtp({
  sessionId: payload.sessionId,
  code: payload.otp,
});
```

### ForgotPasswordFlowService.requestOtp (transform — lowercase username)
```typescript
return this.authApi.forgotPassword({
  username: (payload.userName ?? '').trim().toLowerCase(),
  phoneNumber: payload.phoneNumber,
  deliveryMethod: payload.deliveryMethod,
});
```

## AuthFlowStateService (storage operations)

Storage key: `'falcon_auth_flow'` in `sessionStorage`.

| Operation | Caller | Effect |
|---|---|---|
| `setTempSession({credentials, sessionId, otpConfig})` | `GetStartedComponent.onLogin()` | Persist credentials + sessionId + OTP config; reset `firstLogin = false` |
| `setFirstLogin(true)` | `GetStartedComponent.onLogin()` when password change required; `EnterOtpComponent.onVerify()` when password change required after OTP | Set the `firstLogin` flag |
| `getCredentials()` | `EnterOtpComponent.ngOnInit` (for destination masking); `ChangePasswordComponent.onVerifyCurrentPassword()` | Retrieve persisted login DTO |
| `getSessionId()` | otpGuard, changePasswordGuard, all submit methods | Retrieve sessionId |
| `getOtpConfig()` | `EnterOtpComponent.ngOnInit` | Retrieve `{length, seconds}` |
| `isFirstLogin()` | `ChangePasswordComponent` constructor | Decide form mode |
| `clear()` | `AuthService.logout()`, `EnterOtpComponent.onBackToLogin()`, `ChangePasswordComponent.cancelEdit()` / `onBackToLogin()` | Remove the state key |

## Final-step handoff
- On final success (tokens received), the screen calls `AuthService.handleLoginSuccess(tokens)` (`auth.service.ts:107-137`) which:
  1. Stores `accessToken` + `refreshToken` in sessionStorage via `TokenStorageService.setTokens()`.
  2. Sets `_isAuthenticated.set(true)`.
  3. Extracts session via `sessionProvider.setFromToken(accessToken)`.
  4. Calls `authFacad.emmitSubjects()` to notify other MFEs.
  5. Calls `authFlowState.clear()` to remove `'falcon_auth_flow'`.
  6. Schedules auto-logout via `scheduleSessionTimeout()`.
  7. Fetches the user's org node asynchronously (`queueMicrotask(fetchOrganizationNode)` — non-blocking).
  8. Reads `'auth_redirect'` from sessionStorage (base64) and navigates there or to `/`.

## Backend service mapping
- `auth/...` → Identity Service (via Identity Gateway, base `https://auth.falconhub.space/api/` in prod, `http://localhost:7777/api/` in dev).
- `[CODE]` Gateway selection is hard-pinned via `useGateway(Gateway.IdentityGateway)` in `AuthApiService` constructor (`auth-api.service.ts:27`).
