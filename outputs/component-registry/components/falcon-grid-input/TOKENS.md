# falcon-grid-input — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/grid-input.tokens.css`.

## Token categories

1. CONTAINER — width (100%), height (matches cell), padding-x.
2. BACKGROUND — bg by state (idle / focus / disabled / error).
3. BORDER — width, color (idle / focus / error), radius.
4. TEXT — color, font-size, weight, line-height.
5. FOCUS RING — minimal — grid editors usually skip rings to avoid visual clutter.
6. MOTION — transition for commit / cancel feedback.

Compared to `<falcon-input>`, grid-input has:
- Smaller padding.
- Smaller focus ring (or none).
- No label / helper / error tokens.
- No prefix / suffix tokens.

## Related Falcon theme tokens

- `--color-falcon-teal-500` for focus border.
- `--color-falcon-neutral-50` for bg.
- `--color-falcon-red-500` for error.

## Tailwind utility guidance

Host `class=` for layout (typically `w-full h-full`).

## Dark mode

Token-driven.

## Density

Sized to fit grid cell height — typically inherits row-height tokens from table.

## RTL

Native input respects `dir`.

## Static style risks

None observed.

## No CSS / no SCSS

Per-instance via token override.

## Token usage by state

| State | Tokens |
|---|---|
| Idle | `--falcon-grid-input-bg`, `--falcon-grid-input-border-color`, `--falcon-grid-input-text-color` |
| Focus | `--falcon-grid-input-border-color-focus`, `--falcon-grid-input-bg-focus` |
| Error | `--falcon-grid-input-border-color-error`, `--falcon-grid-input-bg-error` |
| Disabled | `--falcon-grid-input-bg-disabled`, `--falcon-grid-input-text-color-disabled` |
| Dirty (future) | `--falcon-grid-input-border-color-dirty` |
