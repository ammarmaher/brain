# falcon-custom-table-footer — USAGE

## Real usage in active codebase

`[CODE]` **Sole render consumer (2026-06-03 / B09):** `<falcon-angular-data-table>` renders it internally as its DEFAULT footer (`libs/falcon-ui-core/.../falcon-data-table/falcon-data-table.component.html:70-82`):

```html
<!-- inside falcon-data-table.component.html — internal, NOT to be mounted as a sibling -->
@if (showCustomFooter) {
  <falcon-angular-custom-table-footer
    [totalRecords]="totalRecords ?? 0"
    [currentPage]="currentPage"
    [rows]="rows"
    [rowsPerPageOptions]="rowsPerPageOptions ?? [10, 20, 30, 40]"
    [disabled]="_isEmpty()"
    [showingLabel]="footerShowingLabel"
    [fromLabel]="footerFromLabel"
    [rowsPerPageLabel]="footerRowsPerPageLabel"
    (pageChange)="pageChange.emit($event)"
    (rowsChange)="rowsChange.emit($event)" />
}
```

`[CODE]` falcon-data-table.component.ts:410/416-418 — `showCustomFooter` defaults `true`, and the three footer labels default to English (`'Showing'` / `'from'` / `'Rows per page'`) but are exposed as data-table `@Input`s (`footerShowingLabel` etc.) so a feature can bind translated strings.

## Recommended usage — via the data-table (the normal path)

You almost never mount this footer directly. Instead, drive it through `<falcon-angular-data-table>`:

```html
<falcon-angular-data-table
  [data]="rows()"
  [columns]="cols"
  [paginator]="true"
  [totalRecords]="total()"
  [currentPage]="page()"
  [rows]="pageSize()"
  [rowsPerPageOptions]="[10, 20, 30, 40]"
  [lazy]="true"
  [footerShowingLabel]="'table.footer.showing' | translate"
  [footerFromLabel]="'table.footer.from' | translate"
  [footerRowsPerPageLabel]="'table.footer.rowsPerPage' | translate"
  (pageChange)="onPage($event)"
  (rowsChange)="onRows($event)"
  (lazyLoad)="onLazy($event)">
</falcon-angular-data-table>
```

> The data-table forwards everything to the internal footer and re-emits its `(pageChange)` / `(rowsChange)`. Set `[showCustomFooter]="false"` only if you want the bare Stencil paginator footer instead.

## Direct usage (rare — custom table shell)

```ts
import { FalconAngularCustomTableFooterComponent } from '@falcon/ui-core/angular';

@Component({
  standalone: true,
  imports: [FalconAngularCustomTableFooterComponent],
  template: `
    <falcon-angular-custom-table-footer
      [totalRecords]="total()"
      [currentPage]="page()"
      [rows]="pageSize()"
      [rowsPerPageOptions]="[10, 20, 50]"
      [disabled]="loading()"
      [showingLabel]="'Showing' | translate"
      [fromLabel]="'from' | translate"
      [rowsPerPageLabel]="'Rows per page' | translate"
      (pageChange)="page.set($event)"
      (rowsChange)="onRowsChange($event)" />
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MyTableShell {
  total = signal(195);
  page = signal(1);
  pageSize = signal(10);
  loading = signal(false);
  onRowsChange(n: number): void { this.pageSize.set(n); this.page.set(1); } // reset to page 1
}
```

## i18n

`[CODE]` The footer is **i18n-decoupled by design** — it takes three already-translated label strings (`showingLabel` / `fromLabel` / `rowsPerPageLabel`) rather than importing a translation service. The consumer (or the data-table) supplies translated strings (e.g. via `| translate`). Defaults are English. Update BOTH `en.json` and `ar.json` for the label keys the feature uses.

## Token override pattern

`[CODE]` The footer owns no tokens. Its band height reads `--falcon-table-row-height` (52px, from `table.tokens.css`). To shrink it for a compact table, override that table token on a host class:

```css
.compact-table-host { --falcon-table-row-height: 40px; } /* also drives the footer band height */
```

Visual colours (`bg-falcon-neutral-30`, `text-falcon-neutral-600`, `border-falcon-neutral-200`, `bg-falcon-neutral-0`, `text-falcon-neutral-800`, `focus:border-falcon-teal-700`) are Tailwind theme utilities — override via the theme, not per-instance.

## Do / Don't

| Do | Don't |
|---|---|
| Drive the footer through `<falcon-angular-data-table>`. | Mount `<falcon-angular-custom-table-footer>` as a SIBLING of a data-table (it is the table's internal footer). |
| Supply translated `showingLabel`/`fromLabel`/`rowsPerPageLabel`. | Hardcode English in production (defaults are English). |
| Reset to page 1 when handling `(rowsChange)`. | Assume the footer re-fetches data — it only emits. |
| Use `@if`/`@for` in surrounding templates. | Bind a form control to it — it has no CVA. |
| Read inputs as signal calls in any extending template. | Treat the rows-per-page `<select>` as a Falcon dropdown — it is native (GAP). |

## Bad usage to avoid

- **Do NOT** rely on the rows-per-page `<select>` being a `<falcon-angular-dropdown>` — it is a native `<select>` (house-rule GAP G1).
- **Do NOT** expect screen readers to announce the "Showing X - Y" change — there is no `aria-live` (a11y GAP).
- **Do NOT** instantiate without `[totalRecords]` — it is `input.required()` (compile error).

## Import requirements (standalone component)

```ts
import { FalconAngularCustomTableFooterComponent } from '@falcon/ui-core/angular';

@Component({ standalone: true, imports: [FalconAngularCustomTableFooterComponent], /* … */ })
```

(For direct use you do NOT need `FormsModule` — the `[ngModel]` on the inner `<select>` is internal to the component, which declares `FormsModule` in its own `imports`.)

## Consumer Sweep (2026-06-03 — B09)

`[CODE]` grep `<falcon-angular-custom-table-footer` across the repo → **1 render consumer**:
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.html:71`.

Class-import references (non-render): `angular-wrapper/index.ts:64` (barrel), `falcon-data-table.component.ts:70` (import) + `:131` (`imports:` array). No app-level direct consumer. Because the data-table is the dominant table primitive across both consoles, this footer is transitively present on most paginated list pages.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09 — CREATED). Consumer Sweep → sole consumer = `<falcon-angular-data-table>` (default footer, `showCustomFooter=true`). Label-forwarding + i18n-decoupling confirmed against falcon-data-table.component.ts:410/416-418. Direct-usage example is 🟡 CODE-DERIVED from the input/output surface.
