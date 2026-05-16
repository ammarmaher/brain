---
type: adr
adr-id: ADR-006
title: Why Identity Service owns user lifecycle (frontend never calls Zitadel directly)
status: accepted
date: 2026-05-16
deciders: [Ammar Maher, Falcon Identity Working Group, Falcon Frontend Working Group]
supersedes: []
superseded-by: []
---

*** ADR-006 — Why Identity Service owns the user lifecycle and the frontend never calls Zitadel directly ***
*** Status: accepted · Reversal severity: medium-cost (rewire every browser to Zitadel SDK + relocate IP-allowlist, custom-claims, tenant scoping) ***

# ADR-006 — Why Identity Service owns user lifecycle

## Context

The Falcon platform uses **Zitadel** as its OIDC provider — Zitadel ultimately stores the user credential, performs the password check, issues the OAuth2 token, and runs the OTP / MFA challenge primitives. The naive industry-standard approach to consuming an OIDC provider from a browser is straightforward: drop an OIDC client library (`oidc-client-ts`, `angular-auth-oidc-client`, `@auth0/angular-jwt`, etc.) into the frontend, point it at Zitadel's discovery URL (`.well-known/openid-configuration`), let it own the redirect-flow login, token storage, silent refresh, and logout. Backend services accept the Zitadel JWT, validate its signature against Zitadel's JWKS, and trust the claims.

Following that recipe on Falcon produced compounding pains the moment we got past the happy path:

1. **Custom claims have to be enriched server-side anyway.** Falcon's JWT must carry `tenant_id`, `user_type`, `nodeId`, and `urn:zitadel:iam:user:metadata.user-id` — none of which stock Zitadel populates. `SessionProvider` reads all four to drive routing, gateway selection, and PES (Policy Enforcement Service) calls ([CODE] `libs/falcon/src/core/lib/services/session-provider.service.ts:97-150` — cited by [BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md §7`). Either Falcon runs a Zitadel action hook (which is still backend code, owned by a Falcon service) or every browser receives a bare token and the gateways re-enrich it on every request. Both paths end up routing through a Falcon-owned service — the only question is whether the *user* sees that hop.

2. **IP allowlist is a tenant policy, not an IdP feature.** Falcon's `TenantSettings.AllowedIps` is a per-tenant policy stored in `FalconIdentityDb`. Every login, OTP, forgot-password, set-password, and first-login request runs `IpAllowlistPreProcessor<TRequest>` which (a) resolves tenant by `ByUsername` / `BySessionId` / `ByUserId`, (b) reads the client IP from the HTTP context, (c) validates against `TenantSettings.AllowedIps`, (d) throws `FalconException` on miss ([BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md §8`, [CODE] `src/Falcon.Identity.Api/Endpoints/Auth/PreProcessors/IpAllowlistPreProcessor.cs`). This is **pre-auth** enforcement — it must run *before* Zitadel's credential check, against a tenant that is resolved from request shape, against a policy table Zitadel does not own. There is no way to express it inside Zitadel.

3. **User lifecycle states live in Falcon, not Zitadel.** Falcon owns the canonical states `Pending / Active / Suspended / Locked / Deleted` ([VAULT] `Home/Software-Architecture-Design/Security-Architecture.md §4.1.2 lines 87-107`). Login is allowed for `Active` (and `Pending` only through the first-login flow); forgot-password is *stricter* — `Active` only. These rules cannot be encoded as Zitadel grants because the gates are Falcon business rules, not IdP states. A browser talking to Zitadel directly would bypass every one of them.

4. **Business rules (Falcon roles, PBAC, tenant scoping) live in Falcon services.** The PES authorization model, the tenant scoping, the org-hierarchy node binding — none of these are Zitadel concerns. They are Falcon concerns that *coincide* with auth.

5. **A browser-side OIDC library couples every UI to Zitadel.** Swapping IdP (Zitadel → Keycloak, Auth0, AzureAD) would be a frontend project per app. Wave 0 had v1 environment files carrying a Zitadel `clientId: '366680327604731913'` ([MEMORY] `feedback_frontend_auth_identity_service.md:16`) that we explicitly chose not to port forward — that single decision avoided weeks of coupling-removal work later.

