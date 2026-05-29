---
type: reference
library: "[[Tailwind CSS]]"
topic: spacing-radius-shadow-map
priority: critical
scope: current-angular-first
mode: light-only
created: 2026-05-20
---
*** Falcon Current Spacing / Radius / Shadow Map ***
*** Documents currently-implemented values; no edits this turn ***

# Falcon Current Spacing, Radius, Shadow Map

> Every dimensional value Falcon uses today (light mode), with source citation. These are the values that define Falcon's "comfortable density" and "soft modern" feel.

## 1. Purpose

Capture the implemented spacing / radius / shadow vocabulary so future agents reuse instead of inventing. Wave 1+2 token work must preserve these unless explicitly approved.

## 2. Current implemented behavior

### Page-level spacing

| Surface | Padding | Source |
|---|---|---|
| App shell (outside topbar/sidebar) | flex flex-col / flex-1 min-h-0 layout | host-shell layout |
| Org-hierarchy outer section | `p-3 md:p-5` (12px / 20px) | [CODE] `org-hierarchy-page-menu.component.html:25` |
| Card / panel internal padding | `px-[18px] py-[14px]` (Users header) or `p-5` (main pane) | Various |
| Page header band | `ps-5 pe-2 pt-1 border-b border-falcon-neutral-150` | `org-hierarchy-page-menu.component.html:121` |
| Main content | `mx-5 mb-6` then `border border-falcon-neutral-200 rounded-md` | Org-hierarchy main sections |

### Component spacing (per component-token contract)

#### Button ([`button.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/button.tokens.css))

| Property | sm | md (default) | lg |
|---|---|---|---|
| Height | 34px | 38px | 44px |
| Padding-x | 18px | 16px | 20px |
| Gap (icon ↔ label) | 6px | 12px | 14px |
| Font-size | 12.5px | 13px | 14px |

#### Input ([`input.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/input.tokens.css))

| Property | sm | md | lg |
|---|---|---|---|
| Height | (density-driven) | (density-driven) | (density-driven) |
| Padding-x | density-token | density-token | density-token |
| Padding-y | 6px | 8px | 10px |
| Font-size | 12px | 13px | 14px |
| Line-height | 1.5 (all) | | |

Density tokens live in [CODE] `libs/falcon-ui-tokens/src/density/comfortable.css` (default) + `compact.css`.

#### Data table ([`data-table.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/data-table.tokens.css))

| Slot | Value |
|---|---|
| Header padding-y | `var(--spacing-3, 0.75rem)` (12px) |
| Header padding-x | `14px` |
| Cell padding-y | `13px` |
| Cell padding-x | `14px` |
| Row height (header/row/footer all share) | `--falcon-table-row-height` token (introduced 2026-05-19) |
| Paginator padding-y | `6px` |
| Paginator padding-x | `var(--spacing-3, 0.75rem)` |
| Paginator gap | `var(--spacing-2, 0.5rem)` (8px) |

#### Sidebar

| Slot | Value | Source |
|---|---|---|
| Section label padding | `px-3 pt-4 pb-1.5` | `sidebar.component.ts:167` |
| Nav-item padding | `px-2.5 py-[9px]` (full) or `p-2.5 justify-center` (collapsed) | `sidebar.component.ts:179` |
| Nav-item gap | `gap-2.5` (10px) | `sidebar.component.ts:174` |
| Footer padding-top | `pt-2.5` | `sidebar.component.html:115` |
| Footer padding-bottom | `pb-5` | `sidebar.component.html:115` |

#### Topbar

| Slot | Value | Source |
|---|---|---|
| Height | `h-topbar` (token-driven) | `topbar.component.html:2` |
| Padding-x | `px-6` | `topbar.component.html:2` |
| Gap (actions) | `gap-6` (24px) | `topbar.component.html:2` |
| Icon button | `size-[38px] rounded-[10px]` | `topbar.component.html:30,41,61` |
| Topbar actions block | `gap-[18px]` | `topbar.component.html:27` |

