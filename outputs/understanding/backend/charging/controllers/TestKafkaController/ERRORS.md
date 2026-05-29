# TestKafkaController — Errors

> Subset of [`charging/ERRORS.md`](../../ERRORS.md). This controller does **not** use the `FalconKeys.Error` system — see notes below.

## Endpoint Coverage

| Endpoint | HTTP Status | Body | Trigger |
|---|---|---|---|
| `POST /api/test/kafka/publish` | 200 | `{ eventId, referenceId }` | Successful publish |
| `POST /api/test/kafka/publish` | 400 | `"Message is required"` (plain text) | `request == null \|\| IsNullOrWhiteSpace(request.Message)` |
| `POST /api/test/kafka/publish` | 500 | `"Failed to publish event"` (plain text) | Any exception from `_publisher.PublishAsync` |
| `GET /api/test/kafka/health` | 200 | `"Kafka test endpoint is healthy"` (plain text) | Always |

## Not Using `FalconException` / `FalconKeys.Error`

Every other controller in Charging throws `FalconException(new FalconError(FalconKeys.Error.X))` and lets the exception handler middleware translate the code into a localized message and an HTTP status. `TestKafkaController` **does not** — it returns raw `text/plain` strings inline.

Consequence: a generic FE error handler that expects `response.data.errorMessages: string[]` (the `ServiceOperationResult.Failure` shape) will read `undefined` and fall through to "unknown error" UI.

## Auth Errors

Class-level `[AllowAnonymous]` — there is **no 401 or 403** path. Both endpoints accept any request, authenticated or not.

## Internal Errors — Catch Behavior

```csharp
// [CODE] TestKafkaController.cs:48-53
catch (Exception ex)
{
    _logger.LogError(ex, "Failed to publish test Kafka event");
    return StatusCode(500, "Failed to publish event");
}
```

| Underlying Exception | Surfaced As | Lost Information |
|---|---|---|
| `KafkaException { Error.Code = BrokerNotAvailable }` | `500 "Failed to publish event"` | Broker error code, broker-side message |
| `SchemaRegistryException` | `500 "Failed to publish event"` | Registry error code, schema id |
| `TimeoutException` | `500 "Failed to publish event"` | Configured timeout vs actual elapsed |
| `OperationCanceledException` (client abort) | `500 "Failed to publish event"` | (Should propagate as 499 Client Closed Request) |
| `ArgumentException` (invalid Avro schema state) | `500 "Failed to publish event"` | Argument name + message |

The server-side log retains the full exception object (`_logger.LogError(ex, ...)`), so investigators can grep logs by `EventId` if the caller captured one in advance — but since `EventId` is server-generated *after* validation but *before* publish, an exception in `PublishAsync` may or may not leave the event id retrievable from logs depending on whether the log line was emitted before the failure.

## No Idempotency Errors

Because there is no idempotency check, there is no "duplicate" branch. Calling `/publish` twice produces two independent Kafka messages with distinct ids.

## No Domain Errors

Because there is no business logic, there is no `InvalidAmount`, `WalletNotFound`, `InsufficientBalance`, etc.

## Frontend Error Surface

| HTTP Status | Backend Body Shape | Frontend Action |
|---|---|---|
| 200 | `{ eventId: string, referenceId: string }` (JSON) | Confirm to user "event published" |
| 400 | `"Message is required"` (plain text) | Show "message required" inline error |
| 500 | `"Failed to publish event"` (plain text) | Show generic "Kafka publish failed" |

Because the body is `text/plain`, the FE HTTP client must read `response.data` as a string when status is 400 or 500, and as a JSON object when status is 200. Most generic interceptors do this automatically — but verify with the Falcon HTTP layer if it forces JSON parse and fails on plain text.

## Production-Readiness

This controller is **not production-ready**. Recommended:

1. Wrap with `Settings:TestKafka:Enabled` gate, default `false` outside local/QA.
2. Add `[Authorize]` with a Falcon-admin policy.
3. Convert error bodies to `ServiceOperationResult.Failure` envelope with proper `FalconKeys.Error.*` codes.
4. Add explicit catch for `KafkaException` to surface broker error to the caller for diagnosis.
5. Inject `CancellationToken` and propagate to `PublishAsync`.

See [BRAIN-OUT] `_pending-questions/wave-5c-testkafka-namespace.md` for the namespace cleanup (which is orthogonal to but should ride along with the above).
