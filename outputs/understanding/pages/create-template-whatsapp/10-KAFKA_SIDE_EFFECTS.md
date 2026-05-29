*** Create Template (WhatsApp) — Kafka side effects ***
*** 2026-05-18 ***

# Create Template (WhatsApp) — Kafka Side Effects

## On `POST /api/templates` success (when endpoint exists)

| Topic | Event | Consumed by |
|---|---|---|
| `templates.template-created.v1` | `TemplateCreatedEvent { templateId, accountId, channel, status: 'Draft' }` | Audit log |

## On submit (later flow)

| Topic | Event | Consumed by |
|---|---|---|
| `templates.template-submitted.v1` | `TemplateSubmittedEvent { templateId, by }` | Notification (notify Checker) |

## On Checker approve (later flow)

| Topic | Event | Consumed by |
|---|---|---|
| `templates.template-approved-internal.v1` | (for WhatsApp) triggers Meta submission via integrator | Meta integration consumer |

## On Meta auto-approve (webhook)

| Topic | Event | Consumed by |
|---|---|---|
| `templates.meta-state-changed.v1` | `MetaStateChangedEvent { templateId, oldState, newState }` | Templates Service (updates Mongo + emits status-changed) · Notification |
| `templates.template-status-changed.v1` | `TemplateStatusChangedEvent { templateId, oldStatus, newStatus }` | Audit log · UI projection |

[INFERRED] All topics — none exist today (GAP-T-001).

## See also

- [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
