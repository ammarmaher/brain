# AuthController — Endpoints

> Route prefix `/api/auth/`. All endpoints `AllowAnonymous` + throttled + return `ServiceOperationResult<T>`.
> "Tenant resolution" column refers to the `IpAllowlistPreProcessor` strategy declared on the request DTO
> via `IIpAllowlistProtected` (see [`OVERVIEW.md`](OVERVIEW.md) for the tenant-resolution table).

## Endpoint table

| # | Method | Route                              | Endpoint class                            | Request DTO                          | Response (T in SOR)        | Throttle | IP guard | Tenant resolution | PES key |
|---|--------|------------------------------------|-------------------------------------------|--------------------------------------|----------------------------|----------|----------|-------------------|---------|
| 1 | POST   | `/api/auth/login`                  | `LoginEndpoint`                           | `LoginRequest`                       | `LoginStepResponse`        | 10/60s   | ✅       | ByUsername        | (anon)  |
| 2 | POST   | `/api/auth/verify-otp`             | `VerifyOtpEndpoint`                       | `VerifyOtpRequest`                   | `LoginStepResponse`        | 10/60s   | ✅       | BySessionId       | (anon)  |
| 3 | POST   | `/api/auth/resend-otp`             | `ResendOtpEndpoint`                       | `ResendOtpRequest`                   | `LoginStepResponse`        | 5/60s    | ✅       | BySessionId       | (anon)  |
| 4 | POST   | `/api/auth/forgot-password`        | `ForgotPasswordEndpoint`                  | `ForgotPasswordRequest`              | `LoginStepResponse`        | 5/60s    | ✅       | ByUsername        | (anon)  |
| 5 | POST   | `/api/auth/forgot-password/set-password` | `ForgotPasswordSetPasswordEndpoint` | `ForgotPasswordSetPasswordRequest`   | `bool`                     | 5/60s    | ✅       | BySessionId       | (anon)  |
| 6 | POST   | `/api/auth/set-password`           | `SetPasswordEndpoint`                     | `SetPasswordRequest`                 | `bool`                     | 5/60s    | ✅       | BySessionId       | (anon)  |
| 7 | POST   | `/api/auth/first-login`            | `FirstLoginSetupEndpoint`                 | `FirstLoginSetupRequest`             | `LoginStepResponse`        | 5/60s    | ✅       | BySessionId       | (anon)  |
| 8 | POST   | `/api/auth/logout`                 | `LogoutEndpoint`                          | `LogoutRequest`                      | `object` (always `null`)   | 10/60s   | ❌       | —                 | (anon)  |
| 9 | POST   | `/api/auth/refresh-token`          | `RefreshTokenEndpoint`                    | `RefreshTokenRequest`                | `AuthenticatedResult`      | 20/60s   | ❌       | —                 | (anon)  |

[CODE] `Endpoints/Auth/LoginEndpoint.cs` through `RefreshTokenEndpoint.cs`

## Stage-transition matrix

| Endpoint            | Required session stage IN | Resulting stage OUT (success)              | Side effects (success)                         |
|---|---|---|---|
| `login`             | (none — creates session)  | `OtpPending` ∨ `PasswordChangeRequired` ∨ `Authenticated` | Zitadel session created; SMS OTP sent; cache write |
| `verify-otp`        | `OtpPending`              | `PasswordChangeRequired` ∨ `PasswordResetPending` ∨ `Authenticated` | `IsPhoneVerified=true` if otpSms |
| `resend-otp`        | `OtpPending`              | `OtpPending` (same)                        | new OTP sent; `ResendAttempts++`; `OtpGeneratedAt=now` |
| `forgot-password`   | (none — creates session)  | `OtpPending` (FlowType=`ForgotPassword`)   | Zitadel session created; SMS OTP sent |
| `forgot-password/set-password` | `PasswordResetPending` | (session destroyed)                | Password set in Zitadel; session removed |
| `set-password`      | any cached session        | (no transition)                             | ⚠ See OVERVIEW finding #1 |
| `first-login`       | `PasswordChangeRequired`  | `Authenticated`                             | User status → Active; tokens issued; session removed |
| `logout`            | (none — uses refresh token) | —                                         | Refresh token revoked at Zitadel |
| `refresh-token`     | (none)                    | —                                          | New token set issued |

[CODE] `Application/Auth/UseCases/VerifyOtpProcess.cs:49-62` (stage switch),
[CODE] `LoginProcess.cs:62-87` (single-step Authenticated short-circuit when `OtpRequiredOnLogin=false` AND not Pending),
[CODE] `FirstLoginSetupProcess.cs:33-37` (Active status flip on first-login).

## Status-code mapping per endpoint

