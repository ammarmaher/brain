# TestKafkaController — Endpoints

> Class route prefix: `/api/test/kafka` (hardcoded in `[Route("api/test/kafka")]`, **not** the `[controller]` token convention). Class-level `[AllowAnonymous]`. Endpoints **do not** return `ServiceOperationResult<T>`.

| Method | Route | Action | Request | Response | Handler |
|---|---|---|---|---|---|
| POST | `/api/test/kafka/publish` | `PublishTestEvent` | `TestKafkaPublishRequest { Message: string }` | `{ eventId: string, referenceId: string }` | `IEventPublisher<TestEvent>.PublishAsync(...)` |
| GET | `/api/test/kafka/health` | `Health` | (none) | `"Kafka test endpoint is healthy"` (raw string) | — (no handler) |

## Verb Convention

The class route is **literal** (`api/test/kafka`), not derived from `[controller]`. Frontend URLs:

```
POST /charging/test/kafka/publish
GET  /charging/test/kafka/health
```

## Request Body (Publish)

```jsonc
{ "message": "anything goes here" }
```

## Response Body (Publish — Success)

```jsonc
{
  "eventId": "<guid>",
  "referenceId": "<guid>"
}
```

Both ids are server-generated `Guid.NewGuid().ToString()`. The caller does **not** control either. The Kafka `OccurredAt` is also server-generated as `DateTimeOffset.Now.ToUnixTimeMilliseconds()` (note: local time, not UTC — see OVERVIEW finding #6).

## Response Body (Publish — Errors)

| HTTP Status | Body | Trigger |
|---|---|---|
| 400 | `"Message is required"` (raw string) | `request == null \|\| string.IsNullOrWhiteSpace(request.Message)` |
| 500 | `"Failed to publish event"` (raw string) | Any exception from `_publisher.PublishAsync` |

The error bodies are **plain text strings**, not JSON envelopes. The Content-Type returned by `BadRequest(string)` / `StatusCode(500, string)` is `text/plain`.

## Response Body (Health)

```
Kafka test endpoint is healthy
```

Raw `text/plain`. The endpoint does **not** actually probe Kafka — it only confirms the controller is loaded and routable.

## Kafka Topic

The `TestEvent` is published to the topic configured at `Settings:Kafka:Topics:TestKafkaEvent`. In `appsettings.json:91` the default is `"commerce.test-event"` — a Commerce-namespaced topic name, even though the producer lives in Charging. This is intentional shared infrastructure (both services publish to the same test topic) and an artifact of the original copy-paste.

## Endpoint Count

- GET: 1
- POST: 1
- Total: 2

## Aliases / Mirrors

This controller is a one-to-one copy of Commerce's `TestKafkaController`. Both services publish to the same `commerce.test-event` topic, so a `PublishAsync` call against either service produces an indistinguishable message on the bus.

## Routing Verification

Test from terminal:

```bash
# Health
curl http://localhost:7224/api/test/kafka/health
# → 200 OK, body: "Kafka test endpoint is healthy"

# Publish (no auth needed)
curl -X POST http://localhost:7224/api/test/kafka/publish \
  -H "Content-Type: application/json" \
  -d '{"message":"hello"}'
# → 200 OK, body: {"eventId":"<guid>","referenceId":"<guid>"}
```
