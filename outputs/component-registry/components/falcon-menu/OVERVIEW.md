# falcon-menu — OVERVIEW

## Component purpose
Popup menu list (PrimeNG `p-menu` parity carve-out). Two modes:
- `popup=true` (default) — inline trigger button + absolutely-positioned panel.
- `popup=false` — inline panel rendered in place (no trigger; always open).

Plus an **external-anchor mode** via `showAt(el)` method — the panel positions as a viewport-fixed overlay relative to a supplied DOM element. This is the PrimeNG `Menu.toggle(event)` parity for shared per-row menus (data table row actions, tree node menus).

Full keyboard model: ArrowDown/Up move active index, Home/End jump, Enter/Space invoke, Escape close, Tab close + traverse, mouse-enter sets active.

## Business / UI use case
- Page-header kebab menus.
- Per-row action menus in data tables (via external-anchor `showAt`).
- Tree node action menus (via `falcon-tree-panel` integration).
- Form context menus.

## When to use it
- Action lists (Edit / Delete / Archive / Move).
- Anywhere PrimeNG `p-menu` was used previously.
- Per-row / per-cell context actions.

## When NOT to use it
- For navigation (use routerLink-driven nav).
- For dropdown form-control selects (use `<falcon-angular-dropdown>`).
- For tooltips (use `<falcon-angular-tooltip>`).
- For sub-menus / nested menus (NOT supported in the current carve-out).

## Active / preferred / deprecated / legacy status
**ACTIVE — preferred.** New in Revamp v3.1. Wave 4-5.

## Replaces
- PrimeNG `<p-menu>` (Wave PR-8).

## Paths

| Artifact | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-menu/falcon-menu.component.ts` |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-menu/falcon-menu.component.html` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-menu/falcon-menu.tsx` |
| Stencil Shadow types | `libs/falcon-ui-core/src/components/falcon-menu/falcon-menu.types.ts` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-menu-tw/falcon-menu-tw.tsx` |
| Token file | `libs/falcon-ui-tokens/src/components/menu.tokens.css` |

## Selectors / tags
- Angular: `<falcon-angular-menu>`
- Stencil Shadow: `<falcon-menu>`
- Stencil Light: `<falcon-menu-tw>`

## Known consumers
- `apps/admin-console/src/app/features/organization-hierarchy/components/organization-hierarchy-menu.component.ts` — uses `FalconMenuItem` type indirectly through `FalconTreePanelComponent`.
- `apps/management-console/src/app/features/organization-hierarchy-page/components/organization-hierarchy-page-menu.component.html` — twin pattern.

Direct `<falcon-angular-menu>` usage matches: limited (registry says "new in Revamp v3.1" — recent addition). Likely composed inside `falcon-tree-panel` and per-row data table menus.

## Related components
- `falcon-angular-data-table` — uses menu via external-anchor for per-row actions.
- `falcon-angular-tree` / `falcon-tree-panel` — same pattern for tree row menus.
- `falcon-angular-button` — common as the menu trigger (slot=trigger).
- `falcon-angular-icon` — typical icon for menu items.

## Ownership / responsibility
Owned by Falcon UI Core. The external-anchor `showAt()` method is the cleanest pattern in the library for shared overlay positioning.
