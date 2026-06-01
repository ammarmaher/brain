# UserController — Validations

> Three layers: **FluentValidation** (request shape) + **Domain Policies** (business rules) +
> **Handler-level checks** (cross-cutting state). All ultimately throw `FalconException` →
> `ErrorLocalizer` → `ServiceOperationResult<object>.Failure` with HTTP status from
> `FalconExceptionHandler`.

## FluentValidation validators

Located in [CODE] `Endpoints/Users/Validators/`. One validator per request DTO.

### `CreateUserRequestValidator`
[CODE] `Endpoints/Users/Validators/CreateUserRequestValidator.cs:13-55`

```csharp
RuleFor(x => x.PersonalInfo).NotNull();
When(x => x.PersonalInfo is not null, () => {
    RuleFor(x => x.PersonalInfo.FirstName)
        .NotEmpty().MaximumLength(50)
        .Matches(FalconValues.ValidationPatterns.LettersOnly)
        .WithMessage(FalconKeys.Error.FirstNameLettersOnly);
    RuleFor(x => x.PersonalInfo.LastName)
        .NotEmpty().MaximumLength(50)
        .Matches(FalconValues.ValidationPatterns.LettersOnly);
    RuleFor(x => x.PersonalInfo.UserName)
        .NotEmpty().MaximumLength(100)
        .Matches(FalconValues.ValidationPatterns.StartsWithLetter)
        .WithMessage(FalconKeys.Error.UsernameMustStartWithLetter);
});
RuleFor(x => x).Must(HasRoleSelection);    // RoleKey OR Role required
When(x => x.Role.HasValue, () => RuleFor(x => x.Role!.Value).IsInEnum());
When(x => !string.IsNullOrWhiteSpace(x.RoleKey), () =>
    RuleFor(x => x.RoleKey!).Must(BeSupportedRoleKey));  // calls UserRolePolicy.GetRoleFromRoleKey
RuleFor(x => x.DeliveryMethod).IsInEnum();
```

Patterns: `LettersOnly = @"^[\p{L}\s]+$"` (Unicode letters + space — supports Arabic);
`StartsWithLetter = @"^[a-zA-Z]"` (ASCII letter prefix).

### `UpdateUserProfileRequestValidator`
[CODE] `UpdateUserProfileRequestValidator.cs:8-19`

