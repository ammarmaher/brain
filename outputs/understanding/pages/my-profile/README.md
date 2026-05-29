*** My Profile — folder index ***
*** 2026-05-18 ***

# My Profile — implementation knowledge folder

> Self-edit own-profile flow at `/profile` (no `:userId`). Same shell component as Edit User, but with Role/Status/Permissions tabs HIDDEN per BR-UM-41. Endpoint differs: uses `/api/user/profile` (no id param).

## Files

| File | Read when... |
|---|---|
| [00-OVERVIEW](00-OVERVIEW.md) | E2E picture · diff from Edit User |
| [01-PERMISSIONS](01-PERMISSIONS.md) | Authenticated only · own account · no PES |
| [02-SECTION_PERSONAL_INFO](02-SECTION_PERSONAL_INFO.md) | Same fields as Edit User Tab 1 (with restrictions) |
| [03-SECTION_OTP_VERIFICATION](03-SECTION_OTP_VERIFICATION.md) | Same OTP modal for own email/phone change |
| [04-SECTION_PROFILE_PICTURE](04-SECTION_PROFILE_PICTURE.md) | Avatar upload/delete (own) |
| [05-SECTION_CHANGE_PASSWORD_LINK](05-SECTION_CHANGE_PASSWORD_LINK.md) | Link to Change Password flow |
| [07-VALIDATIONS](07-VALIDATIONS.md) | Same V-rules as Edit User Personal Info tab |
| [08-BACKEND_API](08-BACKEND_API.md) | `PUT /api/user/profile` (no id) · OTP endpoints same |
| [09-COMPONENTS](09-COMPONENTS.md) | UserProfileComponent in self-edit mode |
| [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) | user-updated · contact-verified |
| [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) | (no status changes — self can't change own status) |
| [12-ERROR_STATES](12-ERROR_STATES.md) | Email+Phone simul reject · OTP errors |
| [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) | Same anti-patterns as Edit User |
| [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md) | Pre-code gate + tasks |
| [PLAYBOOK](PLAYBOOK.md) | Single-doc synthesis |

## Verification gate

1. PRD anchor? → BR-UM-41 (excludes Role/Status/PermissionGroup) + BR-UM-36 (OTP for email/phone)
2. Hidden tabs? → Role & Status + Permissions
3. Endpoint? → `PUT /api/user/profile` (NOT `/api/user/{id}/profile`)
4. OTP endpoints? → same `/api/user/me/verify-{email|phone}` as Edit User
5. BR-UM-21? → Email+Phone NOT both at once
6. Username immutable? → BR-UM-19
7. Change Password link? → goes to separate flow (`pages/change-password/`)
8. Excluded fields? → Role · Status · PermissionGroup

## Hubs

[[My Profile Flow]] · [[Edit User Flow]] (sister · admin variant) · [[Change Password Flow]] · [[02 User Management]] · [[Identity Service]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]]
