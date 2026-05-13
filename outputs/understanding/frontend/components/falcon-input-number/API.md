# falcon-input-number — API

## Selectors

- Angular: `falcon-angular-input-number`
- Stencil pair exists.

## Import

```ts
import { FalconAngularInputNumberComponent } from '@falcon/ui-core';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `min` | `number?` | — | Clamped on commit. |
| `max` | `number?` | — | Clamped on commit. |
| `step` | `number` | `1` | Used by spinner buttons. |
| `showButtons` | `boolean` | `false` | Show ± spinner. |
| `mode` | `'decimal' \| 'currency'` | `'decimal'` | |
| `currency` | `string` | `'USD'` | ISO currency code; used when mode='currency'. |
| `locale` | `string?` | (browser default) | Intl locale; controls decimal/group separators. |
| `minFractionDigits` | `number?` | — | Ignored in currency mode (Intl owns it). |
| `maxFractionDigits` | `number?` | — | Same. |
| `integer` | `boolean` | `false` | Truncates fractional input. |
| `placeholder` | `string` | `''` | |
| `label` | `string` | `''` | |
| `helperText` | `string` | `''` | |
| `errorMessage` | `string` | `''` | |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `readonly` | `boolean` | `false` | |
| `required` | `boolean` | `false` | |
| `name` | `string` | `''` | |
| `inputId` | `string` | `''` | |
| `useTailwind` | `boolean` | `true` | Forwarded. |
| `rootClass / inputClass` | `string` | `''` | |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `valueChange` | `number \| null` | For non-CVA consumers. |

## TypeScript types

```ts
export type FalconInputNumberMode = 'decimal' | 'currency';
export type FalconInputNumberSize = 'sm' | 'md' | 'lg';
```

## CVA

YES. `writeValue` accepts `number | string | null`, coerces via regex strip + `Number()`. Truncates if `integer=true`.

## Methods

None proxied beyond internal `stepUp()` / `stepDown()` (template-callable).

## Slots / template inputs

- None.

## Constraints

- During focus, display is the raw value string (no Intl formatting); on blur, the formatted display takes over.
- `clamp()` runs only on blur — typing past `max` is allowed mid-edit.
- `Intl.NumberFormat` is locale-aware; pass `locale='ar-SA'` for Arabic numerals.
- Currency mode auto-displays the currency symbol per the Intl rules.
- The `coerce()` regex strips everything except digits / dot / minus — caveat: locale-specific decimal/group separators are handled separately by `parse()` (uses `Intl.NumberFormat.formatToParts`).

## Accessibility

- Inherits input A11y.
- Spinner buttons should be `aria-label="Increase value"` / `"Decrease value"` (verify in HTML).
- `inputmode="decimal"` or `"numeric"` should be set (verify).
