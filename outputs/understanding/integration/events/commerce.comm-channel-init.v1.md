*** Kafka Event — Comm-Channel Init ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: commerce/SERVICE_OVERVIEW.md *(producer inferred)* + templates/SERVICE_OVERVIEW.md (consumer) ***

# commerce.comm-channel-init.v1

> Commerce signals that a new comm-channel was created for a tenant. Templates materializes the default `CommunicationChannelConfig` row for it.

## Topic / channel

- **Topic name (verbatim):** `commerce.comm-channel-init.v1`
- **Channel type:** Kafka
- **Schema:** Avro

## Producer

- **Service:** [[Commerce Service]] *(inferred — Templates lists this as a consumed topic, Commerce SERVICE_OVERVIEW does not explicitly enumerate it. The `commerce.*` prefix and Templates' consumer purpose make Commerce the unambiguous producer.)*
- **Publisher class:** **`not documented in Brain Outputs · would need source code scan`** — the Commerce SERVICE_OVERVIEW Kafka table does NOT list this topic on the produce side, but Templates lists it on the consume side. **Producer-side documentation gap.**
- **Trigger:** Likely fires when Commerce provisions a new CommChannel for a tenant — possibly during tenant onboarding or when an admin adds a new channel to the catalog.
- **Payload shape:** `inferred` — likely `{ TenantId, CommChannelId, CommChannelKey, DefaultBodyType, CorrelationId }`. **`not documented in Brain Outputs · would need source code scan`**.

## Consumer(s)

- **Service:** [[Templates Service]] — `CommChannelInitEventConsumer`
  - Materializes a new `CommunicationChannelConfig` Mongo document keyed by `TenantId + CommChannelId`.
  - Defaults `BodyType`, `LevelsCount`, `CheckerLevels[]` to safe values.

## Idempotency

- **Not documented.** Templates is consumer-only and its docs do not describe dedup. Replay could attempt to insert a duplicate `CommunicationChannelConfig` — likely fails on a unique index but the failure mode is not documented.

## Error path

- **Not documented.**

## Side effects (chain)

- Templates gains a new `CommunicationChannelConfig` row.
- Frontend can now render the channel in the Templates UI (gated by GAP-TM-02 — gateway route missing).

## Related PRDs

- [[05 Templates]] — primary
- [[01 Account Management]] — CommChannel ownership

## Related V-rules

- [[V-template-checker-level-integrity]] — applied on subsequent updates, not on this initialization
- [[V-template-levels-count-required-for-restricted]] — likewise

## Related entity reconciliation

- E-CommunicationChannelConfig (Templates) ↔ E-CommChannel (Commerce)

## Gaps / drift

- **Producer-side docs gap** — Commerce SERVICE_OVERVIEW does not list this topic on the produce side. Either: (a) it's actually produced by Commerce but missing from docs, (b) it's a planned topic Templates is already wired to consume but Commerce hasn't started publishing yet, (c) producer is some other service (unlikely — `commerce.*` namespace is Commerce-owned by convention). **Action:** verify by grep'ing Commerce repo for `comm-channel-init` literal string.
- Templates consumer idempotency not documented.

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
