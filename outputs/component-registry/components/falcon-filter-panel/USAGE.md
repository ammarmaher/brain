# falcon-filter-panel — USAGE

## Example 1 — Admin user-list filter strip

```typescript
readonly filters: FalconFilterDefinition[] = [
  { key: 'q', label: 'Search', type: 'text', placeholder: 'Username or email' },
  {
    key: 'status',
    label: 'Status',
    type: 'select',
    placeholder: 'All status',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'pending', label: 'Pending' },
      { value: 'suspended', label: 'Suspended' },
    ],
  },
  { key: 'created', label: 'Created', type: 'daterange' },
];

values = signal<FalconFilterValues>({});

onChange(detail: { key: string; value: unknown }): void {
  this.values.update((v) => ({ ...v, [detail.key]: detail.value }));
}

onApply(values: FalconFilterValues): void {
  this.usersApi.list(values);
}

onClearAll(): void {
  this.values.set({});
  this.usersApi.list({});
}
```

```html
<falcon-angular-filter-panel
  [filters]="filters"
  [values]="values()"
  applyLabel="Apply"
  clearAllLabel="Clear"
  (filterChange)="onChange($event)"
  (filterApply)="onApply($event)"
  (filterClearAll)="onClearAll()">
</falcon-angular-filter-panel>
```

## Example 2 — Standalone Stencil (framework-agnostic)

```html
<falcon-filter-panel-tw></falcon-filter-panel-tw>
<script>
  const el = document.querySelector('falcon-filter-panel-tw');
  el.filters = [
    { key: 'q', label: 'Search', type: 'text' },
    { key: 'status', label: 'Status', type: 'select', options: [{value:'a', label:'A'}] },
  ];
  el.addEventListener('falconFilterApply', (e) => console.log('apply', e.detail));
</script>
```

## Recommended usage for NEW Angular pages

Use this above any list/table that needs multi-field filtering. Drive `values` via a signal and forward `(filterChange)` so the filter stays controlled.

## Tailwind-only usage

`[wrapperClass]`, `[slotClass]`, `[inputClass]` accept utility strings for the container, per-field slot, and per-input element respectively.

## Token override pattern

```css
.my-filter-panel {
  --falcon-filter-panel-gap: 12px;
  --falcon-filter-panel-padding: 16px;
}
```

## Bad usage to avoid

- Don't expect Falcon Angular inputs inside the panel — fields are native `<input>` / `<select>` today.
- Don't use this for per-column filtering — it's a panel of independent filters, not column-scoped.
- Don't use this for table-internal global filter — that's already wired in the table via `[showGlobalFilter]`.

## Import requirements

```typescript
import { FalconAngularFilterPanelComponent }
  from '@falcon-ui-core/angular-wrapper/components/falcon-filter-panel';
import type {
  FalconFilterDefinition, FalconFilterValues,
} from '@falcon-ui-core/angular-wrapper/components/falcon-filter-panel/falcon-filter-panel.component';
```

## Do / Don't

- DO — use this for multi-field filter strips above lists.
- DO — keep `values` controlled via signal.
- DO — use `(filterApply)` for the "commit filters" UX.
- DON'T — bind `[(values)]` expecting two-way; the panel is one-way for values, output-only.
- DON'T — try to project a custom field via `<ng-template>` — not supported (P1 gap).
