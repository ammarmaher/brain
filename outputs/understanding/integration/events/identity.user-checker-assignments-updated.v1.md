*** Kafka Event — User Checker Assignments Updated (bulk) ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: templates/SERVICE_OVERVIEW.md (consumer) — producer-side gap ***

# identity.user-checker-assignments-updated.v1

> Identity signals a bulk update to Checker assignments. Templates re-syncs the affected projections.

## Topic / channel

- **Topic name (verbatim):** `identity.user-checker-assignments-updated.v1`
- **Channel type:** Kafka
- **Schema:** Avro

## Producer

- **Service:** [[Identity Service]] *(inferred — `identity.*` namespace, bulk-variant of [[identity.user-checker-assigned.v1]])*
- **Publisher class:** **`not documented in Brain Outputs · would need source code scan`** — Identity SERVICE_OVERVIEW Kafka produce table does NOT enumerate this topic. **Producer-side documentation gap (see KAFKA-GAP-05).**
- **Trigger:** A bulk re-assignment operation — likely an admin operation that re-mints Checker assignments for many users in one transaction (e.g. tenant-level reorganization, contract activation bumping checkers, role-template change).
- **Payload shape:** `inferred` — likely `{ TenantId, UpdatedAt, AssignedByUserId, Assignments: [{ UserId, CheckerLevel, CommChannelId? }], CorrelationId }`. **`not documented in Brain Outputs · would need source code scan`**.

## Consumer(s)

- **Service:** [[Templates Service]] — `UserCheckerAssignmentsUpdatedEventConsumer`
  - Bulk-updates the `UserCheckerLevel` projection.
  - May need transactional handling if the bulk array is large — not documented.

## Idempotency

- **Not documented.** Bulk operations are particularly risky for replay — duplicate processing would re-apply the bulk twice. Versioning by `UpdatedAt` or a bulk-operation ID would mitigate, but not surfaced.

## Error path

- **Not documented.** Partial-failure semantics for bulk events are critical and undefined — does the consumer process per-row, all-or-nothing, or best-effort?

## Side effects (chain)

- Templates' projection becomes consistent with Identity's new bulk state.
- Existing Templates UI views (Maker dropdowns, Checker dropdowns) reflect the changes after the consumer processes.

## Related PRDs

- [[05 Templates]] — primary

## Related V-rules

- Same as singular variant: [[V-template-checker-level-integrity]], [[V-template-levels-count-required-for-restricted]]

## Related entity reconciliation

- Same as singular variant: E-UserCheckerLevel (Templates) ↔ E-User (Identity)

## Gaps / drift

- **KAFKA-GAP-05** — producer-side enumeration missing.
- Bulk partial-failure semantics undefined.
- No documented version/ordering scheme to distinguish concurrent bulk updates.

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
