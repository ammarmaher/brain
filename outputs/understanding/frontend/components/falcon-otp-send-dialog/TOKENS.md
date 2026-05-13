# falcon-otp-send-dialog — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/otp-send-dialog.tokens.css`.

## Token categories

Inherits `<falcon-dialog>` + `<falcon-radio>` + `<falcon-otp>` tokens plus orchestration-level:

1. STEP TRANSITION — duration, easing.
2. CHANNEL CARD — bg, border, radius, padding, hover bg (for radio rows in step 1).
3. STEP TITLE — color, font, weight, margin.
4. STEP SUBTITLE — color, font, margin.
5. RESEND LINK / BUTTON — color, hover.
6. CANCEL BUTTON — variant tokens from `<falcon-button>`.

## Related Falcon theme tokens

Inherits dialog z-index, popover shadow, brand teal for primary actions.

## Tailwind utility guidance

No path-specific class props on this wrapper. Override via tokens.

## Dark mode

Token-driven.

## Density

Inherits dialog density.

## RTL

Inherits dialog RTL behavior.

## Static style risks

None unique.

## No CSS / no SCSS

Per-instance via token override.

## Token usage by state

| State | Tokens |
|---|---|
| Channel row idle | `--falcon-otp-send-dialog-channel-bg`, `--falcon-otp-send-dialog-channel-border-color` |
| Channel row hover | `--falcon-otp-send-dialog-channel-bg-hover` |
| Channel row selected | `--falcon-otp-send-dialog-channel-bg-selected`, `--falcon-otp-send-dialog-channel-border-color-selected` |
| Step title | `--falcon-otp-send-dialog-title-color`, `--falcon-otp-send-dialog-title-font-weight` |
| Subtitle | `--falcon-otp-send-dialog-subtitle-color` |
| Resend link | `--falcon-otp-send-dialog-resend-color`, `--falcon-otp-send-dialog-resend-color-hover` |
| Resend cooldown (future) | `--falcon-otp-send-dialog-resend-color-disabled` |
