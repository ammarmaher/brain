*** Validation V-charging-no-applicable-rate — every charge must resolve a Contract Details matrix cell ***
*** Origin: PRD-03 Contract Packaging Charging Billing · Backend: charging · 2026-05-15 ***

# V-charging-no-applicable-rate — Send Transaction requires a matching (Application × Channel × Priority × Destination) rate

> A charge can only proceed when the OCS rate engine resolves a price for the requested (ApplicationId, ChannelId, Priority, Destination, Unit) tuple against the nearest-expiring Active contract's Contract Details matrix. A missing cell isn't an end-user input error — it's a contract-configuration gap — but the validation surfaces on every Send Transaction, Do Payment, and Activate cascade.

## Origin (PRD)

- **PRD:** [[03 Contract Packaging Charging Billing]]
- **Source file:** [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/BUSINESS_RULES.md)
- **Rule id:** `BR-CC-22` (Cost = f(Application, CommChannel, Priority/ServiceType, Destination) → SAR cost) + `BR-CC-32` (Send Transaction reads from the matrix of the nearest-expiring Active contract)
- **PRD line reference:**
  - `BR-CC-22` — "Cost is a function of (Application, CommChannel, Priority/ServiceType, Destination) -> SAR cost." (`latest-prd.md:31`)
  - `BR-CC-32` — "Send Transaction (Normal User via App): … iterate nearest-expiring Active contracts -> deduct per Contract Details matrix …" (`latest-prd.md:62; understanding.md:74-75`)
- **Workflow citation:** [WORKFLOWS](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/WORKFLOWS.md) §W6 Step 2 "Look up cost in Contract Details matrix of the nearest-expiring Active contract" · Failure modes "No matching matrix cell"
- **Excel cell:** none — matrix is populated by Falcon admins in Add Contract Step 3 (the matrix lives in `Brain Outputs/prd/modules/03-.../ENTITIES.md` as `ContractDetail`)

## Backend enforcement

- **Service:** [[Charging Service]]
- **DTO:** `ReserveWalletChargeRequest` (fields: `ApplicationId`, `ChannelId`, `Priority`, `Destination`, `Unit`) · `DirectDebitRequest` (same lookup shape)
- **Attribute:** None — DTOs ship with hardcoded defaults (`Priority="NONE"`, `Destination="ANY"`) per [Charging VALIDATIONS](../../../Brain%20Outputs/understanding/backend/charging/VALIDATIONS.md) §"DTO-Level Validation". The lookup happens **handler-side**: `IReserveWalletChargeHandler` / `IDirectDebitHandler` perform the rate-engine resolution against the active contract.
- **Error code:** `FalconKeys.Error.NoApplicableRate` — per [Charging ERRORS](../../../Brain%20Outputs/understanding/backend/charging/ERRORS.md): "Requested `ApplicationId/ChannelId/Priority/Destination/Unit` combo has no contract rate". Likely 422 per the inference table (`Invalid*`/`No*Applicable*` pattern).
- **Source file:** [Charging VALIDATIONS](../../../Brain%20Outputs/understanding/backend/charging/VALIDATIONS.md) §"Handler-Level Validation" point 5 "Rate evaluation — `NoApplicableRate` when the requested `ApplicationId/ChannelId/Priority/Destination` combo doesn't match any contract rate"
- **Surfacing guidance:** [Charging ERRORS](../../../Brain%20Outputs/understanding/backend/charging/ERRORS.md) §"Rate Errors" — "The frontend cannot fix this — it indicates a contract configuration gap. Show a user-friendly 'Service not configured' message and surface it to ops."
- **Charge upstream:** the matrix is **written by Commerce** ([[Commerce Service]] `CreateContractRequest.Rates[]` → `ContractRateRequest` mapped to `ContractDetail` per [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md) + [ENTITIES](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/ENTITIES.md) §"Code-side mapping"). Charging is the *reader* — a missing cell here is a Commerce data gap.

## Frontend implementation hint

- **Form / page section:**
  - **At Send Transaction time** (inside an Application's campaign composer or Do Payment popup): catch the 422 `NoApplicableRate` and display a non-actionable "Service not configured" toast/dialog — block submit. The user cannot fix it; an ops-facing breadcrumb (campaign id + missing tuple) goes to support.
  - **At contract Add/Edit time:** This is the *real* user-fixable home. The Step 3 matrix should expose a "coverage warning" — for each (Application × Channel × Priority × Destination) tuple expected by the account's visible services, highlight cells left blank. PRD-03 doesn't mandate this (silent), so it's an `inferred` UX enhancement.
- **Suggested validator wiring:**
  - Send Transaction surface: parse the response body, match against `NoApplicableRate` error code, render the localized message + a "Contact support / Operations" CTA.
  - Add Contract Step 3 surface: a row-level validator that compares the matrix's filled rows to the account's `VisibleCommunicationChannelResponse` list and emits per-row warnings. Not a hard block (PRD allows partial matrices — verify), but a strong nudge.
- **Page note:** Both surfaces unsettled — Send Transaction is per-Application; Add Contract Step 3 page **not yet seeded** under `10-Pages/`. Matrix component choice ([[Falcon Data Table]] in edit mode) is `inferred`.

## Cross-domain links

- **Permission gate:** Reading rates: any role calling Send Transaction. Writing rates: Falcon-only per `BR-CC-01`.
- **Business rule cluster:** [[V-contract-rate-per-unit-non-negative]] (the cells whose absence triggers this) · [[V-charging-insufficient-balance]] (the *next* possible failure after the rate resolves) · `BR-CC-23`/`BR-CC-24`/`BR-CC-25` (Priority taxonomies that define the matrix axes) · `BR-CC-26` (Destinations come from the International Phone# Destination List)
- **Related learning events:** none
- **Open question:** `BR-CC-50` (Addons rate-card fallback when no matching addon — silent, flagged in root-documents)

## Hubs

- [[VALIDATION_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
