# UserController — Drill-down

> **Architecture note:** Identity uses FastEndpoints, not MVC. This dossier treats the
> `UserEndpointGroup` (route prefix `/api/user/`) as the logical equivalent of a `UserController`.

## Purpose

Owns the **user CRUD + lifecycle + profile + verification** surface. Every endpoint that mutates
or reads a User document goes through here — except status-checks (Security group) and
auth flows (Auth group). Specifically:

- **Create** ([CODE] `Endpoints/Users/CreateUserEndpoint.cs:11-31`)
- **Read** — own profile, by-ID, list-by-node, east-west (`count`, `by-tenant`)
- **Profile update** — self-edit + admin-edit
- **Role update** — admin-only (BR-UM-19 — username remains immutable; role can change)
- **Status change** — admin-only, drives Active/Suspended/Locked/Deleted
- **Password** — change, verify-current, generate
- **Phone/email verification** — request, resend, confirm (BR-UM-36 self-edit OTP flow)
- **Existence check** — `POST /user/exist` (case-insensitive username)

## File layout

```
Falcon.Identity.Api/Endpoints/Users/
├── UserEndpointGroup.cs                       Group("/user") + RequireAuthorization() default
├── CreateUserEndpoint.cs                      POST   /api/user/
├── GetMyProfileEndpoint.cs                    GET    /api/user/me
├── GetUserByIdEndpoint.cs                     GET    /api/user/{id}
├── ListNodeUsersEndpoint.cs                   GET    /api/user/
├── ListTenantUsersEndpoint.cs                 GET    /api/user/by-tenant         (east-west)
├── GetUserCountEndpoint.cs                    GET    /api/user/count             (east-west)
├── UpdateMyProfileEndpoint.cs                 PUT    /api/user/profile
├── UpdateUserProfileByIdEndpoint.cs           PUT    /api/user/{id}/profile
├── UpdateUserRoleByIdEndpoint.cs              PUT    /api/user/{id}/role
├── ChangeUserStatusEndpoint.cs                PUT    /api/user/status
├── ChangePasswordEndpoint.cs                  PUT    /api/user/change-password
├── VerifyPasswordEndpoint.cs                  POST   /api/user/verify-password
├── GeneratePasswordEndpoint.cs                POST   /api/user/generate-password (AllowAnonymous)
├── UserExistEndpoint.cs                       POST   /api/user/exist
├── RequestEmailVerificationEndpoint.cs        POST   /api/user/me/verify-email
├── ResendEmailVerificationEndpoint.cs         POST   /api/user/me/verify-email/resend
├── ConfirmEmailVerificationEndpoint.cs        POST   /api/user/me/verify-email/confirm
├── RequestPhoneVerificationEndpoint.cs        POST   /api/user/me/verify-phone
├── ResendPhoneVerificationEndpoint.cs         POST   /api/user/me/verify-phone/resend
├── ConfirmPhoneVerificationEndpoint.cs        POST   /api/user/me/verify-phone/confirm
└── Validators/                                One AbstractValidator<T> per mutation DTO
```

(20 endpoint files in current main; was 19 before `CreateUserEndpoint.cs` was added — see correction below.)

## Base route + group config

```csharp
public class UserEndpointGroup : Group
{
    public UserEndpointGroup()
    {
        Configure("user", ep =>
        {
            ep.Description(x => x.WithTags("Users"));
            ep.Options(x => x.RequireAuthorization());   // group-level auth default
        });
    }
}
```
[CODE] `Endpoints/Users/UserEndpointGroup.cs:9-19`

Effective prefix: `/api/user/*`. Every endpoint here is JWT-protected by default; `GeneratePasswordEndpoint`
explicitly calls `AllowAnonymous()` to override.

## Correction to service-level dossier

