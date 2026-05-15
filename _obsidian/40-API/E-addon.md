---
type: entity-reconciliation
entity: addon
prd: PRD-03
service: commerce
drift-count: 10
created: 2026-05-15
---
*** Entity Reconciliation E-addon — Addon ***
*** PRD: PRD-03 Contract Packaging Charging Billing · Backend service: commerce · 2026-05-15 ***

# E-addon — Addon

> Sub-service add-on attached to a contract — carries both a free-credit bucket AND a rate card. PRD models it as a single `Addon` entity with `subServiceType + freeCreditValue + rateCardValue`. **Backend splits it into TWO separate DTO collections** on `CreateContractRequest`: `Quotas: List<ContractQuotaRequest>` (the free-credit half) and `OverageRates: List<ContractOverageRateRequest>` (the rate-card half). The 1:2 PRD↔backend split is the headline drift here.

## PRD definition (business-conceptual)

- **PRD module:** [[03 Contract Packaging Charging Billing]]
- **Source:** [ENTITIES.md](../../../Brain%20Outputs/prd/modules/03-contract-packaging-charging-billing-management/ENTITIES.md)
- **PRD fields:**
  - `contractId`: ref → Contract
  - `subServiceType`: enum-ish — examples `VoiceNumber`, `NabaaTemplate`, …
  - `freeCreditValue`: decimal — pre-paid quota
  - `rateCardValue`: decimal — overage rate applied after `freeCreditValue` is consumed

## Backend DTO mapping

- **Service:** [[Commerce Service]]
- **DTO source:** [DTO_DICTIONARY.md](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md)
- **Validation source:** [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md)
- **Relevant DTOs:**
  - `ContractQuotaRequest` (nested under `CreateContractRequest.Quotas`) — covers the **free-credit half** per PRD ENTITIES.md note: "Maps to Addon free-credit"
  - `ContractOverageRateRequest` (nested under `CreateContractRequest.OverageRates`) — covers the **rate-card half** per PRD ENTITIES.md note: "Maps to Addon rate-card"
  - `ContractQuotaResponse` / `ContractOverageRateResponse` — response equivalents under `ContractResponse.TariffPlan`

## Field reconciliation

### Free-credit half (PRD `Addon.freeCreditValue` ↔ backend `ContractQuotaRequest`)

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `contractId` | _implicit_ (parent aggregate) | ref → derived | ✅ match |
| `subServiceType` | `SubService?` (ContractQuotaRequest — nullable) | enum-ish → `string?` `[Required]`-on-cluster | ⚠ drift — backend makes `SubService` **nullable** even though PRD says each Addon has a subServiceType. Also: also has `ChannelId` (➕) which the PRD doesn't show |
| `freeCreditValue` | `IncludedAmount` (ContractQuotaRequest) | decimal → `decimal` `[Required] [Range(decimal, "0", max)]` | ✅ semantic match (different name). PRD wording is "free-credit"; backend term is "Included Amount" |
| _none_ | `QuotaCode` | _PRD silent_ | ➕ extra — backend uses a `QuotaCode` identifier |
| _none_ | `ChannelId` | _PRD silent_ | ➕ extra — backend lets a quota target a specific CommChannel (PRD ties Addon to `subServiceType` only) |
| _none_ | `IncludedUnits` | _PRD silent_ | ➕ extra — units-axis paired with `IncludedAmount` (currency-vs-units quota) |
| _none_ | `Unit` | _PRD silent_ | ➕ extra — unit of measure |
| _none_ | `QuotaCategory` | _PRD silent_ | ➕ extra — categorisation taxonomy |
| _none_ | `QuotaType` | _PRD silent_ | ➕ extra — typing taxonomy |
| _none_ | `Scope` | _PRD silent_ | ➕ extra — quota scope (account / contract / sub-service) |
| _none_ | `QuotaId` (ContractQuotaResponse) | _PRD has no explicit id_ | ➕ extra — backend issues per-row id |
| _none_ | `ChannelName` (ContractQuotaResponse) | _PRD silent_ | ➕ extra — display name pair |
| _none_ | `Status` (ContractQuotaResponse) | _PRD says "n/a" lifecycle_ | ➕ extra — per-row status |

