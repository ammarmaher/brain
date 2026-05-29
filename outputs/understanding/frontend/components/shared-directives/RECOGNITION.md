# Shared directives — Recognition Layer

> `shared-directives` is a directive bundle, NOT a visual component. There is **no cross-library component map** here — directives are framework mechanics, not UI you fingerprint from a screenshot. This file is adapted pragmatically: a **decision guide for when to reach for each directive** when wiring a Falcon form input.

## Why no cross-library map
`[INFERRED]` A screenshot shows *inputs* — and the input visuals belong to `<falcon-angular-input>`, `<falcon-angular-mobile-number>`, etc. (see their `RECOGNITION.md` files). A directive has no rendered surface to recognize. What a design *implies* is a **behavior** ("this field rejects duplicates", "this phone field auto-formats") — and behavior maps to a directive, not a component-library equivalent. The MUI/PrimeNG/Ant analogue of these directives is each library's **validator function / form-field rule**, not a widget — so the standard cross-library table does not apply.

## When to reach for each directive
`[CODE]` `libs/falcon/src/shared-ui/lib/directives/`:

| If the design / requirement implies… | Reach for | Notes |
|---|---|---|
| every invalid field should show an inline error + required fields get a `*`, form-wide | `FalconFormValidateDirective` on the `<form>` | `[CODE]` heavy (`MutationObserver` + listeners); `GAPS` flags a PrimeNG-selector refactor. Prefer each Falcon input's built-in `errorMessage` input where possible. |
| an identifier field that must start with a letter | `FalconStartWithLetterDirective` | sync validator. |
| same, capped at 30 chars | `FalconStartWithLetterMax30Directive` | sync validator. |
| an alphanumeric field with a max length | `FalconLettersDigitsMaxDirective` (`[falconLettersDigitsMax]="N"`) | default max 50. |
| a username field | `FalconUsernameFormatDirective` | username-format rule. |
| a phone field that must be a valid number (validation only) | `FalconPhoneNumberDirective` | sync validator, no masking. |
| a phone field that should **auto-format as you type** (`XXX XXXXXXXX`) | `FalconPhoneMaskDirective` | CVA — mutates the value; 7–15 digit range. |
| an IP-address field (allowlist editor) | `FalconIpAddressDirective` | CVA — IPv4/IPv6 auto-detect + mode lock. |
| a field that must be **unique** (account name, username, finance id) — async API check | `FalconCheckExistsDirective` + `[falconCheckExistsApi]` | the only directive that hits a backend; 500ms debounce, ≥3 chars. |
| a column-alias field that normalizes spaces to underscores | `FalconColumnNameDirective` | `input[falconColumnName]` only. |
| long text that must truncate with a hover tooltip of the full value | `FalconTruncateDirective` | `[falconTruncate]` + `[falconTruncateLimit]`. |
| effective-date validation for periodic pricing | **do NOT use `FalconEffectiveDateDirective`** | `[CODE]` Wave-3 no-op stub — returns `null` always. Write a real validator or use the feature's `validations/validations.ts`. |

## Composition recipe
Directives compose by stacking attributes on one input. Order of decision:
1. **Sync validators stack freely** — `falconStartWithLetter` + `[falconLettersDigitsMax]="100"` + `falconCheckExists` on one input all run. They each contribute to `control.errors`.
2. **Only ONE CVA per control** — `falconPhoneMask` and `falconIpAddress` are both `NG_VALUE_ACCESSOR`; they cannot share an input, and neither can sit on an element that already has a value-accessor directive.
3. **`FalconFormValidate` goes on the `<form>`, not the input** — `<form #f="ngForm" [falconFormValidate]="f">`. It is form-wide UX, not a field rule.
4. **`FalconCheckExists` needs its API wired** — `[falconCheckExistsApi]="service.checkXExists"` returning `Observable<boolean>`; without it the directive silently no-ops.
5. **Set the input `name`** — `FalconFormValidate` maps errors back to controls by `name`; an unnamed control gets no error rendering.
6. **For reactive forms** — `GAPS`/`USAGE` recommend declaring the validator in the `FormGroup` definition rather than the attribute directive (better for review); the directives still work either way.
7. **Upgrade, don't hand-roll** — if you are about to write an inline validator in a component, check this table first; re-implementing an existing directive's rule is the anti-pattern.

## Anti-patterns
- Re-implementing validation in component code when a directive already covers the rule.
- Using `FalconEffectiveDateDirective` for new code — it is a dead no-op stub.
- Using `FalconCheckExists` without `[falconCheckExistsApi]` — silent no-op.
- Putting two CVA directives (`falconPhoneMask` + `falconIpAddress`, or either + another value-accessor) on one input.
- Binding `FalconFormValidate` on a non-`<form>` element — does nothing; the contract is form-specific.
- Extending `FalconFormValidateDirective` with more `MutationObserver` listeners — the existing observer covers add/remove (`USAGE.md`).
- Expecting `FalconFormValidate` to render errors on Falcon inputs flawlessly — it still targets dead PrimeNG selectors (`INTEGRATION_VALIDATION.md` gotcha); prefer each Falcon input's own `errorMessage` input.
- Forgetting the input `name` attribute — breaks `FalconFormValidate` error mapping.

## Verification
🟡 CODE-DERIVED from the 12 directive source files + the 6 dossier files. The "no cross-library map applies" framing is `[INFERRED]` and stated explicitly per the task's pragmatic-adaptation instruction. The `FalconEffectiveDate` no-op + single-CVA constraint ✅ VERIFIED in source.
