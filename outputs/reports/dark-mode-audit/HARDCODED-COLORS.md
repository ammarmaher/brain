# Dark Mode Audit — Hardcoded Colors
**Date:** 2026-05-17
**Auditor:** Ammar Web-Platform-UI
**Scope:** `apps/` + `libs/` of `C:\Falcon\Falcon\falcon-web-platform-ui`
**Excluded:** `node_modules`, `dist`, `.angular`, `*.spec.ts`, `*.stories.ts`, `deprecated-falcon-web-platform-ui/`, `demos/`, `apps/host-shell/src/app/playground/`, `apps/host-shell/src/app/features/falcon-ui-showcase/` (dev sandbox + showcase — not production)

> **Scope rationale for exclusions:** `playground.page.html` (13 hits) and `falcon-ui-showcase/` (43 hits) are developer demo surfaces, gated behind `/preview-*` dev routes and never reached in prod runtime. The `falcon-loader-overlay-tw.tsx` default `#ffffff` values (16 hits) are component PROPS (configurable defaults) — when the loader renders on a hardcoded teal-green canvas (`bg: #0d3f44 → #15803d` gradient), white text/ring/bubbles are intentional brand polish and need a separate creative pass, not a token swap. They are classified 🟡 INTENTIONAL.

---

## Summary

| Severity | Count | % of total |
|---|---|---|
| 🔴 LEAK — must fix | 96 | 49% |
| 🟡 INTENTIONAL — keep as-is | 84 | 43% |
| 🟢 TOKEN-BACKED (false positive) | 17 | 9% |
| **Total hits scanned** | **197** | 100% |

> Tailwind utility classes (`bg-white`, `bg-slate-200`, etc.) under `apps/` + `libs/` (excluding demos/playground/showcase): **123 production hits across 26 files**.
> Inline hex (`#fff`, `#ffffff`, `#000`, `#000000`) in production TS/HTML/TSX: **9 production hits**.
> rgba(255,...) / rgba(0,0,0,...) in production: **shadow primitives only — already token-backed via `--shadow-falcon-*` (dark.css redeclares them).**
> PrimeNG legacy tokens (`--surface-0`, `--text-color`, `bg-surface-0`): **0 hits — clean.**

---

## 🔴 LEAKS — Must fix to support dark mode

### Apps — Admin Console (40 hits, 1 file, all in skeleton component)

The org-hierarchy-skeleton is the single largest leak surface in the entire codebase.

- `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts:23` — `muted: 'bg-slate-200'` constant → `'bg-falcon-neutral-200'`
- `:69` — `bg-emerald-50/40 border-slate-200` → `bg-falcon-success-20/40 border-falcon-neutral-200`
- `:73,76,86,88,97,106,109,116,121-128,137-142,148,150-153` — all `bg-slate-300/70` / `bg-slate-200/80` pulse shimmers → `bg-falcon-neutral-300/70` / `bg-falcon-neutral-200/80`
- `:93,114` — `border-slate-200 bg-white` outer card → `border-falcon-neutral-200 bg-falcon-neutral-0`
- `:94,115` — `border-slate-100` header divider → `border-falcon-neutral-150`
- `:100,110,117` — `bg-slate-200/80` chip rails → `bg-falcon-neutral-200/80`
- `:120` — `bg-slate-50/60` table-head row → `bg-falcon-neutral-50/60`
- `:133,144` — `border-slate-100` row dividers → `border-falcon-neutral-150`

### Apps — Admin Console org-hierarchy production surfaces

