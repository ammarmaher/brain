# Shared directives — OVERVIEW

This folder documents the directives under `libs/falcon/src/shared-ui/lib/directives/` — small, single-purpose Angular standalone directives that consumers compose on form inputs and other DOM elements. Each is independently exported from the `directives/index.ts` barrel.

## Purpose
Provide reusable input behavior (validators, masks, async checks, runtime mutations) that the Falcon UI core inputs don't carry built-in.

## Business / UI use case
- Form fields across Add Client / Add User wizards.
- Org-hierarchy validation (account name uniqueness).
- IP allowlist editor.
- Phone number masking.
- Username / column-name normalization.

## Status
- **ACTIVE / SHARED.** All directives are standalone Angular directives, OnPush-friendly, used across multiple feature folders.

## Source paths
| Directive | Selector | Path |
|---|---|---|
| `FalconFormValidateDirective` | `form[falconFormValidate]` | `libs/falcon/src/shared-ui/lib/directives/falcon-form-validate.directive.ts` |
| `FalconStartWithLetterDirective` | `[falconStartWithLetter]` | `libs/falcon/src/shared-ui/lib/directives/falcon-start-with-letter.directive.ts` |
| `FalconStartWithLetterMax30Directive` | `[falconStartWithLetterMax30]` | `libs/falcon/src/shared-ui/lib/directives/falcon-start-with-letter-max30.directive.ts` |
| `FalconLettersDigitsMaxDirective` | `[falconLettersDigitsMax]` | `libs/falcon/src/shared-ui/lib/directives/falcon-letters-digits-max.directive.ts` |
| `FalconUsernameFormatDirective` | `[falconUsernameFormat]` | `libs/falcon/src/shared-ui/lib/directives/falcon-username-format.directive.ts` |
| `FalconPhoneNumberDirective` | `[falconPhoneNumber]` | `libs/falcon/src/shared-ui/lib/directives/falcon-phone-number.directive.ts` |
| `FalconPhoneMaskDirective` | `[falconPhoneMask]` | `libs/falcon/src/shared-ui/lib/directives/falcon-phone-mask.directive.ts` |
| `FalconCheckExistsDirective` | `[falconCheckExists]` | `libs/falcon/src/shared-ui/lib/directives/falcon-check-exists.directive.ts` |
| `FalconIpAddressDirective` | `[falconIpAddress]` | `libs/falcon/src/shared-ui/lib/directives/falcon-ip-address.directive.ts` |
| `FalconEffectiveDateDirective` | `[falconEffectiveDate]` | `libs/falcon/src/shared-ui/lib/directives/falcon-effective-date.directive.ts` |
| `FalconColumnNameDirective` | `input[falconColumnName]` | `libs/falcon/src/shared-ui/lib/directives/falcon-column-name.directive.ts` |
| `FalconTruncateDirective` | `[falconTruncate]` | `libs/falcon/src/shared-ui/lib/directives/falcon-truncate.directive.ts` |

Barrel: `libs/falcon/src/shared-ui/lib/directives/index.ts`.

## Categorization
- **Sync validators (return `ValidationErrors | null`):**
  - `FalconStartWithLetterDirective`
  - `FalconStartWithLetterMax30Directive`
  - `FalconLettersDigitsMaxDirective`
  - `FalconUsernameFormatDirective`
  - `FalconPhoneNumberDirective`
- **Async validator (debounced API call):**
  - `FalconCheckExistsDirective` — `NG_ASYNC_VALIDATORS`. 500 ms debounce, distinctUntilChanged, per-value cache, distinct from `NG_VALIDATORS`.
- **Validator + CVA (input mutation + validation):**
  - `FalconPhoneMaskDirective` — applies "XXX XXXXXXXX" mask, min/max digits validation.
  - `FalconIpAddressDirective` — detects IPv4 vs IPv6 mode and locks input, debounced validation.
- **Form-wide UX enhancement:**
  - `FalconFormValidateDirective` — bound on `<form>` element, observes mutations + focus events to display error messages, set `.falcon-control-invalid` borders, add required asterisks.
- **Input mutation only:**
  - `FalconColumnNameDirective` — real-time normalization (whitespace → underscore) + finalize on blur.
  - `FalconTruncateDirective` — truncate text content to N chars + add native `title` tooltip.
- **No-op stub:**
  - `FalconEffectiveDateDirective` — Wave 3 no-op (originally drove PrimeNG `<p-datepicker>` disabled-date rules; now returns `null`).

## Known consumers
- Heavy use across admin-console + management-console wizard step components.
- `FalconFormValidateDirective` is bound on `<form #f="ngForm" [falconFormValidate]="f">` containers.
- `FalconCheckExistsDirective` is used for account-name / username uniqueness checks.

## Related components
- Per-directive: Falcon UI inputs that the directives attach to (`<falcon-angular-input>`, `<input type="text">`, etc.).
- `getValidationErrorMessage()` from `shared-utils` — provides the error message lookup.

## Ownership / Responsibility
- Shared across `libs/falcon/src/shared-ui/`.
- Each directive is single-purpose and well-encapsulated.
