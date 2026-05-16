# falcon-data-table — TOKENS

## Component token files (both apply via `:where(...)` cascade)

- `libs/falcon-ui-tokens/src/components/data-table.tokens.css` (207 lines, 19 categories) — legacy `<falcon-data-table>` token surface; wraps both the PrimeNG-era and the new Stencil consumer
- `libs/falcon-ui-tokens/src/components/table.tokens.css` (157 lines, 14 categories) — the underlying `<falcon-table-tw>` core tokens

Selector union in `data-table.tokens.css`:

```
:where(falcon-data-table, falcon-data-table-tw, falcon-angular-data-table, .falcon-data-table, [data-falcon-data-table]) { … }
```

Selector union in `table.tokens.css`:

```
:where(falcon-table, falcon-table-tw, falcon-angular-table, .falcon-table, [data-falcon-table]) { … }
```

Both blocks set tokens on the same host (because `<falcon-angular-data-table>` is both a `falcon-angular-data-table` host AND wraps a `falcon-table-tw` child). The Light DOM lets these cascade.

## Token categories (data-table.tokens.css)

1. **CONTAINER** — `--falcon-data-table-wrap-radius`, `wrap-bg`, `divider`
2. **HEADER (th)** — bg, padding-y/x, font-size, weight, color, letter-spacing, text-transform (UPPERCASE)
3. **BODY (td)** — padding-y/x, font-size, font-weight, color, row-divider, row-bg-hover, row-bg-selected
4. **SORT ICON** — color (idle), color-active, font-size
5. **PAGINATOR** — padding, bg, divider, font-size, color, gap, min-height, current-color, current-font-weight
6. **PAGINATOR NAV (first/prev/next/last)** — size, margin, radius, bg, color, bg-hover, color-disabled, icon-size
7. **PAGINATOR INPUT (jump-to-page)** — width, height, margin, font-size, border-color, border-radius, color, bg, border-color-focus, shadow-focus
8. **PAGINATOR DROPDOWN (rows-per-page)** — height, min-width, width, border-color, border-radius, bg, label-padding, label-font-size, label-line-height, label-color, trigger-width, trigger-height
9. **PAGINATOR PAGE (active page indicator)** — bg-active, color-active, border-color-active, size, radius
10. **ACTIONS COLUMN** — width, sticky-bg, sticky-shadow
11. **AVATAR / ICON inside cells** — `--falcon-data-table-avatar-size: 24px`
12. **CHIP (status chip inside cell)** — width, height
13. **ACTION BUTTON** — height, min-width, width, line-height
14. **MOTION** — transition-duration, easing
15. **BODY — striped + focus ring** (PR-2) — bg-striped, focus-ring-color
16. **SELECTION CELL** (PR-2) — check-width, check-padding-x
17. **LOADING** (PR-2) — skeleton-bg, skeleton-height, skeleton-radius, loading-overlay-bg, loading-overlay-color, loading-spinner-size, loading-spinner-border-width, loading-spinner-border-color
18. **EMPTY** (PR-2) — color, font-size, padding-y, padding-x
19. **SCROLL** (PR-3) — scroll-header-shadow (alias of actions-sticky-shadow), global-filter-bg, global-filter-min-height, frozen-cell-z, frozen-header-z

Many of these are aliases that delegate to the master theme tokens (`--color-falcon-neutral-*`, `--color-falcon-teal-*`, `--spacing-*`, `--falcon-size-icon-*`, `--radius-*`, `--shadow-falcon-*`, `--text-*`, `--duration-falcon-*`, `--ease-falcon-out`).

## Related Falcon theme tokens (from `falcon-tailwind-tokens.css`)

| Family | Tokens |
|---|---|
| Color (palette) | `--color-falcon-neutral-{0,25,100,150,200,500,600,700,800,900}` |
| Color (brand) | `--color-falcon-teal-{50,700,tint,alpha-04,alpha-08,alpha-12}` |
| Icon size | `--falcon-size-icon-{xs,lg}` (12px, 24px) |
| Radii | `--radius-xs`, `--radius-sm` |
| Shadow | `--shadow-falcon-{drawer,focus-strong}` |
| Text | `--text-2xs`, `--text-xs`, `--text-sm` |
| Spacing | `--spacing-{1,2,3,6,row-h,rail}` |
| Motion | `--duration-falcon-base`, `--ease-falcon-out` |

## Tailwind utility guidance

