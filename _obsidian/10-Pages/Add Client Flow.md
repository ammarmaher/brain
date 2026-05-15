---
type: flow
flow-name: Add Client
page-slug: organization-hierarchy
prd: PRD-01
form: folder
created: 2026-05-15
---
*** Flow Playbook — Add Client (5-step wizard) ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\understanding\pages\organization-hierarchy\Add Client\ (folder, 17 files) ***
*** Page: Organization Hierarchy · PRD: PRD-01 Account Management · 2026-05-15 ***

# Add Client — implementation playbook

> Authoritative spec for the **Add Client** wizard on the Organization Hierarchy page. **Brain Outputs is the source of truth.** This vault note is the graph node that links the SoT folder to the rest of the typed knowledge graph (page · entities · V-rules · components · services).
>
> **The SoT is now a folder, not a single file.** Load `README.md` first; then drill into the section file matching your task. The original 62 KB single-doc playbook is preserved at `PLAYBOOK.md` inside the same folder.
>
> Scope: this playbook covers Add Client only. Sister flows — Add User, Add Node, Edit Node — still live as single files in the `flows/` directory under Brain Outputs and are owned by separate specialists.

## Source-of-truth pointers

- **[SoT folder entry — README](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/README.md)** — folder index + per-task load order
- [00-OVERVIEW](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/00-OVERVIEW.md) · [01-PERMISSIONS](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/01-PERMISSIONS.md) · [02-STEP_1_BASIC_INFO](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/02-STEP_1_BASIC_INFO.md) · [03-STEP_2_SETTINGS](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/03-STEP_2_SETTINGS.md) · [04-STEP_3_COMM_CHANNELS](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/04-STEP_3_COMM_CHANNELS.md) · [05-STEP_4_APPS_SERVICES](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/05-STEP_4_APPS_SERVICES.md) · [06-STEP_5_ACCOUNT_OWNER](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/06-STEP_5_ACCOUNT_OWNER.md) · [07-VALIDATIONS](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/07-VALIDATIONS.md) · [08-BACKEND_API](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/08-BACKEND_API.md) · [09-COMPONENTS](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/09-COMPONENTS.md) · [10-KAFKA_SIDE_EFFECTS](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/10-KAFKA_SIDE_EFFECTS.md) · [11-STATE_TRANSITIONS](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/11-STATE_TRANSITIONS.md) · [12-ERROR_STATES](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/12-ERROR_STATES.md) · [13-GAPS_AND_DRIFTS](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/13-GAPS_AND_DRIFTS.md) · [14-IMPLEMENTATION_CHECKLIST](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK (full single-doc copy)](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/Add%20Client/PLAYBOOK.md)
- [Legacy single-file SoT (now a redirect)](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/flows/Add%20Client.md) — superseded by the folder above; kept as a redirect for backwards compatibility
- [PRD-01 OVERVIEW](../../../Brain%20Outputs/prd/modules/01-account-management/OVERVIEW.md)
- [PRD-01 BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/01-account-management/BUSINESS_RULES.md)
- [PRD-01 WORKFLOWS (W1)](../../../Brain%20Outputs/prd/modules/01-account-management/WORKFLOWS.md)
- [PRD-01 ENTITIES](../../../Brain%20Outputs/prd/modules/01-account-management/ENTITIES.md)
- [PRD-01 GAPS](../../../Brain%20Outputs/prd/modules/01-account-management/GAPS.md)
- [PRD-01 QUESTIONS](../../../Brain%20Outputs/prd/modules/01-account-management/QUESTIONS.md)
- [PRD-02 WORKFLOWS (Add User — Step 5 trigger)](../../../Brain%20Outputs/prd/modules/02-user-management/WORKFLOWS.md)
- [PRD-02 ENTITIES](../../../Brain%20Outputs/prd/modules/02-user-management/ENTITIES.md)
- [Commerce SERVICE_OVERVIEW](../../../Brain%20Outputs/understanding/backend/commerce/SERVICE_OVERVIEW.md)
- [Commerce ENDPOINT_REGISTRY](../../../Brain%20Outputs/understanding/backend/commerce/ENDPOINT_REGISTRY.md)
- [Commerce DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md)
- [Commerce VALIDATIONS](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md)
- [Commerce ERRORS](../../../Brain%20Outputs/understanding/backend/commerce/ERRORS.md)
- [Commerce FRONTEND_CONTRACT](../../../Brain%20Outputs/understanding/backend/commerce/FRONTEND_CONTRACT.md)
- [NodeController drill-down](../../../Brain%20Outputs/understanding/backend/commerce/controllers/NodeController/)
- [Identity SERVICE_OVERVIEW](../../../Brain%20Outputs/understanding/backend/identity/SERVICE_OVERVIEW.md)
- [Charging SERVICE_OVERVIEW](../../../Brain%20Outputs/understanding/backend/charging/SERVICE_OVERVIEW.md)
- Page node: [[Organization Hierarchy]]
- Existing page knowledge: [PAGE_OVERVIEW](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/PAGE_OVERVIEW.md) · [COMPONENT_MAPPING](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/COMPONENT_MAPPING.md) · [VALIDATION_RULES](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/VALIDATION_RULES.md)

## Trigger / entry point

- **Page:** [[Organization Hierarchy]] (`apps/admin-console/.../organization-hierarchy-page` — System Gateway-backed admin view).
- **Action button:** "Add Client" (right-pane primary action — visible only to Falcon System Administrator + Product roles; hidden via PES for Operation and all Client-side roles).
- **Modal / drawer shell:** the wizard opens in a [[Falcon Wizard]] dialog (modern target) or [[Falcon Stepper Legacy]] (current consumer) — see Component Mapping.
- **Precondition:** authenticated Falcon admin · IP on tenant allowlist (per [[V-account-ip-allowlist-enforcement]]) · System Gateway routes the call.

## Permission matrix (who can run this flow)

Authority: `Permission list - Jawad` (PRD-01 BR-AM-02).

