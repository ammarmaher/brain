*** Kafka Event — Contract Lifecycle ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: commerce/SERVICE_OVERVIEW.md + charging/SERVICE_OVERVIEW.md ***

# commerce.contract-lifecycle.v1

> Commerce signals a contract status transition — Activated or Expired. Charging updates its contract projection so rate-lookup and `Send Transaction` know which contracts are live.

## Topic / channel

- **Topic name (verbatim):** `commerce.contract-lifecycle.v1`
- **Channel type:** Kafka
- **Schema:** Avro

## Producer

- **Service:** [[Commerce Service]]
- **Publisher classes:** `ContractActivatedEventPublisher` · `ContractExpiredEventPublisher` (two publishers, one topic — Avro union or `EventType` discriminator field expected)
- **Trigger:**
  - Contract status scheduler — when a contract's `StartDate` is reached and status flips from `Pending` to `Active`.
  - Contract status scheduler — when `ExpirationDate` is reached and status flips from `Active` to `Expired`.
- **Payload shape:** `inferred` — likely `{ TenantId, AccountId, ContractId, EventType: "Activated" | "Expired", EffectiveAt, RateCardSnapshot?, CorrelationId }`. **`not documented in Brain Outputs · would need source code scan`**.

## Consumer(s)

- **Service:** [[Charging Service]] — `ContractLifecycleEventConsumer`
  - Updates the `ContractLifecycleProjection` (Charging's read-model under `Infrastructure/ContractLifecycleProjection/`).
  - On `Activated`: contract becomes eligible for rate selection on `Send Transaction` (active-contract nearest-expiring-first rule).
  - On `Expired`: contract is removed from the active set; any in-flight reservations against it become uncommittable.

## Idempotency

- **Not documented at the Kafka layer.** The projection probably absorbs replays harmlessly (idempotent upsert by ContractId) but this is not stated.

## Error path

- **Not documented.**

## Side effects (chain)

- Charging's `ContractLifecycleProjection` is the source of truth for which contracts are live.
- The active-contract nearest-expiring-first selection rule depends on this projection being current.
- Commerce's `ContractResponse.CanEdit` bool (which is `false` after activation) is driven by the same lifecycle status — Commerce holds the canonical, Charging holds the projection.

## Related PRDs

- [[03 Contract Packaging Charging Billing]] — primary

## Related V-rules

- [[V-contract-expiration-after-start]] — enforced at Commerce on contract creation
- [[V-contract-edit-status-aware-fields]] — `ContractEditOnlyAllowedWhenPending` enforced at Commerce on contract update; Charging projection reads same lifecycle

## Related entity reconciliation

- E-Contract (Commerce, canonical with status field) ↔ E-ContractLifecycleProjection (Charging, projection)

## Gaps / drift

- Two publisher classes for one topic — verify the Avro schema actually carries an EventType discriminator and that the consumer dispatches correctly on both event types.
- Idempotency by `ContractId` is conventional but not documented.

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
