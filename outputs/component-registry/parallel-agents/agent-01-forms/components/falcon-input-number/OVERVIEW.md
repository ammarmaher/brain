# falcon-input-number — OVERVIEW

## Component purpose

Numeric input composing `<falcon-angular-input>` + optional `+ / -` `<falcon-angular-button>` spinner. Supports decimal vs currency mode, locale-aware Intl formatting, min/max clamp, step, integer-only. Wave 9.F backfill.

## Business / UI use case

- Currency / amount entry (mode='currency' + currency code).
- Quantity pickers with spinner buttons.
- Numeric form fields with decimals or integer enforcement.

## When to use it / when NOT to use it

**Use it for:**
- Numeric inputs that need step / format / decimals / locale.
- Currency entry (mode='currency' + Intl).
- Quantity pickers (`showButtons=true`).

**Do NOT use it for:**
- In-grid micro-numeric edit → `<falcon-angular-grid-input>` (lighter).
- Phone → `<falcon-angular-phone-field>`.
- Free-text "could be number" → `<falcon-angular-input type='number'>` (simpler).

## Status

**ACTIVE / PREFERRED.** Wave 9.F backfill.

## Source paths

| Layer | Path |
|---|---|
| Angular wrapper | `libs/falcon-ui-core/src/angular-wrapper/components/falcon-input-number/falcon-input-number.component.ts` |
| HTML | `.../falcon-input-number.component.html` |
| Stencil Shadow | `libs/falcon-ui-core/src/components/falcon-input-number/falcon-input-number.tsx` |
| Stencil Light | `libs/falcon-ui-core/src/components/falcon-input-number-tw/falcon-input-number-tw.tsx` |
| Tokens | `libs/falcon-ui-tokens/src/components/input-number.tokens.css` |

> Angular wrapper composes `<falcon-angular-input>` + 2x `<falcon-angular-button>` directly.

## Selectors

| Layer | Tag |
|---|---|
| Angular | `falcon-angular-input-number` |
| Stencil Shadow | `<falcon-input-number>` |
| Stencil Light | `<falcon-input-number-tw>` |

## Known consumers

- Pricing / amount fields in admin-console.
- Quantity pickers in detail forms.

## Related components

- Composes input + button.
- Sibling: `<falcon-angular-grid-input>` (lighter in-grid use).

## Ownership

`libs/falcon-ui-core`.
