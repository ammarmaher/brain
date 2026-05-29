# UserController — Errors

> Codes from [CODE] `Domain/Constants/FalconKeys.cs`. Raised as `FalconException`, mapped to HTTP
> by `FalconExceptionHandler`, localized en/ar via `ErrorLocalizer`.

## Per-endpoint error catalog

### 1. POST /api/user/ (CreateUser)

| Code                              | HTTP | Source                                          | Notes |
|---|---|---|---|
| `RequiredFieldMissing`            | 400 | Validator                                       | empty PersonalInfo / FirstName / LastName / UserName / Role* |
| `MaxLengthExceeded`               | 400 | Validator                                       | First/Last > 50, UserName > 100 |
| `FirstNameLettersOnly`            | 400 | Validator                                       | regex fail on FirstName |
| `LastNameLettersOnly`             | 400 | Validator                                       | regex fail on LastName |
| `UsernameMustStartWithLetter`     | 400 | Validator                                       | regex fail on UserName |
| `InvalidValue`                    | 400 | Validator                                       | DeliveryMethod out of enum / Role enum invalid / unsupported RoleKey |
| `InvalidRoleForUserType`          | 422 | `UserRolePolicy.IsValid` (handler L35), `UserRolePolicy.GetUserTypeFromRole` | role/user-type mismatch |
| `TenantIdRequired`                | 422 | `UserRolePolicy.ValidateClientUserContext`      | Client role + missing TenantId |
| `NodeIdRequired`                  | 422 | `UserRolePolicy.ValidateClientUserContext`      | Client role + missing NodeId |
| `DuplicateUsername`               | 409 | `CreateUserProcess.cs:46`                       | username already exists (case-insensitive) |
| `NormalUserLimitReached`          | 422 | `UserQuotaPolicy.ValidateNormalUserLimit`       | only on `NormalUser` role |
| `CreateIdentityUserFailed`        | 500 | `CreateUserProcess.cs:70`                       | Zitadel `CreateUser` failure |
| `InvalidImageFile`                | 400 | `ProfileImagePolicy`                            | corrupt base64 / magic-byte mismatch |
| `ExecutableFileNotAllowed`        | 400 | `ProfileImagePolicy`                            | `.exe` etc. uploaded |
| `ImageExtensionNotAllowed`        | 400 | `ProfileImagePolicy`                            | unsupported image format |
| `ProfilePictureSizeExceeded`      | 400 | `ProfileImagePolicy`                            | > 2 MB decoded bytes |

### 2. GET /api/user/me

| Code           | HTTP | Source                            |
|---|---|---|
| `UserNotFound` | 404  | `GetMyProfileEndpoint.cs:22`      |

### 3. GET /api/user/{id}

| Code           | HTTP | Source                                                    |
|---|---|---|
| `UserNotFound` | 404  | `GetUserByIdEndpoint.cs:33` (also for cross-tenant attempt, silent) |

### 4. GET /api/user/ (ListNodeUsers)

| Code             | HTTP | Source                                          | Notes |
|---|---|---|---|
| `NodeIdRequired` | 422  | `ListNodeUsersHandler.ResolveNodeIdAsync (L90)` | Client AccountOwner/NormalUser with neither JWT nor query NodeId |

### 5. PUT /api/user/profile (self-edit)

| Code                          | HTTP | Source                                  | Notes |
|---|---|---|---|
| `MaxLengthExceeded`           | 400  | Validator                               | First/Last > 50 |
| `FirstNameLettersOnly`        | 400  | Validator                               | |
| `LastNameLettersOnly`         | 400  | Validator                               | |
| `UserNotFound`                | 404  | `UpdateUserProfileHandler.cs:24`        | |
| `UserSuspendedCannotEdit`     | 403  | `UserEditPolicy.ValidateForProfileEdit` | |
| `UserLockedCannotEdit`        | 423  | `UserEditPolicy.ValidateForProfileEdit` | |
| `UserDeletedCannotEdit`       | 410  | `UserEditPolicy.ValidateForProfileEdit` | (or 422 — verify with FalconExceptionHandler — uses status code mapping) |
| `PendingSelfEditBlocked`      | 403  | `UserEditPolicy.ValidateForProfileEdit` | self-edit Pending blocked |
| `InvalidImageFile`            | 400  | `ProfileImagePolicy`                    | |
| `ExecutableFileNotAllowed`    | 400  | `ProfileImagePolicy`                    | |
| `ImageExtensionNotAllowed`    | 400  | `ProfileImagePolicy`                    | |
| `ProfilePictureSizeExceeded`  | 400  | `ProfileImagePolicy`                    | |
| `ZitadelUpdateUserProfileFailed` | 502 | `IdentityManager.UpdateUserProfileAsync` | externalSvcError variant |
| `ZitadelUpdateUserPhoneFailed`   | 502 | `IdentityManager.UpdateUserProfileAsync` | |

