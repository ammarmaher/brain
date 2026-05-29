---
type: reference
library: "[[Tailwind CSS]]"
topic: color-usage-map
priority: critical
scope: current-angular-first
mode: light-only
created: 2026-05-20
---
*** Falcon Current Color Usage Map — every color, where it lands ***
*** Light mode only; dark cascade documented separately ***
*** Read-only; no token edits, no recoloring ***

# Falcon Current Color Usage Map

> A token-by-token, role-by-role map of where each color is consumed in the implemented Falcon UI today (2026-05-20). Tokenized values are marked ✅. Hardcoded values are flagged ❌ (the gap surface for Wave 1+2).

## 1. Purpose

Make the implicit color system explicit. Future agents asking "where is `--color-falcon-teal-700` used?" or "is this hardcoded?" get the answer here without re-grepping the codebase.

## 2. Primitive colors (Layer 1 — in @theme)

[CODE] [`libs/falcon-theme/src/falcon-tailwind-tokens.css:19-126`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-theme/src/falcon-tailwind-tokens.css:19) — declared in the SSOT `@theme` block. Tailwind auto-generates `bg-falcon-X` / `text-falcon-X` / `border-falcon-X` utilities for all of these.

### Brand teal (18 stops including alpha)

| Token | Hex (light) | Tokenized | Primary consumer |
|---|---|---|---|
| `--color-falcon-teal-50` | `#f3f8f5` | ✅ | Tree-panel surface (`falcon-tree-panel.component.html:2`) |
| `--color-falcon-teal-100` | `#e8f0f1` | ✅ | Selected tree row / kebab hover |
| `--color-falcon-teal-200` | `#d1e0e2` | ✅ | Subtle teal chip bg |
| `--color-falcon-teal-300` | `#a8bec0` | ✅ | Rarely used |
| `--color-falcon-teal-400` | `#698e92` | ✅ | Focus-ring alpha base (`shadow-falcon-focus`) |
| `--color-falcon-teal-500` | `#124c52` | ✅ | Button primary bg + sort-icon active |
| `--color-falcon-teal-600` | `#104c54` | ✅ | Button primary hover |
| `--color-falcon-teal-700` | `#0d3f44` | ✅ | **Sidebar bg** · accent text · user-menu head · mood-toggle bg |
| `--color-falcon-teal-800` | `#0a3338` | ✅ | Sidebar nav-item hover-pressed (rare) |
| `--color-falcon-teal-900` | `#082a2e` | ✅ | **Sidebar nav-item active** |
| `--color-falcon-teal-tint` | `#eef3f4` | ✅ | **Data-table selected row** |
| `--color-falcon-teal-option` | `#f1f6f6` | ✅ | Dropdown option hover wash |
| `--color-falcon-teal-mid` | `#00827a` | ✅ | Specialty accent (cyan-ish) |
| `--color-falcon-teal-alpha-04..18` | rgba(13,63,68,0.04..0.18) | ✅ | Tree rails, sticky-actions shadow, edge tints |

### Neutrals (27 stops — see [[Falcon Color Palette Audit]] for the over-granulation analysis)

