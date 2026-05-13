# falcon-status-badge — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/status-badge.tokens.css` (91 lines, 5 categories).

```
:where(falcon-status-badge, falcon-status-badge-tw, falcon-angular-status-badge, .falcon-status-badge, [data-falcon-status-badge]) { … }
```

## Token categories

1. **LAYOUT** — `--falcon-status-badge-{gap,min-width,padding-y,padding-inline-start,padding-inline-end,border-radius}`
2. **TYPOGRAPHY** — `--falcon-status-badge-{font-family,font-size,font-weight,line-height}`
3. **SURFACE** — bg + fg per status bucket (`active`, `pending`, `inactive`, `danger`) + neutral default
4. **DOT** — `--falcon-status-badge-dot-{size,radius,bg}` + per-bucket dot bgs
5. **SIZING** — sm + lg overrides on min-width, padding, font-size, dot-size

## Severity → bucket mapping (verified in token file)

```
active / paid           → success (green-200 bg + green-700 fg + green-500 dot)
pending                 → warning (amber-50 bg + amber-700 fg + amber-500 dot)
suspended / locked /    → neutral (neutral-175 bg + neutral-700 fg + neutral-500 dot)
  inactive / disabled
deleted / expired       → danger (red-100 bg + red-700 fg + red-500 dot)
```

## Related Falcon theme tokens

- `--color-falcon-green-{200,500,700}`
- `--color-falcon-amber-{50,500,700}`
- `--color-falcon-neutral-{175,500,700}`
- `--color-falcon-red-{100,500,700}`
- `--font-display` (typography family for status badges per the React V0.2 reference)

## Tailwind utility guidance

Light DOM uses `status-badge-tailwind-classes.ts` helpers. Per-severity Tailwind classes generated from the bucket tokens.

## Dark mode

No component-level dark override in `status-badge.tokens.css`. The palette tokens flip via the master `app-dark` block; status badge contrast should be re-verified for dark canvas. **P3 — add dark-mode bucket overrides if contrast fails.**

## Density

Drives via `[size]` input (sm/md/lg). No `density` token — the badge itself is small enough that density doesn't matter.

## RTL

- `padding-inline-start` + `padding-inline-end` — RTL-safe.
- Dot is leading — flips to trailing in RTL automatically.

## Static style risks

- `--falcon-status-badge-min-width: 74px` (md) — fixed pixel value. Acceptable per React V0.2 reference.
- Border-radius `999px` — pill shape, intentional.

## Token usage by aspect

| Aspect | Token |
|---|---|
| Border | None (no border on the pill) |
| Radius | `--falcon-status-badge-border-radius` (999px = pill) |
| Shadow | None |
| Spacing | `--falcon-status-badge-{gap, padding-y, padding-inline-start, padding-inline-end}` |
| Color | per-bucket bg + fg + dot bg |
| Hover | None — status is non-interactive |
| Focus | None — status is non-interactive |
| Disabled | inherited from `--falcon-table-disabled-opacity` if inside a disabled row |
