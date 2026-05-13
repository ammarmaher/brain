# NodeController — DTOs

> Source: `Falcon.Commerce.Contracts/Models/{RequestsDtos,ResponseDtos}/` for the public contract; `Falcon.Commerce.Application/{Commands,Queries}/` for the internal command/query types (not part of the public contract).
> Commands/queries are mapped to/from public DTOs via AutoMapper profiles in `Falcon.Commerce.Api/Mappings/`.

## Request DTOs

### `CreateAccountRequest` (largest — used by `POST /create-account`)

| Field | Type | Validation | Notes |
|---|---|---|---|
| `Info` | `Info` (nested) | `[ThrowIfNotPassed]` | See nested below |
| `Settings` | `SettingsInfo` (nested) | `[ThrowIfNotPassed]` | See nested below |
| `CommChannels` | `CommChannels?` (nested) | optional | Initial comm channel configurations |
| `Applications` | `Applications?` (nested) | optional | Initial app configurations |
| `AccountOwner` | `AccountOwner` (nested) | `[ThrowIfNotPassed]` | Creates the first user |
| `DeliveryMethod` | `eDeliveryMethod` | `[ThrowIfNotPassed, ThrowIfNotEnumValue<eDeliveryMethod>]` | Drives owner notification |

#### Nested `Info`

| Field | Type | Validation |
|---|---|---|
| `AccountName` | string | `[ThrowIfNotPassed, ThrowIfMaxLengthExceed(30)]` |
| `FinanceId` | string? | — |
| `ProfilePictureInfo` | `ProfilePictureInfo?` | — |
| `ClassificationCategory` | `eClassificationCategory?` | `[ThrowIfNotEnumValue<...>]` |
| `ClassificationSubCategory` | `eClassificationSubCategory?` | `[ThrowIfNotEnumValue<...>]` |
| `AuthorityLetterType` | `eAuthorityLetterType?` | `[ThrowIfNotEnumValue<...>]` |
| `EntityName` | string? | — |
| `Sector`, `BudgetNo`, `CountryId`, `CityId`, `District`, `Street`, `BuildingNumber`, `PostalCode`, `AdditionalAddress`, `AnotherId`, `VatRegistrationNumber` | string? | — (handler enforces cross-field rules like "country required when city provided") |

#### Nested `SettingsInfo`

| Field | Type | Validation |
|---|---|---|
| `PasswordSecurityLevel` | `ePasswordSecurityLevel` | `[ThrowIfNotPassed, ThrowIfNotEnumValue<...>]` |
| `AllowedIPs` | `List<string>?` | — (tenant IP allowlist) |
| `MaxNormalUserLimit` | int | default 0 |
| `MaxSystemUserLimit` | int | default 0 |
| `MaxNodeLevel` | int | default 0 |
| `BalanceTransferLimit` | decimal | default 0 |

#### Nested `AccountOwner`

| Field | Type | Validation |
|---|---|---|
| `AccountOwnerProfilePictureInfo` | `ProfilePictureInfo?` | — |
| `FirstName` / `LastName` / `UserName` | string | `[ThrowIfNotPassed]` |
| `Password` | string? | — (generated if not supplied) |
| `NationalId` | string? | — |
| `PhoneNumber` / `EmailAddress` | string | — (no `[ThrowIfNotPassed]` despite being required; handler may enforce) |
| `Role` | `eUserRoles` | `[ThrowIfNotPassed, ThrowIfNotEnumValue<eUserRoles>]` |

### `CreateSubNodeRequest`

| Field | Type | Validation |
|---|---|---|
| `ParentId` | string? | `[ThrowIfNotPassed]` |
| `Name` | string? | `[ThrowIfNotPassed, ThrowIfMaxLengthExceed(30)]` |

### `ChangeNodeNameRequest`

Fields: `NodeId`, `NewName`, `EffectiveDate?` (Inferred from handler signature; concrete DTO not deep-read in this scan.)

### Visibility/Pricing DTOs

