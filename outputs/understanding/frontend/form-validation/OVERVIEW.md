# Falcon Form-Validation Architecture — OVERVIEW

> [!note] AREA DOSSIER (SPEC §7 non-component, 5-file set) — CREATED 2026-06-03 (batch L05, ammar-web-platform-ui).
> This dossier is the **architectural synthesis** of the Falcon FE form-validation system: the 3-layer model that ties together the **directives** (`shared-ui/lib/directives`), the **validators/validations registry** (`shared-utils/lib/validations` + the deprecated `falcon-validators.ts` shim), the **message catalog** (`messages.ts`), and the **i18n pipe** (`translate.pipe.ts`). The gold falcon-input dossier + the authority dataset reference "the 8 Falcon validation directives" — this dossier names them + their 3-layer wiring.
> **Scope discipline (no duplication):** batch **B23** owns the `shared-directives` dossier (all 12 directives, per-directive API). Batch **L03** owns `falcon-shared-utils` (the `validations/` registry + `falcon-validators.ts` as CODE-QUALITY). This dossier does NOT re-audit those internals — it documents the **VALIDATION ARCHITECTURE**, the public form-validation surface as a SYSTEM, and the pipes. Cross-references both rather than copying.

## Purpose

Provide the **single, layered FE validation system** every Falcon form uses, so that:
- the same business rule (e.g. "Account Name = 2–30 chars, charset letters+digits+space+&+'+-") is enforced identically at input-time, submit-time, and on backend rejection;
- error copy is i18n-keyed (en/ar), never raw English;
- the canonical rule source is the `Validations.xlsx` SoT, encoded once in the registry.

## The 3-layer validation architecture

```
┌─ LAYER 1 — TEMPLATE / DIRECTIVE (input-time UX) ─────────────────────────────┐
│ • shared-ui/lib/directives — 8 validation directives (NG_VALIDATORS /          │
│   NG_ASYNC_VALIDATORS / NG_VALUE_ACCESSOR) attachable to native inputs.        │
│ • falcon-ui-core <falcon-angular-*> form controls (CVA) — render the           │
│   error/state visuals.                                                          │
│ • FalconFormValidateDirective — form-wide MutationObserver that injects         │
│   <small class="falcon-error"> + required asterisks (legacy UX path).           │
└──────────────────────────────────────────────────────────────────────────────┘
                              │ produce ValidationErrors keys
                              ▼
┌─ LAYER 2 — REGISTRY / VALIDATORS (the business contract) ─────────────────────┐
│ • shared-utils/lib/validations/falcon-validations.ts — defaultFalcon-           │
│   ValidationsRegistry: 24+ ValidatorFn/AsyncValidatorFn factories encoding      │
│   the Validations.xlsx charsets/length-bands/enums/IPv6/hierarchy rules.        │
│ • FALCON_VALIDATIONS DI token + provideFalconValidations() (wired in admin +    │
│   mgmt app.config). FalconFieldRules<T> generic.                                │
│ • named-validators.ts — semantic aliases (accountNameValidator, …) + GENERIC    │
│   PRIMITIVES (integerInRangeValidator, numberInRangeValidator, enumValidator,   │
│   lengthValidator, startsWithLetterValidator, …).                               │
│ • falcon-validators.ts — DEPRECATED v1.2.0 shim (FALCON_PATTERNS + legacy       │
│   factory fns) kept ONLY so falcon-form-validate.directive.ts compiles.         │
│ • allFieldsValid() / fieldErrorMessage() helpers for signal-driven step forms.  │
└──────────────────────────────────────────────────────────────────────────────┘
                              │ error key (e.g. {accountNameCharset:true})
                              ▼
┌─ LAYER 3 — MESSAGE / i18n (what the user reads) ──────────────────────────────┐
│ • shared-utils/lib/validations/messages.ts — VALIDATOR_KEYS map (error-key →    │
│   `hierarchy.validation.*` i18n key + params), LIVE_ERROR_KEYS (pre-touch),     │
│   messageFor()/messagesFor(), BACKEND_ERROR_KEY crosswalk (FalconKeys.Error →   │
│   FE key), keyForBackendCode(), toServiceErrors().                              │
│ • TranslatePipe / TranslateService (libs/falcon/src/language — batch L03's       │
│   falcon-language area) resolves the key → en/ar string.                        │
└──────────────────────────────────────────────────────────────────────────────┘
```

