# falcon-table — API

## Selectors / Tags

| Mode | Tag / Selector | Path |
|---|---|---|
| Stencil Shadow DOM | `<falcon-table>` | `libs/falcon-ui-core/src/components/falcon-table/falcon-table.tsx` |
| Stencil Light DOM | `<falcon-table-tw>` | `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx` |
| Angular basic wrapper (deprecated) | `<falcon-angular-table>` | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-table/falcon-table.component.ts` |

## Import / Define

```ts
import { defineFalconTwComponent } from '@falcon-ui-core/define-falcon-tw-component';
await defineFalconTwComponent('falcon-table'); // registers both Shadow + Light
```

Angular wrapper imports:

```ts
import { FalconAngularTableComponent } from '@falcon-ui-core/angular-wrapper/components/falcon-table';
```

## @Prop / @Input — Stencil core (both `falcon-table` and `falcon-table-tw`)

| Prop | Type | Default | Notes |
|---|---|---|---|
| `rows` | `ReadonlyArray<Record<string, unknown>>` | `[]` | Row data |
| `columns` | `ReadonlyArray<FalconTableColumn \| FalconTableColumnExt>` | `[]` | Column descriptors |
| `selectable` (reflect) | `'none' \| 'single' \| 'multiple'` | `'none'` | Legacy alias |
| `selectionMode` (reflect) | `'none' \| 'single' \| 'multiple'` | `'none'` | Wins over `selectable` when non-`'none'` |
| `selectedRowIds` (mutable) | `ReadonlyArray<string \| number>` | `[]` | Row-id list |
| `sortBy` (mutable) | `FalconTableSort \| ReadonlyArray<FalconTableSort> \| null` | `null` | Single or multi-sort |
| `sortMode` (reflect) | `'single' \| 'multiple'` | `'single'` | shift/meta/ctrl-click adds in multi-mode |
| `paginated` (reflect) | `boolean` | `false` | Renders `<falcon-paginator>` footer |
| `pageSize` | `number` | `10` | |
| `currentPage` (mutable) | `number` | `1` | |
| `density` (reflect) | `'compact' \| 'comfortable' \| 'spacious'` | `'comfortable'` | |
| `striped` (reflect) | `boolean` | `false` | |
| `hoverable` (reflect) | `boolean` | `true` | |
| `bordered` (reflect) | `boolean` | `false` | |
| `loading` (reflect) | `boolean` | `false` | Renders skeleton rows |
| `emptyMessage` | `string` | `'No records to display.'` | |
| `disabled` (reflect) | `boolean` | `false` | |
| `ariaLabel` | `string \| undefined` | — | `aria-label` on `<table>` |
| `dataKey` | `string` | `'id'` | Row-id resolver field |
| `skeletonRows` | `number` | `6` | Number of skeleton rows when `loading=true` |
| `scrollable` (reflect) | `boolean` | `false` | Sticky thead + maxHeight clamp |
| `scrollHeight` | `string \| undefined` | — | CSS length or `'flex'` |
| `styleClass` | `string \| undefined` | — | Container class |
| `tableStyleClass` | `string \| undefined` | — | `<table>` class |
| `rowStyleClass` | `FalconTableRowStyleClassFn \| FalconTableRowStyleFunction` | — | Per-row class fn — accepts string \| string[] \| Record<string,boolean> (ngClass-like) |
| `hasRowActions` | `boolean` | `false` | Renders trailing row-actions column with `⋮` trigger |
| `lazy` (reflect) | `boolean` | `false` | Server-side mode |
| `totalRecords` | `number` | `0` | For lazy mode |
| `rowsPerPageOptions` | `ReadonlyArray<number> \| undefined` | — | Rows-per-page dropdown options |
| `currentPageReportTemplate` | `string` | `'{first} - {last} of {totalRecords}'` | Placeholders: `{first} {last} {totalRecords} {currentPage} {totalPages}` |
| `paginatorTemplate` | `string` | `'CurrentPageReport FirstPageLink PrevPageLink JumpToPageInput NextPageLink LastPageLink RowsPerPageDropdown'` | Region order |
| `globalFilterFields` | `ReadonlyArray<string> \| undefined` | — | Fields filtered by the search input |
| `globalFilterValue` (mutable) | `string \| undefined` | — | Two-way bound |
| `stickyActions` (reflect) | `boolean` | `false` | `[CODE]` falcon-table-tw.tsx:199 — Pin last column to inline-end. **Wave 27 (2026-05-24) default REVERTED to `false`** per user directive ("sticky is always false for actions"); Wave 25's `true` default is gone — consumers needing a pinned Actions column must opt IN with `[stickyActions]="true"`. |
| `responsiveLayout` (reflect) | `'scroll' \| 'stack'` | `'scroll'` | |
| `actionsHeaderLabel` | `string` | `'Actions'` | `[CODE]` falcon-table-tw.tsx:175 (Wave 25) — visible label for the Actions-column `<th>`. i18n via the Angular wrapper input `[actionsHeaderLabel]="'common.actions' \| translate"`. (Shadow path hardcodes the literal `Actions` — falcon-table.tsx:572.) |
| `actionsVisibleField` | `string` | `''` | `[CODE]` falcon-table-tw.tsx:212 (Wave 27) — **per-row kebab visibility gate**. When set to a row key (e.g. `'visible'`), Stencil reads `row[actionsVisibleField]` for each row: a strict `=== false` HIDES the `⋮` kebab for THAT row only; every other value shows it. The actions `<td>` still mounts so column alignment is preserved. Empty default = legacy behaviour (kebab always renders). **This is the platform "row-action gated on a row-level flag" mechanism** (cf. `row.allowedActions` — the consumer maps allowed→a boolean field). `-tw` only. |
| `expandedRowId` | `string \| number \| null` | `null` | `[CODE]` falcon-table-tw.tsx:227 (Wave 14) — single-row expansion: set the dataKey value of the row to expand; project content via `slot="row-expansion"`. The expansion renders as a sibling `<tr>` (colSpan = totalCols) immediately after the matching row. `null` collapses all. `-tw` only. |

### Strategy E (`falcon-table-tw` only)

| Prop | Type | Default | Notes |
|---|---|---|---|
| `hostsExternalCells` | `boolean` | `false` | `[CODE]` falcon-table-tw.tsx:221 — When true: Stencil renders empty `<td data-cell-mount=…>` / `<th data-header-mount>` cells (skips `renderCell()`); emits `falcon-cells-mounted` after each render so the Angular wrapper can inject `EmbeddedViewRef` root-nodes. |
| `paginatorDropdownAppendTo` | `string \| undefined` | — | Propagated to `<falcon-paginator-tw>` (parity placeholder until rows-per-page atom swaps to a Falcon dropdown) |

### Shadow rows (`falcon-table-tw` only — ADDITIVE, Wave: Multi-shadow / 20 / 21)

> `[CODE]` falcon-table-tw.tsx:234-255. Stencil receives only the STRIPPED meta (id / targetColumn / mode); the consumer's typed payload stays on the Angular wrapper side. When `shadowRows` is null AND `expandedShadowRowIds` empty, ALL shadow code paths are skipped (zero overhead — regression fence).

| Prop | Type | Default | Notes |
|---|---|---|---|
| `shadowRows` | `FalconTableShadowRowsMeta \| null` | `null` | Map keyed by string rowId → `ReadonlyArray<FalconTableShadowRowMeta>` (`{ id, targetColumn, mode, bgVariant? }`). |
| `expandedShadowRowIds` | `ReadonlyArray<string \| number>` | `[]` | Subset of parent rowIds whose shadow rows are currently expanded. |
| `shadowEditLabel` / `shadowDeleteLabel` / `shadowSaveLabel` / `shadowCancelLabel` | `string` | `'Edit'`/`'Delete'`/`'Save'`/`'Cancel'` | i18n labels for the default trailing-action buttons inside each shadow row (suppressed when the consumer projects `falconDataTableShadowActions`). |
| `shadowChevronAriaLabel` | `string` | `'Toggle row detail'` | Wave 21 (FU-06) i18n aria-label for the parent-row chevron. |
| `shadowEditAriaLabel` / `shadowDeleteAriaLabel` / `shadowSaveAriaLabel` / `shadowCancelAriaLabel` | `string \| null` | `null` | Wave 21 aria-label overrides; `null` falls back to the visible label text. |

## @Event / @Output — Stencil

| Event | Detail type | When |
|---|---|---|
| `falcon-row-click` | `{ row, index }` (`FalconTableRowClickDetail`) | Row click |
| `falcon-row-select` | `{ selectedRowIds }` (`FalconTableRowSelectDetail`) | Selection change |
| `falcon-sort` | `{ key, direction }` (`FalconTableSortDetail`) | Sort change (single + multi) |
| `falcon-multi-sort` | `{ sortBy }` (`FalconTableMultiSortDetail`) | Multi-sort change |
| `falcon-select-all-change` | `{ selected, rowIds }` (`FalconTableSelectAllDetail`) | Header-checkbox toggle |
| `falcon-empty` | `{ emptyMessage }` (`FalconTableEmptyDetail`) | `rows.length===0 && !loading && !lazy` |
| `falcon-row-action-trigger` | `{ rowId, anchor }` (`FalconTableRowActionTriggerDetail`) | `⋮` button clicked |
| `falcon-page-change` | `{ page }` (`FalconTablePageChangeDetail`) | Paginator emit |
| `falcon-lazy-load` | `FalconTableLazyLoadDetail` (`{ first, rows, sortField, sortOrder, multiSortMeta, filters, globalFilter }`) | Lazy mode page/sort/filter |
| `falcon-global-filter-change` | `{ value }` | Search input |
| `falcon-cells-mounted` (Light only, `bubbles:false composed:false`) | `{ cellMounts, empty, loading }` (`FalconCellsMountedDetail`) | After each render when `hostsExternalCells=true` |
| `falcon-shadow-cells-mounted` (Light only, `bubbles:false composed:false`) | `{ shadowMounts }` (`FalconTableShadowCellsMountedDetail`) | `[CODE]` falcon-table-tw.tsx:295 — after each render, one entry per `<div data-shadow-mount>` so the wrapper can mount EmbeddedViewRefs into shadow content + actions zones |
| `falcon-shadow-toggle` (Light only) | `{ rowId }` (`FalconTableShadowToggleDetail`) | `[CODE]` falcon-table-tw.tsx:300 — parent-row chevron clicked |
| `falcon-shadow-action` (Light only) | `{ rowId, shadowId, action }` (`FalconTableShadowActionDetail`, action = `'edit'\|'delete'\|'save'\|'cancel'`) | `[CODE]` falcon-table-tw.tsx:304 — default trailing-action button clicked |
| `falcon-shadow-delete-request` (Light only) | `{ rowId, shadowId, proposedShadowsForRow }` | `[CODE]` falcon-table-tw.tsx:312 (Wave 21 FU-04) — fires ALONGSIDE `falcon-shadow-action` on default Delete; carries the parent's shadows minus the deleted one |

## @Method / Methods

| Name | Signature | Description |
|---|---|---|
| `filterGlobal` | `(value: string) => Promise<void>` | Programmatic global-filter trigger |

## TypeScript types

Defined in `falcon-table.types.ts`:

```ts
type FalconTableSelectionMode = 'none' | 'single' | 'multiple';
type FalconTableDensity = 'compact' | 'comfortable' | 'spacious';
type FalconTableColumnType = 'text' | 'number' | 'badge' | 'currency' | 'date' | 'icon' | 'custom';
type FalconTableColumnAlign = 'start' | 'center' | 'end';
type FalconTableSortDirection = 'asc' | 'desc';
type FalconTableSortMode = 'single' | 'multiple';
type FalconTableColumnFrozen = 'left' | 'right' | true;
type FalconTableResponsiveLayout = 'scroll' | 'stack';

