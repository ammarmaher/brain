---
type: security-findings-cluster
title: "Security Vulnerabilities Found — Night-Shift Mining 2026-05-18"
discovered: 2026-05-18
wave: 5a · 5b · 5c
severity-distribution: 2 critical · 2 high · 2 medium · 1 operational
status: all-open
tags: [security, auth, commerce, charging, identity, night-shift]
---

# Security Findings — Night-Shift Mining 2026-05-18

> [!tldr]
> 6 security vulnerabilities discovered across Identity, Commerce, and Charging services during the Falcon Brain Forever-Wave night-shift run. Two are CRITICAL (privilege escalation + timing attack), two are HIGH (missing auth guards), two are MEDIUM (tenant isolation + anonymous Kafka endpoint). Security task chips shown to user.

## 🔴 CRITICAL — Identity: set-password privilege escalation

| Field | Value |
|---|---|
| Service | `falcon-core-identity-svc` |
| Controller | `AuthController` |
| Endpoint | `POST /api/auth/set-password` |
| Handler | `SetPasswordHandler` |
| Finding | Does NOT assert `Stage == PasswordResetPending` before allowing password change |
| Impact | Any user with a valid sessionId (e.g. just after OTP in ANY flow) can set a new password |
| Fix | Add `if session.Stage != PasswordResetPending → throw FalconException(FalconKeys.Error.InvalidStage)` at top of HandleAsync |
| Evidence | `[CODE]` `understanding/backend/identity/controllers/AuthController/OVERVIEW.md` finding #1 |
| Task chip | ✅ Shown to user |

---

## 🔴 CRITICAL — Identity: Webhook HMAC non-constant-time comparison

| Field | Value |
|---|---|
| Service | `falcon-core-identity-svc` |
| Controller | `WebhookController` |
| Endpoint | `POST /api/webhook/zitadel` |
| Finding | HMAC signature comparison uses `string.Equals(..., OrdinalIgnoreCase)` — short-circuits on first differing char |
| Impact | Timing oracle allows attacker to forge Zitadel webhook signatures by measuring response latency |
| Fix | Replace with `CryptographicOperations.FixedTimeEquals(Encoding.UTF8.GetBytes(receivedSig), Encoding.UTF8.GetBytes(expectedSig))` |
| Evidence | `[CODE]` `understanding/backend/identity/controllers/WebhookController/OVERVIEW.md` finding #3 |
| Task chip | ✅ Shown to user |

---

## 🔴 HIGH — Commerce: SettingController + InformationController missing `[Authorize]`

| Field | Value |
|---|---|
| Service | `falcon-core-commerce-svc` |
| Controllers | `SettingController` (4 endpoints) · `InformationController` (2 endpoints) |
| Finding | No class-level `[Authorize]` attribute; every other Commerce controller has it |
| Impact | Backend security relies solely on frontend PES gate — insufficient defense-in-depth |
| Fix | Add `[Authorize]` at class level on both controllers |
| Evidence | `[CODE]` `understanding/backend/commerce/controllers/SettingController/OVERVIEW.md` · `InformationController/OVERVIEW.md` |
| Pending-Q | `_pending-questions/wave-5a-SettingController-class-authorize.md` |
| Task chip | ✅ Shown to user |

---

## 🔴 HIGH — Commerce: InformationController commented-out role gate

| Field | Value |
|---|---|
| Service | `falcon-core-commerce-svc` |
| Controller | `InformationController` |
| Endpoint | `PUT commerce/Node/{id}/info` |
| Finding | NodeAdmin/NormalUser role exclusion previously blocked on PUT; check is now `//commented-out` |
| Impact | If a Client user crafts a direct HTTP PUT request, they can edit account info they shouldn't access |
| Fix | Restore explicit role gate OR add the [Authorize] guard (see finding above) |
| Evidence | `[CODE]` `understanding/backend/commerce/controllers/InformationController/OVERVIEW.md` |
| Pending-Q | `_pending-questions/wave-5a-InformationController-commented-role-check.md` |
| Task chip | ✅ Shown to user (combined with SettingController) |

