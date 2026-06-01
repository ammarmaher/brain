# UserController — DTOs

> Source: `Application/Users/Models/`. Mix of `sealed record` (most) and `sealed class` (response shapes).

## Request DTOs

### `CreateUserRequest` — POST /api/user/
[CODE] `Application/Users/Models/CreateUserRequest.cs:8-16`

```csharp
public sealed record CreateUserRequest(
    UserPersonalInformation PersonalInfo,
    string PermissionGroupId,
    eDeliveryMethod DeliveryMethod,
    string? RoleKey,                 // CANONICAL — preferred input
    eUserRoles? Role,                // legacy fallback
    string? TenantId,                // Falcon-only; ignored for Client callers
    string? NodeId,                  // required for Client roles
    string? Path);                   // node hierarchy path
```

Nested:
```csharp
public sealed record UserPersonalInformation(
    string FirstName,
    string LastName,
    string UserName,                 // immutable from this point on (BR-UM-19)
    string NationalId,
    string PhoneNumber,
    string Email,
    ProfilePictureInfo ProfilePictureInfo);

public sealed record ProfilePictureInfo(string? Extension, string? FileBase64String);
```

| Field                | Type    | PII | Notes |
|---|---|---|---|
| `PersonalInfo.FirstName`        | string                  | ✓ | Letters-only validator |
| `PersonalInfo.LastName`         | string                  | ✓ | Letters-only validator |
| `PersonalInfo.UserName`         | string                  |   | Must start with letter; **immutable post-create (BR-UM-19)** |
| `PersonalInfo.NationalId`       | string                  | ✓ | Currently no format validator at endpoint layer |
| `PersonalInfo.PhoneNumber`      | string                  | ✓ | Format not validated here; delivered via SMS gateway |
| `PersonalInfo.Email`            | string                  | ✓ | Format not validated here |
| `PersonalInfo.ProfilePictureInfo.FileBase64String` | string?      |   | Validated by `ProfileImagePolicy` (size, magic bytes, blocked exec extensions) |
| `RoleKey`                       | string?                 |   | `sys-admin`, `sys-products`, `sys-ops`, `acc-owner`, `acc-admin`, `acc-user` (also accepts `account-*` aliases) |
| `Role`                          | `eUserRoles?`           |   | Legacy numeric enum — drop in future |
| `TenantId`                      | string?                 |   | Falcon-only override; auto-inferred from `NodeId` if blank AND nodeId is a tenant root |
| `NodeId`                        | string?                 |   | Required for Client roles |
| `Path`                          | string?                 |   | Stored on User; used by hierarchy queries |

### `UpdateUserProfileRequest` — PUT /api/user/profile (self-edit)
[CODE] `Application/Users/Models/UpdateUserProfileRequest.cs:14-21`

```csharp
public sealed record UpdateUserProfileRequest(
    string? FirstName,
    string? LastName,
    string? Email,
    string? PhoneNumber,
    string? NationalId,
    ProfilePictureInfo? ProfilePictureInfo,
    bool DeleteImage = false);
```

Note: **`Username` is absent — BR-UM-19 enforced by omission.**

### `UpdateUserProfileByIdRequest` — PUT /api/user/{id}/profile (admin)
[CODE] `UpdateUserProfileByIdRequest.cs:15-23`

Same as `UpdateUserProfileRequest` plus required `Id` (route-bound).

### `UpdateUserRoleByIdRequest` — PUT /api/user/{id}/role
[CODE] `UpdateUserRoleByIdRequest.cs:5-8`

```csharp
public sealed record UpdateUserRoleByIdRequest(string Id, string RoleKey);
```

Canonical role keys only. No legacy enum fallback.

### `ChangeUserStatusRequest` — PUT /api/user/status
[CODE] `ChangeUserStatusRequest.cs:5`

```csharp
public sealed record ChangeUserStatusRequest(string UserId, eUserStatus NewStatus);
```

### `ChangePasswordRequest` — PUT /api/user/change-password
[CODE] `ChangePasswordRequest.cs:5`

```csharp
public sealed record ChangePasswordRequest(string OldPassword, string NewPassword, string ConfirmNewPassword);
```

### `VerifyPasswordRequest` — POST /api/user/verify-password
[CODE] `VerifyPasswordRequest.cs:5`

```csharp
public sealed record VerifyPasswordRequest(string CurrentPassword);
```

### `GeneratePasswordRequest` — POST /api/user/generate-password
[CODE] `GeneratePasswordRequest.cs:5`

