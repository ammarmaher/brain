# AuthController — DTOs

> Source: `Application/Auth/Models/`. All DTOs are `sealed record` (immutable) except
> `LoginStepResponse` and `AuthenticatedResult` which are mutable classes (instantiated
> piecewise inside handlers).

## Request DTOs

### `LoginRequest` — POST /api/auth/login
[CODE] `Application/Auth/Models/LoginRequest.cs:8-12`

```csharp
public sealed record LoginRequest(string Username, string Password) : IIpAllowlistProtected
{
    eTenantResolutionStrategy IIpAllowlistProtected.TenantResolutionStrategy => eTenantResolutionStrategy.ByUsername;
    string? IIpAllowlistProtected.TenantResolutionKey => Username;
}
```

| Field      | Type    | Notes                            | Validator rule                            |
|---|---|---|---|
| `Username` | string  | mandatory, case-preserved        | NotEmpty (required) + Max 100             |
| `Password` | string  | mandatory, plaintext-over-TLS    | NotEmpty + Min 6                           |

### `VerifyOtpRequest` — POST /api/auth/verify-otp
[CODE] `Application/Auth/Models/VerifyOtpRequest.cs:8-12`

```csharp
public sealed record VerifyOtpRequest(string SessionId, string Code) : IIpAllowlistProtected
{
    eTenantResolutionStrategy IIpAllowlistProtected.TenantResolutionStrategy => eTenantResolutionStrategy.BySessionId;
    string? IIpAllowlistProtected.TenantResolutionKey => SessionId;
}
```

| Field       | Type   | Notes                                                 |
|---|---|---|
| `SessionId` | string | guid from prior step                                  |
| `Code`      | string | OTP code; length governed by `ZitadelOptions.Otp.CodeLength` (4 or 6 — BR-UM-28) |

### `ResendOtpRequest` — POST /api/auth/resend-otp
[CODE] `Application/Auth/Models/ResendOtpRequest.cs:8-12`

```csharp
public sealed record ResendOtpRequest(string SessionId) : IIpAllowlistProtected { ... }
```

| Field       | Type   |
|---|---|
| `SessionId` | string |

### `ForgotPasswordRequest` — POST /api/auth/forgot-password
[CODE] `Application/Auth/Models/ForgotPasswordRequest.cs:8-12`

```csharp
public sealed record ForgotPasswordRequest(
    string Username,
    string PhoneNumber,
    eDeliveryMethod DeliveryMethod = eDeliveryMethod.Sms) : IIpAllowlistProtected { ... }
```

| Field           | Type              | Notes                                  |
|---|---|---|
| `Username`      | string            | identifies the account                 |
| `PhoneNumber`   | string            | **PII** — caller proves they own the account by matching the stored phone number |
| `DeliveryMethod`| `eDeliveryMethod` | `Email = 1`, `Sms = 2`, `Both = 3`. Validator requires non-empty `PhoneNumber` only when `Sms` or `Both`. Default `Sms`. |

[CODE] `Domain/Constants/Enums.cs:46-50` (`eDeliveryMethod`)

### `ForgotPasswordSetPasswordRequest` — POST /api/auth/forgot-password/set-password
[CODE] `Application/Auth/Models/ForgotPasswordSetPasswordRequest.cs:8-12`

```csharp
public sealed record ForgotPasswordSetPasswordRequest(string SessionId, string NewPassword) : IIpAllowlistProtected { ... }
```

| Field         | Type   | Notes                                                |
|---|---|---|
| `SessionId`   | string | session created by prior `forgot-password` step      |
| `NewPassword` | string | validated against `PasswordPolicy` server-side       |

### `SetPasswordRequest` — POST /api/auth/set-password
[CODE] `Application/Auth/Models/SetPasswordRequest.cs:8-12`

```csharp
public sealed record SetPasswordRequest(string SessionId, string NewPassword, string ConfirmPassword) : IIpAllowlistProtected { ... }
```

Adds `ConfirmPassword` vs the `forgot-password` variant — server **re-checks equality** in the
validator AND inside `SetPasswordHandler.Handle`.

### `FirstLoginSetupRequest` — POST /api/auth/first-login
[CODE] `Application/Auth/Models/FirstLoginSetupRequest.cs:8-12`

```csharp
public sealed record FirstLoginSetupRequest(string SessionId, string NewPassword) : IIpAllowlistProtected { ... }
```

Identical shape to `ForgotPasswordSetPasswordRequest` — purpose differs: completes Pending → Active.

### `LogoutRequest` — POST /api/auth/logout
[CODE] `Application/Auth/Models/LogoutRequest.cs:7`

```csharp
public sealed record LogoutRequest(string RefreshToken);
```

Not IP-guarded.

| Field          | Type   | Notes                                              |
|---|---|---|
| `RefreshToken` | string | JWT — passed in body, not headers (some FEs may have stored it client-side) |

### `RefreshTokenRequest` — POST /api/auth/refresh-token
[CODE] `Application/Auth/Models/RefreshTokenRequest.cs:7`

```csharp
public sealed record RefreshTokenRequest(string RefreshToken);
```

| Field          | Type   |
|---|---|
| `RefreshToken` | string |

## Response DTOs

### `LoginStepResponse` (returned by 5 of 9 endpoints)
[CODE] `Application/Auth/Models/LoginStepResponse.cs:7-32`

