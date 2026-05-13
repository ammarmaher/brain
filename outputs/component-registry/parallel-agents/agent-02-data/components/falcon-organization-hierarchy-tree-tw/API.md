# falcon-organization-hierarchy-tree-tw — API

## Selectors / Tags

| Mode | Tag |
|---|---|
| Stencil Light | `<falcon-organization-hierarchy-tree-tw>` |
| Stencil Shadow | **NONE — Light DOM only.** |
| Angular wrapper | **NONE — used directly as the Stencil tag.** |

## Inputs (Stencil @Prop)

| Prop | Type | Default | Notes |
|---|---|---|---|
| `tree` | `FalconOrgHierarchyNode` | — | Required. The root node (single tree). |
| `selectedId` (mutable, reflect) | `string \| number \| null` | `null` | Currently selected node id |
| `expandedIds` (mutable) | `ReadonlyArray<string \| number>` | `[]` | Open node ids |
| `rootActions` | `ReadonlyArray<FalconOrgHierarchyAction>` | `[]` | Action menu items shown on the pinned root header |
| `nodeActions` | `ReadonlyArray<FalconOrgHierarchyAction>` | `[]` | Action menu items shown on each non-root row |
| `sectionLabel` | `string \| undefined` | — | Optional label between root header and child list |
| `showExpand` | `boolean` | `true` | |
| `showMoreActions` | `boolean` | `true` | |
| `defaultExpandLevel` | `number` | `0` | Auto-expand nodes up to this depth on first render |
| `ariaLabel` | `string \| undefined` | — | |

## Events (Stencil)

| Event | Detail | When |
|---|---|---|
| `falcon-select` | `FalconOrgHierarchySelectDetail = { id, node }` | Node selected |
| `falcon-toggle` | `FalconOrgHierarchyToggleDetail = { id, expanded }` | Expand/collapse — useful for lazy-load via `node.hasChildren` |
| `falcon-action` | `FalconOrgHierarchyActionDetail = { actionId, node, isRoot }` | Action menu item clicked |

## Methods (Stencil @Method)

| Method | Description |
|---|---|
| `selectAndScrollTo(id)` | Programmatically select + smooth-scroll the node into view |
| `expandAll()` | Expand every collapsible node |
| `collapseAll()` | Collapse all |
| `closeContextMenu()` | Dismiss the ctx-menu programmatically |

## Global event listeners (declared)

The component installs `@Listen` handlers on `document` + `window`:
- `keydown` (target document) → Escape closes ctx-menu
- `mousedown` (target document) → outside-click closes ctx-menu
- `scroll` (target window, capture: true) → reposition ctx-menu
- `resize` (target window) → reposition ctx-menu

## TypeScript types

```ts
interface FalconOrgHierarchyNode {
  readonly id: string | number;
  readonly name: string;
  readonly type?: 'root' | 'client' | 'node' | string;
  readonly iconUrl?: string;        // logo URL inside the indicator bubble
  readonly icon?: string;           // icon class (Falcon icon font) — fallback to initials
  readonly initials?: string;       // override initials display
  readonly brand?: string;          // 'bank-rajhi' / 'bank-snb' / 'bank-bupa' / 'bank-aramco'
  readonly disabled?: boolean;
  readonly hasChildren?: boolean;   // lazy hint — chevron renders even with empty children
  readonly children?: ReadonlyArray<FalconOrgHierarchyNode>;
}

interface FalconOrgHierarchyAction {
  readonly id: string;
  readonly label: string;
  readonly icon?: string;
  readonly highlight?: boolean;     // teal background per React `.ctx-menu-item.highlighted`
  readonly disabled?: boolean;
}

interface FalconOrgHierarchySelectDetail { readonly id: string | number; readonly node: FalconOrgHierarchyNode; }
interface FalconOrgHierarchyToggleDetail { readonly id: string | number; readonly expanded: boolean; }
interface FalconOrgHierarchyActionDetail { readonly actionId: string; readonly node: FalconOrgHierarchyNode; readonly isRoot: boolean; }
```

## Slots

- NO Stencil slots — node rendering is entirely token + tree-driven. Brand bubble / icon / initials / iconUrl is the entire customisation surface for node visuals.

## Variants

- No `[size]` / `[density]` variants today. Hardcoded sizing per React V0.2 reference.

## CVA

NO — not a form control.

## Accessibility

- Outer container `role="tree"` (likely — verify in unread portion of source) + `aria-label`
- Per-row `role="treeitem"`
- Per-row `aria-expanded` when collapsible
- Per-row `aria-selected`
- Per-row `aria-level`
- Keyboard nav (Arrow keys, Home/End, Space/Enter — verify in unread portion of source)
- The floating ctx menu opens on `⋮` click and reads its anchor via captured `MouseEvent.currentTarget` for positioning.

## Important constraints

- **Light DOM only** — no Shadow DOM companion. Style isolation is consumer's responsibility.
- **No Angular wrapper** — Angular consumers use the Stencil tag directly. Object props (`tree`, `rootActions`, `nodeActions`, `expandedIds`) must be set via element-property reflection if you bind them from a TS file.
- The companion `<style>` block inside the `.tsx` source is injected as a `data-fohtree-render="tailwind"` -scoped stylesheet — it handles rail SVG geometry, sticky menu-button reveal, name clamp, chevron rotation, ctx-menu animation.
- Brand bubble rendering reads `node.brand` and applies `client-logo bank-{x}` class names — these classes must exist in the consumer's theme CSS.