```csharp
public sealed record GeneratePasswordRequest(ePasswordSecurityLevel PasswordSecurityLevel);
```

### `UserExistRequest` — POST /api/user/exist
[CODE] `UserExistRequest.cs:5`

```csharp
public sealed record UserExistRequest(string? Username);
```

### `GetUserByIdRequest` — GET /api/user/{id}
[CODE] `GetUserByIdRequest.cs:6-12`

```csharp
public sealed class GetUserByIdRequest
{
    public string Id { get; set; } = string.Empty;
    public bool IncludeDeleted { get; init; }    // Falcon only; ignored for Client callers
}
```

### `ListNodeUsersRequest` — GET /api/user/ (query)
[CODE] `ListNodeUsersRequest.cs:6-48`

```csharp
public sealed record ListNodeUsersRequest
{
    public string? NodeId { get; init; }
    public string? Search { get; init; }            // regex-escaped server-side
    public List<eUserStatus>? Status { get; init; }
    public List<eUserRoles>? Role { get; init; }
    public string? TenantId { get; init; }          // Falcon-only; ignored for Client
    public string? PathPrefix { get; init; }
    public int PageNumber { get; init; } = 1;
    public int PageSize { get; init; } = 20;
    public bool IncludeDeleted { get; init; }       // Falcon-only
    public bool ExcludeCurrentUser { get; init; }
    public bool IgnoreNodeIdFilter { get; init; }   // bypasses Node-access role gating
}
```

Multi-value `Status` / `Role` pattern: `?Status=2&Status=3` → `[Locked, Suspended]`.

### `ListTenantUsersRequest` — GET /api/user/by-tenant
[CODE] `ListTenantUsersRequest.cs:6-17`

```csharp
public sealed record ListTenantUsersRequest
{
    public required string TenantId { get; init; }
    public string? PathPrefix { get; init; }
    public eUserRoles? ExcludeRole { get; init; }    // typically AccountOwner
}
```

### `GetUserCountRequest` — GET /api/user/count
[CODE] `GetUserCountRequest.cs:6-17`

```csharp
public sealed record GetUserCountRequest
{
    public required string TenantId { get; init; }
    public List<eUserRoles>? Roles { get; init; }   // empty/null = count all roles
}
```

### `VerifyEmailRequest` / `VerifyPhoneRequest` (verification-request bodies)
[CODE] `VerifyEmailRequest.cs:8-12`, `VerifyPhoneRequest.cs:8-12`

```csharp
public sealed record VerifyEmailRequest { public string? Email { get; init; } }
public sealed record VerifyPhoneRequest { public string? PhoneNumber { get; init; } }
```

If field is null → "resend for current". If filled → "verify-before-save new value".

### `ConfirmEmailRequest` / `ConfirmPhoneRequest`
[CODE] `ConfirmEmailRequest.cs:5`, `ConfirmPhoneRequest.cs:5`

```csharp
public sealed record ConfirmEmailRequest(string Code);
public sealed record ConfirmPhoneRequest(string Code);
```

### `ChangeUserStatusByIdRequest` (declared but UNUSED)
[CODE] `ChangeUserStatusByIdRequest.cs:5`

```csharp
public sealed record ChangeUserStatusByIdRequest(string Id, eUserStatus NewStatus);
```

⚠ No endpoint binds to this. Dead DTO. See OVERVIEW finding #4.

## Response DTOs

### `UserResponse` — GET /me, GET /{id}
[CODE] `UserResponse.cs:6-27`

```csharp
public sealed class UserResponse
{
    public string Id { get; set; } = string.Empty;
    public string? NodeId { get; set; }
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Username { get; set; } = string.Empty;
    public string? Email { get; set; }
    public string? PhoneNumber { get; set; }
    public eUserRoles Role { get; set; }
    public string RoleKey { get; set; } = string.Empty;
    public eUserType UserType { get; set; }
    public eUserStatus Status { get; set; }
    public string PermissionGroup { get; set; } = "-";
    public string TenantId { get; set; } = string.Empty;
    public string? Image { get; set; }                 // base64 string
    public DateTime CreatedAt { get; set; }
    public string? CreatedBy { get; set; }
    public bool IsPhoneVerified { get; set; }
    public bool IsEmailVerified { get; set; }
    public string? Path { get; set; }
}
```

### `UserInfoResponse` — list endpoints
[CODE] `UserInfoResponse.cs:6-23`

