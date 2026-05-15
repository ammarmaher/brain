*** Kafka Event — OCS Wallet Events (outbox) ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: charging/SERVICE_OVERVIEW.md ***

# charging.ocs-wallet-events.v1

> Charging publishes a stream of OCS wallet mutations for downstream consumption (primarily the Ledger). Uses the **outbox pattern** for at-least-once reliability.

## Topic / channel

- **Topic name (verbatim):** `charging.ocs-wallet-events.v1`
- **Channel type:** Kafka
- **Schema:** Avro

## Producer

- **Service:** [[Charging Service]]
- **Publisher class:** `OcsWalletEventPublisher`, driven by `WalletOutboxPublisherWorker` (background worker reading from the Mongo outbox collection)
- **Trigger:** Every wallet mutation (debit / reserve / commit / release / transfer / config-change) is written into the OCS outbox table inside the `UnitOfWorkFilter`-wrapped action. The outbox worker then reads + publishes asynchronously.
- **Payload shape:** `inferred` — likely a polymorphic event envelope: `{ EventType: "Debited" | "Reserved" | "Committed" | "Released" | "Transferred" | "Configured", TenantId, WalletId, OwnerType, OwnerId, Amount, Currency, Before/After balances, ReferenceType, ReferenceId, OccurredAt, CorrelationId }`. **`not documented in Brain Outputs · would need source code scan`**.

## Consumer(s)

- **Service:** **Ledger** (external / downstream / planned) — **`not in the 9-service inventory of this scan`** (see KAFKA-GAP-08). No Falcon backend service in scope consumes this topic.
  - Likely intent: build a double-entry general-ledger projection from the wallet event stream.

## Idempotency

- **At the producer:** Outbox pattern guarantees at-least-once delivery — duplicate emissions are possible if the worker re-publishes the same outbox row before marking it sent. **Consumer-side dedup is mandatory.**
- **At the consumer:** Unknown — Ledger is not in this scan.

## Error path

- **Outbox worker retries** on publish failure (config: `OcsOutbox` block in `appsettings.json`).
- No DLQ on the consumer side documented (because no in-scope consumer documented).

## Side effects (chain)

- Ledger (or any other downstream subscriber) builds its own projection.
- This is a **read-side** event — nothing in the 9-service mesh is supposed to act on these mutations.

## Related PRDs

- [[03 Contract Packaging Charging Billing]] — primary (charging system events)

## Related V-rules

- (No producer-side validation — the event is a fact, not a request)

## Related entity reconciliation

- E-Wallet mutation (Charging, source) ↔ E-LedgerEntry (Ledger, projection)

## Gaps / drift

- **KAFKA-GAP-08 (MEDIUM)** — Ledger service is referenced as the downstream but is not present in the 9-service backend inventory. Either it's external (e.g. T2's enterprise Ledger), deferred, or planned. **Action:** clarify Ledger ownership / deployment with architecture.
- Outbox-pattern design is good for reliability but introduces ordering questions — does Ledger see events in the same order as the mutations happened, or in publish order from the outbox?

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
