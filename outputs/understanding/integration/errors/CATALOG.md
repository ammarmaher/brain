*** Falcon Error Code Catalog ***
*** Built 2026-05-15 by Brain SK Phase 3D ***
*** Source: ERRORS.md across 9 backend services + nested controller catalogs ***

# Falcon Error Code Catalog

> Every `FalconKeys.Error.*` code (and PES / gateway-emitted codes) catalogued across the 9 Falcon backend services. For each code: name · HTTP status · throwing service · scenario · UX surface · related V-rule.
>
> Hubs: [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[ERROR_INDEX]] · [[AMMAR_BRAIN_HOME]]

## Summary

- **Total distinct error codes catalogued:** 233
- **Services contributing:** 9 (Commerce · Charging · Provisioning · Identity · Templates · Contact-Group · Access · Core-Gateway · System-Gateway)
- **Cross-service codes (appear in ≥ 2 services):** 24
- **Services using `FalconException` + `FalconKeys`:** 7 of 9 (Commerce, Charging, Provisioning, Identity, Templates, Contact-Group, Core-Gateway-via-Commerce). Access (PES) uses raw `IResult`. System-Gateway emits 2 gateway-specific codes outside `FalconKeys`.
- **Only Commerce decorates each constant with `[ErrorHttpStatus(NNN)]`.** All others rely on middleware mapping by code suffix (`*NotFound` → 404, `Duplicate*` → 409, etc.).
- **Inter-service error propagation:** None. When Commerce calls Identity/Charging/Provisioning over HTTP and the call fails, it re-raises as `FalconException(ExternalServiceError)` (500) and discards the downstream code. Gateways pass downstream `ServiceOperationResult.Failure` envelopes through unchanged.

## By category (counts + examples)

