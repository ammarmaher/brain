# UserController — Endpoints

> Route prefix `/api/user/`. All `RequireAuthorization()` (group default), except `POST /generate-password`.
> Every endpoint returns `ServiceOperationResult<T>`.

## CRUD endpoints

| # | Method | Route                       | Endpoint class                       | Request DTO                            | Response (T in SOR)                  | Notes |
|---|--------|-----------------------------|--------------------------------------|----------------------------------------|--------------------------------------|---|
| 1 | POST   | `/api/user/`                | `CreateUserEndpoint`                 | `CreateUserRequest`                    | `CreateUserResponse`                 | HTTP 201 Created; Kafka `UserCredentialsGeneratedDomainEvent` |
| 2 | GET    | `/api/user/me`              | `GetMyProfileEndpoint`               | (none)                                 | `UserResponse`                       | reads by `currentUser.UserId` |
| 3 | GET    | `/api/user/{id}`            | `GetUserByIdEndpoint`                | `GetUserByIdRequest`                   | `UserResponse`                       | Falcon: optional `IncludeDeleted`; Client: tenant-scoped |
| 4 | GET    | `/api/user/`                | `ListNodeUsersEndpoint`              | `ListNodeUsersRequest` (query)         | `PagedResponse<UserInfoResponse>`    | Full filter set; multi-value `Status` / `Role` query params |

## Profile + role + status endpoints

| # | Method | Route                       | Endpoint class                       | Request DTO                            | Response (T)                          | Notes |
|---|--------|-----------------------------|--------------------------------------|----------------------------------------|---------------------------------------|---|
| 5 | PUT    | `/api/user/profile`         | `UpdateMyProfileEndpoint`            | `UpdateUserProfileRequest`             | `UpdateUserProfileResult`             | self-edit only |
| 6 | PUT    | `/api/user/{id}/profile`    | `UpdateUserProfileByIdEndpoint`      | `UpdateUserProfileByIdRequest`         | `UpdateUserProfileResult`             | admin-edit (different DTO, route-bound id) |
| 7 | PUT    | `/api/user/{id}/role`       | `UpdateUserRoleByIdEndpoint`         | `UpdateUserRoleByIdRequest`            | `bool`                                 | uses `RoleKey` (canonical); PES sync |
| 8 | PUT    | `/api/user/status`          | `ChangeUserStatusEndpoint`           | `ChangeUserStatusRequest`              | `object` (null)                       | Body has `UserId` + `NewStatus`. Drives Active/Locked/Suspended/Deleted. |

## Password endpoints

| #  | Method | Route                          | Endpoint class                | Request DTO              | Response (T)                  | Notes |
|----|--------|--------------------------------|-------------------------------|--------------------------|-------------------------------|---|
| 9  | PUT    | `/api/user/change-password`    | `ChangePasswordEndpoint`      | `ChangePasswordRequest`  | `object` (null)               | Revokes all sessions on success (BR-UM-34/35) |
| 10 | POST   | `/api/user/verify-password`    | `VerifyPasswordEndpoint`      | `VerifyPasswordRequest`  | `bool`                        | "Confirm with password" UX pattern |
| 11 | POST   | `/api/user/generate-password`  | `GeneratePasswordEndpoint`    | `GeneratePasswordRequest`| `GeneratePasswordResponse`    | **AllowAnonymous**; takes `ePasswordSecurityLevel` |

## Discovery endpoints

| #  | Method | Route                       | Endpoint class           | Request DTO              | Response (T)                            | Notes |
|----|--------|-----------------------------|--------------------------|--------------------------|------------------------------------------|---|
| 12 | POST   | `/api/user/exist`           | `UserExistEndpoint`      | `UserExistRequest`       | `ExistResponse(bool Exists)`             | case-insensitive username check |

## East-West endpoints (Service-to-service)

| #  | Method | Route                       | Endpoint class                 | Request DTO              | Response (T)                | Notes |
|----|--------|-----------------------------|--------------------------------|--------------------------|------------------------------|---|
| 13 | GET    | `/api/user/count`           | `GetUserCountEndpoint`         | `GetUserCountRequest`    | `long`                       | Multi-value `?roles=6&roles=5` |
| 14 | GET    | `/api/user/by-tenant`       | `ListTenantUsersEndpoint`      | `ListTenantUsersRequest` | `List<TenantUserDto>`        | Used by Commerce/Gateway for hierarchy enrichment |

## Verification endpoints (BR-UM-36 self-verify)

