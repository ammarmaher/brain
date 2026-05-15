*** Kafka Event — Service Order Created ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: commerce/SERVICE_OVERVIEW.md + charging/SERVICE_OVERVIEW.md + commerce/controllers/NodeController/FRONTEND_CONTRACT.md ***

# commerce.order-created.v1

> Commerce signals that a service order ("Do Payment") was placed. Charging picks up payment processing asynchronously.

## Topic / channel

- **Topic name (verbatim):** `commerce.order-created.v1`
- **Channel type:** Kafka
- **Schema:** Avro

## Producer

- **Service:** [[Commerce Service]]
- **Publisher class:** `FalconServiceOrderCreatedEventPublisher`
- **Trigger:** `POST /commerce/Node/comm-channel/do-payment` — the "Do Payment" priority popup wrapper submits and the Order is persisted.
- **Payload shape:** `inferred` — likely `{ TenantId, AccountId, OrderId, ProductId / CommChannelId, Amount, Currency, RequestedByUserId, CorrelationId }`. **`not documented in Brain Outputs · would need source code scan`**.

## Consumer(s)

- **Service:** [[Charging Service]] — `FalconServiceOrderCreatedEventConsumer`
  - Processes the payment against the account's wallet (direct debit path for non-reservable system-priced purchases).
  - On success, emits [[charging.order-payment-processed.v1]] back to Commerce.

## Idempotency

- **Not documented at the Kafka consumer layer.** Charging HTTP debit endpoint is idempotent on `referenceType + referenceId` (Redis, 24h TTL); the consumer likely uses `OrderId` as the dedup key — verify.

## Error path

- **Not documented.** Insufficient balance on debit should be surfaced via [[charging.order-payment-processed.v1]] with a failure status — verify the payload includes a success/failure flag.

## Side effects (chain)

1. Charging debits the wallet.
2. Charging emits [[charging.order-payment-processed.v1]].
3. Commerce consumes that event, flips order status to `Paid` / `Failed`.
4. Frontend polls `GET /commerce/Node/order/{orderId}/status`.

## Related PRDs

- [[03 Contract Packaging Charging Billing]] — primary
- [[01 Account Management]] — order is tied to an account/CommChannel

## Related V-rules

- [[V-charging-insufficient-balance]] — `InsufficientBalance` surfaced by Charging
- [[V-charging-no-applicable-rate]] — if no rate matches the order

## Related entity reconciliation

- E-Order (Commerce) ↔ E-Wallet (Charging, debit transaction)

## Gaps / drift

- The reverse-event payload (`charging.order-payment-processed.v1`) shape is not surfaced — frontend / Commerce contract for success vs failure unclear.
- Consumer idempotency on `OrderId` is conventional but not documented.

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
