*** Add Client — Step 1 Basic Info ***
*** SoT for implementation · Page: Organization Hierarchy · 2026-05-15 ***
*** Part of: Brain Outputs/understanding/pages/organization-hierarchy/Add Client/ ***

# Step 1 — Account Information (mandatory)

**Source-of-truth references**
- PRD: BUSINESS_RULES `BR-AM-03` → `BR-AM-08` (account-name format, account id auto, finance id, classification category/sub, authority letter type).
- PRD: WORKFLOWS §W1 step 1 (`latest-prd.md:33-40`).
- PRD: ENTITIES `Account` + `AccountOfficialData` rows.
- Backend: `CreateAccountRequest.Info` (nested type ~20 fields).
- Backend validations: `[ThrowIfNotPassed]`, `[ThrowIfMaxLengthExceed(30)]`, `[ThrowIfNotEnumValue<…>]`.

**Screen / section**
- Wizard step 1 panel.
- Form layout: 2-column responsive Tailwind grid (per page rules in [../UI_UX_RULES.md](../UI_UX_RULES.md)) — labels above inputs, RTL-aware spacing.

## Fields (every single one — no shortcuts)

| # | Field | Type / UI | PRD rule | Backend DTO field | V-rule | Frontend validator (Angular) | E-* drift |
|---|---|---|---|---|---|---|---|
| 1 | Account Name | text input ([[Falcon Input]]) max 30 | BR-AM-03: unique across Falcon, ≤30, starts with letter, mandatory | `Info.AccountName` `[ThrowIfNotPassed][ThrowIfMaxLengthExceed(30)]` | [[V-account-name-format-uniqueness]] | `Validators.required` + `Validators.maxLength(30)` + `Validators.pattern(/^[A-Za-z]/)` + async uniqueness check against `GET /api/Node/ValidateAccountName?AccountName=` → returns `bool`. Debounce 300 ms. Map a `true` (exists) to a custom `accountNameTaken` validator error. | ⚠ DRIFT — backend missing documented letter-prefix regex (only handler-level). FE must enforce. See E-account row `accountName`. |
| 2 | Account ID | display-only ([[Falcon Input]] disabled) | BR-AM-04: auto-generated, mandatory | Not set on request — returned in `CreateAccountResponse` (built via `request.ToResponse(result.Id)`) | — | Read-only field with placeholder "Auto-generated" until Submit | ⚠ DRIFT — PRD distinguishes `id` (technical) from `accountId` (business); backend collapses both. |
| 3 | Finance ID | text input ([[Falcon Input]]) | BR-AM-05: sourced from Finance team, mandatory | `Info.FinanceId` (per `Info` nested ~20 fields — verify in `DTO_DICTIONARY.md`) | — | `Validators.required`. No format constraint in PRD (opaque string). Q-AM-06 open: source (manual entry vs Finance system pull). | ❌ MISSING from `DTO_DICTIONARY.md` enumeration; presence inferred from PRD + `Info` summary. Documentation gap (E-account row `financeId`). |
| 4 | Classification Category | dropdown ([[Falcon Dropdown]]) — VIP / Critical / Normal | BR-AM-06: optional, 3-value enum | `Info.ClassificationCategory` `[ThrowIfNotEnumValue<eClassificationCategory>]` | — | Optional. Enum-membership validator wired to shared TS `eClassificationCategory` enum (`@falcon/sdk`). Dropdown options sourced from the same enum (single source of truth — never hand-list options). | — |
| 5 | Classification Sub-Category | dropdown ([[Falcon Dropdown]]) — Bank / Gov / SemiGov / Large / Medium / SME | BR-AM-07: optional, 6-value enum | `Info.ClassificationSubCategory` `[ThrowIfNotEnumValue<eClassificationSubCategory>]` | — | Optional. Enum-membership validator. Conditional UX: Sub-Category should be hidden when Category is empty (PRD does not require this, but it improves UX). | — |
| 6 | Profile Picture | uploader ([[Falcon Single Uploader]] or [[Falcon Uploader (generic)]]) | PRD: optional account profile pic per WORKFLOWS §W1 step 1 | `Info.ProfilePictureInfo?` (nested `{ Extension, FileBase64String }`) | — | Optional. Accept jpg/png/webp/jpeg/gif/bmp/x-icon (per Commerce `Image Constraints`). Max 1024 KB. Use built-in size + extension validator on the uploader. On reject → `ProfilePictureSizeExceeded` (400) / `ImageExtensionNotAllowed` (400) / `ExecutableFileNotAllowed` (400). | ⚠ DRIFT — PRD account-level picture vs backend exposes `AccountIcon` only on read response; write-side picture path needs handler verification. |
| 7 | Authority Letter Type | dropdown ([[Falcon Dropdown]]) — Government / Commercial / Charity | BR-AM-08: 3-value enum; each value has two linked fields (Sector + ID) | `Info.AuthorityLetterType` `[ThrowIfNotEnumValue<eAuthorityLetterType>]` | — | `Validators.required` (Official Data block mandatory). Enum-membership validator. Reactive form: when value changes, dynamically populate the `Sector` dropdown options and the `AuthorityLetterId` label. | — |
| 8 | Sector | dropdown ([[Falcon Dropdown]]) — depends on Authority Letter Type | BR-AM-08: linked to Authority Letter Type | `Info.Sector` (string per `Info` summary; sector dictionary not enumerated in DTO_DICTIONARY) | — | Required when AuthorityLetterType selected. Options sourced per `Authority Letter Type` value (PRD does not enumerate; assume backend-driven via `GET /api/Lookup/{id}` — verify lookup id). | ⚠ DRIFT — sector enum not documented per `Info` field; lookup id not surfaced. Open gap. |
| 9 | Authority Letter ID | text input ([[Falcon Input]]) | BR-AM-08: linked to Authority Letter Type | `Info.AuthorityLetterId` (inferred from `Info` summary; not individually enumerated) | — | `Validators.required` when AuthorityLetterType selected. Per WORKFLOWS step 1: label and format hint should change with the selected type. PRD silent on per-type format. | ⚠ DRIFT — field not individually enumerated in DTO_DICTIONARY; per-type validation not documented. |
| 10 | Entity Name | text input ([[Falcon Input]]) | PRD ENTITIES `AccountOfficialData.entityName` | `Info.EntityName` (string per `Info` summary) | — | `Validators.required` (Official Data is mandatory). No PRD-stated length cap — apply `Validators.maxLength(100)` as a safe default; surface as open gap if backend rejects. | ⚠ DRIFT — per-field length cap not documented. |
| 11 | Country | dropdown ([[Falcon Dropdown]]) | PRD ENTITIES `AccountOfficialData.country` | `Info.CountryId` (string per `Info` summary) | — | Optional, but **`CountryRequiredWhenCityProvided`** (400) — cross-field: if City is filled, Country is mandatory. Implement via FormGroup-level validator. Options sourced via `GET /api/Lookup/{id}` (country lookup). | — |
| 12 | City | dropdown ([[Falcon Dropdown]]) | PRD ENTITIES `AccountOfficialData.city` | `Info.CityId` (string per `Info` summary) | — | Optional. Cross-field: **`CityRequiredWhenDistrictProvided`** (400) and **`CityRequiredWhenStreetProvided`** (400). If District or Street filled, City must be filled. Disabled until Country selected. | — |
| 13 | District | text input ([[Falcon Input]]) | PRD ENTITIES `AccountOfficialData.district` | `Info.District` (string per `Info` summary) | — | Optional. If filled, requires City (see error code `CityRequiredWhenDistrictProvided`). | — |
| 14 | Street | text input ([[Falcon Input]]) | PRD ENTITIES `AccountOfficialData.street` | `Info.Street` (string per `Info` summary) | — | Optional. If filled, requires City (see error code `CityRequiredWhenStreetProvided`). | — |
| 15 | Building Number | text input ([[Falcon Input]]) | PRD ENTITIES `AccountOfficialData.buildingNumber` | `Info.BuildingNumber` (string per `Info` summary) | — | Optional. No PRD cross-field rule documented. | — |
| 16 | Postal Code | text input ([[Falcon Input]]) | PRD ENTITIES `AccountOfficialData.postalCode` | `Info.PostalCode` (string per `Info` summary) | — | Optional. No PRD format rule documented (numeric expected; FE: `Validators.pattern(/^\d+$/)` as a safe default). | — |
| 17 | Additional Address | text input or [[Falcon Textarea]] | PRD ENTITIES `AccountOfficialData.additionalAddress` | `Info.AdditionalAddress` (string per `Info` summary) | — | Optional free-text. `Validators.maxLength(250)` as safe default. | — |
| 18 | Another ID | text input ([[Falcon Input]]) | PRD ENTITIES `AccountOfficialData.anotherId` | `Info.AnotherId` (string per `Info` summary) | — | Optional. PRD silent on format/uniqueness. | — |
| 19 | VAT Registration Number | text input ([[Falcon Input]]) | PRD ENTITIES `AccountOfficialData.vatRegistrationNumber` | `Info.VatRegistrationNumber` (string per `Info` summary) | — | Optional. PRD silent on format (typically 15-digit Saudi VAT). FE: `Validators.pattern(/^\d{15}$/)` as a safe default; surface if backend rejects. | — |
| 20 | Budget Number | text input ([[Falcon Input]]) | Inferred from Commerce error `BudgetNoRequired` (400) — see Errors below | `Info.BudgetNo` (inferred string per `Info` summary) | — | Conditional: required when handler logic demands it (likely tied to Authority Letter Type = Government or Charity — PRD silent). | ⚠ DRIFT — error code surfaces in Commerce ERRORS catalog but no PRD line documents this rule explicitly. |

