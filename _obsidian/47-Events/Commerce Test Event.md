---
type: kafka-event
topic: commerce.test-event
channel: kafka
producer-service: 
consumer-services: [commerce, charging]
idempotency-documented: false
created: 2026-05-15
---
*** Event — Commerce Test Event (dev) ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/commerce.test-event.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Commerce Test Event

> Dev-only Kafka round-trip topic — Commerce and Charging each register a publisher + consumer; `TestKafkaController` (`AllowAnonymous`) fires it for connectivity verification.

## At a glance

- **Topic:** `commerce.test-event` (Kafka · no version suffix — convention violation)
- **Producers:** [[Commerce Service]] · [[Charging Service]] · `TestKafkaEventPublisher`
- **Consumers:** [[Commerce Service]] · [[Charging Service]] · `TestKafkaEventConsumer`
- **Trigger:** Manual hit on `TestKafkaController` (dev/test only)
- **Effect:** Log only

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/commerce.test-event.md)

## Related PRDs

- None.

## Related V-rules

- None.

## Gaps

- KAFKA-GAP-06 — dev topic in production config; `AllowAnonymous` on a publishing endpoint that's also in production code
- Topic name violates `.v<n>` versioning convention

## Tags

#type/kafka-event #service/charging #service/commerce #gap

## Hubs

- [[BACKEND_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
