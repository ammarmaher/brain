# falcon-checkbox-group — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/checkbox-group.tokens.css`.

## Token categories

1. CONTAINER — display, padding, gap.
2. GROUP LABEL — color, font, weight, margin, required marker color.
3. LAYOUT — gap between checkboxes (different for horizontal vs vertical).
4. HELPER / ERROR TEXT — color, font, margin.

## Related Falcon theme tokens

- `--falcon-spacing-1`, `--falcon-spacing-2`, `--falcon-spacing-3` for gaps.
- `--color-falcon-neutral-700` for group label idle.
- `--color-falcon-red-500` for error.

Child `<falcon-angular-checkbox>` uses its own tokens; group does NOT override them.

## Tailwind utility guidance

Wrapping `class=` on the host element for layout (e.g. `grid grid-cols-2 gap-3`). Built-in `orientation` covers vertical / horizontal.

## Dark mode

Token-driven (label / helper / error inherit from neutral inversion).

## Density

Group gap shifts via density preset.

## RTL

Vertical orientation unaffected; horizontal flips item order via flex direction inheritance.

## Static style risks

None observed (no inline styles in template — confirm).

## No CSS / no SCSS

Per-instance overrides via token mutation.

## Token usage by state

| State | Tokens |
|---|---|
| Default | `--falcon-checkbox-group-gap`, `--falcon-checkbox-group-label-color` |
| Error | `--falcon-checkbox-group-error-text-color`, `--falcon-checkbox-group-error-margin-top` |
| Required | `--falcon-checkbox-group-required-color` (if exists) |
| Helper | `--falcon-checkbox-group-helper-color`, `--falcon-checkbox-group-helper-font-size` |
