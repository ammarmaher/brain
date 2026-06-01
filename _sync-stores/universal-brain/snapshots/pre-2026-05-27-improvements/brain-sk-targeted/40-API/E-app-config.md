---
type: entity-reconciliation
entity: app-config
prd: PRD-01
service: commerce
drift-count: 13
created: 2026-05-15
---
*** Entity Reconciliation E-app-config — AppConfig ***
*** PRD: PRD-01 Account Management · Backend service: Commerce · 2026-05-15 ***

# E-app-config — AppConfig

> Per-account configuration of an Application: visibility (hide/show), pricing type + value, activation/renew lifecycle. **Same shape as [[E-comm-channel-config]]** per PRD (BR-AM-14/16/20) — the Application master is global, this entity is the per-account override. Owned by [[Commerce Service]].

## PRD definition (business-conceptual)

- **PRD module:** [[01 Account Management]]
- **Source:** [ENTITIES.md](../../../Brain%20Outputs/prd/modules/01-account-management/ENTITIES.md)
- **PRD fields** (per ENTITIES.md: "same shape as CommChannelConfig"):
  - `accountId`: identifier
  - `applicationId`: identifier (FK to global Application master)
  - `visibility`: enum `Hide | Show` (BR-AM-14)
  - `pricingType`: enum `Monthly | Yearly | One Time Payment` (BR-AM-16)
  - `priceValueSar`: decimal
  - `firstActivationDate?`: optional DateTime
  - `activationDate?`: optional DateTime
  - `renewDate?`: optional DateTime
  - `status`: enum `InActive (First Time) | Paid | Active | Expired | InActive (Grace Period Ends) | Disabled` (BR-AM-20)

## Backend DTO mapping (concrete request/response shapes)

- **Service:** [[Commerce Service]]
- **DTO source:** [DTO_DICTIONARY.md](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md)
- **Validations source:** [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md)
- **Relevant DTOs:**
  - `CreateAccountRequest.Applications` (the parallel `List<Service> Services` under the same shared `Service` nested type as `CommChannels`) — per `DTO_DICTIONARY.md` `Service` has `AppId, PriceType`
  - `AccountApplicationResponse` — `GET /Node/{id}/applications` (per-account application visibility + pricing)
  - `ApplicationResponse` — `GET /Application` (master catalog read; `App id, name (assumed MultiLanguage), icon`)
  - `ChangeAccountApplicationServiceVisibilityRequest` / `Response` — `PUT /Node/application/visibility`
  - `ChangeApplicationPriceTypeRequest` / `Response` — `PUT /Node/application/price-type`
  - `ChangeApplicationPriceValueRequest` / `Response` — `PUT /Node/application/price-value`
  - `DeleteApplicationNewPriceTypeRequest` / `Response` — `DELETE /Node/application/new-price-type` (cancel pending)
  - `DeleteApplicationNewPriceValueRequest` / `Response` — `DELETE /Node/application/new-price-value` (cancel pending)
  - `DisableApplicationRequest` / `Response` — `POST /Node/application/disable`
  - `EnableApplicationRequest` / `Response` — `POST /Node/application/enable`
  - `DoPaymentApplicationRequest` / `Response` — `POST /Node/application/do-payment` (maps to `CreateFalconServiceOrderCommand`)

## Field reconciliation

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `accountId` | implicit — endpoints take `NodeId` route param | identifier → identifier (via NodeId) | ⚠ DRIFT — backend operates by node id, not account id directly (same as [[E-comm-channel-config]]) |
| `applicationId` | `Service.AppId` `[ThrowIfNotPassed]` (write) · `AccountApplicationResponse.<appId>` (read, inferred) | identifier → string with required check | ✅ match (write-side validated) |
| `visibility` (Hide/Show) | `ChangeAccountApplicationServiceVisibilityRequest.Visibility` (bool flag) · `AccountApplicationResponse.<visibility>` | enum `Hide/Show` → bool flag (inferred) | ⚠ DRIFT — enum 2-value collapsed to boolean on backend |
| `pricingType` | `Service.PriceType` `[ThrowIfNotEnumValue<ePricingType>]` · `ChangeApplicationPriceTypeRequest.<pricingType>` | enum 3-value → `ePricingType` enum | ✅ match |
| `priceValueSar` | `ChangeApplicationPriceValueRequest.<priceValue>` | decimal SAR → decimal | ⚠ DRIFT — currency-suffix dropped on backend name (currency at account level via `eCurrency Currency` on `GetAccountHierarchyResponse`) |
| `firstActivationDate?` | _not enumerated in DTO_DICTIONARY_ — likely on `AccountApplicationResponse` | DateTime? → not documented | ❌ Documentation gap |
| `activationDate?` | _not enumerated_ | DateTime? → not documented | ❌ Documentation gap |
| `renewDate?` | _not enumerated_ | DateTime? → not documented | ❌ Documentation gap |
| `status` (6-value enum) | _not enumerated as a single field_ — `Enable/Disable` endpoints flip; `DoPayment` advances; splits across flags (inferred) | enum 6-value → not documented as single field | ❌ Documentation gap — same as `CommChannelConfig` |
| _(none)_ | `ChangeApplicationPriceType/ValueRequest.<effectiveDate>` | n/a → DateTime | ➕ Backend supports future-scheduled price changes |
| _(none)_ | `DeleteApplicationNewPriceType/Value*` endpoints | n/a → DELETE endpoint | ➕ Backend supports cancelling a pending price change — implies pending-change record |
| _(none)_ | `DoPaymentApplicationRequest` → `CreateFalconServiceOrderCommand` | n/a → composite | ➕ Backend ties payment to `ServiceOrder` creation |

## Drift / gaps summary

- **Drift items:** (identical to [[E-comm-channel-config]])
  - `accountId` vs `NodeId` — backend operates by node
  - `visibility` enum collapsed to boolean
  - `priceValueSar` currency-suffix dropped on backend
  - 6-value status not exposed as single field
- **Missing / documentation gap on backend:**
  - `firstActivationDate?`, `activationDate?`, `renewDate?` not enumerated
  - 6-value lifecycle status not exposed as a single field
- **Extra on backend:**
  - Scheduled future price change (effective date)
  - Pending-change cancel endpoints
  - `DoPayment` → `ServiceOrder` flow
- **Notable design symmetry:**
  - Commerce backend treats `CommChannels` and `Applications` as **mirror endpoints** — same `Service` nested type with `AppId, PriceType` covers both. This matches PRD's "same shape" statement. Twelve endpoints duplicated across the two. Could be candidate for future API consolidation.

## Related validation rules (V-rule notes)

- [[V-service-visibility-pricing-required]] — same cross-field rule applies (`PriceValueNotConfigured` / `PricingTypeNotConfigured` / `HiddenProductMustNotHavePricing`)
- _no V-rule yet for the 6-value status lifecycle (BR-AM-20) — candidate for future Phase 2C extension_
- _no V-rule yet for the future-scheduled price change semantics — candidate for clarification_

## Pages using this entity

- [[Organization Hierarchy]] — `apps-services-tab` section
- Add Client wizard Step 4 (Apps & Services) — not yet seeded under `10-Pages/`

## Cross-service touches

- [[Provisioning Service]] — Applications are provisioned via separate service lifecycle (out-of-batch — different specialist)
- Kafka — `ServiceOrderCreated` event after `DoPayment`
- [[Charging Service]] — billing logic for application charges (out-of-batch)

## Tags

#type/e-entity #prd/01 #service/charging #service/commerce #service/provisioning #severity/high #drift #gap

## Hubs

- [[API_INDEX]] · [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
