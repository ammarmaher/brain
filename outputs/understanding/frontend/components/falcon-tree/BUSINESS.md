# falcon-angular-tree — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration → `INTEGRATION_VALIDATION.md`.

## Business purpose
`[BRAIN-OUT]` `falcon-angular-tree` is how a Falcon operator *navigates and commits a choice within a hierarchy* — picking one node (or several) out of a parent-child structure. In business terms it answers "which node of the organization / which category / which branch am I acting on?" It is the recursive-selection primitive: the org-chart picker, the category tree, the file-explorer-style selector. It renders the *shape of a hierarchy* and lets the user select within it; it does not render per-row data columns (that is `falcon-tree-table`) and it does not own the org-hierarchy page chrome (that is `falcon-tree-panel` / `falcon-organization-hierarchy-tree-tw`).

## PRD / business rules touched
| Rule | Source | How this component enforces / surfaces it |
|---|---|---|
| Organization hierarchy is a strict parent-child node tree | `[BRAIN-OUT]` understanding/pages/organization-hierarchy | The tree is the visual model of that hierarchy — depth, ancestry, expand/collapse all mirror the node structure the backend returns. |
| One active node drives the page context | `[INFERRED]` from `[MEMORY]` SessionProvider holds the selected org node | Single-select mode (`selectionMode='single'`, the default) commits exactly one node; selecting it is the act of *setting the working context* for the rest of the page. |
| A disabled node is not a valid selection target | `[CODE]` falcon-tree-tw.tsx:243-258 (`node.disabled` short-circuits `applySingleSelection`) | `node.disabled=true` is a business statement — "this node exists but cannot be chosen" (e.g. a node the user lacks rights to, or a structurally-locked root). The component refuses the selection silently. |

## Business constraints baked in
- `[CODE]` falcon-tree-tw.tsx:253 — **`selectionMode='none'`** makes the tree a *read-only hierarchy display* — expand/collapse only, no commit. Use it when the business intent is "show the structure, don't let them pick."
- `[CODE]` falcon-tree-tw.tsx:286 — clicking the chevron NEVER selects the row; expand and select are separate business actions. A builder must not conflate "I want to see the children" with "I choose this node."
- `[OVERVIEW]` 7-point locked-spec — the hover-path highlight, rail connectors, indentation rail (18px), focus mode and expand/collapse timing are *non-negotiable visual contracts* against the React V0.2 reference. They exist so the hierarchy reads unambiguously; do not refactor them away.
- `[CODE]` falcon-tree-tw.tsx:570-577 — `node.icon` AND the auto-derived initials chip both render. The initials chip is always present (no `showInitials` flag) — see `GAPS_AND_UPGRADES.md` item 8/9.

## Business flows using this component
| Flow | Page | Role of the component |
|---|---|---|
| Category selection | settings / category trees | Recursive single-select of a category node |
| Recursive node selection (generic) | any feature needing an org-chart picker | Pick one node to scope an action |
| Org-hierarchy navigation | organization-hierarchy | **NOT directly** — the org-hierarchy pages use `<falcon-tree-panel>` (a parallel implementation with per-row 3-dot menus). `falcon-angular-tree` is the substrate-grade tree; `falcon-tree-panel` reinvented it because the tree has no per-row action slot. |

## Business gotchas
- The org-hierarchy page does **not** consume this component — it uses the bespoke `<falcon-tree-panel>` because that flow needs per-row 3-dot action menus, which `falcon-angular-tree` does not expose (`GAPS_AND_UPGRADES.md` items 2-3). A builder asked to "edit the org-hierarchy tree" must go to `falcon-tree-panel`, not here.
- **Multi-select is self-only.** `[CODE]` falcon-tree-tw.tsx:246 — selecting a parent in `multiple` mode toggles *only that parent*, never its descendants. If the business needs "select this branch and everything under it," that cascade logic is the consumer's job (no `cascading` mode exists).
- **No lazy children loader** — the tree expects the *entire* forest in memory. For a hierarchy too large to fetch whole, this component is the wrong choice today (no virtualization either — `GAPS_AND_UPGRADES.md` items 4-5).
- `[CODE]` falcon-tree-tw.tsx:586 — search auto-expands every matched branch so matches are reachable; an empty result renders the literal `"No matches"`.

## Verification
🟡 CODE-DERIVED 2026-06-03 (B09) from `[CODE]` falcon-tree-tw.tsx + the 6 UI-layer dossiers. The "org-hierarchy uses falcon-tree-panel not falcon-tree" relationship ✅ RE-VERIFIED against `falcon-tree-panel.component.html:1` (renders `<falcon-tree-node>`). **No production consumer of `<falcon-angular-tree>` at all** (B09 sweep — the prior playground consumer was removed) — business flows are 🟡 inferred from intended use.
