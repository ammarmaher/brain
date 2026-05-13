# falcon-table — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/table.tokens.css` (157 lines, 14 categories).

```
:where(falcon-table, falcon-table-tw, falcon-angular-table, .falcon-table, [data-falcon-table]) {
  /* 14 categories — see source */
}
```

## Token categories (per source comment lines 9-24)

1. **CONTAINER** — `--falcon-table-display`, `--falcon-table-container-bg`, `--falcon-table-container-border-radius`, `--falcon-table-container-border-width`, `--falcon-table-container-border-color`, `--falcon-table-container-overflow-x`
2. **HEADER ROW** — bg, color, padding-block/inline, font-family/size/weight/line-height, letter-spacing, text-align, text-transform, white-space, border-bottom width/color, sticky z-index
3. **HEADER SORT INDICATOR** — margin-inline-start, font-size, opacity (idle), active-opacity, color, active-color, cursor, hover-color
4. **ROW (per state)** — bg, color, border-bottom width/color, bg-hover, bg-selected, bg-focus, cursor
5. **STRIPED ROW BG** — `--falcon-table-row-bg-striped`
6. **CELL** — padding-block/inline, font-family/size/weight, color, line-height, vertical-align, white-space
7. **CELL BY TYPE** — number `tabular-nums` + alignment, currency tabular + alignment, date tabular, icon center, badge padding/radius/font-size/bg/color
8. **CHECKBOX CELL** — width, padding-inline, text-align
9. **DENSITY** — per row-height (compact/comfortable/spacious) padding-block for both header and cell
10. **EMPTY STATE** — padding-block/inline, color, font-size, text-align
11. **LOADING OVERLAY** — bg, color, spinner size, spinner border-width, spinner border-color, duration
12. **PAGINATION FOOTER** — padding-block/inline, gap, border-top width/color, bg, color, font-size, justify
13. **FOCUS RING + MOTION** — focus-ring-color, focus-ring-width, row-transition-duration, row-transition-property
14. **STATE** — bordered modifier cell border-inline-end-width/color, disabled opacity + cursor

## Related Falcon theme tokens (from `falcon-tailwind-tokens.css`)

| Family | Variables used |
|---|---|
| Color (palette) | `--color-falcon-neutral-{0,25,100,150,175,200,500,600,700,800,900}` — surfaces, text, dividers, badge bg/fg |
| Color (brand) | `--color-falcon-teal-{500,700,tint,alpha-12}` — sort-active, row-selected, focus ring |
| Typography | `--falcon-font-family` (alias to `--font-sans`) for header + cell fonts |
| Radii | Token uses raw `10px` for container border-radius — not a `--radius-*` token. (Slight gap — should use `--radius-md` = `8px` or `--radius-lg` = `12px`.) |
| Shadows | Not used in this token file. Used in `data-table.tokens.css` (sticky + scroll shadows). |
| Spacing | Not used directly — table cell padding uses raw `13px / 8px` rather than `--spacing-*`. (Memory note: `--spacing-*` is for layout-level paddings; component-internal paddings are typically literal px.) |

## Tailwind utility guidance for this component

- The Light DOM `<falcon-table-tw>` produces every Tailwind class through `libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts` helpers (`falconTableClasses`, `falconTableHeaderCellClasses`, `falconTableCellClasses`, `falconTableRowClasses`, `falconTableFrozenColumnClasses`, etc.). The Shadow variant uses scoped CSS.
- For per-instance Tailwind on the container/table, use `[styleClass]` / `[tableStyleClass]` inputs — they are appended to the helper-generated class strings.
- DO NOT add Tailwind utility classes to individual `<th>` / `<td>` via the column types — use `headerClass` / `cellClass` on `FalconTableColumnExt` which the Stencil renderer concatenates onto the base helper output.

## Dark mode support

