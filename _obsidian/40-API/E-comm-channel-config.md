*** Entity Reconciliation E-comm-channel-config — CommChannelConfig ***
*** PRD: PRD-01 Account Management · Backend service: Commerce · 2026-05-15 ***

# E-comm-channel-config — CommChannelConfig

> Per-account configuration of a CommChannel: visibility (hide/show in client UI), pricing type + value, activation/renew lifecycle. Owned by [[Commerce Service]] (`Falcon.Commerce.Domain.Entities.AccountCommunicationChannel` — inferred). The CommChannel master is global; **this entity is the per-account override layer**.

## PRD definition (business-conceptual)

- **PRD module:** [[01 Account Management]]
- **Source:** [ENTITIES.md](../../../Brain%20Outputs/prd/modules/01-account-management/ENTITIES.md)
- **PRD fields:**
  - `accountId`: identifier
  - `commChannelId`: identifier (FK to global CommChannel master)
  - `visibility`: enum `Hide | Show` (BR-AM-14)
  - `pricingType`: enum `Monthly | Yearly | One Time Payment` (BR-AM-16)
  - `priceValueSar`: decimal — SAR-denominated price
  - `firstActivationDate?`: optional DateTime
  - `activationDate?`: optional DateTime
  - `renewDate?`: optional DateTime
  - `status`: enum `InActive (First Time) | Paid | Active | Expired | InActive (Grace Period Ends) | Disabled` (BR-AM-20)
- **Lifecycle:** `InActive (First Time)` → `Paid` → `Active` → `Expired` → `InActive (Grace Period Ends)` → `Disabled`

## Backend DTO mapping (concrete request/response shapes)

- **Service:** [[Commerce Service]]
- **DTO source:** [DTO_DICTIONARY.md](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md)
- **Validations source:** [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md)
- **Relevant DTOs:**
  - `CreateAccountRequest.CommChannels { List<Service> Services }` — write at Account create. Each `Service` has `AppId` `[ThrowIfNotPassed]`, `PriceType` `[ThrowIfNotEnumValue<ePricingType>]`
  - `AccountCommunicationChannelResponse` — `GET /Node/{id}/comm-channels`, `GET /Node/{id}/comm-channels/visible/details` (per-account channel visibility + pricing)
  - `VisibleCommunicationChannelResponse` — `GET /Node/{NodeId}/comm-channels/visible` (lightweight visible-channel projection)
  - `ChangeAccountCommunicationChannelServiceVisibilityRequest` / `Response` — `PUT /Node/comm-channel/visibility` (toggle visibility)
  - `ChangeCommunicationChannelPriceTypeRequest` / `Response` — `PUT /Node/comm-channel/price-type` (channel id + new pricing type + effective date)
  - `ChangeCommunicationChannelPriceValueRequest` / `Response` — `PUT /Node/comm-channel/price-value` (channel id + new price value + effective date)
  - `DeleteCommunicationChannelNewPriceTypeRequest` / `Response` — `DELETE /Node/comm-channel/new-price-type` (cancel pending price-type change)
  - `DeleteCommunicationChannelNewPriceValueRequest` / `Response` — `DELETE /Node/comm-channel/new-price-value` (cancel pending price-value change)
  - `DisableCommunicationChannelRequest` / `Response` — `POST /Node/comm-channel/disable`
  - `EnableCommunicationChannelRequest` / `Response` — `POST /Node/comm-channel/enable`
  - `DoPaymentCommunicationChannelRequest` / `Response` — `POST /Node/comm-channel/do-payment` (maps to `CreateFalconServiceOrderCommand`)
  - `GetAccountHierarchyCommChannelsResponse` (nested in `GetAccountHierarchyResponse.CommChannels`) — currency-aware channel slice
  - `GetOrderStatusResponse` — `GET /Node/order/{orderId}/status`

