---
type: reference
library: "[[Tailwind CSS]]"
topic: directives-functions
docs-source: https://tailwindcss.com/docs/functions-and-directives
created: 2026-05-20
---
*** Tailwind v4 Directives + Functions — complete reference ***
*** Falcon uses 6 of 12 directives — @utility, @variant, @theme inline unused ***
*** Upstream SoT: tailwindcss.com/docs/functions-and-directives ***

# Tailwind Directives and Functions

## All v4 directives

| Directive | Purpose | Falcon uses? |
|---|---|---|
| `@import` | Inline CSS imports | ✅ |
| `@theme` | Declare design tokens that generate utilities | ✅ |
| `@theme inline` | Tokens that reference other tokens | ❌ |
| `@source` | Declare scan paths | ✅ |
| `@source inline()` | Safelist class names | ✅ (~100 entries) |
| `@source not "…"` | Exclude paths | ✅ |
| `@utility` | Define custom utility | ❌ |
| `@variant` | Apply Tailwind variant inside custom CSS | ❌ |
| `@custom-variant` | Define custom variant | ✅ (`dark`) |
| `@apply` | Inline utility classes in custom CSS | ❌ |
| `@reference` | Import stylesheet without duplicating output (Vue/Svelte scoped styles) | ❌ |
| `@layer` | Declare layer order | ✅ |
| `@config` | Legacy bridge to JS config | ✅ (empty file) |
| `@plugin` | Legacy JS plugin loader | ❌ |

## Functions

### `--alpha(<color> / <percentage>)`

```css
.my-element { color: --alpha(var(--color-lime-300) / 50%); }
```

Compiles to `color-mix(in oklab, var(--color-lime-300) 50%, transparent)`.

### `--spacing(<number>)`

```css
.my-element { margin: --spacing(4); }   /* = calc(var(--spacing) * 4) */
```

Inside arbitrary values:

```html
<div class="py-[calc(--spacing(4)-1px)]">…</div>
```

## Canonical examples

### `@theme`

```css
@theme {
  --font-display: "Satoshi", "sans-serif";
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --ease-fluid: cubic-bezier(0.3, 0, 0, 1);
}
```

### `@theme inline`

```css
@theme inline {
  --color-canvas: var(--acme-canvas-color);
}
```

Use when a `@theme` value references another CSS variable — `inline` resolves at declaration scope.

### `@source`

```css
@import "tailwindcss" source("../src");        /* set base path */
@source "../node_modules/@my-co/ui-lib";       /* scan external lib */
@source not "../src/legacy";                    /* exclude */
@source inline("underline");                    /* safelist */
@source inline("{hover:,focus:,}underline");    /* with variants */
@source inline("bg-red-{50,{100..900..100},950}");  /* with ranges */
@source not inline("bg-red-500");               /* exclude from generation */
```

### `@utility`

```css
@utility tab-4 { tab-size: 4; }
```

```html
<div class="tab-4 hover:tab-4 lg:tab-4">…</div>
```

### `@variant`

```css
.my-element {
  background: white;
  @variant dark { background: black; }
}
```

### `@custom-variant`

```css
@custom-variant theme-midnight (&:where([data-theme="midnight"] *));
```

```html
<html data-theme="midnight">
  <button class="theme-midnight:bg-black">…</button>
</html>
```

### `@reference` — for Vue/Svelte scoped styles

```vue
<style>
@reference "../../app.css";
h1 { @apply text-2xl font-bold; }
</style>
```

## Deprecated

### `theme()` function

```css
/* OLD v3 */
.my-element { margin: theme(spacing.12); }

/* NEW v4 — just use the CSS variable */
.my-element { margin: var(--spacing-12); }
```

## See also

- [[Tailwind CSS]] · [[Tailwind Theme Variables]] · [[Tailwind Custom Styles and Layers]] · [[Tailwind Source Detection]] · [[Tailwind Dark Mode]]
- Brain Outputs: [TAILWIND_HELPERS_AUDIT](../../Brain%20Outputs/understanding/frontend/theme/TAILWIND_HELPERS_AUDIT.md)

## Tags

#type/reference #layer/frontend

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
