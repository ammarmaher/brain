---
type: kafka-event
topic: identity.user-events.v1
channel: kafka
producer-service: identity
consumer-services: [access-pes]
idempotency-documented: false
created: 2026-05-15
---
*** Event — Identity User Events ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/identity.user-events.v1.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Identity User Events

> User lifecycle events (created / deleted / role-changed) → Access PES syncs role/policy tables.

## At a glance

- **Topic:** `identity.user-events.v1` (Kafka · Avro — `UserRoleLinkSyncRequestedAvroEvent`)
- **Producer:** [[Identity Service]] · `UserRoleLinkSyncRequestedEventPublisher`
- **Consumer:** [[Access PES Service]] · `UserRoleLinkSyncRequestedConsumer` (group `falcon-pes-svc`)
- **Trigger:** User created · deleted · role changed
- **Speculative consumer:** [[Charging Service]] — Identity overview claims it; Charging overview does not enumerate

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/identity.user-events.v1.md)

## Related PRDs

- [[02 User Management]] · (all PRDs via cross-cutting permission)

## Related V-rules

- [[V-username-format-uniqueness-immutable]]

## Gaps

- Charging-side consumer ambiguity — verify
- Avro event class named but field detail not in DTO_DICTIONARY

## Tags

#type/kafka-event #prd/02 #service/access #service/charging #service/identity

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
