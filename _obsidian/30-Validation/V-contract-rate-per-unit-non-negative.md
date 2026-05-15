---
type: validation-rule
id: V-contract-rate-per-unit-non-negative
prd: PRD-03
service: commerce
severity: medium
status: triangulated
drift: false
created: 2026-05-15
---
*** Validation V-contract-rate-per-unit-non-negative — RatePerUnit must be ≥ 0 ***
*** Origin: PRD-03 Contract Packaging Charging Billing · Backend: commerce · 2026-05-15 ***

# V-contract-rate-per-unit-non-negative — Contract Details matrix cost ≥ 0

> Every cell of the Contract Details matrix (Application × CommChannel × Priority × Destination → SAR cost) must be a non-negative decimal. Zero is legal (free service / promo), negative is not (the charging cascade would *credit* the wallet on send).

## Origin (PRD)

- **PRD:** [[03 Contract Packaging Charging Billing]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md)
- **Rule id:** `BR-CC-22` (Cost = f(Application, CommChannel, Priority, Destination) → SAR cost)
- **PRD line reference:** "Cost is a function of (Application, CommChannel, Priority/ServiceType, Destination) -> SAR cost." (`latest-prd.md:31`)
- **Workflow citation:** [WORKFLOWS](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/WORKFLOWS.md) §W1 Step 3 — "fill matrix of Application x CommChannel x Priority/ServiceType x Destination -> Cost SAR"
- **Excel cell:** none — matrix cells are user-typed in Step 3

## Backend enforcement

- **Service:** [[Commerce Service]]
- **DTO:** `CreateContractRequest.Rates[]` → nested `ContractRateRequest` (field: `RatePerUnit`)
- **Attribute:** `[Required] [Range(typeof(decimal), "0", "79228162514264337593543950335")]`
- **Error code:** `FalconKeys.Error.RequiredFieldMissing` (null) · `FalconKeys.Error.InvalidValue` (negative)
- **Source file:** [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md) — "`[Range(typeof(decimal), "0", ...)] on RatePerUnit, PriceValue, IncludedAmount, IncludedUnits, UnitPrice (non-negative decimal)`"
- **DTO dictionary:** [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md) — `ContractRateRequest (nested)` — fields `ApplicationId, ChannelId, Priority, Destination, Unit, RatePerUnit`
- **Same `[Range]` also applied to:** `PriceValue` (RateCardEntry) · `IncludedAmount` / `IncludedUnits` (Quotas) · `UnitPrice` (OverageRates) — same rule fans out across all four nested DTOs

## Frontend implementation hint

- **Form / page section:** Add Contract wizard → **Step 3 — Contract Details** → matrix grid; one numeric cell per (App × Channel × Priority × Destination). Same matrix in Edit Contract regardless of status (matrix is editable in both Pending and Active/Expired per `BR-CC-15`/`BR-CC-16`).
- **Suggested validator wiring:** `[Validators.required, Validators.min(0)]` on each cell `FormControl<number | null>`; row-level validator to highlight empty cells before submit; consider a "Free" presentation when value === 0.
- **Page note:** Contracts page **not yet seeded** under `10-Pages/`. Matrix likely a [[Falcon Data Table]] in edit mode — `inferred`.

## Cross-domain links

- **Permission gate:** Falcon-only edit (`BR-CC-01`). Account Owner sees the matrix view-only (`BR-CC-40`).
- **Business rule cluster:** [[V-charging-no-applicable-rate]] (a missing matrix cell → `NoApplicableRate` at charge time, not at contract save) · `BR-CC-23`/`BR-CC-24`/`BR-CC-25` (Priority taxonomies per CommChannel) · `BR-CC-32` (Send Transaction reads from this matrix)
- **Related learning events:** none

## Tags

#type/v-rule #status/triangulated #prd/03 #service/commerce #severity/medium

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
