# 10 — Validation Convention

> **Doctrine.** Every Falcon feature component declares its validation rules in a `validations/validations.ts` file. Cross-component rule sharing happens via the single `FALCON_VALIDATIONS` registry. Direct `ValidatorFn` imports across feature folders are forbidden. Locked 2026-05-16 (Strategy v1.2.0).

## 1. Purpose

Before v1.2.0, page-pool features carried their own validator soup (`apps/admin-console/.../org-hierarchy-page/services/validators.ts` — 309 lines exporting 24 functions, tightly coupled to `mock-tree.ts`). Every wizard step component imported individual `ValidatorFn`s directly. Same validator (e.g. `personNameValidator`) appeared in both Add User and Add Client wizards via the same import path, but the import depth (`../../../../services/validators`) was a foot-gun: any folder move broke 8+ callsites.

v1.2.0 fixes this by:

- Lifting the registry into `libs/falcon/src/shared-utils/lib/validations/` so any app can consume it via `@falcon` (no relative paths).
- Wrapping it in an Angular `InjectionToken` (`FALCON_VALIDATIONS`) so consumers resolve rules through DI — testable, mockable, overridable.
- Mandating that each feature component declare its OWN `validations/validations.ts` listing exactly the fields and rules that step needs — no implicit cross-component coupling.

## 2. Global registry API

The canonical source lives at `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts`. Public surface:

### 2.1 — `FalconValidationsRegistry` interface

```typescript
interface FalconValidationsRegistry {
  // Sync primitives
  required(): ValidatorFn;
  lettersAndDigits(): ValidatorFn;
  lettersDigitsOrEmail(): ValidatorFn;
  nationalId(): ValidatorFn;
  anyString(min?: number, max?: number, required?: boolean): ValidatorFn;

  // Domain entities
  accountName(): ValidatorFn;
  nodeName(): ValidatorFn;
  personName(): ValidatorFn;
  userName(): ValidatorFn;
  email(): ValidatorFn;
  phone(): ValidatorFn;
  saudiPhone(): ValidatorFn;
  permissionGroup(): ValidatorFn;

  // Numeric ranges
  maxNodeLevels(hardCap?: number): ValidatorFn;
  userLimit(): ValidatorFn;
  allowedIpList(): ValidatorFn;

  // Password security
  password(level?: FalconPasswordSecurityLevel): ValidatorFn;  // 'normal' | 'advanced' | 1 | 2

  // Role-assignment gate
  roleAssignment(opts?: FalconRoleAssignmentOptions): ValidatorFn;

  // Async (backend-check function injected by caller)
  accountNameUnique(backendCheck: (name: string) => Observable<boolean>, debounceMs?: number): AsyncValidatorFn;
  userNameUnique(backendCheck: (username: string) => Observable<boolean>, reservedSet?: ReadonlySet<string>, debounceMs?: number): AsyncValidatorFn;

  // Hierarchy-aware group validators (tree-provider injected by caller)
  hierarchyDepthGuard<TNode extends FalconHierarchyNode>(treeProvider: () => TNode | null, parentIdField?: string): ValidatorFn;
  passwordsMatch(newField?: string, confirmField?: string): ValidatorFn;
  parentMustExist<TNode extends FalconHierarchyNode>(treeProvider: () => TNode | null, parentIdField?: string): ValidatorFn;
  cannotMoveUnderSelf<TNode extends FalconHierarchyNode>(treeProvider: () => TNode | null, idField?: string, newParentField?: string): ValidatorFn;

  // Helper
  runValidators(control: AbstractControl, ...vs: readonly ValidatorFn[]): ValidationErrors | null;
}
```

### 2.2 — `FALCON_VALIDATIONS` token + `FalconFieldRules<T>` generic

```typescript
export const FALCON_VALIDATIONS: InjectionToken<FalconValidationsRegistry>;

export type FalconFieldRules<T> = {
  readonly [K in keyof T]?: ReadonlyArray<ValidatorFn | AsyncValidatorFn>;
};

export const FALCON_RESERVED_USERNAMES: ReadonlySet<string>;
```

### 2.3 — Provider factory

```typescript
provideFalconValidations(opts?: { registry?: FalconValidationsRegistry }): EnvironmentProviders;
```

