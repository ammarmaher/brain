# Falcon Form-Validation — DECISION

## Brain SK final recommendation

**STATUS: READY (Layer 2 + 3) — the canonical FE validation system. Use it for ALL form validation in new code. AVOID Layer-1 directives + the deprecated shim.**

The `FALCON_VALIDATIONS` registry + named-validator aliases + `messages.ts` catalog + `translate` pipe are the production validation contract, anchored to the `Validations.xlsx` SoT. The Layer-1 directive tier is superseded; the `falcon-validators.ts` shim is on a deletion plan.

## Use this system for

- ANY Reactive-Forms or signal-state field validation. Bind registry validators on controls (`v.accountName()`) or compose named aliases in a `FalconFieldRules<T>` map.
- Numeric/enum/length/charset rules → reach for the **generic primitives** (`integerInRangeValidator`, `numberInRangeValidator`, `enumValidator`, `lengthValidator`, `startsWithLetterValidator`, `lettersAndDigitsOnlyValidator`, `whitespaceValidator`).
- Async uniqueness → `userNameUniqueValidator(check, reserved, pendingSignal)` / `accountNameUniqueValidator(check)`.
- Group/cross-field rules → `passwordsMatch`, `hierarchyDepthGuard`, `parentMustExist`, `cannotMoveUnderSelf`.
- Error display → `messageFor()`/`fieldErrorMessage()` → `{key} | translate`.
- Backend rejection → `keyForBackendCode(serverError.code)` → translate.

## Avoid

