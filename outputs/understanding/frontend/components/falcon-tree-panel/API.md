# falcon-tree-panel — API

> **REFRESHED 2026-06-03 (B24).** Single-render Angular component — no Stencil twin, no reflected props, no `useTailwind` switch. Corrections: `FalconTreeHoverPath` is `readonly number[]` (ordered sibling-index path), NOT `ReadonlySet<string>`; the panel uses ONE shared `<falcon-angular-menu #actionMenu>` driven by `menuContext` + `activeMenuItems` (not two menus / `rootMenuItems`+`nodeMenuItems`); internal signal is `menuContext` (not `targetNodeId`), hover signal is `hoveredIndexPath` (not `hoveredPathIds`), overlap helper is `scrollIfChevronOverlapsRowAction`.

## Selector
- `<falcon-tree-panel>` — Angular bespoke standalone component (`[CODE]` ts:57, `OnPush`, `ViewEncapsulation.None`). Generic: `FalconTreePanelComponent<T extends FalconTreeNode<T>>`.

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

// CORRECTED 2026-06-03 (B24): an ORDERED sibling-index path, NOT a Set of ids.
// p[j] = the hovered node's sibling index at depth j (depth 0 = which top-level client).
// [] = nothing hovered. Drives the two-tone lit connector trail (utils/rail-highlight.ts).
export type FalconTreeHoverPath = readonly number[];   // [CODE] models.ts:19

