# falcon-paginator — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/paginator.tokens.css`

Selector union:

```
:where(falcon-paginator, falcon-paginator-tw, falcon-angular-paginator, .falcon-paginator, [data-falcon-paginator]) { … }
```

## Token categories (14 total, per source comment lines 8-23)

1. **CONTAINER** — display, align, justify, gap, info-gap, padding
2. **PAGE BUTTON** — bg, color, border per state (default/hover/active-current/focus/disabled)
3. **PREV/NEXT BUTTON** — icon-only square per state
4. **ELLIPSIS**
5. **SEPARATOR** (gap)
6. **PAGE INFO TEXT** — color, font-size, current-color, current-font-weight
7. **SIZING** — sm/md/lg height + padding
8. **TYPOGRAPHY** — font-family, font-size, weight
9. **BORDER + RADIUS**
10. **FOCUS RING**
11. **MOTION** — transition duration + easing
12. **ICON SIZE**
13. **STATE** — disabled
14. **RTL ALIASES** — chevron rotation via SVG mirror

## Related Falcon theme tokens

- `--color-falcon-neutral-{0,100,200,400,500,700,900}` — surfaces / text / borders
- `--color-falcon-teal-{500,700,tint,alpha-12}` — active state, focus ring
- `--radius-xs` — page button radius
- `--falcon-size-icon-{xs,sm,md,lg}` — icon scale
- `--ease-falcon-out`, `--duration-falcon-base` — transition tokens
- `--text-xs`, `--text-2xs` — font sizes per size variant

## Tailwind utility guidance

- Light DOM uses helpers in `libs/falcon-ui-core/src/tailwind/paginator-tailwind-classes.ts`.
- Per-instance utility via `[rootClass]` on the Angular wrapper.

## Dark mode

No component-level dark override in `paginator.tokens.css`. Inherits master theme.

## Density support

No explicit density variants — `size: 'sm' | 'md' | 'lg'` drives height + padding.

## RTL support

Token category 14 documents the RTL approach — chevron rotation via SVG mirror in CSS. Verified via the Light helper output for prev/next.

## Static style risks

- Page button uses `--falcon-paginator-page-bg-active: var(--color-falcon-teal-500)` — teal-500 fully filled. Consistent.

## Token usage by aspect

| Aspect | Token |
|---|---|
| Border | `--falcon-paginator-page-border-{width,style,color,color-hover,color-active,color-disabled}` |
| Radius | `--falcon-paginator-page-radius` (Wave varies) |
| Shadow | `--shadow-falcon-focus` via focus ring tokens |
| Spacing | `--falcon-paginator-gap`, `--falcon-paginator-info-gap`, sizing token padding |
| Color | per-state page button + nav button colors |
| Hover | `--falcon-paginator-page-bg-hover`, `--falcon-paginator-page-color-hover`, `--falcon-paginator-nav-color-hover` |
| Focus | `--falcon-paginator-focus-ring-*` |
| Disabled | `--falcon-paginator-page-color-disabled`, `--falcon-paginator-nav-color-disabled` |