- Per `feedback_v02_theme_adopted.md` and `TAILWIND_TOKEN_MAP.md` line 165-175, dark mode is triggered by `<html class="app-dark">`. Only **surface / text / border / shadow** tokens flip; geometry stays the same.
- The table's token file does NOT declare a `:where(.app-dark, .app-dark *)` override block (verified — file is 157 lines, no dark block). Dark contrast relies on the cascade from `--color-falcon-neutral-*` and `--color-falcon-teal-*` inverting at the theme level. Loading overlay is hardcoded `rgba(255,255,255,0.7)` (line 122) — **needs dark-mode override** (`rgba(0,0,0,0.5)` or similar). **GAP — file P2 to add component-level dark override.**

## Density support

Direct token support: `--falcon-table-density-{compact,comfortable,spacious}-cell-padding-block` and `--falcon-table-density-{compact,comfortable,spacious}-header-padding-block` (lines 107-112). The `density` reflect prop maps to these via CSS attribute selectors.

## RTL support

- `text-align: start` + `padding-inline-{start,end}` are used (RTL-safe) for header / cell.
- The sort indicator uses `margin-inline-start: 4px` (RTL-safe).
- The select-all checkbox cell uses `text-align: center` — fine in both directions.
- The frozen-left / frozen-right helpers in `table-tailwind-classes.ts` should map onto `inset-inline-start: 0` / `inset-inline-end: 0` rather than `left` / `right` — verify when reviewing the helper file.

## Static style risks (hardcoded px / hex)

- `border-radius: 10px` in `--falcon-table-container-border-radius` is not pulled from a `--radius-*` token. **Minor.**
- Loading overlay bg `rgba(255, 255, 255, 0.7)` — hardcoded `rgba`, no token alias. **Minor + dark gap.**
- Last-row border suppression rule at lines 153-156 mutates `border-bottom: 0` directly — not parameterised through a token.
- Many sub-pixel values like `11.5px` font-size, `12.5px` cell font-size, `9px` sort indicator font-size — hard-coded. Acceptable given Falcon's pixel-tight type spec.

## No CSS / no SCSS guidance

- Shadow path: `falcon-table.css` ships with the Stencil component (scoped). Tailwind utilities not needed.
- Light path: ZERO SCSS, ZERO `*.component.css` rules in Angular wrapper (the basic wrapper has `falcon-table.component.css` but it should be an empty placeholder — verify). The Stencil `falcon-table-tw.tsx` flips on helper functions only.
- Per-instance tweaks: use the host-class + token-override pattern (see USAGE.md).

## Token usage by interaction state

| Aspect | Token |
|---|---|
| Border (container) | `--falcon-table-container-border-{width,color}`, `--falcon-table-container-border-radius` |
| Radius | `--falcon-table-container-border-radius` (10px hardcoded) |
| Shadow | None at component level — sticky shadows pulled from `data-table.tokens.css` |
| Spacing | `--falcon-table-cell-padding-{block,inline}`, `--falcon-table-header-padding-{block,inline}`, `--falcon-table-cell-check-{width,padding-inline}` |
| Color (text) | `--falcon-table-cell-color`, `--falcon-table-header-color`, `--falcon-table-empty-color` |
| Color (surface) | `--falcon-table-container-bg`, `--falcon-table-header-bg`, `--falcon-table-row-bg`, `--falcon-table-row-bg-striped` |
| Hover | `--falcon-table-row-bg-hover`, `--falcon-table-sort-hover-color` |
| Focus | `--falcon-table-focus-ring-color`, `--falcon-table-focus-ring-width`, `--falcon-table-row-bg-focus` |
| Error | Not directly exposed — error is row-level via `rowStyleClass` callback. **P3** — add `--falcon-table-row-bg-error`. |
| Success | Same — N/A at component level. Use `rowStyleClass` + Falcon palette. |
| Warning | Same — N/A. Use `rowStyleClass`. |
| Disabled | `--falcon-table-disabled-opacity`, `--falcon-table-disabled-cursor` |
| Loading | `--falcon-table-loading-{overlay-bg,overlay-color,spinner-size,spinner-border-width,spinner-border-color,spinner-duration}` |
