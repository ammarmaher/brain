# Commerce Service — DTO Dictionary

> Source: `Falcon.Commerce.Contracts/Models/{RequestsDtos,ResponseDtos}/*.cs`
> All DTOs live in the `Falcon.Commerce.Contracts` project (not the Api project). 25 request DTOs + 36 response DTOs + a handful of cross-cutting types.

## Cross-Cutting Types

| Type | Shape | Notes |
|---|---|---|
| `ServiceOperationResult<T>` | `struct { bool IsSuccessful; List<string> ErrorMessages; T? Result; }` | Wrap every endpoint response. `Failure(...)` is marked `[Obsolete]` — only the exception middleware should use it. |
| `Hook<T>` | `class { T Value; string Name; }` | Used for lookup-table responses — gives both the value and a display name. |
| `PagedResponse<T>` | `record(List<T> Items, long TotalCount, int PageNumber, int PageSize)` | Standard pagination shape (mirrors Identity's). |

## Request DTOs (`Falcon.Commerce.Contracts.Models.RequestsDtos`)

| Name | Used By | Notable Fields |
|---|---|---|
| `CreateAccountRequest` | `POST /Node/create-account` | `Info, Settings, CommChannels?, Applications?, AccountOwner, eDeliveryMethod DeliveryMethod`. Nested types `Info` (~20 fields incl. address), `SettingsInfo` (`ePasswordSecurityLevel, AllowedIPs[], MaxNormalUserLimit, MaxSystemUserLimit, MaxNodeLevel, BalanceTransferLimit`), `CommChannels { List<Service> Services }`, `AccountOwner` (`FirstName, LastName, UserName, Password?, NationalId?, PhoneNumber, EmailAddress, eUserRoles Role, AccountOwnerProfilePictureInfo?`). Heavy use of `[ThrowIfNotPassed]`, `[ThrowIfMaxLengthExceed(30)]`, `[ThrowIfNotEnumValue<T>]` attributes. |
| `CreateSubNodeRequest` | `POST /Node/create-SubNode` | `ParentId, Name` (both `[ThrowIfNotPassed]`; Name has `[ThrowIfMaxLengthExceed(30)]`) |
| `ChangeNodeNameRequest` | `PUT /Node/ChangeNodeName` | NodeId, NewName, EffectiveDate? |
| `ChangeAccountCommunicationChannelServiceVisibilityRequest` | `PUT /Node/comm-channel/visibility` | NodeId, CommChannelId, Visibility flag |
| `ChangeAccountApplicationServiceVisibilityRequest` | `PUT /Node/application/visibility` | NodeId, ApplicationId, Visibility flag |
| `ChangeCommunicationChannelPriceTypeRequest` | `PUT /Node/comm-channel/price-type` | Identifies channel and new pricing type with effective date |
| `ChangeCommunicationChannelPriceValueRequest` | `PUT /Node/comm-channel/price-value` | Identifies channel and new price value with effective date |
| `ChangeApplicationPriceTypeRequest` | `PUT /Node/application/price-type` | Application equivalent |
| `ChangeApplicationPriceValueRequest` | `PUT /Node/application/price-value` | Application equivalent |
| `DeleteCommunicationChannelNewPriceTypeRequest` | `DELETE /Node/comm-channel/new-price-type` | Cancels pending price-type change |
| `DeleteCommunicationChannelNewPriceValueRequest` | `DELETE /Node/comm-channel/new-price-value` | Cancels pending price-value change |
| `DeleteApplicationNewPriceTypeRequest` | `DELETE /Node/application/new-price-type` | Cancels pending price-type change |
| `DeleteApplicationNewPriceValueRequest` | `DELETE /Node/application/new-price-value` | Cancels pending price-value change |
| `DisableCommunicationChannelRequest` | `POST /Node/comm-channel/disable` | Identifies the service to disable |
| `EnableCommunicationChannelRequest` | `POST /Node/comm-channel/enable` | Identifies the service to enable |
| `DisableApplicationRequest` | `POST /Node/application/disable` | Application equivalent |
| `EnableApplicationRequest` | `POST /Node/application/enable` | Application equivalent |
| `DoPaymentCommunicationChannelRequest` | `POST /Node/comm-channel/do-payment` | Maps to `CreateFalconServiceOrderCommand` |
| `DoPaymentApplicationRequest` | `POST /Node/application/do-payment` | Maps to `CreateFalconServiceOrderCommand` |
| `ConfigureWalletSettingsRequest` | `POST /Setting/wallets` | Wallet config for an account |
| `UpdateSettingsRequest` | `PUT /Setting` | Tenant settings update |
| `UpdateMainNodeInfoRequest` | `PUT /Information` | Account info update (no `[ThrowIfNotPassed]` — uses runtime null-tolerance) |
| `GetAccountHierarchyRequest` | (gateway aggregation) | `accountId, currency?, balanceDistribution?, walletStructure?` |
| `GeneratePasswordRequest` | (Identity surface inherited; may be unused here) | `ePasswordSecurityLevel` |
| `CreateContractRequest` | `POST /Contracts` | `AccountId, ContractName, FarabiReferenceId?, StartDate, EndDate, CommittedValue, eCurrency Currency, List<ContractRateRequest> Rates, List<ContractUnitConversionRequest> UnitConversions, List<ContractQuotaRequest> Quotas, List<ContractOverageRateRequest> OverageRates`. Heavy `[Required]` + `[Range(decimal,...)]` + `[EnumDataType(typeof(eCurrency))]` DataAnnotations. |
| `UpdateContractRequest` | `PUT /Contracts/{contractId}` | Identical shape to `CreateContractRequest` minus `AccountId` (the contract id comes from the route) |
| `ContractRateRequest` (nested) | rates list | `ApplicationId, ChannelId, Priority, Destination, Unit, RatePerUnit` (all `[Required]`, decimal `[Range]`) |
| `ContractUnitConversionRequest` (nested) | conversions list | `Code, Name, PriceUnit, RatingUnit, PriceValue` |
| `ContractQuotaRequest` (nested) | quotas list | `QuotaCode, ChannelId, IncludedAmount, IncludedUnits, Unit, QuotaCategory, QuotaType, Scope, SubService?` |
| `ContractOverageRateRequest` (nested) | overage rates list | `SubService, ChannelId, Unit, UnitPrice, BillingCycle` |

## Response DTOs (`Falcon.Commerce.Contracts.Models.ResponseDtos`)

| Name | Returned by | Notable Fields |
|---|---|---|
| `GetAccountHierarchyResponse` | `GET /accounts/hierarchy`, gateway aggregations | `AccountId, AccountName, AccountIcon, TenantId, eCurrency Currency, eWalletBalanceType WalletBalanceType, eWalletBaseType WalletType, bool CanSave, List<GetAccountHierarchyCommChannelsResponse> CommChannels, AccountHierarchyNodeResponse Hierarchy`. `Hierarchy.SubNodes` is recursive. |
| `AccountHierarchyNodeResponse` (nested) | hierarchy tree | `NodeId, NodeName, List<AccountHierarchyNodeResponse> SubNodes` |
| `GetHierarchyNodeResponse` | `GET /Node?nodeId=` | (paired with `_mapper.Map<List<GetHierarchyNodeResponse>>(result)`) |
| `CreateAccountResponse` | `POST /Node/create-account` | Account id and identifiers; built by `request.ToResponse(result.Id)` (custom mapper) |
| `ApplicationResponse` | `GET /Application` | App id, name (assumed MultiLanguage), icon |
| `CommunicationChannelResponse` | `GET /CommunicationChannel` | Channel id, name (assumed MultiLanguage), icon |
| `AccountApplicationResponse` | `GET /Node/{id}/applications` | Per-account application visibility + pricing |
| `AccountCommunicationChannelResponse` | `GET /Node/{id}/comm-channels`, `GET /Node/{id}/comm-channels/visible/details` | Per-account channel visibility + pricing |
| `VisibleCommunicationChannelResponse` | `GET /Node/{NodeId}/comm-channels/visible` | Lightweight visible-channel projection |
| `ChangeAccountCommunicationChannelServiceVisibilityResponse` | PUT visibility | Visibility flip result |
| `ChangeAccountApplicationServiceVisibilityResponse` | PUT visibility | App equivalent |
| `ChangeCommunicationChannelPriceTypeResponse` | PUT price-type | Channel id, new pricing type, effective date |
| `ChangeCommunicationChannelPriceValueResponse` | PUT price-value | Channel id, new price value, effective date |
| `ChangeApplicationPriceTypeResponse` | PUT price-type | App equivalent |
| `ChangeApplicationPriceValueResponse` | PUT price-value | App equivalent |
| `DisableCommunicationChannelResponse` / `EnableCommunicationChannelResponse` / `DisableApplicationResponse` / `EnableApplicationResponse` | POST disable/enable | Status of operation |
| `DoPaymentCommunicationChannelResponse` / `DoPaymentApplicationResponse` | POST do-payment | Order id, status |
| `DeleteCommunicationChannelNewPriceTypeResponse` / `DeleteCommunicationChannelNewPriceValueResponse` / `DeleteApplicationNewPriceTypeResponse` / `DeleteApplicationNewPriceValueResponse` | DELETE pending | Status of cancellation |
| `GetOrderStatusResponse` | `GET /Node/order/{orderId}/status` | Order id, status, charging linkage |
| `ContractListResponse` | `GET /Contracts` | `List<ContractSummaryResponse> Contracts` |
| `ContractSummaryResponse` (base) | contract listing | `ContractId, ContractName, FarabiReferenceId, CreatedAt, StartDate, EndDate, StartLocalDateTime, EndLocalDateTime, BusinessTimeZone, CommittedValue?, RemainingBalance?, Status` |
| `ContractResponse : ContractSummaryResponse` | `GET /Contracts/{contractId}` | adds `AccountId, eCurrency Currency, bool CanEdit, ContractTariffPlanResponse TariffPlan` |
| `ContractTariffPlanResponse` (nested) | contract | `TariffPlanId, Name, Currency, List<ContractRateResponse> Rates, List<ContractUnitConversionResponse> UnitConversions, List<ContractQuotaResponse> Quotas, List<ContractOverageRateResponse> OverageRates` |
| `ContractRateResponse` (nested) | tariff | `RateId, ApplicationId, ApplicationName, ChannelId, ChannelName, Priority, Destination, Unit, RatePerUnit, Status` |
| `ContractUnitConversionResponse` (nested) | tariff | `UnitConversionId, Code, Name, PriceUnit, RatingUnit, PriceValue, Status` |
| `ContractQuotaResponse` (nested) | tariff | `QuotaId, QuotaCode, ChannelId, ChannelName, IncludedAmount, IncludedUnits, Unit, QuotaCategory, QuotaType, Scope, SubService, Status` |
| `ContractOverageRateResponse` (nested) | tariff | `OverageRateId, SubService, ChannelId, ChannelName, Unit, UnitPrice, BillingCycle, Status` |
| `LookupValueResponse` | `GET /Lookup/{id}` | (paired with `Hook<LookupValueResponse>`) |
| `GetSettingsResponse` | `GET /Setting` | Tenant settings (password policy, IP allowlist, limits) |
| `UpdateSettingsResponse` | `PUT /Setting` | Updated settings echo |
| `ConfigureWalletSettingsResponse` | `POST /Setting/wallets` | Wallet config result |
| `GetWalletSettingsResponse` | `GET /Setting/wallets/{ownerId}` | Wallet config snapshot |
| `GetMainNodeInfoResponse` | `GET /Information` | Account info (mirror of `Info` request) |
| `UpdateMainNodeInfoResponse` | `PUT /Information` | Updated account info echo |
| `ExistResponse` | duplicate-check style endpoints | `bool Exists` (used internally; not directly exposed by Commerce controllers in this scan) |
| `GeneratePasswordResponse` | (internal — Identity surface inherited) | — |
| `GetAllIpAllowlistsResponse` | `GET /Security/ip-allowlists` (east-west) | `Dictionary<string, IpAllowlistEntryDto> Tenants` where entry = `{ bool Enabled, List<string> AllowedIps }` |

## Domain Enums (consumed by clients via integer values)

`eCurrency`, `eWalletBalanceType`, `eWalletBaseType`, `eClassificationCategory`, `eClassificationSubCategory`, `eAuthorityLetterType`, `ePricingType`, `eUserRoles`, `eDeliveryMethod`, `ePasswordSecurityLevel`. Defined in `Falcon.Commerce.Domain.Constants`.
