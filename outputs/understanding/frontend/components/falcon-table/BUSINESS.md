# falcon-table — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` `falcon-table` is the **rendering substrate** for every flat tabular business view in Falcon — user lists, billing entries, audit logs, account service lists. In business terms it is how the operator *reads a population of records at once* and acts on them: sort to triage, select to batch-act, filter to find. It is not consumed directly — the consumer-facing unit is `<falcon-angular-data-table>` (its own dossier), which composes `<falcon-table-tw>` and adds Angular cell-template projection. This dossier covers the substrate; do not duplicate the data-table business notes here.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Service rows render with backend-computed `availableActions[]` | `[MEMORY]` project_commchannels_apps_tabs_backend_integration_plan_2026_05_17 | The CommChannels / Apps tabs feed `serviceRowsToApplicationRows`-mapped rows into the shared `<app-applications-table>`, which renders through `<falcon-angular-data-table>` → `falcon-table-tw`. The table shows the row; the *action availability* is a business decision computed upstream (FSM per row + user-type). | 
| Soft-deleted rows visible only to Falcon admins | `[MEMORY]` project_pr40937_include_deleted_lift_2026_05_17 | The table renders whatever rows the query returns. The `IncludeDeleted` decision is made at the HTTP-service boundary, not in the table — the table is a faithful mirror of the result set. |
| Shadow rows = scheduled-change preview | `[CODE]` falcon-table.types.ts:158-217 (`FalconTableShadowRowMeta`, `bgVariant`) | A shadow row is a business statement: "this service has a pending price-type / price-value change." The table renders it as a tinted child row under the parent so the operator sees the *future state* without leaving the list. |

## Business constraints baked in
- `[CODE]` falcon-table.types.ts:170 — **shadow-row `bgVariant`** (`success`/`info`/`warning`/`primary`/`neutral`) is a *semantic* channel: the colour distinguishes the *kind* of pending change (type change vs value change). A builder must pick the variant that matches the business meaning, not an arbitrary colour.
- `[INFERRED]` **The table never decides what a row means.** Selection mode, action availability, deleted-row visibility and shadow-row contents are all business decisions made by the consuming feature / state slice. The table is presentational — treat an empty table or a missing action as an *upstream* data / permission gap, not a table bug.
- `[CODE]` falcon-table-tw.tsx:1263 — the global-filter input placeholder is the hardcoded literal `'Search…'` (line ref updated 2026-06-03). For an Arabic business audience this is an untranslated string (see `GAPS_AND_UPGRADES.md` FT-04). Business impact: RTL pages show an English placeholder. (The Actions-column header + shadow-row button labels ARE now i18n-able via `actionsHeaderLabel` / `shadow*Label` inputs.)

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| CommChannels tab | organization-hierarchy (admin-console) | Renders the account communication-channel service list (visibility, pricing, status) via `<falcon-angular-data-table>` substrate |
| Apps / Services tab | organization-hierarchy (admin-console) | Renders the account application service list, including shadow rows for scheduled price changes |
| User lists | organization-hierarchy / user management | Flat sortable, selectable, paginated user population |
| Any admin/management list view | both consoles | Generic record-population display below a filter strip |

## Business gotchas
- An **empty table is usually a data story, not a UI fault** — an empty service list often means no services are provisioned for the node, or a backend lookup/seed gap upstream. Read `INTEGRATION_VALIDATION.md` before "fixing" the table.
- The **built-in `col.type='badge'` renders a generic neutral chip** — it is *not* severity-aware. A status that must communicate business urgency (active / expired / disabled) must be projected as a `<ng-template falconDataTableCell>` rendering `<falcon-angular-status-badge>` / `<falcon-angular-tag>`. Using the plain badge type silently drops the business signal.
- **Shadow rows are opt-in** — they only render when the consumer passes `shadowRows` meta AND the parent row is expanded (`[CODE]` falcon-table-tw.tsx:842-855). A pending change that the operator cannot see is a business risk; ensure the feature wires shadow-row meta when scheduled changes exist.
- `lazy` mode means **the backend owns sort / filter / page** — the table emits intent (`falcon-lazy-load`) and trusts the server's response. Client-side sort assumptions do not hold.

## Verification
🟡 CODE-DERIVED, RE-VERIFIED 2026-06-03 (B08) from `[CODE]` falcon-table.types.ts (227 ln) + falcon-table-tw.tsx (1702 ln) + the UI-layer dossiers + `[MEMORY]` Wave 17 / PR-40937 entries. Shadow-row `bgVariant` + `FalconTableShadowRowMeta` re-confirmed (types.ts:180-195). CommChannels / Apps tab usage ✅ VERIFIED (feature confirmed working per `[MEMORY]` project_commchannels_apps_tabs_wave17`). Shadow rows now have a production consumer (admin/mgmt applications-table — `[MEMORY]` Wave 22C/D).
