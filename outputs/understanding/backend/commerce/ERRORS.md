# Commerce Service — Error Catalog

> Source-of-truth: `Falcon.Commerce.Domain/Constants/FalconKeys.cs` (the `Error` inner class).
> Each constant is decorated with `[ErrorHttpStatus(NNN)]` — Commerce is the **only** service in the platform that explicitly tags every error code with its HTTP status. The middleware uses this attribute to map the code to a status code.

## By HTTP Status

### 500 — Internal Server Error

`InternalServerError`, `UnknownError`, `ExternalServiceError`, `ExternalServiceConnectionError`, `ExternalServiceTimeout`, `CreateIdentityUserFailed`, `GetIdentityUserFailed`, `RenewalJobCreationFailed`, `RenewalJobFailed`, `FailedToUpdateCommunicationChannelPriceType`.

Plus **Zitadel infrastructure** failures (also 500): `ZitadelServiceUserTokenNotConfigured`, `ZitadelGetOrganizationFailed`, `ZitadelOrganizationNotFound`, `ZitadelCreateProjectFailed`, `ZitadelCreateWebPlatformUiAppFailed`, `ZitadelCreateApiAppFailed`, `ZitadelSearchUserFailed`, `ZitadelAdminUserNotFound`, `ZitadelCreateMachineUserFailed`, `ZitadelLockUserFailed`, `ZitadelUnlockUserFailed`, `ZitadelDeactivateUserFailed`, `ZitadelReactivateUserFailed`, `ZitadelSetAdminMetadataFailed`, `ZitadelUpdateUserProfileFailed`, `ZitadelUpdateUserPhoneFailed`, `PhoneVerificationFailed`, `EmailVerificationFailed`.

### 401 — Unauthorized

`InvalidCredentials`, `Unauthorized`, `InvalidRefreshToken`.

### 403 — Forbidden

`Forbidden`, `UserSuspended`, `UserPending`, `InvalidIpAddress`, `UnauthorizedProfileEdit`, `UnauthorizedAction`, `UnauthorizedUserToPerformThisAction`.

### 404 — Not Found

`UserNotFound`, `NodeNotFound`, `MainNodeNotFound`, `ProductNotFound`, `ProductSubscriptionNotFound`, `NoProductSubscriptionFound`, `SettingsNotFound`, `AccountLimitNotFound`, `OrderNotFound`, `ApplicationNotFound`, `ApplicationNotFoundForAccount`, `CommunicationChannelNotFound`, `CommunicationChannelNotFoundForAccount`, `CommChannelNotFound`, `ScheduleJobNotFound`, `WalletSettingsNotFound`, `NoPendingPriceTypeChange`, `NoPendingPriceValueChange`, `ContractNotFound`.

### 409 — Conflict

`DuplicateUsername`, `DuplicateValue`, `DuplicateTenantName`, `AdminAlreadyExists`, `ProductAlreadyExists`, `ProductAlreadyActivated`, `DuplicateNodeName`, `ServiceAlreadyActive`, `ServiceAlreadyDisabled`, `UserAlreadyExists`, `UserAlreadyInStatus`, `ZitadelAlreadyInitialized`, `WalletSettingsAlreadyConfigured`, `PendingOrderAlreadyExistsForService`, `PhoneAlreadyVerified`, `EmailAlreadyVerified`.

### 422 — Unprocessable Entity (business rule violations)

