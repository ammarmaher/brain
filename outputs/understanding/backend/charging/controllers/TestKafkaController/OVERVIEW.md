# TestKafkaController — Drill-down

> File: `falcon-core-charging-svc/src/Falcon.Charging.Api/Controllers/TestKafkaController.cs` (~67 lines)
> A dev-only controller for verifying that the Kafka producer pipeline is wired correctly. Two endpoints, both `[AllowAnonymous]`. **Should not exist in production builds.**

## Purpose

Provides **two entry points**:

1. `POST /api/test/kafka/publish` — publishes a synthetic `TestEvent` with a caller-supplied `Message` body, returning the generated `eventId` and `referenceId`. Used to confirm:
   - Kafka producer connectivity to the broker
   - Schema Registry availability (since `TestEvent` is Avro-serialized in production)
   - Topic creation (the topic name is `commerce.test-event` per `appsettings.json:91`)
   - End-to-end latency from API → producer → topic

2. `GET /api/test/kafka/health` — returns the literal string `"Kafka test endpoint is healthy"`. A liveness probe for the Kafka subsystem of the Charging service. Distinct from `MapHealthChecks("/health")` which is the framework-level health endpoint.

## Architecture

Constructor injects:
- `IEventPublisher<TestEvent> _publisher`
- `ILogger<TestKafkaController> _logger`

The constructor uses defensive null-checks (`?? throw new ArgumentNullException`) — see `[CODE] TestKafkaController.cs:20-21`. This is **the only controller in Charging** with explicit null-checks; all others rely on the DI container's guaranteed-non-null semantics. Stylistic inconsistency.

`PublishTestEvent`:
1. Reads `request.Message` from POST body
2. Manually validates `request != null && !string.IsNullOrWhiteSpace(request.Message)` → returns `400 BadRequest` with literal string `"Message is required"` if invalid (does **not** use `FalconException` or `ServiceOperationResult`)
3. Constructs a `TestEvent { EventId = Guid.NewGuid().ToString(), ReferenceId = Guid.NewGuid().ToString(), Message = request.Message, OccurredAt = DateTimeOffset.Now.ToUnixTimeMilliseconds() }`
4. Calls `_publisher.PublishAsync(testEvent)` — fire-and-await, no retry, no `CancellationToken`
5. Logs success at `Information` level with both ids
6. Returns `200 OK` with anonymous object `{ eventId, referenceId }`
7. On exception: logs at `Error`, returns `500` with literal string `"Failed to publish event"`

`Health`:
- Returns `200 OK` with the literal string `"Kafka test endpoint is healthy"`. **Does not** actually verify Kafka connectivity — only confirms the controller is alive and routable.

## Authorization

Class level: `[AllowAnonymous]`. **No JWT required**. Anyone with network access to the API can publish synthetic Kafka events at unlimited rate. This is intentional for dev/test but represents an attack surface in production — anyone could fill the test topic, consume broker storage, or be misinterpreted by a downstream consumer.

## Namespace Bug — Copy-Paste From Commerce

This file is in the **wrong namespace**:

```csharp
// [CODE] TestKafkaController.cs:6
namespace Falcon.Commerce.Api.Controllers
```

Even though the file lives in `Falcon.Charging.Api.Controllers`. Likewise:

```csharp
// [CODE] TestEvent.cs:1
namespace Falcon.Commerce.Application.Events

// [CODE] IEventPublisher.cs:1
namespace Falcon.Commerce.Application.Interfaces.Messaging
```

All three files were copy-pasted from `falcon-core-commerce-svc` without updating their namespaces. The code compiles because C# does not enforce namespace-to-folder matching, but it makes IDE navigation confusing and pollutes the Commerce namespace tree inside the Charging assembly.

**Findings:**
- `Falcon.Commerce.Api.Controllers.TestKafkaController` exists inside the Charging Api assembly
- `Falcon.Commerce.Application.Events.TestEvent` exists inside the Charging Application assembly
- `Falcon.Commerce.Application.Interfaces.Messaging.IEventPublisher<T>` exists inside the Charging Application assembly

See [BRAIN-OUT] `_pending-questions/wave-5c-testkafka-namespace.md` to flag the cleanup to operator.

## No `ServiceOperationResult` Envelope

Both endpoints bypass the platform's standard envelope:

| Endpoint | Success Body | Error Body |
|---|---|---|
| `POST /api/test/kafka/publish` | `{ "eventId": "...", "referenceId": "..." }` | `"Message is required"` or `"Failed to publish event"` (raw string) |
| `GET /api/test/kafka/health` | `"Kafka test endpoint is healthy"` (raw string) | — |

A frontend consumer hitting these endpoints **must not** assume `ServiceOperationResult` shape. Any FE code that does `response.data.result` will read `undefined`.

## Code Smells / Findings

1. **Wrong namespace** — see "Namespace Bug" above.
2. **`[AllowAnonymous]`** — must be removed in production builds. There is no config gate (`Settings:TestKafka:Enabled`-style flag).
3. **Bypasses `ServiceOperationResult`** — the standard wrapper for every other endpoint in the platform.
4. **No `CancellationToken`** — `PublishAsync` will not be cancelled if the request is aborted.
5. **Raw error strings** — `"Message is required"` is not localized, has no error code, and cannot be mapped to a frontend message catalog.
6. **`DateTimeOffset.Now.ToUnixTimeMilliseconds()`** — uses local time, not UTC. Two service instances in different time zones will produce different `OccurredAt` values for the same instant. Should be `DateTimeOffset.UtcNow.ToUnixTimeMilliseconds()`.
7. **Defensive null-checks in constructor** — inconsistent with the rest of the codebase. DI guarantees non-null; the checks are dead code.
8. **`UnitOfWorkFilter` wraps these endpoints too** — global filter registration in `Program.cs:21` applies to every controller. The filter likely no-ops on `AllowAnonymous` reads, but verify it doesn't open a Mongo session for the synthetic Kafka publish.
9. **Mirrors Commerce's `TestKafkaController`** — same shape, same bugs. If/when Commerce removes its copy, this one should follow.

## Files Drilled

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
