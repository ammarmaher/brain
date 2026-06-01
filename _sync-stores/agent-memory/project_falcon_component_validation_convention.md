# Falcon Component + Validation Convention (v1.2.0)

> **Status:** 🟢 LANDED (2026-05-16)
>
> Falcon component-folder doctrine + global validations registry. Reference implementation: `add-user-wizard` (admin-console).

## TL;DR

Every Falcon feature component (wizard step, drawer panel, page-pool form, host-shell shared-component) now follows ONE folder shape and consumes validations from ONE shared registry:

```
<feature-component>/
  <name>.component.{ts,html}
  index.ts
  models/models.ts                  # ONE file holding interfaces / form values / helpers
  services/<domain>.service.ts      # ONE class per domain (UserService, ClientService, WalletService...)
  validations/validations.ts        # field-rule map + InjectionToken + RulesProvider() factory
```

Validation rules come from the global registry at `libs/falcon/src/shared-utils/lib/validations/`. Components inject `FALCON_VALIDATIONS` to compose their per-component rule map.

## Decisions (D1–D9) locked

| ID | Locked decision |
|---|---|
| D1 | Registry location: `libs/falcon/src/shared-utils/lib/validations/` |
| D2 | Shape: DI token + factory provider (`FALCON_VALIDATIONS` + `provideFalconValidations()`), mirroring `provideFalconFacades` in `libs/sdk/src/facades/provide-falcon-facades.ts` |
| D3 | Seed: 24 functions absorbed from `apps/admin-console/.../org-hierarchy-page/services/validators.ts`. Legacy `libs/falcon/src/shared-utils/lib/validators/falcon-validators.ts` retained as deprecation shim |
| D4 | Per-component declaration via `validations/validations.ts` exporting `FalconFieldRules<T>` + InjectionToken + `*RulesProvider()` factory. Override by composition (no global-rule override in v1) |
| D5 | Each step registers its own `*RulesProvider()` in `@Component({ providers: [...] })`. Constructor uses `inject(<STEP>_VALIDATIONS)`. Wizard parent stays unaware |
| D6 | Reuse `ValidationMessage { key, params }` shape. Moved `validation-messages.ts` → `messages.ts` inside the registry folder. Kept `hierarchy.validation.*` i18n keys as-is in v1 — rename is v2 |
| D7 | Add User wizard refactored as canonical reference. Add Client gets the service rename only (full validation refactor deferred) |
| D8 | Filename: `services/<domain>.service.ts`. Class renames: `AddUserApiService` → `UserService`, `AddClientApiService` → `ClientService`. Clarification appended to `feedback_folder_structure_pattern.md` |
| D9 | Documentation: §7 in `01-CANONICAL_PATTERN.md`, new `10-VALIDATION_CONVENTION.md`, this memory file, MEMORY.md index line, `CLAUDE.md` paragraph |

## Files created / changed

### Created (libs)
- `libs/falcon/src/shared-utils/lib/validations/falcon-validations.ts` — `FalconValidationsRegistry` interface + `defaultFalconValidationsRegistry` default implementation. 24 sync + async factories. Plus `allFieldsValid` + `fieldErrorMessage` runtime helpers.
- `libs/falcon/src/shared-utils/lib/validations/falcon-validation.token.ts` — `FALCON_VALIDATIONS` InjectionToken + `FalconFieldRules<T>` generic + `FALCON_RESERVED_USERNAMES` constant.
- `libs/falcon/src/shared-utils/lib/validations/provide-falcon-validations.ts` — `provideFalconValidations(opts?)` `EnvironmentProviders` factory.
- `libs/falcon/src/shared-utils/lib/validations/messages.ts` — `ValidationMessage`, `hasLiveError`, `messageFor`, `messagesFor`, `BACKEND_ERROR_KEY`, `ServiceErrorEnvelope`, `toServiceErrors`, `keyForBackendCode`.
- `libs/falcon/src/shared-utils/lib/validations/named-validators.ts` — backward-compat named exports (`personNameValidator`, `emailValidator`, etc.) for non-DI consumers and migration ergonomics.
- `libs/falcon/src/shared-utils/lib/validations/index.ts` — barrel.

