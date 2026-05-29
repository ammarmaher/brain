---
type: page-flow
page: edit-user
module: 02 User Management
service: Identity Service
status: SoT-ready
created: 2026-05-18
folder: Brain Outputs/understanding/pages/edit-user/
---

# Edit User Flow

> Admin-actor edit of an existing user. Three tabs (Personal / Role & Status / Permissions). 3-endpoint sequential save chain. OTP gate on email/phone change.

## Source of truth

Full implementation folder: [pages/edit-user/](../../../Brain%20Outputs/understanding/pages/edit-user/)

- [README](../../../Brain%20Outputs/understanding/pages/edit-user/README.md) — folder index + load order
- [00-OVERVIEW](../../../Brain%20Outputs/understanding/pages/edit-user/00-OVERVIEW.md)
- [01-PERMISSIONS](../../../Brain%20Outputs/understanding/pages/edit-user/01-PERMISSIONS.md)
- [02-SECTION_PERSONAL_INFO](../../../Brain%20Outputs/understanding/pages/edit-user/02-SECTION_PERSONAL_INFO.md)
- [03-SECTION_ROLE_STATUS](../../../Brain%20Outputs/understanding/pages/edit-user/03-SECTION_ROLE_STATUS.md)
- [04-SECTION_PERMISSIONS](../../../Brain%20Outputs/understanding/pages/edit-user/04-SECTION_PERMISSIONS.md)
- [05-SECTION_OTP_VERIFICATION](../../../Brain%20Outputs/understanding/pages/edit-user/05-SECTION_OTP_VERIFICATION.md)
- [06-SECTION_PROFILE_PICTURE](../../../Brain%20Outputs/understanding/pages/edit-user/06-SECTION_PROFILE_PICTURE.md)
- [07-VALIDATIONS](../../../Brain%20Outputs/understanding/pages/edit-user/07-VALIDATIONS.md)
- [08-BACKEND_API](../../../Brain%20Outputs/understanding/pages/edit-user/08-BACKEND_API.md)
- [09-COMPONENTS](../../../Brain%20Outputs/understanding/pages/edit-user/09-COMPONENTS.md)
- [10-KAFKA_SIDE_EFFECTS](../../../Brain%20Outputs/understanding/pages/edit-user/10-KAFKA_SIDE_EFFECTS.md)
- [11-STATE_TRANSITIONS](../../../Brain%20Outputs/understanding/pages/edit-user/11-STATE_TRANSITIONS.md)
- [12-ERROR_STATES](../../../Brain%20Outputs/understanding/pages/edit-user/12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](../../../Brain%20Outputs/understanding/pages/edit-user/13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](../../../Brain%20Outputs/understanding/pages/edit-user/14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](../../../Brain%20Outputs/understanding/pages/edit-user/PLAYBOOK.md)

## Quick reference

- **PRD anchor:** [BR-UM-36 to BR-UM-40](../../../Brain%20Outputs/prd/modules/02-user-management/BUSINESS_RULES.md)
- **Backend:** [Identity Service](../50-Services/Identity%20Service.md) — 3 PUT endpoints + 4 OTP endpoints
- **Triggered from:** [Organization Hierarchy](Organization%20Hierarchy.md) right-pane menu
- **Sister flows:** [My Profile Flow](My%20Profile%20Flow.md) (self-edit) · [Add User Flow](Add%20User%20Flow.md) (creation)

## Open halts

- **Q-UM-13 HIGH:** Admin OTP path for editing another user's email/phone — see [pending question](../../../Brain%20Outputs/datasets/authority-dataset/_pending-questions/wave-4-edit-user-Q-UM-13.md)

## Hubs

[[02 User Management]] · [[Identity Service]] · [[PES Service]] · [[Organization Hierarchy]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
