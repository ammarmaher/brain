# falcon-data-table — Recognition Layer

> Cross-cutting layer. Purpose: given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-data-table>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` A bordered, rounded **table card**. An uppercase header row with per-column sort affordances; a body of striped/hover-able rows; an optional **search input** above the table; a **footer paginator** (first/prev/next/last nav, jump-to-page input, rows-per-page dropdown, "X of Y" report). Each row may end in a sticky **⋮ row-action button** opening a popup menu. Selectable mode adds a leading checkbox/radio column. Loading shows skeleton rows; empty shows a centered message or a projected empty-state. **Shadow rows**: a full-width detail strip appears UNDER an expanded parent row, with a small upward **notch triangle** at its top edge aligned to a specific column header — view or edit mode, with trailing Edit/Delete or Save/Cancel buttons.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<DataGrid>` / `<DataGridPro>` | MUI DataGrid is the closest full-feature peer — sort, page, select, custom cell renderers |
| PrimeNG | `<p-table>` (+ `<p-tree>` for trees) | direct 1:1 — this component replaced the legacy PrimeNG `<p-table>` wrapper (Wave PR-7) |
| Ant Design | `<Table>` (+ `<Tree>` for trees) | Ant Table — `columns` config + `render` per column + `expandable` ≈ shadow/expansion |
| Bootstrap | `.table` + manual JS for sort/page | upgrade target — always replace |
| shadcn / Radix | `<Table>` + TanStack Table headless | shadcn Table is unstyled markup; TanStack supplies sort/page logic — this Falcon component bundles both |
| plain HTML | `<table>` | always replace with this component |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| a flat list with sort / page / select / row actions | `<falcon-angular-data-table>` | — |
| **tree-shaped** nested data with columns | `<falcon-angular-tree-table>` | data-table |
| an org-hierarchy left rail (branded root + ⋮ menus) | `<falcon-tree-panel>` / `<falcon-organization-hierarchy-tree-tw>` | data-table |
| a framework-agnostic mount (React/Vue host) | `<falcon-table-tw>` (raw Stencil tag) | the Angular wrapper |
| one heavy detail panel per expandable row | data-table row-expansion (`[expandedRowId]` + `slot="row-expansion"`) | shadow rows |
| zero-to-many column-anchored pending-change strips per row | data-table **shadow rows** (`[shadowRows]` + `targetColumn`) | row-expansion |
| a form (capturing field values) | a Reactive Form | data-table (not a form control) |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP.
1. **Inputs** — `[data]` (typed `T[]`), `[columns]` (`ColumnDef[]`, declared `readonly` in the state service), `[paginator]` / `[rows]` / `[rowsPerPageOptions]`, `[lazy]` + `[totalRecords]` for server-side, `[selectable]` + `[selectionMode]`, `[loading]` + `[skeletonRows]`, `[scrollable]`, `[striped]`, `[hoverable]`, `[showGlobalFilter]` + `[globalFilterFields]`, `[stickyActions]`.
2. **Cell templates** — for EVERY non-text cell (status pill, avatar, tags, inline buttons) use `<ng-template falconDataTableCell="field" let-value="value" let-row="row">`. Render real Falcon components inside (`<falcon-angular-avatar>`, `<falcon-angular-status-badge>`, `<falcon-angular-tag>`, `<falcon-angular-button>`) — projected templates produce real `EmbeddedViewRef`s. NEVER use `col.render()` for interactive content (it returns a static HTML string that bypasses Angular).
3. **Header / empty / loading templates** — `<ng-template falconDataTableHeaderCell="field">`, `<ng-template falconDataTableEmpty>` (compose `<falcon-angular-empty-state>`), `<ng-template falconDataTableLoading>`.
4. **Row actions** — prefer typed `[rowActions]` (`FalconDataTableRowMenuAction<T>` with `visible(row)` / `disabled(row)` / `enableFlag` / `flagMode`) over the legacy `[rowMenuItems]` / `[boundMenuItems]`. Wire `(rowAction)` to one dispatcher.
5. **Shadow rows** — `[shadowRows]` (Map / Record / `(row)=>ShadowRow[]`), `[(expandedShadowRowIds)]`, `[(shadowRowModes)]`; project `<ng-template falconDataTableShadow let-mode="mode">` (branch on `mode` for view/edit); optionally `<ng-template falconDataTableShadowActions>` for custom trailing buttons. Set `ShadowRow.targetColumn` — never hardcode the notch.
6. **Variants** — `striped`, `hoverable`, `scrollable`, `stickyActions`. (`density` exists on the Stencil core but is NOT yet exposed by the wrapper — `GAPS_AND_UPGRADES.md`.)
7. **Token override** — per-instance host class + `--falcon-data-table-*` mutations (19 categories, ~80 vars) — e.g. `--falcon-data-table-row-bg-hover`, `--falcon-data-table-shadow-row-bg`. Also per-column `tdClass` / `widthClass` Tailwind utilities.
8. **Shared upgrade / GAP** — `(multiSortChange)`, `[density]`, a built-in `[emptyState]` shape, virtual scrolling — documented gaps; raise, do not hand-roll.

## Anti-patterns
- Hand-rolling a `<table>` in page code — forbidden by the Falcon library-first rule; `<falcon-angular-data-table>` is the canonical Angular table.
- Dropping down to `<falcon-table-tw>` / `<falcon-angular-table>` for new Angular app code — use the data-table wrapper.
- Using `col.render()` HTML strings for cells that need Angular interactivity — use `<ng-template falconDataTableCell>`.
- `*ngIf` / `*ngFor` inside a cell template — use `@if` / `@for` (project rule).
- Binding `[reorderableColumns]` / `[resizableColumns]` to `true` expecting behaviour — they are unimplemented placeholders.
- Hardcoding the shadow-row notch position — `targetColumn` is the only public contract.
- Expecting `emptyMessageKey` to translate — it does not; pre-translate via `[emptyMessage]`.
- Treating shadow rows as row-expansion (or vice versa) — they model different things (see Use-THIS table).
