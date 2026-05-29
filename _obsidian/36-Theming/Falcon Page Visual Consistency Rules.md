---
type: rule
library: "[[Tailwind CSS]]"
topic: page-visual-consistency-rules
priority: critical
scope: current-angular-first
mode: light-only
created: 2026-05-20
---
*** Falcon Page Visual Consistency Rules — for any agent creating or changing a Falcon page ***
*** Angular-first; React/Vue future placeholders only ***
*** No code changes triggered by this note; it is a rulebook ***

# Falcon Page Visual Consistency Rules

> Rules for any agent — human or AI — that creates a new page or modifies an existing one. These rules preserve the Falcon visual identity captured in [[Falcon Light Mode Visual Baseline]] and prevent each page from drifting into its own style.

## 1. Purpose

Make page-building deterministic so:
- Two pages built by two agents look like they're part of the same product
- Token / theme refactors don't have to chase per-page hacks
- New pages auto-inherit the work already invested in baseline tokens, components, and patterns

## 2. The 12 page-building rules

### Rule 1 — Reuse existing Falcon components first

**Always** reach for `<falcon-angular-*>` components before writing a raw HTML element:
- Buttons → `<falcon-angular-button variant="primary|secondary|link|danger|ghost" size="sm|md|lg">`
- Inputs → `<falcon-angular-input>`, `<falcon-angular-dropdown>`, `<falcon-angular-multi-select>`, `<falcon-angular-date-picker>`, `<falcon-angular-checkbox>`, `<falcon-angular-radio>`, `<falcon-angular-switch>`, `<falcon-angular-textarea>`
- Data → `<falcon-angular-data-table>`, `<falcon-angular-tabs>`, `<falcon-angular-tree>` (via `<falcon-tree-panel>` for the org-hierarchy-style rail)
- Overlays → `<falcon-angular-popup>`, `<falcon-angular-drawer>`, `<falcon-angular-tooltip>`, `<falcon-angular-toast>`
- Display → `<falcon-angular-status-badge>`, `<falcon-angular-avatar>`, `<falcon-angular-loader>`

If the component already exists in `libs/falcon-ui-core/src/angular-wrapper/components/`, never re-implement it inline.

### Rule 2 — Reuse existing visual patterns

The Falcon "page recipe" is:
- Outer wrapper: `bg-falcon-neutral-75 flex flex-col gap-4 p-3 md:p-5 h-full min-h-0`
- Card / pane: `bg-falcon-neutral-0 border border-falcon-neutral-200 rounded-[14px]`
- Tab bar: `border-b border-falcon-neutral-150`
- Data table wrapper: `border border-falcon-neutral-200 rounded-md`
- Section header: `<falcon-node-details-section>` with avatar + actions slots
- Modal body: `mx-5 mb-6` consistent inset

Use these recipes verbatim. See [[Falcon Organization Hierarchy Visual Standard]] for the canonical reference page.

### Rule 3 — Do not invent new colors

If a color does not exist as `--color-falcon-*` in `falcon-tailwind-tokens.css`, do not introduce it. Options when you "need" a new color:
1. Use an existing token at a different intensity (e.g., `falcon-teal-100` instead of mixing a new `#e8f0f1`)
2. Document a token gap in [[Falcon Color Palette Audit]] and wait for Ammar to add the token
3. Use a teal-alpha (`--color-falcon-teal-alpha-04..18`) if the need is a softer wash

**Wrong:**
```html
<div class="bg-[#f1f6f6]">…</div>          <!-- arbitrary value -->
<div style="background: #f1f6f6">…</div>   <!-- inline hex -->
```

**Right:**
```html
<div class="bg-falcon-teal-50">…</div>     <!-- token-mapped utility -->
```

### Rule 4 — Do not invent new spacing values

Spacing is rationed by the design tokens in [[Falcon Current Spacing Radius Shadow Map]]. The canonical scale: `0`, `1` (4px), `2` (8px), `3` (12px), `4` (16px), `5` (20px), `6` (24px), `8` (32px), `10` (40px). Use Tailwind utilities (`p-3`, `gap-4`, `mt-2`, etc.) sourced from this scale.

**Wrong:** `p-[13px]`, `gap-[18px]`, `mt-[7px]` — arbitrary values that won't survive a future spacing refactor.

