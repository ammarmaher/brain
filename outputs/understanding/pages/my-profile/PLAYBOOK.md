*** My Profile — Playbook ***
*** 2026-05-18 ***

# My Profile — Playbook

## TL;DR

Self-edit own profile at `/profile` (no `:userId`). Re-uses same component shell as Edit User in old-UI, but with Role/Status/Permissions tabs hidden per BR-UM-41. Endpoint `PUT /api/user/profile` (no `:id`) — backend resolves user from JWT claim. Same OTP endpoints (`/me/verify-*`) — no Q-UM-13 ambiguity. Same email+phone simultaneous-edit rule (BR-UM-21). Same username-immutable rule (BR-UM-19). Change Password lives in separate flow.

## Sections

1. Permissions — authGuard only, no PES, own-only.
2. Personal Info — same fields as Edit User Tab 1.
3. OTP verification — same modal, same `/me/verify-*` endpoints.
4. Profile picture — same upload/delete UX.
5. Change Password link — navigate to `pages/change-password/`.
6. Validations — same V-rules as Edit User Personal Info.
7. Backend API — `PUT /api/user/profile` (no id) + OTP endpoints.
8. Components — standalone `MyProfileComponent` (recommended) or shared with Edit User.
9. Kafka — user-updated · email-changed · phone-changed · contact-verified.
10. State — no user-status changes; only emailVerified/phoneVerified flags.
11. Errors — same as Edit User Personal Info section (no partial-save recovery).
12. Gaps — inherits Edit User anti-patterns + component-reuse-confusion + avatar-delete-double-confirm.

## Hubs

[[My Profile Flow]] · [[Edit User Flow]] · [[Change Password Flow]] · [[02 User Management]] · [[Identity Service]]
