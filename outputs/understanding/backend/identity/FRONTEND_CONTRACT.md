# Identity Service — Frontend Contract

> Everything the frontend team needs to integrate. Source: code, not docs.

## Base URLs

| Environment | Direct (rarely needed) | Via Core Gateway (Client users) | Via System Gateway (Falcon admins) |
|---|---|---|---|
| Local dev | `https://localhost:7777/api` | `https://localhost:7038/identity/auth/*` (anonymous), `https://localhost:7038/identity/*` (client) | `https://localhost:7256/identity/*` (falcon-only) |
| Prod | n/a (gateway-fronted) | `<core-gateway>/identity/auth/*`, `<core-gateway>/identity/*` | `<system-gateway>/identity/*` |

The path strip + prepend transform means:
- Frontend hits `https://core-gateway/identity/auth/login`
- Gateway forwards to Identity `https://identity-service/api/auth/login`

## Authentication Header

`Authorization: Bearer <zitadel-jwt>` — except on `/auth/*` and `/security/user-status/*` endpoints which are anonymous.

JWT claims expected:
- `urn:zitadel:iam:org:project:roles` — array of role strings
- `sub` — identity user id (Zitadel)
- Tenant id custom claim — read by `currentUser.TenantId` for client users (Falcon admins have no tenant claim)

## Response Wrapper

**Every** endpoint returns the standard wrapper:

```json
{
  "isSuccessful": true,
  "result": { /* T */ },
  "errorMessages": []
}
```

On failure: `isSuccessful: false`, `result: null`, `errorMessages: ["<localized message>", ...]` — the original `FalconKeys.Error.<Code>` is **not** returned, only its localized English/Arabic message. Frontend gets HTTP status (400/401/403/404/409/422/423/429/500/503) for protocol-level distinction.

## Camel-Case Serialization

JSON serializer uses `JsonNamingPolicy.CamelCase` — backend properties `IsSuccessful`, `ErrorMessages`, `SessionId` → frontend wire `isSuccessful`, `errorMessages`, `sessionId`.

## Multi-Step Auth Flow (Frontend Implementation Notes)

The login flow returns `LoginStepResponse` repeatedly until `Stage == Authenticated`. Frontend state machine:

```
POST /auth/login
  ↓ Stage=OtpRequired, SessionId=abc, RequiresOtp=true, OtpExpiresInSeconds=60
POST /auth/verify-otp { sessionId: "abc", code: "123456" }
  ↓ Stage=PasswordChangeRequired (if first login) OR Stage=Authenticated
POST /auth/first-login { sessionId: "abc", newPassword: "..." }   (only if PasswordChangeRequired)
  ↓ Stage=Authenticated, Tokens=AuthenticatedResult
```

`DevOtpCode` is populated in development environments — frontend can auto-fill OTP for testing.

## Token Lifetimes

From `appsettings.json` (Zitadel):

- Access token: 1800s (30 min)
- ID token: 1800s
- Refresh token total expiration: 1209600s (14 days)
- Refresh idle expiration: 172800s (2 days)

Use `POST /auth/refresh-token` to renew before expiry (rate-limited to 20/60s).

## Pagination Shape

```csharp
public sealed record PagedResponse<T>(List<T> Items, long TotalCount, int PageNumber, int PageSize);
```

Common query params: `PageNumber=1` (1-based), `PageSize=20`.

## Filter / Multi-Value Query Params

For list endpoints (`/user/`), repeated query params are bound to `List<T>`:
- `?Status=2&Status=3` → `Status: [Locked, Suspended]`
- `?Role=4&Role=5` → `Role: [FalconAdmin, AccountAdmin]`

## Rate Limits

| Endpoint group | Limit |
|---|---|
| `/auth/login`, `/auth/verify-otp`, `/auth/logout` | 10 / 60s |
| `/auth/resend-otp`, `/auth/forgot-password`, `/auth/forgot-password/set-password`, `/auth/set-password`, `/auth/first-login` | 5 / 60s |
| `/auth/refresh-token` | 20 / 60s |

Exceeded → HTTP 429 with `OtpStillValid` or transport-level `Too Many Requests`.

## IP Allowlist

All `/auth/*` endpoints are protected by `IpAllowlistPreProcessor`. The pre-processor resolves the caller's tenant id from username (login flow) or session id (subsequent steps) and checks Redis-cached per-tenant allowlist. Frontend impact: a misconfigured IP allowlist returns **HTTP 403** with `IpNotAllowed`.

## CORS

`Cors:AllowedOrigins` in config — defaults to `http://localhost:4200` in dev. Frontend must add its production origin to this list.

## Multi-Language

Identity DTOs use single-string `FirstName`, `LastName`, etc. — **not** wrapped in `MultiLanguage(En, Ar)`. Only error messages are localized (en/ar resx).

The `Accept-Language` header is **not** observed in Identity code paths — language is determined per-service by middleware (`RequestLocalization` or similar).

## Frontend Auth Anti-Pattern Warning

Per `feedback_frontend_auth_identity_service.md`:
> Frontend NEVER calls Zitadel directly; all auth goes through Identity Service (auth.falconhub.space/api/)

So the Zitadel `Domain` / `BackchannelDomain` config values in `appsettings.json` are for Identity itself to talk to Zitadel — **frontend talks only to Identity (via gateway)**.

## OpenAPI / Swagger

In Development:
- `https://localhost:7777/openapi/v1.json` (raw OpenAPI document)
- FastEndpoints does not auto-launch a Swagger UI page — use a tool like Swagger Editor or RapiDoc against `openapi/v1.json`. The contract is generated from `Endpoint.Description(d => d.WithName(...).WithDisplayName(...).Produces<...>().ProducesProblem(...))` calls in each endpoint.
