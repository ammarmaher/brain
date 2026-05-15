*** Entity Reconciliation E-user — User ***
*** PRD: PRD-02 User Management · Backend service: Identity · 2026-05-15 ***

# E-user — User

> A person in Falcon with credentials, role, status. Falcon-side vs Client-side via `usertype`. Owned by [[Identity Service]] (Wiki rule: *"Identity Service owns user lifecycle — NOT Commerce, NOT Zitadel directly"*). User is created in two flows: standalone (Add User wizard, 3 tabs) and inside Account create (`AccountOwner` block of `CreateAccountRequest` — Step 5 of Add Client wizard).

## PRD definition (business-conceptual)

- **PRD module:** [[02 User Management]]
- **Source:** [ENTITIES.md](../../../Brain%20Outputs/prd/modules/02-user-management/ENTITIES.md)
- **PRD fields:**
  - `id`: identifier
  - `usertype`: enum `Falcon | Client`
  - `role`: enum `sys-admin | operation | product | account-owner | node-admin | normal-user`
  - `firstName`: string (letters-only — BR-UM-11)
  - `lastName`: string (letters-only — BR-UM-11)
  - `username`: string `<=30`, starts with letter, unique system-wide, **immutable** after create (BR-UM-12 / BR-UM-19 / BR-UM-37)
  - `email`: string
  - `phoneNumber`: string
  - `passwordHash`: string (server-only)
  - `profilePicture?`: optional binary/url
  - `status`: enum `Pending | Active | Suspended | Locked | Deleted`
  - `permissionGroupId`: identifier
  - `nodeId`: identifier (which node the user belongs to)
  - `tenantId`: opaque Zitadel tenant identifier
  - `createdAt`: timestamp
  - `updatedAt`: timestamp
  - `lastLoginAt`: timestamp
  - `isEmailVerified`: bool
  - `isPhoneVerified`: bool
- **Lifecycle (5 status transitions per BR-UM):**
  `Pending` → `Active` → `{Suspended, Locked, Deleted}` → `Locked → Pending` (manual unlock) · `Deleted → Active` (Falcon only, per `UserStatusTransitionPolicy`)

## Backend DTO mapping (concrete request/response shapes)

- **Service:** [[Identity Service]]
- **DTO source:** [DTO_DICTIONARY.md](../../../Brain%20Outputs/understanding/backend/identity/DTO_DICTIONARY.md)
- **Validations source:** [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/identity/VALIDATIONS.md)
- **Relevant DTOs:**
  - `CreateUserRequest` — `POST /user` — record: `UserPersonalInformation PersonalInfo, string PermissionGroupId, eDeliveryMethod DeliveryMethod, string? RoleKey, eUserRoles? Role, string? TenantId, string? NodeId, string? Path`
  - `UserPersonalInformation` (nested) — record: `FirstName, LastName, UserName, NationalId, PhoneNumber, Email, ProfilePictureInfo`
  - `ProfilePictureInfo` (nested) — record: `string? Extension, string? FileBase64String`
  - `UpdateUserProfileRequest` — `PUT /user/profile` (record — fields not enumerated; note: no `UserName` field — by design, see immutability)
  - `UpdateUserProfileByIdRequest` — `PUT /user/{id}/profile`
  - `UpdateUserRoleByIdRequest` — `PUT /user/{id}/role`: `string Id, string RoleKey`
  - `ChangeUserStatusRequest` — `PUT /user/status`: `string UserId, eUserStatus NewStatus`
  - `UserResponse` — `GET /user/me`, `GET /user/{id}` — `Id, NodeId, FirstName, LastName, Username, Email, PhoneNumber, eUserRoles Role, string RoleKey, eUserType UserType, eUserStatus Status, string PermissionGroup, TenantId, Image, DateTime CreatedAt, string? CreatedBy, bool IsPhoneVerified, bool IsEmailVerified, string? Path`
  - `UserInfoResponse` — lightweight version used in list pages
  - `TenantUserDto` — `ListTenantUsersEndpoint` (east-west): `Id, NodeId, FirstName, LastName, Path`
  - `UserExistRequest` / `ExistResponse` — `POST /user/exist`: `string Username` → `bool Exists`
  - `ListNodeUsersRequest` — `GET /user/` — filters: `NodeId?, Search?, Status[]?, Role[]?, TenantId?, PathPrefix?, PageNumber, PageSize, IncludeDeleted, ExcludeCurrentUser, IgnoreNodeIdFilter`
  - `GetUserByIdRequest` — `GET /user/{id}`: `Id, IncludeDeleted`

