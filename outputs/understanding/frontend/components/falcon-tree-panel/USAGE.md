# falcon-tree-panel — USAGE

> Re-swept 2026-05-18 against live source. The skeleton is consumed only through the `<app-organization-hierarchy-tree>` wrapper.

## Real usage in the active codebase

`<falcon-tree-panel>` has exactly ONE direct consumer: the host-shell wrapper
`apps/host-shell/src/app/shared-components/organization-hierarchy-tree/organization-hierarchy-tree.component.{ts,html}`.

The wrapper composes the skeleton and binds:
```html
<falcon-tree-panel
  [mode]="skeletonMode()"
  [root]="tree()"
  [expandedIds]="expandedIds()"
  [selectedId]="effectiveSelectedId()"
  [clientsLabelKey]="effectiveClientsLabelKey()"
  [rootActions]="rootActions()"
  [nodeActions]="nodeActions()"
  [showActions]="showActions()"
  [showRootActions]="showRootActions()"
  [showSubNodes]="skeletonShowSubNodes()"
  [rootSelectable]="rootSelectable()"
  [nodesSelectable]="nodesSelectable()"
  [showArrows]="showArrows()"
  (toggle)="onSkeletonToggle($event)"
  (select)="onSkeletonSelect($any($event))"
  (action)="onSkeletonAction($event)" />
```

Admin-console + management-console then consume the **wrapper** `<app-organization-hierarchy-tree>` from their `org-hierarchy-page-menu` components — they never touch the skeleton.

## Canonical pattern — caller-driven configuration
The tree is dumb; the caller drives every behaviour through inputs. Defaults are all "on", so a plain `<app-organization-hierarchy-tree>` is a fully-interactive tree.

### Lock the tree for a wizard flow (the wizard-lock pattern)
In `admin-console/org-hierarchy-page-menu`:
```ts
treeNavigable      = computed(() => !this.state.addClientOpen());
treeActionsVisible = computed(() => !this.state.addClientOpen() && !this.state.addUserOpen());
```
```html
<app-organization-hierarchy-tree
  [nodesSelectable]="treeNavigable()"
  [showArrows]="treeNavigable()"
  [showActions]="treeActionsVisible()"
  [showRootActions]="treeActionsVisible()" ... />
```
- **Add Client open** → full lock: nodes non-clickable, chevrons hidden, all 3-dot menus hidden.
- **Add User open** → actions-only lock: 3-dot menus hidden; nodes clickable + expandable.
- The root row stays clickable in both (`rootSelectable` left at default `true`).

### Hide all actions
`[showActions]="false"` hides every per-row 3-dot; `[showRootActions]="false"` hides only the root one.

### Filter actions per node
```ts
readonly nodeActions: FalconTreeAction[] = [
  { id: 'editNode', labelKey: 'tree.actions.editNode', icon: 'falcon-icon falcon-icon-pencil' },
  { id: 'delete', labelKey: 'tree.actions.delete', icon: 'falcon-icon falcon-icon-trash',
    highlighted: true, visible: (node) => node.type !== 'root' },
];
```

### Client-mode root
`mode='client'` renders the root as a client (`root.imageUrl` + `root.name`). The wrapper then auto-hides the "Falcon Clients" label.

## Reactive Forms / ngModel
- **None.** The panel is not a form control. Wire selection via `[selectedId]` + `(select)`.

## Tailwind / token usage
- The component is fully Tailwind utilities + Falcon theme tokens (no SCSS).
- The action-column inset is the `--spacing-row-action-inset` token — bind any new action-bearing row to `pe-row-action-inset` to stay in the shared column.

## Bad usage to avoid
- DO NOT consume `<falcon-tree-node>` or `<falcon-tree-panel>` directly from an app — use the `<app-organization-hierarchy-tree>` wrapper.
- DO NOT mutate `[root].children` in place — pass a fresh tree object (signal identity).
- DO NOT expect actions when `[showActions]="false"` — it overrides `nodeActions`.

## Do / Don't
- DO declare action arrays as stable references (or `computed`) so change detection is cheap.
- DO use `visible(node)` to filter per-node actions instead of branching in the `(action)` handler.
- DO drive locked/read-only states by binding the config inputs to a `computed` off the caller's own flags.
