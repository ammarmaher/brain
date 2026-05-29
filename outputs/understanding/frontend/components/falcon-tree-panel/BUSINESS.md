# falcon-tree-panel — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.
> Source-prefix every fact: `[CODE]` `[BRAIN-OUT]` `[VAULT]` `[BRAIN-SK]` `[PRD]` `[INFERRED]`.

## Business purpose
`[BRAIN-OUT]` It is how the operator **navigates and acts on the organization hierarchy**. The org hierarchy is the spine of the Falcon platform — a tenant's accounts, clients and sub-nodes nested as a tree. This panel is the left-rail control that lets the operator (a) see the whole shape of the tenant, (b) pick the node they want to work on, and (c) launch the per-node business actions (Add Client, Add Node, Edit Node, Add User) directly from a 3-dot menu without leaving the tree. `[CODE]` `falcon-tree-panel.component.ts:1-5` — the panel "owns aside chrome + root row + recursive iteration + root/node 3-dot popup menus" — i.e. it is the operational entry point to the hierarchy, not a passive viewer.

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Falcon root vs client root render differently | `[CODE]` `:118` `mode: 'falcon' \| 'client'` | `falcon` mode renders the Falcon brand SVG + "Falcon" label regardless of the node's own name/image; `client` mode renders the client's `imageUrl` (initials fallback) + `name`. The root row's identity reflects WHO owns the tenant. |
| Per-node actions are role/type-scoped | `[CODE]` `:48` `FalconTreeAction.visible?: (node) => boolean` | A consumer hides "Delete" on the root, or "Add Node" on a leaf, via the `visible(node)` predicate — encoding which business actions are legal per node type. |
| `[MEMORY]` Add Client / Add Node / Edit Node / Add User launch from the tree | `[BRAIN-OUT]` Brain SK flow playbooks `organization-hierarchy/Add Client`, `flows/Add Node.md`, `Edit Node.md`, `Add User.md` | The declarative `rootActions` / `nodeActions` arrays ARE the launch points for those four wizard flows. |
| A node is selected before its detail tabs load | `[CODE]` `:135-137` `select` output + `:173-176` `isRootSelected` | Selecting a tree row is the business act of "focus this account" — the org-hierarchy page's tabs (Information / Settings / Comm Channels / Apps) all key off the selected node id. |

## Business constraints baked in
- `[CODE]` `:131-133` **`showSubNodes` = "clients-only" business mode** — when false the tree shows only depth-0 rows (Falcon root + its direct clients, no sub-nodes) and forces expansion empty. This is a deliberate business view: "show me clients, not the org internals".
- `[CODE]` `:285-291` **`highlighted` action paints the row solid teal** — `FalconTreeAction.highlighted` is the visual cue for the *primary* / most-emphasized action in a menu (e.g. the main "Add" verb), turning the menu row teal-700. It is an emphasis statement, not a destructive-action marker.
- `[CODE]` `:298` **One action stream, root + node disambiguated by `nodeId`** — `action` emits `{ id, nodeId }` with `nodeId === null` for root-menu items. The consumer's dispatcher (`[MEMORY]` `onTreeAction`) routes the same `id` differently depending on whether it came from the root or a node — the business meaning of "Add User" differs by context.
- `[CODE]` `:128`,`:124` **`showRootActions` / `showActions`** — a consumer can offer per-row actions but suppress the root menu (or vice versa) when the business context grants action rights at one level only.

## Business flows using this component
| Flow | Page | Role of the component in the flow |
|---|---|---|
| Browse organization hierarchy | org-hierarchy (admin + mgmt console) | The left-rail navigator — selecting a node drives the detail tabs. |
| Add Client | org-hierarchy | Root 3-dot → "Add Client" launches the 5-step Add Client wizard. |
| Add Node | org-hierarchy | Node 3-dot → "Add Node" launches the Add Node flow on the targeted node. |
| Edit Node | org-hierarchy | Node 3-dot → "Edit Node" opens Edit Node for the targeted node. |
| Add User | org-hierarchy | Root OR node 3-dot → "Add User" launches the Add User wizard. |

## Business gotchas
- `[CODE]` `:118`,`:159-161` In `falcon` mode the root row **ignores `root.imageUrl` and `root.name`** — it always shows "Falcon". A builder expecting the root node's own name to appear must use `mode="client"`. This is intentional: the Falcon platform brands its own root.
- `[CODE]` `:98-101` The panel **does not own selection or expansion state** — it emits `(select)` / `(toggle)`; the consumer's state slice owns `selectedId` + `expandedIds`. The tree is a controlled component — a builder who expects it to "remember" what is open is wrong.
- `[CODE]` `:314-377` The **chevron-overlap auto-scroll** silently scrolls the rail right when a deep node's chevron would collide with the sticky 3-dot button. This is invisible to the consumer and can surprise a user who left the panel scrolled elsewhere (`GAPS_AND_UPGRADES.md` item 8).
- `[CODE]` `:48` `visible(node)` only **hides** an action — there is no `disabled(node)`. An action that should be present-but-greyed has no built-in path (`GAPS_AND_UPGRADES.md` item 5).

## Verification
🟡 CODE-DERIVED from `falcon-tree-panel.component.ts` + `models/models.ts` (full source read) + the 6 existing dossier files. The org-hierarchy left rail is a confirmed-working feature per `[MEMORY]` org-hierarchy entries — ✅ for the browse + select + action-launch flows. The four wizard flows are `[BRAIN-OUT]`-anchored to the Brain SK playbooks.
