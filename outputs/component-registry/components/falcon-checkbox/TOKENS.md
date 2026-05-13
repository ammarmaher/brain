# falcon-checkbox — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/checkbox.tokens.css`.

## Token categories

1. CONTAINER ROW — gap, alignment.
2. LABEL — color (idle / disabled / error), font, size, weight.
3. BOX SIZING — `--falcon-checkbox-box-size-{sm,md,lg}` (typically 14 / 16 / 18 px).
4. BOX BACKGROUND — bg by state (unchecked / hover / checked / indeterminate / disabled / readonly).
5. BOX BORDER — width, radius, color by state.
6. CHECK GLYPH — icon size + color (white default), indeterminate-bar color.
7. FOCUS RING — width, color, offset (teal halo).
8. SHADOW — by state.
9. ERROR — error border + error text color.
10. HELPER TEXT — color, font, margin.
11. ERROR TEXT — color, font, margin.
12. MOTION — duration + easing for check-in animation.

## Related Falcon theme tokens

- `--color-falcon-teal-500` — checked bg + border.
- `--color-falcon-neutral-200` — idle border.
- `--color-falcon-red-500` — error border + text.
- `--falcon-radius-xs` (3-4px) — checkbox radius.
- `--color-falcon-neutral-0` — check glyph color (white).

## Tailwind utility guidance

`rowClass`, `boxClass`, `labelClass` for path-specific tweaks. Row layout uses flex by default; pass `gap-*` extras as needed.

## Dark mode

Token-driven. Teal stays brand-constant. Border color shifts via neutral inversion.

## Density

Box sizes scale with `size` input (sm/md/lg).

## RTL

Label-on-right reading order auto-flips via flex direction.

## Static style risks

Inline SVG check glyph hardcoded. Acceptable.

## No CSS / no SCSS

Per-instance via token override + host class.

## Token usage by state

| State | Tokens |
|---|---|
| Unchecked | `--falcon-checkbox-bg`, `--falcon-checkbox-border-color` |
| Hover | `--falcon-checkbox-bg-hover`, `--falcon-checkbox-border-color-hover` |
| Checked | `--falcon-checkbox-bg-checked`, `--falcon-checkbox-border-color-checked`, `--falcon-checkbox-check-color` |
| Indeterminate | `--falcon-checkbox-bg-indeterminate`, `--falcon-checkbox-indeterminate-bar-color` |
| Focus | `--falcon-checkbox-ring-color-focus`, `--falcon-checkbox-ring-width` |
| Error | `--falcon-checkbox-border-color-error`, `--falcon-checkbox-error-text-color` |
| Disabled | `--falcon-checkbox-bg-disabled`, `--falcon-checkbox-border-color-disabled`, `--falcon-checkbox-text-color-disabled` |