```csharp
public sealed class LoginStepResponse
{
    public string? SessionId { get; set; }                  // null when Authenticated
    public eAuthenticationStage Stage { get; set; }
    public bool RequiresOtp { get; set; }
    public bool RequiresPasswordChange { get; set; }
    public int? OtpCodeLength { get; set; }                 // BR-UM-28 — 4 or 6 from ZitadelOptions.Otp.CodeLength
    public int? OtpExpiresInSeconds { get; set; }           // BR-UM-26 — typically 60
    public AuthenticatedResult? Tokens { get; set; }        // null unless Stage=Authenticated
    public string? DevOtpCode { get; set; }                 // populated only in Development env
}
```

[CODE] `Application/Helpers/GlobalHelper.IsDevelopment` — controls `DevOtpCode` population.

### `AuthenticatedResult` (returned by `refresh-token` and inside `LoginStepResponse.Tokens`)
[CODE] `Application/Auth/Models/AuthenticatedResult.cs:6-12`

```csharp
public sealed class AuthenticatedResult
{
    public string? AccessToken { get; set; }
    public string? RefreshToken { get; set; }
    public string? IdToken { get; set; }
    public int ExpiresIn { get; set; }   // access token TTL in seconds (1800 from appsettings)
}
```

JWT custom claims set by `ZitadelClaimsTransformation` on consumption side:
- `urn:zitadel:iam:org:project:roles` — role string array
- `sub` — Zitadel `identityUserId`
- `UserId` — Falcon Mongo `_id`
- `TenantId`
- `NodeId`
- `UserType` (`Falcon` / `Client`)

[CODE] `Application/Users/UseCases/CreateUserProcess.cs:180-195` — `BuildUserMetadataEntries(...)`
shows the four metadata keys (UserId, UserType, TenantId, NodeId) pushed into Zitadel — these are
read back as claims at JWT issuance.

## Internal / state DTOs (not on wire)

### `AuthenticationSession` (HybridCache, key `auth-session:{sessionId}`)
[CODE] `Application/Auth/Models/AuthenticationSession.cs:7-25`

| Field                  | Type                       | Notes                                                       |
|---|---|---|
| `SessionId`            | string (required)          | guid, our cache key                                         |
| `Username`             | string (required)          | original login username                                     |
| `UserId`               | string (required)          | Mongo `_id`                                                 |
| `IdentityUserId`       | string (required)          | Zitadel user id                                             |
| `TenantId`             | string (required)          | empty for Falcon users                                      |
| `ExternalSessionId`    | string (required)          | Zitadel session id                                          |
| `ExternalSessionToken` | string (required)          | Zitadel session token; **rotates** on every step            |
| `AuthRequestId`        | string (required)          | OIDC auth request id; needed only for token exchange        |
| `Stage`                | `eAuthenticationStage`     | (see enum)                                                  |
| `FlowType`             | `eAuthFlowType`            | `Login` / `ForgotPassword`                                  |
| `RequiresPasswordChange` | bool                     | set on login; preserves intent across OTP step              |
| `RequiredOtpType`      | string?                    | `"otpSms"` / `"otpEmail"` / null                            |
| `PhoneNumber`          | string?                    | snapshot for re-send                                        |
| `OtpGeneratedAt`       | DateTime?                  | for `OtpStillValid` check                                   |
| `ResendAttempts`       | int                        | counts toward `MaxResendAttempts`                           |
| `CreatedAt`            | DateTime                   | default now-UTC                                             |

TTL: 10 minutes (per service `SERVICE_OVERVIEW.md` — confirm in `AuthSessionCache`).

### `PasswordVerificationResult` (Zitadel adapter result for login)
[CODE] `Application/Auth/Models/PasswordVerificationResult.cs`

Used internally by `LoginProcess`. Fields (inferred from usage in `LoginProcess.cs:43-52`):
- `IsSuccess`
- `IsLocked`
- `RequiresOtp`
- `RequiresPasswordChange`
- `RequiredOtpType`
- `OtpCode` (dev only)
- `ExternalSessionToken`

### `OtpVerificationResult` — same shape minus password flags ([CODE] `OtpVerificationResult.cs`)

### `ResendOtpResult`, `TokenResult`, `CreateIdentityUserResult`, `PasswordChangeResult` — internal contracts in same folder.

## Enum vocabulary used by AuthController DTOs

| Enum                          | Values (file)                                                                       |
|---|---|
| `eAuthenticationStage`        | `PasswordPending=1, OtpPending=2, PasswordChangeRequired=3, Authenticated=4, Failed=5, PasswordResetPending=6` ([CODE] `Domain/Constants/Enums.cs:67-75`) |
| `eAuthFlowType`               | `Login=1, ForgotPassword=2` ([CODE] `Enums.cs:80-84`) |
| `eDeliveryMethod`             | `Email=1, Sms=2, Both=3` ([CODE] `Enums.cs:45-50`) |
| `eUserStatus`                 | `Pending=1, Active=2, Suspended=3, Locked=4, Deleted=5` ([CODE] `Enums.cs:55-62`) — used in `LoginEligibilityPolicy` |
| `eTenantResolutionStrategy`   | `ByUsername, BySessionId, ByUserId` ([CODE] `Enums.cs:106-116`) |

**Note:** `eAuthenticationStage.Failed` is declared but never assigned anywhere in current code (see
OVERVIEW finding #5). `PasswordPending` is also unused — `LoginProcess` constructs sessions starting
at `OtpPending` / `PasswordChangeRequired` / `Authenticated` directly.
