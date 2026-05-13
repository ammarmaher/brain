# Identity Service — DTO Dictionary

> Located under `Falcon.Identity.Api/Application/{Auth,Users,Security}/Models/`. Identity uses record types extensively.

## Request DTOs

| Name | Direction | Fields | Used by |
|---|---|---|---|
| `LoginRequest` | request | `string Username`, `string Password` | `POST /auth/login` |
| `VerifyOtpRequest` | request | `string SessionId`, `string Code` | `POST /auth/verify-otp` |
| `ResendOtpRequest` | request | `string SessionId` | `POST /auth/resend-otp` |
| `ForgotPasswordRequest` | request | `string Username`, `string PhoneNumber`, `eDeliveryMethod DeliveryMethod` | `POST /auth/forgot-password` |
| `ForgotPasswordSetPasswordRequest` | request | `string SessionId`, `string NewPassword` | `POST /auth/forgot-password/set-password` |
| `SetPasswordRequest` | request | (record) | `POST /auth/set-password` |
| `FirstLoginSetupRequest` | request | `string SessionId`, `string NewPassword` | `POST /auth/first-login` |
| `LogoutRequest` | request | (record) | `POST /auth/logout` |
| `RefreshTokenRequest` | request | (record) | `POST /auth/refresh-token` |
| `CreateUserRequest` | request | record: `UserPersonalInformation PersonalInfo, string PermissionGroupId, eDeliveryMethod DeliveryMethod, string? RoleKey, eUserRoles? Role, string? TenantId, string? NodeId, string? Path` | `POST /user` (note: no FastEndpoints route observed for it — request DTO present, see Validators) |
| `UserPersonalInformation` | nested | record: `FirstName, LastName, UserName, NationalId, PhoneNumber, Email, ProfilePictureInfo` | `CreateUserRequest` |
| `ProfilePictureInfo` | nested | record: `string? Extension`, `string? FileBase64String` | `CreateUserRequest`, profile updates |
| `UpdateUserProfileRequest` | request | (record) | `PUT /user/profile` |
| `UpdateUserProfileByIdRequest` | request | (record) | `PUT /user/{id}/profile` |
| `UpdateUserRoleByIdRequest` | request | `string Id`, `string RoleKey` | `PUT /user/{id}/role` |
| `ChangeUserStatusRequest` | request | `string UserId`, `eUserStatus NewStatus` | `PUT /user/status` |
| `ChangePasswordRequest` | request | (record) | `PUT /user/change-password` |
| `VerifyPasswordRequest` | request | (record) | `POST /user/verify-password` |
| `VerifyEmailRequest` | request | optional `string? Email` | `POST /user/me/verify-email` |
| `VerifyPhoneRequest` | request | optional `string? PhoneNumber` | `POST /user/me/verify-phone` |
| `ConfirmEmailRequest` | request | (record) | `POST /user/me/verify-email/confirm` |
| `ConfirmPhoneRequest` | request | (record) | `POST /user/me/verify-phone/confirm` |
| `GeneratePasswordRequest` | request | `ePasswordSecurityLevel PasswordSecurityLevel` | `POST /user/generate-password` |
| `UserExistRequest` | request | `string Username` | `POST /user/exist` |
| `ListNodeUsersRequest` | request | `string? NodeId, string? Search, List<eUserStatus>? Status, List<eUserRoles>? Role, string? TenantId, string? PathPrefix, int PageNumber=1, int PageSize=20, bool IncludeDeleted, bool ExcludeCurrentUser, bool IgnoreNodeIdFilter` | `GET /user/` |
| `ListTenantUsersRequest` | request | `string TenantId, string? PathPrefix, eUserRoles? ExcludeRole` | `GET /user/by-tenant` (east-west) |
| `GetUserCountRequest` | request | `string TenantId, List<eUserRoles>? Roles` | `GET /user/count` (east-west) |
| `GetUserByIdRequest` | request | `string Id, bool IncludeDeleted` | `GET /user/{id}` |
| `CheckUserStatusRequest` | request | `string IdentityUserId` | `GET /security/user-status/{IdentityUserId}` |
| `PrimaryRoleLinkSyncRequest` | request | n/a (PES integration; deprecated path) | — |
| `CreateIdentityUserRequest` | internal | — | infra layer for Zitadel calls |

## Response DTOs

| Name | Direction | Fields | Used by |
|---|---|---|---|
| `ServiceOperationResult<T>` | wrapper | record: `bool IsSuccessful, T? Result, List<string> ErrorMessages` | Every endpoint |
| `LoginStepResponse` | response | `string? SessionId, eAuthenticationStage Stage, bool RequiresOtp, bool RequiresPasswordChange, int? OtpCodeLength, int? OtpExpiresInSeconds, AuthenticatedResult? Tokens, string? DevOtpCode` | Auth flow endpoints |
| `AuthenticatedResult` | response | tokens (access, id, refresh) — populated only when Stage == Authenticated | Refresh-token + login |
| `UserResponse` | response | `Id, NodeId, FirstName, LastName, Username, Email, PhoneNumber, eUserRoles Role, string RoleKey, eUserType UserType, eUserStatus Status, string PermissionGroup, TenantId, Image, DateTime CreatedAt, string? CreatedBy, bool IsPhoneVerified, bool IsEmailVerified, string? Path` | `GET /user/me`, `GET /user/{id}` |
| `UserInfoResponse` | response | lightweight version used in list pages | `ListNodeUsersResponse` |
| `TenantUserDto` | response | `Id, NodeId, FirstName, LastName, Path` | `ListTenantUsersEndpoint` (east-west) |
| `CreateUserResponse` | response | — | `CreateUserEndpoint` |
| `UpdateUserProfileResult` | response | — | profile update endpoints |
| `UserListResponse` | response | wraps paged response | listing endpoints |
| `PagedResponse<T>` | response | record: `List<T> Items, long TotalCount, int PageNumber, int PageSize` | listing endpoints |
| `VerificationCodeResponse` | response | session/code metadata | email/phone verify endpoints |
| `ExistResponse` | response | `record(bool Exists)` | `UserExistEndpoint` |
| `GeneratePasswordResponse` | response | `record(string Password)` | `GeneratePasswordEndpoint` |
| `UserStatusResponse` | response | `record(string UserId, eUserStatus Status, bool IsActive)` | `CheckUserStatusEndpoint` |
| `PasswordVerificationResult` | internal | — | infrastructure |
| `PasswordChangeResult` | internal | — | infrastructure |
| `OtpVerificationResult` | internal | — | infrastructure |
| `ResendOtpResult` | internal | — | infrastructure |
| `CreateIdentityUserResult` | internal | — | Zitadel adapter |
| `TokenResult` | internal | — | Zitadel token exchange |
| `AuthenticationSession` | internal | persisted session record | login flow state machine |
| `VerificationSession` | internal | persisted verification session | email/phone flow state machine |

## Enum Vocabulary (consumed by clients)

- `eUserStatus` — Active / Pending / Locked / Suspended / Deleted (numeric values used in `?Status=2&Status=3` query params)
- `eUserRoles` — internal role enumeration; canonical role identifier is the **string `RoleKey`** going forward (per `UserRolePolicy.GetRoleFromRoleKey(...)`)
- `eUserType` — Falcon / Client (drives tenant-scoping decisions in handlers)
- `eDeliveryMethod` — Email / Sms / etc. (drives OTP delivery)
- `eAuthenticationStage` — InProgress / OtpRequired / PasswordChangeRequired / Authenticated
- `ePasswordSecurityLevel` — Low / Medium / High / Strict (drives `GeneratePasswordEndpoint` output policy)