The service-level [`ENDPOINT_REGISTRY.md`](../../ENDPOINT_REGISTRY.md) said: "no FastEndpoints route observed for `CreateUserRequest`".
This is **wrong as of current main**. `CreateUserEndpoint.cs` exists with `Post("/")` route, so the endpoint
is **POST /api/user/** (slash-suffixed). Returns HTTP 201 Created on success.

Service-level registry should be updated to add this row.

## Authorization (per endpoint)

| Endpoint                        | Auth                    | Notes |
|---|---|---|
| `POST /` (CreateUser)           | RequireAuth (group)     | Falcon callers can supply `TenantId`; Client callers use JWT tenant only |
| `GET /me`                       | RequireAuth             | Uses `currentUser.UserId` from JWT |
| `GET /{id}`                     | RequireAuth             | Falcon can see soft-deleted (`IncludeDeleted`); Client gets tenant-scoped result |
| `GET /`                         | RequireAuth             | Tenant scoping + role-scoping enforced inside `ListNodeUsersHandler` |
| `GET /by-tenant`                | RequireAuth             | East-west; meant for Commerce / Gateways. No explicit FalconOnly policy. |
| `GET /count`                    | RequireAuth             | East-west; same. |
| `PUT /profile`                  | RequireAuth             | Self-edit only |
| `PUT /{id}/profile`             | RequireAuth             | Admin-edit path |
| `PUT /{id}/role`                | RequireAuth             | Admin-only — handler asserts tenant scope |
| `PUT /status`                   | RequireAuth             | Admin action |
| `PUT /change-password`          | RequireAuth             | Authenticated, requires `OldPassword` |
| `POST /verify-password`         | RequireAuth             | "Confirm with password" pattern |
| `POST /generate-password`       | **AllowAnonymous**       | Helper for password generators / pre-auth forms |
| `POST /exist`                   | RequireAuth             | Username uniqueness check |
| `POST /me/verify-*` (6 endpoints) | RequireAuth           | Self-verify only; admin-edit path follows different mechanic — see BR-UM-36 note below |

## Domain policies invoked

| Policy                              | Where it fires |
|---|---|
| `UserRolePolicy.IsValid(...)`       | `CreateUserProcess.cs:35`, `UpdateUserRoleHandler.cs:31` — role/user-type compatibility |
| `UserRolePolicy.ValidateClientUserContext(...)` | `CreateUserProcess.cs:42` — TenantId + NodeId required for Client users |
| `UserRolePolicy.GetRoleFromRoleKey(...)` | `UpdateUserRoleHandler.cs:30`, validator + `ResolveRequestedRole` in `CreateUserEndpoint.cs:21` |
| `UserQuotaPolicy.ValidateNormalUserLimit(...)` | `CreateUserProcess.cs:53` — only on Normal users (per tenant `MaxNormalUserLimit`) |
| `UserEditPolicy.ValidateForProfileEdit(...)`   | `UpdateUserProfileHandler.cs:27` — blocks Suspended/Locked/Deleted; blocks self-edit of Pending |
| `UserEditPolicy.ValidateForRoleEdit(...)`      | `UpdateUserRoleHandler.cs:26` — blocks Suspended/Locked/Deleted + self-edit |
| `UserStatusTransitionPolicy.Validate(...)`    | `ChangeUserStatusProcess.cs:25` — legal status machine + Falcon-only restore from Deleted |
| `PasswordPolicy.Validate(...)`                | `ChangePasswordHandler.cs:24` — Zitadel-floor rules |
| `PasswordPolicy.Generate(...)`                | `CreateUserProcess.cs:62` — auto-generated if `command.Password` is null |
| `ProfileImagePolicy.ValidateAndDecode(...)`   | `CreateUserProcess.cs:72`, `UpdateUserProfileHandler.cs:39` |
| `VerificationRateLimitPolicy.Validate(...)`   | `RequestEmailVerificationHandler.cs:52-54`, `RequestPhoneVerificationHandler.cs:52-54` |

## Kafka events

| Event                                       | When                          | Channel |
|---|---|---|
| `UserCredentialsGeneratedDomainEvent`       | After successful user creation | SMS+Email — credentials delivery |
| `EmailCodeGeneratedDomainEvent`             | Email verification OTP         | Email |
| `SmsCodeGeneratedDomainEvent`               | Phone verification OTP         | SMS |

(Also `IAccessRoleLinkClient.SyncPrimaryRoleAsync` — a gRPC call to PES service, **not** a Kafka event.)

## Webhook coupling

`UserController` writes user state to MongoDB on every mutation **and** invalidates the user-status
HybridCache key (`CacheKeys.UserStatus(identityUserId)`). The status cache is the same one that
`ZitadelWebhookEndpoint` invalidates on inbound Zitadel events — so admin actions and webhook
events converge on the same cache key.

[CODE] `ChangeUserStatusProcess.cs:72` calls `cache.RemoveAsync(...)`.

## Key collaborators

| Component | Role |
|---|---|
| `IIdentityManager` (Zitadel facade) | Create/Update/Lock/Deactivate/Reactivate/etc., set metadata, set/resend email/phone codes |
| `IUserRepository`, `IRepository<User>` | Mongo CRUD with soft-delete semantics |
| `IRepository<TenantSettings>` | reads tenant password level + `MaxNormalUserLimit` |
| `ICurrentUser` | JWT-derived `UserId, TenantId, NodeId, UserType` |
| `IUserAggregator` | composite read used by list + count endpoints |
| `IAccessRoleLinkClient` | gRPC client to PES (`falcon-core-access-svc`) for default role link sync |
| `VerificationSessionCache` | HybridCache for email/phone OTP sessions |
| `HybridCache` (direct) | `user-status:{identityUserId}` invalidation |
| `IPublisher` (Mediator) | Domain events → SMS/Email handlers |

## Code smells / findings

1. **BR-UM-21 is NOT enforced.** PRD-02 says "reject save when Email AND Phone modified together".
   [CODE] `UpdateUserProfileHandler.cs:20-73` computes `emailChanged` and `phoneChanged` independently
   and applies both. There is no validator or domain-policy check that throws when both flip in the
   same request. **Open gap.** Either deliberate (handler returns `RequiresPhoneVerification=true`
   AND `RequiresEmailVerification=true` so FE drives the OTP flow for each), or the PRD rule isn't
   yet implemented.

2. **BR-UM-19 (username immutable) is enforced by omission, not assertion.** `UpdateUserProfileRequest`
   has no `Username` field; the field cannot be sent. Good. But this is also true for
   `UpdateUserProfileByIdRequest`. Both DTOs lack `Username`, so the rule holds. If a future DTO
   reintroduces `Username`, the rule silently breaks — there's no assertion in policy.

3. **`UpdateUserProfileHandler` does NOT check BR-UM-36 admin-edit OTP flow.** Q-UM-13 OPEN.
   When admin edits another user's email/phone via `PUT /{id}/profile`, current code applies the
   change but only flags `Requires*Verification = true` when `user.Status == Active`. The OTP itself
   (`/me/verify-email`, etc.) is keyed off `currentUser.UserId` — i.e. **always self-verify**. There
   is no path for "admin edits user X's email → user X receives OTP to confirm". The admin's edit
   sets the new email immediately in Zitadel via `UpdateUserProfileAsync` (line 41-42), marking
   `IsEmailVerified=false`. The user is expected to log in later and verify via their own
   `/me/verify-email` flow. **This is the admin-edit OTP path — confirmed by code.** See VALIDATIONS.md.

4. **`ChangeUserStatusEndpoint` allows status changes via `PUT /status` with the target UserId in the body**, not the route. There is also `ChangeUserStatusByIdRequest` (declared in [CODE] `Models/ChangeUserStatusByIdRequest.cs`) which expects route-bound id — but **no endpoint binds to it**. Dead DTO.

5. **`GetUserCountEndpoint` and `ListTenantUsersEndpoint` are anonymous-feeling but RequireAuth.**
   They are explicitly "east-west" yet the group requires JWT. Either the calling Gateway/service
   forwards a service-account JWT, or these never get called by anonymous east-west callers.

6. **`UpdateUserProfileHandler` allows admins to edit Suspended/Locked/Deleted users only if `UserEditPolicy.ValidateForProfileEdit` is wired to allow that for `currentUser.UserType == Falcon`** — but the policy doesn't distinguish. Currently a Falcon admin **cannot** profile-edit a Locked user → returns `UserLockedCannotEdit`. This is by-design but the wording "cannot edit a locked user" is ambiguous if admin operations should be exempt. Verify intent with PM.

## Files in this drill-down

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
