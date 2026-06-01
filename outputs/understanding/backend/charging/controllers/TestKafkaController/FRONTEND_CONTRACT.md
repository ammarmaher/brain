# TestKafkaController — Frontend Contract

## Public URLs

Via **Core Gateway** (client users):

```
POST /charging/test/kafka/publish
GET  /charging/test/kafka/health
```

Via **System Gateway** (Falcon admins) — same paths with `<system-gateway>/charging/...` prefix.

**Note** — `[AllowAnonymous]` means the gateway does not need to validate JWT for these routes. If the gateway is configured to strip or require auth headers, verify that the test endpoints are explicitly allowlisted.

## Headers

| Header | Required | Effect |
|---|---|---|
| `Authorization: Bearer <jwt>` | **no** | Class-level `[AllowAnonymous]` — token ignored |
| `Content-Type: application/json` | yes for `/publish` | Required for JSON body parsing |
| `Accept-Language` | no | Errors are hardcoded English |

## Request (Publish)

```jsonc
POST /charging/test/kafka/publish
Content-Type: application/json

{
  "message": "hello from FE"
}
```

## Response (Publish — Success)

```jsonc
HTTP/1.1 200 OK
Content-Type: application/json

{ "eventId": "<guid>", "referenceId": "<guid>" }
```

Note: **NOT** wrapped in `ServiceOperationResult`. A standard Falcon FE HTTP client that auto-unwraps `response.data.result` will read `undefined`.

## Response (Publish — 400)

```
HTTP/1.1 400 Bad Request
Content-Type: text/plain

Message is required
```

## Response (Publish — 500)

```
HTTP/1.1 500 Internal Server Error
Content-Type: text/plain

Failed to publish event
```

## Response (Health)

```
HTTP/1.1 200 OK
Content-Type: text/plain

Kafka test endpoint is healthy
```

## Frontend Sample — Publish

```typescript
type TestKafkaResponse = { eventId: string; referenceId: string };

const response = await api.post<TestKafkaResponse>(
  '/charging/test/kafka/publish',
  { message: 'hello' },
  { headers: { 'Content-Type': 'application/json' } }
);

const { eventId, referenceId } = response.data;
console.log('Published', { eventId, referenceId });
```

**Caution** — if your FE HTTP client has a global response interceptor that expects `ServiceOperationResult` shape, you must bypass it for this URL. Otherwise the interceptor will treat success as failure (no `isSuccessful` flag) and surface a fake error.

## Frontend Sample — Health

```typescript
const health = await api.get<string>(
  '/charging/test/kafka/health',
  { responseType: 'text' }   // important: force text, not JSON
);

if (health.data === 'Kafka test endpoint is healthy') {
  // controller is alive — does NOT mean Kafka is alive
}
```

The health endpoint does **not** actually probe Kafka. A `200` here only tells you the Charging API is up and the controller is loaded. For actual Kafka liveness, the FE should use the framework `/health` endpoint at `GET /charging/health` which runs the real health checks.

## When to Use This Controller

| Scenario | Use? |
|---|---|
| Dev verification of Kafka producer wiring | yes |
| Local-stack integration test that needs a sample event on the bus | yes |
| Production debugging of "is Kafka publishing working" | **no** — controller may be removed/disabled |
| Real business event publication | **no** — use the real domain endpoints (e.g. `POST /charging/Wallet/debit`) |

## Idempotency

**None**. Two calls with the same message produce two distinct Kafka messages with distinct `EventId`/`ReferenceId`. If the FE retries a 500, expect duplicates on the bus.

## Display Patterns

| Visual | What to Show |
|---|---|
| Success | `Event published: {eventId}` (developer-facing only) |
| 400 | Inline `"Message is required"` |
| 500 | Generic "Kafka publish failed — check service logs" |
| Health 200 | Green dot — but warn it's only the controller, not Kafka |

## Error Surface

| HTTP Status | Body Type | Frontend Action |
|---|---|---|
| 200 | JSON `{eventId, referenceId}` (publish) or text (health) | Success |
| 400 | text `"Message is required"` | Inline validation |
| 500 | text `"Failed to publish event"` | Toast generic error |

## Production Caveats

This controller is **not intended for production**. If the FE depends on it for any user-visible flow, the build will break in production once the controller is removed or gated. Use only in:

- Local dev (`Development` ASP.NET Core environment)
- QA test harnesses driving deliberate Kafka traffic
- Smoke-test scripts in CI

Production FE features that need to confirm Kafka publishing must instead trigger a real domain action (e.g. `POST /charging/Wallet/debit`) and rely on standard ledger / event projections to validate the message landed.

## OpenAPI / Swagger

The controller is visible in `https://localhost:7224/swagger` in dev. Both endpoints will be listed under the `TestKafka` group (or similar — depends on Swagger generator settings; class is named `TestKafkaController` so `TestKafka` is the likely tag).
