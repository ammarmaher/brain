*** Edit User — folder index ***
*** SoT for Edit User implementation · 2026-05-17 (Wave 4 page-mining) ***

# Edit User — implementation knowledge folder

> Canonical source of truth for the Falcon Edit User flow (admin-actor edit of an existing user). When a Claude session is asked to implement Edit User (frontend, backend, or both), this folder is the SPEC. Load `README.md` first, then drill into the file matching your task.

## Files in this folder

| File | Read when... |
|---|---|
| [00-OVERVIEW](00-OVERVIEW.md) | You need the end-to-end picture · actors · tab summary |
| [01-PERMISSIONS](01-PERMISSIONS.md) | You need to know who can edit users (role-edit matrix) |
| [02-SECTION_PERSONAL_INFO](02-SECTION_PERSONAL_INFO.md) | Building the Personal Info tab (name/email/phone with OTP) |
| [03-SECTION_ROLE_STATUS](03-SECTION_ROLE_STATUS.md) | Building the Role & Status tab |
| [04-SECTION_PERMISSIONS](04-SECTION_PERMISSIONS.md) | Building the Permissions tab (PermissionGroup assignment) |
| [05-SECTION_OTP_VERIFICATION](05-SECTION_OTP_VERIFICATION.md) | Building the email/phone change OTP modal flow |
| [06-SECTION_PROFILE_PICTURE](06-SECTION_PROFILE_PICTURE.md) | Building the avatar upload / delete control |
| [07-VALIDATIONS](07-VALIDATIONS.md) | Wiring frontend validators · cross-field rules · async username uniqueness |
| [08-BACKEND_API](08-BACKEND_API.md) | Wiring the API calls (3-endpoint save dispatch + OTP endpoints) |
| [09-COMPONENTS](09-COMPONENTS.md) | Picking Falcon components per tab |
| [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md) | Understanding server side effects after profile/status/role changes |
| [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md) | User status FSM (Active/Suspended/Locked/Deleted/Pending) |
| [12-ERROR_STATES](12-ERROR_STATES.md) | Handling backend error codes in the UI · recovery paths |
| [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) | Open gaps · PRD↔backend drift · Q-UM-13 admin OTP path |
| [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md) | Pre-code verification gate + FE/BE task list |
| [PLAYBOOK](PLAYBOOK.md) | The original single-doc playbook if you want everything in one file |

## Load order for implementation tasks

Frontend task:
1. README (this file)
2. 00-OVERVIEW
3. The section file matching what you're building (e.g. 02-SECTION_PERSONAL_INFO)
4. 07-VALIDATIONS
5. 09-COMPONENTS
6. 12-ERROR_STATES
7. 14-IMPLEMENTATION_CHECKLIST (verification gate)

Backend task:
1. README
2. 00-OVERVIEW
3. 08-BACKEND_API
4. 07-VALIDATIONS
5. 10-KAFKA_SIDE_EFFECTS
6. 11-STATE_TRANSITIONS
7. 13-GAPS_AND_DRIFTS
8. 14-IMPLEMENTATION_CHECKLIST

Full-stack task: load all 16 files (or just PLAYBOOK.md if you want one document).

## Verification gate (before producing code)

A session has not loaded enough context until it can answer:

1. Which PRD rules does this flow implement? (BR-UM-36 to BR-UM-40)
2. Which backend endpoints will I call? (3 admin-edit endpoints + 4 OTP endpoints)
3. What is the exact request DTO shape for each endpoint?
4. What validation will the backend enforce?
5. What V-rule wiki-links apply?
6. What Falcon components am I composing?
7. Which roles can edit which target roles? (PES `userRole.other(source, target)`)
8. What entity drift do I need to handle? (e.g. Q-UM-13 admin-edit OTP path)

Answers live inside this folder. Drill until each question has a citation.

## Hubs

- [[Edit User Flow]] · [[My Profile Flow]] (sister · self-edit) · [[Add User Flow]] (sister · creation) · [[02 User Management]] · [[Identity Service]] · [[PES Service]] · [[Organization Hierarchy]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[COMPONENT_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