`ChangeAccountCommunicationChannelServiceVisibilityRequest`, `ChangeAccountApplicationServiceVisibilityRequest`, `ChangeCommunicationChannelPriceTypeRequest`, `ChangeCommunicationChannelPriceValueRequest`, `ChangeApplicationPriceTypeRequest`, `ChangeApplicationPriceValueRequest` — all follow the pattern `{ NodeId, ChannelId or ApplicationId, NewValue, EffectiveDate? }`. (Not deep-read in this scan; recommended for the next drill-down.)

### Pending Price Deletion DTOs

`DeleteCommunicationChannelNewPriceTypeRequest`, `DeleteCommunicationChannelNewPriceValueRequest`, `DeleteApplicationNewPriceTypeRequest`, `DeleteApplicationNewPriceValueRequest` — all carry `{ NodeId, ChannelId|ApplicationId }`.

### Service Lifecycle DTOs

`DoPaymentCommunicationChannelRequest`, `DoPaymentApplicationRequest`, `DisableCommunicationChannelRequest`, `EnableCommunicationChannelRequest`, `DisableApplicationRequest`, `EnableApplicationRequest` — all carry identifiers + business context. Map to `CreateFalconServiceOrderCommand` (do-payment) or service-specific commands (disable/enable).

## Response DTOs (T inside `ServiceOperationResult<T>`)

| Response | Notable Fields |
|---|---|
| `GetHierarchyNodeResponse` (list element) | `NodeId, NodeName, ParentId?, IsMain, List<GetHierarchyNodeResponse> SubNodes` (inferred from naming) |
| `CreateAccountResponse` | `AccountId` (the new node id) |
| `AccountCommunicationChannelResponse` | per-account channel projection: `ChannelId, Visibility, PricingType, PriceValue, EffectiveDate?` |
| `VisibleCommunicationChannelResponse` | lightweight visible-only projection |
| `AccountApplicationResponse` | per-account application projection (mirror of channel) |
| `Change*Response` family | echoes the change with effective date |
| `Disable*Response` / `Enable*Response` family | echoes the new state |
| `DoPayment*Response` family | order id, status, redirect/token if applicable |
| `Delete*Response` family | echoes the cancellation |
| `GetOrderStatusResponse` | order id, status, last update, payment/charging linkage |

## Command/Query types (internal, in `Falcon.Commerce.Application`)

| Internal Type | Used By |
|---|---|
| `GetOrgHierarchyNodeQuery { string NodeId }` | `GetHierarchy` |
| `ValidateAccountNameQuery(string AccountName)` | `ValidateAccountName` |
| `GetAccountCommunicationChannelsQuery { string NodeId }` | `GetAccountCommunicationChannels` |
| `GetVisibleCommunicationChannelsQuery(string NodeId)` | `GetVisibleCommunicationChannels` |
| `GetVisibleCommunicationChannelDetailsQuery(string NodeId)` | `GetVisibleCommunicationChannelDetails` |
| `GetAccountApplicationsQuery { string NodeId }` | `GetAccountApplications` |
| `GetOrderStatusQuery { string OrderId }` | `GetOrderStatus` |
| `CreateSubNodeCommand` (mapped) | `CreateSubNode` |
| `ChangeNodeNameCommand` (mapped) | `ChangeNodeName` |
| `ChangeAccount...VisibilityCommand` (mapped) | visibility endpoints |
| `Change...PriceTypeCommand` / `Change...PriceValueCommand` (mapped) | price endpoints |
| `Delete...NewPriceTypeCommand` / `Delete...NewPriceValueCommand` (mapped) | pending-delete endpoints |
| `Disable...Command` / `Enable...Command` (mapped) | disable/enable endpoints |
| `CreateFalconServiceOrderCommand` (mapped from `DoPayment*Request`) | both do-payment endpoints |

The mapping profiles live in `Falcon.Commerce.Api/Mappings/Manual/ToCommand/` and `ToResponse/`.
