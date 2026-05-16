# Validations — host-shell core

## Form validators (sync)

### ChangePasswordModalComponent (layout dropdown — `change-password-modal.component.ts`)
Template-driven `[(ngModel)]` form, no FormBuilder. Sync rules implemented via getters:

| Field | Validation | Where | Message |
|---|---|---|---|
| `currentPassword` | required (string non-empty after trim) | `isSaveDisabled` getter line 96-104 | none (button disabled) |
| `newPassword` | required (string non-empty after trim) | `isSaveDisabled` getter | none |
| `confirmPassword` | required AND `=== newPassword` | `isSaveDisabled` + `showPasswordMismatch` getter (line 86-93) | "Passwords don't match" rendered inline when `confirmTouched && confirmPassword.length > 0 && newPassword !== confirmPassword` |

No regex pattern validators; backend handles strength validation (`identity/user/change-password` returns validation errors via `ServiceOperationResult.errors[]`).

## Async validators
None at the host-core level. (The `FalconCheckExistsDirective` async validator is used inside the Add-User Wizard step — see `user-profile/` feature dataset.)

## Business rules captured in code

### Token expiry buffer (proactive refresh)
- File: `request-interceptor.ts:19-22`
- Rule: Token is treated as expired if `expiryDate.getTime() <= Date.now() + 30_000` (30-second buffer).
- Justification (inline comment): "The 30-second buffer triggers a proactive refresh before the token actually expires, preventing mid-flight expiration on slow requests."

### Auth endpoint skip-list
- File: `request-interceptor.ts:36-40` and `response-interceptor.ts:100-106`
- Rule: URLs containing `/auth/` or starting with `auth/` are skipped by both interceptors' token-refresh logic.
- Justification: "Skip ALL auth endpoints: a 401 from auth/login means wrong credentials, NOT an expired token."

### Retry guard on 401
- File: `response-interceptor.ts:108-112`, `request-interceptor.ts:48-51`, `auth.service.ts:251-253`
- Rule: Requests retried after refresh are tagged with `X-Token-Retried: 'true'`. If that retried request still gets 401 → `authService.logout()` (no second refresh attempt).
- Prevents infinite refresh loops.

### Session timeout auto-logout
- File: `auth.service.ts:159-179`
- Rule: After login or refresh, `scheduleSessionTimeout()` reads JWT `exp` and runs `setTimeout(() => logout(), expDate - now)` **outside Angular zone** to avoid pointless change-detection ticks.

### Refresh-token coordination
- File: `auth.service.ts:212-275`
- Rule: Only one refresh request in flight. Concurrent 401-triggered requests queue on a `BehaviorSubject<string | null>` and replay with the new token once available.

### Dynamic gateway selection (`useGateway()` fallback)
- File: `app.config.ts:71-81` + `@falcon/RuntimeBaseUrlInterceptor`
- Rule: When `APP_DEFAULT_GATEWAY` is not provided (host-shell intentionally does not provide it), the interceptor falls back to `SessionProvider.session?.userType`:
  - userType === '2' (Client) → Core Gateway
  - else (Falcon) → System Gateway
- Override per-call via `useGateway(Gateway.IdentityGateway | Gateway.CoreGateway | …)` HTTP context.
