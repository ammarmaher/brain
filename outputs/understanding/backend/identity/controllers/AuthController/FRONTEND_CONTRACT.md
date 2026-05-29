# AuthController — Frontend Contract

> What the FE has to build against — the **multi-step login state machine**, OTP UX,
> token storage, idle timeout, and silent-deny behaviour.

## Base URLs

| Environment | Direct (rarely needed)         | Via Core Gateway (Client users)             | Via System Gateway (Falcon admins)     |
|---|---|---|---|
| Local dev   | `https://localhost:7777/api`   | `https://localhost:7038/identity/auth/*`    | `https://localhost:7256/identity/auth/*` |
| Prod        | n/a (gateway-fronted)          | `<core-gateway>/identity/auth/*`            | `<system-gateway>/identity/auth/*`     |

FE should never call Zitadel directly. All auth traffic goes through Identity (per
`feedback_frontend_auth_identity_service.md`).

## Common request/response wrapper

Every endpoint returns:

```json
{
  "isSuccessful": true,
  "result": { "...": "..." },
  "errorMessages": []
}
```

camelCase serialization (`JsonNamingPolicy.CamelCase`).

## Multi-step state machine — FE pseudo-code

```ts
// User submits username + password.
const { sessionId, stage, requiresOtp, otpCodeLength, otpExpiresInSeconds, tokens, devOtpCode }
  = await api.post('/auth/login', { username, password }).result;

switch (stage) {
  case 'OtpPending': {                       // value 2
    // Render OTP input of length otpCodeLength (4 or 6 — BR-UM-28).
    // Start countdown otpExpiresInSeconds (typically 60 — BR-UM-26).
    // In dev, devOtpCode is populated for auto-fill.
    const verifyResult = await api.post('/auth/verify-otp', { sessionId, code }).result;
    return advance(verifyResult);             // recurse — may yield PasswordChangeRequired or Authenticated
  }
  case 'PasswordChangeRequired': {           // value 3 (only for Pending users on first-login)
    // Navigate to first-login screen with sessionId.
    const finalResult = await api.post('/auth/first-login', { sessionId, newPassword }).result;
    saveTokens(finalResult.tokens);
    return;
  }
  case 'Authenticated': {                    // value 4
    saveTokens(tokens);
    return;
  }
}
```

For `verifyResult`:
- If `verifyResult.stage === 'PasswordChangeRequired'` → continue to first-login.
- If `verifyResult.stage === 'PasswordResetPending'` (`6`) → only in forgot-password flow; show
  set-new-password screen and call `/auth/forgot-password/set-password`.
- If `verifyResult.tokens !== null` → user is authenticated.

## Forgot-password flow

```ts
// 1. User clicks "Forgot password" and supplies username + phone.
await api.post('/auth/forgot-password', { username, phoneNumber, deliveryMethod: 'Sms' }).result;
//      → { sessionId, stage: 'OtpPending', flowType: 'ForgotPassword', otpCodeLength, otpExpiresInSeconds }

// 2. User enters OTP.
await api.post('/auth/verify-otp', { sessionId, code }).result;
//      → { sessionId, stage: 'PasswordResetPending' }

// 3. User sets new password.
await api.post('/auth/forgot-password/set-password', { sessionId, newPassword }).result;
//      → { isSuccessful: true, result: true }
```

After step 3, **session is destroyed**. FE must redirect to login and prompt the user to log in fresh.

## OTP behaviour contract (BR-UM-26, BR-UM-28)

| Property                        | Source                                          | FE behaviour |
|---|---|---|
| OTP code length                 | `result.otpCodeLength` (server-controlled)      | Render `otpCodeLength` digit inputs. **Do not hardcode 4 or 6.** Configurable per environment via `ZitadelOptions.Otp.CodeLength`. |
| OTP expiry                      | `result.otpExpiresInSeconds`                    | Show countdown. When countdown hits zero, allow user to tap "Resend". |
| Resend before expiry            | BE returns `OtpStillValid` (HTTP 429)           | FE should disable the resend button until countdown is zero. Treat any 429 with the localized OTP-still-valid message as "wait for countdown". |
| Resend limit                    | BE returns `OtpResendLimitExceeded` (HTTP 429)  | After this, user is **locked** in Zitadel. FE must redirect to a "your account is locked" landing — calling /login again returns `UserLocked` (HTTP 423). |
| Dev auto-fill                   | `result.devOtpCode`                             | In development env only, auto-fill the OTP. Production responses always have `devOtpCode: null`. |

## Authentication tokens (`AuthenticatedResult`)

```json
{
  "accessToken": "eyJ...",     // OIDC access token, ~30 min TTL
  "refreshToken": "...",       // ~14 days total, 2 days idle expiry
  "idToken": "eyJ...",
  "expiresIn": 1800            // access token lifetime, seconds
}
```

