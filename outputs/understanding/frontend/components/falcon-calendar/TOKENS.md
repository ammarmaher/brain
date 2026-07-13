# falcon-calendar — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/calendar.tokens.css` (**237 lines** — recount 2026-06-03). **SHARED with `<falcon-date-picker>`** — one file declares both the calendar grid tokens (`--falcon-calendar-*`) and the date-picker input/popover tokens (`--falcon-date-picker-*`). 14 documented categories (`[CODE]` calendar.tokens.css:10-25).

`[CODE]` calendar.tokens.css:27-49 — **gate-12 portaled-popover file.** The 2026-05-15 portal wave had promoted these to `:root`; the 2026-06-02 gate-12 rescope moved them back onto the component `:where()` selector. Because the date-picker popover panel is re-parented into the body-level `.falcon-overlay-container` by `portalToOverlay()`, **`.falcon-overlay-container` is INCLUDED in the selector** so the portaled panel still inherits `--falcon-calendar-*` / `--falcon-date-picker-*`. Full selector:

```css
:where(falcon-calendar, falcon-calendar-tw, falcon-angular-calendar,
       falcon-date-picker, falcon-date-picker-tw, falcon-angular-date-picker,
       .falcon-calendar, .falcon-date-picker,
       [data-falcon-calendar], [data-falcon-date-picker],
       .falcon-overlay-container) { … }
```

`:where()` keeps specificity 0 so per-instance host-class overrides win. **gate-12 compliant** (scoped, includes the portal container — this is one of the 4 portaled-popover token files the gate-12 audit must NOT see on `:root`).

## Token categories (14 declared; calendar-specific subset)

`[CODE]` calendar.tokens.css:50-237. The calendar grid consumes categories 1-6, 9-11, 14; the date-picker consumes 7-8, 12-13 (input + popover shell). Calendar grid:

1. CONTAINER — `--falcon-calendar-display` (`inline-block`), `-bg`, `-color`, `-padding` (12px), `-width` (260px), `-min-width` (240px), `-border-width/-color/-border-radius` (10px), `-shadow`, `-z-index` (60).
2. HEADER — `-header-padding-block/-inline`, `-margin-bottom`, `-gap`, `-title-font-size/-weight/-color/-text-align/-line-height`.
2b. NAV BUTTON — `-nav-size` (26px), `-nav-icon-size` (12px), `-nav-color`, `-nav-color-hover`, `-nav-bg`, `-nav-bg-hover`, `-nav-border-radius`.
3. WEEKDAY ROW — `-weekday-row-margin-bottom`, `-weekday-font-size` (10.5px), `-weekday-font-weight`, `-weekday-color`, `-weekday-text-align`, `-weekday-padding`, `-weekday-text-transform` (uppercase), `-weekday-letter-spacing`.
4. DAY CELL — `-day-height` (30px), `-day-min-width`, `-day-font-size` (12px), `-day-font-weight`, `-day-color`, `-day-bg`, `-day-border-radius`, `-day-cursor`.
   - 4b hover: `-day-bg-hover`, `-day-color-hover`.
   - 4c today: `-day-today-color`, `-day-today-bg`, `-day-today-shadow` (inset 1px teal ring), `-day-today-font-weight`.
   - 4d selected: `-day-selected-bg`, `-day-selected-color`, `-day-selected-font-weight`, `-day-selected-shadow`.
   - 4e disabled: `-day-disabled-bg`, `-day-disabled-color`, `-day-disabled-text-decoration` (`none` — slash overlay replaced the legacy line-through), `-day-disabled-cursor`.
   - 4e.1 disabled SLASH OVERLAY: `-disabled-icon-color`, `-disabled-icon-width` (100%), `-disabled-icon-height` (100%), `-disabled-icon-stroke-width` (1.5).
   - 4f outside-month: `-day-outside-color`, `-day-outside-opacity` (0.55).
