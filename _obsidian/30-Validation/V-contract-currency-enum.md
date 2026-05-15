---
type: validation-rule
id: V-contract-currency-enum
prd: PRD-03
service: commerce
severity: high
status: triangulated
drift: false
created: 2026-05-15
---
*** Validation V-contract-currency-enum — Contract Currency must be eCurrency member ***
*** Origin: PRD-03 Contract Packaging Charging Billing · Backend: commerce · 2026-05-15 ***

# V-contract-currency-enum — Currency must be a valid `eCurrency` value

> The contract currency must be a known member of the platform enum `eCurrency`. PRD-03 uses SAR exclusively; allowing free strings here would corrupt the SAR↔Points conversion and the entire charging cascade.

## Origin (PRD)

- **PRD:** [[03 Contract Packaging Charging Billing]]
- **Source file:** [ENTITIES](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/ENTITIES.md)
- **Rule id:** none assigned in PRD body; entity invariant — `Contract.currency: eCurrency (Commerce DTO uses this). PRD uses SAR exclusively.`
- **PRD line reference:** [ENTITIES](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/ENTITIES.md) — "Status enumeration" subsection
- **Cross-ref:** `BR-CC-08` ("Contract Value (SAR)…") implies SAR is the working currency; SAR↔Points conversion in `BR-CC-19` assumes a single currency at contract scope.
- **Excel cell:** none

## Backend enforcement

- **Service:** [[Commerce Service]]
- **DTO:** `CreateContractRequest` · `UpdateContractRequest` (field: `Currency`)
- **Attribute:** `[Required] [EnumDataType(typeof(eCurrency))]`
- **Error code:** `FalconKeys.Error.InvalidValue` (when value falls outside the enum) · `FalconKeys.Error.RequiredFieldMissing` (when null/default and `[Required]` fires)
- **Source file:** [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md) — "`[EnumDataType(typeof(eCurrency))] on Currency`" under DataAnnotations-Based Validation
- **Domain enum:** `eCurrency` declared in `Falcon.Commerce.Domain.Constants` — see [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md) "Domain Enums" section
- **Contrast with Charging:** [Charging VALIDATIONS](../../../Brain%20Outputs/understanding/backend/charging/VALIDATIONS.md) explicitly notes "Currency is bound as enum but no `[EnumDataType]` is applied" — Commerce is stricter than Charging on this field. Verify cross-service consistency.

## Frontend implementation hint

- **Form / page section:** Add Contract wizard → **Step 1 — Contract Information** → Currency dropdown (likely [[Falcon Dropdown]]). Lock to SAR for current PRD scope; expose enum members programmatically from a lookup endpoint or a typed `enum eCurrency` constant.
- **Suggested validator wiring:** Bind to a `FormControl<eCurrency>` with `Validators.required`; restrict the option list to enum values; consider hiding the field entirely (default SAR) until multi-currency is in scope.
- **Page note:** Contracts page **not yet seeded** under `10-Pages/`. Enum-bound dropdown component choice is `inferred`.

## Cross-domain links

- **Permission gate:** Falcon-only edit (`BR-CC-01`)
- **Business rule cluster:** [[V-contract-committed-value-positive]] (Currency scopes the unit of value) · `BR-CC-19` (SAR↔Points conversion is currency-scoped)
- **Related learning events:** none
- **Open question:** PRD silent on multi-currency contracts within one account — `BR-CC-44` (Tax / VAT silent) is the closest open gap

## Tags

#type/v-rule #status/triangulated #prd/03 #service/commerce #severity/medium #gap

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
