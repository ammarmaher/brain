*** Kafka Event — Identity User Events ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: identity/SERVICE_OVERVIEW.md + access/SERVICE_OVERVIEW.md + access/DTO_DICTIONARY.md + access/FRONTEND_CONTRACT.md ***

# identity.user-events.v1

> Identity broadcasts user lifecycle events — primarily role-link sync requests — so Access (PES) can synchronize its policy / role tables.

## Topic / channel

- **Topic name (verbatim):** `identity.user-events.v1`
- **Channel type:** Kafka
- **Schema:** Avro — event class: `UserRoleLinkSyncRequestedAvroEvent` (the only fully-named Avro event in Brain Outputs)

## Producer

- **Service:** [[Identity Service]]
- **Publisher class:** `UserRoleLinkSyncRequestedEventPublisher`
- **Trigger:**
  - User created (after Zitadel user creation succeeds)
  - User deleted / soft-deleted
  - User role changed (assignment / revocation)
  - Other user-lifecycle transitions that need policy resync
- **Payload shape:** `UserRoleLinkSyncRequestedAvroEvent` — **`not documented in detail in Brain Outputs · would need source code scan`**. Likely shape: `{ EventType, UserId, TenantId, RoleKey, Scope (hierarchical addressing like tenant:abc/node:xyz), PreviousRole?, OccurredAt, CorrelationId }`.

## Consumer(s)

- **Service:** [[Access PES Service]] — `UserRoleLinkSyncRequestedConsumer` (in `T2.PES.API/Messaging/`)
  - Resolves the user/role link instruction via `IAccessCurrentUser.TryResolvePrimaryRoleLinkInstruction(...)`
  - Persists / removes policy rules to keep PES decisions consistent (user deletion → revoke all policies; role change → swap policies)
  - Consumer group: `falcon-pes-svc`; security protocol: `Plaintext`
- (Possibly) [[Charging Service]] — Identity SERVICE_OVERVIEW says "Notify PES / Charging of user/role linkage changes" but Charging's Kafka table does NOT enumerate this topic on the consume side. **Producer-doc / consumer-doc mismatch — see Gaps.**

## Idempotency

- **Not documented at the Kafka layer.** Replays would re-resolve the link instruction; idempotent in spirit (link is set to current state) but no explicit dedup key.

## Error path

- **Not documented.** Tests exist: `T2.PES.Test/` covers `UserRoleLinkSyncRequestedConsumer` test, but DLQ / poison-handling is not surfaced.

## Side effects (chain)

- PES role/policy tables get the new user→role linkage.
- All subsequent `AuthRequest` decisions on this user reflect the new role.

## Related PRDs

- [[02 User Management]] — primary
- All other PRDs indirectly (PES is cross-cutting)

## Related V-rules

- [[V-username-format-uniqueness-immutable]] — user is created before event fires
- All Permission Matrix entries depend on PES seeing the right role

## Related entity reconciliation

- E-User (Identity) ↔ E-PolicyRule (PES) ↔ E-Role (PES)

## Gaps / drift

- **Charging-side consumer ambiguous.** Identity claims it publishes to "PES / Charging" but Charging SERVICE_OVERVIEW doesn't list this topic. Either: (a) Charging consumes but is missing from docs, (b) Charging doesn't consume but Identity overview is overstating, (c) Charging consumes a *different* identity event we haven't enumerated. **Verify.**
- Avro event schema is referenced by name (`UserRoleLinkSyncRequestedAvroEvent`) but its fields are not in DTO_DICTIONARY.

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
