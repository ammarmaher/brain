# Falcon Form-Validation — SURFACE (public API / exports — full inventory)

> The complete public form-validation surface, by layer. Re-exported from `shared-utils/index.ts` → `@falcon`. Every fact `[CODE]`-cited from files read 2026-06-03 (L05). Registry/shim INTERNALS (regex bodies, narrow casts) are L03's audit scope — here = the public contract.

## Layer 2 — Registry (`shared-utils/lib/validations`, barrel `index.ts:4-8` `export *`)

### Token + generics (`falcon-validation.token.ts`)
- `FALCON_VALIDATIONS: InjectionToken<FalconValidationsRegistry>` — the single root token; `inject(FALCON_VALIDATIONS)` in DI scope.
- `FalconFieldRules<T>` — `{ readonly [K in keyof T]?: ReadonlyArray<ValidatorFn | AsyncValidatorFn> }` (type-safe per-field rule map).
- `FALCON_RESERVED_USERNAMES: ReadonlySet<string>` — default reserved set (`admin/root/system/falcon/test`).

### Provider (`provide-falcon-validations.ts`)
- `provideFalconValidations(opts?): EnvironmentProviders` — mirrors `provideFalconFacades`; binds `FALCON_VALIDATIONS` to `defaultFalconValidationsRegistry` (or a custom override). **Wired in admin-console + management-console `app.config.ts`** ([CODE] both `:72`/`:70`), NOT host-shell.
- `ProvideFalconValidationsOptions { registry? }`.

### Registry interface + default (`falcon-validations.ts`)
- `FalconValidationsRegistry` interface — **24+ factory methods**. `defaultFalconValidationsRegistry: FalconValidationsRegistry`.
- Semantic methods: `required()`, `lettersAndDigits()`, `lettersDigitsOrEmail()`, `nationalId()`, `anyString(min?,max?,required?)`, `accountName()`, `accountNameUnique(check,debounce?)`, `nodeName()`, `personName()`, `userName()`, `userNameUnique(check,reserved?,pendingSignal?,debounce?)`, `email()`, `phone()`, `saudiPhone()`, `password(level?)`, `roleAssignment(opts?)`, `permissionGroup()`, `maxNodeLevels()`, `userLimit()`, `allowedIpList()`, `priceValue(required?)`, `digitsOnly(min?,max?,required?)`, `passwordSecurityLevel()`.
- **Generic primitives** (Wave C — the "reach for these" layer): `integerInRange(min?,max?,required?)`, `numberInRange(min?,max?,required?)`, `enumOf<T>(allowed,required?)`, `lettersAndDigitsOnly()`, `startsWithLetter()`, `whitespace(mode)`.
- Group-level: `hierarchyDepthGuard(treeProvider,parentIdField?)`, `passwordsMatch(newField?,confirmField?)`, `parentMustExist(treeProvider,parentIdField?)`, `cannotMoveUnderSelf(treeProvider,idField?,newParentField?)`, `runValidators(control,...vs)`.
- Exported types: `FalconPasswordSecurityLevel` (`'normal'|'advanced'|1|2`), `FalconRoleAssignmentOptions`, `FalconHierarchyNode`.
- **Signal-driven step helpers** ([CODE] :838-879): `allFieldsValid<T>(value, rules)` (sync-only form validity), `fieldErrorMessage<T>(value, field, rules, touched)` (LIVE_ERROR_KEYS-gated single-field error).

### Named-validator surface (`named-validators.ts`) — non-DI aliases over the default registry
- Sync `ValidatorFn` consts: `lettersAndDigits`, `lettersDigitsOrEmail`, `nationalIdValidator`, `accountNameValidator`, `nodeNameValidator`, `personNameValidator`, `userNameValidator`, `emailValidator`, `phoneValidator`, `saudiPhoneValidator`, `permissionGroupValidator`, `userLimitValidator`, `allowedIpListValidator`, `passwordSecurityLevelValidator`, `requiredValidator`, `startsWithLetterValidator`, `lettersAndDigitsOnlyValidator`.
- Factory fns: `anyStringValidator`, `digitsOnlyValidator`, `priceValueValidator`, **`integerInRangeValidator(min?,max?,required?)`**, **`numberInRangeValidator(min?,max?,required?)`**, `enumValidator<T>(allowed,required?)`, `passwordValidator(level?)`, `roleAssignmentValidator(opts?)`, `lengthValidator(min?,max?,required?)`, `whitespaceValidator(mode)`, `maxNodeLevelsValidator(_hardCap?)`, `passwordsMatch`, `accountNameUniqueValidator(check,debounce?)`, `userNameUniqueValidator(check,reserved?,pendingSignal?,debounce?)`, `hierarchyDepthGuard`, `parentMustExist`, `cannotMoveUnderSelf`, `runValidators`.
- Consts: `PRICE_VALUE_MAX_DIGITS = 15`, `USER_LIMIT_MAX_DIGITS = 3`.

> **DI-vs-named guidance** ([CODE] `named-validators.ts:3`): consumers in DI scope SHOULD prefer `inject(FALCON_VALIDATIONS)` for testability/override; non-DI callers (pure services/model helpers) use the named aliases.

