---
name: Identity service critical security vulnerabilities found 2026-05-18
description: Two security vulnerabilities in falcon-core-identity-svc discovered in Wave 5b night-shift mining. Both have security task chips pending user action.
type: project
originSessionId: f6ecc776-1773-4495-92d7-3bd75ebceecd
---
Two critical security vulnerabilities in `falcon-core-identity-svc` found during Wave 5b (2026-05-18):

**1. set-password privilege escalation (CRITICAL)**
`SetPasswordHandler` does not assert `Stage == PasswordResetPending`. Any user with a valid sessionId can set a new password without going through forgot-password. Fix: add `if session.Stage != PasswordResetPending → throw FalconException(InvalidStage)` in `SetPasswordHandler.HandleAsync`.
Evidence: `understanding/backend/identity/controllers/AuthController/OVERVIEW.md` finding #1.

**2. Webhook HMAC non-constant-time comparison (HIGH)**
`WebhookController` uses `string.Equals(..., OrdinalIgnoreCase)` for Zitadel webhook HMAC verification — timing attack oracle. Fix: replace with `CryptographicOperations.FixedTimeEquals(...)`.
Evidence: `understanding/backend/identity/controllers/WebhookController/OVERVIEW.md` finding #3.

**Why:** Security review requirement — both vulnerabilities bypass intended auth/verification flows.

**How to apply:** Before any Edit User or auth-flow work touches Identity, verify these are fixed. Security task chips shown to user 2026-05-18.

**Bonus — Q-UM-12 resolved:** Password security level is NOT a mismatch. Code has `ePasswordSecurityLevel { Normal=1, Advanced=2 }` — 2-tier, matching PRD exactly. Wave 2's "4-tier mismatch" claim was incorrect. Apply F-002 (display PRD labels, submit backend codes).

**Bonus — Q-UM-13 resolved:** Admin edit-email/phone uses deferred verification (immediate DB change + `IsVerified=false`; user drives OTP themselves). No admin-initiated OTP endpoint needed.
