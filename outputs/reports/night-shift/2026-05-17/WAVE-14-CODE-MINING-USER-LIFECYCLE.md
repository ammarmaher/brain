# WAVE 14 — CODE MINING — USER LIFECYCLE

**Scope**: Identity service (`falcon-core-identity-svc`) + Commerce hooks. Feed for Vol 47 User Lifecycle Specialist Guide.
**Root**: `C:\Falcon\Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\` (Identity), `C:\Falcon\Falcon\falcon-core-commerce-svc\src\` (Commerce).
**Date**: 2026-05-18.

---

## §1 User entity model

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Domain\Entities\User.cs:8`: `User : IBaseEntity, ITenantEntity, ICreationInfo, ISoftDeletion, IUpdationInfo` — single aggregate root. Stored in MongoDB collection `"Users"` in `FalconIdentityDb` (header comment line 5).
[CODE] `User.cs:10-72`: BSON fields — `Id` (ObjectId), `NodeId`, `TenantId` (required), `NationalId`, `FirstName`, `LastName`, `Username`, `Email`, `PhoneNumber`, `Role` (`eUserRoles`, required), `UserType` (`eUserType`), `Status` (`eUserStatus`, defaults `Pending`), `IsPhoneVerified`, `IsEmailVerified`, `PermissionGroupId`, `IdentityUserId` (Zitadel link), `Image` (byte[]), `ImageExtension`, `Path` (hierarchy path).
[CODE] `User.cs:77-107`: Audit fields — `CreatedAt`, `CreatedBy`, `IsDeleted` (default false), `DeletedBy`, `DeletedAt`, `UpdatedAt`, `UpdatedBy`. Soft-delete is a flag, NOT a status.
[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Infrastructure\Persistence\UserAggregator.cs:12`: `_collection = _database.GetCollection<User>("Users")` — confirms collection name.
[CODE] **Commerce side has NO User entity**. Searched `falcon-core-commerce-svc/src/Falcon.Commerce.Domain/Entities/` — only `Application`, `CommunicationChannel`, `Contract`, `Node`, `Order`, `Settings`, `Tenant`, `Lookup`. Commerce publishes `UserCreationRequestedEvent` to Kafka; Identity owns the User aggregate. **CONFIRMS US-TT-01 (Identity is system of record).**
[CODE] `Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Application\Events\UserCreationRequestedEvent.cs:1-28`: Commerce → Identity Kafka event (carries `FirstName, LastName, Username, EncryptedPassword (AES-256-GCM), Role, UserType, NodeId, TenantId, Path, DeliveryMethod, ProfilePictureBase64`).

## §2 The 5 statuses

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Domain\Constants\Enums.cs:55-62`: `enum eUserStatus { Pending = 1, Active = 2, Suspended = 3, Locked = 4, Deleted = 5 }`. **Note ordering**: Locked=4, Deleted=5 (NOT 3/4/5 alphabetical). **CONFIRMS US-TT-02 (5 statuses, 1-indexed).**
[CODE] `Enums.cs:5-10`: `enum ePasswordSecurityLevel { Normal = 1, Advanced = 2 }` — 2-tier confirmed.
[CODE] `Enums.cs:14-24`: `enum eUserRoles { SystemAdministrator=1, Product=2, Operation=3, AccountOwner=4, NodeAdmin=5, NormalUser=6 }`.
[CODE] `Enums.cs:29-40`: `enum eUserType { Falcon=1, Client=2 }`.
[CODE] `Enums.cs:55-62`: `User.Status` defaults to `Pending` in entity (`User.cs:51`).

## §3 Transition guards

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Domain\Policies\UserStatusTransitionPolicy.cs:16-40` — **the canonical state machine**:
```
Pending   → { Active, Locked }
Active    → { Suspended, Deleted, Locked }
Suspended → { Active }
Locked    → { Pending }   ← unlock restores to Pending, NOT Active
Deleted   → { Active }     ← restore (Falcon-only, see below)
```
Invalid transition → `FalconException(FalconKeys.Error.InvalidStatusTransition)` with detail `"Cannot transition from '{currentStatus}' to '{newStatus}'."`.
[CODE] `UserStatusTransitionPolicy.cs:35-39`: **Deleted→Active restricted to Falcon users** — `if (currentStatus == eUserStatus.Deleted && newStatus == eUserStatus.Active && performedByUserType != eUserType.Falcon) throw FalconKeys.Error.OnlyFalconUserCanRestoreDeletedUser`.
[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Users\UseCases\ChangeUserStatusProcess.cs:14-78` — command handler:
- Line 20: `effectiveStatus = user.IsDeleted ? eUserStatus.Deleted : user.Status` — IsDeleted flag wins over Status.
- Line 23: throw `UserAlreadyInStatus` if no-op.
- Line 25: calls `transitionPolicy.Validate(effectiveStatus, command.NewStatus, currentUser.UserType)`.
- Lines 27-48: dispatches Zitadel side effect per transition — `Suspended`→`DeactivateUserAsync`, `Suspended→Active`→`ReactivateUserAsync`, `Locked`→`LockUserAsync`, `Locked→Active|Pending`→`UnlockUserAsync`, `Deleted`→`DeactivateUserAsync`, `Deleted→Active`→`ReactivateUserAsync`.
- Lines 50-69: on `Deleted` calls `userRepository.DeleteAsync` (soft-delete via `ISoftDeletion`); otherwise `UpdateOneAsync` with new Status, and **clears** `IsDeleted/DeletedAt/DeletedBy` when restoring from deleted.
- Line 72: `cache.RemoveAsync(CacheKeys.UserStatus(user.IdentityUserId!))` — invalidates the status cache key.

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Endpoints\Users\ChangeUserStatusEndpoint.cs:14`: HTTP route `PUT /user/status` body `{ UserId, NewStatus }`.
[CODE] **Pending→Locked** path: `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Auth\UseCases\LoginProcess.cs:51-57` — Zitadel auto-locks after N failed pwd attempts; Identity writes `Status = Locked` directly via `userRepository.UpdateStatusAsync`. `UserStatusTransitionPolicy.Validate` is **bypassed** for this path because the lock is reflexive (Zitadel told us; we mirror).
[CODE] **Locked→Pending** explicit support: `ChangeUserStatusProcess.cs:39-40` `eUserStatus.Pending when effectiveStatus == eUserStatus.Locked => UnlockUserAsync`. **CONFIRMS US-TT-03 (locked unlock returns to Pending, requiring fresh first-login).**

## §4 Can-Login matrix

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Domain\Policies\LoginEligibilityPolicy.cs:14-26`:
```
Locked    → throw UserLocked
Suspended → throw UserSuspended
Deleted   → throw InvalidCredentials  (NOT UserDeleted — leaks less info)
Pending   → allowed (first-login flow)
Active    → allowed
```
[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Auth\UseCases\LoginProcess.cs:35`: `loginPolicy.Validate(user.Status)` — called immediately after `GetByUsernameAsync`. **CONFIRMS US-TT-04 (Pending+Active can login; Suspended/Deleted/Locked rejected at login).**
[CODE] `LoginProcess.cs:40`: `isFirstLogin = user.Status == eUserStatus.Pending` — Pending users always get OTP path regardless of `OtpRequiredOnLogin` config (line 41).
[CODE] `LoginProcess.cs:62`: `requiresPasswordChange = passwordResult.RequiresPasswordChange || user.Status == eUserStatus.Pending` — Pending status always forces password change at login.

## §5 Forget-Password gate

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Auth\UseCases\ForgotPasswordProcess.cs:26-37`:
- Line 26: `GetAsync(u => u.Username == command.Username && !u.IsDeleted)` — deleted users invisible.
- Line 28: throws `InvalidUsernameOrPhone` if user not found.
- Line 30: throws `InvalidUsernameOrPhone` if PhoneNumber doesn't match command's PhoneNumber.
- Line 33: `loginPolicy.Validate(user.Status)` — rejects Locked/Suspended/Deleted.
- Lines 35-36: **EXTRA gate** — `if (user.Status == eUserStatus.Pending) throw new FalconException(FalconKeys.Error.UserPending);`
**Result**: ForgotPassword allowed only when `Status == Active`. **CONFIRMS US-TT-04 (Forget-Password restricted to Active users only).**

## §6 OTP / 2FA

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Auth\UseCases\LoginProcess.cs:40-47`:
- `isFirstLogin = user.Status == eUserStatus.Pending`
- `otpRequired = isFirstLogin || securityOptions.Value.OtpRequiredOnLogin` — tenant/global config (`SecurityOptions`).
- Calls either `LoginWithPasswordAndOtpChallengeAsync` or `LoginWithPasswordOnlyAsync`.

[CODE] `LoginProcess.cs:90-115` (multi-step session):
- Session ID = `GlobalHelper.NewGuid()`, persists `AuthenticationSession` in HybridCache (Redis+L1) keyed by SessionId for 10 min (`AuthSessionCache.cs:11-13`).
- Lines 110-115: if OTP required and SMS, publishes `SmsCodeGeneratedDomainEvent(user.PhoneNumber, otpCode)`. Email OTP also supported but only SMS event observed in LoginProcess. (`Auth\DomainEvents\EmailCodeGeneratedDomainEvent.cs` exists.)

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Auth\UseCases\VerifyOtpProcess.cs:18-46`:
- Loads session, must be in `OtpPending` stage (line 20).
- Calls `identityManager.VerifyOtpAsync(externalSessionId, externalSessionToken, code, session.RequiredOtpType)`.
- Lines 27-30: if Zitadel reports lock → `LockUserAsync` writes `Status=Locked` to MongoDB and throws `UserLocked`.
- Lines 38-43: if RequiredOtpType is SMS (`null or "otpSms"`), set `IsPhoneVerified = true`.
- Lines 49-62 `ResolveFlowAsync`: ForgotPassword → `PasswordResetPending`; else if `RequiresPasswordChange` → `PasswordChangeRequired`; else complete (`Authenticated` + tokens).

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Auth\UseCases\ResendOtpProcess.cs:24-71`:
- Line 31-35: `if (session.ResendAttempts >= security.MaxResendAttempts) → LockUserAsync + throw OtpResendLimitExceeded` — locks user via Zitadel; webhook syncs MongoDB Status=Locked.
- Lines 38-42: if OTP still valid (within `zitadelOptions.Value.Otp.ExpirySeconds`), throws `OtpStillValid`.

[CODE] **OTP method**: `eDeliveryMethod { Email=1, Sms=2, Both=3 }` (`Enums.cs:45-50`). OTP type carried via `session.RequiredOtpType` (Zitadel string `"otpSms" | "otpEmail" | "totp"`).
[CODE] **Admin OTP vs regular user OTP — NOT differentiated** in code. `OtpRequiredOnLogin` is a single global flag in `SecurityOptions` (`Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Infrastructure\Security\SecurityOptions.cs`). The hint Q-UM-13 (admin vs user OTP) is **NOT IMPLEMENTED**.
[CODE] **Tenant settings sync** (Q-UM-13 hint context): `TenantSettings.cs:9-49` — synced from Commerce via Kafka topic `commerce.identity-settings-sync.v1` (see §13). TenantSettings has `PasswordSecurityLevel`, `MaxNormalUserLimit`, `MaxSystemUserLimit`, `AllowedIps`. **No per-tenant OTP toggle present** — OTP is global. This is a gap vs Q-UM-13.

## §7 Soft-delete (IncludeDeleted, PR #40937)

[CODE] `User.cs:86-97`: `IsDeleted` (bool default false), `DeletedBy`, `DeletedAt` — soft-delete is a flag.
[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Users\Queries\ListNodeUsersQuery.cs:8-19`: `IncludeDeleted` query parameter on `ListNodeUsersQuery`.
[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Endpoints\Users\ListNodeUsersEndpoint.cs:33`: `IncludeDeleted: req.IncludeDeleted` — passed through from HTTP request.
[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Users\UseCases\ListNodeUsersHandler.cs:42-43`: **Falcon-only strip** — `if (currentUser.UserType != eUserType.Falcon && statuses is { Count: > 0 }) statuses = statuses.Where(s => s != eUserStatus.Deleted).ToList()`. Clients cannot even **filter** by Deleted status.
[CODE] `ListNodeUsersHandler.cs:55`: **`includeDeleted = currentUser.UserType == eUserType.Falcon && query.IncludeDeleted`** — only Falcon users can pass true. Client `IncludeDeleted=true` is silently coerced to false.
[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Infrastructure\Persistence\UserAggregator.cs:29-31`: `var filter = includeDeleted ? filterBuilder.Empty : filterBuilder.Eq(u => u.IsDeleted, false);` — query filter respects flag. **`IsDeleted` flag is the filter; eUserStatus.Deleted is just a derived status displayed downstream.**
[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Endpoints\Users\GetUserByIdEndpoint.cs:20-31`: same Falcon-only `IncludeDeleted` gate — Falcon can see deleted users; Clients always get `!u.IsDeleted` filter.
[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Endpoints\Webhooks\ZitadelWebhookEndpoint.cs:95`: webhook also enforces `&& !u.IsDeleted` on the user lookup — deleted users do NOT receive webhook status updates from Zitadel.
[CODE] `ChangeUserStatusProcess.cs:50-53`: `if (command.NewStatus == eUserStatus.Deleted) await userRepository.DeleteAsync(u => u.Id == command.UserId, currentUser.UserId)` — soft-delete via `ISoftDeletion` repository helper. (Sets `IsDeleted=true`, `DeletedAt=now`, `DeletedBy=currentUser`.)
[CODE] `ChangeUserStatusProcess.cs:61-66`: **Restore path** clears `IsDeleted, DeletedAt, DeletedBy` when transitioning Deleted→Active (Falcon-only).

**Note**: `eUserStatus.Deleted` value exists but is **derived from `IsDeleted` flag** during reads (`ChangeUserStatusProcess.cs:20` `effectiveStatus = user.IsDeleted ? eUserStatus.Deleted : user.Status`). The Status field itself often retains the pre-delete value (e.g. Active) and only `IsDeleted=true` is set. Code that reads the user must compute effective status from IsDeleted.

## §8 Counted in User Limit (Q-UM-19)

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Users\UseCases\CreateUserProcess.cs:48-54`: **Quota check happens only for `eUserRoles.NormalUser`**.
```csharp
if (command.Role == eUserRoles.NormalUser)
{
    var settings = await settingsRepository.GetAsync(s => s.TenantId == tenantId);
    var normalUserCount = (int)await userRepository.CountAsync(
        u => u.TenantId == tenantId && u.Role == eUserRoles.NormalUser && !u.IsDeleted);
    quotaPolicy.ValidateNormalUserLimit(settings?.MaxNormalUserLimit, normalUserCount);
}
```
**Filter is `!u.IsDeleted` ONLY — every Status counts (Pending, Active, Suspended, Locked) so long as IsDeleted is false.** Soft-deleted users do NOT count.
[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Infrastructure\Persistence\UserAggregator.cs:103-112` `CountUsersByRolesAsync`: same `!u.IsDeleted` filter, optional role IN list. Used by `GET /user/count` endpoint (`GetUserCountEndpoint.cs:29`).
[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Domain\Policies\UserQuotaPolicy.cs:15-23`: `ValidateNormalUserLimit(maxNormalUserLimit, currentNormalUserCount)`. If `max is null or 0` → no limit; else if `current >= max` → throws `NormalUserLimitReached`.
[CODE] **`MaxSystemUserLimit` is loaded** (`TenantSettings.cs:36`) but **never enforced anywhere in the code**. SystemUserLimit is defined but unused — gap for Vol 47.

## §9 Password security level

[CODE] `Enums.cs:5-10` — 2 tiers confirmed: `Normal=1, Advanced=2`. **CONFIRMS US-TT (2-tier).**
[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Domain\Policies\PasswordPolicy.cs:9-87` — **single policy regardless of level**:
- `Generate(level)`: 12 chars, guaranteed 1 upper, 1 lower, 1 digit, 1 symbol; Fisher-Yates shuffled. Level parameter has comment "Reserved for future Advanced-only rules (history, reuse, etc.). Has no effect on generation today."
- `Validate(password, level?)`: min 8 chars; requires upper, lower, digit, special (non-letter-non-digit). Same for both Normal+Advanced — see header `<summary>` "every password — regardless of level — must satisfy this Zitadel floor".
**Advanced is currently a no-op label** — both tiers enforce identical baseline. (Comment: "Advanced will layer extra rules (history, reuse, etc.) in the future".)

## §10 IP allowlist

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Infrastructure\Security\IpAllowlistGuard.cs:12-56` — Identity-side guard:
- Loads `TenantSettings.AllowedIps` via HybridCache (5 min L2, 2 min L1, key `CacheKeys.TenantIpAllowlist(tenantId)`).
- Null/empty allowedIps = no restriction.
- Validates clientIp against exact match or CIDR (IPNetwork.TryParse).
- IPv4-mapped IPv6 normalized to IPv4 (line 42).
- Throws `FalconKeys.Error.IpNotAllowed` on miss.

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Endpoints\Auth\PreProcessors\IpAllowlistPreProcessor.cs:10-38` — FastEndpoints PreProcessor pattern. Resolves tenant via `eTenantResolutionStrategy` (`ByUsername | BySessionId | ByUserId`). Skips check if tenant cannot be resolved (line 33: "endpoint logic will handle user-not-found etc.").

[CODE] Used on: `LoginEndpoint.cs:20` (ByUsername), `ForgotPasswordEndpoint.cs:20` (ByUsername), `ForgotPasswordSetPasswordEndpoint.cs:20` (BySessionId — inferred from request shape).
[CODE] Request signals participation via `IIpAllowlistProtected` interface on the DTO — see `LoginRequest.cs:8-12`, `ForgotPasswordRequest.cs:8-12`.

[CODE] **Gateway-side enforcement** (BOTH layers): `Falcon\falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\Middleware\TenantIpAllowlistMiddleware.cs:14-80`. Checks authenticated requests against per-tenant cached allowlist sourced from Commerce; reads `ZitadelClaimTypes.TenantId` from JWT (line 42); supports IPv4-mapped-IPv6, kill-switch via `_settings.Enabled`, Commerce HTTP fallback on cache miss (line 79). Pre-auth login/forgot-password run through Identity's `IpAllowlistPreProcessor`; post-auth API calls also pass through gateway's allowlist middleware.

## §11 Zitadel integration

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Infrastructure\Identity\Services\ZitadelIdentityManagerFacade.cs:12-100`: Facade implementing `IIdentityManager`. Delegates to 8 granular services:
- `IZitadelUserService` — CreateUser, GetUser, SearchUsers, DeleteUser, UpdateProfile, **LockUser, UnlockUser, DeactivateUser, ReactivateUser**.
- `IZitadelSessionService` — CreateSession, GetSession, ListSessions, UpdateSession, DeleteSession.
- `IZitadelAuthService` — CreateAuthRequest, ExchangeSessionForToken, RefreshToken, IntrospectToken, RevokeToken, GetUserInfo, EndSession.
- `IZitadelPasswordService` — ChangePassword, SetPassword, **SetupFirstLoginPassword**, VerifyPassword.
- `IZitadelOtpService` — RegisterOtpSms/Email, RegisterTotp, Remove*, **LoginWithPasswordAndOtpChallenge / LoginWithPasswordOnly**, VerifyOtp, ResendOtp.
- `IZitadelMetadataService`, `IZitadelAdminService`, `IZitadelVerificationService`.

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Endpoints\Webhooks\ZitadelWebhookEndpoint.cs:14-145` — receives Zitadel callbacks, route `POST /zitadel`. Signature-verified via `ZitadelWebhookSignatureVerifier.Verify(signingKey, signature, body)` (line 37).
[CODE] `ZitadelWebhookEndpoint.cs:102-143`: Webhook → MongoDB status map:
```
UserLocked       → Status = Locked
UserUnlocked     → Status = Active        (NOTE: NOT Pending — webhook contradicts ChangeUserStatusProcess which sets Locked→Pending)
UserDeactivated  → Status = Suspended
UserReactivated  → Status = Active
EmailVerified    → IsEmailVerified = true
PhoneVerified    → IsPhoneVerified = true
```
**Discrepancy flag**: webhook `UserUnlocked` writes `Status=Active` (line 112) but `ChangeUserStatusProcess` line 39 routes `Locked→Pending`. If admin unlocks via `PUT /user/status` with NewStatus=Pending, the policy validates (line 23 says Locked → Pending), then dispatches `UnlockUserAsync`, which fires the webhook, which then OVERWRITES with `Status=Active`. **This is a latent bug** — the webhook's Status mapping is not aware of the desired target.

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Users\UseCases\CreateUserProcess.cs:65-92`: Zitadel-first creation — Zitadel `CreateUserAsync` returns IdentityUserId; then local User persisted with `IdentityUserId` linked. Metadata mirrored (`UserId, UserType, TenantId, NodeId`) via `SetUserMetadataBulkAsync` (line 103) so JWT claims transformation populates them on login.
[CODE] `CreateUserProcess.cs:209-250` — **rollback on failure**: deletes local user + calls `DeactivateUserAsync` on Zitadel.

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Infrastructure\Messaging\Kafka\UserCreationRequestedConsumer.cs:135-266`: Kafka path — Commerce→Identity. Decrypts AES-256-GCM password (line 173), provisions in Zitadel, persists locally with `Status=Pending`. Idempotency check (line 163) on Username.

## §12 Session management

[CODE] **Sessions live in Zitadel.** `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Auth\UseCases\LoginProcess.cs:37-38`: `authRequestId = CreateAuthRequestAsync()`, `(externalSessionId, externalSessionToken) = CreateSessionAsync(username)`. Tokens are OIDC (`AccessToken, RefreshToken, IdToken, ExpiresIn` — see `AuthenticatedResult.cs`).
[CODE] `LoginProcess.cs:67-69` & `VerifyOtpProcess.cs:86`: `ExchangeSessionForTokenAsync(authRequestId, externalSessionId, externalSessionToken)` issues OIDC tokens once stage reaches `Authenticated`.
[CODE] **Authentication session (the MFA flow state)** lives in HybridCache (Redis L2 + memory L1). `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Auth\Models\AuthenticationSession.cs:7-25`: `SessionId, Username, UserId, IdentityUserId, TenantId, ExternalSessionId, ExternalSessionToken, AuthRequestId, Stage, FlowType, RequiresPasswordChange, RequiredOtpType, PhoneNumber, OtpGeneratedAt, ResendAttempts, CreatedAt`.
[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Auth\Services\AuthSessionCache.cs:11-13`: TTL = 10 minutes.
[CODE] **Refresh**: `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Auth\UseCases\RefreshTokenHandler.cs:12-26` — `identityManager.RefreshTokenAsync(refreshToken)`; on failure throws `InvalidRefreshToken`.
[CODE] **Logout**: `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Auth\UseCases\LogoutHandler.cs:12-25` — `RevokeTokenAsync(refreshToken, "refresh_token")`. Failure logged but proceeds (line 20).
[CODE] **Session revocation on password change**: `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Users\UseCases\ChangePasswordHandler.cs:37-55` — after `ChangePasswordAsync`, iterates `ListSessionsAsync` and calls `DeleteSessionAsync` for any session whose `Factors.User.Id == identityUserId`. Failure logged, "tokens will expire naturally".
[CODE] **UserStatus cache (different)**: `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Endpoints\Security\CheckUserStatusEndpoint.cs:21-29` — `GET /security/user-status/{IdentityUserId}` returns cached `UserStatusResponse(UserId, Status, IsActive)`. Cached at `CacheKeys.UserStatus(identityUserId)`. Invalidated on status change (`ChangeUserStatusProcess.cs:72`), Zitadel webhook (`ZitadelWebhookEndpoint.cs:78`), and OTP-locked path (`LoginProcess.cs:54`).

## §13 Tenant settings sync (Commerce → Identity)

[CODE] `Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Application\Events\TenantIdentitySettingsSyncEvent.cs:1-14`: Commerce-side event shape — `TenantId, PasswordSecurityLevel, MaxNormalUserLimit, MaxSystemUserLimit, AllowedIps?, Context?`.
[CODE] `Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Domain\Entities\Settings\Settings.cs:7-25`: Commerce-side `Settings` entity, has `OwnerId`, `SecuritySettings`, `QuotaSettings`, `WalletSettings`. `OwnerId` is the tenant root nodeId.
[CODE] `Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Domain\Entities\Settings\SecurityConfiguration.cs:11-47`: `PasswordSecurityLevel` (default Normal), `AllowedIps`. **`SetAllowedIps` validates IP parsing** (line 42); rejects invalid IPs with `InvalidIpAddress`.
[CODE] `Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Domain\Entities\Settings\QuotaConfiguration.cs:11-48`: `MaxNormalUserLimit`, `MaxSystemUserLimit`, `MaxNodeLevels`, `BalanceTransferLimitPercentage`. Negative values rejected (`InvalidAccountLimits`).

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Infrastructure\Messaging\Kafka\IdentitySettingsSyncConsumer.cs:12-192`: Kafka topic `kafka.Topics.IdentitySettingsSync` (configured as `commerce.identity-settings-sync.v1`). Upserts `TenantSettings` MongoDB doc on each event (lines 129-156). **Invalidates `CacheKeys.TenantIpAllowlist(tenantId)`** so IP changes take effect immediately (line 159).
[CODE] `IdentitySettingsSyncConsumer.cs:113-125`: Bridges `EventContext` → `IAuditContextAccessor.Context` so audit logger attributes the change.

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Domain\Entities\TenantSettings.cs:9-49`: target schema — `Id, TenantId (required), PasswordSecurityLevel, MaxNormalUserLimit, MaxSystemUserLimit, AllowedIps?, UpdatedAt?`. Collection `"TenantSettings"`. **Lean projection** — only what Identity needs for password validation, quota check, and IP allowlist.

[CODE] **Other Commerce→Identity event**: `UserCreationRequestedEvent` (see §1, §11) — request to create user from Commerce, with AES-256-GCM encrypted password.

## §14 Audit log

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Domain\Entities\AuditLog.cs:7-60`: collection `AuditLogs`, fields `TenantId, EntityType, EntityId, Action (Created|Updated|Deleted), Changes?, Snapshot?, PerformedBy, PerformedByName, PerformedAt (UTC), IpAddress, UserAgent, HttpMethod, RequestUrl`.
[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Application\Abstractions\IAuditLogger.cs:6-22`: `LogCreatedAsync, LogUpdatedAsync (with List<AuditChange>), LogDeletedAsync`.
[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Infrastructure\Persistence\MongoAuditLogger.cs:10-50`: writes to `AuditLogs` collection. Sources actor from `ISessionProvider` (HTTP) or `IAuditContextAccessor` (Kafka context — bridged by consumers).
[CODE] `Enums.cs:98-103`: `enum eAuditAction { Created=1, Updated=2, Deleted=3 }`.
[CODE] `AuditChange.cs` (not read in detail) — field-level before/after diff structure.
[CODE] **Status change audit is implicit** — `UpdateOneAsync` on the User repository should trigger `LogUpdatedAsync` via a repository wrapper (not explicitly verified in this pass; pattern is repository-driven, not handler-driven). The `ChangeUserStatusProcess.cs` does not directly call `IAuditLogger` — it relies on the repository to emit audit events.

## §15 Errors (FalconError codes)

[CODE] `Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Domain\Constants\FalconKeys.cs:7-180` — `FalconKeys.Error` static class. All codes are `nameof()` self-references (string = const name).

**User domain**:
- `UserNotFound` (line 18)
- `DuplicateUsername` (19)
- `InvalidPassword` (22), `PasswordTooShort` (23), `PasswordRequiresUppercase/Lowercase/Digit/SpecialChar` (24-27)
- `CreateIdentityUserFailed` (28)
- `InvalidRoleForUserType` (30)
- `FalconUserMustNotHaveTenantId` (31)

**Edit gates** (per status):
- `UserSuspendedCannotEdit` (37), `UserLockedCannotEdit` (38), `UserDeletedCannotEdit` (39)
- `PendingSelfEditBlocked` (40), `SelfEditRoleNotAllowed` (41)

**Verification**:
- `PhoneVerificationFailed, EmailVerificationFailed, InvalidVerificationCode, PhoneAlreadyVerified, EmailAlreadyVerified, VerificationCodeExpired` (60-65)

**Status / Quota**:
- `InvalidStatusTransition` (71)
- `NormalUserLimitReached` (72)
- `UserAlreadyInStatus` (73)
- `OnlyFalconUserCanRestoreDeletedUser` (74)

**Authentication**:
- `InvalidCredentials` (80) — also used for Deleted login attempts (info leak prevention)
- `Unauthorized, Forbidden` (81-82)
- `UserAlreadyExists, UserLocked, UserSuspended, UserPending` (83-86)
- `UserNotInitialized` (87) — apparently unused in code searched
- `OtpStillValid, OtpResendLimitExceeded, OtpNotReady, OtpAlreadyConfigured` (90-93)
- `InvalidRefreshToken` (94)
- `ChangePasswordFailed` (95)
- `InvalidUsernameOrPhone` (96)
- `PasswordsDoNotMatch` (97)

**Zitadel (28 codes)**: lines 103-134 — `Zitadel*Failed` for every API mapping including `ZitadelLockUserFailed, ZitadelUnlockUserFailed, ZitadelDeactivateUserFailed, ZitadelReactivateUserFailed, ZitadelDeleteUserFailed, ZitadelDeleteSessionFailed, ZitadelTokenIntrospectionFailed, ZitadelTokenRevocationFailed`.

**IP allowlist**:
- `IpNotAllowed` (176)

**Other**: `MaxLengthExceeded, BelowMinimumLength, RequiredFieldMissing, InvalidValue, FirstNameLettersOnly, LastNameLettersOnly, UsernameMustStartWithLetter, InvalidImageFile, TenantIdRequired, NodeIdRequired` (140-149). `UnauthorizedUserToPerformThisAction, UnauthorizedAction` (155-156). `ExternalServiceError, *ConnectionError, *Timeout` (162-164). `SettingsNotFound` (170).

[CODE] **Missing per spec hint**: `OtpExpired` is NOT in FalconKeys — the code path uses `OtpStillValid` (resend cooldown), `OtpResendLimitExceeded`, and `InvalidCredentials` for failed verify. No distinct "OTP expired" code observed.

---

## Summary of US-TT verifications

- **US-TT-01** (Identity is user system of record): CONFIRMED — Commerce has no User entity; only emits `UserCreationRequestedEvent`.
- **US-TT-02** (5 statuses, 1-5): CONFIRMED — `Pending=1, Active=2, Suspended=3, Locked=4, Deleted=5`.
- **US-TT-03** (Locked→Pending on unlock requires fresh first-login): CONFIRMED at policy (`UserStatusTransitionPolicy.cs:23`) and handler (`ChangeUserStatusProcess.cs:39`). But **WEBHOOK CONTRADICTS** — Zitadel `UserUnlocked` event writes Status=Active not Pending (`ZitadelWebhookEndpoint.cs:112`). **LATENT BUG.**
- **US-TT-04** (only Pending+Active can login; Forget-Password Active-only): CONFIRMED at `LoginEligibilityPolicy.cs:14-26` (Login) and `ForgotPasswordProcess.cs:35-36` (additional `UserPending` block).
- **US-TT-05** (soft-delete via `IsDeleted` flag, Falcon-only visibility): CONFIRMED. IncludeDeleted gated by `currentUser.UserType == eUserType.Falcon` in `ListNodeUsersHandler.cs:55` and `GetUserByIdEndpoint.cs:20`.

## Gaps vs spec hints

- **Q-UM-13** (admin vs user OTP differentiation, tenant settings sync): NOT IMPLEMENTED. OTP is a single global `SecurityOptions.OtpRequiredOnLogin` flag, not per-tenant/per-role.
- **Q-UM-19** (User Limit counting): IsDeleted-only filter; **all live statuses count (Pending, Active, Suspended, Locked)**. SystemUserLimit defined but never enforced.
- **Webhook Status race**: Zitadel `UserUnlocked` always writes Active even when caller intent was Pending — risks first-login bypass when admin manually unlocks.
- **Password Advanced level**: Placeholder; identical rules to Normal today.
- **OtpExpired error code**: not defined; collapses into `InvalidCredentials`.
