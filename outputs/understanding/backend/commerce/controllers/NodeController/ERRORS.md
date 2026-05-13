# NodeController — Errors

> Subset of the platform-wide [`commerce/ERRORS.md`](../../ERRORS.md) relevant to Node operations. Each code is decorated with `[ErrorHttpStatus(NNN)]` in `Falcon.Commerce.Domain.Constants.FalconKeys.Error` — the middleware maps it to that HTTP status.

## Hierarchy Errors (404 / 422)

| Code | Status | When |
|---|---:|---|
| `NodeNotFound` | 404 | Lookup misses (GET hierarchy, GET account services, …) |
| `MainNodeNotFound` | 404 | Operation requires the account's root node and it's gone |
| `ProductNotFound` | 404 | Comm channel / Application not in the global catalog |
| `ApplicationNotFound` | 404 | Application id unknown globally |
| `ApplicationNotFoundForAccount` | 404 | Application not provisioned for the account |
| `CommunicationChannelNotFound` | 404 | Channel unknown globally |
| `CommunicationChannelNotFoundForAccount` | 404 | Channel not provisioned for the account |
| `CommChannelNotFound` | 404 | (alias used by some handlers) |
| `OrderNotFound` | 404 | Order id unknown |
| `NoPendingPriceTypeChange` | 404 | DELETE called when no pending price-type change exists |
| `NoPendingPriceValueChange` | 404 | DELETE called when no pending price-value change exists |

## Hierarchy / Account Errors (422)

| Code | Status | When |
|---|---:|---|
| `MainNodeOnlyOperation` | 422 | Operation attempted on a sub-node (e.g. settings update) |
| `RootNodeDeletionNotAllowed` | 422 | Attempt to delete the account root |
| `RootNodeCannotHaveSubNodes` | 422 | Account root has special semantics |
| `ActionsNotAllowedOnDeletedNode` | 422 | Operation on soft-deleted node |
| `InvalidNodeLevel` | 422 | Sub-node depth violation |
| `MaxNodeLevelReached` | 422 | `MaxNodeLevel` setting exceeded |
| `InvalidCreationFlow` | 422 | Invariant on creation flow |

## Validation Errors (400)

| Code | Status | When |
|---|---:|---|
| `NodeNameRequired` | 400 | Empty node name on rename/create |
| `ParentIdRequired` | 400 | Empty parent in `CreateSubNode` |
| `ParentNodeRequired` | 400 | Parent node lookup empty |
| `AccountNameRequired` | 400 | Empty account name |
| `AccountIdRequired` | 400 | Empty account id parameter |
| `AccountNameTooLong` | 400 | > 30 chars |
| `InvalidNodeFormat` | 400 | Node id shape wrong |
| `MainNodeAccountInfoRequired` | 400 | `Info` missing on `CreateAccountRequest` |
| `MainAccountSettingsRequired` | 400 | `Settings` missing on `CreateAccountRequest` |
| `CountryRequiredWhenCityProvided` | 400 | Address fragment without parent |
| `CityRequiredWhenDistrictProvided` | 400 | — |
| `CityRequiredWhenStreetProvided` | 400 | — |
| `MaxLengthExceeded` | 400 | Custom `[ThrowIfMaxLengthExceed]` violation |
| `RequiredFieldMissing` | 400 | Custom `[ThrowIfNotPassed]` violation |
| `InvalidValue` | 400 | Custom `[ThrowIfNotEnumValue<>]` violation |
| `EffectiveDateRequired` | 400 | Price changes need a date |
| `CurrencyRequired` | 400 | — |
| `WalletBalanceTypeRequired` | 400 | — |
| `WalletTypeRequired` | 400 | — |
| `InvalidPhoneNumber` | 400 | — |
| `InvalidPriceValue` | 400 | — |
| `InvalidPriceType` | 400 | — |
| `PriceValueRequired` | 400 | — |

## Service Lifecycle / Pricing Errors (422)

| Code | Status |
|---|---:|
| `ServiceAlreadyActive` | 409 |
| `ServiceAlreadyDisabled` | 409 |
| `ServiceNotVisible` | 422 |
| `CannotHideServiceWithTheCurrentStatus` | 422 |
| `CannotPayForDisabledService` | 422 |
| `CannotEnableNonDisabledService` | 422 |
| `CannotEnableNonVisibleService` | 422 |
| `CannotDisableNonVisibleService` | 422 |
| `ProductHidden` | 422 |
| `ActivationNotAllowedForHiddenProduct` | 422 |
| `HiddenProductMustNotHavePricing` | 422 |
| `PricingTypeNotConfigured` | 422 |
| `UnsupportedPricingType` | 422 |
| `PriceValueNotConfigured` | 422 |
| `NewPricingTypeMustPassWithEffectiveDate` | 422 |
| `EffectiveDateMustBeInFuture` | 422 |
| `InvalidEffectiveDateForPeriodicPricingChange` | 422 |
| `PendingOrderAlreadyExistsForService` | 409 |
| `InvalidSubscriptionState` | 422 |
| `UserDoesNotOwnRequestedService` | 422 |

## Auth Errors

| Code | Status |
|---|---:|
| `Unauthorized` | 401 |
| `Forbidden` | 403 |
| `UnauthorizedAction` | 403 |
| `UnauthorizedUserToPerformThisAction` | 403 |

## Infra / External Errors (500)

| Code | Status |
|---|---:|
| `InternalServerError` | 500 |
| `UnknownError` | 500 |
| `ExternalServiceError` | 500 |
| `ExternalServiceConnectionError` | 500 |
| `ExternalServiceTimeout` | 500 |
| `FailedToUpdateCommunicationChannelPriceType` | 500 |
