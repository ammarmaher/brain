# falcon-paginator — Recognition Layer

> Cross-cutting layer. Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-paginator>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` `falcon-paginator.tsx:351-374` — a **horizontal navigation strip**, almost always in a list/table footer:
- A row of **square page-number buttons**, the current page visually filled (teal active state, `aria-current="page"`) — `falcon-paginator.tsx:227-249`.
- **Ellipsis (`…`)** placeholders collapsing the middle when there are many pages — `falcon-paginator.tsx:215-223`. Classic shape: `‹ 1 … 4 5 [6] 7 8 … 100 ›`.
- **Prev / Next chevron buttons** (default on), optionally **First / Last** double-chevron buttons (default off) — `falcon-paginator.tsx:159-205`.
- Optional **current-page report** text like "41 – 60 of 195" (PR-3) — `falcon-paginator.tsx:253-270`.
- Optional **rows-per-page `<select>`** ("10 / 20 / 50 / 100") and a **jump-to-page number input** (PR-3) — `falcon-paginator.tsx:272-307`.
- Optional compact **page-info label** "6 of 100" — `falcon-paginator.tsx:366-370`.
- The region order is configurable via the `paginatorTemplate` token string. `role="navigation"`, `aria-label="Pagination"`.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<Pagination>` / `<TablePagination>` | `<Pagination>` ≈ the number strip; `<TablePagination>` ≈ the full footer with rows-per-page + "X of Y". Falcon merges both into one component (PR-3 surface). |
| PrimeNG | `<p-paginator>` | direct 1:1 — Falcon's `paginatorTemplate` region tokens are deliberately PrimeNG-shaped (`CurrentPageReport FirstPageLink …`). |
| Ant Design | `<Pagination>` (`showSizeChanger`, `showQuickJumper`) | direct 1:1 — Ant's `showSizeChanger` → RowsPerPageDropdown, `showQuickJumper` → JumpToPageInput. |
| Bootstrap | `.pagination` nav | upgrade target — Bootstrap has only the number strip; the report / size-changer must be added. |
| shadcn / Radix | `<Pagination>` (shadcn primitive) | shadcn's is the number strip + prev/next only; map to Falcon and add PR-3 regions as needed. |
| plain HTML | hand-rolled `<nav>` of `<button>`s | always replace with this. |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a numbered page strip in a table/list footer | `<falcon-angular-paginator>` (or let `<falcon-angular-data-table>` auto-compose it) | a hand-rolled nav |
| a footer with "rows per page" + "X of Y" + page numbers | `<falcon-angular-paginator>` with PR-3 regions — but standalone needs the Stencil tag (wrapper gap, see below) | — |
| a single "Load more" button | a `<falcon-angular-button>` — not a paginator | paginator |
| an endless-scroll list with no page controls | infinite scroll (not a Falcon component yet) | paginator |
| pagination already inside a Falcon table | nothing — set `[paginator]="true"` on `<falcon-angular-data-table>`; the paginator is auto-composed | a separate `<falcon-angular-paginator>` |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Decide the host** — if the design's strip is a *table* footer, do NOT place a paginator manually: set `[paginator]="true"` + `[rows]` + `[rowsPerPageOptions]` + `[totalRecords]` + `[lazy]="true"` on `<falcon-angular-data-table>`; the table auto-composes the paginator and wires the PR-3 props. This is the preferred path.
2. **Standalone inputs (Angular wrapper)** — `[(ngModel)]`/`formControlName`/`[(currentPage)]` for the page number (CVA works); `[totalPages]`; `[siblingCount]` / `[boundaryCount]` to tune how many numbers show around current and at the ends; `[showFirstLast]`, `[showPrevNext]`; `[showPageInfo]`; `[size]` (`sm`/`md`/`lg`); `[ariaLabel]`; `[disabled]`.
3. **PR-3 regions standalone** — `totalRecords`, `rows`, `rowsPerPageOptions`, `currentPageReportTemplate`, `paginatorTemplate`, `showCurrentPageReport` are **not on the Angular wrapper** (`GAPS_AND_UPGRADES.md` FP-01). To get the rows-per-page dropdown / current-page report standalone, use the Stencil tag `<falcon-paginator-tw>` directly and set `rowsPerPageOptions` as a JS prop, OR raise FP-01.
4. **Region order** — set `paginator-template` with the token vocabulary (`CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink JumpToPageInput RowsPerPageDropdown`) to re-order regions to match a design.
5. **Templates / slots** — none; the chevrons and `…` are built-in.
6. **Tokens** — restyle every state (page button default/hover/active/focus/disabled, nav buttons, ellipsis, report text) via `paginator.tokens.css`; never hardcode (see `TOKENS.md`).
7. **Variants** — `useTailwind` (default `true`) picks the Light-DOM `-tw` skeleton.
8. **Shared upgrade** — wrapper PR-3 parity (FP-01) and Falcon-atom inner controls (FP-03) are the documented upgrades — raise them, don't hand-roll.

## Anti-patterns
- `[CODE]` Manually placing `<falcon-angular-paginator>` under a Falcon table that could auto-compose it — duplicates the strip and splits page state.
- `[CODE]` Binding `[totalRecords]` / `[rows]` / `[rowsPerPageOptions]` on the Angular wrapper — those inputs do not exist on it; the binding silently no-ops. Use the Stencil tag or a table.
- `[CODE]` Passing `rowsPerPageOptions` as a string attribute — it is an object prop; set it on the live element.
- Renaming `paginatorTemplate` region tokens — breaks every table inheriting the template.
- Using a paginator for "load more" / infinite scroll — wrong UX model.
- Wiring `(valueChange)` but not re-fetching the page from the backend — the strip moves, the data goes stale.

## Verification
✅ RE-VERIFIED 2026-06-03 (B09) against `[CODE]` `falcon-paginator.tsx` rendered structure + `[CODE]` `falcon-paginator.component.ts` inputs. Cross-library mapping is `[INFERRED]` — the PrimeNG mapping is `[CODE]`-confirmed by the deliberately PrimeNG-shaped `paginatorTemplate` vocabulary. Composition recipe + anti-patterns unchanged; consumer note corrected (sole consumer = `falcon-custom-table-footer`).
