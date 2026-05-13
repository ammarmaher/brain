# falcon-tree-panel (LEGACY BESPOKE) — API

## Selector
- `<falcon-tree-panel>` — Angular bespoke standalone component.

## Import path
```ts
import {
  FalconTreePanelComponent,
  type FalconTreeAction,
  type FalconTreePanelActionEvent,
} from '@falcon';

import type { FalconTreeNode, FalconTreeHoverPath, FalconTreeContextAction }
  from 'libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/models/models';
```

## TypeScript types (from the component source + models)
```ts
// Generic tree-node shape — host data extends this.
export interface FalconTreeNode<T> {
  readonly id: string;
  readonly name: string;
  readonly type: 'root' | 'client' | 'sub-node' | string;
  readonly brand?: string;
  readonly hasChildren?: boolean;
  readonly imageUrl?: string;
  readonly children?: readonly T[];
}

export type FalconTreeHoverPath = ReadonlySet<string>;

export interface FalconTreeContextAction {
  readonly nodeId: string;
  readonly action: string;
  readonly event?: MouseEvent;
}

// Declarative action menu item — same for root and per-node.
export interface FalconTreeAction {
  readonly id: string;
  readonly labelKey: string;          // translation key
  readonly icon?: string;             // CSS class for icon font
  readonly highlighted?: boolean;     // optional emphasis (red)
  readonly visible?: (node: FalconTreeNode<unknown>) => boolean;  // per-node only
}

// Single output payload — nodeId===null for root menu, populated for per-node.
export interface FalconTreePanelActionEvent {
  readonly id: string;
  readonly nodeId: string | null;
}
```

## @Inputs (Angular signal `input()`)

| Name | Kind | Type | Default | Notes |
|---|---|---|---|---|
| `root` | `input<T \| null>` | `FalconTreeNode<T>` | `null` | The root node. Children come from `root.children`. |
| `expandedIds` | `input<ReadonlySet<string>>` | — | `new Set()` | Which nodes are currently open. Consumer owns this state. |
| `selectedId` | `input<string \| null>` | — | `null` | Single-selection. |
| `trackBy` | `input<(node: T) => string>` | — | `(n) => n.id` | Stable track-by for `@for`. |
| `clientId` | `input<string \| null>` | — | `null` | Client-mode id (page-specific binding). |
| `clientsLabelKey` | `input<string>` | — | `'falconTree.clientsLabel'` | i18n key for the section label between root row and tree body. Empty → hide. |
| `rootActions` | `input<readonly FalconTreeAction[]>` | — | `[]` | Items in the root 3-dot menu. Empty → no root 3-dot button. |
| `nodeActions` | `input<readonly FalconTreeAction[]>` | — | `[]` | Items in the per-row 3-dot menu. Empty → no per-row 3-dot. `visible(node)` filters per node. |
| `mode` | `input<'falcon' \| 'client'>` | — | `'falcon'` | `falcon` mode renders Falcon SVG + "Falcon" label (ignores root's name/image). `client` mode renders `root.imageUrl` (with initials fallback) + `root.name`. |
| `showArrows` | `input<boolean>` | — | `true` | When false, all chevrons are hidden. |
| `showActions` | `input<boolean>` | — | `true` | When false, both root + per-row 3-dot triggers are hidden (overrides `*Actions` arrays). |

## @Outputs

| Name | Payload | Description |
|---|---|---|
| `toggle` | `string` | Node id whose chevron was clicked (consumer mutates `expandedIds`). |
| `select` | `T` | Node selected. |
| `action` | `FalconTreePanelActionEvent` | Single stream for both root and per-node 3-dot actions. `nodeId === null` for root menu. |
| `hoverPathChange` | `FalconTreeHoverPath` | Set of ancestor ids highlighted along the trail. |

## Internal helpers
- `displayName`, `displayImage`, `displayInitials`, `showFalconSvg`, `showInitialsChip` — derived computed signals for the root row.
- `isRootSelected` — boolean.
- `rootMenuItems` / `nodeMenuItems` — `FalconMenuItem[]` derived from the action configs and the currently-targeted node.
- `findNode(root, id)` — recursive node lookup.
- `scrollIfChevronOverlapsAction` — recomputes a row's chevron vs sticky 3-dot button overlap; scrolls right just enough to separate (8 px guard).
- `computeOverlapDelta(row)` — returns px to scroll right.

## CVA / Forms support
- **None.** Use `[selectedId]` + `(select)` for selection wiring.

## Slots / ng-template inputs
- _None._ The chrome is fully baked in.

## Supported variants
- `mode: 'falcon' | 'client'` — drives the root row visual.
- `showArrows` / `showActions` toggle visibility of chevrons + 3-dot triggers.

## Lazy / server mode
- _None observed in active source._

## Important constraints
- The component is `ViewEncapsulation.None` — required so menu overlay CSS reaches.
- All CSS rules MUST be prefixed with `.falcon-tree-panel-menu` or `.falcon-tree-panel` to avoid global leakage.
- Consumer owns `expandedIds` and `selectedId` — the panel emits `(toggle)` and `(select)` but does not mutate inputs.
- Internal `<falcon-tree-node>` component owns the recursive rendering and dispatches `FalconTreeContextAction` upward.
- The hover-path mirror is via `TreeHoverPathDirective` (in `directives/directives.ts`) — a single mousemove listener walks `data-node-path` to determine the lit trail. Re-emit boundary `(hoverPathChange)`.
- Chevron-overlap auto-scroll runs:
  - On `selectedId` change (via `effect()` + `requestAnimationFrame`).
  - On `mouseover` events filtered to `.client-row` (via `fromEvent` + `takeUntilDestroyed`).
  - On `(toggle)` re-emit.

## Accessibility
- The panel has `host: { class: 'falcon-tree-panel block' }`.
- Inner tree rows carry `role="treeitem"` / `aria-selected` / `aria-expanded` etc. (delegated to internal `<falcon-tree-node>`).
- The 3-dot button trigger is a native `<button>` — uses `<falcon-angular-menu>`'s built-in keyboard semantics for the popup.
- _Gap:_ explicit `role="tree"` on the outer container is delegated to the inner node component — verify.
