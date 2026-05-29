---
type: page-flow
page: change-password
module: 02 User Management
service: Identity Service
status: SoT-ready
created: 2026-05-18
updated: 2026-05-18
folder: Brain Outputs/understanding/pages/change-password/
---

# Change Password Flow

> Self-service post-auth password change. Revokes all sessions on success.

## Source of truth

Full implementation folder: [pages/change-password/](../../../Brain%20Outputs/understanding/pages/change-password/)

- [README](../../../Brain%20Outputs/understanding/pages/change-password/README.md)
- [00-OVERVIEW](../../../Brain%20Outputs/understanding/pages/change-password/00-OVERVIEW.md)
- [07-VALIDATIONS](../../../Brain%20Outputs/understanding/pages/change-password/07-VALIDATIONS.md)
- [08-BACKEND_API](../../../Brain%20Outputs/understanding/pages/change-password/08-BACKEND_API.md)
- [12-ERROR_STATES](../../../Brain%20Outputs/understanding/pages/change-password/12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](../../../Brain%20Outputs/understanding/pages/change-password/13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](../../../Brain%20Outputs/understanding/pages/change-password/14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](../../../Brain%20Outputs/understanding/pages/change-password/PLAYBOOK.md)

## Quick reference

- **PRD anchor:** [BR-UM-27..30](../../../Brain%20Outputs/prd/modules/02-user-management/BUSINESS_RULES.md)
- **Backend:** [[Identity Service]] — `PUT /api/users/me/password`
- **Controllers used:**
  - [UserController](../../../Brain%20Outputs/understanding/backend/identity/controllers/UserController/OVERVIEW.md) — self-edit password endpoint
  - [AuthController](../../../Brain%20Outputs/understanding/backend/identity/controllers/AuthController/OVERVIEW.md) — session revocation
- **Path:** `/profile/change-password`
- **Side effect:** revokes all other sessions (current session reissued)
- **Password policy:** Tier resolved from account's `Settings.PasswordSecurityLevel`

## Security findings (open)

This flow is affected by 1 CRITICAL finding — see [[SECURITY-FINDINGS-2026-05-18]]:

- 🔴 **CRITICAL** — Identity `set-password` privilege escalation. While Change Password uses a different endpoint, the shared password-validation pipeline is in scope for hardening.

## Sister flows

[[Login Flow]] · [[Forgot Password Flow]] · [[My Profile Flow]] · [[Edit User Flow]]

## Falcon components used

[[Falcon Input]] · [[Falcon Password]] · [[Falcon Button]] · [[Falcon Notification]] · [[Falcon Dialog]]

## Hubs

[[02 User Management]] · [[Identity Service]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[AMMAR_BRAIN_HOME]]
