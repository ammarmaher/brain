---
type: kafka-event
topic: commerce.contract-lifecycle.v1
channel: kafka
producer-service: 
consumer-services: [charging]
idempotency-documented: true
created: 2026-05-15
---
*** Event — Commerce Contract Lifecycle ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/commerce.contract-lifecycle.v1.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Commerce Contract Lifecycle

> Contract status transitioned — Activated or Expired. Charging updates its `ContractLifecycleProjection`.

## At a glance

- **Topic:** `commerce.contract-lifecycle.v1` (Kafka · Avro)
- **Producers:** [[Commerce Service]] · `ContractActivatedEventPublisher` · `ContractExpiredEventPublisher` (two publishers, one topic — likely EventType discriminator)
- **Consumer:** [[Charging Service]] · `ContractLifecycleEventConsumer`
- **Trigger:** Contract status scheduler (StartDate reached → Active · ExpirationDate reached → Expired)

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/commerce.contract-lifecycle.v1.md)

## Related PRDs

- [[03 Contract Packaging Charging Billing]]

## Related V-rules

- [[V-contract-expiration-after-start]] · [[V-contract-edit-status-aware-fields]]

## Gaps

- Two publishers / one topic — verify Avro union or discriminator dispatching is correct
- Consumer idempotency by ContractId is conventional but undocumented

## Tags

#type/kafka-event #prd/03 #service/charging #service/commerce

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