| Token | Hex | Tokenized | Primary consumer |
|---|---|---|---|
| `--color-falcon-neutral-0` | `#ffffff` | ✅ | **Page canvas** · topbar · card surfaces · row hover bg in tree |
| `--color-falcon-neutral-20` | `#fcfcfd` | ✅ | Very subtle wash |
| `--color-falcon-neutral-25` | `#fafbfc` | ✅ | **Data-table row hover** |
| `--color-falcon-neutral-30` | `#fafafa` | ✅ | Data-table header inline style |
| `--color-falcon-neutral-40` | `#f8f8f8` | ✅ | (rare) |
| `--color-falcon-neutral-45` | `#f7f8f9` | ✅ | (rare) |
| `--color-falcon-neutral-50` | `#f5f7f8` | ✅ | **Topbar icon-btn hover** · user-menu item hover · button secondary hover |
| `--color-falcon-neutral-75` | `#f5f6f7` | ✅ | **Org-hierarchy outer wrapper** |
| `--color-falcon-neutral-100` | `#f1f3f5` | ✅ | **Row divider** (table) |
| `--color-falcon-neutral-150` | `#eef0f2` | ✅ | Strong divider |
| `--color-falcon-neutral-160` | `#eff1f3` | ✅ | (drift — off-grid) |
| `--color-falcon-neutral-175` | `#e7eaee` | ✅ | (drift — off-grid) |
| `--color-falcon-neutral-200` | `#e5e7eb` | ✅ | **Default border** (cards, panels, inputs) |
| `--color-falcon-neutral-300` | `#d4d8dc` | ✅ | Hover border |
| `--color-falcon-neutral-400` | `#c7ced4` | ✅ | Sort-icon idle |
| `--color-falcon-neutral-500` | `#9ca3af` | ✅ | Placeholder text · muted icon |
| `--color-falcon-neutral-600` | `#6b7280` | ✅ | **Muted text** (labels, table header) · "Falcon Clients" label |
| `--color-falcon-neutral-700` | `#5a6470` | ✅ | Stronger muted text |
| `--color-falcon-neutral-800` | `#3d3d3d` | ✅ | **Input label color** · topbar icon-btn color |
| `--color-falcon-neutral-900` | `#1a1a1a` | ✅ | **Primary body text** · data-table cell color · topbar title |
| `--color-falcon-neutral-950` | `#000000` | ✅ | Maximum contrast (rare) |

### Status colors

| Token | Hex | Primary consumer |
|---|---|---|
| `--color-falcon-green-50` | `#F3F8F5` | Success chip bg (note: matches teal-50 numerically) |
| `--color-falcon-green-100` | `#dfece6` | Success chip alt bg |
| `--color-falcon-green-500` | `#16a34a` | Success status badge |
| `--color-falcon-green-700` | `#0f7a3a` | Success border / text |
| `--color-falcon-red-50` | `#fef5f5` | Error chip bg |
| `--color-falcon-red-100` | `#fde2e4` | Error alt chip bg |
| `--color-falcon-red-500` | `#dc2626` | **Error / required marker / danger button** |
| `--color-falcon-red-700` | `#a1191d` | Error stronger / required (alt) |
| `--color-falcon-amber-50` | `#ffeccb` | Warning chip bg |
| `--color-falcon-amber-500` | `#f59e0b` | Warning status |
| `--color-falcon-amber-700` | `#a85a00` | Warning stronger |
| `--color-falcon-blue-500` | `#0ea5e9` | Info status |
| `--color-falcon-success-10/20/50` | `#F3F8F5 / #E6EFE9 / #ecfdf5` | Data-table shadow-row backgrounds |

### Accents

| Token | Hex | Use |
|---|---|---|
| `--color-falcon-popover-dark` | `#3b4752` | Tooltip dark surface |
| `--color-falcon-orgchart-line` | `rgba(124,130,169,0.5)` | Org-chart connector |
| `--color-falcon-cyan` | `#2dd4d9` | Specialty |
| `--color-falcon-lilac-25/100/450/500` | varies | Surface tints (4 stops) |
| `--color-falcon-mint-100/200` | `#d9e6dd / #b9d4c3` | Sub-node initials chip |

### Customer brand colors (invariant)

| Token | Hex | Customer |
|---|---|---|
| `--color-falcon-brand-aramco` (+ 3 variants) | `#0d6e0e` etc. | Aramco |
| `--color-falcon-brand-bmw` | `#1c69d4` | BMW |
| `--color-falcon-brand-rajhi` | `#1e4fa3` | Rajhi |
| `--color-falcon-brand-snb` | `#1a6b2e` | SNB |
| `--color-falcon-brand-bupa` (+ soft) | `#007bc3` etc. | Bupa |

**Rule:** never remap in dark mode. Customer logo identity is invariant.

## 3. Semantic colors (Layer 2 — currently in `:root`, NOT in @theme)

