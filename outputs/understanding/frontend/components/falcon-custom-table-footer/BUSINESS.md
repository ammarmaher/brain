# falcon-custom-table-footer — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose

`[BRAIN-OUT]` This footer is how an operator **orients themselves within a paged list of business records and controls the slice size**. It answers three questions at a glance: *which records am I seeing* ("Showing 41 - 60 from 195"), *how do I move through the list* (the page strip), and *how many per page* (rows-per-page). It is the standard footer band of every Falcon data table — accounts, users, services, comm-channels, orders. It owns no business data; it presents the page-position of whatever list the table renders.

`[CODE]` falcon-custom-table-footer.component.ts:6 — layout `[Showing X-Y from Z]  [« ‹ [page] of N › »]  [Rows per page ▾]`.

## PRD / business rules touched

| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| `[INFERRED]` Lists are server-paged, not client-loaded | `[MEMORY]` admin/mgmt list pages use lazy data-table loads | The footer emits a *page number* / *page size*; the data-table → feature re-fetches that slice. The footer bakes in no PRD rule — it is a navigation + report surface. |
| `[INFERRED]` "Showing X - Y from Z" is a derived report, never stored | `[CODE]` ts:49-59 | `first`/`last` are `computed()` live from `currentPage`/`rows`/`totalRecords` — the report can never drift from the actual page. |
| `[INFERRED]` Empty data is a distinct UI state | `[CODE]` ts:33-34 + html:11-12 | The data-table binds `[disabled]="_isEmpty()"`; when the list is empty the whole footer dims + every control goes inert (no paging a zero-row list). |

## Business constraints baked in

- `[CODE]` ts:43-47 — **`totalPages` is always ≥ 1** (`Math.max(1, ceil(total / max(1, rows)))`). Business meaning: even an empty or single-record list shows page 1 of 1, never "page 0".
- `[CODE]` ts:49-59 — **`first`/`last` collapse to 0 when `totalRecords === 0`**. "Showing 0 - 0 from 0" is the deliberate empty-state report, not a bug.
- `[CODE]` ts:61-65 — **a sub-1 page is never emitted** (`onPaginatorValueChange` guards `page >= 1`). The operator can never request page 0 or negative.
- `[CODE]` ts:67-70 — **a non-positive / non-finite rows value is never emitted** (`onSelectRows` guards `Number.isFinite(n) && n > 0`).
- `[CODE]` ts:35-38 + html:34 — **labels are consumer-translated**, never hardcoded into business logic. The footer is i18n-stack-agnostic: the data-table passes `footerShowingLabel` / `footerFromLabel` / `footerRowsPerPageLabel` (defaulting English) so the same footer serves En + Ar.

## Business flows using this component

| Flow | Page | Role of the component |
|---|---|---|
| `[BRAIN-OUT]` Every paginated Falcon data table | admin-console + management-console list pages | The DEFAULT footer band (data-table `showCustomFooter=true`) — reports the slice + drives the server page fetch. |
| `[MEMORY]` org-hierarchy tab lists (CommChannels, Apps/Services, users) | org-hierarchy | Footer paging of the service / user lists rendered by the shared data-table. |
| `[INFERRED]` Any list view using `<falcon-angular-data-table [paginator]="true">` | both consoles | Transitively present — the operator sees this exact 3-section band. |

## Business gotchas

- `[INFERRED]` **The footer does not fetch data.** Emitting `pageChange` / `rowsChange` is the whole of its job. A flow that wires the events but forgets to re-query the backend will see the "Showing" report + page strip move while the rows stay stale.
- `[CODE]` **A rows-per-page change does NOT auto-reset the page.** The footer emits the new size; the host must decide whether to jump back to page 1 (almost always yes — otherwise the operator can land on an out-of-range page that the inner paginator then clamps). Business intent: page-size is the operator's choice, page-reset is the flow's policy.
- `[INFERRED]` **`totalRecords` is the source of truth for the report; the page strip uses derived `totalPages`.** If the data-table is fed an inconsistent `totalRecords` vs the actual data length, the "from Z" count and the strip will disagree.
- `[CODE]` **Disabled = empty/loading, not a permission gate.** `disabled()` is bound from `_isEmpty()` — a dimmed footer means "no rows to page," NOT "you lack rights." There is no PES gate on this component.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09 — CREATED) from `[CODE]` falcon-custom-table-footer.component.ts + .html + the data-table wiring (falcon-data-table.component.html:70-82). Page-math guards (`totalPages≥1`, `first/last=0` on empty, `page>=1`, `rows>0`) + i18n-decoupled labels + empty-state-disable all re-confirmed in live source. Server-paging flows are `[MEMORY]`/`[INFERRED]`; the component is verified presentational with no baked-in business invariant beyond the page math.
