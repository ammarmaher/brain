# Identity Service — Validations

> Validators live under `Falcon.Identity.Api/Endpoints/{Auth,Users}/Validators/`. All inherit `AbstractValidator<T>` (FluentValidation) and are auto-discovered by FastEndpoints. Error messages are **FalconKeys.Error.<Code>** constants — they are looked up in `Resources/ErrorMessages.en.resx` and `ErrorMessages.ar.resx` by `ErrorLocalizer` and surfaced as `ServiceOperationResult<object>.Failure(errors)` with HTTP 400.

## Auth Validators

| Validator File | Target DTO | Rules |
|---|---|---|
| `LoginRequestValidator.cs` | `LoginRequest` | `Username`: NotEmpty (RequiredFieldMissing), MaximumLength 100 (MaxLengthExceeded). `Password`: NotEmpty, MinimumLength 6 (BelowMinimumLength). |
| `VerifyOtpRequestValidator.cs` | `VerifyOtpRequest` | Session id + code rules |
| `ResendOtpRequestValidator.cs` | `ResendOtpRequest` | Session id rules |
| `LogoutRequestValidator.cs` | `LogoutRequest` | — |
| `RefreshTokenRequestValidator.cs` | `RefreshTokenRequest` | — |
| `ForgotPasswordRequestValidator.cs` | `ForgotPasswordRequest` | — |
| `ForgotPasswordSetPasswordRequestValidator.cs` | `ForgotPasswordSetPasswordRequest` | Session id + new password rules; password policy delegated to `PasswordPolicy` domain class |
| `SetPasswordRequestValidator.cs` | `SetPasswordRequest` | Same as above |
| `FirstLoginSetupRequestValidator.cs` | `FirstLoginSetupRequest` | Session id + new password rules |

## User Validators

| Validator File | Target DTO | Notable Rules |
|---|---|---|
| `CreateUserRequestValidator.cs` | `CreateUserRequest` | `PersonalInfo` NotNull. FirstName/LastName NotEmpty + MaximumLength 50 + `Matches(LettersOnly)` (FirstNameLettersOnly/LastNameLettersOnly). UserName NotEmpty + Max 100 + `Matches(StartsWithLetter)` (UsernameMustStartWithLetter). `Role` or `RoleKey` must be present (HasRoleSelection). RoleKey must resolve via `UserRolePolicy.GetRoleFromRoleKey(...)` (InvalidValue). DeliveryMethod IsInEnum. |
| `ChangePasswordRequestValidator.cs` | `ChangePasswordRequest` | Password policy via `PasswordPolicy` |
| `ChangeUserStatusRequestValidator.cs` | `ChangeUserStatusRequest` | UserId NotEmpty, NewStatus IsInEnum |
| `ConfirmEmailRequestValidator.cs` | `ConfirmEmailRequest` | Code rules |
| `ConfirmPhoneRequestValidator.cs` | `ConfirmPhoneRequest` | Code rules |
| `GetUserCountRequestValidator.cs` | `GetUserCountRequest` | TenantId NotEmpty (TenantIdRequired) |
| `UpdateUserProfileRequestValidator.cs` | `UpdateUserProfileRequest` | Profile fields validation |
| `UpdateUserRoleByIdRequestValidator.cs` | `UpdateUserRoleByIdRequest` | RoleKey NotEmpty + must resolve |
| `VerifyPasswordRequestValidator.cs` | `VerifyPasswordRequest` | Password NotEmpty |

## Domain-Level Policies (business validation, throws `FalconException`)

These are **not** FluentValidation validators but domain rules applied inside handlers. They throw `FalconException` with `FalconKeys.Error` codes — see [`ERRORS.md`](ERRORS.md).

| Policy | File | Validates |
|---|---|---|
| `PasswordPolicy` | `Domain/Policies/PasswordPolicy.cs` | Password length, uppercase/lowercase/digit/special char requirements (`PasswordRequires*` errors) |
| `UserRolePolicy` | `Domain/Policies/UserRolePolicy.cs` | `RoleKey → eUserRoles` resolution; throws on unknown role |
| `UserStatusTransitionPolicy` | `Domain/Policies/UserStatusTransitionPolicy.cs` | Legal `eUserStatus` transitions; only Falcon user can restore deleted user |
| `UserEditPolicy` | `Domain/Policies/UserEditPolicy.cs` | Blocks edits to users in Suspended / Locked / Deleted status, blocks pending-self-edit |
| `UserQuotaPolicy` | `Domain/Policies/UserQuotaPolicy.cs` | Tenant normal-user-limit enforcement (`NormalUserLimitReached`) |
| `LoginEligibilityPolicy` | `Domain/Policies/LoginEligibilityPolicy.cs` | Allows/denies login based on user status (`UserLocked`, `UserSuspended`, `UserPending`) |
| `VerificationRateLimitPolicy` | `Domain/Policies/VerificationRateLimitPolicy.cs` | OTP/verification cooldown — throws `OtpStillValid`, `OtpResendLimitExceeded` |

## Pre-Processors (FastEndpoints)

| Pre-Processor | Files | Function |
|---|---|---|
| `IpAllowlistPreProcessor<TRequest>` | `Endpoints/Auth/PreProcessors/IpAllowlistPreProcessor.cs` | Resolves tenant id via `IIpAllowlistProtected.TenantResolutionStrategy` (ByUsername / BySessionId) → looks up Redis allowlist → rejects request with HTTP 403 (`IpNotAllowed`) on mismatch. Applied to all `/auth/*` endpoints. |

## Deviations from Platform Standards

- **No `MultiLanguageName(En, Ar)` fields** on Identity DTOs. User profile fields (`FirstName`, `LastName`, etc.) are single-language strings. This is intentional — identity-layer fields are not user-facing translated content.
- Identity ships **its own `ServiceOperationResult<T>` record** in `Application/Models/ServiceOperationResult.cs` rather than depending on a shared contracts project. Three sibling services (Commerce, Charging, Provisioning) each ship their own struct-based version. **Cross-service contract drift** is a real risk — surfaced as a finding for the audit.
