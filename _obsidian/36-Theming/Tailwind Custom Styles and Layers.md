---
type: reference
library: "[[Tailwind CSS]]"
topic: custom-styles
docs-source: https://tailwindcss.com/docs/adding-custom-styles
created: 2026-05-20
---
*** Tailwind v4 Custom Styles — @utility + @layer + arbitrary values ***
*** Falcon scores 48% here — ~100 arbitrary-value safelists vs zero @utility declarations ***
*** Upstream SoT: tailwindcss.com/docs/adding-custom-styles · Falcon SoT: UTILITY_SAFELIST_AUDIT.md ***

# Tailwind Custom Styles and Layers

> v4's modern extensibility is `@utility` (custom utilities that participate in variants) + `@layer base/components/utilities`. The old v3 `@apply` still works but is being de-emphasized. Arbitrary values (`bg-[#xxx]`) are an "escape hatch" per docs — Falcon over-uses this pattern.

## Decision tree

```
One-off pixel value?              → arbitrary value (bg-[#bada55])
Reusable styling pattern?         → @utility custom-name
HTML element base styles?         → @layer base { h1 { … } }
Complex component class?          → @layer components { .card { … } }
Apply utilities inside CSS?       → @apply (legacy but works)
Apply Tailwind variant in CSS?    → @variant dark { … }
```

## `@utility` — modern custom utility

```css
@utility content-auto {
  content-visibility: auto;
}
```

Works with EVERY variant for free: `content-auto`, `hover:content-auto`, `lg:content-auto`, `dark:content-auto`.

Complex (nested selectors):

```css
@utility scrollbar-hidden {
  &::-webkit-scrollbar { display: none; }
}
```

Functional (parameterized):

```css
@utility tab-* {
  tab-size: --value(--tab-size-*);
}
```

## `@layer` system

```css
@layer theme, base, components, utilities;
```

Order: `theme` < `base` < `components` < `utilities`. Later wins.

### `@layer base` — element resets / defaults

```css
@layer base {
  h1 { font-size: var(--text-2xl); }
  a { color: var(--color-blue-600); text-decoration: underline; }
}
```

### `@layer components` — utility-overridable classes

```css
@layer components {
  .card {
    background-color: var(--color-white);
    border-radius: var(--radius-lg);
    padding: --spacing(6);
    box-shadow: var(--shadow-xl);
  }
}
```

```html
<div class="card rounded-none">…</div>
```

`rounded-none` (utility layer) wins over `.card`'s `border-radius` (component layer).

## When to extract a component class — docs guidance

Ladder per docs:
1. **First** — write utilities inline
2. **Then** — if duplicated across files, extract a **template component** (React/Vue/Angular partial)
3. **Then** — if can't extract a component (e.g., Markdown output), use `@layer components`
4. **Never** — extract a class just to make markup shorter

## `@apply` — legacy v3 (still works)

```css
.select2-dropdown {
  @apply rounded-b-lg shadow-md;
}
```

Use case: styling third-party output you can't change. Modern v4 prefers `@utility`.

## `@variant` — apply Tailwind variant in custom CSS

```css
.my-element {
  background: white;
  @variant dark { background: black; }
}
```

## Arbitrary values — the escape hatch

```html
<div class="top-[117px] bg-[#bada55] text-[22px]">…</div>
<div class="grid-cols-[1fr_500px_2fr]">…</div>     <!-- underscore → space -->
<div class="text-(length:--my-var)">…</div>         <!-- type hint -->
<div class="bg-(--my-color)">…</div>                <!-- shorthand for bg-[var(--my-color)] -->
```

Per docs:
> "Once in a while you need to break out of those constraints to get things pixel-perfect."

**Acceptable:** one-off pixel alignment, dynamic CMS values.
**NOT acceptable:** recurring patterns (extract `@utility`), theme tokens (declare in `@theme`).

## Falcon's arbitrary-value over-use

[CODE] `apps/host-shell/src/tailwind.css:42-120` has ~80 lines like:

```css
@source inline("bg-[length:var(--falcon-input-label-font-size)]");
@source inline("text-[color:var(--falcon-input-label-color)]");
@source inline("border-[length:var(--falcon-border-width-1-5,1.5px)]");
@source inline("rounded-[var(--radius-2xs,0.1875rem)]");
```

These consume vars declared in `libs/falcon-ui-tokens/components/*.tokens.css` — NOT in `@theme`.

**Refactor target:** each pattern → `@utility`:

```css
@utility input-label-text {
  font-size: var(--falcon-input-label-font-size);
  font-weight: var(--falcon-input-label-font-weight);
  line-height: var(--falcon-input-label-line-height);
  color: var(--falcon-input-label-color);
}
```

Templates: `class="input-label-text"`. One name, all properties bundled, IntelliSense recognizes it, works with all variants.

## See also

- [[Tailwind CSS]] · [[Tailwind Theme Variables]] · [[Tailwind Directives and Functions]] · [[Tailwind Source Detection]] · [[Tailwind Falcon Alignment Scorecard]]
- Brain Outputs: [UTILITY_SAFELIST_AUDIT](../../Brain%20Outputs/understanding/frontend/theme/UTILITY_SAFELIST_AUDIT.md) · [TAILWIND_HELPERS_AUDIT](../../Brain%20Outputs/understanding/frontend/theme/TAILWIND_HELPERS_AUDIT.md)

## Tags

#type/reference #layer/frontend

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
