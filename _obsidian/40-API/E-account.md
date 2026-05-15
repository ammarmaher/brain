*** Entity Reconciliation E-account — Account (Client) ***
*** PRD: PRD-01 Account Management · Backend service: Commerce · 2026-05-15 ***

# E-account — Account

> The Falcon "Client" entity. Lives on a Main node in the hierarchy and is the legal/business container for users, wallets, contracts, comm-channel + app configurations, and account-level settings. Owned by [[Commerce Service]] (`Falcon.Commerce.Domain.Entities.Account`).

## PRD definition (business-conceptual)

- **PRD module:** [[01 Account Management]]
- **Source:** [ENTITIES.md](../../../Brain%20Outputs/prd/modules/01-account-management/ENTITIES.md)
- **PRD fields** (per `ENTITIES.md` Account row + AccountOfficialData embedded):
  - `id`: identifier — surrogate key
  - `nodeId`: identifier — 1:1 link to Main Node
  - `accountName`: string `<=30`, unique across Falcon, must start with a letter, mandatory
  - `accountId`: identifier — auto-generated business id (distinct from `id`)
  - `financeId`: string — accounting/ERP integration id
  - `classificationCategory`: enum `VIP | Critical | Normal` (BR-AM-06)
  - `classificationSubCategory`: enum `Bank | Gov | SemiGov | Large | Medium | SME` (BR-AM-07)
  - `profilePicture`: optional binary/url
  - `officialData`: embedded `AccountOfficialData` — `entityName, authorityLetterType, sector, authorityLetterId, country, city, district, street, buildingNumber, postalCode, additionalAddress, anotherId, vatRegistrationNumber`

## Backend DTO mapping (concrete request/response shapes)

- **Service:** [[Commerce Service]]
- **DTO source:** [DTO_DICTIONARY.md](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md)
- **Validations source:** [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md)
- **Relevant DTOs:**
  - `CreateAccountRequest` — 5-step Add Client wizard input (top-level: `Info, Settings, CommChannels?, Applications?, AccountOwner, eDeliveryMethod DeliveryMethod`)
  - `CreateAccountRequest.Info` — embedded ~20-field block carrying account-name + classification + AccountOfficialData fields
  - `CreateAccountResponse` — returned by `POST /Node/create-account`; built via custom `request.ToResponse(result.Id)` mapper
  - `UpdateMainNodeInfoRequest` — `PUT /Information`; permissive (no `[ThrowIfNotPassed]`) — handler does business validation
  - `GetMainNodeInfoResponse` — `GET /Information`; mirror of `Info` request
  - `GetAccountHierarchyResponse` — gateway aggregation; carries `AccountId, AccountName, AccountIcon, TenantId, eCurrency Currency, eWalletBalanceType WalletBalanceType, eWalletBaseType WalletType, bool CanSave, List<CommChannels>, AccountHierarchyNodeResponse Hierarchy`