6. **Audit trail needs aggregation in one place.** Logins, OTP verifications, password resets, first-login flows all need a single auditable timeline keyed by tenant. Zitadel's audit is per-Zitadel-org; Falcon's audit is per-tenant. They are not the same boundary. Identity Service centralizes audit via `MongoAuditLogger` against `FalconIdentityDb.AuditLog` ([BRAIN-OUT] `Brain Outputs/understanding/backend/identity/SERVICE_OVERVIEW.md §MongoDB`).

The pattern stares us in the face: every reason the naive approach fails is a reason a Falcon-owned service has to sit between the browser and Zitadel. The question is only whether that service is also the lifecycle owner — or whether lifecycle leaks back into Commerce / Charging / Provisioning.

## Decision

**The Identity Service (`falcon-core-identity-svc`) fronts Zitadel completely.** The frontend talks **only** to Identity Service, via the Identity Gateway at `https://auth.falconhub.space/api/`, through the thin `AuthApiService` + `LoginService` pair living in `apps/host-shell/src/app/core/auth/`. No frontend codebase imports an OIDC client library, references a Zitadel client ID / issuer URL / discovery endpoint, or installs `oidc-client-ts` / `angular-auth-oidc-client` / `@auth0/angular-jwt`. The only JWT-handling dependency on the frontend is `jwt-decode@^3.1.2` — a parser, not an OIDC client.

Identity Service owns:

- **Login** — email/password submit → Zitadel credential check → custom-claims enrichment (`tenant_id`, `user_type`, `nodeId`, `urn:zitadel:iam:user:metadata.user-id`) → JWT pair issued via `LoginStepResult.tokens`. State machine: `PasswordPending → (OtpPending)? → (PasswordChangeRequired)? → Authenticated`.
- **OTP send + verify** — multi-factor challenge primitives; SMS / email delivery orchestrated by Identity via `EmailCodeGeneratedDomainEvent` / `SmsCodeGeneratedDomainEvent` against `Smtp:*` / `Sms:*` providers ([BRAIN-OUT] `Brain Outputs/understanding/backend/identity/SERVICE_OVERVIEW.md §Other Infrastructure`).
- **Forgot password** — 3-step wizard (request OTP → verify OTP → set new password) routed through `auth/forgot-password`, `auth/verify-otp`, `auth/forgot-password/set-password`.
- **First-login change-password** — `auth/first-login` mandatory password change on first sign-in; returns tokens directly.
- **Refresh-token rotation** — `auth/refresh-token` rotates *both* access and refresh tokens (Zitadel rotates the refresh side, Identity returns the pair to the browser). Called by `RequestInterceptor` proactively 30s before expiry.
- **IP allowlist enforcement** — `IpAllowlistPreProcessor` runs on every login / OTP / forgot-password / set-password / first-login endpoint, resolving tenant by username / sessionId / userId.
- **User lifecycle CRUD** — `Users` aggregate, status transitions (`Pending → Active → Suspended → Locked → Deleted`), role assignment, email/phone verification. **Not Commerce. Not Charging. Not Zitadel directly.**
- **Tenant settings sync** — consumes `commerce.identity-settings-sync.v1` Kafka topic from Commerce; publishes `identity.user-events.v1` for downstream consumers (PES, Charging) ([BRAIN-OUT] `Brain Outputs/understanding/backend/identity/SERVICE_OVERVIEW.md §Kafka`).

The browser's job shrinks to: hit `auth/*` endpoints, render their `LoginStepResult` state machine, store the issued tokens in `sessionStorage`, attach `Authorization: Bearer <accessToken>` to every non-`auth/*` request through `RequestInterceptor`, refresh proactively via the interceptor when expiry < 30s, and clear the storage + redirect on logout.

The boundary is enforced by two cross-cutting rules:

