# TestKafkaController — DTOs

See [`../../DTO_DICTIONARY.md`](../../DTO_DICTIONARY.md) for the full Charging dictionary. The subset relevant to `TestKafkaController`:

## Request DTOs

```csharp
// [CODE] TestKafkaController.cs:63
public class TestKafkaPublishRequest
{
    public string Message { get; set; } = string.Empty;
}
```

Note: declared **inside the same file** as the controller (not in `Falcon.Charging.Contracts.Models.RequestsDtos` like every other request DTO). Stylistic anti-pattern — should live in the Contracts project so the FE TypeScript generator can pick it up.

| DTO | Fields | Endpoint |
|---|---|---|
| `TestKafkaPublishRequest` | `string Message` | `POST /api/test/kafka/publish` |

## Response DTOs

There are **no response DTO classes**. Both endpoints return raw shapes constructed inline:

| Endpoint | Response Shape | Type |
|---|---|---|
| `POST /publish` (success) | `new { eventId, referenceId }` | anonymous object → JSON |
| `POST /publish` (400) | `"Message is required"` | raw `string` |
| `POST /publish` (500) | `"Failed to publish event"` | raw `string` |
| `GET /health` | `"Kafka test endpoint is healthy"` | raw `string` |

No `ServiceOperationResult` envelope.

## Kafka Event Model

```csharp
// [CODE] TestEvent.cs:3
public class TestEvent
{
    public string EventId { get; set; } = string.Empty;
    public string ReferenceId { get; set; } = string.Empty;
    public long OccurredAt { get; set; }
    public string Message { get; set; } = string.Empty;
}
```

**Namespace bug** — declared as `namespace Falcon.Commerce.Application.Events` even though it physically lives in `falcon-core-charging-svc/src/Falcon.Charging.Application/Events/`. See [BRAIN-OUT] `_pending-questions/wave-5c-testkafka-namespace.md`.

## Publisher Interface

```csharp
// [CODE] IEventPublisher.cs:3
public interface IEventPublisher<in T>
{
    Task PublishAsync(T @event, CancellationToken? cancellationToken = default);
}
```

Also in the **wrong namespace** (`Falcon.Commerce.Application.Interfaces.Messaging`). The implementation (Kafka producer) is registered in Infrastructure DI and serializes `TestEvent` via Avro before publishing.

## Internal — No Command / No Query

This controller has no command or query type. It directly constructs the event in the action and calls the publisher. No CQRS handler, no domain logic, no UnitOfWork participation (the publisher pushes directly to Kafka, not through the outbox pattern used by real Charging events).

## Field-By-Field Trace

| Wire Field (Request) | C# Type | Action Variable | Kafka Event Field |
|---|---|---|---|
| `message` | `string` | `request.Message` | `testEvent.Message` |
| — | — | `Guid.NewGuid().ToString()` | `testEvent.EventId` |
| — | — | `Guid.NewGuid().ToString()` | `testEvent.ReferenceId` |
| — | — | `DateTimeOffset.Now.ToUnixTimeMilliseconds()` | `testEvent.OccurredAt` |

`EventId` and `ReferenceId` are also surfaced back to the caller in the response body — useful for the caller to correlate against the bus.

`OccurredAt` is **not** returned to the caller, and uses **local time** (`Now`) not UTC. Bug.

## DTO Namespace Inventory (Bug Summary)

| File | Physical Location | Declared Namespace | Correct Namespace |
|---|---|---|---|
| `TestKafkaController.cs` | `Falcon.Charging.Api/Controllers/` | `Falcon.Commerce.Api.Controllers` | `Falcon.Charging.Api.Controllers` |
| `TestEvent.cs` | `Falcon.Charging.Application/Events/` | `Falcon.Commerce.Application.Events` | `Falcon.Charging.Application.Events` |
| `IEventPublisher.cs` | `Falcon.Charging.Application/Interfaces/Messaging/` | `Falcon.Commerce.Application.Interfaces.Messaging` | `Falcon.Charging.Application.Interfaces.Messaging` |

All three should be renamed in a follow-up cleanup. The TestKafka stack works only because C# does not enforce namespace-to-folder matching.
