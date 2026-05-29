---
type: reference
library: "[[Tailwind CSS]]"
topic: sizing-responsive
docs-source: https://tailwindcss.com/docs/width
created: 2026-05-20
---
*** Tailwind v4 Sizing & Responsive — width / height / size / responsive / container queries ***
*** The min-w-0 / min-h-0 rule resolves most Falcon layout-collapse bugs ***
*** Upstream SoT: tailwindcss.com/docs/width + /docs/responsive-design + container-queries ***

# Tailwind Sizing and Responsive

> Width / height / size / min-max sizing + breakpoint-driven and container-driven responsive design. Falcon components must work at `w-full`, inside flex/grid with `min-w-0` / `min-h-0`, and in narrow side panels. **80% of Falcon layout-collapse bugs are solved by the `min-w-0` / `min-h-0` rule.**

## Width utilities (v4)

### Keywords

| Class | Resolves to |
|---|---|
| `w-auto` | `width: auto;` |
| `w-px` | `width: 1px;` |
| `w-full` | `width: 100%;` |
| `w-screen` | `width: 100vw;` |
| `w-dvw` | `width: 100dvw;` (dynamic viewport) |
| `w-svw` | `width: 100svw;` (small viewport) |
| `w-lvw` | `width: 100lvw;` (large viewport) |
| `w-min` | `width: min-content;` |
| `w-max` | `width: max-content;` |
| `w-fit` | `width: fit-content;` |

### Fractions

`w-1/2`, `w-2/5`, `w-1/3`, `w-2/3`, `w-1/4`, `w-3/4`, `w-1/5`, `w-4/5`, `w-1/6`, `w-5/6`, …

### Spacing-scale numbers

`w-<number>` → `width: calc(var(--spacing) * <number>);`

Examples: `w-24`, `w-32`, `w-40`, `w-48`, `w-64`, `w-80`, `w-96`

### Container-scale keywords (v4 — new)

| Class | Width |
|---|---|
| `w-3xs` | 16rem (256px) |
| `w-2xs` | 18rem (288px) |
| `w-xs` | 20rem (320px) |
| `w-sm` | 24rem (384px) |
| `w-md` | 28rem (448px) |
| `w-lg` | 32rem (512px) |
| `w-xl` | 36rem (576px) |
| `w-2xl` | 42rem (672px) |
| `w-3xl` | 48rem (768px) |
| `w-4xl` | 56rem (896px) |
| `w-5xl` | 64rem (1024px) |
| `w-6xl` | 72rem (1152px) |
| `w-7xl` | 80rem (1280px) |

### Arbitrary + CSS-var

```html
<div class="w-[317px]">…</div>            <!-- arbitrary — escape hatch -->
<div class="w-(--my-width)">…</div>        <!-- shorthand for w-[var(--my-width)] -->
```

**Falcon rule:** prefer tokenized utilities or semantic size variants. Avoid `w-[317px]` unless documented design exception.

## Height utilities

Mirror width: `h-auto`, `h-px`, `h-full`, `h-screen`, `h-dvh`, `h-svh`, `h-lvh`, `h-min`, `h-max`, `h-fit`, `h-<number>`, `h-(--my-height)`, `h-[value]`.

## `size-*` shorthand (equal width + height)

```html
<div class="size-8"></div>     <!-- width: 8 + height: 8 -->
<div class="size-full"></div>
<div class="size-(--my-size)"></div>
```

**Falcon use cases:** icons, avatars, square buttons, checkbox/radio visuals, loader dots, status dots.

## Min / max sizing — the critical rule

### `min-w-0` — prevents flex/grid text overflow

Without `min-w-0`, flex children have implicit `min-width: auto` which equals their content width, causing overflow.

```html
<!-- ❌ Long text breaks layout -->
<div class="flex">
  <div class="flex-1">
    <p class="truncate">Very long text that overflows...</p>
  </div>
</div>

<!-- ✅ min-w-0 lets truncate work -->
<div class="flex">
  <div class="flex-1 min-w-0">
    <p class="truncate">Very long text that overflows...</p>
  </div>
</div>
```

### `min-h-0` — prevents scrollable-child collapse

