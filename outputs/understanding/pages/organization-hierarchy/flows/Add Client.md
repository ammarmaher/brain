*** Flow Playbook — Add Client (5-step wizard) ***
*** SoT for implementation: this file ***
*** Page: Organization Hierarchy · PRD: PRD-01 Account Management · 2026-05-15 ***

# Add Client — implementation playbook

> Authoritative spec for the **Add Client** wizard on the Organization Hierarchy page. A future session implementing the FE forms, BE integration, or both should treat THIS file as the single source of truth. All cross-links resolve to deeper sources (PRD lines · backend DTOs · V-rules · component dossiers · entity reconciliation notes).
>
> Scope: this playbook covers Add Client only. Sister flows — Add User, Add Node, Edit Node — live in adjacent files in the same `flows/` directory and are owned by separate specialists. Do not duplicate their content here.

## Source-of-truth pointers

- PRD-01 OVERVIEW · [../../../../prd/modules/01-account-management/OVERVIEW.md](../../../../prd/modules/01-account-management/OVERVIEW.md)
- PRD-01 BUSINESS_RULES · [../../../../prd/modules/01-account-management/BUSINESS_RULES.md](../../../../prd/modules/01-account-management/BUSINESS_RULES.md)
- PRD-01 WORKFLOWS (W1 = the Add Client wizard) · [../../../../prd/modules/01-account-management/WORKFLOWS.md](../../../../prd/modules/01-account-management/WORKFLOWS.md)
- PRD-01 ENTITIES (Account · Node · AccountSettings · CommChannelConfig · AppConfig) · [../../../../prd/modules/01-account-management/ENTITIES.md](../../../../prd/modules/01-account-management/ENTITIES.md)
- PRD-01 GAPS · [../../../../prd/modules/01-account-management/GAPS.md](../../../../prd/modules/01-account-management/GAPS.md)
- PRD-01 QUESTIONS · [../../../../prd/modules/01-account-management/QUESTIONS.md](../../../../prd/modules/01-account-management/QUESTIONS.md)
- PRD-02 WORKFLOWS (Add User — kicked off by Step 5) · [../../../../prd/modules/02-user-management/WORKFLOWS.md](../../../../prd/modules/02-user-management/WORKFLOWS.md)
- PRD-02 ENTITIES (User · OtpChallenge · Session) · [../../../../prd/modules/02-user-management/ENTITIES.md](../../../../prd/modules/02-user-management/ENTITIES.md)
- Commerce SERVICE_OVERVIEW · [../../../backend/commerce/SERVICE_OVERVIEW.md](../../../backend/commerce/SERVICE_OVERVIEW.md)
- Commerce ENDPOINT_REGISTRY · [../../../backend/commerce/ENDPOINT_REGISTRY.md](../../../backend/commerce/ENDPOINT_REGISTRY.md)
- Commerce DTO_DICTIONARY (`CreateAccountRequest`) · [../../../backend/commerce/DTO_DICTIONARY.md](../../../backend/commerce/DTO_DICTIONARY.md)
- Commerce VALIDATIONS · [../../../backend/commerce/VALIDATIONS.md](../../../backend/commerce/VALIDATIONS.md)
- Commerce ERRORS · [../../../backend/commerce/ERRORS.md](../../../backend/commerce/ERRORS.md)
- Commerce FRONTEND_CONTRACT (response wrapper · base URL · casing) · [../../../backend/commerce/FRONTEND_CONTRACT.md](../../../backend/commerce/FRONTEND_CONTRACT.md)
- NodeController drill-down · [../../../backend/commerce/controllers/NodeController/](../../../backend/commerce/controllers/NodeController/)
- Identity SERVICE_OVERVIEW (Step 5 destination) · [../../../backend/identity/SERVICE_OVERVIEW.md](../../../backend/identity/SERVICE_OVERVIEW.md)
- Charging SERVICE_OVERVIEW (Wallet creation consumer) · [../../../backend/charging/SERVICE_OVERVIEW.md](../../../backend/charging/SERVICE_OVERVIEW.md)
- Existing page note · [../PAGE_OVERVIEW.md](../PAGE_OVERVIEW.md) · [../COMPONENT_MAPPING.md](../COMPONENT_MAPPING.md) · [../VALIDATION_RULES.md](../VALIDATION_RULES.md)

## Trigger / entry point

- **Page:** Organization Hierarchy (`apps/admin-console/.../organization-hierarchy-page` — System Gateway-backed admin view).
- **Action button:** "Add Client" (right-pane primary action — visible only to Falcon System Administrator + Product roles; hidden via PES for Operation and all Client-side roles).
- **Modal / drawer shell:** the wizard opens in a [[Falcon Wizard]] dialog (modern target) or [[Falcon Stepper Legacy]] (current consumer) — see Component Mapping below.
- **Precondition:** authenticated Falcon admin · IP on tenant allowlist (per [[V-account-ip-allowlist-enforcement]]) · System Gateway routes the call.

## Permission matrix (who can run this flow)

Authority: `Permission list - Jawad` (PRD-01 `latest-prd.md:31`, BR-AM-02; cross-referenced in [../BUSINESS_RULES.md](../BUSINESS_RULES.md)).

| Role | Can run? | Source |
|---|---|---|
| Falcon System Administrator | YES | PRD-01 OVERVIEW (Actors row 1) + BR-AM-02 |
| Falcon Product | YES | PRD-01 OVERVIEW (Actors row 2) + BR-AM-02 |
| Falcon Operation | NO (explicit Not Allow) | PRD-01 OVERVIEW (Actors row 3) — "Operation cannot add clients" |
| Client Account Owner | NO | Cannot add clients (client-side, scope = own hierarchy only) |
| Client Node Admin | NO | Cannot add clients |
| Client Normal User | NO | Transactional only |

Cross-link: [[Falcon Roles Permission Matrix]]. PES policy gate at the Core/System Gateway must mirror this matrix; drift between the Permission sheet and the PES policy rules is tracked as Q-AM-16.

## Overview — 5 steps

1. **Step 1 — Account Information** (mandatory) — Account Name + classification + Profile Picture + Official Data (Authority Letter + address + VAT + Finance ID).
2. **Step 2 — Account Settings** (mandatory) — Password Security Level + Allowed IPs + 4 Account Limits.
3. **Step 3 — Configuring CommChannels & Services** (optional) — per-channel `Visibility` + `PricingType` + `PriceValue`.
4. **Step 4 — Configuring Applications & Services** (optional) — same shape as Step 3 for Apps.
5. **Step 5 — Creating Account Owner user** (mandatory) — Personal Info + Role + Delivery Method; triggers Identity user creation.

**Wizard navigation:** Next · Previous · Save Draft (FE-local; PRD silent on persistence) · Submit (Step 5 only). All five steps are buffered client-side and submitted as **one composite `CreateAccountRequest`** to Commerce `POST /api/Node/create-account` at the end of Step 5.