---

## 🟡 MEDIUM — Commerce: AccountHierarchyController tenant-isolation gap

| Field | Value |
|---|---|
| Service | `falcon-core-commerce-svc` |
| Controller | `AccountHierarchyController` |
| Endpoint | `GET commerce/accounts/{id}/hierarchy` |
| Finding | Does NOT validate requesting Client user's tenantId matches hierarchy ownerId (SettingController.Get DOES make this check) |
| Impact | Client user who knows another account's nodeId could read its hierarchy metadata |
| Fix | Add `OwnerIdNotMatchWithTenantId` guard to `GetAccountHierarchyHandler` (already implemented in `GetSettingsHandler`) |
| Evidence | `[CODE]` `understanding/backend/commerce/controllers/AccountHierarchyController/OVERVIEW.md` |
| Pending-Q | `_pending-questions/wave-5a-AccountHierarchyController-tenant-isolation.md` |
| Task chip | ✅ Shown to user |

---

## 🟡 MEDIUM — Charging: TestKafkaController has `[AllowAnonymous]`

| Field | Value |
|---|---|
| Service | `falcon-core-charging-svc` |
| Controller | `TestKafkaController` |
| Endpoints | `POST /api/TestKafka/publish` · `GET /api/TestKafka/health` |
| Finding | `[AllowAnonymous]` — no authentication required. Also: wrong namespace (`Falcon.Commerce.*`), raw `text/plain` error bodies, `DateTimeOffset.Now` |
| Impact | Unauthenticated Kafka publish; if port is ever network-accessible, Kafka can be flooded without credentials |
| Fix | (A) Remove from production builds via `#if DEBUG` or feature flag, OR (B) add `[Authorize]` requiring Falcon service token |
| Evidence | `[CODE]` `understanding/backend/charging/controllers/TestKafkaController/OVERVIEW.md` |
| Pending-Q | `_pending-questions/wave-5c-charging-testkafka-allow-anonymous.md` |
| Task chip | ✅ Shown to user |

---

## ⚠️ OPERATIONAL — Charging: TestingChargingController mutates real balances

| Field | Value |
|---|---|
| Service | `falcon-core-charging-svc` |
| Controller | `TestingChargingController` |
| Endpoints | 9 endpoints under `/api/testing/charging/*` |
| Finding | Routes through REAL `IReserveWalletChargeHandler` — mutates actual account balances |
| Gate | `Settings:TestingCharging:Enabled` (default `false`) |
| Risk | If the flag is accidentally enabled on a non-test environment, real account balances are consumed |
| Recommendation | Confirm `Enabled = false` is in production config; add monitoring alert if flag is ever set to `true` in production |
| Evidence | `[CODE]` `understanding/backend/charging/controllers/TestingChargingController/OVERVIEW.md` |

---

## Summary table

| Severity | Count | Services |
|---|---|---|
| 🔴 CRITICAL | 2 | Identity (2) |
| 🔴 HIGH | 2 | Commerce (2) |
| 🟡 MEDIUM | 2 | Commerce (1) · Charging (1) |
| ⚠️ OPERATIONAL | 1 | Charging (1) |
| **Total** | **7** | Identity · Commerce · Charging |

## Links

- `understanding/backend/identity/controllers/AuthController/OVERVIEW.md`
- `understanding/backend/identity/controllers/WebhookController/OVERVIEW.md`
- `understanding/backend/commerce/controllers/SettingController/OVERVIEW.md`
- `understanding/backend/commerce/controllers/InformationController/OVERVIEW.md`
- `understanding/backend/commerce/controllers/AccountHierarchyController/OVERVIEW.md`
- `understanding/backend/charging/controllers/TestKafkaController/OVERVIEW.md`
- `understanding/backend/charging/controllers/TestingChargingController/OVERVIEW.md`
- `datasets/authority-dataset/_pending-questions/` — all 7 formal pending-question files
- `reports/night-shift/2026-05-17/MORNING-BRIEF.md` — full context