export interface FalconTreeContextAction {
  readonly nodeId: string;
  readonly action: string;        // 'open' in practice (emitted by the node kebab)
  readonly event?: MouseEvent;    // carries the click so the panel anchors the popup
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
| `showArrows` | `input<boolean>` | — | `true` | When false, all chevrons are hidden (tree otherwise unchanged). |
| `showActions` | `input<boolean>` | — | `true` | When false, every per-row 3-dot trigger is hidden. |
| `showRootActions` | `input<boolean>` | — | `true` | When false, ONLY the root row 3-dot is hidden — independent of `showActions`. |
| `showSubNodes` | `input<boolean>` | — | `true` | When false, only depth-0 rows render — chevrons hidden, expansion forced empty ("clients-only" view). |
| `rootSelectable` | `input<boolean>` | — | `true` | **(2026-05-18)** When false, the root row emits no `select` on click and drops its pointer cursor + hover surface. Expansion + root 3-dot unaffected. |
| `nodesSelectable` | `input<boolean>` | — | `true` | **(2026-05-18)** When false, client rows emit no `select` on click and drop their pointer + hover. Chevron expand/collapse + per-row 3-dot still work. |

> [!note] App wrapper
> Admin-console + management-console do NOT consume `<falcon-tree-panel>` directly — they consume the host-shell wrapper `<app-organization-hierarchy-tree>`, which owns PES + tree fetch and **passes through** `mode`, `showActions`, `showRootActions`, `showArrows`, `rootSelectable`, `nodesSelectable`, `clientsLabelKey`. The wrapper also auto-hides the clients label in `mode='client'`. See [[Org-Hierarchy-Tree-Component-Knowledge]].

## @Outputs

| Name | Payload | Description |
|---|---|---|
| `toggle` | `string` | Node id whose chevron was clicked (consumer mutates `expandedIds`). |
| `select` | `T` | Node selected. |
| `action` | `FalconTreePanelActionEvent` | Single stream for both root and per-node 3-dot actions. `nodeId === null` for root menu. `[CODE]` ts:146,316. |
| `hoverPathChange` | `FalconTreeHoverPath` (`readonly number[]`) | **CORRECTED 2026-06-03:** the hovered node's ORDERED sibling-index path (not a Set of ids). Re-emitted from the internal `TreeHoverPathDirective`. `[CODE]` ts:147,263-266. |

## Internal helpers (CORRECTED 2026-06-03)
- `[CODE]` ts:172-187 — `displayName`, `displayImage`, `displayInitials`, `showFalconSvg`, `showInitialsChip` — derived `computed` signals for the root row (mode-aware).
- `[CODE]` ts:189-192 `isRootSelected` — boolean computed.
- `[CODE]` ts:154 **`menuContext = signal<'root' | string | null>(null)`** — which trigger opened the single shared menu (`'root'` sentinel, a node-id string, or `null` when closed). **Replaces the prior `targetNodeId`.**
- `[CODE]` ts:159 `openMenuNodeId` / ts:163 `rootMenuOpen` — keep the kebab lit while its popup is open.
- `[CODE]` ts:167 **`hoveredIndexPath = signal<readonly number[]>([])`** — internal hover-trail mirror (an ordered index path). **Replaces the prior `hoveredPathIds`.**
- `[CODE]` ts:206-215 **`activeMenuItems` — ONE `computed<FalconMenuItem[]>`** that returns `rootActions` (when `menuContext === 'root'`) or the targeted node's `visible`-filtered `nodeActions`. **Replaces the prior split `rootMenuItems`/`nodeMenuItems`.**
- `[CODE]` ts:321-330 `findNode(root, id)` — recursive O(n) node lookup.
- `[CODE]` ts:334-339 **`scrollIfChevronOverlapsRowAction(row)`** (renamed) — scrolls the container right just enough to separate a deep chevron from the sticky 3-dot button (8 px `OVERLAP_GUARD_PX`).
- `[CODE]` ts:372-380 `computeOverlapDelta(row)` — px to scroll right.
- `[CODE]` ts:348-369 `clampMenuPanelInViewport(anchor)` — two-RAF re-clamp so the just-mounted popup flips up for bottom-of-screen rows (works around Stencil `positionPanel()` reading `offsetHeight=0` on first RAF).
- `[CODE]` ts:311-318 `toMenuItem(a, nodeId)` — maps `FalconTreeAction → FalconMenuItem`; a `highlighted` action gets `HIGHLIGHTED_STYLE_CLASS` (solid teal-700 row via `[--falcon-menu-item-*]` arbitrary utilities).

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
- `[CODE]` ts:71 The component is `ViewEncapsulation.None` — required so the host-class scrollbar utility variants (`[&_::-webkit-scrollbar*]`) reach every scrollable descendant AND the menu `rootClass` utilities reach the externally-rendered popup. **There is NO `.scss`/`.css` file** (corrected 2026-06-03) — styling is template-level Tailwind utilities, so the old "all CSS rules MUST be prefixed" caveat is moot (no authored CSS rules exist to leak; the host-level arbitrary variants are the only global-reaching styling).
- Consumer owns `expandedIds` and `selectedId` — the panel emits `(toggle)` and `(select)` but does not mutate inputs (controlled component).
- `[CODE]` ts:30,89-108 Internal `<falcon-tree-node>` owns the recursive rendering and dispatches `FalconTreeContextAction` upward; the panel turns that into a `showAt()` on the **single shared `#actionMenu`**.
- `[CODE]` directives/directives.ts The hover-path mirror is `TreeHoverPathDirective` — ONE delegated **`mousemove`** listener resolves the closest `.client-row`, reads its `data-index-path` (semicolon-joined sibling indexes), dedupes, and emits the ordered index path; `mouseleave` resets to `[]`. The panel re-emits via `(hoverPathChange)`.
- `[CODE]` ts:217-236,348-369 Chevron-overlap auto-scroll + menu re-clamp run via: a `queueMicrotask` that wires a `fromEvent('mouseover')` on `.falcon-tree` filtered to `.chevron`/`.row-action` (`takeUntilDestroyed`); and a two-RAF `clampMenuPanelInViewport` after each `showAt()`. (NOTE: the prior dossier's "`effect()` on `selectedId` → RAF" auto-scroll path is NOT present in the current source — the only scroll trigger is the hover `mouseover` listener.)

## Accessibility
- `[CODE]` ts:87-89 host is `class: 'falcon-tree-panel block h-full min-h-0 …'`.
- `[CODE]` html:14-18 the root row is a native `<button type="button">` with `[attr.aria-pressed]` (when `rootSelectable`); the root brand mark has `aria-label="Falcon" role="img"` + the inner SVG `aria-hidden`.
- `[CODE]` html:46-56 the root 3-dot trigger is a native `<button>` with `[attr.aria-label]="'hierarchyTab.tree.menuAriaLabel' | translate"`.
- The per-row 3-dot trigger + tree-row semantics are delegated to the internal `<falcon-tree-node>`; the popup uses `<falcon-angular-menu>`'s built-in keyboard semantics.
- **Gaps (re-confirmed 2026-06-03):** no explicit `role="tree"`/`role="treeitem"` wiring observed on the panel container or node rows (the prior dossier's "rows carry `role=treeitem`" claim is NOT evident in the panel template — verify in `<falcon-tree-node>`'s template); no keyboard activation (Enter/Space/F10) to open the per-row menu (mouse-click only) — `GAPS_AND_UPGRADES.md` item 4 + a11y gaps.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B24) against `falcon-tree-panel.component.ts` (381 ln) + `.html` (157 ln) + `models/models.ts` + `directives/directives.ts`, all read in full. Corrections confirmed: `FalconTreeHoverPath = readonly number[]` (models.ts:19); single shared `#actionMenu` + `menuContext` + `activeMenuItems` (ts:153-154,206-215); renamed `scrollIfChevronOverlapsRowAction` (ts:334); no `effect()`-on-`selectedId` scroll path; no `.scss`/`.css` file. The 15 inputs / 4 outputs tables re-checked against `input()`/`output()` declarations (ts:97-147).