| Role | Can run? | Source |
|---|---|---|
| Falcon System Administrator | YES | PRD-01 OVERVIEW (Actors) + BR-AM-02 |
| Falcon Product | YES | PRD-01 OVERVIEW (Actors) + BR-AM-02 |
| Falcon Operation | NO (explicit Not Allow) | PRD-01 OVERVIEW — "Operation cannot add clients" |
| Client Account Owner | NO | Client-side, own hierarchy only |
| Client Node Admin | NO | Cannot add clients |
| Client Normal User | NO | Transactional only |

Cross-link: [[Falcon Roles Permission Matrix]]. PES policy gate at the System Gateway must mirror this matrix (Q-AM-16 tracks sheet ↔ PES sync drift).

## Overview — 5 steps

1. **Step 1 — Account Information** (mandatory) — Account Name + classification + Profile Picture + Official Data (Authority Letter + address + VAT + Finance ID).
2. **Step 2 — Account Settings** (mandatory) — Password Security Level + Allowed IPs + 4 Account Limits.
3. **Step 3 — Configuring CommChannels & Services** (optional) — per-channel `Visibility` + `PricingType` + `PriceValue`.
4. **Step 4 — Configuring Applications & Services** (optional) — same shape as Step 3 for Apps.
5. **Step 5 — Creating Account Owner user** (mandatory) — Personal Info + Role + Delivery Method; triggers Identity user creation.

**Wizard navigation:** Next · Previous · Save Draft (FE-local) · Submit (Step 5 only). All five steps are buffered client-side and submitted as **one composite `CreateAccountRequest`** to Commerce `POST /api/Node/create-account` at the end of Step 5.

## Step-by-step

### Step 1 — Account Information (mandatory)

**Sources:** PRD BR-AM-03 → BR-AM-08; WORKFLOWS §W1 step 1; ENTITIES `Account` + `AccountOfficialData`; Commerce `CreateAccountRequest.Info`. Entity reconciliation: [[E-account]].

**Layout:** Wizard step 1 panel — 2-column responsive Tailwind grid (per page rules).

| # | Field | Type / UI | PRD rule | Backend DTO field | V-rule | Frontend validator | Drift |
|---|---|---|---|---|---|---|---|
| 1 | Account Name | [[Falcon Input]] (text, max 30) | BR-AM-03: unique across Falcon, ≤30, starts with letter, mandatory | `Info.AccountName` `[ThrowIfNotPassed][ThrowIfMaxLengthExceed(30)]` | [[V-account-name-format-uniqueness]] | `Validators.required` + `maxLength(30)` + `pattern(/^[A-Za-z]/)` + async via `GET /api/Node/ValidateAccountName?AccountName=` (debounce 300 ms) | ⚠ Backend missing letter-prefix regex |
| 2 | Account ID | [[Falcon Input]] disabled | BR-AM-04: auto-generated, mandatory | Set server-side; returned in `CreateAccountResponse` | — | Read-only — placeholder "Auto-generated" | ⚠ PRD `accountId` vs backend `Id` collapsed |
| 3 | Finance ID | [[Falcon Input]] | BR-AM-05: from Finance team, mandatory | `Info.FinanceId` (inferred; not in DTO_DICTIONARY field list) | — | `Validators.required`. Q-AM-06 open (manual vs Finance pull). | ❌ Documentation gap |
| 4 | Classification Category | [[Falcon Dropdown]] — VIP / Critical / Normal | BR-AM-06: optional enum 3-value | `Info.ClassificationCategory` `[ThrowIfNotEnumValue<eClassificationCategory>]` | — | Optional. Enum-membership validator from shared `eClassificationCategory`. | — |
| 5 | Classification Sub-Category | [[Falcon Dropdown]] — Bank / Gov / SemiGov / Large / Medium / SME | BR-AM-07: optional enum 6-value | `Info.ClassificationSubCategory` `[ThrowIfNotEnumValue<eClassificationSubCategory>]` | — | Optional. Hide when Category empty (UX). | — |
| 6 | Profile Picture | [[Falcon Single Uploader]] / [[Falcon Uploader (generic)]] | PRD W1 step 1: optional | `Info.ProfilePictureInfo?` `{ Extension, FileBase64String }` | — | Optional. Max 1024 KB. Accept jpg/png/webp/jpeg/gif/bmp/x-icon. Errors: `ProfilePictureSizeExceeded`/`ImageExtensionNotAllowed`/`ExecutableFileNotAllowed` (400). | ⚠ Account-level picture write path unclear |
| 7 | Authority Letter Type | [[Falcon Dropdown]] — Government / Commercial / Charity | BR-AM-08: enum 3-value with linked Sector + ID | `Info.AuthorityLetterType` `[ThrowIfNotEnumValue<eAuthorityLetterType>]` | — | `Validators.required` (Official Data mandatory). Drives Sector options + Authority Letter ID label. | — |
| 8 | Sector | [[Falcon Dropdown]] | BR-AM-08: linked to Authority Letter Type | `Info.Sector` (inferred) | — | Required when AuthorityLetterType selected. Source via `GET /api/Lookup/{id}` (verify lookup id). | ⚠ Sector enum + lookup id not documented |
| 9 | Authority Letter ID | [[Falcon Input]] | BR-AM-08: linked to Authority Letter Type | `Info.AuthorityLetterId` (inferred) | — | `Validators.required` when AuthorityLetterType selected. Per-type format silent in PRD. | ⚠ Per-type validation not documented |
| 10 | Entity Name | [[Falcon Input]] | PRD ENTITIES `AccountOfficialData.entityName` | `Info.EntityName` (inferred) | — | `Validators.required` (Official Data mandatory). `maxLength(100)` safe default. | ⚠ Length cap undocumented |
| 11 | Country | [[Falcon Dropdown]] | PRD ENTITIES `AccountOfficialData.country` | `Info.CountryId` (inferred) | — | Optional but **required when City set** (backend `CountryRequiredWhenCityProvided` 400). | — |
| 12 | City | [[Falcon Dropdown]] | PRD ENTITIES `AccountOfficialData.city` | `Info.CityId` (inferred) | — | Required if District/Street set (`CityRequiredWhenDistrictProvided`/`CityRequiredWhenStreetProvided` 400). Disabled until Country selected. | — |
| 13 | District | [[Falcon Input]] | PRD ENTITIES `AccountOfficialData.district` | `Info.District` (inferred) | — | Optional. If filled → City required. | — |
| 14 | Street | [[Falcon Input]] | PRD ENTITIES `AccountOfficialData.street` | `Info.Street` (inferred) | — | Optional. If filled → City required. | — |
| 15 | Building Number | [[Falcon Input]] | PRD ENTITIES `AccountOfficialData.buildingNumber` | `Info.BuildingNumber` (inferred) | — | Optional. | — |
| 16 | Postal Code | [[Falcon Input]] | PRD ENTITIES `AccountOfficialData.postalCode` | `Info.PostalCode` (inferred) | — | Optional. `pattern(/^\d+$/)` safe default. | — |
| 17 | Additional Address | [[Falcon Textarea]] | PRD ENTITIES `AccountOfficialData.additionalAddress` | `Info.AdditionalAddress` (inferred) | — | Optional free-text. `maxLength(250)` safe default. | — |
| 18 | Another ID | [[Falcon Input]] | PRD ENTITIES `AccountOfficialData.anotherId` | `Info.AnotherId` (inferred) | — | Optional. PRD silent on format. | — |
| 19 | VAT Registration Number | [[Falcon Input]] | PRD ENTITIES `AccountOfficialData.vatRegistrationNumber` | `Info.VatRegistrationNumber` (inferred) | — | Optional. `pattern(/^\d{15}$/)` (Saudi VAT 15-digit) as safe default. | — |
| 20 | Budget Number | [[Falcon Input]] | Inferred from Commerce error `BudgetNoRequired` (400) | `Info.BudgetNo` (inferred) | — | Conditional — required when handler logic demands (likely Authority Letter Type = Government/Charity). | ⚠ No PRD line documents this rule |

