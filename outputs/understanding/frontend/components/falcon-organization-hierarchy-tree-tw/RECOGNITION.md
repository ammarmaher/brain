# falcon-organization-hierarchy-tree-tw — Recognition Layer

> Cross-cutting layer. Purpose: given an external design / screenshot / React or Angular snippet, identify `<falcon-organization-hierarchy-tree-tw>` as the component to use, and how to compose it to parity.

## Visual fingerprint
`[CODE]` A bordered, rounded **panel card** (14px radius, often a faint-green `#F3F8F5` surface). At the top a **pinned root header**: an icon / logo bubble + the root name + an always-visible ⋮ menu button. Optionally a **section label** beneath it. Then a **recursive list** of child rows: each row has indent **rails** (a vertical through-line + an elbow connector drawn as a CSS `linear-gradient` + `::before`/`::after`), a rotating **chevron**, a per-node **brand bubble** (logo image, Falcon-icon, or initials), the node name (clamped), and a **sticky ⋮ menu button** at the inline-end that reveals on hover. Clicking any ⋮ opens a single **floating (position:fixed) context menu**; a `highlight` item has a teal background. Selected + hovered-path rows are tinted.

## Cross-library equivalents
| Library | Their component | Parity notes |
|---|---|---|
| MUI | `<TreeView>` / `<RichTreeView>` + `<TreeItem>` + a `<Menu>` | MUI TreeView lacks branded root + per-row action button — composed |
| PrimeNG | `<p-tree>` + `<p-card>` shell + `[contextMenu]` | PrimeNG Tree's menu is right-click; this is a ⋮ button |
| Ant Design | `<Tree>` + `<Dropdown>` per node + `<Card>` | Ant Tree + per-node Dropdown ≈ this; rails + brand bubble are custom |
| Bootstrap | nested `<ul>` + collapse + `.dropdown` | fully hand-rolled |
| shadcn / Radix | recursive Collapsible + `<DropdownMenu>` | shadcn has no Tree primitive |
| plain HTML | nested `<ul><li><details>` | always replace with a Falcon component |

## Use THIS vs siblings
| If the design shows… | Use | Not |
|---|---|---|
| an org-hierarchy clients-tree rail in a **new Stencil / cross-framework** context | `<falcon-organization-hierarchy-tree-tw>` (raw Stencil tag) — but see anti-patterns | — |
| the **production** org-hierarchy rail in an Angular app today | `<falcon-tree-panel>` via host-shell `<app-organization-hierarchy-tree>` | the `-tw` Stencil tag (no Angular wrapper, no production adoption) |
| a generic expandable tree, no per-row actions | `<falcon-angular-tree>` | this component |
| nested data with **columns** | `<falcon-angular-tree-table>` | this component |
| a flat selectable list | `<falcon-angular-data-table>` | this component |
| just the floating action menu | `<falcon-angular-menu>` | this component |

## Composition recipe to reach parity
Customization order (`feedback_falcon_custom_library_mandatory`): inputs → templates → slots → variants → token override → shared upgrade → wrapper → GAP.
1. **Inputs (`@Prop`)** — `tree` (required `FalconOrgHierarchyNode` root), `selectedId`, `expandedIds`, `rootActions` / `nodeActions` (`FalconOrgHierarchyAction[]`), `sectionLabel`, `showExpand`, `showMoreActions`, `defaultExpandLevel`, `ariaLabel`. **Object props must be set via `el.prop = …`**, never `[attr.x]`.
2. **Node visuals** — there is no template surface; the per-node bubble is driven entirely by `node.iconUrl` / `node.icon` / `node.initials` / `node.brand`. `brand` resolves to `client-logo bank-{x}` CSS classes (consumer CSS must define them).
3. **Events** — wire `(falcon-select)`, `(falcon-toggle)` (lazy-load hook — fetch + reassign `tree`), `(falcon-action)` (read `actionId` + `isRoot`).
4. **Methods** — use `selectAndScrollTo(id)`, `expandAll()`, `collapseAll()`, `closeContextMenu()` for imperative flows.
5. **Slots** — NONE. No Stencil slots — node rendering is fully token + tree driven.
6. **Variants** — none today (`no [size] / [density]`). Sizing is fixed per the React V0.2 reference.
7. **Token override** — full `organization-hierarchy.tokens.css` surface (~12 categories: PANEL / ROOT HEADER / ROW / CHEVRON / ICON-INITIALS-LOGO / NAME LABEL / MENU BUTTON / ROOT MENU BUTTON / CTX MENU / RAILS / SECTION LABEL / SCROLLBAR). Override per-instance via a host class — e.g. `--falcon-org-hierarchy-panel-bg`, `--falcon-org-hierarchy-root-bg-selected`. Rails read shared `--falcon-tree-rail-*` tokens.
8. **Shared upgrade / GAP** — a Shadow-DOM companion (FOHT-01), an Angular wrapper `<falcon-angular-organization-hierarchy-tree>` (FOHT-02), and a typed brand registry to replace the `client-logo bank-{x}` CSS dependency (FOHT-03) are all documented gaps. Until FOHT-02 lands, write a thin per-project Angular wrapper — raise the shared-component gap, do not let the boilerplate spread.

## Anti-patterns
- Binding object props (`tree`, `rootActions`, `nodeActions`, `expandedIds`) as `[attr.x]` — Angular stringifies them and the tree renders empty.
- Reaching for this component for a **new production Angular org-hierarchy panel** — today's shipping path is `<falcon-tree-panel>` (it has the Angular layer + production adoption); this `-tw` component has no Angular wrapper and no verified production use.
- Expecting Shadow-DOM style isolation — there is none; global CSS leaks both ways.
- Using it for a generic (non-org-hierarchy) tree — the chrome is opinionated and locked to the React V0.2 reference.
- Forgetting to `await defineFalconTwComponent('falcon-organization-hierarchy-tree-tw')` — the tag will not upgrade.
- Ignoring `(falcon-toggle)` on a `hasChildren=true` node — the chevron opens to nothing without the lazy-load fetch.