| Token         | TTL (from `appsettings.json` → Zitadel)        |
|---|---|
| Access token  | 1800 s (30 min)                                  |
| ID token      | 1800 s (30 min)                                  |
| Refresh token | 1209600 s (14 days, total)                       |
| Refresh idle  | 172800 s (2 days, idle expiry)                   |

Store in memory (preferred) or `httpOnly` cookie. **Never** in `localStorage` if the app handles
real PII.

### Refresh strategy

Refresh ahead of `expiresIn`:

```ts
const refreshTimer = setTimeout(
  async () => {
    const { accessToken, refreshToken, idToken, expiresIn }
      = await api.post('/auth/refresh-token', { refreshToken: stored }).result;
    saveTokens({ accessToken, refreshToken, idToken, expiresIn });
  },
  (expiresIn - 60) * 1000   // refresh 60s before expiry
);
```

Rate-limited: 20 / 60 s. Hitting the limit returns HTTP 429 transport-level.

## JWT claims (read by other Falcon services)

Set by Zitadel from user metadata pushed during `CreateUserProcess.BuildUserMetadataEntries(...)`
([CODE] `Application/Users/UseCases/CreateUserProcess.cs:180-195`):

| Claim          | Source                                                    |
|---|---|
| `sub`          | Zitadel `identityUserId`                                  |
| `urn:zitadel:iam:org:project:roles` | Role string array                    |
| `UserId`       | MongoDB `User._id` (set as Zitadel metadata)              |
| `UserType`     | `eUserType` int (Falcon=1 / Client=2)                     |
| `TenantId`     | (omitted for Falcon admins)                                |
| `NodeId`       | (omitted when empty)                                       |

FE doesn't need to parse these — they're for backend services. FE consumes only what `/api/user/me`
returns.

## Idle timeout (BR-UM-29)

**30-minute idle logout** — token TTLs above naturally enforce this:
- After 30 min the access token expires → next API call returns 401.
- Refresh token "idle expiration" = 172800 s (2 days), but server logic + FE behaviour together
  define the *effective* 30-min idle.

### How BR-UM-29 is implemented

[INFERRED] The 30-min spec from PRD corresponds to the access token TTL (1800 s). On 401, FE
attempts `/refresh-token`. If the user has been *truly* idle and the refresh-token-idle window has
also lapsed, refresh fails with `InvalidRefreshToken` and FE redirects to login.

**Open question (halt-and-flag):** `appsettings.json` does not directly specify "idle timeout" —
it specifies access/refresh TTLs. If PRD requires the 30-min idle to be **configurable in UI**
(e.g. per-tenant), there is no current code path for that. See pending-question file.

## Silent-deny handling (BR-UM-32)

For `/auth/forgot-password`, the server returns one of:
- HTTP 400 `InvalidUsernameOrPhone` — user not found OR phone mismatch (indistinguishable)
- HTTP 403 `UserSuspended`
- HTTP 422 `UserPending`
- HTTP 423 `UserLocked`
- HTTP 200 success with `sessionId`

**FE recommendation** (BR-UM-33 generic-alert):

```ts
try {
  const r = await api.post('/auth/forgot-password', { ... });
  if (r.isSuccessful) navigate('/otp', { state: { sessionId: r.result.sessionId } });
  else throw new Error('bad request');
} catch (e) {
  // Per BR-UM-33: do NOT distinguish — show a single neutral message:
  toast('If the account exists and is active, a verification code has been sent.');
}
```

⚠ The BE currently returns differentiated HTTP status codes for the failure cases listed above.
A user inspecting devtools network tab can still tell `403 UserSuspended` from `423 UserLocked`.
FE-side error masking is the only mitigation today. To eliminate the leak, the BE would need to
return uniform `InvalidUsernameOrPhone` for all four cases — currently it does not.

## IP allowlist (BR-UM-24)

`HTTP 403 IpNotAllowed` may be returned from any `/auth/*` endpoint (except `/logout` and
`/refresh-token`) before the request reaches its handler. FE should show a tenant-aware message
("Your network is not authorized to sign in. Contact your administrator.").

The check runs *before* the credential check, so an attacker on a blocked IP can't even probe
usernames.

## CORS

Configured in `Cors:AllowedOrigins`. Default dev: `http://localhost:4200`. FE production origin
must be on the allowlist.

## Localization

- HTTP errors are localized via `Accept-Language` header indirectly — Identity reads culture per
  request via middleware (see `Startup/Localization/`).
- `FalconValues.Cultures.SupportedCultures = ["ar", "en"]` ([CODE] `Domain/Constants/FalconValues.cs:66`).
- Errors come back as localized strings in `errorMessages[]`. Original codes are not exposed.

## OpenAPI

In Development:
- `https://localhost:7777/openapi/v1.json` — raw OpenAPI document.
- Each AuthController endpoint contributes a `WithTags("Authentication")` group via the group config.
- FastEndpoints does not ship a Swagger UI by default — use Swagger Editor or RapiDoc against the JSON.
