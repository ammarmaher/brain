# falcon-shared-utils — OVERVIEW

> Non-component area dossier (SWEEP-SPEC §7 lighter 5-file set). This is `@falcon` `shared-utils` — pure helper functions + the **Falcon validations registry** (the platform's single source of form-validation truth, derived from `Validations.xlsx`). Not a UI component; mirror falcon-input tone, skip the B/E rubric.

## Area purpose

Two cohabiting concerns under one lib:

1. **Pure utility functions** (`lib/utils/`) — framework-light helpers: IP-address validation/sanitization, a CSS-variable reader, a contact-group DTO→view-model mapper, and node-id scoping guards for the synthetic Falcon root.
2. **The Falcon validations registry** (`lib/validations/`) — THE canonical, DI-injectable home of every reusable Angular `ValidatorFn`/`AsyncValidatorFn`, sourced field-for-field from `Validations.xlsx` (the declared SoT that supersedes PRD business rules). Plus the message-key catalog that maps validator error keys + backend `FalconKeys.Error` codes → `hierarchy.validation.*` i18n keys.
3. **A legacy deprecation shim** (`lib/validators/falcon-validators.ts`) — pre-registry `@deprecated v1.2.0` validators kept alive only so `falcon-form-validate.directive.ts` keeps compiling; slated for v2.0.0 deletion.

`[CODE]` All re-exported through `@falcon` via `libs/falcon/src/index.ts:59` (`export * from './shared-utils'`).

## Business / UI use case

- **Every Add Client / Add Node / Add User / Edit form** in both consoles validates through the registry: account-name, node-name, person-name (first/last), username (sync + async-unique), email, phone, password (Normal/Advanced), IP allowlist, user limits, price values, password-security-level, hierarchy depth, parent-exists, cannot-move-under-self. `[CODE]` `falcon-validations.ts:1` "ALL 24 reusable ValidatorFn/AsyncValidatorFn factories live here."
- **The validations are a business contract**: `[CODE]` charset/length constants are explicitly annotated against `Validations.SOT-2026-05-24.xlsx` (account-name 2–30, person-name 2–50, username 2–30, price 0…999_999_999_999_999, etc.) and the comments record which PRD rules were SUPERSEDED (BR-AM-03, BR-UM-11/12 starts-with-letter) and which bugs were fixed (BUG-08 node-name = account-name shape). This makes shared-utils the FE half of the validation business layer.
- **IP utils** back the IP-allowlist directive (`falcon-ip-address.directive.ts`) — full IPv4 + IPv6 (RFC 4291/5952) + CIDR + zone-id parsing.
- **node-scope utils** prevent the synthetic `FALCON_ROOT_NODE` id (a FE-only construct, not a Mongo ObjectId) from ever reaching Commerce/Identity on the wire — a guard against 400/500 backend deserialization errors.
- **contact-group mapper** turns the list-endpoint DTO into the table row VM (date/time formatting, shared-with chips, status normalization).
- **theme-utils** `getCssVariable()` reads computed CSS custom properties (SSR-safe).

## When to use it / when NOT to use it

**Use it for:**
- ANY reactive-form field validation → the registry (`inject(FALCON_VALIDATIONS)` in DI, or the named-validator aliases for non-DI callers).
- A field whose rule reduces to a small shape (integer range, number range, enum, length, starts-with-letter, letters+digits) → the **generic primitives** (`integerInRangeValidator`, `enumValidator`, `lengthValidator`, …) — do NOT invent a bespoke validator.
- Mapping validator/backend errors → i18n keys → `messages.ts` (`messageFor`, `keyForBackendCode`, `hasLiveError`).
- IP/CIDR validation → `ip-utils` (`isValidIp`, `detectMode`, `sanitize`).
- Attaching a node-scoped id to an HTTP request → `appendNodeId` / `isRealNodeId` (`node-scope.util`).
- Reading a theme CSS var in TS → `getCssVariable`.

**Do NOT use it for:**
- New code reaching for the **legacy `falcon-validators.ts`** shim — it is `@deprecated v1.2.0`; use the registry. (Kept only for `falcon-form-validate.directive.ts`.)
- Date/number/currency formatting beyond the contact-group mapper's bespoke dd/mm/yyyy + h:mm am/pm helpers (those are list-table-specific).
- Cross-field business orchestration that needs runtime state — the hierarchy-aware validators take a `treeProvider` callback; never import a feature's concrete tree into the registry.

## Status

**ACTIVE / PREFERRED (registry + utils).** The registry is the canonical validation home (absorbed 2026-05-16 from `org-hierarchy-page/services/validators.ts`). The legacy `falcon-validators.ts` is **DEPRECATED (v1.2.0), pending v2.0.0 deletion** — `[CODE]` `falcon-validators.ts:1-4`.

## Replaces

- `[CODE]` `apps/admin-console/.../org-hierarchy-page/services/validators.ts` (absorbed into `falcon-validations.ts`, header `:2`).
- `[CODE]` `apps/admin-console/.../org-hierarchy-page/services/validation-messages.ts` (absorbed into `messages.ts`, header `:2`).
- `[CODE]` `page-pool mock-tree.ts:138` reserved-usernames seed (moved to `FALCON_RESERVED_USERNAMES`, `falcon-validation.token.ts:18-23`).
- The legacy `falcon-validators.ts` functions themselves (the shim that the registry supersedes).

## Source file paths

| File | Lines | Purpose |
|---|---|---|
| `libs/falcon/src/shared-utils/index.ts` | 27 | Area barrel — utils + validations registry + legacy shim (named re-exports). |
| `lib/utils/ip-utils.ts` | 142 | IPv4/IPv6/CIDR/zone-id validation + sanitize + mode detect. |
| `lib/utils/theme-utils.ts` | 13 | `getCssVariable(name, fallback)` SSR-safe CSS-var reader. |
| `lib/utils/contact-group.mapper.ts` | 92 | DTO→table-row VM + shared-with chips + date/time format. |
| `lib/utils/node-scope.util.ts` | 45 | `isRealNodeId` / `isFalconRootId` / `appendNodeId` (synthetic-root guard). |
| `lib/validations/index.ts` | 9 | Validations sub-barrel (registry + token + provider + messages + named). |
| `lib/validations/falcon-validations.ts` | 880 | **The registry** — `FalconValidationsRegistry` interface + `defaultFalconValidationsRegistry` (24+ factories) + `allFieldsValid`/`fieldErrorMessage` helpers + tree helpers. |
| `lib/validations/named-validators.ts` | 173 | Convenience aliases over the default registry (const ValidatorFns + factory fns + `PRICE_VALUE_MAX_DIGITS`/`USER_LIMIT_MAX_DIGITS`). |
| `lib/validations/messages.ts` | 150 | Validator-error-key → i18n-key catalog + backend-code map + `messageFor`/`hasLiveError`/`keyForBackendCode`/`toServiceErrors`. |
| `lib/validations/falcon-validation.token.ts` | 24 | `FALCON_VALIDATIONS` DI token + `FalconFieldRules<T>` generic + `FALCON_RESERVED_USERNAMES`. |
| `lib/validations/provide-falcon-validations.ts` | 24 | `provideFalconValidations()` EnvironmentProviders factory. |
| `lib/validators/falcon-validators.ts` | 191 | **DEPRECATED v1.2.0 shim** — `FALCON_PATTERNS`, `FALCON_VALIDATION_MESSAGES`, 5 legacy validator fns, `getValidationErrorMessage`. |
| `@falcon` re-export | — | `libs/falcon/src/index.ts:59` (`export * from './shared-utils'`). |
| Spec/tests | NONE | No `*.spec.ts` IN the lib (AUDIT F1); feature-level specs consume it (see USAGE). |

## Selectors / tokens

| Symbol | Purpose |
|---|---|
| `FALCON_VALIDATIONS` | DI token → `FalconValidationsRegistry` (resolve via `inject()`). |
| `provideFalconValidations(opts?)` | EnvironmentProviders — wired in **admin + mgmt** app.config (NOT host-shell). |
| `defaultFalconValidationsRegistry` | The concrete registry; named-validators bind to it. |
| `FALCON_RESERVED_USERNAMES` | Default reserved-usernames Set (`admin/root/system/falcon/test`). |
| `FalconFieldRules<T>` | Type-safe `{ [K in keyof T]?: (ValidatorFn\|AsyncValidatorFn)[] }` map. |

## Known consumers (grep verified 2026-06-03)

- `[CODE]` `FALCON_VALIDATIONS` / `defaultFalconValidationsRegistry`: **13 files** — incl. `admin-console/app.config.ts` + `management-console/app.config.ts` (provider), `add-user-wizard/user-personal-step/validations/validations.ts` (admin + mgmt), `falcon-org-node-drawer.component.ts` (admin + mgmt), `libs/falcon/src/shared-features/service-pricing-table/validations/validations.ts`, + the registry's own files.
- `[CODE]` `provideFalconValidations()`: **2 app configs** — `admin-console/app.config.ts:20,72` + `management-console/app.config.ts:19,70`. **Host-shell does NOT register it** (the registry is consumed inside the remote feature forms).
- `[CODE]` `isRealNodeId`/`appendNodeId`/`isFalconRootId`: **44 occurrences / 12 files** — org-hierarchy services/signals (admin + mgmt), contact-group-api.service, user-api.service, organization-hierarchy-tree services.
- `[CODE]` `isValidIp`/`detectMode`/`getCssVariable`/`mapContactGroup`: **47 occurrences / 15 files** — `falcon-ip-address.directive.ts` (6), wallet-balance-management (admin + mgmt), settings-tab, contact-groups services + models.

See `USAGE.md` Consumer Sweep for the enumerated list.

## Related areas

- `@falcon` **language** (`messages.ts` keys are resolved by `TranslateService` — the two compose).
- `@falcon` **shared-types** (`node-scope.util` imports `FALCON_ROOT_NODE` from `globals`; `contact-group.mapper` imports `ContactGroup*` DTOs/VMs + `CONTACT_GROUP_STATUS_LABELS`).
- `@falcon` **shared-ui** `falcon-ip-address.directive.ts` (consumes `ip-utils`) + legacy `falcon-form-validate.directive.ts` (the sole reason the deprecated shim survives).
- `@falcon/sdk` — `provideFalconValidations` deliberately mirrors `provideFalconFacades` (`provide-falcon-validations.ts:1`); `FALCON_VALIDATIONS` mirrors `FALCON_AUTH`/`FALCON_THEME` (`falcon-validation.token.ts:2`).

## Ownership / responsibility

`libs/falcon` (`@falcon`). The registry's business contract is owned jointly with the validation SoT (`Validations.xlsx`) — comments are the audit trail tying each rule to the sheet + the PRD rule it supersedes.

## Verification
🟢 CODE-VERIFIED 2026-06-03 (L03 sweep). All 12 source files read in full; barrel + `@falcon` re-export confirmed; consumer counts grep'd; xlsx-SoT lineage + deprecation status + provider-wiring (admin/mgmt only, not host) verified against source.
