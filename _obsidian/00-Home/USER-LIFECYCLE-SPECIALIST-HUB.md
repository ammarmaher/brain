---
type: specialist-hub
hub: user-lifecycle-specialist
created: 2026-05-18
authority: "Vol 47 (specialist guide) + Vol 44 §3 (truth tautologies) + WAVE-14 code mining"
status: canonical-code-verified
tags:
  - specialist/user-lifecycle
  - specialist/identity
  - specialist/session
  - hub
---

# 👤 User Lifecycle — Specialist Hub

> **Your entry point** for anything user/status/session/OTP/password related.

## 🚀 Quick triage

| If you're asking... | Start here |
|---|---|
| "Can user with status X log in?" | [[VOL-44-TRUTH-TAUTOLOGIES]] §User Status (US-TT-01..05) |
| "What's the canonical transition graph?" | [Vol 47 §2](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-47-USER-LIFECYCLE-SPECIALIST.md) |
| "Who owns User entity — Identity or Commerce?" | **Identity** (code-verified Wave 14) |
| "How does multi-step OTP login work?" | [Vol 47 §3](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-47-USER-LIFECYCLE-SPECIALIST.md) |
| "Soft-delete semantics" | [Vol 47 §7 + addendum §6](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-47-USER-LIFECYCLE-SPECIALIST.md) |
| "IncludeDeleted flag" | [Vol 47 §7.2](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-47-USER-LIFECYCLE-SPECIALIST.md) (Falcon-only) |
| "PR review checklist" | [Vol 47 §14](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-47-USER-LIFECYCLE-SPECIALIST.md) |

## 🧠 The mental model (one paragraph)

User entity lives **only in Identity** (`falcon-core-identity-svc`, MongoDB `FalconIdentityDb.Users`). Commerce emits `UserCreationRequestedEvent` (AES-256-GCM encrypted password) via Kafka → Identity creates the user. Status enum is `eUserStatus { Pending=1, Active=2, Suspended=3, Locked=4, Deleted=5 }`. State machine is at `UserStatusTransitionPolicy.cs:16-40`; Deleted→Active is Falcon-only via `OnlyFalconUserCanRestoreDeletedUser`. Login gates at `LoginEligibilityPolicy.cs:14-26` reject Locked/Suspended and **mask Deleted as `InvalidCredentials`** (security-by-obscurity). Forget-Password is Active-only (`ForgotPasswordProcess.cs:35-36`). **Soft-delete = separate `IsDeleted` flag**, NOT the Deleted status — they're typically aligned but distinct fields. `IncludeDeleted` is Falcon-only at `ListNodeUsersHandler.cs:55` / `GetUserByIdEndpoint.cs:20`.

## ⚠️ Live Code Drifts (flagged 2026-05-18)

These are the **3 bugs Wave 14 surfaced** — task chips spawned for follow-up:

| # | Drift | Severity | Location |
|---|---|---|---|
| 1 | Zitadel webhook sets Status=Active on UserUnlocked, violating Locked→Pending policy | **HIGH** (security regression) | `ZitadelWebhookEndpoint.cs:112` |
| 2 | Advanced password security level is a no-op (identical rules to Normal) | **MEDIUM** (false sense of security) | `PasswordPolicy.cs` |
| 3 | Per-tenant OTP toggle missing — OTP is global config only | **MEDIUM-HIGH** (Q-UM-13 re-opened) | TenantSettings entity gap |

## 📚 Sources of truth (priority order)

1. **`[CODE]` falcon-core-identity-svc** — actual implementation (User aggregate lives here)
2. **`[BRAIN-OUT]` Vol 47** — specialist operating guide + code-verification addendum
3. **`[BRAIN-OUT]` Vol 44 §3** — BRD-extracted status truth (US-TT-01..05)
4. **`[BRD-EXTRACTED]` Users-Statuses-Others.txt** — original transition graph
5. **`[BRAIN-OUT]` Vol 35** — Module 02 User Mgmt conclusion (cross-cluster)

