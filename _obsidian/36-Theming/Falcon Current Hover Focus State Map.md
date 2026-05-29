---
type: reference
library: "[[Tailwind CSS]]"
topic: hover-focus-state-map
priority: critical
scope: current-angular-first
mode: light-only
created: 2026-05-20
---
*** Falcon Current Hover / Focus / Active / Disabled / Selected behavior ***
*** Light mode only; documents currently-implemented interaction patterns ***

# Falcon Current Hover Focus State Map

> The full interactive behavior of Falcon today (light mode): every state-driven visual change across buttons, inputs, table rows, sidebar items, dropdowns, status chips, focus rings. **No state behavior may be changed without Ammar's approval** — these are the implemented patterns.

## 1. Purpose

Make implicit interaction rules explicit so future agents:
- Don't accidentally weaken a focus ring during a token refactor
- Know the hover-polarity rule (hover should never be DARKER than the surface in light mode)
- Treat disabled / loading / error semantics as locked

## 2. Current implemented behavior

### Button states ([CODE] [`button.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/button.tokens.css) + [`button-tailwind-classes.ts`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-core/src/tailwind/button-tailwind-classes.ts))

| Variant | Idle | Hover | Active (pressed) | Focus-visible | Disabled |
|---|---|---|---|---|---|
| **Primary** | bg `--falcon-button-primary-bg` (teal-500/700) · text white | bg `--falcon-button-primary-bg-hover` (teal-600) · text white | bg `--falcon-button-primary-bg-active` · border darker | `focus-visible:shadow-[var(--falcon-button-shadow-focus)]` (teal-alpha ring) | `opacity:0.5` + `cursor:not-allowed` |
| **Secondary** | bg white · text neutral-900 · border neutral-200 | bg neutral-50 (`#f5f7f8`) · border darker | bg darker | same focus ring | same disabled |
| **Ghost** | transparent bg · text neutral-900 | bg neutral-50 · text neutral-900 | bg slightly darker | same focus ring | same disabled |
| **Link** | transparent · text neutral-900 | text teal-700 + underline | text teal-800 | same focus ring | same disabled |
| **Danger** | bg red-500 · text white | bg red-600 (darker red) · text white | bg red-700 | red-alpha focus ring | same disabled |

**Loading state:** spinner overlay on top of variant bg; label opacity lowered. Driven by `[loading]` input.

**Transition:** `all 0.15s` (button.tokens.css spec). Light-mode hover transitions are intentionally fast so the UI doesn't feel sluggish.

### Input states ([CODE] [`input.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/input.tokens.css))

| State | Background | Border | Text | Notes |
|---|---|---|---|---|
| **Idle** | white (neutral-0) | neutral-200 (`#e5e7eb`) | neutral-900 | placeholder neutral-500 |
| **Hover** | white (no bg change) | hover border (slightly darker) | neutral-900 | minimal hover change — hovering an input shouldn't shout |
| **Focus** | white | **teal-700 border** + focus-ring shadow (teal-alpha) | neutral-900 | The ring is the dominant focus signal, not the border |
| **Error / invalid** | white | red-500 border | neutral-900 | helper text in red below |
| **Disabled** | bg-disabled (neutral-100 family) | border-disabled | neutral-500 | placeholder still visible |
| **Read-only** | bg-readonly | border-readonly | neutral-700 | distinct from disabled — value still readable, not actionable |
| **Success** | white | green-500 border | neutral-900 | rare — used for verified email/phone |

**Required marker:** red asterisk via `--falcon-input-required-color` (red-500). Appears next to label.

### Data-table states ([CODE] [`data-table.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/data-table.tokens.css))

| State | Background | Notes |
|---|---|---|
| **Row idle** | transparent (inherits container white) | text neutral-900 |
| **Row hover** | `#fafbfc` (neutral-25) — barely-visible warm white | text unchanged |
| **Row selected** | `#eef3f4` (teal-tint) | text unchanged or accent |
| **Row on-path** (tree-panel hover-chain) | rail tint via teal-alpha | not a row bg change |
| **Sort icon idle** | neutral-400 (`#c7ced4`) | column header chevron |
| **Sort icon active** | teal-700 (`#0d3f44`) | bold accent |
| **Sticky-actions column** | white + edge shadow `-8px 0 8px -6px rgba(13,63,68,0.08)` | Visual separator from scrolling body |
| **Row-action kebab idle** | bg white · text neutral-600 muted · `opacity-0` | Reveals on row hover |
| **Row-action kebab hover** | bg teal-100 · text teal-700 | |

### Sidebar nav-item states ([CODE] [`sidebar.component.ts:171-181`](file://C:/Falcon/Falcon/falcon-web-platform-ui/apps/host-shell/src/app/layout/components/sidebar/sidebar.component.ts))

| State | Background | Text | Source |
|---|---|---|---|
| **Idle** | `bg-transparent` | `text-white/[0.82]` | line 177 |
| **Hover** | `hover:bg-white/[0.06]` | `hover:text-white` | line 177 |
| **Active (current page)** | `bg-falcon-teal-900` (`#082a2e`) | `text-white` | line 176 |
| **Active hover** | (no change — stays teal-900) | white | |
| **Focus** | (no explicit focus-visible ring today — Wave 1 fix) | | gap |

