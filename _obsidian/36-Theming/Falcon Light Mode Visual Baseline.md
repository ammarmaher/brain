---
type: reference
library: "[[Tailwind CSS]]"
topic: light-mode-visual-baseline
priority: critical
scope: current-angular-first
mode: light-only
created: 2026-05-20
---
*** Falcon Light Mode Visual Baseline — what is implemented today ***
*** Read-only knowledge build; no token / theme / component changes ***
*** Angular-first; React/Vue future placeholders only ***

# Falcon Light Mode Visual Baseline

> The current light-mode visual identity of Falcon, anchored on what is implemented in source today (2026-05-20). **This note is the canonical "before" baseline** — any future Wave 1A/1/2 token or theme change must preserve everything documented here unless explicitly approved by Ammar.

> [!warning] 🔴 GUARDRAIL DECLARATION — Ammar 2026-05-20
> **This baseline is the official guardrail.** Any future Tailwind / theme / component change MUST compare against this Light Mode Visual Baseline first and MUST NOT change the existing visual characteristics unless Ammar explicitly approves the change.
>
> **Pre-change checklist (mandatory):**
> 1. Load the 7-note baseline cluster (this note + the 6 companion notes linked in §"See also")
> 2. Read the section that documents the value you intend to touch
> 3. If your change preserves the baseline → safe; cite the matching section in PR/commit
> 4. If your change alters the baseline → **STOP**, ask Ammar with explicit citation of which value is changing and why, wait for an explicit yes
> 5. If approved → update the baseline note in the same change so the "after" state is documented
>
> **Default answer to "can I change this visual?" is NO** unless Ammar has explicitly said yes for that specific change. See [[Falcon Do Not Change Visual Rules]] for the 20 explicit lockdowns.

## 1. Purpose

Snapshot the current light-mode visual language so future agents:
- Don't accidentally regress visual identity during token refactors
- Can cite "the implemented baseline" when proposing changes
- Know which values are "the way Falcon looks today"
- Treat the baseline as locked unless given explicit approval

## 2. Current implemented behavior

### Overall visual identity

| Aspect | Value | Source |
|---|---|---|
| Look-and-feel | Modern enterprise admin: clean white surfaces, deep teal brand anchor on left rail, neutral-grey chrome, generous spacing | [CODE] `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.html:3` · `topbar.component.html:2` |
| Density | Comfortable default · compact opt-in via `[data-density="compact"]` | [CODE] `libs/falcon-ui-tokens/src/density/comfortable.css` + `compact.css` |
| Direction | LTR default · RTL via `dir="rtl"` (no separate visual scheme; logical CSS) | [CODE] `libs/falcon-ui-tokens/src/rtl/rtl.css` |
| Type system | Poppins/Inter for display · Neue Haas Grotesk for sans-latin · IBM Plex Sans Arabic for Arabic | [CODE] `falcon-tailwind-tokens.css:131-135` |
| Border-radius personality | Soft (10-14px on cards/buttons/inputs · 9999px pills only on chips) | [CODE] `button.tokens.css:83` (radius 10px) · org-hierarchy panel rounded-[14px] |

### Main surfaces

| Surface | Color (light) | Token | Where it's used |
|---|---|---|---|
| **Page canvas** | `#ffffff` | `--color-falcon-neutral-0` | Main content area inside topbar/sidebar |
| **Sub-canvas** (org-hierarchy outer section) | `#f5f6f7` | `--color-falcon-neutral-75` | The wrapper holding tree + main pane |
| **Tree panel surface** | `#f3f8f5` (light teal-tinted) | `--color-falcon-teal-50` | Falcon-Clients tree-panel aside |
| **Sidebar (left rail)** | `#0d3f44` (deep teal) | `--color-falcon-teal-700` | Permanent left navigation |
| **Topbar** | `#ffffff` | `--color-falcon-neutral-0` | Top horizontal bar |
| **Card / panel** | `#ffffff` | `--color-falcon-neutral-0` | Org-hierarchy main pane, data-table wrapper |
| **Subtle well** (hover canvas) | `#f5f7f8` | `--color-falcon-neutral-50` | Topbar icon-btn hover, kebab hover |
| **Selected row (teal-tint)** | `#eef3f4` | `--color-falcon-teal-tint` | Data-table selected row |
| **Selected client row** | `#e8f0f1` | `--color-falcon-teal-100` | Tree-panel selected root / node |

### Main text colors

