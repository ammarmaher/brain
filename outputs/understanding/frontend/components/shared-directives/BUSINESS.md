# Shared directives — Business Layer

> Layer 2 of 3. UI layer → `OVERVIEW.md` / `API.md` / `USAGE.md` / `TOKENS.md`. Integration layer → `INTEGRATION_VALIDATION.md`.
> **`shared-directives` is NOT a visual component** — it is a bundle of 12 single-purpose Angular standalone directives under `libs/falcon/src/shared-ui/lib/directives/`. The 3 dossier files are adapted pragmatically: this file describes the *business behaviors the directives enable*.

## Scope correction
`[CODE]` The directive bundle lives at `libs/falcon/src/shared-ui/lib/directives/` — 12 directives + a barrel `index.ts`. The `USAGE.md` Wave-7 note describing a *different* set under `falcon-ui-core/src/components/shared-directives/` (`falconDataTableCell`, `falconStepIcon`, etc.) is **stale/mismatched** — `[CODE]` no such folder governs this dossier; `OVERVIEW.md`'s 12-row source-path table is the accurate inventory. This dossier covers the `libs/falcon/...` set.

## Business purpose
`[BRAIN-OUT]` These directives are how Falcon attaches **business rules to form inputs declaratively** — without each feature re-writing the same validator. In business terms they encode the platform's *input contracts*: what an account name may contain, that a username is unique, that an IP allowlist entry is a real IP, that a phone number has the right digit count. A builder composes them onto an input and the business rule travels with the field.

## Business behaviors the directives enable
`[CODE]` `libs/falcon/src/shared-ui/lib/directives/` — grouped by the business job each does:

| Directive | Business behavior it enables | Source validator / mechanism |
|---|---|---|
| `FalconFormValidateDirective` | Form-wide UX contract: every invalid field shows an error message, required fields get a `*`, controls mark touched on blur/submit. | `[CODE]` `falcon-form-validate.directive.ts` — bound on `<form>`, `MutationObserver` + bubbling/capture listeners. |
| `FalconStartWithLetterDirective` | "An identifier must begin with a letter." | `startWithLetterValidator()` |
| `FalconStartWithLetterMax30Directive` | "Begin with a letter, ≤ 30 chars" — a bounded identifier rule. | `startWithLetterMax30Validator()` |
| `FalconLettersDigitsMaxDirective` | "Letters + digits only, ≤ N chars" — alphanumeric field rule. | `lettersAndDigitsMaxValidator(N)` |
| `FalconUsernameFormatDirective` | "Valid username format, ≤ N chars" — the username business rule. | `usernameFormatValidator(N)` |
| `FalconPhoneNumberDirective` | "This string is a valid phone number." | `phoneNumberValidator()` |
| `FalconPhoneMaskDirective` | Phone display contract: format as `XXX XXXXXXXX` + enforce 7–15 digits. | `[CODE]` `falcon-phone-mask.directive.ts` — CVA + `NG_VALIDATORS`. |
| `FalconIpAddressDirective` | IP allowlist contract: accept IPv4 or IPv6, lock the mode after detection, reject malformed entries. | `[CODE]` `falcon-ip-address.directive.ts` — CVA + `NG_VALIDATORS`, `detectMode()`/`sanitize()`/`isValidIp()`. |
| `FalconCheckExistsDirective` | **Business uniqueness gate**: "this account name / username / finance id is not already taken" — debounced async API check. | `[CODE]` `falcon-check-exists.directive.ts` — `NG_ASYNC_VALIDATORS`. |
| `FalconColumnNameDirective` | Column-alias normalization: whitespace → `_`, collapse `__`, strip edge underscores — the column-name business format. | `[CODE]` `falcon-column-name.directive.ts` |
| `FalconTruncateDirective` | Long-text display contract: truncate to N chars + native `title` tooltip for the full value. | `[CODE]` `falcon-truncate.directive.ts` |
| `FalconEffectiveDateDirective` | **No-op stub.** Once enforced pricing effective-date rules; `[CODE]` `falcon-effective-date.directive.ts:34-37` returns `null` always since Wave 3. | (none — dead) |

