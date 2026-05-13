# falcon-paginator — GAPS & UPGRADES

## Missing capabilities

### Angular wrapper API surface lags behind Stencil core

The Stencil core has PR-3 features (totalRecords, rows, rowsPerPageOptions, currentPageReportTemplate, paginatorTemplate, showCurrentPageReport) but the Angular wrapper does NOT expose them. Standalone Angular consumers cannot drive the rows-per-page dropdown or the current-page report through `<falcon-angular-paginator>`. **P1 — wrap the missing inputs.**

```ts
// Proposed additions in falcon-paginator.component.ts:
@Input() totalRecords = 0;
@Input() rows = 0;
@Input() rowsPerPageOptions?: number[];
@Input() currentPageReportTemplate = '{first} - {last} of {totalRecords}';
@Input() paginatorTemplate?: string;
@Input() showCurrentPageReport = false;
@Output() readonly rowsChange = new EventEmitter<number>();
```

### Native `<input>` / `<select>` atoms

- JumpToPage input is a native `<input type="number">` (per PR-3 spec). NOT `<falcon-angular-input-number>`.
- RowsPerPage dropdown is a native `<select>` (per PR-3 spec, with `paginatorDropdownAppendTo` reserved for future Falcon dropdown migration).

**P2 — migrate to Falcon atoms once `<falcon-angular-dropdown>` is wired into the paginator helper.**

### Token vocabulary

`paginatorTemplate` uses PrimeNG-shaped tokens (`CurrentPageReport FirstPageLink …`). Mirrors the documented spec. If renamed, breaks every existing consumer + every Falcon table inheriting the same template.

### A11y

- `aria-current="page"` is set on the current page button. Good.
- Page-info label has `aria-live="polite"` (in the Stencil source) — should re-announce on page change. Verify.
- JumpToPage input should have a clear `<label>` association. Currently `aria-label` only — better than nothing but not ideal.

### Tests

No specs for `clampPage`, `interpolatePageReport`, `parsePaginatorTemplate`, `buildPaginationItems` utils. **P1.**

### Performance

- `buildPaginationItems` allocates a new array on every render. Fine for typical pageCount values.
- `parsePaginatorTemplate` allocates a region array on every render. Trivial.

## Reusable upgrades needed

| ID | Title | Priority |
|---|---|---|
| FP-01 | Wrapper API parity with Stencil PR-3 | **P1** |
| FP-02 | Utils unit tests | **P1** |
| FP-03 | Migrate inner atoms to Falcon dropdown/input | **P2** |
| FP-04 | JumpToPage `<label>` association | **P3** |

## Workarounds available

- For standalone Angular consumers needing PR-3 surface: drop down to the Stencil tag `<falcon-paginator-tw>` and use `@ViewChild` to set object props.
- Inside Falcon tables the PR-3 surface is always wired.

## Future-proof

Wrapper API parity is a 5-minute fix; should land before any new Angular feature needs the rows-per-page or current-page-report controls.
