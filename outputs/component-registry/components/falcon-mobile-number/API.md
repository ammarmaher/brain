# falcon-mobile-number (LEGACY FACADE) — API

## Selector
- `<falcon-mobile-number>` — Angular bespoke standalone component.

## Import path
```ts
import { FalconMobileNumberComponent } from '@falcon';
```

## TypeScript types
- The component does NOT export its own types — it accepts a legacy E.164 string or `{ e164Number, dialCode }` shape via `writeValue`.

## @Inputs (decorator-based `@Input`)

| Name | Type | Default | Notes |
|---|---|---|---|
| `labelKey` | `string` | `''` | Translation key (translated internally via `TranslateService`). |
| `required` | `boolean` | `false` | — |
| `preferredCountries` | `ReadonlyArray<string>` | `['sa', 'ae']` | Lowercase ISO-2. Kept for API compat — IGNORED (Falcon component renders a full searchable list). |
| `defaultCountry` | `string` | `'sa'` | Lowercase ISO-2 → upper-cased for the Falcon component. |
| `showDialCode` | `boolean` | `true` | Kept for API compat — IGNORED (Falcon always renders the dial code). |
| `maxLength` | `number` | `15` | Kept for API compat — IGNORED. |
| `error` | `boolean` | `false` | Drives the `state` Input on the Falcon component. |
| `errorMessageKey` | `string` | `''` | Translation key. |
| `requiredErrorMessageKey` | `string` | `'validation.phoneRequired'` | Translation key. |
| `useCustomStyle` | `boolean` | `true` | Kept for API compat — drives only a `@HostBinding('class.fpf-standard')`. |

## @Outputs
- _None._ Uses CVA's `onChange` callback exclusively.

## CVA / Forms support
- Provides both `NG_VALUE_ACCESSOR` AND `NG_VALIDATORS` (for `required`).
- `writeValue(value)` accepts:
  - `string` (E.164 directly).
  - `{ e164Number?, number? }` (legacy ChangeData object).
  - `null` / other → empty.
- `validate(control)` returns `{ required: true }` when empty + required.

## Slots / ng-template inputs
- _None._

## Supported sizes / variants
- _None._ Inherits the Falcon phone-field's defaults.

## Important constraints
- Three inputs are silently no-op: `preferredCountries`, `showDialCode`, `maxLength`. Consumers that pass them expect behavior they don't get.
- The component owns a local dial-code → ISO-2 map (`ISO2_TO_DIAL`) — 25 countries. If consumer needs more, the map needs extending.
- The output transformation: Stencil emits `{ value, country, dialCode, nationalNumber }`; the façade recomposes E.164 as `${dialCode}${nationalNumber}` (digits only, no spaces).
- `touchedFlag` is set on `handleFalconBlur` for native blur → triggers required-error display.

## Accessibility
- Delegates to `<falcon-angular-phone-field>` for native input + country chooser semantics.
