*** Channel — OCS Realtime Events (Redis stream) ***
*** Vault graph node — SoT: Brain Outputs/understanding/integration/events/ocs-realtime-events.md ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***

# OCS Realtime Events Stream

> The OCS hot path. Not Kafka — a **Redis stream** (`ocs:realtime-events`) for high-throughput hot channels (WHATSAPP / SMS / VOICE). Internal to [[Charging Service]].

## At a glance

- **Channel name:** `ocs:realtime-events`
- **Type:** Redis stream (not Kafka)
- **Producer:** [[Charging Service]] · `Infrastructure/RealTimeChargingCore/`
- **Consumer:** Charging internal + speculative Ledger (external)
- **Hot channels:** WHATSAPP · SMS · VOICE
- **Idempotency:** Redis cache (`IdempotencyTtlSeconds: 86400` = 24h)
- **Concurrency resilience:** `OcsResilience:MaxOptimisticRetries: 3`, base/max retry delay 25/250 ms, jitter 0.2

## Deep contract

- [Full event note](../../../Brain%20Outputs/understanding/integration/events/ocs-realtime-events.md)

## Related PRDs

- [[03 Contract Packaging Charging Billing]]

## Related V-rules

- [[V-charging-insufficient-balance]] · [[V-charging-no-applicable-rate]]

## Gaps

- Redis durability vs Kafka — weaker guarantees on a financially-impactful path
- Interplay with [[Charging OCS Wallet Events]] outbox unclear
- Frontend never subscribes — documented but worth re-verifying

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
