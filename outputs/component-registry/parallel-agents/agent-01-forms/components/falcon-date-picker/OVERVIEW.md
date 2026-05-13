# falcon-date-picker — OVERVIEW

## Component purpose

Input field anchored to a popover composing `<falcon-angular-calendar>` for date selection. The input shows the ISO/formatted date string; clicking opens the popover; clicking outside or pressing Esc closes it. Outside-click + Escape close handled internally.

## Business / UI use case

- Date entry in forms (birth date, expiry date, start/end date).
- Filter panel date pickers.
- The canonical date-input UX across consoles.

## When to use it / when NOT to use it

**Use it for:** any date entry where an input + popover UX is required.

**Do NOT use it for:**
- Inline always-visible calendar → `<falcon-angular-calendar>`.
- Date range → use two date-pickers + external coordination.
- Hijri-only locales → external formatting + pass string.
- Time + date → not supported (no time-picker yet).

## Status

**ACTIVE / PREFERRED.** Replaces PrimeNG `<p-calendar>`.

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-date-picker/falcon-date-picker.component.ts` |
| HTML | `.../falcon-date-picker.component.html` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-date-picker/falcon-date-picker.tsx` |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-date-picker-tw/falcon-date-picker-tw.tsx` |
| Tokens | `libs/falcon-ui-tokens/src/components/calendar.tokens.css` (shares calendar tokens) |

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-date-picker` |
| Stencil Shadow | `<falcon-date-picker>` |
| Stencil Light | `<falcon-date-picker-tw>` |

## Known consumers

- Date fields across admin + management organization-hierarchy wizards.
- Filter panel date pickers.

## Related components

- Composes `<falcon-angular-calendar>`.
- Sibling: `<falcon-angular-input>` (same form-control DNA).

## Ownership

`libs/falcon-ui-core`.