Wire once in the app root (`apps/admin-console/src/app/app.config.ts`):

```typescript
providers: [
  // ...
  provideFalconValidations(),  // uses defaultFalconValidationsRegistry
]
```

To swap the registry for tests or alternate environments, pass `{ registry: myCustomRegistry }`.

### 2.4 — Runtime helpers

```typescript
export const allFieldsValid: <T>(value: T, rules: FalconFieldRules<T>) => boolean;
export const fieldErrorMessage: <T>(value: T, field: keyof T, rules: FalconFieldRules<T>, touched: ReadonlySet<string>) => ValidationMessage | null;
```

- `allFieldsValid` — runs every SYNC rule against current values. Async rules are skipped (they live alongside their own UI signal).
- `fieldErrorMessage` — runs the rule array for a single field. Returns a `ValidationMessage` (i18n key + params) when an error is currently visible per the LIVE_ERROR_KEYS gate + touched-set; otherwise null.

## 3. Per-component template

Every feature component declares its rules in `validations/validations.ts`:

```typescript
/*** Step 1 — User Personal — declarative validation rules. ***/

import { InjectionToken, Provider, inject } from '@angular/core';

import {
  AccountValidationService,
  FALCON_RESERVED_USERNAMES,
  FALCON_VALIDATIONS,
  FalconFieldRules,
} from '@falcon';

import { UserPersonalFormValue } from '../../models/models';

export const USER_PERSONAL_VALIDATIONS = new InjectionToken<FalconFieldRules<UserPersonalFormValue>>(
  'USER_PERSONAL_VALIDATIONS',
);

export const userPersonalRulesProvider = (): Provider => ({
  provide: USER_PERSONAL_VALIDATIONS,
  useFactory: (): FalconFieldRules<UserPersonalFormValue> => {
    const v = inject(FALCON_VALIDATIONS);
    const acct = inject(AccountValidationService);
    const backendCheck = (username: string) => acct.isUserExist(username);

    return {
      firstName: [v.personName()],
      lastName: [v.personName()],
      userName: [v.userName(), v.userNameUnique(backendCheck, FALCON_RESERVED_USERNAMES)],
      nationalId: [v.nationalId()],
      phone: [v.phone()],
      email: [v.email()],
    };
  },
});
```

## 4. Provider wiring

The component registers its own `*RulesProvider()` in `@Component({ providers: [...] })`:

```typescript
@Component({
  selector: 'app-user-personal-step',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [/* ... */],
  templateUrl: './user-personal-step.component.html',
  providers: [userPersonalRulesProvider()],
})
export class UserPersonalStepComponent {
  private readonly rules = inject(USER_PERSONAL_VALIDATIONS);
  // ...
}
```

The wizard parent stays unaware of per-field rules — each step owns its own validation universe.

## 5. Override semantics

v1 (2026-05-16) supports override **by composition only**. To swap a single rule for a specific component instance, declare a new `validations/validations.ts` for that variant and register its provider on a per-route or per-component basis.

A global-rule override (e.g. "all `email()` calls in app X use a custom regex") is a **v2** feature. Today, the only override path is providing a custom `FalconValidationsRegistry` to `provideFalconValidations({ registry: ... })` at app bootstrap.

## 6. Error message contract + i18n key namespace

Validators emit `ValidationErrors` keys that map to i18n keys via `messageFor`:

```typescript
interface ValidationMessage {
  readonly key: string;          // 'hierarchy.validation.invalidEmail'
  readonly params?: Readonly<Record<string, string | number>>;
}

const messageFor = (errors: ValidationErrors | null) => ValidationMessage | null;
const hasLiveError = (errors: ValidationErrors | null) => boolean;
const toServiceErrors = (errors: ValidationErrors | null) => readonly ServiceErrorEnvelope[];
const keyForBackendCode = (backendCode: string) => string;
```

The `hierarchy.validation.*` key namespace is v1's i18n contract. v2 cleanup may rename to `falcon.validation.*` for cross-page sharing — kept as-is in v1 to avoid en.json / ar.json churn.

`LIVE_ERROR_KEYS` is the set of error-keys that surface immediately (without waiting for the user to blur). `hasLiveError` returns true if any of those keys are in the merged errors — guards the "show error while typing" UX.

