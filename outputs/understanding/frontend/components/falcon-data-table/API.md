# falcon-data-table — API

> **Wave 20 (2026-05-15) — Shadow rows API added.** See the dedicated section below for the column-targeted shadow-row API surface.
>
> **Wave 21 (2026-05-15) — Shadow row hardening.** Five additive enhancements: dev-mode validation when `targetColumn` doesn't resolve (FU-02), per-`<th>` ResizeObserver hardening (FU-03), `(shadowRowDeleteRequest)` convenience output (FU-04 re-scoped), sticky-actions + shadow row precedence (FU-05), and i18n-able aria-labels (FU-06). All strictly additive — no breaking changes. See the **Wave 21 additions** subsection below.



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

---

## Shadow rows — column-targeted inline detail rows (Wave 20, 2026-05-15)

> Shadow rows are full-width `<tr>` rows that appear UNDER an expanded parent row. Each shadow row has a small upward-pointing **notch** at its top edge that aligns to a target column header — visually linking the detail strip to a specific column. Multiple shadow rows per parent row are supported. View + edit modes share the same template via a `mode` context value.

### Inputs

| Input | Type | Default | Notes |
|---|---|---|---|
| `shadowRows` | `Map<RowKey, ReadonlyArray<ShadowRow>> \| Record<string, ReadonlyArray<ShadowRow>> \| ((row: T) => ReadonlyArray<ShadowRow>) \| null` | `null` | Per-parent-row shadow descriptors. Null/empty = feature OFF (zero render cost). |
| `expandedShadowRowIds` | `ReadonlyArray<RowKey>` | `[]` | Two-way `[(expandedShadowRowIds)]`. Subset of parent row-ids whose shadows are currently rendered. |
| `shadowRowModes` | `Map<string, 'view' \| 'edit'>` | new Map() | Two-way `[(shadowRowModes)]`. Composite key `"${rowId}::${shadowId}"` → mode override. |
| `shadowEditLabel` | `string` | `'Edit'` | i18n-translated label for default trailing-action button (view mode). |
| `shadowDeleteLabel` | `string` | `'Delete'` | i18n-translated label for default trailing-action button (view mode). |
| `shadowSaveLabel` | `string` | `'Save'` | i18n-translated label for default trailing-action button (edit mode). |
| `shadowCancelLabel` | `string` | `'Cancel'` | i18n-translated label for default trailing-action button (edit mode). |

### Outputs

| Output | Payload | When |
|---|---|---|
| `expandedShadowRowIdsChange` | `ReadonlyArray<RowKey>` | Chevron toggled → new set of expanded parents |
| `shadowRowModesChange` | `Map<string, 'view' \| 'edit'>` | Mode mutated via `startEdit()` / `save()` / `cancel()` context callbacks |
| `shadowRowEdit` | `{ row: T, shadow: ShadowRow }` | Default `Edit` button clicked OR `startEdit()` called from template |
| `shadowRowDelete` | `{ row: T, shadow: ShadowRow }` | Default `Delete` button clicked |
| `shadowRowSave` | `{ row: T, shadow: ShadowRow, patch?: unknown }` | Default `Save` button clicked OR `save(patch)` called from template |
| `shadowRowCancel` | `{ row: T, shadow: ShadowRow }` | Default `Cancel` button clicked OR `cancel()` called from template |

### TypeScript types

```ts
interface ShadowRow {
  readonly id: string;                     // unique within the parent row
  readonly targetColumn: string;           // ColumnDef.field key — notch aligns to this column header
  readonly mode?: 'view' | 'edit';         // default initial mode (overridden by shadowRowModes)
  readonly data?: unknown;                 // arbitrary payload, available in the template context
}

interface FalconDataTableShadowContext<T> {
  readonly row: T;
  readonly shadow: ShadowRow;
  readonly mode: 'view' | 'edit';
  readonly startEdit: () => void;
  readonly save: (patch?: unknown) => void;
  readonly cancel: () => void;
  readonly delete: () => void;
}
```

### Projection directives

```ts
@Directive({ selector: '[falconDataTableShadow]',         standalone: true })
class FalconDataTableShadowDirective { /* template ref */ }

@Directive({ selector: '[falconDataTableShadowActions]',  standalone: true })
class FalconDataTableShadowActionsDirective { /* template ref */ }
```

Template context for both = `FalconDataTableShadowContext<T>` (see above).

If `falconDataTableShadowActions` is NOT projected, the table renders default `Edit/Delete` (view) or `Save/Cancel` (edit) buttons. If it IS projected, the consumer takes full ownership of the action zone.

### Notch / arrow positioning (lib-owned — Wave 20)

- The notch is a CSS triangle (border-trick) rendered ABOVE the shadow row's top edge via `position: absolute; top: calc(-1 * var(--falcon-data-table-shadow-arrow-size))`.
- `x` is computed by `falcon-table-tw.updateShadowArrowPositions()` after each render — measures the target column header's `getBoundingClientRect()` centre, subtracts the shadow `<td>`'s own left, subtracts half the arrow's `offsetWidth`.
- Recomputes on: initial mount (sync, then `requestAnimationFrame`), `ResizeObserver` on the table host, `window.resize`.
- Consumers MUST NEVER hardcode the notch position or render their own indicator — `targetColumn` is the only public contract.

