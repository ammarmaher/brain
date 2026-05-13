# falcon-table — USAGE

## Admin-console organization-hierarchy menu (data-table, lazy + paginated)

`apps/admin-console/src/app/features/organization-hierarchy/components/organization-hierarchy-menu.component.html`

```html
<falcon-angular-data-table
  class="org-menu-users-table"
  [data]="state.users()"
  [columns]="state.userColumns"
  [rowMenuItems]="state.userRowMenuItems"
  [paginator]="true"
  [lazy]="true"
  [totalRecords]="state.totalUsers()"
  [loading]="state.loadingUsers()"
  [globalFilterFields]="['name', 'email', 'role']"
  (lazyLoad)="state.loadUsers($event)"
  (rowAction)="state.openUserRowMenu($event)"
></falcon-angular-data-table>
```

What this shows:

- **Signal-driven data** — `state.users()`, `state.totalUsers()`, `state.loadingUsers()` are signals on the feature state service.
- **Lazy mode** — `[lazy]="true"` + `[totalRecords]` + `(lazyLoad)` — server pagination + sort + filter dispatch.
- **Per-row menu** — `[rowMenuItems]` declared on state, `(rowAction)` handler opens it. The table emits `falcon-row-action-trigger` internally; the wrapper translates to Angular outputs.
- **Global filter** — `[globalFilterFields]` lists which row fields the filter strip queries.

## Management-console organization-hierarchy page menu (data-table)

`apps/management-console/src/app/features/organization-hierarchy-page/components/organization-hierarchy-page-menu.component.html`

```html
<falcon-angular-data-table
  [data]="state.users()"
  [columns]="state.userColumns"
  [rowMenuItems]="state.userRowMenuItems"
  [paginator]="true"
  [lazy]="true"
  [totalRecords]="state.totalUsers()"
  [pageSize]="20"
  [responsiveLayout]="'scroll'"
></falcon-angular-data-table>
```

Same shape as admin-console but with the management-console's state service. Both feature implementations follow the identical pattern — the data-table wrapper is the single replacement for every PrimeNG `<p-table>` in the platform.

## Custom cell templates (via FalconDataTableCellDirective)

```html
<falcon-angular-data-table [data]="users" [columns]="cols" [paginator]="true">
  <!-- Column field: 'name' -->
  <ng-template [falconCell]="'name'" let-row>
    <div class="flex items-center gap-3">
      <falcon-angular-avatar [name]="row.name" size="sm"></falcon-angular-avatar>
      <div>
        <div class="font-medium">{{ row.name }}</div>
        <div class="text-xs text-falcon-neutral-475">{{ row.email }}</div>
      </div>
    </div>
  </ng-template>

  <!-- Column field: 'status' -->
  <ng-template [falconCell]="'status'" let-row>
    <falcon-angular-status-badge [status]="row.status" [label]="row.statusLabel"></falcon-angular-status-badge>
  </ng-template>

  <!-- Column field: 'role' -->
  <ng-template [falconCell]="'role'" let-row>
    <falcon-angular-tag [value]="row.roleLabel" [severity]="row.role === 'admin' ? 'danger' : 'info'"></falcon-angular-tag>
  </ng-template>
</falcon-angular-data-table>
```

## Stencil-only usage (Shadow DOM, no Angular)

```html
<falcon-table id="myTable" data-key="id" selectable="multiple" sortable density="compact" striped hoverable>
</falcon-table>

<script>
  const table = document.getElementById('myTable');
  table.columns = [
    { field: 'name',  header: 'Name',  sortable: true },
    { field: 'email', header: 'Email' },
    { field: 'role',  header: 'Role',  align: 'right' },
  ];
  table.rows = [
    { id: 1, name: 'Alice', email: 'a@co.com', role: 'Admin' },
    { id: 2, name: 'Bob',   email: 'b@co.com', role: 'User' },
  ];
  table.addEventListener('falcon-row-select', (e) => console.log('Selected:', e.detail.selectedRowIds));
  table.addEventListener('falcon-sort',       (e) => console.log('Sort:',     e.detail));
</script>
```

## Sort modes

```html
<!-- Single-column sort -->
<falcon-angular-table [rows]="rows" [columns]="cols" [sortMode]="'single'" [sortBy]="{ field: 'name', direction: 'asc' }"></falcon-angular-table>

<!-- Multi-column sort -->
<falcon-angular-table [rows]="rows" [columns]="cols" [sortMode]="'multi'" [sortBy]="[
  { field: 'department', direction: 'asc' },
  { field: 'name', direction: 'asc' }
]"></falcon-angular-table>
```

## Frozen columns + sticky actions

```ts
const columns: FalconTableColumn[] = [
  { field: 'id', header: 'ID', frozen: 'left', width: '64px' },
  { field: 'name', header: 'Name', frozen: 'left', width: '200px' },
  { field: 'department', header: 'Department' },
  { field: 'role', header: 'Role' },
  // ... more columns
  { field: 'actions', header: '', frozen: 'right', width: '48px' },
];
```

```html
<falcon-angular-table
  [rows]="rows"
  [columns]="columns"
  [scrollable]="true"
  [scrollHeight]="'480px'"
  [stickyActions]="true"
  [hasRowActions]="true"
></falcon-angular-table>
```

## Per-row class hook

```ts
const rowStyleClass: FalconTableRowStyleClassFn = (row: User) => ({
  'opacity-50': row.disabled,
  'bg-falcon-red-50': row.flagged,
});
```

```html
<falcon-angular-table [rows]="rows" [columns]="cols" [rowStyleClass]="rowStyleClass"></falcon-angular-table>
```

## Per-instance token override

```css
:host ::ng-deep .org-menu-users-table {
  --falcon-table-row-height: 3rem;
  --falcon-table-header-bg: var(--color-falcon-teal-tint);
  --falcon-table-row-hover-bg: var(--color-falcon-teal-option);
}
```

Applied with:

```html
<falcon-angular-data-table class="org-menu-users-table" ...></falcon-angular-data-table>
```
