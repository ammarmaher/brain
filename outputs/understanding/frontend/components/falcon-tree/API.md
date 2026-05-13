# falcon-angular-tree — API

## Selectors
- **Angular wrapper:** `<falcon-angular-tree>`
- **Shadow tag:** `<falcon-tree>`
- **Light tag:** `<falcon-tree-tw>`

## Import path
```ts
import { FalconAngularTreeComponent } from '@falcon/ui-core/angular';
import type {
  FalconTreeNode,
  FalconTreeDensity,
  FalconTreeSelectionMode,
  FalconTreeBadge,
  FalconTreeBadgeVariant,
  FalconTreeChangeDetail,
  FalconTreeMultiChangeDetail,
  FalconTreeExpandDetail,
  FalconTreeHoverDetail,
  FalconTreeFocusDetail,
} from '@falcon/ui-core/angular';
```

## TypeScript types
```ts
// libs/falcon-ui-core/src/components/falcon-tree/falcon-tree.types.ts
export type FalconTreeDensity = 'compact' | 'comfortable';
export type FalconTreeSelectionMode = 'none' | 'single' | 'multiple';
export type FalconTreeBadgeVariant = 'success' | 'warning' | 'danger' | 'info';

export interface FalconTreeBadge {
  readonly text: string;
  readonly variant: FalconTreeBadgeVariant;
}

export interface FalconTreeNode {
  readonly id: string | number;
  readonly label: string;
  readonly icon?: string;
  readonly children?: ReadonlyArray<FalconTreeNode>;
  readonly disabled?: boolean;
  readonly badge?: FalconTreeBadge;
}

export interface FalconTreeChangeDetail        { readonly selectedValue: string | number | null; readonly previousSelectedValue: string | number | null; }
export interface FalconTreeMultiChangeDetail   { readonly selectedValues: ReadonlyArray<string | number>; readonly previousSelectedValues: ReadonlyArray<string | number>; }
export interface FalconTreeExpandDetail        { readonly id: string | number; readonly expanded: boolean; }
export interface FalconTreeHoverDetail         { readonly id: string | number | null; readonly ancestorPath: ReadonlyArray<string | number>; }
export interface FalconTreeFocusDetail         { readonly id: string | number | null; }
```

## @Inputs (Angular wrapper)

| Name | Type | Default | Notes |
|---|---|---|---|
| `nodes` | `ReadonlyArray<FalconTreeNode>` | `[]` | The tree forest. |
| `selectedValue` / CVA | `string \| number \| null` | `null` | Two-way via `[(ngModel)]` (single mode). |
| `selectedValues` | `ReadonlyArray<string \| number>` | `[]` | Multi mode. |
| `expandedIds` | `ReadonlyArray<string \| number>` | `[]` | Which nodes are currently open. |
| `density` | `'compact' \| 'comfortable'` | `'comfortable'` | — |
| `selectionMode` | `'none' \| 'single' \| 'multiple'` | `'single'` | — |
| `disabled` | `boolean` | `false` | Disables the whole tree. |
| `helperText` | `string?` | — | Below the tree when no error. |
| `errorMessage` | `string?` | — | `<p role="alert">`. |
| `groupLabel` | `string?` | — | Above the tree. |
| `ariaLabel` | `string?` | — | Outer `aria-label`. |
| `searchQuery` | `string` | `''` | When non-empty, filters the forest + auto-expands matches. |
| `defaultExpandLevel` | `number` | `0` | Initial auto-expansion to depth N. |
| `useTailwind` | `boolean` | `true` | Light vs Shadow. |
| `rootClass` | `string` | `''` | Outer extension. |

## @Outputs

| Name | Payload | Description |
|---|---|---|
| `valueChange` | `string \| number \| null` | Single-mode selection. |
| `valuesChange` | `ReadonlyArray<string \| number>` | Multi-mode selection. |
| `expandChange` | `FalconTreeExpandDetail` | Node expand/collapse. |
| `hoverChange` | `FalconTreeHoverDetail` | Hovered node + ancestor path (used to drive hover-path visual). |
| `focusChange` | `FalconTreeFocusDetail` | Keyboard focus change. |

## Programmatic Angular API (delegates to Stencil `@Method`s)
- `selectAndScrollTo(id)`: Promise<void>` — select + scrollIntoView.
- `expandTo(id)`: Promise<void>` — expand all ancestors.
- `expandAll()`: Promise<void>`.
- `collapseAll()`: Promise<void>`.
- `focusNode(id)`: Promise<void>` — keyboard focus to id.

## CVA / Forms support
- `NG_VALUE_ACCESSOR` provided. `writeValue` writes the single `selectedValue`.
- Multi-mode is NOT a CVA — bind `[selectedValues]` + `(valuesChange)` manually.

## Slots
- _None observed in active source._ The tree renders a fixed row structure: rails column + chevron + multi-check (in multi mode) + initials indicator + icon (optional) + label + badge (optional).

## Supported sizes / modes / variants
- **density:** comfortable / compact.
- **selectionMode:** none / single / multiple.
- **searchable via `searchQuery` Input.**
- **render path:** Shadow / Light via `useTailwind`.

## Lazy / server mode
- _None observed._ The tree expects the full forest in memory; no lazy children loader.

## Important constraints
- `selectedValue` is reflected as a DOM attribute (`@Prop({ mutable: true, reflect: true })`).
- The Stencil internal state includes `focusedId` and `hoverPath` (each a `@State`) plus a `justClickedId` private flag used to skip the auto-scroll when the user has just clicked the node (avoids redundant smooth-scroll).
- Search filtering uses `filterTreeBySearch()` from utils. When searching, all nodes are auto-expanded so matches are reachable.
- Multi-mode: clicking a node toggles its inclusion in `selectedValues`. No "select-all descendants" shortcut.

## Accessibility
- Outer container: `role="tree"`, `aria-label`, `aria-multiselectable={selectionMode === 'multiple'}`, `aria-disabled`.
- Each row: `role="treeitem"`, `aria-level={depth+1}`, `aria-posinset`, `aria-setsize`, `aria-selected`, `aria-expanded` (when hasChildren), `aria-disabled`.
- Keyboard support:
  - `ArrowDown` / `ArrowUp` — next / previous visible row.
  - `Home` / `End` — first / last visible row.
  - `ArrowRight` — expand if has children + collapsed; if already expanded, move focus to first child.
  - `ArrowLeft` — collapse if expanded; if leaf, move focus to parent.
  - `Enter` / `Space` — toggle selection or expand if leaf-row has children + selection-none mode.
- Chevron button has `aria-label={isOpen ? 'Collapse' : 'Expand'}`.
- Multi-check icon has `aria-hidden="true"` (the row's `aria-selected` carries the semantics).
