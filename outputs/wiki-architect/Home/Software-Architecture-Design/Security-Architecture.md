# Security Architecture (Authentication & Authorization)

**Canonical source:** `C:\Falcon\falcon-wiki\Home\Software-Architecture-Design\Security-Architecture.md`
**Length:** 592 lines · **Headings:** 65
**Last wiki HEAD seen:** `0d0cb311…`

## Purpose

The **canonical Identity Service charter**. Establishes `falcon-core-identity-svc` (NOT Zitadel directly, NOT Commerce) as the **platform identity boundary** owning user lifecycle, login eligibility, security-policy enforcement, and auth orchestration. Zitadel is reduced to the **authentication engine** for credential validation, OTP/session challenges, and token issuance. Also defines the dual-credential security model (user JWT + micro-app API key), the Identity Service responsibilities, the four backend middleware validation checks, the user lifecycle state machine, tenant IP allowlist policy source/enforcement split, and the multi-portal authorization model (single OIDC client + `user_type` claim).

## Key rules / decisions

### §4.1.1 Core concepts (`Security-Architecture.md:29-78`)

**Identity Service owns:**
- User master data + lifecycle/status transitions
- Login and recovery workflows
- Contact verification workflows
- Account / node membership
- Portal eligibility checks
- Login security-policy enforcement
- Zitadel integration
- User read models for admin + client screens

**Zitadel owns:**
- Credential checks
- Session and OTP challenge primitives
- Token issuance
- Session handling
- Identity lockout primitives

**Micro-app authentication — dual credential:**
- Static API key per micro-app, stored server-side (Vault), injected at runtime by host backend.
- API key **never** embedded in bundle, **never** in source code.
- Every protected request carries:

```http
Authorization: Bearer <user-access-token>
X-MicroApp-Key: <micro-app-key>
```

### §4.1.2 Falcon lifecycle states (`…md:88-107`)

`Pending | Active | Suspended | Locked | Deleted`

- **Login allowed:** `Active` ✓; `Pending` (only via first-login flow); `Suspended`, `Locked`, `Deleted` → **denied**.
- **Forgot-password allowed only for `Active`** — blocked for all other states.

### §4.1.3 Request flow (`…md:111-134`)

Identity Service performs **pre-auth checks** in order:
1. Resolve user + tenant.
2. **Validate source IP against allowed ranges.**
3. Validate Falcon lifecycle status.
4. Only on pass: call Zitadel for credential validation, OTP, session.
5. On success, Zitadel issues tokens through Identity-orchestrated flow.

Then for micro-app requests:
6. Host backend fetches micro-app API key from Vault.
7. Injects into runtime bootstrap config (`window.microAppConfig`).
8. Micro-app sends API requests with both credentials.

### §4.2.1 Identity Service modules (`…md:142-159`)

- **PreAuth Security Guard** — tenant resolution + source IP validation before login/recovery.
- **Auth Orchestration** — login, OTP, resend OTP, first-login, refresh, forgot-password, set-password.
- **User Lifecycle Service** — status transitions, profile state, recovery state.
- **Policy Engine** — password policy, IP allowlist policy, lockout rules.
- **Webhook Integration** — consumes Zitadel events, syncs identity-relevant state.
- **Internal Read APIs & Projections** — low-latency cross-service reads.

Settings sync from Commerce via Kafka topic **`commerce.identity-settings-sync.v1`**.

### §4.2.4 Login / recovery endpoints (`…md:202-251`)

- `POST /api/auth/login`
- `POST /api/auth/verify-otp` (3-wrong attempts OR 3-resend attempts → user locked)
- `POST /api/auth/first-login`
- `POST /api/auth/forgot-password`
- `PUT  /api/user/change-password` (revokes refresh + session tokens; UI must redirect to `/login`)

### §4.2.6 Four backend middleware checks (`…md:278-330`)

