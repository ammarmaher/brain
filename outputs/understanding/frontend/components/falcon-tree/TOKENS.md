# falcon-angular-tree — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/tree.tokens.css` (**231 lines** — recount 2026-06-03 / B09).

`[CODE]` tree.tokens.css:35 — selector scope:

```css
:where(falcon-tree, falcon-tree-tw, falcon-angular-tree, .falcon-tree, [data-falcon-tree]) { … }
```

`:where()` keeps specificity 0 so per-instance host-class overrides still win. **gate-12 compliant** (scoped, NOT `:root`). All declarations are `var(--token, literalFallback)` form — the fallbacks are the only literals.

## Token categories (14 declared)

`[CODE]` tree.tokens.css:17-33 (header) + the declared blocks:

1. **CONTAINER** — `bg`, `padding-{y,x}`, `border-{width,style,color}`, `border-radius` (12px), `max-width`.
2. **NODE per state** — bg + text-color for `default` / `hover` / `hover-ancestor` (HOVER PATH) / `focus` / `selected` / `disabled`; plus `node-padding-{y,x}`, `node-border-radius` (8px), `node-min-height` (36px), `node-gap` (6px), `node-disabled-opacity` (0.55).
3. **NODE LABEL** — `label-font-size` (13px), `label-font-weight` (500) + `-selected` (600), `label-line-height` (1.4), `label-color` + `-selected`.
4. **CHEVRON** — `chevron-box-size` (18px), `chevron-icon-size` (12px), `chevron-stroke-width` (2.4), `color` / `-collapsed` / `-hover`, `bg-hover`, `border-radius` (4px), `rotation-collapsed/expanded` (0/90deg), `margin-start` (2px).
5. **CHILD INDICATOR** — initials chip: `indicator-size` (22px), `bg`, `color`, `border-{width,color,radius}` (50%), `font-size` (9px), `font-weight` (700), `gap` (6px).
6. **RAIL** — vertical line: `rail-width` (18px), `rail-line-width` (1px), `rail-color`, `rail-color-active`, `rail-transition-duration` (150ms).
7. **RAIL HORIZONTAL** — elbow connector: `rail-elbow-line-width` (1px), `rail-elbow-color`, `rail-elbow-color-active`.
8. **INDENT** — `indent-step` (18px, = rail width).
9. **ICON** — `icon-size` (14px), `icon-color`, `icon-gap` (6px), `icon-opacity-disabled` (0.55).
10. **BADGE** — `badge-padding-{y,x}`, `badge-border-radius` (999px), `badge-font-size` (11px), `badge-font-weight` (500), `badge-gap`, plus per-variant `bg` + `color` for `success` / `warning` / `danger` / `info`.
11. **FOCUS RING** — `focus-ring-width` (2px), `focus-ring-color`, `focus-halo-width` (4px), `focus-halo-color`, `focus-ring-offset`, and a composed `focus-shadow` (2px ring + 4px halo) DISTINCT from the default border.
12. **EXPAND/COLLAPSE MOTION** — `expand-transition-duration` (180ms) + easing; `chevron-transition-duration` (150ms) + easing.
13. **HELPER / ERROR text** — `helper-{color,font-size,padding-x,margin-top,line-height}`; `error-{color,font-size,padding-x,margin-top,line-height,font-weight}`; plus the group-label tokens (`group-label-{color,font-size,font-weight,margin-bottom}`).
14. **MOTION** — `node-transition-duration` (120ms) + easing; `hover-path-transition-duration` (150ms) + easing.

## Related Falcon theme tokens

| Falcon theme token | Used by tree via |
|---|---|
| `--color-falcon-neutral-0 / 50 / 150 / 400 / 500 / 700 / 800 / 900` | Surface, borders, text shades, chevron, helper. |
| `--color-falcon-teal-100` | Selected/focus node bg (`#e8f0f1`). |
| `--color-falcon-teal-500` | Selected label color + chevron-active + rail-active + elbow-active + focus ring. |
| `--color-falcon-teal-alpha-18` | Rail idle + elbow idle line color (`rgba(13,63,68,0.18)`). |
| `--color-falcon-teal-alpha-12` | Focus halo color. |
| `--color-falcon-mint-100 / 200` | Initials chip bg + border. |
| `--color-falcon-red-500 / 700` | Error text + danger badge. |
| `--color-falcon-green-100 / 700` | Success badge. |
| `--color-falcon-amber-50 / 700` | Warning badge. |
| `--falcon-font-weight-medium / -semibold / -bold` | Label / badge / indicator weights. |

## Tailwind utility guidance for this component

