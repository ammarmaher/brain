*** Add Client — Step 3 CommChannels & Services ***
*** SoT for implementation · Page: Organization Hierarchy · 2026-05-15 ***
*** Part of: Brain Outputs/understanding/pages/organization-hierarchy/Add Client/ ***

# Step 3 — CommChannels & Services (OPTIONAL)

**Source-of-truth references**
- PRD: BUSINESS_RULES `BR-AM-14` → `BR-AM-18` (visibility default Hide, Show ⇒ price required, pricing type enum, price ≥ 0 SAR, step is optional).
- PRD: WORKFLOWS §W1 step 3 (`latest-prd.md:47-48`).
- PRD: ENTITIES `CommChannelConfig` row.
- Backend: `CreateAccountRequest.CommChannels { List<Service> Services }` (nested).
- Entity reconciliation: [[E-comm-channel-config]] — surfaces accountId→NodeId drift, visibility enum→bool drift, status 6-value enum not exposed as single field, future-scheduled price change extra on backend.

**Screen / section**
- Wizard step 3 panel — single-table layout using [[Falcon Data Table]]. Each row is a CommChannel from the master catalog (`GET /api/CommunicationChannel` returns `List<CommunicationChannelResponse> { id, name (MultiLanguage), icon }`) pre-fetched on step open.

## Per-row fields

| Field | Type / UI | PRD rule | Backend DTO field | V-rule | Frontend validator (Angular) | Drift |
|---|---|---|---|---|---|---|
| CommChannel Name | display ([[Falcon Tag]] or text cell with [[Falcon Icon]]) — MultiLanguage(En, Ar) | Master catalog read | `CommunicationChannelResponse.Name` (MultiLanguage) · `CommunicationChannelResponse.Icon` | — | Read-only. Render using i18n locale switch (PRD-style multi-language). | — |
| Visibility | [[Falcon Toggle]] — default OFF (= Hide) | BR-AM-14: default Hide | (write) maps to `Service` row inclusion. **Important nuance:** the `CreateAccountRequest.CommChannels.Services` list is sparse — only channels the admin actively configures are sent. Channels NOT in the list inherit `Hide` server-side. | [[V-service-visibility-pricing-required]] | Initial state: OFF (Hide) for every row. Toggling ON enables the Pricing Type + Price Value inputs and makes them required (reactive form: `valueChanges.subscribe` switches validators on/off). | ⚠ enum→bool drift (E-comm-channel-config). |
| Pricing Type | dropdown ([[Falcon Dropdown]]) — Monthly / Yearly / One Time Payment | BR-AM-16: 3-value enum | `Service.PriceType` `[ThrowIfNotEnumValue<ePricingType>]` | [[V-service-visibility-pricing-required]] | **Conditional:** required when Visibility = Show. `Validators.required` + enum-membership validator. Cleared when Visibility flips to Hide (matches `HiddenProductMustNotHavePricing` reverse rule). Backend enum value `One Time Payment` likely encoded as `OneTimePayment` — verify against `ePricingType` enum definition. | — |
| Price Value | numeric input ([[Falcon Input Number]]) with SAR suffix | BR-AM-17: ≥ 0 SAR | (inferred — part of `Service` nested type beyond the documented `AppId, PriceType` fields; see DTO drill-down for full shape) | [[V-service-visibility-pricing-required]] | **Conditional:** required when Visibility = Show. `Validators.required` + `Validators.min(0)`. Server returns `PriceValueNotConfigured` (422) or `InvalidPriceValue` (400) on failure. Cleared when Visibility flips to Hide. | ⚠ DRIFT — `Service` nested type field list not fully documented in `DTO_DICTIONARY.md` (only `AppId, PriceType` enumerated). Surface as documentation gap. |

**Per-row note:** the master `CommunicationChannelResponse` carries the channel id; the per-row form binds it to `Service.AppId` (the backend uses the same `AppId` field name for both CommChannels and Apps — confusing but intentional).

## Step 3 cross-field rule (the central rule of the step)

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

## Backend call on Next

- None. Step 3 data buffered locally as a sparse list (only rows where Visibility was turned on).

## Permission gate

- Same as overall flow. **Note:** the standalone visibility/pricing edit endpoints (`PUT /api/Node/comm-channel/visibility`, `PUT /api/Node/comm-channel/price-type`, `PUT /api/Node/comm-channel/price-value`) carry `[Authorize(Policy = "FalconOnly")]` per `ENDPOINT_REGISTRY.md`. The create-time path inside `CreateAccountRequest` inherits the parent endpoint's auth, which is Falcon System Admin + Product (the matrix above). See [01-PERMISSIONS](01-PERMISSIONS.md).

## Status lifecycle context (for FE awareness — not editable in this step)

- Status starts at `InActive (First time)` per BR-AM-20 once the account is created with the channel in `Show` state.
- Transitions to `Paid` → `Active` happen later via `POST /api/Node/comm-channel/do-payment` (W4 Activation flow — not in this wizard).
- Status 6-value enum is **not exposed as a single field** on response DTOs — see [[E-comm-channel-config]] documentation gap.

## See also (Add Client folder)

- [README](README.md) — folder index
- [00-OVERVIEW](00-OVERVIEW.md)
- [01-PERMISSIONS](01-PERMISSIONS.md)
- [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md)
- [03-STEP_2_SETTINGS](03-STEP_2_SETTINGS.md)
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

- [[Organization Hierarchy]] · [[01 Account Management]] · [[Commerce Service]] · [[V-service-visibility-pricing-required]] · [[E-comm-channel-config]] · [[Falcon Data Table]] · [[Falcon Toggle]] · [[Falcon Dropdown]] · [[Falcon Input Number]] · [[Falcon Tag]] · [[Falcon Icon]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]]
