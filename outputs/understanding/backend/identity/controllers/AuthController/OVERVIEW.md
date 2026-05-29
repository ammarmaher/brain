# AuthController — Drill-down

> **Architecture note (important):** Identity does **not** use MVC controllers. It uses **FastEndpoints**.
> This dossier treats the `AuthEndpointGroup` (route prefix `/api/auth/`) as the logical equivalent of an
> `AuthController`. There is **no** file called `AuthController.cs`. The "controller" surface is a folder of
> single-class FastEndpoints under `Falcon.Identity.Api/Endpoints/Auth/`.

## Purpose

Owns the **multi-step authentication flow** — every endpoint that lets an unauthenticated caller cross
the boundary into a Zitadel session and exchange that session for OIDC tokens. Specifically:

- **Login** — credential check + OTP challenge + token exchange ([CODE] `Endpoints/Auth/LoginEndpoint.cs:25`)
- **OTP** — verify, resend ([CODE] `Endpoints/Auth/VerifyOtpEndpoint.cs:25`, `ResendOtpEndpoint.cs:26`)
- **Forgot-password** — request reset code, set new password after OTP ([CODE] `ForgotPasswordEndpoint.cs:25-26`, `ForgotPasswordSetPasswordEndpoint.cs:25`)
- **First-login** — force-change password for Pending users ([CODE] `FirstLoginSetupEndpoint.cs:25`)
- **Set-password (post-OTP, no-login flow)** — `Commerce-contract` parity endpoint that resolves user from session
- **Logout** — revoke refresh token ([CODE] `LogoutEndpoint.cs:24`)
- **Refresh-token** — exchange refresh for access ([CODE] `RefreshTokenEndpoint.cs:24`)

## File layout

```
Falcon.Identity.Api/Endpoints/Auth/
├── AuthEndpointGroup.cs                  Group("/auth") + tag "Authentication"
├── LoginEndpoint.cs                      POST /api/auth/login
├── VerifyOtpEndpoint.cs                  POST /api/auth/verify-otp
├── ResendOtpEndpoint.cs                  POST /api/auth/resend-otp
├── ForgotPasswordEndpoint.cs             POST /api/auth/forgot-password
├── ForgotPasswordSetPasswordEndpoint.cs  POST /api/auth/forgot-password/set-password
├── SetPasswordEndpoint.cs                POST /api/auth/set-password
├── FirstLoginSetupEndpoint.cs            POST /api/auth/first-login
├── LogoutEndpoint.cs                     POST /api/auth/logout
├── RefreshTokenEndpoint.cs               POST /api/auth/refresh-token
├── PreProcessors/
│   └── IpAllowlistPreProcessor.cs        Per-tenant IP allowlist guard (BR-UM-24)
└── Validators/                           One AbstractValidator<T> per endpoint request
    ├── LoginRequestValidator.cs
    ├── VerifyOtpRequestValidator.cs
    ├── ResendOtpRequestValidator.cs
    ├── ForgotPasswordRequestValidator.cs
    ├── ForgotPasswordSetPasswordRequestValidator.cs
    ├── SetPasswordRequestValidator.cs
    ├── FirstLoginSetupRequestValidator.cs
    ├── LogoutRequestValidator.cs
    └── RefreshTokenRequestValidator.cs
```

[CODE] `Falcon.Identity.Api/Endpoints/Auth/` (ls)

## Base route + group config

```csharp
public class AuthEndpointGroup : Group
{
    public AuthEndpointGroup()
    {
        Configure("auth", ep => ep.Description(x => x.WithTags("Authentication")));
    }
}
```
[CODE] `Endpoints/Auth/AuthEndpointGroup.cs:11-17`

Effective route prefix: `/api/auth/*` (FastEndpoints `RoutePrefix = "api"` from `Program.cs` +
group prefix `auth`).

## Authorization

- **Every endpoint declares `AllowAnonymous()`.** Auth must be unauthenticated to be useful.
- Tenant-scoping happens via **`IpAllowlistPreProcessor<TRequest>`** before the handler runs,
  not via JWT (the caller has no JWT yet).
- One endpoint — `logout` — does *not* register the IP allowlist pre-processor, because at logout
  time the IP is moot and an aggressive 403 would lock the user out of their own session-end.
  Same exemption applies to `refresh-token` ([CODE] `LogoutEndpoint.cs:14-20`, `RefreshTokenEndpoint.cs:14-20`).

## Pre-processors (BR-UM-24 — IP check BEFORE credentials check)

[CODE] `Endpoints/Auth/PreProcessors/IpAllowlistPreProcessor.cs:10-38`

