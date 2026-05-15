*** Page note — Edit User ***
*** Vault file: 10-Pages/Edit User.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\understanding\pages\edit-user\ ***
*** Stub seeded 2026-05-15 by Brain SK Phase 3A — page discovery ***

# Edit User

> **STUB — seeded from PRD-02 OVERVIEW.** Admin-actor screen, distinct from My Profile (self-edit). Brain Outputs is the source of truth — every link below points into the SoT tree.

## Entry point in Brain Outputs
- [PAGE_LEARNING.md](../../../Brain%20Outputs/understanding/pages/edit-user/PAGE_LEARNING.md)

## Implements PRDs
- [[02 User Management]] — **primary** (`latest-prd.md:91-105`)
- [[01 Account Management]] — Permission Group + Account Settings constraints
- [[Permissions module / PES]] — role/permission assignment authority

## Likely Falcon components
- [[Falcon Tabs]] · [[Falcon Input]] · [[Falcon Email Field]] · [[Falcon Mobile Number]] · [[Falcon Dropdown]] · [[Falcon Status Badge]] · [[Falcon Checkbox Group]] · [[Falcon Button]] · [[Falcon OTP Send Dialog]] · [[Falcon OTP]]

## Backend services
- [[Identity Service]] — **primary**; user PATCH/PUT, status transitions, email/phone OTP
- [[Access PES Service]] — permission group assignment

## Related V-rules
- _None promoted yet_ — likely candidates from PRD-02: `V-user-first-last-name-letters-only` · `V-username-format-uniqueness-immutable`.

## Hubs
- [[AMMAR_BRAIN_HOME]] · [[PAGE_LEARNING_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[My Profile]] · [[Add User Flow]] · [[Organization Hierarchy]]
