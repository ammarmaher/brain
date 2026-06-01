# falcon-paginator — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` The control that lets an operator **move through a paged list of business records** — accounts, users, services, comm-channels, orders — without loading them all at once. In business terms it answers "which slice of the dataset am I looking at" and "how big is each slice". It is a **navigation atom**, not a data owner; it is composed into the footer of every Falcon table.

`[CODE]` `falcon-paginator.tsx:1-5` header — numeric pagination with optional first/last, ellipsis, and (PR-3) a current-page report, a rows-per-page dropdown, and a jump-to-page input.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| `[INFERRED]` Lists are server-paged, not client-loaded | `[MEMORY]` admin-console tabs / org-hierarchy use lazy table loads (`SettingsTabStateSlice` mount-time fetch pattern) | The paginator emits a *page number*; the host flow re-fetches that page from the backend. The component itself bakes in no PRD rule — it is a pure navigation surface. |
| `[INFERRED]` Page-size choice is an operator preference, not a business invariant | — | `rowsPerPageOptions` (`falcon-paginator.tsx:59`) is host-supplied; the component locks no default page size. |
| `[INFERRED]` No business invariant baked in | — | Like the date components, the paginator carries no locked value or PES-driven default. All bounds (`totalPages`, `totalRecords`, `rows`) are host-injected. |

## Business constraints baked in
- `[CODE]` `falcon-paginator.tsx:82,87,93,103-108` **The current page is always clamped to `[1, totalPages]`** — `clampPage` runs on load, on every `totalPages` change (`@Watch`), and on every `goto`. Business intent: the operator can never navigate to a page that does not exist (e.g. after a filter shrinks the result set, the paginator self-corrects rather than showing an empty page).
- `[CODE]` `falcon-paginator.tsx:104` **A no-op page click emits nothing** — `applyPage` returns early when `next === currentPage`. Business intent: clicking the page you are already on does not trigger a redundant backend re-fetch.
- `[CODE]` `falcon-paginator.tsx:310-311` **Prev/First disabled on page 1; Next/Last disabled on the last page** — the operator cannot navigate past the dataset boundaries.
- `[CODE]` `falcon-paginator.tsx:253-270` **The current-page report is computed, not stored** — `(currentPage-1)*rows+1` … `min(currentPage*rows, totalRecords)`. Business meaning: "showing records 41–60 of 195" is derived live from the page math, so it can never drift from the actual page.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| `[BRAIN-OUT]` Every Falcon table footer | admin-console + management-console list pages | Auto-composed inside `<falcon-table>` / `<falcon-angular-data-table>` when `paginated=true`; drives the server-side page fetch. |
| `[MEMORY]` org-hierarchy tab lists (CommChannels, Apps/Services, users) | admin-console org-hierarchy | Footer paging of the service / user lists rendered by the shared data table. |
| `[CODE]` `playground.page.html` (consumer grep, `USAGE.md`) | host-shell playground | Component demo — the only standalone `<falcon-angular-paginator>` consumer. |

## Business gotchas
- `[INFERRED]` **The paginator does not fetch data** — emitting a page number is the *whole* of its job. A business flow that wires `(valueChange)` but forgets to re-query the backend will see the page indicator move while the rows stay stale.
- `[CODE]` **Changing rows-per-page is a separate decision from changing page** — `falcon-rows-change` (`falcon-paginator.tsx:150-157`) is a distinct event. A flow must handle it: a new page size usually means re-fetching from page 1, and the host must decide that — the component does not reset the page on a rows change.
- `[INFERRED]` **`totalPages` vs `totalRecords` are both host-owned and must agree** — the page-number strip uses `totalPages`; the "X of Y" report uses `totalRecords` + `rows`. If the host computes them inconsistently, the strip and the report will disagree.
- `[INFERRED]` Not for **"load more"** or **infinite scroll** — those are different business UX patterns (`DECISION.md`); the paginator is the explicit numbered-page model.

## Verification
🟡 CODE-DERIVED from `[CODE]` `falcon-paginator.tsx` + `[CODE]` `falcon-paginator.component.ts` + existing 6 dossier files. Server-paging flows are `[MEMORY]`/`[INFERRED]`. The component carrying no baked-in business invariant is `[INFERRED]` from full source read.
