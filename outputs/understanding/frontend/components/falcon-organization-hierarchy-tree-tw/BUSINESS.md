# falcon-organization-hierarchy-tree-tw — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[PRD]` `[INFERRED]`.

## Business purpose
`[BRAIN-OUT]` It is the Stencil-core rendering of the **organization-hierarchy clients tree** — the left-rail panel through which an operator browses a tenant's accounts and acts on individual nodes. In business terms it serves the same need as `<falcon-tree-panel>`: it is the navigator + action launcher for the org hierarchy, showing a pinned branded root, a recursive list of client / sub-node rows with brand bubbles, and a per-row + per-root ⋮ context menu. `[CODE]` `falcon-organization-hierarchy-tree-tw.tsx:1-22` — it mirrors the React reference `admin/hierarchy.jsx` (`NodeRow + ClientsTree`); it is the locked-spec visual contract for the org-hierarchy panel.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Org hierarchy is a single tenant tree with a pinned root | `[CODE]` `tsx:9-12` "two stacked sections — ROOT HEADER pinned + RECURSIVE LIST" | The root account is always visible at the top; children scroll beneath it. |
| Per-node + per-root actions are declarative | `[CODE]` `API.md` `rootActions` / `nodeActions` (`FalconOrgHierarchyAction[]`) | The business actions for the root and for each node are passed as data, not hand-coded — `highlight` flags the emphasized action. |
| Brand identity per node | `[CODE]` `API.md` `node.brand` → `client-logo bank-{x}` | Each client node carries a recognizable brand bubble (Rajhi / SNB / BUPA / Aramco) so the operator identifies accounts visually. |
| Lazy hierarchy loading | `[CODE]` `API.md` `node.hasChildren` + `falcon-toggle` event | A node can declare it *has* children before they are fetched; expanding it is the trigger to load that subtree — the hierarchy is paged by depth. |
| `[INFERRED]` Same Add Client / Add Node / Edit Node / Add User launch points as `<falcon-tree-panel>` | `[BRAIN-OUT]` Brain SK org-hierarchy playbooks | The `falcon-action` event with `isRoot` discriminator routes the same action ids to root-scoped vs node-scoped wizard flows. |

## Business constraints baked in
- `[CODE]` `API.md` **`defaultExpandLevel`** — the tree auto-expands to a configured depth on first render, so the operator lands on a useful default view of the tenant rather than a fully collapsed root.
- `[CODE]` `API.md` **`showExpand` / `showMoreActions`** — a consumer can present a read-only hierarchy (no chevrons) or an action-free hierarchy when the business context grants no node actions.
- `[CODE]` `API.md` `FalconOrgHierarchyAction.highlight` — `[VAULT]` mirrors React `.ctx-menu-item.highlighted` — paints a context-menu item with a teal background to mark the **primary** business action.
- `[CODE]` `API.md` `node.disabled` — a node can be rendered non-actionable (`aria-disabled`) when the business state forbids selecting/acting on it.
- `[CODE]` `tsx:1-22` **single floating context menu** — only one ⋮ menu is open at a time; it re-anchors per click. Operating on the hierarchy is one-node-at-a-time by design.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Browse organization hierarchy | org-hierarchy (intended — see gotcha) | Left-rail navigator; `falcon-select` focuses a node. |
| Add Client / Add Node / Edit Node / Add User | org-hierarchy | Root / node ⋮ menu items launch the respective wizard flows (`falcon-action` with `isRoot`). |
| Showcase / playground | host-shell | `[CODE]` `USAGE.md` Wave 7 sweep — the ONLY verified live consumers today are the playground + showcase. |

## Business gotchas
- `[CODE]` `GAPS_AND_UPGRADES.md` + `OVERVIEW.md` — **no verified production adoption.** Grep across the admin-console + management-console org-hierarchy pages found NO usage of `<falcon-organization-hierarchy-tree-tw>`. The live org-hierarchy panels in production currently use `<falcon-tree-panel>` (via the host-shell `<app-organization-hierarchy-tree>` wrapper) — see that component's `INTEGRATION_VALIDATION.md`. This component is a **parallel implementation**, not the shipping one. A builder must not assume changing it affects the live org-hierarchy page.
- `[CODE]` `tsx:13-16` In the root header the **brand SVG / icon is opinionated** per the React V0.2 reference; the root row's identity follows the locked spec, not arbitrary node data.
- `[CODE]` `API.md` `falcon-toggle` carries `{ id, expanded }` — it is the lazy-load hook; a consumer that ignores it on a `hasChildren=true` node will show a chevron that opens to nothing.
- `[CODE]` `API.md` — object props (`tree`, `rootActions`, `nodeActions`, `expandedIds`) must be set via element-property reflection — binding them as `[attr.x]` stringifies them and the tree silently renders empty.

## Verification
🟡 CODE-DERIVED from `falcon-organization-hierarchy-tree-tw.tsx` (header lines 1-90 read) + the 6 existing dossier files. **No production adoption** is ✅ VERIFIED from the `GAPS_AND_UPGRADES.md` + `USAGE.md` Wave 7 grep — the live org-hierarchy panel uses `<falcon-tree-panel>`. The Add Client / Add Node / Edit Node / Add User launch mapping is `[INFERRED]` by analogy to `<falcon-tree-panel>` + the Brain SK playbooks, since this component is not the production consumer.
