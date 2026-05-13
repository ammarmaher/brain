# falcon-data-table — API

## Selector + import

```typescript
import { FalconAngularDataTableComponent }
  from '@falcon-ui-core/angular-wrapper/components/falcon-data-table';
```

Selector: `falcon-angular-data-table`

Composed Stencil tag: `<falcon-table-tw>` (Light DOM, with `hosts-external-cells=""`)

## Inputs — 1:1 with legacy `<falcon-data-table>` API

| Input | Type | Default | Notes |
|---|---|---|---|
| `useTailwind` | `boolean` | `true` | API-symmetry only; data-table always renders Light DOM `<falcon-table-tw>` |
| `data` | `readonly T[]` | `[]` | Generic typed row payload — `T extends Record<string, unknown>` |
| `columns` | `readonly ColumnDef[]` | `[]` | Column descriptors (see types below) |
| `selectable` | `boolean` | `false` | Toggles checkbox/radio column |
| `selectionMode` | `'single' \| 'multiple'` | `'multiple'` | |
| `selection` | `T[] \| T \| null` | `null` | Two-way `[(selection)]`. Array for multi, scalar for single |
| `paginator` | `boolean` | `true` | Renders the footer paginator |
| `rows` | `number` | `10` | Page size (mirrors PrimeNG name) |
| `rowsPerPageOptions` | `number[] \| undefined` | — | Rows-per-page dropdown options |
| `dataKey` | `string` | `'id'` | Row-id resolver field |
| `emptyMessageKey` | `string` | `'No records to display.'` | i18n key (consumer translates) |
| `emptyMessage` | `string \| undefined` | — | Pre-translated, beats `emptyMessageKey` |
| `lazy` | `boolean` | `false` | Server-side mode |
| `totalRecords` | `number \| null` | `null` | Required for lazy mode |
| `sortMode` | `'single' \| 'multiple'` | `'single'` | |
| `loading` | `boolean` | `false` | Renders skeleton rows |
| `skeletonRows` | `number` | `6` | |
| `scrollable` | `boolean` | `false` | Sticky thead + maxHeight clamp |
| `scrollHeight` | `string \| undefined` | — | CSS length or `'flex'` |
| `striped` | `boolean` | `false` | |
| `hoverable` | `boolean` | `true` | |
| `tableStyleClass` | `string` | `''` | Class on the inner `<table>` |
| `rootClass` | `string` | `''` | Host-applied class |
| `rowStyleClass` | `((row: T) => string) \| null` | `null` | Per-row dynamic class |
| `reorderableColumns` | `boolean` | `false` | API parity placeholder — not yet implemented |
| `resizableColumns` | `boolean` | `false` | API parity placeholder — not yet implemented |
| `showGlobalFilter` | `boolean` | `false` | Search input above table |
| `globalFilterFields` | `string[]` | `[]` | Fields filtered by the search input |
| `globalFilterValue` | `string \| undefined` | — | Initial filter value |
| `rowMenuItems` | `FalconDataTableMenuItem[] \| null` | `null` | Untyped (legacy MenuItem-compatible) row menu |
| `boundMenuItems` | `FalconDataTableMenuItem[] \| ((row: T) => FalconDataTableMenuItem[]) \| null` | `null` | Per-row menu (array OR callback) |
| `rowActions` | `ReadonlyArray<FalconDataTableRowMenuAction<T>> \| null` | `null` | Typed per-row action menu (PREFERRED) |
| `actionFlags` | `Record<string, boolean>` | `{}` | Feature flags consumed by `enableFlag` |
| `stickyActions` | `boolean` | `false` | Pin last column to inline-end + shadow |
| `paginatorDropdownAppendTo` | `string \| undefined` | — | Forwarded to paginator rows-per-page wrapper |

## Outputs

| Output | Type | When |
|---|---|---|
| `selectionChange` | `EventEmitter<T[] \| T \| null>` | Two-way `[(selection)]` |
| `sortChange` | `EventEmitter<FalconDataTableSortChange>` (`{ field, order: 1 \| -1 }`) | Sort change (legacy shape) |
| `lazyLoad` | `EventEmitter<FalconDataTableLazyLoad>` | Server-side page/sort/filter |
| `rowAction` | `EventEmitter<FalconDataTableRowAction<T>>` (`{ action, row }`) | Row-menu item activated |
| `rowMenuAction` | `EventEmitter<FalconDataTableRowAction<T>>` | Legacy alias of `rowAction` |
| `globalFilterChange` | `EventEmitter<string>` | Search input change |

## TypeScript types (from `falcon-data-table.types.ts`)

```ts
type FalconDataTableAlign = 'left' | 'center' | 'right';
type FalconDataTableFrozen = 'left' | 'right';

interface ColumnDef {
  readonly field: string;
  readonly headerKey: string;          // i18n key OR plain label
  readonly sortable?: boolean;
  readonly widthClass?: string;        // header Tailwind class
  readonly tdClass?: string;           // cell Tailwind class
  readonly width?: string;             // inline width
  readonly maxWidth?: string;          // inline max-width
  readonly align?: FalconDataTableAlign;
  readonly render?: (row: unknown) => string;       // HTML string fallback
  readonly template?: TemplateRef<unknown>;         // Inline template ref (beats render)
  readonly headerTemplate?: TemplateRef<unknown>;
  readonly frozen?: FalconDataTableFrozen;          // 'left' | 'right'
}

interface FalconDataTableRowAction<T> {
  readonly action: string;
  readonly row: T;
}

interface FalconDataTableSortChange {
  readonly field: string;
  readonly order: 1 | -1;
}

interface FalconDataTableLazyLoad {
  readonly first: number;
  readonly rows: number;
  readonly sortField?: string | null;
  readonly sortOrder?: 1 | -1 | null;
  readonly globalFilter?: string | null;
  readonly filters?: Record<string, unknown> | null;
}

interface FalconDataTableRowMenuAction<T> {
  readonly id: string;
  readonly labelKey: string;
  readonly icon?: string;
  readonly visible?: (row: T) => boolean;
  readonly disabled?: boolean | ((row: T) => boolean);
  readonly enableFlag?: string;
  readonly flagMode?: 'disable' | 'hide';
}

interface FalconDataTableMenuItem {
  readonly id?: string;
  readonly label?: string;
  readonly icon?: string;
  readonly disabled?: boolean;
  readonly visible?: boolean;
  readonly command?: () => void;
}
```

