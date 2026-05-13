# Identity Service — Endpoint Registry

> All routes are prefixed with `/api` by the FastEndpoints route prefix.
> Each endpoint returns `ServiceOperationResult<T>`.

## Authentication Endpoints (`/api/auth/*`)

All endpoints in this group are `AllowAnonymous`, throttled, and pass through `IpAllowlistPreProcessor` for IP allowlist enforcement keyed by username or session id.

| Method | Route | Handler | Request DTO | Response DTO | Throttle | Tenant Resolution |
|---|---|---|---|---|---|---|
| POST | `/api/auth/login` | `LoginEndpoint.HandleAsync` | `LoginRequest(Username, Password)` | `LoginStepResponse` | 10/60s | by username |
| POST | `/api/auth/verify-otp` | `VerifyOtpEndpoint.HandleAsync` | `VerifyOtpRequest(SessionId, Code)` | `LoginStepResponse` | 10/60s | by sessionId |
| POST | `/api/auth/resend-otp` | `ResendOtpEndpoint.HandleAsync` | `ResendOtpRequest(SessionId)` | `LoginStepResponse` | 5/60s | by sessionId |
| POST | `/api/auth/forgot-password` | `ForgotPasswordEndpoint.HandleAsync` | `ForgotPasswordRequest(Username, PhoneNumber, DeliveryMethod)` | `LoginStepResponse` | 5/60s | by username |
| POST | `/api/auth/forgot-password/set-password` | `ForgotPasswordSetPasswordEndpoint.HandleAsync` | `ForgotPasswordSetPasswordRequest(SessionId, NewPassword)` | `bool` | 5/60s | by sessionId |
| POST | `/api/auth/set-password` | `SetPasswordEndpoint.HandleAsync` | `SetPasswordRequest` | `bool` | 5/60s | by sessionId |
| POST | `/api/auth/first-login` | `FirstLoginSetupEndpoint.HandleAsync` | `FirstLoginSetupRequest(SessionId, NewPassword)` | `LoginStepResponse` | 5/60s | by sessionId |
| POST | `/api/auth/logout` | `LogoutEndpoint.HandleAsync` | `LogoutRequest` | `object` (null) | 10/60s | (none) |
| POST | `/api/auth/refresh-token` | `RefreshTokenEndpoint.HandleAsync` | `RefreshTokenRequest` | `AuthenticatedResult` (tokens) | 20/60s | (none) |

## User Endpoints (`/api/user/*`)

All endpoints require authorization unless flagged otherwise. `currentUser` is injected from JWT.

