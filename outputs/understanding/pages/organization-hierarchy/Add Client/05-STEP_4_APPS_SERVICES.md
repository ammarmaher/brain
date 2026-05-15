*** Add Client — Step 4 Apps & Services ***
*** SoT for implementation · Page: Organization Hierarchy · 2026-05-15 ***
*** Part of: Brain Outputs/understanding/pages/organization-hierarchy/Add Client/ ***

# Step 4 — Apps & Services (OPTIONAL)

**Source-of-truth references**
- PRD: BUSINESS_RULES `BR-AM-14` → `BR-AM-18` (same set as Step 3; PRD explicitly says "same shape").
- PRD: WORKFLOWS §W1 step 4 (`latest-prd.md:50-51`).
- PRD: ENTITIES `AppConfig` row.
- Backend: `CreateAccountRequest.Applications` (parallel `List<Service> Services` under the shared `Service` nested type).
- Entity reconciliation: [[E-app-config]] — same drift items as `E-comm-channel-config` (PRD calls out "same shape").

**Screen / section**
- Wizard step 4 panel — single-table layout using [[Falcon Data Table]]. Each row is an Application from the master catalog (`GET /api/Application` returns `List<ApplicationResponse> { id, name (MultiLanguage), icon }`) pre-fetched on step open.

## Per-row fields

Mirror of Step 3, swapping CommChannel for Application:

| Field | Type / UI | PRD rule | Backend DTO field | V-rule | Frontend validator | Drift |
|---|---|---|---|---|---|---|
| Application Name | display ([[Falcon Tag]] or text cell with [[Falcon Icon]]) | Master catalog read | `ApplicationResponse.Name` (MultiLanguage) · `ApplicationResponse.Icon` | — | Read-only | — |
| Visibility | [[Falcon Toggle]] — default OFF | BR-AM-14 | Sparse list inclusion in `Applications.Services` | [[V-service-visibility-pricing-required]] | Same wiring as Step 3 | ⚠ enum→bool |
| Pricing Type | dropdown ([[Falcon Dropdown]]) | BR-AM-16 | `Service.PriceType` `[ThrowIfNotEnumValue<ePricingType>]` | [[V-service-visibility-pricing-required]] | Conditional on Visibility = Show | — |
| Price Value | numeric input ([[Falcon Input Number]]) SAR | BR-AM-17 | (inferred — `Service` nested type, fields beyond `AppId, PriceType` not documented) | [[V-service-visibility-pricing-required]] | Conditional on Visibility = Show. `Validators.required` + `Validators.min(0)` | ⚠ Documentation gap |

**Important asymmetry:** Commerce treats CommChannels and Applications as **mirror endpoints** (12 endpoints duplicated across the two). The PRD calls this out as "same shape" but the backend has a single `Service` nested type with `AppId, PriceType` — naming is confusing because `AppId` is also used for CommChannel rows. This is intentional code reuse, not a bug. Future API consolidation is on the table (see E-app-config notes).

## Step 4 cross-field rule

Same as Step 3 — see [04-STEP_3_COMM_CHANNELS](04-STEP_3_COMM_CHANNELS.md):

- **`HiddenProductMustNotHavePricing` (422)** — pricing supplied while Visibility = Hide.
- **`PriceValueNotConfigured` (422)** + **`PricingTypeNotConfigured` (422)** — Visibility = Show without complete price tuple.

Same canonical Reactive Forms wiring per [[V-service-visibility-pricing-required]].

## Backend call on Next

- None. Step 4 data buffered locally.

## Permission gate

- Same as overall flow. See [01-PERMISSIONS](01-PERMISSIONS.md).

## Status lifecycle context (for FE awareness — not editable in this step)

- AppConfig status starts at `InActive (First time)` per BR-AM-20.
- Transitions to `Paid` → `Active` happen later via `POST /api/Node/application/do-payment` (W4 Activation flow — not in this wizard).
- Status 6-value enum is **not exposed as a single field** on response DTOs — see [[E-app-config]].

## See also (Add Client folder)

- [README](README.md) — folder index
- [00-OVERVIEW](00-OVERVIEW.md)
- [01-PERMISSIONS](01-PERMISSIONS.md)
- [02-STEP_1_BASIC_INFO](02-STEP_1_BASIC_INFO.md)
- [03-STEP_2_SETTINGS](03-STEP_2_SETTINGS.md)
- [04-STEP_3_COMM_CHANNELS](04-STEP_3_COMM_CHANNELS.md)
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

- [[Organization Hierarchy]] · [[01 Account Management]] · [[Commerce Service]] · [[V-service-visibility-pricing-required]] · [[E-app-config]] · [[Falcon Data Table]] · [[Falcon Toggle]] · [[Falcon Dropdown]] · [[Falcon Input Number]] · [[Falcon Tag]] · [[Falcon Icon]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]]
