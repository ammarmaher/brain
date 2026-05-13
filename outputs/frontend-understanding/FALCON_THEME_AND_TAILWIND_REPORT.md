# Falcon Theme & Tailwind Report

*** Brain SK canonical — Agent 7 merge of Agent 5 deliverables, 2026-05-13 ***
*** Source: `C:/Falcon/Falcon/falcon-web-platform-ui` ***

## 1. SSOT files

| Surface | Path | Lines / Tokens |
|---|---|---|
| Theme SSOT (`@theme` block) | `libs/falcon-theme/src/falcon-tailwind-tokens.css` | 486 lines, **216 generated tokens** (auto-derived to `tokens.ts`) |
| Theme barrel | `libs/falcon-theme/src/index.css` | 9 lines — `@import "./falcon-tailwind-tokens.css"; @import "./styles/falcon-icons.css";` |
| Icon font | `libs/falcon-theme/src/styles/falcon-icons.css` | 380 lines, **317** `.falcon-icon-*` glyphs (vendored — replaces all `pi pi-*`) |
| Auto-generated token map | `libs/falcon-theme/src/tokens.ts` | 216 token entries (re-run via `nx run falcon-theme:generate-tokens-ts`) |
| UI-tokens barrel | `libs/falcon-ui-tokens/src/index.css` | 67 lines — chains primitives → semantic → themes → density → rtl → 46 component files |

The starting `TAILWIND_TOKEN_MAP.md` quoted "~264 tokens" — Agent 5 verified the auto-generated count is **216** (`@theme` only). The discrepancy comes from counting `@theme` + dark overrides + Studio knobs together. **Treat 216 as authoritative.**

The Wave 12A explicit removal of glass / glossify / liquid-glass tokens stuck — there are 0 glass tokens in the active SSOT.

## 2. 14 token families (in the `@theme` block)

| # | Family | Key tokens | Count |
|---|---|---|---|
| 1 | **Brand teal** | `--color-falcon-teal-{50..900}` + `tint` + `option` + `mid` + `alpha-{04,06,08,12,18}` | 15 |
| 2 | **Neutrals** | `--color-falcon-neutral-{0..950}` across 27 stops | 27 |
| 3 | **Status / accents** | green (5), red (5), amber (3), blue 500, popover-dark, orgchart-line, cyan, lilac (4), mint (2), brand-tenant palette (9) | 35+ |
| 4 | **Typography** | 5 font families (`sans` aliases `sans-latin`, `sans-ar`, `display`, `arabic`), 14-step type scale (`text-4xs..display`), 5 line-heights, 2 tracking tokens | 26+ |
| 5 | **Sizing** | control (sm/md/lg = 28/34/38), icon (xs/sm/md/lg = 12/14/16/24) + 3 semantic aliases, tile (compact/sm/md/lg), stepper-circle (sm/md/lg) | 14+ |
| 6 | **Stepper customisation** (Wave 10D) | 11 Studio knobs: `step-{shape,radius,rotate,size-1..5,label-position,label-visible,animation-enabled}` | 11 |
| 7 | **Border width** | `1`, `1.5`, `2`, `4` px | 4 |
| 8 | **Spacing** | `0`, `px`, `0.5`, `1..12`, `14`, `16`, `20`, `24` + 8 named layout tokens (sidebar, sidebar-collapsed, topbar, clients, rail, row-h/gap/pad-x/pad-y) | 25 |
| 9 | **Radii** | `none`, `2xs..3xl`, `full`, `pill`, `form`, `row` | 13 |
| 10 | **Shadows** | xs/sm/md/lg/xl + popover/menu/drawer + focus/focus-strong/danger-focus + sticky-edge + action + brand-soft | 14 |
| 11 | **Breakpoints** | sm/md/lg/xl/2xl = 576 / 768 / 992 / 1200 / 1920 px | 5 |
| 12 | **Motion** | 3 easings (in/out/inout), 3 durations (fast/base/slow), `animate-menu-in` + 7 keyframes (`menuIn`, `falcon-fade`, `falcon-scale`, `falcon-slide`, `falcon-soft-lift`, `falcon-pulse`, `falcon-loading`) | 14 |
| 13 | **Z-index** | dropdown / sticky / fixed / overlay / modal / popover / tooltip = 1000..1070 | 7 |
| 14 | **Background-image** | tree rail `on-path` + `default`; transition shorthand `--transition-falcon-row`; text-muted alias | 4 |

## 3. Component-token files (46)

Path: `libs/falcon-ui-tokens/src/components/<name>.tokens.css`

**Flow diagram:**