interface FalconTableColumn {
  readonly key: string;
  readonly label: string;
  readonly sortable?: boolean;
  readonly type?: FalconTableColumnType;
  readonly width?: string | number;
  readonly align?: FalconTableColumnAlign;
}

interface FalconTableColumnExt extends FalconTableColumn {
  readonly headerClass?: string;
  readonly cellClass?: string;
  readonly maxWidth?: string | number;
  readonly render?: (row: Record<string, unknown>) => string;   // returns HTML; consumer responsible for sanitisation
  readonly frozen?: FalconTableColumnFrozen;
  readonly alignFrozen?: 'left' | 'right';
  readonly headerInset?: number | string;   // Alignment Contract v1 (2026-05-20) — header-only
                                             // `padding-inline-start: calc(var(--falcon-table-cell-padding-inline) + Npx)`.
                                             // Aligns header LABEL with INNER text of a chromed body control
                                             // (dropdown/input placeholder). Body cell padding unaffected. Default 0 =
                                             // outer-edge alignment. See falcon-data-table/ALIGNMENT-CONTRACT.md.
}

// Shadow-row meta (Stencil-side; `-tw` only). Consumer payload stays in the Angular wrapper.
type FalconTableShadowRowBgVariant = 'success' | 'info' | 'warning' | 'primary' | 'neutral';
interface FalconTableShadowRowMeta { readonly id: string; readonly targetColumn: string;
  readonly mode: 'view' | 'edit'; readonly bgVariant?: FalconTableShadowRowBgVariant; }
