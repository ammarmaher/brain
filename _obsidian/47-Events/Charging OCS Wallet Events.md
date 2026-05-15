---
type: kafka-event
topic: charging.ocs-wallet-events.v1
channel: kafka
producer-service: charging
consumer-services: []
idempotency-documented: false
created: 2026-05-15
---
*** Event — Charging OCS Wallet Events (outbox) ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/charging.ocs-wallet-events.v1.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# Charging OCS Wallet Events

> Stream of all OCS wallet mutations (debit / reserve / commit / release / transfer / config-change), published via outbox for downstream Ledger consumption.

## At a glance

- **Topic:** `charging.ocs-wallet-events.v1` (Kafka · Avro)
- **Producer:** [[Charging Service]] · `OcsWalletEventPublisher` (via `WalletOutboxPublisherWorker`)
- **Consumer:** **Ledger** (external / downstream / planned) — not in 9-service inventory
- **Trigger:** Every wallet mutation (via outbox row + worker drain)
- **Reliability:** Outbox pattern (Mongo outbox collection + `UnitOfWorkFilter`)

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/charging.ocs-wallet-events.v1.md)

## Related PRDs

- [[03 Contract Packaging Charging Billing]]

## Related V-rules

- (none — pure fact stream)

## Gaps

- KAFKA-GAP-08 — Ledger service not in 9-service inventory
- Ordering semantics (Mongo outbox vs business-time) undocumented
- Realtime path ([[OCS Realtime Events Stream]]) interplay with outbox unclear

## Tags

#type/kafka-event #prd/03 #service/charging #gap

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
