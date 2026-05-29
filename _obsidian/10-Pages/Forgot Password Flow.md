---
type: page-flow
page: forgot-password
module: 02 User Management
service: Identity Service
status: SoT-ready
created: 2026-05-18
updated: 2026-05-18
folder: Brain Outputs/understanding/pages/forgot-password/
---

# Forgot Password Flow

> 3-step pre-auth password reset. Active-only. Silent wrong-OTP (divergent from login lockout).

## Source of truth

Full implementation folder: [pages/forgot-password/](../../../Brain%20Outputs/understanding/pages/forgot-password/)

- [README](../../../Brain%20Outputs/understanding/pages/forgot-password/README.md)
- [00-OVERVIEW](../../../Brain%20Outputs/understanding/pages/forgot-password/00-OVERVIEW.md)
- [07-VALIDATIONS](../../../Brain%20Outputs/understanding/pages/forgot-password/07-VALIDATIONS.md)
- [08-BACKEND_API](../../../Brain%20Outputs/understanding/pages/forgot-password/08-BACKEND_API.md)
- [12-ERROR_STATES](../../../Brain%20Outputs/understanding/pages/forgot-password/12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](../../../Brain%20Outputs/understanding/pages/forgot-password/13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](../../../Brain%20Outputs/understanding/pages/forgot-password/14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](../../../Brain%20Outputs/understanding/pages/forgot-password/PLAYBOOK.md)

## Quick reference

- **PRD anchor:** [BR-UM-22..26](../../../Brain%20Outputs/prd/modules/02-user-management/BUSINESS_RULES.md) — forgot password rules
- **Backend:** [[Identity Service]] — 3 endpoints (`/api/auth/forgot-password/*`)
- **Controllers used:**
  - [AuthController](../../../Brain%20Outputs/understanding/backend/identity/controllers/AuthController/OVERVIEW.md) — forgot-password initiate · verify-otp · set-password
- **Path:** `/login/forgot-password`
- **Eligibility:** Active users only (Pending/Locked/Suspended/Deleted rejected with generic message)
- **OTP behavior:** Silent on wrong code (no error visible to caller — divergent from Login lockout)

## Security findings (open)

This flow is affected by 1 CRITICAL finding — see [[SECURITY-FINDINGS-2026-05-18]]:

- 🔴 **CRITICAL** — Identity `set-password` privilege escalation (does NOT assert `Stage == PasswordResetPending`). **Directly exploits Forgot Password trust boundary.**

## Sister flows

[[Login Flow]] · [[Change Password Flow]]

## Falcon components used

[[Falcon Input]] · [[Falcon Email Field]] · [[Falcon Password]] · [[Falcon Button]] · [[Falcon Notification]]

## Hubs

[[02 User Management]] · [[Identity Service]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[AMMAR_BRAIN_HOME]]
