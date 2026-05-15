*** Kafka Event — Comm-Channel Shown ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: commerce/SERVICE_OVERVIEW.md + charging/SERVICE_OVERVIEW.md ***

# commerce.comm-channel-shown.v1

> Commerce signals that a CommChannel was made visible to a tenant/account. Charging may need to materialize a channel-scoped sub-wallet.

## Topic / channel

- **Topic name (verbatim):** `commerce.comm-channel-shown.v1`
- **Channel type:** Kafka
- **Schema:** Avro

## Producer

- **Service:** [[Commerce Service]]
- **Publisher class:** `CommChannelShownEventPublisher`
- **Trigger:** Visibility flip on a comm-channel (`PUT /commerce/Node/comm-channel/visibility`) where the channel was previously hidden and is now shown — Commerce orchestrator emits this event.
- **Payload shape:** `inferred` — likely `{ TenantId, AccountId, CommChannelId, CommChannelKey, CorrelationId }`. **`not documented in Brain Outputs · would need source code scan`**.

## Consumer(s)

- **Service:** [[Charging Service]] — `CommChannelShownEventConsumer`
  - May create a channel-scoped sub-wallet (depending on the account's `WalletBalanceType` config — `MasterOnly` does nothing, `PerChannel` allocates).
  - Updates the rate lookup keyspace (`App × Channel × Priority × Destination × Unit`).

## Idempotency

- **Not documented.**

## Error path

- **Not documented.**

## Side effects (chain)

- Optionally creates a sub-wallet.
- May enable the channel for `Send Transaction` flow.
- Touches Templates indirectly via [[commerce.comm-channel-visibility-changed.v1]] which is a separate event for the projection.

## Related PRDs

- [[01 Account Management]] — primary (CommChannel visibility lives on Organization Hierarchy page)
- [[03 Contract Packaging Charging Billing]] — Send Transaction requires the channel be visible

## Related V-rules

- [[V-service-visibility-pricing-required]] — `HiddenProductMustNotHavePricing` enforced upstream

## Related entity reconciliation

- E-Wallet (Charging, scope=Channel) ↔ E-CommChannel (Commerce)

## Gaps / drift

- Note: there are **two events** that fire on similar triggers — `commerce.comm-channel-shown.v1` (Charging-side wallet) and `commerce.comm-channel-visibility-changed.v1` (Templates-side projection). They're emitted from different orchestrator paths but the visibility flip is the same business event — verify both fire in lockstep.
- Idempotency not documented.

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