5. WEEK NUMBER CELL — `-week-number-color`, `-week-number-font-size`, `-week-number-font-weight`, `-week-number-padding-inline-end`, `-week-number-text-align`.
6. GRID-ROW GAP — `-grid-row-gap` (2px), `-grid-col-gap` (2px).
9. ICON (chevrons) — `-chevron-stroke-width`, `-chevron-rtl-flip` (`scaleX(-1)`).
10. MOTION — `-popover-transition-duration/-easing` (date-picker), `-day-transition-duration` (120ms), `-day-transition-property`.
11. FOCUS RING — `-focus-ring-color`, `-focus-ring-width` (2px), `-focus-ring-offset`.
14. STATE — `-disabled-opacity` (0.55), `-disabled-cursor`.

> **CORRECTION (2026-06-03):** the prior dossier's token names `--falcon-calendar-container-bg`, `--falcon-calendar-container-radius`, `--falcon-calendar-container-shadow`, `--falcon-calendar-day-marker-today`, `--falcon-calendar-day-border-today`, `--falcon-calendar-header-nav-color` **do not exist**. The real names are `--falcon-calendar-bg`, `--falcon-calendar-border-radius`, `--falcon-calendar-shadow`, `--falcon-calendar-day-today-shadow` (the "marker"), and `--falcon-calendar-nav-color`. Corrected throughout this file.

## Related Falcon theme tokens

| Falcon theme token | Used by calendar via |
|---|---|
| `--color-falcon-neutral-0` | container bg + selected-cell text |
| `--color-falcon-neutral-900` | container/title text |
| `--color-falcon-neutral-200` | container/nav border |
| `--color-falcon-teal-500` | selected-cell bg + today ring + nav-hover color |
| `--color-falcon-teal-alpha-08` | day hover bg |
| `--color-falcon-teal-alpha-18` | focus ring |
| `--color-falcon-neutral-100` / `-400` | disabled bg / disabled + outside text |
| `--color-falcon-primary-700` | **disabled-slash icon color (alias inconsistency — see Static style risks)** |

## Tailwind utility guidance for this component

`[CODE]` calendar-tailwind-classes.ts (207 ln) — 11 class-builders (`falconCalendarContainerClasses` … `falconCalendarDisabledIconOverlayClasses`) used by the `-tw` twin. Every visual property reads a `--falcon-calendar-*` token through arbitrary-value utilities (e.g. `bg-[var(--falcon-calendar-bg)]`). Consumers should NOT hand-roll utilities that override colors/radii — override tokens instead. Host-side layout (`inline-block`, width) is fine via `rootClass`.

## Dark mode support

Token-driven — the neutrals/teal aliases flip via the theme `:where(.app-dark, …)` overrides; calendar geometry (cell size / radius / motion) stays identical. No per-calendar dark override exists. (Not re-verified end-to-end this pass — flag for the theme/tokens agent.)

## Density support

Cell metrics scale via `size` (sm/md/lg reflected attr). There is no `--falcon-density-*` alias chain on the calendar (unlike `<falcon-input>`); size variants are hard-coded in the token file per breakpoint of the date-picker input section, but the grid cell itself is a single `--falcon-calendar-day-height` (30px) regardless of `size` — `size` currently affects the date-picker input height, NOT the calendar cell height (`[CODE]` calendar.tokens.css:219-228 are all `--falcon-date-picker-*`, none `--falcon-calendar-day-height-{sm,lg}`). **So `size` on the calendar is largely inert today** (flag in GAPS).

## RTL support

`[CODE]` falcon-calendar.css:78-80 — `:host-context([dir='rtl']) .falcon-calendar-nav svg { transform: var(--falcon-calendar-chevron-rtl-flip); }` flips the chevron arrows in RTL. Weekday order follows `firstDayOfWeek` (set `6` for Arabic). Week-number column uses logical `padding-inline-end` so it mirrors. The `-tw` twin relies on Tailwind logical utilities (`pe-*`) for the same effect. Not re-verified visually this pass.

## Static style risks

