---
type: error-catalog
cluster: 13-error-catalog
total-codes: 130
purpose: "Answers 'which 130 FalconKeys.Error.* codes exist + their HTTP statuses, owning services, surfacing features, V-rule linkages'. Open when implementing FE error handling for any feature or backend error emission."
extracted: 2026-05-16
---

# Falcon Error Catalog — All `FalconKeys.Error.*` Constants

> [!tldr]
> Code-grounded catalog of every `FalconKeys.Error.*` constant surfaced anywhere in the Falcon platform — 130 codes across 7 services, mined from per-service `ERRORS.md` files and the 25 V-rule notes that name them. Use this catalog to look up: (a) what HTTP status a code returns, (b) which service owns it, (c) which feature surfaces it, (d) which V-rule (if any) governs it. For the FE handling contract, see [`FE-CONTRACT.md`](./FE-CONTRACT.md).

## Source trail

- [BRAIN-OUT] `understanding/backend/commerce/ERRORS.md` — Commerce catalog (the only service with `[ErrorHttpStatus]` attribute on every code)
- [BRAIN-OUT] `understanding/backend/identity/ERRORS.md` — Identity user-lifecycle / auth errors
- [BRAIN-OUT] `understanding/backend/charging/ERRORS.md` — Charging wallet / OCS errors
- [BRAIN-OUT] `understanding/backend/contact-group/ERRORS.md` — Contact Group catalog
- [BRAIN-OUT] `understanding/backend/provisioning/ERRORS.md` — Provisioning service errors (smallest catalog)
- [BRAIN-OUT] `understanding/backend/templates/ERRORS.md` — Templates / CheckerLevel errors
- [BRAIN-OUT] `understanding/backend/access/ERRORS.md` — PES has no `FalconKeys` catalog; uses raw `IResult`
- [BRAIN-OUT] 25 V-rule notes at `Brain SK/_obsidian/30-Validation/V-*.md` — each lists which error codes its rule emits
- [BRAIN-OUT] `understanding/pages/organization-hierarchy/Add Client/12-ERROR_STATES.md` — Add Client UX mapping
- [BRAIN-OUT] `datasets/authority-dataset/06-validation-by-feature/MATRIX.md` §7 — FE contract recap

## 1. Code grouping by HTTP status

