*** Entity Reconciliation E-contract — Contract ***
*** PRD: PRD-03 Contract Packaging Charging Billing · Backend service: commerce · 2026-05-15 ***

# E-contract — Contract

> The commercial agreement between Falcon and an account. PRD treats it as a 4-block aggregate (Info · Rate Card · Contract Details matrix · Addons). Backend Commerce owns the entity and exposes it through `CreateContractRequest` / `UpdateContractRequest` / `ContractResponse`. Auto-status (Pending → Active → Expired) is computed from `(startDate, expirationDate, now)` by a Commerce scheduler.

## PRD definition (business-conceptual)

- **PRD module:** [[03 Contract Packaging Charging Billing]]
- **Source:** [ENTITIES.md](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/ENTITIES.md)
- **PRD fields:**
  - `id`: opaque id — assigned at create
  - `farabiRefId`: string, `<=50` — external partner reference
  - `name`: string, `<=50` — display name
  - `accountId`: ref → Account (01)
  - `startDate`: date `>=today` at create
  - `expirationDate`: date `>startDate` and `>now` at create
  - `valueSar`: positive float, `<=hundreds-of-millions`, mandatory — funded into Master Wallet on Active
  - `remainingValueSar`: auto, derived from `valueSar - SUM(WalletRecord deducted)`
  - `createdAt`: auto
  - `status`: enum `Pending | Active | Expired` — auto-derived (BR-CC-11)
  - `currency`: `eCurrency` — PRD uses SAR exclusively

## Backend DTO mapping

- **Service:** [[Commerce Service]]
- **DTO source:** [DTO_DICTIONARY.md](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md)
- **Validation source:** [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md)
- **Relevant DTOs:**
  - `CreateContractRequest` — `POST /Contracts` — root of the 4-block aggregate
  - `UpdateContractRequest` — `PUT /Contracts/{contractId}` — same shape minus `AccountId` (id from route)
  - `ContractResponse : ContractSummaryResponse` — `GET /Contracts/{contractId}` — fully-populated view
  - `ContractSummaryResponse` — base — used in `ContractListResponse` rows

## Field reconciliation

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `id` | `ContractId` (ContractSummaryResponse) | opaque → `string` | ✅ match |
| `farabiRefId` (`<=50`) | `FarabiReferenceId?` (CreateContractRequest, ContractSummaryResponse) | string `<=50` → nullable `string`, **no `[MaxLength]` attribute observed** | ⚠ drift — PRD caps at 50 chars; backend DTO has `[Required]` cluster but no length attribute documented for this field |
| `name` (`<=50`) | `ContractName` (CreateContractRequest, ContractSummaryResponse) | string `<=50` → `string` with `[Required]`, **no `[MaxLength]` attribute observed** | ⚠ drift — PRD caps at 50 chars; backend has `[Required]` only |
| `accountId` | `AccountId` (CreateContractRequest only) | ref → `string` `[Required]` | ✅ match. ➕ Update DTO intentionally omits it (taken from route) |
| `startDate` (`>=today`) | `StartDate` (CreateContractRequest, ContractSummaryResponse) | date `>=today` → `DateTime` `[Required]` | ⚠ drift — temporal lower-bound (`>=today`) enforced at handler-time only, not on DTO. See [[V-contract-expiration-after-start]] |
| `expirationDate` (`>startDate`, `>now`) | `EndDate` (CreateContractRequest, ContractSummaryResponse) | date `>startDate` → `DateTime` `[Required]` | ⚠ **naming drift** — PRD uses "Expiration Date", backend uses `EndDate`. Semantic equivalent per ENTITIES.md note. Cross-field rule enforced handler-time |
| `valueSar` (`>0`, `<=hundreds-of-millions`) | `CommittedValue` (CreateContractRequest) / `CommittedValue?` (ContractSummaryResponse) | positive float, capped → `decimal` `[Required] [Range(decimal, "0.0000001", "79228162514264337593543950335")]` | ⚠ drift — backend `[Range]` cap is `decimal.MaxValue`, not "hundreds of millions". Lower bound enforced. See [[V-contract-committed-value-positive]] |
| `remainingValueSar` (auto) | `RemainingBalance?` (ContractSummaryResponse) | computed → `decimal?` | ✅ match — read-only on response side; not in request DTOs |
| `createdAt` (auto) | `CreatedAt` (ContractSummaryResponse) | datetime → `DateTime` | ✅ match |
| `status` (Pending\|Active\|Expired) | `Status` (ContractSummaryResponse) | enum → (verify enum type — `Status` shown as untyped in DTO_DICTIONARY) | ⚠ drift candidate — backend DTO_DICTIONARY does not name an `eContractStatus` enum. PRD enumerates 3 values |
| `currency` (`eCurrency`, SAR-only per PRD) | `Currency` (CreateContractRequest) / `Currency` (ContractResponse) | `eCurrency` → `eCurrency` `[Required] [EnumDataType(typeof(eCurrency))]` | ✅ enum match in Commerce. ⚠ **cross-service drift** with Charging — Charging same field has NO `[EnumDataType]`. See [[V-contract-currency-enum]] |
| _none_ | `Rates: List<ContractRateRequest>` `[Required]` | _PRD models these via `ContractDetail`_ | ➕ extra grouping on backend (PRD has separate `ContractDetail`/`RateCardEntry` entities — see [[E-rate-card-entry]]) |
| _none_ | `UnitConversions: List<ContractUnitConversionRequest>` `[Required]` | _PRD maps to `RateCardEntry`_ | ➕ extra grouping on backend (`RateCardEntry` per CommChannel) — see [[E-rate-card-entry]] |
| _none_ | `Quotas: List<ContractQuotaRequest>` `[Required]` | _PRD maps to `Addon` free-credit_ | ➕ extra grouping on backend — see [[E-addon]] |
| _none_ | `OverageRates: List<ContractOverageRateRequest>` `[Required]` | _PRD maps to `Addon` rate-card_ | ➕ extra grouping on backend — see [[E-addon]] |
| _none (computed)_ | `CanEdit` (ContractResponse) | _PRD encodes via status gates_ | ➕ FE convenience flag exposed by backend; encodes [[V-contract-edit-status-aware-fields]] |
| _none_ | `BusinessTimeZone`, `StartLocalDateTime`, `EndLocalDateTime` (ContractSummaryResponse) | _PRD silent_ | ➕ backend exposes business-timezone projections; PRD only references UTC dates |
| _none_ | `TariffPlan: ContractTariffPlanResponse` (ContractResponse) | _PRD has no `TariffPlan` wrapper concept_ | ➕ backend wraps the 4 nested lists into a `TariffPlan` projection on the response — useful for UI but inferred-only mapping to PRD |

