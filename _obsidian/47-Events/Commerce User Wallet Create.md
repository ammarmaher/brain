---
type: kafka-event
topic: commerce.user-wallet-create.v1
channel: kafka
producer-service: commerce
consumer-services: [charging]
idempotency-documented: true
created: 2026-05-15
---
*** Event — Commerce User Wallet Create ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/commerce.user-wallet-create.v1.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Commerce User Wallet Create

> Commerce signals a new user to Charging so a per-user sub-wallet is materialized.

## At a glance

- **Topic:** `commerce.user-wallet-create.v1` (Kafka · Avro)
- **Producer:** [[Commerce Service]] · `UserCreatedEventPublisher`
- **Consumer:** [[Charging Service]] · `UserCreatedEventConsumer`
- **Trigger:** After [[Commerce User Creation Requested]] succeeds AND wallet allocation is required for the user

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/commerce.user-wallet-create.v1.md)

## Related PRDs

- [[01 Account Management]] · [[03 Contract Packaging Charging Billing]]

## Related V-rules

- [[V-charging-insufficient-balance]] · [[V-account-limits-zero-means-no-limit]]

## Gaps

- Publisher class name collides with `UserCreationRequestedEventPublisher` (different topic, similar name)
- Consumer idempotency not documented
- Shared consumer group with Commerce (`commerce-service`) — KAFKA-GAP-02

## Tags

#type/kafka-event #prd/01 #prd/03 #service/charging #service/commerce #gap

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
