---
type: rules
cluster: components
layer: composition
component: falcon-angular-data-table
scope: angular-first
created: 2026-05-20
updated: 2026-05-20
---
*** Falcon Data Table Composition Rules ***
*** Angular-first — deep rules for every table-containing composition ***
*** Read before touching any data-table template ***

# Falcon Data Table Composition Rules

> **Purpose:** Deep rules for composing `<falcon-angular-data-table>` with status chips, row actions, selection, expansion, inline loading, empty state, pagination, sorting, and filter integration.
>
> **Component dossier:** [`Brain Outputs/understanding/frontend/components/falcon-data-table/`](../../../Brain%20Outputs/understanding/frontend/components/falcon-data-table/)
> **Matrix entry:** [[Falcon Component Combination Matrix]] → C01
> **Guardrail:** [[Falcon Light Mode Visual Baseline]] — row height 40 px (token `--falcon-table-row-height`), header height 38 px

---

## 1 · Column Definition

```typescript
// Canonical FalconTableColumn shape
columns: FalconTableColumn[] = [
  {
    field: 'name',
    header: 'Name',
    sortable: true,
    cellTemplate: this.nameCell,   // ViewChild<TemplateRef>
  },
  {
    field: 'status',
    header: 'Status',
    cellTemplate: this.statusCell,
  },
  {
    field: 'actions',
    header: '',
    isActionColumn: true,           // RIGHT-ALIGNS + hides header text
    cellTemplate: this.actionsCell,
  },
];
```

**Rules:**
- `field` must match an actual property on the row DTO — never use a computed field name that doesn't exist on the object
- Action column always has `isActionColumn: true` — this is what prevents it from being sortable and adds the correct `--spacing-row-action-inset` token
- Column array is defined as a class property, never inline in the template — prevents infinite re-renders in zoneless
- Do NOT use `[ngClass]` on column definitions — style variations belong in `cellTemplate`

---

## 2 · Custom Cell Templates

```html
<!-- Status chip in a cell -->
<ng-template #statusCell let-row>
  <falcon-angular-status-badge [status]="row.status" [label]="row.statusLabel" />
</ng-template>

<!-- Toggle switch in a cell -->
<ng-template #toggleCell let-row>
  <falcon-angular-toggle
    [checked]="row.isActive"
    [disabled]="row.isPending"
    (change)="onToggle($event, row)" />
</ng-template>

<!-- Icon + label cell -->
<ng-template #nameCell let-row>
  <div class="flex items-center gap-2">
    <falcon-angular-avatar [label]="row.name" size="sm" />
    <span class="text-sm text-falcon-neutral-900">{{ row.name }}</span>
  </div>
</ng-template>
```

**Rules:**
- `let-row` is the implicit context variable — always use it, never `let-item` or `let-data`
- Template refs must be declared with `@ViewChild` in the component class — not in `ngOnInit`
- Template content must use only Falcon Angular wrapper components — no raw HTML form controls
- For price/currency cells: use `<app-falcon-native-input>` pattern established in Add Client wizard, NOT a raw `<input>` or `<falcon-angular-input>` — editable table cells are special

---

## 3 · Row Actions (Kebab Menu)

```html
<ng-template #actionsCell let-row>
  <falcon-angular-menu
    [items]="rowMenuItems(row)"
    [icon]="'kebab-vertical'"
    (itemClick)="onRowAction($event, row)" />
</ng-template>
```

```typescript
rowMenuItems(row: UserRow): FalconMenuItem[] {
  return [
    { label: 'Edit', icon: 'pencil', disabled: !canEdit(row) },
    { label: 'Delete', icon: 'trash', disabled: !canDelete(row), danger: true },
  ];
}

onRowAction(item: FalconMenuItem, row: UserRow): void {
  if (item.label === 'Edit') this.openEditDrawer(row);
  if (item.label === 'Delete') this.openConfirmDialog(row);
}
```

**Rules:**
- Menu `[items]` is computed per row via a method — not a static array (state varies per row)
- Menu re-pushes items to Stencil on every open (Menu items resync pattern — 2026-05-16)
- `danger: true` gives the item a red label — never apply a custom class to achieve this
- Action column width is controlled by `--spacing-row-action-inset` token — not hardcoded `width`
- Root kebab (tree root) uses hover-gate: menu icon only visible on `hover:` of the row

---

## 4 · Row Selection

```html
<falcon-angular-data-table
  [selectionMode]="'multiple'"
  [(selectedRows)]="selectedRows"
  (selectionChange)="onSelectionChange($event)" />
```

**Rules:**
- `[(selectedRows)]` is a two-way binding — parent owns the selection state, not the table
- Do NOT loop over `rows()` to derive `selectedRows` — selection state is separate from data
- Bulk-action buttons (Delete Selected, Export) appear ABOVE the table, conditionally rendered when `selectedRows.length > 0`
- Checkbox column is added automatically when `selectionMode` is set — do NOT add a manual checkbox column

---

## 5 · Row Expansion

```html
<ng-template #expandedRow let-row>
  <!-- Shadow row content — service pricing tiers, etc. -->
  <div class="bg-falcon-teal-25 px-4 py-2">
    <app-service-pricing-shadow-rows [serviceId]="row.id" />
  </div>
</ng-template>

<falcon-angular-data-table
  [expandedRowTemplate]="expandedRow"
  [expandedRowIds]="expandedIds()" />
```

