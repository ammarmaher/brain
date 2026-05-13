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
| `stickyActions` (reflect) | `boolean` | `false` | Pin last column to inline-end |
| `responsiveLayout` (reflect) | `'scroll' \| 'stack'` | `'scroll'` | |

### Strategy E (`falcon-table-tw` only)

| Prop | Type | Default | Notes |
|---|---|---|---|
| `hostsExternalCells` | `boolean` | `false` | When true: Stencil renders empty `<td data-cell-mount=…>` cells; emits `falcon-cells-mounted` after each render |
| `paginatorDropdownAppendTo` | `string \| undefined` | — | Propagated to `<falcon-paginator-tw>` (parity placeholder until rows-per-page atom swaps to a Falcon dropdown) |

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
}

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
- The Light `<falcon-table-tw>` exposes Strategy E projection points (not slots — `<td data-cell-mount=…>` mount-points) when `hostsExternalCells=true`. Empty: `[data-empty-mount]`. Loading: `[data-loading-mount]`. Headers: `[data-header-mount=…]`.

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
- Row `tabIndex={0}` so each row is keyboard-focusable (no Arrow-key nav implemented — see GAPS)
- `<input type="search">` for global filter, `aria-label="Search"`

## Important constraints

- Angular `[attr.x]` only sets HTML attributes (strings). Object/array props (`rows`, `columns`, `selectedRowIds`, `sortBy`, `rowsPerPageOptions`, `globalFilterFields`, `rowStyleClass`) MUST be set as element properties via `ElementRef.nativeElement`. The basic wrapper does this in `syncProps()`; `<falcon-angular-data-table>` does the same.
- Kebab-case Stencil event names do not reliably bind via Angular template `(falcon-cells-mounted)` for some custom-element events — `<falcon-angular-data-table>` falls back to `addEventListener` for these handlers (`falcon-data-table.component.ts:381-387`).
- `col.render()` returns HTML; rendered via `innerHTML`. Consumer is responsible for sanitisation (call-out at `falcon-table.types.ts:35-36`).
- `currentPageReportTemplate` / `paginatorTemplate` strings carry PrimeNG-shaped tokens; the templating engine lives inside `<falcon-paginator>`. The token vocabulary is `CurrentPageReport | FirstPageLink | PrevPageLink | NextPageLink | LastPageLink | PageLinks | JumpToPageInput | RowsPerPageDropdown`.
- Last-row border suppression is applied via a global CSS rule outside `@theme`: `[data-component="falcon-table-container"] tbody tr:last-child td { border-bottom: 0; }` (token file lines 153-156).