## Field reconciliation

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `id` | `UserResponse.Id` · `CreateUserRequest`/`Response` returns id · all `*ById*` requests | identifier → string | ✅ match |
| `usertype` (`Falcon/Client`) | `UserResponse.UserType` (`eUserType`) | enum 2-value → `eUserType` enum (`Falcon/Client` per DTO_DICTIONARY line 72) | ✅ match |
| `role` (6-value enum) | `UserResponse.Role` (`eUserRoles`) **AND** `UserResponse.RoleKey` (string) — both surface | enum 6-value → `eUserRoles` enum + string `RoleKey` | ⚠ DRIFT (transitional) — backend exposes both `eUserRoles Role` and `string RoleKey`. Per DTO_DICTIONARY line 71: *"canonical role identifier is the **string `RoleKey`** going forward"*. Frontend should bind to `RoleKey`; `Role` enum is the legacy path. |
| `firstName` | `UserPersonalInformation.FirstName` — `NotEmpty + MaximumLength 50 + Matches(LettersOnly)` | string letters-only → string ≤50 letters-only | ✅ match (PRD lacks explicit max; backend caps at 50) |
| `lastName` | `UserPersonalInformation.LastName` — same rules as FirstName | string letters-only → string ≤50 letters-only | ✅ match |
| `username` | `UserPersonalInformation.UserName` — `NotEmpty + MaximumLength(100) + Matches(StartsWithLetter)` | string ≤30, letter-prefix, unique, immutable → string **≤100**, letter-prefix, unique (handler), immutable (no DTO field on update) | ⚠⚠ **DRIFT (known)** — PRD cap `<=30`, backend cap `100`. See [[V-username-format-uniqueness-immutable]]. Immutability enforced by absence of a `UserName` field on `UpdateUserProfileRequest` (silently dropped). Uniqueness via handler-thrown `DuplicateUsername` (409). |
| `email` | `UserPersonalInformation.Email` · `UserResponse.Email` | string → string | ✅ match (validator rules not enumerated for Email format in `VALIDATIONS.md`) |
| `phoneNumber` | `UserPersonalInformation.PhoneNumber` · `UserResponse.PhoneNumber` | string → string | ✅ match |
| `passwordHash` | _no DTO field_ — password is set via separate flows (`ChangePasswordRequest`, `SetPasswordRequest`, `FirstLoginSetupRequest`, `ForgotPasswordSetPasswordRequest`) | server-only → server-only (correct) | ✅ match — password never sent in user CRUD DTOs |
| `profilePicture?` | `UserPersonalInformation.ProfilePictureInfo` (`Extension, FileBase64String`) (write) · `UserResponse.Image` (read) | binary/url → record split into base64 + extension on write, string on read | ⚠ DRIFT (cosmetic) — write/read shape asymmetry. Write takes `{Extension, FileBase64String}`, read returns `string Image` (likely URL after upload). |
| `status` (5-value enum) | `UserResponse.Status` (`eUserStatus`) · `ChangeUserStatusRequest.NewStatus` | enum 5-value → `eUserStatus` enum (5-value per DTO_DICTIONARY line 70) | ✅ match |
| `permissionGroupId` | `CreateUserRequest.PermissionGroupId` · `UserResponse.PermissionGroup` (string) | identifier → string | ⚠ DRIFT — name asymmetry: write side `PermissionGroupId`, read side `PermissionGroup`. Type-wise both string. |
| `nodeId` | `CreateUserRequest.NodeId?` · `UserResponse.NodeId` | identifier → string (nullable on write) | ✅ match |
| `tenantId` | `CreateUserRequest.TenantId?` · `UserResponse.TenantId` | identifier → string (nullable on write) | ✅ match |
| `createdAt` | `UserResponse.CreatedAt` | timestamp → DateTime | ✅ match |
| `updatedAt` | _not enumerated on UserResponse_ | timestamp → not documented | ❌ MISSING on backend response (or undocumented) |
| `lastLoginAt` | _not enumerated on UserResponse_ | timestamp → not documented | ❌ MISSING on backend response (or undocumented). Note: `LoginAttempt` entity tracks all attempts but a denormalized `lastLoginAt` on User is not in the response. |
| `isEmailVerified` | `UserResponse.IsEmailVerified` | bool → bool | ✅ match |
| `isPhoneVerified` | `UserResponse.IsPhoneVerified` | bool → bool | ✅ match |
| _(none)_ | `UserResponse.CreatedBy` (string?) | n/a → string? | ➕ Backend tracks who created the user (audit field) — PRD does not enumerate this |
| _(none)_ | `UserResponse.Path` (string?) | n/a → string? | ➕ Backend carries node-path string for hierarchy enrichment (used by Gateways for east-west user lookups per ENTITIES.md "Tenant + Path" section) |
| _(none)_ | `CreateUserRequest.DeliveryMethod` (`eDeliveryMethod`) | n/a → enum | ➕ Backend takes OTP delivery channel at create (for first-login OTP delivery). PRD covers OTP separately ([[E-otp-challenge]]). |