| #  | Method | Route                                       | Endpoint class                          | Request DTO              | Response (T)                  | Notes |
|----|--------|---------------------------------------------|-----------------------------------------|--------------------------|-------------------------------|---|
| 15 | POST   | `/api/user/me/verify-email`                 | `RequestEmailVerificationEndpoint`      | `VerifyEmailRequest`     | `VerificationCodeResponse`    | optional new email (verify-before-save) |
| 16 | POST   | `/api/user/me/verify-email/resend`          | `ResendEmailVerificationEndpoint`       | (none)                   | `VerificationCodeResponse`    | resends current pending |
| 17 | POST   | `/api/user/me/verify-email/confirm`         | `ConfirmEmailVerificationEndpoint`      | `ConfirmEmailRequest`    | `bool`                        | code submission |
| 18 | POST   | `/api/user/me/verify-phone`                 | `RequestPhoneVerificationEndpoint`      | `VerifyPhoneRequest`     | `VerificationCodeResponse`    | optional new phone |
| 19 | POST   | `/api/user/me/verify-phone/resend`          | `ResendPhoneVerificationEndpoint`       | (none)                   | `VerificationCodeResponse`    | |
| 20 | POST   | `/api/user/me/verify-phone/confirm`         | `ConfirmPhoneVerificationEndpoint`      | `ConfirmPhoneRequest`    | `bool`                        | |

## Endpoint count by verb

| Verb   | Count |
|---|---:|
| GET    | 5    |
| POST   | 10   |
| PUT    | 5    |
| **Total** | **20** |

## Per-endpoint mechanism summaries

### 1. POST /api/user/ — CreateUser
[CODE] `Endpoints/Users/CreateUserEndpoint.cs:11-31` → [CODE] `Application/Users/UseCases/CreateUserProcess.cs:31-133`

- Endpoint resolves `requestedRole` via `UserRolePolicy.ResolveRequestedRole(RoleKey, Role)` — prefers `RoleKey`, falls back to legacy `Role` enum.
- `CreateUserProcess` runs the multi-step orchestration:
  1. Role / user-type compatibility check (`UserRolePolicy.IsValid`).
  2. Tenant resolution: Falcon callers can supply `TenantId`; if omitted, infer from `NodeId` if that node is a tenant-root (per `TenantSettings.TenantId`).
  3. `UserRolePolicy.ValidateClientUserContext` — TenantId+NodeId required for Client roles.
  4. Username uniqueness (case-insensitive via repo).
  5. `UserQuotaPolicy.ValidateNormalUserLimit` — only for `NormalUser` role.
  6. Password — auto-generate (`PasswordPolicy.Generate`) if not provided, using tenant `PasswordSecurityLevel`.
  7. `identityManager.CreateUserAsync` — Zitadel create.
  8. `ProfileImagePolicy.ValidateAndDecode` for profile picture.
  9. Persist `User` in Mongo with `Status=Pending`.
  10. Set Zitadel metadata (UserId, UserType, TenantId, NodeId).
  11. `accessRoleLinkClient.SyncPrimaryRoleAsync` — PES sync (gRPC).
  12. On any post-persistence failure → rollback (delete local, deactivate Zitadel).
  13. Publish `UserCredentialsGeneratedDomainEvent` — credentials delivered via SMS/Email.

### 2. GET /api/user/me
[CODE] `GetMyProfileEndpoint.cs:9-26` — reads `User` where `_id == currentUser.UserId AND !IsDeleted`; `null` → `UserNotFound`.

### 3. GET /api/user/{id}
[CODE] `GetUserByIdEndpoint.cs:9-38` — Falcon: optional `IncludeDeleted`; Client: tenant-scoped `TenantId == currentUser.TenantId AND !IsDeleted`.

### 4. GET /api/user/ — ListNodeUsers
[CODE] `ListNodeUsersEndpoint.cs:13-41` → [CODE] `Application/Users/UseCases/ListNodeUsersHandler.cs:27-68`

Heavy security model:
- **Tenant**: Client callers ALWAYS use JWT tenant (request `TenantId` ignored). Falcon callers supply request `TenantId`.
- **Node**: when `IgnoreNodeIdFilter == false`, role-gated:
  - `NodeAdmin` — can query any node in tenant, defaults to own.
  - `AccountOwner` / `NormalUser` — restricted to JWT NodeId.
  - Falcon — unrestricted.
- **Statuses**: Client callers cannot see `Deleted` (silently stripped from filter).
- **Roles**: Client callers can only filter on Client roles (`ScopeRolesByUserType`).
- **Search**: Regex-escaped before passing to Mongo.
- **IncludeDeleted**: ignored for Client callers.

### 5/6. PUT /api/user/profile + PUT /api/user/{id}/profile
[CODE] `UpdateMyProfileEndpoint.cs`, `UpdateUserProfileByIdEndpoint.cs` → [CODE] `Application/Users/UseCases/UpdateUserProfileHandler.cs:20-73`

- Both endpoints call the same `UpdateUserProfileCommand` handler.
- Handler computes `isSelfEdit = currentUser.UserId == command.UserId`.
- `UserEditPolicy.ValidateForProfileEdit(user, isSelfEdit)` — blocks Suspended/Locked/Deleted; blocks self-edit when status=Pending.
- For each null field on the request → keep current.
- `ProfileImagePolicy.ValidateAndDecode` runs on image upload.
- Calls `identityManager.UpdateUserProfileAsync` to push Zitadel.
- Mongo update sets new values; sets `IsPhoneVerified=false` if phone changed and `IsEmailVerified=false` if email changed.
- Returns `UpdateUserProfileResult(Success, RequiresPhoneVerification, RequiresEmailVerification)` — last two true only when `user.Status == Active` AND the field changed. Pending users don't trigger verification (admin-set values).

