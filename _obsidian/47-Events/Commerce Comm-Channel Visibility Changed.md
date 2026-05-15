---
type: kafka-event
topic: commerce.comm-channel-visibility-changed.v1
channel: kafka
producer-service: commerce
consumer-services: [templates]
idempotency-documented: false
created: 2026-05-15
---
*** Event — Commerce Comm-Channel Visibility Changed ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/commerce.comm-channel-visibility-changed.v1.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Commerce Comm-Channel Visibility Changed

> Visibility flag flipped on a comm-channel; Templates updates its projection.

## At a glance

- **Topic:** `commerce.comm-channel-visibility-changed.v1` (Kafka · Avro)
- **Producer:** [[Commerce Service]] *(inferred — producer-side docs gap)*
- **Consumer:** [[Templates Service]] · `CommChannelVisibilityChangedEventConsumer`
- **Trigger:** `PUT /commerce/Node/comm-channel/visibility`

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/commerce.comm-channel-visibility-changed.v1.md)

## Related PRDs

- [[05 Templates]] · [[01 Account Management]]

## Related V-rules

- (none — projection update is unvalidated)

## Gaps

- Producer-side docs gap (same shape as [[Commerce Comm-Channel Init]])
- Paired with [[Commerce Comm-Channel Shown]] (Charging-side); two events from one trigger — fragility risk

## Tags

#type/kafka-event #prd/01 #prd/05 #service/commerce #service/templates #gap

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
