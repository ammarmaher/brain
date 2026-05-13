# Tailwind v4 Token Map — Falcon Theme SSOT

## Canonical theme file (ACTIVE)

`libs/falcon-theme/src/falcon-tailwind-tokens.css` — **486 lines, ~264 `@theme` tokens**, single source of truth (SSOT).

- Each app's `apps/<app>/src/tailwind.css` `@import`s this file as the first line (verified for `host-shell`; same pattern in admin-console and management-console).
- It also re-exports through the barrel `libs/falcon-theme/src/index.css` → `@import "./falcon-tailwind-tokens.css"; @import "./styles/falcon-icons.css";`.
- Tailwind v4 layer order is declared explicitly: `@layer theme, base, falcon-base, utilities;`.
- The dark mode variant is registered as `@custom-variant dark (&:where(.app-dark, .app-dark *))`. Dark overrides re-declare the same custom-property names inside `:where(.app-dark, .app-dark *), :where(.dark, .dark *)` (lines 385-451) so geometry stays stable and only surface / text / border / shadow tokens invert.
- v3 config bridge is enabled via `@config "../../../tailwind.config.js"` (line 8) to re-enable `important: true` so utilities beat legacy `::ng-deep` overrides.

### Companion component-token files (NOT in `@theme`)

`libs/falcon-ui-tokens/src/index.css` imports **~46 per-component CSS files** under `libs/falcon-ui-tokens/src/components/<component>.tokens.css` (input, button, dropdown, checkbox, radio, multi-select, switch, textarea, tabs, tree-table, tree, stepper, uploader, single-uploader, tooltip, menu, accordion, paginator, toast, dialog, table, calendar, otp, phone-field, email-field, otp-send-dialog, drawer, data-table, organization-hierarchy, status-badge, icon, empty-state, badge, avatar, wizard, search-input, grid-input, combobox, filter-panel, card, checkbox-group, confirm-dialog, input-number, password, radio-group, tag). These declare component-scoped `--falcon-<component>-*` tokens that flow into both Stencil components (Shadow DOM) and Tailwind utilities (Light DOM) — the dual-render parity hinge.

Layer order inside `falcon-ui-tokens/src/index.css`: `primitives → semantic → themes → density → rtl → components`.

### Memory cross-reference

Memory notes a "V0.2 vs V0.3" parallel — the active checked-out tree has **`falcon-tailwind-tokens.css` as the single live SSOT**. There is no parallel V0.3 file under `libs/falcon-theme/src/`. The Studio-era V0.3 work appears to have either merged into this file or sits inside `libs/falcon-studio/` (currently hidden-but-kept per Wave 2 v3.1 — Tailwind no longer scans it). **For this audit, `falcon-tailwind-tokens.css` is the only active theme file.**

---

## Token tables

### 1. Colors — Brand teal

| TOKEN NAME | CSS VAR | CATEGORY | VALUE |
|---|---|---|---|
| Teal 50 | `--color-falcon-teal-50` | color | `#f3f8f5` |
| Teal 100 | `--color-falcon-teal-100` | color | `#e8f0f1` |
| Teal 200 | `--color-falcon-teal-200` | color | `#d1e0e2` |
| Teal 300 | `--color-falcon-teal-300` | color | `#a8bec0` |
| Teal 400 | `--color-falcon-teal-400` | color | `#698e92` |
| Teal 500 (brand) | `--color-falcon-teal-500` | color | `#124c52` |
| Teal 600 | `--color-falcon-teal-600` | color | `#104c54` |
| Teal 700 | `--color-falcon-teal-700` | color | `#0d3f44` |
| Teal 800 | `--color-falcon-teal-800` | color | `#0a3338` |
| Teal 900 | `--color-falcon-teal-900` | color | `#082a2e` |
| Teal tint | `--color-falcon-teal-tint` | color | `#eef3f4` |
| Teal option (Wave 9) | `--color-falcon-teal-option` | color | `#f1f6f6` |
| Teal mid (Wave 9) | `--color-falcon-teal-mid` | color | `#00827a` |
| Teal alpha 04/06/08/12/18 | `--color-falcon-teal-alpha-04`..`18` | color | `rgba(13,63,68,0.04..0.18)` |

### 2. Colors — Neutrals (the most-used scale)

| TOKEN NAME | CSS VAR | VALUE |
|---|---|---|
| 0 / 20 / 25 / 30 / 40 / 45 / 50 / 75 / 100 / 150 / 160 / 175 / 200 / 300 / 350 / 400 / 450 / 475 / 500 / 600 / 700 / 750 / 800 / 850 / 900 / 925 / 950 | `--color-falcon-neutral-{n}` | `#ffffff` → `#000000` across 27 stops |

