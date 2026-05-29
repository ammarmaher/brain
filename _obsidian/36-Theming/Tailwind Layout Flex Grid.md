---
type: reference
library: "[[Tailwind CSS]]"
topic: layout
created: 2026-05-20
---
*** Tailwind v4 Layout — flex / grid / container / overflow ***
*** Flex for 1D layouts; Grid for 2D; container queries for component-level responsive ***
*** Upstream SoT: tailwindcss.com/docs (flexbox, grid sections) ***

# Tailwind Layout — Flex, Grid, Container, Overflow

> Flex for one-dimensional layouts (rows, columns, toolbars). Grid for two-dimensional (cards, dashboards, responsive forms). Container for centering/maxing. Overflow utilities for clipping/scrolling. **Most Falcon layout bugs come down to missing `min-w-0` / `min-h-0` (covered in [[Tailwind Sizing and Responsive]]).**

## Flex — one-dimensional layout

### When to use

- Row/column alignment
- Toolbars (search + actions)
- Page shells (header + main + footer)
- Side-by-side panels
- Button groups
- Anything that's a list in one direction

### Core utilities

| Utility | What it does |
|---|---|
| `flex` | `display: flex;` |
| `flex-col` | `flex-direction: column;` |
| `flex-row` | (default) |
| `items-center` | Align items along cross axis |
| `items-start` / `items-end` / `items-stretch` | |
| `justify-between` / `justify-center` / `justify-end` / `justify-start` | Align along main axis |
| `gap-*` | Spacing between children (modern; replaces margins) |
| `flex-1` | `flex: 1 1 0%;` — fill available space |
| `flex-auto` | `flex: 1 1 auto;` — fill based on content |
| `flex-none` | `flex: none;` — don't grow/shrink |
| `grow` / `grow-0` | Control flex-grow |
| `shrink` / `shrink-0` | Control flex-shrink |
| `basis-*` | Initial main-axis size |
| `min-w-0` / `min-h-0` | **Critical for nested flex** — see [[Tailwind Sizing and Responsive]] |

### Canonical Falcon flex pattern — vertical app shell

```html
<div class="flex flex-col h-screen">
  <header class="shrink-0 h-14">…</header>
  <div class="flex-1 min-h-0 flex">
    <aside class="shrink-0 w-64">…</aside>
    <main class="flex-1 min-w-0 min-h-0 overflow-auto">…</main>
  </div>
  <footer class="shrink-0 h-10">…</footer>
</div>
```

Every flex parent declares direction; every flex child declares grow/shrink behavior; every scrollable child declares `min-*-0`.

## Grid — two-dimensional layout

### When to use

- Cards in a grid
- Dashboards
- Equal-width columns
- Responsive form layouts
- Table-like layouts that AREN'T a real `<table>`

### Core utilities

| Utility | What it does |
|---|---|
| `grid` | `display: grid;` |
| `grid-cols-*` | Number of columns (`grid-cols-3` = 3 equal columns) |
| `grid-cols-[200px_1fr_auto]` | Arbitrary track sizing |
| `grid-rows-*` | Number of rows |
| `col-span-*` | Span N columns |
| `row-span-*` | Span N rows |
| `gap-*` | Spacing between cells |
| `col-start-*` / `col-end-*` | Explicit placement |
| `auto-cols-*` / `auto-rows-*` | Implicit track sizing |
| `grid-flow-*` | Flow direction (`row`, `col`, `dense`) |

### Canonical Falcon grid pattern — responsive card grid

```html
<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  @for (card of cards; track card.id) {
    <falcon-card>…</falcon-card>
  }
</div>
```

### Auto-fit / auto-fill alternatives

```html
<div class="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
  <!-- cards auto-flow to fit available width -->
</div>
```

## Container — centered max-width wrapper

`container` is opinionated — it sets a max-width that responds to breakpoints. For Falcon app shells, prefer explicit layout containers (with intentional `max-w-*` choices) over the implicit `container` class.

```html
<!-- Public marketing page — container OK -->
<div class="container mx-auto px-4">…</div>

<!-- Falcon app shell — explicit max-width -->
<main class="mx-auto max-w-7xl px-6">…</main>
```

## Overflow

| Utility | What it does |
|---|---|
| `overflow-hidden` | Clip overflow (no scroll) |
| `overflow-auto` | Scroll when needed |
| `overflow-scroll` | Always show scrollbar (rare) |
| `overflow-x-auto` / `overflow-y-auto` | Single-axis scroll |
| `overflow-clip` | Hard clip (no scrollbar even via JS) |
| `truncate` | `overflow: hidden; text-overflow: ellipsis; white-space: nowrap;` |
| `text-ellipsis` | Ellipsis without truncate's other rules |
| `whitespace-nowrap` | Prevent text wrapping |
| `line-clamp-N` | Truncate at N lines (multi-line ellipsis) |

### Falcon overflow rule

> When nested layouts break, check **missing `min-h-0` / `min-w-0`** before adding fixed heights or `overflow-hidden` hacks. The `min-*-0` solution is correct; fixed heights are a smell.

## Position

| Utility | Position |
|---|---|
| `static` | (default) |
| `relative` | Establishes positioning context |
| `absolute` | Position relative to nearest positioned ancestor |
| `fixed` | Position relative to viewport |
| `sticky` | Stick at threshold during scroll |
| `inset-0` | `top: 0; right: 0; bottom: 0; left: 0;` |
| `top-*` / `right-*` / `bottom-*` / `left-*` | Single offsets |
| `inset-x-*` / `inset-y-*` | Axis offsets |

### Sticky header pattern

```html
<header class="sticky top-0 z-10 bg-falcon-surface-primary">…</header>
```

## Z-index

| Utility | Z-index |
|---|---|
| `z-0` / `z-10` / `z-20` / `z-30` / `z-40` / `z-50` | Numeric layers |
| `z-auto` | Default |
| `z-[9999]` | Arbitrary (escape hatch) |

**Falcon rule:** define z-index stops as tokens. Avoid scattered `z-[9999]` patches.

## See also

- [[Tailwind CSS]] · [[Tailwind Sizing and Responsive]] · [[Tailwind Spacing Radius Shadow Borders]] · [[Tailwind States and Variants]]
- Brain Outputs: [STYLING_RULES_CHEAT_SHEET](../../Brain%20Outputs/understanding/frontend/theme/STYLING_RULES_CHEAT_SHEET.md)

## Tags

#type/reference #layer/frontend

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
