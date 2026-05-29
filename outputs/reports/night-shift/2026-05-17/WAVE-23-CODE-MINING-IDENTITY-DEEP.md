# Wave 23 — Identity Service Deep Code-Mining

**Scope:** `Falcon/falcon-core-identity-svc/src/Falcon.Identity.Api`
**Goal:** Beyond Wave 14 — wire-level facts on Zitadel OAuth/OIDC topology, session storage, JWT shape, IP allowlist, OTP plumbing, password policy, tenant-settings consumer, audit logging, webhooks, multi-tenancy, lifecycle revocation, lockout, and Kafka topics.
**Convention:** Citations are `file:line`. Vol 47 = US-TT-NN tautology codex; Vol 50 = PolicySubjectContract; Vol 51 = Identity contracts. CONFIRMS / DRIFT noted inline.

---

## 1. Zitadel integration topology

Identity is a **thin wrapper / orchestrator** over Zitadel — it never hosts an IdP itself. Zitadel runs on its own domain (configured per environment) and Identity holds three named HTTP clients pointed at it:

- `ZitadelLogin` — bears the **login-client token**, used for OIDC/session flows (`v2/sessions`, `v2/oidc/auth_requests`, `oauth/v2/*`, `oidc/v1/userinfo`, `oidc/v1/end_session`). Registered at `Falcon.Identity.Api/Startup/Extensions/ServiceCollectionExtensions.cs:217-226`.
- `ZitadelAdmin` — bears the **admin token**, used for management API (`admin/v1/*`, `management/v1/*`, `v2/users/*`). Registered at `ServiceCollectionExtensions.cs:228-237`.
- `ZitadelNoRedirect` — same auth as Login, but with `AllowAutoRedirect=false` so Identity can capture the 302 `Location` header during `CreateAuthRequestAsync`. Registered at `ServiceCollectionExtensions.cs:239-248`.

All three accept an optional `BackchannelDomain` override + `Host` header (`ServiceCollectionExtensions.cs:212-215, 253-261`) — used to talk to Zitadel internally inside a cluster while preserving the public-facing host name for issuer validation.

**OAuth2/OIDC flow per Falcon (multi-step, NOT vanilla):**
1. `POST /oauth/v2/authorize` — Identity creates the auth request server-side (NOT redirect-from-browser). Returns `authRequest=...` ID. `Falcon.Identity.Api/Infrastructure/Identity/Services/ZitadelAuthService.cs:19-69`.
2. `POST /v2/sessions` — Create a Zitadel session keyed by `loginName=username`. `Falcon.Identity.Api/Infrastructure/Identity/Services/ZitadelSessionService.cs:16-38`.
3. `PATCH /v2/sessions/{id}` — Submit password check (+ `otpSms` challenge with `returnCode:true` so Zitadel returns the OTP code in the response body). `ZitadelOtpService.cs:81-140`.
4. `PATCH /v2/sessions/{id}` — Submit OTP code. `ZitadelOtpService.cs:273-300`.
5. `POST /v2/oidc/auth_requests/{authRequestId}` — Finalize: pass `sessionId + sessionToken`, get `callbackUrl` containing `code=...`. `ZitadelAuthService.cs:80-104`.
6. `POST /oauth/v2/token` — Exchange code for `{access_token, refresh_token, id_token, expires_in}`. `ZitadelAuthService.cs:105-130`.

**Token wrapper class** is `Falcon.Identity.Api/Infrastructure/Identity/Services/ZitadelIdentityManagerFacade.cs` (façade delegating to 8 specialized services — `ZitadelAuthService`, `ZitadelSessionService`, `ZitadelOtpService`, `ZitadelPasswordService`, `ZitadelUserService`, `ZitadelAdminService`, `ZitadelMetadataService`, `ZitadelVerificationService`). All inherit from `ZitadelServiceBase` which exposes `LoginHttpClient` / `AdminHttpClient` getters + a shared `HandleZitadelErrorAsync` error mapper.

**Token refresh:** `POST /oauth/v2/token` with `grant_type=refresh_token`. `ZitadelAuthService.cs:132-163`. Exposed via `POST /auth/refresh-token` (`Endpoints/Auth/RefreshTokenEndpoint.cs:14-21`, throttled 20/60s, anonymous).

**Token revocation:** `POST /oauth/v2/revoke`. `ZitadelAuthService.cs:188-208`. Called from `LogoutHandler.cs:16` with `token_type_hint="refresh_token"`. Logout endpoint is anonymous + throttled 10/60s (`Endpoints/Auth/LogoutEndpoint.cs:14-20`). DRIFT-NOTE: revocation is the **only** session-kill mechanism — there is no parallel call to `DELETE /v2/sessions/{id}` from the logout path; the underlying Zitadel session is left to expire naturally.

