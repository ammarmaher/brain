*** Edit Contract — Kafka side effects ***
*** 2026-05-18 ***

# Edit Contract — Kafka Side Effects

## On `PUT commerce/Contracts/{id}` success

Commerce emits:

| Topic | Event | Consumed by | Purpose |
|---|---|---|---|
| `commerce.contract-updated.v1` | `ContractUpdatedEvent { contractId, changedFields[] }` | Charging (re-projects balance if rates/quotas changed) | Re-sync downstream |
| `commerce.contract-status-changed.v1` | `ContractStatusChangedEvent { contractId, oldStatus, newStatus }` | Same | Emitted ONLY when extension flips Expired→Active |

## Extension-specific

When extension flips Expired→Active:
- New endDate > today → backend status flip.
- Emits BOTH `contract-updated` AND `contract-status-changed`.
- Charging may re-enable the contract for usage.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) · [../contracts-list/10-KAFKA_SIDE_EFFECTS.md](../contracts-list/10-KAFKA_SIDE_EFFECTS.md)
