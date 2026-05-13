# falcon-paginator — OVERVIEW

## Purpose

Numeric pagination strip with optional first/last + prev/next + ellipsis + jump-to-page input + rows-per-page dropdown + current-page report. The atom composed inside `<falcon-table>` / `<falcon-table-tw>` / `<falcon-angular-data-table>`. ARIA `role="navigation"` + `aria-label="Pagination"`, `aria-current="page"` on the current page button.

## Business / UI use case

Footer paginator for any list / table. Numeric strip pattern: `< 1 ... 4 5 [6] 7 8 ... 100 >`. Supports configurable region order via `paginatorTemplate` token vocabulary (mirrors PrimeNG's spec).

## When to use it

- Inside a Falcon table (default — set `paginated=true` on the table; the paginator is auto-composed).
- Standalone above/below a list when the consumer manages page state directly.

## When NOT to use it

- For simple "load more" patterns — that's a button, not a paginator.
- For infinite scroll — not supported.

## Status

ACTIVE — Stencil Shadow + Light (`<falcon-paginator-tw>`). Angular wrapper `falcon-angular-paginator` (CVA, two-way bindable via `[(ngModel)]` on the page number).

## Paths

- Stencil Shadow: `libs/falcon-ui-core/src/components/falcon-paginator/falcon-paginator.tsx`
- Stencil Light: `libs/falcon-ui-core/src/components/falcon-paginator-tw/falcon-paginator-tw.tsx`
- Types: `libs/falcon-ui-core/src/components/falcon-paginator/falcon-paginator.types.ts`
- Utils: `libs/falcon-ui-core/src/components/falcon-paginator/falcon-paginator.utils.ts` (`buildPaginationItems`, `clampPage`, `interpolatePageReport`, `parsePaginatorTemplate`)
- Tokens: `libs/falcon-ui-tokens/src/components/paginator.tokens.css`
- Tailwind helpers: `libs/falcon-ui-core/src/tailwind/paginator-tailwind-classes.ts`
- Angular wrapper: `libs/falcon-ui-core/src/angular-wrapper/components/falcon-paginator/falcon-paginator.component.ts`
- Angular selector: `falcon-angular-paginator`

## Consumers

- Composed internally by `<falcon-table>` / `<falcon-table-tw>` (footer auto-render when `paginated=true`).
- Standalone consumers: playground + showcase only.
- The legacy `<falcon-data-table>` PrimeNG wrapper is gone; the new `<falcon-angular-data-table>` uses the auto-composed paginator inside `<falcon-table-tw>`.

## Related components

- `falcon-table` — composes this atom in its footer
- `falcon-data-table` — composes via `<falcon-table-tw>`
- `falcon-input` / `falcon-dropdown` — paginator's JumpToPage input + RowsPerPage dropdown atoms (currently native `<input>` / `<select>`; future migration to Falcon atoms is documented as a Wave 5+ deferral)

## Ownership

Stencil core + Angular wrapper. The token vocabulary for `paginatorTemplate` is the public contract: `CurrentPageReport | FirstPageLink | PrevPageLink | NextPageLink | LastPageLink | PageLinks | JumpToPageInput | RowsPerPageDropdown`.
