# falcon-angular-tree — Recognition Layer

> Given an external design / screenshot / React or Angular snippet, identify `<falcon-angular-tree>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` falcon-tree-tw.tsx — A vertical list of indented rows. Each row, left to right: a stack of **rail connectors** (vertical through-lines + elbow segments drawn per depth), an **expand/collapse chevron** (caret SVG that rotates on open) for rows with children, an optional **multi-select check** (in `multiple` mode), an **initials chip** (2-letter monogram auto-derived from the label), an optional **node icon**, the **label text**, and an optional **badge** (success/warning/danger/info pill). Hovering a row repaints the rails up the **ancestor path**. Selected row gets a tinted background + heavier label weight. Distinguishing trait: **indentation + rails + per-row chevron, but NO data columns** — every row is a single label line. If rows have aligned columns of data, it is `falcon-tree-table`, not this.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<TreeView>` / `<SimpleTreeView>` + `<TreeItem>` (MUI X) | direct 1:1 — recursive selectable tree |
| PrimeNG | `<p-tree>` (`selectionMode="single"`/`"checkbox"`) | direct 1:1 — `falcon-angular-tree` is the Falcon replacement for `p-tree` |
| Ant Design | `<Tree>` | `checkable` ≈ multiple mode; Ant's cascading-check is the gap Falcon does not have |
| Bootstrap | no native tree (community `bootstrap-treeview`) | always upgrade |
| shadcn / Radix | no Radix tree primitive (community recipes) | upgrade target |
| plain HTML | nested `<ul><li>` + `<details>` | always replace |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| an indented hierarchy, rows are single labels, user picks a node | `<falcon-angular-tree>` | falcon-table |
| an indented hierarchy where each row ALSO shows data columns (balance, status…) | `<falcon-angular-tree-table>` | falcon-angular-tree |
| an org-hierarchy panel with chrome: root header, per-row 3-dot action menus, sticky toolbar | `<falcon-tree-panel>` / `<falcon-organization-hierarchy-tree-tw>` | falcon-angular-tree (no per-row action slot) |
| a flat list with no indentation | `<falcon-angular-data-table>` | falcon-angular-tree |
| static navigation links (not a data hierarchy) | `<falcon-angular-menu>` | falcon-angular-tree |
| indented options inside a dropdown panel | a tree-aware dropdown | falcon-angular-tree |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`):
1. **Inputs** — `[nodes]` (`FalconTreeNode[]`: `id`, `label`, optional `icon` / `children` / `disabled` / `badge`); `selectionMode` (`none`/`single`/`multiple`); `[selectedValue]` (CVA) or `[selectedValues]`; `[expandedIds]`; `density`; `searchQuery`; `defaultExpandLevel`; `groupLabel`; `helperText`; `errorMessage`; `ariaLabel`.
2. **Per-node data** — `node.badge` (`{ text, variant }`) for a status pill; `node.icon` for a leading glyph; `node.disabled` to lock a node.
3. **Templates / slots** — **NONE.** The row structure is fixed (rails + chevron + check + initials + icon + label + badge). Per-row custom decoration (a status pill beyond `badge`, an action button) is a documented GAP — see step 7.
4. **Variants** — `selectionMode` + `density` (`comfortable`/`compact`) + render path (`useTailwind` → Light/Shadow).
5. **Token override** — host marker class + re-declare `--falcon-tree-*` (14 categories) for node colours, rails, chevron, indent step, badges.
6. **Programmatic API** — `selectAndScrollTo(id)`, `expandTo(id)`, `expandAll()`, `collapseAll()`, `focusNode(id)` via `@ViewChild`.
7. **Upgrade** — per-row template / per-row action slot, virtualization, lazy children loader, drag-and-drop, cascading multi-select are all documented gaps (`GAPS_AND_UPGRADES.md` items 2-7). If the design needs any of them, raise the shared-component upgrade — do NOT hand-roll a parallel tree (that is exactly the `falcon-tree-panel` duplication the project is trying to retire).
8. **Wrapper** — for an org-hierarchy panel with 3-dot menus today, use the existing `<falcon-tree-panel>` rather than wrapping this component.

## Anti-patterns
- Hand-rolling a recursive tree because `falcon-angular-tree` lacks a per-row action slot — that is how the parallel `<falcon-tree-panel>` came to exist. Raise the gap instead.
- Nested `<ul>`/`<details>` or PrimeNG `<p-tree>` in app code — banned (`feedback_falcon_ui_library_only_no_native`).
- Passing a **cyclic** forest — infinite recursion in `flattenTree`.
- Mutating `nodes` in place — pass a fresh array or change detection misses it.
- Expecting children to lazy-load on expand — there is no `loadChildren` hook; the whole forest must be in memory.
- Adding a custom hover-path effect — the component already drives ancestor-path highlight via a `Set<id>`.
- Using `multiple` mode and expecting a parent-click to select descendants — selection is self-only; no cascade.

## Verification
🟡 CODE-DERIVED from `[CODE]` falcon-tree-tw.tsx + the 6 UI-layer dossiers. Cross-library map `[INFERRED]` from standard library APIs. The falcon-tree vs falcon-tree-table vs falcon-tree-panel split ✅ VERIFIED against `OVERVIEW.md` + `DECISION.md`.
