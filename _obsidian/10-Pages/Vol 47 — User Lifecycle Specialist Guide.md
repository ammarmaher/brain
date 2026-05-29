---
type: atlas-volume-graph-node
volume: 47
cluster: 10-pages
source: "[BRAIN-OUT] Brain Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-47-USER-LIFECYCLE-SPECIALIST.md"
created: 2026-05-18
status: canonical-code-verified
tags:
  - atlas/vol47
  - specialist/user-lifecycle
  - specialist/identity
---

# Vol 47 — User Lifecycle Specialist Guide

> Specialist operating model for every user status, transition, login flow, OTP path, soft-delete semantics, locking event, and audit hook. Code-verified by Wave 14 mining agent.

## What's in it

15 sections + code-verification addendum:
- §1 5 statuses + can-login/can-forget/counted-in-limit matrix
- §2 Transition graph with triggers
- §3 Login flow (multi-step OTP)
- §4 Forget-Password flow
- §5 User creation
- §6 Suspension
- §7 Deletion (soft-delete + rehydration + IncludeDeleted)
- §8 Locking
- §9 PES interactions
- §10 Cross-bounded-context sync
- §11 Audit & SAMA
- §12 Edge cases
- §13 Error catalog
- §14 PR review checklist
- §15 Cross-references
- §V47-CODE-VERIFICATION-ADDENDUM — Wave 14 corrections + 3 bug findings

## Headline truth

> User entity lives **only in Identity** (`FalconIdentityDb.Users`). Commerce emits `UserCreationRequestedEvent` via Kafka. eUserStatus = {Pending=1, Active=2, Suspended=3, Locked=4, Deleted=5}. State machine at `UserStatusTransitionPolicy.cs:16-40`. Login gates at `LoginEligibilityPolicy.cs:14-26`. Forget-Password Active-only at `ForgotPasswordProcess.cs:35-36`. **Soft-delete is `IsDeleted` boolean, not the Deleted status** — separate fields, typically aligned.

## ⚠️ Live bugs flagged (Wave 14)

1. **Webhook drift** — `ZitadelWebhookEndpoint.cs:112` sets Status=Active on UserUnlocked (should be Pending)
2. **Advanced password no-op** — `PasswordPolicy.cs` applies identical rules to Normal and Advanced
3. **Per-tenant OTP missing** — no `TenantOtpPolicy` in TenantSettings (Q-UM-13 re-opened)

Each bug has a spawned task chip for the user to start in a fresh worktree.

## See also

- [[USER-LIFECYCLE-SPECIALIST-HUB]] — entry point hub
- [[VOL-44-TRUTH-TAUTOLOGIES]] — atomic tautologies (US-TT-01..05)
- [[Vol 44 — Supporting Artifacts Research]] — sibling
- [[Vol 45 — Wallet Specialist Guide]] — sibling (status=Active required for transfers)
- [[Vol 46 — Campaigns Channels Specialist Guide]] — sibling
- [[02 User Management]] — Module 02 PRD note
- [[ATLAS_MASTER_INDEX]]