#### Tree panel ([CODE] `falcon-tree-panel.component.html`)

| Slot | Value |
|---|---|
| Root row padding | `ps-4 pe-row-action-inset py-3` |
| Section label padding | `pt-3 px-4 pb-1.5` |
| Tree row padding | `py-row-pad-y ps-row-pad-x pe-row-action-inset` (token-driven) |
| Tree row gap | `gap-row-gap` (token-driven) |
| Min row height | `min-h-row-h` (token-driven) |

### Gaps

| Use | Value |
|---|---|
| Card grid (responsive) | `gap-4` (16px) |
| Toolbar buttons | `gap-3` (12px) |
| Page section vertical stack | `gap-4` to `gap-6` |
| Sidebar nav items | `gap-2.5` (10px) |
| Topbar actions | `gap-[18px]` |

### Border radius (current vocabulary)

| Use | Radius | Source |
|---|---|---|
| App panels / cards (large surfaces) | **14px** `rounded-[14px]` | `org-hierarchy-page-menu.component.html:84` · `falcon-tree-panel.component.html:2` |
| Buttons | **10px** | `button.tokens.css:83` |
| Topbar icon buttons | **10px** `rounded-[10px]` | `topbar.component.html:30` |
| User chip | **12px** `rounded-xl` | `topbar.component.html:83` |
| User-menu container | **14px** `rounded-[14px]` | `topbar.component.html:105` |
| Inputs (per density) | typically **6-8px** | `input.tokens.css` |
| Status badge / tag pill | **9999px** `rounded-full` | Status badge |
| Tree-row + small surfaces | `rounded-sm` (2px) or `rounded-xs` (1px) | Tree-node row |
| Chevron / kebab | `rounded-xs` (1px) | `falcon-tree-node.component.html:63,115` |
| Avatar circle | `rounded-full` | `topbar.component.html:87` |
| Logo circle | `rounded-full` | `falcon-tree-node.component.html:79` |
| Sub-node initials chip | `rounded-full` | `falcon-tree-node.component.html:91` |
| Standard Tailwind `rounded-md` | 6px (0.375rem) | Tree-panel popup, action menu |

### Shadow / elevation (from SSOT `@theme`)

| Use | Token | Light value | Source |
|---|---|---|---|
| Subtle (xs) | `--shadow-falcon-xs` | `0 1px 2px rgba(13,63,68,0.04)` | `falcon-tailwind-tokens.css` |
| Card (sm) | `--shadow-falcon-sm` | minor | |
| Card | `--shadow-falcon-card` | `0 2px 8px rgba(13,63,68,0.10)` | |
| Popover | `--shadow-falcon-popover` | `0 8px 24px rgba(13,63,68,0.16)` | Menu popups |
| Menu | `--shadow-falcon-menu` | similar to popover | `falcon-tree-panel.component.html:137` |
| Drawer | `--shadow-falcon-drawer` | side-anchored shadow | |
| Modal | `--shadow-falcon-modal` | `0 20px 50px rgba(13,63,68,0.20)` | |
| User menu | `shadow-[0_20px_50px_rgba(0,0,0,0.15)]` (inline) | `topbar.component.html:105` |
| Sticky-action edge shadow (data-table) | `shadow-[-8px_0_8px_-6px_rgba(13,63,68,0.08)]` (inline) | Tree-node kebab |
| Focus ring | `--shadow-falcon-focus` | `0 0 0 3px rgba(105,142,146,0.22)` | Buttons, inputs |
| Focus ring strong | `--shadow-falcon-focus-strong` | `0 0 0 2px ...` | Sidebar focus |
| Danger focus | `--shadow-falcon-danger-focus` | red alpha ring | Danger button |

### Sticky / z-index