Same rule for vertical: scrollable children in flex/grid need `min-h-0` to allow `overflow-auto` to kick in.

```html
<!-- The Falcon dashboard pattern -->
<div class="flex flex-col h-screen">
  <header class="shrink-0">…</header>
  <main class="flex-1 min-h-0 overflow-auto">…</main>
  <footer class="shrink-0">…</footer>
</div>
```

**Falcon rule:** when a nested layout breaks, **check missing `min-w-0` / `min-h-0` before adding fixed heights or overflow hacks.**

## Max sizing

```html
<div class="max-w-full">…</div>           <!-- prevents overflow -->
<div class="max-w-2xl">…</div>            <!-- 42rem cap -->
<div class="max-h-full overflow-auto">…</div>  <!-- constrained scrollable -->
```

## Aspect-ratio

```html
<div class="aspect-square">…</div>        <!-- 1/1 -->
<div class="aspect-video">…</div>         <!-- 16/9 -->
<div class="aspect-3/2">…</div>           <!-- generic ratio -->
<div class="aspect-[5/3]">…</div>         <!-- arbitrary -->
<div class="aspect-(--my-aspect)">…</div> <!-- CSS-var -->
```

Customize via @theme:
```css
@theme {
  --aspect-retro: 4 / 3;
}
```

## Responsive — breakpoint variants (mobile-first)

| Variant | Min width |
|---|---|
| (none) | 0 — all sizes |
| `sm:` | 40rem (640px) |
| `md:` | 48rem (768px) |
| `lg:` | 64rem (1024px) |
| `xl:` | 80rem (1280px) |
| `2xl:` | 96rem (1536px) |
| `max-sm:` etc. | upper-bound media queries |
| `min-[500px]:` | arbitrary |
| `md:max-xl:` | range |

```html
<div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">…</div>
```

## Container queries — sizing relative to PARENT

Use container queries when a component must resize based on its parent's width, not the viewport. Crucial for reusable components placed in different shells.

```html
<div class="@container">
  <div class="flex flex-col @md:flex-row">…</div>
</div>
```

Defaults: `@3xs` (16rem) → `@7xl` (80rem). Named containers:

```html
<div class="@container/sidebar">
  <div class="@md/sidebar:flex-row">…</div>
</div>
```

**Falcon use cases:** cards, data-table cells, side panels, widgets, reusable components used in different page shells.

**Avoid** container queries for full-page layout when viewport breakpoints are clearer.

## Resize utility

```html
<textarea class="resize-none"></textarea>
<textarea class="resize"></textarea>
<textarea class="resize-x"></textarea>
<textarea class="resize-y"></textarea>
```

Use for textareas or resizable panels only when UX expects manual resize.

## Falcon component size variants — doctrine

Every reusable Falcon component should support semantic size variants:

| Variant | Use case |
|---|---|
| `sm` | Compact density (data-table rows, secondary toolbars) |
| `md` | Default (forms, primary toolbars) |
| `lg` | Hero/marketing surfaces |
| `xl` or `compact` | Specialized |

**Do NOT expose raw pixel inputs as the default customization path.** Always go through size variants.

## Resizing checklist (apply to every Falcon component)

- [ ] Works at `w-full`?
- [ ] Works inside flex with `min-w-0`?
- [ ] Works inside grid?
- [ ] Supports compact mode (or `sm` variant)?
- [ ] Avoids overflow on long content?
- [ ] Text truncates or wraps intentionally?
- [ ] Works in dark mode?
- [ ] Works in a narrow side panel (e.g., 320px)?
- [ ] Works at sm / md / lg / xl breakpoints?
- [ ] Container-query support if reused in multiple shells?

## See also

- [[Tailwind CSS]] · [[Tailwind Layout Flex Grid]] · [[Tailwind Spacing Radius Shadow Borders]] · [[Falcon Component Theme Contract]] · [[Tailwind Implementation Review Checklist]]
- Brain Outputs: [STYLING_RULES_CHEAT_SHEET](../../Brain%20Outputs/understanding/frontend/theme/STYLING_RULES_CHEAT_SHEET.md)

## Tags

#type/reference #layer/frontend

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