`BACKEND_ERROR_KEY` is the dictionary mapping FalconKeys.Error codes (server-side) to the same i18n keys (`UserAlreadyExists` → `hierarchy.validation.duplicateUsername`).

## 7. Migration cookbook — old → new

| Old | New | Notes |
|---|---|---|
| `import { personNameValidator } from '../../../../services/validators'` | `import { personNameValidator } from '@falcon'` | The named-validator constant is exported for non-DI consumers. DI consumers prefer `inject(FALCON_VALIDATIONS).personName()` |
| `import { hasLiveError, messageFor, ValidationMessage } from '../../../../services/validation-messages'` | `import { hasLiveError, messageFor, ValidationMessage } from '@falcon'` | |
| `import { ServiceErrorEnvelope, toServiceErrors } from '../../../../services/validation-messages'` | `import { ServiceErrorEnvelope, toServiceErrors } from '@falcon'` | |
| `personNameValidator(makeControl(v.firstName))` (in a `computed()` per field) | `fieldErrorMessage(this.value(), 'firstName', this.rules, this.touched())` | Generic helper runs the rule array + LIVE_ERROR_KEYS gate in one call |
| Hand-rolled `isFormValid` running each `ValidatorFn` per field | `allFieldsValid(this.value(), this.rules)` | Iterates the rule map automatically |
| `userNameUniqueValidator((): readonly string[] => [])` | `userNameUniqueValidator(backendCheck, FALCON_RESERVED_USERNAMES)` | Signature change: now takes a backend-check Observable function + optional reserved-set |
| `passwordValidator(ePasswordSecurityLevel.Normal)` | Unchanged | Numeric enum (1, 2) is supported alongside `'normal' \| 'advanced'` for backward compat |
| `roleAssignmentValidator()` | `roleAssignmentValidator({ validRoleKeys: VALID_ROLE_KEYS })` | Pass the valid-key set explicitly; v1 registry does NOT default to any specific role universe |

## 8. Forbidden patterns

| Pattern | Why | Fix |
|---|---|---|
| Direct `import { someValidator } from '../<other-feature>/validators.ts'` | Cross-feature coupling | Both features inject `FALCON_VALIDATIONS` and compose their own rules |
| Inline `new FormControl(value)` in a `computed()` to check validity | Boilerplate that re-runs the rule against a throwaway control every change | `fieldErrorMessage(value(), field, rules, touched())` |
| `services/validators.ts` next to HTTP services | Conflates rule declaration with API surface | Put rules in `validations/validations.ts` for the component that owns the form |
| Hard-coded i18n key strings inside step components | Diverges from `messageFor()` | Always go through `messageFor(errors)` so the LIVE_ERROR_KEYS gate is honoured |

## 9. Roadmap — v2 features

- **Async-uniqueness first-class** — registry-level support for "username must be unique within tenant T at endpoint E" without each step component wiring its own `inject(AccountValidationService)` factory.
- **Schema-based rules** — derive `FalconFieldRules<T>` from a JSON schema + i18n metadata, so backend + frontend share one contract.
- **Error-message override** — per-app or per-route swap of `messageFor` so non-Falcon apps reusing the registry can localise without forking the registry.
- **i18n key rename** — `hierarchy.validation.*` → `falcon.validation.*`, with a compatibility shim for en.json / ar.json that maps the old keys to the new during v2 transition.
- **Deletion of the legacy `lib/validators/falcon-validators.ts` shim** — replace remaining directive callers (`falconStartWithLetter`, `falconLettersDigitsMax`, etc.) with registry-based equivalents.

## References

- Reference implementation: `apps/admin-console/.../add-user-wizard/` (all 3 steps + `services/user.service.ts`)
- Registry source: `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts`
- Token + types: `libs/falcon/src/shared-utils/lib/validations/falcon-validation.token.ts`
- Provider factory: `libs/falcon/src/shared-utils/lib/validations/provide-falcon-validations.ts`
- Message catalogue: `libs/falcon/src/shared-utils/lib/validations/messages.ts`
- Named-validator surface (non-DI): `libs/falcon/src/shared-utils/lib/validations/named-validators.ts`

_Authored 2026-05-16 — Strategy v1.2.0 — Author: Ammar Web-Platform-UI._
