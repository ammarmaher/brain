# falcon-badge — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/badge.tokens.css` (85 lines, 4 categories).

Selector union covers `falcon-badge`, `falcon-badge-tw`, `falcon-angular-badge`.

## Token categories (4)

1. **LAYOUT** — gap (4px), padding-y (2px), padding-x (8px), border-radius (999px = pill), border-width (1px), border-color (transparent default) + sm/lg padding overrides
2. **TYPOGRAPHY** — font-family (`--font-sans`), font-size (11px / 10px sm / 13px lg), font-weight (500), line-height (1.2)
3. **SURFACE** — bg + fg per variant (subtle appearance default):
   - neutral: `neutral-100` bg / `neutral-700` fg
   - primary: `teal-100` bg / `teal-700` fg
   - success: `green-200` bg / `green-700` fg
   - warning: `amber-50` bg / `amber-700` fg
   - danger: `red-100` bg / `red-700` fg
   - info: `blue-100` bg / `blue-700` fg
   - solid fg always `neutral-50` (~white)
4. **DOT** — dot-size (6px) + per-variant dot bg

## Related Falcon theme tokens

- Color palette: full neutral / teal / green / amber / red / blue scale
- `--font-sans` family
- No motion / shadow tokens (badge is static visual)

## Tailwind utility guidance

Light DOM uses `badge-tailwind-classes.ts` helpers — generated from the same per-variant token scheme.

## Dark mode

No component-level override; inherits master theme palette which inverts neutrals in dark mode.

## Density

No density variants; `[size]` covers size differences (sm/md/lg).

## RTL

- Padding-x is symmetric; gap is direction-neutral.
- Icon + label flip direction in RTL naturally.

## Static style risks

- Border-radius `999px` (pill) — intentional.
- Pixel padding values — small + intentional.

## Token usage by aspect

| Aspect | Token |
|---|---|
| Border | `--falcon-badge-border-{width,color}` (default transparent — used by `outline` appearance) |
| Radius | `--falcon-badge-border-radius` (999px) |
| Shadow | None |
| Spacing | `--falcon-badge-{gap,padding-y,padding-x}` + sm/lg variants |
| Color | per-variant bg + fg |
| Hover | None (badges aren't interactive) |
| Focus | None |
| Disabled | inherited |