### 7. PUT /api/user/{id}/role
[CODE] `UpdateUserRoleByIdEndpoint.cs:11-31` → [CODE] `Application/Users/UseCases/UpdateUserRoleHandler.cs:19-78`

- `UserEditPolicy.ValidateForRoleEdit` — blocks self-edit AND Suspended/Locked/Deleted.
- `EnsureCallerCanManageUser` — Client caller must share tenant with target.
- `UserRolePolicy.GetRoleFromRoleKey` — translate canonical key.
- `UserRolePolicy.IsValid(user.UserType, requestedRole)` — Falcon roles only for Falcon users.
- Mongo update + PES sync via `accessRoleLinkClient.SyncPrimaryRoleAsync`.
- On PES failure: try to revert local role (best-effort, logs on failure).

### 8. PUT /api/user/status
[CODE] `ChangeUserStatusEndpoint.cs:9-24` → [CODE] `Application/Users/UseCases/ChangeUserStatusProcess.cs:14-78`

Allowed transitions (`UserStatusTransitionPolicy.Validate`):

| From      | Allowed → To              | Performer constraint                  |
|---|---|---|
| Pending   | Active, Locked            | — |
| Active    | Suspended, Deleted, Locked | — |
| Suspended | Active                    | — |
| Locked    | Pending                   | — |
| Deleted   | Active                    | Falcon-only                           |

Side effects per new status:
- `Suspended` → `identityManager.DeactivateUserAsync`
- `Active ← Suspended` → `ReactivateUserAsync`
- `Locked` → `LockUserAsync`
- `Active ← Locked` / `Pending ← Locked` → `UnlockUserAsync`
- `Deleted` → soft delete + Zitadel deactivate
- `Active ← Deleted` → reactivate

Cache invalidation: `cache.RemoveAsync(CacheKeys.UserStatus(IdentityUserId))`.

### 9. PUT /api/user/change-password
[CODE] `ChangePasswordEndpoint.cs:11-25` → [CODE] `Application/Users/UseCases/ChangePasswordHandler.cs:17-32`

BR-UM-34/35 (change-password + force-logout):
1. Load user.
2. Load tenant settings (`PasswordSecurityLevel`).
3. `PasswordPolicy.Validate(NewPassword, level)`.
4. `identityManager.ChangePasswordAsync(IdentityUserId, OldPassword, NewPassword)`.
5. `RevokeUserSessionsAsync` — lists Zitadel sessions, deletes those whose `Factors.User.Id == IdentityUserId`. Best-effort (logs warn on failure; tokens expire naturally).

### 10. POST /api/user/verify-password
[CODE] `VerifyPasswordEndpoint.cs:9-23` → [CODE] `Application/Users/UseCases/VerifyPasswordHandler.cs`

- Loads user. 404 if not found.
- Calls Zitadel to verify; throws `InvalidPassword` (HTTP 422) on mismatch.

### 11. POST /api/user/generate-password
[CODE] `GeneratePasswordEndpoint.cs:9-25`

- Anonymous. Returns `{ password }` from `PasswordPolicy.Generate(level)`.

### 12. POST /api/user/exist
[CODE] `UserExistEndpoint.cs:11-29`

- Throws `InvalidUserExistQuery` if username is whitespace.
- Returns `{ exists: bool }` based on `userRepository.ExistsByUsernameAsync` (case-insensitive).

### 13. GET /api/user/count
[CODE] `GetUserCountEndpoint.cs:12-32` — east-west: `userAggregator.CountUsersByRolesAsync(tenantId, roles)`.

### 14. GET /api/user/by-tenant
[CODE] `ListTenantUsersEndpoint.cs:13-31` — east-west: returns lightweight `TenantUserDto[]`.

### 15-17. Email verification trio
[CODE] `Application/Users/UseCases/RequestEmailVerificationHandler.cs:26-68`,
`ResendEmailVerificationHandler.cs`, `ConfirmEmailVerificationHandler.cs`

- Request: if body has new email → verify-before-save; if same as current + already verified → `AlreadyVerified=true`; if same + unverified → resend; if different → set new email in Zitadel via `SetUserEmailAsync` AND mark `IsEmailVerified=false` until confirmed.
- Resend: no body — forwards to Zitadel `ResendEmailVerificationAsync`.
- Confirm: posts code to Zitadel; on success, Zitadel webhook fires `EmailVerified` event → `ZitadelWebhookEndpoint` flips `IsEmailVerified=true` in Mongo.

### 18-20. Phone verification trio
Same shape as 15-17 but `SetUserPhoneAsync` + `Sms` channel. Confirm triggers Zitadel `PhoneVerified` event.