```
libs/falcon-theme/src/falcon-tailwind-tokens.css     SSOT (@theme — 216 tokens)
                                  │
                                  │ imported into each app's tailwind.css
                                  ▼
apps/<app>/src/tailwind.css       (per-app Tailwind v4 entry — host-shell 2399 LOC)
                                  │
                                  │ also imports —
                                  ▼
libs/falcon-ui-tokens/src/index.css   (67 lines)
                                  │
                                  │ chains —
                                  ├── primitives/ (colors, spacing, radius, shadow, typography, motion — 6 files)
                                  ├── semantic/semantic.css (intent palette, 41 lines — invisible to Tailwind utilities; P1-37 to promote)
                                  ├── themes/light.css (10 lines, opt-in via [data-theme='light'])
                                  ├── themes/dark.css (178 lines per-component bypass — P1-39 to collapse)
                                  ├── density/comfortable.css (default, 72 lines)
                                  ├── density/compact.css (active on [data-density='compact'], 71 lines)
                                  ├── rtl/rtl.css (26 lines — flips shadow + slide + dialog side-right)
                                  └── components/*.tokens.css × 46 files
                                                │
                                                │ each declares ~10-180 `--falcon-<component>-*` tokens
                                                │ scoped via :where(falcon-X, falcon-X-tw, falcon-angular-X, .falcon-X, [data-falcon-X])
                                                ▼
                                  Stencil Shadow + Stencil Light + Angular wrappers all read the same tokens.
                                  Mutating a token cascades into both render paths identically.
```

### Component-token file inventory (46 files, ~3559 component tokens)

| File | Lines | Token count |
|---|---|---|
| accordion.tokens.css | 139 | 86 |
| avatar.tokens.css | 57 | 23 |
| badge.tokens.css | 84 | 36 |
| button.tokens.css | 214 | 93 |
| calendar.tokens.css | 194 | 123 |
| card.tokens.css | 65 | 26 |
| checkbox-group.tokens.css | 21 | 10 |
| checkbox.tokens.css | 182 | 87 |
| combobox.tokens.css | 152 | 90 |
| confirm-dialog.tokens.css | 29 | 16 |
| data-table.tokens.css | 206 | 100 |
| dialog.tokens.css | 224 | 117 |
| drawer.tokens.css | 99 | 49 |
| dropdown.tokens.css | 257 | 132 |
| email-field.tokens.css | 138 | 75 |
| empty-state.tokens.css | 56 | 23 |
| filter-panel.tokens.css | 70 | 40 |
| grid-input.tokens.css | 21 | 2 |
| icon.tokens.css | 31 | 7 |
| input-number.tokens.css | 15 | 7 |
| input.tokens.css | 203 | 89 |
| menu.tokens.css | 110 | 62 |
| multi-select.tokens.css | 311 | 181 |
| organization-hierarchy.tokens.css | 172 | 73 |
| otp-send-dialog.tokens.css | 149 | 94 |
| otp.tokens.css | 156 | 67 |
| paginator.tokens.css | 109 | 54 |
| password.tokens.css | 22 | 13 |
| phone-field.tokens.css | 218 | 142 |
| radio-group.tokens.css | 22 | 11 |
| radio.tokens.css | 186 | 78 |
| search-input.tokens.css | 21 | 4 |
| single-uploader.tokens.css | 199 | 98 |
| status-badge.tokens.css | 91 | 39 |
| stepper.tokens.css | 219 | 94 |
| switch.tokens.css | 215 | 103 |
| table.tokens.css | 157 | 96 |
| tabs.tokens.css | 243 | 128 |
| tag.tokens.css | 51 | 20 |
| textarea.tokens.css | 197 | 89 |
| toast.tokens.css | 119 | 65 |
| tooltip.tokens.css | 95 | 40 |
| tree-table.tokens.css | 241 | 114 |
| tree.tokens.css | 231 | 106 |
| uploader.tokens.css | 223 | 120 |
| wizard.tokens.css | 62 | 27 |

**Gaps:** `<falcon-angular-popup>` and `<falcon-angular-notification>` have NO per-component token file (UP-3-10).

## 4. App-level `tailwind.css` per app