### 3. Colors — Status / brand / lilac / mint

| FAMILY | VARS | VALUES |
|---|---|---|
| Green | `--color-falcon-green-50/100/200/500/700` | `#f3f8f5` / `#dfece6` / `#d9ebe3` / `#16a34a` / `#0f7a3a` |
| Red | `--color-falcon-red-50/100/500/700/900` | `#fef5f5` / `#fde2e4` / `#dc2626` / `#a1191d` / `#7f1d1d` |
| Amber | `--color-falcon-amber-50/500/700` | `#ffeccb` / `#f59e0b` / `#a85a00` |
| Blue 500 | `--color-falcon-blue-500` | `#0ea5e9` |
| Popover dark | `--color-falcon-popover-dark` | `#3b4752` |
| Org chart line | `--color-falcon-orgchart-line` | `rgba(124,130,169,0.5)` |
| Cyan | `--color-falcon-cyan` | `#2dd4d9` |
| Lilac | `--color-falcon-lilac-25/100/450/500` | `#f8f8fc` / `#e8e8f0` / `#7c82a9` / `#8b8fc8` |
| Mint | `--color-falcon-mint-100/200` | `#d9e6dd` / `#b9d4c3` |
| Brand brand-aramco/bmw/rajhi/snb/bupa(+soft) | `--color-falcon-brand-*` | Per-tenant accent palette |

### 4. Typography

| TOKEN | CSS VAR | VALUE |
|---|---|---|
| Sans (default → alias to latin) | `--font-sans` | `var(--font-sans-latin)` |
| Sans-Latin | `--font-sans-latin` | `"Neue Haas Grotesk Display Pro", system-ui, -apple-system, "Segoe UI", Arial, sans-serif` |
| Sans-Arabic | `--font-sans-ar` | `"Cairo", system-ui, -apple-system, "Segoe UI", Arial, sans-serif` |
| Display | `--font-display` | `"Poppins", "Inter", system-ui, sans-serif` |
| Arabic | `--font-arabic` | `"IBM Plex Sans Arabic", "Poppins", sans-serif` |
| Type scale | `--text-4xs / 3xs / 2xs / xs / sm / md / base / lg / xl / 2xl / 3xl / 4xl / 5xl / display` | `9px` → `5rem` (10 + 14 + 16 + 20 + 24 + 28 + ... + 80px) |
| Leading | `--falcon-leading-tight / snug / normal / relaxed / loose` | `1.2 → 2.1` |
| Tracking | `--tracking-label`, `--tracking-brand-copy` | `0.01em`, `0.03em` |

### 5. Sizing (control/icon/tile/stepper — NOT spacing)

| TOKEN | CSS VAR | VALUE |
|---|---|---|
| Control sm/md/lg | `--falcon-size-control-{sm,md,lg}` | `28px / 34px / 38px` |
| Icon xs/sm/md/lg | `--falcon-size-icon-{xs,sm,md,lg}` | `12 / 14 / 16 / 24px` |
| Icon semantic aliases (Wave 8E) | `--falcon-icon-{sm,md,lg}` | Maps to control-icon scale |
| Tile compact/sm/md/lg | `--falcon-size-tile-{compact,sm,md,lg}` | `56 / 96 / 128 / 176px` |
| Stepper circle sm/md/lg | `--falcon-size-stepper-circle-{sm,md,lg}` | `16 / 18 / 20px` |
| Stepper customisation (Wave 10D) | `--falcon-stepper-step-{shape,radius,rotate,size-1..5,label-position,label-visible,animation-enabled}` | Studio knobs |

### 6. Border width

| TOKEN | CSS VAR | VALUE |
|---|---|---|
| 1 / 1.5 / 2 / 4 | `--falcon-border-width-{1,1-5,2,4}` | `1px / 1.5px / 2px / 4px` |

### 7. Spacing

| TOKEN | CSS VAR | VALUE |
|---|---|---|
| Scale 0 / px / 0.5 / 1..12 / 14 / 16 / 20 / 24 | `--spacing-{n}` | `0 → 6rem` (custom Falcon scale — NOT Tailwind defaults) |
| Layout — sidebar | `--spacing-sidebar` | `224px` |
| Layout — sidebar-collapsed | `--spacing-sidebar-collapsed` | `68px` |
| Layout — topbar | `--spacing-topbar` | `72px` |
| Layout — clients | `--spacing-clients` | `272px` |
| Layout — rail | `--spacing-rail` | `18px` |
| Tree — row-h, row-gap, row-pad-{x,y} | `--spacing-row-*` | `36 / 6 / 10 / 6 px` |

### 8. Radii

