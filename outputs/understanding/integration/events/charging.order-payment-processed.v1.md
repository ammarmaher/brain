*** Kafka Event — Order Payment Processed ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: charging/SERVICE_OVERVIEW.md + commerce/SERVICE_OVERVIEW.md + commerce/controllers/NodeController/FRONTEND_CONTRACT.md ***

# charging.order-payment-processed.v1

> Charging confirms the result of processing a service order. Commerce updates the order's status.

## Topic / channel

- **Topic name (verbatim):** `charging.order-payment-processed.v1`
- **Channel type:** Kafka
- **Schema:** Avro

## Producer

- **Service:** [[Charging Service]]
- **Publisher class:** `FalconServiceOrderPaymentProcessedEventPublisher`
- **Trigger:** Charging's consumer for [[commerce.order-created.v1]] finishes processing the payment — either successful debit or failure (insufficient balance / no rate / wallet-not-found).
- **Payload shape:** `inferred` — likely `{ OrderId, TenantId, Status: "Paid" | "Failed", FailureReason? (enum: InsufficientBalance / NoApplicableRate / WalletNotFound / ...), DebitedAmount?, TransactionId?, CorrelationId }`. **`not documented in Brain Outputs · would need source code scan`**.

## Consumer(s)

- **Service:** [[Commerce Service]] — `FalconServiceOrderPaymentProcessedEventConsumer`
  - Updates the `Order` document in Commerce — sets status to `Paid` / `Failed` and surfaces it to the frontend via `GET /commerce/Node/order/{orderId}/status`.

## Idempotency

- **Not documented at the Kafka layer.** Commerce consumer-side dedup unclear. The reverse-of-direction publisher (Charging) is published via the outbox + `UnitOfWorkFilter` pattern, so duplicate publications are possible on retry.

## Error path

- **Not documented.** What happens if Commerce can't find the OrderId (e.g. corrupted state)?

## Side effects (chain)

- Order moves to terminal status.
- Frontend's polling of `GET /commerce/Node/order/{orderId}/status` resolves.
- If status=`Paid`, downstream contract activation may follow (see [[commerce.contract-lifecycle.v1]] for the activation scheduler).

## Related PRDs

- [[01 Account Management]] — primary (service order flow on Organization Hierarchy)
- [[03 Contract Packaging Charging Billing]] — order payment is the charging-side completion

## Related V-rules

- [[V-charging-insufficient-balance]] — `InsufficientBalance` surfaced as `FailureReason`
- [[V-charging-no-applicable-rate]] — `NoApplicableRate` surfaced likewise

## Related entity reconciliation

- E-Order (Commerce, canonical with status) ↔ E-Wallet (Charging, debit transaction)

## Gaps / drift

- Reverse-flow payload shape not surfaced — frontend behavior on failure status is unclear.
- Commerce's consumer idempotency not documented.

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
