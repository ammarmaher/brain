# falcon-data-table — USAGE

## Example 1 — Production usage from admin-console org-hierarchy

From `apps/admin-console/src/app/features/organization-hierarchy/components/organization-hierarchy-menu.component.html:147-196` (verbatim, abridged):

```html
<falcon-angular-data-table
  class="org-menu-users-table"
  [data]="state.users()"
  [columns]="state.userColumns"
  [rowMenuItems]="state.userRowMenuItems"
  [paginator]="true"
  [loading]="state.usersLoading()"
  [lazy]="true"
  [totalRecords]="state.usersTotalCount()"
  [rows]="state.usersPageSize()"
  emptyMessageKey="hierarchy.users.empty"
  (lazyLoad)="state.onUsersLazyLoad($event)"
  (rowAction)="state.onUserRowAction($event)">

  <!-- *** Status cell — coloured-dot pill inlined. *** -->
  <ng-template falconDataTableCell="status" let-value="value">
    @switch (value) {
      @case ('active') {
        <span class="inline-flex items-center h-5 px-2.5 rounded-full text-[11px] font-semibold leading-none capitalize whitespace-nowrap bg-falcon-green-50 text-falcon-green-700">
          <span class="w-1.5 h-1.5 rounded-full me-1.5 shrink-0 bg-falcon-green-500"></span>
          {{ 'hierarchy.status.active' | translate }}
        </span>
      }
      <!-- … pending / suspended / locked / deleted cases … -->
    }
  </ng-template>
</falcon-angular-data-table>
```

And the matching state in `hierarchy-page-state.service.ts:218-230`:

```typescript
readonly userColumns: ColumnDef[] = [
  { field: 'username',  headerKey: 'hierarchy.col.username',  sortable: true,  tdClass: 'font-medium text-falcon-neutral-900' },
  { field: 'firstName', headerKey: 'hierarchy.col.firstName', sortable: true },
  { field: 'email',     headerKey: 'hierarchy.col.email',     sortable: true,  tdClass: 'text-falcon-neutral-800' },
  // …
  { field: 'status',    headerKey: 'hierarchy.col.status',    sortable: true },
];

readonly userRowMenuItems: FalconDataTableMenuItem[] = [
  { id: 'moreDetails', label: this.i18n.translate('hierarchy.users.moreDetails'), icon: 'falcon-icon falcon-icon-info-circle' },
];

onUserRowAction(_event: FalconDataTableRowAction<User>): void {
  /*** wiring point for upcoming waves. ***/
}

onUsersLazyLoad(event: { first?: number; rows?: number }): void {
  // translate first+rows into 1-based PageNumber + PageSize, then API call
}
```

## Example 2 — Render Falcon Angular components inside cells

YES, you CAN render any Falcon component inside a cell template — projected templates produce real Angular `EmbeddedViewRef`s, so child components instantiate normally.

```html
<falcon-angular-data-table
  [data]="users()"
  [columns]="cols">

  <!-- *** Avatar column — uses falcon-angular-avatar inside the cell. *** -->
  <ng-template falconDataTableCell="avatar" let-row="row">
    <falcon-angular-avatar
      [src]="row.photoUrl"
      [name]="row.firstName + ' ' + row.lastName"
      size="sm"
      shape="circle">
    </falcon-angular-avatar>
  </ng-template>

  <!-- *** Status column — uses falcon-angular-status-badge. *** -->
  <ng-template falconDataTableCell="status" let-value="value">
    <falcon-angular-status-badge [severity]="value" [label]="('status.' + value) | translate">
    </falcon-angular-status-badge>
  </ng-template>

  <!-- *** Permissions column — uses falcon-angular-tag (multi). *** -->
  <ng-template falconDataTableCell="permissions" let-value="value">
    <div class="flex flex-wrap gap-1">
      @for (perm of value; track perm) {
        <falcon-angular-tag [value]="perm | translate" severity="info" size="sm"></falcon-angular-tag>
      }
    </div>
  </ng-template>

  <!-- *** Action column — inline Falcon buttons (when not using the rowMenu). *** -->
  <ng-template falconDataTableCell="quickActions" let-row="row">
    <falcon-angular-button variant="ghost" size="sm" (falconClick)="edit(row)">Edit</falcon-angular-button>
    <falcon-angular-button variant="ghost" size="sm" severity="danger" (falconClick)="remove(row)">Remove</falcon-angular-button>
  </ng-template>
</falcon-angular-data-table>
```

