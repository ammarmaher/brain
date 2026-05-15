---
type: backend-service
service: identity
primary-prds: [PRD-02, PRD-01]
repo: falcon-core-identity-svc
created: 2026-05-15
---
*** Backend Service — Identity ***
*** SoT: Brain Outputs/understanding/backend/identity/ ***
*** Repository: C:\Falcon\Falcon\falcon-core-identity-svc ***

# Identity Service

> Owns the **complete user lifecycle**: authentication (login · OTP · refresh tokens), password management (change · forgot · reset · force-change), user CRUD, email/phone verification, role assignment, IP allowlist enforcement, and Zitadel integration (auth provider · user backend).
>
> **Falcon Wiki rule:** *"Identity Service owns user lifecycle — NOT Commerce, NOT Zitadel directly."* The **frontend NEVER calls Zitadel directly** — all auth runs through Identity Service.

## Source-of-truth files

- [SERVICE_OVERVIEW](../../../Brain%20Outputs/understanding/backend/identity/SERVICE_OVERVIEW.md)
- [ENDPOINT_REGISTRY](../../../Brain%20Outputs/understanding/backend/identity/ENDPOINT_REGISTRY.md) — FastEndpoints under `Auth/`, `Users/`, `Security/`, `Webhooks/`
- [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/identity/DTO_DICTIONARY.md)
- [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/identity/VALIDATIONS.md)
- [ERRORS](../../../Brain%20Outputs/understanding/backend/identity/ERRORS.md)
- [FRONTEND_CONTRACT](../../../Brain%20Outputs/understanding/backend/identity/FRONTEND_CONTRACT.md)
- Tests: ~340 xUnit tests in `Falcon.Identity.Tests`

## PRDs this service implements

- [[02 User Management]] — **primary** (User · UserStatusHistory · LoginAttempt · OtpChallenge · Session · PermissionGroup · Permission)
- [[01 Account Management]] — Account-Owner user creation at Step 5 of Add-Client wizard
- [[04 Contact Group Management]] — user identity for share-policy resolution
- [[05 Templates]] — Maker/Checker user identity

## Pages served

- Login flow (first-time + regular)
- Add User wizard (3 tabs)
- Edit User · Change Password · Forgot Password · Force-change
- OTP popup (shared with [[Organization Hierarchy]] `otp-popup` section)
- [[Organization Hierarchy]] — IP allowlist enforcement reads from here (allowlist is owned by Commerce; enforced at gateway via Identity)

## Falcon components backed by this service

- [[Falcon Input]] (email · phone · password) · [[Falcon Dialog]] (OTP popup) · [[Falcon Button]]
- [[Falcon Data Table]] (Users list · status history · login attempts)
- [[Falcon Status Badge]] (user status pills: Pending / Active / Suspended / Locked / Deleted)
- [[Falcon Dropdown]] (role selector)

## Validation contract

Per [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/identity/VALIDATIONS.md) — email/phone format · password complexity tiers (per `ePasswordSecurityLevel`) · OTP validity window · lockout thresholds · idle-timeout · role assignment rules.

## Zitadel integration

- Adapter layer in `Infrastructure/Identity/` translates Falcon user model ↔ Zitadel user
- Frontend OAuth2/OIDC flow terminates at Identity (not Zitadel) — Identity proxies to Zitadel
- Webhooks: `Endpoints/Webhooks/` receive Zitadel events (e.g. password reset confirmations)

## Gateway exposure

- Client traffic → [[Core Gateway Service]]
- Admin traffic → [[System Gateway Service]]

## Validation rules enforced here (6)

PRD-02 User Management:
- [[V-user-first-last-name-letters-only]] — FluentValidation · `FirstNameLettersOnly` / `LastNameLettersOnly` / `MaxLengthExceeded` (BR-UM-11)
- [[V-username-format-uniqueness-immutable]] — `UsernameMustStartWithLetter` / `DuplicateUsername`. **⚠ PRD says ≤30; backend says ≤100 — drift**
- [[V-normal-user-limit-enforcement]] — `UserQuotaPolicy` · `NormalUserLimitReached` (BR-UM-07/09/17/38)
- [[V-login-lockout-3-wrong-attempts]] — `LoginEligibilityPolicy` + `VerificationRateLimitPolicy` + Zitadel · `UserLocked` (423) / `OtpResendLimitExceeded` / `OtpStillValid` (429)
- [[V-password-complexity-per-security-level]] — `PasswordPolicy` · `PasswordTooShort` / `PasswordRequiresUppercase` / `PasswordsDoNotMatch`

PRD-01 Account Management (Identity consumer / preprocessor):
- [[V-account-ip-allowlist-enforcement]] — `IpAllowlistPreProcessor` · `IpNotAllowed` (403) / `InvalidIpAddress` (403). Companion layer: [[Core Gateway Service]] caches the allowlist in Redis.
- [[V-password-security-level-enum]] — Identity consumes the enum set by Commerce on `Settings.PasswordSecurityLevel`.

Full index: [[VALIDATION_INDEX]] → "Triangulated validation rules" section.

## Tags

#type/backend-service #prd/01 #prd/02 #prd/04 #prd/05 #service/core-gateway #service/system-gateway #drift #security

## Hubs

- [[BACKEND_INDEX]] · [[API_INDEX]] · [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[VALIDATION_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
