# falcon-filter-panel — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/filter-panel.tokens.css`

Selector union covers `falcon-filter-panel`, `falcon-filter-panel-tw`, `falcon-angular-filter-panel`.

## Token categories

- Container: gap, padding, bg, radius, border
- Slot (per-field): gap, label-color, label-font-size, label-margin
- Input: height per density, bg, border, color, focus-ring
- Select: same as input + chevron color
- Date input: same as input + native date picker style passthrough
- Button (Apply / Clear All): bg, color, border per state
- Sizing: compact vs normal density rows

(Read file directly for exhaustive list.)

## Related Falcon theme tokens

- Palette neutrals + brand teal for buttons/borders
- `--falcon-size-control-{sm,md}` for input height (where used)
- `--falcon-border-width-1` for borders
- `--ease-falcon-out` / `--duration-falcon-base` for focus transitions

## Tailwind utility guidance

- Light DOM uses helpers in `filter-panel-tailwind-classes.ts`.
- Per-instance utility via `[wrapperClass]`, `[slotClass]`, `[inputClass]` on the Angular wrapper.

## Dark mode

No component-level dark override; inherits master theme.

## Density support

Yes — `density: 'compact' | 'normal'` drives heights and paddings.

## RTL support

- Container uses `gap` + `padding-inline-*` — RTL-safe.
- Date range fields side-by-side flip direction naturally.

## Static style risks

- Native `<select>` chevron rendered by browser — NOT controllable through Falcon tokens. **GAP — see FFP-01.**
- Native `<input type="date">` widget appearance is browser-controlled too.

## Token usage by aspect

| Aspect | Token |
|---|---|
| Border | input/select borders |
| Radius | container + input radii |
| Shadow | focus-ring shadow |
| Spacing | container padding + gap, slot gap, input padding |
| Color | label, input, button colors |
| Hover | input hover border, button hover bg |
| Focus | focus-ring |
| Disabled | inherited opacity |
