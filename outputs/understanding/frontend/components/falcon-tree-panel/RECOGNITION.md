# falcon-tree-panel — Recognition Layer

> Cross-cutting layer. Purpose: given an external design / screenshot / React or Angular snippet, identify `<falcon-tree-panel>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` A bordered, rounded **aside panel** that fills its column height. At the top, a pinned **root row**: in `falcon` mode a Falcon brand SVG + "Falcon" label; in `client` mode a circular brand image (or initials chip) + the client name. Optionally a **section label** (e.g. "Clients") between the root row and the body. Below it a **scrollable recursive tree**: each row has indent rails, a rotating **chevron** (hidden if `showArrows=false`), a per-node logo/initials indicator, the node name, and a **sticky 3-dot ⋮ button** pinned to the inline-end that reveals on hover. Clicking ⋮ opens a single floating popup menu of declarative actions; a `highlighted` action row is solid teal. Selected row + hover-path ancestors are tinted. The rail auto-scrolls right just enough so a deep chevron clears the sticky ⋮ button.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<TreeView>` / `<SimpleTreeView>` + `<TreeItem>` + a row `<Menu>` | MUI TreeView has no per-row action menu or branded root — composed |
| PrimeNG | `<p-tree>` with `[contextMenu]` + a panel `<p-card>` wrapper | PrimeNG Tree's context menu is right-click; this panel's is a ⋮ button |
| Ant Design | `<Tree>` + `<Dropdown>` per node + a `<Card>` shell | Ant Tree + per-node Dropdown ≈ this; root branding is custom |
| Bootstrap | nested `<ul>` + collapse + `.dropdown` per row | fully hand-rolled |
| shadcn / Radix | a recursive Collapsible list + `<DropdownMenu>` per row | shadcn has no Tree primitive — composed from Collapsible |
| plain HTML | nested `<ul><li>` + `<details>` | always replace with the Falcon component |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| an org-hierarchy left rail: branded root + recursive nodes + per-row ⋮ menus + chrome | `<falcon-tree-panel>` (today's canonical) — usually via the host-shell `<app-organization-hierarchy-tree>` wrapper | — |
| a generic expandable tree with **no** per-row action menus | `<falcon-angular-tree>` | tree-panel |
| nested data with **columns** (a tree-table) | `<falcon-angular-tree-table>` | tree-panel |
| a Light-DOM-only Stencil org tree (the parallel implementation) | `<falcon-organization-hierarchy-tree-tw>` | tree-panel |
| a flat (non-nested) selectable list | `<falcon-angular-data-table>` | tree-panel |
| just the 3-dot popup menu by itself | `<falcon-angular-menu>` | tree-panel |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP.
1. **Inputs** — `[root]` (a `FalconTreeNode<T>` tree), `[expandedIds]` + `[selectedId]` (you own this state), `[mode]` (`falcon` / `client`), `[clientsLabelKey]`, `[rootActions]` + `[nodeActions]` (declarative `FalconTreeAction[]`), `[showArrows]`, `[showActions]`, `[showRootActions]`, `[showSubNodes]`, `[trackBy]`.
2. **Declarative actions** — build `ROOT_ACTIONS` / `NODE_ACTIONS` as `const` arrays at the top of the consumer file (stable refs). Each action: `{ id, labelKey, icon?, highlighted?, visible?(node) }`. Use `visible(node)` to scope actions per node type instead of branching in the `(action)` handler.
3. **Outputs** — wire `(toggle)` + `(select)` to your state slice, `(action)` to one dispatcher that switches on `event.id` and reads `event.nodeId` (`null` = root menu), `(hoverPathChange)` if you mirror the trail.
4. **Templates / slots** — NONE. The chrome is fully baked in — there is no root-row slot or section-label slot today (`GAPS_AND_UPGRADES.md` items 10, 12).
5. **Variants** — `mode: 'falcon' | 'client'` is the only visual variant; `showArrows` / `showActions` / `showRootActions` / `showSubNodes` toggle parts off.
6. **Token override** — limited. The panel has **no token file** — visuals are bespoke Tailwind (the SCSS was deleted, `[MEMORY]` `project_falcon_tree_panel_tailwind_2026_05_18`). Per-instance restyling is constrained until convergence with `<falcon-angular-tree>`.
7. **Shared upgrade** — richer action types (`disabled(node)`, `variant`) and custom root-row / section-label slots are documented gaps — raise them, do not hand-roll.
8. **Wrapper** — in host-shell, consume via the existing `<app-organization-hierarchy-tree>` wrapper rather than the bare `<falcon-tree-panel>`; it centralizes the state wiring.

## Anti-patterns
- Consuming `<falcon-tree-node>` directly — it is a **private internal** recursive component (`USAGE.md`).
- Mutating `[root].children` in place — pass a fresh tree; the panel does not deep-watch.
- Setting `[rootActions]` while `[showActions]="false"` and expecting a menu — `showActions` overrides.
- Hand-rolling a `<table>` / nested `<ul>` org tree in page code — forbidden by the Falcon library-first rule (`feedback_falcon_ui_library_only_no_native`).
- Removing the host `h-full min-h-0` classes — breaks the panel's internal scroll (`INTEGRATION_VALIDATION.md`).
- Expecting the panel to remember selection / expansion — it is a controlled component; the consumer owns that state.
- Using `visible(node)` to fake a "disabled" action — it only hides; a greyed-but-present action has no path yet.