> Critical implementation note: the wizard is NOT a per-step API submission. Steps 1-4 are local form state; the submission happens once on the Step 5 final action. This is dictated by the backend shape — `CreateAccountRequest` is a single composite DTO that bundles `Info, Settings, CommChannels?, Applications?, AccountOwner, DeliveryMethod`.

## Step-by-step

### Step 1 — Account Information (mandatory)

**Source-of-truth references**
- PRD: BUSINESS_RULES `BR-AM-03` → `BR-AM-08` (account-name format, account id auto, finance id, classification category/sub, authority letter type).
- PRD: WORKFLOWS §W1 step 1 (`latest-prd.md:33-40`).
- PRD: ENTITIES `Account` + `AccountOfficialData` rows.
- Backend: `CreateAccountRequest.Info` (nested type ~20 fields).
- Backend validations: `[ThrowIfNotPassed]`, `[ThrowIfMaxLengthExceed(30)]`, `[ThrowIfNotEnumValue<…>]`.

**Screen / section**
- Wizard step 1 panel.
- Form layout: 2-column responsive Tailwind grid (per page rules in [../UI_UX_RULES.md](../UI_UX_RULES.md)) — labels above inputs, RTL-aware spacing.

**Fields (every single one — no shortcuts)**

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

**Step 1 cross-field validation contract**
- `CountryRequiredWhenCityProvided` (400)
- `CityRequiredWhenDistrictProvided` (400)
- `CityRequiredWhenStreetProvided` (400)
- `OfficialDataRequired` (400) — at least Entity Name + Authority Letter block must be present (handler-level)
- `MainNodeAccountInfoRequired` (400) — `Info` block itself must be present

Implement these at the Angular FormGroup level via custom cross-field validators that map error keys to the same display strings as the backend would return (use the localized `errorMessages` from `ServiceOperationResult<T>` on actual submit; do not parse codes — see [FRONTEND_CONTRACT.md](../../../backend/commerce/FRONTEND_CONTRACT.md)).

**Backend call on Next**
- None. Step 1 data is buffered locally in the wizard state container. Async uniqueness check on Account Name is the only backend call during this step (debounced).

**Permission gate (per step)**
- Same as overall flow (Falcon System Admin + Product).

---

### Step 2 — Account Settings (mandatory)

**Source-of-truth references**
- PRD: BUSINESS_RULES `BR-AM-09` → `BR-AM-13`.
- PRD: WORKFLOWS §W1 step 2 (`latest-prd.md:42-45`).
- PRD: ENTITIES `AccountSettings` row.
- Backend: `CreateAccountRequest.Settings` (nested `SettingsInfo`).
- Entity reconciliation: [[E-account-settings]] — surfaces the **PasswordSecurityLevel enum vocabulary drift** (PRD `Normal/Advanced` vs Identity backend `Low/Medium/High/Strict` — Q-UM-12 open).

**Screen / section**
- Wizard step 2 panel — 2-section layout:
  - Section A: Password & Network (Password Security Level dropdown + Allowed IPs editable list).
  - Section B: Account Limitations (4-field grid).

**Fields**

| # | Field | Type / UI | PRD rule | Backend DTO field | V-rule | Frontend validator (Angular) | Drift |
|---|---|---|---|---|---|---|---|
| 1 | Password Security Level | dropdown ([[Falcon Dropdown]]) — Normal / Advanced (PRD) | BR-AM-09: enum 2-value, mandatory | `Settings.PasswordSecurityLevel` `[ThrowIfNotPassed, ThrowIfNotEnumValue<ePasswordSecurityLevel>]` | [[V-password-security-level-enum]] | `Validators.required`. Enum-membership validator. **Drift handling:** PRD says `Normal/Advanced`; Identity backend `ePasswordSecurityLevel` is `Low/Medium/High/Strict`. **Recommendation:** match backend enum names in the request payload (`Low/Medium/High/Strict`) and map PRD `Normal ↔ Low or Medium`, `Advanced ↔ High or Strict` until Q-UM-12 resolves. Display PRD labels in the dropdown but submit backend codes. | ⚠ HIGH — Q-UM-12 vocabulary mismatch. |
| 2 | Allowed IPs | editable string list ([[Falcon Input]] rows with add/remove buttons) | BR-AM-10: enforced via HTTP header at Gateway; missing header / missing value / not-on-list → reject | `Settings.AllowedIPs[]` (List<string>) | [[V-account-ip-allowlist-enforcement]] | Optional list (empty allowed = unrestricted, but PRD treats empty as "no allowlist" — handler may differ). Each row: `Validators.pattern(/^\d{1,3}(\.\d{1,3}){3}(\/\d{1,2})?$/)` IPv4 + optional CIDR (IPv6 support to verify). Server returns `InvalidIpAddress` (403) on malformed value. **Note:** the empty state semantics interact with the `Enabled` toggle exposed in `GetAllIpAllowlistsResponse.Tenants[].Enabled` — PRD silent on the toggle; treat empty list as "off" until clarified. | ⚠ DRIFT — backend exposes an `Enabled` bool on read-side that PRD doesn't document (E-account-settings extra column). |
| 3 | Max Normal User Limit | numeric input ([[Falcon Input Number]]) | BR-AM-11/12: int; 0 = no limit; empty not allowed; default 0 | `Settings.MaxNormalUserLimit` (int) | [[V-account-limits-zero-means-no-limit]] · [[V-normal-user-limit-enforcement]] | `Validators.required` with pre-populated default value `0`. `Validators.min(0)`. `Validators.pattern(/^\d+$/)`. UI display rule: `value === 0 → render "No limit" pill`. **Runtime breach** (creating Normal Users beyond cap) returns `NormalUserLimitReached` (422) — not a Step 2 error, surfaces later in Add User flow. | — |
| 4 | Max System User Limit | numeric input ([[Falcon Input Number]]) | BR-AM-11/12: int; 0 = no limit; empty not allowed; default 0 | `Settings.MaxSystemUserLimit` (int) | [[V-account-limits-zero-means-no-limit]] | Same as Max Normal User Limit. **Open Q-AM-12:** what is a "System User"? PRD references the cap but never defines the type. Document as a frontend assumption. | ⚠ Open Q-AM-12. |
| 5 | Max Node Levels | numeric input ([[Falcon Input Number]]) | BR-AM-11: int; 0 = no limit; empty not allowed; default 0 | `Settings.MaxNodeLevel` (int — backend singular) | [[V-account-limits-zero-means-no-limit]] | Same validators. **Runtime breach** when creating sub-nodes beyond cap returns `MaxNodeLevelReached` (422). | ⚠ COSMETIC — PRD `maxNodeLevels` (plural) vs backend `MaxNodeLevel` (singular). |
| 6 | Balance Transfer Limit (%) | numeric input ([[Falcon Input Number]]) | BR-AM-11/34: int %; 0 = no limit; empty not allowed; default 0; Master Wallet as source is exempt | `Settings.BalanceTransferLimit` (decimal — backend dropped unit hint) | [[V-account-limits-zero-means-no-limit]] | Same validators. Accept decimals (PRD: percent). Display unit suffix `%` in the input. Open Q-AM-07: baseline (source balance at transfer time / per day / per action). | ⚠ NAMING — PRD `balanceTransferLimitPct` vs backend `BalanceTransferLimit` (unit hint dropped). |

