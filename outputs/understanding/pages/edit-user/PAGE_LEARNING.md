*** Page Learning — Edit User ***
*** Stub seeded 2026-05-15 by Brain SK Phase 3A — page discovery ***
*** Path: Brain Outputs/understanding/pages/edit-user/PAGE_LEARNING.md ***

# Edit User

> **STUB** — page discovered from PRD-02 OVERVIEW (`02-user-management/OVERVIEW.md:31`). Admin-actor screen for editing an existing user (personal info / role-status / permissions). Distinct from My Profile (self-edit, narrower scope) and Add User (3-tab wizard, lives inside Organization Hierarchy). Full page-learning artifacts will be seeded when Light Learning events accrue or when explicit deep-learn is run.

## Source
- PRD module: PRD-02 User Management
- PRD section reference: `Brain Outputs/prd/modules/02-user-management/OVERVIEW.md:31` (Main Screen #4) + `latest-prd.md:91-105` (Edit User behavior)

## Primary backend service
- Identity Service (`Brain Outputs/understanding/backend/identity/`) — `/users/{id}` PATCH/PUT + status-transition endpoints

## Expected Falcon components
- [[Falcon Tabs]] — Personal Info / Role & Status / Permissions
- [[Falcon Input]] — first name · last name · username (immutable)
- [[Falcon Email Field]] — email (OTP required to change)
- [[Falcon Mobile Number]] — phone (OTP required to change)
- [[Falcon Dropdown]] — role · status (per allowed transitions)
- [[Falcon Status Badge]] — current user status
- [[Falcon Checkbox Group]] — permission groups
- [[Falcon Button]] — save / cancel
- [[Falcon OTP Send Dialog]] — OTP confirmation on email/phone change
- [[Falcon OTP]] — OTP code entry

## Key flows on this page
- Edit personal info (first/last name, email, phone) — email/phone changes require OTP
- Change role (per matrix; Falcon usertype owns Deleted → Active restoration)
- Change status (per allowed transitions: Active / Suspended / Locked / Deleted)
- Assign / change Permission Groups (PES gated)
- Validation: V-user-first-last-name-letters-only · V-username-format-uniqueness-immutable

## Implementation playbook
- _Not yet created_ — when implementation begins, the page-learning skill creates `flows/<Flow Name>.md` or `<Flow Name>/` folder

## Sibling files
- _Not yet created_ — when Light/Deep Learning runs, the standard 14-file set lands here

## Hubs
- [[Edit User]] (vault note) · [[PAGE_LEARNING_INDEX]] · [[My Profile]] · [[Add User Flow]] (sister flow on Organization Hierarchy) · [[Organization Hierarchy]] (sister page)
