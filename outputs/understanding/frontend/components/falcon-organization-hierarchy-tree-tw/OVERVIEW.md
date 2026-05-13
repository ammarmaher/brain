# falcon-organization-hierarchy-tree-tw — OVERVIEW

## Purpose

Bespoke organization-hierarchy panel. Pinned root header (icon + name + ⋮ menu button) plus recursive list of expandable child nodes. Single floating context menu opens under whichever ⋮ button was clicked. Mirrors the React reference `admin/hierarchy.jsx` `NodeRow + ClientsTree` and `admin/styles.css §"CLIENTS TREE PANEL"`.

## Business / UI use case

The left-hand "clients tree" panel on every org-hierarchy page (admin + management consoles). Allows browsing a tenant's organization with brand logos / initials / icons per node and per-row + per-root action menus.

## When to use it

- Left-side panel on org-hierarchy / accounts pages.
- Trees with bespoke chrome (brand bubble + per-row menu + sticky horizontal-scroll menu button + section label between root and children).

## When NOT to use it

- Generic tree-with-data-columns → `<falcon-angular-tree-table>`.
- Simple expandable tree without per-row actions → `<falcon-angular-tree>` (Agent 4).

## Status

**ACTIVE — Light DOM only.** **NO Shadow DOM companion shipped.** This is a UNIQUE component in the Falcon library — every other dual-render component has both Shadow + Light, but this one is Light only. The Light DOM render uses `data-fohtree-render="tailwind"` attribute selectors + a companion `<style>` block inside the Stencil source for the rail SVG geometry that Tailwind utilities can't express.

## Paths

- Stencil Light: `libs/falcon-ui-core/src/components/falcon-organization-hierarchy-tree-tw/falcon-organization-hierarchy-tree-tw.tsx`
- **NO Shadow DOM tag** (`falcon-organization-hierarchy-tree` does NOT exist — verified)
- Types: `libs/falcon-ui-core/src/components/falcon-organization-hierarchy-tree-tw/falcon-organization-hierarchy-tree.types.ts`
- Tokens: `libs/falcon-ui-tokens/src/components/organization-hierarchy.tokens.css`
- **No `tailwind-classes.ts` helper** (the Tailwind utilities are inline in the `.tsx` source)
- **NO Angular wrapper** — verified by absence in `libs/falcon-ui-core/src/angular-wrapper/components/` (no `falcon-organization-hierarchy*` folder)
- Selector: `falcon-organization-hierarchy-tree-tw` (raw Stencil tag — used directly in Angular templates)

## Consumers

- `apps/host-shell/src/app/playground/playground.page.html` + `.ts` (playground)
- `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-variant-tile.component.ts` (showcase)
- Production org-hierarchy pages — searched for in `apps/admin-console/.../organization-hierarchy/` and `apps/management-console/.../organization-hierarchy-page/`. **Grep returned no matches.** Suggests current org-hierarchy pages use a different component / bespoke implementation OR the production migration hasn't landed yet.

## Related components

- `<falcon-angular-tree-table>` — recursive grid table (different visual)
- `<falcon-angular-tree>` (Agent 4) — generic tree
- `<falcon-tree-panel>` legacy (Agent 4) — older bespoke Angular tree shell

## Ownership

Stencil core only (no Angular wrapper). Owns the org-hierarchy panel chrome. Token contract drives the visual fidelity to React V0.2 reference.