**Step 1 cross-field rules:** `CountryRequiredWhenCityProvided` · `CityRequiredWhenDistrictProvided` · `CityRequiredWhenStreetProvided` · `OfficialDataRequired` · `MainNodeAccountInfoRequired` (all 400).

**Backend call on Next:** None (data buffered; async Account Name uniqueness only).

---

### Step 2 — Account Settings (mandatory)

**Sources:** PRD BR-AM-09 → BR-AM-13; WORKFLOWS §W1 step 2; ENTITIES `AccountSettings`; Commerce `CreateAccountRequest.Settings` (nested `SettingsInfo`). Entity reconciliation: [[E-account-settings]] — **PasswordSecurityLevel enum vocabulary drift (Q-UM-12 HIGH)**.

| # | Field | Type / UI | PRD rule | Backend DTO field | V-rule | Frontend validator | Drift |
|---|---|---|---|---|---|---|---|
| 1 | Password Security Level | [[Falcon Dropdown]] — Normal / Advanced | BR-AM-09: enum 2-value, mandatory | `Settings.PasswordSecurityLevel` `[ThrowIfNotPassed, ThrowIfNotEnumValue<ePasswordSecurityLevel>]` | [[V-password-security-level-enum]] | `Validators.required` + enum-membership. **Submit backend codes (Low/Medium/High/Strict); display PRD labels (Normal/Advanced)** until Q-UM-12 resolves. | ⚠ HIGH — Q-UM-12 |
| 2 | Allowed IPs | editable string list ([[Falcon Input]] rows with add/remove) | BR-AM-10: gateway enforces via HTTP header | `Settings.AllowedIPs[]` (List<string>) | [[V-account-ip-allowlist-enforcement]] | Optional. Per row: `pattern(/^\d{1,3}(\.\d{1,3}){3}(\/\d{1,2})?$/)` IPv4+CIDR. Backend `InvalidIpAddress` (403) on malformed. | ⚠ `Enabled` toggle extra on backend (PRD silent) |
| 3 | Max Normal User Limit | [[Falcon Input Number]] | BR-AM-11/12: int, 0=no limit, empty not allowed, default 0 | `Settings.MaxNormalUserLimit` (int) | [[V-account-limits-zero-means-no-limit]] · [[V-normal-user-limit-enforcement]] | `required` + `min(0)` + `pattern(/^\d+$/)` + default `0`. UI: `0 → "No limit" pill`. | — |
| 4 | Max System User Limit | [[Falcon Input Number]] | BR-AM-11/12 | `Settings.MaxSystemUserLimit` (int) | [[V-account-limits-zero-means-no-limit]] | Same as Max Normal User. **Q-AM-12 open — what is a "System User"?** | ⚠ Q-AM-12 |
| 5 | Max Node Levels | [[Falcon Input Number]] | BR-AM-11 | `Settings.MaxNodeLevel` (int — singular) | [[V-account-limits-zero-means-no-limit]] | Same. Runtime breach: `MaxNodeLevelReached` (422). | ⚠ COSMETIC — PRD plural vs backend singular |
| 6 | Balance Transfer Limit (%) | [[Falcon Input Number]] with `%` suffix | BR-AM-11/34: int %, 0=no limit, default 0, Master Wallet exempt | `Settings.BalanceTransferLimit` (decimal) | [[V-account-limits-zero-means-no-limit]] | Same. Accept decimals. **Q-AM-07 open — % baseline?** | ⚠ Unit-hint dropped on backend name |

**Step 2 cross-field:** `MainAccountSettingsRequired` (400); `InvalidAccountLimits` (422) handler-level.

**Backend call on Next:** None.

**Open questions:** Q-UM-12 (HIGH password vocabulary), Q-AM-07 (transfer % baseline), Q-AM-12 (System User definition), Q-AM-13 (IP header name), BR-AM-39 (limit-edit enforcement — post-create only).

