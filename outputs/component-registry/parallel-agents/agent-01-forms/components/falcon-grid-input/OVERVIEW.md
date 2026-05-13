# falcon-grid-input — OVERVIEW

## Component purpose

In-grid cell editor with grid-friendly keyboard semantics: **Enter** commits, **Escape** cancels (reverts to `originalValue`), **Tab / Shift+Tab** commits + navigates to next/previous cell. Auto-focus on mount by default. Specialized composed input per architect §5.12.2.

## Business / UI use case

- In-place editing of table cells.
- Lightweight numeric / text edit inside `<falcon-angular-table>` or `<falcon-angular-data-table>` cells.
- Spreadsheet-style edit experience.

## When to use it / when NOT to use it

**Use it for:** inline cell editors inside data tables / grids.

**Do NOT use it for:**
- Form fields → `<falcon-angular-input>`.
- Multi-line cells → `<falcon-angular-textarea>`.
- Numeric with format → `<falcon-angular-input-number>`.

## Status

**ACTIVE / PREFERRED** for grid edit cells. Wave 5.

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-grid-input/falcon-grid-input.component.ts` |
| HTML | `.../falcon-grid-input.component.html` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-grid-input/falcon-grid-input.tsx` |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-grid-input-tw/falcon-grid-input-tw.tsx` |
| Tokens | `libs/falcon-ui-tokens/src/components/grid-input.tokens.css` |

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-grid-input` |
| Stencil Shadow | `<falcon-grid-input>` |
| Stencil Light | `<falcon-grid-input-tw>` |

## Known consumers

- `<falcon-angular-data-table>` inline edit cells.
- `<falcon-angular-table>` programmatic edit mode.

## Related components

- Composed by data-table / table custom-cell directives.

## Ownership

`libs/falcon-ui-core`.