**Token introspection:** `POST /oauth/v2/introspect`. `ZitadelAuthService.cs:165-186`. Not invoked from any Identity endpoint — exposed on the facade for gateways/other services if needed.

**Userinfo:** `GET /oidc/v1/userinfo`. `ZitadelAuthService.cs:210-225`.

**End session:** `GET /oidc/v1/end_session?id_token_hint=...`. `ZitadelAuthService.cs:227-236`. Same DRIFT note — not invoked from logout path.

**Startup configuration of Zitadel instance:** On boot, Identity pushes config TO Zitadel:
- Secret generators (OTP, verify codes, password reset, init codes) → `PUT /admin/v1/secretgenerators/{type}`. `ZitadelAdminService.cs:23-67`.
- Lockout policy (`maxPasswordAttempts`, `maxOtpAttempts`, `showLockoutFailure`) → `PUT /admin/v1/policies/lockout`. `ZitadelAdminService.cs:69-84`.
- OIDC token lifetimes → `PUT /admin/v1/settings/oidc`. `ZitadelAdminService.cs:86-103`.
- OIDC app grant types → `PUT /management/v1/projects/{p}/apps/{a}/oidc_config`. `ZitadelAdminService.cs:105-146`. Wires `OIDC_GRANT_TYPE_AUTHORIZATION_CODE + REFRESH_TOKEN`, `OIDC_AUTH_METHOD_TYPE_NONE` (public client / PKCE), `accessTokenType=OIDC_TOKEN_TYPE_JWT`, role assertions ON.

Boot orchestration: `ServiceCollectionExtensions.cs:102-120` (`ConfigureZitadelOnStartup`).

---

## 2. Session storage

**Two distinct session concepts:**

**(a) Falcon AuthenticationSession** (multi-step login state) — stored in HybridCache (L1 in-memory + L2 Redis). `Falcon.Identity.Api/Application/Auth/Services/AuthSessionCache.cs:1-46`. TTL = **10 minutes** (`AuthSessionCache.cs:12-14`). Key format `auth_session_{sessionId}` (`Domain/Constants/CacheKeys.cs:12`). DTO: `Application/Auth/Models/AuthenticationSession.cs:7-25` — `SessionId`, `Username`, `UserId`, `IdentityUserId`, `TenantId`, `ExternalSessionId` (Zitadel ID), `ExternalSessionToken` (Zitadel session token), `AuthRequestId`, `Stage`, `FlowType`, `RequiresPasswordChange`, `RequiredOtpType`, `PhoneNumber`, `OtpGeneratedAt`, `ResendAttempts`, `CreatedAt`. The HybridCache itself is wired at `ServiceCollectionExtensions.cs:194-203` (default L1=2min / L2=5min, but auth-session entries override to 10min single-tier).

**(b) Zitadel session** (the canonical IdP session) — lives **inside Zitadel**, not Identity. Identity holds only `ExternalSessionId + ExternalSessionToken` in the Falcon session above.

**No cookie-based session at all.** Identity is JWT-bearer only.

CONFIRMS US-TT-09 (sessions are short-lived caches keyed by token, not DB rows).

---

## 3. JWT shape

**JWT is issued BY Zitadel, not Falcon Identity.** Identity never signs a JWT. The JWT validation parameters are set in `ServiceCollectionExtensions.cs:286-307`:
- `Authority = Zitadel.Authority`
- `MetadataAddress = {Authority}/.well-known/openid-configuration` (`Infrastructure/Identity/ZitadelOptions.cs:25-26`)
- `MapInboundClaims = false` (preserves Zitadel claim names verbatim)
- Issuer / audience / lifetime validated; ClockSkew default 300s.

**Claims used by Falcon** (extracted via `ZitadelClaimsTransformation`):

Standard OIDC: `sub`, `email`, `email_verified`, `preferred_username`, `name`, `given_name`, `family_name`, `locale` (`Infrastructure/Auth/ZitadelClaimTypes.cs:13-20`).

Standard Zitadel: `urn:zitadel:iam:org:project:roles` (project roles JSON), `urn:zitadel:iam:user:metadata` (base64-encoded metadata bag) (`ZitadelClaimTypes.cs:9-10`).

**Falcon-custom claims** — stored as **Zitadel user metadata** (NOT as Zitadel custom claims), then promoted to top-level claims by the claims transformation:
- `user-id` — Identity's Mongo User._id (NOT the Zitadel `sub`)
- `user-type` — `eUserType` enum int
- `tenant-id`
- `node-id`

Definitions: `ZitadelClaimTypes.cs:23-26`.
Population on user create: `Application/Users/UseCases/CreateUserProcess.cs:180-195` (BuildUserMetadataEntries) → `SetUserMetadataBulkAsync`.
Promotion to flat claims on every request: `Infrastructure/Auth/ZitadelClaimsTransformation.cs:19-51` — decodes base64 metadata bag, adds 4 individual claims, expands `projectRoles` JSON into `ClaimTypes.Role` entries.