### 6. PUT /api/user/{id}/profile (admin-edit)

Same as #5 plus:
- `UnauthorizedProfileEdit` (403) — currently NOT raised inside `UpdateUserProfileHandler` for admin-edit path (verify), but listed in error vocab.

### 7. PUT /api/user/{id}/role

| Code                          | HTTP | Source                                  | Notes |
|---|---|---|---|
| `RequiredFieldMissing`        | 400  | Validator                               | empty Id / RoleKey |
| `MaxLengthExceeded`           | 400  | Validator                               | RoleKey > 100 |
| `UserNotFound`                | 404  | `UpdateUserRoleHandler.cs:23`           | |
| `SelfEditRoleNotAllowed`      | 403  | `UserEditPolicy.ValidateForRoleEdit`    | self-edit blocked |
| `UserSuspendedCannotEdit`     | 403  | `UserEditPolicy.ValidateForRoleEdit`    | |
| `UserLockedCannotEdit`        | 423  | `UserEditPolicy.ValidateForRoleEdit`    | |
| `UserDeletedCannotEdit`       | 410  | `UserEditPolicy.ValidateForRoleEdit`    | |
| `UnauthorizedProfileEdit`     | 403  | `UpdateUserRoleHandler.EnsureCallerCanManageUser` | Client cross-tenant attempt |
| `InvalidRoleForUserType`      | 422  | `UserRolePolicy.IsValid` (L32)          | requested role outside user-type set |
| `InvalidRoleForUserType`      | 422  | `UserRolePolicy.GetRoleFromRoleKey`     | unsupported key |

### 8. PUT /api/user/status

| Code                                       | HTTP | Source                                              | Notes |
|---|---|---|---|
| `RequiredFieldMissing`                     | 400  | Validator                                           | empty UserId |
| `InvalidValue`                             | 400  | Validator                                           | NewStatus out of enum |
| `UserNotFound`                             | 404  | `ChangeUserStatusProcess.cs:18`                     | |
| `UserAlreadyInStatus`                      | 422  | `ChangeUserStatusProcess.cs:23`                     | from-to equal |
| `InvalidStatusTransition`                  | 422  | `UserStatusTransitionPolicy.Validate`               | illegal pair |
| `OnlyFalconUserCanRestoreDeletedUser`      | 403  | `UserStatusTransitionPolicy.Validate`               | Deleted→Active by non-Falcon |
| `ZitadelLockUserFailed`                    | 502  | `IIdentityManager.LockUserAsync`                    | Zitadel rejection |
| `ZitadelUnlockUserFailed`                  | 502  | `IIdentityManager.UnlockUserAsync`                  | |
| `ZitadelDeactivateUserFailed`              | 502  | `IIdentityManager.DeactivateUserAsync`              | |
| `ZitadelReactivateUserFailed`              | 502  | `IIdentityManager.ReactivateUserAsync`              | |

### 9. PUT /api/user/change-password

| Code                          | HTTP | Source                                  |
|---|---|---|
| `RequiredFieldMissing`        | 400  | Validator                               |
| `BelowMinimumLength`          | 400  | Validator                               |
| `PasswordsDoNotMatch`         | 400  | Validator                               |
| `UserNotFound`                | 404  | `ChangePasswordHandler.cs:21`           |
| `PasswordTooShort` + family   | 422  | `PasswordPolicy.Validate`               |
| `ChangePasswordFailed`        | 422  | `IIdentityManager.ChangePasswordAsync`  |

### 10. POST /api/user/verify-password

| Code               | HTTP | Source                              |
|---|---|---|
| `RequiredFieldMissing` | 400 | Validator                       |
| `UserNotFound`     | 404  | `VerifyPasswordHandler.cs:16`       |
| `InvalidPassword`  | 422  | `VerifyPasswordHandler.cs:20`       |

