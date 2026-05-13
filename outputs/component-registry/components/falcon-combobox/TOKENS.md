# falcon-combobox — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/combobox.tokens.css`.

## Token categories

1. CONTAINER / INPUT — width / min / max.
2. LABEL — color, font, weight, margin.
3. SIZING — heights / paddings per size.
4. TYPOGRAPHY — body font.
5. BACKGROUND — input bg by state (idle / hover / focus / disabled).
6. TEXT COLOR — input + placeholder.
7. BORDER — width / radius / per-state colors.
8. SHADOW — by state.
9. FOCUS RING — width / color.
10. CHEVRON / CLEAR — icon size, color, hover.
11. PANEL — bg, border, radius, max-height, shadow, z-index.
12. SUGGESTION — bg / text per state.
13. LOADING INDICATOR — spinner color, size.
14. NO-MATCHES TEXT — color, font.
15. MOTION — transitions + panel animation.

## Related Falcon theme tokens

Inherits brand teal focus ring, neutral surface colors, radius primitives. Loading spinner reads from `--color-falcon-teal-500`.

## Tailwind utility guidance

`wrapperClass / inputClass / panelClass / optionClass / labelClass` for path-specific extras. Layout / responsive via host.

## Dark mode

Token-driven.

## Density

Heights tied to `--falcon-density-input-height-*`.

## RTL

Auto-mirrors via flex.

## Static style risks

Verify Stencil for hardcoded px.

## No CSS / no SCSS

Per-instance override via token mutation on host class. Never inline styles.

## Token usage by state

| State | Tokens |
|---|---|
| Idle | `--falcon-combobox-bg`, `--falcon-combobox-border-color`, `--falcon-combobox-text-color` |
| Focus | `--falcon-combobox-border-color-focus`, `--falcon-combobox-shadow-focus`, `--falcon-combobox-ring-color-focus` |
| Loading | `--falcon-combobox-spinner-color`, `--falcon-combobox-spinner-size` |
| Panel open | `--falcon-combobox-panel-bg`, `--falcon-combobox-panel-shadow` |
| Option hover | `--falcon-combobox-option-bg-hover` |
| Option selected | `--falcon-combobox-option-bg-selected` |
| Disabled | `--falcon-combobox-bg-disabled`, `--falcon-combobox-text-color-disabled` |
| No matches | `--falcon-combobox-empty-color` |
