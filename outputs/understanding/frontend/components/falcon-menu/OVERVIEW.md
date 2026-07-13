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
| Angular wrapper TS | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-menu/falcon-menu.component.ts` (340 ln; imperative prop-sync + Top-Layer promotion) |
| Angular template | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-menu/falcon-menu.component.html` (28 ln; tag-switcher + `slot=trigger`) |
| Angular barrel | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-menu/index.ts` |
| Stencil Shadow source | `libs/falcon-ui-core/src/components/falcon-menu/falcon-menu.tsx` (472 ln) |
| Stencil Shadow CSS | `libs/falcon-ui-core/src/components/falcon-menu/falcon-menu.css` (194 ln; token-only) |
| Stencil Shadow types | `libs/falcon-ui-core/src/components/falcon-menu/falcon-menu.types.ts` |
| Stencil Light source | `libs/falcon-ui-core/src/components/falcon-menu-tw/falcon-menu-tw.tsx` (430 ln) |
| Tailwind helper | `libs/falcon-ui-core/src/tailwind/menu-tailwind-classes.ts` (consumed only by the `-tw` twin) |
| Token file | `libs/falcon-ui-tokens/src/components/menu.tokens.css` (147 ln; `:where()`-scoped + 2 action-menu override blocks; gate-12 compliant) |
| Spec/e2e | **None** — no `*menu*.spec.ts` / `.e2e.ts` on any layer (`[CODE]` listing 2026-06-03). |

> `[CODE]` There is **no `falcon-menu.utils.ts`** — all index/navigability helpers live inline in `falcon-menu.tsx` / `falcon-menu-tw.tsx` (duplicated, not shared — unlike accordion/tabs which factor a `.utils.ts`).

## Selectors / tags
- Angular: `<falcon-angular-menu>`
- Stencil Shadow: `<falcon-menu>`
- Stencil Light: `<falcon-menu-tw>` (default — `useTailwind=true`)

## Known consumers (grep verified 2026-06-03)
`[CODE]` `<falcon-angular-menu` host usage = **2 render sites** (BOTH in `libs/`):
- `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html:149` — the SHARED tree action-menu host (`#actionMenu`, opened via `showAt()` on per-node kebabs). The org-hierarchy menus in BOTH consoles consume `falcon-tree-panel`, so this is the real production path.
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-data-table/falcon-data-table.component.html:51` — the data-table per-row action menu (`wires `falcon-row-action-trigger` → `<falcon-angular-menu>.showAt(...)`, see `.component.ts:1186`).

`[CODE]` Apps do not render `<falcon-angular-menu>` directly — `apps/{admin,management}-console/.../org-hierarchy-page/components/stencil-prop-patches.ts` only mentions it in a comment. The menu is reached transitively through `falcon-tree-panel` + `falcon-data-table`. The `FalconMenuItem[]` arrays are built by those composers.

See `USAGE.md` Consumer Sweep for the full enumerated list.

## Related components
- `falcon-angular-data-table` — uses menu via external-anchor for per-row actions.
- `falcon-angular-tree` / `falcon-tree-panel` — same pattern for tree row menus.
- `falcon-angular-button` — common as the menu trigger (slot=trigger).
- `falcon-angular-icon` — typical icon for menu items.

## Ownership / responsibility
Owned by Falcon UI Core. The external-anchor `showAt()` method is the cleanest pattern in the library for shared overlay positioning. Note: unlike dropdown/multi-select/date-picker, the menu does NOT body-portal its panel — the panel is rendered INLINE inside the Stencil tag and positioned via `position: fixed`, then (feature-detected) promoted into the browser Top Layer via the native popover API + `FalconStackingService` (`[CODE]` falcon-menu.component.ts:69-83,281-324). This is the gate-12-relevant distinction (see TOKENS / INTEGRATION).

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B13 sweep). Source-file table re-confirmed; `-tw` Light twin verified (430 ln, registered in `define-falcon-tw-component.ts:27`). Consumer model corrected: **2 render sites** (`falcon-tree-panel` + `falcon-data-table`, both in `libs/`); apps reach the menu transitively (prior dossier's app paths were stale `organization-hierarchy/` indirect references). No `falcon-menu.utils.ts` (helpers inline-duplicated).