### Rate-card half (PRD `Addon.rateCardValue` ↔ backend `ContractOverageRateRequest`)

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `contractId` | _implicit_ (parent aggregate) | ref → derived | ✅ match |
| `subServiceType` | `SubService` (ContractOverageRateRequest — not nullable here) | enum-ish → `string` `[Required]` | ⚠ drift — same field is `nullable` on `ContractQuotaRequest` and **non-nullable** on `ContractOverageRateRequest`. Inconsistent treatment of the same concept |
| `rateCardValue` | `UnitPrice` (ContractOverageRateRequest) | decimal → `decimal` `[Required] [Range(decimal, "0", max)]` | ✅ semantic match (PRD "rate-card-value" → backend "UnitPrice") |
| _none_ | `ChannelId` | _PRD silent_ | ➕ extra — per-CommChannel pricing |
| _none_ | `Unit` | _PRD silent_ | ➕ extra |
| _none_ | `BillingCycle` | _PRD silent_ | ➕ extra — recurring vs one-shot |
| _none_ | `OverageRateId` (ContractOverageRateResponse) | _PRD has no explicit id_ | ➕ extra |
| _none_ | `ChannelName` (ContractOverageRateResponse) | _PRD silent_ | ➕ extra |
| _none_ | `Status` (ContractOverageRateResponse) | _PRD says "n/a"_ | ➕ extra |

Legend: ✅ match · ⚠ drift · ❌ missing · ➕ extra-on-backend

## Drift / gaps summary

- ⚠ **Structural drift (high)** — PRD models Addon as a single entity (`freeCreditValue + rateCardValue` on one row). Backend splits it into two parallel collections (`Quotas` + `OverageRates`) which the FE must keep paired by `SubService` + `ChannelId`. Adding/editing an Addon requires synchronised updates to both lists
- ⚠ Nullability inconsistency — `SubService` is nullable on `ContractQuotaRequest`, non-nullable on `ContractOverageRateRequest`. Same concept, different rigour
- ⚠ Naming drift — PRD `freeCreditValue` → backend `IncludedAmount`; PRD `rateCardValue` → backend `UnitPrice`
- ❌ PRD has no explicit `BillingCycle` field on Addon; backend exposes it on `ContractOverageRateRequest`. Open question for PRD (audit log + recurring billing both flagged in module GAPS as MISSING)
- ➕ Backend exposes rich attributes (`QuotaCode`, `Scope`, `QuotaCategory`, `QuotaType`, `Unit`, `IncludedUnits`, `BillingCycle`, `ChannelId`) — FE must understand the taxonomy
- ➕ Per-row `Status` on response sides — likely tracks pending price changes; PRD silent

## Related validation rules (V-rule notes)

- [[V-contract-rate-per-unit-non-negative]] — `[Range(decimal, "0", max)]` covers `IncludedAmount`, `IncludedUnits`, `UnitPrice`
- [[V-contract-edit-status-aware-fields]] — Addon edits gated to `Pending` status (per BR-CC for contract edit) — see [[V-contract-edit-status-aware-fields]]

## Pages using this entity

_no pages seeded yet_ — Add Contract wizard Step 4 (Addons) + Edit Contract are listed in [[03 Contract Packaging Charging Billing]].

## Cross-service touches

- **Provisioning** activates sub-services (`Activate Sub-Service` workflow) and consumes `ServiceOrderCreated` Kafka events that carry the Addon's `SubService` reference.
- **Charging** evaluates `Quotas` first (free-credit) then falls back to `OverageRates` per the nearest-expiring-first cascade.

## Tags

#type/e-entity #prd/03 #service/commerce #severity/high #drift

## Hubs

- [[API_INDEX]] · [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
