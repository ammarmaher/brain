---
type: backend-service
service: commerce
primary-prds: [PRD-01, PRD-03]
repo: falcon-core-commerce-svc
created: 2026-05-15
---
*** Backend Service — Commerce ***
*** SoT: Brain Outputs/understanding/backend/commerce/ ***
*** Repository: C:\Falcon\Falcon\falcon-core-commerce-svc ***

# Commerce Service

> Platform's **account / contract / hierarchy / pricing** service. Owns: account hierarchy (org · nodes · sub-nodes), service catalog (Apps + CommChannels visibility/pricing per account), contracts (rate plans · quotas · unit conversions · overage), tenant settings (password policy · wallet config · IP allowlist source-of-truth), orchestration of cross-service workflows via Kafka.

## Source-of-truth files

- [SERVICE_OVERVIEW](../../../Brain%20Outputs/understanding/backend/commerce/SERVICE_OVERVIEW.md) — purpose · architecture · layout
- [ENDPOINT_REGISTRY](../../../Brain%20Outputs/understanding/backend/commerce/ENDPOINT_REGISTRY.md) — all endpoints
- [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md) — public DTOs (RequestDtos / ResponseDtos)
- [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md) — `[ThrowIfNotPassed]` · `[ThrowIfMaxLengthExceed]` · `[ThrowIfNotEnumValue<TEnum>]` + DataAnnotations on Contract DTOs
- [ERRORS](../../../Brain%20Outputs/understanding/backend/commerce/ERRORS.md) — `FalconKeys.Error.*` codes
- [FRONTEND_CONTRACT](../../../Brain%20Outputs/understanding/backend/commerce/FRONTEND_CONTRACT.md) — request/response shape for FE

## PRDs this service implements

- [[01 Account Management]] — **primary** (Account, Node, AccountSettings, CommChannelConfig, AppConfig)
- [[03 Contract Packaging Charging Billing]] — Contract, RateCardEntry, ContractDetail, Addon (status lifecycle scheduler)
- [[05 Templates]] — CommChannelConfig (shared with Templates service)
- [[02 User Management]] — User ↔ Account binding (Account-Owner created at Step 5 of wizard)

## Pages served

- [[Organization Hierarchy]] — primary page (CommChannels & Services · Apps & Services · Settings · Account Limitations)
- Add Client wizard (5 steps)
- Contracts & Cost Mng list + Add Contract wizard (4 steps)
- Wallets & Balance Mgmt page

## Falcon components backed by this service's DTOs

- [[Falcon Data Table]] — CommChannels list · Apps list · Contracts list · Rate Card matrix · Account-Limitation rows
- [[Falcon Tabs]] · [[Falcon Input]] · [[Falcon Dropdown]] · [[Falcon Checkbox]] · [[Falcon Button]] · [[Falcon Status Badge]] · [[Falcon Dialog]]

## Validation contract (highlights)

Custom attributes from `Falcon.Commerce.Domain.Validations`:

| Attribute | Behavior | Error Code |
|---|---|---|
| `[ThrowIfNotPassed]` | Required-field check | `FalconKeys.Error.RequiredFieldMissing` |
| `[ThrowIfMaxLengthExceed(int max)]` | String length cap | `FalconKeys.Error.MaxLengthExceeded` |
| `[ThrowIfNotEnumValue<TEnum>]` | Enum membership | `FalconKeys.Error.InvalidValue` |

DataAnnotations on Contract DTOs: `[Required]` · `[Range(decimal, "0", max)]` on `CommittedValue` / `RatePerUnit` / `PriceValue` / `IncludedAmount` / `IncludedUnits` / `UnitPrice` · `[EnumDataType(typeof(eCurrency))]` on `Currency`.

Per-DTO examples in [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md): `CreateAccountRequest`, `CreateSubNodeRequest`, `CreateContractRequest`, `UpdateContractRequest`.

## Kafka topics

- **Produces:** `UserCreationRequested` · `WalletConfigured` · `ContractLifecycle` · `ServiceOrderCreated` · `commerce.tenant-ip-allowlist-changed.v1`
- **Consumes:** identity events for User↔Account binding

## Gateway exposure

- Client traffic → [[Core Gateway Service]] (proxy + aggregations on `/api/commerce/*`)
- Admin traffic → [[System Gateway Service]]

## Validation rules enforced here (9)

PRD-01 Account Management:
- [[V-account-name-format-uniqueness]] — `Info.AccountName` `[ThrowIfNotPassed][ThrowIfMaxLengthExceed(30)]` + `DuplicateTenantName`
- [[V-password-security-level-enum]] — `Settings.PasswordSecurityLevel` `[ThrowIfNotEnumValue<ePasswordSecurityLevel>]`
- [[V-account-limits-zero-means-no-limit]] — handler-level `InvalidAccountLimits` / `MaxNodeLevelReached` / `NormalUserLimitReached`
- [[V-service-visibility-pricing-required]] — `PriceValueNotConfigured` / `PricingTypeNotConfigured` / `HiddenProductMustNotHavePricing`

PRD-03 Contract:
- [[V-contract-committed-value-positive]] — `[Range(decimal, "0.0000001", max)]` on `CommittedValue`
- [[V-contract-rate-per-unit-non-negative]] — `[Range(decimal, "0", max)]` on `RatePerUnit` + `PriceValue` + `IncludedAmount` + `IncludedUnits` + `UnitPrice`
- [[V-contract-currency-enum]] — `[EnumDataType(typeof(eCurrency))]`. Note: Charging same field has no enum binding (drift)
- [[V-contract-expiration-after-start]] — handler-time · `EffectiveDateMustBeInFuture` / `InvalidContractConfiguration` (422)
- [[V-contract-edit-status-aware-fields]] — handler-time gate · `ContractEditOnlyAllowedWhenPending` (422). `ContractResponse.CanEdit` bool exposed for FE

Full index: [[VALIDATION_INDEX]] → "Triangulated validation rules" section.

## Tags

#type/backend-service #prd/01 #prd/02 #prd/03 #prd/05 #service/core-gateway #service/system-gateway #drift #security

## Hubs

- [[BACKEND_INDEX]] · [[API_INDEX]] · [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[VALIDATION_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