| Endpoint | 200 OK | 400 BadRequest | 401 Unauthorized | 403 Forbidden | 409 Conflict | 422 Unprocessable | 423 Locked | 429 Too Many | 500 Internal |
|---|---|---|---|---|---|---|---|---|---|
| login                              | ✓ | ValidationFailure | `InvalidCredentials` | `IpNotAllowed`, `UserSuspended` | — | `UserPending` (in places) | `UserLocked` | throttle | Zitadel down |
| verify-otp                         | ✓ | `InvalidCredentials` (bad stage) | `InvalidCredentials` | `IpNotAllowed` | — | — | `UserLocked` | throttle | — |
| resend-otp                         | ✓ | — | — | `IpNotAllowed` | — | `OtpStillValid` (within `ExpirySeconds`), `OtpResendLimitExceeded` (locks user) | — | throttle | — |
| forgot-password                    | ✓ | `InvalidUsernameOrPhone` (silent-deny per BR-UM-32; see ERRORS.md) | — | `IpNotAllowed`, `UserSuspended` | — | `UserPending` | `UserLocked` | throttle | — |
| forgot-password/set-password       | ✓ | `InvalidCredentials` (bad stage) | — | `IpNotAllowed` | — | password policy errors | — | throttle | — |
| set-password                       | ✓ | `PasswordsDoNotMatch`, `UserNotFound` | — | `IpNotAllowed` | — | password policy | — | throttle | — |
| first-login                        | ✓ | `ChangePasswordFailed` | — | `IpNotAllowed` | — | password policy | — | throttle | external errors |
| logout                             | ✓ | — | — | — | — | — | — | throttle | — (errors swallowed) |
| refresh-token                      | ✓ | `InvalidRefreshToken` | — | — | — | — | — | throttle | — |

(See [`ERRORS.md`](ERRORS.md) for the canonical error-code → HTTP mapping.)

## Per-endpoint method-level docs

### 1. POST /api/auth/login
[CODE] `Endpoints/Auth/LoginEndpoint.cs:12-28`  →  [CODE] `Application/Auth/UseCases/LoginProcess.cs:29-133`

Steps:
1. Repository lookup by username (`IUserRepository.GetByUsernameAsync(command.Username)`).
   `null` → `InvalidCredentials` (silent-deny — no enumeration leak).
2. `LoginEligibilityPolicy.Validate(user.Status)` — throws on Locked / Suspended / Deleted.
3. Create Zitadel auth request + session (`identityManager.CreateAuthRequestAsync`, `CreateSessionAsync`).
4. Decide if OTP required:
   - `isFirstLogin = user.Status == Pending` → OTP forced.
   - `OtpRequiredOnLogin` from config — global toggle for non-first-login flows.
5. Call `LoginWithPasswordAndOtpChallengeAsync` or `LoginWithPasswordOnlyAsync` depending on (4).
6. On failure:
   - `IsLocked` (Zitadel reports "user locked due to attempts") → `UpdateStatusAsync(user.Id, Locked)`
     + invalidate user-status cache + throw `UserLocked` (BR-UM-25 split: Zitadel attempts → Identity DB).
   - Otherwise throw `InvalidCredentials`.
7. Compute `requiresPasswordChange = passwordResult.RequiresPasswordChange || user.Status == Pending`.
8. `AuthenticationStagePolicy.Resolve(requiresOtp, requiresPasswordChange)` → next stage.
9. If `Stage == Authenticated` → exchange tokens immediately and return tokens (no cached session).
10. Otherwise: build `AuthenticationSession`, save to HybridCache, publish `SmsCodeGeneratedDomainEvent`
    (if SMS OTP), return `LoginStepResponse` with `SessionId`/`OtpCodeLength`/`OtpExpiresInSeconds`.

### 2. POST /api/auth/verify-otp
[CODE] `Endpoints/Auth/VerifyOtpEndpoint.cs:12-28`  →  [CODE] `Application/Auth/UseCases/VerifyOtpProcess.cs:16-46`

Steps:
1. `sessionCache.GetRequiredAsync(command.SessionId)` — 404 if expired.
2. Validate `session.Stage == OtpPending` — else `InvalidCredentials`.
3. `identityManager.VerifyOtpAsync(externalSessionId, externalSessionToken, code, requiredOtpType)`.
4. On Zitadel-reported lock → update local user status + invalidate cache + throw `UserLocked`.
5. On failure → `InvalidCredentials`.
6. If `RequiredOtpType is null or "otpSms"` → `IsPhoneVerified=true` (handles cases where phone was
   set during login flow).
7. Resolve next stage via the `(FlowType, RequiresPasswordChange)` switch (see OVERVIEW state machine):
   - `(ForgotPassword, *)` → advance to `PasswordResetPending`
   - `(Login, true)`       → advance to `PasswordChangeRequired`
   - `(Login, false)`      → `CompleteAuthenticationAsync` → exchange tokens, destroy session.

