# falcon-radio-group — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/radio-group.tokens.css`.

## Token categories

1. CONTAINER — display, padding, gap.
2. GROUP LABEL — color, font, weight, margin, required marker.
3. LAYOUT — gap between radios (orientation-aware).
4. HELPER / ERROR TEXT — color, font, margin.

## Related Falcon theme tokens

Inherits primitives. Child radios use their own tokens.

## Tailwind utility guidance

Host `class=` for layout. `orientation` covers vertical/horizontal.

## Dark mode

Token-driven.

## Density

Group gap shifts.

## RTL

Horizontal orientation flips order; vertical unaffected.

## Static style risks

None observed.

## No CSS / no SCSS

Per-instance via token override.

## Token usage by state

| State | Tokens |
|---|---|
| Default | `--falcon-radio-group-gap`, `--falcon-radio-group-label-color` |
| Error | `--falcon-radio-group-error-text-color` |
| Helper | `--falcon-radio-group-helper-color` |
| Required | `--falcon-radio-group-required-color` (if exists) |
