---
name: Vol 47 + 3 Live Bugs (User Lifecycle Specialist)
description: User entity owned by Identity (NOT Commerce); soft-delete is separate IsDeleted flag; 3 code-vs-policy drifts surfaced including a security regression in Zitadel webhook handler
type: project
originSessionId: f6ecc776-1773-4495-92d7-3bd75ebceecd
---
# Vol 47 — User Lifecycle Specialist + 3 Live Code Drifts — 2026-05-18

**Status:** 🟢 LANDED 2026-05-18 (Wave 14 autopilot).

## What landed

- `Brain Outputs/.../BUSINESS-SCENARIOS-ATLAS-VOL-47-USER-LIFECYCLE-SPECIALIST.md` — 15 §sections + code-verification addendum
- `Brain Outputs/.../WAVE-14-CODE-MINING-USER-LIFECYCLE.md` — agent code-citation report
- `Brain SK/_obsidian/00-Home/USER-LIFECYCLE-SPECIALIST-HUB.md` — Obsidian specialist hub
- `Brain SK/_obsidian/10-Pages/Vol 47 — User Lifecycle Specialist Guide.md` — graph node
- 3 spawned task chips for bug fixes
- Feedback memory: `feedback_question_resolution_required_code_verification.md`

## Major correction to prior architecture model

**Was assumed:** "Commerce owns user lifecycle (master entity); Identity is a projection."

**Code says:** **Identity owns the User entity** in MongoDB `FalconIdentityDb.Users`. Commerce has NO User entity. Commerce emits `UserCreationRequestedEvent` (AES-256-GCM encrypted password) via Kafka → Identity creates the user.

**Implication:** Authoritative state for user lifecycle conflicts is **Identity**, not Commerce. This reverses the arrow in cross-bounded-context architectural docs.

## Code-verified truths

| Concept | Truth | Code |
|---|---|---|
| User entity | Lives only in Identity service | `Domain\Entities\User.cs` |
| Collection | `FalconIdentityDb.Users` | MongoDB |
| Status enum | `{Pending=1, Active=2, Suspended=3, Locked=4, Deleted=5}` | `eUserStatus` |
| State machine | All transitions codified, including Deleted→Active Falcon-only guard | `UserStatusTransitionPolicy.cs:16-40` |
| Login eligibility | Locked/Suspended throw; Deleted masked as `InvalidCredentials` | `LoginEligibilityPolicy.cs:14-26` |
| Forget-Password | Active-only enforcement (Pending also blocked) | `ForgotPasswordProcess.cs:35-36` |
| **Soft-delete model** | Separate `IsDeleted` flag, NOT the Deleted status | `UserAggregator.cs:29-31` |
| IncludeDeleted | Falcon-only access | `ListNodeUsersHandler.cs:55`, `GetUserByIdEndpoint.cs:20` |

## 3 Live Bugs Flagged (with task chips)

### Bug 1 — Zitadel webhook violates Locked→Pending policy (HIGH severity)
- **File:** `ZitadelWebhookEndpoint.cs:112`
- **Behavior:** Sets `Status=Active` on `UserUnlocked` event from Zitadel
- **Policy violated:** US-TT-02 — Locked recovers to Pending (re-onboarding required)
- **Risk:** Attacker triggering lockout then social-engineering unlock bypasses re-onboarding intent
- **Fix:** Use `UserStatusTransitionPolicy.TransitionTo(user, eUserStatus.Pending)` instead of direct assignment

### Bug 2 — Advanced password security is a no-op (MEDIUM severity)
- **File:** `PasswordPolicy.cs`
- **Behavior:** `PasswordSecurityLevel.Advanced` applies identical rules to Normal
- **Risk:** Clients selecting Advanced believe they have stronger rules but actually don't
- **Fix:** Differentiate per tier (Normal: 8 chars + letter + digit; Advanced: 12 chars + letter + digit + symbol + no repeats + no dictionary)
- **Q-UM-12 status:** PARTIAL (enum exists but enforcement is no-op)

### Bug 3 — Per-tenant OTP toggle missing (MEDIUM-HIGH severity)
- **Gap:** No `TenantOtpPolicy` in `TenantSettings`, no admin/user OTP differentiation
- **Risk:** Cannot enforce per-tenant OTP requirements; one-size-fits-all
- **Fix:** Add `TenantOtpPolicy` (RequireOtpForAdmin/User, AdminOtpChannel/UserOtpChannel, OtpTtl, MaxAttempts) + Kafka sync event
- **Q-UM-13 status:** RE-OPENED (was incorrectly RESOLVED in prior memory)

## Lesson recorded

`feedback_question_resolution_required_code_verification.md` — A question is only RESOLVED when (1) PRD answer is known AND (2) code implements it AND (3) code has been verified by reading file:line. PRD-only confirmation is at best PARTIAL.

## Open questions after Wave 14

| ID | Status |
|---|---|
| Q-UM-12 | 🟡 PARTIAL — enum 2-tier but Advanced no-op (BUG 2) |
| Q-UM-13 | 🔴 RE-OPENED — per-tenant OTP toggle missing (BUG 3) |
| Q-UM-19 | 🟡 PARTIAL — !IsDeleted counts regardless of Status |
| Q-UM-20 (NEW) | 🟡 OPEN — Status=Deleted vs IsDeleted=true alignment |
| Q-UM-21 (NEW) | 🟡 OPEN — MaxSystemUserLimit dead config |

## Trigger phrases

- `vol 47 user lifecycle specialist` / `user lifecycle hub`
- `eUserStatus enum` / `UserStatusTransitionPolicy.cs`
- `LoginEligibilityPolicy.cs` / `ForgotPasswordProcess.cs`
- `soft delete IsDeleted flag` / `IncludeDeleted Falcon-only`
- `zitadel webhook bug` / `password level Advanced no-op`
- `per-tenant OTP missing` / `TenantOtpPolicy gap`
- `Q-UM-12 partial` / `Q-UM-13 reopened`