### 3. POST /api/auth/resend-otp
[CODE] `Endpoints/Auth/ResendOtpEndpoint.cs:12-29`  →  [CODE] `Application/Auth/UseCases/ResendOtpProcess.cs:24-73`

1. Load session.
2. **Cap check** (BR-UM-26+27 hybrid): if `session.ResendAttempts >= SecurityOptions.MaxResendAttempts`
   → lock user in Zitadel + throw `OtpResendLimitExceeded`.
3. **Validity check** (BR-UM-26): if `now < OtpGeneratedAt + ExpirySeconds` → throw `OtpStillValid`.
4. `identityManager.ResendOtpAsync(...)`.
5. Increment `ResendAttempts`, update `OtpGeneratedAt`, save session.
6. Publish `SmsCodeGeneratedDomainEvent`.
7. Return updated `LoginStepResponse` with fresh OTP metadata.

### 4. POST /api/auth/forgot-password
[CODE] `Endpoints/Auth/ForgotPasswordEndpoint.cs:12-29`  →  [CODE] `Application/Auth/UseCases/ForgotPasswordProcess.cs:24-77`

1. Repository lookup `Username == X AND !IsDeleted`. `null` → `InvalidUsernameOrPhone`
   (BR-UM-32 — generic error to prevent username enumeration).
2. Strict-equal phone check (`StringComparison.OrdinalIgnoreCase` — implementation note: phone
   comparison is case-insensitive, harmless for numerics but unusual): mismatch → same generic error.
3. `LoginEligibilityPolicy.Validate(user.Status)` — explicit `UserPending` error after.
4. Create Zitadel auth request + session.
5. Issue OTP via `ResendOtpAsync` (Zitadel's own OTP machinery).
6. Build session with `Stage=OtpPending` and `FlowType=ForgotPassword`.
7. Publish `SmsCodeGeneratedDomainEvent`.

### 5. POST /api/auth/forgot-password/set-password
[CODE] `Endpoints/Auth/ForgotPasswordSetPasswordEndpoint.cs:12-28`  →  [CODE] `Application/Auth/UseCases/ForgotPasswordSetPasswordHandler.cs:16-31`

1. Load session.
2. Validate `Stage == PasswordResetPending`.
3. Look up `TenantSettings` to fetch tenant `PasswordSecurityLevel`.
4. `PasswordPolicy.Validate(NewPassword, settings?.PasswordSecurityLevel)`.
5. `identityManager.SetPasswordAsync(IdentityUserId, NewPassword)`.
6. Destroy session.

### 6. POST /api/auth/set-password
[CODE] `Endpoints/Auth/SetPasswordEndpoint.cs:12-29`  →  [CODE] `Application/Auth/UseCases/SetPasswordHandler.cs:14-29`

Commerce-contract parity endpoint. Same shape as `forgot-password/set-password` but:
- Validates `NewPassword == ConfirmPassword` server-side (in addition to client validator).
- Looks up user from session.
- **Does not** assert `Stage == PasswordResetPending` — see OVERVIEW finding #1.

### 7. POST /api/auth/first-login
[CODE] `Endpoints/Auth/FirstLoginSetupEndpoint.cs:12-28`  →  [CODE] `Application/Auth/UseCases/FirstLoginSetupProcess.cs:19-59`

BR-UM-22 — completes the first-login flow:
1. Load session.
2. Load `TenantSettings` for password level.
3. `PasswordPolicy.Validate(NewPassword, level)`.
4. `identityManager.SetupFirstLoginPasswordAsync(...)` — atomic password set + session re-issue inside Zitadel.
5. Rotate session token (`session.ExternalSessionToken = result.NewExternalSessionToken!`).
6. **Set user status → `Active`** (Pending → Active).
7. Exchange session for OIDC tokens.
8. Destroy session, return `Authenticated` with tokens.

### 8. POST /api/auth/logout
[CODE] `Endpoints/Auth/LogoutEndpoint.cs:11-27`  →  [CODE] `Application/Auth/UseCases/LogoutHandler.cs:8-25`

- Calls `identityManager.RevokeTokenAsync(refreshToken, "refresh_token")`.
- Catches & logs all exceptions (returns success regardless). See OVERVIEW finding #3.

### 9. POST /api/auth/refresh-token
[CODE] `Endpoints/Auth/RefreshTokenEndpoint.cs:11-27`  →  [CODE] `Application/Auth/UseCases/RefreshTokenHandler.cs:9-27`

- Single Zitadel call; failures throw `InvalidRefreshToken`.

## Endpoint count by verb

| Verb | Count |
|---|---:|
| POST | 9 |
| **Total** | **9** |

All endpoints are POST — no GET / PUT / DELETE / PATCH in the AuthController surface.