**Right:** `p-3 md:p-5`, `gap-4`, `mt-2` — utility-derived.

### Rule 5 — Do not invent new border-radius values

The Falcon radius vocabulary is:
| Use | Class |
|---|---|
| Cards / panels / app shells | `rounded-[14px]` |
| Buttons | `rounded-md` (via component contract — do not override) |
| Inputs | `rounded-md` (via component contract — do not override) |
| Data-table wrappers | `rounded-md` |
| Chips / pills | `rounded-full` |
| Small kebab/icon buttons | `rounded-xs` or `rounded-sm` |
| Action menu popups | `rounded-2xl`-ish (10-14px) |

**Wrong:** `rounded-[13px]`, `rounded-[15px]`, custom one-off radii.

**Right:** Pick from the vocabulary above.

### Rule 6 — Do not redesign component visuals in page code

If a page needs a button to look different, the answer is **not** to override the button's classes in page CSS. The answer is one of:
1. Use a different existing variant (e.g., `variant="secondary"` instead of `variant="primary"`)
2. Use a different existing size (`size="sm"` vs `size="md"`)
3. Document the gap (e.g., "we need a `variant="tertiary"`") and let the component team add it via the component token contract

**Wrong:**
```html
<falcon-angular-button class="!bg-red-500 !rounded-full !h-12">…</falcon-angular-button>
```

**Right:**
```html
<falcon-angular-button variant="danger" size="md">…</falcon-angular-button>
```

### Rule 7 — Match existing typography scale

Falcon canonical type sizes (per Tailwind `text-*`):
- Body / form labels: `text-sm` (14px) or `text-base` (16px depending on density)
- Table cells: `text-xs` (12px) → `text-sm` (14px)
- Section labels (e.g., "Falcon Clients"): `text-2xs` (10-11px) + `tracking-label`
- Page section headers: ~18px (per anonymous `text-lg` or scale-mapped utility)
- Muted text: `text-falcon-neutral-600`
- Brand-accent text: `text-falcon-teal-700`

**Wrong:** `text-[13.5px]` arbitrary value.

**Right:** Pick from the existing scale and let density tokens adjust at runtime.

### Rule 8 — If a visual need is missing, document a token/component gap

When you genuinely need a new color, spacing, radius, or component:
1. Add a gap entry to [[Tailwind Falcon Alignment Scorecard]] (the canonical gap log)
2. Stop. Do not invent inline.
3. Wait for Ammar to add the token/component via the proper SSOT pipeline.

**The right behavior:** "I need a `falcon-teal-25` token for this hover state — logging gap, holding the work."

**The wrong behavior:** "I'll just use `bg-[#f7fafa]` for now."

### Rule 9 — Preserve light-mode baseline unless Ammar approves change

The values documented in [[Falcon Light Mode Visual Baseline]] are the locked baseline. A new page must not change:
- The `bg-falcon-neutral-75` page-canvas
- The `bg-falcon-neutral-0` card / main-pane bg
- The `border-falcon-neutral-200` border on cards
- The `rounded-[14px]` panel-radius
- The `--shadow-falcon-card` elevation
- Any of the hover / focus / selected colors documented in [[Falcon Current Hover Focus State Map]]

If a page genuinely needs a different baseline (rare), ask Ammar before changing it.

### Rule 10 — Use the page-shell pattern for full-page features

Every full-page feature follows the **org-hierarchy recipe**:
1. `<section>` outer wrapper with `bg-falcon-neutral-75 p-3 md:p-5 h-full min-h-0 flex flex-col`
2. (Optional) left rail card via `bg-falcon-teal-50 border-falcon-neutral-200 rounded-[14px]`
3. Main pane card via `bg-falcon-neutral-0 border-falcon-neutral-200 rounded-[14px] overflow-hidden flex flex-col min-h-0`
4. Tab bar inside main pane with `border-b border-falcon-neutral-150`
5. Section header via `<falcon-node-details-section>` (or equivalent)
6. Content area below — same `rounded-md` card recipe for data tables, info panels, settings panels

This recipe is verified live in [[Falcon Organization Hierarchy Visual Standard]].

### Rule 11 — Respect density and direction tokens

The page must work in:
- `[data-density="comfortable"]` (default) AND `[data-density="compact"]`
- `dir="ltr"` (default) AND `dir="rtl"`