### Created (app — per-step validations)
- `apps/admin-console/.../add-user-wizard/user-personal-step/validations/validations.ts` (with async username uniqueness via `AccountValidationService.isUserExist`).
- `apps/admin-console/.../add-user-wizard/user-role-status-step/validations/validations.ts`.
- `apps/admin-console/.../add-user-wizard/user-permissions-step/validations/validations.ts`.

### Renamed
- `add-user-wizard/services/services.ts` → `add-user-wizard/services/user.service.ts`. Class `AddUserApiService` → `UserService`. Added `getUser(id)` + `deleteUser(id)` stubs.
- `add-client-wizard/services/services.ts` → `add-client-wizard/services/client.service.ts`. Class `AddClientApiService` → `ClientService`.

### Deleted
- `apps/admin-console/.../org-hierarchy-page/services/validators.ts` (309 lines absorbed into registry).
- `apps/admin-console/.../org-hierarchy-page/services/validation-messages.ts` (moved into registry as `messages.ts`).

### Modified
- `libs/falcon/src/shared-utils/index.ts` — added re-export of `./lib/validations`.
- `libs/falcon/src/shared-utils/lib/validators/falcon-validators.ts` — converted to `@deprecated v1.2.0` shim. Dropped colliding `emailValidator()` factory (no callers). All other legacy exports retained verbatim so the 6 directive consumers keep working.
- `apps/admin-console/src/app/app.config.ts` — added `provideFalconValidations()` to root providers.
- `apps/admin-console/.../org-hierarchy-page/models/models.ts` — import path updated.
- `apps/admin-console/.../org-hierarchy-page/services/services.ts` (HierarchyService) — import path updated.
- All 3 Add User wizard step components — refactored to inject step-specific InjectionToken and consume `allFieldsValid` / `fieldErrorMessage` helpers.
- All 3 Add Client wizard step components — import path updated (Wave 2 migration only; validation refactor deferred).
- `apps/admin-console/.../org-hierarchy-page/services/hierarchy-page-state.service.ts` — `AddUserApiService` → `UserService`, `AddClientApiService` → `ClientService`.

## Reusability — wiring a new component

Three lines:

```typescript
// In <my-component>/validations/validations.ts
export const MY_VALIDATIONS = new InjectionToken<FalconFieldRules<MyFormValue>>('MY_VALIDATIONS');
export const myRulesProvider = (): Provider => ({
  provide: MY_VALIDATIONS,
  useFactory: () => ({ fieldA: [inject(FALCON_VALIDATIONS).email()] }),
});

// In <my-component>.component.ts
@Component({ providers: [myRulesProvider()] })
class MyComponent { private rules = inject(MY_VALIDATIONS); }
```

Then in the template, use `fieldErrorMessage(this.value(), 'fieldA', this.rules, this.touched())` to compute the visible error.

## Build verification

All 3 apps GREEN at final wave:
- admin-console: `8bfaa6facac32a61` (23.3s)
- management-console: `554e03bb4374f3ad` (14.7s)
- host-shell: `2f580356eccc81e2` (17.4s)

## Forward work (v2)

- Async-uniqueness first-class (registry knows backend endpoints, callers don't).
- Schema-based rule derivation from backend contracts.
- Per-app / per-route `messageFor` override.
- i18n key rename `hierarchy.validation.*` → `falcon.validation.*`.
- Delete legacy `falcon-validators.ts` shim once directives migrate.
- Apply the convention to Add Client wizard (Wave 5 did service rename only).

## References

- Strategy doc: `Brain Outputs/strategies/falcon-component-creation/01-CANONICAL_PATTERN.md` §7
- Validation contract: `Brain Outputs/strategies/falcon-component-creation/10-VALIDATION_CONVENTION.md`
- Changelog: `Brain Outputs/strategies/falcon-component-creation/09-CHANGELOG.md` v1.2.0
- Reference implementation: `apps/admin-console/.../add-user-wizard/`

## How to resume / extend

Trigger phrases:
- `apply the validation convention to <component>` — port a feature component to the new pattern.
- `add a new rule to FALCON_VALIDATIONS` — extend `falcon-validations.ts` + add to the `FalconValidationsRegistry` interface + add named export to `named-validators.ts` + add i18n key to `messages.ts`.
- `migrate <feature> to user.service.ts pattern` — apply the D8 service rename clarification.

_Authored 2026-05-16 by Ammar Web-Platform-UI._
