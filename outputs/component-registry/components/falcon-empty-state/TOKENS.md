# falcon-empty-state — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/empty-state.tokens.css`

Selector union covers `falcon-empty-state`, `falcon-empty-state-tw`, `falcon-angular-empty-state`.

## Token categories

- **Layout** — root padding, gap between icon/title/description/action, max-width
- **Icon** — size per size variant, color
- **Title** — font-family (`--font-display`), font-size per size variant, font-weight, color
- **Description** — font-size, font-weight, color, max-width
- **Action region** — gap, margin-top
- **Sizing** — sm / md / lg overrides

(Read file directly for exhaustive variable list.)

## Related Falcon theme tokens

- `--color-falcon-neutral-{500,600,700,900}` — title / description colors
- `--color-falcon-teal-500` — primary icon color tone (token-overridable)
- `--font-display` — title font
- `--text-{lg,xl,2xl}` — font scale

## Tailwind utility guidance

Light DOM uses helpers in `empty-state-tailwind-classes.ts`. Per-instance host classes for additional utilities.

## Dark mode

No component-level dark override; inherits master theme.

## Density

Drives via `[size]` input (sm/md/lg).

## RTL

- Root flex column layout — direction-neutral.
- Icon center-aligned — direction-neutral.

## Static style risks

- Default text alignment center — intentional. Override via Tailwind utility on host if needed.

## Token usage by aspect

| Aspect | Token |
|---|---|
| Border | None (no border) |
| Radius | Inherits container radius if wrapped |
| Shadow | None |
| Spacing | gaps + paddings via tokens |
| Color | icon, title, description colors |
| Hover | None — presentational |
| Focus | None — presentational |
| Disabled | inherited |
