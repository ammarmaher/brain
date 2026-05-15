---
type: kafka-event
topic: commerce.comm-channel-init.v1
channel: kafka
producer-service: commerce
consumer-services: [templates]
idempotency-documented: true
created: 2026-05-15
---
*** Event — Commerce Comm-Channel Init ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/commerce.comm-channel-init.v1.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Commerce Comm-Channel Init

> Commerce creates a new comm-channel for a tenant; Templates materializes the default CommunicationChannelConfig row.

## At a glance

- **Topic:** `commerce.comm-channel-init.v1` (Kafka · Avro)
- **Producer:** [[Commerce Service]] *(inferred — producer-side docs gap)*
- **Consumer:** [[Templates Service]] · `CommChannelInitEventConsumer`
- **Trigger:** New comm-channel provisioned (verify exact orchestrator path)

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/commerce.comm-channel-init.v1.md)

## Related PRDs

- [[05 Templates]] · [[01 Account Management]]

## Related V-rules

- [[V-template-checker-level-integrity]] · [[V-template-levels-count-required-for-restricted]] (apply on subsequent updates)

## Gaps

- Producer-side docs gap — Commerce SERVICE_OVERVIEW doesn't enumerate this on the produce side
- Consumer idempotency not documented

## Tags

#type/kafka-event #prd/01 #prd/05 #service/commerce #service/templates #gap

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
