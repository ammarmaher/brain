# falcon-organization-hierarchy-tree-tw — USAGE

## Example 1 — Playground demo (Angular template)

```html
<falcon-organization-hierarchy-tree-tw
  #orgTree
  [attr.section-label]="'Clients'"
  [attr.default-expand-level]="1"
  [attr.aria-label]="'Organization hierarchy'"
  (falcon-select)="onSelect($event)"
  (falcon-toggle)="onToggle($event)"
  (falcon-action)="onAction($event)">
</falcon-organization-hierarchy-tree-tw>
```

```typescript
@ViewChild('orgTree', { read: ElementRef }) orgTree?: ElementRef<HTMLElement>;

ngAfterViewInit(): void {
  const el = this.orgTree?.nativeElement as HTMLElement & {
    tree?: FalconOrgHierarchyNode;
    rootActions?: ReadonlyArray<FalconOrgHierarchyAction>;
    nodeActions?: ReadonlyArray<FalconOrgHierarchyAction>;
    expandedIds?: ReadonlyArray<string | number>;
  };
  if (!el) return;
  el.tree = this.buildTree();
  el.rootActions = [
    { id: 'rename', label: 'Rename root', icon: 'edit' },
    { id: 'export', label: 'Export hierarchy', icon: 'download' },
  ];
  el.nodeActions = [
    { id: 'edit', label: 'Edit', icon: 'edit' },
    { id: 'invite', label: 'Invite user', icon: 'user-plus', highlight: true },
    { id: 'remove', label: 'Remove', icon: 'trash' },
  ];
  el.expandedIds = ['org-1', 'dept-1'];
}

onSelect(ev: CustomEvent<FalconOrgHierarchySelectDetail>): void {
  console.log('selected', ev.detail.id);
}

onToggle(ev: CustomEvent<FalconOrgHierarchyToggleDetail>): void {
  /*** Lazy-load opportunity: when node.hasChildren=true but children empty, fetch + assign. ***/
}

onAction(ev: CustomEvent<FalconOrgHierarchyActionDetail>): void {
  console.log('action', ev.detail.actionId, 'on', ev.detail.node.id, 'isRoot=', ev.detail.isRoot);
}
```

## Example 2 — Programmatic select + scroll

```typescript
async selectClient(id: string | number): Promise<void> {
  const el = this.orgTree?.nativeElement as HTMLElement & {
    selectAndScrollTo?: (id: string | number) => Promise<void>;
  };
  await el?.selectAndScrollTo?.(id);
}
```

## Recommended usage for NEW Angular pages

- Used directly as the Stencil tag inside Angular templates.
- Bind object props via `@ViewChild` + `ElementRef.nativeElement` assignment in `ngAfterViewInit` (because Angular `[attr.x]` only handles primitives).
- Listen to events via `(falcon-select)` / `(falcon-toggle)` / `(falcon-action)` template syntax.

## Tailwind-only usage

The component IS Light DOM only — there's no other render path. Tailwind utilities + tokens drive the chrome. Per-instance customisation via token override on the host class.

## Token override pattern

```css
.dark-theme-org-tree {
  --falcon-org-hierarchy-panel-bg: var(--color-falcon-neutral-50);
  --falcon-org-hierarchy-root-bg-selected: var(--color-falcon-teal-tint);
}
```

## Bad usage to avoid

- DO NOT bind object props via `[attr.tree]` / `[attr.root-actions]` etc. — Angular will stringify. Use `@ViewChild` + `el.tree = …`.
- DO NOT compose this for generic tree views — use `<falcon-angular-tree>` or `<falcon-angular-tree-table>` instead.
- DO NOT expect Shadow DOM encapsulation — there isn't one. Global CSS that affects `[data-fohtree-render="tailwind"]` selectors WILL leak.

## Import requirements

```typescript
import { defineFalconTwComponent } from '@falcon-ui-core/define-falcon-tw-component';
import type {
  FalconOrgHierarchyNode, FalconOrgHierarchyAction,
  FalconOrgHierarchySelectDetail, FalconOrgHierarchyToggleDetail, FalconOrgHierarchyActionDetail,
} from '@falcon-ui-core/components/falcon-organization-hierarchy-tree-tw/falcon-organization-hierarchy-tree.types';

// In ngOnInit:
await defineFalconTwComponent('falcon-organization-hierarchy-tree-tw');
```

## Do / Don't

- DO — bind object props via `@ViewChild`.
- DO — listen to `(falcon-select)` / `(falcon-toggle)` / `(falcon-action)` events.
- DO — use the Method calls `selectAndScrollTo` / `expandAll` / `collapseAll` for imperative flows.
- DO — pass `[attr.default-expand-level]="N"` to auto-expand on first render.
- DON'T — bind object props as `[attr.x]` — they'll stringify.
- DON'T — assume Shadow DOM style isolation — there isn't one.
- DON'T — use this for non-org-hierarchy trees. The chrome is opinionated.
