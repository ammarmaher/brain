*** Templates List — Kafka side effects ***
*** 2026-05-18 ***

# Templates List — Kafka Side Effects

> List is read-only — produces no events. Background events that update its data:

| Topic (proposed) | Producer | Effect on list |
|---|---|---|
| `templates.template-created.v1` | Templates Service (when create endpoint built) | New row appears on refresh |
| `templates.template-status-changed.v1` | Templates Service (on submit/approve/reject) | Row status updates |
| `templates.meta-state-changed.v1` | Templates Service (on Meta webhook) | Meta pill updates |

[INFERRED] None of these topics exist yet (backend not built).

## See also

- [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) · [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
