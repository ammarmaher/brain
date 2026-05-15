*** Kafka Event — SubNode Wallet Create ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: commerce/SERVICE_OVERVIEW.md + charging/SERVICE_OVERVIEW.md ***

# commerce.subnode-wallet-create.v1

> Commerce informs Charging that a sub-node was created and a sub-node-scoped wallet must be allocated.

## Topic / channel

- **Topic name (verbatim):** `commerce.subnode-wallet-create.v1`
- **Channel type:** Kafka
- **Schema:** Avro (Confluent Schema Registry, BACKWARD)

## Producer

- **Service:** [[Commerce Service]]
- **Publisher class:** `SubNodeCreatedEventPublisher`
- **Trigger:** Add Node flow — `POST /commerce/Node/create-SubNode` succeeds and the Node document is persisted. Orchestrator emits this event so Charging can create the sub-node wallet.
- **Payload shape:** `inferred` — likely `{ TenantId, NodeId, ParentNodeId, Currency, WalletBalanceType, CorrelationId }`. **`not documented in Brain Outputs · would need source code scan`**.

## Consumer(s)

- **Service:** [[Charging Service]] — `SubNodeCreatedEventConsumer`
  - Creates a sub-wallet keyed by `NodeId`, scoped under the master wallet of the tenant.
  - Inherits currency from the master wallet.

## Idempotency

- **Not documented at the Kafka layer.**

## Error path

- **Not documented.** No DLQ topic. Failure to create the sub-wallet would leave the Node in Commerce without a corresponding wallet — recovery path undocumented.

## Side effects (chain)

- Charging materializes a new `Wallet` document.
- If `WalletBalanceType=UserBased`, subsequent user creations on this sub-node will trigger [[commerce.user-wallet-create.v1]] per user.

## Related PRDs

- [[01 Account Management]] — primary (Add Node flow)

## Related V-rules

- [[V-account-limits-zero-means-no-limit]] — `MaxNodeLevelReached` enforced upstream by Commerce

## Related entity reconciliation

- E-Wallet (Charging, scope=Node) ↔ E-Node (Commerce)

## Gaps / drift

- Consumer-side idempotency not documented.
- Shared consumer group across Commerce + Charging (`commerce-service`) — see **KAFKA-GAP-02**.

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