**Step 2 cross-field validation contract**
- `MainAccountSettingsRequired` (400) — the `Settings` block itself must be present.
- `InvalidAccountLimits` (422) — handler-level violation across the 4 limits (e.g., negative, malformed). The four limit fields **lack documented `[ThrowIf*]` attributes** in `VALIDATIONS.md` — empty/negative handler-level only.

**Backend call on Next**
- None. Step 2 data buffered locally.

**Permission gate**
- Same as overall flow.

**Open questions surfaced by this step**
- **Q-UM-12 (HIGH):** Password Security Level vocabulary mismatch. Implementation must pick a side; recommend backend codes (`Low/Medium/High/Strict`) for the request payload.
- **Q-AM-07:** Balance Transfer Limit % baseline (per-action / per-day / source-balance) — PRD silent.
- **Q-AM-12:** Definition of "System User" — PRD silent.
- **Q-AM-13:** HTTP header name for IP allowlist enforcement — PRD silent (Gateway config).
- **BR-AM-39 (open):** Enforcement mode for limit edits when current usage exceeds new cap (reject vs grandfather) — not a Step 2 create-time concern, but flag for the Settings tab edit flow.

---

### Step 3 — CommChannels & Services (OPTIONAL)

**Source-of-truth references**
- PRD: BUSINESS_RULES `BR-AM-14` → `BR-AM-18` (visibility default Hide, Show ⇒ price required, pricing type enum, price ≥ 0 SAR, step is optional).
- PRD: WORKFLOWS §W1 step 3 (`latest-prd.md:47-48`).
- PRD: ENTITIES `CommChannelConfig` row.
- Backend: `CreateAccountRequest.CommChannels { List<Service> Services }` (nested).
- Entity reconciliation: [[E-comm-channel-config]] — surfaces accountId→NodeId drift, visibility enum→bool drift, status 6-value enum not exposed as single field, future-scheduled price change extra on backend.

**Screen / section**
- Wizard step 3 panel — single-table layout using [[Falcon Data Table]]. Each row is a CommChannel from the master catalog (`GET /api/CommunicationChannel` returns `List<CommunicationChannelResponse> { id, name (MultiLanguage), icon }`) pre-fetched on step open.

**Per-row fields**

| Field | Type / UI | PRD rule | Backend DTO field | V-rule | Frontend validator (Angular) | Drift |
|---|---|---|---|---|---|---|
| CommChannel Name | display ([[Falcon Tag]] or text cell with [[Falcon Icon]]) — MultiLanguage(En, Ar) | Master catalog read | `CommunicationChannelResponse.Name` (MultiLanguage) · `CommunicationChannelResponse.Icon` | — | Read-only. Render using i18n locale switch (PRD-style multi-language). | — |
| Visibility | [[Falcon Toggle]] — default OFF (= Hide) | BR-AM-14: default Hide | (write) maps to `Service` row inclusion. **Important nuance:** the `CreateAccountRequest.CommChannels.Services` list is sparse — only channels the admin actively configures are sent. Channels NOT in the list inherit `Hide` server-side. | [[V-service-visibility-pricing-required]] | Initial state: OFF (Hide) for every row. Toggling ON enables the Pricing Type + Price Value inputs and makes them required (reactive form: `valueChanges.subscribe` switches validators on/off). | ⚠ enum→bool drift (E-comm-channel-config). |
| Pricing Type | dropdown ([[Falcon Dropdown]]) — Monthly / Yearly / One Time Payment | BR-AM-16: 3-value enum | `Service.PriceType` `[ThrowIfNotEnumValue<ePricingType>]` | [[V-service-visibility-pricing-required]] | **Conditional:** required when Visibility = Show. `Validators.required` + enum-membership validator. Cleared when Visibility flips to Hide (matches `HiddenProductMustNotHavePricing` reverse rule). Backend enum value `One Time Payment` likely encoded as `OneTimePayment` — verify against `ePricingType` enum definition. | — |
| Price Value | numeric input ([[Falcon Input Number]]) with SAR suffix | BR-AM-17: ≥ 0 SAR | (inferred — part of `Service` nested type beyond the documented `AppId, PriceType` fields; see DTO drill-down for full shape) | [[V-service-visibility-pricing-required]] | **Conditional:** required when Visibility = Show. `Validators.required` + `Validators.min(0)`. Server returns `PriceValueNotConfigured` (422) or `InvalidPriceValue` (400) on failure. Cleared when Visibility flips to Hide. | ⚠ DRIFT — `Service` nested type field list not fully documented in `DTO_DICTIONARY.md` (only `AppId, PriceType` enumerated). Surface as documentation gap. |

**Per-row note:** the master `CommunicationChannelResponse` carries the channel id; the per-row form binds it to `Service.AppId` (the backend uses the same `AppId` field name for both CommChannels and Apps — confusing but intentional).

**Step 3 cross-field rule (the central rule of the step)**
- **`HiddenProductMustNotHavePricing` (422)** — pricing supplied while Visibility = Hide.
- **`PriceValueNotConfigured` (422)** + **`PricingTypeNotConfigured` (422)** — Visibility = Show without complete price tuple.

Frontend implementation pattern (canonical Reactive Forms wiring per [[V-service-visibility-pricing-required]]):
```
visibility.valueChanges.subscribe(v => {
  if (v === true) { // 'Show'
    priceType.setValidators([Validators.required]);
    priceValue.setValidators([Validators.required, Validators.min(0)]);
  } else {
    priceType.clearValidators();
    priceValue.clearValidators();
    priceType.reset();
    priceValue.reset();
  }
  priceType.updateValueAndValidity();
  priceValue.updateValueAndValidity();
});
```

**Backend call on Next**
- None. Step 3 data buffered locally as a sparse list (only rows where Visibility was turned on).

**Permission gate**
- Same as overall flow. **Note:** the standalone visibility/pricing edit endpoints (`PUT /api/Node/comm-channel/visibility`, `PUT /api/Node/comm-channel/price-type`, `PUT /api/Node/comm-channel/price-value`) carry `[Authorize(Policy = "FalconOnly")]` per `ENDPOINT_REGISTRY.md`. The create-time path inside `CreateAccountRequest` inherits the parent endpoint's auth, which is Falcon System Admin + Product (the matrix above).

**Status lifecycle context (for FE awareness — not editable in this step)**
- Status starts at `InActive (First time)` per BR-AM-20 once the account is created with the channel in `Show` state.
- Transitions to `Paid` → `Active` happen later via `POST /api/Node/comm-channel/do-payment` (W4 Activation flow — not in this wizard).
- Status 6-value enum is **not exposed as a single field** on response DTOs — see [[E-comm-channel-config]] documentation gap.

---

### Step 4 — Apps & Services (OPTIONAL)

