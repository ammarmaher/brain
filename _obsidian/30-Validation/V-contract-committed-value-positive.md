*** Validation V-contract-committed-value-positive — Contract Value must be strictly positive ***
*** Origin: PRD-03 Contract Packaging Charging Billing · Backend: commerce · 2026-05-15 ***

# V-contract-committed-value-positive — Contract Value (SAR) must be > 0

> The contract's committed monetary value (the lump sum funded into the Master Wallet on Active) must be a strictly positive decimal. Zero or negative defeats the entire charging cascade — there's nothing to deduct against.

## Origin (PRD)

- **PRD:** [[03 Contract Packaging Charging Billing]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md)
- **Rule id:** `BR-CC-08`
- **PRD line reference:** "Contract Value (SAR) is a positive float, <= hundreds of millions, mandatory." (`latest-prd.md:25, 84`)
- **Workflow citation:** [WORKFLOWS](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/WORKFLOWS.md) §W1 Step 1 — "Value SAR (>0 float, <=hundreds-of-millions)"
- **Excel cell:** none — value is free-typed in the wizard

## Backend enforcement

- **Service:** [[Commerce Service]]
- **DTO:** `CreateContractRequest` · `UpdateContractRequest` (field: `CommittedValue`)
- **Attribute:** `[Required] [Range(typeof(decimal), "0.0000001", "79228162514264337593543950335")]`
- **Error code:** `FalconKeys.Error.RequiredFieldMissing` (when null) · `FalconKeys.Error.InvalidValue` (when ≤ 0) — both 400 per `[ErrorHttpStatus]`
- **Source file:** [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md) — "DataAnnotations-Based Validation" section, line `[Range(typeof(decimal), "0.0000001", "79228162514264337593543950335")] on CommittedValue (positive decimal)`
- **DTO dictionary:** [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md) — `CreateContractRequest`
- **Entity link:** `Contract.valueSar` per [ENTITIES](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/ENTITIES.md)
- **PRD upper bound:** "hundreds of millions" is NOT enforced by `[Range]` (cap is `decimal.MaxValue`) — `inferred` gap, no backend block

## Frontend implementation hint

- **Form / page section:** Add Contract wizard → **Step 1 — Contract Information** → field `Contract Value (SAR)` (numeric input). Same field in Edit Contract dialog (Pending status only — see [[V-contract-edit-status-aware-fields]]).
- **Suggested validator wiring:** `[Validators.required, Validators.min(0.0000001)]` on a `FormControl<number | null>`; consider `inputMode="decimal"` and a thousands-separator mask; submit-time numeric coercion before POST.
- **Page note:** Contracts page **not yet seeded** under `10-Pages/` — frontend home is `inferred` from the Commerce `POST /Contracts` contract.

## Cross-domain links

- **Permission gate:** Falcon usertype only (`BR-CC-01`) — Account Owner / Node Admin never see the field as editable. Backend enforces via `[Authorize(Policy = AuthorizationPolicies.FalconOnly)]` on `POST /Contracts`.
- **Business rule cluster:** [[V-contract-expiration-after-start]] (same wizard step) · `BR-CC-37` (Contract Value flows into Master Wallet on Active) · `BR-CC-31` (nearest-expiring cascade depends on a non-zero remaining)
- **Related learning events:** none

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
