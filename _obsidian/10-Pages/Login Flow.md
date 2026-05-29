---
type: page-flow
page: login
module: 02 User Management
service: Identity Service
status: SoT-ready
created: 2026-05-18
updated: 2026-05-18
folder: Brain Outputs/understanding/pages/login/
---

# Login Flow

> 3-stage pre-auth flow (GetStarted → OTP → FirstLogin if Pending). 9 Identity endpoints. IP allowlist + 3-strike lockout + 30-min idle.

## Source of truth

Full implementation folder: [pages/login/](../../../Brain%20Outputs/understanding/pages/login/)

- [README](../../../Brain%20Outputs/understanding/pages/login/README.md) — folder index + load order
- [00-OVERVIEW](../../../Brain%20Outputs/understanding/pages/login/00-OVERVIEW.md)
- [01-PERMISSIONS](../../../Brain%20Outputs/understanding/pages/login/01-PERMISSIONS.md)
- [07-VALIDATIONS](../../../Brain%20Outputs/understanding/pages/login/07-VALIDATIONS.md)
- [08-BACKEND_API](../../../Brain%20Outputs/understanding/pages/login/08-BACKEND_API.md)
- [11-STATE_TRANSITIONS](../../../Brain%20Outputs/understanding/pages/login/11-STATE_TRANSITIONS.md)
- [12-ERROR_STATES](../../../Brain%20Outputs/understanding/pages/login/12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](../../../Brain%20Outputs/understanding/pages/login/13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](../../../Brain%20Outputs/understanding/pages/login/14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](../../../Brain%20Outputs/understanding/pages/login/PLAYBOOK.md)

## Quick reference

- **PRD anchor:** [BR-UM-19..30](../../../Brain%20Outputs/prd/modules/02-user-management/BUSINESS_RULES.md) — login flow business rules
- **Backend:** [[Identity Service]] — 9 endpoints under `/api/auth/*`
- **Controllers used:**
  - [AuthController](../../../Brain%20Outputs/understanding/backend/identity/controllers/AuthController/OVERVIEW.md) — login · OTP · set-password · refresh · logout
  - [SecurityController](../../../Brain%20Outputs/understanding/backend/identity/controllers/SecurityController/OVERVIEW.md) — IP allowlist guard
- **Path:** `/login` (host-shell pre-auth shell)
- **Stages:** `PasswordRequired` → `OtpRequired` (optional) → `PasswordChangeRequired` (Pending users) → `Authenticated`
- **Gateway:** Bypassed pre-auth — direct Identity call

## Security findings (open)

This flow is affected by 2 CRITICAL findings — see [[SECURITY-FINDINGS-2026-05-18]]:

- 🔴 **CRITICAL** — Identity `set-password` privilege escalation (does NOT assert `Stage == PasswordResetPending`)
- 🔴 **CRITICAL** — Identity Webhook HMAC non-constant-time comparison (timing oracle)

## Sister flows

[[Forgot Password Flow]] · [[Change Password Flow]] · [[My Profile Flow]]

## Falcon components used

[[Falcon Input]] · [[Falcon Email Field]] · [[Falcon Password]] · [[Falcon Button]] · [[Falcon Notification]] · [[Falcon Dialog]] (OTP popup)

## Hubs

[[02 User Management]] · [[Identity Service]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[AMMAR_BRAIN_HOME]] · [[Authorization-Security-MOC]] · [[Local-Auth-Recipe]]
