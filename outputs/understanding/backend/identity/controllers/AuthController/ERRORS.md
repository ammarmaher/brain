# AuthController — Errors

> Source-of-truth: [CODE] `Domain/Constants/FalconKeys.cs` (`Error` nested static class).
> Every error is raised as `throw new FalconException(FalconKeys.Error.<Code>)` and converted to
> the wire by `Startup/ExceptionHandlers/FalconExceptionHandler.cs` (HTTP status mapping) +
> `ErrorLocalizer.Localize` (en/ar message resolution).
> Frontend receives the **localized message**, not the code. HTTP status carries the protocol
> meaning. See [`FRONTEND_CONTRACT.md`](FRONTEND_CONTRACT.md) for FE-side handling.

## Per-endpoint error catalog

### 1. POST /api/auth/login

| Error Code                  | HTTP | Raised at                                   | Notes |
|---|---|---|---|
| `RequiredFieldMissing`      | 400  | Validator                                   | Empty Username / Password |
| `MaxLengthExceeded`         | 400  | Validator                                   | Username > 100 chars |
| `BelowMinimumLength`        | 400  | Validator                                   | Password < 6 chars (wire-level only — see VALIDATIONS) |
| `IpNotAllowed`              | 403  | `IpAllowlistPreProcessor`                   | BR-UM-24 — checked BEFORE credentials |
| `InvalidCredentials`        | 401  | `LoginProcess.cs:33, 59`                    | User not found OR password fail OR Deleted user (BR-UM-32 silent-deny) |
| `UserLocked`                | 423  | `LoginEligibilityPolicy` AND `LoginProcess.cs:56` | Lock-on-status OR Zitadel reports `IsLocked` after this attempt (BR-UM-25 — also updates Mongo to Locked) |
| `UserSuspended`             | 403  | `LoginEligibilityPolicy`                    | |
| `ExternalServiceError`      | 502  | `LoginProcess.cs:72`                        | Zitadel token exchange failure |

### 2. POST /api/auth/verify-otp

| Error Code             | HTTP | Raised at                                | Notes |
|---|---|---|---|
| `RequiredFieldMissing` | 400  | Validator                                | Empty SessionId / Code |
| `IpNotAllowed`         | 403  | Pre-processor                            | |
| `InvalidCredentials`   | 401  | `VerifyOtpProcess.cs:21, 34`             | Session expired / wrong stage / OTP wrong |
| `UserLocked`           | 423  | `VerifyOtpProcess.cs:30`                 | Zitadel reports `IsLocked` after failed attempts; also flips Mongo to Locked |
| `ExternalServiceError` | 502  | `VerifyOtpProcess.cs:90`                 | Token exchange failure on completion |

### 3. POST /api/auth/resend-otp

| Error Code                | HTTP | Raised at                              | Notes |
|---|---|---|---|
| `RequiredFieldMissing`    | 400  | Validator                              | Empty SessionId |
| `IpNotAllowed`            | 403  | Pre-processor                          | |
| `OtpResendLimitExceeded`  | 429  | `ResendOtpProcess.cs:34`               | **Also calls `identityManager.LockUserAsync` → triggers Zitadel `UserLocked` webhook → Mongo flips to Locked** |
| `OtpStillValid`           | 429  | `ResendOtpProcess.cs:41, 48`           | Current OTP not yet expired (BR-UM-26 — within `ExpirySeconds`) — also returned if Zitadel resend itself fails |

### 4. POST /api/auth/forgot-password

| Error Code                  | HTTP | Raised at                            | Notes |
|---|---|---|---|
| `RequiredFieldMissing`      | 400  | Validator                            | Empty Username / Phone when delivery==Sms/Both |
| `InvalidValue`              | 400  | Validator                            | DeliveryMethod out of enum range |
| `IpNotAllowed`              | 403  | Pre-processor                        | |
| `InvalidUsernameOrPhone`    | 400  | `ForgotPasswordProcess.cs:28, 31`    | **BR-UM-32 silent-deny.** Same error for "user not found" + "phone mismatch" — prevents enumeration |
| `UserPending`               | 422  | `ForgotPasswordProcess.cs:36`        | Pending users use `/first-login`, not forgot-password |
| `UserLocked`                | 423  | `LoginEligibilityPolicy`             | |
| `UserSuspended`             | 403  | `LoginEligibilityPolicy`             | |

### 5. POST /api/auth/forgot-password/set-password

| Error Code                  | HTTP | Raised at                                       | Notes |
|---|---|---|---|
| `RequiredFieldMissing`      | 400  | Validator                                       | Empty SessionId / NewPassword |
| `BelowMinimumLength`        | 400  | Validator                                       | NewPassword < 8 chars (wire) |
| `IpNotAllowed`              | 403  | Pre-processor                                   | |
| `InvalidCredentials`        | 401  | `ForgotPasswordSetPasswordHandler.cs:21`        | Session not in `PasswordResetPending` stage |
| `PasswordTooShort`          | 422  | `PasswordPolicy.Validate`                       | Length < 8 (server policy) |
| `PasswordRequiresUppercase` | 422  | `PasswordPolicy.Validate`                       | |
| `PasswordRequiresLowercase` | 422  | `PasswordPolicy.Validate`                       | |
| `PasswordRequiresDigit`     | 422  | `PasswordPolicy.Validate`                       | |
| `PasswordRequiresSpecialChar` | 422 | `PasswordPolicy.Validate`                       | |

### 6. POST /api/auth/set-password

