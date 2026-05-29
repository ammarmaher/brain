---
type: reference
library: "[[Tailwind CSS]]"
topic: colors
docs-source: https://tailwindcss.com/docs/colors
created: 2026-05-20
---
*** Tailwind v4 Colors — 11-stop canon + OKLCH + alpha modifiers ***
*** Falcon's neutral scale has 27 stops vs canonical 11 — significant drift ***
*** Upstream SoT: tailwindcss.com/docs/colors · Falcon SoT: falcon-tailwind-tokens.css ***

# Tailwind Colors and Palette

> Tailwind v4 ships 27 default color families, each with 11 canonical stops (50, 100, 200, …, 950). Custom colors fit any naming pattern but should respect the stop convention. Falcon's neutral scale has **27 stops** — 11 of them off-grid — organic drift from incremental design changes.

## The canonical 11-stop convention

`50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950`

50 = lightest, 950 = darkest. `500` is the "primary" semantic position.

Default families: red, orange, amber, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose, slate, gray, zinc, neutral, stone, taupe, mauve, mist, olive.

## Adding custom colors

```css
@theme {
  --color-midnight: #121063;
  --color-tahiti: #3ab7bf;
}
```

Auto-generates: `bg-midnight`, `text-tahiti`, `border-midnight`, `fill-tahiti`, `ring-midnight/50`.

## Custom scales (follow the convention)

```css
@theme {
  --color-avocado-50: oklch(0.99 0 0);
  --color-avocado-500: oklch(0.84 0.18 117.33);
  --color-avocado-950: oklch(0.25 0.08 118.50);
}
```

## Overriding defaults

```css
@theme {
  --color-gray-50: oklch(0.984 0.003 247.858);
  /* … */
}
```

## Disabling specific families

```css
@theme {
  --color-lime-*: initial;
  --color-fuchsia-*: initial;
}
```

## Completely custom palette

```css
@theme {
  --color-*: initial;
  --color-white: #fff;
  --color-purple: #3f3cbb;
}
```

## Alpha modifiers (universal)

```html
<div class="bg-sky-500/10"></div>
<div class="bg-sky-500/50"></div>
<div class="bg-pink-500/[71.37%]"></div>
<div class="bg-cyan-400/(--my-alpha-var)"></div>
```

Compiles to `color-mix(in oklab, var(--color-X) N%, transparent)`.

## OKLCH — recommended format

- Perceptually uniform (lightness adjustments stay visually consistent)
- `color-mix()` interpolates smoothly through OKLCH
- Future-proof per CSS Color 4

## Falcon's color reality

**Brand teal — 18 stops:**
- Standard: 50, 100, 200, 300, 400, 500, 600, 700, 800, 900 ✓
- Extras: `tint`, `option`, `mid` (3 named accents)
- Alphas: `alpha-04`, `alpha-06`, `alpha-08`, `alpha-12`, `alpha-18`

**Neutral — 27 stops (41% off-grid):**

| On-grid (canonical 11) | Off-grid drift |
|---|---|
| 0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950 | 20, 25, **30**, **40**, **45**, **75**, 150, **160**, **175**, **350**, **450**, **475**, 750, **850**, **925** |

Common cause: designer needed "slightly between two stops" and a new stop was minted instead of using `bg-neutral-50/80` alpha mix.

**Status — sparse but OK:**
- green: 50, 100, 200, 500, 700 (5)
- red: 50, 100, 500, 700, 900 (5)
- amber: 50, 500, 700 (3)
- blue: 500 only (1)

**Customer brands** — aramco/bmw/rajhi/snb/bupa — invariant across themes.

## Recommended cleanup

| Action | Effort | Impact |
|---|---|---|
| Consolidate neutral 30/40/45 → keep 50 + alpha for off-grid | 2 days | −2 stops |
| Consolidate 160/175 → 150 + alpha | 1 day | −2 stops |
| Consolidate 350/450/475/850/925 → canonical neighbor + alpha | 2 days | −5 stops |
| **Net: 27 → 16 stops** | 5 days | 41% drift removed |

**Risk:** MED — needs Percy/Chromatic pixel-diff CI.

## See also

- [[Tailwind CSS]] · [[Tailwind Theme Variables]] · [[Tailwind Dark Mode]] · [[Falcon Color Palette Audit]]
- Brain Outputs: [TOKEN_FLOW_REPORT](../../Brain%20Outputs/understanding/frontend/theme/TOKEN_FLOW_REPORT.md)

## Tags

#type/reference #layer/frontend #layer/design

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]]
