# Attachments — Contact Group Management

## Word files

None. The selected latest PRD is itself a Google Doc; the older duplicate is tracked in `latest-prd.md`.

## Excel files

### `Contact Group Permissions` (Google Sheet)

- **Source** — Drive, inside `4- Contact Group Mngmnt Module`.
- **Drive ID** — `1ww3nICya-CjW4_5mzoVpzTaaMz9nNTtH` (see `source-map.json`).
- **Size** — 1 KB.
- **Modified** — 2026-04-23.
- **Detected purpose** — Explicit CRUD+Share+Download permission matrix for this module.
- **Used for understanding** — YES; reproduced in `understanding.md` section `Permission matrix`.
- **Extracted structure** (columns): `View Details | Create | Edit | Share | Delete | Download CG | Download Original Uploaded File`.
- **Extracted roles** (rows): 3 Falcon roles × view-only; 3 Client roles × {creator, not creator}.
- **Notes** — The sheet is a single tab. Full cell values captured in `understanding.md` > `Permission matrix`.

## Images / screenshots / diagrams

None inside this module folder.

## Unreadable files

None.

## Aggregate notes

- The module has only 3 files in Drive: 1 selected PRD, 1 older duplicate, 1 permissions sheet.
- Permission matrix drives all access-control decisions — it should be treated as the canonical source for per-action enablement, not the prose in the PRD.