type FalconTableShadowRowsMeta = { readonly [rowKey: string]: ReadonlyArray<FalconTableShadowRowMeta>; };
type FalconTableShadowAction = 'edit' | 'delete' | 'save' | 'cancel';

interface FalconTableSort { readonly key: string; readonly direction: FalconTableSortDirection; }
type FalconTableSortValue = FalconTableSort | ReadonlyArray<FalconTableSort> | null;

type FalconTableRowStyleClassFn = (row, index) => string;
type FalconTableRowStyleFunction = (row, rowIndex) => string | string[] | Record<string, boolean>;

interface FalconTableLazyLoadDetail {
  readonly first: number;
  readonly rows: number;
  readonly sortField: string | null;
  readonly sortOrder: 1 | -1 | null;
  readonly multiSortMeta: ReadonlyArray<FalconTableSort>;
  readonly filters: Record<string, FalconTableFilterValue>;
  readonly globalFilter: string | null;
}

interface FalconTableCellMount {
  readonly rowId: string | number;
  readonly rowIndex: number;
  readonly field: string;
  readonly element: HTMLElement;
  readonly kind: 'cell' | 'header';
}

interface FalconCellsMountedDetail {
  readonly cellMounts: ReadonlyArray<FalconTableCellMount>;
  readonly empty: HTMLElement | null;
  readonly loading: HTMLElement | null;
}
```

## Slots (Stencil) / ng-template inputs (Angular)

**Stencil:**
- The Shadow `<falcon-table>` exposes NO slots. Cell content is produced by the `renderCell()` switch (`text` / `number` / `currency` / `badge` / `icon`) or `col.render()` HTML.
- The Light `<falcon-table-tw>` exposes Strategy E projection points (not slots — `<td data-cell-mount=…>` mount-points) when `hostsExternalCells=true`. Empty: `[data-empty-mount]`. Loading: `[data-loading-mount]`. Headers: `[data-header-mount=…]`. Shadow body: **`<div data-shadow-mount>`** (`[CODE]` falcon-table-tw.tsx:1170/1232 — moved from `<td>` to `<div>` by BUG-LIB-shadow-pos 2026-05-15; the prior dossier's "`<td data-shadow-mount>`" is now stale).
- The Light `<falcon-table-tw>` ALSO has one real named slot: **`<slot name="row-expansion">`** (`[CODE]` falcon-table-tw.tsx:1643) — projected into the single-row expansion `<tr>` when `expandedRowId` matches.

**Angular basic wrapper (`falcon-angular-table`):**
- NO ng-template inputs. Cell content driven by `col.render()` or built-in column types.

For projected templates, use `<falcon-angular-data-table>` — see [`falcon-data-table/API.md`](../falcon-data-table/API.md).

## Forms support

- **No CVA.** Tables are not form controls.

## Signal compatibility

- Stencil props are reactive. Angular basic wrapper uses `@Input` + `ngOnChanges + syncProps()` to push object props onto the element (not template `[attr.x]` which only handles primitives).
- The basic wrapper sets `el.rows = …; el.columns = …; el.selectedRowIds = …; el.sortBy = …` via `ElementRef.nativeElement`.

## Variants / modes

- **Selection:** `none` / `single` (radio column) / `multiple` (checkbox column + header select-all + indeterminate)
- **Sort:** `single` / `multiple` (shift/meta/ctrl-click adds; per-priority badge)
- **Density:** `compact` / `comfortable` / `spacious`
- **Responsive layout:** `scroll` / `stack`
- **Lazy:** server-side mode pass-through (skip client filter/sort/paginate)
- **Scrollable:** sticky thead + `maxHeight` clamp
- **Frozen:** `'left' | 'right' | true` (`true` = `'left'`)
- **Sticky actions:** opt-in trailing action column pinned to inline-end

## Accessibility (verified in source)

- `role="grid"` on `<table>` (`falcon-table.tsx:503`, `falcon-table-tw.tsx:564`)
- `aria-rowcount` on `<table>` = `lazy ? totalRecords : filteredRows.length`
- `aria-busy="true|false"` on `<table>` and `<tbody>` reflects `loading`
- `aria-live="polite"` on `<tbody>` (only place this body emits — keeps screen readers up to date with row count + skeleton)
- `aria-label` on `<table>` from the `ariaLabel` prop
- Per-`<th>` `aria-sort="ascending|descending|none"` for sortable headers
- Per-`<tr>` `aria-selected="true|false"` when selection is enabled
- Select-all checkbox: `aria-label="Select all rows"`
- Row-action button: `aria-label="Actions for row N"`
- `aria-hidden="true"` on the sort glyph + skeleton rows + the `⋮` icon
- `[CODE]` Row-action `⋮` icon is **`<i class="falcon-icon falcon-icon-ellipsis-v">`** in BOTH paths (falcon-table.tsx:660 Shadow / falcon-table-tw.tsx:1621 via `falconTableRowActionIconClasses()`). The shadow-row chevron is `falcon-icon falcon-icon-chevron-down` (falcon-table-tw.tsx:1608). **No PrimeIcon (`pi pi-*`) anywhere in live source** — the prior dossier's FT-01 P0 is RESOLVED. (Only the stale compiled `falcon-table.js:402` build artifact still contains `pi pi-ellipsis-v`; that file is out of sweep scope.)
- Row `tabIndex={0}` (falcon-table.tsx:601 / falcon-table-tw.tsx:1510) so each row is keyboard-focusable (no Arrow-key nav implemented — see GAPS FT-03)
- `[CODE]` Sortable `<th>` has an `onClick` handler (falcon-table.tsx:556 / falcon-table-tw.tsx:1416) but **NO `tabindex` / keydown** — sort is not keyboard-activatable (GAP FT-02, still open in both paths).
- `<input type="search">` for global filter, `aria-label="Search"`

## Important constraints

- Angular `[attr.x]` only sets HTML attributes (strings). Object/array props (`rows`, `columns`, `selectedRowIds`, `sortBy`, `rowsPerPageOptions`, `globalFilterFields`, `rowStyleClass`) MUST be set as element properties via `ElementRef.nativeElement`. The basic wrapper does this in `syncProps()`; `<falcon-angular-data-table>` does the same.
- Kebab-case Stencil event names do not reliably bind via Angular template `(falcon-cells-mounted)` for some custom-element events — `<falcon-angular-data-table>` falls back to `addEventListener` for these handlers (`falcon-data-table.component.ts:381-387`).
- `col.render()` returns HTML; rendered via `innerHTML`. Consumer is responsible for sanitisation (call-out at `falcon-table.types.ts:35-36`).
- `currentPageReportTemplate` / `paginatorTemplate` strings carry PrimeNG-shaped tokens; the templating engine lives inside `<falcon-paginator>`. The token vocabulary is `CurrentPageReport | FirstPageLink | PrevPageLink | NextPageLink | LastPageLink | PageLinks | JumpToPageInput | RowsPerPageDropdown`.
- Last-row border suppression is applied via a global CSS rule outside `@theme`: `[data-component="falcon-table-container"] tbody tr:last-child td { border-bottom: 0; }` (token file lines 153-156).
- `[CODE]` **`loading=true` is a HARD SWAP** (runtime-verified platform rule 2026-05-21): every data `<tr>` is unmounted and only skeleton rows render (falcon-table-tw.tsx:1458-1482 — `data-loading-mount` + skeleton-rows-when-loading; `{!hostsExternalCells && renderCell}` is gated off). Therefore **row-level mutations must NOT toggle `[loading]`** — that would blank the whole grid. The platform pattern is a consumer-side `busyRowIds: Set<string>` + an `isRowBusy(id)` cell guard inside the projected cell template (see `[CODE]` `libs/falcon/src/shared-features/service-pricing-table/service-pricing-table.component.ts:179,542` + `apps/.../service-pricing/`, `comms-hub`, `marketplace-applications`). `busyRowIds` is NOT an input on `<falcon-angular-data-table>` itself — it lives on the consuming feature wrapper, which renders a per-row spinner via its own cell template while the table's own `[loading]` stays untouched.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B08) against falcon-table.tsx (690 ln), falcon-table-tw.tsx (1702 ln), falcon-table.types.ts (227 ln), falcon-table.component.ts (207 ln). Drift corrected: added `actionsHeaderLabel`/`actionsVisibleField`/`expandedRowId` + the full shadow-row prop/event suite + `row-expansion` slot + `headerInset` type field; row-action icon is `falcon-icon` (PrimeIcon FT-01 RESOLVED); `data-shadow-mount` moved to `<div>`; documented the `loading`-hard-swap + `busyRowIds` consumer pattern.