### Internal Stencil DOM contract

| Attribute | Carrier | Purpose |
|---|---|---|
| `data-shadow-mount="${rowId}::${shadowId}"` | shadow `<td>` | Body mount-point for the consumer's `[falconDataTableShadow]` template |
| `data-shadow-actions-mount=""` | actions `<div>` inside shadow `<td>` | Mount-point for the consumer's `[falconDataTableShadowActions]` template (or default buttons) |
| `data-shadow-mode="view" \| "edit"` | shadow `<td>` | Mode hint readable by the wrapper |
| `data-shadow-target-column="${field}"` | shadow `<td>` | Column-key the notch aligns to |
| `data-shadow-arrow=""` | notch `<span>` inside shadow `<td>` | Targeted by `updateShadowArrowPositions` |
| `data-shadow-arrow-ready=""` | notch `<span>` (post-position) | Set once the arrow has a real `left` value — visibility flip flag |
| `data-shadow-row-id="${rowId}"` | shadow `<tr>` | Parent row id (string-coerced) |
| `data-shadow-id="${shadowId}"` | shadow `<tr>` | Shadow descriptor id |
| `data-shadow-chevron=""` | toggle button in the parent row's actions cell | Selector for E2E tests |

### Stencil events (consumed by the Angular wrapper — not part of the public API)

| Event | Payload | Purpose |
|---|---|---|
| `falcon-shadow-toggle` | `{ rowId }` | Chevron clicked |
| `falcon-shadow-cells-mounted` | `{ shadowMounts: ShadowMount[] }` | Emitted after every render with one entry per `<td data-shadow-mount>` for Angular template projection |
| `falcon-shadow-action` | `{ rowId, shadowId, action: 'edit' \| 'delete' \| 'save' \| 'cancel' }` | Default trailing-action button clicked |
| `falcon-shadow-delete-request` *(Wave 21)* | `{ rowId, shadowId, proposedShadowsForRow }` | Convenience event — fires alongside `falcon-shadow-action` when default Delete clicked. Carries proposed-new-shadow-meta array (parent's shadows minus the deleted one). |

---

## Wave 21 additions (2026-05-15) — Shadow row hardening

### New inputs (all opt-in, no breaking changes)

| Input | Type | Default | Notes |
|---|---|---|---|
| `shadowChevronAriaLabel` | `string` | `'Toggle row detail'` | i18n-able aria-label for the parent-row chevron toggle. Forwarded to the Stencil `<falcon-table-tw>` element. |
| `shadowEditAriaLabel` | `string \| null` | `null` | Aria-label override for the default `Edit` button (view mode). When null, falls back to `shadowEditLabel`. |
| `shadowDeleteAriaLabel` | `string \| null` | `null` | Aria-label override for the default `Delete` button (view mode). When null, falls back to `shadowDeleteLabel`. |
| `shadowSaveAriaLabel` | `string \| null` | `null` | Aria-label override for the default `Save` button (edit mode). When null, falls back to `shadowSaveLabel`. |
| `shadowCancelAriaLabel` | `string \| null` | `null` | Aria-label override for the default `Cancel` button (edit mode). When null, falls back to `shadowCancelLabel`. |

### New output

| Output | Payload | When |
|---|---|---|
| `shadowRowDeleteRequest` | `{ row: T, shadow: ShadowRow, proposedShadowsForRow: ReadonlyArray<ShadowRow> }` | Default `Delete` button clicked. Fires ALONGSIDE the existing `shadowRowDelete` event — consumer chooses which to wire. The proposed array is the parent's current `shadowRows` minus the deleted one, in the same order. Apply as-is OR ignore and run your own logic. See `DECISION.md` for the rationale (consumer-derived collection state, ownership clarity). |

### Behaviour changes (no API change)

- **FU-02 — Dev-mode validation.** When `ShadowRow.targetColumn` doesn't resolve to a visible `<th data-column-key="…">`, the arrow is now hidden silently AND a single `console.warn` is emitted per `(targetColumn, parentRowId, shadowId)` tuple. Tree-shaken in production via Stencil's `Build.isDev`. Throttled — only ever warns once per misconfigured tuple, even on repeated resizes.
- **FU-03 — Per-`<th>` ResizeObserver.** The existing host-level ResizeObserver now also observes every visible `<th data-column-key="…">`. Column-width changes (e.g. `width: auto` columns whose async content arrives later) trigger arrow re-positioning with one-frame latency. Uses the SAME ResizeObserver instance — no new allocations. The header set is synced inside `componentDidRender` and cleaned up in `disconnectedCallback`.
- **FU-05 — Sticky actions + shadow row precedence.** When `[stickyActions]="true"` AND the parent row has trailing actions (`hasRowActions=true` OR `hasShadowRows=true`), each shadow `<tr>` now renders TWO `<td>`s: a main body cell spanning `(totalCols - 1)` (hosts the arrow + consumer template) AND a trailing sticky cell at the inline-end (hosts the default action buttons or projected `falconDataTableShadowActions` template). When `stickyActions=false` OR there are no row actions, the existing single-cell layout is preserved bit-for-bit.