## Field reconciliation

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `id` | `CreateAccountResponse` returns id (via `ToResponse(result.Id)`) · `GetAccountHierarchyResponse.AccountId` | identifier → identifier | ✅ match |
| `nodeId` | implicit — Account is created bound to Main Node by handler; node id surfaces via `AccountHierarchyNodeResponse.NodeId` | identifier → identifier | ✅ match |
| `accountName` | `CreateAccountRequest.Info.AccountName` · `GetAccountHierarchyResponse.AccountName` | string `<=30`, letter-prefix, unique → `string` with `[ThrowIfNotPassed][ThrowIfMaxLengthExceed(30)]` | ⚠ DRIFT — backend enforces 30-char cap + required but **no documented regex for letter-prefix rule**. Uniqueness handled at handler / Zitadel via `DuplicateTenantName` (409). See [[V-account-name-format-uniqueness]]. |
| `accountId` (auto business id) | _not surfaced as a distinct field_ — backend exposes `Id` only on responses | identifier → identifier | ⚠ DRIFT — PRD distinguishes `id` from `accountId`; backend collapses both into `Id` / `AccountId` (single field). Unclear which one the PRD's "business id" maps to. |
| `financeId` | _not surfaced in DTO_DICTIONARY scan_ — likely inside `Info` (handler/mapper) but not in the DTO field listing | string → not documented | ❌ MISSING on backend (documentation gap, may exist as undocumented Info field) |
| `classificationCategory` | `CreateAccountRequest.Info.ClassificationCategory` | enum `VIP/Critical/Normal` → `[ThrowIfNotEnumValue<eClassificationCategory>]` | ✅ match |
| `classificationSubCategory` | `CreateAccountRequest.Info.ClassificationSubCategory` | enum 6-value → `[ThrowIfNotEnumValue<eClassificationSubCategory>]` | ✅ match |
| `profilePicture` | `AccountOwner.AccountOwnerProfilePictureInfo` (note: account-owner picture, not account picture) · `GetAccountHierarchyResponse.AccountIcon` | binary/url → DTO carries an icon string on response | ⚠ DRIFT — PRD talks about an Account-level profile picture; backend only documents an `AccountIcon` on the hierarchy response (read-side) and a profile-picture-info on the AccountOwner (write-side). No clear write path for an Account-level photo. |
| `officialData.entityName` | `Info.EntityName` (implicit — part of `Info`'s "~20 fields incl. address") | string → string (not individually documented in DTO_DICTIONARY) | ⚠ DRIFT — backend DTO has the field per scan summary, but `DTO_DICTIONARY.md` does not enumerate individual `Info` fields. Documentation gap. |
| `officialData.authorityLetterType` | `Info.AuthorityLetterType` | enum `Government/Commercial/Charity` → `[ThrowIfNotEnumValue<eAuthorityLetterType>]` | ✅ match |
| `officialData.sector` | `Info.Sector` (implicit) | string/enum → not individually documented | ⚠ DRIFT — same documentation gap. |
| `officialData.authorityLetterId` · `country` · `city` · `district` · `street` · `buildingNumber` · `postalCode` · `additionalAddress` · `anotherId` · `vatRegistrationNumber` | implicit on `CreateAccountRequest.Info` ("~20 fields incl. address") | strings → not individually documented | ⚠ DRIFT — all part of `Info` per DTO summary, but `DTO_DICTIONARY.md` does not enumerate each Info field. Per-field validation surface unknown. |
| _(none)_ | `CreateAccountRequest.Settings`, `CommChannels?`, `Applications?`, `AccountOwner`, `DeliveryMethod` | n/a → multiple | ➕ Backend bundles account-create with settings + service catalog + Account Owner user-create + OTP delivery method in one call. Per PRD these are separate entities ([[E-account-settings]], [[E-comm-channel-config]], [[E-app-config]], [[E-user]]) created at wizard Steps 2-5 — backend exposes a single composite request. |
| _(none)_ | `GetAccountHierarchyResponse.TenantId` | n/a → opaque Zitadel tenant id | ➕ Backend exposes Zitadel tenant binding; PRD does not enumerate this. |
| _(none)_ | `GetAccountHierarchyResponse.Currency` · `WalletBalanceType` · `WalletType` · `CanSave` | n/a → enums + bool | ➕ Backend hierarchy response carries currency + wallet topology + edit-capability flag for the FE; PRD covers these in separate entities ([[E-account-settings]] + Wallet entities not in this batch). |

## Drift / gaps summary

- **Drift items:**
  - `accountName` letter-prefix rule has no documented backend regex (handler-level or unenforced)
  - `accountId` vs `id` — PRD distinguishes; backend collapses
  - `profilePicture` — PRD account-level vs backend account-owner-level + read-side `AccountIcon` mismatch
  - All `AccountOfficialData` fields — backend has them inside `Info` per summary but individual fields not documented in DTO_DICTIONARY
- **Missing on backend (or backend documentation):**
  - `financeId` — not enumerated in DTO_DICTIONARY
  - Per-field address breakdown (`country, city, district, street, buildingNumber, postalCode, additionalAddress, anotherId, vatRegistrationNumber`) — not individually documented
- **Extra on backend (platform-level / composite):**
  - `CreateAccountRequest` bundles `Settings` + `CommChannels` + `Applications` + `AccountOwner` + `DeliveryMethod` (the entire 5-step wizard in one request)
  - `TenantId` (Zitadel binding)
  - `Currency`, `WalletBalanceType`, `WalletType`, `CanSave` on hierarchy response

## Related validation rules (V-rule notes)

- [[V-account-name-format-uniqueness]] — `AccountName` 30-char cap + uniqueness (notes the same letter-prefix drift)
- [[V-password-security-level-enum]] — adjacent rule on `Settings.PasswordSecurityLevel` from the same request
- [[V-account-limits-zero-means-no-limit]] — adjacent rule on `Settings` fields
- _no V-rule yet for `financeId` or `AccountOfficialData` per-field validations — candidates for future Phase 2C extension_

## Pages using this entity

- [[Organization Hierarchy]] — primary page (Account context loaded everywhere; Account Info panel · CommChannels & Services · Apps & Services · Settings · Account Limitations)
- Add Client wizard (5 steps) — page not yet seeded under `10-Pages/`

## Cross-service touches

- [[Identity Service]] — consumes Account at Step 5 of the wizard to create the Account-Owner user (`AccountOwner` block of `CreateAccountRequest` flows to Identity)
- [[Charging Service]] — Account is the owner of `Wallet × N` records (out-of-scope batch — different specialist)
- [[Core Gateway Service]] — IP-allowlist cache keyed by account/tenant id
- Kafka — Commerce produces `UserCreationRequested`, `WalletConfigured`, `ServiceOrderCreated` events that downstream services pick up after account create

## Hubs

- [[API_INDEX]] · [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