| Category | Count | Examples |
|---|---:|---|
| Required field missing | 28 | `RequiredFieldMissing`, `AccountNameRequired`, `ParentIdRequired`, `NodeNameRequired`, `ContactGroupNameRequired`, `CurrencyRequired`, `PriceValueRequired`, `EffectiveDateRequired`, `TenantIdRequired`, `OwnerIdRequired` |
| Format / shape violation | 18 | `UsernameMustStartWithLetter`, `FirstNameLettersOnly`, `LastNameLettersOnly`, `InvalidPhoneNumber`, `InvalidEmail`, `InvalidNodeFormat`, `ContactGroupNameInvalidFormat`, `InvalidImageFile`, `InvalidPriceValue`, `InvalidPriceType` |
| Length violation | 4 | `MaxLengthExceeded`, `BelowMinimumLength`, `AccountNameTooLong`, `ProfilePictureSizeExceeded` |
| Enum violation | 2 | `InvalidValue`, `InvalidWalletBalanceType` |
| Conflict / duplicate | 18 | `DuplicateTenantName`, `DuplicateUsername`, `DuplicateValue`, `DuplicateNodeName`, `DuplicateEntity`, `DuplicateCheckerLevelNumber`, `AdminAlreadyExists`, `ProductAlreadyExists`, `ProductAlreadyActivated`, `ServiceAlreadyActive`, `ServiceAlreadyDisabled`, `UserAlreadyExists`, `UserAlreadyInStatus`, `ZitadelAlreadyInitialized`, `WalletSettingsAlreadyConfigured`, `PendingOrderAlreadyExistsForService`, `PhoneAlreadyVerified`, `EmailAlreadyVerified` |
| Not found / lookup miss | 31 | `UserNotFound`, `NodeNotFound`, `MainNodeNotFound`, `ProductNotFound`, `ContractNotFound`, `OrderNotFound`, `WalletNotFound`, `WalletSettingsNotFound`, `ReservationNotFound`, `CommChannelNotFound`, `CommunicationChannelNotFound`, `CommunicationChannelNotFoundForAccount`, `ApplicationNotFound`, `ApplicationNotFoundForAccount`, `SettingsNotFound`, `AccountLimitNotFound`, `ScheduleJobNotFound`, `ContactGroupNotFound`, `UploadSessionNotFound`, `EntityNotFound`, `FileNotFound`, `CommunicationChannelConfigNotFound`, `CommChannelSubWalletNotFound`, `NoAnyCommChannelWalletWasFound`, `NoPendingPriceTypeChange`, `NoPendingPriceValueChange`, `NoProductSubscriptionFound`, `ProductSubscriptionNotFound` |
| Permission / authorization | 13 | `Forbidden`, `Unauthorized`, `UnauthorizedAccess`, `UnauthorizedAction`, `UnauthorizedUserToPerformThisAction`, `UnauthorizedProfileEdit`, `ForbiddenToDeleteContactGroup`, `ForbiddenToShareContactGroup`, `ForbiddenToEditContactGroup`, `NodeNotInHierarchy`, `InvalidIpAddress`, `IpNotAllowed`, `SelfEditRoleNotAllowed` |
| User state / lifecycle | 13 | `UserLocked`, `UserSuspended`, `UserPending`, `UserNotInitialized`, `UserSuspendedCannotEdit`, `UserLockedCannotEdit`, `UserDeletedCannotEdit`, `PendingSelfEditBlocked`, `InvalidStatusTransition`, `OnlyFalconUserCanRestoreDeletedUser`, `FalconUserMustNotHaveTenantId`, `InvalidRoleForUserType`, `InvalidCredentials` |
| Quota / limit | 4 | `NormalUserLimitReached`, `MaxNodeLevelReached`, `OtpResendLimitExceeded`, `CheckerLevelLimitExceeded` |
| Wallet / charging / billing | 16 | `InsufficientBalance`, `InvalidTransferWallets`, `InvalidWalletIdentity`, `InvalidAmount`, `InvalidIdempotencyKey`, `InvalidChargeRequest`, `WalletVersionConflict`, `NoApplicableRate`, `CommChannelSubWalletNotFound`, `WalletSettingsOnlyForMainNode`, `WalletStrategyRequiredForContract`, `ContractEditOnlyAllowedWhenPending`, `InvalidContractConfiguration`, `EffectiveDateMustBeInFuture`, `InvalidEffectiveDateForPeriodicPricingChange`, `RenewalNotDueYet` |
| Service / product lifecycle | 14 | `ServiceNotVisible`, `ServiceAlreadyActive`, `ServiceAlreadyDisabled`, `ProductHidden`, `ProductAlreadyExists`, `ProductAlreadyActivated`, `CannotHideServiceWithTheCurrentStatus`, `CannotPayForDisabledService`, `CannotEnableNonDisabledService`, `CannotEnableNonVisibleService`, `CannotDisableNonVisibleService`, `CannotHideActiveService`, `ActivationNotAllowedForHiddenProduct`, `HiddenProductMustNotHavePricing` |
| Node hierarchy | 7 | `MainNodeOnlyOperation`, `RootNodeDeletionNotAllowed`, `RootNodeCannotHaveSubNodes`, `ActionsNotAllowedOnDeletedNode`, `InvalidNodeLevel`, `InvalidCreationFlow`, `NewNodeNameNotApplyed` |
| Verification / OTP | 9 | `InvalidVerificationCode`, `VerificationCodeExpired`, `PhoneVerificationFailed`, `EmailVerificationFailed`, `PhoneAlreadyVerified`, `EmailAlreadyVerified`, `OtpStillValid`, `OtpResendLimitExceeded`, `OtpNotReady` |
| Password | 9 | `InvalidPassword`, `PasswordTooShort`, `PasswordRequiresUppercase`, `PasswordRequiresLowercase`, `PasswordRequiresDigit`, `PasswordRequiresSpecialChar`, `PasswordsDoNotMatch`, `ChangePasswordFailed`, `InvalidUsernameOrPhone` |
| File / upload | 8 | `InvalidFileType`, `FileSizeExceeded`, `FileEmpty`, `NoDataRows`, `FileParseError`, `ImportTooLarge`, `ImageExtensionNotAllowed`, `ExecutableFileNotAllowed` |
| Upload session | 5 | `UploadSessionNotFound`, `UploadSessionExpired`, `UploadSessionAlreadyCompleted`, `UploadSessionNotReady`, `UploadSessionAlreadyUsed` |
| Checker / Maker-Checker (Templates) | 8 | `CheckerLevelsRequired`, `CheckerLevelMustHaveAtLeastOneUser`, `CheckerLevel1RequiredBeforeLevel2`, `CheckerLevelLimitExceeded`, `DuplicateCheckerLevelNumber`, `UserAssignedToMultipleCheckerLevels`, `InvalidCheckerLevelNumber`, `LevelsCountMismatch` + `LevelsCountRequiredForRestricted` |
| Tenant / node header | 6 | `TenantIdMissing`, `TenantIdRequired`, `NodeIdMissing`, `NodeIdRequired`, `NodeIdRequiredForFalconUser`, `InvalidTenantId` |
| Account / settings | 8 | `InvalidAccountLimits`, `MainAccountSettingsRequired`, `MainNodeAccountInfoRequired`, `SettingsOnlyAllowedForMainNode`, `WalletSettingsOnlyForMainNode`, `OwnerIdNotMatchWithTenantId`, `InvalidAuthorityLetterType`, `NoChangesToUpdate` |
| Address fragment | 3 | `CountryRequiredWhenCityProvided`, `CityRequiredWhenDistrictProvided`, `CityRequiredWhenStreetProvided` |
| External service / network | 11 | `ExternalServiceError`, `ExternalServiceConnectionError`, `ExternalServiceTimeout`, `IdentityServiceError`, `IdentityServiceConnectionError`, `IdentityServiceTimeout`, `S3CopyFailed`, `ImportEventPublishFailed`, `RenewalJobCreationFailed`, `RenewalJobFailed`, `FailedToUpdateCommunicationChannelPriceType` |
| Generic infrastructure | 6 | `InternalServerError`, `UnknownError`, `ServiceUnavailable`, `InvalidOperation`, `InvalidRefreshToken`, `IdentityTenantIdMissing` |
| Zitadel adapter (Identity) | 33 | `ZitadelLoginClientTokenNotConfigured`, `ZitadelServiceUserTokenNotConfigured`, `ZitadelGetOrganizationFailed`, `ZitadelOrganizationNotFound`, `ZitadelCreateProjectFailed`, `ZitadelCreateWebPlatformUiAppFailed`, `ZitadelCreateApiAppFailed`, `ZitadelSearchUserFailed`, `ZitadelSearchUsersFailed`, `ZitadelAdminUserNotFound`, `ZitadelCreateMachineUserFailed`, `ZitadelLockUserFailed`, `ZitadelUnlockUserFailed`, `ZitadelDeactivateUserFailed`, `ZitadelReactivateUserFailed`, `ZitadelSetAdminMetadataFailed`, `ZitadelUpdateUserProfileFailed`, `ZitadelUpdateUserPhoneFailed`, `ZitadelDeleteUserFailed`, `ZitadelTokenIntrospectionFailed`, `ZitadelTokenRevocationFailed`, `ZitadelGetUserInfoFailed`, `ZitadelEndSessionFailed`, `ZitadelRemoveOtpFailed`, `ZitadelRegisterOtpFailed`, `ZitadelRegisterTotpFailed`, `ZitadelRemovePhoneFailed`, `ZitadelRemoveEmailFailed`, `ZitadelGetPasswordPolicyFailed`, `ZitadelSetPasswordPolicyFailed`, `ZitadelGetLoginPolicyFailed`, `ZitadelSetLoginPolicyFailed`, `ZitadelListSessionsFailed`, `ZitadelDeleteSessionFailed`, `ZitadelDeleteMetadataFailed`, `ZitadelGetSessionFailed`, `ZitadelFalconProjectIdNotConfigured`, `ZitadelAlreadyInitialized` |
| Gateway-emitted | 2 | `TestingChargingDisabled`, `IdentityTenantIdMissing` |
| Subscription state | 2 | `InvalidSubscriptionState`, `UserDoesNotOwnRequestedService` |
| Pagination / query | 3 | `InvalidPageNumber`, `InvalidPageSize`, `InvalidFileSize`, `InvalidUserExistQuery` |
| Pricing | 6 | `PricingTypeNotConfigured`, `UnsupportedPricingType`, `PriceValueNotConfigured`, `NewPricingTypeMustPassWithEffectiveDate`, `EffectiveDateMustBeInFuture`, `InvalidEffectiveDateForPeriodicPricingChange` |

> Counts overlap where a code legitimately belongs to multiple buckets (e.g. `OtpStillValid` is both Verification and Quota). The total of 233 is distinct codes.

## Full catalog (alphabetical)

