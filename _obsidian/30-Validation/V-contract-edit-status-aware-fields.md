*** Validation V-contract-edit-status-aware-fields — edit gates differ by contract status ***
*** Origin: PRD-03 Contract Packaging Charging Billing · Backend: commerce · 2026-05-15 ***

# V-contract-edit-status-aware-fields — Pending allows full edit; Active/Expired locks Name, Value, Start Date

> Field-level edit permissions depend on the contract's *current* auto-derived status. Pending = full edit (everything except auto IDs). Active/Expired = limited (Farabi Ref ID, Expiration Date, Rate Card price value, Contract Details matrix, Addons). Locking is what keeps the SAR↔Points conversion and the Master Wallet record consistent after a contract starts spending.

## Origin (PRD)

- **PRD:** [[03 Contract Packaging Charging Billing]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md)
- **Rule id:** `BR-CC-15` (Pending full edit set) + `BR-CC-16` (Active/Expired restricted set) + `BR-CC-17` (Extension)
- **PRD line reference:**
  - `BR-CC-15` — "Pending contract edit (Falcon only): editable = Name, Farabi Ref ID, Start Date, Expiration Date, Value, Rate Card, Contract Details grid, Addons values." (`latest-prd.md:53`)
  - `BR-CC-16` — "Active / Expired contract edit (Falcon only): editable = Farabi Ref ID, Expiration Date (must be > now AND > Start Date), Rate Card price value, Contract Details grid, Addons values. Locked: Name, Value, Start Date." (`latest-prd.md:54, 86`)
- **Workflow citation:** [WORKFLOWS](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/WORKFLOWS.md) §W5 Step 1 (the entire edit branches on status)
- **Excel cell:** none

## Backend enforcement

- **Service:** [[Commerce Service]]
- **DTO:** `UpdateContractRequest` (route: `PUT /api/Contracts/{contractId}`)
- **Attribute:** None — DataAnnotations on the DTO are status-blind. The status-aware gate is enforced **inside the handler** (per [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md) §"Pre-finish Validation Hook" — point 2 "Handler-time"). The handler reads the current `Contract.status`, computes the allowed field set, and throws when a locked field changed.
- **Error code:** `FalconKeys.Error.ContractEditOnlyAllowedWhenPending` (422) — explicitly listed in [ERRORS](../../../Brain%20Outputs/understanding/backend/commerce/ERRORS.md) §"422 — Unprocessable Entity". Companion `FalconKeys.Error.InvalidContractConfiguration` (422) covers structural violations after the gate.
- **Source file:** [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md) — handler-layer paragraph · [ERRORS](../../../Brain%20Outputs/understanding/backend/commerce/ERRORS.md) — `ContractEditOnlyAllowedWhenPending` row
- **Response side:** `ContractResponse.CanEdit` boolean (see [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md) — `ContractResponse : ContractSummaryResponse`) — frontend MUST read this and reflect the per-status field set rather than rebuilding the matrix locally.

## Frontend implementation hint

- **Form / page section:** Edit Contract dialog (entry from Contracts & Cost Mng list row). Reuses the 4-step wizard layout, but with per-step field disabling.
- **Suggested validator wiring:**
  - Read `ContractResponse.Status` + `ContractResponse.CanEdit` from `GET /Contracts/{contractId}` first.
  - Compute an `editableFields: Set<keyof ContractForm>` at the parent level. Pending → all 8 fields (Name, FarabiRef, StartDate, EndDate, Value, RateCard[*], Details[*], Addons[*]). Active/Expired → `{ FarabiRef, EndDate, RateCard.PriceValue, Details[*], Addons[*] }`.
  - Apply `[disabled]="!editableFields.has('xxx')"` per control. Do NOT rely on disabled-only — also strip locked fields client-side before POST (defense in depth).
  - On Expired→Active extension (workflow `W4`), keep the form in "Active/Expired" mode until the save reloads the contract — the status flip is server-side.
- **Page note:** Contracts page **not yet seeded** under `10-Pages/`. The `CanEdit` boolean is the contract surface; per-field flags are `inferred` from the PRD field lists.

## Cross-domain links

- **Permission gate:** Falcon-only (`BR-CC-01`). AO/Node Admin see read-only contracts per `BR-CC-40` — no Edit button reaches them.
- **Business rule cluster:** [[V-contract-expiration-after-start]] (re-runs on every status — locked Start vs. open End in Active/Expired) · [[V-contract-committed-value-positive]] (locked in Active/Expired, editable in Pending) · `BR-CC-10` (status is auto-derived — frontend never edits status directly)
- **Related learning events:** none
- **Open question:** `BR-CC-46` (audit log granularity for contract edits — MISSING) · `BR-CC-48` (cancellation of Pending contracts — silent)

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
