# falcon-calendar — OVERVIEW

## Component purpose

Single-month inline calendar grid (Stencil web component) with date selection, min/max bounds, disabled-dates predicate, customizable first-day-of-week + locale + week numbers. Used standalone for inline date selection or composed inside `<falcon-angular-date-picker>` for the popover variant.

## Business / UI use case

- Inline date selection in detail panels.
- Composed inside `<falcon-angular-date-picker>` for input-field-anchored popover usage.

## When to use it / when NOT to use it

**Use it for:**
- Inline calendar UI (always visible).
- Standalone date selection on detail pages.

**Do NOT use it for:**
- Date entry with an input field + popover → `<falcon-angular-date-picker>` (composes this).
- Date range selection — single-month grid only; range not yet implemented.

## Status

**ACTIVE** as the Stencil-paired component. NOT to be confused with the **legacy facade** `falcon-calendar` (at `libs/falcon/src/shared-ui/lib/components/falcon-calendar/`) which is a Wave-3 façade delegating to `<falcon-angular-date-picker>` for legacy PrimeNG `<p-calendar>` migration. **The legacy facade is OUT OF SCOPE for Agent 1 but flagged as a cross-link.**

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-calendar/falcon-calendar.component.ts` |
| HTML | `.../falcon-calendar.component.html` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-calendar/falcon-calendar.tsx` |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-calendar-tw/falcon-calendar-tw.tsx` |
| Types | `libs/falcon-ui-core/src/components/falcon-calendar/falcon-calendar.types.ts` |
| Tokens | `libs/falcon-ui-tokens/src/components/calendar.tokens.css` |
| Legacy facade (NOT in scope) | `libs/falcon/src/shared-ui/lib/components/falcon-calendar/` |

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-calendar` |
| Stencil Shadow | `<falcon-calendar>` |
| Stencil Light | `<falcon-calendar-tw>` |

## Known consumers

- `<falcon-angular-date-picker>` (composition).
- Detail panels with inline date selection.

## Related components

- Composed by: `<falcon-angular-date-picker>`.
- Legacy facade `<falcon-calendar>` (libs/falcon) — cross-link, not in scope.

## Ownership

`libs/falcon-ui-core`.
