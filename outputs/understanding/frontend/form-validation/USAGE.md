# Falcon Form-Validation — USAGE

> How forms actually consume the system, the recommended pattern, and the Consumer Sweep. Cite file:line where load-bearing.

## The canonical usage pattern (Layer 2-first)

Falcon forms **bind registry validators directly on Reactive-Forms controls** (or run them as pure functions in a signal-state slice) and render errors via `messageFor() | translate`. The Layer-1 directives are the legacy alternative and are largely retired.

### A. DI-scoped (preferred in components)
```ts
private readonly v = inject(FALCON_VALIDATIONS);
form = this.fb.group({
  accountName: ['', [this.v.required(), this.v.accountName()]],
  maxNodeLevel: [0, [this.v.integerInRange(0, 999, true)]],
});
```
[CODE] `provideFalconValidations()` makes the token resolvable (admin + mgmt `app.config.ts`). Testable + overridable.

### B. Named aliases (pure services / model helpers, no DI)
```ts
import { personNameValidator, integerInRangeValidator, userNameUniqueValidator } from '@falcon';
const rules: FalconFieldRules<MyForm> = {
  firstName: [requiredValidator, personNameValidator],
  userLimit: [integerInRangeValidator(0, 999, true)],
  username: [userNameUniqueValidator(backendCheck, FALCON_RESERVED_USERNAMES, pendingSig)],
};
```
[CODE] this is the dominant pattern across the wizard step `validations/validations.ts` files (admin + mgmt). The signal-state slices then call `allFieldsValid(value, rules)` for the Next-button gate and `fieldErrorMessage(value, field, rules, touched)` per field ([CODE] `falcon-validations.ts:838-879`).

### C. Error rendering (Layer 3)
```ts
const msg = fieldErrorMessage(this.value(), 'accountName', rules, this.touched());
// template: {{ msg?.key | translate: msg?.params }}
```
`messageFor(control.errors)` / `fieldErrorMessage()` return a `{key, params}`; the `translate` pipe resolves en/ar ([CODE] `messages.ts:95-102`, `translate.pipe.ts:26-56`). `hasLiveError()` makes length/charset/format errors show at first keystroke (pre-touch) ([CODE] `messages.ts:69-93`).

### D. Backend-rejection mapping
```ts
const feKey = keyForBackendCode(serverError.code); // FalconKeys.Error → hierarchy.validation.*
this.error.set(feKey); // then translate
```
[CODE] `messages.ts:111-149` — the same i18n keys the client validators use, so a server-rejected submission reuses the FE message lookup.

### E. Layer-1 directive (legacy — only IP allowlist today)
```html
<input falconIpAddress [validateOnBlur]="true" />
```
[CODE] sole live consumer `apps/admin-console/.../add-client-wizard/client-settings-step/client-settings-step.component.{ts,html}` ([BRAIN-OUT] `shared-directives/OVERVIEW.md:62-66`, B23).

## Do / Don't

| Do | Don't |
|---|---|
| Bind registry validators (`v.accountName()` / `accountNameValidator`) on controls | Hand-roll a regex validator inline (the xlsx contract lives in ONE place) |
| Reach for a **generic primitive** (`integerInRangeValidator(0,100,true)`, `enumValidator(set)`, `lengthValidator`) when the rule reduces to a shape | Invent a bespoke validator for "integer in [a,b]" ([CODE] `named-validators.ts:79-94` says so) |
| Render errors via `messageFor()/fieldErrorMessage()` → `\| translate` | Emit raw English strings (use the i18n key) |
| Map backend errors via `keyForBackendCode()` | Re-derive backend→message mapping ad hoc |
| Use `inject(FALCON_VALIDATIONS)` in components; named aliases in pure code | Import the deprecated `falcon-validators.ts` shim in NEW code |
| Compose `whitespaceValidator('no-edges')` BEFORE `lengthValidator` | Rely on length-trim to catch edge whitespace (it trims silently) |
| Pass a `pendingSignal` to `userNameUniqueValidator` to gate Next during the async probe | Block the form on an in-flight async check without a pending indicator |

## Consumer Sweep (Grep-verified 2026-06-03)

Method: `Grep` of `FALCON_VALIDATIONS|provideFalconValidations|integerInRangeValidator|numberInRangeValidator|enumValidator|named-validators|FALCON_PATTERNS|getValidationErrorMessage|messageFor|hasLiveError|keyForBackendCode` across `apps/` + `libs/falcon/` (excl. `dist/`) → **50 files**.

| Surface | Representative consumers | Scale |
|---|---|---|
| **Layer 2 registry / named aliases** | admin + mgmt: every `add-client-wizard/*-step/validations/validations.ts` (client-information / settings / applications / comm-channels / account-owner steps), every `add-user-wizard/*-step/validations/validations.ts` (personal / role-status / permissions), both `settings-tab/validations/validations.ts`, both `falcon-org-node-drawer/validations/validations.ts`, `contracts-cost-management/validations/validations.ts`, `falcon-org-info-panel.component.ts`, both `add-user-state.signals.ts` | **~40 feature files** |
| **`provideFalconValidations()`** | `apps/admin-console/.../app.config.ts:72`, `apps/management-console/.../app.config.ts:70` | **2 (DI wiring)** |
| **Generic primitives** (`integerInRange`/`numberInRange`/`enumValidator`) | new-wallet-balance (`wb-balance-transfer-drawer.component.ts`, `transfer-rules.ts`, `validations.ts`), settings/user-limit steps | several |
| **Parity tests** (`tools/validation-tests/`) | `add-client-validations.test.ts`, `add-user-validations.test.ts`, `user-profile-name-validations.test.ts`, + `vitest.config.mts` | **3 test suites** |
| **Layer 3 `messageFor`/`hasLiveError`/`keyForBackendCode`** | the wizard step components + slices that render field errors | embedded throughout |
| **Deprecated shim (`FALCON_PATTERNS`/`getValidationErrorMessage`)** | ONLY `falcon-form-validate.directive.ts` (+ archive/plan docs) | **1 live** |
| **Layer 1 directives** | `client-settings-step` → `falconIpAddress` (sole live); 7 other validation directives dormant | **1 live** |

**Net:** the validation system is one of the most heavily-consumed FE contracts. **Layer 2 (registry + named aliases) is the live spine** (~40 feature files + 2 app.configs + 3 parity tests). **Layer 1 directives are nearly dead** (1 live use) — superseded by Layer 2 bound on Reactive-Forms controls. **Layer 3** (messages + translate) is embedded everywhere errors render. The **deprecated shim** has exactly 1 live consumer (the form-validate directive) and is on a deletion plan.

## Cross-references (no duplication)
- Per-directive API + the 11-dormant finding → [BRAIN-OUT] `understanding/frontend/components/shared-directives/` (B23).
- Registry-internals code-quality (deprecated-shim removal, dual-IPv6 divergence, narrow casts, DRY-exemplar) → [BRAIN-OUT] `understanding/frontend/shared-utils/` (L03).
- `translate` pipe/service mechanics + en/ar parity → [BRAIN-OUT] `understanding/frontend/language` + `falcon-language` (L03).
- `user-details/validations` mirroring `personName` → [BRAIN-OUT] `understanding/frontend/shared-features/` (L05 sibling).

## Verification
🟢 code-verified 2026-06-03 (L05) — usage patterns reflect the actual registry API + the `allFieldsValid`/`fieldErrorMessage`/`messageFor`/`keyForBackendCode` call shapes; Consumer Sweep enumerated by the Grep above (50 files). Layer-1 live-count carried from B23's 🟢 Grep. No source edited.