```csharp
public class IpAllowlistPreProcessor<TRequest> : IPreProcessor<TRequest>
    where TRequest : IIpAllowlistProtected
{
    public async Task PreProcessAsync(IPreProcessorContext<TRequest> ctx, CancellationToken ct)
    {
        // 1. Resolve tenant ID — strategy lives on the request DTO itself.
        var tenantId = ctx.Request.TenantResolutionStrategy switch
        {
            eTenantResolutionStrategy.ByUsername  => await resolver.ResolveByUsernameAsync(...),
            eTenantResolutionStrategy.BySessionId => await resolver.ResolveBySessionIdAsync(...),
            eTenantResolutionStrategy.ByUserId    => await resolver.ResolveByUserIdAsync(...),
            _ => null
        };

        // 2. Unknown tenant -> skip IP check (silent-fail; handler emits InvalidCredentials)
        if (tenantId is null) return;

        // 3. Validate caller IP against the tenant's allowlist (cached in Redis).
        var clientIp = ctx.HttpContext.Connection.RemoteIpAddress?.ToString();
        await guard.ValidateAsync(tenantId, clientIp, ct);  // throws FalconException(IpNotAllowed) -> HTTP 403
    }
}
```

### Tenant resolution strategy per endpoint

Each request DTO that needs IP guarding implements `IIpAllowlistProtected`:

| Endpoint                          | Strategy        | Resolution Key   |
|---|---|---|
| `login`                           | `ByUsername`    | `Username`       |
| `verify-otp`                      | `BySessionId`   | `SessionId`      |
| `resend-otp`                      | `BySessionId`   | `SessionId`      |
| `forgot-password`                 | `ByUsername`    | `Username`       |
| `forgot-password/set-password`    | `BySessionId`   | `SessionId`      |
| `set-password`                    | `BySessionId`   | `SessionId`      |
| `first-login`                     | `BySessionId`   | `SessionId`      |
| `logout`                          | (none registered) | —              |
| `refresh-token`                   | (none registered) | —              |

[CODE] `Application/Auth/Models/LoginRequest.cs:8-12`, `VerifyOtpRequest.cs:8-12`, etc.

**BR-UM-24 enforcement check:** Login flow runs IP check in pre-processor *before*
`LoginEndpoint.HandleAsync` → `LoginCommand` → Zitadel credential call. ✓ Confirmed.
[CODE] `Endpoints/Auth/LoginEndpoint.cs:20` (`PreProcessor<IpAllowlistPreProcessor<LoginRequest>>()`)
runs prior to `mediator.Send(new LoginCommand(...))` on line 25.

## Multi-step session state machine

Stored in **HybridCache** as `AuthenticationSession` keyed by `sessionId` (guid).
[CODE] `Application/Auth/Models/AuthenticationSession.cs:7-25`

```csharp
public sealed class AuthenticationSession
{
    public required string SessionId { get; set; }
    public required string Username { get; set; }
    public required string UserId { get; set; }
    public required string IdentityUserId { get; set; }   // Zitadel user id
    public required string TenantId { get; set; }
    public required string ExternalSessionId { get; set; }      // Zitadel session id
    public required string ExternalSessionToken { get; set; }   // Zitadel session token (rotates)
    public required string AuthRequestId { get; set; }          // Zitadel OIDC auth request
    public eAuthenticationStage Stage { get; set; }
    public eAuthFlowType FlowType { get; set; } = eAuthFlowType.Login;   // Login | ForgotPassword
    public bool RequiresPasswordChange { get; set; }
    public string? RequiredOtpType { get; set; }                // "otpSms" | "otpEmail" | null
    public string? PhoneNumber { get; set; }
    public DateTime? OtpGeneratedAt { get; set; }
    public int ResendAttempts { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
```

State machine:

```
                         OtpPending ──verify-otp(ok)──┐
                        ↗                              ↓
        login ─────────┤              PasswordChangeRequired ──first-login──> Authenticated
                        ↘                              ↑
                         (no OTP) ─────────────────────┘
                        ↘
                         Authenticated (single step, OtpRequiredOnLogin=false AND not Pending)


    forgot-password ─> OtpPending(FlowType=ForgotPassword)
                         └─verify-otp─> PasswordResetPending
                                          └─forgot-password/set-password─> (session destroyed)
```

[CODE] `Application/Auth/UseCases/LoginProcess.cs:29-133`,
[CODE] `Application/Auth/UseCases/VerifyOtpProcess.cs:16-46`, `:49-62` (ResolveFlowAsync switch)
[CODE] `Application/Auth/UseCases/FirstLoginSetupProcess.cs:19-59`
[CODE] `Application/Auth/UseCases/ForgotPasswordProcess.cs:24-77`,
[CODE] `Application/Auth/UseCases/ForgotPasswordSetPasswordHandler.cs:16-31`

## Domain policies invoked

- **`LoginEligibilityPolicy`** — only Active/Pending users can authenticate
  ([CODE] `Domain/Policies/LoginEligibilityPolicy.cs:14-26`)