Per [[Falcon Tailwind Theme]] Finding 1, the semantic Tier-2 layer lives in [CODE] [`libs/falcon-ui-tokens/src/semantic/semantic.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/semantic/semantic.css) under `:root` scope — no Tailwind utilities are generated. Templates that want these must use `bg-[var(--falcon-color-X)]` arbitrary syntax.

| Semantic role | Token | Resolves to |
|---|---|---|
| Primary intent | `--falcon-color-primary` | `var(--falcon-color-teal-600)` → `#104c54` |
| Primary hover | `--falcon-color-primary-hover` | `var(--falcon-color-teal-700)` |
| Primary active | `--falcon-color-primary-active` | `var(--falcon-color-teal-800)` |
| Danger | `--falcon-color-danger` | `var(--falcon-color-red-600)` |
| Success | `--falcon-color-success` | `var(--falcon-color-green-600)` |
| Warning | `--falcon-color-warning` | `var(--falcon-color-amber-500)` |
| Surface | `--falcon-color-surface` | white |
| Surface muted | `--falcon-color-surface-muted` | neutral-50 |
| Surface subtle | `--falcon-color-surface-subtle` | neutral-100 |
| Text | `--falcon-color-text` | neutral-900 |
| Text muted | `--falcon-color-text-muted` | neutral-600 |
| Border | `--falcon-color-border` | neutral-300 |
| Focus ring | `--falcon-color-focus-ring` | rgba(37,99,235,0.25) (NOTE: blue, NOT teal — inconsistency flagged) |

**Wave 1 fix:** promote these to `@theme` so utilities exist.

## 4. Component-token colors (Layer 3 — per-component contracts)

Each of the 51 `*.tokens.css` files in [CODE] `libs/falcon-ui-tokens/src/components/` declares per-component slots like `--falcon-button-primary-bg`. See [[Falcon Component Library Structure]] for the full inventory. Highlights:

### Button colors (per [`button.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/button.tokens.css))

| Slot | Resolves to | Hex (light) |
|---|---|---|
| `--falcon-button-primary-bg` | `var(--color-falcon-teal-500, #0d3f44)` | `#124c52` (but fallback says `#0d3f44`!) |
| `--falcon-button-primary-bg-hover` | `var(--color-falcon-teal-600, #124c52)` | `#104c54` (fallback says teal-500 hex) |
| `--falcon-button-secondary-bg` | white | `#ffffff` |
| `--falcon-button-secondary-bg-hover` | neutral-50 | `#f5f7f8` |
| `--falcon-button-secondary-border` | neutral-200 | `#e5e7eb` |
| `--falcon-button-ghost-bg` | transparent | — |
| `--falcon-button-ghost-bg-hover` | neutral-50 | `#f5f7f8` |
| `--falcon-button-link-text` | neutral-900 | `#1a1a1a` |
| `--falcon-button-link-text-hover` | teal | `#0d3f44` |
| `--falcon-button-danger-bg` | red-500 | `#dc2626` |
| `--falcon-button-shadow-focus` | teal-alpha | `var(--shadow-falcon-focus)` |

🔴 **P0-08 fallback drift confirmed:** the fallback hex (`#0d3f44`) in the `var(..., fallback)` chain does NOT match the SSOT `--color-falcon-teal-500` value (`#124c52`). Same drift in input/dropdown/multi-select/phone-field/email-field/combobox. See [[Tailwind Falcon Alignment Scorecard]].

### Data-table colors (per [`data-table.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/data-table.tokens.css))

| Slot | Resolves to |
|---|---|
| `--falcon-data-table-wrap-bg` | white |
| `--falcon-data-table-header-bg` | white (but inlined override to `--color-falcon-neutral-30` in some consumers — see org-hierarchy users table) |
| `--falcon-data-table-header-color` | neutral-600 (`#6b7280`) |
| `--falcon-data-table-cell-color` | neutral-900 (`#1a1a1a`) |
| `--falcon-data-table-row-divider` | neutral-100 (`#f1f3f5`) |
| `--falcon-data-table-row-bg-hover` | neutral-25 (`#fafbfc`) |
| `--falcon-data-table-row-bg-selected` | teal-tint (`#eef3f4`) |
| `--falcon-data-table-sort-icon-color` | neutral-400 (`#c7ced4`) |
| `--falcon-data-table-sort-icon-color-active` | teal-700 (`#0d3f44`) |

### Input colors (per [`input.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/input.tokens.css))

| Slot | Light value |
|---|---|
| `--falcon-input-bg` | white |
| `--falcon-input-bg-hover` | white (no hover bg change) |
| `--falcon-input-label-color` | neutral-800 (`#3d3d3d`) |
| `--falcon-input-label-color-error` | red-500 (`#dc2626`) |
| `--falcon-input-required-color` | red-500 |
| `--falcon-input-border-default` | neutral-200 (`#e5e7eb`) |
| `--falcon-input-border-focus` | teal-700 (`#0d3f44`) |
| `--falcon-input-border-error` | red-500 (`#dc2626`) |
| `--falcon-input-shadow-focus` | teal-alpha (focus ring) |

### Sidebar (no per-component contract today — uses primitives directly)

| Use | Hardcoded Tailwind utility | Should-be token |
|---|---|---|
| Aside bg | `bg-falcon-teal-700` | `--color-falcon-surface-brand-strong` (gap) |
| Active nav-item bg | `bg-falcon-teal-900` | `--color-falcon-surface-brand-strong-active` (gap) |
| Nav-item idle text | `text-white/[0.82]` | `--color-falcon-text-on-brand` (gap) |
| Nav-item hover bg | `hover:bg-white/[0.06]` | `--color-falcon-state-item-hover-on-brand` (gap) |

🔴 **Per [[Tailwind Falcon Alignment Scorecard]] Wave 1 — sidebar should consume Layer-2 semantic tokens promoted to `@theme`.**

## 5. Hover colors (consolidated)

Already in [[Falcon Light Mode Visual Baseline]] §2. Brief recap:
- Sidebar nav: `rgba(255,255,255,0.06)`
- Topbar icon-btn: `#f5f7f8` (neutral-50)
- Data-table row: `#fafbfc` (neutral-25)
- Tree-panel row: `#ffffff` (neutral-0)
- Button secondary: `#f5f7f8`

## 6. Selected row colors (consolidated)

- Data-table: `#eef3f4` (teal-tint)
- Tree-panel root + child: `#e8f0f1` (teal-100) + text turns `#0d3f44` (teal-700) bold

## 7. Warning / Success / Error / Info colors

| Status | Light bg | Light text |
|---|---|---|
| Success | `#dfece6` (green-100) | `#16a34a` (green-500) or `#0f7a3a` (green-700) |
| Error / danger | `#fde2e4` (red-100) | `#dc2626` (red-500) or `#a1191d` (red-700) |
| Warning | `#ffeccb` (amber-50) | `#f59e0b` (amber-500) or `#a85a00` (amber-700) |
| Info | (specialty) | `#0ea5e9` (blue-500) |

Consumed via `<falcon-angular-status-badge>` + `<falcon-angular-tag>` per [[Falcon Component Library Structure]].

## 8. Hardcoded color leaks (current state — not yet fixed)

Per the 2026-05-13 audit (`STATIC_STYLE_RISKS.md`):

- Loading overlay `rgba(255,255,255,0.7)` hardcoded — see Wave 2 P3-02
- 38 hex inside SVG fill/stroke across 15 template files — P3-17 to migrate to `currentColor`
- Inline `style="--falcon-table-header-bg: var(--color-falcon-neutral-30, #f7f8fa); --falcon-table-footer-bg: ..."` on data-tables in org-hierarchy users table (this is var-driven, not raw hex, so technically tokenized)
- 50+ instances of `bg-[#f5f6f7]`, `border-[#eef0f2]`, `rounded-[14px]` in feature templates (admin-console org-hierarchy worst offender) — P1-41

## See also

- [[Falcon Light Mode Visual Baseline]] — high-level visual identity
- [[Falcon Current Spacing Radius Shadow Map]] — non-color values
- [[Falcon Current Hover Focus State Map]] — interactive states
- [[Falcon Organization Hierarchy Visual Standard]] — reference page
- [[Falcon Tailwind Theme]] — governance rules
- [[Falcon Color Palette Audit]] — 27-stop neutral analysis (drift list)
- [[Tailwind Falcon Alignment Scorecard]] — Wave 1+2 fix plan (covers P0-08, P1-37, P1-39, P1-41)
- Supporting evidence: [TAILWIND_TOKEN_MAP](../../Brain%20Outputs/understanding/frontend/TAILWIND_TOKEN_MAP.md) · [FALCON_THEME_AND_TAILWIND_REPORT](../../Brain%20Outputs/understanding/frontend/FALCON_THEME_AND_TAILWIND_REPORT.md)

## Tags

#type/reference #layer/frontend #layer/design #light-mode-baseline #priority/critical

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]]
