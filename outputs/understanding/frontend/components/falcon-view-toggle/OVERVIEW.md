# falcon-view-toggle — OVERVIEW

## Component purpose

`[CODE]` falcon-view-toggle.component.ts:1-15 — A generic 2+-option **segmented-pill toggle** (the iOS-style "switch between N mutually-exclusive views" control). Renders a `role="tablist"` strip of `role="tab"` buttons inside a tinted rounded container; the active option gets a white (or dark-teal) raised pill, the rest are flat. Two-way value binding via `model()` — caller uses `[(value)]`.

This is a **single-render pure-Angular shared-ui component** (NOT a dual-render Stencil component): there is no Shadow DOM `<falcon-view-toggle>`, no `<falcon-view-toggle-tw>` twin, no Tailwind-classes helper, and no `view-toggle.tokens.css`. All visual styling is inline Tailwind utility classes on the template. Say so loudly: the falcon-input dual-render layers (Shadow `.tsx` / `-tw` twin / token file) **do not exist** for this component.

## Business / UI use case

`[CODE]` org-hierarchy-page-menu.component.html (admin :131-134 / mgmt :124) — the **only** live use is the org-hierarchy "structure view" switcher: it sits in the tab-actions slot of `<falcon-angular-tabs>` and flips the hierarchy tab between **List (`list-bullets`)** and **Tree / Org-chart (`org-chart`)** layouts. The two built-in inline SVG icons (`list-bullets`, `org-chart`) were baked specifically for this List/Tree use case.

It is deliberately generic, though: `[CODE]` falcon-view-toggle.component.ts:1-6 + index.ts:1-5 — promoted from admin-console into `libs/falcon/shared-ui` in **Wave 19 (2026-05-14, Ammar 12th iteration)** so any consumer can render a Grid/List, List/Tree, Day/Week/Month-style toggle.

## When to use it / when NOT to use it

**Use it for:**
- A small set (2-4) of mutually-exclusive **view modes** that switch the layout of the same data (List ⇄ Tree, Grid ⇄ List, Cards ⇄ Table).
- Any place you want the canonical Falcon segmented-pill look with a translated label per option + an optional leading icon.

**Do NOT use it for:**
- A form value bound to a model the user *submits* → it is a view-state switcher, not a form control; it has **no CVA / ngModel** (`[CODE]` no `NG_VALUE_ACCESSOR` in the .ts). Use `<falcon-angular-radio>` / `<falcon-angular-tabs>` mode `'radio-cards'` for form selection.
- Tabbed *content panels* with their own bodies → use `<falcon-angular-tabs>` (which this component is actually nested *inside* at the live site).
- Boolean on/off → use `<falcon-angular-switch>`.
- More than ~4 options or options that scroll/overflow → it has no overflow handling.

## Status

`[CODE]` index.ts:1-3 + shared-ui/index.ts:198-203 — **ACTIVE / SHARED.** Promoted Wave 19; replaced the consumer-side `FalconOrgViewToggleComponent` (`[CODE]` org-hierarchy-page-menu.component.ts:63-64 "FalconOrgViewToggleComponent superseded by the library's <falcon-view-toggle>"). Not deprecated. Low adoption (2 render sites) but it is the canonical shared pattern for new segmented-view toggles.

## Replaces

- `[CODE]` org-hierarchy-page-menu.component.ts:63-64 — the legacy consumer-side `FalconOrgViewToggleComponent` (old `<falcon-org-view-toggle>`, seen in `[VAULT]` docs/archive/WAVE-A-OLD-STRUCTURE.md:264).

## Source file paths

> Single-render Angular shared-ui component — only three source files exist. There is **no** `.css`, no Stencil `.tsx`, no `-tw` twin, no tailwind-classes helper, and no token file (contrast with falcon-input's 11-file layer table).

| Layer | Path |
|---|---|
| Angular component TS | `libs/falcon/src/shared-ui/lib/components/falcon-view-toggle/falcon-view-toggle.component.ts` (46 ln) |
| Angular component HTML | `libs/falcon/src/shared-ui/lib/components/falcon-view-toggle/falcon-view-toggle.component.html` (39 ln) |
| Barrel | `libs/falcon/src/shared-ui/lib/components/falcon-view-toggle/index.ts` (exports class + `FalconViewToggleOption` + `FalconViewToggleSvg`) |
| Library re-export | `libs/falcon/src/shared-ui/index.ts:198-203` (`export * from './lib/components/falcon-view-toggle'`) |
| Component CSS | **(none — all styling is inline Tailwind in the .html)** |
| Stencil Shadow / `-tw` twin / tailwind helper / token file | **(none — not a dual-render component)** |
| Spec / tests | **(none found)** — GAP (see GAPS_AND_UPGRADES G1). |

## Selectors / tags

| Layer | Tag / selector |
|---|---|
| Angular selector | `falcon-view-toggle` `[CODE]` falcon-view-toggle.component.ts:33 |
| Stencil tags | none |

> `[CODE]` Host class is `falcon-view-toggle inline-flex` (component.ts:37) — the host itself is an inline-flex box; the bordered container is the inner `<div role="tablist">`.

## Known consumers (grep verified 2026-06-03)

`[CODE]` `<falcon-view-toggle[\s>]` across `apps/` = **2 render sites** (1 admin-console + 1 management-console), both the org-hierarchy "structure view" switcher. **0 render consumers under `libs/falcon/`** (only the component's own source). TS-import sites: `org-hierarchy-page-menu.component.ts` in both apps (imports `FalconViewToggleComponent`).

- `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html:131`
- `apps/management-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html:124`

See `USAGE.md` Consumer Sweep for the enumerated list.

## Related components

- **Nested inside:** `<falcon-angular-tabs>` (`[CODE]` org-hierarchy-page-menu.component.html:122-136 — projected via `<ng-template falconTabActions="hierarchy">`). The toggle lives in the tab bar's actions region.
- **Sibling shared-ui promotions (same Wave 19 batch):** `<falcon-node-details-section>`, `<falcon-status-chip>`, `<falcon-angular-empty-data>`, `<falcon-org-node-header>` (this batch's sibling) — all "promoted from consumer code into libs/falcon" in the same wave.
- **Functional cousins:** `<falcon-angular-tabs>` (mode `'navigation'`), `<falcon-angular-radio>` (radio-group), `<falcon-angular-switch>` (boolean).

## Ownership / responsibility

`libs/falcon/src/shared-ui` (the Falcon shared-ui Angular library — pure Angular, NOT the cross-framework `falcon-ui-core`). Owned by the Falcon FE team. No token contract — styling is inline Tailwind tokens.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B25 sweep). Source-file table confirmed on disk (3 files, no `.css`/Stencil/token layers). Consumer sweep `<falcon-view-toggle[\s>]` → 2 app render sites (admin + mgmt org-hierarchy), 0 in `libs/falcon`. NEW dossier — created from scratch this pass.