## PRD / business rules touched
| Rule | Source | How a directive enforces / surfaces it |
|---|---|---|
| Account name / finance id / username must be unique | `[BRAIN-OUT]` org-hierarchy flows + `[CODE]` `falcon-check-exists.directive.ts:41` | `FalconCheckExistsDirective` calls the consumer-supplied `(value)=>Observable<boolean>` API; `exists===true` → `{ falconCheckExists: { message } }`. |
| Identifiers begin with a letter | `[INFERRED]` from validator names | `FalconStartWithLetter*` directives. |
| IP allowlist entries must be valid IPv4/IPv6 | `[MEMORY]` IP-allowlist editor flow | `FalconIpAddressDirective` — mode-locked validation. |
| Effective-date rules for periodic pricing | `[CODE]` `falcon-effective-date.directive.ts:1-7` (header comment) | **NOT enforced** — the directive is a Wave-3 no-op stub; the rule lives elsewhere or is unenforced via this directive. |

## Business constraints baked in
- `[CODE]` `falcon-check-exists.directive.ts:46` **Uniqueness check fires only at ≥ 3 chars** (`falconCheckExistsMinChars` default 3) — the business default avoids API spam on partial input.
- `[CODE]` `falcon-check-exists.directive.ts:56` **500 ms debounce** — the operator can finish typing before the uniqueness API is hit.
- `[CODE]` `falcon-check-exists.directive.ts:122-124` **On `exists`, the control is marked touched + dirty** — a duplicate value is surfaced as an error immediately, not held back until blur.
- `[CODE]` `falcon-phone-mask.directive.ts` **Phone digit count is 7–15** (`minDigits`/`maxDigits` defaults) — the platform-wide phone-length business rule.
- `[CODE]` `falcon-effective-date.directive.ts` **`FalconEffectiveDateDirective` enforces NOTHING** — a flow relying on it for effective-date validation is silently unguarded.

## Business flows using these directives
| Flow | Page | Directives in play |
|---|---|---|
| Add Client wizard | organization-hierarchy | `[BRAIN-OUT]` `FalconFormValidate` on each step form; `FalconStartWithLetter` + `FalconLettersDigitsMax` on name fields; `FalconCheckExists` for account-name/finance-id uniqueness. |
| Add User wizard | organization-hierarchy | `FalconFormValidate`; `FalconUsernameFormat` + `FalconCheckExists` for username; `FalconPhoneMask` on contact phone. |
| IP allowlist editor | tenant settings | `FalconIpAddressDirective`. |

## Business gotchas
- `[CODE]` **`FalconEffectiveDateDirective` is a dead stub** — `OVERVIEW.md` + `GAPS_AND_UPGRADES.md` confirm it returns `null` always. Adding it expecting effective-date validation is a silent business hole.
- `[CODE]` `falcon-check-exists.directive.ts:90` **`FalconCheckExists` without `[falconCheckExistsApi]` silently no-ops** — the uniqueness gate quietly does nothing if the API input is missing.
- `[INFERRED]` These directives are *field-level* business rules — they do not know about cross-field rules (e.g. "City requires Country"). Cross-field business logic belongs in the feature's `validations/validations.ts` per the Component Folder + Validation Doctrine, not in a directive.
- `[CODE]` `falcon-check-exists.directive.ts:62` The uniqueness cache is **per-directive-instance** — re-mounting the form re-checks values already confirmed. Not a correctness bug, but an extra API call.

## Verification
🟡 CODE-DERIVED from the 12 directive source files under `libs/falcon/src/shared-ui/lib/directives/` + the 6 dossier files. The `FalconEffectiveDate` no-op ✅ VERIFIED in `falcon-effective-date.directive.ts:34-37`. The async-validator behavior ✅ VERIFIED in `falcon-check-exists.directive.ts`. The `USAGE.md` Wave-7 scope mismatch is documented above as a `[CODE]`-confirmed correction (do not edit the old file).