Legend: ✅ match · ⚠ drift · ❌ missing · ➕ extra-on-backend

## Drift / gaps summary

- ⚠ Naming drift — PRD `expirationDate` ↔ backend `EndDate` (same semantic, but `Edit Contract` UI labels must match PRD vocabulary)
- ⚠ Length-cap drift — PRD says `name <=50` and `farabiRefId <=50` but Commerce DTOs lack `[MaxLength]` attributes (only `[Required]` enforced at DTO level)
- ⚠ Range-cap drift — PRD says `valueSar <= hundreds-of-millions`; backend `[Range]` upper bound is `decimal.MaxValue`
- ⚠ Temporal-rule drift — `startDate >= today` and `expirationDate > startDate` enforced at handler-time only, not via DTO attributes
- ⚠ Cross-service currency drift — Commerce binds `Currency` as `[EnumDataType(typeof(eCurrency))]`; Charging same field has no enum attribute
- ⚠ Status enum naming — backend DTO_DICTIONARY does not name `eContractStatus`; PRD has 3 explicit values
- ❌ Audit log not modeled on either side (GAP-CC-30)
- ➕ Backend exposes `CanEdit`, `BusinessTimeZone`, `StartLocalDateTime`, `EndLocalDateTime`, and `TariffPlan` projection — PRD silent on these
- ➕ Backend groups Rate Card / Contract Details / Addon free-credit / Addon rate-card under flat collections on the root DTO; PRD models them as separate child entities

## Related validation rules (V-rule notes)

- [[V-contract-committed-value-positive]] — `[Range]` on `CommittedValue`
- [[V-contract-rate-per-unit-non-negative]] — `[Range]` on rate/price/quota decimals
- [[V-contract-currency-enum]] — `[EnumDataType(typeof(eCurrency))]` (+ cross-service drift)
- [[V-contract-expiration-after-start]] — handler-time temporal rule
- [[V-contract-edit-status-aware-fields]] — `CanEdit` + `ContractEditOnlyAllowedWhenPending`

## Pages using this entity

_no pages seeded yet_ — Contracts & Cost Mng list + Add Contract wizard (4 steps) + Edit Contract dialog are listed in [[03 Contract Packaging Charging Billing]] but not yet seeded under `10-Pages/`.

## Cross-service touches

- **Charging** consumes Contract via `ContractLifecycle` Kafka topic (produced by Commerce). Charging materializes per-contract balances visible through `GET contract-balance-summaries` returning `ContractBalanceSummary { ContractId, AvailableAmount, ... }`. See [[Charging Service]] DTO_DICTIONARY.
- **Provisioning** consumes `ServiceOrderCreated` from Commerce for contract activations of sub-services.
- **Master Wallet** funding triggered on `Pending → Active` transition — see [[E-wallet-record]] for the wallet-record linkage.

## Hubs

- [[API_INDEX]] · [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
