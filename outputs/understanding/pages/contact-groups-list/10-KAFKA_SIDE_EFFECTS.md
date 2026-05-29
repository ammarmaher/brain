*** Contact Groups List — Kafka side effects ***
*** 2026-05-18 ***

# Contact Groups List — Kafka Side Effects

## On `PATCH contactgroup/contact-groups/{id}`

| Topic | Event | Consumed by |
|---|---|---|
| `contactgroup.group-updated.v1` | `ContactGroupUpdatedEvent { groupId, accountId, fields[] }` | Audit log · Templates Service (in case template references this group) |

## On `PATCH contactgroup/contact-groups/{id}/share`

| Topic | Event | Consumed by |
|---|---|---|
| `contactgroup.share-policy-changed.v1` | `SharePolicyChangedEvent { groupId, oldUsers[], newUsers[] }` | Identity · Notification |

## On `DELETE contactgroup/contact-groups/{id}`

| Topic | Event | Consumed by |
|---|---|---|
| `contactgroup.group-deleted.v1` | `ContactGroupDeletedEvent { groupId, by }` | Audit log · Templates Service (orphan check) |

[INFERRED] All these events — verify in backend source.

## See also

- [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
