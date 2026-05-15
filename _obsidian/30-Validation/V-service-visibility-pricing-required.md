---
type: validation-rule
id: V-service-visibility-pricing-required
prd: PRD-01
service: commerce
severity: high
status: triangulated
drift: true
created: 2026-05-15
---
*** Validation V-service-visibility-pricing-required — Visibility=Show requires Pricing Type + Price Value ***
*** Origin: PRD-01 Account Management · Backend: Commerce · 2026-05-15 ***

# V-service-visibility-pricing-required — When a CommChannel/App is set to Show, Pricing Type AND Price Value become mandatory; hidden services must not have pricing

> Conditional validation on the per-account service-catalog matrix: visibility is a tri-state (default Hide; Show requires a complete price tuple; hidden services explicitly forbid pricing to prevent stale-price drift on a re-show). Price values must be ≥ 0 SAR.

## Origin (PRD)

- **PRD:** [[01 Account Management]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/01-account-management/BUSINESS_RULES.md)
- **Rule ids:** `BR-AM-14` (default Hide) + `BR-AM-15` (Show ⇒ price required) + `BR-AM-16` (Pricing Type enum) + `BR-AM-17` (Price Value ≥ 0 SAR)
- **PRD line reference:**
  - "CommChannel/Application Visibility default is `Hide`." (`latest-prd.md:48`)
  - "If Visibility = `Show`, Pricing Type AND Price Value become mandatory." (`latest-prd.md:48`)
  - "Pricing Type is one of {Monthly, Yearly, One Time Payment}." (`latest-prd.md:48`)
  - "Price Value must be >=0 in SAR." (`latest-prd.md:48`)
- **Excel cell:** none (PRD prose only — applies to Steps 3 + 4 of Add Client wizard and to the standalone Visibility / Price-Type / Price-Value edit endpoints)
- **Workflow context:** Wizard Steps 3 + 4 (optional) + W4 CommChannel / App Activation + W6 Manual Disable/Enable. ([WORKFLOWS](../../../Brain%20Outputs/prd/modules/01-account-management/WORKFLOWS.md))

## Backend enforcement

- **Service:** [[Commerce Service]]
- **DTOs (Step 3 / 4 of create):**
  - `CreateAccountRequest.CommChannels.Services` (each: `Service` nested type)
  - `Service.AppId` `[ThrowIfNotPassed]`
  - `Service.PriceType` `[ThrowIfNotEnumValue<ePricingType>]`
- **DTOs (standalone visibility edits):**
  - `ChangeAccountCommunicationChannelServiceVisibilityRequest` / `ChangeAccountApplicationServiceVisibilityRequest`
  - `ChangeCommunicationChannelPriceTypeRequest` / `ChangeApplicationPriceTypeRequest`
  - `ChangeCommunicationChannelPriceValueRequest` / `ChangeApplicationPriceValueRequest`
- **Attribute / mechanism:** enum membership at attribute layer (`[ThrowIfNotEnumValue<ePricingType>]`); the Show-requires-Pricing conditional rule and the "hidden must-not-have-pricing" reverse rule are handler-level — they throw `PriceValueNotConfigured` / `PricingTypeNotConfigured` / `HiddenProductMustNotHavePricing` / `ActivationNotAllowedForHiddenProduct` (all 422)
- **Error codes:**
  - `FalconKeys.Error.PriceValueNotConfigured` (422) — Visibility=Show without Price Value
  - `FalconKeys.Error.PricingTypeNotConfigured` (422) — Visibility=Show without Pricing Type
  - `FalconKeys.Error.HiddenProductMustNotHavePricing` (422) — pricing supplied while Visibility=Hide
  - `FalconKeys.Error.InvalidPriceValue` (400) — value < 0 or non-numeric
  - `FalconKeys.Error.InvalidPriceType` (400) — value outside `ePricingType` set
  - `FalconKeys.Error.ActivationNotAllowedForHiddenProduct` (422) — `DoPayment` while hidden
  - `FalconKeys.Error.CannotEnableNonVisibleService` (422) — Enable while Hide
- **Source files:**
  - [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md) — `CreateAccountRequest` (`Service.AppId`, `Service.PriceType`)
  - [ERRORS](../../../Brain%20Outputs/understanding/backend/commerce/ERRORS.md) — 422 + 400 sections
  - [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md) — `ChangeCommunicationChannelPriceTypeRequest` etc.

## Frontend implementation hint

- **Form / page section:**
  - Add Client wizard — Steps 3 (CommChannels) + 4 (Applications) — per-row visibility / price-type / price-value editor
  - [[Organization Hierarchy]] `comm-channels-tab` + `apps-services-tab` — table rows with inline edit (related to the recent shadow-row notch work — see [[LE-20260515-commchannels-shadow-row-notch-alignment]])
- **Suggested validator wiring:**
  - Reactive form **conditional validators** wired to the `visibility` control:
    - `visibility.valueChanges.subscribe(v => { if (v === 'Show') { priceType.setValidators([Validators.required]); priceValue.setValidators([Validators.required, Validators.min(0)]); } else { priceType.clearValidators(); priceValue.clearValidators(); } })`
  - Enum-membership validator on `priceType` wired to the shared `ePricingType` TS enum
  - `Validators.min(0)` on `priceValue` (PRD: ≥ 0 SAR)
  - Reverse rule: when toggling Show → Hide, optionally clear price fields client-side (matches `HiddenProductMustNotHavePricing`)
- **Page note:** [[Organization Hierarchy]] — both `comm-channels-tab` and `apps-services-tab` sections already listed in the page note

## Cross-domain links

- **Permission gate:** [[Falcon Roles Permission Matrix]] — Falcon-side visibility/pricing edits are role-gated (System Admin + Product allowed; Operation = Not Allow per the Permission sheet — verify)
- **Business rule cluster:**
  - [[01 Account Management]] BR-AM-14 → BR-AM-22 (visibility / pricing / activation cluster)
  - W4 activation depends on Show + paid Master Wallet
  - Open: `BR-AM-40` — behavior when Visibility flips Show → Hide while Status is Active is silent (PRD); see [[GAPS_INDEX]]
- **Related learning events:** [[LE-20260515-commchannels-shadow-row-notch-alignment]] (same UI surface — inline-edit shadow rows on the CommChannels/Apps tables)

## Tags

#type/v-rule #status/triangulated #prd/01 #service/commerce #severity/high #drift

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
