---
ruleId: R-FE-008
name: Grid first — flexbox only for inline alignment
category: layout
scope:
  apps:
    - admin-console
    - host-shell
    - management-console
  paths:
    - "apps/**/*.html"
    - "libs/**/*.html"
  exemptPaths:
    - "libs/falcon-ui-core/**"
    - "**/*.spec.ts"
severity: should
detector:
  type: semantic-llm
  patterns:
    - 'flex flex-col gap-* on a page-shell, section, form, or card-list container'
    - 'flex-wrap on a multi-column layout'
    - 'nested flex containers building a 2D layout'
  exemptPatterns:
    - 'flex items-center gap-2 on an icon + label cluster'
    - 'flex inside a single row with ≤3 inline elements'
  description: Hybrid detector — regex pre-pass finds flex containers, semantic-LLM judges whether each is "inline alignment" (allowed) or "two-dimensional layout" (should be grid). Page shells, sections, forms, and card lists must use grid + grid-cols-* + gap-*.
autoFix:
  available: false
  riskLevel: medium
  patchHint: 'Replace flex flex-col with grid + grid-cols-1 + gap-*; replace flex-wrap layouts with grid grid-cols-{n} or grid-cols-{breakpoint}-{n}; keep flex items-center for icon+label clusters only.'
relatedRules:
  - R-FE-004
source:
  - file: feedback_tailwind_grid_first.md
    location: memory
firstAuthored: 2026-05-16
lastUpdated: 2026-05-16
type: code-rule
status: active
---

*** Rule R-FE-008 — Tailwind CSS Grid is the default layout primitive ***
*** Source: feedback_tailwind_grid_first (2026-04-18) ***
*** Detector: semantic-llm (regex pre-pass + judgment) ***

# R-FE-008 — Grid first — flexbox only for inline alignment

## What it says

In the Falcon frontend, Tailwind **CSS Grid** is the default layout primitive. Every page shell, section container, form, card list, and data panel uses `grid` + `grid-cols-*` + `gap-*` — not `flex`. Flexbox is reserved for small inline alignment tasks (button icon + label, form label + input, breadcrumb chips). Spacing always uses token-scaled gaps (`gap-2`, `gap-4`, `gap-6`, `gap-8`) — never arbitrary pixel gaps.

## Why it exists

User confirmed on 2026-04-18 that Tailwind should be used as a grid view first. Grid gives predictable two-dimensional layouts, better responsive control via `grid-cols-{breakpoint}`, no `flex-wrap` gymnastics, and is easier to reason about at scale. Aligns with the design-token-driven spacing scales. Flex-based 2D layouts have been a recurring source of breakage (sidebars shifting on narrow viewports, card grids overflowing on RTL, form columns mis-aligning at md breakpoint).

## Detector strategy

Hybrid pass:

1. **Regex pre-pass** finds every element with `class="..."` containing `flex` or `inline-flex` in app + lib templates.
2. **Semantic-LLM pass** classifies each candidate:
   - `OK_INLINE_ALIGNMENT` — single row, ≤ ~3 children, content like icon + label, label + input, or chip cluster
   - `VIOLATION_TWO_DIMENSIONAL` — page shell, section, form, card grid, list with wrapping, sidebar+content split
   - `VIOLATION_ARBITRARY_GAP` — `gap-[12px]` / `gap-[1rem]` instead of `gap-3` / `gap-4`

Detector emits `VIOLATION_TWO_DIMENSIONAL` as a SHOULD-level finding (not MUST), because some pre-existing flex layouts are acceptable until refactored.

## Examples

### ✅ Good (grid for 2D)

```html
<!-- Page shell -->
<div class="grid grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto] min-h-screen
            [grid-template-areas:'sidebar_header''sidebar_main''sidebar_footer']">
  <falcon-sidebar class="[grid-area:sidebar]" />
  <falcon-header class="[grid-area:header]" />
  <main class="[grid-area:main]">…</main>
  <falcon-footer class="[grid-area:footer]" />
</div>

<!-- Form -->
<form class="grid grid-cols-12 gap-4">
  <falcon-input label="First name" class="col-span-6" />
  <falcon-input label="Last name"  class="col-span-6" />
  <falcon-textarea label="Notes"   class="col-span-12" />
</form>

<!-- Card grid -->
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
  <falcon-card *ngFor="let c of cards" [card]="c" />
</div>
```

### ✅ Good (flex for inline alignment)

```html
<!-- Icon + label inside a button -->
<falcon-button>
  <span class="flex items-center gap-2">
    <falcon-icon name="save" />
    <span>Save</span>
  </span>
</falcon-button>
```

### ❌ Bad (flex used for 2D layout)

```html
<!-- Page shell built with flex — gets gymnastic at breakpoints -->
<div class="flex flex-col">
  <div class="flex">
    <div class="flex-shrink-0 w-64"> sidebar </div>
    <div class="flex-1"> main </div>
  </div>
</div>

<!-- Card grid with flex-wrap — alignment drifts on RTL -->
<div class="flex flex-wrap gap-6">
  <falcon-card *ngFor="let c of cards" [card]="c" class="w-full md:w-1/2 lg:w-1/3" />
</div>

<!-- Arbitrary gap value -->
<div class="grid grid-cols-3 gap-[18px]"> … </div>
```

## Known legitimate exemptions

- `libs/falcon-ui-core/**` — component internals may legitimately use flex; the library is the SSOT for its own primitives
- Single-row inline alignment with ≤ 3 children — `<span class="flex items-center gap-2">…</span>`
- Inside a Falcon Tab/Toolbar/Menu bar where flex is the natural primitive
- Anything listed against `R-FE-008` in `exemptions/EXEMPTIONS.md`

## Fix recipe

For each `VIOLATION_TWO_DIMENSIONAL` finding:

1. Identify the layout's logical shape — sidebar+main? form? card grid? two-row stack?
2. Rewrite with grid:
   - Page shell → `grid grid-cols-[auto_1fr] grid-rows-[auto_1fr_auto]` + named template areas
   - Form → `grid grid-cols-12 gap-4` + `col-span-*` per field
   - Card list → `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
   - Sidebar+content → `grid grid-cols-[16rem_1fr]` or named primitive `<falcon-split-layout>`
3. Replace arbitrary gaps with token gaps (`gap-[18px]` → `gap-4` or `gap-5`).
4. If the same pattern repeats in 3+ places, propose a named primitive (`FalconPageGrid`, `FalconFormGrid`, `FalconCardGrid`) per the source feedback's recommendation list.

## Related rules

- [[R-FE-004-tokens-only]] — gap and spacing values must come from the token scale, not arbitrary pixels

## Sources of truth

1. `memory/feedback_tailwind_grid_first.md` — confirmed by user 2026-04-18
