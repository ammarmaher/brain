# falcon-calendar — TOKENS

## Token file

`libs/falcon-ui-tokens/src/components/calendar.tokens.css`.

## Token categories

1. CONTAINER — bg, border, radius, shadow, padding.
2. HEADER — bg, color, font-weight, padding, button-bg (prev/next).
3. WEEKDAY ROW — text-color, font-size, padding-y.
4. CELL — width / height per size, gap, border-radius.
5. CELL STATES — idle / hover / today / selected / range / disabled / outside-month.
6. SELECTED — bg, color.
7. TODAY MARKER — outline color / underline.
8. RANGE (when implemented) — bg, color, start/end.
9. DISABLED — color, bg.
10. WEEK NUMBER COLUMN — color, bg, font.
11. NAV BUTTONS — size, color, hover, focus.
12. MOTION — transitions for hover + select.

## Related Falcon theme tokens

- `--color-falcon-teal-500` for selected.
- `--color-falcon-neutral-0` for selected text.
- `--color-falcon-teal-tint` for hover bg.
- `--color-falcon-neutral-100` for outside-month.

## Tailwind utility guidance

`rootClass` for additional Tailwind. Layout typically inline-block.

## Dark mode

Token-driven.

## Density

Cell size scales with `size`.

## RTL

Header arrows flip; weekday order flips when `firstDayOfWeek` is set appropriately for Arabic locale.

## Static style risks

- Month/year labels are locale-driven via `Intl.DateTimeFormat` — not a token concern.

## No CSS / no SCSS

Per-instance via token override.

## Token usage by state

| State | Tokens |
|---|---|
| Cell idle | `--falcon-calendar-day-bg`, `--falcon-calendar-day-text-color` |
| Cell hover | `--falcon-calendar-day-bg-hover`, `--falcon-calendar-day-text-color-hover` |
| Cell today | `--falcon-calendar-day-marker-today`, `--falcon-calendar-day-border-today` |
| Cell selected | `--falcon-calendar-day-bg-selected`, `--falcon-calendar-day-text-color-selected` |
| Cell disabled | `--falcon-calendar-day-bg-disabled`, `--falcon-calendar-day-text-color-disabled` |
| Cell outside-month | `--falcon-calendar-day-text-color-outside` |
| Header | `--falcon-calendar-header-bg`, `--falcon-calendar-header-text-color`, `--falcon-calendar-header-nav-color` |
| Container | `--falcon-calendar-container-bg`, `--falcon-calendar-container-border-color`, `--falcon-calendar-container-radius`, `--falcon-calendar-container-shadow` |
| Week number | `--falcon-calendar-week-number-color`, `--falcon-calendar-week-number-bg` |
