# falcon-table — API

## Tag map

| Render path | Tag |
|---|---|
| Angular wrapper (table) | `<falcon-angular-table>` |
| Angular wrapper (data-table — Strategy E projection) | `<falcon-angular-data-table>` |
| Stencil Shadow | `<falcon-table>` |
| Stencil Light | `<falcon-table-tw>` |

## Types (from `falcon-table.types.ts`, re-exported from the Angular barrel)

```ts
type FalconTableColumnAlign = 'left' | 'center' | 'right';
type FalconTableColumnType = 'text' | 'number' | 'date' | 'badge' | 'custom';
type FalconTableColumnFrozen = boolean | 'left' | 'right';
type FalconTableDensity = 'comfortable' | 'compact';
type FalconTableSelectionMode = 'none' | 'single' | 'multiple';
type FalconTableSortDirection = 'asc' | 'desc';
type FalconTableSortMode = 'single' | 'multi';
type FalconTableResponsiveLayout = 'scroll' | 'stack';

interface FalconTableColumn {
  field: string;
  header: string;
  width?: string;
  maxWidth?: string;
  align?: FalconTableColumnAlign;
  sortable?: boolean;
  type?: FalconTableColumnType;
  frozen?: FalconTableColumnFrozen;
  headerClass?: string;
  cellClass?: string;
  render?: (row: unknown, col: FalconTableColumn) => string;
}

interface FalconTableColumnExt extends FalconTableColumn { /* PR-2 ext bag */ }

interface FalconTableSort { field: string; direction: FalconTableSortDirection; }
type FalconTableSortValue = FalconTableSort | ReadonlyArray<FalconTableSort> | null;

type FalconTableRowStyleClassFn = (row: unknown) => string | string[] | Record<string, boolean>;
type FalconTableRowStyleFunction = (row: unknown, index: number) => string | string[] | Record<string, boolean>;

// Event detail types
interface FalconTableRowClickDetail        { row: unknown; index: number; }
interface FalconTableRowSelectDetail       { row: unknown; selectedRowIds: ReadonlyArray<string | number>; }
interface FalconTableSortDetail            { field: string; direction: FalconTableSortDirection; }
interface FalconTableMultiSortDetail       { sort: ReadonlyArray<FalconTableSort>; }
interface FalconTableSelectAllDetail       { selectedRowIds: ReadonlyArray<string | number>; }
interface FalconTableEmptyDetail           { /* empty-state cell rendered */ }
interface FalconTableRowActionTriggerDetail{ row: unknown; index: number; trigger: HTMLElement; }
interface FalconTablePageChangeDetail      { page: number; pageSize: number; }
interface FalconTableLazyLoadDetail        { page: number; pageSize: number; sort: ReadonlyArray<FalconTableSort>; filter?: string; }
interface FalconTableGlobalFilterDetail    { value: string; }
```

## Props / @Input

### Data + columns

| Name | Type | Default | Notes |
|---|---|---|---|
| `rows` | `ReadonlyArray<Record<string, unknown>>` | `[]` | Source rows. |
| `columns` | `ReadonlyArray<FalconTableColumn \| FalconTableColumnExt>` | `[]` | Column definitions. |
| `dataKey` | `string` | `'id'` | PR-2 — selection key resolver. |

### Selection

| Name | Type | Default | Reflected | Notes |
|---|---|---|---|---|
| `selectable` | `'none' \| 'single' \| 'multiple'` | `'none'` | yes | Alias kept for backwards compat. |
| `selectionMode` | `'none' \| 'single' \| 'multiple'` | `'none'` | yes | Preferred prop. |
| `selectedRowIds` | `ReadonlyArray<string \| number>` | `[]` | mutable | Two-way; mutated by clicks. |

### Sort

| Name | Type | Default | Reflected | Notes |
|---|---|---|---|---|
| `sortBy` | `FalconTableSort \| FalconTableSort[] \| null` | `null` | mutable | Single or multi via `normaliseSortBy()`. |
| `sortMode` | `'single' \| 'multi'` | `'single'` | yes | |

### Pagination

| Name | Type | Default | Reflected | Notes |
|---|---|---|---|---|
| `paginated` | `boolean` | `false` | yes | |
| `pageSize` | `number` | `10` | no | |
| `currentPage` | `number` | `1` | mutable | |
| `rowsPerPageOptions` | `ReadonlyArray<number>?` | — | no | Drives the rows-per-page dropdown. |
| `currentPageReportTemplate` | `string` | `'{first} - {last} of {totalRecords}'` | no | Template tokens parsed internally. |
| `paginatorTemplate` | `string` | `'CurrentPageReport FirstPageLink PrevPageLink JumpToPageInput NextPageLink LastPageLink RowsPerPageDropdown'` | no | PrimeNG-shaped token list controlling which paginator sub-controls render. |

### Visual modifiers