- The wrapper template uses `[attr.x]` for primitives — passes attributes onto the inner `<falcon-table-tw>` Stencil tag.
- Object props (`rows`, `columns`, `selectedRowIds`, `rowsPerPageOptions`, `globalFilterFields`, `rowStyleClass`) are set via `el.<prop> = …` in `syncProps()` (lines 275-291). Angular's `[attr.x]` would stringify them.
- Per-column Tailwind utilities ride on `ColumnDef.tdClass` (cell) and `ColumnDef.widthClass` (header) — translated to `FalconTableColumnExt.cellClass` / `headerClass` by `adaptColumns()` (line 294-312).
- Host-level Tailwind: pass `[rootClass]` (forwarded to the Stencil host's `class`) and `[tableStyleClass]` (forwarded to `[attr.table-style-class]`).

## Dark mode support

- The data-table token file does NOT declare its own `:where(.app-dark, .app-dark *)` block (verified — 207 lines, no dark section). Dark contrast cascades from the master theme.
- The loading overlay bg `rgba(255, 255, 255, 0.7)` is hardcoded (line 180) — **same dark-mode gap as `falcon-table` core. P2 — add a dark override.**

## Density support

The composed `<falcon-table-tw>` has `density: 'compact' | 'comfortable' | 'spacious'`. The Angular wrapper does NOT expose `density` as an input! **GAP — P2 — add a `[density]` input that forwards to `[attr.density]`.**

## RTL support

- Token values use `padding-y/x` (logical) but the actions-column sticky behaviour pins to right via `--falcon-data-table-actions-sticky-bg` + `inset-inline-end: 0` in the helper. RTL flips this automatically.
- Avatar / icon / chip / action-button sizes are direction-neutral.

## Static style risks

- Loading overlay bg `rgba(255, 255, 255, 0.7)` — hardcoded.
- Skeleton height `0.75rem` (12px) — `--falcon-data-table-skeleton-height`. Token, but value is literal.
- Pixel-perfect padding values (`14px`, `13px`, `12.5px`) — match the React V0.2 reference. Hard to abstract without re-spec.

## No CSS / no SCSS guidance

- The Angular wrapper template has no `*.component.css` rules (per project standard). All styling rides on the Stencil core + per-column `tdClass` / `widthClass` utilities.
- `falcon-data-table.component.css` does NOT exist (the wrapper has only `.html` and `.ts` — verified). No SCSS contamination.

## Shadow row tokens (Wave 20, 2026-05-15)

The shadow-row feature owns 9 tokens, all prefixed `--falcon-data-table-shadow-*`. Defaults read from the master theme palette so consumers don't need to override anything for a working baseline.

| Token | Default | Role |
|---|---|---|
| `--falcon-data-table-shadow-row-bg` | `var(--color-falcon-success-50, #ecfdf5)` | Background of the full-width shadow `<td>`. Reads as a nested green strip. |
| `--falcon-data-table-shadow-row-divider` | `var(--falcon-data-table-row-divider)` | Top border between the parent row and the first shadow row (and between consecutive shadow rows). |
| `--falcon-data-table-shadow-row-padding-y` | `20px` | Vertical padding inside the shadow `<td>`. |
| `--falcon-data-table-shadow-row-padding-x` | `24px` | Horizontal padding inside the shadow `<td>`. |
| `--falcon-data-table-shadow-arrow-color` | `var(--falcon-data-table-shadow-row-bg)` | The notch triangle's fill — matches the row bg so the notch reads as a continuation of the strip. |
| `--falcon-data-table-shadow-arrow-size` | `10px` | Half the triangle base AND the visible triangle height (CSS border-trick). Drives both the visual size AND the `top: calc(-1 * <size>)` lift used to position the notch above the cell. |
| `--falcon-data-table-shadow-arrow-z` | `2` | Stacking order of the notch inside the shadow `<td>` — above the parent row's bottom border, below popovers/modals. **NEW in Wave 20.** |
| `--falcon-data-table-shadow-chevron-color` | `var(--color-falcon-primary-700, #0d3f44)` | Colour of the toggle chevron in the parent row's actions cell. |
| `--falcon-data-table-shadow-transition-duration` | `var(--falcon-data-table-transition-duration)` | Duration for chevron rotation + row reveal. |

### Per-instance override pattern

```css
.applications-table {
  /*** Use neutral-50 instead of success-50 — green doesn't fit this page's hue. ***/
  --falcon-data-table-shadow-row-bg: var(--color-falcon-neutral-50);
  /*** Bigger notch for the marketing-pricing scheduled-change UI. ***/
  --falcon-data-table-shadow-arrow-size: 14px;
}
```

### Token usage rule for shadow rows

- The notch alignment is computed at runtime from the column header — there is NO token controlling the notch's `left` offset. Consumers MUST use `ShadowRow.targetColumn` instead.
- Changing `--falcon-data-table-shadow-arrow-size` automatically updates BOTH the visual size AND the `top` offset (because the class uses `top-[calc(-1*var(--falcon-data-table-shadow-arrow-size))]`).
- Changing `--falcon-data-table-shadow-arrow-color` independently from `--falcon-data-table-shadow-row-bg` lets the notch read as a distinct chip pointing at the column instead of as a flush continuation.

---

## Token usage for interaction states (legacy data-table token surface)

| Aspect | Token |
|---|---|
| Container border / radius | `--falcon-data-table-wrap-radius`, container border via `--falcon-data-table-divider` |
| Row hover | `--falcon-data-table-row-bg-hover` |
| Row selected | `--falcon-data-table-row-bg-selected` |
| Row focus ring | `--falcon-data-table-row-focus-ring-color` |
| Sort active | `--falcon-data-table-sort-icon-color-active` |
| Paginator focus | `--falcon-data-table-paginator-input-shadow-focus` |
| Disabled | Inherits `--falcon-table-disabled-opacity` / `cursor` from `table.tokens.css` |
| Loading | `--falcon-data-table-loading-{overlay-bg,overlay-color,spinner-size,spinner-border-width,spinner-border-color}` |
| Empty | `--falcon-data-table-empty-{color,font-size,padding-y,padding-x}` |
| Sticky-actions surface | `--falcon-data-table-actions-sticky-bg`, `--falcon-data-table-actions-sticky-shadow` |
| Sticky-thead shadow | `--falcon-data-table-scroll-header-shadow` (alias) |
| Global filter bg | `--falcon-data-table-global-filter-bg` |
| Frozen cell z-index | `--falcon-data-table-frozen-cell-z` (1), `--falcon-data-table-frozen-header-z` (2) |
