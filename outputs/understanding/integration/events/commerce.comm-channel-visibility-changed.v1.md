*** Kafka Event — Comm-Channel Visibility Changed ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: templates/SERVICE_OVERVIEW.md (consumer) — producer-side gap ***

# commerce.comm-channel-visibility-changed.v1

> Commerce signals that a CommChannel's visibility flag flipped for an account. Templates updates its local projection.

## Topic / channel

- **Topic name (verbatim):** `commerce.comm-channel-visibility-changed.v1`
- **Channel type:** Kafka
- **Schema:** Avro

## Producer

- **Service:** [[Commerce Service]] *(inferred — `commerce.*` namespace + visibility flip is a Commerce concern)*
- **Publisher class:** **`not documented in Brain Outputs · would need source code scan`** — Commerce SERVICE_OVERVIEW Kafka produce table does NOT enumerate this topic. **Producer-side documentation gap, same shape as `commerce.comm-channel-init.v1`.**
- **Trigger:** `PUT /commerce/Node/comm-channel/visibility` — when the IsVisible flag flips on an account-scoped CommChannel.
- **Payload shape:** `inferred` — likely `{ TenantId, AccountId, CommChannelId, IsVisible, ChangedAt, ActorUserId, CorrelationId }`. **`not documented in Brain Outputs · would need source code scan`**.

## Consumer(s)

- **Service:** [[Templates Service]] — `CommChannelVisibilityChangedEventConsumer`
  - Updates the local projection of which channels are visible per tenant/account so the Templates UI knows what to show.

## Idempotency

- **Not documented.**

## Error path

- **Not documented.**

## Side effects (chain)

- Templates' projection becomes consistent with Commerce's visibility state.
- Adjacent event: [[commerce.comm-channel-shown.v1]] fires from the same trigger but to Charging (different consumer, different projection).

## Related PRDs

- [[05 Templates]] — primary
- [[01 Account Management]] — visibility owner

## Related V-rules

- (no direct validation — projection update is unvalidated, trusts the producer)

## Related entity reconciliation

- E-CommunicationChannelConfig (Templates) ↔ E-CommChannel (Commerce, IsVisible flag)

## Gaps / drift

- **Producer-side docs gap** identical to `commerce.comm-channel-init.v1`. The PUT-visibility endpoint definitely exists in Commerce (see NodeController FRONTEND_CONTRACT) but the Kafka emission is not in the Commerce overview.
- Two-event pattern (visibility-changed + comm-channel-shown) — fragility risk if they get out of sync.

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
