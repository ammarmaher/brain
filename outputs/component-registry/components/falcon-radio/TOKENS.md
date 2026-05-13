# falcon-radio — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/radio.tokens.css`.

## Token categories

1. CONTAINER ROW — gap, alignment.
2. LABEL — color, font, weight, margin.
3. MARK SIZING — outer circle size per `sm` / `md` / `lg`.
4. MARK BACKGROUND — bg by state (unchecked / hover / checked / disabled).
5. MARK BORDER — width, color, radius (50%).
6. INNER DOT — color, size — implemented via border-width-5 trick at checked.
7. FOCUS RING — width, color, offset.
8. ERROR — border + text color.
9. HELPER / ERROR TEXT — color, font, margin.
10. MOTION — transition for check-in.

## Related Falcon theme tokens

- `--color-falcon-teal-500` for checked border + dot.
- `--color-falcon-neutral-300/400` for idle border.
- `--color-falcon-red-500` for error.

## Tailwind utility guidance

`rowClass`, `markClass`, `labelClass`.

## Dark mode

Token-driven.

## Density

Mark size scales with `size`.

## RTL

Auto-flips row direction.

## Static style risks

Border-width-5 trick is token-driven but visually sensitive — verify on dark mode.

## No CSS / no SCSS

Per-instance via token override.

## Token usage by state

| State | Tokens |
|---|---|
| Idle | `--falcon-radio-bg`, `--falcon-radio-border-color` |
| Hover | `--falcon-radio-border-color-hover`, `--falcon-radio-bg-hover` |
| Checked | `--falcon-radio-border-color-checked`, `--falcon-radio-bg-checked-inner` |
| Focus | `--falcon-radio-ring-color-focus`, `--falcon-radio-ring-width` |
| Error | `--falcon-radio-border-color-error`, `--falcon-radio-error-text-color` |
| Disabled | `--falcon-radio-bg-disabled`, `--falcon-radio-border-color-disabled`, `--falcon-radio-text-color-disabled` |
