# Shared directives — API

## `FalconFormValidateDirective`
- **Selector:** `form[falconFormValidate]`
- **Input:** `falconFormValidate: NgForm` (required) — pass `f` from `#f="ngForm"`.
- **Side effects:**
  - Listens to `submit`, `focusout`, `input`, `change` events on the form (bubbling + capture).
  - Marks controls as touched / dirty on user events.
  - Sets up subscriptions to `control.statusChanges` for async validation completion.
  - Injects `<small class="falcon-error">` error messages under each control (positioned via `findInsertionPoint()` heuristic).
  - Adds `.falcon-control-invalid` class to the control box on invalid state.
  - Adds `.falcon-required` `*` span to labels next to required inputs.
  - Observes DOM mutations to re-scan dynamically added controls.
- **Constraint:** uses `MutationObserver` + multiple event listeners — high overhead for large forms. The directive is robust but heavy.

## Sync validators (single-input)
Each follows the pattern:
```ts
@Directive({ selector: '[falconX]', standalone: true,
  providers: [{ provide: NG_VALIDATORS, useExisting: FalconXDirective, multi: true }] })
export class FalconXDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null { return validator(control); }
}
```

| Directive | Validation rule | Source validator |
|---|---|---|
| `FalconStartWithLetterDirective` | Value must start with a letter. | `startWithLetterValidator()` from `shared-utils` |
| `FalconStartWithLetterMax30Directive` | Start with a letter + max 30 chars. | `startWithLetterMax30Validator()` |
| `FalconLettersDigitsMaxDirective` | Letters + digits only, max N chars (Input `[falconLettersDigitsMax]="50"` default 50). | `lettersAndDigitsMaxValidator(N)` |
| `FalconUsernameFormatDirective` | Username format + max N chars (Input default 30). | `usernameFormatValidator(N)` |
| `FalconPhoneNumberDirective` | Phone number format. | `phoneNumberValidator()` |

## `FalconCheckExistsDirective`
- **Selector:** `[falconCheckExists]`
- **Provides:** `NG_ASYNC_VALIDATORS`.
- **Required Input:** `falconCheckExistsApi: (value: string) => Observable<boolean>` — your service method.
- **Optional Inputs:**
  - `falconCheckExistsMinChars: number` (default `3`) — debounced API call only fires when value length ≥ this.
  - `falconCheckExistsError: string` (default `'Value already exists'`) — error message.
  - `falconCheckExistsDebounce: number` (default `500`) — ms.
- **Behavior:** persistent Subject + debounceTime + distinctUntilChanged. Caches per-value result to avoid duplicate API calls. Pending promise pattern resolves after debounce → API → cache.
- **Error key:** `{ falconCheckExists: { message: string } }`.

## `FalconPhoneMaskDirective`
- **Selector:** `[falconPhoneMask]`
- **Provides:** `NG_VALUE_ACCESSOR` + `NG_VALIDATORS`.
- **Inputs:** `minDigits: number` (7), `maxDigits: number` (15).
- **Behavior:** formats value as `"XXX XXXXXXXX"` (space after first 3 digits). Strips non-digits. Validates min/max digit count.

## `FalconIpAddressDirective`
- **Selector:** `[falconIpAddress]`
- **Provides:** `NG_VALUE_ACCESSOR` + `NG_VALIDATORS`.
- **Inputs:** `validateOnBlur: boolean` (true), `validateOnInput: boolean` (false).
- **Behavior:** uses `detectMode()` / `sanitize()` / `isValidIp()` / `isWrongFormat()` from `shared-utils`. Modes: IPv4 / IPv6. Locks the detected mode after the first valid digit pattern. Subject-based debounce.

## `FalconEffectiveDateDirective`
- **Selector:** `[falconEffectiveDate]`
- **Provides:** `NG_VALIDATORS`.
- **Inputs:** `visibility`, `status`, `pricingType`, `renewDate`, `minFutureDate` — all preserved for API compat but no-op (Wave 3 stub).
- **Behavior:** `validate()` returns `null` (always valid). Wave 4 was supposed to re-implement.

## `FalconColumnNameDirective`
- **Selector:** `input[falconColumnName]`
- **Behavior:** observes `valueChanges` of the attached `NgControl` and applies real-time normalization (`normalizeColumnName(v)` — replaces whitespace runs with `_`). On blur, applies `finalizeColumnName(v)` (trim, collapse `__`, strip edge underscores).
- **Optional Input:** `normalizeOnBlurOnly: boolean` (false) — skips real-time, only finalizes on blur.
- **Output:** `(normalized)` emits the new string for parent re-validation.
- **Exported helpers:** `normalizeColumnName(value: string): string` and `finalizeColumnName(value: string): string`.

## `FalconTruncateDirective`
- **Selector:** `[falconTruncate]`
- **Inputs:** `falconTruncate: string` (full text — falls back to host's textContent if empty), `falconTruncateLimit: number` (default 50).
- **Behavior:** on `ngOnChanges`, truncates the host element's textContent to `limit` chars (appending `'...'`) and sets the native `title` attribute to the full text.
