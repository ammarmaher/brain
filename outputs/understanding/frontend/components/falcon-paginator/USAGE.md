# falcon-paginator — USAGE

## Real usage in active codebase

`[CODE]` **Sole render consumer (2026-06-03 / B09):** `<falcon-angular-custom-table-footer>` (`libs/falcon-ui-core/.../falcon-custom-table-footer/falcon-custom-table-footer.component.html:21`) composes `<falcon-angular-paginator>` for its center nav region:

```html
<!-- inside falcon-custom-table-footer.component.html (the B09 sibling unit) -->
<falcon-angular-paginator
  [currentPage]="currentPage()"
  [totalPages]="totalPages()"
  [showFirstLast]="true"
  [showPrevNext]="true"
  [showPageInfo]="true"
  size="sm"
  [disabled]="disabled()"
  (valueChange)="onPaginatorValueChange($event)" />
```

The Stencil tag `<falcon-paginator>` is ALSO auto-composed inside `<falcon-table>` / `<falcon-table-tw>` footers (the table sets the PR-3 props directly). There is **no standalone `<falcon-angular-paginator>` app consumer** anymore.

## Example 1 — Standalone Angular wrapper

```ts
@Component({
  selector: 'my-list',
  standalone: true,
  imports: [FalconAngularPaginatorComponent, FormsModule],
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyListComponent {
  page = 1;
  totalPages = signal(10);
}
```

## Example 2 — Stencil tag standalone (with the PR-3 surface)

The PR-3 surface (rows-per-page, current-page report, region template) is reachable ONLY via the Stencil tag, because the Angular wrapper does not expose those props (GAP FP-01):

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
  el.rowsPerPageOptions = [10, 20, 50, 100]; // object prop — must be set on the element
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

> The data-table renders `<falcon-angular-custom-table-footer>` internally (`[CODE]` falcon-data-table.component.html:70-74), which in turn composes the paginator — so all the PR-3-equivalent surface is wired for you. Do NOT mount a separate footer/paginator as a sibling.

## Reactive Forms / ngModel

```ts
form = new FormGroup({ page: new FormControl(1) });
```

```html
<falcon-angular-paginator formControlName="page" [totalPages]="10" />
```

## Tailwind-only usage

`<falcon-paginator-tw>` runs the `falconPaginator*Classes()` helpers. Pass `[rootClass]` for host-level utilities on the Angular wrapper.

## Token override pattern

```css
.my-paginator {
  --falcon-paginator-page-bg-active: var(--color-falcon-teal-700);
  --falcon-paginator-page-color-active: #ffffff;
}
```

## Do / Don't

| Do | Don't |
|---|---|
| Let `<falcon-angular-data-table>` auto-compose the paginator for tables. | Manually place `<falcon-angular-paginator>` under a table that could auto-compose it. |
| Use the standalone wrapper for custom non-table list views. | Bind `[totalRecords]` / `[rows]` / `[rowsPerPageOptions]` on the wrapper — those inputs don't exist on it (FP-01). |
| Drop to `<falcon-paginator-tw>` for the PR-3 surface standalone. | Pass `rowsPerPageOptions` as a string attribute — it's an object prop. |
| Re-fetch the page from the backend on `(valueChange)`. | Wire `(valueChange)` but forget to re-query — the strip moves, data goes stale. |
| Use `@if`/`@for` in surrounding templates. | Use a paginator for "load more" / infinite scroll. |

## Bad usage to avoid

- **Do NOT** override `aria-label="Pagination"` with a low-meaning value — the screen-reader announcement matters.
- **Do NOT** rename `paginatorTemplate` region tokens — breaks every Falcon table inheriting the template.
- **Do NOT** expect a rows-per-page change to reset the page — the host must decide (usually jump to page 1).

## Import requirements (standalone component)

```ts
import { FalconAngularPaginatorComponent } from '@falcon/ui-core/angular';
import { FormsModule } from '@angular/forms'; // for [(ngModel)]
// or: import { ReactiveFormsModule } from '@angular/forms';

@Component({ standalone: true, imports: [FalconAngularPaginatorComponent, FormsModule], /* … */ })
```

## Consumer Sweep (2026-06-03 — B09)

`[CODE]` grep `<falcon-angular-paginator[\s>]` → **1 render consumer**:
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-custom-table-footer/falcon-custom-table-footer.component.html:21` (+ doc-comment ref in `.component.ts:8`).

`[CODE]` Broader `<falcon-paginator[\s>-]` grep (61 occurrences / 29 files): the Stencil tag is composed inside `falcon-table.tsx` + `falcon-table-tw.tsx` (table footer auto-paginator); remaining matches are tokens / docs / web-types / the `-tw` twin / `falcon-data-table.component.ts` import.

> `[INFERRED]` Consumer count vs the Wave 7 "1 (playground)": the playground folder was removed; the paginator is now consumed only via the library composition chain (data-table → custom-table-footer → paginator) + the Stencil-tag table footer.

## Wave 7 Consumer Sweep (2026-05-17)

`[CODE]` grep `<falcon-angular-paginator>` returned **1 consumer**: `apps/host-shell/src/app/playground/playground.page.html` — **now stale** (folder removed; see B09 above).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09). Consumer Sweep re-run → sole wrapper consumer = `falcon-custom-table-footer` (B09 sibling); Stencil tag via the table footer. Import path corrected to `@falcon/ui-core/angular`. PR-3-standalone example confirmed against the Stencil prop surface.