---

### Step 3 — CommChannels & Services (OPTIONAL)

**Sources:** PRD BR-AM-14 → BR-AM-18; WORKFLOWS §W1 step 3; ENTITIES `CommChannelConfig`; Commerce `CreateAccountRequest.CommChannels { List<Service> Services }`. Entity reconciliation: [[E-comm-channel-config]].

**Layout:** [[Falcon Data Table]] — one row per CommChannel from master `GET /api/CommunicationChannel` returning `List<CommunicationChannelResponse> { id, name (MultiLanguage), icon }`.

| Field | Type / UI | PRD rule | Backend DTO | V-rule | Frontend validator | Drift |
|---|---|---|---|---|---|---|
| CommChannel Name | display ([[Falcon Tag]] + [[Falcon Icon]]) | Master catalog | `CommunicationChannelResponse.Name` (MultiLanguage) + `Icon` | — | Read-only with i18n locale | — |
| Visibility | [[Falcon Toggle]] — default OFF (Hide) | BR-AM-14: default Hide | Sparse list inclusion — channels omitted = `Hide` server-side | [[V-service-visibility-pricing-required]] | Initial OFF. Toggling ON triggers conditional validators on Pricing Type + Price Value. | ⚠ enum→bool drift |
| Pricing Type | [[Falcon Dropdown]] — Monthly / Yearly / One Time Payment | BR-AM-16: enum 3-value | `Service.PriceType` `[ThrowIfNotEnumValue<ePricingType>]` | [[V-service-visibility-pricing-required]] | Conditional: required when Visibility=Show; cleared on Hide. Enum-membership. | — |
| Price Value | [[Falcon Input Number]] (SAR) | BR-AM-17: ≥ 0 SAR | (inferred — `Service` nested type; `DTO_DICTIONARY` only enumerates `AppId, PriceType`) | [[V-service-visibility-pricing-required]] | Conditional: required when Visibility=Show; `min(0)`; cleared on Hide. Errors: `PriceValueNotConfigured` (422), `InvalidPriceValue` (400). | ⚠ `Service` field list incomplete in docs |

**Step 3 central rule:** `HiddenProductMustNotHavePricing` (422) + `PriceValueNotConfigured` (422) + `PricingTypeNotConfigured` (422). Implement via reactive-form `valueChanges` switching validators on/off when Visibility toggles.

**Backend call on Next:** None (sparse list buffered).

**Status context (FE awareness, not editable here):** starts at `InActive (First time)` per BR-AM-20. Status 6-value enum **not exposed as single field** on response DTOs.

---

### Step 4 — Apps & Services (OPTIONAL)

**Sources:** PRD BR-AM-14 → BR-AM-18 ("same shape" as Step 3); WORKFLOWS §W1 step 4; ENTITIES `AppConfig`; Commerce `CreateAccountRequest.Applications`. Entity reconciliation: [[E-app-config]].

**Layout:** [[Falcon Data Table]] — one row per Application from master `GET /api/Application` returning `List<ApplicationResponse>`.

Mirror of Step 3, swapping CommChannel for Application:

| Field | Type / UI | Backend DTO | V-rule | Frontend validator |
|---|---|---|---|---|
| Application Name | [[Falcon Tag]] + [[Falcon Icon]] (MultiLanguage) | `ApplicationResponse.Name` + `Icon` | — | Read-only |
| Visibility | [[Falcon Toggle]] — default OFF | Sparse list inclusion in `Applications.Services` | [[V-service-visibility-pricing-required]] | Same wiring as Step 3 |
| Pricing Type | [[Falcon Dropdown]] — Monthly / Yearly / One Time Payment | `Service.PriceType` `[ThrowIfNotEnumValue<ePricingType>]` | [[V-service-visibility-pricing-required]] | Conditional on Visibility=Show |
| Price Value | [[Falcon Input Number]] (SAR) | (inferred — `Service` nested type) | [[V-service-visibility-pricing-required]] | Conditional, `min(0)` |

**Asymmetry note:** Commerce uses **mirror endpoints** for CommChannels + Apps with a shared `Service` nested type — `AppId` field is reused for both (intentional code reuse, confusing naming).

---

### Step 5 — Account Owner user (MANDATORY) — TRIGGERS COMPOSITE SUBMIT

**Sources:** PRD-01 BR-AM-19; PRD-01 WORKFLOWS §W1 step 5; PRD-02 WORKFLOWS §W1 (Add User); PRD-02 ENTITIES `User`; Commerce `CreateAccountRequest.AccountOwner` + top-level `DeliveryMethod`. Entity reconciliation: [[E-user]].

**Layout:** single-form 2-column responsive Tailwind grid. Final action: **Submit** (composite POST).

