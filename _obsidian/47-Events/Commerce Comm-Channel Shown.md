*** Event — Commerce Comm-Channel Shown ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/commerce.comm-channel-shown.v1.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Commerce Comm-Channel Shown

> CommChannel made visible — Charging may allocate channel-scoped sub-wallet.

## At a glance

- **Topic:** `commerce.comm-channel-shown.v1` (Kafka · Avro)
- **Producer:** [[Commerce Service]] · `CommChannelShownEventPublisher`
- **Consumer:** [[Charging Service]] · `CommChannelShownEventConsumer`
- **Trigger:** `PUT /commerce/Node/comm-channel/visibility` flip to visible

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/commerce.comm-channel-shown.v1.md)

## Related PRDs

- [[01 Account Management]] · [[03 Contract Packaging Charging Billing]]

## Related V-rules

- [[V-service-visibility-pricing-required]]

## Gaps

- Paired with [[Commerce Comm-Channel Visibility Changed]] (Templates-side); risk of these getting out of sync
- Idempotency not documented

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
