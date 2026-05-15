*** Validation V-contract-expiration-after-start — Expiration > Start AND > now ***
*** Origin: PRD-03 Contract Packaging Charging Billing · Backend: commerce · 2026-05-15 ***

# V-contract-expiration-after-start — Expiration Date must be > Start Date AND > now

> The contract's Expiration Date must be strictly greater than its Start Date AND strictly greater than the current moment. This is enforced at Create *and* every Edit (including extension of an Expired contract — the rule is what reactivates it from Expired → Active via workflow `W4`).

## Origin (PRD)

- **PRD:** [[03 Contract Packaging Charging Billing]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md)
- **Rule id:** `BR-CC-07` (also cross-cuts `BR-CC-06` for Start Date floor and `BR-CC-16`/`BR-CC-17` for status-aware re-validation)
- **PRD line reference:** "Expiration Date must be > Start Date AND > now (mandatory); time-of-day is 23:59:59.999." (`latest-prd.md:25, 83, 85`)
- **Workflow citation:** [WORKFLOWS](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/WORKFLOWS.md) §W1 Step 1 · §W4 Step 1 (Extension validates `new Expiration > now AND > Start Date`) · §W5 Step 1 (Edit re-validates per status)
- **Excel cell:** none — date picker in the wizard

## Backend enforcement

- **Service:** [[Commerce Service]]
- **DTO:** `CreateContractRequest` · `UpdateContractRequest` (fields: `StartDate`, `EndDate`)
- **Attribute:** `[Required]` on both fields per [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md) ("All scalar fields `[Required]`"). The **cross-field comparison** (`EndDate > StartDate AND > now`) is **not** a DataAnnotation — it is enforced at **handler-time** ("Handler-Level Validation" in [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md) §"Pre-finish Validation Hook" point 2).
- **Error code:** `FalconKeys.Error.EffectiveDateMustBeInFuture` (422) when EndDate ≤ now · `FalconKeys.Error.InvalidContractConfiguration` (422) when EndDate ≤ StartDate · `FalconKeys.Error.RequiredFieldMissing` (400) when null. Codes per [ERRORS](../../../Brain%20Outputs/understanding/backend/commerce/ERRORS.md) §"422 — Unprocessable Entity" and §"400 — Bad Request".
- **DTO dictionary:** [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md) — `CreateContractRequest` lists `StartDate, EndDate` as required scalars
- **Note (`inferred`):** Exact handler exception mapping for the cross-field rule isn't recorded byte-for-byte in `VALIDATIONS.md`; the listed 422 codes are the closest semantic match. Verify by triggering a `EndDate < StartDate` payload.

## Frontend implementation hint

- **Form / page section:** Add Contract wizard → **Step 1 — Contract Information** → Start Date + Expiration Date pickers. Same pair in Edit Contract for **Pending** status, and Expiration alone (Start locked) for **Active/Expired** status — see [[V-contract-edit-status-aware-fields]].
- **Suggested validator wiring:** Cross-field validator at the `FormGroup` level, e.g. `(group) => group.value.endDate > group.value.startDate && group.value.endDate > new Date() ? null : { endBeforeStart: true }`. Min-date constraint on the Expiration picker = `max(startDate + 1ms, now)`. Display the working time-of-day rule (`23:59:59.999`) in a helper text or apply it implicitly server-side.
- **Page note:** Contracts page **not yet seeded** under `10-Pages/`. Date-picker selection ([[Falcon Input]] vs a dedicated date component) is `inferred`.

## Cross-domain links

- **Permission gate:** Falcon-only edit (`BR-CC-01`)
- **Business rule cluster:** `BR-CC-06` (Start Date ≥ today 00:00) · `BR-CC-10` (status auto-derived from these dates) · `BR-CC-17` (extending Expired → Active relies on this rule for the new Expiration) · [[V-contract-edit-status-aware-fields]] (status decides if Start Date is editable at all)
- **Workflow dependency:** §W2 (Pending → Active auto-transition) · §W3 (Active → Expired auto-transition) · §W4 (Extension) — all three workflows depend on this validator holding at write-time.
- **Related learning events:** none
- **Open question:** `BR-CC-47` (retroactive treatment when Expired→Active extension covers an Expired window) — OPEN.

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
