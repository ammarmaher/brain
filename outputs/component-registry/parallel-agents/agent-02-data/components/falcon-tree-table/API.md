# falcon-tree-table — API

## Selectors / Tags

| Mode | Tag | Path |
|---|---|---|
| Stencil Shadow | `<falcon-tree-table>` | `libs/falcon-ui-core/src/components/falcon-tree-table/falcon-tree-table.tsx` |
| Stencil Light | `<falcon-tree-table-tw>` | `libs/falcon-ui-core/src/components/falcon-tree-table-tw/falcon-tree-table-tw.tsx` |
| Angular wrapper | `<falcon-angular-tree-table>` | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tree-table/falcon-tree-table.component.ts` |

## Inputs (Angular wrapper + Stencil parity)

| Input | Type | Default | Notes |
|---|---|---|---|
| `nodes` | `ReadonlyArray<FalconTreeNode>` | `[]` | Recursive tree |
| `columns` | `ReadonlyArray<FalconTreeColumn>` | `[]` | Per-data-column descriptors |
| `selectedValue` (CVA writeValue) | `string \| number \| null` | `null` | Two-way via `[(selectedValue)]` or `[(ngModel)]` |
| `expandedIds` | `ReadonlyArray<string \| number>` | `[]` | Open rows |
| `density` (reflect) | `'compact' \| 'comfortable' \| 'spacious'` | `'comfortable'` | |
| `selectionMode` (reflect) | `'none' \| 'radio'` | `'none'` | NO multi-select |
| `disabled` | `boolean` | `false` | |
| `helperText` | `string \| undefined` | — | Below the grid |
| `errorMessage` | `string \| undefined` | — | Below the grid (`role="alert"`) |
| `groupLabel` | `string \| undefined` | — | Label above the grid |
| `ariaLabel` | `string \| undefined` | — | `<treegrid>` aria-label |
| `radioName` | `string \| undefined` | — | Radio group name override (defaults to generated id) |
| `useTailwind` (Angular) | `boolean` | `true` | Light DOM (`falcon-tree-table-tw`) when true |
| `rootClass` (Angular) | `string` | `''` | |

## Outputs (Angular wrapper)

| Output | Type | When |
|---|---|---|
| `valueChange` | `EventEmitter<string \| number \| null>` | Two-way `[(selectedValue)]` sugar |
| `expandChange` | `EventEmitter<FalconTreeTableExpandDetail>` | Row expand/collapse |
| `rowClick` | `EventEmitter<FalconTreeTableRowClickDetail>` | Row clicked (not chevron / radio / button) |

## Stencil events

| Event | Detail |
|---|---|
| `falcon-change` | `FalconTreeTableChangeDetail` = `{ selectedId, previousSelectedId }` |
| `falcon-expand` | `FalconTreeTableExpandDetail` = `{ id, expanded }` |
| `falcon-row-click` | `FalconTreeTableRowClickDetail` = `{ id }` |

## Methods (Stencil @Method)

| Method | Description |
|---|---|
| `select(id)` | Programmatic select |
| `expand(id)` | Programmatic expand |
| `collapse(id)` | Programmatic collapse |

## TypeScript types

```ts
type FalconTreeTableDensity = 'compact' | 'comfortable' | 'spacious';
type FalconTreeTableSelectionMode = 'none' | 'radio';
type FalconTreeColumnType = 'text' | 'badge' | 'number' | 'radio' | 'custom';

interface FalconTreeColumn {
  readonly key: string;
  readonly label: string;
  readonly type?: FalconTreeColumnType;
  readonly width?: string;
  readonly align?: 'start' | 'center' | 'end';
  readonly badgeVariant?: 'active' | 'inactive';
}

interface FalconTreeNode {
  readonly id: string | number;
  readonly label: string;
  readonly icon?: string;
  readonly children?: ReadonlyArray<FalconTreeNode>;
  readonly disabled?: boolean;
  readonly [columnKey: string]: unknown;          // per-column data lookups
}
```

## Slots (Stencil)

- Per-row custom column slot when `column.type='custom'`: `<slot name="cell-${column.key}-${node.id}"></slot>` — consumer must wrap content with `slot="cell-<key>-<nodeId>"`. This is **a unique projection pattern** in the Falcon library — Stencil composes a per-row slot per cell with a deterministic name.

## ng-template inputs (Angular)

NONE — the Angular wrapper does NOT project Angular templates into cells. The Strategy E projection pattern from `falcon-data-table` has NOT been adopted here. **GAP — see GAPS_AND_UPGRADES.md.**

## Variants

- **`column.type`:** `'text'` / `'badge'` / `'number'` / `'radio'` / `'custom'` — `'radio'` renders an inline `<falcon-radio>` per row; `'custom'` exposes the per-row named slot above.
- **`selectionMode`:** `'none'` / `'radio'`. Multi-select is NOT supported.
- **`density`:** `'compact' | 'comfortable' | 'spacious'` — drives row height, indent step, font size via tokens.

## Accessibility

- Outer grid: `role="treegrid"` + `aria-label` + `aria-rowcount` + `aria-colcount`
- Each row: `role="row"` + `aria-level` (1-based) + `aria-posinset` + `aria-setsize` + `aria-selected` + `aria-expanded` + `aria-disabled`
- Each data cell: `role="gridcell"`
- Each header cell: `role="columnheader"`
- Chevron: `<button aria-label="Expand row|Collapse row">` with `aria-hidden="true"` SVG inside
- Keyboard nav fully implemented on the label cell:
  - **Arrow Down/Up:** move focus down/up the flattened row list
  - **Home/End:** first/last row
  - **Arrow Right:** expand if collapsed; if expanded, focus first child
  - **Arrow Left:** collapse if expanded; if collapsed, focus parent
  - **Enter/Space:** in `radio` mode → select; otherwise → toggle expand
- Hover-path highlighting (ancestors of hovered row get rail repaint) — see `data-hover-ancestor` attribute and the rail bg-gradient swap.
- CVA — supports `[(ngModel)]` and Reactive Forms.

## Important constraints

- `grid-template-columns` is computed via `buildGridTemplate()` per render and applied inline. Don't override via CSS — use the `column.width` field or per-component tokens.
- `radio` column with same `radioName` across instances would collide on the DOM. The wrapper defaults to a generated id; the consumer can override.
