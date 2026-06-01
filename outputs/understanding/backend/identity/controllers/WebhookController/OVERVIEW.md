# WebhookController — Drill-down

> **Architecture note:** Identity uses FastEndpoints. This dossier treats the `WebhookEndpointGroup`
> (route prefix `/api/webhook/`) as the logical equivalent of a `WebhookController`. Today: one
> endpoint, `POST /api/webhook/zitadel`.

## Purpose

Receives **Zitadel lifecycle events** and propagates them to Falcon's Mongo `User` document +
HybridCache. This is the **inbound** side of the Zitadel ↔ Identity sync — the inverse direction
of when Identity calls Zitadel via `IIdentityManager`.

The webhook is the only path by which "actions taken directly against Zitadel" (e.g. an admin
locks a user from the Zitadel console, or Zitadel's own attempt counter overflows and auto-locks
a user) reach Falcon. Without this, Mongo would carry a stale view of user state.

## File layout

```
Falcon.Identity.Api/Endpoints/Webhooks/
├── WebhookEndpointGroup.cs           Group("/webhook") + tag "Webhooks"
└── ZitadelWebhookEndpoint.cs         POST /api/webhook/zitadel
```

[CODE] `Endpoints/Webhooks/WebhookEndpointGroup.cs:11-15`
[CODE] `Endpoints/Webhooks/ZitadelWebhookEndpoint.cs:12-145`

Supporting infrastructure files in [CODE] `Infrastructure/Identity/`:
- `ZitadelWebhookSignatureVerifier.cs` — HMAC-SHA256 verification
- `ZitadelEventMapper.cs` — gRPC method name → internal event type

## Authorization

- **`AllowAnonymous()`** — no JWT required.
- **Signature-verified via `x-zitadel-signature` header.** HMAC-SHA256 over the raw request body
  with `ZitadelOptions.WebhookSigningKey` as the secret.
- No IP allowlist (Zitadel sends from various IPs; signing key is the trust anchor).
- No throttle (Zitadel is the trusted sender).

## Signature verification

[CODE] `Infrastructure/Identity/ZitadelWebhookSignatureVerifier.cs:9-32`

```csharp
public static bool Verify(string signingKey, string signature, string body)
{
    if (string.IsNullOrEmpty(signingKey) || string.IsNullOrEmpty(signature))
        return false;

    var keyBytes = Encoding.UTF8.GetBytes(signingKey);
    var bodyBytes = Encoding.UTF8.GetBytes(body);
    using var hmac = new HMACSHA256(keyBytes);
    var hash = hmac.ComputeHash(bodyBytes);
    var computedSignature = Convert.ToHexStringLower(hash);
    return string.Equals(computedSignature, signature, StringComparison.OrdinalIgnoreCase);
}
```

Failure modes returned as HTTP 401 (`Send.UnauthorizedAsync`):
- Missing or empty `WebhookSigningKey` config → reject everything (closed-by-default).
- Missing or wrong `x-zitadel-signature` header.

⚠ **Comparison is `OrdinalIgnoreCase`** on hex digits. Hex digits compare identically under any case
mode, but `OrdinalIgnoreCase` is not constant-time. Two webhook bodies whose computed signatures
share an early prefix may be distinguishable by timing. Low practical risk (attacker must already
know the signing key to craft anything useful), but `CryptographicOperations.FixedTimeEquals(byte[],byte[])`
would be the canonical choice.

## Event mapping

[CODE] `Infrastructure/Identity/ZitadelEventMapper.cs:13-32`

```csharp
public static string? MapToEventType(string grpcMethod) => grpcMethod switch
{
    _ when grpcMethod.Contains("VerifyEmail")     => "user.human.email.verified",
    _ when grpcMethod.Contains("VerifyPhone")     => "user.human.phone.verified",
    _ when grpcMethod.Contains("LockUser")        => "user.locked",
    _ when grpcMethod.Contains("UnlockUser")      => "user.unlocked",
    _ when grpcMethod.Contains("DeactivateUser")  => "user.deactivated",
    _ when grpcMethod.Contains("ReactivateUser")  => "user.reactivated",
    _ => null
};
```