**Rules:**
- Shadow rows (expanded rows) have `bg-falcon-teal-25` background — do NOT use white or neutral-75
- Shadow row triangle indicator uses `column-start` alignment + nudge tokens (shadow-row layout fix — 2026-05-19)
- Only one expanded row at a time unless the composition explicitly allows multi-expand
- `expandedRowIds` is a `Set<string>` — add/remove by copying, never mutate directly (signal law)

---

## 6 · Inline Row Loading State

```html
<ng-template #actionsCell let-row>
  @if (inFlightRowIds().has(row.id)) {
    <span class="inline-block w-4 h-4 border-2 border-falcon-teal-500 border-t-transparent rounded-full animate-spin" />
  } @else {
    <falcon-angular-menu [items]="rowMenuItems(row)" (itemClick)="onRowAction($event, row)" />
  }
</ng-template>
```

**Rules:**
- In-flight row IDs stored in a `signal<Set<string>>` — never in a `Map` with extra metadata (keep it simple)
- Row loading state disables the action menu for THAT row only — other rows remain interactive
- Do NOT show a full-table loader when only one row is being mutated — use inline row loading

---

## 7 · Empty State

```html
<ng-template #emptyTpl>
  <falcon-angular-empty-state
    [icon]="'users'"
    [message]="'No users found for this node'"
    [description]="'Add a user to get started'" />
</ng-template>

<falcon-angular-data-table [emptyTemplate]="emptyTpl" />
```

**Rules:**
- Empty state is ALWAYS injected via `[emptyTemplate]` — never a sibling `@if (rows().length === 0)` block outside the table
- `[icon]` value must be a registered Falcon icon glyph — check `CURRENCY_ICONS` + `FALCON_ICONS` registries
- During loading, show the table skeleton (if available) — empty state must NOT flash during the initial fetch

---

## 8 · Pagination

```html
<div class="flex flex-col gap-0 min-h-0 flex-1">
  <falcon-angular-data-table
    class="flex-1 min-h-0"
    [rows]="rows()"
    [columns]="columns"
    [loading]="isLoading()" />
  <falcon-angular-paginator
    class="flex-shrink-0"
    [total]="totalRows()"
    [page]="currentPage()"
    [pageSize]="pageSize()"
    (pageChange)="onPageChange($event)" />
</div>
```

**Rules:**
- Paginator is a SIBLING below the table — never inside the table's footer template
- `(pageChange)` triggers a parent service call with new `{page, pageSize}` — table rows are replaced, not appended
- `[total]` is the server-side total count — not `rows().length`
- Page size options: `[10, 25, 50]` are the standard options unless PRD specifies otherwise

---

## 9 · Sorting

**Rules:**
- Client-side sort: set `[sortMode]="'client'"` — table sorts `rows()` in-memory
- Server-side sort: set `[sortMode]="'server'"` — `(sortChange)` event triggers a new API call
- Default sort: `[defaultSortField]="'name'"` + `[defaultSortOrder]="'asc'"`
- Multi-sort is a **GAP** (P0-08) — do not promise it; single-field sort only today

---

## 10 · Filter / Search Integration

**Rules:**
- The filter bar (R03) lives ABOVE the table in the parent template — NOT as a table sub-header
- Filter values are a `FormGroup` in the parent component — the table only receives the filtered `rows()` result
- Table does not own filter state — it is a pure presenter of whatever `[rows]` it receives
- When a filter is applied, reset `currentPage()` to `1` before fetching

---

## 11 · Visual Compliance

| Token | Value | Rule |
|---|---|---|
| `--falcon-table-row-height` | 40 px | Every row (data + header) uses this token |
| Header background | `bg-falcon-neutral-100` | Never white; never teal |
| Row hover | `hover:bg-falcon-neutral-50` | Standard hover; do not override |
| Selected row | `bg-falcon-teal-50` | Standard selection; do not override |
| Cell padding | `px-3 py-2` (via token) | Never custom px padding |
| Border | `border-b border-falcon-neutral-200` | Row separator |
| Empty state text | `text-falcon-neutral-500` | Muted, not neutral-900 |

---

## Anti-Patterns

| Anti-Pattern | Correct |
|---|---|
| `<falcon-angular-input>` inside a data-table cell for editable price | Use `<app-falcon-native-input>` pattern |
| `*ngIf="rows().length === 0"` empty block beside the table | Use `[emptyTemplate]` |
| `columns` array defined inline in template | Define as class property |
| Paginator inside `[footerTemplate]` | Paginator is a sibling below the table |
| `style="height: 400px"` on table wrapper | Use `flex-1 min-h-0 overflow-auto` |
| setTimeout to trigger row re-render | Use `afterNextRender()` |

---

## Cross-Links

- [[Falcon Data Table]] — component note + dossier link
- [[Falcon Paginator]] — pagination component
- [[Falcon Status Badge]] — status chips in cells
- [[Falcon Menu]] — row action kebab
- [[Falcon Empty State]] — empty state component
- [[Falcon Component Combination Matrix]] → C01
- [[Falcon Component Composition Playbook]] → Composition 1
- [[Falcon Light Mode Visual Baseline]] — visual guardrail
- [[Falcon Component Gap Registry]] — P0-08, P1-03, P1-10, P1-11

## Tags

#type/rules #layer/frontend #layer/composition #component/data-table #status/active

## Hubs

- [[Falcon Data Table]] · [[COMPONENT_INDEX]] · [[Falcon Component Composition Playbook]]