Every API request must:
1. **Validate User JWT** (Zitadel-issued) — signature, issuer, audience, expiration; extract `sub`, `tenant_id`, `user_type`, roles/scopes.
2. **Validate Micro-App API Key** — against Vault.
3. **Validate Tenant Isolation** — `tenant_id` from JWT must match request context.
4. **Validate Business User Status (defense-in-depth)** — even if JWT valid, lifecycle state may have changed. Use projections / cached status, not direct DB lookup per request.

Error semantics:
- Invalid/expired JWT → `401 Unauthorized`.
- Valid JWT but blocked lifecycle state → `403 Forbidden`.

### §4.2.8 Security policy sync (`…md:359-369`)

> **Commerce is no longer the owner of users or login eligibility.** Commerce only publishes identity-related settings used by Identity Service policy enforcement.

Policy state synchronized from Commerce → Identity via Kafka **`commerce.identity-settings-sync.v1`**.

### §4.2.9 Tenant IP allowlist (`…md:371-461`)

**Source of policy:** Identity Service `Settings` store (Identity validates source IP **before** authentication proceeds).
**Configuration:** list of allowed IPs + CIDR ranges + `enabled` flag.
**Enforcement at runtime gateway:**
- **Core Services Gateway** — enforces for Management Console traffic.
- Redis key: `tenant:{tenantId}:ipAllowlist:v1`.
- Updated by Kafka event: `TenantIpAllowlistUpdated`.
- Rejected requests: `HTTP 403 Forbidden`.
**Not enforced** in System Gateway or Platform Services Gateway.

### §4.3 User lifecycle transitions (`…md:464-510`)

```
Pending   → Active
Active    → Suspended | Deleted | Locked
Suspended → Active
Locked    → Pending (recovery reset) | Active (direct unlock)
Deleted   → Active (Falcon user only)
```

**Deleted semantics:**
- `Status = Deleted` AND `IsDeleted = true`.
- Excluded from quota counts.
- Excluded from client lists by default.
- Falcon lists may include deleted users only with explicit include flag.

### §4.6 Multi-portal authorization model (`…md:568-762`)

**Single OIDC client** + user-type claims model.

Zitadel injects claims into ID + access tokens:
```json
{ "sub": "u123", "user_type": "system", "tenant_id": "t1" }
```

Portal access rules (`…md:658-665`):

| Portal | Allowed `user_type` |
|---|---|
| **Admin Portal** | `system` |
| **Management Portal** | `system`, `account` |

Frontend route guards (UX layer only; backend enforces hard boundary):
```ts
canActivate() { return this.auth.getClaim('user_type') === 'system'; }  // Admin
canActivate() { return ['system','account'].includes(this.auth.getClaim('user_type')); }  // Mgmt
```

Backend authorization policies:
```csharp
options.AddPolicy("AdminOnly", policy => policy.RequireClaim("user_type", "system"));
options.AddPolicy("ManagementAccess", policy => policy.RequireClaim("user_type", "system", "account"));
```

### §4.7 Security principles (`…md:766-779`)

- Identity Service = SoT for user lifecycle + login eligibility.
- Zitadel = authentication engine only.
- API keys never embedded in micro-app builds; only server-side; transient in memory.
- Backend always enforces lifecycle even if token still valid.
- Login + forgot-password both require pre-auth IP validation.
- OTP verification + resend bounded at 3 each.
- Password change forces logout + re-auth.
- **Idle timeout enforced in UI after 30 minutes** of inactivity.

### §4.8 Key changes from previous architecture (`…md:782-792`)

1. Identity Service replaces Commerce as system of record for user lifecycle + login eligibility.
2. User login flow changes from Angular → Zitadel direct, to Falcon UI → Identity Service → Zitadel.
3. Identity Service = login-eligibility enforcement; Zitadel = authentication engine.
4. IP allowlist enforcement for login + recovery moved to Identity Service pre-auth guard.
5. Lifecycle model updated to 5 states.
6. Security settings synced Commerce → Identity via Kafka (not read from Commerce as user-owner state).
7. **Roles and permissions belong to Access Management domain, NOT Identity Service.**

## Diagrams / images referenced

