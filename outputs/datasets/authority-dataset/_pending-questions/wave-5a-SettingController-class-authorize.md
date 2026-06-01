---
type: pending-question
wave: 5a
controller: SettingController
fork-id: F-004
status: OPEN
date: 2026-05-18
module: account-mgmt
feature: class-authorize
verification: unverified
last-verified: 2026-05-18
tags: ["#status/open", "#module/account-mgmt", "#verification/unverified", "#layer/be"]
up: "[[Q-tickets-MOC]]"
parent: "[[Q-tickets-MOC]]"
tracked-as-task: true
priority: p1
due: 
blocked-on: [security-decision]
---

# Pending Question — SettingController missing class-level `[Authorize]`

> **Wave**: 5a (Commerce Controller deep-dive)
> **Controller**: `SettingController` (also affects `InformationController`)
> **Topic**: class-level Authorize attribute
> **Classification**: F-004 (entity drift) + potential F-022 (security)
> **Raised by**: Ammar Core-Commerce
> **Date raised**: 2026-05-18

## Why halted

`SettingController` declares only `[ApiController]` at the class level — **no `[Authorize]`**.

Only the `POST /wallets` action has an explicit `[Authorize(Policy = FalconOnly)]`. The other three actions (`GET /`, `PUT /`, `GET /wallets/{id}`) rely on:
- Upstream gateway authorization
- Handler-side checks (e.g. `ValidateClientOwnership`, `eUserType.Falcon` branch for quota writes)

Comparable controllers ARE class-level authorized:
- `AccountHierarchyController` — `[Authorize]` at class
- `ApplicationController` — `[Authorize]` at class
- `CommunicationChannelController` — `[Authorize]` at class
- `ContractsController` — `[Authorize]` at class
- `LookupController` — `[Authorize]` at class
- `NodeController` — `[Authorize]` at class (per existing dossier)
- `SecurityController` — intentionally `[AllowAnonymous]` (east-west)

**`SettingController` and `InformationController` are the outliers.** Without class-level `[Authorize]`, an unauthenticated request *could* reach the action if the gateway doesn't reject. Whether this leaks data depends on the handler's own checks.

## Sources

- [CODE] `falcon-core-commerce-svc/src/Falcon.Commerce.Api/Controllers/SettingController.cs:18` — missing `[Authorize]`
- [CODE] `falcon-core-commerce-svc/src/Falcon.Commerce.Api/Controllers/InformationController.cs:13` — missing `[Authorize]`
- [CODE] (Reference) `AccountHierarchyController.cs:15` `[Authorize]`
- [CODE] (Reference) `ContractsController.cs:15` `[Authorize]`
- [BRAIN-OUT] `Brain Outputs/understanding/backend/commerce/controllers/SettingController/OVERVIEW.md` Finding #1

## Plausible answers

### Answer A — Add `[Authorize]` at class level (regression fix)
- Add `[Authorize]` to both `SettingController` and `InformationController`
- Production parity with the rest of Commerce
- Defense-in-depth: gateway is the primary gate, but middleware-level check is the platform pattern
- Effort: trivial (2 lines)

### Answer B — Intentional pattern (gateway-only auth)
- The team chose gateway-only auth for these controllers
- Document the pattern; no code change
- Risk: if the gateway is bypassed (network misconfiguration, internal call), endpoints leak data
- Specifically `GET /api/Setting` could leak SecuritySettings (including `AllowedIps`) to any unauthenticated caller

### Answer C — Two-tier model (some endpoints public, some authed)
- `GET /api/Setting/wallets/{ownerId}` may be intentionally accessible for service-to-service ops (e.g. Charging reading wallet config)
- Other actions need auth
- Action: add `[Authorize]` to class + selectively `[AllowAnonymous]` on east-west endpoints (mirroring SecurityController pattern)

## Recommended question for the team

> "Should `SettingController` and `InformationController` have class-level `[Authorize]` like every other Commerce controller (except `SecurityController` which is intentionally anonymous)? Currently they rely solely on the gateway + handler-side checks. Is this an intentional architectural choice or a regression?"

## Blast radius

| Area | Impact |
|---|---|
| Web Platform UIs | None — UIs always send JWT; the gap is only exploitable by direct internal API calls |
| Backend Services | If Charging or Provisioning calls Commerce internally, they may rely on the no-auth path; verify |
| Security | **Theoretical data exposure** — IP allowlists, password policies, quota limits exposed to unauthenticated internal callers |
| Wave 14 Settings tab | No impact (UI sends JWT regardless) |

## Halt-and-flag classification

**F-004** — drift from platform-wide controller pattern.
Potentially **F-022** — security model verification needed.

## Recommended interim action

- Document the gap in this dossier (done)
- Flag for team review before next code change touches these controllers
- Until resolved: assume the gateway IS the authoritative gate, and DO NOT rely on direct Commerce HTTP for new clients without verifying network path

## Tasks-plugin tracking

- [ ] [[wave-5a-SettingController-class-authorize]] Pending Question — SettingController missing class-level `[Authorize]` 🔼 #blocked-on/security-decision