| Layer | Z-index | Source |
|---|---|---|
| Sidebar | sticky · z-40 (per token) | `sidebar.component.html:3` |
| Topbar | sticky · z-50 (per token) | |
| Menu popup | `z-[9999]` | `falcon-tree-panel.component.html:137` |
| User menu | `z-[200]` | `topbar.component.html:105` |
| Skeleton overlay | `z-10` | `org-hierarchy-page-menu.component.html:27` |
| Notification badge dot | (inside icon-btn) | `topbar.component.html:48` |

## 3. Evidence / source file references

- [CODE] [`libs/falcon-theme/src/falcon-tailwind-tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-theme/src/falcon-tailwind-tokens.css) — spacing / radius / shadow primitives
- [CODE] [`libs/falcon-ui-tokens/src/density/comfortable.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/density/comfortable.css) — default density values
- [CODE] [`button.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/button.tokens.css), [`input.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/input.tokens.css), [`data-table.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/data-table.tokens.css)
- [CODE] [`sidebar.component.ts`](file://C:/Falcon/Falcon/falcon-web-platform-ui/apps/host-shell/src/app/layout/components/sidebar/sidebar.component.ts), [`topbar.component.html`](file://C:/Falcon/Falcon/falcon-web-platform-ui/apps/host-shell/src/app/layout/components/topbar/topbar.component.html), [`org-hierarchy-page-menu.component.html`](file://C:/Falcon/Falcon/falcon-web-platform-ui/apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html)

## 4. Best practice for reuse

- **Card / panel:** use `bg-falcon-neutral-0 border border-falcon-neutral-200 rounded-[14px]` (the org-hierarchy main pane pattern)
- **Sub-canvas wrapper:** use `bg-falcon-neutral-75 p-3 md:p-5` (the org-hierarchy outer pattern)
- **Page header band:** `ps-5 pe-2 pt-1 border-b border-falcon-neutral-150` (Users title band)
- **Internal section gap:** `gap-4` (16px); larger gaps for hero-style: `gap-6` (24px)
- **Tab / toolbar gap:** `gap-3` (12px)
- **Button gap with icon:** `gap-2` (8px) or `gap-2.5` (10px) for sm
- **Icon size in topbar/sidebar:** 18px stroke (per `<svg width="18">` patterns)

## 5. Wrong patterns to avoid

- ❌ New rounded value (`rounded-[13px]`, `rounded-[11px]`) — use existing 10px / 14px / 9999px
- ❌ New padding combo (`px-[17px] py-[11px]`) — use density tokens
- ❌ Shadow on a button (Falcon buttons use color/border/focus ring instead)
- ❌ `gap-[7px]` arbitrary — use Tailwind's `gap-*` scale
- ❌ Fixed `width: 320px` — use `w-sidebar` token or container queries
- ❌ Hardcoded `padding: 13px 14px` in CSS — use the `--falcon-data-table-cell-*` slots

## 6. Angular-first notes

- All values consumed by Angular templates (the active app surface). Stencil components internally consume the same tokens via scoped CSS.
- Density toggle (`[data-density="compact"]`) is set at app root; **don't override per-component**.
- React/Vue future placeholders inherit the same density model unchanged.

## 7. Future-agent instructions

- **Before introducing a new dimensional value:** check whether an existing token in [CODE] `falcon-tailwind-tokens.css` (lines 181-250 for sizing) already covers it.
- **For new components:** copy the dimensional vocabulary from a similar existing component's `*.tokens.css` (button → confirm-dialog → drawer pattern reuse).
- **Document gaps**, don't hardcode. Per [[Falcon Tailwind Theme]] Rule 3.

## See also

- [[Falcon Light Mode Visual Baseline]] · [[Falcon Current Color Usage Map]] · [[Falcon Current Hover Focus State Map]] · [[Falcon Organization Hierarchy Visual Standard]]
- [[Tailwind Spacing Radius Shadow Borders]] — Tailwind upstream reference
- [[Tailwind Sizing and Responsive]] — sizing rules

## Tags

#type/reference #layer/frontend #layer/design #light-mode-baseline

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
