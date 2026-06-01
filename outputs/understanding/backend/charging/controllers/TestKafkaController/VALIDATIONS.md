# TestKafkaController — Validations

## DTO-Level Validation

No `[Required]`, `[Range]`, `[ThrowIfNotPassed]`, FluentValidation, or any other DTO-level validation on `TestKafkaPublishRequest`.

## Inline Validation

The single validation lives inline in the action body:

```csharp
// [CODE] TestKafkaController.cs:27-30
if (request == null || string.IsNullOrWhiteSpace(request.Message))
{
    return BadRequest("Message is required");
}
```

| Condition | Behavior |
|---|---|
| `request == null` | Returns `400` with plain text `"Message is required"`. **In practice this branch is unreachable** — ASP.NET Core's model binding deserializes the body; a missing body becomes an empty object (`request.Message = ""`), not null. |
| `request.Message` null/empty/whitespace | Returns `400` with plain text `"Message is required"` |
| `request.Message == "   "` (whitespace) | Returns `400` (whitespace caught by `IsNullOrWhiteSpace`) |
| `request.Message == "valid string"` | Proceeds to publish |

The error response is **not** a `ServiceOperationResult.Failure(...)` — it is a raw `text/plain` body. Frontend handling diverges from every other Charging endpoint.

## Idempotency / Caching

No idempotency, no Redis cache. Each call generates fresh `EventId` and `ReferenceId` via `Guid.NewGuid()`. **Duplicate calls produce duplicate Kafka messages** — no deduplication at any layer.

## Optimistic Concurrency

Not applicable — no entity is mutated.

## Authorization

Class level: `[AllowAnonymous]`. No JWT validation. Anyone with network reachability can publish unlimited test events.

In production this is **a problem**:
- An attacker can fill the test topic and exhaust broker storage
- Downstream consumers (if any reach production) could be poisoned
- No audit trail of who published what

Recommended mitigations (none currently implemented):
- Gate behind `Settings:TestKafka:Enabled` like `TestingChargingController` does with `Settings:TestingCharging:Enabled`
- Require `[Authorize]` with a `Policy = "FalconAdmin"` claim
- Add per-IP rate limiting

## UnitOfWork Wrap

`UnitOfWorkFilter` (global on `AddControllers`) wraps both actions. The publish endpoint does not touch MongoDB at all, so the filter likely no-ops. The health endpoint also does not touch MongoDB. Verify `UnitOfWorkFilter` short-circuits on read-only / no-DB actions to avoid opening an idle Mongo session per call.

## CancellationToken

The action signature has **no `CancellationToken` parameter**, so `_publisher.PublishAsync(testEvent)` is called without a token. If the HTTP request is aborted mid-publish, the Kafka producer continues. For real endpoints that matter; for this dev-only endpoint it's an acceptable artifact.

## Resource Completeness

`app.ValidateErrrosResourceCompleteness()` does not affect this controller — it returns raw strings, not `FalconKeys.Error` codes.

## Try/Catch Handling

```csharp
// [CODE] TestKafkaController.cs:48-53
catch (Exception ex)
{
    _logger.LogError(ex, "Failed to publish test Kafka event");
    return StatusCode(500, "Failed to publish event");
}
```

Swallows **all** exceptions, including `OperationCanceledException` (which should propagate), `KafkaException` (which exposes specific error codes via `ex.Error.Code`), and any framework exceptions. The frontend sees only `500` with `"Failed to publish event"` — cannot distinguish broker-down from schema-registry-down from transient retry-exhausted.

## Multi-Language

The error strings (`"Message is required"`, `"Failed to publish event"`) are **hardcoded English**, not localized via `Accept-Language` or `ErrorLocalizer`. The endpoint is dev-only so this is acceptable.

## Validation Bug Summary

| Issue | Severity |
|---|---|
| No JWT required (`[AllowAnonymous]`) | High in production |
| Error bodies are raw strings, not envelopes | Medium (FE consistency) |
| No `CancellationToken` | Low |
| `request == null` branch unreachable | Cosmetic |
| Catch-all swallows specific Kafka errors | Medium (observability) |
| `DateTimeOffset.Now` instead of `UtcNow` | Low (time-zone drift) |