**Collapse button states** ([CODE] `sidebar.component.html:30`):
- Idle: `bg-white/10 text-white`
- Hover: `bg-white/20`
- Focus: browser default (gap — should add `focus-visible:[box-shadow:var(--shadow-falcon-focus)]`)

### Topbar states ([CODE] [`topbar.component.html`](file://C:/Falcon/Falcon/falcon-web-platform-ui/apps/host-shell/src/app/layout/components/topbar/topbar.component.html))

| Element | Idle | Hover |
|---|---|---|
| Icon button (search/bell/theme) | `bg-transparent text-falcon-neutral-800` | `hover:bg-falcon-neutral-50` |
| User chip | `bg-transparent` | `hover:bg-falcon-neutral-50` |
| User-menu item | `bg-transparent text-falcon-neutral-900` | `hover:bg-falcon-neutral-50` |
| Notification badge dot | `bg-falcon-red-500 border-2 border-white` (constant) | (no state) |
| Mood-toggle active button | `bg-white text-falcon-teal-700` | — |
| Mood-toggle inactive button | `text-white/60` (on teal-700 chip bg) | — |

### Tree-panel states ([CODE] [`falcon-tree-panel.component.html`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html) + [`falcon-tree-node.component.html`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.html))

| Element | Idle | Hover | Selected |
|---|---|---|---|
| Root row | transparent | `hover:bg-falcon-neutral-0` (white) | `bg-falcon-teal-100` |
| Tree node row | transparent | `hover:bg-falcon-neutral-0` | `bg-falcon-teal-100` + name turns `text-falcon-teal-700 font-semibold` |
| Tree row on-path | rail tint via teal-alpha | (no bg change) | — |
| Chevron idle | `text-[var(--text-muted,#6b7280)]` | `hover:bg-falcon-neutral-50 hover:text-falcon-teal-700` | — |
| Chevron expanded | `text-falcon-teal-700` | (same hover) | — |
| Root kebab idle | `bg-transparent text-muted` `opacity-0` | `hover:bg-falcon-teal-100 hover:text-falcon-teal-700` `opacity-100` | — |
| Row-action kebab idle | `bg-white text-muted` `opacity-0` | `hover:bg-falcon-teal-100 hover:text-falcon-teal-700` `opacity-100` | reveals on row hover |

**Hover polarity rule (CRITICAL):** in light mode, hover bg is always LIGHTER (white / neutral-0) than the surface. In dark mode (per [[Falcon Light Mode Visual Baseline]] — out of scope here), this polarity must flip. The current light pattern: surface `bg-falcon-teal-50` (tree-panel) → hover `bg-falcon-neutral-0` (pure white).

### Dropdown states (per dropdown.tokens.css)

| State | Trigger bg | Trigger border | Panel |
|---|---|---|---|
| Idle | white | neutral-200 | hidden |
| Hover | white | neutral-300 (slightly darker) | — |
| Open (active) | white | teal-700 | panel visible with shadow-popover |
| Focused | white | teal-700 | focus ring |
| Disabled | bg-disabled | neutral-200 | — |
| Option hover (in panel) | teal-option (`#f1f6f6`) | — | — |
| Option selected | teal-100 + text teal-700 | — | — |

### Status chip / tag behavior

| Severity | Background | Text | Source |
|---|---|---|---|
| Success (active) | `bg-falcon-green-100` (`#dfece6`) | `text-falcon-green-700` (`#0f7a3a`) | falcon-status-badge |
| Error / danger | `bg-falcon-red-100` (`#fde2e4`) | `text-falcon-red-700` (`#a1191d`) | |
| Warning | `bg-falcon-amber-50` (`#ffeccb`) | `text-falcon-amber-700` (`#a85a00`) | |
| Info | (lighter blue family) | `text-falcon-blue-500` (`#0ea5e9`) | |
| Neutral / default | `bg-falcon-neutral-100` | `text-falcon-neutral-700` | |

Pill shape (`rounded-full`). No hover (chips are display-only).

### Focus-visible rules — what's documented today

Falcon uses **token-driven focus rings** but they're inconsistently applied across components.

| Component | Focus-visible | Pattern |
|---|---|---|
| Button (all variants) | ✅ `focus-visible:shadow-[var(--falcon-button-shadow-focus)]` | Teal-alpha ring 3px |
| Input | ✅ `--falcon-input-shadow-focus` | Teal-alpha ring + teal-700 border |
| Dropdown trigger | ✅ Same focus-ring pattern | Teal-alpha |
| Sidebar nav-item | ❌ **No explicit focus-visible** (uses browser default) | gap |
| Sidebar collapse button | ❌ No explicit focus-visible | gap |
| Topbar icon button | ❌ No explicit focus-visible | gap |
| User-menu item | ❌ No explicit focus-visible | gap |
| Tree-row + tree-node | ❌ No explicit focus-visible | gap (`<div>` with click handler — not focusable) |
| Tree kebab buttons | ❌ No explicit focus-visible | gap |

