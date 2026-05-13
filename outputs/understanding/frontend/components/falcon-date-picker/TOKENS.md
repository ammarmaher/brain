# falcon-date-picker — TOKENS

## Token file

Shares `libs/falcon-ui-tokens/src/components/calendar.tokens.css` plus its own surface tokens (input section).

## Token categories

INPUT SECTION (same as `<falcon-input>` tokens):
1. CONTAINER, LABEL, SIZING, TYPOGRAPHY, BACKGROUND, TEXT COLOR, BORDER, SHADOW, FOCUS RING, HELPER, ERROR, CLEAR/CALENDAR BUTTON, MOTION.

POPOVER SECTION (same as calendar tokens):
1. POPOVER CONTAINER — bg, border, radius, shadow, z-index.
2. POPOVER POSITION OFFSET — distance from input.
3. POPOVER OPEN/CLOSE animation — duration, easing.

## Related Falcon theme tokens

- Input: same as `<falcon-input>` (teal focus, neutral borders).
- Popover: `--shadow-falcon-popover`, `--z-falcon-popover` (1070).

## Tailwind utility guidance

`rootClass` for additional Tailwind on wrapper. The popover is rendered as a child of the wrapper.

## Dark mode

Token-driven.

## Density

Inherits input density.

## RTL

Input + calendar arrows + popover anchor all flip in RTL.

## Static style risks

Popover positioning relies on absolute / fixed CSS — verify on long pages.

## No CSS / no SCSS

Per-instance via token override.

## Token usage by state

| State | Tokens |
|---|---|
| Input idle | (inherits `<falcon-input>` tokens) |
| Input focus | `--falcon-input-border-color-focus`, `--falcon-input-shadow-focus` |
| Input error | `--falcon-input-border-color-error` |
| Popover open | `--falcon-calendar-container-shadow`, `--falcon-calendar-container-bg`, `--z-falcon-popover` |
| Calendar cell | (inherits calendar tokens) |
| Trigger calendar icon | `--falcon-date-picker-icon-color`, `--falcon-date-picker-icon-color-hover` |