**Source-of-truth references**
- PRD: BUSINESS_RULES `BR-AM-14` → `BR-AM-18` (same set as Step 3; PRD explicitly says "same shape").
- PRD: WORKFLOWS §W1 step 4 (`latest-prd.md:50-51`).
- PRD: ENTITIES `AppConfig` row.
- Backend: `CreateAccountRequest.Applications` (parallel `List<Service> Services` under the shared `Service` nested type).
- Entity reconciliation: [[E-app-config]] — same drift items as `E-comm-channel-config` (PRD calls out "same shape").

**Screen / section**
- Wizard step 4 panel — single-table layout using [[Falcon Data Table]]. Each row is an Application from the master catalog (`GET /api/Application` returns `List<ApplicationResponse> { id, name (MultiLanguage), icon }`) pre-fetched on step open.

**Per-row fields**

Mirror of Step 3, swapping CommChannel for Application:

| Field | Type / UI | PRD rule | Backend DTO field | V-rule | Frontend validator | Drift |
|---|---|---|---|---|---|---|
| Application Name | display ([[Falcon Tag]] or text cell with [[Falcon Icon]]) | Master catalog read | `ApplicationResponse.Name` (MultiLanguage) · `ApplicationResponse.Icon` | — | Read-only | — |
| Visibility | [[Falcon Toggle]] — default OFF | BR-AM-14 | Sparse list inclusion in `Applications.Services` | [[V-service-visibility-pricing-required]] | Same wiring as Step 3 | ⚠ enum→bool |
| Pricing Type | dropdown ([[Falcon Dropdown]]) | BR-AM-16 | `Service.PriceType` `[ThrowIfNotEnumValue<ePricingType>]` | [[V-service-visibility-pricing-required]] | Conditional on Visibility = Show | — |
| Price Value | numeric input ([[Falcon Input Number]]) SAR | BR-AM-17 | (inferred — `Service` nested type, fields beyond `AppId, PriceType` not documented) | [[V-service-visibility-pricing-required]] | Conditional on Visibility = Show. `Validators.required` + `Validators.min(0)` | ⚠ Documentation gap |

**Important asymmetry:** Commerce treats CommChannels and Applications as **mirror endpoints** (12 endpoints duplicated across the two). The PRD calls this out as "same shape" but the backend has a single `Service` nested type with `AppId, PriceType` — naming is confusing because `AppId` is also used for CommChannel rows. This is intentional code reuse, not a bug. Future API consolidation is on the table (see E-app-config notes).

**Backend call on Next**
- None. Step 4 data buffered locally.

**Permission gate**
- Same as overall flow.

---

### Step 5 — Account Owner user (MANDATORY) — TRIGGERS COMPOSITE SUBMIT

**Source-of-truth references**
- PRD-01: BUSINESS_RULES `BR-AM-19` (Step 5 creates AO user, mandatory).
- PRD-01: WORKFLOWS §W1 step 5 (`latest-prd.md:53-54`).
- PRD-02: WORKFLOWS §W1 (Add User 3-tab wizard — Step 5 of Add Client is a degenerate case of the Add User flow with role pre-set to `account-owner`).
- PRD-02: ENTITIES `User` row.
- Backend: `CreateAccountRequest.AccountOwner` (nested) + top-level `DeliveryMethod`.
- Entity reconciliation: [[E-user]].

**Screen / section**
- Wizard step 5 panel — single-form layout, 2-column responsive Tailwind grid.
- Final action button: **Submit** (not "Next"). On submit, the composite `CreateAccountRequest` is built from Steps 1-5 and POSTed to Commerce.

**Fields**

| # | Field | Type / UI | PRD rule | Backend DTO field | V-rule | Frontend validator (Angular) | Drift |
|---|---|---|---|---|---|---|---|
| 1 | Profile Picture | uploader ([[Falcon Single Uploader]]) | PRD-02 BR-UM-14: optional profile pic on Add User | `AccountOwner.AccountOwnerProfilePictureInfo?` (`{ Extension, FileBase64String }`) | — | Optional. Same image constraints as Step 1 picture (1024 KB, jpg/png/webp/jpeg/gif/bmp/x-icon). | — |
| 2 | First Name | text input ([[Falcon Input]]) | PRD-02 BR-UM-11: ≤50, letters only, mandatory | `AccountOwner.FirstName` `[ThrowIfNotPassed]` | [[V-user-first-last-name-letters-only]] | `Validators.required` + `Validators.maxLength(50)` + `Validators.pattern(/^[A-Za-z؀-ۿ]+$/)` (letters + Arabic Unicode). Backend errors: `FirstNameLettersOnly` (400), `MaxLengthExceeded` (400). | ⚠ Open: spaces/hyphens/apostrophes allowed? PRD silent. |
| 3 | Last Name | text input ([[Falcon Input]]) | PRD-02 BR-UM-11 | `AccountOwner.LastName` `[ThrowIfNotPassed]` | [[V-user-first-last-name-letters-only]] | Same as First Name. Backend error: `LastNameLettersOnly` (400). | Same as above. |
| 4 | Username | text input ([[Falcon Input]]) | PRD-02 BR-UM-12/19/37: ≤30, starts with letter, unique system-wide, mandatory, **immutable after create** | `AccountOwner.UserName` `[ThrowIfNotPassed]` | [[V-username-format-uniqueness-immutable]] | `Validators.required` + `Validators.maxLength(30)` (**PRD cap; backend FluentValidation cap is 100 — be tighter than backend**) + `Validators.pattern(/^[A-Za-z]/)`. Async uniqueness via Identity `POST /api/user/exist` → `ExistResponse { bool Exists }`. Debounce 300 ms. Backend errors: `UsernameMustStartWithLetter` (400), `DuplicateUsername` (409). | ⚠ HIGH DRIFT — backend cap 100 vs PRD 30; FE enforces 30. |
| 5 | National ID | text input ([[Falcon Input]]) | Optional per backend DTO | `AccountOwner.NationalId?` (string) | — | Optional. PRD silent on format; Saudi NID is 10 digits — apply `Validators.pattern(/^\d{10}$/)` as safe default. | — |
| 6 | Phone Number | phone field ([[Falcon Phone Field]] or [[Falcon Mobile Number]]) | PRD-02 mandatory | `AccountOwner.PhoneNumber` (string) — **no `[ThrowIfNotPassed]` despite required** (handler validates) | — | `Validators.required` (despite backend gap — PRD says mandatory). E.164 / Saudi format validation via the component's built-in validator. Backend error: `InvalidPhoneNumber` (400). | ⚠ DRIFT — DTO attribute missing on required field. |
| 7 | Email | email field ([[Falcon Email Field]]) | PRD-02 mandatory | `AccountOwner.EmailAddress` (string) — **no `[ThrowIfNotPassed]` despite required** | — | `Validators.required` + `Validators.email` (FE-side strictness). | ⚠ DRIFT — DTO attribute missing on required field. |
| 8 | Role | dropdown ([[Falcon Dropdown]]) — should be locked to `account-owner` per BR-AM-19 | PRD-01 BR-AM-19: Step 5 creates the Account Owner | `AccountOwner.Role` `[ThrowIfNotPassed, ThrowIfNotEnumValue<eUserRoles>]` | — | **Pre-set to `account-owner` and shown as read-only** (PRD says this step creates the AO; offering the dropdown invites operator error). If the implementation chooses to show all options, restrict to AO-compatible values (`account-owner` only at this stage). Backend errors: `RequiredFieldMissing` (400), `InvalidValue` (422). | — |
| 9 | Password | not collected here — auto-generated server-side per `ePasswordSecurityLevel` from Step 2 | PRD-02 BR-UM-15: auto-generated; complexity follows account security level | `AccountOwner.Password?` (optional — generated if not supplied) | [[V-password-complexity-per-security-level]] | **Do not render a password input on this form.** Backend auto-generates using `PasswordPolicy` tier resolved from Step 2's `PasswordSecurityLevel`. Show an info banner: "An initial password will be generated and delivered to the Account Owner via the selected channel below." | — |
| 10 | Delivery Method | dropdown / radio group ([[Falcon Dropdown]] or [[Falcon Radio Group]]) — Email / SMS / Both | PRD-02 W1 confirmation dialog | `CreateAccountRequest.DeliveryMethod` `[ThrowIfNotPassed, ThrowIfNotEnumValue<eDeliveryMethod>]` (**top-level**, not nested in `AccountOwner`) | — | `Validators.required` + enum-membership. | — |

