*** Create Contact Group — Section: Upload Session FSM ***
*** 2026-05-18 ***

# Create Contact Group — Upload Session FSM

> The UploadSession entity lifecycle. Drives the safe-to-commit semantics.

## States

| State | Description | Backend visible | Frontend visible |
|---|---|---|---|
| `Init` | URL issued, file not yet uploaded | YES | YES (Step 1 progress) |
| `Complete` | File uploaded + parsed; preview ready | YES | YES (Step 2-4) |
| `Committed` | ContactGroup created from this session | YES | (terminal — refers to ContactGroup now) |
| `Abandoned` | TTL expired or user canceled | YES | (terminal — cannot reuse) |

## Transitions

```
(nonexistent) → POST /uploads/init → Init
Init → (S3 PUT + POST /complete) → Complete
Complete → POST /contact-groups → Committed
Complete (after TTL ~24h) → Abandoned
Init (after TTL with no upload) → Abandoned
```

## Cleanup job

[BRAIN-OUT] Contact Group backend has a Hangfire cron + internal `POST /_internal/cleanup/trigger` endpoint for orphan-purge logic.

```
Daily cron:
  1. Find UploadSessions with state=Init or Complete older than TTL.
  2. Mark them Abandoned.
  3. Delete uploaded files from S3.
```

## Why this design

The pre-signed URL pattern allows large files to upload directly browser → S3 without going through the API server (avoids latency + payload-size limits). UploadSession is the audit + state-keeping entity.

## See also

- [00-OVERVIEW](00-OVERVIEW.md) · [02-STEP_1_UPLOAD](02-STEP_1_UPLOAD.md) · [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