| # | Field | Type / UI | PRD rule | Backend DTO field | V-rule | Frontend validator | Drift |
|---|---|---|---|---|---|---|---|
| 1 | Profile Picture | [[Falcon Single Uploader]] | PRD-02 BR-UM-14: optional | `AccountOwner.AccountOwnerProfilePictureInfo?` | — | Optional. Same image constraints as Step 1. | — |
| 2 | First Name | [[Falcon Input]] | PRD-02 BR-UM-11: ≤50, letters only, mandatory | `AccountOwner.FirstName` `[ThrowIfNotPassed]` | [[V-user-first-last-name-letters-only]] | `required` + `maxLength(50)` + `pattern(/^[A-Za-z؀-ۿ]+$/)`. Errors: `FirstNameLettersOnly` (400). | ⚠ Spaces/hyphens semantics open |
| 3 | Last Name | [[Falcon Input]] | PRD-02 BR-UM-11 | `AccountOwner.LastName` `[ThrowIfNotPassed]` | [[V-user-first-last-name-letters-only]] | Same. Error: `LastNameLettersOnly` (400). | Same |
| 4 | Username | [[Falcon Input]] | PRD-02 BR-UM-12/19/37: ≤30, starts with letter, unique, **immutable** | `AccountOwner.UserName` `[ThrowIfNotPassed]` | [[V-username-format-uniqueness-immutable]] | `required` + `maxLength(30)` (**PRD cap; backend FluentValidation 100 — enforce 30 on FE**) + `pattern(/^[A-Za-z]/)` + async via Identity `POST /api/user/exist` (debounce 300 ms). Errors: `UsernameMustStartWithLetter` (400), `DuplicateUsername` (409). | ⚠ HIGH — PRD 30 vs backend 100 |
| 5 | National ID | [[Falcon Input]] | Optional | `AccountOwner.NationalId?` | — | Optional. `pattern(/^\d{10}$/)` (Saudi NID) safe default. | — |
| 6 | Phone Number | [[Falcon Phone Field]] / [[Falcon Mobile Number]] | PRD-02 mandatory | `AccountOwner.PhoneNumber` — **no `[ThrowIfNotPassed]`** | — | `required` (despite backend gap). E.164/Saudi format. Error: `InvalidPhoneNumber` (400). | ⚠ DTO attribute missing on required field |
| 7 | Email | [[Falcon Email Field]] | PRD-02 mandatory | `AccountOwner.EmailAddress` — **no `[ThrowIfNotPassed]`** | — | `required` + `email`. | ⚠ DTO attribute missing on required field |
| 8 | Role | [[Falcon Dropdown]] — locked to `account-owner` | BR-AM-19: Step 5 creates the AO | `AccountOwner.Role` `[ThrowIfNotPassed, ThrowIfNotEnumValue<eUserRoles>]` | — | Pre-set to `account-owner` read-only. Backend errors: `RequiredFieldMissing` (400), `InvalidValue` (422). | — |
| 9 | Password | — (NOT rendered) | PRD-02 BR-UM-15: auto-generated; complexity follows account security level | `AccountOwner.Password?` (optional — generated if not supplied) | [[V-password-complexity-per-security-level]] | **Do not render**. Backend auto-gen via `PasswordPolicy` tier resolved from Step 2. Info banner: "An initial password will be generated and delivered to the AO." | — |
| 10 | Delivery Method | [[Falcon Dropdown]] / [[Falcon Radio Group]] — Email / SMS / Both | PRD-02 W1 dialog | `DeliveryMethod` `[ThrowIfNotPassed, ThrowIfNotEnumValue<eDeliveryMethod>]` (**top-level**, not nested in AccountOwner) | — | `required` + enum-membership. | — |

**Cross-field at submit:** `RequiredFieldMissing` (400), `DuplicateUsername` (409) — surfaced on submit if async pre-check missed a race.

#### SUBMIT — the composite POST

When Step 5 Submit is clicked, the wizard:

1. **Composes** `CreateAccountRequest` from all 5 steps' buffered state.
2. **POSTs** to `POST /api/Node/create-account` via System Gateway (`POST <system-gateway>/commerce/Node/create-account` — gateway strips `/commerce` prefix, prepends `/api/`).
3. **Receives** `ServiceOperationResult<CreateAccountResponse>` (PascalCase JSON per Commerce — verify at runtime).

**Composite payload shape** (per `CreateAccountRequest`):
```jsonc
{
  "Info": { /* Step 1 — ~20 fields */ },
  "Settings": {
    "PasswordSecurityLevel": <int>,
    "AllowedIPs": ["..."],
    "MaxNormalUserLimit": 0,
    "MaxSystemUserLimit": 0,
    "MaxNodeLevel": 0,
    "BalanceTransferLimit": 0
  },
  "CommChannels": { "Services": [ { "AppId": "...", "PriceType": <int> /* + PriceValue */ } ] },
  "Applications": { "Services": [ { "AppId": "...", "PriceType": <int> /* + PriceValue */ } ] },
  "AccountOwner": {
    "AccountOwnerProfilePictureInfo": null,
    "FirstName": "...", "LastName": "...", "UserName": "...",
    "Password": null, "NationalId": null,
    "PhoneNumber": "...", "EmailAddress": "...",
    "Role": <int>
  },
  "DeliveryMethod": <int>
}
```

**Casing note:** Commerce uses PascalCase on the wire (deviation from Identity / Contact Group / Templates camelCase). Verify at runtime — `Microsoft.AspNetCore.Mvc.JsonOptions` default may be camelCase in .NET 6+.

#### Server-side effects on success

When `POST /api/Node/create-account` returns 200 with `IsSuccessful: true`:

1. Commerce persists Main Node + Account + AccountSettings + CommChannelConfig×N + AppConfig×N.
2. Commerce produces Kafka:
   - `commerce.user-creation-requested.v1` → [[Identity Service]] creates the AO user (applies `PasswordPolicy` from Step 2 level, sends credentials per `DeliveryMethod`).
   - `commerce.wallet-configured.v1` → [[Charging Service]] materializes Master Wallet (abstract aggregate) + sub-wallets per topology.
   - `commerce.identity-settings-sync.v1` → Identity (and others) tenant identity settings.
   - `commerce.tenant-ip-allowlist-changed.v1` → [[Core Gateway Service]] refreshes Redis IP-allowlist cache.
3. Returns `CreateAccountResponse` with new Account `Id`.

**Account status after creation**
- Account: `Pending` (no explicit Active until first contract activates per W8).
- AO User: `Pending` (PRD-02 BR-UM-09; → Active on first login + force-change-password per W2).
- CommChannel/AppConfig: `InActive (First time)` per BR-AM-20.
- Wallet: Master Wallet abstract aggregate (lump sum = 0 until contracts activate).

---

## Backend endpoint summary

