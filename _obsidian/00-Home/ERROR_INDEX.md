---
type: hub
hub: error
created: 2026-05-15
---
*** Error Index — graph hub ***
*** Created 2026-05-15 by Brain SK Phase 3D ***

# Error Index

> Brain Outputs holds the master catalog of every `FalconKeys.Error.*` code across the 9 backend services. This note holds the graph.
>
> **Source of truth:** [`Brain Outputs/understanding/integration/errors/CATALOG.md`](../../../Brain%20Outputs/understanding/integration/errors/CATALOG.md). Per-code notes live at [`Brain Outputs/understanding/integration/errors/<code>.md`](../../../Brain%20Outputs/understanding/integration/errors/).

## 🔍 Live queries (Dataview)

_If Dataview plugin is installed, queries return live results._

### All individual error-code notes

```dataview
TABLE http-status, throwing-services, v-rule-linked, cross-service FROM ""
WHERE type = "error-code"
SORT file.name ASC
```

### Errors with V-rule triangulation

```dataview
LIST FROM ""
WHERE type = "error-code" AND v-rule-linked = true
SORT file.name ASC
```

### Cross-service error codes

```dataview
LIST FROM ""
WHERE type = "error-code" AND cross-service = true
SORT file.name ASC
```

## Summary

- **Distinct error codes:** 233
- **Services contributing:** 9 (`commerce` · `charging` · `provisioning` · `identity` · `templates` · `contact-group` · `access` · `core-gateway` · `system-gateway`)
- **Cross-service codes:** 24 core platform codes appear in ≥ 2 services (e.g. `RequiredFieldMissing`, `MaxLengthExceeded`, `Unauthorized`, `DuplicateTenantName`, `DuplicateUsername`, `UserLocked`, `InsufficientBalance`'s sibling pattern)
- **Per-code individual notes catalogued in `errors/`:** 40 of the highest-cited codes

## Per-service error catalog (Brain Outputs)

| Service | ERRORS.md | Notes |
|---|---|---|
| [[Commerce Service]] | [ERRORS](../../../Brain%20Outputs/understanding/backend/commerce/ERRORS.md) | The only service that decorates every code with `[ErrorHttpStatus(NNN)]`. Largest catalog (~130 codes). |
| [[Charging Service]] | [ERRORS](../../../Brain%20Outputs/understanding/backend/charging/ERRORS.md) | No `[ErrorHttpStatus]` — middleware infers status. 16 wallet/charging codes + idempotency `AlreadyApplied` pattern. |
| [[Provisioning Service]] | [ERRORS](../../../Brain%20Outputs/understanding/backend/provisioning/ERRORS.md) | Smallest catalog — 7 codes. Narrow responsibility: catalog lookups, visibility transitions, authorization. |
| [[Identity Service]] | [ERRORS](../../../Brain%20Outputs/understanding/backend/identity/ERRORS.md) | Largest specialty catalog (Zitadel adapter has 33 codes). User lifecycle owner. |
| [[Templates Service]] | [ERRORS](../../../Brain%20Outputs/understanding/backend/templates/ERRORS.md) | 15 codes — heavy on Maker/Checker level integrity (8 codes for sequential 1..N levels). |
| [[Contact Group Service]] | [ERRORS](../../../Brain%20Outputs/understanding/backend/contact-group/ERRORS.md) | Upload session lifecycle (5 codes), file validation, hierarchy scope, Identity-as-downstream errors. |
| [[Access PES Service]] | [ERRORS](../../../Brain%20Outputs/understanding/backend/access/ERRORS.md) | **No `FalconException` / `FalconKeys`** — raw `Results.BadRequest({ error })` / `Results.Forbid()`. FE cannot pattern-match on codes. |
| [[Core Gateway Service]] | [ERRORS](../../../Brain%20Outputs/understanding/backend/core-gateway/ERRORS.md) | Pass-through forwarding of downstream `ServiceOperationResult.Failure`. Shares IP-allowlist constants with Commerce. |
| [[System Gateway Service]] | [ERRORS](../../../Brain%20Outputs/understanding/backend/system-gateway/ERRORS.md) | Two custom gateway-emitted codes (`TestingChargingDisabled`, `IdentityTenantIdMissing`) outside any `FalconKeys` catalog. |

## Per-PRD error breakdown (downstream → user-facing)

| PRD | Primary services | High-traffic codes |
|---|---|---|
| [[01 Account Management]] | Commerce · Charging · Provisioning · Identity | `DuplicateTenantName`, `AccountNameRequired`, `AccountNameTooLong`, `MaxNodeLevelReached`, `NormalUserLimitReached`, `InvalidAccountLimits`, `RootNodeDeletionNotAllowed`, `MainNodeOnlyOperation` |
| [[02 User Management]] | Identity · Access | `DuplicateUsername`, `UsernameMustStartWithLetter`, `FirstNameLettersOnly`, `LastNameLettersOnly`, `UserLocked` (423), `IpNotAllowed`, `InvalidCredentials`, `PasswordTooShort` + complexity codes, `PasswordsDoNotMatch`, `OtpStillValid` (429) |
| [[03 Contract Packaging Charging Billing]] | Commerce · Charging | `InsufficientBalance`, `InvalidTransferWallets`, `NoApplicableRate`, `WalletVersionConflict`, `ReservationNotFound`, `ContractEditOnlyAllowedWhenPending`, `EffectiveDateMustBeInFuture`, `PriceValueNotConfigured`, `HiddenProductMustNotHavePricing` |
| [[04 Contact Group Management]] | Contact-Group · Access | `ContactGroupNameRequired`, `ContactGroupNameInvalidFormat`, `InvalidFileType`, `FileSizeExceeded`, `FileEmpty`, `NoDataRows`, `FileParseError`, `ImportTooLarge`, `UploadSessionExpired`, `UploadSessionNotReady`, `ForbiddenToDeleteContactGroup` |
| [[05 Templates]] | Templates | `CheckerLevelsRequired`, `LevelsCountRequiredForRestricted`, `CheckerLevelMustHaveAtLeastOneUser`, `CheckerLevel1RequiredBeforeLevel2`, `DuplicateCheckerLevelNumber`, `UserAssignedToMultipleCheckerLevels`, `LevelsCountMismatch`, `InvalidCheckerLevelNumber` |

## Cross-link summary

### Linked V-rules

Triangulated rules with explicit error codes (15 of 25 V-rules):

- [[V-account-name-format-uniqueness]] → `AccountNameRequired`, `MaxLengthExceeded`, `AccountNameTooLong`, `DuplicateTenantName`, `RequiredFieldMissing`
- [[V-password-security-level-enum]] → `InvalidValue`
- [[V-account-ip-allowlist-enforcement]] → `IpNotAllowed`, `InvalidIpAddress`
- [[V-account-limits-zero-means-no-limit]] → `InvalidAccountLimits`, `MaxNodeLevelReached`, `NormalUserLimitReached`
- [[V-service-visibility-pricing-required]] → `PriceValueNotConfigured`, `HiddenProductMustNotHavePricing`, `ActivationNotAllowedForHiddenProduct`
- [[V-user-first-last-name-letters-only]] → `FirstNameLettersOnly`, `LastNameLettersOnly`
- [[V-username-format-uniqueness-immutable]] → `UsernameMustStartWithLetter`, `DuplicateUsername`
- [[V-normal-user-limit-enforcement]] → `NormalUserLimitReached`
- [[V-login-lockout-3-wrong-attempts]] → `UserLocked` (423), `InvalidCredentials`
- [[V-password-complexity-per-security-level]] → `InvalidPassword`, `PasswordTooShort`, `PasswordRequiresUppercase`, `PasswordRequiresLowercase`, `PasswordRequiresDigit`, `PasswordRequiresSpecialChar`, `PasswordsDoNotMatch`, `ChangePasswordFailed`
- [[V-contract-expiration-after-start]] → `EffectiveDateMustBeInFuture`
- [[V-contract-edit-status-aware-fields]] → `ContractEditOnlyAllowedWhenPending`
- [[V-charging-insufficient-balance]] → `InsufficientBalance`
- [[V-charging-transfer-source-destination]] → `InvalidTransferWallets`, `InvalidWalletIdentity`
- [[V-charging-no-applicable-rate]] → `NoApplicableRate`
- [[V-contact-group-file-type-allowlist]] → `InvalidFileType`
- [[V-contact-group-file-size-cap]] → `InvalidFileSize`, `FileSizeExceeded`
- [[V-contact-group-name-required-format]] → `ContactGroupNameRequired`, `ContactGroupNameInvalidFormat`
- [[V-template-checker-level-integrity]] → 8 bundled codes (`CheckerLevelsRequired`, `CheckerLevelMustHaveAtLeastOneUser`, `CheckerLevel1RequiredBeforeLevel2`, `CheckerLevelLimitExceeded`, `DuplicateCheckerLevelNumber`, `UserAssignedToMultipleCheckerLevels`, `InvalidCheckerLevelNumber`, `LevelsCountMismatch`)
- [[V-template-levels-count-required-for-restricted]] → `LevelsCountRequiredForRestricted`, `CheckerLevelsRequired`

### Cross-service code overlaps (24)

`RequiredFieldMissing` · `MaxLengthExceeded` · `BelowMinimumLength` · `NoChangesToUpdate` · `Unauthorized` · `Forbidden` · `UnauthorizedAction` · `UnauthorizedUserToPerformThisAction` · `UnauthorizedAccess` · `DuplicateTenantName` · `DuplicateUsername` · `DuplicateValue` · `UserNotFound` · `UserAlreadyExists` · `UserAlreadyInStatus` · `UserLocked` · `UserSuspended` · `UserPending` · `InvalidCredentials` · `InvalidRefreshToken` · `InvalidPassword` · `InvalidStatusTransition` · `InvalidRoleForUserType` · `InvalidUserExistQuery` (+ generic infra & Zitadel families that appear in both Commerce and Identity).

## Honest drift / gaps

- **Identity username length** — PRD-02 says `≤30`; Identity FluentValidation says `MaximumLength(100)`. Code `UsernameMustStartWithLetter` enforces the prefix rule but not the length cap.
- **Account Name letter-prefix** — PRD requires it; no regex on Commerce DTO. Either delegated to handler or unenforced. `AccountNameRequired` + `MaxLengthExceeded` are the only documented codes.
- **Account Limits per-field** — `MaxNormalUserLimit` and friends have no per-field codes. Only handler-level `InvalidAccountLimits` (422) — FE can't point to a specific field.
- **Charging currency enum** — Commerce binds `eCurrency` with `[EnumDataType]`; Charging same field has no enum binding. No `InvalidCurrency` code in Charging catalog.
- **Contact Group share policy** — silent drop instead of explicit `InvalidShareMode` code.
- **Contact Group column name shape** — generic codes only; no `ContactGroupColumnInvalidFormat`.
- **PES error catalog absent** — Access (PES) does not use `FalconException`. FE cannot pattern-match.
- **Gateway-emitted codes outside `FalconKeys`** — `TestingChargingDisabled`, `IdentityTenantIdMissing` need either gateway-side localization or FE hard-codes.
- **No inter-service code propagation** — Commerce → Identity HTTP failure becomes `ExternalServiceError` (500); original code is lost.

## Tags

#type/index #prd/01 #prd/02 #prd/03 #prd/04 #prd/05 #service/access #service/charging #service/commerce #service/contact-group #service/core-gateway #service/identity #service/provisioning #service/system-gateway #service/templates #drift #security

## Hubs

- [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]] · [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]]
