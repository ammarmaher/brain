*** Event — Contact Group Import Requested ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/contactgroup.import-requested.v1.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Contact Group Import Requested

> Upload-session finalized; Contact Group self-consumes for async-durable import processing.

## At a glance

- **Topic:** `contactgroup.import-requested.v1` (Kafka · Avro)
- **Producer:** [[Contact Group Service]] · `ImportJobRequestedEventPublisher`
- **Consumer:** [[Contact Group Service]] (self) · `ImportJobRequestedConsumer` (group `contactgroup-service`)
- **External downstream:** "Likely campaign tooling" — not in 9-service inventory
- **Trigger:** Successful 4-step Create Contact Group wizard submit

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/contactgroup.import-requested.v1.md)

## Related PRDs

- [[04 Contact Group Management]]

## Related V-rules

- [[V-contact-group-file-type-allowlist]] · [[V-contact-group-file-size-cap]] · [[V-contact-group-name-required-format]] · [[V-contact-group-column-name-shape]]

## Gaps

- KAFKA-GAP-10 — no documented external consumer (campaign tooling)
- Self-consume pattern is unusual — verify consumer group is intentional

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
