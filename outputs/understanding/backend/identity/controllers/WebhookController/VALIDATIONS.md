# WebhookController — Validations

> No FluentValidation (raw body, no model binding). No domain policies (Zitadel-as-truth — see
> OVERVIEW). Validation reduces to two checks: HMAC signature + payload shape.

## FluentValidation

**None.** No validator class exists for the webhook payload. By design — see DTOS.md.

## HMAC signature verification

[CODE] `Infrastructure/Identity/ZitadelWebhookSignatureVerifier.cs:18-31`

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

| Outcome              | Returns | Action |
|---|---|---|
| empty signing key (config missing) | `false` | reject all webhooks until config set |
| empty signature header             | `false` | HTTP 401 |
| HMAC mismatch                      | `false` | HTTP 401 |
| HMAC match                         | `true`  | proceed |

## Payload shape checks

[CODE] `Endpoints/Webhooks/ZitadelWebhookEndpoint.cs:46-77`

```csharp
// 1) fullMethod required
if (!root.TryGetProperty("fullMethod", out var methodElement)) {
    logger.LogWarning("Zitadel webhook missing fullMethod property");
    await Send.OkAsync(...);   // tolerate
    return;
}

// 2) fullMethod must be a non-empty string
var grpcMethod = methodElement.GetString();
if (string.IsNullOrEmpty(grpcMethod)) {
    await Send.OkAsync(...);
    return;
}

// 3) grpcMethod must map to a known event type
var eventType = ZitadelEventMapper.MapToEventType(grpcMethod);
if (eventType is null) {
    logger.LogInformation("Zitadel webhook received unrecognized method: {Method}", grpcMethod);
    await Send.OkAsync(...);
    return;
}

// 4) request.userId must be present + non-empty
var identityUserId = ExtractUserId(root);
if (string.IsNullOrEmpty(identityUserId)) {
    logger.LogWarning("Zitadel webhook could not extract user ID for event {EventType}", eventType);
    await Send.OkAsync(...);
    return;
}
```

**Validation philosophy**: tolerate (200 OK + log) rather than reject. The webhook side is a
sender we can't influence; a 4xx or 5xx response prompts Zitadel to retry, which would compound a
schema mismatch into a thundering-herd issue. Better to log and move on.

## User lookup as implicit validation

[CODE] `ZitadelWebhookEndpoint.cs:95-100`

```csharp
var user = await userRepository.GetAsync(u => u.IdentityUserId == identityUserId && !u.IsDeleted);
if (user is null)
{
    logger.LogWarning("Zitadel webhook: user with identity ID {IdentityUserId} not found", identityUserId);
    return;
}
```

User not found / soft-deleted → log warn, return without updating. (Endpoint then still
invalidates the cache key — harmless but technically wasted work.)

## Cross-cutting checks

- **No `UserStatusTransitionPolicy`** — Zitadel-as-truth. See OVERVIEW finding #5.
- **No `LoginEligibilityPolicy`** — webhook isn't a login.
- **No IP allowlist** — webhook IPs are unpredictable; signature is the trust anchor.

## Deviations from platform standards

- All other endpoints use FluentValidation. Webhook uses raw JSON parsing + hand-rolled validation
  — necessary because we read bytes for HMAC.
- The "200 OK on bad payload" rule is unusual but appropriate for a webhook receiver.