- **The deprecated `falcon-validators.ts` shim** (`FALCON_PATTERNS`, `startWithLetterValidator`, `getValidationErrorMessage`, …) — `@deprecated v1.2.0`, divergent (lenient phone, raw-English messages); v2.0.0 deletes it. Only `falcon-form-validate.directive.ts` may keep using it until migrated.
- **The Layer-1 validation directives** for NEW code — 7 of 8 are dormant; bind the Layer-2 registry validator on the control instead. (`falconIpAddress` is the lone live exception, and even it duplicates the registry's IP rule — F4.)
- **Hand-rolled inline regex validators** — the xlsx contract lives in the registry; a local regex will drift.
- **Raw English error strings** — always emit an i18n key.

## Exact rule for future tasks

1. **Field validation?** Compose registry validators / named aliases. DI scope → `inject(FALCON_VALIDATIONS)`; pure code → named aliases. Ensure `provideFalconValidations()` is in the app root (admin/mgmt already have it; ADD it to host-shell if a host-shell consumer uses `inject(FALCON_VALIDATIONS)`).
2. **Rule reduces to a shape?** Use a generic primitive, don't invent a bespoke validator.
3. **New field rule from the xlsx?** Add it to `defaultFalconValidationsRegistry` (with the xlsx-cite comment) + a `VALIDATOR_KEYS` entry + en/ar i18n + (if pre-touch) `LIVE_ERROR_KEYS` — then a named alias if non-DI callers need it.
4. **Errors** → `messageFor()/fieldErrorMessage()` then `| translate`; never a raw string.
5. **Backend error** → `keyForBackendCode()` (extend `BACKEND_ERROR_KEY` if a new `FalconKeys.Error` code appears).
6. **Do NOT** add a new Layer-1 directive or touch the shim; do NOT fork the rule into a feature (the `user-details/validations` copy is a managed exception guarded by a parity test).

## Relationship to other areas

- **SoT:** `Validations.xlsx` ([MEMORY] `project_validation_xlsx_sot_flip_wave_f`) — the registry encodes it.
- **Layer 1 detail:** `understanding/frontend/components/shared-directives` (B23).
- **Layer 2/3 internals + code-quality:** `understanding/frontend/shared-utils` (L03) — deprecated-shim removal, dual-IPv6, DRY-exemplar.
- **Layer 3 pipe/service:** `understanding/frontend/language` + `falcon-language` (L03).
- **Display control:** `understanding/frontend/components/falcon-input` (CVA error rendering).
- **Heaviest consumer:** `understanding/frontend/shared-features` (L05) — `user-details/validations` mirrors `personName`.

---

## Dynamic capability assessment (10-axis)

### 1. What is static today?
- The xlsx charsets/length-bands/enums/IPv6 regex are compile-time constants in `falcon-validations.ts` (correct — they ARE the business contract).
- `VALIDATOR_KEYS`, `LIVE_ERROR_KEYS`, `BACKEND_ERROR_KEY` are static maps.
- The deprecated shim's `FALCON_PATTERNS` are static (and divergent).

### 2. What is already dynamic through inputs/parameters?
- Every validator is a factory taking params (`integerInRange(min,max,required)`, `enumOf(set)`, `userNameUnique(check,reserved,pendingSignal,debounce)`, `hierarchyDepthGuard(treeProvider)`). Highly parameterised.
- `provideFalconValidations({ registry })` lets an app swap the WHOLE registry (or a subset) at the DI boundary.

### 3. What is dynamic through slots / templates?
- N/A — validators are functions, not components.

### 4. What is dynamic through token/theme overrides?
- N/A for the validators themselves; the DISPLAYED error visuals (color/state) are token-driven by the `falcon-ui-core` CVA control (its dossier).

### 5. What is dynamic through providers/DI?
- `FALCON_VALIDATIONS` is overridable per-app via `provideFalconValidations({ registry })`. `SERVICE_PRICING_VALIDATIONS` (feature-scoped, L05) shows the same pattern for a feature's own rules.

### 6. What is missing to make the system more reusable?
- A **host-shell** `provideFalconValidations()` so embedded `@falcon` features can safely `inject(FALCON_VALIDATIONS)`.
- Deletion of the deprecated shim (removes the divergent second source).
- A single IPv6 validator shared by the directive + the registry (F4).
- Consolidation of the `user-details` pure-fn copy onto the registry.

### 7. What capability should be added to the SHARED system (not a per-feature hack)?
- An injectable "run these `FalconFieldRules` as pure fns" helper that pulls from `FALCON_VALIDATIONS` — so a pure-fn slice (like `user-details`) can share the registry instead of copying constants.
- The IP validation should live in ONE place (registry) and the directive should delegate to it.

### 8. What flags / options would make it better?
- A strict-vs-lenient phone flag on the registry `phone()` (today strict E164; the shim's lenient variant is what the deprecation removes).
- `messageFor()` overload that returns the resolved string (inject `TranslateService`) so consumers don't always pipe.

### 9. What is the safest upgrade path?
1. **Phase A (additive, zero risk):** add `provideFalconValidations()` to host-shell app.config; add a direct `falcon-validations.spec.ts` (xlsx truth tables); drop the dead `_hardCap` param.
2. **Phase B (queued, behavior):** make `allowedIpList()` + `FalconIpAddressDirective` delegate to ONE `ip-utils.isValidIp` (add an agreement spec first) — F4.
3. **Phase C (queued, public-API):** migrate `falcon-form-validate.directive.ts` off the deprecated shim → then delete `falcon-validators.ts` (v2.0.0) — C1.
4. **Phase D (queued):** retire the 7 dormant validation directives after sweeping `falcon-studio*`/future features (B23) — F1.
5. **Phase E (queued, coordinate parity test):** consolidate `user-details/validations` onto the registry — L05-F1.

### 10. What is risky to change because other code depends on it?
- The error-KEY shapes (`{accountNameCharset:true}`, `{outOfRange:{min,actual}}`) — `messages.ts` + i18n keys + feature templates all key off them; renaming a key breaks the message lookup.
- The `defaultFalconValidationsRegistry` method signatures — the ~40 feature `validations.ts` files + 3 parity tests bind to them.
- The barrel EXPORT ORDER in `shared-utils/index.ts` (validations FIRST) — re-ordering re-shadows `emailValidator` with the legacy shim fn (L03 hazard).
- The xlsx charsets — changing one silently changes every Add Client/Add User field that composes it (the parity tests are the guard).
- The deprecated shim is still load-bearing for `falcon-form-validate.directive.ts` — don't delete before migrating it.

## Verification
🟢 code-verified 2026-06-03 (L05). Recommendation + capability assessment grounded in the registry/named-validators/token/provider/messages/shim files read this pass + the `app.config` Grep; the queued phases reference the exact findings in AUDIT.md (and the L03/B23 owners). No source edited.
