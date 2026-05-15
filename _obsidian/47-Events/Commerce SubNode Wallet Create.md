*** Event — Commerce SubNode Wallet Create ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/commerce.subnode-wallet-create.v1.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Commerce SubNode Wallet Create

> Commerce informs Charging that a sub-node was created — Charging allocates the sub-node wallet.

## At a glance

- **Topic:** `commerce.subnode-wallet-create.v1` (Kafka · Avro)
- **Producer:** [[Commerce Service]] · `SubNodeCreatedEventPublisher`
- **Consumer:** [[Charging Service]] · `SubNodeCreatedEventConsumer`
- **Trigger:** Add Node — `POST /commerce/Node/create-SubNode`

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/commerce.subnode-wallet-create.v1.md)

## Related PRDs

- [[01 Account Management]]

## Related V-rules

- [[V-account-limits-zero-means-no-limit]]

## Gaps

- Consumer idempotency not documented
- KAFKA-GAP-02 — shared consumer group

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
