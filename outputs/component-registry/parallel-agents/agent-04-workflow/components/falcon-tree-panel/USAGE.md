# falcon-tree-panel (LEGACY BESPOKE) — USAGE

## Real usage in active codebase

### admin-console organization-hierarchy-page menu
`apps/admin-console/src/app/features/organization-hierarchy-page/components/organization-hierarchy-page-menu.component.html:19-29`:
```html
<!-- LEFT — Tree panel via @falcon shared component. -->
<falcon-tree-panel
  mode="falcon"
  [root]="state.treeRoot()"
  [expandedIds]="state.expandedNodeIds()"
  [selectedId]="state.selectedNodeId()"
  clientsLabelKey="hierarchyTab.tree.clientsLabel"
  [rootActions]="rootActions"
  [nodeActions]="nodeActions"
  (toggle)="state.onTreeToggle($event)"
  (select)="state.onTreeSelect($event)"
  (action)="onTreeAction($event)" />
```
With these action configs in the component class (`organization-hierarchy-page-menu.component.ts:32-41`):
```ts
const ROOT_ACTIONS: FalconTreeAction[] = [
  { id: 'addClient', labelKey: 'hierarchyTab.tree.actions.addClient', icon: 'falcon-icon falcon-icon-building' },
  { id: 'addUser',   labelKey: 'hierarchyTab.tree.actions.addUser',   icon: 'falcon-icon falcon-icon-user-plus' },
];

const NODE_ACTIONS: FalconTreeAction[] = [
  { id: 'addNode',  labelKey: 'hierarchyTab.tree.actions.addNode',  icon: 'falcon-icon falcon-icon-plus' },
  { id: 'editNode', labelKey: 'hierarchyTab.tree.actions.editNode', icon: 'falcon-icon falcon-icon-pencil' },
  { id: 'addUser',  labelKey: 'hierarchyTab.tree.actions.addUser',  icon: 'falcon-icon falcon-icon-user-plus' },
];
```
And the `(action)` dispatcher (single stream for both menus):
```ts
protected onTreeAction(event: FalconTreePanelActionEvent): void {
  const id = event.nodeId ?? '';
  switch (event.id) {
    case 'addClient': this.state.onHeaderAddClient(); break;
    case 'addUser':
      if (id) this.state.onTreeContextAction({ nodeId: id, action: 'open' });
      this.state.onHeaderAddUser();
      break;
    case 'addNode':
      this.state.onTreeContextAction({ nodeId: id, action: 'open' });
      this.state.onHeaderAddNode();
      break;
    case 'editNode':
      this.state.onTreeContextAction({ nodeId: id, action: 'open' });
      this.state.onHeaderEditNode();
      break;
  }
}
```

### admin-console organization-hierarchy (old folder)
`apps/admin-console/src/app/features/organization-hierarchy/components/organization-hierarchy-menu.component.html` — same pattern.

### management-console mirror
`apps/management-console/src/app/features/organization-hierarchy-page/components/organization-hierarchy-page-menu.component.html` — same pattern.

### Playground
`apps/host-shell/src/app/playground/playground.page.html`.

## Recommended NEW usage (this is the canonical pattern for tree-with-actions today)
- USE this component when you need the standard org-hierarchy left rail with chrome + per-row 3-dot menus + hover-path.
- If you don't need per-row 3-dot menus, use `<falcon-angular-tree>` directly.

### Hide actions on a specific consumer
```html
<falcon-tree-panel
  mode="falcon"
  [root]="treeRoot()"
  [expandedIds]="expandedIds()"
  [selectedId]="selectedId()"
  [rootActions]="rootActions"
  [nodeActions]="[]"
  [showActions]="false"
  (toggle)="onToggle($event)"
  (select)="onSelect($event)" />
```

### Filter actions per node
```ts
readonly nodeActions: FalconTreeAction[] = [
  { id: 'addNode',  labelKey: 'tree.actions.addNode',  icon: 'falcon-icon falcon-icon-plus' },
  { id: 'editNode', labelKey: 'tree.actions.editNode', icon: 'falcon-icon falcon-icon-pencil' },
  {
    id: 'delete',
    labelKey: 'tree.actions.delete',
    icon: 'falcon-icon falcon-icon-trash',
    highlighted: true,
    visible: (node) => node.type !== 'root',  // hide on root
  },
];
```

### Client mode (root row shows the customer's brand image + name)
```html
<falcon-tree-panel
  mode="client"
  [root]="aramcoTreeRoot()"
  [expandedIds]="expandedIds()"
  [selectedId]="selectedId()" />
```

## Reactive Forms / ngModel
- **None.** The panel is not a form control.

## Tailwind / token usage
- The panel uses bespoke SCSS classes — token override is limited.
- For new code wanting more control, consider migrating to `<falcon-angular-tree>` + custom chrome.

## Admin-console / management-console example (already shown above)
The org-hierarchy page is THE canonical consumer.

## Bad usage to avoid
- DO NOT consume `<falcon-tree-node>` directly — it's a private internal component.
- DO NOT mutate `[root].children` in place — pass a fresh tree.
- DO NOT set both `[rootActions]` and `[showActions]=false` and expect actions — `showActions` overrides.

## Do / Don't
- DO declare `ROOT_ACTIONS` and `NODE_ACTIONS` at the top of the consumer file as `const` so they're stable references.
- DO use the `visible(node)` predicate to filter per-node actions instead of switching in `(action)` handler.
- DON'T add new visual rules in the panel's SCSS without consideration of the migration target (`<falcon-angular-tree>` + slot).
- DON'T rely on global CSS leakage — the panel uses `ViewEncapsulation.None`, so any rule must be prefixed with `.falcon-tree-panel` or `.falcon-tree-panel-menu`.
