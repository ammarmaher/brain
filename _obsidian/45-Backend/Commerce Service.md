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

## Hubs

- [[BACKEND_INDEX]] · [[API_INDEX]] · [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[VALIDATION_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
