*** Kafka Event — Wallet Configured ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: commerce/SERVICE_OVERVIEW.md + charging/SERVICE_OVERVIEW.md ***

# commerce.wallet-configured.v1

> Commerce signals that account-level wallet settings were configured (master / per-channel / per-owner mode, currency). Charging materializes the wallet structure.

## Topic / channel

- **Topic name (verbatim):** `commerce.wallet-configured.v1`
- **Channel type:** Kafka
- **Schema:** Avro

## Producer

- **Service:** [[Commerce Service]]
- **Publisher class:** `WalletConfiguredEventPublisher`
- **Trigger:** Successful Wallets & Balance Management configuration submit, OR Add Client wizard Step (wallet-configured during Step 3 service-creation phase).
- **Payload shape:** `inferred` — likely `{ TenantId, AccountId, WalletBalanceType (MasterOnly / PerChannel / UserBased), Currency, LimitsConfig, CorrelationId }`. **`not documented in Brain Outputs · would need source code scan`**.

## Consumer(s)

- **Service:** [[Charging Service]] — `WalletConfiguredEventConsumer`
  - Materializes the wallet structure: master wallet + optional channel sub-wallets + optional user sub-wallets per the chosen `WalletBalanceType`.
  - Persists `WalletTypeConfig` for the account.

## Idempotency

- **Not documented at the Kafka layer.** Provisioning's FRONTEND_CONTRACT explicitly tells the frontend that wallets are eventually-consistent post-`CreateAccountServices`: "Frontend should not assume wallets exist immediately after provisioning — poll Charging's `GET /charging/Wallet/contract-balance-summaries` until the wallet appears."

## Error path

- **Not documented.** Failure mode would leave Commerce with `WalletBalanceType=X` but Charging with no wallet — partition / DLQ behavior unknown.

## Side effects (chain)

- Charging materializes wallets and starts accepting reserve/commit/debit calls.
- Provisioning service is **not** involved here (no Kafka consumer registered — see KAFKA-GAP-09).
- Frontend polls Charging to confirm wallet existence.

## Related PRDs

- [[01 Account Management]] — primary (Wallets & Balance Management page)
- [[03 Contract Packaging Charging Billing]] — wallet is the charging substrate

## Related V-rules

- [[V-charging-insufficient-balance]] — once wallet exists
- (no direct V-rule on the event itself)

## Related entity reconciliation

- E-Wallet (Charging) ↔ E-AccountSettings (Commerce, WalletBalanceType)

## Gaps / drift

- Eventual consistency is documented at the *frontend* layer (poll Charging) but the eventual-consistency window / max-latency SLA is not stated.
- Consumer-side replay on this event would re-materialize wallets — likely idempotent in practice (`WalletAlreadyExists` would be silently absorbed) but not documented.

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