### 11. POST /api/user/generate-password

| Code | HTTP | Notes |
|---|---|---|
| Validation errors only | 400 | `PasswordSecurityLevel` out of enum range |

### 12. POST /api/user/exist

| Code                       | HTTP | Source                              |
|---|---|---|
| `InvalidUserExistQuery`    | 400  | `UserExistEndpoint.cs:23`           |

### 13. GET /api/user/count

| Code                       | HTTP | Source                              |
|---|---|---|
| `RequiredFieldMissing`     | 400  | Validator (TenantId empty)          |

### 14. GET /api/user/by-tenant

No documented error other than transport (401 if JWT missing).

### 15. POST /api/user/me/verify-email

| Code                          | HTTP | Source                                              |
|---|---|---|
| `UserNotFound`                | 404  | `RequestEmailVerificationHandler.cs:30`             |
| `EmailAlreadyVerified`        | 422  | `RequestEmailVerificationHandler.cs:37` (no body + already verified) |
| `EmailVerificationFailed`     | 422  | `RequestEmailVerificationHandler.cs:39` (no body + no current email) |
| `OtpStillValid`               | 429  | `VerificationRateLimitPolicy.Validate`              |
| `OtpResendLimitExceeded`      | 429  | `VerificationRateLimitPolicy.Validate`              |

### 16. POST /api/user/me/verify-email/resend

| Code           | HTTP | Source                                      |
|---|---|---|
| `UserNotFound` | 404  | `ResendEmailVerificationHandler.cs:29`      |

### 17. POST /api/user/me/verify-email/confirm

| Code                          | HTTP | Source                                              |
|---|---|---|
| `RequiredFieldMissing`        | 400  | Validator                                           |
| `UserNotFound`                | 404  | `ConfirmEmailVerificationHandler.cs:20`             |
| `InvalidVerificationCode`     | 422  | (from `IdentityManager.VerifyEmailCodeAsync`)       |
| `VerificationCodeExpired`     | 422  | (from `IdentityManager.VerifyEmailCodeAsync`)       |

### 18-20. Phone verification trio

Mirror image of email trio with `PhoneAlreadyVerified`, `PhoneVerificationFailed`.

## Silent-deny / cross-tenant lookup

- `GET /api/user/{id}` for a Client caller looking at a user in another tenant → returns
  `UserNotFound` (HTTP 404), not `Forbidden`. This prevents tenant enumeration.
- `ListNodeUsersHandler` silently scopes tenant for Client callers; the request's `TenantId`
  is ignored without raising an error (per the handler comments).

## HTTP status mapping reference

Same as AuthController plus the user-specific additions:

| Status | New codes (UserController-specific)                                                                                                        |
|---|---|
| 400 | `DuplicateUsername`* (actually 409), `InvalidUserExistQuery`, `InvalidImageFile`, `ExecutableFileNotAllowed`, `ImageExtensionNotAllowed`, `ProfilePictureSizeExceeded` |
| 403 | `UserSuspendedCannotEdit`, `PendingSelfEditBlocked`, `SelfEditRoleNotAllowed`, `OnlyFalconUserCanRestoreDeletedUser`, `UnauthorizedProfileEdit` |
| 404 | `UserNotFound` |
| 409 | `DuplicateUsername`, `DuplicateValue`, `UserAlreadyExists` |
| 410 | `UserDeletedCannotEdit` |
| 422 | `InvalidStatusTransition`, `UserAlreadyInStatus`, `NormalUserLimitReached`, `InvalidRoleForUserType`, `TenantIdRequired`, `NodeIdRequired`, `ChangePasswordFailed`, `InvalidPassword`, password-policy family, `EmailAlreadyVerified`, `PhoneAlreadyVerified`, `EmailVerificationFailed`, `PhoneVerificationFailed`, `InvalidVerificationCode`, `VerificationCodeExpired` |
| 423 | `UserLockedCannotEdit` |
| 429 | `OtpStillValid`, `OtpResendLimitExceeded` |
| 500 | `CreateIdentityUserFailed`, `GetIdentityUserFailed` |
| 502 | `Zitadel*Failed` family (every external service call has a specific code) |

(*Verify `DuplicateUsername` returns 409 — `FalconExceptionHandler` mapping should encode this.)
