---
type: entity-reconciliation
entity: session
prd: PRD-02
service: identity
drift-count: 10
created: 2026-05-15
---
*** Entity Reconciliation E-session — Session ***
*** PRD: PRD-02 User Management · Backend service: Identity · 2026-05-15 ***

# E-session — Session

> A live authenticated session (JWT access token + refresh token state + idle-timeout). Created when a user completes the auth flow ([[E-otp-challenge]] verified + password check passed). 30-minute idle timeout per BR-UM (PRD). Owned by [[Identity Service]] — token issuance and refresh proxy to Zitadel.

## PRD definition (business-conceptual)

- **PRD module:** [[02 User Management]]
- **Source:** [ENTITIES.md](../../../Brain%20Outputs/prd/modules/02-user-management/ENTITIES.md)
- **PRD fields:**
  - `id`: identifier
  - `userId`: identifier
  - `ipAtLogin`: string — IP address captured at session creation (for audit)
  - `createdAt`: timestamp
  - `lastActivityAt`: timestamp
  - `idleTimeoutAt`: timestamp = `createdAt + 30 min` (rolling per BR-UM idle-timeout rule)
  - `refreshTokenId`: identifier — link to refresh token record
- **Lifecycle:** `Active` → `Expired` (logout / idle / forced)

## Backend DTO mapping (concrete request/response shapes)

- **Service:** [[Identity Service]]
- **DTO source:** [DTO_DICTIONARY.md](../../../Brain%20Outputs/understanding/backend/identity/DTO_DICTIONARY.md)
- **Validations source:** [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/identity/VALIDATIONS.md)
- **Relevant DTOs:**
  - `LoginRequest` — `POST /auth/login`: `string Username, string Password`
  - `LoginStepResponse` — output of every auth flow step — `string? SessionId, eAuthenticationStage Stage, bool RequiresOtp, bool RequiresPasswordChange, int? OtpCodeLength, int? OtpExpiresInSeconds, AuthenticatedResult? Tokens, string? DevOtpCode`
  - `AuthenticatedResult` (nested) — tokens bundle (access, id, refresh) — populated **only when `Stage == Authenticated`**
  - `RefreshTokenRequest` — `POST /auth/refresh-token` (record — fields not enumerated)
  - `LogoutRequest` — `POST /auth/logout` (record — fields not enumerated)
  - `TokenResult` (internal) — Zitadel token exchange result
  - `AuthenticationSession` (internal) — persisted session record (login flow state machine) — also touches [[E-otp-challenge]]

## Field reconciliation

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `id` | `LoginStepResponse.SessionId` (shared with [[E-otp-challenge]] — same id covers the whole flow) | identifier → `string SessionId` | ⚠ DRIFT — backend uses `SessionId` for both the OTP-flow session AND the authenticated session. Once `Stage == Authenticated`, the same `SessionId` represents an `AuthenticationSession` in the "logged-in" state. PRD models OTP and Session as separate entities. |
| `userId` | _not on public DTOs_ — embedded in JWT access token claims and resolved server-side; `UserResponse.Id` returned via `GET /user/me` once authenticated | identifier → JWT claim (server-side) | ⚠ DRIFT — backend does not surface `userId` directly on session DTOs (correct: client decodes from token). The PRD models it as a stored field on the session record. |
| `ipAtLogin` | _not on public DTOs_ — captured server-side by `IpAllowlistPreProcessor` and stored on `AuthenticationSession` (internal) | string → server-only | ⚠ DRIFT — backend stores it but does not expose on the wire (correct design; audit-only). |
| `createdAt` | _not on public DTOs_ — internal to `AuthenticationSession` | timestamp → server-only | ❌ MISSING on backend public surface — not exposed (could be derived from JWT `iat` claim) |
| `lastActivityAt` | _not on public DTOs_ — updated server-side on each authenticated request | timestamp → server-only | ❌ MISSING on backend public surface — backend tracks but does not expose; FE typically maintains its own activity tracker for client-side idle-timeout UX |
| `idleTimeoutAt` (`createdAt + 30 min`) | _not on public DTOs_ — server enforces; FE infers from JWT exp claim or session config | timestamp → server-only | ❌ MISSING on backend public surface — not surfaced explicitly. Frontend must hardcode the 30-minute rule or fetch from config. |
| `refreshTokenId` | inside `AuthenticatedResult.<refresh>` token (opaque to FE) | identifier → opaque token string | ⚠ DRIFT — backend gives FE an **opaque refresh token string**, not an id. FE uses it as-is for `RefreshTokenRequest`. PRD models a relational id; backend uses an opaque value. |
| _(none)_ | `LoginStepResponse.Stage` (`eAuthenticationStage`: InProgress / OtpRequired / PasswordChangeRequired / Authenticated) | n/a → enum 4-value | ➕ Backend exposes an explicit auth state machine on the response. Session is only fully created at `Authenticated`. |
| _(none)_ | `LoginStepResponse.RequiresOtp`, `RequiresPasswordChange` (bools) | n/a → bool | ➕ Convenience bools derived from `Stage`. |
| _(none)_ | `AuthenticatedResult.<access>` (access token), `<id>` (id token), `<refresh>` (refresh token) | n/a → 3 token strings | ➕ Standard OAuth2/OIDC token bundle. PRD models the conceptual session but not the token shapes. |

