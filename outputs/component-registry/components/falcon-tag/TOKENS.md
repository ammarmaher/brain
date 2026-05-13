# falcon-tag — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/tag.tokens.css` (Wave 9.F)

Selector union covers `falcon-tag`, `falcon-tag-tw`, `falcon-angular-tag`.

## Token categories

1. **LAYOUT** — gap (6px), padding-y (2px), padding-x (10px), radius (999px / square fallback 4px), border-width (0px default), border-color (transparent)
2. **TYPOGRAPHY** — `--font-sans`, font-size (11px md / 10px sm / 13px lg), font-weight (500)
3. **SURFACE** — bg + fg per severity (secondary = neutral default)
4. **SIZING** — sm + lg height + padding overrides
5. **DISMISS** — dismiss button sizing (likely small clickable area + hover state)

## Severity → token mapping (per source)

```
secondary (default) → neutral-175 bg / neutral-700 fg
success             → falcon-green-* family
info                → falcon-blue-* family
warning / warn      → falcon-amber-* family
danger              → falcon-red-* family
contrast            → neutral-900 bg / neutral-50 fg (dark inverse)
```

(Severity-specific bg+fg tokens not fully shown in the read sample but follow the same pattern as `<falcon-badge>` and `<falcon-status-badge>`.)

## Related Falcon theme tokens

- Color palette: green / blue / amber / red / neutral families
- `--font-sans`
- No motion (chips are static)

## Tailwind utility guidance

Light DOM uses `tag-tailwind-classes.ts` helpers. Per-instance utility via host classes on `<falcon-angular-tag>`.

## Dark mode

No component-level override; inherits master theme.

## Density

No density variant; `[size]` covers sm/md/lg.

## RTL

- `padding-x` symmetric; gap direction-neutral.
- Icon leading flips automatically in RTL.
- Dismiss button trailing flips to leading in RTL.

## Static style risks

- Square fallback radius `4px` — hardcoded. Reasonable.
- Pixel padding values intentional.

## Token usage by aspect

| Aspect | Token |
|---|---|
| Border | `--falcon-tag-border-{width,color}` (default 0/transparent) |
| Radius | `--falcon-tag-radius` (999px) or `--falcon-tag-radius-square` (4px) |
| Shadow | None |
| Spacing | `--falcon-tag-{gap,padding-y,padding-x}` + sm/lg variants |
| Color | per-severity bg + fg |
| Hover | dismiss button hover (token surface incomplete — see GAP FT-03) |
| Focus | dismiss button focus ring |
| Disabled | inherited |