Source anchors: [CODE] `falcon-validations.ts:24-371,386-792` (registry), [CODE] `named-validators.ts:26-172` (aliases+primitives), [CODE] `messages.ts:14-149` (catalog+crosswalk), [CODE] `falcon-validation.token.ts:11-23` (token+generic+reserved-set), [CODE] `provide-falcon-validations.ts:14-23` (provider), [CODE] `falcon-validators.ts:1-190` (deprecated shim), [CODE] `language/lib/pipes/translate.pipe.ts:14-63` (pipe). Directives: [BRAIN-OUT] `understanding/frontend/components/shared-directives/` (B23).

## The 8 Falcon validation directives (Layer 1 — cross-ref B23)

The flagship falcon-input dossier + authority dataset cite "the 8 Falcon validation directives" = the subset of the 12-directive bundle that participates in Angular's validator system ([BRAIN-OUT] `shared-directives/OVERVIEW.md:9`, [CODE] `shared-ui/lib/directives/`):

| # | Directive | Selector | Validator role | What it validates |
|---|---|---|---|---|
| 1 | `FalconStartWithLetterDirective` | `[falconStartWithLetter]` | `NG_VALIDATORS` (sync) | value must start with a letter |
| 2 | `FalconStartWithLetterMax30Directive` | `[falconStartWithLetterMax30]` | `NG_VALIDATORS` (sync) | starts with letter + ≤30 chars |
| 3 | `FalconLettersDigitsMaxDirective` | `[falconLettersDigitsMax]` | `NG_VALIDATORS` (sync) | letters+digits only, ≤N (default 50) |
| 4 | `FalconUsernameFormatDirective` | `[falconUsernameFormat]` | `NG_VALIDATORS` (sync) | username charset + ≤N (default 30) |
| 5 | `FalconPhoneNumberDirective` | `[falconPhoneNumber]` | `NG_VALIDATORS` (sync) | phone format (legacy lenient) |
| 6 | `FalconCheckExistsDirective` | `[falconCheckExists]` | `NG_ASYNC_VALIDATORS` | debounced async uniqueness (500ms, per-value cache) |
| 7 | `FalconPhoneMaskDirective` | `[falconPhoneMask]` | `NG_VALUE_ACCESSOR` + `NG_VALIDATORS` | "XXX XXXXXXXX" mask + min/max digits |
| 8 | `FalconIpAddressDirective` | `[falconIpAddress]` | `NG_VALUE_ACCESSOR` + `NG_VALIDATORS` | IPv4/IPv6 mode-lock + format |

The other 4 of the 12 are non-validation utilities (`FalconFormValidate` form-wide UX, `FalconColumnName` mutation, `FalconTruncate` text, `FalconEffectiveDate` no-op stub). **Live consumer of the 8: just 1** — `client-settings-step` uses `falconIpAddress`; the other 7 are dormant because the wizards migrated to the Layer-2 registry validators ([BRAIN-OUT] `shared-directives/OVERVIEW.md:62-66`, B23 Grep). **This is the system's central tension: Layer 1 directives are largely superseded by Layer 2 registry validators bound directly on Reactive-Forms controls.**

## Pipes inventory (the area's "pipes")

- **`TranslatePipe`** (`name: 'translate'`, `pure: false`) — the **only Angular `@Pipe` in `libs/falcon`** ([CODE] Glob 2026-06-03 — sole `*.pipe.ts` is `language/lib/pipes/translate.pipe.ts`). It is the Layer-3 renderer for every validation key. **Owned by batch L03's `falcon-language` area** for code-quality; documented here only as the validation system's i18n boundary. No validation-specific pipe exists (`messageFor()` is a function, not a pipe — consumers call it then pipe the resulting key through `translate`).

## Status

- **ACTIVE (Layer 2 + 3) / LEGACY-DORMANT (Layer 1 directives).** The registry + message catalog are the live, heavily-consumed contract (50 consumer files — see USAGE). The deprecated `falcon-validators.ts` shim is on a v2.0.0 deletion plan. 7 of the 8 directives are dormant (0 live app consumers).

