# falcon-angular-tree — USAGE

## Real usage in active codebase
- `apps/host-shell/src/app/playground/playground.page.html` — playground showcase (single + multi + density + searchable demos).
- **NOT used directly by the org-hierarchy pages** — they use `<falcon-tree-panel>` (legacy bespoke, which has its own `<falcon-tree-node>` recursive component). See `falcon-tree-panel/`.

## Recommended NEW usage

### Single-select tree with hover-path
```ts
// component.ts
import {
  FalconAngularTreeComponent,
  type FalconTreeNode,
  type FalconTreeHoverDetail,
  type FalconTreeExpandDetail,
} from '@falcon/ui-core/angular';

@Component({
  standalone: true,
  imports: [FalconAngularTreeComponent],
  templateUrl: './category-tree.component.html',
})
export class CategoryTreeComponent {
  readonly nodes: FalconTreeNode[] = [
    { id: 'fin',  label: 'Finance',  icon: 'falcon-icon falcon-icon-bank', children: [
      { id: 'ar',  label: 'AR',  badge: { text: '12', variant: 'info' } },
      { id: 'ap',  label: 'AP',  badge: { text: '3',  variant: 'warning' } },
    ]},
    { id: 'hr',   label: 'HR',   children: [
      { id: 'hir', label: 'Hiring',   children: [ { id: 'op', label: 'Open positions' } ] },
      { id: 'pay', label: 'Payroll', badge: { text: 'urgent', variant: 'danger' } },
    ]},
  ];
  readonly selected = signal<string | null>('ar');
  readonly expanded = signal<readonly string[]>(['fin', 'hr']);

  onExpand(detail: FalconTreeExpandDetail): void {
    this.expanded.update(list => detail.expanded
      ? [...list, detail.id as string]
      : list.filter(id => id !== detail.id));
  }
}
```
```html
<!-- component.html -->
<falcon-angular-tree
  [nodes]="nodes"
  [selectedValue]="selected()"
  [expandedIds]="expanded()"
  selectionMode="single"
  density="comfortable"
  groupLabel="Categories"
  ariaLabel="Category tree"
  (valueChange)="selected.set($any($event))"
  (expandChange)="onExpand($event)" />
```

### Multi-select with searchable filter
```ts
readonly query = signal<string>('');
readonly selectedIds = signal<readonly string[]>([]);
```
```html
<input type="search" [ngModel]="query()" (ngModelChange)="query.set($event)" placeholder="Search…" />

<falcon-angular-tree
  [nodes]="nodes"
  [selectedValues]="selectedIds()"
  [searchQuery]="query()"
  selectionMode="multiple"
  density="compact"
  (valuesChange)="selectedIds.set([...$event])" />
```

### Reactive Forms (single mode)
```ts
this.form = this.fb.group({
  category: this.fb.control<string | null>('ar'),
});
```
```html
<falcon-angular-tree [nodes]="nodes" formControlName="category" />
```

### Programmatic select + scroll
```ts
@ViewChild(FalconAngularTreeComponent) treeRef!: FalconAngularTreeComponent;

async focusNodeFromSearchResult(id: string): Promise<void> {
  await this.treeRef.expandTo(id);
  await this.treeRef.selectAndScrollTo(id);
}
```

### Per-instance token override
```html
<falcon-angular-tree class="dense-tree" />
```
```css
:where(.dense-tree) {
  --falcon-tree-node-min-height: 28px;
  --falcon-tree-node-padding-y: 4px;
  --falcon-tree-label-font-size: 12px;
}
```

## Render-mode guidance
- **Default (`useTailwind=true`)** — Light DOM.
- `useTailwind=false` — Shadow for token-only theming or foreign hosts.

## Tailwind-only usage
- Outer class for layout context.
- Visual values via tokens only.

## Bad usage to avoid
- DO NOT pass a cyclic tree (node references itself or an ancestor) — infinite recursion.
- DO NOT mutate `nodes` in place; pass a fresh array.
- DO NOT rely on `<falcon-tree-panel>` and `<falcon-angular-tree>` having identical visual output — they're parallel implementations.

## Do / Don't
- DO use `searchQuery` for filtering; it auto-expands matches.
- DO listen to `hoverChange` if you need the ancestor path for sibling UI (breadcrumbs, etc.).
- DO use `defaultExpandLevel` for initial expansion (avoids passing a full `expandedIds` list on first render).
- DON'T add a custom hover-path effect — the component already handles it via `Set<id>`.
- DON'T render large trees (n > 1000 nodes) without virtualization — none exists yet (P1 gap).