- `Frame%208-73fc07a5-…jpg` — Primary Presentation.
- `auth-journey-f651ce8d-…jpg` — Auth Flow.
- `Frame%2014-50b5227a-…png` — Container-Level Diagram.
- Multiple sequence diagrams: `diagram-1773266119624-…png` (Create User), `…457276…` (Login + OTP + First Login), `…1773267027107…` (Forgot + Set Password), `…1773267059907…` (Locked to Pending Recovery), `…1773267108199…` (Contact Update), `…1773266713500…` (Change Password + Forced Logout), `…1773266812268…` (User List w/ Filters + Deleted), `…1773266815461…` (Inactivity Logout), `…1773272111342…` (User Lifecycle State), `…1773272117822…` (Auth Session Stage + Attempt Counters).

## Cross-references

- Tenant IP allowlist enforcement runs **in Core Gateway** (per `High-Level-Architecture.md` §2.2.3) — config source is Identity (here, §4.2.9).
- Multi-portal auth model uses single OIDC client (no separate clients per portal) — connects to `Front%2DEnd-Architecture.md` §5.14 ("single OIDC client").
- Roles/permissions belong to **Access Management** (Permissions-&-Authorization module).

## Implications for code

**Verified against code:**
- Every service + both gateways register Zitadel JWT Bearer ✓.
- Defense-in-depth: downstream services validate JWT independently of gateway ✓.
- Identity service has all the auth endpoints (login, OTP, first-login, change-password, etc.) ✓ (fallback §8.1 enumerates them).
- Zitadel webhook receiver at `…\Endpoints\Webhooks\ZitadelWebhookEndpoint.cs` ✓.
- Internal Zitadel services in `…\Infrastructure\Identity\Services\` (ZitadelUserService, ZitadelAuthService, ZitadelSessionService, ZitadelVerificationService) ✓.

**Conflicts with code:**

1. **`ValidateAudience` differs across services** — Commerce: `false`, Charging: `true`, Core Gateway: `false`, System Gateway: `false`. Wiki §4.2.6 #1 demands "Validate issuer and audience" — so `ValidateAudience` should be `true` everywhere. **Resolves fallback UNVERIFIED §5.** Currently 3 services do not validate audience — **HIGH security drift** for Commerce/Core Gateway/System Gateway.
2. **`commerce.identity-settings-sync.v1` Kafka topic** — wiki names this explicitly. Verify producer in Commerce code; expect a publisher class under `Falcon.Commerce.Infrastructure\Messaging\Kafka\`. Should also have an Identity consumer.
3. **Account Management Module** doc says "Commerce does not persist user records in this target model" — matches Security Architecture §4.8 #1. This was UNVERIFIED in fallback §8 about tenant ownership. **Resolution:** Commerce owns business **tenant/account** entity; Identity owns **users**. The `feedback_frontend_auth_identity_service.md` memory already encodes this.
4. **Micro-app API key (`X-MicroApp-Key` header) — NOT implemented in code.** No reference to `X-MicroApp-Key` middleware in any service. Vault integration not present. **Major implementation gap** — every micro-app endpoint currently authenticates only via JWT, not dual credential.
5. **Idle-timeout 30 min** — wiki §4.7. Verify in frontend; no concrete code reference yet.
6. **Tenant IP allowlist** — Core Gateway has middleware + consumer ✓ (per fallback §3.2). Wiki §4.2.9 names the **policy source as Identity Service**, but Commerce is currently the producer (per fallback §3.2). **Source-of-truth migration needed** — Identity should own the topic publisher, not Commerce.
7. **Defense-in-depth — Business User Status check** (§4.2.6 #4) — needs `Falcon identity projections` or cached status resolution in each downstream service. Verify with Grep for `IsActive` / lifecycle-aware authorization filters in Commerce/Charging/Provisioning.

**Implementation priority:**
- Fix `ValidateAudience=true` across the platform (HIGH).
- Move IP-allowlist publisher from Commerce to Identity (per §4.2.9).
- Implement dual-credential middleware in Platform Services Gateway (when built) for micro-app auth.
- Audit each backend for `lifecycle != Active → 403` enforcement.
