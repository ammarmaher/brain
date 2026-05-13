# falcon-input-number — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/input-number.tokens.css`.

## Token categories

Inherits all `<falcon-input>` tokens plus:

1. SPINNER BUTTON — width, height, color (idle / hover / disabled), bg, radius.
2. SPINNER LAYOUT — gap between input and ± buttons.
3. PREFIX / SUFFIX TEXT (when implemented) — color, font, padding.
4. CURRENCY SYMBOL — color (inherits prefix), padding.

## Related Falcon theme tokens

Same as input + button. Currency rendering via Intl runtime, not tokens.

## Tailwind utility guidance

`rootClass`, `inputClass`. Layout via host class.

## Dark mode

Token-driven (input + button inheritance).

## Density

Inherits input density.

## RTL

Native `<input type=text>` (the wrapper renders a generic input with inputmode) respects `dir`. Intl formatting yields RTL-friendly numerals automatically when `locale` is Arabic.

## Static style risks

Currency symbol position is locale-driven via Intl, not token-controlled. This is correct.

## No CSS / no SCSS

Per-instance via input + button token overrides.

## Token usage by state

| State | Tokens |
|---|---|
| Input idle | (inherits `<falcon-input>` tokens) |
| Spinner button idle | `--falcon-input-number-spinner-bg`, `--falcon-input-number-spinner-color` |
| Spinner button hover | `--falcon-input-number-spinner-bg-hover`, `--falcon-input-number-spinner-color-hover` |
| Spinner button disabled | `--falcon-input-number-spinner-bg-disabled`, `--falcon-input-number-spinner-color-disabled` |
| Spinner layout | `--falcon-input-number-spinner-gap`, `--falcon-input-number-spinner-width` |
| Disabled input | `--falcon-input-bg-disabled` |
