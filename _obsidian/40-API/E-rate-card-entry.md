*** Entity Reconciliation E-rate-card-entry — RateCardEntry ***
*** PRD: PRD-03 Contract Packaging Charging Billing · Backend service: commerce · 2026-05-15 ***

# E-rate-card-entry — RateCardEntry

> Per-CommChannel pricing row inside a contract that defines the SAR↔Points conversion. PRD models one entry per CommChannel; backend Commerce models it as `ContractUnitConversionRequest` / `ContractUnitConversionResponse` nested inside the Contract aggregate. **Backend drops the explicit CommChannel link** — it carries `Code/Name/PriceUnit/RatingUnit/PriceValue` instead of `commChannelId`.

## PRD definition (business-conceptual)

- **PRD module:** [[03 Contract Packaging Charging Billing]]
- **Source:** [ENTITIES.md](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/ENTITIES.md)
- **PRD fields:**
  - `contractId`: ref → Contract
  - `commChannelId`: ref → CommChannel
  - `priceUnit`: ref → PriceUnit (from predefined list — DB-editable, BR-CC-21)
  - `priceValueSar`: positive decimal in SAR

## Backend DTO mapping

- **Service:** [[Commerce Service]]
- **DTO source:** [DTO_DICTIONARY.md](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md)
- **Validation source:** [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md)
- **Relevant DTOs:**
  - `ContractUnitConversionRequest` (nested under `CreateContractRequest.UnitConversions`) — request shape
  - `ContractUnitConversionResponse` (nested under `ContractResponse.TariffPlan.UnitConversions`) — response shape
- **ENTITIES.md code-side mapping** (verbatim from PRD entities): "`ContractUnitConversionRequest`: `Code, Name, PriceUnit, RatingUnit, PriceValue`. **Maps to RateCardEntry**."

## Field reconciliation

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `contractId` | _implicit_ (parent `CreateContractRequest` / route `{contractId}`) | ref → derived from aggregate | ✅ match (no explicit field on nested DTO; relationship is parent-child) |
| `commChannelId` | **(no direct field)** — `RatingUnit`? | ref → ? | ❌ **missing on request DTO** — `ContractUnitConversionRequest` carries no `ChannelId`. Response side `ContractUnitConversionResponse` also omits it. PRD models per-CommChannel pricing as a hard relationship; backend appears to either index by `Code` or hold the channel link inside the value semantics. **Verify against actual `.cs` file** |
| `priceUnit` | `PriceUnit` (ContractUnitConversionRequest) | ref → `string` (lookup id/code) `[Required]` | ✅ match — `PriceUnit` carried as-is. Verify if it's a `string` code or an enum |
| `priceValueSar` | `PriceValue` (ContractUnitConversionRequest) | positive decimal → `decimal` `[Required] [Range(decimal, "0", "79228162514264337593543950335")]` | ⚠ drift — backend allows `0`. PRD says "SAR↔Points conversion" implies a positive value. See [[V-contract-rate-per-unit-non-negative]] |
| _none_ | `Code` (ContractUnitConversionRequest) | _PRD silent_ | ➕ extra — backend identifier code |
| _none_ | `Name` (ContractUnitConversionRequest) | _PRD silent_ | ➕ extra — backend display name (likely the user-facing label of the conversion) |
| _none_ | `RatingUnit` (ContractUnitConversionRequest) | _PRD silent_ | ➕ extra — backend pairs `PriceUnit` with `RatingUnit`. May implicitly encode CommChannel via the unit combination |
| _none_ | `UnitConversionId` (ContractUnitConversionResponse) | _PRD has no explicit id_ | ➕ extra — backend issues a per-row id |
| _none_ | `Status` (ContractUnitConversionResponse) | _PRD silent — RateCardEntry has "n/a" lifecycle_ | ➕ extra — backend gives per-row status (likely tracks effective-date transitions) |

Legend: ✅ match · ⚠ drift · ❌ missing · ➕ extra-on-backend

## Drift / gaps summary

- ❌ **CommChannel link missing on backend DTO** — PRD says `RateCardEntry` is `N:1 CommChannel`, but `ContractUnitConversionRequest`/`Response` carry no `ChannelId`. The link may be encoded inside `Code`/`Name`/`RatingUnit` semantics or carried elsewhere. **Open question for backend** — high-severity gap if FE needs to render a per-CommChannel rate matrix
- ⚠ Lower-bound drift — PRD implies positive SAR value; backend `[Range]` allows `0`
- ➕ Backend introduces `Code`, `Name`, `RatingUnit`, `UnitConversionId`, `Status` not modeled in PRD `RateCardEntry`
- ⚠ The PriceUnit lookup table is DB-editable per BR-CC-21; FE must fetch dynamically — backend exposes via Commerce `/Lookup/{id}` (assumed)

## Related validation rules (V-rule notes)

- [[V-contract-rate-per-unit-non-negative]] — `[Range(decimal, "0", max)]` covers `PriceValue` along with `RatePerUnit`/`IncludedAmount`/`IncludedUnits`/`UnitPrice`
- [[V-contract-currency-enum]] — currency lives at the parent Contract level; RateCardEntry inherits

## Pages using this entity

_no pages seeded yet_ — Add Contract wizard Step 2 (Rate Card matrix) + Edit Contract (Pending status only) are listed in [[03 Contract Packaging Charging Billing]].

## Cross-service touches

- **Charging** consumes the rate card via `ContractLifecycle` Kafka events to drive `NoApplicableRate` evaluation in `ReserveWalletChargeRequest`. See [[V-charging-no-applicable-rate]] and [[Charging Service]].
- Frontend Add Contract wizard pre-loads `PriceUnit` lookup from Commerce `/Lookup/{id}` (Hook-wrapped).

## Hubs

- [[API_INDEX]] · [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
