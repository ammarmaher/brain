# Attachments — User Management

## Word files

None. Older PRD duplicate tracked in `latest-prd.md`.

## Excel files

### `Permission list - Jawad` (Google Sheet)

- **Size** — 15 KB / 180 rows captured (CSV export).
- **Modified** — 2026-04-20.
- **Purpose** — Authoritative per-action permission matrix for Falcon roles (System Administrator, Operation, Products) across Organization Hierarchy, CommChannels & Services, Apps & Services, Settings.
- **Used for understanding** — YES (heading block + sample rows incorporated into `understanding.md` > `Permission rules`).
- **Shape** — Columns: `Menu Item | Page Tab | Function/Action | System Administrator | Operation | Products | ... | ...`. Row values: `Allow`, `Not Allow`, `Deny`, or `Can be overridden by Deny`.
- **Notes** — The sheet export shows only the first tab (CSV export limitation). The PRD refers to "sheet 1" and "sheet 2" — sheet 2 was not captured by the text/csv export; flagged below.

### `Users statuses & others` (Google Sheet)

- **Size** — 4 KB.
- **Modified** — 2026-02-19.
- **Purpose** — Canonical definitions of the 5 user statuses + whether each is counted in the user limit.
- **Used for understanding** — YES; reproduced verbatim into `understanding.md` > `User Status` table and `latest-prd.md`.

## Images / screenshots / diagrams (Drive Drawings)

Images cannot be exported as text; only their names + Drive IDs are captured.

- `Creating/Editing User - Jawad` — flowchart for user create/edit. Used implicitly via its description in the PRD's first-login section.
- `Dina- Edit user status` — flowchart of status transitions. Supports `User Status` section.
- `User 1-Change User Status` — similar status transition flow.
- `Dina - Add user` — flowchart of Add User wizard.

Cached: only names; binary content not fetched in this sync.

## Unreadable / partially captured

- `Permission list - Jawad` sheet tab 2 — referenced by the PRD but not captured by CSV export (returns first tab only). Flagged; re-sync may need a different export strategy for multi-tab sheets.

## Aggregate notes

- The Permission list is the source of truth for per-action allow/deny; the PRD prose is secondary.
- Four Drive Drawings add flow-level clarity but are not prerequisite for understanding the module's CRUD surface.