| Role | Color | Token |
|---|---|---|
| Primary text | `#1a1a1a` | `--color-falcon-neutral-900` |
| Label / secondary text | `#3d3d3d` | `--color-falcon-neutral-800` |
| Muted text | `#6b7280` | `--color-falcon-neutral-600` |
| Placeholder / tertiary | `#9ca3af` | `--color-falcon-neutral-500` |
| Brand accent text | `#0d3f44` (deep teal) | `--color-falcon-teal-700` |
| Error text / required marker | `#dc2626` (red) | `--color-falcon-red-500` |
| White-on-brand (sidebar/user-menu head) | `#ffffff` | `--color-falcon-neutral-0` |

### Main brand colors (light)

| Brand role | Hex | Token | Where |
|---|---|---|---|
| **Brand primary** (sidebar, primary button, focus accent) | `#0d3f44` | `--color-falcon-teal-700` | Sidebar bg, button primary-bg, sort-icon active |
| Brand primary-hover | `#124c52` | `--color-falcon-teal-500` (or `-600`) | Button primary hover |
| Brand active/deeper | `#082a2e` | `--color-falcon-teal-900` | Sidebar nav-item active state |
| Brand soft / tree panel | `#f3f8f5` | `--color-falcon-teal-50` | Tree-panel aside |
| Selected row tint (teal-tint) | `#eef3f4` | `--color-falcon-teal-tint` | Data-table selected row |
| Selected row tint (teal-100) | `#e8f0f1` | `--color-falcon-teal-100` | Tree-panel selected client / node |
| Teal alphas (rails, edges) | `rgba(13,63,68,0.04…0.18)` | `--color-falcon-teal-alpha-04/06/08/12/18` | Tree rails, edge shadows |
| Mid accent | `#00827a` | `--color-falcon-teal-mid` | Reserved for dark accent; rarely in light |
| Cyan accent | `#2dd4d9` | `--color-falcon-cyan` | Specialty (informational chips) |

**Customer brand colors (invariant):** aramco `#0d6e0e` · bmw `#1c69d4` · rajhi `#1e4fa3` · snb `#1a6b2e` · bupa `#007bc3`. **Never remapped in dark mode** — these are customer-logo identities.

### Neutral colors (27 stops — see [[Falcon Color Palette Audit]])

| Stop | Hex | Primary use |
|---|---|---|
| 0 | `#ffffff` | Surface |
| 25 | `#fafbfc` | Data-table row hover |
| 30 | `#fafafa` | Header inline style (data-table header bg) |
| 50 | `#f5f7f8` | Generic hover well (topbar icon-btn, kebab) |
| 75 | `#f5f6f7` | Org-hierarchy outer wrapper |
| 100 | `#f1f3f5` | Row divider / subtle band |
| 150 | `#eef0f2` | Strong divider (card borders) |
| 200 | `#e5e7eb` | Border default (cards, panels, inputs) |
| 500 | `#9ca3af` | Placeholder / muted icon |
| 600 | `#6b7280` | Muted text (labels, headers) |
| 700 | `#5a6470` | Stronger text |
| 800 | `#3d3d3d` | Input label color |
| 900 | `#1a1a1a` | Primary body text |
| 950 | `#000000` | Maximum contrast (rare) |

### Border colors

| Use | Color | Token |
|---|---|---|
| Default border (cards, panels, inputs) | `#e5e7eb` | `--color-falcon-neutral-200` |
| Strong divider | `#eef0f2` | `--color-falcon-neutral-150` |
| Row divider (table) | `#f1f3f5` | `--color-falcon-neutral-100` |
| Hover border (sometimes) | `#9ca3af` | `--color-falcon-neutral-500` |
| Focus border | `#0d3f44` | `--color-falcon-teal-700` (focus accent) |
| Error border | `#dc2626` | `--color-falcon-red-500` |

### Hover colors (light mode)

| Surface | Hover bg | Source |
|---|---|---|
| Topbar icon button | `#f5f7f8` (neutral-50) | [CODE] `topbar.component.html:30` |
| Data-table row | `#fafbfc` (neutral-25) | [CODE] `data-table.tokens.css:54` |
| Tree-panel row (selectable, not selected) | `#ffffff` (neutral-0) | [CODE] `falcon-tree-panel.component.html:13` |
| Tree-panel kebab (root/per-row) | `#e8f0f1` (teal-100) | [CODE] `falcon-tree-panel.component.html:48` |
| Sidebar nav item | `rgba(255,255,255,0.06)` | [CODE] `sidebar.component.ts:177` |
| Sidebar collapse button | `rgba(255,255,255,0.20)` | [CODE] `sidebar.component.html:30` |
| User-menu item | `#f5f7f8` (neutral-50) | [CODE] `topbar.component.html:122` |
| Button secondary | `--falcon-button-secondary-bg-hover` → `#f5f7f8` | [CODE] `button.tokens.css:12` |
| Button primary | `#124c52` (teal-600 / -500) | [CODE] `button.tokens.css:90` |