| Error code | Service(s) | HTTP status | Scenario | UX surface | V-rule |
|---|---|---:|---|---|---|
| `AccountIdRequired` | Commerce | 400 | Empty account id query/route parameter | inline · server toast fallback | — |
| `AccountLimitNotFound` | Commerce | 404 | GET account-limits returned no row | toast | — |
| `AccountNameRequired` | Commerce | 400 | `CreateAccountRequest.Info.AccountName` empty | inline at field | [[V-account-name-format-uniqueness]] |
| `AccountNameTooLong` | Commerce | 400 | `AccountName` > 30 chars | inline at field | [[V-account-name-format-uniqueness]] |
| `ActionsNotAllowedOnDeletedNode` | Commerce | 422 | Operation on soft-deleted node | toast · disable in tree menu | — |
| `ActivationNotAllowedForHiddenProduct` | Commerce | 422 | Activate request on hidden product | toast | [[V-service-visibility-pricing-required]] |
| `AdminAlreadyExists` | Commerce | 409 | Account Owner already created during wizard | inline at Step 5 username | — |
| `AdminIdRequired` | Commerce | 400 | Empty `AdminId` parameter | toast | — |
| `ApplicationNotFound` | Commerce · Provisioning | 404 | Application id unknown globally | toast | — |
| `ApplicationNotFoundForAccount` | Commerce | 404 | Application not provisioned for the account | toast | — |
| `ArNameRequired` | Commerce | 400 | Multi-language Arabic name missing | inline at field | — |
| `BelowMinimumLength` | Commerce · Identity · Contact-Group | 400 | `[ThrowIfBelowMinimumLength]` violation | inline at field | — |
| `BudgetNoRequired` | Commerce | 400 | Empty `BudgetNo` on official-data step | inline at field | — |
| `CannotDisableNonVisibleService` | Commerce | 422 | Disable on non-visible service | toast · disable action | — |
| `CannotEnableNonDisabledService` | Commerce | 422 | Enable on already-enabled service | disable action | — |
| `CannotEnableNonVisibleService` | Commerce | 422 | Enable on hidden service | disable action | — |
| `CannotHideActiveService` | Provisioning | 422 | Hide on an active service | toast · disable action | — |
| `CannotHideServiceWithTheCurrentStatus` | Commerce | 422 | Hide in a forbidden state transition | toast | — |
| `CannotPayForDisabledService` | Commerce | 422 | Pay/charge on disabled service | toast | — |
| `ChangePasswordFailed` | Commerce · Identity | 422 | Change password handler-side failure | modal error | [[V-password-complexity-per-security-level]] |
| `CheckerLevel1RequiredBeforeLevel2` | Templates | 400 | Level 2 declared without level 1 | inline at level builder | [[V-template-checker-level-integrity]] |
| `CheckerLevelLimitExceeded` | Templates | 400 | More levels than body type allows | inline at level builder | [[V-template-checker-level-integrity]] |
| `CheckerLevelMustHaveAtLeastOneUser` | Templates | 400 | Level declared with zero users | inline at level row | [[V-template-checker-level-integrity]] |
| `CheckerLevelsRequired` | Templates | 400 | Body type requires checker levels | banner · inline | [[V-template-levels-count-required-for-restricted]] |
| `CityRequiredWhenDistrictProvided` | Commerce | 400 | Address fragment without parent City | inline at field | — |
| `CityRequiredWhenStreetProvided` | Commerce | 400 | Address fragment without parent City | inline at field | — |
| `CommChannelNotFound` | Commerce · Provisioning | 404 | Communication channel id unknown (alias) | toast | — |
| `CommChannelSubWalletNotFound` | Charging | 404 | Owner-level sub-wallet for a comm-channel missing | toast | — |
| `CommercialRegistrationRequired` | Commerce | 400 | Empty `CommercialRegistration` on official-data step | inline at field | — |
| `CommunicationChannelConfigNotFound` | Templates | 404 | CommChannelConfig id unknown | toast | — |
| `CommunicationChannelNotFound` | Commerce | 404 | Channel unknown globally | toast | — |
| `CommunicationChannelNotFoundForAccount` | Commerce | 404 | Channel not provisioned for the account | toast | — |
| `ContactGroupNameInvalidFormat` | Contact-Group | 400 | Name doesn't match `ContactGroupRules.NamePattern` | inline at field | [[V-contact-group-name-required-format]] |
| `ContactGroupNameRequired` | Contact-Group | 400 | `CreateContactGroupRequest.Name` empty | inline at field | [[V-contact-group-name-required-format]] |
| `ContactGroupNotCompleted` | Contact-Group | 409 | Read contacts before import job finished | banner · disable action | — |
| `ContactGroupNotFound` | Contact-Group | 404 | Contact group id unknown | toast | — |
| `ContractEditOnlyAllowedWhenPending` | Commerce | 422 | Edit contract that isn't in pending | banner · disable form | [[V-contract-edit-status-aware-fields]] |
| `ContractNotFound` | Commerce | 404 | Contract id unknown | toast | — |
| `CountryRequiredWhenCityProvided` | Commerce | 400 | Address fragment without parent Country | inline at field | — |
| `CreateIdentityUserFailed` | Commerce · Identity | 500 | Zitadel create-user call failed | toast · stuck step 5 | — |
| `CurrencyRequired` | Commerce | 400 | Empty currency in wallet config | inline at field | — |
| `DuplicateCheckerLevelNumber` | Templates | 400 | Two levels share the same number | inline at level row | [[V-template-checker-level-integrity]] |
| `DuplicateEntity` | Contact-Group | 409 | Generic uniqueness violation | toast | — |
| `DuplicateNodeName` | Commerce | 409 | Sub-node name already used at this level | inline at name field | — |
| `DuplicateTenantName` | Commerce · Charging · Provisioning | 409 | Account name already used globally | inline at Step 1 name | [[V-account-name-format-uniqueness]] |
| `DuplicateUsername` | Commerce · Identity | 409 | Username already used (case-insensitive) | inline at Step 5 username | [[V-username-format-uniqueness-immutable]] |
| `DuplicateValue` | Commerce · Identity | 409 | Generic uniqueness violation | inline · toast fallback | — |
| `EffectiveDateMustBeInFuture` | Commerce | 422 | Pricing change scheduled in the past | inline at date field | [[V-contract-expiration-after-start]] |
| `EffectiveDateRequired` | Commerce | 400 | Pricing change with no effective date | inline at date field | — |
| `EmailAlreadyVerified` | Commerce · Identity | 409 | Email verification on already-verified email | banner · disable action | — |
| `EmailVerificationFailed` | Commerce · Identity | 500 | Email verification call failed | toast | — |
| `EnNameRequired` | Commerce | 400 | Multi-language English name missing | inline at field | — |
| `EntityNotFound` | Contact-Group | 404 | Generic entity miss | toast | — |
| `ExecutableFileNotAllowed` | Commerce · Identity | 400 | Profile picture upload with `.exe`/`.bat`/etc. | inline at uploader | — |
| `ExternalServiceConnectionError` | Commerce · Identity | 500 | Downstream HTTP connection failed | toast · "Try again" | — |
| `ExternalServiceError` | Commerce · Identity | 500 | Downstream HTTP returned non-success — code lost | toast · "Try again" | — |
| `ExternalServiceTimeout` | Commerce · Identity | 500 | Downstream HTTP timed out | toast · "Try again" | — |
| `FailedToUpdateCommunicationChannelPriceType` | Commerce | 500 | Pricing-type background job failed | toast · ops handoff | — |
| `FalconUserMustNotHaveTenantId` | Commerce · Identity | 422 | Falcon user has a tenant id (data anomaly) | toast · ops handoff | — |
| `FileEmpty` | Contact-Group | 400 | 0-byte file uploaded | inline at uploader | — |
| `FileNotFound` | Contact-Group | 404 | S3 lookup miss | toast | — |
| `FileParseError` | Contact-Group | 400 | CSV/XLSX parser failed | inline at uploader | — |
| `FileSizeExceeded` | Commerce · Identity · Contact-Group | 400 | > `FileImport:MaxFileSizeMB` | inline at uploader | [[V-contact-group-file-size-cap]] |
| `FinanceIdRequired` | Commerce | 400 | Empty `FinanceId` on official-data step | inline at field | — |
| `FirstNameLettersOnly` | Commerce · Identity | 400 | First name contains non-letters | inline at field | [[V-user-first-last-name-letters-only]] |
| `Forbidden` | Commerce · Identity | 403 | Generic policy rejection | toast · redirect | — |
| `ForbiddenToDeleteContactGroup` | Contact-Group | 403 | Non-creator tried to delete | disable action · toast | — |
| `ForbiddenToEditContactGroup` | Contact-Group | 403 | Non-creator tried to edit | disable action · toast | — |
| `ForbiddenToShareContactGroup` | Contact-Group | 403 | Non-creator tried to share | disable action · toast | — |
| `GetIdentityUserFailed` | Commerce · Identity | 500 | Zitadel lookup failed | toast | — |
| `HiddenProductMustNotHavePricing` | Commerce | 422 | Pricing fields set on hidden product | inline at pricing step | [[V-service-visibility-pricing-required]] |
| `IdentityServiceConnectionError` | Contact-Group | 503 | Identity unreachable from Contact-Group | toast · "Try again" | — |
| `IdentityServiceError` | Contact-Group | 502 | Identity HTTP call failed from Contact-Group | toast · "Try again" | — |
| `IdentityServiceTimeout` | Contact-Group | 504 | Identity didn't respond within timeout | toast · "Try again" | — |
| `IdentityTenantIdMissing` | System-Gateway | 502 | Commerce response has empty TenantId when UserBased wallet | banner · ops handoff | [[V-account-ip-allowlist-enforcement]] |
| `ImageExtensionNotAllowed` | Commerce · Identity | 400 | Image upload with disallowed extension | inline at uploader | — |
| `ImportEventPublishFailed` | Contact-Group | 500 | Kafka producer failed for import | toast · retry | — |
| `ImportTooLarge` | Contact-Group | 400 | Rows > `FileImport:MaxRowsPerImport` | inline at uploader | — |
| `InsufficientBalance` | Charging | 422 | Wallet balance < requested amount | modal (insufficient-balance dialog) | [[V-charging-insufficient-balance]] |
| `InternalServerError` | All 9 (catch-all) | 500 | Unhandled exception | toast · ops handoff | — |
| `InvalidAccountLimits` | Commerce | 422 | `MaxNormalUserLimit` / `MaxAdminUserLimit` / etc. invalid combo | inline at field | [[V-account-limits-zero-means-no-limit]] |
| `InvalidAmount` | Charging | 422 | Amount ≤ 0 or otherwise invalid | inline at field | — |
| `InvalidAuthorityLetterType` | Commerce | 422 | Authority letter type not in enum | inline at uploader | — |
| `InvalidChargeRequest` | Charging | 422 | Charge request shape invalid | toast | — |
| `InvalidCheckerLevelNumber` | Templates | 400 | Negative or zero or out-of-range level number | inline at level row | [[V-template-checker-level-integrity]] |
| `InvalidContractConfiguration` | Commerce | 422 | Contract configuration invariant broken | banner | — |
| `InvalidCreationFlow` | Commerce | 422 | Invariant on account creation flow | toast | — |
| `InvalidCredentials` | Commerce · Identity | 401 | Login: wrong username/password | inline at password field | [[V-login-lockout-3-wrong-attempts]] |
| `InvalidEffectiveDateForPeriodicPricingChange` | Commerce | 422 | Effective date misaligned with cycle | inline at date field | — |
| `InvalidFileSize` | Contact-Group | 400 | FileSize ≤ 0 | inline at uploader | — |
| `InvalidFileType` | Contact-Group | 400 | Extension not in `FileImport:AllowedExtensions` | inline at uploader | [[V-contact-group-file-type-allowlist]] |
| `InvalidIdempotencyKey` | Charging | 422 | Idempotency key malformed | toast (caller bug) | — |
| `InvalidImageFile` | Commerce · Identity | 400 | Image upload not a valid image | inline at uploader | — |
| `InvalidIpAddress` | Commerce | 403 | IP allowlist rejection at Commerce layer | banner · login gate | [[V-account-ip-allowlist-enforcement]] |
| `InvalidNodeFormat` | Commerce | 400 | Node id shape wrong | toast | — |
| `InvalidNodeLevel` | Commerce | 422 | Sub-node depth violation | toast | — |
| `InvalidOperation` | Contact-Group | 422 | Generic invariant break | toast | — |
| `InvalidPageNumber` | Contact-Group | 400 | Page ≤ 0 | toast (caller bug) | — |
| `InvalidPageSize` | Contact-Group | 400 | PageSize ≤ 0 or above max | toast (caller bug) | — |
| `InvalidPassword` | Commerce · Identity | 422 | Password fails policy | inline at password | [[V-password-complexity-per-security-level]] |
| `InvalidPhoneNumber` | Commerce | 400 | Phone format not valid | inline at field | — |
| `InvalidPriceType` | Commerce | 400 | Price type invalid | inline at field | — |
| `InvalidPriceValue` | Commerce | 400 | Price value invalid | inline at field | — |
| `InvalidRefreshToken` | Commerce · Identity | 401 | Refresh token invalid/expired | force re-login | — |
| `InvalidRoleForUserType` | Commerce · Identity | 422 | Role/user-type mismatch | toast | — |
| `InvalidStatusTransition` | Commerce · Identity | 422 | Status transition not allowed | toast | — |
| `InvalidSubscriptionState` | Commerce | 422 | Subscription state forbids the action | toast | — |
| `InvalidTenantId` | Commerce | 422 | Tenant id malformed | toast | — |
| `InvalidTransferWallets` | Charging | 422 | Source/destination combo invalid | toast | [[V-charging-transfer-source-destination]] |
| `InvalidUserExistQuery` | Commerce · Identity | 400 | Empty `Username` on `/user/exist` | inline | — |
| `InvalidUsernameOrPhone` | Identity | 422 | Forgot-password lookup with bad shape | inline at field | — |
| `InvalidValue` | Commerce · Identity | 400 | `[ThrowIfNotEnumValue<>]` violation | inline at field | [[V-password-security-level-enum]] |
| `InvalidVerificationCode` | Commerce · Identity | 422 | OTP/email verification code invalid | inline at OTP field | — |
| `InvalidWalletBalanceType` | Commerce | 422 | Wallet balance type not in enum | inline at field | — |
| `InvalidWalletIdentity` | Charging | 422 | Wallet id shape / scope invalid | toast | [[V-charging-transfer-source-destination]] |
| `IpNotAllowed` | Identity (+ Commerce share) | 403 | IP allowlist rejection at login/refresh | banner · login gate | [[V-account-ip-allowlist-enforcement]] |
| `LastNameLettersOnly` | Commerce · Identity | 400 | Last name contains non-letters | inline at field | [[V-user-first-last-name-letters-only]] |
| `LevelsCountMismatch` | Templates | 400 | Declared `LevelsCount` ≠ actual count | inline at level builder | [[V-template-checker-level-integrity]] |
| `LevelsCountRequiredForRestricted` | Templates | 400 | `BodyType=Restricted` requires `LevelsCount` | banner | [[V-template-levels-count-required-for-restricted]] |
| `LicenseNoRequired` | Commerce | 400 | Empty `LicenseNo` on official-data step | inline at field | — |
| `MainAccountSettingsRequired` | Commerce | 400 | `Settings` missing on `CreateAccountRequest` | banner | — |
| `MainNodeAccountInfoRequired` | Commerce | 400 | `Info` missing on `CreateAccountRequest` | banner | — |
| `MainNodeNotFound` | Commerce | 404 | Account's root node gone | toast · ops handoff | — |
| `MainNodeOnlyOperation` | Commerce | 422 | Operation only valid on main node | toast · disable on sub-node | — |
| `MaxLengthExceeded` | Commerce · Identity · Contact-Group | 400 | `[ThrowIfMaxLengthExceed]` violation | inline at field | [[V-account-name-format-uniqueness]] |
| `MaxNodeLevelReached` | Commerce | 422 | `MaxNodeLevel` setting exceeded | inline · disable Add Sub-Node | [[V-account-limits-zero-means-no-limit]] |
| `NewNodeNameNotApplyed` | Commerce | 422 | Rename request didn't change name | toast (caller bug) | — |
| `NewPricingTypeMustPassWithEffectiveDate` | Commerce | 422 | Type change requires effective date | inline | — |
| `NoAnyCommChannelWalletWasFound` | Charging | 404 | No comm-channel wallet for the account | banner · ops handoff | — |
| `NoApplicableRate` | Charging | 422 | No contract rate for the requested combo | toast · "Service not configured" | [[V-charging-no-applicable-rate]] |
| `NoChangesToUpdate` | Commerce · Identity · Templates · Contact-Group | 422 | PUT/PATCH with no actual change | toast (silent disable) | — |
| `NoDataRows` | Contact-Group | 400 | File has header but no data rows | inline at uploader | — |
| `NodeIdMissing` | Contact-Group | 400 | Missing required node id | toast (caller bug) | — |
| `NodeIdRequired` | Identity | 400 | Empty node id | toast (caller bug) | — |
| `NodeIdRequiredForFalconUser` | Contact-Group | 400 | Falcon admin must pass `NodeId` explicitly | inline · header check | — |
| `NodeNameRequired` | Commerce | 400 | Empty node name on rename/create | inline at field | — |
| `NodeNotFound` | Commerce | 404 | Node id unknown / soft-deleted | toast · 404 view | — |
| `NodeNotInHierarchy` | Contact-Group | 403 | Node outside caller's access scope | toast · ops handoff | — |
| `NoPendingPriceTypeChange` | Commerce | 404 | DELETE pending price-type change with none active | disable action | — |
| `NoPendingPriceValueChange` | Commerce | 404 | DELETE pending price-value change with none active | disable action | — |
| `NoProductSubscriptionFound` | Commerce | 404 | No subscription matched | toast | — |
| `NormalUserLimitReached` | Commerce · Identity | 422 | Account hit `MaxNormalUserLimit` | banner · disable Add User | [[V-normal-user-limit-enforcement]] |
| `OfficialDataRequired` | Commerce | 400 | `OfficialData` block missing | banner | — |
| `OnlyFalconUserCanRestoreDeletedUser` | Commerce · Identity | 422 | Client-tenant tried to restore | disable action | — |
| `OrderNotFound` | Commerce | 404 | Order id unknown | toast · 404 view | — |
| `OtpAlreadyConfigured` | Identity | 422 | OTP already configured | banner · disable action | — |
| `OtpNotReady` | Identity | 422 | OTP not yet provisioned | disable resend | — |
| `OtpResendLimitExceeded` | Identity | 429 | Too many OTP resends | disable resend with countdown | — |
| `OtpStillValid` | Commerce · Identity | 429 | Previous OTP still valid | disable resend with countdown | — |
| `OwnerIdNotMatchWithTenantId` | Commerce | 422 | OwnerId / TenantId mismatch (data anomaly) | toast · ops handoff | — |
| `OwnerIdRequired` | Commerce | 400 | Empty `OwnerId` | inline | — |
| `ParentIdRequired` | Commerce | 400 | Empty parent on `CreateSubNode` | inline at parent picker | — |
| `ParentNodeRequired` | Commerce | 400 | Parent lookup empty | inline at parent picker | — |
| `PasswordRequiresDigit` | Identity | 422 | Password missing digit | inline · live policy hint | [[V-password-complexity-per-security-level]] |
| `PasswordRequiresLowercase` | Identity | 422 | Password missing lowercase | inline · live policy hint | [[V-password-complexity-per-security-level]] |
| `PasswordRequiresSpecialChar` | Identity | 422 | Password missing special char | inline · live policy hint | [[V-password-complexity-per-security-level]] |
| `PasswordRequiresUppercase` | Identity | 422 | Password missing uppercase | inline · live policy hint | [[V-password-complexity-per-security-level]] |
| `PasswordsDoNotMatch` | Identity | 422 | Confirm-password mismatch | inline at confirm field | [[V-password-complexity-per-security-level]] |
| `PasswordTooShort` | Identity | 422 | Password below min length | inline · live policy hint | [[V-password-complexity-per-security-level]] |
| `PendingOrderAlreadyExistsForService` | Commerce | 409 | Service already has a pending order | banner · disable action | — |
| `PendingSelfEditBlocked` | Identity | 403 | Pending user tried to self-edit | banner | — |
| `PhoneAlreadyVerified` | Commerce · Identity | 409 | Phone verification on already-verified | banner · disable action | — |
| `PhoneVerificationFailed` | Commerce · Identity | 500 | Phone verification call failed | toast | — |
| `PriceValueNotConfigured` | Commerce | 422 | Price value missing on visible product | inline at pricing step | [[V-service-visibility-pricing-required]] |
| `PriceValueRequired` | Commerce | 400 | Empty price value field | inline at field | — |
| `PricingTypeNotConfigured` | Commerce | 422 | Pricing type missing | inline at field | — |
| `ProductAlreadyActivated` | Commerce | 409 | Product activation duplicated | disable action | — |
| `ProductAlreadyExists` | Commerce | 409 | Product creation duplicate | inline · toast | — |
| `ProductHidden` | Commerce | 422 | Action on hidden product | banner · disable | — |
| `ProductIdRequired` | Commerce | 400 | Empty product id | toast (caller bug) | — |
| `ProductNameRequired` | Commerce | 400 | Empty product name | inline | — |
| `ProductNotFound` | Commerce | 404 | Product id unknown | toast · 404 view | — |
| `ProductSubscriptionNotFound` | Commerce | 404 | Subscription id unknown | toast · 404 view | — |
| `ProfilePictureSizeExceeded` | Commerce · Identity | 400 | Profile picture > max bytes | inline at uploader | — |
| `RenewalDateCantBeEmpty` | Commerce | 400 | Renewal scheduled with no date | inline at field | — |
| `RenewalJobCreationFailed` | Commerce | 500 | Renewal job scheduler create failed | toast · ops handoff | — |
| `RenewalJobFailed` | Commerce | 500 | Renewal job run failed | toast · ops handoff | — |
| `RenewalNotDueYet` | Commerce | 422 | Renew action before due date | disable action | — |
| `RequiredFieldMissing` | Commerce · Identity · Templates · Contact-Group | 400 | `[ThrowIfNotPassed]` violation | inline at field | [[V-account-name-format-uniqueness]] |
| `ReservationNotFound` | Charging | 404 | Reservation invalid / committed / released / expired | retry full reserve-commit cycle | — |
| `RootNodeCannotHaveSubNodes` | Commerce | 422 | Root node has special semantics | toast · disable Add Sub-Node | — |
| `RootNodeDeletionNotAllowed` | Commerce | 422 | Attempt to delete account root | disable Delete | — |
| `S3CopyFailed` | Contact-Group | 500 | Copy temp upload to permanent failed | toast · retry | — |
| `ScheduleJobNotFound` | Commerce | 404 | Scheduled job id unknown | toast | — |
| `SelfEditRoleNotAllowed` | Identity | 403 | User tried to edit own role | disable role field on self | — |
| `ServiceAlreadyActive` | Commerce | 409 | Activate on already-active service | disable action | — |
| `ServiceAlreadyDisabled` | Commerce | 409 | Disable on already-disabled service | disable action | — |
| `ServiceNotVisible` | Commerce | 422 | Action on non-visible service | disable action | — |
| `ServiceUnavailable` | Commerce · Identity | 503 | Service is down / starting up | banner · retry | — |
| `SettingsNotFound` | Commerce · Identity | 404 | Settings doc missing | banner · ops handoff | — |
| `SettingsOnlyAllowedForMainNode` | Commerce | 422 | Settings update on sub-node | toast · disable on sub-node | — |
| `TenantIdMissing` | Templates · Contact-Group | 401 | JWT has no tenant claim | force re-login · ops handoff | — |
| `TenantIdRequired` | Commerce · Identity | 400 | Empty `TenantId` parameter | header check | — |
| `TestingChargingDisabled` | System-Gateway | 404 | TestingCharging endpoint while feature off | hidden in nav | — |
| `Unauthorized` | Commerce · Identity | 401 | Missing/invalid JWT | force re-login | — |
| `UnauthorizedAccess` | Templates · Contact-Group | 403 | Caller not allowed | toast · redirect | — |
| `UnauthorizedAction` | Commerce · Identity · Provisioning | 403 | JWT valid but lacks business permission | toast · disable action | — |
| `UnauthorizedProfileEdit` | Commerce · Identity | 403 | Self/peer profile edit forbidden | disable form | — |
| `UnauthorizedUserToPerformThisAction` | Commerce · Charging · Identity · Provisioning | 403 | More specific permission rejection | toast · disable action | — |
| `UnknownError` | Commerce · Identity | 500 | Catch-all unknown | toast · ops handoff | — |
| `UnsupportedPricingType` | Commerce | 422 | Pricing type not implemented | toast · disable option | — |
| `UpdateRequestCantBeNull` | Commerce | 400 | PUT/PATCH body empty | toast (caller bug) | — |
| `UploadSessionAlreadyCompleted` | Contact-Group | 409 | Reusing a completed validation session | banner · ops handoff | — |
| `UploadSessionAlreadyUsed` | Contact-Group | 409 | Session already used to create a group | banner · disable action | — |
| `UploadSessionExpired` | Contact-Group | 410 | Past `SessionExpiryMinutes` | banner · restart upload | — |
| `UploadSessionNotFound` | Contact-Group | 404 | Upload session id unknown | banner · restart upload | — |
| `UploadSessionNotReady` | Contact-Group | 409 | Session not validated yet | banner · wait | — |
| `UserAlreadyExists` | Commerce · Identity | 409 | User creation duplicate | inline · toast fallback | — |
| `UserAlreadyInStatus` | Commerce · Identity | 409 | Status update no-op | disable action | — |
| `UserAssignedToMultipleCheckerLevels` | Templates | 400 | One user appears at > 1 level | inline at level rows | [[V-template-checker-level-integrity]] |
| `UserDeletedCannotEdit` | Identity | 410 | Edit a deleted user | disable form | — |
| `UserDoesNotOwnRequestedService` | Commerce | 422 | User trying to op on service they don't own | disable action | — |
| `UserLocked` | Commerce · Identity | 423 | 3 wrong login attempts → locked | banner · "Contact admin" | [[V-login-lockout-3-wrong-attempts]] |
| `UserLockedCannotEdit` | Identity | 423 | Edit a locked user | disable form | — |
| `UserNotFound` | Commerce · Identity | 404 | User id unknown (or soft-deleted for non-Falcon) | toast · 404 view | — |
| `UserNotInitialized` | Identity | 401 | User not yet initialized (pre-OTP) | banner · OTP step | — |
| `UsernameMustStartWithLetter` | Commerce · Identity | 400 | Username doesn't start with a letter | inline at Step 5 username | [[V-username-format-uniqueness-immutable]] |
| `UserPending` | Commerce · Identity | 403 | User is pending OTP/init | banner · OTP step | — |
| `UserSuspended` | Commerce · Identity | 403 | Suspended user trying to act | banner · login gate | — |
| `UserSuspendedCannotEdit` | Identity | 403 | Edit a suspended user | disable form | — |
| `VerificationCodeExpired` | Identity | 422 | OTP/email verification code expired | banner · "Send again" | — |
| `WalletBalanceTypeRequired` | Commerce | 400 | Empty `WalletBalanceType` | inline at field | — |
| `WalletNotFound` | Charging | 404 | Wallet entity missing | banner · ops handoff | — |
| `WalletSettingsAlreadyConfigured` | Commerce | 409 | WalletSettings already configured | disable action | — |
| `WalletSettingsNotFound` | Commerce · Charging | 404 | Wallet config absent / sync failed | banner · ops handoff | — |
| `WalletSettingsOnlyForMainNode` | Commerce | 422 | Wallet settings on a sub-node | toast · disable on sub-node | — |
| `WalletStrategyRequiredForContract` | Commerce | 422 | Contract without wallet strategy | inline at field | — |
| `WalletTypeRequired` | Commerce | 400 | Empty `WalletType` | inline at field | — |
| `WalletVersionConflict` | Charging | 409 | Optimistic concurrency lost after 3 retries | toast · "please retry" | — |
| `ZitadelAdminUserNotFound` | Commerce · Identity | 500 | Zitadel admin user missing | toast · ops handoff | — |
| `ZitadelAlreadyInitialized` | Commerce · Identity | 409 | Initialize-Zitadel called twice | banner · ops handoff | — |
| `ZitadelCreateApiAppFailed` | Commerce | 500 | Zitadel create-api-app call failed | toast · ops handoff | — |
| `ZitadelCreateMachineUserFailed` | Commerce | 500 | Zitadel create-machine-user failed | toast · ops handoff | — |
| `ZitadelCreateProjectFailed` | Commerce · Identity | 500 | Zitadel create-project failed | toast · ops handoff | — |
| `ZitadelCreateWebPlatformUiAppFailed` | Commerce | 500 | Zitadel create web app failed | toast · ops handoff | — |
| `ZitadelDeactivateUserFailed` | Commerce · Identity | 500 | Zitadel deactivate-user failed | toast · ops handoff | — |
| `ZitadelDeleteMetadataFailed` | Identity | 500 | Zitadel delete metadata failed | toast · ops handoff | — |
| `ZitadelDeleteSessionFailed` | Identity | 500 | Zitadel delete-session failed | toast · ops handoff | — |
| `ZitadelDeleteUserFailed` | Identity | 500 | Zitadel delete-user failed | toast · ops handoff | — |
| `ZitadelEndSessionFailed` | Identity | 500 | Zitadel end-session failed | toast · ops handoff | — |
| `ZitadelFalconProjectIdNotConfigured` | Identity | 500 | Zitadel `FalconProjectId` not configured | banner · ops handoff | — |
| `ZitadelGetLoginPolicyFailed` | Identity | 500 | Zitadel get-login-policy failed | toast · ops handoff | — |
| `ZitadelGetOrganizationFailed` | Commerce · Identity | 500 | Zitadel get-organization failed | toast · ops handoff | — |
| `ZitadelGetPasswordPolicyFailed` | Identity | 500 | Zitadel get-password-policy failed | toast · ops handoff | — |
| `ZitadelGetSessionFailed` | Identity | 500 | Zitadel get-session failed | toast · ops handoff | — |
| `ZitadelGetUserInfoFailed` | Identity | 500 | Zitadel userinfo failed | toast · ops handoff | — |
| `ZitadelListSessionsFailed` | Identity | 500 | Zitadel list-sessions failed | toast · ops handoff | — |
| `ZitadelLockUserFailed` | Commerce · Identity | 500 | Zitadel lock-user failed | toast · ops handoff | — |
| `ZitadelLoginClientTokenNotConfigured` | Identity | 500 | Login client token not configured | banner · ops handoff | — |
| `ZitadelOrganizationNotFound` | Commerce · Identity | 500 | Zitadel org not found | banner · ops handoff | — |
| `ZitadelReactivateUserFailed` | Commerce · Identity | 500 | Zitadel reactivate-user failed | toast · ops handoff | — |
| `ZitadelRegisterOtpFailed` | Identity | 500 | Zitadel register-OTP failed | toast · ops handoff | — |
| `ZitadelRegisterTotpFailed` | Identity | 500 | Zitadel register-TOTP failed | toast · ops handoff | — |
| `ZitadelRemoveEmailFailed` | Identity | 500 | Zitadel remove-email failed | toast · ops handoff | — |
| `ZitadelRemoveOtpFailed` | Identity | 500 | Zitadel remove-OTP failed | toast · ops handoff | — |
| `ZitadelRemovePhoneFailed` | Identity | 500 | Zitadel remove-phone failed | toast · ops handoff | — |
| `ZitadelSearchUserFailed` | Commerce · Identity | 500 | Zitadel search-user failed | toast · ops handoff | — |
| `ZitadelSearchUsersFailed` | Identity | 500 | Zitadel search-users failed | toast · ops handoff | — |
| `ZitadelServiceUserTokenNotConfigured` | Commerce | 500 | Zitadel service-user token not configured | banner · ops handoff | — |
| `ZitadelSetAdminMetadataFailed` | Commerce · Identity | 500 | Zitadel set-admin-metadata failed | toast · ops handoff | — |
| `ZitadelSetLoginPolicyFailed` | Identity | 500 | Zitadel set-login-policy failed | toast · ops handoff | — |
| `ZitadelSetPasswordPolicyFailed` | Identity | 500 | Zitadel set-password-policy failed | toast · ops handoff | — |
| `ZitadelTokenIntrospectionFailed` | Identity | 500 | Zitadel introspection failed | toast · ops handoff | — |
| `ZitadelTokenRevocationFailed` | Identity | 500 | Zitadel revocation failed | toast · ops handoff | — |
| `ZitadelUnlockUserFailed` | Commerce · Identity | 500 | Zitadel unlock-user failed | toast · ops handoff | — |
| `ZitadelUpdateUserPhoneFailed` | Commerce · Identity | 500 | Zitadel update-user-phone failed | toast · ops handoff | — |
| `ZitadelUpdateUserProfileFailed` | Commerce · Identity | 500 | Zitadel update-user-profile failed | toast · ops handoff | — |