**SessionProvider** (`Infrastructure/Auth/SessionProvider.cs:9-143`) exposes claims to handlers:
- `UserId` ← `user-id` claim (line 14)
- `IdentityUserId` ← `sub` (line 17)
- `TenantId` ← `tenant-id` (line 29)
- `NodeId` ← `node-id` (line 32)
- `UserType` ← `user-type` parsed as enum (lines 35-42)
- `Roles` ← `ClaimTypes.Role` parsed as `eUserRoles` enum (lines 102-113)

**Path claim** — **MISSING** from JWT/metadata. The `path` field exists on the User entity (`Domain/Entities/User.cs:72-73`) but is **NOT** mirrored to Zitadel metadata in `BuildUserMetadataEntries`. DRIFT vs Vol 51 if Vol 51 expected `path` in the JWT — confirmed absent in code.

CONFIRMS US-TT-11 (JWT carries tenant + node + role; sub is Zitadel UUID; Falcon's own user-id is a separate metadata claim).

---

## 4. IP allowlist enforcement

**Identity-side enforcement, NOT gateway-side** (at least for the login-family endpoints). The Identity service ships its own guard.

- Storage: `Domain/Entities/TenantSettings.cs:42-44` — `AllowedIps : List<string>?` on `TenantSettings` collection, populated by Kafka consumer (see §8).
- Guard impl: `Infrastructure/Security/IpAllowlistGuard.cs:12-56`. HybridCache wrapping the lookup (L1=2min, L2=5min). Treats null/empty allowlist as "no restriction". Supports CIDR via `IPNetwork.TryParse` AND exact match via `IPAddress.TryParse`. Normalizes IPv4-mapped-IPv6.
- Resolver: `Infrastructure/Security/TenantIdResolver.cs:1-39` — `ByUsername` / `BySessionId` / `ByUserId` strategies.
- Enforcement point: FastEndpoints PreProcessor `Endpoints/Auth/PreProcessors/IpAllowlistPreProcessor.cs:10-38` — runs before the endpoint handler. Skips if tenant cannot be resolved.

**Endpoints opted-in** (each calls `PreProcessor<IpAllowlistPreProcessor<TRequest>>()` in `Configure`):
- `LoginEndpoint` (`Endpoints/Auth/LoginEndpoint.cs:20`)
- `ForgotPasswordEndpoint` (`Endpoints/Auth/ForgotPasswordEndpoint.cs:20`)
- `ResendOtpEndpoint` (`Endpoints/Auth/ResendOtpEndpoint.cs:21`)
- `VerifyOtpEndpoint` (`Endpoints/Auth/VerifyOtpEndpoint.cs:20`)

Not gated: `RefreshTokenEndpoint`, `LogoutEndpoint`, `SetPasswordEndpoint`, `FirstLoginSetupEndpoint`, `ForgotPasswordSetPasswordEndpoint`. DRIFT-NOTE: refresh-token + password-change paths are NOT IP-gated despite Vol 51 implying all auth-flow steps respect the allowlist.

**Cache invalidation:** When `IdentitySettingsSyncConsumer` upserts settings, it explicitly evicts `tenant_ip_allowlist_{tenantId}` from HybridCache so IP changes are picked up immediately (`Infrastructure/Messaging/Kafka/IdentitySettingsSyncConsumer.cs:158-159`).

Per Wave 18a (gateway-side via Redis-projection-populated-by-Kafka): **NOT FOUND in Identity code**. Identity only enforces server-side via HybridCache lookup of MongoDB `TenantSettings`. There may be a separate gateway-side enforcement in `falcon-int-system-gateway-svc` / `falcon-int-core-gateway-svc` (not in scope of this wave).

---

## 5. OTP delivery infrastructure

**OTP code is generated by Zitadel**, returned **inline** in the PATCH-session response when the request includes `challenges.otpSms.returnCode = true` (`ZitadelOtpService.cs:89` and `:243`). Identity extracts the code and dispatches it.

**Dispatch is via in-process MediatR domain event** — NOT a Kafka event:
1. `LoginProcess.cs:110-115` (and `ResendOtpProcess.cs:55-56`, `ForgotPasswordProcess.cs:62-63`) publish `SmsCodeGeneratedDomainEvent(phoneNumber, code)` via `IPublisher`.
2. `SmsCodeNotificationHandler` (`Infrastructure/Communications/SmsCodeNotificationHandler.cs:8-25`) receives it and calls `ISmsSender.SendAsync`.
3. `SmsSender` (`Infrastructure/Communications/SmsSender.cs:12-56`) makes an `HttpClient` POST to the **RiCH SMS provider** at `https://xservices.rich.sa/RiCHClientServiceREST.svc/SendSmsLogin` (default in `appsettings.json:97`).

There is **no `WA-send service`** — SMS goes direct to RiCH. Fire-and-forget; failures are logged but never throw.

**Email OTP path** exists too but is currently used only for email-address verification, not login OTP:
- `EmailCodeGeneratedDomainEvent` (`Application/Auth/DomainEvents/EmailCodeGeneratedDomainEvent.cs:9-11`)
- `EmailCodeNotificationHandler.cs:9-36` → `SmtpEmailSender.cs:13-58` (MailKit SMTP).

**SMS toggle:** When `Sms:Enabled=false` (`appsettings.json:96`, default), `NoOpSmsSender` is registered instead (`ServiceCollectionExtensions.cs:349-358`).

DRIFT vs Vol 51 if Vol 51 specified `WA-send` (WhatsApp send) microservice — code has direct HTTP to RiCH.

---

## 6. OTP storage

**Falcon NEVER stores the OTP code.** The code is generated INSIDE Zitadel and validated INSIDE Zitadel. Identity just relays it to SMS.

What Identity does store in HybridCache:
- `OtpGeneratedAt` timestamp on the `AuthenticationSession` (`AuthenticationSession.cs:22`) — used to enforce the resend cooldown (`ResendOtpProcess.cs:37-42`: "still valid within `Zitadel.Otp.ExpirySeconds`").
- `ResendAttempts` counter on the session (`AuthenticationSession.cs:23`) — capped at `Security.MaxResendAttempts` (default 3), exceeding triggers Zitadel lock (`ResendOtpProcess.cs:31-35` + `79-90`).

The OTP CODE itself never lives in Falcon storage — Zitadel returns it via `returnCode:true`, Identity forwards to SMS, and the user submits it to `verify-otp` which round-trips back to Zitadel `PATCH session` for actual verification.

**Dev convenience:** When `GlobalHelper.IsDevelopment` is true, the OTP code is leaked back in the API response as `DevOtpCode` (`LoginProcess.cs:120, 131`; `ResendOtpProcess.cs:62, 71`; `ForgotPasswordProcess.cs:66, 75`). Production builds zero this out.

CONFIRMS US-TT-13 (Falcon never hashes/stores OTPs; OTP issuance is delegated to Zitadel's secret-generator subsystem).

---

## 7. Password storage

**Zitadel handles ALL password hashing and storage. Identity never persists plaintext, hash, or salt.** Confirmed:
- The `User` entity in `Domain/Entities/User.cs:1-109` has **no password field, no hash field, no salt field**.
- Password is sent to Zitadel via `POST /v2/users/{id}/password` (Set, `ZitadelPasswordService.cs:33-46`), `POST /v2/users/{id}/password` with `currentPassword` (Change, `:17-31`), or `POST /v2/users/human` at create (`ZitadelUserService.cs:43-47`).
- `PasswordPolicy` (`Domain/Policies/PasswordPolicy.cs:9-87`) ONLY validates plaintext locally before forwarding — it neither hashes nor caches.

**Plaintext-in-Kafka exception:** When Commerce publishes `commerce.user-creation-requested.v1`, the password is travelling encrypted with AES-GCM (`Infrastructure/Security/AesGcmFieldEncryptor.cs`, key from `FieldEncryption.Key` config section). `UserCreationRequestedConsumer.cs:173` decrypts it in-memory, forwards to Zitadel, then drops the variable when the method exits. CONFIRMS US-TT-14 (Falcon never persists raw password; transit-encrypted on Kafka via shared secret).

---

## 8. Tenant settings consumer

**Topic:** `commerce.identity-settings-sync.v1` (default `KafkaOptions.cs:48`; appsettings.json:82).
**Consumer:** `Infrastructure/Messaging/Kafka/IdentitySettingsSyncConsumer.cs:12-192`.

**Consumer wiring:** Confluent Kafka consumer with `GroupId="falcon-identity-svc"`, `AutoOffsetReset=Earliest`, `EnableAutoCommit=false`, `IsolationLevel=ReadCommitted`, manual `Commit()` after successful processing (`:36-48, 79`).

**Payload shape:** `TenantSettingsSyncEvent` (private DTO at `:170-178`): `TenantId`, `PasswordSecurityLevel` (enum), `MaxNormalUserLimit`, `MaxSystemUserLimit`, `AllowedIps : List<string>?`, plus `Context` actor info.

**What it does** (`ProcessSettingsSyncAsync` at `:109-165`):
1. Opens a DI scope.
2. Bridges the event's `EventContext` (`UserId/Username/TenantId/IpAddress/UserAgent/CorrelationId`) into the singleton `IAuditContextAccessor` so audit logs attribute the change to the original Commerce actor (`:117-125`).
3. Upserts the `TenantSettings` doc in Mongo: insert if absent (`:131-144`), else `UpdateOneAsync` with `Set` on each field (`:147-154`).
4. Evicts the HybridCache `tenant_ip_allowlist_{tenantId}` key (`:159`) so the next IP check sees the new list.
5. Clears the `AuditContext` in `finally`.

Settings consumed by Identity: password policy (used in `FirstLoginSetupProcess.cs:23-24`, `ForgotPasswordSetPasswordHandler.cs:23-24`, `CreateUserProcess.cs:60-62`), user quotas (`CreateUserProcess.cs:53`), IP allowlist (`IpAllowlistGuard.cs:23`).

CONFIRMS Wave 18a / US-TT-08 (Identity is a projection consumer of Commerce-owned tenant settings; it does not own them).

---

## 9. Audit log destination

**Same database** — `FalconIdentityDb` Mongo (`MongoDbOptions.cs:22`). Collection `AuditLogs` (`MongoAuditLogger.cs:16-17`). Entity: `Domain/Entities/AuditLog.cs:7-60`.

**Writer:** `Infrastructure/Persistence/MongoAuditLogger.cs:10-83`. Three operations:
- `LogCreatedAsync` — captures full BsonDocument snapshot (`:22-32`).
- `LogUpdatedAsync` — captures only changed-field deltas via `AuditChange` list (`:35-49`).
- `LogDeletedAsync` — captures identifier only (`:51-64`).

**Audit fields captured** (`CreateEntry` at `:66-82`):
- `EntityType`, `EntityId`, `Action` (`eAuditAction.Created/Updated/Deleted`)
- `TenantId`
- `PerformedBy` — `SessionProvider.UserId` if available, else `IAuditContextAccessor.Context.UserId` (Kafka path)
- `PerformedByName`, `IpAddress`, `UserAgent`, `HttpMethod`, `RequestUrl`
- `PerformedAt` (UTC)

Audit logging is auto-invoked from `MongoRepository<T>.AddAsync/UpdateOneAsync/DeleteAsync` (`Infrastructure/Persistence/MongoRepository.cs:30-33, 124-126, 144-151`). Best-effort: any audit-write failure is swallowed and logged as a warning (`MongoAuditLogger.cs:29-32, 45-48, 60-63`).

**No separate audit DB. No Kafka-shipped audit event.** Audit lives inline with the operational store.

---

## 10. Webhook endpoints

**One handler total.** `Endpoints/Webhooks/ZitadelWebhookEndpoint.cs:12-145`.

- Route: `POST /webhook/zitadel` (group prefix `webhook` from `WebhookEndpointGroup.cs:13`).
- AllowAnonymous (line 22).
- Signature: HMAC-SHA256 verified against `Zitadel:WebhookSigningKey` from config. Verifier: `Infrastructure/Identity/ZitadelWebhookSignatureVerifier.cs:18-31`. Header name: `x-zitadel-signature` (`:35`). Hash compared lowercase hex.
- Event mapping: `Infrastructure/Identity/ZitadelEventMapper.cs:13-31`. Recognized methods: `VerifyEmail`, `VerifyPhone`, `LockUser`, `UnlockUser`, `DeactivateUser`, `ReactivateUser`. Unknown methods return 200 with null payload (`:62-66`).
- Effects on local Mongo (`ProcessEventAsync` at `:93-144`):
  - `UserLocked` → `Status=Locked` + `UpdatedAt`
  - `UserUnlocked` → `Status=Active` + `UpdatedAt`
  - `UserDeactivated` → `Status=Suspended` + `UpdatedAt`
  - `UserReactivated` → `Status=Active` + `UpdatedAt`
  - `EmailVerified` → `IsEmailVerified=true`
  - `PhoneVerified` → `IsPhoneVerified=true`
- Cache invalidation: `cache.RemoveAsync(CacheKeys.UserStatus(identityUserId), ct)` after every recognized event (`:78`).

No other webhook handlers exist — only the Zitadel one.

---

## 11. Multi-tenancy enforcement

Beyond JWT subject namespacing (PolicySubjectContract per Vol 50), Identity has these in-process tenant isolations:

1. **`ITenantEntity` interface + `TenantId` on every multi-tenant entity** — both `User` (`User.cs:8, 18-19`) and `TenantSettings` (`TenantSettings.cs:9, 15-16`) implement it.
2. **Falcon-vs-Client tenant resolution** in `CreateUserProcess.cs:141-159` (`ResolveTargetTenantIdAsync`):
   - Client callers' `tenantId` is **always** their own from JWT (request body ignored).
   - Falcon callers may pass `tenantId` in request body to manage another tenant.
   - Heuristic: if Falcon doesn't pass `tenantId` but passes a `nodeId` that matches a known tenant root in `TenantSettings`, infer tenant from node.
3. **`UserRolePolicy.ValidateClientUserContext(role, tenantId, nodeId)`** — domain policy enforcing client-user rows must carry a `tenantId` (`CreateUserProcess.cs:42`). File: `Domain/Policies/UserRolePolicy.cs` (referenced but not re-read this wave).
4. **PES role-link sync includes tenantId** — primary-role-link request carries `tenantId` only for Client users (`CreateUserProcess.cs:164-174`; `UserCreationRequestedConsumer.cs:228-232`). System/Falcon users get `null` tenant. CONFIRMS US-TT-22 (Falcon-user role bindings are tenant-agnostic; Client-user bindings are tenant-scoped).
5. **Tenant-scoped audit attribution** — `MongoAuditLogger.cs:25, 40, 56` reads `(entity as ITenantEntity)?.TenantId` first, falling back to `SessionProvider.TenantId`. Kafka-driven flows bridge the actor's `TenantId` via `AuditContext` (`UserCreationRequestedConsumer.cs:150-158`, `IdentitySettingsSyncConsumer.cs:117-125`).
6. **TenantId-scoped Mongo filters** in user lookups (e.g., quota counts at `CreateUserProcess.cs:51-52`). No global "select * from Users" code path mixes tenants.

No row-level `TenantFilter` interceptor on the Mongo driver — isolation is **caller-discipline** with helper services + policy classes, not a sealed-by-default filter. DRIFT-NOTE: vulnerable to bugs if a future endpoint forgets to filter by `TenantId`. Vol 51 may expect a stricter automatic tenant filter.

---

## 12. Session revocation cascade

**Mostly Zitadel-driven, with Identity reacting via webhook.**

When admin changes user status (`ChangeUserStatusProcess.cs:14-78`):
- `Suspended` → `identityManager.DeactivateUserAsync` (Zitadel `POST /v2/users/{id}/deactivate`).
- `Locked` → `identityManager.LockUserAsync` (Zitadel `POST /v2/users/{id}/lock`).
- `Deleted` → `identityManager.DeactivateUserAsync` (NOT delete; soft-deletion in Mongo + Zitadel deactivate).
- `Active` from Locked → `UnlockUserAsync`.
- `Active` from Suspended/Deleted → `ReactivateUserAsync`.

Then the Zitadel side **invalidates all that user's sessions in Zitadel** (Zitadel-internal behavior — Zitadel revokes active access/refresh tokens for deactivated/locked users). Identity then:
- Updates local Mongo `User.Status` to match (`:56-69`).
- Evicts `CacheKeys.UserStatus(identityUserId)` (`:72`) so the next `CheckUserStatusEndpoint` call hits Mongo, not stale cache.

The `CheckUserStatusEndpoint` (`Endpoints/Security/CheckUserStatusEndpoint.cs:19-35`) is **the polling primitive other services (gateways) use to validate session liveness** — cached for 5 min L2 / 2 min L1 by default but evicted on every webhook event and every status change. Gateways must poll this periodically.

**Login-time defense:** Even if a token is still valid, `LoginEligibilityPolicy.Validate(status)` (`Domain/Policies/LoginEligibilityPolicy.cs:14-25`) rejects `Locked`/`Suspended`/`Deleted` users at the next login. And Zitadel will reject the password PATCH for a locked user with `IsLockoutDetected` (`ZitadelOtpService.cs:97, 161`).

**Refresh-token rotation revokes the prior refresh token** — handled by Zitadel itself (refresh rotation is enabled via `RefreshTokenIdleExpiration` in `ConfigureOidcTokenLifetimesAsync`).

CONFIRMS US-TT-17 (revocation is server-state-driven: status change → Zitadel kills tokens → Identity flips Mongo → cache evict → gateways re-check).

---

## 13. Login attempt counter

**Stored in Zitadel, not Identity.** Identity never has a `FailedLoginAttempts` counter in its `User` entity.

**Policy push to Zitadel** at startup: `ZitadelAdminService.cs:69-84` calls `PUT /admin/v1/policies/lockout` with:
- `maxPasswordAttempts` (default 3, `ZitadelOptions.cs:66`)
- `maxOtpAttempts` (default 5, `:71`)
- `showLockoutFailure` (default true, `:76`)

DRIFT vs the "5 attempts in 15 min" hypothesis: code shows a simple cumulative cap (no sliding window). The 15-minute clock would have to be a Zitadel internal default (not configured from Falcon side).

**Detection** when Zitadel locks the user mid-flow: `IsLockoutDetected(responseContent)` (referenced at `ZitadelOtpService.cs:97, 161, 295` — implementation lives in `ZitadelServiceBase.cs` which I did not re-read this wave). When detected, `LoginProcess.cs:51-57` updates `User.Status=Locked` in Mongo immediately AND invalidates the status cache, beating the webhook to it.

**OTP resend-limit counter** is the only Falcon-side throttling: stored on the in-cache `AuthenticationSession.ResendAttempts` (`AuthenticationSession.cs:23`), capped at `Security.MaxResendAttempts=3` (`SecurityOptions.cs:17`), exceeding triggers a Zitadel `LockUserAsync` call (`ResendOtpProcess.cs:79-90`).

---

## 14. Identity-produced Kafka topics

**One topic produced, two consumed.** `Infrastructure/Messaging/Kafka/KafkaOptions.cs:43-63` (with the actual appsettings overrides at `appsettings.json:80-84`).

**Produced:**
- `identity.user-events.v1` (`KafkaOptions.cs:62`, appsettings.json:83) — currently carries `UserRoleLinkSyncRequestedAvroEvent` only. Publisher: `Infrastructure/Messaging/Kafka/UserRoleLinkSyncRequestedEventPublisher.cs:12-56`. Producer config: `Acks=All` + `EnableIdempotence=true`, Avro-serialized via Confluent Schema Registry (`ServiceCollectionExtensions.cs:372-387`). Schema class: `Infrastructure/Messaging/Kafka/AvroEvent/UserRoleLinkSyncRequestedAvroEvent.cs` (not re-read this wave, but referenced). Event DTO: `Application/Users/Events/UserRoleLinkSyncRequestedEvent.cs:14-30`.

DRIFT vs Wave 14 hint: the report mentioned `user-created`, `user-creation-failed`, `password-changed`, `session-started`, `session-revoked`. **None of these exist as produced topics in the current code.** Only `identity.user-events.v1` is produced, and it currently only carries the role-link-sync request. CONFIRMS partial drift from earlier hypothesis — Identity is a **net consumer**, not publisher, in this version.

**Consumed:**
- `commerce.user-creation-requested.v1` (`KafkaOptions.cs:55`, appsettings.json:81 names it `UserCreated` confusingly — the code key is `UserCreationRequested`). Handler: `UserCreationRequestedConsumer.cs:37-304`. Decrypts the AES-GCM password (`:173`), provisions in Zitadel (`:176-188`), persists local User (`:195-213`), sets metadata (`:217-224`), publishes role-link sync (`:234`), publishes `UserCredentialsGeneratedDomainEvent` to dispatch credentials (`:248-256`).
- `commerce.identity-settings-sync.v1` (`KafkaOptions.cs:48`, appsettings.json:82). See §8.

**Identity does NOT publish `password-changed`, `session-started`, `session-revoked`.** Those are Zitadel-internal events. If anything publishes them, it would be Zitadel itself (via webhook to Identity, which Identity then writes to its own audit log — see §10).

---

## Cross-cutting confirmations & drifts

**CONFIRMS** (Vol 47 tautologies):
- US-TT-08 (Identity consumes tenant settings; doesn't own).
- US-TT-09 (Sessions are short-lived caches keyed by token, not DB rows).
- US-TT-11 (JWT carries tenant + node + role + custom user-id).
- US-TT-13 (Falcon never hashes/stores OTPs — Zitadel does).
- US-TT-14 (Passwords never persisted by Falcon; AES-GCM encrypted on Kafka; cleared after dispatch).
- US-TT-17 (Revocation: status change → Zitadel kills → Identity flips Mongo → cache evict → gateway re-poll).
- US-TT-22 (Falcon-user role bindings tenant-agnostic; Client-user bindings tenant-scoped).

**DRIFTS** (code disagrees with hypothesized spec):
- (Wave 14 hint) Identity does NOT produce `user-created` / `user-creation-failed` / `password-changed` / `session-started` / `session-revoked`. Only `identity.user-events.v1` carrying role-link sync events.
- (Vol 51 if it specified) Logout endpoint revokes refresh token but does NOT call `DELETE /v2/sessions/{id}` nor `oidc/v1/end_session` — Zitadel session is left to expire.
- (Vol 51 if it specified) `path` claim is not mirrored to Zitadel metadata; only `user-id` / `user-type` / `tenant-id` / `node-id` are.
- (Wave 18a if it specified) IP allowlist enforcement is in Identity via HybridCache→Mongo, NOT a gateway-side Redis projection populated by Kafka. (Possible parallel gateway path not in scope.)
- (Vol 51 if it specified) Refresh-token + password-change endpoints are NOT IP-gated despite login family being gated.
- ("5 attempts in 15 min" hypothesis) Zitadel lockout is a cumulative cap (3 password / 5 OTP attempts), no time window configured from Falcon side.
- (Vol 51 if it specified) No row-level Mongo TenantFilter — tenant isolation is caller-discipline, not interceptor-enforced.
- (Vol 51 if it specified) Identity uses RiCH SMS via direct HTTP (`https://xservices.rich.sa/RiCHClientServiceREST.svc/SendSmsLogin`), not a `WA-send` microservice.

---

## File index (paths-only, for follow-up)

```
Falcon/falcon-core-identity-svc/src/Falcon.Identity.Api/
├── Infrastructure/
│   ├── Identity/
│   │   ├── ZitadelOptions.cs
│   │   ├── ZitadelEventMapper.cs
│   │   ├── ZitadelWebhookSignatureVerifier.cs
│   │   ├── ZitadelErrorMapper.cs
│   │   └── Services/
│   │       ├── ZitadelServiceBase.cs
│   │       ├── ZitadelAuthService.cs        # OIDC flow + token endpoints
│   │       ├── ZitadelSessionService.cs     # /v2/sessions wrappers
│   │       ├── ZitadelOtpService.cs         # OTP challenge + verify
│   │       ├── ZitadelPasswordService.cs    # password set/change
│   │       ├── ZitadelUserService.cs        # user CRUD
│   │       ├── ZitadelAdminService.cs       # instance-level config push
│   │       ├── ZitadelMetadataService.cs    # metadata get/set
│   │       ├── ZitadelVerificationService.cs # email/phone verify
│   │       └── ZitadelIdentityManagerFacade.cs # IIdentityManager façade
│   ├── Auth/
│   │   ├── SessionProvider.cs
│   │   ├── CurrentUser.cs
│   │   ├── ZitadelClaimTypes.cs
│   │   ├── ZitadelClaimsTransformation.cs
│   │   ├── AuditContextAccessor.cs
│   │   └── ZitadelBackchannelHandler.cs
│   ├── Security/
│   │   ├── IpAllowlistGuard.cs
│   │   ├── TenantIdResolver.cs
│   │   ├── SecurityOptions.cs
│   │   ├── FieldEncryptionOptions.cs
│   │   └── AesGcmFieldEncryptor.cs
│   ├── Communications/
│   │   ├── SmsSender.cs                     # RiCH HTTP
│   │   ├── SmtpEmailSender.cs               # MailKit
│   │   ├── NoOpSmsSender.cs
│   │   ├── SmsCodeNotificationHandler.cs
│   │   ├── EmailCodeNotificationHandler.cs
│   │   └── UserCredentialsNotificationHandler.cs
│   ├── Messaging/Kafka/
│   │   ├── KafkaOptions.cs
│   │   ├── IdentitySettingsSyncConsumer.cs  # consume tenant settings
│   │   ├── UserCreationRequestedConsumer.cs # consume Commerce user-creation
│   │   ├── UserRoleLinkSyncRequestedEventPublisher.cs # produce
│   │   └── AvroEvent/UserRoleLinkSyncRequestedAvroEvent.cs
│   └── Persistence/
│       ├── MongoRepository.cs               # generic, with auto-audit
│       ├── MongoAuditLogger.cs              # AuditLogs collection
│       ├── UserRepository.cs
│       ├── UserAggregator.cs
│       ├── MongoUnitOfWork.cs
│       └── MongoUpdateBuilder.cs
├── Application/
│   ├── Auth/
│   │   ├── Services/AuthSessionCache.cs     # HybridCache, 10min TTL
│   │   ├── Models/AuthenticationSession.cs
│   │   ├── DomainEvents/SmsCodeGeneratedDomainEvent.cs
│   │   ├── DomainEvents/EmailCodeGeneratedDomainEvent.cs
│   │   └── UseCases/
│   │       ├── LoginProcess.cs
│   │       ├── VerifyOtpProcess.cs
│   │       ├── ResendOtpProcess.cs
│   │       ├── LogoutHandler.cs
│   │       ├── RefreshTokenHandler.cs
│   │       ├── ForgotPasswordProcess.cs
│   │       ├── ForgotPasswordSetPasswordHandler.cs
│   │       ├── FirstLoginSetupProcess.cs
│   │       └── SetPasswordHandler.cs
│   └── Users/
│       ├── UseCases/CreateUserProcess.cs
│       ├── UseCases/ChangeUserStatusProcess.cs
│       ├── Events/UserRoleLinkSyncRequestedEvent.cs
│       └── DomainEvents/UserCredentialsGeneratedDomainEvent.cs
├── Domain/
│   ├── Constants/CacheKeys.cs
│   ├── Entities/User.cs                     # NO password fields
│   ├── Entities/TenantSettings.cs           # projection from Commerce
│   ├── Entities/AuditLog.cs
│   └── Policies/
│       ├── LoginEligibilityPolicy.cs
│       ├── PasswordPolicy.cs
│       ├── AuthenticationStagePolicy.cs
│       ├── UserStatusTransitionPolicy.cs
│       ├── UserRolePolicy.cs
│       └── UserQuotaPolicy.cs
├── Endpoints/
│   ├── Auth/                                # 9 endpoints, 4 IP-gated
│   ├── Webhooks/ZitadelWebhookEndpoint.cs   # only webhook
│   ├── Security/CheckUserStatusEndpoint.cs  # gateway polling primitive
│   └── Users/                               # 20 user CRUD endpoints
└── Startup/Extensions/ServiceCollectionExtensions.cs
```

**END OF REPORT**