**Step 5 cross-field validation contract**
- `RequiredFieldMissing` (400) on any missing `FirstName / LastName / UserName / Role / DeliveryMethod`.
- `DuplicateUsername` (409) — surfaced on submit if async pre-check missed a race.

**SUBMIT — the composite POST**

When Step 5 Submit is clicked, the wizard:

1. **Composes** `CreateAccountRequest` from all 5 steps' buffered state.
2. **POSTs** to `POST /api/Node/create-account` via the System Gateway (`POST <system-gateway>/commerce/Node/create-account` — gateway strips `/commerce` prefix and prepends `/api/`).
3. **Receives** `ServiceOperationResult<CreateAccountResponse>` (PascalCase JSON per Commerce — confirm against [FRONTEND_CONTRACT.md](../../../backend/commerce/FRONTEND_CONTRACT.md)).

**Composite payload shape** (per `CreateAccountRequest`):
```jsonc
{
  "Info": { /* Step 1 — ~20 fields, see Step 1 table */ },
  "Settings": {
    "PasswordSecurityLevel": <int>,       // ePasswordSecurityLevel enum value
    "AllowedIPs": ["..."],                // optional list
    "MaxNormalUserLimit": 0,
    "MaxSystemUserLimit": 0,
    "MaxNodeLevel": 0,                    // singular per backend
    "BalanceTransferLimit": 0
  },
  "CommChannels": {                        // optional — omit if Step 3 untouched
    "Services": [
      { "AppId": "<channelId>", "PriceType": <int> /* + PriceValue per DTO drill-down */ }
    ]
  },
  "Applications": {                        // optional — omit if Step 4 untouched
    "Services": [
      { "AppId": "<appId>", "PriceType": <int> /* + PriceValue */ }
    ]
  },
  "AccountOwner": {
    "AccountOwnerProfilePictureInfo": null,
    "FirstName": "...",
    "LastName": "...",
    "UserName": "...",
    "Password": null,                      // auto-generated if not supplied
    "NationalId": null,
    "PhoneNumber": "...",
    "EmailAddress": "...",
    "Role": <int>                          // eUserRoles enum value (account-owner)
  },
  "DeliveryMethod": <int>                  // eDeliveryMethod enum value
}
```

**Casing note:** Commerce uses PascalCase on the wire per `FRONTEND_CONTRACT.md` (deviation from Identity / Contact Group / Templates which use camelCase). The frontend's HttpClient interceptor or DTO module must serialize with PascalCase property names for Commerce calls. **Verify at runtime** — `Microsoft.AspNetCore.Mvc.JsonOptions` may default to camelCase in .NET 6+ without explicit config; check the live response shape and adjust.

**Server-side effects on success**

When `POST /api/Node/create-account` returns 200 with `IsSuccessful: true`, the Commerce handler `CreateMainNodeProcess` has:

1. Created the **Root → Main Node** binding (Main Node persisted with the AccountName).
2. Created the **Account** entity bound to the Main Node (`Account` entity with `Id`, `TenantId`, `CreatedAt`).
3. Created the **AccountSettings** record (password level, IPs, limits).
4. Created **CommChannelConfig × N** for each `CommChannels.Services` entry (default status `InActive (First Time)`).
5. Created **AppConfig × N** for each `Applications.Services` entry.
6. **Produced Kafka events** (per Commerce SERVICE_OVERVIEW):
   - `commerce.user-creation-requested.v1` (`UserCreationRequestedEventPublisher`) → consumed by [[Identity Service]] (`UserCreationRequestedConsumer`) to create the AO user (`POST /api/user` semantics) → Identity creates the Zitadel user, applies the password policy from Step 2's level, sends credentials per `DeliveryMethod`.
   - `commerce.wallet-configured.v1` (`WalletConfiguredEventPublisher`) → consumed by [[Charging Service]] (`WalletConfiguredEventConsumer`) to materialize the wallet topology (Master Wallet abstract + per-comm-channel sub-wallets if Multiple-wallet mode).
   - `commerce.identity-settings-sync.v1` (`TenantIdentitySettingsSyncEventPublisher`) → tells Identity (and others) tenant identity settings changed.
   - `commerce.tenant-ip-allowlist-changed.v1` (`TenantIpAllowlistChangedEventPublisher`) → tells [[Core Gateway Service]] to refresh its Redis IP-allowlist cache.
7. Returned `CreateAccountResponse` carrying the new Account `Id` (built via `request.ToResponse(result.Id)` custom mapper).

**Account status after creation**
- Account status: starts at `Pending` per PRD lifecycle (PRD silent on explicit Active-on-create; activates when first Contract becomes Active per W8 `ContractActivated` Kafka event).
- AO User status: `Pending` per PRD-02 BR-UM-09 (Pending → Active on first successful login + force-change-password per W2).
- CommChannel/AppConfig status: `InActive (First time)` per BR-AM-20.
- Wallet: Master Wallet exists as an abstract aggregate (no records until first contract activates per BR-AM-28).

**Permission gate**
- Same as overall flow.

---

## Backend endpoint summary

| Method | Path | Service | Auth | Request | Response (T inside `ServiceOperationResult<T>`) | Phase |
|---|---|---|---|---|---|---|
| GET | `/api/Node/ValidateAccountName?AccountName=` | [[Commerce Service]] | class-level `[Authorize]` | (query) | `bool` | Step 1 async uniqueness |
| GET | `/api/Lookup/{id}?name=&code=` | [[Commerce Service]] | class-level `[Authorize]` | (route+query) | `List<Hook<LookupValueResponse>>` | Step 1 country/city/sector dropdowns |
| GET | `/api/CommunicationChannel` | [[Commerce Service]] | class-level `[Authorize]` | — | `List<CommunicationChannelResponse>` | Step 3 master list |
| GET | `/api/Application` | [[Commerce Service]] | class-level `[Authorize]` | — | `List<ApplicationResponse>` | Step 4 master list |
| POST | `/api/user/exist` | [[Identity Service]] | class-level auth (verify) | `UserExistRequest { string Username }` | `ExistResponse { bool Exists }` | Step 5 async uniqueness |
| **POST** | **`/api/Node/create-account`** | **[[Commerce Service]]** | class-level `[Authorize]` (Falcon System Admin + Product enforced via PES at gateway) | **`CreateAccountRequest`** | **`CreateAccountResponse`** (carries new Account Id) | **Step 5 final submit** |

