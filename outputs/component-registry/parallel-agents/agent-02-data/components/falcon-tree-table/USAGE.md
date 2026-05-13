# falcon-tree-table — USAGE

## Example 1 — Wallet `multi-3` tree (typical pattern)

```typescript
readonly walletColumns: FalconTreeColumn[] = [
  { key: 'currency',    label: 'Currency', type: 'badge', badgeVariant: 'active' },
  { key: 'balance',     label: 'Balance',  type: 'number', align: 'end' },
  { key: 'committed',   label: 'Committed',type: 'number', align: 'end' },
];

readonly tree: FalconTreeNode[] = [
  {
    id: 1, label: 'Operating accounts',
    currency: 'SAR', balance: 12000, committed: 1100,
    children: [
      { id: 11, label: 'Bank Aramco', currency: 'SAR', balance: 8000,  committed: 500 },
      { id: 12, label: 'Bank Rajhi',  currency: 'SAR', balance: 4000,  committed: 600 },
    ],
  },
];

selected = signal<string | number | null>(null);
expanded = signal<ReadonlyArray<string | number>>([1]);
```

```html
<falcon-angular-tree-table
  [nodes]="tree"
  [columns]="walletColumns"
  [expandedIds]="expanded()"
  selectionMode="radio"
  density="comfortable"
  [(selectedValue)]="selected"
  ariaLabel="Wallet accounts"
  (expandChange)="onExpand($event)"
  (rowClick)="onRow($event)">
</falcon-angular-tree-table>
```

## Example 2 — Reactive Forms binding

```typescript
form = new FormGroup({
  account: new FormControl<string | number | null>(null),
});
```

```html
<falcon-angular-tree-table
  [nodes]="tree"
  [columns]="walletColumns"
  selectionMode="radio"
  formControlName="account">
</falcon-angular-tree-table>
```

## Example 3 — Custom cell via Stencil slot

```html
<falcon-tree-table-tw [columns]="cols" [nodes]="nodes">
  <!-- *** Per-row named slot — pattern: cell-<columnKey>-<nodeId> *** -->
  <span slot="cell-actions-11" class="text-falcon-teal-500">Custom action</span>
  <span slot="cell-actions-12" class="text-falcon-amber-500">Different action</span>
</falcon-tree-table-tw>
```

> **NOTE — this works on the raw Stencil tag but not via the Angular wrapper's standard `<ng-template>` pattern.** The wrapper does not project Angular templates into the slots. See GAPS for the upgrade proposal.

## Recommended usage for NEW Angular pages

- Reach `<falcon-angular-tree-table>` for any tree-with-data-columns view.
- Use `selectionMode="radio"` for single-select-across-tree.
- Use `[(selectedValue)]` or Reactive Forms `formControlName` — both are wired through CVA.
- Drive expansion via signal-bound `[expandedIds]` and forward `(expandChange)` events.

## Tailwind-only usage

The Tailwind variant (`falcon-tree-table-tw`) is rendered when `[useTailwind]="true"` (default). Tokens drive layout; helpers in `tree-table-tailwind-classes.ts` compose utility strings.

## Token override pattern

```css
.my-wallet-tree {
  --falcon-tree-table-indent-step: 24px;
  --falcon-tree-table-row-height-comfortable: 44px;
}
```

## Bad usage to avoid

- Don't try to render a `<ng-template>` inside the Angular wrapper expecting it to project — it won't. Use the Stencil slot pattern OR upgrade the wrapper (P1 gap).
- Don't set `selectionMode="multiple"` — only `'none'` and `'radio'` are valid. Multi-select is not supported.
- Don't expect grid keyboard nav for non-label cells — focus lives on the label cell only.

## Import requirements

```typescript
import { FalconAngularTreeTableComponent }
  from '@falcon-ui-core/angular-wrapper/components/falcon-tree-table';
import type {
  FalconTreeColumn, FalconTreeNode, FalconTreeTableExpandDetail,
} from '@falcon-ui-core/components/falcon-tree-table/falcon-tree-table.types';
```

## Do / Don't

- DO — use this for any tree-with-data-columns view.
- DO — use CVA / `[(ngModel)]` for selected-value binding.
- DO — manage `expandedIds` via signal for full reactivity.
- DON'T — embed Falcon Angular components inside cells via templates (not supported by wrapper today).
- DON'T — use this for org-hierarchy chrome (use `<falcon-organization-hierarchy-tree-tw>`).
