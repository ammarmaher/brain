*** Create Contact Group — Kafka side effects ***
*** 2026-05-18 ***

# Create Contact Group — Kafka Side Effects

## On commit (`POST /api/contact-groups`)

Contact Group Service emits:

| Topic | Event | Consumed by |
|---|---|---|
| `contactgroup.group-created.v1` | `ContactGroupCreatedEvent { groupId, accountId, createdBy, columnConfig, totalRows }` | Audit · Templates (in case template was waiting on this group) |
| `contactgroup.upload-session-committed.v1` | `UploadSessionCommittedEvent { uploadId, groupId }` | Cleanup job (frees session resources) |

## On upload abandoned (cleanup cron)

| Topic | Event | Consumed by |
|---|---|---|
| `contactgroup.upload-session-abandoned.v1` | `UploadSessionAbandonedEvent { uploadId, reason }` | Audit · S3 cleanup |

[INFERRED] All events — verify in backend source.

## See also

- [06-SECTION_UPLOAD_SESSION_FSM](06-SECTION_UPLOAD_SESSION_FSM.md) · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