**Gateway routing**
- All calls go through the **System Gateway** (`https://localhost:7256` dev / `<system-gateway>` prod) — admin-facing routing. Path transform: gateway strips the `/commerce` prefix and prepends `/api/`. So `POST <system-gateway>/commerce/Node/create-account` → Commerce `POST /api/Node/create-account`.
- Auth header: `Authorization: Bearer <zitadel-jwt>` (Falcon admin user's token).
- Response wrapper: `ServiceOperationResult<T> { bool IsSuccessful, T? Result, List<string> ErrorMessages }`. `ErrorMessages` is **localized strings**, not codes — use HTTP status code for routing logic ([FRONTEND_CONTRACT.md](../../../backend/commerce/FRONTEND_CONTRACT.md)).

## State / status transitions

| Entity | Initial state on Submit success | Next transitions (not in this flow) |
|---|---|---|
| Account | `Pending` (no explicit Active status in PRD; treat as pre-activation) | → `Active` when first Contract activates (W8 cross-module) |
| Main Node | Created (no explicit status) | Renames via `ChangeNodeNameRequest`; sub-nodes added via `CreateSubNodeRequest` |
| AccountSettings | Persisted | Edits via `PUT /api/Setting` (W7) |
| CommChannelConfig × N (Step 3) | `InActive (First time)` | → `Paid` → `Active` via `DoPaymentCommunicationChannelRequest` (W4) |
| AppConfig × N (Step 4) | `InActive (First time)` | → `Paid` → `Active` via `DoPaymentApplicationRequest` (W4) |
| AO User | `Pending` | → `Active` on first successful login + force-change-password (PRD-02 W2); → `Locked` on 3 wrong attempts (PRD-02 W9) |
| Master Wallet | abstract aggregate (lump sum = 0 until contracts activate) | Funded via `ContractActivated` Kafka event (W8) |

## Error states + UX

Use HTTP status code as the **primary routing signal** per [FRONTEND_CONTRACT.md](../../../backend/commerce/FRONTEND_CONTRACT.md). Display localized `errorMessages[0]` to the user (already localized; do not parse).

| Backend error code (Commerce/Identity) | HTTP | UX behavior |
|---|---|---|
| `AccountNameRequired` · `RequiredFieldMissing` · `AccountIdRequired` · `FinanceIdRequired` · `ParentIdRequired` · `OfficialDataRequired` · `MainNodeAccountInfoRequired` · `MainAccountSettingsRequired` · `OwnerIdRequired` | 400 | Inline error on the missing field. Wizard step indicator highlights the affected step ([[Falcon Stepper]] error state). Scroll to first error. |
| `AccountNameTooLong` · `MaxLengthExceeded` · `BelowMinimumLength` | 400 | Inline error on the affected field |
| `FirstNameLettersOnly` · `LastNameLettersOnly` · `UsernameMustStartWithLetter` · `InvalidPhoneNumber` | 400 | Inline error on the affected Step 5 field |
| `InvalidPriceValue` · `InvalidPriceType` · `PriceValueRequired` | 400 | Inline error on the affected Step 3/4 row |
| `CountryRequiredWhenCityProvided` · `CityRequiredWhenDistrictProvided` · `CityRequiredWhenStreetProvided` | 400 | Inline error on the dependent field, with hint pointing at the required parent |
| `ImageExtensionNotAllowed` · `InvalidImageFile` · `ExecutableFileNotAllowed` · `ProfilePictureSizeExceeded` · `FileSizeExceeded` | 400 | Inline error on the uploader; show allowed types + max size hint |
| `DuplicateTenantName` | 409 | Inline error on Account Name field in Step 1 ("This name is already in use"). Stepper highlights Step 1. |
| `DuplicateUsername` | 409 | Inline error on Username field in Step 5. Stepper highlights Step 5. |
| `DuplicateNodeName` | 409 | Inline error on Account Name (if Main Node naming collision separate from tenant). |
| `InvalidAccountLimits` · `InvalidNodeLevel` · `InvalidValue` | 422 | Inline error in Step 2 limits panel |
| `PriceValueNotConfigured` · `PricingTypeNotConfigured` · `HiddenProductMustNotHavePricing` | 422 | Inline error on the affected Step 3/4 row |
| `InvalidAuthorityLetterType` | 422 | Inline error on Authority Letter Type field |
| `InvalidIpAddress` · `IpNotAllowed` | 403 | Generic "Request not permitted from your network" toast. **Do NOT differentiate from credential errors** (BR-UM-24 enumeration-leak protection). |
| `Forbidden` · `UnauthorizedAction` · `UnauthorizedUserToPerformThisAction` | 403 | "You do not have permission to add a client" toast ([[Falcon Notification]]) + close wizard |
| `Unauthorized` · `InvalidCredentials` | 401 | Trigger re-auth flow |
| `CreateIdentityUserFailed` · `GetIdentityUserFailed` · `ExternalServiceError` · `ExternalServiceConnectionError` · `ExternalServiceTimeout` | 500 | Toast via [[Falcon Notification]] "Account created but Account Owner creation failed — contact support". **Wizard state should be preserved** so the operator can retry Step 5 user creation. **Important:** Account may have been created server-side before the Identity hop failed — surface a clear partial-failure UX. |
| `ZitadelCreateMachineUserFailed` / various `Zitadel*Failed` | 500 | Same as above — Identity-Zitadel chain failure |
| `RenewalJobCreationFailed` | 500 | Toast — non-blocking (renewal job is a background concern) |
| Network 5xx (generic) | 5xx | Toast via [[Falcon Notification]] + retry button; wizard state preserved |

**Banner UX rule:** the wizard stepper component must visually mark the offending step as error-state when the backend returns a code that resolves to a specific step. Use the page rule UIUX-SHADOW-001..005 family for inline-edit error patterns where applicable (cross-link: [../UI_UX_RULES.md](../UI_UX_RULES.md)).

## Cross-flow dependencies

- **Triggers [[Add User Flow]] (specialist Flow-B):** Step 5 creates the Account Owner user. The Kafka chain `UserCreationRequested → Identity` lands in PRD-02's W1 Add User flow (server-side, no UI). The same `CreateUserRequest` validation surface applies — `V-user-first-last-name-letters-only`, `V-username-format-uniqueness-immutable`, `V-password-complexity-per-security-level`.
- **Prerequisite for [[Add Node Flow]] (specialist Flow-C):** sub-nodes (`CreateSubNodeRequest`) require an existing Main Node — Add Client creates the Main Node. The `Settings.MaxNodeLevel` cap from Step 2 enforces max depth at Add Node time.
- **Prerequisite for Add Contract flow (PRD-03 — not yet seeded):** contracts target an Account by id. Contract activation funds the Master Wallet (W8 Kafka event chain).
- **Settings tab edit flow:** post-create edits to `AccountSettings` (Password level, IPs, limits) go through `PUT /api/Setting`. Same `V-*` rules apply. PRD-01 BR-AM-39 open question (shrinking a limit below current usage).
- **CommChannel/App activation flow (W4):** `DoPaymentCommunicationChannelRequest` advances a `Show`-state config from `InActive (First time) → Paid → Active`. The price set in Step 3/4 of this wizard is what gets debited from the Master Wallet.

## Related entity reconciliation notes (drift to be aware of)

- [[E-account]] — `accountName` letter-prefix backend regex missing (handler-level only); `id` vs `accountId` collapsed; `financeId` not enumerated in DTO_DICTIONARY (documentation gap); `profilePicture` write path unclear; per-field `AccountOfficialData` fields not individually documented.
- [[E-node]] — `type` (root/main/sub) not exposed as response field (inferred from position); per-node `settings` not modeled (lives on Account).
- [[E-account-settings]] — **`PasswordSecurityLevel` enum vocabulary drift** (Q-UM-12 HIGH severity); `Enabled` toggle on `AllowedIPs` extra on backend (PRD silent); `MaxNodeLevels` plural vs `MaxNodeLevel` singular (cosmetic); `BalanceTransferLimitPct` vs `BalanceTransferLimit` (unit hint dropped).
- [[E-comm-channel-config]] — `accountId` vs `NodeId` operating axis; `visibility` enum→bool drift; `priceValueSar` currency-suffix dropped; 6-value status not exposed as single field; future-scheduled price change extra on backend.
- [[E-app-config]] — same drift items as `E-comm-channel-config`; CommChannels + Apps are mirror endpoints with shared `Service` nested type.
- [[E-user]] — Step 5 AO uses Identity DTOs; `Username` cap drift (PRD 30 vs backend 100); `PhoneNumber`/`EmailAddress` lack `[ThrowIfNotPassed]` despite PRD-required.

## Related V-rules (every validation referenced by the flow)

| V-rule | Steps that apply | Severity / Notes |
|---|---|---|
| [[V-account-name-format-uniqueness]] | Step 1 | Backend missing letter-prefix regex; FE enforces |
| [[V-password-security-level-enum]] | Step 2 | Q-UM-12 vocabulary drift |
| [[V-account-ip-allowlist-enforcement]] | Step 2 (admin edit form for the list) + every login (enforce-at-gateway, not at Step 2) | Cross-cuts PRD-01 + PRD-02 |
| [[V-account-limits-zero-means-no-limit]] | Step 2 (all 4 limits) | Backend missing per-field `[ThrowIf*]` attributes; handler-level only |
| [[V-service-visibility-pricing-required]] | Steps 3 + 4 (per-row Visibility ↔ Pricing cross-field) | Conditional reactive form wiring |
| [[V-user-first-last-name-letters-only]] | Step 5 | Open: Arabic/spaces/hyphens semantics |
| [[V-username-format-uniqueness-immutable]] | Step 5 (immutability not relevant at create, applies post-create) | HIGH drift — PRD cap 30 vs backend cap 100 |
| [[V-password-complexity-per-security-level]] | Step 5 (server-side auto-gen; not user-facing) | Tier resolved from Step 2's `PasswordSecurityLevel` |
| [[V-normal-user-limit-enforcement]] | Step 5 indirectly (AO is sys-admin/account-owner role, not Normal User; no immediate breach) | Not a create-time concern; runtime cap on subsequent Add User flow |

## Related Falcon components

Authoritative dossier path: `C:\Falcon\Brain Outputs\understanding\frontend\components\<name>\` (per the Brain SK CLAUDE.md canonical knowledge path).

| Component | Step(s) used | Notes |
|---|---|---|
| [[Falcon Stepper Legacy]] (current consumer) / [[Falcon Stepper]] + [[Falcon Wizard]] (modern target) | shell | 5-step horizontal stepper; error state on failed step |
| [[Falcon Dialog]] | shell | Wizard modal container (alternative: drawer) |
| [[Falcon Input]] | 1, 5 | Text inputs (Account Name, address fields, names) |
| [[Falcon Input Number]] | 2, 3, 4 | Numeric inputs (limits, price values) |
| [[Falcon Dropdown]] | 1, 2, 3, 4, 5 | Classification, authority letter, country/city/sector, password level, pricing type, role, delivery method |
| [[Falcon Toggle]] | 3, 4 | Visibility toggle per row |
| [[Falcon Checkbox]] | (potential) | If used for grouped options |
| [[Falcon Button]] | shell + 5 | Next / Previous / Submit / Save Draft / Cancel |
| [[Falcon Data Table]] | 3, 4 | CommChannels + Apps row tables |
| [[Falcon Email Field]] | 5 | Email input (built-in `Validators.email`) |
| [[Falcon Phone Field]] / [[Falcon Mobile Number]] | 5 | Phone input (E.164/Saudi format) |
| [[Falcon Password]] | (server-generated; not rendered) | Document only — no input on Step 5; AO sees password on credential-delivery message |
| [[Falcon Single Uploader]] / [[Falcon Uploader (generic)]] | 1, 5 | Profile picture uploaders |
| [[Falcon Tag]] | 3, 4 | CommChannel / App name display |
| [[Falcon Icon]] | 3, 4 | Channel / App icon in row |
| [[Falcon Status Badge]] | (post-create) | Status pills (not on Add Client wizard itself; applies to Org Hierarchy table view post-create) |
| [[Falcon Notification]] / [[Falcon Toast]] | shell | Error toasts |
| [[Falcon Form Field]] | shell | Form label wrapper (legacy) — modern path uses Tailwind grid directly per Noor Instructions |
| [[Falcon Textarea]] | 1 | Additional Address (free-text) |

Component customization order rule (per project standing rule [feedback_library_skeleton_app_api.md]): inputs → templates → slots → variants → upgrade → new lib component → wrapper → raw HTML as GAP. The Add Client wizard must be implemented as an **app-level wrapper** under `apps/admin-console/.../add-client/` consuming pure-presentational library skeletons. Backend service calls live in the wrapper, never in the library skeleton.

## Backend service vault notes

- [[Commerce Service]] — owns `CreateAccountRequest`, produces Kafka events (`UserCreationRequested`, `WalletConfigured`, `IdentitySettingsSync`, `TenantIpAllowlistChanged`).
- [[Identity Service]] — consumes `UserCreationRequested` → creates AO user via Zitadel → sends credentials per `DeliveryMethod`.
- [[Charging Service]] — consumes `WalletConfigured` → materializes Master Wallet + sub-wallet topology.
- [[Provisioning Service]] — Application provisioning consumer (post-Add Client; activates per-app provisioning when `Show` + paid).
- [[Access PES Service]] — `falcon-core-access-svc` — gates the Add Client action button via PES policy mirroring the Permission sheet.
- [[Core Gateway Service]] — refreshes Redis IP-allowlist cache via `commerce.tenant-ip-allowlist-changed.v1`. Not on the Add Client request path (System Gateway is).
- [[System Gateway Service]] — routes the Add Client POST from the Admin Console to Commerce.

## Permission matrix link

- [[Falcon Roles Permission Matrix]] — Falcon System Admin + Product allowed; Operation explicit Not Allow; Client roles all No.

## Page sections this flow touches

- `tabs-header` — host of the "Add Client" entry button (right-side primary action).
- 5 wizard step panels — each step renders into the same dialog/drawer container.
- Post-create: on success, the new Account row appears in the Hierarchy tab of [[Organization Hierarchy]] (refresh `GET /api/accounts/hierarchy`); the new AO user appears in the Identity-side users list (post-Kafka, eventually-consistent).

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
                                              │                       ▼
                                              │    ┌──── Kafka: commerce.user-creation-requested.v1 ────► [Identity Service]
                                              │    │                                                          │
                                              │    │                                                          ▼
                                              │    │                                            creates Zitadel user · applies PasswordPolicy(level)
                                              │    │                                            · sends credentials per DeliveryMethod
                                              │    │
                                              │    ├──── Kafka: commerce.wallet-configured.v1 ────► [Charging Service]
                                              │    │                                                   │
                                              │    │                                                   ▼
                                              │    │                                       materializes Master Wallet (abstract)
                                              │    │                                       + sub-wallets per topology
                                              │    │
                                              │    ├──── Kafka: commerce.identity-settings-sync.v1 ────► [Identity Service]
                                              │    │
                                              │    └──── Kafka: commerce.tenant-ip-allowlist-changed.v1 ────► [Core Gateway]
                                              │                                                                  │
                                              │                                                                  ▼
                                              │                                                       refreshes Redis IP allowlist cache
                                              ▼
                              returns ServiceOperationResult<CreateAccountResponse>
                                              │
                                              ▼
[Admin Console: success toast · navigate to Org Hierarchy with new client highlighted]
```

## Implementation checklist (FE + BE)

- [ ] Read this playbook end-to-end before writing a single line of code.
- [ ] Confirm `CreateAccountRequest` shape against current `Brain Outputs/understanding/backend/commerce/DTO_DICTIONARY.md` — drill into the `Info` nested type (~20 fields) and the `Service` nested type used by Steps 3/4 to confirm every field name.
- [ ] Confirm Commerce JSON casing at runtime (`PascalCase` per Commerce `FRONTEND_CONTRACT.md`; framework default may be camelCase — test before relying on case).
- [ ] Apply all 9 V-rules listed in "Related V-rules".
- [ ] Honor [[Falcon Roles Permission Matrix]] permission gate at the entry-point button (hide for non-allowed roles via PES); rely on backend `[Authorize]` + PES policy at the gateway as the security boundary.
- [ ] Test every error state in the Error states table.
- [ ] Confirm Step 5 Kafka chain (`UserCreationRequested → Identity → AO user created → credentials delivered per DeliveryMethod`). Negative test: introduce a Kafka delivery failure and confirm the partial-failure UX.
- [ ] Confirm initial wallet topology creation (`WalletConfigured → Charging → Master Wallet materialized`).
- [ ] Handle Q-UM-12 (Password Security Level enum vocabulary drift): submit backend codes (`Low/Medium/High/Strict`), display PRD labels (`Normal/Advanced`), until Q-UM-12 resolves.
- [ ] Handle the `Username` cap drift: enforce PRD cap of 30 chars on FE despite backend allowing 100.
- [ ] Use the **System Gateway** (Falcon admin) base URL, NOT the Core Gateway (client-facing). The path transform is `/commerce/*` → `/api/*`.
- [ ] Implement wizard as composite-submit (one POST on Step 5 Submit), not per-step submission.
- [ ] Implement the conditional `Visibility ↔ Pricing` reactive-form wiring on every row of Steps 3 + 4 (the central V-rule of those steps).
- [ ] Pre-load master catalogs at wizard open: `GET /api/CommunicationChannel`, `GET /api/Application`, `GET /api/Lookup/{id}` for country/city/sector.
- [ ] Auto-uniqueness checks: Account Name (Commerce `ValidateAccountName`) and Username (Identity `/user/exist`) with 300 ms debounce + cancel-on-input.
- [ ] App-level wrapper pattern: implement under `apps/admin-console/.../add-client/`; consume pure-presentational library skeletons from `libs/falcon-ui-core/`. Wrapper owns the HttpClient calls; skeleton owns the UI.
- [ ] Tailwind utilities only (no SCSS, no component CSS, no PrimeNG) per project standing rules.
- [ ] Multi-language: respect `MultiLanguage(En, Ar)` for catalog reads (CommChannel.Name, Application.Name); user-entered Account Name is single-language (intentional deviation).
- [ ] Pre-finish grep gate: no inline styles, no hardcoded color/spacing/radius values — tokens only.
- [ ] Build green (`nx build` zero errors) before declaring done; standing rule per project memory.

## Open questions / unresolved before implementation

| ID | Question | Impact if left open |
|---|---|---|
| Q-UM-12 | Password Security Level vocabulary (`Normal/Advanced` PRD vs `Low/Medium/High/Strict` backend) | Frontend mapping must be locked; risk of silent miscategorization |
| Q-AM-06 | Finance ID source — manual entry vs Finance system pull | Determines whether Step 1 has a free-text input or a system-driven readonly value |
| Q-AM-07 | Balance Transfer Limit % baseline (per-action / per-day / source-balance) | UI hint copy + handler logic |
| Q-AM-11 | Classification Category source-of-truth (hardcoded enum vs DB lookup) | Whether new categories require a release |
| Q-AM-12 | Definition of "System User" (counts what?) | Whether the `MaxSystemUserLimit` field has a meaningful runtime gate |
| Q-AM-13 | IP allowlist HTTP header name + scope | Gateway config; not a FE concern but documents the Gateway team's contract |
| Q-AM-16 | PES rule sync with Permission sheet | Runtime allow/deny correctness |
| BR-AM-39 (open) | Limit-edit enforcement when current usage exceeds new cap | Not a Step 2 create-time concern; flag for Settings tab edit flow |
| Documentation gap | `CreateAccountRequest.Info` per-field list (only ~20 fields summarized) | Per-field validation surface needs a backend drill-down before final FE form schema is locked |
| Documentation gap | `Service` nested type field list (only `AppId, PriceType` enumerated; `PriceValue` and any others not surfaced) | Steps 3+4 binding shape needs verification |

## Hubs

- [[Organization Hierarchy]] · [[01 Account Management]] · [[02 User Management]] · [[Commerce Service]] · [[Identity Service]] · [[Charging Service]] · [[Provisioning Service]] · [[Access PES Service]] · [[Core Gateway Service]] · [[System Gateway Service]] · [[Falcon Roles Permission Matrix]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[COMPONENT_INDEX]] · [[API_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
