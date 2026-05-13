# falcon-angular-tree — TOKENS

## Token file path
- `libs/falcon-ui-tokens/src/components/tree.tokens.css`

Selector scope:
```css
:where(falcon-tree, falcon-tree-tw, falcon-angular-tree, .falcon-tree, [data-falcon-tree]) { … }
```

## Related Falcon theme tokens
- `--color-falcon-neutral-0`, `--color-falcon-neutral-150`, `--color-falcon-neutral-200`, `--color-falcon-neutral-400`, `--color-falcon-neutral-500`, `--color-falcon-neutral-900` — surface, borders, text shades.
- `--color-falcon-teal-100` — selected node bg (`#e8f0f1`).
- `--color-falcon-teal-500` — selected node label color + chevron-active + rail-active.
- `--color-falcon-red-500` — error helper text.
- `--falcon-font-weight-medium` / `-semibold`.

## 14 token categories (verbatim from tree.tokens.css)
1. **CONTAINER** — bg, padding, border, radius, max-width.
2. **NODE per state** — bg + text-color for default / hover / hover-ancestor (HOVER PATH) / focus / selected / disabled, plus padding-y, padding-x, border-radius, min-height, gap, disabled-opacity.
3. **NODE LABEL** — font-size, font-weight (default + selected), line-height, color (default + selected).
4. **CHEVRON** — chevron-box-size (18px), icon-size (12px), stroke-width (2.4), color, hover bg + color.
5. **CHILD INDICATOR** — initials chip (per-row leading marker) size + bg + color.
6. **RAIL** — vertical line width, color, color-active.
7. **RAIL HORIZONTAL** — connector elbow length / color / position.
8. **INDENT** — depth-step width (18 px).
9. **ICON** — size, color, gap-from-label.
10. **BADGE** — per variant (success / warning / danger / info).
11. **FOCUS RING** — width, color, offset, halo opacity.
12. **EXPAND/COLLAPSE MOTION** — height + chevron transition timing.
13. **HELPER / ERROR text** — color, font-size, padding.
14. **MOTION** — hover-path transition + node hover transition.

## Tailwind utility guidance
- The Tailwind helper file consumes `--falcon-tree-*` tokens.
- Consumers must not hardcode hex / px.

## Dark mode support
- Audit required. Hover-path SVG colors may need dark-mode overrides.

## Density support
- `density: 'comfortable' | 'compact'` toggles `--falcon-tree-node-padding-y` / `-padding-x` / `-min-height` / `-label-font-size`.

## RTL support
- Uses `inset-inline-…` and `padding-x` — flips in RTL.
- Chevron SVG rotates on `.open` — verify rotation direction is correct in RTL (caret rotates 90° on expand; LTR shows right-pointing collapsed → down-pointing expanded; RTL flips).

## Static style risks
- Stroke width `2.4` on chevron SVG is a hardcoded number — but consumed as a `<svg stroke-width>` attribute, not a CSS value. Acceptable.

## No CSS / No SCSS guidance
- Stencil consumes `falcon-tree.css`. No `*.component.scss` in Angular wrapper.

## Token usage matrix per state
| Element | Default | Hover | Hover-ancestor | Focus | Selected | Disabled |
|---|---|---|---|---|---|---|
| Node bg | `-node-bg` | `-node-bg-hover` | `-node-bg-hover-ancestor` | `-node-bg-focus` | `-node-bg-selected` | `-node-bg-disabled` |
| Node text | `-node-color` | `-node-color-hover` | inherits | inherits | `-node-color-selected` | `-node-color-disabled` |
| Label weight | `-label-font-weight` | inherits | inherits | inherits | `-label-font-weight-selected` | inherits |
| Chevron color | `-chevron-color` | `-chevron-color-hover` | inherits | inherits | `-chevron-color-active` (when selected ancestors) | `-chevron-disabled-opacity` |
| Rail color | `-rail-color` | inherits | `-rail-color-active` | inherits | inherits | inherits |
| Focus ring | — | — | — | `-focus-ring-color`, `-focus-ring-width`, `-focus-ring-offset` | — | — |
| Initials chip | `-indicator-bg`, `-color` | — | — | — | (token TBD if changes) | — |
| Badge | `-badge-bg-{variant}`, `-color-{variant}` | — | — | — | — | — |