## Field reconciliation

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `accountId` | implicit — endpoints take `NodeId` route param (Account is bound to its Main Node) | identifier → identifier (via NodeId) | ⚠ DRIFT — backend operates by `NodeId`, not `AccountId` directly. Frontend must translate Account → Node. |
| `commChannelId` | `AccountCommunicationChannelResponse.<channelId>` (implied) · all `Change*` and `Delete*` and `Enable/Disable` requests target a channel id | identifier → identifier | ✅ match (field names not individually enumerated in DTO_DICTIONARY) |
| `visibility` (Hide/Show) | `ChangeAccountCommunicationChannelServiceVisibilityRequest.Visibility` (bool/flag) · `AccountCommunicationChannelResponse.<visibility>` | enum `Hide/Show` → bool flag (inferred from "Visibility flag" in DTO summary) | ⚠ DRIFT — PRD enum 2-value vs backend boolean. Semantic equivalent but loses the enum vocabulary. |
| `pricingType` (Monthly/Yearly/OneTimePayment) | `Service.PriceType` `[ThrowIfNotEnumValue<ePricingType>]` (write) · `ChangeCommunicationChannelPriceTypeRequest.<pricingType>` (update) | enum 3-value → `ePricingType` enum | ✅ match. PRD enum value `One Time Payment` is presumably `OneTimePayment` in `ePricingType` (verify against enum definition). |
| `priceValueSar` | `ChangeCommunicationChannelPriceValueRequest.<priceValue>` · response `<priceValue>` | decimal SAR → decimal | ⚠ DRIFT — currency-suffix dropped on backend name. Currency is carried at the Account level via `eCurrency Currency` on `GetAccountHierarchyResponse`. |
| `firstActivationDate?` | _not enumerated in DTO_DICTIONARY_ — likely on `AccountCommunicationChannelResponse` | DateTime? → not documented | ❌ Documentation gap — likely present, not enumerated |
| `activationDate?` | _not enumerated_ | DateTime? → not documented | ❌ Documentation gap |
| `renewDate?` | _not enumerated_ | DateTime? → not documented | ❌ Documentation gap |
| `status` (6-value enum) | _not enumerated as a field_ — `Enable/Disable` endpoints flip the flag; `DoPayment` advances state | enum 6-value → not documented | ❌ Documentation gap — the 6-value PRD lifecycle is not enumerated as a single `Status` field on the response DTO. Backend likely splits across `IsEnabled`, `IsPaid`, etc. (inferred). |
| _(none)_ | `ChangeCommunicationChannelPriceTypeRequest.<effectiveDate>` · `PriceValueRequest.<effectiveDate>` | n/a → DateTime | ➕ Backend supports a **future-scheduled price change** with effective date; PRD does not document the "scheduled change" UX directly. |
| _(none)_ | `DeleteCommunicationChannelNewPriceType/Value*` endpoints | n/a → DELETE endpoint | ➕ Backend supports **cancelling a pending price change** — implies a pending-change record not surfaced in PRD entity definition. |
| _(none)_ | `DoPaymentCommunicationChannelRequest` → `CreateFalconServiceOrderCommand` | n/a → composite | ➕ Backend ties payment to a `ServiceOrder` creation flow; PRD entity does not include the order link. |

## Drift / gaps summary

- **Drift items:**
  - `accountId` vs `NodeId` — backend operates by node, frontend must translate
  - `visibility` enum collapsed to boolean
  - `priceValueSar` — currency-suffix dropped; currency carried at account level
  - Status (6-value enum) not exposed as a single field — split across booleans/flags (inferred)
- **Missing / documentation gap on backend:**
  - `firstActivationDate?`, `activationDate?`, `renewDate?` — not enumerated as fields in DTO_DICTIONARY (likely present but undocumented)
  - 6-value `status` enum — no single-field exposure
- **Extra on backend:**
  - Scheduled future price change (effective date)
  - Pending-change cancel endpoints (`DELETE /comm-channel/new-price-type` and `new-price-value`)
  - `DoPayment` flow tied to `ServiceOrder` creation

## Related validation rules (V-rule notes)

- [[V-service-visibility-pricing-required]] — `PriceValueNotConfigured` / `PricingTypeNotConfigured` / `HiddenProductMustNotHavePricing` (visibility ↔ pricing cross-field rule)
- _no V-rule yet for the 6-value status lifecycle (BR-AM-20) — candidate for future Phase 2C extension_
- _no V-rule yet for the future-scheduled price change semantics — candidate for clarification_

## Pages using this entity

- [[Organization Hierarchy]] — `comm-channels-tab` section (primary surface)
- Add Client wizard Step 3 (CommChannels & Services) — not yet seeded under `10-Pages/`

## Cross-service touches

- [[Templates Service]] — also reads CommChannel master + per-account `CommChannelConfig` (shared concern per [[Commerce Service]] note PRDs row)
- Kafka — `ServiceOrderCreated` event flows from Commerce after `DoPayment`
- [[Charging Service]] — wallet topology + balance affects pricing logic (out-of-batch)

## Hubs

- [[API_INDEX]] · [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