## 🔑 Code citations (Wave 14)

| Concept | Code reference |
|---|---|
| User aggregate | `Domain\Entities\User.cs` (Identity service) |
| User collection | `FalconIdentityDb.Users` |
| Status enum | `eUserStatus { Pending=1, Active=2, Suspended=3, Locked=4, Deleted=5 }` |
| State machine | `UserStatusTransitionPolicy.cs:16-40` |
| Deleted→Active guard | `OnlyFalconUserCanRestoreDeletedUser` |
| Login eligibility | `LoginEligibilityPolicy.cs:14-26` |
| Forget-password gate | `ForgotPasswordProcess.cs:35-36` |
| Soft-delete query filter | `UserAggregator.cs:29-31` |
| IncludeDeleted (Falcon-only) | `ListNodeUsersHandler.cs:55`, `GetUserByIdEndpoint.cs:20` |
| Webhook bug | `ZitadelWebhookEndpoint.cs:112` ⚠️ |
| Password policy no-op | `PasswordPolicy.cs` ⚠️ |

## 🧩 Truth tautologies (US-TT-01..05)

1. **US-TT-01** — Pending users CAN log in but CANNOT use Forget-Password
2. **US-TT-02** — Locked → Pending on recovery (re-onboarding) ⚠️ violated by webhook bug
3. **US-TT-03** — Suspended ↔ Active reversible; Deleted → Active one-way Falcon-only
4. **US-TT-04** — Only Active users can use Forget-Password
5. **US-TT-05** — Active has 3 terminal transitions; others have ≤1

## 🔄 Cross-bounded-context flow

```
Commerce              Kafka                Identity
   │                    │                     │
   │── UserCreationRequestedEvent ────────────▶│ → create Zitadel user
   │   (AES-256-GCM encrypted password)        │
   │                                            │
   │── UserSuspended ──────────────────────────▶│ → revoke sessions, block Zitadel
   │── UserDeleted ────────────────────────────▶│ → disable Zitadel (NOT delete)
   │── UserUnDeleted ──────────────────────────▶│ → re-enable Zitadel
   │── UserLocked ─────────────────────────────▶│ → lock Zitadel
   │── UserUnlocked ───────────────────────────▶│ ⚠️ BUG: sets Status=Active (should be Pending)
   │── UserPermissionsChanged ─────────────────▶│ → re-issue JWT claims on refresh
   │── TenantSettingsUpdated ──────────────────▶│ → apply new OTP/password policy
```

**Authoritative state:** **Identity wins** (corrected from prior assumption).

## ❓ Open questions

| ID | Status | Note |
|---|---|---|
| Q-UM-12 | 🟡 PARTIAL | Enum exists but Advanced is a no-op — BUG flagged |
| Q-UM-13 | 🔴 RE-OPENED | Per-tenant OTP toggle does not exist — KNOWN-GAP flagged |
| Q-UM-19 | 🟡 PARTIAL | User-limit counts !IsDeleted regardless of Status; alignment of IsDeleted vs Status=Deleted is the gap |
| Q-UM-20 (NEW) | 🟡 OPEN | Status=Deleted vs IsDeleted=true divergence — who wins? |
| Q-UM-21 (NEW) | 🟡 OPEN | MaxSystemUserLimit dead config — enforce or remove? |

## 🔗 See also

- [[WALLET-SPECIALIST-HUB]] — wallet actions require status=Active
- [[CAMPAIGNS-CHANNELS-SPECIALIST-HUB]] — send actions require status=Active
- [[VOL-44-TRUTH-TAUTOLOGIES]] — atomic tautology list
- [[02 User Management]] — PRD Module 02
- [[ATLAS_MASTER_INDEX]] — full 47-volume Atlas
- [[AMMAR_BRAIN_HOME]] — vault root

#specialist/user-lifecycle #specialist/identity #specialist/session #hub #canonical
