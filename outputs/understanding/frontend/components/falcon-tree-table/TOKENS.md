# falcon-tree-table — TOKENS

## Component token file

`libs/falcon-ui-tokens/src/components/tree-table.tokens.css`

Selector union:

```
:where(falcon-tree-table, falcon-tree-table-tw, falcon-angular-tree-table, .falcon-tree-table, [data-falcon-tree-table]) { … }
```

## Token categories (relevant)

- **Grid layout** — `--falcon-tree-table-indent-step`, `--falcon-tree-table-col-width` (default per-column width when `column.width` not specified), `--falcon-tree-table-row-height-{compact,comfortable,spacious}`, density-driven padding
- **Header** — `--falcon-tree-table-header-{bg,color,font-size,font-weight,border-bottom}`
- **Row** — `--falcon-tree-table-row-{bg,bg-hover,bg-selected,bg-focus,color,border-bottom}`
- **Cell** — `--falcon-tree-table-cell-{padding,font-size,line-height,color}`
- **Rails (depth connectors)** — `--falcon-tree-rail-{color,color-active,line-width,elbow-color,elbow-color-active,elbow-line-width,transition-duration,hover-path-transition-{duration,easing}}`
- **Chevron** — `--falcon-tree-chevron-{transition-duration,transition-easing,rotation-expanded}`
- **Badge cell** — `--falcon-tree-table-badge-{bg-active,fg-active,bg-inactive,fg-inactive}`
- **Number cell** — `--falcon-tree-table-number-{font-variant,text-align}`
- **Helper/error text** — `--falcon-tree-table-helper-{color,font-size}`, `--falcon-tree-table-error-{color,font-size}`

(Token surface is large — ~50 variables. Read the file directly for the exhaustive list.)

## Related Falcon theme tokens

- Color palette neutrals + brand teal
- `--font-sans` family
- `--ease-falcon-out`, `--duration-falcon-{base,fast}` for chevron + rail transitions
- `--background-image-falcon-rail-{default,on-path}` for the SVG rail background

## Tailwind utility guidance

- Light DOM (`<falcon-tree-table-tw>`) uses helper functions in `libs/falcon-ui-core/src/tailwind/tree-table-tailwind-classes.ts`.
- Per-column Tailwind utilities are NOT supported through `FalconTreeColumn` — there is no `cellClass` / `headerClass` field. **GAP — P3 — add these fields to `FalconTreeColumn`.**

## Dark mode

No component-level dark override (`tree-table.tokens.css` doesn't declare `:where(.app-dark, .app-dark *)`). Inherits from master theme.

## Density support

Yes — `density: 'compact' | 'comfortable' | 'spacious'` maps to `--falcon-tree-table-row-height-*` and cell padding tokens.

## RTL support

- Rail elbow `::after` uses `left: 50% / right: 0`; RTL flip in companion CSS `[dir="rtl"]` rule (sample at `falcon-organization-hierarchy-tree-tw.tsx:106` — same pattern likely in `falcon-tree-table.css`).
- Chevron rotation flips in RTL (`rotate(180deg)` for closed state).
- Indentation uses `padding-inline-start` — RTL-safe.

## Static style risks

- Grid template strings literal. Acceptable — driven by `column.width` or default token.
- Chevron SVG inline `stroke-width="2.4"` — hardcoded but small.

## No CSS / no SCSS guidance

- Shadow path: `falcon-tree-table.css` (scoped).
- Light path: helper functions only. No `.component.css` rules.

## Token usage by aspect

| Aspect | Token |
|---|---|
| Border | `--falcon-tree-table-cell-border-bottom-*`, `--falcon-tree-table-header-border-bottom` |
| Radius | Typically 0 — tree-table grid is borderless. |
| Shadow | Sticky row shadow if scrollable |
| Spacing | `--falcon-tree-table-indent-step`, cell padding tokens, density row-height |
| Color | Header/row/cell colors per state |
| Hover | `--falcon-tree-table-row-bg-hover`, rail color-active |
| Focus | `--falcon-tree-table-row-bg-focus`, focus ring |
| Disabled | Falcon-disabled-opacity inheritance, `.disabled` class on label cell |