- **[R-XC-001](../../rules/cross-cutting/R-XC-001-identity-owns-user-lifecycle.md)** — *Identity Service owns user lifecycle; Commerce does not.* Backend rule. Detects `INSERT INTO Users`, `class \w*UserRepository`, `IZitadelClient | ZitadelManagementClient | ZitadelUserService`, `namespace .+\.Users\b` in any non-Identity .cs file.
- **[R-XC-002](../../rules/cross-cutting/R-XC-002-frontend-never-calls-zitadel.md)** — *Frontend never calls Zitadel directly; go through Identity Service.* Frontend rule. Detects `zitadel`, `oidc-client(-ts)?`, `angular-auth-oidc-client`, `@auth0/angular-jwt`, `.well-known/openid-configuration`, 18-digit numeric `clientId` literals, non-`falconhub.space` `issuer` URLs in any `apps/**/*.ts` or `libs/**/*.ts` file.

## Alternatives considered

### A. Frontend uses `oidc-client-ts` (or `angular-auth-oidc-client`) directly to Zitadel — **rejected**
Drop an OIDC redirect-flow library into every Falcon frontend app (host-shell, admin-console, management-console, future mobile). Library owns login, refresh, storage, logout. Backend services validate the Zitadel JWT against Zitadel's JWKS and trust the claims. Rejected because:
- **Does not solve custom-claims enrichment** — `tenant_id`, `user_type`, `nodeId` are not in stock Zitadel tokens. The token still needs a Falcon-owned enrichment step, which means the request still routes through a Falcon service first; the OIDC library buys nothing.
- **Does not solve IP allowlist** — `IpAllowlistPreProcessor` must run *before* Zitadel's credential check, keyed on a tenant that the request shape determines. A browser-direct call to Zitadel skips this entirely. Moving the gate to a backend "post-validation" step is too late — the credentials have already been sent to Zitadel.
- **Does not solve lifecycle gating** — `Pending / Suspended / Locked / Deleted` would be enforced as a second hop after Zitadel says "credential OK", forcing every Falcon backend to re-fetch the user's Falcon status on every request. Or it lives at the gateway, which is exactly where Identity Service already sits.
- **Couples every UI to Zitadel.** Issuer URLs, client IDs, scopes, post-logout redirect URIs leak into env files for v1, v2, every future client. Swapping IdP becomes a multi-app frontend migration. Wave 0 v1 already showed the cost: a single legacy `clientId: '366680327604731913'` line that we explicitly refused to port forward.
- **Bigger bundle, more attack surface.** OIDC client libraries are 50-100KB and own the redirect flow + token storage + silent renew via hidden iframe — all attack surface for redirect-URI tampering, iframe-clickjacking, and XSS-driven token exfiltration. We replaced that with `jwt-decode@^3.1.2` (a parser, ~3KB) plus a thin `HttpClient` call.

### B. Backend-for-Frontend (BFF) pattern, one per app — **rejected**
Each frontend app (host-shell, admin-console, management-console) ships with its own BFF that owns the session cookie, talks to Zitadel server-side, and proxies API calls. Browser never sees the JWT. Rejected because:
- **3× duplication of auth logic.** Three BFFs, three session cookies, three cookie-rotation pipelines, three logout paths, three refresh implementations. Every login policy change is a 3-way edit.
- **Doesn't solve the lifecycle question.** Each BFF still has to call *something* for tenant resolution, IP allowlist, status check. That something is Identity Service. The BFFs would become trivial proxies over Identity — a layer of indirection without value.
- **Module Federation already provides a federation seam.** The host shell *is* the de-facto BFF surface for shared concerns (auth facade, gateway routing, session provider). Adding a node-side BFF doubles up that role without splitting responsibilities cleanly.
- **Cookies cross-domain are a deployment headache.** Host-shell, admin-console, management-console are served on different routes under the same origin today; cookie scoping is easy. Cross-origin federated remotes (planned) would require third-party cookies — increasingly blocked by browsers.