- **`AuthenticationStagePolicy`** — chooses next stage (OTP > password-change > authenticated)
  ([CODE] `Domain/Policies/AuthenticationStagePolicy.cs:15-21`)
- **`PasswordPolicy`** — Zitadel-floor validation; min 8 + upper + lower + digit + special.
  Both `Normal` and `Advanced` levels currently use identical rules; `level` is reserved for
  future Advanced-only rules (history, reuse). ([CODE] `Domain/Policies/PasswordPolicy.cs:9-87`)

## Throttling matrix

From `Endpoint.Configure()` `Throttle(hits, seconds)`:

| Endpoint                          | hits / 60s |
|---|---|
| `login`                           | 10 |
| `verify-otp`                      | 10 |
| `resend-otp`                      | 5  |
| `forgot-password`                 | 5  |
| `forgot-password/set-password`    | 5  |
| `set-password`                    | 5  |
| `first-login`                     | 5  |
| `logout`                          | 10 |
| `refresh-token`                   | 20 |

[CODE] `LoginEndpoint.cs:19`, `VerifyOtpEndpoint.cs:19`, etc.

## Kafka events

| Event class                              | When                                              | Channel |
|---|---|---|
| `SmsCodeGeneratedDomainEvent`            | OTP sent on login / resend / forgot-password     | SMS    |

Published via `IPublisher.Publish(...)` — Mediator notification fan-out triggers the
`SmsCodeGeneratedDomainEventHandler` which speaks to the SMS gateway (`RiCH`).

[CODE] `Application/Auth/UseCases/LoginProcess.cs:114`, `ResendOtpProcess.cs:56`,
`ForgotPasswordProcess.cs:63`

## Key collaborators

| Component | Role |
|---|---|
| `IIdentityManager` (Zitadel facade) | session create, password+OTP challenge, OTP verify, token exchange, refresh-token, revoke-token |
| `IUserRepository` / `IRepository<User>` | by-username lookup, status update, phone-verified flag |
| `AuthSessionCache` | HybridCache wrapper for `AuthenticationSession` |
| `ITenantIdResolver` | IP-allowlist tenant resolution |
| `IIpAllowlistGuard` | CIDR-aware IP check vs Redis allowlist |
| `IPublisher` (Mediator) | publishes `SmsCodeGeneratedDomainEvent` |
| `IOptions<ZitadelOptions>` | OTP code length + expiry seconds |
| `IOptions<SecurityOptions>` | `MaxResendAttempts`, `OtpRequiredOnLogin` |

## Code smells / findings

1. **`set-password` endpoint duplicates `forgot-password/set-password` minus the `PasswordResetPending` stage gate.**
   `SetPasswordHandler.cs:14-29` resolves the user from session, but does **not** check the session stage —
   so anyone with a valid `sessionId` (e.g. after OTP verify in *any* flow) can set a new password without
   reverifying. `ForgotPasswordSetPasswordHandler.cs:20-21` *does* check `Stage == PasswordResetPending`.
   Either delete `set-password` or stage-gate it. **Possible privilege-escalation.** Verify against current main.

2. **No max-OTP-attempts counter inside `VerifyOtpProcess`.** The handler relies entirely on Zitadel returning
   `IsLocked` after Zitadel's own attempt counter overflows. If Zitadel's `MaxOtpAttempts` is misconfigured
   or the local cap differs from BR-UM-25, the local count diverges silently. BR-UM-25 says split between
   Zitadel + Identity → today Identity contributes zero counting on OTP verify (only on OTP **resend**).

3. **`LogoutHandler` swallows exceptions silently.** A failed Zitadel revoke logs at Warning and returns
   success — by design ("proceeding"), but FE shows "logged out" while refresh token remains valid for
   its full TTL on the IdP side. ([CODE] `LogoutHandler.cs:14-22`)

4. **`AuthenticationSession.AuthRequestId` is `required` but in the `ForgotPassword` flow it is set but
   never used for token exchange** (forgot flow ends at `ForgotPasswordSetPasswordHandler` which never
   calls `ExchangeSessionForTokenAsync`). Dead state.

5. **`AuthenticationStagePolicy` does not consider `eAuthenticationStage.Failed`** — declared in the
   enum but never assigned anywhere in code. Dead enum value.

6. **`LoginProcess` lifts `user.PhoneNumber` blindly into the session for OTP.** No validation that the
   phone is verified before using it as the OTP target — for first-login (Pending) users this is fine
   because admin created with a known phone, but for Active users whose phone changed but is not yet
   verified, the OTP goes to the old/unverified number. (Verify with `UpdateUserProfileHandler.cs:69-70`
   which keeps the old phone-verified flag false on change.)

## Files in this drill-down

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