## Drift / gaps summary

- **Drift items:**
  - `username` max length: PRD 30 vs backend 100 — **known, surfaced in [[V-username-format-uniqueness-immutable]]**
  - `role` exposed twice (`Role` enum + `RoleKey` string) — transitional; bind to `RoleKey`
  - `profilePicture` write/read shape asymmetry (base64+ext vs URL string)
  - `permissionGroupId` (write) vs `PermissionGroup` (read) — naming asymmetry
- **Missing on backend response:**
  - `updatedAt` — not in `UserResponse`
  - `lastLoginAt` — not in `UserResponse` (audit is in `LoginAttempt`)
- **Extra on backend:**
  - `CreatedBy` — audit field
  - `Path` — node-path string for hierarchy enrichment
  - `DeliveryMethod` on create — OTP channel selection at create
- **Composite create flow:**
  - When created via Add Client wizard Step 5, the User is created from the `AccountOwner` block of `CreateAccountRequest` (Commerce) — Commerce produces a Kafka `UserCreationRequested` event consumed by Identity

## Related validation rules (V-rule notes)

- [[V-user-first-last-name-letters-only]] — `FirstName`/`LastName` letters-only + max 50 (BR-UM-11)
- [[V-username-format-uniqueness-immutable]] — `Username` 30-char rule + letter-prefix + uniqueness + **immutability**. Notes the PRD-30 vs backend-100 drift.
- [[V-normal-user-limit-enforcement]] — `UserQuotaPolicy` · `NormalUserLimitReached` (BR-UM-07/09/17/38)
- [[V-password-complexity-per-security-level]] — `PasswordPolicy` (cross-touches User via password flows)
- [[V-login-lockout-3-wrong-attempts]] — `LoginEligibilityPolicy` + Zitadel · `UserLocked`/`UserSuspended`/`UserPending` (5-status enforcement)
- _no V-rule yet for `Email` / `PhoneNumber` format — candidate for future Phase 2C extension_
- _no V-rule yet for the 5-state status transition matrix (`UserStatusTransitionPolicy`) — candidate for future Phase 2C extension_

## Pages using this entity

- Add User wizard (3 tabs) — page not yet seeded under `10-Pages/`
- Add Client wizard Step 5 (Account Owner) — page not yet seeded; uses same `CreateUserRequest` shape via Commerce → Identity Kafka path
- Edit User · Change Password · Forgot Password · Force-change — pages not yet seeded
- [[Organization Hierarchy]] — implicit (users listed per node)

## Cross-service touches

- [[Commerce Service]] — produces `UserCreationRequested` Kafka event when Account-Owner user is created at Step 5 of Add Client wizard
- [[Access PES Service]] — consumes User identity for permission decisions; `PermissionGroupId` is the join
- [[Core Gateway Service]] / [[System Gateway Service]] — JWT forwarding; `tenantId` + `path` extracted from JWT and routed
- Zitadel — user backend (Identity proxies; FE never calls Zitadel directly)

## Hubs

- [[API_INDEX]] · [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