## Cross-service code overlap

Codes that appear in more than one service's ERRORS catalog. Each service throws based on its own scenario context — there is **no code propagation between services** (Commerce calling Identity over HTTP wraps the downstream failure as `ExternalServiceError` and discards the original code).

| Code | Services | Notes |
|---|---|---|
| `InternalServerError` | All 9 | Platform-wide catch-all |
| `RequiredFieldMissing` | Commerce · Identity · Templates · Contact-Group | Generic `[ThrowIfNotPassed]` / NotEmpty fail |
| `MaxLengthExceeded` | Commerce · Identity · Contact-Group | Generic `[ThrowIfMaxLengthExceed]` / MaximumLength fail |
| `BelowMinimumLength` | Commerce · Identity · Contact-Group | Generic min-length fail |
| `NoChangesToUpdate` | Commerce · Identity · Templates · Contact-Group | PUT/PATCH with no actual change |
| `Unauthorized` | Commerce · Identity | Missing/invalid JWT |
| `Forbidden` | Commerce · Identity | Generic policy rejection |
| `UnauthorizedAction` | Commerce · Identity · Provisioning | JWT valid but lacks business permission |
| `UnauthorizedUserToPerformThisAction` | Commerce · Charging · Identity · Provisioning | More specific permission rejection |
| `UnauthorizedAccess` | Templates · Contact-Group | Caller not allowed (slightly different wording, same concept) |
| `DuplicateTenantName` | Commerce · Charging · Provisioning | Account name conflict — shared concept across the trio |
| `DuplicateUsername` | Commerce · Identity | Username conflict; Commerce throws during Step 5 wizard, Identity throws on direct create |
| `DuplicateValue` | Commerce · Identity | Generic uniqueness violation |
| `UserNotFound` | Commerce · Identity | Identity owns the user; Commerce throws when its handlers hit a 404 lookup |
| `UserAlreadyExists` | Commerce · Identity | Same concept as DuplicateUsername in different surface |
| `UserAlreadyInStatus` | Commerce · Identity | Status update no-op |
| `UserLocked` | Commerce · Identity | 423 lockout |
| `UserSuspended` | Commerce · Identity | 403 |
| `UserPending` | Commerce · Identity | 403 |
| `InvalidCredentials` | Commerce · Identity | 401 — login wrong creds |
| `InvalidRefreshToken` | Commerce · Identity | 401 — refresh failed |
| `InvalidPassword` | Commerce · Identity | 422 — password policy fail |
| `InvalidStatusTransition` | Commerce · Identity | 422 — status transition forbidden |
| `InvalidRoleForUserType` | Commerce · Identity | 422 — role/user-type mismatch |
| `InvalidUserExistQuery` | Commerce · Identity | 400 — empty username lookup |
| `InvalidValue` | Commerce · Identity | 400 — enum binding fail |
| `InvalidImageFile` | Commerce · Identity | 400 — uploader |
| `ImageExtensionNotAllowed` | Commerce · Identity | 400 — uploader |
| `ExecutableFileNotAllowed` | Commerce · Identity | 400 — uploader |
| `FileSizeExceeded` | Commerce · Identity · Contact-Group | 400 — uploader |
| `ProfilePictureSizeExceeded` | Commerce · Identity | 400 — profile uploader |
| `FirstNameLettersOnly` | Commerce · Identity | 400 |
| `LastNameLettersOnly` | Commerce · Identity | 400 |
| `UsernameMustStartWithLetter` | Commerce · Identity | 400 |
| `OnlyFalconUserCanRestoreDeletedUser` | Commerce · Identity | 422 |
| `FalconUserMustNotHaveTenantId` | Commerce · Identity | 422 |
| `NormalUserLimitReached` | Commerce · Identity | 422 quota |
| `ChangePasswordFailed` | Commerce · Identity | 422 |
| `PhoneAlreadyVerified` | Commerce · Identity | 409 |
| `EmailAlreadyVerified` | Commerce · Identity | 409 |
| `PhoneVerificationFailed` | Commerce · Identity | 500 |
| `EmailVerificationFailed` | Commerce · Identity | 500 |
| `InvalidVerificationCode` | Commerce · Identity | 422 |
| `OtpStillValid` | Commerce · Identity | 429 |
| `SettingsNotFound` | Commerce · Identity | 404 |
| `ServiceUnavailable` | Commerce · Identity | 503 |
| `UnknownError` | Commerce · Identity | 500 |
| `Unauthorized` | Commerce · Identity | 401 |
| `UnauthorizedProfileEdit` | Commerce · Identity | 403 |
| `ExternalServiceError` | Commerce · Identity | 500 |
| `ExternalServiceConnectionError` | Commerce · Identity | 500 |
| `ExternalServiceTimeout` | Commerce · Identity | 500 |
| `CreateIdentityUserFailed` | Commerce · Identity | 500 |
| `GetIdentityUserFailed` | Commerce · Identity | 500 |
| `ApplicationNotFound` | Commerce · Provisioning | 404 |
| `CommChannelNotFound` | Commerce · Provisioning | 404 |
| `WalletSettingsNotFound` | Commerce · Charging | 404 |
| Zitadel-* (multiple) | Commerce · Identity | Both services interact with Zitadel and surface their own copies |

(Total distinct cross-service codes: **24** core platform concepts. The Zitadel-* family adds another ~15 that appear in both Commerce and Identity catalogs.)

## Important platform notes

1. **Only Commerce has explicit `[ErrorHttpStatus(NNN)]` decorations.** Every other service relies on middleware inferring status from the code name. The status column for non-Commerce codes in this catalog is the **inferred** mapping documented in the per-service ERRORS.md.
2. **Access (PES) does NOT use `FalconException`.** It uses raw `Results.BadRequest({ error })` / `Results.Forbid()`. The frontend cannot pattern-match on PES error codes — it must inspect the free-form `error` string.
3. **Gateway-level error codes** (`TestingChargingDisabled`, `IdentityTenantIdMissing`) live outside any `FalconKeys` catalog. The gateway must provide its own localization or the frontend must hard-code meanings.
4. **No code propagation between services.** Commerce → Identity HTTP failure becomes `ExternalServiceError` (500). Original code is lost.
5. **Pass-through behavior** — Both gateways forward downstream `ServiceOperationResult.Failure` envelopes (and HTTP status) unchanged via `HttpResponseHandler.HandleResponseAsync<T>`.

## Hubs

- [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[ERROR_INDEX]] · [[AMMAR_BRAIN_HOME]]