## Layer 2 (legacy) — Deprecated shim (`shared-utils/lib/validators/falcon-validators.ts`)
- `@deprecated v1.2.0` — kept ONLY for `falcon-form-validate.directive.ts`. v2.0.0 plans deletion.
- Exports: `FALCON_PATTERNS` (EMAIL/PHONE + `*_STRING` for HTML `pattern=`), `FALCON_VALIDATION_MESSAGES` (raw-English fallback map), factory fns `startWithLetterValidator()`, `lettersAndDigitsMaxValidator(max)`, `usernameFormatValidator(max)`, `startWithLetterMax30Validator()`, `phoneNumberValidator()`, and `getValidationErrorMessage(control)`.
- **Divergence flag** (L03 F2 / this dossier AUDIT): the shim's `phoneNumberValidator` is lenient non-E.164 vs the registry's strict `E164`; its messages are raw English vs the i18n-keyed `messages.ts`. New code MUST NOT use the shim.

## Layer 3 — Message catalog (`shared-utils/lib/validations/messages.ts`)
- `ValidationMessage { key; params? }`.
- `messageFor(errors): ValidationMessage | null` — first matching error-key → `hierarchy.validation.*` message (+ params).
- `messagesFor(errors): readonly ValidationMessage[]` — all matches.
- `hasLiveError(errors): boolean` — true if any key ∈ `LIVE_ERROR_KEYS` (pre-touch live errors).
- `BACKEND_ERROR_KEY: Record<string,string>` — backend `FalconKeys.Error` code → FE i18n key crosswalk (~30 codes: `MaxLengthExceeded`, `DuplicateUsername`, `PasswordRequires*`, `MaxNodeLevelExceeded`, …).
- `keyForBackendCode(code): string`, `toServiceErrors(errors): readonly ServiceErrorEnvelope[]`, `ServiceErrorEnvelope { code; message }`.
- Internal: `VALIDATOR_KEYS` map (~45 error-key → message factories), `LIVE_ERROR_KEYS` set, `KEY = 'hierarchy.validation'` namespace.

## Layer 3 — Pipe (`language/lib/pipes/translate.pipe.ts`)
- `TranslatePipe` — `name: 'translate'`, `pure: false`, `OnDestroy`. `transform(key, params?): string` → resolves via `TranslateService.get()` (reactive to language change) with an immediate `translate()` fallback. **The only Angular `@Pipe` in `libs/falcon`.** (Owned by L03's `falcon-language`; included here as the validation system's render boundary — `messageFor(errors).key | translate`.)

## Layer 1 — Validation directives (`shared-ui/lib/directives`, barrel `index.ts`)
Public surface per-directive is documented in [BRAIN-OUT] `understanding/frontend/components/shared-directives/API.md` (B23). The 8 validation directives + their providers/inputs/error-keys (summary, full detail in B23):

| Directive | Provides | Key inputs | Error key |
|---|---|---|---|
| `FalconStartWithLetterDirective` | `NG_VALIDATORS` | — | `{startWithLetter:true}` |
| `FalconStartWithLetterMax30Directive` | `NG_VALIDATORS` | — | `{startWithLetterMax30:true}` |
| `FalconLettersDigitsMaxDirective` | `NG_VALIDATORS` | `[falconLettersDigitsMax]=N` (50) | `{lettersAndDigitsMax:{max}}` |
| `FalconUsernameFormatDirective` | `NG_VALIDATORS` | `[falconUsernameFormat]=N` (30) | `{usernameFormat:{max}}` |
| `FalconPhoneNumberDirective` | `NG_VALIDATORS` | — | `{phone:true}` |
| `FalconCheckExistsDirective` | `NG_ASYNC_VALIDATORS` | `falconCheckExistsApi` (req), `…MinChars` (3), `…Error`, `…Debounce` (500) | `{falconCheckExists:{message}}` |
| `FalconPhoneMaskDirective` | `NG_VALUE_ACCESSOR`+`NG_VALIDATORS` | `minDigits` (7), `maxDigits` (15) | min/max digit errors |
| `FalconIpAddressDirective` | `NG_VALUE_ACCESSOR`+`NG_VALIDATORS` | `validateOnBlur` (true), `validateOnInput` (false) | IP format errors |

Non-validation siblings (same barrel, NOT validators): `FalconFormValidateDirective` (`form[falconFormValidate]`, consumes the deprecated shim's `getValidationErrorMessage`), `FalconColumnNameDirective`, `FalconTruncateDirective`, `FalconEffectiveDateDirective` (no-op stub).

## Reachability via `@falcon`
- `import { accountNameValidator, integerInRangeValidator, FALCON_VALIDATIONS, provideFalconValidations, messageFor, hasLiveError, keyForBackendCode } from '@falcon';` — all Layer-2/3 symbols ([CODE] `shared-utils/index.ts:7-26` re-exports; validations barrel exported FIRST so the registry's `emailValidator` const wins over the shim's legacy fn — L03 F-collision note).
- Directives: `import { FalconIpAddressDirective, … } from '@falcon';` (shared-ui barrel).
- `TranslatePipe`: `import { TranslatePipe } from '@falcon';` (language barrel).

## Verification
🟢 code-verified 2026-06-03 (L05) — every Layer-2/3 export transcribed from the registry/token/provider/named-validators/messages/shim files read in full; `integerInRangeValidator` et al. confirmed at `named-validators.ts:118-125`. Layer-1 directive surface summarized from B23's API.md (not re-read line-by-line — 🟡 for those rows). Pipe uniqueness via Glob. `@falcon` reachability via `shared-utils/index.ts`.