| Method | Path | Service | Auth | Request | Response | Phase |
|---|---|---|---|---|---|---|
| GET | `/api/Node/ValidateAccountName?AccountName=` | [[Commerce Service]] | `[Authorize]` | (query) | `bool` | Step 1 async uniqueness |
| GET | `/api/Lookup/{id}?name=&code=` | [[Commerce Service]] | `[Authorize]` | (route+query) | `List<Hook<LookupValueResponse>>` | Step 1 dropdowns |
| GET | `/api/CommunicationChannel` | [[Commerce Service]] | `[Authorize]` | — | `List<CommunicationChannelResponse>` | Step 3 master |
| GET | `/api/Application` | [[Commerce Service]] | `[Authorize]` | — | `List<ApplicationResponse>` | Step 4 master |
| POST | `/api/user/exist` | [[Identity Service]] | (verify) | `UserExistRequest { Username }` | `ExistResponse { bool Exists }` | Step 5 async uniqueness |
| **POST** | **`/api/Node/create-account`** | **[[Commerce Service]]** | `[Authorize]` + PES (Falcon Sys Admin + Product) | **`CreateAccountRequest`** | **`CreateAccountResponse`** | **Step 5 Submit** |

**Gateway routing:** all calls go through [[System Gateway Service]] (admin-facing). Path transform `/commerce/*` → `/api/*`. Auth: `Authorization: Bearer <zitadel-jwt>`. Response wrapper: `ServiceOperationResult<T> { IsSuccessful, Result, ErrorMessages }` — error messages are localized strings, not codes.

## State / status transitions

| Entity | Initial on Submit | Next (not in this flow) |
|---|---|---|
| Account | `Pending` | → `Active` on first Contract activation (W8) |
| Main Node | Created | Renames via `ChangeNodeNameRequest`; sub-nodes via `CreateSubNodeRequest` |
| AccountSettings | Persisted | Edits via `PUT /api/Setting` (W7) |
| CommChannelConfig × N | `InActive (First time)` | → `Paid` → `Active` via `DoPaymentCommunicationChannelRequest` (W4) |
| AppConfig × N | `InActive (First time)` | → `Paid` → `Active` via `DoPaymentApplicationRequest` (W4) |
| AO User | `Pending` | → `Active` on first login + force-change-password; → `Locked` on 3 wrong attempts |
| Master Wallet | abstract aggregate (lump sum = 0) | Funded via `ContractActivated` Kafka |

## Error states + UX

Use HTTP status as primary routing signal. Display localized `errorMessages[0]`; do not parse codes.

