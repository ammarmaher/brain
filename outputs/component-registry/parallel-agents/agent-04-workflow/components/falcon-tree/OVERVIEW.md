# falcon-angular-tree — OVERVIEW

## Purpose
Recursive expandable tree component with hover-path highlighting, rail SVG connectors, focus mode, programmatic select+scrollIntoView, exact 18 px indentation rail, and chevron expand/collapse transitions. Mirrors V0.2 React reference `NodeRow + ClientsTree` from `admin/hierarchy.jsx:7-279` + `admin/styles.css:436-628` — the "Tier 7 locked-spec" component.

## Business / UI use case
- Organization hierarchy on admin-console and management-console org-hierarchy pages (NOTE: actual consumer uses `<falcon-tree-panel>` which composes `<falcon-tree>` internally — see `falcon-tree-panel/`).
- Category trees in settings.
- Any recursive selection UI with single / multiple / none selection.

## Locked spec contract (7 points)
1. Hover-path highlighting — `Set<id>` of ancestors highlighted.
2. Child indicator symbol — chevron + per-row leading marker (initials chip).
3. Rail SVG pseudo-elements — vertical + horizontal connectors with elbow segments.
4. Focus mode — visible on light + dark, distinct from hover.
5. Programmatic select — `scrollIntoView({block:'nearest'})` via `selectAndScrollTo()`.
6. Indentation rail — exact 18 px gutter widths.
7. Expand/collapse animation — match React reference timing.

## When to use it / when NOT to use it
- USE for recursive hierarchical selection (org chart, category tree, file explorer).
- USE the bare `<falcon-angular-tree>` when you want to assemble a custom panel chrome around it.
- DO NOT use for flat lists — use `<falcon-angular-table>` instead.
- DO NOT use for static menu navigation — use `<falcon-angular-menu>` instead.
- For the org-hierarchy use case, prefer `<falcon-tree-panel>` (already composes `<falcon-tree>` + root row + per-row + root 3-dot menus + chevron-overlap auto-scroll).

## Status
- **ACTIVE / PREFERRED** for tree-shaped selection. Used directly inside `<falcon-tree-panel>`.

## Selectors / Tags
- **Angular selector:** `falcon-angular-tree`
- **Stencil Shadow tag:** `<falcon-tree>` (default when `useTailwind=false`)
- **Stencil Light tag:** `<falcon-tree-tw>` (default when `useTailwind=true`)

## Source paths
| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tree/falcon-tree.component.ts` |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-tree/falcon-tree.component.html` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-tree/falcon-tree.tsx` |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-tree/falcon-tree.css` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-tree-tw/falcon-tree-tw.tsx` |
| Types | `libs/falcon-ui-core/src/components/falcon-tree/falcon-tree.types.ts` |
| Utils | `libs/falcon-ui-core/src/components/falcon-tree/falcon-tree.utils.ts` |
| Tokens | `libs/falcon-ui-tokens/src/components/tree.tokens.css` |

## Known consumers
- `<falcon-tree-panel>` (legacy bespoke) — internally renders `<falcon-tree-node>` (which is its own internal recursive component, NOT `<falcon-tree>` directly; see `falcon-tree-panel/`). NOTE: `<falcon-tree-panel>` does NOT consume `<falcon-tree>` — they are two PARALLEL implementations. This is a duplication concern flagged in GAPS.
- `apps/host-shell/src/app/playground/playground.page.html` — playground showcase of `<falcon-angular-tree>` directly.

## Related components
- `<falcon-tree-panel>` — bespoke shell with chrome + recursive tree + per-row 3-dot menus. **PARALLEL implementation, not a wrapper around `<falcon-tree>`.** Migration target: have `<falcon-tree-panel>` internally compose `<falcon-angular-tree>`.
- `<falcon-angular-tree-table>` — tabular variant with columns.
- `<falcon-organization-hierarchy-tree-tw>` — bespoke Light-DOM org-hierarchy tree (Agent 2 territory).

## Ownership / Responsibility
- Falcon UI core (Stencil + Angular wrapper).
- Token contract: `tree.tokens.css` (14 categories).
- 7 locked-spec points are non-negotiable visual contracts (do not refactor without updating the React reference).