### Selected colors

| Element | Selected bg | Selected text | Source |
|---|---|---|---|
| Data-table row | `#eef3f4` (teal-tint) | inherits cell | `data-table.tokens.css:55` |
| Tree-panel root row | `#e8f0f1` (teal-100) | `#0d3f44` (teal-700) | `falcon-tree-panel.component.html:12,37` |
| Tree-node child row | `#e8f0f1` (teal-100) | `#0d3f44` (teal-700) + semibold | `falcon-tree-node.component.html:20,99-101` |
| Sidebar nav-item active | `#082a2e` (teal-900) | `#ffffff` | `sidebar.component.ts:176` |
| Tabs active | (teal-700 text + bottom border) | — | `tabs.tokens.css` |

### Disabled colors

| Element | Pattern | Source |
|---|---|---|
| Button (universal) | `opacity: 0.5` + `cursor: not-allowed` | `button.tokens.css:15` |
| Input | `background: var(--falcon-input-bg-disabled)` (neutral-100 / 150 family) | `input.tokens.css` |
| Form labels | unchanged color but visual de-emphasis via opacity | per pattern |

### Shadow / elevation style

| Layer | Token (light) | Typical hex | Use |
|---|---|---|---|
| Subtle button-edge | `0 1px 2px rgba(13,63,68,0.04)` | — | `--shadow-falcon-xs` |
| Card | `0 2px 8px rgba(13,63,68,0.10)` | — | `--shadow-falcon-card` · org-hierarchy panel border + radius |
| Popover / dropdown | `0 8px 24px rgba(13,63,68,0.16)` | — | `--shadow-falcon-popover` |
| Modal / dialog | `0 20px 50px rgba(13,63,68,0.20)` | — | `--shadow-falcon-modal` |
| Focus ring | `0 0 0 3px rgba(105,142,146,0.22)` (teal-alpha) | — | `--shadow-falcon-focus` |
| Sticky-edge (sticky kebab column) | `-8px 0 8px -6px rgba(13,63,68,0.08)` | — | Data-table sticky-actions column |

### Border-radius style

| Use | Radius | Source |
|---|---|---|
| Cards / panels / app shells | `14px` | `[CODE] org-hierarchy-page-menu.component.html:84` (`rounded-[14px]`) |
| Cards / panels alt | `10px` | Button radius |
| Buttons | `10px` | `button.tokens.css:83` |
| Inputs | (per density) typically `8px` | `input.tokens.css` |
| Chips / pills | `9999px` (full pill) | Status badges |
| Small icons / row-action kebab | `2px-4px` (rounded-xs/sm) | Tree-node kebab |
| Action menu popups | `10px-14px` (rounded-2xl-ish) | `falcon-tree-panel.component.html:137` |
| Standard Tailwind `rounded-md` | `0.375rem` (6px) | Internal small surfaces |

### Spacing / density style

| Slot | Value (md) | Source |
|---|---|---|
| Button padding-x | 16px (md) | `button.tokens.css:52` |
| Button height | 38px (md) | `button.tokens.css:48` |
| Button gap (icon ↔ label) | 12px (md) | `button.tokens.css:62` |
| Input padding-x | density-token (varies) | `input.tokens.css:54` |
| Input padding-y | 8px (md) | `input.tokens.css:59` |
| Data-table cell padding | 13px × 14px | `data-table.tokens.css:48-49` |
| Data-table header padding | 0.75rem × 14px | `data-table.tokens.css:37-38` |
| Page section padding (org-hierarchy outer) | 12px / 20px (`p-3 md:p-5`) | `[CODE] org-hierarchy-page-menu.component.html:25` |
| Card gap | 16px (`gap-4`) | Various |
| Sidebar width | from `--w-sidebar` token | `sidebar.component.html:5` |
| Topbar height | from `--h-topbar` token | `topbar.component.html:2` (`h-topbar`) |

## 3. Evidence / source file references

