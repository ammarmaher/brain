# falcon-otp — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/otp.tokens.css`.

## Token categories

1. CONTAINER — display (flex), gap between boxes per size.
2. LABEL — color, font, weight, margin.
3. BOX SIZING — width / height per `sm` / `md` / `lg`.
4. BOX BACKGROUND — bg by state (idle / focus / filled / error / success / disabled).
5. BOX BORDER — width, color, radius, state colors.
6. BOX TEXT — color, font-size, font-weight, text-align (center), placeholder color.
7. FOCUS RING — width, color, offset.
8. ERROR — border + text color.
9. HELPER / ERROR TEXT — color, font, margin.
10. MOTION — transition.

## Related Falcon theme tokens

- `--color-falcon-teal-500` for focus.
- `--color-falcon-neutral-200` for idle border.
- `--color-falcon-red-500` for error.
- `--falcon-radius-md` for box radius.

## Tailwind utility guidance

`wrapperClass`, `boxClass`, `inputClass`, `labelClass`.

## Dark mode

Token-driven.

## Density

Box sizes scale with `size`.

## RTL

Boxes flow right-to-left in RTL. Paste-fill order should respect this — verify Stencil.

## Static style risks

Mask character is hardcoded (G6).

## No CSS / no SCSS

Per-instance via token override.

## Token usage by state

| State | Tokens |
|---|---|
| Idle | `--falcon-otp-box-bg`, `--falcon-otp-box-border-color`, `--falcon-otp-box-text-color` |
| Filled | `--falcon-otp-box-bg-filled`, `--falcon-otp-box-text-color-filled` |
| Focus | `--falcon-otp-box-bg-focus`, `--falcon-otp-box-border-color-focus`, `--falcon-otp-box-ring-color-focus` |
| Error | `--falcon-otp-box-border-color-error`, `--falcon-otp-box-bg-error`, `--falcon-otp-error-text-color` |
| Disabled | `--falcon-otp-box-bg-disabled`, `--falcon-otp-box-text-color-disabled` |
| Layout | `--falcon-otp-gap-{sm,md,lg}`, `--falcon-otp-box-size-{sm,md,lg}` |
