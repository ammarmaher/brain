# Identity Service — Error Catalog

> Source-of-truth: `Falcon.Identity.Api/Domain/Constants/FalconKeys.cs` (the `Error` nested class).
> Errors are raised as `throw new FalconException(FalconKeys.Error.<Code>)`. The exception carries one or more `Error` records with `{ Code, Message }`. Localization is done by `ErrorLocalizer.Localize(code)` reading `Resources/ErrorMessages.en.resx` and `ErrorMessages.ar.resx`. Default HTTP status code is 400 (overridden by middleware for specific codes).

## User Lifecycle Errors

| Code | Notes |
|---|---|
| `UserNotFound` | 404 — user does not exist or has been soft-deleted (and caller is not Falcon) |
| `DuplicateUsername` | 409 — username already in use (case-insensitive) |
| `DuplicateValue` | 409 — generic uniqueness violation |
| `InvalidUserExistQuery` | 400 — empty `Username` on `/user/exist` |
| `InvalidPassword` | 422 — password fails policy |
| `PasswordTooShort` | 422 |
| `PasswordRequiresUppercase` | 422 |
| `PasswordRequiresLowercase` | 422 |
| `PasswordRequiresDigit` | 422 |
| `PasswordRequiresSpecialChar` | 422 |
| `CreateIdentityUserFailed` | 500 — Zitadel create-user call failed |
| `GetIdentityUserFailed` | 500 — Zitadel lookup failed |
| `InvalidRoleForUserType` | 422 — role/user-type mismatch |
| `FalconUserMustNotHaveTenantId` | 422 — Falcon-only user has a tenant id (data anomaly) |

## User Edit Rules

| Code | Notes |
|---|---|
| `UserSuspendedCannotEdit` | 403 |
| `UserLockedCannotEdit` | 423 |
| `UserDeletedCannotEdit` | 410 |
| `PendingSelfEditBlocked` | 403 — pending users cannot edit their own profile |
| `SelfEditRoleNotAllowed` | 403 |

## Profile Errors

`UnauthorizedProfileEdit`, `ZitadelUpdateUserProfileFailed`, `ZitadelUpdateUserPhoneFailed`, `ProfilePictureSizeExceeded`, `ImageExtensionNotAllowed`, `ExecutableFileNotAllowed`, `FileSizeExceeded`, `NoChangesToUpdate`.

## Verification Errors

`PhoneVerificationFailed`, `EmailVerificationFailed`, `InvalidVerificationCode`, `PhoneAlreadyVerified`, `EmailAlreadyVerified`, `VerificationCodeExpired`.

## User Status Errors

`InvalidStatusTransition`, `NormalUserLimitReached`, `UserAlreadyInStatus`, `OnlyFalconUserCanRestoreDeletedUser`.

## Authentication Errors

`InvalidCredentials`, `Unauthorized`, `Forbidden`, `UserAlreadyExists`, `UserLocked`, `UserSuspended`, `UserPending`, `UserNotInitialized`, `ServiceUnavailable`, `UnknownError`, `OtpStillValid` (429), `OtpResendLimitExceeded`, `OtpNotReady`, `OtpAlreadyConfigured`, `InvalidRefreshToken`, `ChangePasswordFailed`, `InvalidUsernameOrPhone`, `PasswordsDoNotMatch`.

## Zitadel Adapter Errors

`ZitadelLoginClientTokenNotConfigured`, `ZitadelGetOrganizationFailed`, `ZitadelOrganizationNotFound`, `ZitadelCreateProjectFailed`, `ZitadelSearchUserFailed`, `ZitadelAdminUserNotFound`, `ZitadelFalconProjectIdNotConfigured`, `ZitadelAlreadyInitialized`, `ZitadelLockUserFailed`, `ZitadelUnlockUserFailed`, `ZitadelDeactivateUserFailed`, `ZitadelReactivateUserFailed`, `ZitadelSetAdminMetadataFailed`, `ZitadelDeleteUserFailed`, `ZitadelSearchUsersFailed`, `ZitadelTokenIntrospectionFailed`, `ZitadelTokenRevocationFailed`, `ZitadelGetUserInfoFailed`, `ZitadelEndSessionFailed`, `ZitadelRemoveOtpFailed`, `ZitadelRegisterOtpFailed`, `ZitadelRegisterTotpFailed`, `ZitadelRemovePhoneFailed`, `ZitadelRemoveEmailFailed`, `ZitadelGetPasswordPolicyFailed`, `ZitadelSetPasswordPolicyFailed`, `ZitadelGetLoginPolicyFailed`, `ZitadelSetLoginPolicyFailed`, `ZitadelListSessionsFailed`, `ZitadelDeleteSessionFailed`, `ZitadelDeleteMetadataFailed`, `ZitadelGetSessionFailed`.

## Validation Errors

`MaxLengthExceeded`, `BelowMinimumLength`, `RequiredFieldMissing`, `InvalidValue`, `FirstNameLettersOnly`, `LastNameLettersOnly`, `UsernameMustStartWithLetter`, `InvalidImageFile`, `TenantIdRequired`, `NodeIdRequired`.

## Authorization Errors

`UnauthorizedUserToPerformThisAction`, `UnauthorizedAction`.

## External Service Errors

`ExternalServiceError`, `ExternalServiceConnectionError`, `ExternalServiceTimeout`.

## Settings Errors

`SettingsNotFound`.

## IP Allowlist Errors

`IpNotAllowed`.

## Generic

`InternalServerError`.

## Exception Type

```csharp
public class FalconException : Exception
{
    public IReadOnlyList<Error> Errors { get; }
    public FalconException(string code, string? message = null);
    public FalconException(IEnumerable<Error> errors);
}
```

Defined in `Domain/Exceptions/FalconException.cs` (current service; deprecated service has the same shape).
Exceptions are converted to responses by `Startup/ExceptionHandlers/FalconExceptionHandler.cs` and `Startup/ExceptionHandlers/GlobalExceptionHandler.cs` (path patterns derived from deprecated service — confirm the equivalents in the current service if you need a deep dive).