⚠ **`Contains` matching is brittle.** A future Zitadel gRPC method named `LockUserRequest` or
`UserLockedNotification` would match `LockUser` substring. Acceptable today, but exact-equality
should be considered for robustness.

## Event → DB effect matrix

[CODE] `Endpoints/Webhooks/ZitadelWebhookEndpoint.cs:102-143`

| Zitadel event type             | Mongo update                                                |
|---|---|
| `user.locked`                  | `Status = Locked`, `UpdatedAt = now`                        |
| `user.unlocked`                | `Status = Active`, `UpdatedAt = now`                        |
| `user.deactivated`             | `Status = Suspended`, `UpdatedAt = now`                     |
| `user.reactivated`             | `Status = Active`, `UpdatedAt = now`                        |
| `user.human.email.verified`    | `IsEmailVerified = true`, `UpdatedAt = now`                 |
| `user.human.phone.verified`    | `IsPhoneVerified = true`, `UpdatedAt = now`                 |
| (anything else recognized)     | logged, no update                                            |
| (no `fullMethod` property)     | 200 OK silently — protects against malformed Zitadel emit    |
| (no `userId` in payload)       | 200 OK silently — protects against malformed Zitadel emit    |
| (unrecognized `grpcMethod`)    | 200 OK silently — `null` from `ZitadelEventMapper`           |

After every update, the user-status cache key is invalidated:
```csharp
await cache.RemoveAsync(CacheKeys.UserStatus(identityUserId), ct);
```

## Idempotency & ordering

- **No event-id tracking.** Zitadel may resend an event; the handler re-applies the update
  (idempotent since updates are absolute sets, not deltas).
- **No ordering guarantee.** If two webhooks arrive out of order (e.g. `unlocked` then `locked`),
  the last write wins. For status changes from Zitadel, the last-write-wins model matches what
  the user would expect (the latest state is the truth).

## Kafka events

The webhook endpoint itself does **not** publish Kafka events. Status changes from this path are
local to Identity's Mongo + Redis. Other services that need to react to user-status changes do so
via their own consumption of upstream Zitadel events or via polling `/api/security/user-status/{id}`.

## Domain policies invoked

**None.** Pure data sync. The endpoint deliberately does NOT run `UserStatusTransitionPolicy`
because Zitadel's truth is authoritative — if Zitadel says "Locked", Mongo follows. Adding the
transition policy here would create deadlock with Zitadel's own state machine.

## Key collaborators

| Component                            | Role |
|---|---|
| `IRepository<User>`                  | Mongo update by `IdentityUserId` |
| `HybridCache`                        | invalidate `user_status_{identityUserId}` |
| `IOptions<ZitadelOptions>`           | reads `WebhookSigningKey` |
| `ZitadelWebhookSignatureVerifier`    | HMAC verify |
| `ZitadelEventMapper`                 | gRPC method name → event type |
| `ILoggerFactory`                     | per-request structured logging |
| `JsonDocument` (System.Text.Json)    | parses raw body to extract `fullMethod` + `request.userId` |

## Code smells / findings

1. **`Send.UnauthorizedAsync` on signature failure but always returns 200 on payload anomalies.**
   This is the "trust the sender, don't crash on weird payloads" pattern. Acceptable, but means
   Zitadel won't retry on payload errors — silent failures sitting in logs only.

2. **No retry/dead-letter queue.** If Mongo write fails, the handler throws → 500 → Zitadel may
   retry per its own webhook config. Behavior depends entirely on Zitadel-side retry settings,
   which are not documented here.

3. **`HMAC` comparison not constant-time** (see Signature verification section).

4. **No correlation id** — webhook events don't carry a Zitadel-side event id that we log alongside
   our action, making distributed tracing harder.

5. **Webhook handler bypasses domain policies.** If Zitadel reports a transition Identity considers
   "illegal" (e.g. Suspended → Locked without going through Active), Mongo accepts it silently.
   This is intentional (Zitadel-as-truth) but worth noting for audit purposes.

6. **`fullMethod` and `request.userId` field names are hardcoded.** A schema change on Zitadel's
   side breaks silently — handler returns 200 with a warn log. Consider stricter required-field
   validation OR a schema version check.

## Files in this drill-down

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
