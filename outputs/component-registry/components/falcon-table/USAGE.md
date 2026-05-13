# falcon-table — USAGE

## Direct use is rare

`<falcon-table>` and `<falcon-angular-table>` are **the substrate, not the consumer surface.** Production Angular pages reach `<falcon-angular-data-table>` instead — it composes `<falcon-table-tw>` + Strategy E projection so consumers can write `<ng-template falconDataTableCell="…">`. See [`falcon-data-table/USAGE.md`](../falcon-data-table/USAGE.md).

Verified via grep over `apps/admin-console`, `apps/management-console`, `apps/host-shell`:
- Direct `<falcon-table>` or `<falcon-angular-table>` usage outside `playground/` and `showcase`: **NONE**.

## Example 1 — Stencil raw (framework-agnostic)

For React/Vue or framework-agnostic mounts that don't need Angular templates:

```html
<falcon-table-tw
  paginated
  page-size="10"
  selection-mode="multiple"
  sort-mode="single"
  data-key="id"
  aria-label="Users"
></falcon-table-tw>
<script>
  const el = document.querySelector('falcon-table-tw');
  el.rows = [{ id: 1, name: 'Ammar' }, { id: 2, name: 'Taha' }];
  el.columns = [
    { key: 'id', label: '#', sortable: true, type: 'number' },
    { key: 'name', label: 'Name', sortable: true },
  ];
  el.addEventListener('falcon-row-click', (e) => console.log('clicked row', e.detail));
</script>
```

## Example 2 — Angular basic wrapper (DEPRECATED for new code — use falcon-angular-data-table instead)

```typescript
// app component
import { Component } from '@angular/core';
import { FalconAngularTableComponent } from '@falcon-ui-core/angular-wrapper/components/falcon-table';
import type { FalconTableColumn } from '@falcon-ui-core/components/falcon-table/falcon-table.types';

@Component({
  selector: 'my-list',
  standalone: true,
  imports: [FalconAngularTableComponent],
  template: `
    <falcon-angular-table
      [rows]="rows"
      [columns]="columns"
      [paginated]="true"
      [pageSize]="10"
      selectable="multiple"
      [(selectedRowIds)]="selectedIds"
      (falconRowClick)="onRowClick($event)">
    </falcon-angular-table>
  `,
})
export class MyListComponent {
  rows = [{ id: 1, name: 'Ammar', email: 'a@x.com' }];
  columns: FalconTableColumn[] = [
    { key: 'name', label: 'Name', sortable: true },
    { key: 'email', label: 'Email', sortable: true },
  ];
  selectedIds: ReadonlyArray<string | number> = [];

  onRowClick(detail: { row: Record<string, unknown>; index: number }) {
    console.log('row click', detail);
  }
}
```

## Example 3 — Lazy (server-side) mode pattern

```typescript
// Lazy data binding (matches FalconTableLazyLoadDetail shape)
<falcon-angular-table
  [rows]="serverPage"
  [columns]="columns"
  [paginated]="true"
  [pageSize]="20"
  [lazy]="true"
  [totalRecords]="serverTotal"
  (falcon-lazy-load)="onLazy($event)">
</falcon-angular-table>
```

```typescript
onLazy(ev: CustomEvent<FalconTableLazyLoadDetail>): void {
  const { first, rows, sortField, sortOrder, globalFilter } = ev.detail;
  const page = first / rows + 1;
  this.api.getUsers({ page, pageSize: rows, sortField, sortOrder, q: globalFilter });
}
```

> NOTE — the basic Angular wrapper doesn't surface `(falcon-lazy-load)` as an `@Output` yet. For lazy mode use `<falcon-angular-data-table>` which exposes typed `lazyLoad` output (`FalconDataTableLazyLoad`).

## Recommended usage for NEW Angular pages

> **Use `<falcon-angular-data-table>` instead.** The basic wrapper does not project Angular templates into cells. See [`../falcon-data-table/USAGE.md`](../falcon-data-table/USAGE.md) for the canonical example with `<ng-template falconDataTableCell>`.

## Tailwind-only usage

- `<falcon-table-tw>` is Light DOM, so utility classes from the host app's Tailwind cascade in. The component already runs `falconTableClasses()`, `falconTableHeaderCellClasses()`, etc.; container-level utilities can be appended via `styleClass` and `tableStyleClass`:

```html
<falcon-angular-data-table
  rootClass="rounded-lg shadow-sm"
  tableStyleClass="text-falcon-neutral-900"
  ...></falcon-angular-data-table>
```

## Token override pattern

```css
/*** Add a marker class on the host. ***/
<falcon-angular-table class="my-tight-table" ...></falcon-angular-table>
```

```css
/*** Then mutate component tokens for that scope only. ***/
.my-tight-table {
  --falcon-table-cell-padding-block: 8px;
  --falcon-table-cell-padding-inline: 6px;
  --falcon-table-header-padding-block: 8px;
}
```

## Bad usage to avoid

- DO NOT add `<table>` / `<thead>` / `<tbody>` / `<tr>` / `<td>` raw HTML for a Falcon list page. The Falcon library's `<falcon-angular-data-table>` covers sortable, selectable, paginated, lazy, projected-cell, frozen-column, sticky-action — there is no business case to hand-roll a table.
- DO NOT bind `[rows]`, `[columns]`, `[selectedRowIds]`, `[sortBy]` as `[attr.x]` — these are objects/arrays, not strings. Angular's template-attr binding will silently stringify or set `[object Object]`.
- DO NOT use `<falcon-angular-table>` (basic) for any new feature — it is `@deprecated`. Reach `<falcon-angular-data-table>`.
- DO NOT use `col.render()` for cells that contain Falcon components — `render()` returns an HTML string flushed via `innerHTML`. Use a `<ng-template falconDataTableCell>` instead so Angular components instantiate properly.

## Import requirements (Angular)

```typescript
import { FalconAngularTableComponent } from '@falcon-ui-core/angular-wrapper/components/falcon-table';
// Or, for the canonical projection-aware wrapper:
import { FalconAngularDataTableComponent } from '@falcon-ui-core/angular-wrapper/components/falcon-data-table';
```

## Do / Don't

### Do
- Use `<falcon-angular-data-table>` for new Angular pages — it projects `<ng-template falconDataTableCell>` into Stencil cells via Strategy E.
- Use Stencil `<falcon-table-tw>` directly only in framework-agnostic mounts.
- Pass object/array inputs (`[data]`, `[columns]`, `[rowMenuItems]`) — the wrapper handles the property reflection.
- Use `FalconTableColumnExt` fields (`render`, `frozen`, `headerClass`, `cellClass`, `maxWidth`) for additive metadata when you don't need Angular templates.
- Use `aria-label="…"` to keep screen readers happy.

### Don't
- Don't add new `<falcon-angular-table>` usages — it's deprecated.
- Don't hand-roll a `<table>` for any Falcon list view.
- Don't put Falcon Angular components inside `col.render()` — `render()` returns a static HTML string. Use a template directive.
- Don't expect Arrow-key navigation between rows — the table is `tabIndex={0}` but does NOT implement Arrow / Home / End key handling on rows (see GAPS_AND_UPGRADES.md).
