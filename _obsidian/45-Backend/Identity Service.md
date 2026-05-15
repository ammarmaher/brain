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

## Hubs

- [[BACKEND_INDEX]] · [[API_INDEX]] · [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[VALIDATION_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
