# NodeController — Validations

## DTO-Level Validation (attribute-based)

`CreateAccountRequest` and `CreateSubNodeRequest` are the only Node-touching DTOs with explicit `[ThrowIf*]` decorations — see [`DTOS.md`](DTOS.md) for the full list. All other request DTOs (the change/disable/enable/delete family) rely on **handler-time** validation only.

## Authorization Validation

`[Authorize]` at class level → caller must have a valid JWT.

`[Authorize(Policy = AuthorizationPolicies.FalconOnly)]` overrides on 12 endpoints:
- All visibility-change endpoints
- All price-type and price-value change endpoints
- All pending-price-deletion endpoints

The policy is defined in `Falcon.Commerce.Infrastructure.Auth.AuthorizationPolicies` (constant string). Backed by a Zitadel JWT claim mapping registered in startup (`AddPesAuthentication(...)` or equivalent in the DI extension `RegisterFalconDependencies(...)`).

## Handler-Level Validation (business rules)

Each handler validates invariants and throws `FalconException(FalconKeys.Error.<Code>)`. Below are the most relevant codes the frontend should anticipate per Node operation:

| Operation | Likely Error Codes |
|---|---|
| Hierarchy reads | `NodeNotFound`, `MainNodeNotFound`, `UnauthorizedUserToPerformThisAction` |
| `CreateMainNode` | `AccountNameRequired`, `AccountNameTooLong`, `DuplicateTenantName`, `DuplicateNodeName`, `MainNodeAccountInfoRequired`, `MainAccountSettingsRequired`, `InvalidAuthorityLetterType`, `CountryRequiredWhenCityProvided`, `CityRequiredWhenDistrictProvided`, `CityRequiredWhenStreetProvided`, `InvalidAccountLimits`, `InvalidWalletBalanceType` |
| `CreateSubNode` | `ParentIdRequired`, `ParentNodeRequired`, `MaxNodeLevelReached`, `DuplicateNodeName`, `RootNodeCannotHaveSubNodes` (sub-of-root constraint), `NodeNotFound` |
| `ChangeNodeName` | `NodeNameRequired`, `NewNodeNameNotApplyed`, `NoChangesToUpdate`, `MaxLengthExceeded`, `ActionsNotAllowedOnDeletedNode` |
| Visibility changes | `CommChannelNotFound`, `ApplicationNotFound`, `ServiceAlreadyActive`, `ServiceAlreadyDisabled`, `ServiceNotVisible`, `CannotHideServiceWithTheCurrentStatus`, `CannotEnableNonDisabledService`, `CannotEnableNonVisibleService`, `CannotDisableNonVisibleService`, `UnauthorizedAction` |
| Price-type / price-value changes | `InvalidPriceType`, `InvalidPriceValue`, `PricingTypeNotConfigured`, `UnsupportedPricingType`, `PriceValueNotConfigured`, `EffectiveDateRequired`, `EffectiveDateMustBeInFuture`, `NewPricingTypeMustPassWithEffectiveDate`, `InvalidEffectiveDateForPeriodicPricingChange`, `HiddenProductMustNotHavePricing`, `ProductHidden`, `FailedToUpdateCommunicationChannelPriceType` |
| Pending-price-deletion endpoints | `NoPendingPriceTypeChange`, `NoPendingPriceValueChange` |
| `DoPayment*` | `CannotPayForDisabledService`, `PendingOrderAlreadyExistsForService`, `ActivationNotAllowedForHiddenProduct`, `InvalidSubscriptionState`, `OrderNotFound` (echoed from order subsystem) |
| `Enable/Disable*` | `CannotEnableNonDisabledService`, `CannotEnableNonVisibleService`, `CannotDisableNonVisibleService` |
| `GetOrderStatus` | `OrderNotFound` |

## Cross-Field Validation

The most complex cross-field rules in `CreateAccountRequest`:
- If `Info.CityId` is provided, `Info.CountryId` must also be provided → `CountryRequiredWhenCityProvided`
- If `Info.District` is provided, `Info.CityId` must be provided → `CityRequiredWhenDistrictProvided`
- If `Info.Street` is provided, `Info.CityId` must be provided → `CityRequiredWhenStreetProvided`
- `MaxNormalUserLimit`, `MaxSystemUserLimit`, `MaxNodeLevel`, `BalanceTransferLimit` must be sensible (handler-side) → `InvalidAccountLimits`

These are not enforced via attributes — they're handler-side `if (...) throw new FalconException(...)`.

## Multi-Language Deviation

`AccountName` is a plain `string` (max 30) in `CreateAccountRequest.Info`. The Wiki / platform standard prescribes `MultiLanguageName(En, Ar)` for user-facing names. **Deviation.** Account names are stored single-language; if the UX wants Arabic support, this requires a contract change.

## Implicit Validation via Mediator-less Handlers

Because NodeController injects handlers directly (no IMediator), `ModelState` validation in the `[ApiController]` automatic pipeline can short-circuit a request with HTTP 400 **before** the controller action runs. Combined with the custom `[ThrowIf*]` attributes (which fire during model binding via custom binder logic), the order of validations is:

1. JSON deserialization → ModelState
2. `[ApiController]` 400 short-circuit if ModelState invalid (Standard DataAnnotations only)
3. Custom `[ThrowIf*]` attribute middleware
4. Controller action → AutoMapper → handler
5. Handler-time business validation
6. Domain-entity validation

Failures at any step funnel through `UseFalconMiddlewares()` into `ServiceOperationResult<T>.Failure(...)` with the right HTTP status.
