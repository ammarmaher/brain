---
type: kafka-event
topic: commerce.wallet-configured.v1
channel: kafka
producer-service: commerce
consumer-services: [charging]
idempotency-documented: true
created: 2026-05-15
---
*** Event — Commerce Wallet Configured ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/commerce.wallet-configured.v1.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Commerce Wallet Configured

> Account-level wallet settings configured (master / per-channel / per-owner mode, currency); Charging materializes wallet structure.

## At a glance

- **Topic:** `commerce.wallet-configured.v1` (Kafka · Avro)
- **Producer:** [[Commerce Service]] · `WalletConfiguredEventPublisher`
- **Consumer:** [[Charging Service]] · `WalletConfiguredEventConsumer`
- **Trigger:** Wallets & Balance Management submit · Add Client wizard wallet step

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/commerce.wallet-configured.v1.md)

## Related PRDs

- [[01 Account Management]] · [[03 Contract Packaging Charging Billing]]

## Related V-rules

- [[V-charging-insufficient-balance]]

## Gaps

- Eventual-consistency window not specified (frontend polls Charging until wallet appears)
- Provisioning not on the Kafka chain — direct HTTP only (KAFKA-GAP-09)
- Idempotency not documented

## Tags

#type/kafka-event #prd/01 #prd/03 #service/charging #service/commerce #gap

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
