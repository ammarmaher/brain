*** Redis Stream — OCS Realtime Events ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: charging/SERVICE_OVERVIEW.md + charging/FRONTEND_CONTRACT.md + charging/VALIDATIONS.md ***

# ocs:realtime-events (Redis stream)

> The OCS hot path. A Redis stream — not Kafka — for the high-throughput "hot channels" (WHATSAPP / SMS / VOICE). Internal to Charging. Mentioned here because it's the same conceptual layer (async event bus) and frontend developers need to know it exists even though they don't talk to it.

## Topic / channel

- **Topic name (verbatim):** `ocs:realtime-events`
- **Channel type:** **Redis stream** (not Kafka)
- **Schema:** Not Avro — likely Redis-native (JSON or binary, configured via `RealTimeCharging:EventStreamKey`)

## Producer

- **Service:** [[Charging Service]] — the real-time charging core, `Infrastructure/RealTimeChargingCore/`
- **Publisher class:** **`not documented in Brain Outputs · would need source code scan`** — only the config key is surfaced (`RealTimeCharging:EventStreamKey = "ocs:realtime-events"`).
- **Trigger:** A real-time charge event on a hot channel: `WHATSAPP`, `SMS`, or `VOICE`. These bypass the standard reserve→commit flow because of latency sensitivity — the realtime core debits + publishes in one stream operation.
- **Payload shape:** `inferred` — likely a compact debit record `{ TenantId, WalletId, OwnerId, Channel: "WHATSAPP" | "SMS" | "VOICE", DebitedAmount, OccurredAt, ReferenceId }`. **`not documented in Brain Outputs · would need source code scan`**.

## Consumer(s)

- **Charging internal:** the realtime core reads its own stream to feed back into reservation hold tracking and idempotency cache.
- **External (per FRONTEND_CONTRACT):** *"Internal services (Ledger, downstream consumers) read from it. Mentioned for completeness."* — Ledger is the speculative external consumer, but as with [[charging.ocs-wallet-events.v1]], Ledger is not in this scan.
- **Frontend does NOT subscribe** — explicitly stated in `FRONTEND_CONTRACT.md`.

## Idempotency

- **Documented at the Charging level.** `IdempotencyTtlSeconds: 86400` (24h) Redis cache deduplicates on `referenceType + referenceId`. The realtime path uses the same cache.

## Error path

- **Not documented in detail.** Redis stream consumer groups have native ack/no-ack semantics — Charging likely uses them but the specifics aren't in scope.
- Optimistic concurrency on wallet writes: `OcsResilience:MaxOptimisticRetries: 3`, `BaseRetryDelayMs: 25`, `MaxRetryDelayMs: 250`, jitter 0.2.

## Side effects (chain)

- Wallet balance decreases for the hot channel.
- The mutation is **also** published to [[charging.ocs-wallet-events.v1]] via the outbox (for Ledger consumption) — verify the realtime path participates in the outbox or has its own publication.

## Related PRDs

- [[03 Contract Packaging Charging Billing]] — primary (Send Transaction realtime path)

## Related V-rules

- [[V-charging-insufficient-balance]] — `InsufficientBalance` (handler-side)
- [[V-charging-no-applicable-rate]] — `NoApplicableRate` (422)

## Related entity reconciliation

- E-Wallet mutation (hot-path variant) ↔ E-LedgerEntry (projection, eventually)

## Gaps / drift

- **Not a Kafka topic.** Conceptually adjacent but operationally different — Redis streams have weaker durability guarantees than Kafka (no Schema Registry, weaker replication, simpler consumer groups). Verify the production Redis deployment is durable enough for OCS's financial impact.
- The interplay with [[charging.ocs-wallet-events.v1]] outbox is unclear — does the realtime path skip the outbox (and therefore skip Ledger publication), or does it write to both?
- Mentioned in FRONTEND_CONTRACT for *completeness* — the frontend never talks to it — but verify no FE accidentally pings the Redis stream URL.

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
