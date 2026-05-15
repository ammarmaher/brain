*** Kafka Event — Commerce Test Event (dev) ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: commerce/SERVICE_OVERVIEW.md + charging/SERVICE_OVERVIEW.md ***

# commerce.test-event

> Dev-only Kafka round-trip topic. Both Commerce and Charging register a publisher + consumer for this topic, used to verify Kafka connectivity from a `TestKafkaController` endpoint (`AllowAnonymous`, dev/test only).

## Topic / channel

- **Topic name (verbatim):** `commerce.test-event`
- **Channel type:** Kafka (no `.v1` suffix — convention violation; production topics all carry version)
- **Schema:** Likely Avro (using the same Schema Registry pipeline) but the payload is a free-form test struct.

## Producer

- **Service:** [[Commerce Service]] · [[Charging Service]]
- **Publisher class:** `TestKafkaEventPublisher` (Charging) — Commerce side likely has a symmetric class.
- **Trigger:** Manual hit on `TestKafkaController` endpoints in either service. Charging's controller is documented in SERVICE_OVERVIEW as having **2 endpoints, `AllowAnonymous`, dev/test only**.
- **Payload shape:** Dev-only payload — likely `{ Message, Timestamp, From }`. Not documented and not load-bearing.

## Consumer(s)

- **Service:** [[Commerce Service]] · [[Charging Service]] — `TestKafkaEventConsumer` on each side.
  - Logs the message; no business effect.

## Idempotency

- n/a (no business effect)

## Error path

- n/a (no business effect; dev-only)

## Side effects (chain)

- Logs only.

## Related PRDs

- None — dev tooling.

## Related V-rules

- None.

## Related entity reconciliation

- None.

## Gaps / drift

- **KAFKA-GAP-06 (LOW)** — Dev topic is registered in production config. Either: (a) gate the `TestKafkaController` registration behind an environment flag (Development-only), (b) gate the publisher/consumer registration similarly, or (c) remove pre-production. `AllowAnonymous` on a publishing endpoint that lives in production code is also a concern (no auth needed to fire Kafka events from outside).
- Topic name violates the `.v<n>` versioning convention used by every other topic.

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