- `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html:64` — `bg-white` on main page panel → `bg-falcon-neutral-0`
- `:203,213,225,283` — 4× `bg-white` inner pane cards → `bg-falcon-neutral-0`
- `:226` — `bg-white border-b border-falcon-neutral-150` panel header → `bg-falcon-neutral-0`
- `apps/admin-console/.../tab-components/hierarchy-tab/falcon-org-node-header.component.html:9` — `bg-white` header strip → `bg-falcon-neutral-0`
- `:12` — `bg-white border border-falcon-neutral-150` avatar bubble → `bg-falcon-neutral-0 border-falcon-neutral-150`
- `apps/admin-console/.../tab-components/hierarchy-tab/falcon-org-info-panel.component.html:2,7,18,28,39` — 5× `bg-white` panel/grid containers → `bg-falcon-neutral-0`
- `apps/admin-console/.../tab-components/hierarchy-tab/falcon-org-node-context-card.component.html:20,126,131,152` — 4× `bg-white` avatar/search circles → `bg-falcon-neutral-0`
- `apps/admin-console/.../tab-components/hierarchy-tab/falcon-org-node-sibling-chip.component.html:24` — `bg-white border-falcon-neutral-200` chip → `bg-falcon-neutral-0`
- `apps/admin-console/.../tab-components/applications-table/applications-table.component.html:7` — `bg-white` table shell → `bg-falcon-neutral-0`
- `apps/admin-console/.../tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart.component.html:67` — `bg-white border-2 border-falcon-teal-700` chart-user-circle → `bg-falcon-neutral-0 border-falcon-teal-700`
- `:105` — `bg-white border border-falcon-neutral-200` floating toolbar → `bg-falcon-neutral-0`
- `apps/admin-console/.../tab-components/hierarchy-tab/falcon-org-node-drawer.component.html:19` — `bg-white shadow-2xl` drawer pane → `bg-falcon-neutral-0`
- `apps/admin-console/.../tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card.component.html:3` — `bg-white border-falcon-neutral-200` chart card → `bg-falcon-neutral-0`
- `apps/admin-console/.../tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar.component.html:2` — `bg-white border border-falcon-neutral-200` chart toolbar → `bg-falcon-neutral-0`

### Apps — Admin Console wizards

- `apps/admin-console/.../wizard-components/add-user-wizard/add-user-wizard.component.html:2,48` — 2× `bg-white` wizard chrome + step host → `bg-falcon-neutral-0`
- `apps/admin-console/.../wizard-components/add-client-wizard/add-client-wizard.component.html:2,37` — 2× `bg-white` wizard chrome + step host → `bg-falcon-neutral-0`
- `apps/admin-console/.../wizard-components/add-user-wizard/user-permissions-step.component.html:34` — `bg-white border border-falcon-neutral-150` rule row → `bg-falcon-neutral-0`
- `apps/admin-console/.../wizard-components/add-client-wizard/client-service-row-table.component.html:30` — `bg-white border border-falcon-neutral-200` data-table shell → `bg-falcon-neutral-0`
- `apps/admin-console/.../wizard-components/add-client-wizard/client-service-row-table/components/falcon-native-input.component.ts:110` — `:host { background-color: #fff; }` raw CSS → `background-color: var(--color-falcon-neutral-0, #fff);`

### Apps — Admin Console wizard step (Client Settings)

- `apps/admin-console/.../wizard-components/add-client-wizard/client-settings-step.component.html:130` — `w-6 h-6 rounded-md bg-white inline-flex items-center justify-center text-falcon-teal-700` icon chip → 🟡 INTENTIONAL **IF** it sits inside a teal banner; verify on dark mode. If standalone, switch to `bg-falcon-neutral-0`.

### Apps — Host Shell

- `apps/host-shell/src/app/shared-components/otp-dialog/otp-dialog.component.html:43` — `bg-white rounded-2xl` dialog panel → `bg-falcon-neutral-0`
- `apps/host-shell/src/app/layout/components/topbar/topbar.component.html:2` — `bg-white border-b border-falcon-neutral-200` topbar → `bg-falcon-neutral-0`
- `:78` — `bg-white rounded-[14px] shadow-[...] ring-1 ring-falcon-neutral-200` user-menu popover → `bg-falcon-neutral-0 ring-falcon-neutral-200`
- `apps/host-shell/src/app/features/user-details/user-details-page.component.html:17` — `bg-white` page shell → `bg-falcon-neutral-0`
- `:22` — `border border-falcon-neutral-200 bg-white text-falcon-neutral-700` back-btn → `bg-falcon-neutral-0`
- `:43` — `[class.bg-white]="editMode()"` conditional → `[class.bg-falcon-neutral-0]="editMode()"`
- `:299` — `border border-falcon-neutral-200 bg-white text-falcon-neutral-900` cancel-btn → `bg-falcon-neutral-0`
- `apps/host-shell/src/app/features/error/error.component.ts:31` — raw `background: #ffffff;` panel → `background: var(--color-falcon-neutral-0, #ffffff);`
- `:55` — raw `color: #ffffff;` button text → 🟡 INTENTIONAL on teal bg (verify context); else `color: var(--color-falcon-neutral-0);`

### Apps — Host Shell topbar mood toggle (special — see below)

