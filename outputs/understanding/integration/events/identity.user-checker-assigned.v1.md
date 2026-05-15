*** Kafka Event — User Checker Assigned ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: templates/SERVICE_OVERVIEW.md (consumer) — producer-side gap ***

# identity.user-checker-assigned.v1

> Identity signals that a user was assigned as a Checker (PRD-05 Maker/Checker workflow). Templates updates its local projection so the user can be picked from the Checker dropdown.

## Topic / channel

- **Topic name (verbatim):** `identity.user-checker-assigned.v1`
- **Channel type:** Kafka
- **Schema:** Avro

## Producer

- **Service:** [[Identity Service]] *(inferred — `identity.*` namespace and Maker/Checker is Identity's responsibility)*
- **Publisher class:** **`not documented in Brain Outputs · would need source code scan`** — Identity SERVICE_OVERVIEW Kafka produce table lists only `identity.user-events.v1`, but Templates SERVICE_OVERVIEW consumes this topic as `identity.user-checker-assigned.v1`. **Producer-side documentation gap (see KAFKA-GAP-05).**
- **Trigger:** A user is assigned a Checker role / permission, typically through the Add User wizard (Tab 3 — Roles) where a Checker role is granted, or through an explicit Maker/Checker assignment flow.
- **Payload shape:** `inferred` — likely `{ UserId, TenantId, CheckerLevel: int, CommChannelId?, AssignedAt, AssignedByUserId, CorrelationId }`. **`not documented in Brain Outputs · would need source code scan`**.

## Consumer(s)

- **Service:** [[Templates Service]] — `UserCheckerAssignedEventConsumer`
  - Updates the `UserCheckerLevel` projection so `GET /api/communication-channel-configs/user-checker-levels?UserId=&TenantId=` returns the new level.
  - Enables the user to be selected in Checker-level dropdowns on the Templates UI.

## Idempotency

- **Not documented.**

## Error path

- **Not documented.**

## Side effects (chain)

- Templates' projection is updated.
- The user becomes selectable in [[V-template-checker-level-integrity]]-validated CheckerLevels[] arrays.

## Related PRDs

- [[05 Templates]] — primary (Maker/Checker workflow)
- [[02 User Management]] — role assignment is the trigger
- [[04 Contact Group Management]] — Contact Group sharing uses similar user-link semantics

## Related V-rules

- [[V-template-checker-level-integrity]] — CheckerLevels must have ≥1 user each, no duplicates
- [[V-template-levels-count-required-for-restricted]] — `LevelsCount` matches `CheckerLevels.Count`

## Related entity reconciliation

- E-UserCheckerLevel (Templates) ↔ E-User (Identity) ↔ E-Permission/Role (Access PES)

## Gaps / drift

- **KAFKA-GAP-05** — Identity's produce-side enumeration is incomplete. This topic is consumed by Templates but not listed as produced by Identity.
- Bulk variant exists: see [[identity.user-checker-assignments-updated.v1]] — verify that single + bulk events use overlapping schemas / are correctly distinguished.

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