| Name | Type | Default | Reflected | Notes |
|---|---|---|---|---|
| `density` | `'comfortable' \| 'compact'` | `'comfortable'` | yes | |
| `striped` | `boolean` | `false` | yes | |
| `hoverable` | `boolean` | `true` | yes | |
| `bordered` | `boolean` | `false` | yes | |
| `responsiveLayout` | `'scroll' \| 'stack'` | `'scroll'` | yes | |

### Loading + empty

| Name | Type | Default | Reflected | Notes |
|---|---|---|---|---|
| `loading` | `boolean` | `false` | yes | Sets `aria-busy` on tbody. |
| `skeletonRows` | `number` | `6` | no | PR-2 skeleton body row count when `loading=true`. |
| `emptyMessage` | `string` | `'No records to display.'` | no | |

### Scroll + frozen + sticky

| Name | Type | Default | Reflected | Notes |
|---|---|---|---|---|
| `scrollable` | `boolean` | `false` | yes | Enables sticky header + viewport height clamp. |
| `scrollHeight` | `string?` | — | no | e.g. `'400px'` or `'flex'`. |
| `stickyActions` | `boolean` | `false` | yes | Pins the actions column when present. |

### Class hooks (PR-2)

| Name | Type | Default | Notes |
|---|---|---|---|
| `styleClass` | `string?` | — | Host-level class. |
| `tableStyleClass` | `string?` | — | Native `<table>` element class. |
| `rowStyleClass` | `FalconTableRowStyleClassFn \| FalconTableRowStyleFunction \| undefined` | — | Per-row class callback. Returns string / string[] / `Record<string,boolean>` resolved via `resolveRowClass()`. |
| `hasRowActions` | `boolean` | `false` | When `true`, the row-action trigger column is rendered (consumer wires the menu). |
| `ariaLabel` | `string?` | — | |
| `disabled` | `boolean` | `false` | yes | |

### Lazy server-side mode (PR-3)

| Name | Type | Default | Notes |
|---|---|---|---|
| `lazy` | `boolean` | `false` | yes (reflected) — `lazyMode` |
| `totalRecords` | `number` | `0` | Required when `lazy=true`. |
| `globalFilterFields` | `ReadonlyArray<string>?` | — | Fields the global filter strip queries against. |
| `globalFilterValue` | `string?` | — | mutable — two-way binding. |

### Angular wrapper (data-table) extra inputs

`<falcon-angular-data-table>` (672 LOC) adds Angular template injection via `FalconDataTableCellDirective` and Angular-side state like `rowMenuItems`. Real-world usage:

```html
<falcon-angular-data-table
  [data]="state.users()"
  [columns]="state.userColumns"
  [rowMenuItems]="state.userRowMenuItems"
  [paginator]="true"
  [lazy]="true"
  [totalRecords]="state.totalUsers()"
  (rowAction)="onRowAction($event)"
></falcon-angular-data-table>
```

## Events (Stencil — all bubble + composed)

| Event | Detail | When |
|---|---|---|
| `falcon-row-click` | `FalconTableRowClickDetail` | Row clicked. |
| `falcon-row-select` | `FalconTableRowSelectDetail` | Selection toggled on a row. |
| `falcon-sort` | `FalconTableSortDetail` | Single-mode sort applied. |
| `falcon-multi-sort` | `FalconTableMultiSortDetail` | Multi-mode sort updated. |
| `falcon-select-all-change` | `FalconTableSelectAllDetail` | Header checkbox toggled. |
| `falcon-empty` | `FalconTableEmptyDetail` | Empty-state cell rendered. |
| `falcon-row-action-trigger` | `FalconTableRowActionTriggerDetail` | Row-action button clicked. Consumer opens the menu. |
| `falcon-page-change` | `FalconTablePageChangeDetail` | Pagination changed. |
| `falcon-lazy-load` | `FalconTableLazyLoadDetail` | Lazy mode — server request needed. Fires on init + page + sort + filter change. |
| `falcon-global-filter-change` | `FalconTableGlobalFilterDetail` | Global filter input changed. |

## Custom cell templates (Angular only, via `FalconDataTableCellDirective`)

```html
<falcon-angular-data-table [data]="users" [columns]="cols">
  <ng-template [falconCell]="'name'" let-row>
    <div class="flex items-center gap-2">
      <falcon-angular-avatar [name]="row.name" size="sm"></falcon-angular-avatar>
      <span>{{ row.name }}</span>
    </div>
  </ng-template>

  <ng-template [falconCell]="'status'" let-row>
    <falcon-angular-status-badge [status]="row.status"></falcon-angular-status-badge>
  </ng-template>
</falcon-angular-data-table>
```

The directive captures the `TemplateRef`, the data-table wrapper looks it up by column field at render time, and Angular `ngTemplateOutlet` projects it into the Light DOM cell. This is the Strategy E projection pattern referenced in `falcon-data-table.component.ts`.

## CSS variables (component-scoped)

Declared in `libs/falcon-ui-tokens/src/components/table.tokens.css` and `data-table.tokens.css`. Drive header / row / cell padding, borders, hover backgrounds, density variants, frozen-column shadow, sticky-thead offset, etc.
