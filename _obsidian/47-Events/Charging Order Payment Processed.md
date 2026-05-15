---
type: kafka-event
topic: charging.order-payment-processed.v1
channel: kafka
producer-service: charging
consumer-services: [commerce]
idempotency-documented: true
created: 2026-05-15
---
*** Event — Charging Order Payment Processed ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/charging.order-payment-processed.v1.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Charging Order Payment Processed

> Charging confirms order payment result; Commerce updates order status.

## At a glance

- **Topic:** `charging.order-payment-processed.v1` (Kafka · Avro)
- **Producer:** [[Charging Service]] · `FalconServiceOrderPaymentProcessedEventPublisher`
- **Consumer:** [[Commerce Service]] · `FalconServiceOrderPaymentProcessedEventConsumer`
- **Trigger:** Charging finishes processing [[Commerce Order Created]] (success or failure)

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/charging.order-payment-processed.v1.md)

## Related PRDs

- [[01 Account Management]] · [[03 Contract Packaging Charging Billing]]

## Related V-rules

- [[V-charging-insufficient-balance]] · [[V-charging-no-applicable-rate]]

## Gaps

- Reverse-flow payload shape not surfaced — success vs failure FE contract unclear
- Commerce consumer idempotency not documented

## Tags

#type/kafka-event #prd/01 #prd/03 #service/charging #service/commerce

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