| App | File | Lines | `@source inline(...)` count | Status |
|---|---|---|---|---|
| host-shell | `apps/host-shell/src/tailwind.css` | 2399 | 2113 | LARGEST — hand-curated, drifted (has Studio classes + `rotate-180` admin-console doesn't have) |
| admin-console | `apps/admin-console/src/tailwind.css` | 2302 | 2050 | Missing several utilities present in host-shell |
| management-console | `apps/management-console/src/tailwind.css` | 25 | 0 | **ZERO safelist** — risk of silent class drops on any `[class.X]` binding |

**Asymmetry risks:**
- host-shell has Studio safelist entries (`-`-prefixed utilities like `rotate-180` for sidebar chevron) that admin-console doesn't have — visually OK today because admin-console doesn't use sidebar.
- Management-console has no safelist at all → any future `[class.X]` binding may drop silently.
- Hand-curating drift across apps is the root cause — UP-05 auto-generates the safelist from Tailwind helper `*-tailwind-classes.ts` outputs.

### Tailwind v4 specifics

- `@source` directives in each app's `tailwind.css` declare paths the Oxide scanner crawls.
- `@source not` exclusions remove `node_modules`, `dist`, `.angular`, `.nx`, `demos`, `**/*.spec.ts`, `**/*.e2e.ts`, `**/*.md`.
- Layer order: `@layer theme, base, falcon-base, utilities;` — utilities declared last so they beat `falcon-base`.
- Dark mode `@custom-variant dark (&:where(.app-dark, .app-dark *))` — togglable via `<html class="app-dark">`.
- Grid is the default layout primitive; flexbox only for small inline alignment.

## 5. The `tailwind.config.js` reality (corrected against starting context)

| Layer | Live truth | Starting `TAILWIND_TOKEN_MAP.md` claim | Source-of-truth |
|---|---|---|---|
| `tailwind.config.js` | `module.exports = {}` (empty) with comment explicitly removing `important: true` | "v3 config bridge enables `important: true`" | LIVE — `important: true` was REMOVED because it broke `<falcon-tabs-tw>` JS-set sliding indicator widths post-PrimeNG |
| `@config` directive in SSOT | Present at `falcon-tailwind-tokens.css:8` but points at empty object | Implied as live bridge | LIVE — vestigial; could be deleted (UP-15) |

**P0-09 documents this drift** so future Brain SK agents don't assume `important: true` is on.

## 6. Dark mode rules

When `<html class="app-dark">` or `<html class="dark">` is set (lines 385-451 of SSOT):

- **Neutrals invert** — `--color-falcon-neutral-0` becomes `#1a1a2e`, scaling up to `--color-falcon-neutral-900: #ffffff`.
- **Brand teal stays unchanged** — teal is intentionally constant across modes.
- **Semantic surface aliases** added in dark only: `--color-falcon-bg-page: #111827`, `--color-falcon-bg-surface: #1f2937`.
- **Shadows strengthen** — `rgba(0,0,0,0.04 → 0.20)`, etc.
- **Focus rings** lift to lighter teal alpha for contrast on dark canvas.
- **Wave 9 teal-option / teal-mid** flip to `#1e3a3a` / `#2dd4d9` for readability.
- **Teal alpha derivatives** recalc from `rgba(13, 63, 68, ..)` → `rgba(105, 142, 146, ..)` (lighter teal base for dark bg).

**Geometry (sizes / radii / spacing / motion / breakpoints / z-index) is NOT overridden in dark mode — only surface / text / border / shadow tokens move.**

### Dark-mode bypass list (178 lines in `themes/dark.css`)

A series of per-component overrides like:

```css
:where(.app-dark, .app-dark *) {
  --falcon-input-focus-halo: rgba(105, 142, 146, 0.18);  /* recalculated for dark base */
  --falcon-button-primary-bg: #2dd4d9;
  /* ... */
}
```

These exist because some component-token files hardcode `rgba(13, 63, 68, X)` literally instead of cascading through `var(--color-falcon-teal-alpha-X)`. P1-39 collapses these into the SSOT alpha chain. After P1-39, `themes/dark.css` should shrink to ~12 lines covering only semantic intent.

## 7. Tailwind helpers (47)

Path: `libs/falcon-ui-core/src/tailwind/`

- **1 barrel** (`index.ts`) re-exports 43 helpers.
- **46 per-component class-builder TS files** (`falcon-X-tailwind-classes.ts`) — pure functions producing class strings.

**Barrel coverage gap:** 3 helpers NOT in `index.ts` — `menu-tailwind-classes.ts`, `single-uploader-tailwind-classes.ts`, `drawer-tailwind-classes.ts`. Reachable only by deep import. Fix: add to barrel.

**Helper output flow:**

1. `getFalconXClasses(props)` returns a string of space-separated Tailwind utility class names.
2. Stencil Light tag binds it via JSX `class={...}`.
3. Angular wrapper passes it to the Light tag via `[class]="classes()"`.
4. React + Vue auto-emitted wrappers pass it via their respective binding syntax.

**Result:** four frameworks produce identical Tailwind output for the same input props.

## 8. Risks

### R1 — SCSS in feature components (live violation)
- **20+ feature SCSS files** under `apps/*/src/app/features/` carry real rules.
- Worst offenders: forgot-password (496 LOC), dashboard (443 LOC), enter-otp (309 LOC), login-layout (291 LOC), organization-hierarchy-menu (217 LOC), change-password (207 LOC), applications-table (183 LOC).
- Every line violates the standing rule (`feedback_v02_theme_adopted.md`, `project_brain_skills_primeng_purge.md`).
- **Fix:** P0-10 codify a no-feature-SCSS gate; migrate by feature wave.

### R2 — Host-shell `--font-sans` override drift
- `apps/host-shell/src/styles.scss:10-21` overrides `--font-sans` to `'Poppins', 'Inter', system-ui, sans-serif` with `!important`.
- SSOT declares `--font-sans: var(--font-sans-latin)` → `"Neue Haas Grotesk Display Pro"`.
- Brand font is currently ambiguous. Either fix the SSOT to match React prototype or remove the override + serve Neue Haas.
- **Fix:** P2-32 decide + reconcile.

### R3 — `@source inline(...)` safelist asymmetry
- host-shell: 2113 lines. admin-console: 2050 lines (drifted). mgmt-console: 0.
- Mgmt-console latent bug: any future `[class.X]` binding may silently drop.
- **Fix:** P1-38 auto-generate safelist from Tailwind helpers.

### R4 — Token fallback drift vs SSOT
- `--falcon-button-primary-bg: var(--color-falcon-teal-500, #0d3f44)` — teal-500 is `#124c52`, fallback is teal-700.
- `--falcon-input-bg-error: var(--color-falcon-red-100, #dc2626)` — red-100 is `#fde2e4`, fallback is red-500.
- `--falcon-dropdown-bg-error: var(--color-falcon-red-100, #fef5f5)` — red-100 is `#fde2e4`, fallback is red-50.
- SSOT-less consumers ship wrong colour.
- **Fix:** P0-08 gate + auto-fix pass.

### R5 — Component-token hardcoded `rgba(13, 63, 68, X)` instead of `var(--color-falcon-teal-alpha-*)`
- Causes the 178-line dark.css bypass.
- Multiple files affected (input, button, multi-select, dropdown, combobox, stepper, calendar tokens).
- **Fix:** P1-39 cascade-aware pass.

### R6 — Mixed-case hex literals in SSOT
- `--color-falcon-green-50: #F3F8F5` vs `--color-falcon-teal-50: #f3f8f5`.
- Tailwind doesn't care; string-comparison gates fail.
- Double-semicolon hazard on green-50 (`#F3F8F5;;`).
- **Fix:** P2-30 + P2-31 normalize.

### R7 — Inline `[style.X]=` bindings
- 6 files use Angular's `[style.X]=` pattern (org-chart legitimate; sidebar chevron + dashboard bars could be tokenized).
- `feedback_no_inline_styles_tokens_only.md` (hardened 2026-05-05) covers raw `style="..."` but not `[style.X]=`.
- **Fix:** P3-14 lint with org-chart allowlist.

### R8 — Hardcoded hex inside SVG fill/stroke
- 38 occurrences across 15 templates. Mostly placeholders (avatar fallback `#cfd8dc` / `#8a9ea7`). Some brand-color SVGs.
- **Fix:** P3-17 audit + `currentColor` migration where brand colour applies.

## 9. Top 5 token upgrades

1. **P0-08 — Reconcile component-token fallback hex.** Single gate run + auto-fix pass closes the SSOT-less-consumer correctness gap.
2. **P1-37 — Promote intent palette into SSOT `@theme`.** Adds `--color-falcon-{primary,danger,success,warning,info}` so templates can use `bg-falcon-primary`. Unblocks Noor palette-over-intent rule for new code.
3. **P1-39 — Collapse 178-line dark.css bypass into SSOT alpha cascade.** Replace literal `rgba(13, 63, 68, X)` with `var(--color-falcon-teal-alpha-X)` across `components/*.tokens.css`. dark.css shrinks to ~12 lines.
4. **P1-38 — Auto-generate per-app `@source inline(...)` safelist.** Removes drift between host-shell, admin-console, mgmt-console. mgmt-console gains needed safelist.
5. **P0-10 — Codify no-feature-SCSS gate.** Stops drift at source. Stage 1: name and shame existing 20+ files. Stage 2: migrate per feature wave.

## 10. Density + RTL toggles (capability unlock awaiting wiring)

- Tokens layer fully supports `[data-density='compact']` and `[data-theme='dark']` toggles via attribute selectors on any ancestor.
- Dark mode is wired today through `<html class="app-dark">` (per SSOT `@custom-variant`).
- **Density is NOT exposed in any UI** — Stencil components and Tailwind utilities respect it once `data-density='compact'` is set, but no Angular service writes the attribute.
- **Fix:** P3-16 add `setDensity()` to `PrimeNGThemeService` (rename to `FalconThemeService` in same pass per Agent 6 / P2-21).
