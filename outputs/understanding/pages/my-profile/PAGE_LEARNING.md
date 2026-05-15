*** Page Learning — My Profile ***
*** Stub seeded 2026-05-15 by Brain SK Phase 3A — page discovery ***
*** Path: Brain Outputs/understanding/pages/my-profile/PAGE_LEARNING.md ***

# My Profile

> **STUB** — page discovered from PRD-02 OVERVIEW (`02-user-management/OVERVIEW.md:32`). Self-edit profile screen reached from the side menu beside the username. Distinct from Edit User (admin actor, full scope). Full page-learning artifacts will be seeded when Light Learning events accrue or when explicit deep-learn is run.

## Source
- PRD module: PRD-02 User Management
- PRD section reference: `Brain Outputs/prd/modules/02-user-management/OVERVIEW.md:32` (Main Screen #5) + `latest-prd.md:107` (Edit own profile — no role/status/permissions)

## Primary backend service
- Identity Service (`Brain Outputs/understanding/backend/identity/`) — `/users/me` PATCH/PUT

## Expected Falcon components
- [[Falcon Input]] — first name · last name (username immutable, shown as read-only)
- [[Falcon Email Field]] — email (OTP required to change)
- [[Falcon Mobile Number]] — phone (OTP required to change)
- [[Falcon Form Field]] — field wrapper with label + error
- [[Falcon Button]] — save / cancel
- [[Falcon OTP Send Dialog]] — OTP confirmation on email/phone change
- [[Falcon OTP]] — OTP code entry
- [[Falcon Avatar]] — user avatar (optional)

## Key flows on this page
- View own profile (read-only fields: username, role, status, permission groups)
- Edit own first/last name (no OTP)
- Edit own email → OTP challenge → confirm
- Edit own phone → OTP challenge → confirm
- Cannot change role / status / permissions / username
- Cancel returns to previous screen without save

## Implementation playbook
- _Not yet created_ — when implementation begins, the page-learning skill creates `flows/<Flow Name>.md` or `<Flow Name>/` folder

## Sibling files
- _Not yet created_ — when Light/Deep Learning runs, the standard 14-file set lands here

## Hubs
- [[My Profile]] (vault note) · [[PAGE_LEARNING_INDEX]] · [[Edit User]] (sister page, admin variant) · [[Change Password]] · [[Organization Hierarchy]] (sister page)