## Angular template projection directives

All four standalone, all colocated in `falcon-data-table-cell.directive.ts`:

```ts
@Directive({ selector: '[falconDataTableCell]',       standalone: true })
class FalconDataTableCellDirective {
  @Input('falconDataTableCell') field!: string;
  readonly template = inject(TemplateRef<unknown>);
}

@Directive({ selector: '[falconDataTableHeaderCell]', standalone: true })
class FalconDataTableHeaderCellDirective {
  @Input('falconDataTableHeaderCell') field!: string;
  readonly template = inject(TemplateRef<unknown>);
}

@Directive({ selector: '[falconDataTableEmpty]',       standalone: true })
class FalconDataTableEmptyDirective {
  readonly template = inject(TemplateRef<unknown>);
}

@Directive({ selector: '[falconDataTableLoading]',     standalone: true })
class FalconDataTableLoadingDirective {
  readonly template = inject(TemplateRef<unknown>);
}
```

**Template context for `falconDataTableCell`:**

```ts
{ $implicit: row, row, value: row[field], field, rowIndex }
```

**Template context for `falconDataTableHeaderCell`:**

```ts
{ $implicit: column, field }
```

## How Strategy E (cell projection) works — actual flow

1. Component template (`falcon-data-table.component.html:30`) sets `[attr.hosts-external-cells]="''"` on `<falcon-table-tw>`.
2. Stencil renders `<td>` cells with `data-cell-mount="<field>"`, `data-row-id`, `data-row-index` — bodies empty.
3. Stencil emits `falcon-cells-mounted` with payload `{ cellMounts: [{rowId, rowIndex, field, element, kind}], empty, loading }` after every render.
4. The wrapper's `attachHandlers()` does `el.addEventListener('falcon-cells-mounted', this.cellsMountedHandler)`.
5. `onCellsMounted(detail)` runs inside `NgZone`. For each mount:
   - `lookupTemplate(m)` checks `col.template` → projected `[falconDataTableCell]` directive → null.
   - If a template exists, `tpl.createEmbeddedView(ctx)` produces an `EmbeddedViewRef`. Root nodes are inserted via `m.element.replaceChildren(...view.rootNodes)`.
   - The view is cached in `viewRegistry.set(key, view)` where `key = "${rowId}::${field}::${kind}"`.
   - On subsequent renders, the cached view is reused — context patched, `detectChanges()`, re-attached if Stencil swapped the host `<td>`.
   - **Fallback (`hostsExternalCells=true` cells with NO template AND NO `col.render`):** the wrapper writes plain text `String(row[field] ?? '')` into the cell so it doesn't render empty (`falcon-data-table.component.ts:416-432`).
6. Orphaned views (rows removed since last render) are destroyed and cleared from the registry.
7. `syncEmptyView()` / `syncLoadingView()` do the equivalent for the empty + loading slots.
8. `ngOnDestroy()` destroys all registered views to avoid leaks.

## Row-action menu wiring

1. Template renders `<falcon-angular-menu #rowMenu [items]="menuItems()" [popup]="true" [appendTo]="'body'" [useTailwind]="true" (falconMenuItemSelect)="onMenuItemSelect($event)">` only when `(rowActions && rowActions.length) || boundMenuItems || rowMenuItems`.
2. `[attr.has-row-actions]` set on `<falcon-table-tw>` when any of the three above are non-empty.
3. Stencil emits `falcon-row-action-trigger` with `{ rowId, anchor }` when the `⋮` button is clicked.
4. `onRowActionTrigger()` finds the row, resolves the per-row menu items via `resolveMenuItemsForRow(row)`, then calls `this.rowMenu.showAt(detail.anchor)`.
5. `resolveMenuItemsForRow()` precedence (first non-empty wins):
   - `rowActions` (typed, with `visible(row)` + `enableFlag/flagMode` + `disabled(row)` predicates)
   - `boundMenuItems` if a callback `(row) => …` or array
   - `rowMenuItems` static array
6. Menu items pass `id` via `FalconMenuItem.data` (since `FalconMenuItem` has no `id` field). `onMenuItemSelect` round-trips that.

## Two-way `[(selection)]` mechanics

Internal `internalSelectedRowIds` signal — kept in sync from `[selection]` via `syncSelectionFromInput()` on `ngOnChanges`. When the user toggles a row, `onRowSelect()` reads the new `selectedRowIds` array from Stencil, resolves it back to `T[]` (or scalar in single-mode), and emits `selectionChange`.

## CVA support

**No.** The data-table is not a form control. Use `[(selection)]` for selection two-way binding.

## Accessibility (from composed `<falcon-table-tw>`)

Inherits everything from `<falcon-table-tw>`:
- `role="grid"` + `aria-rowcount` + `aria-busy` + `aria-label`
- Per-`<th>` `aria-sort` for sortable columns
- Per-`<tr>` `aria-selected` when selection is active
- Row-action button labelled per row
- The row-action menu is `<falcon-angular-menu>` (Falcon menu primitive with its own a11y)
