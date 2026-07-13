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
| Brand identity per node | `[CODE]` `node.brand` declared in types | INTENDED to give each client node a recognizable brand bubble (Rajhi / SNB / BUPA / Aramco). **BUT `node.brand` is currently a latent/unused prop — the renderer applies `iconUrl`→`icon`→`initials` only (tsx:718-788), never a brand class.** So this business intent is NOT yet realized (GAP FOHT-08). |
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
| Add Client / Add Node / Edit Node / Add User | org-hierarchy (intended) | Root / node ⋮ menu items WOULD launch the respective wizard flows (`falcon-action` with `isRoot`) — but no live page wires this. |
| — | — | **NO live render consumer (2026-06-03).** The prior playground/showcase consumers are gone (playground route removed; showcase ref is a denylist string). |

## Business gotchas
- `[CODE]` **ZERO live render consumers (verified 2026-06-03).** Grep across the whole repo found NO `<falcon-organization-hierarchy-tree-tw>` render site. The live org-hierarchy panels use `<falcon-tree-panel>` (via the host-shell `<app-organization-hierarchy-tree>` wrapper). This component is a **parallel, un-rendered implementation** — a builder must NOT assume changing it affects the live org-hierarchy page. (Adopt-vs-delete is the open triage — see `GAPS_AND_UPGRADES.md` FOHT-05.)
- `[CODE]` `tsx:13-16` In the root header the **brand SVG / icon is opinionated** per the React V0.2 reference; the root row's identity follows the locked spec, not arbitrary node data.
- `[CODE]` `API.md` `falcon-toggle` carries `{ id, expanded }` — it is the lazy-load hook; a consumer that ignores it on a `hasChildren=true` node will show a chevron that opens to nothing.
- `[CODE]` `API.md` — object props (`tree`, `rootActions`, `nodeActions`, `expandedIds`) must be set via element-property reflection — binding them as `[attr.x]` stringifies them and the tree silently renders empty.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B21) from the full `falcon-organization-hierarchy-tree-tw.tsx` (1207 ln) + the live `<falcon-tree-panel>`/`<app-organization-hierarchy-tree>` templates. **Zero live render consumers** ✅ VERIFIED by repo-wide grep — the live org-hierarchy panel uses `<falcon-tree-panel>`. The Add Client/Node/Edit/User launch mapping is `[INFERRED]` by analogy. **Drift corrected:** `node.brand` is a latent unused prop (not class-driven); playground/showcase consumers gone.