## Drift / gaps summary

- **Drift items:**
  - `id` shared with [[E-otp-challenge]] as `SessionId` — same handle covers OTP flow + authenticated session
  - `userId` not on wire (JWT-resolved) — correct design, but a PRD-vs-API model mismatch
  - `refreshTokenId` → opaque refresh token string on the wire
- **Missing on backend (public surface):**
  - `ipAtLogin` — stored, not exposed (correct audit-only design)
  - `createdAt` — not exposed (derivable from JWT `iat`)
  - `lastActivityAt` — not exposed (FE maintains client-side; server-side tracking is opaque)
  - `idleTimeoutAt` — not exposed (FE hardcodes the 30-min rule or reads from config)
- **Extra on backend:**
  - `Stage` (4-value auth state machine) + `RequiresOtp` / `RequiresPasswordChange` convenience bools
  - Full OAuth2/OIDC token bundle (access + id + refresh)
- **Structural note:**
  - The PRD models a clean separation: `OtpChallenge` (one-shot) vs `Session` (long-lived). Backend collapses both into a single `SessionId` lineage where `AuthenticationSession` tracks the entire arc (login → OTP → password-change → authenticated). The transition from "OTP challenge" to "Session" is signaled by `Stage == Authenticated`.

## Related validation rules (V-rule notes)

- [[V-login-lockout-3-wrong-attempts]] — `LoginEligibilityPolicy` + Zitadel · `UserLocked` (423) gates session creation
- [[V-account-ip-allowlist-enforcement]] — `IpAllowlistPreProcessor` captures `ipAtLogin` and rejects on mismatch before session is ever created
- _no V-rule yet for the 30-minute idle-timeout rule (BR-UM idle-timeout) — candidate for future Phase 2C extension_
- _no V-rule yet for the refresh-token rotation policy — candidate for future Phase 2C extension_
- _no V-rule yet for the 4-stage `eAuthenticationStage` state machine — candidate for clarification_

## Pages using this entity

- Login flow (first-time + regular) — page not yet seeded under `10-Pages/`
- Logout (header dropdown action) — implicit
- Idle-timeout dialog — not yet seeded
- All authenticated pages (session existence is the gate) — implicit

## Cross-service touches

- [[Core Gateway Service]] / [[System Gateway Service]] — JWT validation on every authenticated request; `tenantId` + `path` extracted and forwarded to downstream services
- [[E-otp-challenge]] — same `SessionId` lineage; session "becomes" authenticated when OTP + password-change states clear
- [[E-user]] — `UserResponse` is the first fetch after `Stage == Authenticated` (typically `GET /user/me`)
- [[Access PES Service]] — engaged on every authenticated request for permission decisions (sees JWT claims, not the session record directly)
- Zitadel — token issuance + refresh delegated; Identity proxies (FE never calls Zitadel directly)

## Tags

#type/e-entity #prd/02 #service/access #service/core-gateway #service/identity #service/system-gateway #severity/high #drift #security

## Hubs

- [[API_INDEX]] · [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