`InvalidStatusTransition`, `InvalidSubscriptionState`, `InvalidRoleForUserType`, `InvalidPassword`, `InvalidValue`, `InvalidCreationFlow`, `InvalidTenantId`, `MainNodeOnlyOperation`, `ProductHidden`, `RootNodeDeletionNotAllowed`, `RootNodeCannotHaveSubNodes`, `ActionsNotAllowedOnDeletedNode`, `ActivationNotAllowedForHiddenProduct`, `CannotPayForDisabledService`, `CannotHideServiceWithTheCurrentStatus`, `CannotDisableNonVisibleService`, `CannotEnableNonDisabledService`, `CannotEnableNonVisibleService`, `RenewalNotDueYet`, `NormalUserLimitReached`, `MaxNodeLevelReached`, `FalconUserMustNotHaveTenantId`, `OnlyFalconUserCanRestoreDeletedUser`, `ChangePasswordFailed`, `ServiceNotVisible`, `UserDoesNotOwnRequestedService`, `WalletStrategyRequiredForContract`, `ContractEditOnlyAllowedWhenPending`, `InvalidContractConfiguration`, `PricingTypeNotConfigured`, `UnsupportedPricingType`, `HiddenProductMustNotHavePricing`, `InvalidAuthorityLetterType`, `InvalidNodeLevel`, `InvalidAccountLimits`, `NoChangesToUpdate`, `NewNodeNameNotApplyed`, `NewPricingTypeMustPassWithEffectiveDate`, `EffectiveDateMustBeInFuture`, `InvalidEffectiveDateForPeriodicPricingChange`, `PriceValueNotConfigured`, `OwnerIdNotMatchWithTenantId`, `SettingsOnlyAllowedForMainNode`, `WalletSettingsOnlyForMainNode`, `InvalidWalletBalanceType`, `InvalidVerificationCode`.

### 400 — Bad Request (input validation)

`EnNameRequired`, `ArNameRequired`, `AccountNameRequired`, `AccountIdRequired`, `InvalidNodeFormat`, `AccountNameTooLong`, `FinanceIdRequired`, `ProductIdRequired`, `ProductNameRequired`, `InvalidPriceValue`, `InvalidPriceType`, `BudgetNoRequired`, `CommercialRegistrationRequired`, `LicenseNoRequired`, `TenantIdRequired`, `UpdateRequestCantBeNull`, `ParentIdRequired`, `ParentNodeRequired`, `CountryRequiredWhenCityProvided`, `CityRequiredWhenDistrictProvided`, `CityRequiredWhenStreetProvided`, `OfficialDataRequired`, `OwnerIdRequired`, `ProfilePictureSizeExceeded`, `MaxLengthExceeded`, `BelowMinimumLength`, `RequiredFieldMissing`, `ExecutableFileNotAllowed`, `FileSizeExceeded`, `InvalidUserExistQuery`, `PriceValueRequired`, `NodeNameRequired`, `MainAccountSettingsRequired`, `MainNodeAccountInfoRequired`, `ImageExtensionNotAllowed`, `EffectiveDateRequired`, `RenewalDateCantBeEmpty`, `CurrencyRequired`, `WalletBalanceTypeRequired`, `WalletTypeRequired`, `AdminIdRequired`, `FirstNameLettersOnly`, `LastNameLettersOnly`, `UsernameMustStartWithLetter`, `InvalidImageFile`, `InvalidPhoneNumber`.

### 423 — Locked

`UserLocked`.

### 429 — Too Many Requests

`OtpStillValid`.

### 503 — Service Unavailable

`ServiceUnavailable`.

## How Errors Are Raised

```csharp
throw new FalconException(FalconKeys.Error.NodeNotFound);   // single
throw new FalconException(new[] {
  new Error(FalconKeys.Error.AccountNameRequired),
  new Error(FalconKeys.Error.OwnerIdRequired)
});
```

The exception handler middleware reads the `[ErrorHttpStatus]` attribute reflection-style on the constant to set the response status. Without the attribute the default is 400.

## Localization

`Resources/ErrorMessages.en.resx` + `ErrorMessages.ar.resx` provide translations. `app.ValidateErrrosResourceCompleteness()` fails service startup if any code is missing a translation.

## Inter-Service Error Surface

When Commerce calls Identity/Charging/Provisioning over HTTP and gets a non-success result, it re-raises as `FalconException(FalconKeys.Error.ExternalServiceError)` (500) — preserving the downstream error message in the inner exception. There is no error-code propagation between services — each service uses its own catalog.
