---
type: reference
library: "[[Tailwind CSS]]"
topic: theme-variables
docs-source: https://tailwindcss.com/docs/theme
created: 2026-05-20
---
*** Tailwind v4 @theme vs :root — the central design-token rule ***
*** The single rule that explains every "arbitrary value" pattern in Falcon ***
*** Upstream SoT: tailwindcss.com/docs/theme · Falcon SoT: falcon-tailwind-tokens.css ***

# Tailwind Theme Variables

> The cardinal rule: `@theme` declares design tokens that auto-generate utility classes. `:root` declares plain CSS variables that don't. Falcon's component contract files declare in `:root` — so they don't generate utilities — which is why templates fall back to `bg-[var(--falcon-X)]` arbitrary-value syntax.

## The cardinal rule (docs verbatim)

> "Theme variables aren't just CSS variables — they also instruct Tailwind to create new utility classes that you can use in your HTML."
>
> "Use `@theme` when you want a design token to map directly to a utility class, and use `:root` for defining regular CSS variables that shouldn't have corresponding utility classes."

— Tailwind v4 docs, §Theme variables

## Namespace → utility-class generation

| Namespace | Generates |
|---|---|
| `--color-*` | `bg-*`, `text-*`, `border-*`, `fill-*`, `stroke-*`, `ring-*`, `outline-*`, `decoration-*`, `divide-*`, `accent-*`, `caret-*`, `shadow-*` (color variant) |
| `--font-*` | `font-sans`, `font-display`, … |
| `--text-*` | `text-xs`, `text-lg`, … |
| `--font-weight-*` | `font-bold`, `font-medium`, … |
| `--tracking-*` | `tracking-wide` |
| `--leading-*` | `leading-tight` |
| `--breakpoint-*` | `sm:`, `lg:` |
| `--spacing-*` | `p-*`, `m-*`, `gap-*`, `w-*`, `h-*` |
| `--radius-*` | `rounded-sm`, `rounded-lg` |
| `--shadow-*` | `shadow-sm`, `shadow-xl` |
| `--animate-*` | `animate-spin` |
| `--ease-*` | `ease-out`, `ease-fluid` |

## Canonical example

```css
@import "tailwindcss";

@theme {
  --font-poppins: Poppins, sans-serif;
}
```

```html
<h1 class="font-poppins">Uses Poppins.</h1>
```

`font-poppins` exists ONLY because `--font-poppins` is in `@theme`. Move to `:root` → utility vanishes.

## Referencing vars from other vars

```css
@theme inline {
  --font-sans: var(--font-inter);
}
```

Without `inline`, the var resolves at the WRONG scope. Documented gotcha.

## Falcon's @theme — what's in there

[CODE] `libs/falcon-theme/src/falcon-tailwind-tokens.css:15-200`:

- Brand teal — 10 stops + 8 extras
- Neutral — 27 stops
- Status — green/red/amber/blue/success
- Customer brands — aramco/bmw/rajhi/snb/bupa
- Typography — 4 font families + 16+ text sizes
- Sizing — control/icon/pill/tile/stepper

**Generates ~250 Tailwind utility classes.** Dark cascade re-declares the neutral ramp under `:where(.app-dark, .app-dark *)`.

## What Falcon does NOT have in @theme (the gap)

- ❌ Semantic Tier-2 tokens (`--color-surface-brand-strong`, `--color-state-row-hover`, `--color-accent-brand`) — they live in `semantic/semantic.css` under `:root` scope
- ❌ 51 per-component contract slots (`--falcon-org-hierarchy-panel-bg`, etc.) — declared in `:where(<host>)` scope

**Consequence:** templates use `bg-[var(--falcon-X)]` arbitrary syntax because no named utility exists.

**Fix:** see [[Tailwind Falcon Alignment Scorecard]] Wave 1.

## See also

- [[Tailwind CSS]] · [[Tailwind Colors and Palette]] · [[Tailwind Falcon Alignment Scorecard]] · [[Falcon Design Tokens]]
- Brain Outputs: [THEME_SSOT_AUDIT](../../Brain%20Outputs/understanding/frontend/theme/THEME_SSOT_AUDIT.md)

## Tags

#type/reference #layer/frontend #layer/design

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
