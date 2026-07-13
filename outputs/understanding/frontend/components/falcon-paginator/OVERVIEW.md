# falcon-paginator — OVERVIEW

## Component purpose

`[CODE]` Numeric pagination strip: page-number buttons + ellipsis collapsing + optional first/last + prev/next nav + (PR-3) a current-page report, a jump-to-page input, and a rows-per-page dropdown. Built as the dual-render Stencil pattern (Shadow DOM `<falcon-paginator>` + Light DOM `<falcon-paginator-tw>` + Angular CVA wrapper `<falcon-angular-paginator>`). It is the navigation **atom** auto-composed inside `<falcon-table>` / `<falcon-table-tw>` footers, and the nav region of `<falcon-angular-custom-table-footer>`. ARIA `role="navigation"` + `aria-label="Pagination"`, `aria-current="page"` on the current page button (`[CODE]` falcon-paginator.tsx:1-5/356-360).

## Business / UI use case

`[BRAIN-OUT]` Footer paginator for any paged list / table — lets the operator move through a server-paged dataset (accounts, users, services, comm-channels, orders) without loading it all. Classic numeric strip: `‹ 1 … 4 5 [6] 7 8 … 100 ›`. Region order is configurable via the `paginatorTemplate` token vocabulary (deliberately PrimeNG-shaped). It emits a page number; the host flow re-fetches that page.

## When to use it / when NOT to use it

**Use it for:**
- Inside a Falcon table — set `paginator=true`; the paginator is auto-composed in the footer (preferred path).
- The nav region of a custom 3-section footer (`<falcon-angular-custom-table-footer>` already does this).
- Standalone above/below a custom list when the consumer manages page state directly.

**Do NOT use it for:**
- Simple "load more" patterns → use a `<falcon-angular-button>`.
- Infinite scroll → not supported.

## Status

`[CODE]` **ACTIVE.** Stencil Shadow + Light. The Angular wrapper is **READY** for table-composed use (fully wired) but **NEEDS-UPGRADE** (P1) for standalone use — it does NOT expose the PR-3 inputs (`totalRecords` / `rows` / `rowsPerPageOptions` / `currentPageReportTemplate` / `paginatorTemplate` / `showCurrentPageReport`) nor re-emit `falcon-rows-change`.

## Replaces

- PrimeNG `<p-paginator>` (the Falcon cross-framework replacement; the `paginatorTemplate` vocabulary mirrors PrimeNG's deliberately).
- Hand-rolled `<nav>` of page `<button>`s.

## Source file paths

| Layer | Path |
|---|---|
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-paginator/falcon-paginator.component.ts` (103 ln) |
| Angular wrapper HTML | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-paginator/falcon-paginator.component.html` (35 ln — pure tag-switcher) |
| Angular wrapper CSS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-paginator/falcon-paginator.component.css` (3 ln — `:host { display:block }` only) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-paginator/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-paginator/falcon-paginator.tsx` (375 ln) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-paginator/falcon-paginator.css` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-paginator-tw/falcon-paginator-tw.tsx` (408 ln) |
| Types | `libs/falcon-ui-core/src/components/falcon-paginator/falcon-paginator.types.ts` (37 ln) |
| Utils | `libs/falcon-ui-core/src/components/falcon-paginator/falcon-paginator.utils.ts` (138 ln — `buildPaginationItems`, `clampPage`, `parsePaginatorTemplate`, `interpolatePageReport`) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/paginator-tailwind-classes.ts` (146 ln) |
| Component token file | `libs/falcon-ui-tokens/src/components/paginator.tokens.css` (109 ln; 14 categories; `:where()` scope) |
| Spec / e2e | **NONE** in `libs/falcon-ui-core/src/components/falcon-paginator*/`. (No util spec for `clampPage`/`buildPaginationItems`/`parsePaginatorTemplate`/`interpolatePageReport`.) |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-angular-paginator` |
| Stencil Shadow tag | `<falcon-paginator>` (rendered when `useTailwind=false`) |
| Stencil Light tag | `<falcon-paginator-tw>` (rendered when `useTailwind=true`, the default) |

## Known consumers (grep verified 2026-06-03 — B09)

`[CODE]` grep `<falcon-angular-paginator[\s>]` across the repo returned exactly **1 render consumer**:
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-custom-table-footer/falcon-custom-table-footer.component.html:21` — the **B09 sibling unit** `<falcon-angular-custom-table-footer>` composes `<falcon-angular-paginator>` for its center nav region (a doc-comment reference is at `.component.ts:8`).

`[CODE]` The broader `<falcon-paginator[\s>-]` grep (61 occurrences / 29 files) additionally shows the **Stencil tag** auto-composed inside `falcon-table.tsx` + `falcon-table-tw.tsx` (the table footer auto-paginator), plus token/doc/web-types references — those are the de-facto heavy consumers (via the table, not the Angular wrapper).

**The prior dossier's `apps/host-shell/src/app/playground/playground.page.html` consumer is STALE** — the playground folder no longer exists. See `USAGE.md` Consumer Sweep.

## Related components

- `<falcon-table>` / `<falcon-table-tw>` / `<falcon-angular-data-table>` — auto-compose the Stencil paginator in their footer when paginated; set the PR-3 props directly on the inner `<falcon-paginator>` (`[CODE]` falcon-table.tsx region).
- `<falcon-angular-custom-table-footer>` — the 3-section footer that composes `<falcon-angular-paginator>` for its nav region (B09 sibling).
- `<falcon-angular-input-number>` / `<falcon-angular-dropdown>` — the paginator's JumpToPage input + RowsPerPage dropdown are currently native `<input>` / `<select>` (PR-3 spec); migration to these Falcon atoms is a documented deferral (FP-03).

## Ownership / responsibility

`libs/falcon-ui-core` (cross-framework). Owned by the Falcon UI team. Token contract lives in `libs/falcon-ui-tokens/src/components/paginator.tokens.css` (14 categories). The `paginatorTemplate` region vocabulary is the public contract: `CurrentPageReport | FirstPageLink | PrevPageLink | NextPageLink | LastPageLink | PageLinks | JumpToPageInput | RowsPerPageDropdown`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09). Source-file table re-confirmed (wrapper 103 ln / Shadow 375 ln / `-tw` 408 ln / utils 138 ln / tokens 109 ln). Consumer count corrected to **1** (`falcon-custom-table-footer` via the Angular wrapper) + the table auto-paginator via the Stencil tag — the prior `playground.page.html` claim is stale.