- `FirstName` (if present): Max 50 + letters-only.
- `LastName` (if present): Max 50 + letters-only.
- **No** email/phone format validation at this layer — handler proceeds with whatever is sent.
- **No** cross-field rule rejecting Email+Phone in same request → BR-UM-21 NOT enforced (see OVERVIEW finding #1).

### `UpdateUserRoleByIdRequestValidator`
[CODE] `UpdateUserRoleByIdRequestValidator.cs:13-21`

- `Id` NotEmpty.
- `RoleKey` NotEmpty + Max 100.
  - Role key resolution happens inside `UpdateUserRoleHandler.GetRoleFromRoleKey` — the validator
    only checks "non-empty" / "≤100 chars", not "is supported".

### `ChangeUserStatusRequestValidator`
[CODE] `ChangeUserStatusRequestValidator.cs:8-15`

- `UserId` NotEmpty.
- `NewStatus` IsInEnum.

### `ChangePasswordRequestValidator`
[CODE] `ChangePasswordRequestValidator.cs:8-20`

- `OldPassword` NotEmpty.
- `NewPassword` NotEmpty + Min 8.
- `ConfirmNewPassword` NotEmpty + Equal(`NewPassword`) → `PasswordsDoNotMatch`.

### `VerifyPasswordRequestValidator`
[CODE] `VerifyPasswordRequestValidator.cs:8-13`

- `CurrentPassword` NotEmpty.

### `ConfirmEmailRequestValidator` / `ConfirmPhoneRequestValidator`
[CODE] `ConfirmEmailRequestValidator.cs:8-12`, `ConfirmPhoneRequestValidator.cs:8-12`

- `Code` NotEmpty.

### `GetUserCountRequestValidator`
[CODE] `GetUserCountRequestValidator.cs:7-12`

- `TenantId` NotEmpty.

## Domain policies invoked by handlers

### `UserRolePolicy` (static)
[CODE] `Domain/Policies/UserRolePolicy.cs:7-152`

| Method                              | Purpose                                          | Throws on |
|---|---|---|
| `IsValid(userType, role)`           | Role belongs to user-type's set                  | bool — caller throws |
| `GetUserTypeFromRole(role)`         | Map role → user-type                             | unknown role → `InvalidRoleForUserType` |
| `ValidateClientUserContext(role, tenantId, nodeId)` | Client roles must carry TenantId AND NodeId | empty tenantId → `TenantIdRequired`; empty nodeId → `NodeIdRequired` |
| `GetRoleKey(role)`                  | Enum → canonical key                             | unknown → `InvalidRoleForUserType` |
| `GetRoleFromRoleKey(key)`           | Canonical/alias key → enum                       | unknown → `InvalidRoleForUserType` |
| `ResolveRequestedRole(roleKey, role)` | Prefer key, fallback to enum                   | neither set → `InvalidRoleForUserType` |

Falcon role set: `{SystemAdministrator, Product, Operation}`.
Client role set: `{AccountOwner, NodeAdmin, NormalUser}`.

### `UserEditPolicy` (static)
[CODE] `Domain/Policies/UserEditPolicy.cs:9-56`

- `ValidateForProfileEdit(user, isSelfEdit)`:
  - `user.IsDeleted` → `UserDeletedCannotEdit` (410)
  - `user.Status == Suspended` → `UserSuspendedCannotEdit` (403)
  - `user.Status == Locked` → `UserLockedCannotEdit` (423)
  - `isSelfEdit && user.Status == Pending` → `PendingSelfEditBlocked` (403)
- `ValidateForRoleEdit(user, isSelfEdit)`:
  - Same Suspended/Locked/Deleted checks
  - `isSelfEdit` → `SelfEditRoleNotAllowed` (403)

### `UserStatusTransitionPolicy`
[CODE] `Domain/Policies/UserStatusTransitionPolicy.cs:6-41`

Legal transitions matrix (see ENDPOINTS.md §8 transition table). Throws:
- `InvalidStatusTransition` (422) — illegal pair
- `OnlyFalconUserCanRestoreDeletedUser` (403) — non-Falcon trying Deleted→Active

### `UserQuotaPolicy`
[CODE] `Domain/Policies/UserQuotaPolicy.cs:6-23`

- `ValidateNormalUserLimit(maxNormalUserLimit, currentNormalUserCount)`:
  - If `maxNormalUserLimit is null or 0` → unlimited (skip).
  - If `current >= max` → `NormalUserLimitReached` (422).

### `PasswordPolicy`
[CODE] `Domain/Policies/PasswordPolicy.cs:9-87`

- `Generate(level)`: 12-char, 1 of each char class, Fisher-Yates shuffled. **`level` currently ignored** but accepted for forward compatibility.
- `Validate(password, level)`: min 8, upper+lower+digit+special required. Same caveat — `level` reserved.

### `ProfileImagePolicy`
[CODE] `Domain/Policies/ProfileImagePolicy.cs:9-117`

- 2 MB max.
- Allowed: `.png .jpg .jpeg .gif .webp`.
- Blocked exec: `.exe .bat .cmd .sh .ps1 .dll .msi .com .scr .vbs .js` → `ExecutableFileNotAllowed`.
- **Magic-bytes verification** against declared extension — any mismatch → `InvalidImageFile`.
- Base64 decode failure → `InvalidImageFile`.
- Errors: `InvalidImageFile`, `ExecutableFileNotAllowed`, `ImageExtensionNotAllowed`, `ProfilePictureSizeExceeded`.

### `VerificationRateLimitPolicy`
[CODE] `Domain/Policies/VerificationRateLimitPolicy.cs:7-27`

- `Validate(sendCount, lastCodeSentAt, otpExpirySeconds, maxSendAttempts)`:
  - If still within `lastCodeSentAt + ExpirySeconds` → `OtpStillValid` (429).
  - If `sendCount >= maxSendAttempts` → `OtpResendLimitExceeded` (429).

## Cross-field rules

| Rule                                                      | Where                                          | Error                              |
|---|---|---|
| `ConfirmNewPassword == NewPassword`                       | Validator + handler                           | `PasswordsDoNotMatch`              |
| Username case-insensitive uniqueness                      | `CreateUserProcess.cs:44-46`                  | `DuplicateUsername`                |
| **BR-UM-21 — block save when Email AND Phone both modified in one request** | ❌ NOT IMPLEMENTED in `UpdateUserProfileHandler` | — |
| Self-edit not allowed when Pending                        | `UserEditPolicy.ValidateForProfileEdit`       | `PendingSelfEditBlocked`            |
| Self-edit of role not allowed                              | `UserEditPolicy.ValidateForRoleEdit`           | `SelfEditRoleNotAllowed`            |
| Client user must have TenantId + NodeId                   | `UserRolePolicy.ValidateClientUserContext`    | `TenantIdRequired` / `NodeIdRequired` |
| Email format                                              | (not enforced at validator layer)              | — |
| Phone format                                              | (not enforced at validator layer)              | — |
| `MaxNormalUserLimit` per tenant on Normal user creation   | `UserQuotaPolicy`                             | `NormalUserLimitReached`            |
| Deleted → Active only by Falcon user                      | `UserStatusTransitionPolicy`                  | `OnlyFalconUserCanRestoreDeletedUser` |
| Cross-tenant role edit blocked for Client callers         | `UpdateUserRoleHandler.EnsureCallerCanManageUser` | `UnauthorizedProfileEdit`        |
| Image magic-bytes match extension                          | `ProfileImagePolicy.IsValidImageContent`      | `InvalidImageFile`                  |
| Username must start with a letter                          | `CreateUserRequestValidator`                  | `UsernameMustStartWithLetter`       |

## BR-UM-19 (username immutable) enforcement

The username field is:
- ✓ Settable at `POST /user/` via `CreateUserRequest.PersonalInfo.UserName`
- ✗ **Absent** from `UpdateUserProfileRequest` and `UpdateUserProfileByIdRequest` — cannot be sent
- ✗ **Absent** from `UpdateUserProfileHandler.Handle`'s update builder ([CODE] `UpdateUserProfileHandler.cs:44-67`)
- ✓ Read-only in `UserResponse` (returned to FE), but no FE-side enforcement needed since BE can't accept it

**Enforcement style**: structural omission, not a declarative policy. Robust against accidental
reintroduction only if the project's structural conventions hold. A new `Username` field added
to `UpdateUserProfileRequest` would silently break BR-UM-19.

## BR-UM-21 (block Email + Phone in same save) — UNRESOLVED GAP

`UpdateUserProfileHandler.cs:34-37`:
```csharp
var phoneChanged = command.PhoneNumber is not null
                   && !string.Equals(command.PhoneNumber, user.PhoneNumber, StringComparison.Ordinal);
var emailChanged = command.Email is not null
                   && !string.Equals(command.Email, user.Email, StringComparison.OrdinalIgnoreCase);
```

Both are independently computed. The handler proceeds to update both fields and the result reports
`RequiresEmailVerification = emailChanged && Active` AND `RequiresPhoneVerification = phoneChanged && Active`
([CODE] `UpdateUserProfileHandler.cs:69-72`).

**Interpretations:**
- **Strict reading of PRD**: BR-UM-21 requires throwing on `emailChanged && phoneChanged`. Not implemented.
- **Permissive reading**: maybe the PRD meant "FE must drive sequential OTP flows; BE can accept both
  and return both verification flags". The current handler honours this — FE gets both flags and
  must walk the user through two OTPs (email → phone) before the new values are trusted.

Recommendation: confirm with PM before adding a policy throw. If strict, add:
```csharp
if (phoneChanged && emailChanged)
    throw new FalconException(FalconKeys.Error.CannotEditPhoneAndEmailTogether);  // new code
```
…in `UpdateUserProfileHandler` before line 34.

See pending-question file.

## BR-UM-36 (admin-edit-email/phone OTP flow) — Q-UM-13 RESOLVED

**Q-UM-13 was OPEN** — "admin-edit OTP path unclear". Code reveals the resolution:

When **admin** (e.g. Falcon SystemAdmin) calls `PUT /api/user/{id}/profile` with a new email/phone:
1. `UpdateUserProfileHandler.cs:41-42` calls `identityManager.UpdateUserProfileAsync(...)`
   → Zitadel **immediately** stores the new email/phone but **does not** trigger an OTP send.
2. `UpdateUserProfileHandler.cs:63-64` sets `IsEmailVerified=false` / `IsPhoneVerified=false` in Mongo.
3. The handler returns `RequiresEmailVerification = (emailChanged AND user.Status == Active)` and
   the equivalent phone flag ([CODE] `:69-72`).
4. **No OTP is sent automatically.** The new value sits in Zitadel + Mongo as "unverified".
5. The next time the **user** logs in (or visits Settings), the FE sees `isEmailVerified: false`
   and must drive the user through `POST /api/user/me/verify-email` themselves.

**So**:
- Admin-edit path = "store new value as unverified; let the affected user re-verify next time they're in".
- Self-edit path = same flow — `RequiresEmailVerification` flag drives the FE to immediately open
  the OTP modal post-save.
- There is no path where an admin's action sends an OTP to the affected user. **BR-UM-36 is implemented
  as a deferred-verification pattern, not an admin-initiated OTP.**

**Edge case**: if `user.Status == Pending` (admin just created the user), the change is applied with
**no** verification flag — the new value is taken on trust because the admin chose it.

**Implication for FE**: the affected user's profile shows `isEmailVerified: false` after an admin edit,
which the FE should surface as a banner ("Your email has been changed by your administrator — please
verify it"). Today no UI tells the user *who* changed it; the audit log carries `UpdatedBy` but the
FE does not surface it.

## Deviations from platform standards

- **No `MultiLanguageName(En, Ar)`** on user fields (FirstName, LastName, etc.). Localization is for
  error messages only.
- **Both `record` and `class` shapes** used inconsistently. New code uses `record`; legacy DTOs are
  classes with mutable setters.
- **Field-level encryption** is configured at infra (`FieldEncryption:Key`) but not visible at the
  DTO layer — the Mongo storage layer handles it transparently.
