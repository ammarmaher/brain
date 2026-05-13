# falcon-search-input — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/search-input.tokens.css`.

## Token categories

Inherits all `<falcon-input variant='search'>` tokens plus:

1. SEARCH ICON — color (idle / focus), size, position (start).
2. CLEAR BUTTON — same as input clear-button.
3. SPINNER — color, size, position (end).
4. SPECIFIC bg — typically tinted (e.g. `--color-falcon-neutral-50`).

## Related Falcon theme tokens

- `--color-falcon-neutral-700` for search icon idle.
- `--color-falcon-teal-500` for spinner.

## Tailwind utility guidance

Host `class=` for layout. No path-specific class props.

## Dark mode

Token-driven.

## Density

Inherits input density.

## RTL

Search icon flips to right; clear-X flips to left.

## Static style risks

Icons hardcoded SVG.

## No CSS / no SCSS

Per-instance via token override.

## Token usage by state

| State | Tokens |
|---|---|
| Idle | `--falcon-search-input-bg`, `--falcon-search-input-icon-color` |
| Focus | `--falcon-search-input-border-color-focus`, `--falcon-search-input-icon-color-focus` |
| Loading | `--falcon-search-input-spinner-color`, `--falcon-search-input-spinner-size` |
| Clear button | `--falcon-search-input-clear-color`, `--falcon-search-input-clear-bg-hover` |
| Disabled | `--falcon-search-input-bg-disabled`, `--falcon-search-input-text-color-disabled` |
