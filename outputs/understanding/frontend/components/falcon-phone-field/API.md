# falcon-phone-field — API

## Selectors

- Angular: `falcon-angular-phone-field`
- Stencil Shadow: `<falcon-phone-field>`
- Stencil Light: `<falcon-phone-field-tw>`

## Import

```ts
import { FalconAngularPhoneFieldComponent } from '@falcon/ui-core';
```

## Inputs

| Name | Type | Default | Notes |
|---|---|---|---|
| `label` | `string?` | — | |
| `placeholder` | `string?` | — | |
| `helperText` | `string?` | — | |
| `errorMessage` | `string?` | — | |
| `country` | `string` | `'SA'` | ISO-3166 alpha-2. |
| `countries` | `ReadonlyArray<FalconPhoneFieldCountry>?` | — | Filter / restrict the dropdown list. Default uses built-in full list. |
| `size` | `'sm' \| 'md' \| 'lg'` | `'md'` | |
| `state` | `'default' \| 'error' \| 'success' \| 'warning'` | `'default'` | |
| `readonly` | `boolean` | `false` | |
| `required` | `boolean` | `false` | |
| `verifyButton` | `boolean` | `false` | |
| `verifyLabel` | `string` | `'Verify'` | |
| `name` | `string?` | — | |
| `inputId` | `string?` | auto `falcon-phone-field-ng-{seq}` | |
| `autocomplete` | `string` | `'tel'` | |
| `searchPlaceholder` | `string` | `'Search…'` | Country dropdown search. |
| `emptyMessage` | `string` | `'No countries match'` | |
| `useTailwind` | `boolean` | `true` | |
| `wrapperClass / inputClass / labelClass` | `string` | `''` | |

## Outputs

| Name | Payload | Notes |
|---|---|---|
| `falcon-country-change` | `{ country: string; dialCode: string }` | Fires when user picks a different country. |
| `falcon-verify` | `{ value: string; country: string }` | Fires when Verify is clicked. |

(CVA writes nationalNumber; country flows alongside via the change-detail.)

## TypeScript types

```ts
interface FalconPhoneFieldCountry {
  iso: string;
  name: string;
  dialCode: string;
  flagEmoji?: string;
}

interface FalconPhoneFieldChangeDetail {
  value: string;            // full E.164 number
  country: string;          // ISO code
  dialCode: string;         // +966 etc.
  nationalNumber: string;   // sans country code
}
```

## CVA

YES — but with a subtle wrinkle: `writeValue(value)` accepts the full E.164 string OR national number; the inner Stencil component derives the country from the dial-code prefix. `onChange(detail.value)` emits the full E.164 string.

## Methods

None proxied.

## Slots / template inputs

- None on wrapper.

## Constraints

- **Validation deferred** — the component DOES NOT validate the phone number. Consumer must add Reactive Forms validator (Falcon recommends importing libphonenumber or a stricter regex).
- The country dropdown is searchable by country name + ISO code + dial code (verify search predicate in Stencil).
- The country chooser, dial code label, and input share ONE outer border via the partition pattern.

## Accessibility

- Native `<input type="tel">` underneath — full A11y.
- Country chooser button: `role="combobox"`, `aria-haspopup="listbox"`, `aria-expanded`.
- Required marker + `aria-required` on input.
- `aria-invalid` on error.
- Verify button has its own `aria-label`.
