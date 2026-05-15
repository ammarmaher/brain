---
type: kafka-event
topic: identity.user-checker-assigned.v1
channel: kafka
producer-service: identity
consumer-services: [templates]
idempotency-documented: false
created: 2026-05-15
---
*** Event — Identity User Checker Assigned ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/identity.user-checker-assigned.v1.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Identity User Checker Assigned

> User assigned as a Checker (PRD-05 Maker/Checker); Templates updates its `UserCheckerLevel` projection.

## At a glance

- **Topic:** `identity.user-checker-assigned.v1` (Kafka · Avro)
- **Producer:** [[Identity Service]] *(inferred — producer-side docs gap)*
- **Consumer:** [[Templates Service]] · `UserCheckerAssignedEventConsumer`
- **Trigger:** Add User Tab 3 (Roles) Checker assignment · explicit Maker/Checker management flow

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/identity.user-checker-assigned.v1.md)

## Related PRDs

- [[05 Templates]] · [[02 User Management]]

## Related V-rules

- [[V-template-checker-level-integrity]] · [[V-template-levels-count-required-for-restricted]]

## Gaps

- KAFKA-GAP-05 — Identity SERVICE_OVERVIEW does not enumerate this on the produce side
- Bulk variant: [[Identity User Checker Assignments Updated]]

## Tags

#type/kafka-event #prd/02 #prd/05 #service/identity #service/templates #gap

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