## Full source-file path table

| Layer | File | Role |
|---|---|---|
| 1 | `shared-ui/lib/directives/falcon-start-with-letter.directive.ts` | sync validator directive |
| 1 | `shared-ui/lib/directives/falcon-start-with-letter-max30.directive.ts` | sync validator directive |
| 1 | `shared-ui/lib/directives/falcon-letters-digits-max.directive.ts` | sync validator directive |
| 1 | `shared-ui/lib/directives/falcon-username-format.directive.ts` | sync validator directive |
| 1 | `shared-ui/lib/directives/falcon-phone-number.directive.ts` | sync validator directive |
| 1 | `shared-ui/lib/directives/falcon-check-exists.directive.ts` | async validator directive |
| 1 | `shared-ui/lib/directives/falcon-phone-mask.directive.ts` | CVA + validator directive |
| 1 | `shared-ui/lib/directives/falcon-ip-address.directive.ts` | CVA + validator directive |
| 1 | `shared-ui/lib/directives/falcon-form-validate.directive.ts` | form-wide UX overlay (consumes the deprecated shim) |
| 1 | `shared-ui/lib/directives/index.ts` | directive barrel (all 12) |
| 2 | `shared-utils/lib/validations/falcon-validations.ts` | the registry (24+ factories) + helpers |
| 2 | `shared-utils/lib/validations/falcon-validation.token.ts` | `FALCON_VALIDATIONS` token + `FalconFieldRules<T>` + reserved-usernames |
| 2 | `shared-utils/lib/validations/named-validators.ts` | semantic aliases + generic primitives |
| 2 | `shared-utils/lib/validations/provide-falcon-validations.ts` | `provideFalconValidations()` EnvironmentProviders |
| 2 | `shared-utils/lib/validations/index.ts` | validations barrel |
| 2 | `shared-utils/lib/validators/falcon-validators.ts` | DEPRECATED v1.2.0 shim |
| 3 | `shared-utils/lib/validations/messages.ts` | message catalog + backend-error crosswalk |
| 3 | `language/lib/pipes/translate.pipe.ts` | the `translate` pipe (L03-owned) |

## Known consumers (high-level — full list in USAGE)
- Layer 2 registry: ~50 files — every Add Client / Add User wizard step's `validations/validations.ts`, both settings tabs, both org-node-drawers, contracts-cost-management, new-wallet-balance, + 4 `tools/validation-tests/*` parity tests, + `provideFalconValidations()` in admin + mgmt app.config.
- Layer 1 directives: 1 live (`client-settings-step` → `falconIpAddress`).
- The deprecated shim: 1 declared consumer (`falcon-form-validate.directive.ts`).

## Related areas
- `understanding/frontend/components/shared-directives` (B23) — per-directive API.
- `understanding/frontend/shared-utils` (L03) — code-quality audit of the registry + shim internals (the deprecated-shim removal + dual-IPv6 findings live there).
- `understanding/frontend/language` / `falcon-language` (L03) — the `translate` pipe + service.
- `understanding/frontend/components/falcon-input` — the CVA form control that displays the errors.
- `understanding/frontend/shared-features` (L05 sibling) — `user-details/validations` mirrors `falcon-validations.ts personName`.

## Ownership / Responsibility
- Layer 2/3 owned by `libs/falcon/src/shared-utils`. Layer 1 directives owned by `libs/falcon/src/shared-ui`. The `translate` pipe owned by `libs/falcon/src/language`.
- The `Validations.xlsx` SoT is the canonical rule source ([MEMORY] `project_validation_xlsx_sot_flip_wave_f`); the registry comments cite exact xlsx cells.

## Verification
🟢 code-verified 2026-06-03 (L05) — the 3-layer model + the 8-directive table + the pipe inventory grounded in the registry/messages/token/provider/shim files read in full + the B23 shared-directives dossier. Pipe-uniqueness confirmed by Glob (sole `*.pipe.ts`). Cross-references to B23 + L03 are deliberate (no internal re-audit).