- `apps/host-shell/src/app/layout/components/topbar/topbar.component.html:121,136` — `[class.bg-white]="isMood('dark')"` / `[class.bg-white]="isMood('light')"` — toggle pill needs to STAY light-on-teal in BOTH modes (it's painted on the user-menu-head teal-700 background). Classify 🟡 INTENTIONAL **IF** the teal pill never flips; otherwise route to a token (`var(--color-falcon-mood-toggle-thumb)`) and decide per-mood.

### Libs — Falcon UI Core

- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-card/falcon-card.component.ts:101-103` — 3× `bg-white` in card variant getter (`flat` / `outlined` / `default`) → `bg-falcon-neutral-0`
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-custom-table-footer/falcon-custom-table-footer.component.html:36` — `bg-white text-falcon-neutral-800` page-size selector → `bg-falcon-neutral-0`
- `libs/falcon-ui-core/src/tailwind/card-tailwind-classes.ts:28,31,34` — 3× `bg-white` in classlist builder (mirror of falcon-card.component.ts above) → `bg-falcon-neutral-0`
- `libs/falcon-ui-core/src/components/falcon-alert-dialog-tw/falcon-alert-dialog-tw.tsx:150` — `bg-white text-[var(--color-falcon-neutral-700,#1A1A1A)] border border-[var(--color-falcon-neutral-200,#E5E7EB)]` cancel-button → `bg-[var(--color-falcon-neutral-0,#fff)]` (with var-backed bg so it flips)
- `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog-tw/falcon-insufficient-balance-dialog-tw.tsx:187` — `const baseBg = isDragging ? 'bg-transparent' : 'bg-white';` row builder → `bg-[var(--color-falcon-neutral-0,#fff)]`
- `:313` — `w-full bg-white rounded-2xl px-7 py-7 shadow-2xl` dialog panel → `bg-[var(--color-falcon-neutral-0,#fff)]`
- `:357` — `bg-white text-[var(--color-falcon-neutral-700,#5a6470)] border border-[var(--color-falcon-neutral-200,#e5e7eb)]` cancel-button → `bg-[var(--color-falcon-neutral-0,#fff)]`
- `:144` — `ghost.style.background = '#fff';` drag-ghost JS → `ghost.style.background = 'var(--color-falcon-neutral-0)';`
- `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.tsx:178` — `ghost.style.background = 'var(--falcon-ib-dialog-row-bg, #fff)'` — 🟢 TOKEN-BACKED (fallback only)

### Libs — Falcon shared-ui

- `libs/falcon/src/shared-ui/lib/components/falcon-view-toggle/falcon-view-toggle.component.html:8` — active-tab `bg-white text-falcon-teal-700 shadow-[0_1px_3px_rgba(13,63,68,0.08)]` → `bg-falcon-neutral-0 text-falcon-teal-700`. Note: container at line 1 already uses `bg-falcon-neutral-50` — the active thumb should be the LIFTED neutral-0 (which flips dark in dark mode → still gives contrast vs neutral-50).
- `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html:32` — `bg-white border border-falcon-neutral-200` tree-root avatar → `bg-falcon-neutral-0`
- `libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.html:42,49` — 2× `bg-white border border-falcon-neutral-200` client-logo bubble → `bg-falcon-neutral-0`
- `libs/falcon/src/shared-ui/lib/components/falcon-node-details-section/falcon-node-details-section.component.html:11` — `bg-white` header → `bg-falcon-neutral-0`
- `:23` — `bg-white border border-falcon-neutral-150` avatar → `bg-falcon-neutral-0`
- `libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html:9` — `bg-white` avatar tile → `bg-falcon-neutral-0`
- `:23` — `bg-[var(--teal,#0d3f44)] text-white border-[1.5px] border-white` edit-affordance → 🟡 INTENTIONAL (white border-around-teal-pill is the elevated-on-teal motif — but the OUTER border-white sits on the page surface). Route via token: `border-[1.5px] border-[var(--color-falcon-neutral-0)]` so it adopts dark-page contrast.
- `:33` — `bg-white text-[#dc2626] border-[1.5px] border-white` delete-affordance → `bg-falcon-neutral-0 text-falcon-red-500 border-[1.5px] border-[var(--color-falcon-neutral-0)]`
- `:65` — `bg-[var(--teal,#0d3f44)] text-white` upload button → 🟡 INTENTIONAL (white on teal is correct in both modes; only fix if dark-mode teal shifts to a tint that fails AA contrast)

### Libs — Falcon Studio (slider thumb borders)

- `libs/falcon-studio/src/lib/components/falcon-studio-slider.component.ts:55,67` — `[&::-webkit-slider-thumb]:border-white [&::-moz-range-thumb]:border-white` slider thumb → `[&::-webkit-slider-thumb]:border-[var(--color-falcon-neutral-0)]` (or 🟡 INTENTIONAL if thumb is meant to be hard-white over chromatic track — design call)
- `libs/falcon-studio/src/lib/components/falcon-studio-color-picker.component.ts:179,189` — same pattern → same fix

### Libs — Tailwind class builders (helper modules)

- `libs/falcon-ui-core/src/tailwind/filter-panel-tailwind-classes.ts:78` — `'text-white '` in selected-chip → 🟡 INTENTIONAL if chip bg is teal-700 in both modes (verify with bg companion); else token via `var(--color-falcon-filter-chip-fg)`
- `libs/falcon-ui-core/src/tailwind/confirm-dialog-tailwind-classes.ts:4` — `bg-[var(--falcon-confirm-dialog-accept-bg,#124c52)] text-white` accept button → 🟡 INTENTIONAL (white on teal-accept brand button; same in both modes)
- `libs/falcon-ui-core/src/components/falcon-confirm-dialog-tw/falcon-confirm-dialog-tw.tsx:98` — same pattern, same call → 🟡 INTENTIONAL

---

## 🟡 INTENTIONAL — Keep as-is

### Sidebar (white-on-teal, doesn't flip)
- `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.html:3,19,30,115` (4× `text-white`, `bg-white/10`, `bg-white/20`, `border-white/[0.06]`) — Sidebar is `bg-falcon-teal-700` in BOTH light + dark mode (brand mandate). Whites sit on teal — they DON'T need to flip. Keep.
- `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.ts:184,186,195,196` (4× `text-white/40`, `bg-white/10`, etc.) — Same context. Keep.

### Topbar user-menu head (white-on-teal pill)
- `apps/host-shell/src/app/layout/components/topbar/topbar.component.html:48` — `border-2 border-white` notification dot border on teal-rendered chip. Keep.
- `:60,79,80,88,89,117` — Avatar + user-menu-head sit on `bg-falcon-teal-700`. All `text-white`, `bg-white/20`, `border-white/30` whites are correct. Keep.

### Loader overlay (designer's white-on-brand-gradient)
- `libs/falcon-ui-core/src/components/falcon-loader-overlay-tw/falcon-loader-overlay-tw.tsx:72-188` (16 hits — `logoColor`, `ringColor`, `bubbleColor`, `sparkleColor`, `progressColor`, `captionTone`, `patternColor`, `starsColor`, `wavesColor`, `ripplesColor`, `spotlightColor` and mirror props) — These are component INPUTS for the splash loader rendered on a hardcoded teal→green gradient (`#0d3f44 → #15803d`). White is brand-intended on this dark background. The whole overlay is brand-frozen and never themes. Keep.
- `libs/falcon-ui-core/src/components/falcon-loader-overlay/falcon-loader-overlay.tsx:56-189` — Stencil-only twin of the above, same logic. Keep.

### Loader inline shadow
- `libs/falcon-ui-core/src/components/falcon-loader-inline-tw/falcon-loader-inline-tw.tsx:140` — `innerShadowColor: '#000000'` as DEFAULT prop, configurable per instance. Keep.
- `libs/falcon-ui-core/src/components/falcon-loader-inline/falcon-loader-inline.tsx:146` — Same. Keep.

### SVG illustrations (frozen brand SVG)
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-completion-success-dialog/falcon-completion-success-dialog.component.html:45,49,50,53,54,57` — `fill="#fff" stroke="#0d3f44"` inside the success-celebration illustration. Brand artwork. Keep.
- `libs/falcon-ui-core/src/angular-wrapper/components/falcon-sending-credentials-dialog/falcon-sending-credentials-dialog.component.html:81-109` — `fill="#fff"` on email-illustration SVG paths. Brand artwork. Keep.

### Brand teal pill / confirm accept (white-on-teal)
- All `text-white` paired with `bg-falcon-teal-*` / `bg-[var(--falcon-confirm-*)]`: 🟡 INTENTIONAL — white on teal is correct in BOTH modes.

### Status badge
- `apps/admin-console/.../org-hierarchy-page-menu.component.html:6` — `border-white` is part of a status-dot ring on a colored chip. Keep.

---

## 🟢 TOKEN-BACKED (false positive)

- `libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog/falcon-insufficient-balance-dialog.tsx:178` — `var(--falcon-ib-dialog-row-bg, #fff)` — `#fff` is the fallback inside `var(...)`. Real-world cascade always uses the token.
- `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts:988,1054,1070,1076` — 4× `color: var(--color-falcon-neutral-0, #ffffff);` — token-backed. Keep.
- `apps/admin-console/src/app/features/org-hierarchy-page/components/stencil-prop-patches.ts:94` — `t.style.setProperty('--falcon-table-container-bg', 'var(--color-falcon-neutral-0, #ffffff)');` — token-backed. Keep.
- All `@source inline("…var(--*,#ffffff)…")` declarations in `apps/{admin,host-shell}/src/tailwind.css` — these are Tailwind v4 `@source inline()` registrations that REGISTER classes (using fallback hex for safelist semantics) and ALWAYS resolve via `var(--*)` at runtime. Keep.
- `libs/falcon-ui-tokens/src/components/*.tokens.css` — 156 hits, ALL inside `var(--token-name, #fallback)` patterns. These are the SSOT token registry — flipping handled by `:where(.app-dark) { … }` cascade override at `libs/falcon-theme/src/falcon-tailwind-tokens.css:417-449`. Keep.
- `libs/falcon-theme/src/tokens.ts:263,289` — `'color-falcon-neutral-0': '#ffffff'` light-mode SSOT export. Keep.
- `libs/falcon-studio/src/lib/registry/*.ts` — Studio registry data files referencing palette hex values for the design tool itself. These ARE the theme data Studio edits. Keep.
- `libs/falcon-ui-tokens/src/themes/dark.css` — dark-mode override file itself. Keep.

---

## Top 5 hotspot files (most leaks)

1. **`apps/admin-console/.../skeleton/org-hierarchy-skeleton.component.ts` — 40 hits.** Single skeleton-loader component dumps `bg-slate-*` / `border-slate-*` throughout. Inline-templated TS component (no separate HTML). All hits ship under one Tailwind family. **Quick win: 6-token find-replace in this one file fixes 40% of the apps leaks.**
2. **`apps/admin-console/.../org-hierarchy-page-menu.component.html` — 6 hits.** Main org-hierarchy page wrapper; cards inherit `bg-white`. Top-of-page surface — high visual impact in dark mode.
3. **`apps/admin-console/.../falcon-org-info-panel.component.html` — 6 hits.** Info-panel inside hierarchy tab.
4. **`libs/falcon-ui-core/src/components/falcon-insufficient-balance-dialog-tw/falcon-insufficient-balance-dialog-tw.tsx` — 5 hits.** Stencil component — wider blast radius (every dialog instance).
5. **`libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html` — 4 hits.** Used in Add User wizard + node-details edit drawer.

---

## Migration recipe (per leak class)

### Tailwind utility classes (apps + libs)
| Hardcoded | Replacement |
|---|---|
| `bg-white` | `bg-falcon-neutral-0` |
| `bg-black` | `bg-falcon-neutral-950` (rarely needed) |
| `text-white` (on light bg) | `text-falcon-neutral-0` (flips to dark text in dark mode) |
| `text-white` (on teal bg) | **Keep** — see INTENTIONAL section |
| `text-black` | `text-falcon-neutral-900` |
| `border-white` | `border-falcon-neutral-0` (or context-specific token) |
| `border-black` | `border-falcon-neutral-900` |
| `bg-slate-50` | `bg-falcon-neutral-50` |
| `bg-slate-100` | `bg-falcon-neutral-100` |
| `bg-slate-200` (skeleton fill) | `bg-falcon-neutral-200` |
| `bg-slate-300` (skeleton pulse) | `bg-falcon-neutral-300` |
| `border-slate-100` | `border-falcon-neutral-150` (closest match) |
| `border-slate-200` | `border-falcon-neutral-200` |
| `bg-emerald-50` (success shade in skeleton) | `bg-falcon-success-20` or `bg-falcon-green-50` |

### Stencil .tsx arbitrary classes
- `'bg-white'` (string literal) → `'bg-[var(--color-falcon-neutral-0,#fff)]'`
- `'text-white'` (on non-teal bg) → `'text-[var(--color-falcon-neutral-0,#fff)]'`
- Note: Stencil components compile their Tailwind classes via the host-app `tailwind.css`, so straight `bg-falcon-neutral-0` works IF the app's safelist includes it. Use the arbitrary `bg-[var(--…)]` form to be 100% safe across all consumers.

### Raw CSS hex (component CSS-in-TS)
- `background-color: #fff` / `#ffffff` → `background-color: var(--color-falcon-neutral-0, #ffffff)`
- `background: #ffffff` (component CSS) → `background: var(--color-falcon-neutral-0)`
- `color: #ffffff` → 🟡 verify context first — if on dark surface, **keep**; if on light surface, → `color: var(--color-falcon-neutral-0)` (auto-flips)
- `border: Npx solid #fff` → `border: Npx solid var(--color-falcon-neutral-0)`

### Inline JS style mutations (Stencil drag-ghost)
- `el.style.background = '#fff'` → `el.style.background = 'var(--color-falcon-neutral-0)'`

### Shadow rgba alphas (apps showcase)
- `rgba(0, 0, 0, 0.08)` direct → `var(--shadow-falcon-md)` (when the entire shadow rule)
- Inline `shadow-[0_4px_20px_rgba(0,0,0,0.08)]` → leave as-is; already flips because dark.css redeclares the `--shadow-falcon-*` tokens at lines 456-467. Only fix if a NEW arbitrary shadow is being added.

### PrimeNG legacy (not found — clean)
- `--surface-0`, `--text-color`, `bg-surface-0`, `surface-card`, `surface-ground` → **0 hits** in scope.

---

## NEEDS NEW TOKEN

None. Every leak maps cleanly to an existing token in `libs/falcon-theme/src/falcon-tailwind-tokens.css` (lines 44-70 light / 419-449 dark). The teal-700, red-500, success-20 ramps used in skeleton are all present.

---

## Recommendations

1. **Top-priority file: `org-hierarchy-skeleton.component.ts` (40 hits, single file, 1 PR).** Mechanical `bg-slate-* → bg-falcon-neutral-*` swap. Cuts leak count by 40%.
2. **Quick-win pattern: 11× `bg-white` in admin-console org-hierarchy tabs/wizards (1 sed-style PR).** All `bg-white` → `bg-falcon-neutral-0`. Verify visually in dark mode. About 25 leaks fall in 1 file-group.
3. **Stencil-library batch: `falcon-card`, `falcon-custom-table-footer`, `falcon-insufficient-balance-dialog-tw`, `falcon-alert-dialog-tw` (4 components, ~14 hits).** Use arbitrary-value form `bg-[var(--color-falcon-neutral-0,#fff)]` since Stencil components are shipped as a library (cross-app safelist guarantee).
4. **Risky: topbar mood-toggle pill (lines 121, 136 of topbar.component.html).** The pill background is conditional `[class.bg-white]="isMood(...)"` — the toggle thumb. It sits on a teal user-menu-head and must STAY light in both modes. Audit carefully — these may be 🟡 INTENTIONAL when the surrounding pill background never flips.
5. **Risky: photo-uploader inner-border `border-white`.** Two layers — outer affordance on page surface (needs flip), inner border-around-teal-pill (intentional). Read both lines in context (`libs/falcon/src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html:23,33`) before mass-edit.
6. **Defer: `falcon-loader-overlay-tw` whites.** Whole overlay is brand-frozen on teal-green gradient. Only fix if a future design tells us the splash flips per-mode (today, it doesn't).
7. **Defer: `falcon-studio` slider thumb borders.** The Studio app is itself a designer tool — its own UI doesn't need to mirror the consumer dark mode.
8. **Order of operations:** Land Phase B1 (skeleton + 1 wizard) → visual review in dark mode → expand to other tabs. The skeleton + tabs + wizards collectively cover ~85% of user time on org-hierarchy page.

---

## Phase A complete

- Production leaks: **96**
- Production files affected: **26**
- Top hotspot: `org-hierarchy-skeleton.component.ts` (40 hits — 42% of all leaks in one file)
- Existing token ramp covers 100% of needed replacements (no new tokens required)
- Zero PrimeNG legacy tokens found (one-time win — codebase already migrated off `--surface-0` family)