`[CODE]` The Tailwind helper `libs/falcon-ui-core/src/tailwind/tree-tailwind-classes.ts` (272 ln) returns class strings that lean entirely on the SAME `--falcon-tree-*` tokens through arbitrary-value utilities (`bg-[var(--falcon-tree-node-bg)]`, etc.). Rail SVG geometry (linear-gradient through-line + `::before`/`::after` elbow) cannot be expressed in Tailwind utilities, so `<falcon-tree-tw>` inlines a companion `<style>` block (`TREE_TW_RAIL_STYLES`, falcon-tree-tw.tsx:71-126) that ALSO reads only `--falcon-tree-*` tokens — **SSOT preserved.** Consumers should NOT hand-roll Tailwind classes that override colors/radii — override tokens instead.

## Dark mode support

`[INFERRED]` Inherits from the theme's `:where(.app-dark, …)` neutral/teal overrides (same mechanism as falcon-input). The hover-path rail/elbow colors read `--color-falcon-teal-*` / `--color-falcon-teal-alpha-18`, which the theme is responsible for flipping in dark mode. **NOT verified end-to-end in this audit — flag for theme/tokens agent.** No per-tree dark override exists in `tree.tokens.css`.

## Density support

`[CODE]` `density: 'comfortable' | 'compact'` toggles a `density-{x}` class on the base (`[CODE]` falcon-tree.tsx:573) which is expected to shift `--falcon-tree-node-padding-*` / `-min-height` / `-label-font-size`. (The density-class CSS rules live in `falcon-tree.css` / the Tailwind base builder.)

## RTL support

`[CODE]` falcon-tree-tw.tsx:107-110 — the companion stylesheet includes an explicit `[dir="rtl"]` override that flips the elbow `::after` from `left:50%` to `right:50%`. The Tailwind helpers use logical properties (`ps-`/`pe-`/`ms-`/`me-`) so node padding + chevron/indicator/badge gaps auto-mirror. Chevron rotation is `90deg` on open in both directions (the caret reads correctly LTR; RTL correctness of the rotation direction is `[INFERRED]` — flag for theme agent).

## Static style risks

- `[CODE]` The chevron SVG `stroke-width="2.4"` is a hardcoded NUMBER, but it is an SVG presentation **attribute** (not a CSS value) and is the tokenised reference value (`--falcon-tree-chevron-stroke-width: 2.4`). Acceptable.
- `[CODE]` falcon-tree-tw.tsx:229 — `falconTreeMultiCheckClasses()` writes the checked-state fill with `bg-[var(--color-falcon-teal-500,#0d3f44)]` / `border-[color:var(--color-falcon-teal-500,#0d3f44)]` — i.e. it reaches for the **raw theme token** rather than a component-scoped `--falcon-tree-multi-check-*` token. Minor token-naming inconsistency (the multi-check has no dedicated component tokens). `safe-local`.
- `[CODE]` falcon-tree.component.css is `:host { display:block; width:100% }` only — no static risks.
- `[CODE]` `TREE_TW_RAIL_STYLES` is a string `<style>` block but contains ZERO literal colors/sizes — every value is `var(--falcon-tree-*)`. Token-clean.

## No CSS / no SCSS guidance

- Tailwind utilities only in templates; visual values via `--falcon-tree-*` tokens.
- Consumer per-instance overrides MUST mutate `--falcon-tree-*` via a host marker class. **Never hardcode hex or px inline.**
- No `*.component.scss` exists for the Angular wrapper (only the 5-line `:host` CSS).

## Token usage by state

| Element | Default | Hover | Hover-ancestor (HOVER PATH) | Focus | Selected | Disabled |
|---|---|---|---|---|---|---|
| Node bg | `-node-bg` (transparent) | `-node-bg-hover` (#fff) | `-node-bg-hover-ancestor` (transparent) | `-node-bg-focus` | `-node-bg-selected` (teal-100) | `-node-bg-disabled` (transparent) |
| Node text | `-node-color` | `-node-color-hover` | inherits | inherits | `-node-color-selected` (teal-500) | `-node-color-disabled` |
| Label weight | `-label-font-weight` (500) | inherits | inherits | inherits | `-label-font-weight-selected` (600) | inherits |
| Chevron color | `-chevron-color` | `-chevron-color-hover` | inherits | inherits | `-chevron-color-collapsed` | inherits + opacity |
| Rail line | `-rail-color` | inherits | `-rail-color-active` (teal-500) | inherits | inherits | inherits |
| Elbow | `-rail-elbow-color` | inherits | `-rail-elbow-color-active` | inherits | inherits | inherits |
| Focus ring | — | — | — | `-focus-shadow` (2px ring + 4px halo) | — | — |
| Initials chip | `-indicator-bg` / `-color` / `-border-color` | — | — | — | — | + `-icon-opacity-disabled` on icon only |
| Badge | `-badge-{variant}-bg` / `-{variant}-color` | — | — | — | — | — |

## Verification
🟢 CODE-VERIFIED 2026-06-03 (B09) — token file recounted at 231 lines, 14 categories confirmed against the header + declared blocks, `:where()` gate-12 scope confirmed, companion `<style>` + helper verified token-only. Multi-check raw-token reach flagged as a `safe-local` naming-consistency finding. Dark-mode + RTL-rotation correctness 🟡 inferred (flag for theme agent).
