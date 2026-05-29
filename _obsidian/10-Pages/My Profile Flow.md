---
type: page-flow
page: my-profile
module: 02 User Management
service: Identity Service
status: SoT-ready
created: 2026-05-18
updated: 2026-05-18
folder: Brain Outputs/understanding/pages/my-profile/
---

# My Profile Flow

> Self-edit own profile. Per BR-UM-41, Role/Status/PermissionGroup are hidden (cannot self-elevate).

## Source of truth

Full implementation folder: [pages/my-profile/](../../../Brain%20Outputs/understanding/pages/my-profile/)

- [README](../../../Brain%20Outputs/understanding/pages/my-profile/README.md)
- [00-OVERVIEW](../../../Brain%20Outputs/understanding/pages/my-profile/00-OVERVIEW.md)
- [01-PERMISSIONS](../../../Brain%20Outputs/understanding/pages/my-profile/01-PERMISSIONS.md)
- [07-VALIDATIONS](../../../Brain%20Outputs/understanding/pages/my-profile/07-VALIDATIONS.md)
- [08-BACKEND_API](../../../Brain%20Outputs/understanding/pages/my-profile/08-BACKEND_API.md)
- [09-COMPONENTS](../../../Brain%20Outputs/understanding/pages/my-profile/09-COMPONENTS.md)
- [12-ERROR_STATES](../../../Brain%20Outputs/understanding/pages/my-profile/12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](../../../Brain%20Outputs/understanding/pages/my-profile/13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](../../../Brain%20Outputs/understanding/pages/my-profile/14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](../../../Brain%20Outputs/understanding/pages/my-profile/PLAYBOOK.md)

## Quick reference

- **PRD anchor:** [BR-UM-41](../../../Brain%20Outputs/prd/modules/02-user-management/BUSINESS_RULES.md) — Self-edit allowed fields
- **Backend:** [[Identity Service]] — `PUT /api/users/me` + `PUT /api/users/me/password`
- **Controllers used:**
  - [UserController](../../../Brain%20Outputs/understanding/backend/identity/controllers/UserController/OVERVIEW.md) — self-edit endpoints
- **Path:** `/profile`
- **Hidden fields (BR-UM-41):** Role · Status · PermissionGroup — cannot self-elevate
- **OTP gate:** email/phone change triggers OTP confirmation

## Security findings (open)

Indirectly relevant — see [[SECURITY-FINDINGS-2026-05-18]]:

- 🔴 **CRITICAL** — Identity `set-password` privilege escalation impacts the change-password sub-flow accessed from My Profile.

## Sister flows

[[Edit User Flow]] (admin counterpart) · [[Change Password Flow]] · [[Login Flow]]

## Falcon components used

[[Falcon Input]] · [[Falcon Email Field]] · [[Falcon Phone Field]] · [[Falcon Single Uploader]] · [[Falcon Button]] · [[Falcon Dialog]] (OTP) · [[Falcon Notification]]

## Hubs

[[02 User Management]] · [[Identity Service]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[AMMAR_BRAIN_HOME]]