### C. Shared library that ALL services (frontend + backend) call into for auth — **rejected**
Author `@falcon/auth-core` as a multi-target package (TypeScript for the browser, .NET for backend services) that encapsulates the Zitadel calls + custom claims enrichment + IP allowlist check. Every consumer (frontend, Commerce, Charging) imports it. Rejected because:
- **Library shipped to the browser still leaks Zitadel coupling.** The whole point of R-XC-002 is that *no frontend has the Zitadel issuer URL in its bundle*. A shared library doesn't fix that — it just hides the import path.
- **Library-shaped state ≠ service-shaped state.** Auth involves cross-cutting state (sessions, rate limits, audit log, refresh token rotation). State belongs in a service with a database, not a library. Embedding state in a library forces every consumer to ship its own session store, which is the very fragmentation R-XC-001 prohibits.
- **Versioning hell.** A breaking library change forces every consumer (3 frontend apps + 6 backend services) to upgrade in lockstep. A service contract is independently versioned.

### D. Commerce / other services own their own user creation — **rejected**
Let Commerce create a `Customer` aggregate that includes a `User` sub-aggregate, owns its own `Users` table, and calls Zitadel's management API to provision credentials. Charging / Provisioning do the same per their domain. Rejected because:
- **Split-brain user state.** Three writable `Users` tables, three potential sources of truth. Dual-write divergence is a permanent data-integrity bomb (a customer "updated" in Commerce but stale in Charging; suspending a user in Identity but Commerce still treats them as active).
- **Violates the Wiki rule explicitly.** [VAULT] `Home/Software-Architecture-Design/Security-Architecture.md §4.1.1 lines 31-48` enumerates Identity's ownership: *user master data, user lifecycle and status transitions, login and recovery workflows, contact verification workflows, account and node membership, portal eligibility checks, login security-policy enforcement, integration with Zitadel.* This is the architectural rule, not a preference.
- **No story for OTP / password reset / suspend / delete.** If Commerce creates the user, who owns the "forgot password" flow? The "lock after N failed logins" policy? The "send a new OTP" rate limiter? Every flow ends up needing Identity anyway — Commerce's `Users` table becomes a denormalization with no write-side ownership.
- **PR-pattern in flight.** Some Commerce features did briefly create users locally — those are the violations [R-XC-001](../../rules/cross-cutting/R-XC-001-identity-owns-user-lifecycle.md) was authored to detect. The fix pattern is documented in the rule's "Fix recipe" section: inject `IIdentityServiceClient`, delete the local `Users` table, subscribe to Identity's Kafka events for a read-only `UserProjection`.

### E. Identity Service fronts Zitadel; frontend talks only to Identity (chosen)
Single ownership, single audit log, single set of business gates, single IdP coupling point (the backend, inside Identity). Browser talks to one host (`auth.falconhub.space/api/`) over plain HTTPS, with one stateless contract (`ServiceOperationResult<LoginStepResult>`), one storage convention (`sessionStorage`), and one refresh interceptor.

## Consequences

### Positive

- **Single ownership of user state.** All user-lifecycle writes land in `FalconIdentityDb.Users` ([BRAIN-OUT] `Brain Outputs/understanding/backend/identity/SERVICE_OVERVIEW.md §MongoDB`). Every other service either calls `IIdentityServiceClient` or hydrates a read-only `UserProjection` from the `identity.user-events.v1` Kafka topic — never writes. Dual-write divergence is structurally impossible.

- **Custom-claims enrichment happens in one place.** `tenant_id`, `user_type`, `nodeId`, `urn:zitadel:iam:user:metadata.user-id` are populated by Identity during token issuance. The frontend's `SessionProvider.setFromToken(accessToken)` ([CODE] `libs/falcon/src/core/lib/services/session-provider.service.ts:97-150`) decodes the JWT once and persists `UserSession` to `localStorage` — no second round-trip needed for routing decisions.

