# falcon-tree-panel (LEGACY BESPOKE) — OVERVIEW

## Purpose
Fully self-contained tree panel for the organization-hierarchy pages. Owns:
- aside chrome (border, radius, padding, header)
- root row visual (Falcon brand mode OR client/imageUrl mode with initials fallback)
- recursive tree iteration (renders its OWN internal `<falcon-tree-node>` recursive component — NOT `<falcon-angular-tree>`)
- per-row and root 3-dot popup menus (declarative `FalconTreeAction[]` config)
- hover-path mirror (propagated to each node for `.on-path` highlighting)
- chevron-overlap auto-scroll guard (scrolls the container right just enough so the chevron clears the sticky 3-dot action button)

Consumer wires `[root]` `[rootActions]` `[nodeActions]` (declarative) and receives a single `(action)` event stream for all 3-dot clicks (`nodeId === null` for root menu).

## Business / UI use case
- Org-hierarchy left rail on admin-console + management-console.
- Any single-tree-per-page pattern with persistent chrome + per-row/root action menus + hover-path semantics.

## When to use it / when NOT to use it
- USE for the org-hierarchy left rail and any similar "tree with per-row 3-dot menus + branded root row".
- USE when you want a declarative action API (`FalconTreeAction[]` with i18n labels, icons, optional per-node visibility predicate).
- DO NOT use for a generic tree without 3-dot menus — use `<falcon-angular-tree>` directly.
- DO NOT use for nested tabular data — use `<falcon-angular-tree-table>`.

## Status
- **LEGACY-BESPOKE / ACTIVE-IN-USE.** Bespoke Angular component (no Stencil core). Documented as a candidate for Stencil promotion once stable.
- **PARALLEL IMPLEMENTATION** to `<falcon-angular-tree>` — the two coexist and may drift.

## Selector / Tags
- **Selector:** `<falcon-tree-panel>` (Angular component).
- **No Stencil tag.**
- Internal recursive node component: `<falcon-tree-node>` (private to the panel; not for direct consumer use).

## Source paths
| Layer | Path |
|---|---|
| Panel component | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.ts` |
| Panel template | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html` |
| Panel SCSS | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.scss` |
| Internal node component | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.ts` |
| Node template | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.html` |
| Node SCSS | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.scss` |
| Models | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/models/models.ts` |
| Directives | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/directives/directives.ts` |
| Barrel | `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/index.ts` |

## Known consumers
- `apps/admin-console/src/app/features/organization-hierarchy/components/organization-hierarchy-menu.component.html` — the old folder.
- `apps/admin-console/src/app/features/organization-hierarchy-page/components/organization-hierarchy-page-menu.component.html:19-29` — the React-port new folder.
- `apps/management-console/src/app/features/organization-hierarchy-page/components/organization-hierarchy-page-menu.component.html` — management-console mirror.
- `apps/host-shell/src/app/playground/playground.page.html` — playground showcase.

## Related components
- `<falcon-angular-tree>` — the Falcon UI core "bare" tree. Parallel implementation; convergence target.
- `<falcon-angular-menu>` — the panel internally composes the menu for the 3-dot popup.
- `<falcon-organization-hierarchy-tree-tw>` — Agent 2 territory; Light-DOM bespoke org-hierarchy tree, different code path again.

## Ownership / Responsibility
- Owned by `libs/falcon/src/shared-ui/` legacy bespoke layer.
- Owns:
  - The recursive tree iteration via internal `<falcon-tree-node>`.
  - The declarative 3-dot menu config and dispatch.
  - The hover-path mirror via `TreeHoverPathDirective`.
  - The chevron-overlap auto-scroll behavior (8 px guard).
- Composes `FalconAngularMenuComponent` from `@falcon/ui-core/angular` for the popup overlay.
- **ViewEncapsulation.None** — needed so the per-item `styleClass` selectors reach the rendered menu overlay (rule: every CSS rule prefixed with `.falcon-tree-panel-menu`).
- Token contract: **none** — uses bespoke SCSS classes (`.client-row`, `.falcon-tree`, `.row-action`, `.chevron`, etc.) and consumes raw theme tokens in those rules.