This means:
- Use logical properties (`ps-*` / `pe-*` instead of `pl-*` / `pr-*`) when the visual is directional
- Don't hardcode pixel sizes that block density from re-rationing them
- Don't assume left = start; use `start` / `end` semantics

### Rule 12 — Match the focus / hover / active interaction patterns

Every interactive element must implement the 5 states documented in [[Falcon Current Hover Focus State Map]]:
- Idle (default)
- Hover (lighter or tint-of-surface in light mode)
- Active (pressed) — slightly deeper than hover
- Focus-visible — token-driven ring (`--shadow-falcon-focus` / `-focus-strong`)
- Disabled — `opacity-50` + `cursor-not-allowed`

Buttons and inputs already give you this for free via component variants. Custom interactive elements (e.g., a clickable card) must add these manually.

## 3. Evidence / source file references

- [VAULT] [[Falcon Light Mode Visual Baseline]]
- [VAULT] [[Falcon Current Color Usage Map]]
- [VAULT] [[Falcon Current Spacing Radius Shadow Map]]
- [VAULT] [[Falcon Current Hover Focus State Map]]
- [VAULT] [[Falcon Organization Hierarchy Visual Standard]]
- [VAULT] [[Falcon Tailwind Theme]] — the 5 governance rules
- [VAULT] [[Falcon Design Tokens]] — dual-system architecture
- [VAULT] [[Falcon Component Audit Scorecard]] — the 60-component audit (which components exist and how clean they are)
- [CODE] `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` — canonical reference page

## 4. Best practice for reuse

- **Open the canonical reference first.** Before building, open [[Falcon Organization Hierarchy Visual Standard]] + the live org-hierarchy screen and pattern-match.
- **Audit your page after building.** Walk through the 12 rules — does each row pass?
- **Score against the baseline.** Use [[Tailwind Falcon Alignment Scorecard]] to grade your page against the same axes Falcon uses for the whole product.

## 5. Wrong patterns to avoid

(See each numbered rule's "Wrong" example above. Top recurring offenders:)
1. Inline `style="background: #..."`
2. `bg-[#hex]` arbitrary values
3. Custom radius (`rounded-[13px]`)
4. Custom spacing (`p-[7px]`)
5. Per-page button override (`!bg-...` `!rounded-...`)
6. Per-page card without the `border-falcon-neutral-200 rounded-[14px]` recipe
7. Skipping focus-visible (a11y regression)
8. Building a new tree panel instead of reusing `<falcon-tree-panel>`
9. Building a new data table instead of `<falcon-angular-data-table>`
10. Forgetting `[data-density]` / `dir="rtl"` testing

## 6. Angular-first notes

- All rules apply to **Angular consumers** today (`apps/admin-console`, `apps/host-shell`, `apps/management-console`).
- Stencil components used inside Angular wrappers already follow these rules internally.
- React/Vue future placeholders: when wrappers ship, they MUST honor the same rules. No separate visual scheme.

## 7. Future-agent instructions

- **Before writing a single line of page HTML:** open this note + [[Falcon Light Mode Visual Baseline]] + [[Falcon Organization Hierarchy Visual Standard]].
- **Before introducing any new color/spacing/radius:** confirm no existing token covers it; if not, log a gap.
- **Before customizing a Falcon component:** confirm no existing variant/size/prop covers it; if not, log a component gap.
- **Before merging a new page:** walk through the 12 rules + diff against the canonical reference page.
- **If unsure:** ask Ammar. Don't guess.

## See also

- [[Falcon Light Mode Visual Baseline]] · [[Falcon Current Color Usage Map]] · [[Falcon Current Spacing Radius Shadow Map]] · [[Falcon Current Hover Focus State Map]]
- [[Falcon Organization Hierarchy Visual Standard]] — the canonical reference page
- [[Falcon Do Not Change Visual Rules]] — strict guardrails complementing this note
- [[Falcon Tailwind Theme]] · [[Falcon Design Tokens]] · [[Falcon Component Theme Contract]]
- [[Tailwind Falcon Alignment Scorecard]] — gap surface
- [[Falcon Component Audit Scorecard]] — 60-component audit

## Tags

#type/rule #layer/frontend #layer/design #priority/critical #light-mode-baseline #page-rules

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
