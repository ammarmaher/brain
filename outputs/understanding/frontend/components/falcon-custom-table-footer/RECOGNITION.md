# falcon-custom-table-footer — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `falcon-custom-table-footer` as the component to use, and how to compose it to parity.

## Visual fingerprint

`[CODE]` falcon-custom-table-footer.component.html — a **single-row footer band** spanning the full width below a data table, divided into **three columns** (CSS `grid grid-cols-3 items-center`):
- **LEFT** (start-aligned): a short report line "Showing 41 - 60 from 195".
- **CENTER** (center-aligned): a compact numeric pagination cluster `« ‹ [page] of N › »` — first/last double-chevrons, prev/next chevrons, and a "N of M" page-info label (the composed `<falcon-angular-paginator size="sm">`).
- **RIGHT** (end-aligned): a "Rows per page" label + a small dropdown `[20 ▾]`.

Distinguishing trait: it is a **table footer band** at table-row height, light neutral background, 12px muted text, with the page cluster centered and the slice-report + page-size flanking it. If you see a numeric strip WITHOUT the "Showing X of Y" report and "Rows per page" flanks, that is the bare `<falcon-angular-paginator>`, not this footer.

## Cross-library equivalents

| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<TablePagination>` | direct 1:1 — MUI's TablePagination is exactly "rows-per-page + 'X–Y of Z' + prev/next". Falcon splits it into this footer (report + size) composing `<falcon-angular-paginator>` (the number strip). |
| PrimeNG | `<p-paginator>` with `template="CurrentPageReport RowsPerPageDropdown PrevPageLink PageLinks NextPageLink"` | PrimeNG does it all in one `<p-paginator>` via the template tokens; Falcon's footer is a dedicated 3-section composite over the paginator. |
| Ant Design | `<Pagination showSizeChanger showTotal={...} />` | `showTotal` ≈ the "Showing X of Y" report; `showSizeChanger` ≈ rows-per-page. |
| Bootstrap | `.pagination` + a manual "Showing N of M" + a `<select>` | upgrade target — Bootstrap has no integrated table footer. |
| shadcn / Radix | hand-composed `<DataTablePagination>` recipe | shadcn's data-table footer recipe maps directly — rows-per-page `<Select>` + "X of Y" + page buttons. |
| plain HTML | hand-rolled footer `<div>` with a `<select>` + page buttons | always replace with this (via the data-table). |

## Use THIS vs siblings

| If the design shows… | Use | Not |
|---|---|---|
| a table footer band with "Showing X of Y" + page strip + "Rows per page" | `<falcon-angular-data-table>` (it renders THIS footer internally) | mounting the footer manually |
| just a numeric page strip, no report / no size selector | `<falcon-angular-paginator>` directly | this footer |
| a footer with custom non-pagination content (totals, bulk actions) | a bespoke footer template on the data-table | this footer |
| a "Load more" button or infinite scroll | a `<falcon-angular-button>` / infinite-scroll | this footer |

## Composition recipe to reach parity

Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — drive it through `<falcon-angular-data-table>`: `[paginator]="true"`, `[totalRecords]`, `[currentPage]`, `[rows]`, `[rowsPerPageOptions]`, `[lazy]`, + the three `footer*Label` inputs (translated). The data-table forwards them to the footer. Direct use (rare): `[totalRecords]` (required) + `[currentPage]`/`[rows]`/`[rowsPerPageOptions]`/`[disabled]` + the 3 labels + `(pageChange)`/`(rowsChange)`.
2. **Templates / slots** — NONE. The three regions are fixed.
3. **Variants** — none (the footer band is single-height; the inner paginator is pinned `size="sm"`). Enable/disable is the only state axis.
4. **Token override** — the band height reuses `--falcon-table-row-height`; colours reuse theme neutrals. Override the table token / theme, not per-instance (the footer owns no tokens).
5. **i18n** — supply translated `showingLabel` / `fromLabel` / `rowsPerPageLabel` (the footer is i18n-stack-agnostic). The page-cluster `aria-label`s come from the composed paginator (currently hardcoded English — paginator GAP).
6. **Upgrade** — a jump-to-page box, a Falcon-dropdown size selector, `aria-live` report, compact-density band — all documented gaps (`GAPS_AND_UPGRADES.md` G1/G2/G6/G8). Raise the shared-component upgrade; do not fork the footer.
7. **Wrapper** — do NOT mount this footer as a sibling of a data-table; it is the table's internal footer. For a non-table list, compose `<falcon-angular-paginator>` yourself instead.

## Anti-patterns

- `[CODE]` Mounting `<falcon-angular-custom-table-footer>` as a sibling next to a `<falcon-angular-data-table>` — duplicates the band + splits page state (the data-table renders it internally; html:69 warns against this).
- `[CODE]` Hardcoding English labels in production — pass translated `showingLabel`/`fromLabel`/`rowsPerPageLabel`.
- `[CODE]` Instantiating without `[totalRecords]` — it is `input.required()`.
- `[CODE]` Treating the rows-per-page control as a Falcon dropdown — it is a native `<select>` today (GAP G1).
- Wiring `(pageChange)`/`(rowsChange)` but not re-fetching — the report + strip move, the rows go stale.
- Forgetting to reset to page 1 on `(rowsChange)` — risks a transient out-of-range page.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B09 — CREATED) from `[CODE]` falcon-custom-table-footer.component.html rendered structure + `.component.ts` inputs/outputs. The 3-section grid + composed paginator + native rows-per-page `<select>` are `[CODE]`-confirmed. Cross-library mapping is `[INFERRED]` from standard library APIs (the MUI `<TablePagination>` / PrimeNG template / Ant `showTotal+showSizeChanger` equivalence). The "data-table renders this internally" relationship ✅ VERIFIED against falcon-data-table.component.html:70-82.