Lightweight subset of `UserResponse` minus tenant/image/createdAt — used in `ListNodeUsersResponse` paging.

### `TenantUserDto` — east-west `GET /by-tenant`
[CODE] `TenantUserDto.cs:7-14`

```csharp
public sealed class TenantUserDto
{
    public string Id { get; init; } = string.Empty;
    public string? NodeId { get; init; }
    public string FirstName { get; init; } = string.Empty;
    public string LastName { get; init; } = string.Empty;
    public string? Path { get; init; }
}
```

### `CreateUserResponse` — POST /
[CODE] `CreateUserResponse.cs:6-21`

```csharp
public sealed record CreateUserResponse(
    string Id,
    string? NodeId,
    string FirstName,
    string LastName,
    string Username,
    string? Email,
    string? PhoneNumber,
    eUserRoles Role,
    string RoleKey,
    eUserType UserType,
    string TenantId,
    string? Image,
    DateTime CreatedAt,
    string? CreatedBy,
    eUserStatus Status);
```

### `UpdateUserProfileResult` — PUT profile endpoints
[CODE] `UpdateUserProfileResult.cs:10-13`

```csharp
public sealed record UpdateUserProfileResult(
    bool Success,
    bool RequiresPhoneVerification = false,
    bool RequiresEmailVerification = false);
```

The two `Requires*Verification` flags drive the FE OTP-modal opening — critical for BR-UM-36.

### `VerificationCodeResponse` — verification-request endpoints
[CODE] `VerificationCodeResponse.cs:7-20`

```csharp
public sealed class VerificationCodeResponse
{
    public bool AlreadyVerified { get; set; }
    public int OtpCodeLength { get; set; }
    public int OtpExpiresInSeconds { get; set; }
    public string? DevOtpCode { get; set; }     // dev only
}
```

### `ExistResponse` — POST /exist
[CODE] `ExistResponse.cs`

```csharp
public sealed record ExistResponse(bool Exists);
```

### `GeneratePasswordResponse` — POST /generate-password
[CODE] `GeneratePasswordResponse.cs`

```csharp
public sealed record GeneratePasswordResponse(string Password);
```

### `PagedResponse<T>` — list endpoints (generic)

```csharp
public sealed record PagedResponse<T>(List<T> Items, long TotalCount, int PageNumber, int PageSize);
```

## Internal DTOs

### `VerificationSession` — HybridCache state for ongoing email/phone OTP
[CODE] `VerificationSession.cs`

Used by `VerificationSessionCache` to track rate-limit + value-to-be-saved for verify-before-save flow.

### `CreateUserResult` — handler return type
[CODE] `CreateUserResult.cs`

```csharp
public sealed record CreateUserResult(string Id, CreateUserResponse Response);
```

### `PrimaryRoleLinkSyncRequest` — PES sync payload
[CODE] `Application/Access/Models/PrimaryRoleLinkSyncRequest.cs`

Sent to `IAccessRoleLinkClient.SyncPrimaryRoleAsync` after every role-related change.

```csharp
public sealed record PrimaryRoleLinkSyncRequest(
    string IdentityUserId,
    eUserType UserType,
    string? TenantId,        // null for Falcon users
    string RoleKey);
```

## Enum vocabulary

Same as the Auth surface plus the user-domain enums:

| Enum                       | Values                                            |
|---|---|
| `eUserRoles`               | `SystemAdministrator=1, Product=2, Operation=3, AccountOwner=4, NodeAdmin=5, NormalUser=6` |
| `eUserType`                | `Falcon=1, Client=2` |
| `eUserStatus`              | `Pending=1, Active=2, Suspended=3, Locked=4, Deleted=5` |
| `ePasswordSecurityLevel`   | `Normal=1, Advanced=2` (Q-UM-12 — matches PRD's 2-tier vocab; both apply Zitadel floor today) |

## Role key vocabulary (PES canonical)

[CODE] `Domain/Policies/UserRolePolicy.cs:90-101`

| `eUserRoles`           | Canonical `RoleKey` | Aliases accepted (`GetRoleFromRoleKey`) |
|---|---|---|
| SystemAdministrator    | `sys-admin`        | — |
| Product                | `sys-products`     | — |
| Operation              | `sys-ops`          | — |
| AccountOwner           | `acc-owner`        | `account-owner` |
| NodeAdmin              | `acc-admin`        | `account-admin` |
| NormalUser             | `acc-user`         | `account-user` |
