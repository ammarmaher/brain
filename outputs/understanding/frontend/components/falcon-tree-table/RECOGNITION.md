# falcon-tree-table — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-tree-table>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` falcon-tree-table-tw.tsx — A single CSS-Grid block (NOT a real `<table>`): a header row of column labels, then rows of tree-shaped data. The **first column is the tree column** — it carries depth indentation (`padding-inline-start: depth × indent-step`), rail connectors, an expand/collapse chevron for rows with children, and the node label. Every **other column shows aligned per-node data** — text, a number (right-aligned, tabular figures), a binary active/inactive badge, or a radio (in radio mode). Rows indent and expand to reveal children of the *same column shape*. Distinguishing trait: **it has both indentation/chevron (like a tree) AND aligned data columns (like a table)** — that combination is unique to this component. If rows have data columns but no indentation → `falcon-table`. If rows indent but each is a single label line → `falcon-tree`.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<DataGrid treeData>` (MUI X Pro) / `<RichTreeView>` with columns | MUI X tree-data grid ≈ this; MUI's is sortable, Falcon's is not |
| PrimeNG | `<p-treeTable>` | direct 1:1 — `falcon-tree-table` is the Falcon equivalent of `p-treeTable` |
| Ant Design | `<Table>` with nested `dataSource` + `expandable` / `childrenColumnName` | Ant Table's tree mode maps 1:1 |
| Bootstrap | no native tree-table | always upgrade |
| shadcn / Radix | TanStack Table with expandable sub-rows | TanStack `getExpandedRowModel` ≈ this |
| plain HTML | nested `<table>` or `<table>` + indentation hack | always replace |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| indented rows that expand AND show aligned data columns at every depth | `<falcon-angular-tree-table>` | falcon-table / falcon-tree |
| a flat list of records with data columns, no indentation | `<falcon-angular-data-table>` | falcon-tree-table |
| an indented hierarchy where each row is a single label (no data columns) | `<falcon-angular-tree>` | falcon-tree-table |
| an org-hierarchy panel with per-depth chrome + 3-dot menus | `<falcon-organization-hierarchy-tree-tw>` / `<falcon-tree-panel>` | falcon-tree-table |
| a wallet / accounts roll-up: parent account + sub-accounts, balances per row | `<falcon-angular-tree-table>` `selectionMode="radio"` | falcon-table |
| a tree-table that also needs multi-row batch selection | (gap — raise FTT-02) | do not promise it on this component |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[nodes]` (`FalconTreeNode[]` with per-column values on each node via the index signature); `[columns]` (`FalconTreeColumn[]`: `key`, `label`, `type`, `width`, `align`, `badgeVariant`); `selectionMode` (`none`/`radio`); `[selectedValue]` (CVA); `[expandedIds]`; `density`; `groupLabel`; `helperText`; `errorMessage`; `ariaLabel`; `radioName`.
2. **Column types** — `column.type`: `'text'` / `'number'` (right-aligned tabular) / `'badge'` (binary active/inactive) / `'radio'` / `'custom'`.
3. **Templates / slots** — for a custom cell, the Stencil per-row named slot `slot="cell-{columnKey}-{nodeId}"` (only when `column.type='custom'`). The Angular wrapper does NOT project `<ng-template>` — see step 7.
4. **Variants** — `selectionMode` + `density` (`compact`/`comfortable`/`spacious`) + render path (`useTailwind`).
5. **Token override** — host marker class + re-declare `--falcon-tree-table-*` (indent step, row heights per density, header/row/cell colours, rails, chevron, badge cell).
6. **Programmatic API** — `select(id)`, `expand(id)`, `collapse(id)` via `@ViewChild`.
7. **Upgrade** — Strategy E projection in the Angular wrapper (FTT-01), multi-select (FTT-02), status/tag/currency/date/avatar column types (FTT-03), lazy expand (FTT-04), pagination/virtual scroll (FTT-05), row-action `⋮` menu (FTT-06), sorting (FTT-08) are all documented gaps. If the design needs any, raise the shared-component upgrade.
8. **Wrapper** — once a production wallet-hierarchy feature lands, wrap the tree-table for that shape.

## Anti-patterns
- Using `falcon-tree-table` for flat data — that is `<falcon-angular-data-table>`. Indentation/chevron with no real hierarchy is wasted structure.
- Using it for org-hierarchy chrome — the org-hierarchy needs per-depth chrome + 3-dot menus; this is a uniform grid.
- `selectionMode="multiple"` — invalid; only `'none'` and `'radio'` exist. Multi-select is a gap, not an option.
- Embedding a Falcon Angular component in a cell via `<ng-template>` and expecting projection — the wrapper does not project. Use the Stencil per-row slot, or raise FTT-01.
- Overriding `grid-template-columns` via CSS — the inline computed style wins; use `column.width` or tokens.
- Expecting parent rows to auto-sum children — the component renders supplied values only; aggregation is the backend's / consumer's job.
- Expecting children to lazy-load on expand — no `hasChildren` hint exists; the whole tree must be in memory.

## Verification
🟡 CODE-DERIVED, RE-VERIFIED 2026-06-03 (B08) from `[CODE]` falcon-tree-table-tw.tsx (668 ln) + falcon-tree-table.types.ts + the UI-layer dossiers. Cross-library map `[INFERRED]` from standard library APIs. The table vs tree vs tree-table split ✅ VERIFIED against `OVERVIEW.md` + `DECISION.md`.