| Method | Route | Handler | Request DTO | Response DTO | Notes |
|---|---|---|---|---|---|
| GET | `/api/user/me` | `GetMyProfileEndpoint.HandleAsync` | (none) | `UserResponse` | Reads own profile by `currentUser.UserId`. |
| PUT | `/api/user/profile` | `UpdateMyProfileEndpoint.HandleAsync` | `UpdateUserProfileRequest` | `UpdateUserProfileResult` | Updates own profile. |
| PUT | `/api/user/change-password` | `ChangePasswordEndpoint.HandleAsync` | `ChangePasswordRequest` | `object` (null) | Revokes all sessions on success. |
| POST | `/api/user/verify-password` | `VerifyPasswordEndpoint.HandleAsync` | `VerifyPasswordRequest` | `bool` | Verifies current password (for sensitive actions). |
| POST | `/api/user/generate-password` | `GeneratePasswordEndpoint.HandleAsync` | `GeneratePasswordRequest(PasswordSecurityLevel)` | `GeneratePasswordResponse(Password)` | **Anonymous** (overrides group policy). |
| POST | `/api/user/exist` | `UserExistEndpoint.HandleAsync` | `UserExistRequest(Username)` | `ExistResponse(Exists)` | Case-insensitive username uniqueness check. |
| GET | `/api/user/` | `ListNodeUsersEndpoint.HandleAsync` | `ListNodeUsersRequest(NodeId, TenantId, Search, Status[], Role[], PathPrefix, PageNumber, PageSize, IncludeDeleted, ExcludeCurrentUser, IgnoreNodeIdFilter)` | `PagedResponse<UserInfoResponse>` | Tenant-scoping enforced from JWT for client users; Falcon users can pass `TenantId`. |
| GET | `/api/user/count` | `GetUserCountEndpoint.HandleAsync` | `GetUserCountRequest(TenantId, Roles[])` | `long` | **East-west** call by other services. |
| GET | `/api/user/by-tenant` | `ListTenantUsersEndpoint.HandleAsync` | `ListTenantUsersRequest(TenantId, PathPrefix, ExcludeRole)` | `List<TenantUserDto>` | **East-west** — used by Gateways for hierarchy enrichment. |
| GET | `/api/user/{id}` | `GetUserByIdEndpoint.HandleAsync` | `GetUserByIdRequest(Id, IncludeDeleted)` | `UserResponse` | Falcon users can include deleted; client users get tenant-scoped lookup. |
| PUT | `/api/user/{id}/profile` | `UpdateUserProfileByIdEndpoint.HandleAsync` | `UpdateUserProfileByIdRequest` | `UpdateUserProfileResult` | Admin-action variant. |
| PUT | `/api/user/{id}/role` | `UpdateUserRoleByIdEndpoint.HandleAsync` | `UpdateUserRoleByIdRequest(Id, RoleKey)` | `bool` | |
| PUT | `/api/user/status` | `ChangeUserStatusEndpoint.HandleAsync` | `ChangeUserStatusRequest(UserId, NewStatus)` | `object` (null) | Drives `eUserStatus` (Active / Locked / Suspended / Deleted). |
| POST | `/api/user/me/verify-email` | `RequestEmailVerificationEndpoint.HandleAsync` | `VerifyEmailRequest(Email)` (body optional) | `VerificationCodeResponse` | If body has new email → verify-before-save flow; else resend for current. |
| POST | `/api/user/me/verify-email/resend` | `ResendEmailVerificationEndpoint.HandleAsync` | (none) | `VerificationCodeResponse` | |
| POST | `/api/user/me/verify-email/confirm` | `ConfirmEmailVerificationEndpoint.HandleAsync` | `ConfirmEmailRequest` | `bool` | |
| POST | `/api/user/me/verify-phone` | `RequestPhoneVerificationEndpoint.HandleAsync` | `VerifyPhoneRequest(PhoneNumber)` (body optional) | `VerificationCodeResponse` | |
| POST | `/api/user/me/verify-phone/resend` | `ResendPhoneVerificationEndpoint.HandleAsync` | (none) | `VerificationCodeResponse` | |
| POST | `/api/user/me/verify-phone/confirm` | `ConfirmPhoneVerificationEndpoint.HandleAsync` | `ConfirmPhoneRequest` | `bool` | |

## Security Endpoints (`/api/security/*`)

| Method | Route | Handler | Request DTO | Response DTO | Auth |
|---|---|---|---|---|---|
| GET | `/api/security/user-status/{IdentityUserId}` | `CheckUserStatusEndpoint.HandleAsync` | `CheckUserStatusRequest(IdentityUserId)` | `UserStatusResponse(UserId, Status, IsActive)` | **Anonymous** — east-west cache-backed lookup. |

## Webhook Endpoints (`/api/webhook/*`)

| Method | Route | Handler | Request DTO | Response DTO | Auth |
|---|---|---|---|---|---|
| POST | `/api/webhook/zitadel` | `ZitadelWebhookEndpoint.HandleAsync` | raw body + `x-zitadel-signature` header | `object` (null) | **Anonymous** + HMAC signature verification via `ZitadelWebhookSignatureVerifier.Verify(signingKey, signature, body)`. Updates user status in Mongo on `UserLocked/Unlocked/Deactivated/Reactivated/EmailVerified/PhoneVerified` events. |

## Health Endpoints

| Method | Route | Source |
|---|---|---|
| GET | `/health` | `app.MapHealthEndpoints()` (FastEndpoints) — `AllowAnonymous`. |