## Example 3 — Typed row actions with `rowActions`

When you want per-row visibility / disabled predicates + global feature flags:

```typescript
readonly userActions: FalconDataTableRowMenuAction<User>[] = [
  {
    id: 'edit',
    labelKey: 'common.edit',
    icon: 'falcon-icon falcon-icon-pencil',
    visible: (row) => row.status !== 'deleted',
    disabled: (row) => row.locked,
  },
  {
    id: 'reset-password',
    labelKey: 'users.resetPassword',
    icon: 'falcon-icon falcon-icon-refresh',
    enableFlag: 'feature.reset_password',
    flagMode: 'hide',
  },
  {
    id: 'remove',
    labelKey: 'common.remove',
    icon: 'falcon-icon falcon-icon-trash',
    visible: (row) => row.status !== 'deleted',
  },
];

readonly actionFlags = { 'feature.reset_password': true };
```

```html
<falcon-angular-data-table
  [data]="users()"
  [columns]="cols"
  [rowActions]="userActions"
  [actionFlags]="actionFlags"
  (rowAction)="handleAction($event)">
</falcon-angular-data-table>
```

```typescript
handleAction(ev: FalconDataTableRowAction<User>): void {
  switch (ev.action) {
    case 'edit': this.openEditor(ev.row); break;
    case 'reset-password': this.resetPassword(ev.row); break;
    case 'remove': this.confirmRemove(ev.row); break;
  }
}
```

## Example 4 — Two-way selection

```html
<falcon-angular-data-table
  [data]="items"
  [columns]="cols"
  [selectable]="true"
  selectionMode="multiple"
  [(selection)]="selectedItems">
</falcon-angular-data-table>

<falcon-angular-button
  [disabled]="selectedItems.length === 0"
  (falconClick)="deleteSelected(selectedItems)">
  Delete {{ selectedItems.length }} items
</falcon-angular-button>
```

## Example 5 — Empty + Loading templates

```html
<falcon-angular-data-table
  [data]="rows()"
  [columns]="cols"
  [loading]="loading()">

  <ng-template falconDataTableEmpty>
    <falcon-angular-empty-state
      iconName="users"
      titleText="No users found"
      descriptionText="Try clearing your filter or invite teammates.">
      <falcon-angular-button slot="action" (falconClick)="invite()">Invite teammate</falcon-angular-button>
    </falcon-angular-empty-state>
  </ng-template>

  <ng-template falconDataTableLoading>
    <div class="grid place-items-center py-12">
      <span class="text-falcon-neutral-600">Loading users…</span>
    </div>
  </ng-template>
</falcon-angular-data-table>
```

## Example 6 — Global filter + lazy load

```html
<falcon-angular-data-table
  [data]="page().items"
  [columns]="cols"
  [paginator]="true"
  [rows]="20"
  [lazy]="true"
  [totalRecords]="page().total"
  [showGlobalFilter]="true"
  [globalFilterFields]="['username', 'email', 'firstName']"
  (lazyLoad)="onLazy($event)"
  (globalFilterChange)="onGlobalFilter($event)">
</falcon-angular-data-table>
```

```typescript
onLazy(ev: FalconDataTableLazyLoad): void {
  this.usersApi.list({
    page: ev.first / ev.rows + 1,
    pageSize: ev.rows,
    sortField: ev.sortField ?? undefined,
    sortOrder: ev.sortOrder ?? undefined,
    q: ev.globalFilter ?? undefined,
  });
}
```

## Recommended usage for NEW Angular pages