- `[CODE]` Shadow CSS `falcon-calendar.css` (198 ln) is **token-only — VERIFIED clean 2026-06-03**: every visual value reads a `--falcon-calendar-*` var; the only literals are structural (`border: 0`, `display: flex`, `transition: background-color 120ms, color 120ms` on `.falcon-calendar-nav`). No raw color hex.
- `[CODE]` calendar.tokens.css:135 — the disabled-slash icon color is aliased to `--color-falcon-primary-700` while the rest of the file uses `--color-falcon-teal-*`. The fallback `#0d3f44` matches teal-500, so it renders correctly, but the `primary-700` alias is inconsistent with the file's `teal-*` convention (minor token-naming smell — see FINDINGS B07).
- `[CODE]` The `-tw` twin writes per-cell inline `style={{ '--falcon-calendar-disabled-icon-*': ... }}` ONLY when the consumer passes an explicit `disabledIcon*` prop (falcon-calendar-tw.tsx:230-236) — token-driven, acceptable; the only inline-style usage.
- `[CODE]` The `-tw` slash SVG hardcodes `width="var(--falcon-calendar-disabled-icon-width)"` etc. as SVG presentation attributes (falcon-calendar-tw.tsx:262-263) — reads tokens, acceptable.

## No CSS / no SCSS guidance

- Tailwind utilities only in templates (the `-tw` twin reads tokens via arbitrary-value utilities).
- Per-instance overrides MUST mutate `--falcon-calendar-*` via a host class. **Never hardcode hex/px.**
- Do not write component CSS rules in a consumer's `.component.css` to restyle cells.

## Token usage by state

| State | Token(s) consumed |
|---|---|
| Container | `--falcon-calendar-bg`, `--falcon-calendar-color`, `--falcon-calendar-border-color`, `--falcon-calendar-border-radius`, `--falcon-calendar-shadow`, `--falcon-calendar-padding`, `--falcon-calendar-width` |
| Header | `--falcon-calendar-header-title-color/-font-size/-font-weight`, `--falcon-calendar-header-gap/-margin-bottom` |
| Nav button | `--falcon-calendar-nav-color`, `--falcon-calendar-nav-color-hover`, `--falcon-calendar-nav-bg`, `--falcon-calendar-nav-bg-hover`, `--falcon-calendar-nav-size`, `--falcon-calendar-nav-border-radius` |
| Weekday row | `--falcon-calendar-weekday-color/-font-size/-font-weight/-letter-spacing` |
| Cell idle | `--falcon-calendar-day-bg`, `--falcon-calendar-day-color`, `--falcon-calendar-day-font-weight`, `--falcon-calendar-day-border-radius` |
| Cell hover | `--falcon-calendar-day-bg-hover`, `--falcon-calendar-day-color-hover` |
| Cell today | `--falcon-calendar-day-today-color`, `--falcon-calendar-day-today-bg`, `--falcon-calendar-day-today-shadow`, `--falcon-calendar-day-today-font-weight` |
| Cell selected | `--falcon-calendar-day-selected-bg`, `--falcon-calendar-day-selected-color`, `--falcon-calendar-day-selected-font-weight`, `--falcon-calendar-day-selected-shadow` |
| Cell disabled | `--falcon-calendar-day-disabled-bg`, `--falcon-calendar-day-disabled-color`, `--falcon-calendar-day-disabled-cursor`, `--falcon-calendar-day-disabled-text-decoration` + slash overlay (`--falcon-calendar-disabled-icon-color/-width/-height/-stroke-width`) |
| Cell outside-month | `--falcon-calendar-day-outside-color`, `--falcon-calendar-day-outside-opacity` |
| Week number | `--falcon-calendar-week-number-color/-font-size/-font-weight/-padding-inline-end` |
| Focus ring (cell + nav) | `--falcon-calendar-focus-ring-color`, `--falcon-calendar-focus-ring-width` |
| Whole-grid disabled | `--falcon-calendar-disabled-opacity`, `--falcon-calendar-disabled-cursor` |
| Motion | `--falcon-calendar-day-transition-duration`, `--falcon-calendar-day-transition-property` |

## Verification
🟢 CODE-VERIFIED 2026-06-03 — token file recounted at 237 lines (SHARED with date-picker), `:where()` gate-12 + `.falcon-overlay-container` portal-inclusion confirmed, Shadow CSS verified token-only. Corrected wrong token names from the prior dossier (`-container-bg` → `-bg`, etc.). Flagged `--color-falcon-primary-700` alias inconsistency + `size`-inert-on-cell-height.
