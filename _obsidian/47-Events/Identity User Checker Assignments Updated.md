*** Event — Identity User Checker Assignments Updated (bulk) ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/identity.user-checker-assignments-updated.v1.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Identity User Checker Assignments Updated

> Bulk variant of [[Identity User Checker Assigned]] — Templates re-syncs many user-checker mappings at once.

## At a glance

- **Topic:** `identity.user-checker-assignments-updated.v1` (Kafka · Avro)
- **Producer:** [[Identity Service]] *(inferred — producer-side docs gap)*
- **Consumer:** [[Templates Service]] · `UserCheckerAssignmentsUpdatedEventConsumer`
- **Trigger:** Bulk re-assignment operation (tenant-level reorg, role-template change)

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/identity.user-checker-assignments-updated.v1.md)

## Related PRDs

- [[05 Templates]]

## Related V-rules

- [[V-template-checker-level-integrity]] · [[V-template-levels-count-required-for-restricted]]

## Gaps

- KAFKA-GAP-05 — producer-side docs gap
- Bulk partial-failure semantics undefined
- No version/ordering scheme for concurrent bulks documented

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
