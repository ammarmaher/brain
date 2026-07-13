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

## Accessibility (verified 2026-06-03 against full source)

- `[CODE]` Outer container `role="tree"` + `aria-label={ariaLabel || tree.name}` (tsx:979-980).
- `[CODE]` Per-row `role="treeitem"` (tsx:861, root tsx:998) with `aria-level` (tsx:863 `depth+2`; root `aria-level={1}` tsx:999), `aria-posinset` (tsx:864), `aria-setsize` (tsx:865), `aria-selected` (tsx:866), `aria-expanded` when `hasChildren` (tsx:867), `aria-disabled` (tsx:868).
- `[CODE]` Chevron button `aria-label={isOpen ? 'Collapse' : 'Expand'}` (tsx:694); ctx-menu trigger `aria-haspopup="menu" aria-expanded` (tsx:805-806); ctx-menu `role="menu"` + items `role="menuitem"` (tsx:1118/1145).
- `[CODE]` **GAP — NO roving keyboard navigation.** Rows are `tabIndex={isDisabled ? -1 : 0}` (tsx:862) but there is **NO `onKeyDown` handler anywhere** in the component (grep: zero `onKeyDown`/Arrow/Enter). A keyboard user can Tab onto a row but cannot Arrow/Enter/Space to expand or select it — only mouse `onClick` drives selection/expansion. Only the ctx-menu has keyboard dismissal (`@Listen('keydown')` Escape, tsx:330-335). This is a meaningful a11y gap vs the stepper (which has full arrow-key nav).
- `[CODE]` The floating ctx menu opens on `⋮` click, reads its anchor via `event.currentTarget.getBoundingClientRect()` for viewport-fixed positioning (tsx:397-408), repositions on window scroll/resize, and dismisses on outside-`mousedown` (tsx:337-345) or Escape.

## Important constraints

- **Light DOM only** — no Shadow DOM companion. Style isolation is consumer's responsibility.
- **No Angular wrapper** — Angular consumers use the Stencil tag directly. Object props (`tree`, `rootActions`, `nodeActions`, `expandedIds`) must be set via element-property reflection if you bind them from a TS file.
- The companion `<style>` block inside the `.tsx` source is injected as a `data-fohtree-render="tailwind"` -scoped stylesheet — it handles rail SVG geometry, sticky menu-button reveal, name clamp, chevron rotation, ctx-menu animation.
- `[CODE]` `node.brand` is declared in the type (`FalconOrgHierarchyNode.brand`) and documented for `client-logo bank-{x}` classes, but the indicator renderer (tsx:718-788) only consumes `iconUrl` → `icon` → `initials` — **`brand` is NOT applied to any element** in the current source (latent prop). The indicator bubble is token-styled (`--falcon-tree-indicator-*`), not brand-class-styled.
- `[CODE]` The component is robust to a `null`/empty `tree` (renders a "No tree data" placeholder, tsx:936-944) and coalesces `undefined` `expandedIds` before array ops (tsx:372).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B21) against falcon-organization-hierarchy-tree-tw.tsx (1207 ln) + .types.ts (59 ln). Props/events/methods/types confirmed. **A11y corrected:** `role="tree"`/`treeitem`/`aria-*` confirmed present; the prior "keyboard nav (Arrow/Home/End/Space/Enter)" claim is FALSE — there is no `onKeyDown` (GAP). `node.brand` is a latent (unused) prop.
