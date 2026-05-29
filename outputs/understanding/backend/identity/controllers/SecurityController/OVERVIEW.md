# SecurityController — Drill-down

> **Architecture note:** Identity uses FastEndpoints. This dossier treats the `SecurityEndpointGroup`
> (route prefix `/api/security/`) as the logical equivalent of a `SecurityController`. Only ONE endpoint
> exists today (`GET /api/security/user-status/{IdentityUserId}`). Tiny surface — but critical for
> east-west calls.

## Purpose

A **single anonymous east-west endpoint** for other Falcon services to check whether a user is
currently allowed to act. Returns the user's `Status` and a pre-computed `IsActive` flag.

Used by:
- Gateways — to short-circuit JWT-bearing requests for users whose status changed mid-session
  (e.g. admin just locked the user; the user's still-valid JWT shouldn't grant access).
- Other services that don't own user state but need to enforce "active" before performing actions.

## File layout

```
Falcon.Identity.Api/Endpoints/Security/
├── SecurityEndpointGroup.cs          Group("/security") + tag "Security"
└── CheckUserStatusEndpoint.cs        GET /api/security/user-status/{IdentityUserId}
```

[CODE] `Endpoints/Security/SecurityEndpointGroup.cs:11-15`
[CODE] `Endpoints/Security/CheckUserStatusEndpoint.cs:9-36`

## Authorization

- **`AllowAnonymous()`** — no JWT required. Identity trusts the network boundary (gateway-only
  reachable) for this east-west surface.
- No IP allowlist pre-processor — east-west callers don't have a per-tenant IP allowlist.
- No throttle (relies on gateway-side rate limits).

## Cache strategy

[CODE] `Endpoints/Security/CheckUserStatusEndpoint.cs:21-29`

```csharp
var response = await cache.GetOrCreateAsync(CacheKeys.UserStatus(req.IdentityUserId), async token =>
{
    var user = await userRepository.GetAsync(u => u.IdentityUserId == req.IdentityUserId && !u.IsDeleted);
    if (user is null) return null;
    return new UserStatusResponse(user.Id!, user.Status, user.Status == eUserStatus.Active);
}, cancellationToken: ct);
```

- **HybridCache** key: `user_status_{identityUserId}` ([CODE] `Domain/Constants/CacheKeys.cs:17`)
- **Multi-tier**: L1 in-memory + L2 Redis (per HybridCache configuration).
- **TTL**: not set explicitly — uses HybridCache defaults (per service `SERVICE_OVERVIEW.md`: ~5 min hybrid / 2 min local).
- **Invalidation**:
  - `ChangeUserStatusProcess.cs:72` — admin status change
  - `LoginProcess.cs:54` — Zitadel reports user locked during login
  - `VerifyOtpProcess.cs:118` — Zitadel reports user locked during OTP
  - `ZitadelWebhookEndpoint.cs:78` — webhook event (UserLocked/Unlocked/Deactivated/Reactivated)

The same cache key is read by SecurityController and invalidated by **five different
write paths**. Consistent invalidation is critical — any path that mutates user status MUST
call `cache.RemoveAsync(CacheKeys.UserStatus(identityUserId))`.

## Key collaborators

| Component             | Role |
|---|---|
| `IRepository<User>`   | Mongo lookup by `IdentityUserId` (Zitadel user id, not Mongo `_id`) |
| `HybridCache`         | L1+L2 cache for user-status response |

## Code smells / findings

1. **`!IsDeleted` is hardcoded in the cache populator.** A soft-deleted user returns 404. This may
   surprise an east-west caller that wants to distinguish "soft-deleted" from "never existed". In
   practice both return `UserNotFound`. For the gateway short-circuit use case this is fine.

2. **No cache TTL specified.** Relies on HybridCache defaults configured at startup. If those
   defaults are aggressive (e.g. 30-min TTL with no eager invalidation), a window exists where
   a locked user's old "Active" status sticks until expiry — and HybridCache's L2 (Redis) is the
   real source of staleness because L1 in-memory invalidation only propagates across nodes via
   Redis pub-sub if configured.

3. **`IsActive = (Status == Active)` is computed server-side**, so callers don't have to know the
   enum. Good. But callers can still check `Status` directly if they need more granularity
   (e.g. distinguish Locked from Suspended for messaging).

4. **No JWT check.** Anyone who can reach `/api/security/user-status/{id}` (gateways + direct
   network access) gets the user's status. For external networks the gateway must restrict this.
   If the gateway misconfiguration exposes it publicly, an attacker can enumerate identity user
   ids and discover active status. **Defense-in-depth gap** — consider requiring a service-account
   JWT.

## Files in this drill-down

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
