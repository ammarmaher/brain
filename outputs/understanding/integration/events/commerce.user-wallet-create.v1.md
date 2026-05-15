*** Kafka Event — User Wallet Create ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: commerce/SERVICE_OVERVIEW.md + charging/SERVICE_OVERVIEW.md + commerce/controllers/NodeController/FRONTEND_CONTRACT.md ***

# commerce.user-wallet-create.v1

> Commerce signals a newly-provisioned user to Charging so a per-user sub-wallet is materialized.

## Topic / channel

- **Topic name (verbatim):** `commerce.user-wallet-create.v1`
- **Channel type:** Kafka
- **Schema:** Avro (Confluent Schema Registry, BACKWARD)

## Producer

- **Service:** [[Commerce Service]]
- **Publisher class:** `UserCreatedEventPublisher` (note: class is named *Created*, topic is named *user-wallet-create* — the publisher's job is to ask Charging to create a wallet for the user that Identity just created)
- **Trigger:** After [[commerce.user-creation-requested.v1]] is published and the User document moves to a state where wallet allocation is required (typically Account-Owner at Add Client Step 5; Normal-User on Add-User wizard if the account's `WalletBalanceType=UserBased`).
- **Payload shape:** `inferred` — likely `{ TenantId, UserId, OwnerType, Currency, CorrelationId }`. **`not documented in Brain Outputs · would need source code scan`**.

## Consumer(s)

- **Service:** [[Charging Service]] — `UserCreatedEventConsumer`
  - Creates a sub-wallet under the master wallet, keyed by `UserId`.
  - Default state: zero balance, no reservations.

## Idempotency

- **Not documented at the Kafka layer.** Charging HTTP mutators are idempotent on `referenceType + referenceId` via 24h Redis cache, but the Kafka consumer's dedup behavior on this topic is not described.

## Error path

- Not documented. No DLQ topic. Charging's `WalletOutboxPublisherWorker` handles outbound reliability; inbound failures are uncovered in the scan.

## Side effects (chain)

- Charging creates a `Wallet` document for the user (sub-wallet under the master).
- Subsequent OCS operations (reserve / debit / commit) become routable to this user.
- Downstream Ledger may observe via [[charging.ocs-wallet-events.v1]] if the creation is published to the outbox (verify — the outbox documents *mutations* but wallet *creation* might be one of them).

## Related PRDs

- [[01 Account Management]] — primary (wallet provisioning during user creation)
- [[03 Contract Packaging Charging Billing]] — wallet is the entity charged against

## Related V-rules

- [[V-charging-insufficient-balance]] — applies after wallet exists
- [[V-account-limits-zero-means-no-limit]] — Normal-user-limit check happens upstream in Commerce, but cascades here

## Related entity reconciliation

- E-Wallet (Charging) ↔ E-User (Identity) ↔ E-User (Commerce User↔Account binding)

## Gaps / drift

- Publisher class name (`UserCreatedEventPublisher`) is a near-collision with `UserCreationRequestedEventPublisher` (different topic, different purpose, similar name). High risk of mis-wiring.
- Consumer idempotency not documented — concurrent / replay-induced duplicate sub-wallets are a theoretical risk.
- Charging's consumer group is `commerce-service` (same as Commerce) — see **KAFKA-GAP-02** in README.

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
