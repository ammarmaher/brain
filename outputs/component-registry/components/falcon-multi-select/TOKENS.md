# falcon-multi-select — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/multi-select.tokens.css`. Inherits the input/dropdown surface + adds chip-specific tokens.

## Token categories

1. CONTAINER / TRIGGER — bg / border / radius / shadow per state (default / hover / focus / error / success / warning / disabled / readonly).
2. LABEL — color (idle + error), font, weight, margin.
3. SIZING — height / padding-x / padding-y per `sm` / `md` / `lg`.
4. TYPOGRAPHY — body font.
5. CHIP — bg, text-color, border, radius, padding-x/y, font-size, gap, max-width, truncation.
6. CHIP-REMOVE — icon size, color (idle + hover), bg-hover.
7. OVERFLOW PILL ("+N more") — bg, color, padding, radius.
8. SEARCH BAR (inside panel) — bg, border, focus halo, gap, icon color.
9. PANEL — bg, border, radius, max-height, shadow, z-index.
10. LISTBOX OPTION — bg/text per state (idle/hover/active/selected/disabled).
11. SELECT-ALL ROW — bg, border-bottom, checkbox token.
12. HELPER / ERROR TEXT — color, font-size, weight, margin.
13. CLEAR BUTTON — size, color, bg.
14. MOTION — transition + panel-open animation.

## Related Falcon theme tokens

Same as dropdown plus:
- Chip colors leverage `--color-falcon-teal-tint`, `--color-falcon-teal-500`, `--color-falcon-teal-alpha-*`.
- Overflow pill uses neutral background tokens.

## Tailwind utility guidance

Use `wrapperClass / triggerClass / panelClass / optionClass / labelClass`. Width / responsive via host `class=`.

## Dark mode

Token-driven. Chip backgrounds shift via neutral inversion; teal-tint stays close to brand via the `--color-falcon-teal-tint` dark override.

## Density

Heights tied to `--falcon-density-input-height-*`.

## RTL

Chip layout flips automatically via flex direction inheritance. Verify search-bar icon position.

## Static style risks

Verify Stencil source for hardcoded chip padding / px values — flag any escapes from `--falcon-multi-select-chip-padding-*` tokens.

## No CSS / no SCSS guidance

Same rules as dropdown — never set inline styles; never write component CSS rules; per-instance overrides via host class + token mutation only.

## Token usage by state

| State | Tokens |
|---|---|
| Trigger idle | `--falcon-multi-select-bg`, `--falcon-multi-select-border-color`, `--falcon-multi-select-shadow` |
| Trigger focus | `--falcon-multi-select-border-color-focus`, `--falcon-multi-select-shadow-focus`, `--falcon-multi-select-ring-color-focus` |
| Trigger error | `--falcon-multi-select-border-color-error`, `--falcon-multi-select-shadow-error` |
| Chip | `--falcon-multi-select-chip-bg`, `--falcon-multi-select-chip-text-color`, `--falcon-multi-select-chip-border-color`, `--falcon-multi-select-chip-radius`, `--falcon-multi-select-chip-padding-x`, `--falcon-multi-select-chip-padding-y` |
| Chip remove hover | `--falcon-multi-select-chip-remove-bg-hover`, `--falcon-multi-select-chip-remove-color-hover` |
| Overflow pill | `--falcon-multi-select-overflow-bg`, `--falcon-multi-select-overflow-color` |
| Panel | `--falcon-multi-select-panel-bg`, `--falcon-multi-select-panel-border`, `--falcon-multi-select-panel-shadow`, `--falcon-multi-select-panel-max-height` |
| Option hover | `--falcon-multi-select-option-bg-hover` |
| Option selected | `--falcon-multi-select-option-bg-selected` |
