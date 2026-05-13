# falcon-paginator — USAGE

## Example 1 — Standalone Angular wrapper

```typescript
@Component({
  selector: 'my-list',
  standalone: true,
  imports: [FalconAngularPaginatorComponent],
  template: `
    <falcon-angular-paginator
      [(ngModel)]="page"
      [totalPages]="totalPages()"
      [siblingCount]="1"
      [boundaryCount]="1"
      [showFirstLast]="true"
      size="sm"
      ariaLabel="Users pagination">
    </falcon-angular-paginator>
  `,
})
export class MyListComponent {
  page = 1;
  totalPages = signal(10);
}
```

## Example 2 — Stencil tag standalone (with PR-3 surface)

The PR-3 surface (rows-per-page, current-page report, paginator template) is reachable via the Stencil tag directly:

```html
<falcon-paginator-tw
  current-page="1"
  total-pages="20"
  total-records="195"
  rows="10"
  size="sm"
  show-current-page-report
  current-page-report-template="{first} - {last} of {totalRecords}"
  paginator-template="CurrentPageReport FirstPageLink PrevPageLink JumpToPageInput NextPageLink LastPageLink RowsPerPageDropdown">
</falcon-paginator-tw>
<script>
  const el = document.querySelector('falcon-paginator-tw');
  el.rowsPerPageOptions = [10, 20, 50, 100];
  el.addEventListener('falcon-change', (e) => console.log('page', e.detail.page));
  el.addEventListener('falcon-rows-change', (e) => console.log('rows', e.detail.rows));
</script>
```

## Example 3 — Auto-composed inside `<falcon-angular-data-table>`

```html
<falcon-angular-data-table
  [data]="users"
  [columns]="cols"
  [paginator]="true"
  [rows]="20"
  [rowsPerPageOptions]="[10, 20, 50, 100]"
  [totalRecords]="195"
  [lazy]="true"
  (lazyLoad)="onLazy($event)">
</falcon-angular-data-table>
```

The data-table sets the PR-3 props on the inner Stencil paginator automatically.

## Reactive forms / ngModel

```typescript
form = new FormGroup({ page: new FormControl(1) });
```

```html
<falcon-angular-paginator formControlName="page" [totalPages]="10"></falcon-angular-paginator>
```

## Tailwind-only usage

`<falcon-paginator-tw>` runs `falconPaginatorClasses()` helpers. Pass `[rootClass]` for host-level utilities.

## Token override pattern

```css
.my-paginator {
  --falcon-paginator-page-bg-active: var(--color-falcon-teal-700);
  --falcon-paginator-page-color-active: white;
}
```

## Bad usage to avoid

- Don't bind the wrapper to the PR-3 inputs (`totalRecords`, `rowsPerPageOptions`, etc.) — the wrapper doesn't expose them. Either use the Stencil tag directly OR consume the paginator inside a Falcon table.
- Don't override `aria-label="Pagination"` with a low-meaning value — the screen reader announcement matters.

## Import requirements

```typescript
import { FalconAngularPaginatorComponent }
  from '@falcon-ui-core/angular-wrapper/components/falcon-paginator';
```

## Do / Don't

- DO — use the standalone paginator for any custom list/non-table view.
- DO — let `<falcon-angular-data-table>` auto-compose the paginator for tables.
- DON'T — bind `[totalRecords]` / `[rows]` etc on the wrapper today — those props live on the Stencil core only.
- DON'T — use this for infinite-scroll patterns.
