# falcon-paginator — DECISION

## Brain SK final recommendation

### USE FOR

- Standalone Angular pagination above/below custom list views.
- As the atom auto-composed inside `<falcon-angular-data-table>` / `<falcon-table-tw>` footers.

### AVOID FOR

- Infinite scroll patterns.
- Simple "load more" buttons.

## Preferred variant

Light DOM `<falcon-paginator-tw>` via the Angular wrapper with `[useTailwind]="true"` (default).

## Required upgrades before wider standalone use

| ID | Priority |
|---|---|
| FP-01 Wrapper API parity with Stencil PR-3 | **P1** |
| FP-02 Utils unit tests | **P1** |

## Relationship to other components

- Composed inside `<falcon-table>` / `<falcon-table-tw>` / `<falcon-angular-data-table>` (auto in footers).
- Future composition: `<falcon-angular-dropdown>` for rows-per-page (Wave 5+ deferral).

## Exact rule

1. Inside Falcon tables, paginator is auto-composed — pass paginator-related inputs to the table (`[paginator]`, `[rows]`, `[rowsPerPageOptions]`, `[totalRecords]`, `[lazy]`).
2. Standalone Angular use: `<falcon-angular-paginator [(ngModel)]="page" [totalPages]="N">`. PR-3 features unreachable until wrapper expands.
3. Standalone with full PR-3 surface: drop down to `<falcon-paginator-tw>` directly and set object props.

## Status

**READY** for table-composed use (fully wired). **NEEDS-UPGRADE** (P1) for standalone Angular use to reach Stencil PR-3 parity.

## Dynamic capability assessment

1. **Static today (in wrapper):** `totalRecords`, `rows`, `rowsPerPageOptions`, `currentPageReportTemplate`, `paginatorTemplate`, `showCurrentPageReport`.
2. **Dynamic via inputs/outputs (wrapper):** currentPage (CVA), totalPages, siblingCount, boundaryCount, showFirstLast, showPrevNext, disabled, size, showPageInfo, ariaLabel, useTailwind, rootClass.
3. **Dynamic via slots:** None.
4. **Dynamic via tokens:** Full token surface.
5. **Dynamic via Tailwind classes:** `rootClass`.
6. **Missing for reuse:** PR-3 input parity in the wrapper.
7. **Add to shared component:** All PR-3 inputs + `rowsChange` output.
8. **Better flags/options:** None beyond PR-3 parity.
9. **Safest upgrade path:** Add inputs and outputs to the wrapper one-for-one with Stencil props.
10. **Risky to change:** `paginatorTemplate` vocabulary (PrimeNG-shaped tokens — many consumers via Falcon tables rely on it).

**Verdict:** Solid Stencil core. Wrapper is a quick fix away from PR-3 parity.
