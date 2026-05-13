# falcon-switch — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/switch.tokens.css`.

## Token categories

1. CONTAINER ROW — gap, alignment.
2. LABEL — color, font, weight.
3. TRACK — width, height per `sm` / `md` / `lg`, radius, bg by state (off / on / disabled / readonly).
4. KNOB — size, color, shadow, position (off → left, on → right; RTL flips), motion.
5. CHANNEL-PILL TEXT — color (left/right), font-size, padding-x.
6. HIDDEN-INPUT VARIANT — track padding, indicator visual.
7. FOCUS RING — width, color, offset.
8. ERROR / SUCCESS / WARNING — colors.
9. MOTION — track + knob transition (typically 150ms).

## Related Falcon theme tokens

- `--color-falcon-teal-500` for on-track.
- `--color-falcon-neutral-300` for off-track.
- `--color-falcon-red-500` for error.

## Tailwind utility guidance

`rowClass`, `trackClass`, `labelClass`.

## Dark mode

Token-driven.

## Density

Track + knob sizes scale with `size`.

## RTL

Knob slides toward opposite direction; channel-pill text reading order auto-flips.

## Static style risks

Knob position transition is token-driven.

## No CSS / no SCSS

Per-instance via token override.

## Token usage by state

| State | Tokens |
|---|---|
| Off | `--falcon-switch-track-bg-off`, `--falcon-switch-knob-position-off` |
| On | `--falcon-switch-track-bg-on`, `--falcon-switch-knob-position-on` |
| Focus | `--falcon-switch-ring-color-focus`, `--falcon-switch-ring-width` |
| Error | `--falcon-switch-track-border-error`, `--falcon-switch-error-text-color` |
| Disabled | `--falcon-switch-track-bg-disabled`, `--falcon-switch-knob-bg-disabled`, `--falcon-switch-text-color-disabled` |
| Channel-pill text on | `--falcon-switch-text-color-on`, `--falcon-switch-text-on-padding-x` |
| Channel-pill text off | `--falcon-switch-text-color-off`, `--falcon-switch-text-off-padding-x` |
