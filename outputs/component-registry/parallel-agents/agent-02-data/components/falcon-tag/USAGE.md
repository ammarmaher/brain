# falcon-tag — USAGE

## Example 1 — Filter chip with dismiss

```html
@for (chip of activeFilters(); track chip.key) {
  <falcon-angular-tag
    [value]="chip.label"
    severity="info"
    size="sm"
    [dismissible]="true"
    (falconDismiss)="removeFilter(chip.key)">
  </falcon-angular-tag>
}
```

```typescript
removeFilter(key: string): void {
  this.filters.update((m) => {
    const next = { ...m };
    delete next[key];
    return next;
  });
}
```

## Example 2 — Permission tags inside a data-table cell

```html
<falcon-angular-data-table [data]="users()" [columns]="cols">
  <ng-template falconDataTableCell="permissions" let-value="value">
    <div class="flex flex-wrap gap-1">
      @for (perm of value; track perm) {
        <falcon-angular-tag [value]="('permissions.' + perm) | translate" severity="secondary" size="sm">
        </falcon-angular-tag>
      }
    </div>
  </ng-template>
</falcon-angular-data-table>
```

## Example 3 — Icon + label

```html
<falcon-angular-tag severity="success" icon="check" value="Verified"></falcon-angular-tag>
```

Or via projected content:

```html
<falcon-angular-tag severity="success">
  <i class="falcon-icon falcon-icon-check"></i>
  Verified
</falcon-angular-tag>
```

## Example 4 — Square corners

```html
<falcon-angular-tag severity="warning" [rounded]="false" value="Beta"></falcon-angular-tag>
```

## Tailwind-only usage

The Light DOM variant uses `tag-tailwind-classes.ts` helpers. Per-instance utility via host classes.

## Token override pattern

```css
.alert-tag {
  --falcon-tag-bg: var(--color-falcon-red-100);
  --falcon-tag-fg: var(--color-falcon-red-700);
}
```

## Bad usage to avoid

- DO NOT use for workflow state cells — use `<falcon-status-badge>`.
- DO NOT use for generic count badges — use `<falcon-badge>`.
- DO NOT bind `'warn'` severity in new code — it's a legacy alias for `'warning'`.

## Import requirements

```typescript
import { FalconAngularTagComponent }
  from '@falcon-ui-core/angular-wrapper/components/falcon-tag';
import type { FalconTagSeverity, FalconTagSize }
  from '@falcon-ui-core/components/falcon-tag/falcon-tag.types';
```

## Do / Don't

- DO — use for dismissible chips, filter chips, multi-select selected-value chips.
- DO — emit `(falconDismiss)` and update parent state.
- DO — choose `severity="secondary"` for neutral non-status chips.
- DON'T — use for workflow state (`active` / `pending` / `suspended`) — that's `<falcon-status-badge>`.
- DON'T — pass `'warn'` in new code (legacy alias kept for backwards compat).