- **IP allowlist enforced server-side, pre-auth.** `IpAllowlistPreProcessor<TRequest>` runs on all 5 anonymous auth endpoints (`login`, `verify-otp`, `resend-otp`, `forgot-password`, `forgot-password/set-password`, `set-password`, `first-login`), with the right `TenantResolutionStrategy` per request shape ([BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md §8`). The browser cannot route around it because the browser cannot talk to Zitadel.

- **Business rules co-located with auth.** Lifecycle gates (`Active` may login, `Pending` may first-login-only, `Suspended/Locked/Deleted` blocked) sit in the same service as the Zitadel orchestration ([VAULT] `Home/Software-Architecture-Design/Security-Architecture.md §4.1.2 lines 97-107`). A single PR can adjust login eligibility without coordinating across two repos.

- **Audit log centralized.** Every login attempt, OTP verification, password reset, first-login completion, and suspend / lock / delete writes to `FalconIdentityDb.AuditLog` via `MongoAuditLogger` ([BRAIN-OUT] `Brain Outputs/understanding/backend/identity/SERVICE_OVERVIEW.md §MongoDB`). Per-tenant timeline, queryable, retained in Falcon ownership rather than spread across Zitadel + N services.

- **IdP-agnostic frontend.** Zero browser code references Zitadel. Swapping Zitadel for Keycloak, Auth0, or AzureAD is a backend change inside `Falcon.Identity.Api/Infrastructure/Identity/` — zero frontend churn. The contract the browser sees (`auth/login` returning `LoginStepResult`) is stable across IdP changes.

- **Bundle savings.** No `oidc-client-ts` / `angular-auth-oidc-client` / `@auth0/angular-jwt` (50-100KB each). Only `jwt-decode@^3.1.2` (~3KB) for parsing the access-token expiry. Cited by the Verification grep below.

- **One refresh contract.** `auth/refresh-token` rotates both access and refresh tokens; the `RequestInterceptor` proactively refreshes 30s before expiry; the `ResponseInterceptor` reactively refreshes on protected-endpoint 401s ([BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md §2.5`). One mechanism, one BehaviorSubject mutex (`isRefreshing` + `refreshTokenSubject`), one outcome.

### Negative

- **Identity Service is a SPOF for the platform.** Every login, every refresh, every OTP, every password reset, every user-lifecycle write goes through this one service. If it is down, **all auth is down** — no user can sign in, no existing session can refresh past its 30-minute access-token window, no user can be created in Commerce (because Commerce now calls `IIdentityServiceClient` for user provisioning per [R-XC-001](../../rules/cross-cutting/R-XC-001-identity-owns-user-lifecycle.md) §Fix recipe). Mitigation: Identity is stateless behind MongoDB + Redis + Zitadel — horizontal scale, health probes, and Zitadel HA reduce blast radius but do not remove it. This is the accepted concentration cost.

- **Refresh-token race across Module Federation remotes — [D-2026-05-16-14].** Each frontend app (host-shell, admin-console, management-console) runs its own `AuthService` singleton with its own `isRefreshing` BehaviorSubject mutex. If two apps detect 401 simultaneously (e.g. host-shell on a feature request + admin-console-remote on a dashboard widget), both can fire `auth/refresh-token` in parallel. Zitadel rotates the refresh token on the first call; the second call gets `invalid_grant` and logs the user out. Documented as open question 6 in [BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md §13 #6`. Likely fix: centralize refresh through the host-only `FALCON_AUTH` facade and have remotes subscribe to `accessToken$` instead of running their own interceptor. Not in scope for this ADR — captured for future work.

- **`auth/logout` not currently called from FE — [D-2026-05-16-11].** `AuthService.logout()` is purely client-side: clear `sessionStorage`, clear `SessionProvider`, clear `falcon_auth_flow`, emit nulls on `FALCON_AUTH` facade subjects, redirect to `/login` ([CODE] `apps/host-shell/src/app/core/auth/auth.service.ts:93-101` per [BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md §9`). The backend `POST auth/logout` endpoint exists ([BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md §6 row 9`) but is never invoked. Consequences: no Zitadel session revocation, no backend audit-log entry on logout, refresh token remains valid until its 14-day total expiry. Documented as open question 4. Mitigation candidate: wire `AuthService.logout()` to call `auth/logout` with the current refresh token before clearing storage.

- **Multi-tab token drift.** `sessionStorage` is per-tab — when tab A refreshes its tokens, tab B's `sessionStorage.access_token` is stale. Tab B will refresh itself on its next request, which is correct but causes a redundant refresh round-trip per tab. Not a security problem; a small perf cost. `BroadcastChannel` sync is a candidate future fix ([BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md §13 #9`).

- **`scheduleSessionTimeout` logout drops the user's page context.** When the wall-clock timer fires, `logout()` runs directly without writing `auth_redirect` first. The user loses their place. Documented as open question 5 ([BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md §13 #5`). Small UX paper cut; fix is a one-line storage write.

### Trade-offs accepted

- **One service to operate and harden.** Identity Service becomes the platform's most security-critical surface. It is targeted by every credential-stuffing / OTP-replay / IP-spoof attempt before any other Falcon service. Accepted because the alternative — distributing user state across N services or pushing OIDC into N browsers — is structurally worse, not just operationally worse.

- **An extra hop on every auth request.** Browser → Identity Gateway → Identity Service → Zitadel, instead of Browser → Zitadel. ~10-30ms latency added per call. Accepted because the hop *is* the enforcement layer — IP allowlist, lifecycle gating, custom claims, tenant scoping all happen in that hop. Removing the hop would require relocating all four somewhere else.

- **Stateful refresh-rotation requires careful concurrency handling.** The `isRefreshing` BehaviorSubject mutex is correct for a single-app instance ([BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md §2.5`) but does not span Module Federation remotes — see negative bullet above. Accepted as the price for not embedding refresh logic in a federation-aware singleton (which would couple `@falcon/sdk` to refresh internals).

## Verification

- **Workspace-wide R-XC-002 grep returns ZERO direct Zitadel calls.** Performed 2026-05-16 ([BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md §Verification`):

| Probe | Result |
|---|---|
| `zitadel\.io`, `zitadel-`, `zitadel\.cloud`, `/oauth/v2/`, `/oidc/v1/` in `apps/` + `libs/` | **0 matches** |
| `package.json` for `angular-auth-oidc-client`, `oidc-client-ts`, `@auth0/angular-jwt` | **Not installed** |
| `apps/host-shell/src/environments/*.ts` for Zitadel issuer / clientId | **Not present** (only `baseURLIdentityGateway` → `auth.falconhub.space/api/`) |
| All 9 `AuthApiService` methods route through `Gateway.IdentityGateway` | **Yes** ([CODE] `apps/host-shell/src/app/core/auth/auth-api.service.ts:27`) |
| Frontend JWT-handling dependency | `jwt-decode@^3.1.2` only (a parser, not an OIDC library) |

- **9 endpoints under `auth/*` documented in [BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md §6`:** `auth/login`, `auth/verify-otp`, `auth/resend-otp`, `auth/forgot-password`, `auth/forgot-password/set-password`, `auth/set-password`, `auth/first-login`, `auth/refresh-token`, `auth/logout`. The first 7 are anonymous and IP-allowlist-gated; `auth/refresh-token` is anonymous and rate-limited 20/60s; `auth/logout` is anonymous and unused from the FE today.

- **All 9 endpoints are `[AllowAnonymous]`.** The auth flow is anonymous by definition — the client has no token yet at login time. The `RequestInterceptor` explicitly skips token attachment for any URL containing `/auth/`; the `ResponseInterceptor` explicitly skips 401-refresh on `/auth/*` because a 401 on `auth/login` means "wrong credentials", not "token expired" ([BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md §6 final paragraph`).

- **`IpAllowlistPreProcessor` runs on login, OTP, forgot-password, set-password, first-login.** Verified per-endpoint in [BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md §6` table column "Pre-processor". Each request type implements `IIpAllowlistProtected` with a `TenantResolutionStrategy` (`ByUsername` / `BySessionId` / `ByUserId`). The pre-processor throws `FalconException` on miss, surfaced to the FE inline-banner via `GetStartedComponent.extractHttpError` ([BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md §8`).

- **Token storage = `sessionStorage` (per-tab).** Verified by Agent E in [BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md §5` from `apps/host-shell/src/app/core/auth/token-storage.service.ts` lines 10-47. Keys: `access_token`, `refresh_token`. Trade-off documented: closes-on-tab-close in exchange for slightly smaller XSS exposure window vs `localStorage`.

- **Identity Service is the rule's primary author.** Both [R-XC-001](../../rules/cross-cutting/R-XC-001-identity-owns-user-lifecycle.md) (backend ownership) and [R-XC-002](../../rules/cross-cutting/R-XC-002-frontend-never-calls-zitadel.md) (frontend boundary) cite Identity Service as the sole legitimate owner of user-lifecycle writes and the sole legitimate target of frontend auth calls. Both rules are `severity: must` with operational guardrails; both have structural detectors that scan source at audit time.

- **Wiki concurrence.** [VAULT] `Home/Software-Architecture-Design/Security-Architecture.md §4.1.1 lines 31-58`: *"Identity Service owns user master data, user lifecycle and status transitions, login and recovery workflows, contact verification workflows, account and node membership, portal eligibility checks, login security-policy enforcement, integration with Zitadel, user read models for admin and client screens. Zitadel remains responsible for credential checks, session and OTP challenge primitives, token issuance, session handling, identity lockout primitives."* The split between *owner* (Identity) and *engine* (Zitadel) is the wiki-canonical framing.

- **No leftover Zitadel client IDs in env files.** Wave 0 v1 contained `clientId: '366680327604731913'` ([MEMORY] `feedback_frontend_auth_identity_service.md:16`); current host-shell environment files contain only `baseURLIdentityGateway` pointing to `auth.falconhub.space/api/` ([CODE] `apps/host-shell/src/environments/environment.ts:24`).

## Related

- **[ADR-003]** — *Why Module Federation (3 apps)* — establishes the federation topology that creates the refresh-race described in §Consequences/Negative ([D-2026-05-16-14]). Each remote runs its own `AuthService` singleton; the race exists *because* federation made them separate Angular runtimes that share `sessionStorage` but not the `isRefreshing` mutex.
- **[BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md`** — Agent E's Tier-2 deep dive (2026-05-16). The end-to-end auth doc this ADR explains the *why* of. Read for the *how* (state machine, interceptor chain, token storage, federation delivery channels, IP allowlist surface, anti-patterns, open questions).
- **[R-XC-001]** — backend rule: Identity Service owns user lifecycle; Commerce / Charging / Provisioning / gateways may not own a `User` aggregate, may not write a `Users` table, may not import a Zitadel management client.
- **[R-XC-002]** — frontend rule: no Zitadel string literals, no OIDC client libraries, no discovery URL reads, no 18-digit numeric `clientId` literals, no non-`falconhub.space` `issuer` properties in frontend source.
- **[D-2026-05-16-11]** — *`auth/logout` not wired from FE.* Open decision: should `AuthService.logout()` call `POST auth/logout` to revoke the Zitadel session and write a logout-audit row, or remain client-side-only? See [BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md §9 + §13 #4`.
- **[D-2026-05-16-14]** — *Refresh-token race across Module Federation remotes.* Open decision: centralize refresh through the host-only `FALCON_AUTH` facade vs leave per-app refresh with a `BroadcastChannel` synchronization layer? See [BRAIN-OUT] `AUTH_FLOW_ARCHITECTURE.md §10 last row + §13 #6`.
- **[VAULT] `Home/Software-Architecture-Design/Security-Architecture.md`** — wiki source of truth for the Identity-owner / Zitadel-engine split.
- **[VAULT] `Home/Software-Architecture-Design/Permissions-&-Authorization-Module-(Policy-Based-Access-Control).md`** — PBAC / PES sits *after* this ADR's auth decision; it consumes the `urn:zitadel:iam:org:project:roles` claim that Identity enriches.
- **[BRAIN-OUT] `Brain Outputs/understanding/backend/identity/SERVICE_OVERVIEW.md`** — Identity Service backend overview: project layout, ports, endpoints, Kafka topics, MongoDB, Redis, Zitadel integration.
- **[BRAIN-OUT] `Brain Outputs/understanding/backend/identity/FRONTEND_CONTRACT.md`** — the wire contract the frontend codes against: response envelope, JWT claims, multi-step auth state machine, token lifetimes.
- **[MEMORY] `feedback_frontend_auth_identity_service.md`** — the canonical user-correction memory (2026-04-18): "The Falcon frontend must not talk to Zitadel; all auth flows go through `falcon-core-identity-svc`."

## Tags

#type/adr #frontend #backend #auth #identity #zitadel #security #tier-3