🟡 **Gap surface for Wave 1+2:** standardize focus rings across all interactive elements via the existing `--shadow-falcon-focus` + `--shadow-falcon-focus-strong` tokens. This is documented in [[Tailwind Falcon Alignment Scorecard]].

### Disabled behavior (universal pattern)

- `opacity: 0.5` + `cursor: not-allowed` — applied via Tailwind `disabled:opacity-50 disabled:cursor-not-allowed` OR via component contract slot `--falcon-X-opacity-disabled`
- Form inputs additionally darken/replace bg via `bg-disabled` token
- Buttons: same `opacity-0.5` (per button.tokens.css:15)
- Tree rows: `cursor-pointer` removed when `nodesSelectable === false`; click handler dropped

### Loading behavior

- Buttons: spinner overlay; label opacity dropped; `disabled` interaction applied
- Wizards: `submit` button shows spinner during async save
- Data tables: loading overlay `rgba(255,255,255,0.7)` (P3-02 — hardcoded today, should be tokenized)

### Error / validation behavior

- Form inputs: red-500 border + helper text in red + red required marker
- Wizard step: error icon next to step name (driven by `step.status`, partial — see P0-12)
- Form-level: toast or inline error per design

### Expanded behavior

- Accordion item open: chevron rotates 180° (or 90° → 0° depending on direction) + content reveals
- Tree node expanded: chevron rotates 90° via `[class.rotate-90]` + text accents to teal-700
- Tabs active: underline + bold + teal text

## 3. Evidence / source file references

- [CODE] [`button-tailwind-classes.ts`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-core/src/tailwind/button-tailwind-classes.ts) — per-variant state class strings
- [CODE] [`button.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/button.tokens.css), [`input.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/input.tokens.css), [`data-table.tokens.css`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon-ui-tokens/src/components/data-table.tokens.css) — state-by-state slots
- [CODE] [`sidebar.component.ts`](file://C:/Falcon/Falcon/falcon-web-platform-ui/apps/host-shell/src/app/layout/components/sidebar/sidebar.component.ts), [`topbar.component.html`](file://C:/Falcon/Falcon/falcon-web-platform-ui/apps/host-shell/src/app/layout/components/topbar/topbar.component.html), [`falcon-tree-panel.component.html`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.html), [`falcon-tree-node.component.html`](file://C:/Falcon/Falcon/falcon-web-platform-ui/libs/falcon/src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.html)

## 4. Best practice for reuse

- **Every interactive component must define hover + focus-visible + active + disabled + dark.** See the 9-state contract in [[Falcon Component Theme Contract]].
- **Focus rings:** ALL interactive elements should use `focus-visible:[box-shadow:var(--shadow-falcon-focus)]` or `--shadow-falcon-focus-strong` (the only difference is intensity).
- **Hover polarity:** in light mode, hover bg goes LIGHTER (toward white) on dark surfaces, or stays neutral on white surfaces. Never darker than surface.
- **Transition:** `transition-colors duration-150` for color changes; `transition-all 150ms` only for full-button hover with multiple properties.

## 5. Wrong patterns to avoid

- ❌ Hover bg darker than surface in light mode (e.g., `hover:bg-falcon-neutral-200` on a white card — wrong polarity)
- ❌ Removing `focus-visible:` ring during a refactor (a11y regression)
- ❌ Skipping the `disabled:opacity-50 cursor-not-allowed` pair — accessibility relies on both visual and pointer feedback
- ❌ Adding a hover for chips/badges — display-only by design
- ❌ Custom `transition-duration` per element (use `duration-150` standard)
- ❌ `box-shadow: 0 0 0 2px ...` arbitrary focus ring (use `--shadow-falcon-focus` token)

## 6. Angular-first notes

- All states implemented today consume Tailwind utilities OR `*-tailwind-classes.ts` helpers. Stencil components use the same patterns internally via scoped CSS.
- Reactive forms feed `aria-invalid` (or `[class.invalid]`) — `<falcon-angular-input>` listens via CVA.
- Disabled state propagated via `[disabled]` Angular input → forwarded to Stencil `@Prop()`.
- Loading state: `[loading]` Angular input → Stencil component handles spinner overlay.

## 7. Future-agent instructions

- **Don't change hover/focus/active/disabled colors without explicit Ammar approval.** These are the implemented baseline.
- **Wave 1 fix:** standardize focus-visible across sidebar / topbar / tree (gaps documented above).
- **Wave 2 fix:** loading overlay hardcoded rgba → tokenize per P3-02.
- **For new components:** copy the 9-state contract from button or input — these are the gold-standard interactive contracts.

## See also

- [[Falcon Light Mode Visual Baseline]] · [[Falcon Current Color Usage Map]] · [[Falcon Current Spacing Radius Shadow Map]]
- [[Falcon Organization Hierarchy Visual Standard]] · [[Falcon Component Theme Contract]]
- [[Tailwind States and Variants]] — Tailwind upstream variant catalog
- [[Tailwind Falcon Alignment Scorecard]] — gap surface for focus-ring standardization

## Tags

#type/reference #layer/frontend #layer/design #light-mode-baseline #interactive-states

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