> Each row lists: code · category · semantic meaning · "surfaces when" · linked V-rule. Mark `—` if no V-rule directly governs the code. Codes with `[INFERRED]` carry an HTTP-status guess (Charging/Provisioning don't decorate with `[ErrorHttpStatus]`).

### 1.1 — 400 Bad Request (input validation / required-field / format)

| Code | Category | Semantic meaning | Surfaces when | V-rule |
|---|---|---|---|---|
| `RequiredFieldMissing` | generic | Required scalar missing | Any `[ThrowIfNotPassed]`/`NotEmpty` validator fires | many — see §5 |
| `MaxLengthExceeded` | generic | String over `MaximumLength(N)` | Any `[ThrowIfMaxLengthExceed]`/`.MaximumLength` validator fires | V-account-name · V-user-name · V-username · V-contact-group-name |
| `BelowMinimumLength` | generic | String below `MinimumLength` | `.MinimumLength` validator fires | — |
| `EnNameRequired` | name | English name required | `MultiLanguageName.En` empty on create | — |
| `ArNameRequired` | name | Arabic name required | `MultiLanguageName.Ar` empty on create | — |
| `AccountNameRequired` | name | Account Name field empty | Add Client Step 1 | V-account-name-format-uniqueness |
| `AccountIdRequired` | name | Account ID empty in payload | Internal handler routing | — |
| `AccountNameTooLong` | name | Account Name > 30 chars | Add Client Step 1 | V-account-name-format-uniqueness |
| `NodeNameRequired` | name | Sub-node Name empty | Add Node form | — |
| `InvalidNodeFormat` | name | Sub-node name shape invalid | Add Node | — |
| `FirstNameLettersOnly` | name-format | First Name has non-letter chars | Add User Tab 1 · Add Client Step 5 | V-user-first-last-name-letters-only |
| `LastNameLettersOnly` | name-format | Last Name has non-letter chars | Add User Tab 1 · Add Client Step 5 | V-user-first-last-name-letters-only |
| `UsernameMustStartWithLetter` | name-format | Username doesn't begin with letter | Add User Tab 1 · Add Client Step 5 | V-username-format-uniqueness-immutable |
| `InvalidUserExistQuery` | name | `/user/exist` called with empty Username | Async uniqueness debounce | V-username-format-uniqueness-immutable |
| `FinanceIdRequired` | id | Finance ID empty | Add Client Step 1 | — |
| `ProductIdRequired` | id | Product ID empty | Service Catalog ops | — |
| `ProductNameRequired` | id | Product Name empty | Service Catalog ops | — |
| `BudgetNoRequired` | id | Budget No empty | Add Client Step 1 | — |
| `CommercialRegistrationRequired` | id | CR field empty | Add Client Step 1 | — |
| `LicenseNoRequired` | id | License No empty | Add Client Step 1 | — |
| `TenantIdRequired` | id | Tenant ID required but missing in body | Internal handler | — |
| `UpdateRequestCantBeNull` | request | PATCH body null | Edit endpoints | — |
| `ParentIdRequired` | id | Parent Node ID empty | Add Node | — |
| `ParentNodeRequired` | id | Parent Node entity required | Add Node | — |
| `CountryRequiredWhenCityProvided` | cross-field | City set but Country empty | Add Client Step 1 cascading dropdowns | — (per Add Client §12) |
| `CityRequiredWhenDistrictProvided` | cross-field | District set but City empty | Add Client Step 1 | — |
| `CityRequiredWhenStreetProvided` | cross-field | Street set but City empty | Add Client Step 1 | — |
| `OfficialDataRequired` | aggregate | OfficialData block required | Add Client Step 1 | — |
| `OwnerIdRequired` | id | OwnerId field empty | Add Client Step 5 | — |
| `ProfilePictureSizeExceeded` | file | Profile pic > size cap | User Profile / Add User | — |
| `ExecutableFileNotAllowed` | file | Uploaded blob is executable | All uploaders | — |
| `FileSizeExceeded` | file | File > `MaxFileSizeMB` | Contact Group upload · Profile pic | V-contact-group-file-size-cap |
| `InvalidFileSize` | file | FileSize ≤ 0 | Contact Group `InitUploadRequest` | V-contact-group-file-size-cap |
| `InvalidFileType` | file | Extension not in allowlist | Contact Group `complete` | V-contact-group-file-type-allowlist |
| `FileEmpty` | file | 0-byte file received | Contact Group upload | V-contact-group-file-type-allowlist |
| `NoDataRows` | file | File has header but no data rows | Contact Group parse | — |
| `FileParseError` | file | CSV/XLSX parser failed | Contact Group parse | — |
| `ImportTooLarge` | file | Rows > `MaxRowsPerImport` | Contact Group import | — |
| `ImageExtensionNotAllowed` | file | Image type outside allowlist | Profile pic uploader | — |
| `InvalidImageFile` | file | Image content invalid | Profile pic uploader | — |
| `InvalidPriceValue` | pricing | Price value < 0 or non-numeric | Visibility/Pricing edit | V-service-visibility-pricing-required |
| `InvalidPriceType` | pricing | PriceType outside `ePricingType` set | Visibility/Pricing edit | V-service-visibility-pricing-required |
| `PriceValueRequired` | pricing | Price Value empty when Show | Visibility/Pricing edit | V-service-visibility-pricing-required |
| `MainAccountSettingsRequired` | aggregate | Settings block required for Main Node | Add Client Step 2 | — |
| `MainNodeAccountInfoRequired` | aggregate | Account Info required for Main Node | Add Client Step 1 | — |
| `EffectiveDateRequired` | date | Effective Date empty | Periodic Pricing Change | — |
| `RenewalDateCantBeEmpty` | date | Renewal Date empty | Renewal Job | — |
| `CurrencyRequired` | enum | Currency field empty | Wallet/Contract create | V-contract-currency-enum |
| `WalletBalanceTypeRequired` | enum | WalletBalanceType field empty | Wallet config | — |
| `WalletTypeRequired` | enum | WalletType field empty | Wallet config | — |
| `AdminIdRequired` | id | AdminId field empty | Bootstrap | — |
| `InvalidPhoneNumber` | format | Phone number malformed | Add User · Add Client Step 5 | — (per Add Client §12) |
| `ContactGroupNameRequired` | name | Contact Group Name empty | Contact Group create | V-contact-group-name-required-format |
| `ContactGroupNameInvalidFormat` | name-format | Doesn't match `NamePattern` or > 50 | Contact Group create / edit | V-contact-group-name-required-format |
| `InvalidPageNumber` | paging | Page ≤ 0 | List endpoints | — |
| `InvalidPageSize` | paging | PageSize ≤ 0 | List endpoints | — |
| `CheckerLevelsRequired` | template | Body type requires checker levels (missing) | Templates CommChannelConfig PUT | V-template-levels-count-required-for-restricted |
| `CheckerLevelMustHaveAtLeastOneUser` | template | A declared level has zero users | Templates CommChannelConfig PUT | V-template-checker-level-integrity |
| `CheckerLevel1RequiredBeforeLevel2` | template | Gap in level sequence | Templates CommChannelConfig PUT | V-template-checker-level-integrity |
| `CheckerLevelLimitExceeded` | template | Levels > cap | Templates CommChannelConfig PUT | V-template-checker-level-integrity · V-template-levels-count-required-for-restricted |
| `DuplicateCheckerLevelNumber` | template | Two levels share same number | Templates CommChannelConfig PUT | V-template-checker-level-integrity |
| `UserAssignedToMultipleCheckerLevels` | template | User at >1 level | Templates CommChannelConfig PUT | V-template-checker-level-integrity |
| `InvalidCheckerLevelNumber` | template | LevelNumber ≤ 0 or out of range | Templates CommChannelConfig PUT | V-template-checker-level-integrity |
| `LevelsCountMismatch` | template | Declared LevelsCount ≠ actual count | Templates CommChannelConfig PUT | V-template-checker-level-integrity · V-template-levels-count-required-for-restricted |
| `LevelsCountRequiredForRestricted` | template | BodyType=Restricted but LevelsCount null | Templates CommChannelConfig PUT | V-template-levels-count-required-for-restricted |
| `NodeIdMissing` | id | NodeId required but absent | Contact Group · Identity webhook | — |
| `NodeIdRequiredForFalconUser` | id | Falcon user must pass NodeId explicitly | Contact Group endpoints | — |

### 1.2 — 401 Unauthorized (credentials / unauth)

| Code | Category | Semantic meaning | Surfaces when | V-rule |
|---|---|---|---|---|
| `InvalidCredentials` | auth | Bad username / password / Forgot-Password OTP failure (silent counter for Forgot) | Login submit | V-login-lockout-3-wrong-attempts |
| `Unauthorized` | auth | Generic 401 — JWT missing/invalid | Any protected endpoint | — |
| `InvalidRefreshToken` | auth | Refresh token revoked or expired | Token refresh | — |
| `TenantIdMissing` (Contact-Group, Templates) | tenant | JWT has no tenant claim | Falcon admin hitting Client endpoint | — |
| `InvalidUsernameOrPhone` | auth | Forgot Password identity mismatch | Forgot Password Step 1 | V-login-lockout-3-wrong-attempts |
| `UserNotInitialized` | auth | First-login state not bootstrapped | First-login OTP entry | — |

### 1.3 — 403 Forbidden (authorization / IP allowlist)

| Code | Category | Semantic meaning | Surfaces when | V-rule |
|---|---|---|---|---|
| `Forbidden` | authz | Generic 403 | Any policy reject | — |
| `IpNotAllowed` | network | Caller IP not in account allowlist | Login pre-processor | V-account-ip-allowlist-enforcement |
| `InvalidIpAddress` | network | Malformed IP at admin save | Settings IP management | V-account-ip-allowlist-enforcement |
| `UserSuspended` | status | User status = Suspended | Login attempt | V-login-lockout-3-wrong-attempts (sibling) |
| `UserPending` | status | User status = Pending (post-lockout reset) | Login attempt | V-login-lockout-3-wrong-attempts (sibling) |
| `UnauthorizedProfileEdit` | authz | Caller cannot edit target profile | Edit User by id | — |
| `UnauthorizedAction` | authz | Caller lacks business policy | Many | — |
| `UnauthorizedUserToPerformThisAction` | authz | Same — more specific message | Many | — |
| `UserSuspendedCannotEdit` (Identity) | status | Suspended user cannot self-edit | Edit profile | — |
| `PendingSelfEditBlocked` (Identity) | status | Pending user cannot self-edit | Edit profile | — |
| `SelfEditRoleNotAllowed` (Identity) | authz | User cannot change own role | Edit profile | — |
| `UnauthorizedAccess` (Contact-Group) | authz | Generic CG 403 | Contact Group ops | — |
| `ForbiddenToDeleteContactGroup` | ownership | Only creator can delete | Contact Group delete | — |
| `ForbiddenToShareContactGroup` | ownership | Only creator can share | Contact Group share | V-contact-group-share-policy-mode-mutex (sibling) |
| `ForbiddenToEditContactGroup` | ownership | Only creator can edit | Contact Group edit | — |
| `NodeNotInHierarchy` (Contact-Group) | scope | NodeId outside caller's access scope | Contact Group ops | — |

### 1.4 — 404 Not Found

| Code | Category | Semantic meaning | Surfaces when | V-rule |
|---|---|---|---|---|
| `UserNotFound` | user | User doesn't exist (or soft-deleted, non-Falcon caller) | Get user by id | — |
| `NodeNotFound` | node | Node ID unknown | Node ops | — |
| `MainNodeNotFound` | node | Main Node missing for tenant | Tenant ops | — |
| `ProductNotFound` | product | Product ID unknown | Product ops | — |
| `ProductSubscriptionNotFound` | product | ProductSubscription absent | Subscription ops | — |
| `NoProductSubscriptionFound` | product | No subs at all | Subscription list | — |
| `SettingsNotFound` | settings | Tenant Settings absent | Settings GET | — |
| `AccountLimitNotFound` | settings | AccountLimit doc absent | Settings ops | — |
| `OrderNotFound` | order | Order ID unknown | Order ops | — |
| `ApplicationNotFound` | service | Application ID unknown | Apps catalog | — |
| `ApplicationNotFoundForAccount` | service | App not enrolled for this account | Account-Application ops | — |
| `CommunicationChannelNotFound` | service | CommChannel ID unknown | CommChannels catalog | — |
| `CommunicationChannelNotFoundForAccount` | service | Channel not enrolled for account | Account-CommChannel ops | — |
| `CommChannelNotFound` | service | CommChannel id missing (Charging/Provisioning) | Wallet/visibility ops | — |
| `ScheduleJobNotFound` | job | Scheduled job ID unknown | Renewal/Job ops | — |
| `WalletSettingsNotFound` | wallet | WalletSettings doc absent | Wallet ops | — |
| `NoPendingPriceTypeChange` | pricing | No pending price-type change exists | Apply periodic change | — |
| `NoPendingPriceValueChange` | pricing | No pending price-value change exists | Apply periodic change | — |
| `ContractNotFound` | contract | Contract ID unknown | Contract ops | — |
| `WalletNotFound` | wallet | Wallet entity missing | Charging ops | V-charging-insufficient-balance (sibling) |
| `NoAnyCommChannelWalletWasFound` | wallet | No comm-channel wallet for account | Charging ops | V-charging-insufficient-balance (sibling) |
| `CommChannelSubWalletNotFound` | wallet | Owner-level sub-wallet missing | Charging ops | V-charging-insufficient-balance (sibling) |
| `ReservationNotFound` | reservation | Reservation expired/missing/finalized | Charging Commit / TTL expiry | V-charging-insufficient-balance |
| `UploadSessionNotFound` | upload | Upload session id unknown | Contact Group upload | V-contact-group-file-size-cap (sibling) |
| `FileNotFound` | file | S3 lookup miss | Contact Group post-upload | — |
| `EntityNotFound` | generic | Generic NF | Contact Group queries | — |
| `ContactGroupNotFound` | contact-group | Contact Group ID unknown | Contact Group ops | — |
| `CommunicationChannelConfigNotFound` | template | Config ID unknown | Templates PUT | — |

### 1.5 — 409 Conflict (uniqueness / state)

| Code | Category | Semantic meaning | Surfaces when | V-rule |
|---|---|---|---|---|
| `DuplicateUsername` | uniqueness | Username case-insensitive duplicate | Add User / Add Client Step 5 | V-username-format-uniqueness-immutable |
| `DuplicateValue` | uniqueness | Generic uniqueness violation | Many | — |
| `DuplicateTenantName` | uniqueness | Tenant Name duplicate at create | Add Client Step 1 | V-account-name-format-uniqueness |
| `DuplicateNodeName` | uniqueness | Sub-node Name duplicate within parent | Add Node | — |
| `AdminAlreadyExists` | uniqueness | Admin slot already filled | Bootstrap | — |
| `ProductAlreadyExists` | uniqueness | Product duplicate at create | Catalog admin | — |
| `ProductAlreadyActivated` | state | Already active | Re-activate | — |
| `ServiceAlreadyActive` | state | Service status = Active | Re-enable | — |
| `ServiceAlreadyDisabled` | state | Service status = Disabled | Re-disable | — |
| `UserAlreadyExists` | uniqueness | User identity already in Zitadel | Bootstrap | — |
| `UserAlreadyInStatus` | state | Target status same as current | Status transition | — |
| `ZitadelAlreadyInitialized` | state | Bootstrap already run | Bootstrap | — |
| `WalletSettingsAlreadyConfigured` | state | Re-configure attempted | Wallet config | — |
| `PendingOrderAlreadyExistsForService` | state | Existing pending order blocks new one | Service ops | — |
| `PhoneAlreadyVerified` | state | Phone already verified | Phone verify | — |
| `EmailAlreadyVerified` | state | Email already verified | Email verify | — |
| `UploadSessionAlreadyCompleted` | state | Already completed | Contact Group complete | — |
| `UploadSessionNotReady` | state | Trying to use non-completed session | Contact Group | — |
| `UploadSessionAlreadyUsed` | state | Session reused | Contact Group create | — |
| `ContactGroupNotCompleted` | state | Read contacts before import done | Contact Group | — |
| `DuplicateEntity` | uniqueness | Contact Group duplicate generic | Contact Group | — |
| `WalletVersionConflict` | concurrency | Optimistic concurrency lost after 3 retries | Charging ops | V-charging-insufficient-balance |

### 1.6 — 410 Gone

| Code | Category | Semantic meaning | Surfaces when | V-rule |
|---|---|---|---|---|
| `UserDeletedCannotEdit` | tombstone | Edit attempted on soft-deleted user | Edit User | — |
| `UploadSessionExpired` | tombstone | Past `SessionExpiryMinutes` | Contact Group resume | V-contact-group-file-size-cap (sibling) |

### 1.7 — 422 Unprocessable Entity (business rule violations)

| Code | Category | Semantic meaning | Surfaces when | V-rule |
|---|---|---|---|---|
| `InvalidValue` | generic | Value outside enum / `[Range]` | Any `[ThrowIfNotEnumValue]` / `[EnumDataType]` / `[Range]` violation | V-password-security-level-enum · V-contract-currency-enum · V-contract-committed-value-positive · V-contract-rate-per-unit-non-negative |
| `InvalidStatusTransition` | workflow | Target status not allowed from current | Status flip | — |
| `InvalidSubscriptionState` | workflow | Subscription state op invalid | Subscription ops | — |
| `InvalidRoleForUserType` | role | Role / UserType combo invalid | Add User | — |
| `InvalidPassword` | password | Generic password policy fail | Change/Force-change/Set | V-password-complexity-per-security-level |
| `PasswordTooShort` | password | Length below tier minimum | Same | V-password-complexity-per-security-level |
| `PasswordRequiresUppercase` | password | Missing uppercase | Same | V-password-complexity-per-security-level |
| `PasswordRequiresLowercase` | password | Missing lowercase | Same | V-password-complexity-per-security-level |
| `PasswordRequiresDigit` | password | Missing digit | Same | V-password-complexity-per-security-level |
| `PasswordRequiresSpecialChar` | password | Missing special char | Same | V-password-complexity-per-security-level |
| `PasswordsDoNotMatch` | password | Confirm mismatch | Change/Forgot password Confirm | V-password-complexity-per-security-level |
| `ChangePasswordFailed` | password | Current-password verify fail | Change Password | V-password-complexity-per-security-level |
| `InvalidCreationFlow` | workflow | Multi-step flow misorder | Add Client | — |
| `InvalidTenantId` | tenant | TenantId format/scope invalid | Multi-tenant ops | — |
| `MainNodeOnlyOperation` | scope | Op only allowed on Main Node | Some Settings ops | — |
| `ProductHidden` | service | Op blocked because product hidden | Activate hidden service | V-service-visibility-pricing-required (sibling) |
| `RootNodeDeletionNotAllowed` | scope | Cannot delete root node | Delete Node | — |
| `RootNodeCannotHaveSubNodes` | scope | Root cannot have children | Add Node | — |
| `ActionsNotAllowedOnDeletedNode` | tombstone | Op on deleted node | Node ops | — |
| `ActivationNotAllowedForHiddenProduct` | service | DoPayment on hidden product | Activation | V-service-visibility-pricing-required |
| `CannotPayForDisabledService` | service | DoPayment on disabled service | Activation | — |
| `CannotHideServiceWithTheCurrentStatus` | service | Visibility flip blocked by current status | Visibility edit | — |
| `CannotDisableNonVisibleService` | service | Disable on Hide | Service ops | — |
| `CannotEnableNonDisabledService` | service | Enable on non-Disabled state | Service ops | — |
| `CannotEnableNonVisibleService` | service | Enable on Hidden | Service ops | V-service-visibility-pricing-required |
| `CannotHideActiveService` | service | Hide on Active (Provisioning) | Visibility flip | — |
| `RenewalNotDueYet` | job | Renewal triggered too early | Renewal | — |
| `NormalUserLimitReached` | quota | Normal-User cap exceeded | Add/Activate Normal User | V-normal-user-limit-enforcement · V-account-limits-zero-means-no-limit |
| `MaxNodeLevelReached` | quota | Node depth exceeded | Add Sub-Node | V-account-limits-zero-means-no-limit |
| `FalconUserMustNotHaveTenantId` | role | Falcon user has tenantId (data anomaly) | Identity sync | — |
| `OnlyFalconUserCanRestoreDeletedUser` | role | Restore op gated to Falcon | Restore user | — |
| `ServiceNotVisible` | service | Tried to act on hidden service | Service ops | V-service-visibility-pricing-required (sibling) |
| `UserDoesNotOwnRequestedService` | scope | Op on a service caller doesn't own | Service ops | — |
| `WalletStrategyRequiredForContract` | wallet | Contract create needs WalletStrategy | Contract create | — |
| `ContractEditOnlyAllowedWhenPending` | contract | Edit on Active/Expired hit locked field | Edit Contract | V-contract-edit-status-aware-fields |
| `InvalidContractConfiguration` | contract | Structural contract violation (e.g. EndDate ≤ StartDate) | Contract save | V-contract-expiration-after-start · V-contract-edit-status-aware-fields |
| `PricingTypeNotConfigured` | pricing | Visibility=Show without PriceType | Visibility/Pricing edit | V-service-visibility-pricing-required |
| `UnsupportedPricingType` | pricing | PriceType value not supported | Pricing edit | V-service-visibility-pricing-required |
| `HiddenProductMustNotHavePricing` | pricing | Pricing supplied while Hidden | Visibility/Pricing edit | V-service-visibility-pricing-required |
| `InvalidAuthorityLetterType` | enum | Authority letter type outside enum | Add Client Step 1 | — |
| `InvalidNodeLevel` | quota | Node level out of bounds | Add Node | — |
| `InvalidAccountLimits` | limits | Account-limit values invalid (handler) | Add Client Step 2 / Settings | V-account-limits-zero-means-no-limit |
| `NoChangesToUpdate` | workflow | PATCH with no actual change | PATCH endpoints | — |
| `NewNodeNameNotApplyed` | workflow | Sub-node rename queue state inconsistent | Edit Node | — |
| `NewPricingTypeMustPassWithEffectiveDate` | pricing | Periodic pricing change needs EffectiveDate | Pricing edit | — |
| `EffectiveDateMustBeInFuture` | date | EffectiveDate ≤ now | Pricing edit / Contract save | V-contract-expiration-after-start |
| `InvalidEffectiveDateForPeriodicPricingChange` | date | EffectiveDate invalid for periodic flow | Periodic pricing | — |
| `PriceValueNotConfigured` | pricing | Visibility=Show without PriceValue | Visibility/Pricing edit | V-service-visibility-pricing-required |
| `OwnerIdNotMatchWithTenantId` | scope | OwnerId/TenantId mismatch | Add Client Step 5 | — |
| `SettingsOnlyAllowedForMainNode` | scope | Settings op on non-Main node | Settings ops | — |
| `WalletSettingsOnlyForMainNode` | scope | WalletSettings op on non-Main node | Wallet config | — |
| `InvalidWalletBalanceType` | wallet | WalletBalanceType outside enum | Wallet config | — |
| `InvalidVerificationCode` | otp | Wrong OTP submitted | Verify OTP | V-login-lockout-3-wrong-attempts |
| `OtpResendLimitExceeded` | otp | Resend hit > 3 | Resend OTP | V-login-lockout-3-wrong-attempts |
| `OtpNotReady` | otp | Flow misorder | Verify OTP | V-login-lockout-3-wrong-attempts |
| `OtpAlreadyConfigured` | otp | OTP method already registered | OTP setup | — |
| `VerificationCodeExpired` | otp | OTP expired (past 60s) | Verify OTP | V-login-lockout-3-wrong-attempts (sibling) |
| `PhoneVerificationFailed` | verification | Phone verify failed (post-Zitadel) | Phone verify | — |
| `EmailVerificationFailed` | verification | Email verify failed | Email verify | — |
| `UserLockedCannotEdit` | status | Locked user cannot edit profile | Edit profile | V-login-lockout-3-wrong-attempts (sibling) |
| `InsufficientBalance` | balance | Charge/transfer > available balance | Reserve · DirectDebit · Transfer | V-charging-insufficient-balance |
| `NoApplicableRate` | rate | No matching matrix cell | Reserve · DirectDebit | V-charging-no-applicable-rate |
| `InvalidTransferWallets` | transfer | Source/dest invalid combo | Transfer Balance | V-charging-transfer-source-destination |
| `InvalidWalletIdentity` | transfer | Wallet id shape/scope invalid | Transfer Balance | V-charging-transfer-source-destination |
| `InvalidAmount` | transfer | Amount ≤ 0 | Transfer · Reserve | V-charging-transfer-source-destination · V-charging-insufficient-balance |
| `InvalidIdempotencyKey` | request | Idempotency key malformed | Charging ops | — |
| `InvalidChargeRequest` | request | Charge request shape invalid | Charging ops | — |
| `InvalidOperation` (Contact-Group) | generic | CG generic 422 | CG ops | V-contact-group-column-name-shape (likely path) |

### 1.8 — 423 Locked

| Code | Category | Semantic meaning | Surfaces when | V-rule |
|---|---|---|---|---|
| `UserLocked` | status | User status = Locked | Login attempt | V-login-lockout-3-wrong-attempts |

### 1.9 — 429 Too Many Requests

| Code | Category | Semantic meaning | Surfaces when | V-rule |
|---|---|---|---|---|
| `OtpStillValid` | throttle | Resend while existing OTP still inside 60s window | Resend OTP | V-login-lockout-3-wrong-attempts |

### 1.10 — 500 / 502 / 503 / 504 (server errors — non-business)

> Included for completeness. The FE handling for all 5xx is uniform: toast + retry, preserve form state.

| Code | Service | HTTP | Meaning |
|---|---|---|---|
| `InternalServerError` | all | 500 | Catch-all |
| `UnknownError` | Commerce/Identity | 500 | Catch-all variant |
| `ExternalServiceError` | Commerce/Identity | 500 | Downstream non-success re-raised |
| `ExternalServiceConnectionError` | Commerce/Identity | 500 | Downstream unreachable |
| `ExternalServiceTimeout` | Commerce/Identity | 500 | Downstream timeout |
| `IdentityServiceError` | Contact-Group | 502 | Identity HTTP call failed |
| `IdentityServiceConnectionError` | Contact-Group | 503 | Identity unreachable |
| `IdentityServiceTimeout` | Contact-Group | 504 | Identity timeout |
| `ServiceUnavailable` | Commerce/Identity | 503 | Generic 503 |
| `CreateIdentityUserFailed` | Commerce | 500 | Zitadel create-user call failed (Add Client Step 5 partial-failure path) |
| `GetIdentityUserFailed` | Commerce | 500 | Zitadel lookup failed |
| `RenewalJobCreationFailed` | Commerce | 500 | Background renewal job creation failed |
| `RenewalJobFailed` | Commerce | 500 | Background renewal job failed |
| `FailedToUpdateCommunicationChannelPriceType` | Commerce | 500 | Pricing change save failed |
| `S3CopyFailed` | Contact-Group | 500 | Temp → permanent S3 copy failed |
| `ImportEventPublishFailed` | Contact-Group | 500 | Kafka producer failed |
| `ZitadelServiceUserTokenNotConfigured` | Commerce/Identity | 500 | Zitadel config missing |
| `ZitadelGetOrganizationFailed` | Commerce/Identity | 500 | Zitadel org-get failed |
| `ZitadelOrganizationNotFound` | Commerce/Identity | 500 | Zitadel org not found |
| `ZitadelCreateProjectFailed` | Commerce | 500 | Zitadel project create failed |
| `ZitadelCreateWebPlatformUiAppFailed` | Commerce | 500 | Zitadel app create failed |
| `ZitadelCreateApiAppFailed` | Commerce | 500 | Zitadel API app create failed |
| `ZitadelSearchUserFailed` | Commerce/Identity | 500 | Zitadel search failed |
| `ZitadelAdminUserNotFound` | Commerce/Identity | 500 | Zitadel admin not found |
| `ZitadelCreateMachineUserFailed` | Commerce | 500 | Zitadel machine user create failed |
| `ZitadelLockUserFailed` | Commerce/Identity | 500 | Zitadel lock op failed |
| `ZitadelUnlockUserFailed` | Commerce/Identity | 500 | Zitadel unlock op failed |
| `ZitadelDeactivateUserFailed` | Commerce/Identity | 500 | Zitadel deactivate failed |
| `ZitadelReactivateUserFailed` | Commerce/Identity | 500 | Zitadel reactivate failed |
| `ZitadelSetAdminMetadataFailed` | Commerce/Identity | 500 | Zitadel metadata set failed |
| `ZitadelUpdateUserProfileFailed` | Commerce | 500 | Zitadel profile update failed |
| `ZitadelUpdateUserPhoneFailed` | Commerce | 500 | Zitadel phone update failed |
| `ZitadelLoginClientTokenNotConfigured` | Identity | 500 | Zitadel login-client config missing |
| `ZitadelFalconProjectIdNotConfigured` | Identity | 500 | Zitadel project ID missing |
| `ZitadelDeleteUserFailed` | Identity | 500 | Zitadel delete failed |
| `ZitadelSearchUsersFailed` | Identity | 500 | Zitadel batch search failed |
| `ZitadelTokenIntrospectionFailed` | Identity | 500 | Token introspect failed |
| `ZitadelTokenRevocationFailed` | Identity | 500 | Token revoke failed |
| `ZitadelGetUserInfoFailed` | Identity | 500 | userinfo call failed |
| `ZitadelEndSessionFailed` | Identity | 500 | Session end failed |
| `ZitadelRemoveOtpFailed` | Identity | 500 | OTP remove failed |
| `ZitadelRegisterOtpFailed` | Identity | 500 | OTP register failed |
| `ZitadelRegisterTotpFailed` | Identity | 500 | TOTP register failed |
| `ZitadelRemovePhoneFailed` | Identity | 500 | Remove phone failed |
| `ZitadelRemoveEmailFailed` | Identity | 500 | Remove email failed |
| `ZitadelGetPasswordPolicyFailed` | Identity | 500 | Password policy get failed |
| `ZitadelSetPasswordPolicyFailed` | Identity | 500 | Password policy set failed |
| `ZitadelGetLoginPolicyFailed` | Identity | 500 | Login policy get failed |
| `ZitadelSetLoginPolicyFailed` | Identity | 500 | Login policy set failed |
| `ZitadelListSessionsFailed` | Identity | 500 | Session list failed |
| `ZitadelDeleteSessionFailed` | Identity | 500 | Session delete failed |
| `ZitadelDeleteMetadataFailed` | Identity | 500 | Metadata delete failed |
| `ZitadelGetSessionFailed` | Identity | 500 | Session get failed |

## 2. By service ownership

### 2.1 — Commerce (owns the largest catalog; only service with `[ErrorHttpStatus]` attribute)

| Code | HTTP | Use case |
|---|---|---|
| All 4xx codes listed in §1 marked "Commerce" | varies | Commerce DTOs raise these via FastEndpoints pre-processors + handlers |
| `AccountNameRequired` · `AccountNameTooLong` · `DuplicateTenantName` · `DuplicateNodeName` | 400/409 | Add Client Step 1 |
| `InvalidAccountLimits` · `MaxNodeLevelReached` · `NormalUserLimitReached` | 422 | Account limits at create/edit/runtime |
| `PriceValueNotConfigured` · `PricingTypeNotConfigured` · `HiddenProductMustNotHavePricing` · `ActivationNotAllowedForHiddenProduct` · `CannotEnableNonVisibleService` · `InvalidPriceValue` · `InvalidPriceType` · `PriceValueRequired` · `UnsupportedPricingType` · `FailedToUpdateCommunicationChannelPriceType` | 400/422/500 | Visibility / pricing edit & periodic changes |
| `ContractEditOnlyAllowedWhenPending` · `InvalidContractConfiguration` · `EffectiveDateMustBeInFuture` · `InvalidEffectiveDateForPeriodicPricingChange` · `WalletStrategyRequiredForContract` · `ContractNotFound` | 422/404 | Contracts |
| `NormalUserLimitReached` · `MaxNodeLevelReached` · `InvalidNodeLevel` · `RootNodeDeletionNotAllowed` · `RootNodeCannotHaveSubNodes` · `ActionsNotAllowedOnDeletedNode` | 422 | Hierarchy structural rules |
| `FirstNameLettersOnly` · `LastNameLettersOnly` · `UsernameMustStartWithLetter` · `InvalidPhoneNumber` · `InvalidImageFile` · `ImageExtensionNotAllowed` · `ProfilePictureSizeExceeded` · `FileSizeExceeded` · `ExecutableFileNotAllowed` | 400 | User input / file upload validators (reused by Identity for Add User) |
| `DuplicateUsername` · `UserAlreadyExists` · `UserAlreadyInStatus` · `OnlyFalconUserCanRestoreDeletedUser` · `FalconUserMustNotHaveTenantId` · `InvalidStatusTransition` · `InvalidRoleForUserType` · `InvalidPassword` · `ChangePasswordFailed` · `InvalidVerificationCode` | 409/422 | User lifecycle / status |
| All `Zitadel*Failed` 500-class | 500 | Zitadel adapter failures |

### 2.2 — Identity (auth + user lifecycle + OTP + Zitadel adapter)

| Code | HTTP | Use case |
|---|---|---|
| `InvalidCredentials` · `Unauthorized` · `InvalidRefreshToken` · `InvalidUsernameOrPhone` | 401 | Auth flow |
| `UserLocked` · `UserSuspended` · `UserPending` · `UserNotInitialized` | 423/403 | Login eligibility |
| `OtpStillValid` (429) · `OtpResendLimitExceeded` · `OtpNotReady` · `OtpAlreadyConfigured` · `InvalidVerificationCode` · `VerificationCodeExpired` | 422/429 | OTP lifecycle |
| `PasswordTooShort` · `PasswordRequiresUppercase/Lowercase/Digit/SpecialChar` · `PasswordsDoNotMatch` · `ChangePasswordFailed` · `InvalidPassword` | 422 | Password policy |
| `IpNotAllowed` | 403 | IP allowlist pre-processor |
| `UserSuspendedCannotEdit` · `UserLockedCannotEdit` · `UserDeletedCannotEdit` · `PendingSelfEditBlocked` · `SelfEditRoleNotAllowed` | 403/410/423 | Edit user gates |
| `NormalUserLimitReached` (shared with Commerce) | 422 | UserQuotaPolicy |
| `UserNotFound` · `DuplicateUsername` | 404/409 | User lifecycle |
| `MaxLengthExceeded` · `BelowMinimumLength` · `RequiredFieldMissing` · `InvalidValue` · `FirstNameLettersOnly` · `LastNameLettersOnly` · `UsernameMustStartWithLetter` · `InvalidImageFile` · `TenantIdRequired` · `NodeIdRequired` | 400 | Generic validators |
| All `Zitadel*Failed` 500 codes | 500 | Zitadel adapter |

### 2.3 — Charging (smallest core-domain catalog; no `[ErrorHttpStatus]` attribute — HTTP inferred)

| Code | HTTP `[INFERRED]` | Use case |
|---|---|---|
| `DuplicateTenantName` | 409 | Shared with Commerce |
| `WalletNotFound` · `NoAnyCommChannelWalletWasFound` · `CommChannelSubWalletNotFound` · `ReservationNotFound` | 404 | Wallet entity lookup |
| `InsufficientBalance` · `InvalidTransferWallets` · `InvalidWalletIdentity` · `InvalidAmount` · `InvalidChargeRequest` · `InvalidIdempotencyKey` · `NoApplicableRate` | 422 | Reserve / DirectDebit / Transfer / Commit |
| `WalletVersionConflict` | 409 | Optimistic concurrency lost (after 3 retries) |
| `WalletSettingsNotFound` | 404 | WalletSettings absent (sync issue) |
| `UnauthorizedUserToPerformThisAction` | 403 | Authz |
| `InternalServerError` | 500 | Catch-all |

### 2.4 — Provisioning (smallest catalog — 7 codes; no `[ErrorHttpStatus]` attribute)

| Code | HTTP `[INFERRED]` | Use case |
|---|---|---|
| `DuplicateTenantName` | 409 | Shared (rarely thrown) |
| `CommChannelNotFound` · `ApplicationNotFound` | 404 | Catalog lookup |
| `CannotHideActiveService` | 422 | Visibility flip blocked by Active status |
| `UnauthorizedAction` · `UnauthorizedUserToPerformThisAction` | 403 | Authz |
| `InternalServerError` | 500 | Catch-all |

### 2.5 — Contact-Group

| Code | HTTP | Use case |
|---|---|---|
| `RequiredFieldMissing` · `MaxLengthExceeded` · `BelowMinimumLength` · `InvalidPageNumber` · `InvalidPageSize` · `InvalidFileSize` · `ContactGroupNameRequired` · `ContactGroupNameInvalidFormat` · `InvalidFileType` · `FileSizeExceeded` · `FileEmpty` · `NoDataRows` · `FileParseError` · `ImportTooLarge` | 400 | Wizard inputs + upload pipeline |
| `EntityNotFound` · `ContactGroupNotFound` · `UploadSessionNotFound` · `FileNotFound` | 404 | Entity lookup |
| `UploadSessionExpired` | 410 | Session past TTL |
| `UploadSessionAlreadyCompleted` · `UploadSessionNotReady` · `UploadSessionAlreadyUsed` · `ContactGroupNotCompleted` · `DuplicateEntity` | 409 | State conflicts |
| `UnauthorizedAccess` · `ForbiddenToDeleteContactGroup` · `ForbiddenToShareContactGroup` · `ForbiddenToEditContactGroup` | 403 | Creator-only ops |
| `InvalidOperation` · `NoChangesToUpdate` | 422 | Generic + PATCH no-op |
| `TenantIdMissing` | 401 | JWT-no-tenant for client endpoint |
| `NodeIdMissing` · `NodeIdRequiredForFalconUser` | 400 | Falcon admin scope |
| `NodeNotInHierarchy` | 403 | Node out of access scope |
| `IdentityServiceError` (502) · `IdentityServiceConnectionError` (503) · `IdentityServiceTimeout` (504) | 5xx | Identity adapter failures |
| `S3CopyFailed` · `ImportEventPublishFailed` · `InternalServerError` | 500 | Infrastructure |

### 2.6 — Templates (small focused catalog)

| Code | HTTP | Use case |
|---|---|---|
| `RequiredFieldMissing` · all 9 CheckerLevel codes (see §1.1) | 400 | CommChannelConfig PUT |
| `CommunicationChannelConfigNotFound` | 404 | Config lookup |
| `NoChangesToUpdate` | 422 | No-op PUT |
| `UnauthorizedAccess` | 403 | Authz |
| `TenantIdMissing` | 401 | Falcon admin without tenant |
| `InternalServerError` | 500 | Catch-all |

### 2.7 — Access / PES — **no `FalconKeys` catalog**

[BRAIN-OUT] `understanding/backend/access/ERRORS.md` documents that PES does not use `FalconException` + `FalconKeys`. It uses raw `IResult` / `Results.BadRequest({ error })` / `Results.Forbid()` / framework `401`/`500`. FE cannot pattern-match on error codes for PES — must rely on HTTP status plus the free-form `error` field.

| Status | Cause |
|---|---|
| 200 | Success |
| 400 | Malformed JSON, handler `Results.BadRequest({ error })` |
| 401 | Missing/invalid JWT |
| 403 | `Results.Forbid()` from handler / policy |
| 500 | Unhandled exception |

## 3. By feature surfacing

### 3.1 — `organization-hierarchy` (most error-rich feature)

Codes that can surface in the Add Client wizard + Add User wizard + Settings tab edits — see [BRAIN-OUT] [`Add Client/12-ERROR_STATES.md`](../../../understanding/pages/organization-hierarchy/Add%20Client/12-ERROR_STATES.md) for the canonical UX mapping.

- **Step 1 (Basic Info):** `AccountNameRequired`, `AccountNameTooLong`, `DuplicateTenantName`, `DuplicateNodeName`, `OfficialDataRequired`, `MainNodeAccountInfoRequired`, `FinanceIdRequired`, `CountryRequiredWhenCityProvided`, `CityRequiredWhenDistrictProvided`, `CityRequiredWhenStreetProvided`, `InvalidAuthorityLetterType`, `BudgetNoRequired`, `CommercialRegistrationRequired`, `LicenseNoRequired`, `ImageExtensionNotAllowed`, `InvalidImageFile`, `ExecutableFileNotAllowed`, `ProfilePictureSizeExceeded`, `FileSizeExceeded`, `MaxLengthExceeded`, `RequiredFieldMissing`.
- **Step 2 (Settings):** `MainAccountSettingsRequired`, `InvalidAccountLimits`, `InvalidNodeLevel`, `InvalidValue`, `InvalidIpAddress`, `MaxNodeLevelReached`.
- **Steps 3 + 4 (CommChannels / Apps):** `PriceValueNotConfigured`, `PricingTypeNotConfigured`, `HiddenProductMustNotHavePricing`, `InvalidPriceValue`, `InvalidPriceType`, `PriceValueRequired`, `UnsupportedPricingType`, `CannotEnableNonVisibleService`, `ActivationNotAllowedForHiddenProduct`.
- **Step 5 (Account Owner):** `RequiredFieldMissing`, `FirstNameLettersOnly`, `LastNameLettersOnly`, `UsernameMustStartWithLetter`, `InvalidPhoneNumber`, `DuplicateUsername`, `NormalUserLimitReached`, `OwnerIdNotMatchWithTenantId`.
- **Cross-cutting (toast):** `Forbidden`, `Unauthorized`, `IpNotAllowed`, all 500-class Identity/Zitadel failures, generic 5xx network errors, `CreateIdentityUserFailed` (Step 5 partial-failure with Account already created server-side).
- **Add User wizard** (within Org Hierarchy): same Step 5 set + `InvalidRoleForUserType`, `NormalUserLimitReached` (Identity-side via `UserQuotaPolicy`).
- **Settings tab Edit (admin):** `InvalidAccountLimits`, `InvalidIpAddress`, `SettingsOnlyAllowedForMainNode`, `WalletSettingsOnlyForMainNode`, password security `InvalidValue`.

### 3.2 — `comms-hub` (listing + activation)

[BRAIN-OUT] [`comms-hub.compare.md`](../04-feature-parity-matrix/comms-hub.compare.md):

- **Do-Payment popup:** `InsufficientBalance` (422), `NoApplicableRate` (422), `ReservationNotFound` (404, TTL expiry on Commit), `WalletNotFound` (404), `NoAnyCommChannelWalletWasFound` (404), `CommChannelSubWalletNotFound` (404), `InvalidAmount` (422), `WalletVersionConflict` (409 — transient).
- **Visibility/Pricing inline edit (admin only):** `PriceValueNotConfigured`, `PricingTypeNotConfigured`, `HiddenProductMustNotHavePricing`, `InvalidPriceValue`, `InvalidPriceType`, `CannotEnableNonVisibleService`, `ActivationNotAllowedForHiddenProduct`, `CannotHideActiveService` (Provisioning), `FailedToUpdateCommunicationChannelPriceType` (500).
- **Cross-cutting:** `IpNotAllowed`, `UserLocked` (auth path), `Forbidden`, `Unauthorized`, all 5xx.

### 3.3 — `marketplace-applications` (service cards + payment dialog)

Same shape as `comms-hub` per PRD-01 ("CommChannelConfig and AppConfig same shape"):

- **Activation:** `InsufficientBalance`, `NoApplicableRate`, `ReservationNotFound`, `WalletNotFound`, `InvalidAmount`, `WalletVersionConflict`, `ActivationNotAllowedForHiddenProduct`, `CannotPayForDisabledService`.
- **Visibility/Pricing (admin only):** `PriceValueNotConfigured`, `PricingTypeNotConfigured`, `HiddenProductMustNotHavePricing`, `InvalidPriceValue`, `InvalidPriceType`, `CannotHideActiveService`.
- **404 family:** `ApplicationNotFound`, `ApplicationNotFoundForAccount`, `NoPendingPriceTypeChange`, `NoPendingPriceValueChange`.

### 3.4 — `contact-groups` (cleanest 1:1 to PRD-04)

- **Step 1 (Upload & Details):** `ContactGroupNameRequired`, `ContactGroupNameInvalidFormat`, `InvalidFileType`, `FileSizeExceeded`, `InvalidFileSize`, `FileEmpty`, `FileParseError`, `NoDataRows`, `ImportTooLarge`, `UploadSessionNotFound`, `UploadSessionExpired` (410), `UploadSessionAlreadyCompleted`, `UploadSessionAlreadyUsed`, `UploadSessionNotReady`, `S3CopyFailed` (500), `ImportEventPublishFailed` (500), `FileNotFound`.
- **Step 2 (Preview & Configure columns):** generic `RequiredFieldMissing`, `MaxLengthExceeded`, `InvalidOperation` (PRD-spec'd column-shape rules surface as these — no dedicated `InvalidColumnName` code per V-rule honest call).
- **Step 3 (Share):** no error code from the mutex itself (backend silently drops `SharedUsers[]` when flag true); shared-step errors: `ForbiddenToShareContactGroup`, `IdentityServiceError` (502, user-lookup failure).
- **Edit / Delete:** `ForbiddenToEditContactGroup`, `ForbiddenToDeleteContactGroup`, `ContactGroupNotFound`, `NoChangesToUpdate`.
- **Cross-cutting:** `TenantIdMissing` (401), `NodeIdMissing`, `NodeIdRequiredForFalconUser`, `NodeNotInHierarchy` (403).

### 3.5 — `wallet-balance-management`

[BRAIN-OUT] [`wallet-balance-management.compare.md`](../04-feature-parity-matrix/wallet-balance-management.compare.md):

- **Transfer Balance dialog:** `InvalidTransferWallets`, `InvalidWalletIdentity`, `InvalidAmount`, `InsufficientBalance`, `WalletVersionConflict`, `WalletNotFound`, `NoAnyCommChannelWalletWasFound`, `CommChannelSubWalletNotFound`.
- **Do-Payment popup (canonical wrapper):** same as comms-hub Do-Payment list.
- **Wallet ops:** `WalletSettingsNotFound`, `WalletSettingsAlreadyConfigured`, `InvalidWalletBalanceType`, `WalletSettingsOnlyForMainNode`, `CurrencyRequired`, `WalletBalanceTypeRequired`, `WalletTypeRequired`.

### 3.6 — `contracts-cost-management` (strongest authority asymmetry)

- **Step 1 (Contract Information):** `RequiredFieldMissing`, `InvalidValue` (CommittedValue ≤ 0 or Currency outside enum), `EffectiveDateMustBeInFuture`, `InvalidContractConfiguration` (EndDate ≤ StartDate), `WalletStrategyRequiredForContract`.
- **Step 3 (Contract Details matrix):** per-cell `RequiredFieldMissing`, `InvalidValue` (RatePerUnit < 0).
- **Edit dialog:** `ContractEditOnlyAllowedWhenPending` (locked field changed in Active/Expired), `InvalidContractConfiguration`, `ContractNotFound`, `NoChangesToUpdate`, `NewPricingTypeMustPassWithEffectiveDate`, `InvalidEffectiveDateForPeriodicPricingChange`.
- **Permission (negative path):** `Forbidden`, `UnauthorizedAction`, `UnauthorizedUserToPerformThisAction` (acc-admin / acc-user always denied).

### 3.7 — `testing-charging` (internal diagnostic — admin-only)

Same Charging codes as `wallet-balance-management` + Do-Payment surface — but exercised as simulator output, not as user-facing form validators:

- `InsufficientBalance`, `NoApplicableRate`, `InvalidTransferWallets`, `InvalidWalletIdentity`, `InvalidAmount`, `WalletVersionConflict`, `ReservationNotFound`, `InvalidChargeRequest`, `InvalidIdempotencyKey`.
- Not exposed to Client users at all (feature itself is Falcon-only).

## 4. By V-rule linkage (the 25 V-rules + their error codes)

Codes that each V-rule names in its "Backend enforcement" section. Listed in V-rule alphabetical order.

| V-rule | Severity | Linked error codes (HTTP) |
|---|---|---|
| V-account-ip-allowlist-enforcement | medium | `IpNotAllowed` (403, Identity) · `InvalidIpAddress` (403, Commerce) |
| V-account-limits-zero-means-no-limit | high | `InvalidAccountLimits` (422) · `MaxNodeLevelReached` (422) · `NormalUserLimitReached` (422) · `RequiredFieldMissing` (400) |
| V-account-name-format-uniqueness | high | `AccountNameRequired` (400) · `RequiredFieldMissing` (400) · `MaxLengthExceeded` (400) · `AccountNameTooLong` (400) · `DuplicateTenantName` (409) |
| V-charging-insufficient-balance | medium | `InsufficientBalance` (422) · `InvalidAmount` (422) · `WalletNotFound` (404) · `NoAnyCommChannelWalletWasFound` (404) · `CommChannelSubWalletNotFound` (404) · `ReservationNotFound` (404) · `WalletVersionConflict` (409) |
| V-charging-no-applicable-rate | high | `NoApplicableRate` (422) |
| V-charging-transfer-source-destination | high | `InvalidTransferWallets` (422) · `InvalidWalletIdentity` (422) · `WalletNotFound` (404) · `NoAnyCommChannelWalletWasFound` (404) · `CommChannelSubWalletNotFound` (404) · `InsufficientBalance` (422) · `InvalidAmount` (422) |
| V-contact-group-column-name-shape | high | `RequiredFieldMissing` (400) · `MaxLengthExceeded` (400) · `InvalidOperation` (422, catch-all) — no dedicated `InvalidColumnName` code |
| V-contact-group-file-size-cap | high | `FileSizeExceeded` (400) · `InvalidFileSize` (400) · `FileEmpty` (400) · `ImportTooLarge` (400) |
| V-contact-group-file-type-allowlist | high | `InvalidFileType` (400) · `FileEmpty` (400) · `FileParseError` (400) · `NoDataRows` (400) |
| V-contact-group-name-required-format | high | `ContactGroupNameRequired` (400) · `ContactGroupNameInvalidFormat` (400) · `MaxLengthExceeded` (400) |
| V-contact-group-share-policy-mode-mutex | high | (no dedicated code — silent backend normalization) · `ForbiddenToShareContactGroup` (403) · `IdentityServiceError` (502) |
| V-contract-committed-value-positive | high | `RequiredFieldMissing` (400) · `InvalidValue` (400) |
| V-contract-currency-enum | high | `InvalidValue` (422) · `RequiredFieldMissing` (400) |
| V-contract-edit-status-aware-fields | medium | `ContractEditOnlyAllowedWhenPending` (422) · `InvalidContractConfiguration` (422) |
| V-contract-expiration-after-start | medium | `EffectiveDateMustBeInFuture` (422) · `InvalidContractConfiguration` (422) · `RequiredFieldMissing` (400) |
| V-contract-rate-per-unit-non-negative | medium | `RequiredFieldMissing` (400) · `InvalidValue` (400) |
| V-login-lockout-3-wrong-attempts | medium | `InvalidCredentials` (401) · `UserLocked` (423) · `OtpStillValid` (429) · `OtpResendLimitExceeded` (422) · `InvalidVerificationCode` (422) · `OtpNotReady` (422) |
| V-normal-user-limit-enforcement | medium | `NormalUserLimitReached` (422) |
| V-password-complexity-per-security-level | high | `InvalidPassword` (422) · `PasswordTooShort` (422) · `PasswordRequiresUppercase` (422) · `PasswordRequiresLowercase` (422) · `PasswordRequiresDigit` (422) · `PasswordRequiresSpecialChar` (422) · `PasswordsDoNotMatch` (422) · `ChangePasswordFailed` (422) |
| V-password-security-level-enum | high | `RequiredFieldMissing` (400) · `InvalidValue` (422) |
| V-service-visibility-pricing-required | high (drift) | `PriceValueNotConfigured` (422) · `PricingTypeNotConfigured` (422) · `HiddenProductMustNotHavePricing` (422) · `InvalidPriceValue` (400) · `InvalidPriceType` (400) · `ActivationNotAllowedForHiddenProduct` (422) · `CannotEnableNonVisibleService` (422) |
| V-template-checker-level-integrity | medium | `CheckerLevelsRequired` (400) · `CheckerLevelMustHaveAtLeastOneUser` (400) · `CheckerLevel1RequiredBeforeLevel2` (400) · `CheckerLevelLimitExceeded` (400) · `DuplicateCheckerLevelNumber` (400) · `UserAssignedToMultipleCheckerLevels` (400) · `InvalidCheckerLevelNumber` (400) · `LevelsCountMismatch` (400) |
| V-template-levels-count-required-for-restricted | high | `LevelsCountRequiredForRestricted` (400) · `LevelsCountMismatch` (400) · `CheckerLevelsRequired` (400) · `CheckerLevelLimitExceeded` (400) |
| V-user-first-last-name-letters-only | medium | `RequiredFieldMissing` (400) · `MaxLengthExceeded` (400) · `FirstNameLettersOnly` (400) · `LastNameLettersOnly` (400) |
| V-username-format-uniqueness-immutable | medium (drift) | `RequiredFieldMissing` (400) · `MaxLengthExceeded` (400) · `UsernameMustStartWithLetter` (400) · `DuplicateUsername` (409) · `InvalidUserExistQuery` (400) |

## 5. Defensive coding patterns

[BRAIN-OUT] Three canonical FE-side error-handling patterns recur across the V-rule notes + Add Client `12-ERROR_STATES.md`. Cite the source for each.

### Pattern 1 — Display localized message, branch on HTTP status (the standing rule)

**Citation:** [BRAIN-OUT] `06-validation-by-feature/MATRIX.md` §7 — "Use HTTP status code as the primary routing signal. Display localized `errorMessages[0]` to the user (already localized; do not parse codes)."

```typescript
// Canonical handler — applies to every backend call
catchError((err: HttpErrorResponse) => {
  const status = err.status;                              // primary routing signal
  const msg = err.error?.errorMessages?.[0] ?? '...';     // already localized
  const code = err.error?.errors?.[0]?.code;              // for logging only — NEVER branch UI copy

  switch (status) {
    case 400: case 422: this.toast.error(msg); break;     // validation
    case 401: this.auth.relogin(); break;                 // re-auth
    case 403: this.handle403(code, msg); break;           // IP allowlist vs permission
    case 404: this.toast.error(msg); break;               // not found
    case 409: this.applyFieldError(code, msg); break;     // uniqueness conflict
    case 423: this.router.go('/account-locked'); break;   // status lock
    case 429: this.startCountdown(60); break;             // OTP throttle
    default:  this.toast.error(msg); break;               // 5xx
  }
  this.telemetry.log(code, status);                       // log code, never display it
  return throwError(() => err);
})
```

### Pattern 2 — Row-level retry vs page-level error (charging cascade)

**Citation:** [BRAIN-OUT] V-charging-insufficient-balance "Frontend implementation hint" — "Treat any `InsufficientBalance` 422 from Reserve/Commit/Direct-Debit as the final answer — show the localized message from the response body and offer a 'Top up' link to the transfer dialog." V-charging-no-applicable-rate "Frontend implementation hint" — "Show a user-friendly 'Service not configured' message and surface it to ops."

Pattern split:
- **`InsufficientBalance` (422)** → row-level retry CTA: "Top up" deep-link to Transfer Balance dialog. User can fix.
- **`NoApplicableRate` (422)** → non-actionable copy: "Service not configured — contact support". No retry CTA. User cannot fix.
- **`ReservationNotFound` (404)** on Commit → silent automatic re-quote (re-run Reserve). Reservation TTL is 300s; auto-expiry is not a user-facing error.
- **`WalletVersionConflict` (409)** → silent automatic retry once. If it surfaces, it has already burned the handler's 3 internal retries; show "Try again" toast.

```typescript
// Charging-specific path
catchError((err: HttpErrorResponse) => {
  const code = err.error?.errors?.[0]?.code;
  if (err.status === 404 && code === 'ReservationNotFound') {
    return this.reReserveAndCommit();                     // silent re-quote
  }
  if (err.status === 422 && code === 'InsufficientBalance') {
    this.dialog.open(InsufficientBalanceDialog, { topupLink: '/wallets/transfer' });
    return EMPTY;                                         // page-level dialog, no row retry
  }
  if (err.status === 422 && code === 'NoApplicableRate') {
    this.toast.error(err.error?.errorMessages?.[0], { actionable: false });
    return EMPTY;                                         // non-actionable
  }
  return throwError(() => err);
});
```

### Pattern 3 — Lockout cascade (login + OTP)

**Citation:** [BRAIN-OUT] V-login-lockout-3-wrong-attempts "Frontend implementation hint" + V-account-ip-allowlist-enforcement (the gateway IP gate runs BEFORE the lockout counter).

Cascade order on `/auth/login`:
1. **Gateway IP pre-processor** — 403 `IpNotAllowed` or 403 `InvalidIpAddress`. Generic "Login failed" copy (BR-UM-24 — must not differentiate from credentials).
2. **`LoginEligibilityPolicy`** — 423 `UserLocked` / 403 `UserSuspended` / 403 `UserPending`. Route to static "Account locked" screen, no retry button.
3. **Credentials check** — 401 `InvalidCredentials`. Show generic "Login failed" with the localized message (counter is server-state, do not pre-empt client-side).
4. **OTP send** — 429 `OtpStillValid` → disable Resend, start 60s countdown.
5. **OTP verify** — 422 `InvalidVerificationCode`. Lockout fires server-side at 3 wrong attempts.
6. **OTP resend** — 422 `OtpResendLimitExceeded` → same lockout screen as `UserLocked`.

```typescript
// Login handler
catchError((err: HttpErrorResponse) => {
  const code = err.error?.errors?.[0]?.code;

  // 423 lockout — terminal state, no retry
  if (err.status === 423 || code === 'UserLocked' || code === 'OtpResendLimitExceeded') {
    this.router.navigate(['/account-locked']);
    return EMPTY;
  }
  // 429 OTP throttle — start countdown
  if (err.status === 429 || code === 'OtpStillValid') {
    this.otpCountdown.start(60);
    return EMPTY;
  }
  // 403 IP allowlist — DO NOT differentiate from credentials
  if (err.status === 403 && (code === 'IpNotAllowed' || code === 'InvalidIpAddress')) {
    this.toast.error(this.t('Generic.LoginFailed'));      // same copy as 401
    return EMPTY;
  }
  // 401 wrong credentials — same generic copy
  if (err.status === 401) {
    this.toast.error(this.t('Generic.LoginFailed'));
    return EMPTY;
  }
  return throwError(() => err);
});
```

## 6. Cross-references

- [`FE-CONTRACT.md`](./FE-CONTRACT.md) — frontend error-handling contract in detail (the 3 standing rules, ServiceOperationResult envelope, UX mapping table, anti-patterns)
- [`_INDEX.md`](./_INDEX.md) — cluster entry MOC
- [`../06-validation-by-feature/MATRIX.md`](../06-validation-by-feature/MATRIX.md) — V-rule × feature cross-cut matrix (codes in §7 recap)
- [`../04-feature-parity-matrix/MATRIX.md`](../04-feature-parity-matrix/MATRIX.md) — 7-feature parity grid
- [`../04-feature-parity-matrix/organization-hierarchy.compare.md`](../04-feature-parity-matrix/organization-hierarchy.compare.md) — feature compare for org-hierarchy
- [`../04-feature-parity-matrix/comms-hub.compare.md`](../04-feature-parity-matrix/comms-hub.compare.md) — comms-hub compare (Do-Payment surface)
- [`../04-feature-parity-matrix/marketplace-applications.compare.md`](../04-feature-parity-matrix/marketplace-applications.compare.md) — marketplace compare
- [`../04-feature-parity-matrix/contact-groups.compare.md`](../04-feature-parity-matrix/contact-groups.compare.md) — contact-groups compare
- [`../04-feature-parity-matrix/wallet-balance-management.compare.md`](../04-feature-parity-matrix/wallet-balance-management.compare.md) — wallets + transfer compare
- [`../04-feature-parity-matrix/contracts-cost-management.compare.md`](../04-feature-parity-matrix/contracts-cost-management.compare.md) — contracts compare
- [`../04-feature-parity-matrix/testing-charging.compare.md`](../04-feature-parity-matrix/testing-charging.compare.md) — testing-charging compare
- [`../02-statuses/`](../02-statuses/) — status enums that some codes reference (e.g. `UserLocked`, `UserSuspended`)
- [BRAIN-OUT] `understanding/backend/<service>/ERRORS.md` (one per service) — source per-service catalogs
- [BRAIN-OUT] `Brain SK/_obsidian/30-Validation/V-*.md` — 25 V-rule notes
- [BRAIN-OUT] `understanding/pages/organization-hierarchy/Add Client/12-ERROR_STATES.md` — Add Client UX mapping (golden worked example)
- [BRAIN-OUT] `understanding/backend/commerce/FRONTEND_CONTRACT.md` — referenced by every V-rule's FE hint
