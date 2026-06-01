---
name: Wave 5b Pending Question — BR-UM-29 idle-timeout configuration source
description: Where is the 30-min idle timeout configured? PRD-implied UI-editable, code shows JWT-TTL only.
type: pending-question
agent: ammar-auth
wave: 5b
controller: AuthController
date: 2026-05-17
status: OPEN
prd_ref: BR-UM-29
---

## Question

PRD-02 (`BR-UM-29`) specifies a **30-minute idle logout**. Where is this value configured? Is it
- (a) The access-token TTL in `appsettings.json` → `Zitadel:Tokens:AccessTokenExpiry`?
- (b) A separate identity-service config value not in code yet?
- (c) UI-editable per tenant (e.g. via `TenantSettings`)?

## Code evidence

- [CODE] `appsettings.json` (per service `SERVICE_OVERVIEW.md` FE contract):
  `AccessTokenExpiry = 1800s (30 min)` — coincidence with BR-UM-29 strong, but **not labeled** as
  "idle timeout".
- [CODE] `Domain/Entities/TenantSettings.cs` — does **not** contain an IdleTimeoutSeconds field
  (confirmed by grepping `TenantSettings` model for "idle" / "timeout" — no hit).
- [CODE] `Application/Users/UseCases/UpdateUserProfileHandler.cs` — does not interact with timeout.
- No PUT/PATCH on TenantSettings exposes an idle-timeout field today.
- Frontend (host-shell) currently uses access-token TTL implicitly via 401 → refresh-token retry
  pattern — there is no explicit `IDLE_TIMEOUT_MS` constant in the FE app.

## Interpretation paths

**Path A (most likely):** The 30-min idle is the **access-token TTL** (1800 s). FE refresh failure
on a long-idle session naturally logs the user out. PRD wording matches but there is no per-tenant
override.

**Path B:** PRD-02 intends per-tenant configurable idle. This is **not implemented** today —
no field exists in `TenantSettings`, no UI hooks exist in `Settings` tab. Would require:
- `TenantSettings.IdleTimeoutSeconds` field
- A `PUT /commerce/setting` patch to set it
- FE plumbing to read the value and force-logout after that many idle seconds
- BE plumbing to honour the value (token TTL is global per Zitadel app, not per-tenant — would need
  application-level enforcement).

## Recommendation

Apply Path A unless explicitly told otherwise. The 1800-s access-token TTL is the only timeout
machinery in code today. If PRD's "30 min" was meant per-tenant configurable, raise as a feature
gap.

## Files referenced

- C:\Falcon\Brain Outputs\understanding\backend\identity\controllers\AuthController\FRONTEND_CONTRACT.md (Idle timeout section)
- C:\Falcon\Brain Outputs\understanding\backend\identity\SERVICE_OVERVIEW.md
- C:\falcon\Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\appsettings.json