| Error Code                  | HTTP | Raised at                              | Notes |
|---|---|---|---|
| `RequiredFieldMissing`      | 400  | Validator                              | |
| `BelowMinimumLength`        | 400  | Validator                              | |
| `PasswordsDoNotMatch`       | 400  | Validator AND `SetPasswordHandler.cs:17` | Both layers check |
| `IpNotAllowed`              | 403  | Pre-processor                          | |
| `UserNotFound`              | 404  | `SetPasswordHandler.cs:23`             | session.UserId points to soft-deleted/missing user |
| Password-policy family      | 422  | (note: this endpoint does **not** invoke `PasswordPolicy` — see OVERVIEW finding) | ⚠ Server-side password policy bypass — only minlength 8 in validator. |

### 7. POST /api/auth/first-login

| Error Code                  | HTTP | Raised at                                 | Notes |
|---|---|---|---|
| `RequiredFieldMissing`      | 400  | Validator                                 | |
| `BelowMinimumLength`        | 400  | Validator                                 | |
| `IpNotAllowed`              | 403  | Pre-processor                             | |
| `PasswordTooShort` + family | 422  | `PasswordPolicy.Validate`                 | |
| `ChangePasswordFailed`      | 422  | `FirstLoginSetupProcess.cs:31`            | Zitadel rejected password set (history / reuse / etc.) |
| `ExternalServiceError`      | 502  | `FirstLoginSetupProcess.cs:44`            | Token exchange failure |

### 8. POST /api/auth/logout

| Error Code | HTTP | Notes |
|---|---|---|
| `RequiredFieldMissing` | 400 | Empty RefreshToken |

No 5xx — all Zitadel exceptions swallowed inside handler ([CODE] `LogoutHandler.cs:17-22`).

### 9. POST /api/auth/refresh-token

| Error Code              | HTTP | Raised at                          | Notes |
|---|---|---|---|
| `RequiredFieldMissing`  | 400  | Validator                          | |
| `InvalidRefreshToken`   | 401  | `RefreshTokenHandler.cs:17`        | Catch-all for any Zitadel refresh failure |

## Silent-deny + generic-alert policy (BR-UM-32, BR-UM-33)

BR-UM-32 — "Forgot password must not leak account existence":
- Implemented at [CODE] `ForgotPasswordProcess.cs:28, 31` — same `InvalidUsernameOrPhone` error
  for both "user not found" and "phone mismatch".

BR-UM-33 — "Generic alert on forgot-password to deter brute-force":
- This is a frontend-side concern. The BE returns one of: `InvalidUsernameOrPhone`, `UserPending`,
  `UserLocked`, `UserSuspended`, **or success**. FE is expected to show a single neutral message
  ("If the account exists, a code has been sent") regardless of which one — but the BE *does* leak
  `UserPending` / `UserLocked` / `UserSuspended` via HTTP status:
  - 403 vs 422 vs 423 give the brute-forcer signal about account state.
  - **Open finding:** if BR-UM-33 requires *zero* enumeration, those endpoint-level distinctions
    should be flattened to a single status code on the FE side OR the BE should return uniform
    `InvalidUsernameOrPhone` for all four. Today, BE leaks state — FE must mask.

## BR-UM-25 + BR-UM-27 — Lockout split (Zitadel + Identity webhook)

| Trigger                                  | Lock source          | Mongo update path                                      |
|---|---|---|
| Password attempts exceed Zitadel limit   | Zitadel `IsLocked=true` on next login | `LoginProcess.cs:53` calls `userRepository.UpdateStatusAsync(Locked)` directly + invalidates cache |
| OTP attempts exceed Zitadel limit        | Zitadel `IsLocked=true` on verify-otp | `VerifyOtpProcess.LockUserAsync` updates Mongo directly + invalidates cache ([CODE] `VerifyOtpProcess.cs:113-120`) |
| OTP resend attempts exceed local cap     | Identity locks user in Zitadel        | `ResendOtpProcess.LockUserAsync` calls `identityManager.LockUserAsync` → Zitadel raises `LockUser` event → `ZitadelWebhookEndpoint` flips Mongo |
| Admin manually changes status to Locked  | Identity changes Zitadel status       | `ChangeUserStatusProcess.cs:35-36` → `identityManager.LockUserAsync` → webhook |

The "split" the PRD references: when the failure source is Zitadel, Mongo can't trust the webhook
to fire (Zitadel doesn't fire webhooks for "rejected from session due to lock"; only for explicit
gRPC `LockUser` calls). So the auth flows do **eager Mongo writes** + cache invalidation in the
handler. Webhook flow handles the inverse (admin-initiated in Zitadel direct → Mongo via webhook).

[CODE] `Endpoints/Webhooks/ZitadelWebhookEndpoint.cs:104-114` (UserLocked / UserUnlocked).

## HTTP status mapping reference (from Identity `FalconExceptionHandler`)

| Status | Codes |
|---|---|
| 400 | Validation, `InvalidUsernameOrPhone`, `PasswordsDoNotMatch`, `InvalidRefreshToken`, generic fallback |
| 401 | `InvalidCredentials` |
| 403 | `IpNotAllowed`, `UserSuspended`, `Forbidden`, `Unauthorized` (legacy) |
| 404 | `UserNotFound` |
| 422 | `UserPending`, `PasswordTooShort` + family, `ChangePasswordFailed` |
| 423 | `UserLocked` |
| 429 | `OtpStillValid`, `OtpResendLimitExceeded` |
| 502 | `ExternalServiceError`, `ExternalServiceConnectionError`, `ExternalServiceTimeout` |

(Verify exact mappings against [CODE] `Startup/ExceptionHandlers/FalconExceptionHandler.cs`.)