## Step 1 cross-field validation contract

- `CountryRequiredWhenCityProvided` (400)
- `CityRequiredWhenDistrictProvided` (400)
- `CityRequiredWhenStreetProvided` (400)
- `OfficialDataRequired` (400) — at least Entity Name + Authority Letter block must be present (handler-level)
- `MainNodeAccountInfoRequired` (400) — `Info` block itself must be present

Implement these at the Angular FormGroup level via custom cross-field validators that map error keys to the same display strings as the backend would return (use the localized `errorMessages` from `ServiceOperationResult<T>` on actual submit; do not parse codes — see [FRONTEND_CONTRACT.md](../../../backend/commerce/FRONTEND_CONTRACT.md)).

## Backend call on Next

- None. Step 1 data is buffered locally in the wizard state container. Async uniqueness check on Account Name is the only backend call during this step (debounced).

## Permission gate (per step)

- Same as overall flow (Falcon System Admin + Product). See [01-PERMISSIONS](01-PERMISSIONS.md).

## See also (Add Client folder)

- [README](README.md) — folder index
- [00-OVERVIEW](00-OVERVIEW.md)
- [01-PERMISSIONS](01-PERMISSIONS.md)
- [03-STEP_2_SETTINGS](03-STEP_2_SETTINGS.md)
- [04-STEP_3_COMM_CHANNELS](04-STEP_3_COMM_CHANNELS.md)
- [05-STEP_4_APPS_SERVICES](05-STEP_4_APPS_SERVICES.md)
- [06-STEP_5_ACCOUNT_OWNER](06-STEP_5_ACCOUNT_OWNER.md)
- [07-VALIDATIONS](07-VALIDATIONS.md)
- [08-BACKEND_API](08-BACKEND_API.md)
- [09-COMPONENTS](09-COMPONENTS.md)
- [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
- [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
- [12-ERROR_STATES](12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](PLAYBOOK.md) — full single-doc version

## Hubs

- [[Organization Hierarchy]] · [[01 Account Management]] · [[Commerce Service]] · [[V-account-name-format-uniqueness]] · [[Falcon Input]] · [[Falcon Dropdown]] · [[Falcon Single Uploader]] · [[Falcon Textarea]] · [[E-account]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[COMPONENT_INDEX]] · [[AMMAR_BRAIN_HOME]]