| TOKEN | CSS VAR | VALUE |
|---|---|---|
| none / 2xs / xs / sm / md / lg / xl / 2xl / 3xl / full / pill / form / row | `--radius-{name}` | `0`, `3px`, `4px`, `8px`, `12px`, `16px`, `24px`, `28px`, `32px`, `9999px`, `9999px`, `20px`, `8px` |

### 9. Shadows

| TOKEN | CSS VAR | VALUE |
|---|---|---|
| xs / sm / md / lg / xl | `--shadow-falcon-{xs,sm,md,lg,xl}` | Light-mode RGBA `0,0,0,0.04 → 0.18` |
| popover / menu / drawer | `--shadow-falcon-{popover,menu,drawer}` | Surface-specific elevations |
| focus / focus-strong / danger-focus | `--shadow-falcon-{focus,focus-strong,danger-focus}` | `0 0 0 3px rgba(13,63,68,0.12)`, etc. |
| sticky-edge | `--shadow-falcon-sticky-edge` | Tree-node sticky edge |
| action | `--shadow-falcon-action` | Single-uploader action shadow |
| brand-soft | `--shadow-brand-soft` | `0 8px 18px rgba(16,76,84,0.08)` |

### 10. Breakpoints

| TOKEN | CSS VAR | VALUE |
|---|---|---|
| sm / md / lg / xl / 2xl | `--breakpoint-{sm,md,lg,xl,2xl}` | `576 / 768 / 992 / 1200 / 1920 px` |

### 11. Motion

| TOKEN | CSS VAR | VALUE |
|---|---|---|
| Easings | `--ease-falcon-{in,out,inout}` | Cubic-bezier curves |
| Durations | `--duration-falcon-{fast,base,slow}` | `120 / 150 / 300 ms` |
| Animation — menu-in | `--animate-menu-in` | `menuIn 0.15s ease` |
| Transition shorthand | `--transition-falcon-row` | `background var(--duration-falcon-fast), box-shadow var(--duration-falcon-fast)` |
| Keyframes (declared outside `@theme`) | `menuIn`, `falcon-fade`, `falcon-scale`, `falcon-slide`, `falcon-soft-lift`, `falcon-pulse`, `falcon-loading` | Studio Animation tab keyframes |

### 12. Z-index

| TOKEN | CSS VAR | VALUE |
|---|---|---|
| dropdown / sticky / fixed / overlay / modal / popover / tooltip | `--z-falcon-{layer}` | `1000 / 1020 / 1030 / 1040 / 1050 / 1060 / 1070` |

### 13. Background images

| TOKEN | CSS VAR | NOTES |
|---|---|---|
| Tree rail on-path | `--background-image-falcon-rail-on-path` | Vertical connector line — strong teal-700 stripe |
| Tree rail default | `--background-image-falcon-rail-default` | Vertical connector line — teal-alpha-18 stripe |

### 14. Misc

| TOKEN | CSS VAR | VALUE |
|---|---|---|
| Text muted alias | `--text-muted` | `#6b7280` (light) / `#9ca3af` (dark) |

---

## Dark-mode override summary (lines 385-451)

When `<html class="app-dark">` or `<html class="dark">` is set:

- **Neutrals invert** — `--color-falcon-neutral-0` becomes `#1a1a2e`, scaling up to `--color-falcon-neutral-900: #ffffff`.
- **Brand teal stays unchanged** — teal is intentionally constant across modes.
- **Semantic surface aliases** added in dark only: `--color-falcon-bg-page: #111827`, `--color-falcon-bg-surface: #1f2937`.
- **Shadows strengthen** — `rgba(0,0,0,0.04 → 0.20)`, etc.
- **Focus rings** lift to lighter teal alpha for contrast on dark canvas.
- **Wave 9 teal-option / teal-mid** flip to `#1e3a3a` / `#2dd4d9` for readability.
- **Teal alpha derivatives** recalc from `rgba(13,63,68,..)` → `rgba(105,142,146,..)` (lighter teal base for dark bg).

Geometry (sizes / radii / spacing / motion / breakpoints / z-index) is **NOT** overridden in dark mode — only surface / text / border / shadow tokens move.

---

## Notes on token discipline

- Wave 12A explicitly removed all glass / glossify / liquid-glass tokens (6 swatch tokens + ~16 base + ~12 stat-card glass). The Studio is now a pure component customiser, not a glassmorphism playground.
- Comments in `falcon-tailwind-tokens.css` note that `--spacing-*` is for padding/margin/gap ONLY, distinct from `--falcon-size-*` (control / icon / pill / tile / stepper sizing). This boundary is enforced by gate-12-component-token-scope.mjs.
- Memory entry `feedback_shadow_is_token_ssot.md` reaffirms that Stencil Shadow components + `<component>.tokens.css` files are the SSOT; Tailwind utilities must mirror, never reinvent.
