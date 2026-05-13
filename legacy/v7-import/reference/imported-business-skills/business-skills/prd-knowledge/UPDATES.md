*** PRD Sync Log ***
*** Append-only log of every PRD sync operation. Newest at top. ***

# PRD Sync Log

| Timestamp | Op | Added | Updated | Unchanged | Conflicts |
|---|---|---|---|---|---|
| _no syncs yet_ | | | | | |

## Format for new entries

Insert above the "no syncs yet" row, then remove that placeholder once the first real sync lands:

```
| 2026-04-30 15:00 | sync | charging-v2 | account-mgmt v1.4→v1.5, contacts, billing | 5 modules | 0 |
```

Detailed per-module changes go in `modules/<slug>/changelog.md` — this file is the global summary.
