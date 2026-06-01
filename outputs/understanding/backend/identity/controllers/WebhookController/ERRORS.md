# WebhookController — Errors

> The webhook is unusual: it does **not** throw `FalconException`. It returns either HTTP 401
> (signature failure) or HTTP 200 (success / silent-skip), or 500 (Mongo / cache outage).

## Per-endpoint error catalog

### 1. POST /api/webhook/zitadel

| HTTP status | Body                                    | When |
|---|---|---|
| 200 OK     | `ServiceOperationResult<object>(null)`  | Success path, OR payload anomaly tolerated (missing `fullMethod`, unrecognized method, missing `request.userId`, user not found) |
| 401 Unauthorized | (empty)                             | HMAC signature failed OR signing key missing in config OR `x-zitadel-signature` header empty |
| 500 Internal Server Error | unhandled-exception generic | Mongo or HybridCache failure |

**No 4xx other than 401 is ever returned.** There is no validation that fails with 400; there is no
business-rule that fails with 403/404/422. The webhook is designed as a "drop into our pipeline,
swallow noise, hard-reject only on bad credentials" receiver.

## Why no `FalconException` codes?

Most Identity endpoints route their failures through `FalconExceptionHandler` → typed error codes
+ localized messages. The webhook bypasses this entirely:
- A successful HMAC check + happy path → `Send.OkAsync(SOR.Success(null!))`.
- A failed HMAC check → `Send.UnauthorizedAsync(ct)` — raw 401 with no `ServiceOperationResult`.
- A malformed payload → log + 200 OK, **not** a typed error.

This means Zitadel never sees a Falcon error code. It either sees "OK, move on" or "401, my key is
wrong" — that's the entire contract.

## Failure modes that DO surface but as 200

These are silent in the sense that the response is 200 OK; they show up only in logs:

| Failure                                          | Log level | Logged message                                                          |
|---|---|---|
| missing `fullMethod`                              | Warning   | `"Zitadel webhook missing fullMethod property"`                          |
| unrecognized gRPC method                          | Info      | `"Zitadel webhook received unrecognized method: {Method}"`               |
| missing `request.userId`                          | Warning   | `"Zitadel webhook could not extract user ID for event {EventType}"`      |
| user with that `IdentityUserId` not in Mongo      | Warning   | `"Zitadel webhook: user with identity ID {IdentityUserId} not found"`    |
| event type matched but no case (unreachable today)| Info      | `"Unhandled webhook event type: {EventType}"`                            |

[CODE] `Endpoints/Webhooks/ZitadelWebhookEndpoint.cs:39, 49, 64, 72, 98, 141`

## HMAC signature failure handling

[CODE] `ZitadelWebhookEndpoint.cs:37-42`

```csharp
if (!ZitadelWebhookSignatureVerifier.Verify(signingKey, signature, body))
{
    logger.LogWarning("Zitadel webhook signature verification failed");
    await Send.UnauthorizedAsync(ct);
    return;
}
```

Raw 401, no body. **Zitadel's default behaviour**: do not retry 401 (treats it as an auth error
requiring operator intervention).

## Cache / DB outage

If `userRepository.UpdateOneAsync(...)` or `cache.RemoveAsync(...)` throws, the exception escapes
the handler unhandled → ASP.NET pipeline returns 500. Zitadel may retry; the next attempt could
succeed if the outage was transient. No deduplication is performed — a retried successful event
re-applies the same idempotent update.

## Operational considerations

- **No alerting hooks** in the handler itself. Operators must derive alerts from logs (Serilog →
  log aggregator → alert rules on "Zitadel webhook signature verification failed" frequency).
- **No DLQ.** Failed events are simply lost on retry exhaustion (per Zitadel's webhook retry
  policy).
- **No event-id dedupe.** A doubled webhook re-applies the same `Set(...)` write — idempotent so
  no corruption, but cache invalidation runs twice (cheap).
