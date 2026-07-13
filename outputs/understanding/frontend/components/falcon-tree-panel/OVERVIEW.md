# falcon-tree-panel — OVERVIEW

> **REFRESHED 2026-06-03 (B24 deep-dive sweep).** Re-confirmed against live source. Corrections this pass: (1) the GAPS file's "legacy `.scss` files violate the rule" items were stale — **no `.scss`/`.css` files exist** (OVERVIEW + TOKENS already said this; GAPS now agrees); (2) the panel now uses **ONE shared `<falcon-angular-menu #actionMenu>`** (not the old two `#rootMenu`/`#nodeMenu`); internal helpers are `activeMenuItems` / `menuContext` / `hoveredIndexPath` / `scrollIfChevronOverlapsRowAction` (not the prior `rootMenuItems`/`nodeMenuItems`/`targetNodeId`); (3) `FalconTreeHoverPath` is `readonly number[]` (an ordered sibling-index path), NOT a `ReadonlySet<string>` — API.md corrected. Hand-maintained companion: `falcon-wiki/00-MOCs/Org-Hierarchy-Tree-Component-Knowledge.md`.
>
> **Single-render Angular shared-ui component** in `libs/falcon/src/shared-ui/` — NO Stencil Shadow/`-tw` twin, NO `libs/falcon-ui-tokens` component file. Fully Tailwind utilities + Falcon theme tokens. (It DOES compose the dual-render `<falcon-angular-menu>` for its popup — that one is a proper Stencil-skeleton + Angular-wrapper pair.)

## Purpose
Fully self-contained tree panel for the Organization Hierarchy pages. Owns:
- `<aside>` chrome (border, radius, header band, section label)
- root row visual — `mode='falcon'` brand SVG + "Falcon" label, OR `mode='client'` `root.imageUrl` (initials-chip fallback) + `root.name`
- recursive tree iteration via its OWN internal `<falcon-tree-node>` component
- per-row + root 3-dot popup menus (declarative `FalconTreeAction[]` config)
- hover-path mirror (lit ancestor trail) via `TreeHoverPathDirective`
- chevron-overlap auto-scroll guard (8 px)

Consumer wires `[root]` `[rootActions]` `[nodeActions]` and receives a single `(action)` stream for all 3-dot clicks (`nodeId === null` = root menu).

## Status
- **Bespoke Angular component, ACTIVE in production.** Standalone, signal `input()`s, `ChangeDetectionStrategy.OnPush`, `ViewEncapsulation.None`. NOT a Stencil component.
- **Fully Tailwind** — there are **no `.scss` files**. The earlier bespoke SCSS was converted to Tailwind utilities + Falcon theme tokens, applied directly in the templates.
- A separate `<falcon-angular-tree>` exists as a bare-tree alternative — independent code path; the two are not coupled.

## Architecture — two layers
- **Skeleton:** `<falcon-tree-panel>` (this component) — pure presentational, no service injection. Consumer owns `expandedIds` / `selectedId`.
- **App wrapper:** `<app-organization-hierarchy-tree>` (host-shell `shared-components/organization-hierarchy-tree/`) — owns PES gating + tree fetch + lazy children + user-fetch trigger. This wrapper is the ONLY direct consumer of the skeleton.

## Business / UI use case
- Org-hierarchy left rail on admin-console + management-console.
- Any single-tree-per-page pattern with persistent chrome + per-row/root action menus + hover-path semantics.

## When to use / when NOT to
- USE for the org-hierarchy left rail and similar "tree with per-row 3-dot menus + branded root row".
- USE when you want a declarative action API (`FalconTreeAction[]` with i18n labels, icons, optional per-node `visible` predicate).
- DO NOT consume the skeleton directly from an app — go through the `<app-organization-hierarchy-tree>` wrapper.
- DO NOT consume `<falcon-tree-node>` directly — it is private to the panel.

## Source paths
| Layer | Path (under `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/`) |
|---|---|
| Panel component | `falcon-tree-panel.component.ts` |
| Panel template | `falcon-tree-panel.component.html` |
| Internal node component | `falcon-tree-node/falcon-tree-node.component.ts` |
| Node template | `falcon-tree-node/falcon-tree-node.component.html` |
| Models | `models/models.ts` |
| Directives | `directives/directives.ts` (`TreeHoverPathDirective`, `ScrollableTreeListDirective`) |
| Barrel | `index.ts` |

No SCSS files exist — all styling is template-level Tailwind.

## Known consumers (grep verified 2026-06-03)
- `[CODE]` `<falcon-tree-panel[\s>]` across the repo = **10 occurrences / 4 files** — but only ONE is a live element consumer: `apps/host-shell/src/app/shared-components/organization-hierarchy-tree/organization-hierarchy-tree.component.{html (3 occ), ts (1)}`. The other two hits are a spec (`apps/host-shell/tests/tree-rail-highlight.spec.ts`) and an archive doc (`docs/archive/WAVE-A-OLD-STRUCTURE.md`).
- The wrapper `<app-organization-hierarchy-tree>` is consumed by admin-console + management-console via their `org-hierarchy-page-menu` components (they never touch the skeleton directly).
- `[CODE]` The internal `<falcon-tree-node>` is private to the panel (recursive child); the pure trail-math `computeTreeRailHighlight()` (`utils/rail-highlight.ts`) is unit-tested by `apps/host-shell/tests/tree-rail-highlight.spec.ts`.

## Related components
- `<falcon-angular-menu>` — composed internally for the 3-dot popup overlay.
- `<falcon-angular-tree>` — separate bare-tree component (parallel, independent).
- `<falcon-organization-hierarchy-tree-tw>` — separate Stencil org-hierarchy tree (`.tsx`, different code path).

## Ownership / responsibility
- Owned by `libs/falcon/src/shared-ui/`.
- Owns: recursive iteration via `<falcon-tree-node>`; declarative 3-dot menu config + dispatch; hover-path mirror; chevron-overlap auto-scroll.
- `ViewEncapsulation.None` — needed so the menu `rootClass` Tailwind utilities and the host-level scrollbar variants reach the externally-rendered popup + descendants.
- Token contract: no per-component token file; consumes Falcon theme tokens via Tailwind utilities, including the tree-layout spacing tokens `--spacing-row-h / -gap / -pad-y / -pad-x`, `--spacing-rail`, and `--spacing-row-action-inset` (action-column inline-end inset, added 2026-05-18). The popup styling is driven by `<falcon-angular-menu>`'s `rootClass` arbitrary-utility token overrides (`[--falcon-menu-*]`) declared inline in the template + the shared `.falcon-tree-action-menu` block in `menu.tokens.css`.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B24). Source re-read in full: `falcon-tree-panel.component.ts` (381 ln), `.html` (157 ln), `falcon-tree-node/falcon-tree-node.component.ts` (127 ln), `models/models.ts`, `directives/directives.ts`, `utils/rail-highlight.ts`. Single-render confirmed (no `.scss`/`.css`/token file/Stencil twin). Consumer sweep re-run (`<falcon-tree-panel[\s>]` → 10 occ / 4 files; 1 live element consumer + 1 spec + 1 archive doc). Single-shared-menu (`#actionMenu` + `menuContext` + `activeMenuItems`) confirmed; `FalconTreeHoverPath = readonly number[]` confirmed (`models.ts:19`).