1. Import `FalconAngularDataTableComponent` + the four projection directives (auto via the component class — they're standalone and `contentChildren`-collected).
2. Declare a typed `ColumnDef[]` in your feature state service.
3. Use `<ng-template falconDataTableCell="field">` for any non-text cell (status, avatar, action, multi-tag).
4. Use `[rowActions]` (typed) over `[rowMenuItems]` / `[boundMenuItems]` for new code.
5. Use `[lazy]="true"` + `(lazyLoad)` for server-side pagination.
6. Use `[showGlobalFilter]` + `[globalFilterFields]` for client-side string filter; for server-side filter, drive it through the `(globalFilterChange)` event into the same `lazyLoad` cycle.

## Reactive forms / ngModel

Not supported. The data-table is not a form control. Selection is two-way via `[(selection)]` only.

## Tailwind-only usage

- `[rootClass]` / `[tableStyleClass]` accept utility strings.
- `[tdClass]` and `[widthClass]` on each `ColumnDef` accept utility strings — propagated to per-cell `<td>` and `<th>` through the `adaptColumns()` helper.
- DO NOT add Tailwind in `[render]` HTML strings — use templates.

## Token override pattern (per-instance)

```html
<falcon-angular-data-table class="my-billing-table" ...></falcon-angular-data-table>
```

```css
.my-billing-table {
  --falcon-data-table-row-bg-hover: var(--color-falcon-teal-50);
  --falcon-data-table-cell-padding-x: 12px;
}
```

## Bad usage to avoid

- DO NOT use `col.render()` to embed Angular components — `render` returns a static HTML string that bypasses Angular. Use `<ng-template falconDataTableCell="field">` instead.
- DO NOT add `*ngIf` / `*ngFor` inside `<ng-template falconDataTableCell>` — use `@if` / `@for` (project rule).
- DO NOT call `this.rowMenu.showAt(...)` from outside the component — the menu is internal-only; trigger via the Stencil event chain (`falcon-row-action-trigger`).
- DO NOT bind `[(globalFilterValue)]` expecting a two-way contract. The component is one-way for that input; `(globalFilterChange)` emits the new value.
- DO NOT bind `[reorderableColumns]` or `[resizableColumns]` to true expecting behaviour — both are API parity placeholders without implementation.

## Import requirements

```typescript
import { FalconAngularDataTableComponent }
  from '@falcon-ui-core/angular-wrapper/components/falcon-data-table';
import type {
  ColumnDef,
  FalconDataTableMenuItem,
  FalconDataTableRowMenuAction,
  FalconDataTableRowAction,
  FalconDataTableLazyLoad,
  FalconDataTableSortChange,
} from '@falcon-ui-core/angular-wrapper/components/falcon-data-table';
```

The four projection directives are auto-imported via the component's content-child queries — you just need `FalconAngularDataTableComponent` in your standalone component's `imports: []`.

## Do / Don't

### Do
- Use `<ng-template falconDataTableCell="field">` for every non-text cell.
- Use `[rowActions]` (typed) with predicates for new menu UX.
- Use `[(selection)]` two-way binding with the matching `selectionMode`.
- Use `[lazy]="true"` + `[totalRecords]` for server-side pagination.
- Use `[showGlobalFilter]` + `[globalFilterFields]` for instant client filter.
- Use `[emptyMessage]` for pre-translated empty text (or `[emptyMessageKey]` if you'll translate inside the component).
- Render Falcon components inside cells (avatar / status-badge / tag / button) via the projected templates.

### Don't
- Don't use `col.render()` HTML strings for cells that need Angular interactivity.
- Don't drop down to `<falcon-table-tw>` or `<falcon-angular-table>` for new app code.
- Don't bind `[reorderableColumns]` / `[resizableColumns]` expecting behaviour.
- Don't ignore `<ng-template falconDataTableEmpty>` — empty pages benefit massively from `<falcon-angular-empty-state>` composition.
- Don't put expensive computations in `[rowStyleClass]` — it runs once per row per render.