- [CODE] [`libs/falcon-theme/src/falcon-tailwind-tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-theme/src/falcon-tailwind-tokens.css) — SSOT primitives (lines 15-200 for light values)
- [CODE] [`libs/falcon-ui-tokens/src/components/button.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/button.tokens.css) — button slot contract (38px md, 10px radius, teal-500 primary)
- [CODE] [`libs/falcon-ui-tokens/src/components/data-table.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/data-table.tokens.css) — table slot contract (13px cell padding, teal-tint selected, neutral-25 hover)
- [CODE] [`libs/falcon-ui-tokens/src/components/input.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/input.tokens.css) — input slot contract (density-driven sizing, neutral-800 label)
- [CODE] [`apps/host-shell/src/app/layout/components/sidebar/sidebar.component.html`](file://C:/Falcon/Falcon/falcon-web-platform-ui/apps/host-shell/src/app/layout/components/sidebar/sidebar.component.html) — sidebar baseline (teal-700 bg, white-alpha hover)
- [CODE] [`apps/host-shell/src/app/layout/components/topbar/topbar.component.html`](file://C:/Falcon/Falcon/falcon-web-platform-ui/apps/host-shell/src/app/layout/components/topbar/topbar.component.html) — topbar baseline (neutral-0 bg, neutral-50 hover)
- [CODE] [`apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html`](file://C:/Falcon/Falcon/falcon-web-platform-ui/apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html) — org-hierarchy page shell (neutral-75 outer, neutral-0 main)
- [CODE] [`libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html) — tree-panel baseline (teal-50 bg, teal-100 selected)

## 4. Best practice for reuse

- **Reach for existing tokens first.** If a color or spacing already has a token (`--color-falcon-*` or `--falcon-<component>-*`), use the Tailwind utility derived from it (`bg-falcon-teal-700` etc.) — do not hardcode a near-identical hex.
- **Match existing patterns.** New panels should use the same `neutral-200 border + neutral-0 bg + rounded-[14px]` recipe used by org-hierarchy main pane and other cards.
- **Honor the variant system.** Buttons get `variant="primary"` not raw `bg-falcon-teal-700` classes; data tables get `[selected]` styling via component property, not inline class hacks.
- **Keep typography aligned.** Page section headers ~18px / labels 12px / body 13-14px / table cells 12.5px — these are the canonical sizes.

## 5. Wrong patterns to avoid

- ❌ `style="background: #0d3f44"` inline (use `bg-falcon-teal-700`)
- ❌ `bg-[#0d3f44]` arbitrary value (use `bg-falcon-teal-700`)
- ❌ New rounded-radius value like `rounded-[13px]` (use existing `rounded-[14px]` for panels)
- ❌ Hover bg that's darker than the surface in light mode (always lighter or equal-with-tint)
- ❌ Reaching into customer brand colors for non-customer surfaces (aramco/bmw/rajhi/snb/bupa hex are brand IDs)
- ❌ Adding shadows to buttons (Falcon buttons use color + border + focus ring; shadows belong to cards/popovers/modals)
- ❌ Introducing a new neutral stop (the 27-stop palette is already over-granulated per [[Falcon Color Palette Audit]])

## 6. Angular-first notes

- All values documented here apply to the **Angular consumer chain** today (Angular templates → Tailwind utilities → SSOT `@theme`).
- Stencil components used inside Angular wrappers consume the same tokens via scoped CSS.
- **React/Vue future placeholders** — they will inherit the same visual baseline when wrappers ship. No separate visual scheme.

## 7. Future-agent instructions

- **Before changing any hex in this baseline:** ask Ammar.
- **Before introducing a new spacing/radius/shadow value:** check `falcon-tailwind-tokens.css` first; document a token gap if missing.
- **Before refactoring tokens (Wave 1):** ensure visual-diff CI gate is green per [[Wave 1A Readiness Closure Plan]]. The baseline documented here is what zero-pixel-diff means.
- **When inspecting a page:** treat the **Organization Hierarchy** ([[Falcon Organization Hierarchy Visual Standard]]) as the canonical reference for the page-shell pattern.

## See also

- [[Falcon Current Color Usage Map]] — token-by-token where each color lands
- [[Falcon Current Spacing Radius Shadow Map]] — spacing values + ratios
- [[Falcon Current Hover Focus State Map]] — interactive state rules
- [[Falcon Organization Hierarchy Visual Standard]] — reference page anatomy
- [[Falcon Page Visual Consistency Rules]] — page-author rules
- [[Falcon Do Not Change Visual Rules]] — strict guardrails
- [[Falcon Tailwind Theme]] — 5 governance rules
- [[Falcon Design Tokens]] — dual-system architecture
- [[Falcon Color Palette Audit]] — 27-stop neutral analysis
- [[Tailwind Falcon Alignment Scorecard]] — the 71% → 93% roadmap (Wave 1+2)
- Supporting evidence (Brain Outputs, linked only): [FALCON_THEME_AND_TAILWIND_REPORT](../../Brain%20Outputs/understanding/frontend/FALCON_THEME_AND_TAILWIND_REPORT.md)

## Tags

#type/reference #layer/frontend #layer/design #priority/critical #light-mode-baseline

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]]
