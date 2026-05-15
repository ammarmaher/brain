---
type: kafka-event
topic: commerce.order-created.v1
channel: kafka
producer-service: commerce
consumer-services: [charging]
idempotency-documented: true
created: 2026-05-15
---
*** Event — Commerce Order Created ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/commerce.order-created.v1.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Commerce Order Created

> Service-order placed via "Do Payment"; Charging picks up payment processing asynchronously.

## At a glance

- **Topic:** `commerce.order-created.v1` (Kafka · Avro)
- **Producer:** [[Commerce Service]] · `FalconServiceOrderCreatedEventPublisher`
- **Consumer:** [[Charging Service]] · `FalconServiceOrderCreatedEventConsumer`
- **Trigger:** `POST /commerce/Node/comm-channel/do-payment`
- **Reverse event:** [[Charging Order Payment Processed]] (Charging → Commerce)

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/commerce.order-created.v1.md)

## Related PRDs

- [[03 Contract Packaging Charging Billing]] · [[01 Account Management]]

## Related V-rules

- [[V-charging-insufficient-balance]] · [[V-charging-no-applicable-rate]]

## Gaps

- Reverse-event payload shape not surfaced
- Consumer idempotency on `OrderId` is conventional but not documented

## Tags

#type/kafka-event #prd/01 #prd/03 #service/charging #service/commerce

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