| Error code (Commerce/Identity) | HTTP | UX |
|---|---|---|
| `AccountNameRequired`/`RequiredFieldMissing`/`AccountIdRequired`/`FinanceIdRequired`/`OfficialDataRequired`/`MainNodeAccountInfoRequired`/`MainAccountSettingsRequired`/`OwnerIdRequired`/`ParentIdRequired` | 400 | Inline field error; stepper highlights affected step; scroll-to-first |
| `AccountNameTooLong`/`MaxLengthExceeded`/`BelowMinimumLength` | 400 | Inline field error |
| `FirstNameLettersOnly`/`LastNameLettersOnly`/`UsernameMustStartWithLetter`/`InvalidPhoneNumber` | 400 | Inline error on Step 5 field |
| `InvalidPriceValue`/`InvalidPriceType`/`PriceValueRequired` | 400 | Inline error on Step 3/4 row |
| `CountryRequiredWhenCityProvided`/`CityRequiredWhenDistrictProvided`/`CityRequiredWhenStreetProvided` | 400 | Inline error on dependent field with parent-hint |
| `ImageExtensionNotAllowed`/`InvalidImageFile`/`ExecutableFileNotAllowed`/`ProfilePictureSizeExceeded`/`FileSizeExceeded` | 400 | Uploader inline error with allowed types + max size hint |
| `DuplicateTenantName` | 409 | Inline error on Account Name (Step 1); stepper highlight |
| `DuplicateUsername` | 409 | Inline error on Username (Step 5); stepper highlight |
| `DuplicateNodeName` | 409 | Inline error on Account Name |
| `InvalidAccountLimits`/`InvalidNodeLevel`/`InvalidValue` | 422 | Inline error in Step 2 limits panel |
| `PriceValueNotConfigured`/`PricingTypeNotConfigured`/`HiddenProductMustNotHavePricing` | 422 | Inline error on Step 3/4 row |
| `InvalidAuthorityLetterType` | 422 | Inline error on Authority Letter Type |
| `InvalidIpAddress`/`IpNotAllowed` | 403 | Generic "Request not permitted from your network" toast (don't differentiate per BR-UM-24) |
| `Forbidden`/`UnauthorizedAction`/`UnauthorizedUserToPerformThisAction` | 403 | "Permission denied" toast via [[Falcon Notification]] + close wizard |
| `Unauthorized`/`InvalidCredentials` | 401 | Trigger re-auth |
| `CreateIdentityUserFailed`/`GetIdentityUserFailed`/`ExternalServiceError`/`ExternalServiceConnectionError`/`ExternalServiceTimeout` | 500 | "Account created but AO creation failed — contact support". Preserve wizard state so operator can retry. **Partial-failure UX critical**. |
| Various `Zitadel*Failed` | 500 | Same as above (Identity-Zitadel chain failure) |
| `RenewalJobCreationFailed` | 500 | Toast — non-blocking (background concern) |
| Network 5xx | 5xx | Toast via [[Falcon Notification]] + retry; preserve wizard state |

## Cross-flow dependencies

- **Triggers** the Add User flow (specialist Flow-B owns the dedicated note): Step 5 → Kafka `UserCreationRequested` → Identity creates AO. Shared validation surface ([[V-user-first-last-name-letters-only]], [[V-username-format-uniqueness-immutable]], [[V-password-complexity-per-security-level]]).
- **Prerequisite for** the Add Node flow (specialist Flow-C): sub-nodes (`CreateSubNodeRequest`) require an existing Main Node. `Settings.MaxNodeLevel` caps depth.
- **Prerequisite for** Add Contract (PRD-03 not yet seeded): contract activation funds the Master Wallet (W8).
- **Settings tab edit** post-create uses `PUT /api/Setting`. Same V-rules; BR-AM-39 open question on limit-edit enforcement.
- **CommChannel/App activation (W4):** `DoPaymentCommunicationChannelRequest` advances `Show`-state config `InActive → Paid → Active`; price set in Steps 3/4 is what's debited.

## Related entity reconciliation notes (drift to be aware of)

- [[E-account]] — `accountName` letter-prefix backend regex missing; `id` vs `accountId` collapsed; `financeId` not in DTO_DICTIONARY (doc gap); profile-picture write path unclear; per-field `AccountOfficialData` not individually documented.
- [[E-node]] — `type` (root/main/sub) not exposed on response; per-node `settings` not modeled (lives on Account).
- [[E-account-settings]] — **PasswordSecurityLevel vocabulary drift Q-UM-12 HIGH**; `Enabled` toggle on `AllowedIPs` extra on backend; `MaxNodeLevels` plural vs `MaxNodeLevel` singular; `BalanceTransferLimitPct` vs `BalanceTransferLimit` unit-hint dropped.
- [[E-comm-channel-config]] — `accountId` vs `NodeId` axis; `visibility` enum→bool; `priceValueSar` currency-suffix dropped; 6-value status not exposed as single field; future-scheduled price change extra on backend.
- [[E-app-config]] — same drift as `E-comm-channel-config`; CommChannels + Apps are mirror endpoints with shared `Service` nested type.
- [[E-user]] — Step 5 AO uses Identity DTOs; `Username` cap drift PRD 30 vs backend 100; `PhoneNumber`/`EmailAddress` lack `[ThrowIfNotPassed]` despite PRD-required.

## Related V-rules (every validation referenced by the flow)

| V-rule | Step(s) | Note |
|---|---|---|
| [[V-account-name-format-uniqueness]] | 1 | Backend missing letter-prefix regex |
| [[V-password-security-level-enum]] | 2 | Q-UM-12 vocabulary drift |
| [[V-account-ip-allowlist-enforcement]] | 2 (admin edit form) + every login (enforce-at-gateway) | Cross-cuts PRD-01 + PRD-02 |
| [[V-account-limits-zero-means-no-limit]] | 2 (all 4 limits) | Backend lacks per-field `[ThrowIf*]`; handler only |
| [[V-service-visibility-pricing-required]] | 3 + 4 | Conditional reactive-form wiring |
| [[V-user-first-last-name-letters-only]] | 5 | Open: Arabic/spaces/hyphens semantics |
| [[V-username-format-uniqueness-immutable]] | 5 (immutability not relevant at create) | HIGH — PRD 30 vs backend 100 |
| [[V-password-complexity-per-security-level]] | 5 (server-side auto-gen) | Tier from Step 2 level |
| [[V-normal-user-limit-enforcement]] | 5 indirectly | Not a create-time concern; runtime cap on subsequent Add User |

## Related Falcon components

| Component | Step(s) used | Notes |
|---|---|---|
| [[Falcon Stepper Legacy]] / [[Falcon Stepper]] + [[Falcon Wizard]] | shell | 5-step horizontal stepper; error state per step |
| [[Falcon Dialog]] | shell | Wizard modal container |
| [[Falcon Input]] | 1, 5 | Text inputs |
| [[Falcon Input Number]] | 2, 3, 4 | Numeric inputs |
| [[Falcon Dropdown]] | 1, 2, 3, 4, 5 | Classification, authority letter, country/city/sector, password level, pricing type, role, delivery method |
| [[Falcon Toggle]] | 3, 4 | Visibility toggle per row |
| [[Falcon Checkbox]] | (potential) | Grouped options |
| [[Falcon Button]] | shell + 5 | Next / Previous / Submit / Save Draft / Cancel |
| [[Falcon Data Table]] | 3, 4 | CommChannels + Apps row tables |
| [[Falcon Email Field]] | 5 | Email input |
| [[Falcon Phone Field]] / [[Falcon Mobile Number]] | 5 | Phone input |
| [[Falcon Password]] | (server-generated, not rendered) | Documented only |
| [[Falcon Single Uploader]] / [[Falcon Uploader (generic)]] | 1, 5 | Profile picture |
| [[Falcon Tag]] | 3, 4 | CommChannel/App name display |
| [[Falcon Icon]] | 3, 4 | Channel/App icon |
| [[Falcon Status Badge]] | (post-create) | Status pills on Org Hierarchy table |
| [[Falcon Notification]] / [[Falcon Toast]] | shell | Error toasts |
| [[Falcon Form Field]] | shell | Legacy label wrapper |
| [[Falcon Textarea]] | 1 | Additional Address |

**Component customization order:** inputs → templates → slots → variants → upgrade → new lib component → wrapper → raw HTML as GAP. Add Client wizard must be an **app-level wrapper** consuming pure-presentational library skeletons; HttpClient lives in the wrapper.

## Backend service vault notes

- [[Commerce Service]] — owns `CreateAccountRequest`, produces 4 Kafka events.
- [[Identity Service]] — consumes `UserCreationRequested` → creates AO user via Zitadel → delivers credentials.
- [[Charging Service]] — consumes `WalletConfigured` → materializes Master Wallet topology.
- [[Provisioning Service]] — Application provisioning consumer (post-Add Client; activates when Show + paid).
- [[Access PES Service]] — gates the Add Client button via PES policy mirroring the Permission sheet.
- [[Core Gateway Service]] — refreshes Redis IP-allowlist cache; not on Add Client request path.
- [[System Gateway Service]] — routes the Add Client POST from Admin Console to Commerce.

## Page sections this flow touches

- `tabs-header` — host of "Add Client" entry button (right-side primary action).
- 5 wizard step panels — each step renders into the same dialog/drawer container.
- Post-create: new Account row appears in [[Organization Hierarchy]] Hierarchy tab (refresh `GET /api/accounts/hierarchy`); AO user appears in Identity-side users list (post-Kafka, eventually-consistent).

## Sequence diagram (textual)

```
Admin (Falcon System Admin / Product)
    │
    ▼
[Admin Console — Add Client button] ────► [System Gateway: 7256]
                                              │
                                              ▼
                         [Commerce: POST /api/Node/create-account] ───┐
                                              │                       │ persists:
                                              │                       │  - Main Node
                                              │                       │  - Account
                                              │                       │  - AccountSettings
                                              │                       │  - CommChannelConfig × N
                                              │                       │  - AppConfig × N
                                              │                       │
                                              │    ┌──── Kafka: commerce.user-creation-requested.v1 ────► [Identity Service]
                                              │    │                                                          │
                                              │    │                                                          ▼
                                              │    │                                            creates Zitadel user · applies PasswordPolicy(level)
                                              │    │                                            · sends credentials per DeliveryMethod
                                              │    │
                                              │    ├──── Kafka: commerce.wallet-configured.v1 ────► [Charging Service]
                                              │    │                                                   │
                                              │    │                                                   ▼
                                              │    │                                       materializes Master Wallet + sub-wallets
                                              │    │
                                              │    ├──── Kafka: commerce.identity-settings-sync.v1 ────► [Identity Service]
                                              │    │
                                              │    └──── Kafka: commerce.tenant-ip-allowlist-changed.v1 ────► [Core Gateway]
                                              │                                                                  │
                                              │                                                                  ▼
                                              │                                                      refreshes Redis IP allowlist cache
                                              ▼
                              returns ServiceOperationResult<CreateAccountResponse>
                                              │
                                              ▼
[Admin Console: success toast · navigate to Org Hierarchy with new client highlighted]
```

## Implementation checklist (FE + BE)

- [ ] Read the [SoT playbook](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/flows/Add%20Client.md) end-to-end before writing a single line of code.
- [ ] Confirm `CreateAccountRequest` shape against current [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md) — drill `Info` nested type (~20 fields) and `Service` nested type (Steps 3/4) to confirm every field name.
- [ ] Confirm Commerce JSON casing at runtime (PascalCase deviation; test before relying on case).
- [ ] Apply all 9 V-rules listed above.
- [ ] Honor [[Falcon Roles Permission Matrix]]: hide button via PES for non-allowed roles; backend `[Authorize]` + PES at the gateway is the security boundary.
- [ ] Test every error state.
- [ ] Confirm Step 5 Kafka chain (`UserCreationRequested → Identity → AO created → credentials delivered`); negative-test a Kafka delivery failure for the partial-failure UX.
- [ ] Confirm initial wallet topology (`WalletConfigured → Charging → Master Wallet materialized`).
- [ ] Handle Q-UM-12 (Password Security Level vocabulary): submit backend codes, display PRD labels.
- [ ] Handle Username cap drift: enforce PRD 30 on FE despite backend allowing 100.
- [ ] Use [[System Gateway Service]] (Falcon admin) base URL, NOT [[Core Gateway Service]]. Path transform `/commerce/*` → `/api/*`.
- [ ] Implement wizard as **composite-submit** (one POST on Step 5 Submit), not per-step.
- [ ] Implement the conditional `Visibility ↔ Pricing` reactive-form wiring on every row of Steps 3 + 4.
- [ ] Pre-load master catalogs at wizard open: `GET /api/CommunicationChannel`, `GET /api/Application`, `GET /api/Lookup/{id}` for country/city/sector.
- [ ] Async uniqueness: Account Name (Commerce) + Username (Identity) — 300 ms debounce, cancel-on-input.
- [ ] App-level wrapper pattern: `apps/admin-console/.../add-client/` consuming pure-presentational library skeletons; wrapper owns HttpClient; skeleton owns UI.
- [ ] Tailwind utilities only (no SCSS, no component CSS, no PrimeNG).
- [ ] Multi-language: `MultiLanguage(En, Ar)` for catalog reads; user-entered Account Name single-language (intentional).
- [ ] Pre-finish grep gate: no inline styles, no hardcoded color/spacing/radius — tokens only.
- [ ] Build green (`nx build` zero errors) before declaring done.

## Open questions / unresolved

| ID | Question | Impact |
|---|---|---|
| Q-UM-12 | Password Security Level vocabulary (`Normal/Advanced` PRD vs `Low/Medium/High/Strict` backend) | Frontend mapping; silent miscategorization risk |
| Q-AM-06 | Finance ID source (manual vs Finance system pull) | Step 1 input type |
| Q-AM-07 | Balance Transfer Limit % baseline | UI hint copy + handler logic |
| Q-AM-11 | Classification Category source (hardcoded vs DB lookup) | Release cadence for new categories |
| Q-AM-12 | "System User" definition | Whether `MaxSystemUserLimit` has a meaningful gate |
| Q-AM-13 | IP allowlist HTTP header name + scope | Gateway config |
| Q-AM-16 | PES rule sync with Permission sheet | Runtime allow/deny correctness |
| BR-AM-39 (open) | Limit-edit enforcement when usage exceeds new cap | Settings tab edit flow |
| Documentation gap | `CreateAccountRequest.Info` per-field list | Per-field validation needs backend drill-down |
| Documentation gap | `Service` nested type field list (only `AppId, PriceType` enumerated) | Steps 3+4 binding needs verification |

## Tags

#type/flow #prd/01 #prd/02 #prd/03 #service/access #service/charging #service/commerce #service/core-gateway #service/identity #service/provisioning #service/system-gateway #drift #gap #security

## Hubs

- [[Organization Hierarchy]] · [[01 Account Management]] · [[02 User Management]] · [[Commerce Service]] · [[Identity Service]] · [[Charging Service]] · [[Provisioning Service]] · [[Access PES Service]] · [[Core Gateway Service]] · [[System Gateway Service]] · [[Falcon Roles Permission Matrix]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[COMPONENT_INDEX]] · [[API_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
