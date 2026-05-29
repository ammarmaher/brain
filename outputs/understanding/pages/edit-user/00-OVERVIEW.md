*** Edit User — Overview ***
*** SoT for implementation · Page: User Profile (admin-edit mode) · 2026-05-17 ***
*** Part of: Brain Outputs/understanding/pages/edit-user/ ***

# Edit User — Overview

> End-to-end summary of the **Edit User** flow (admin-actor edits an existing user). Distinct from My Profile (self-edit) and Add User (3-step wizard inside Organization Hierarchy).
>
> Scope: this folder covers Edit User admin path only. The self-edit variant (`/profile` with no `:nodeId`) is owned by `pages/my-profile/`. The creation variant (`?mode=add-wizard`) is owned by `pages/organization-hierarchy/Add User/`.

## Source-of-truth pointers

- [PRD] PRD-02 OVERVIEW · `Brain Outputs/prd/modules/02-user-management/OVERVIEW.md:31` (Main Screen #4 — Edit User)
- [PRD] PRD-02 BUSINESS_RULES · `Brain Outputs/prd/modules/02-user-management/BUSINESS_RULES.md:74-80` (BR-UM-36..40 — admin edit rules)
- [PRD] PRD-02 WORKFLOWS · `Brain Outputs/prd/modules/02-user-management/WORKFLOWS.md`
- [PRD] PRD-02 ENTITIES (User · OtpChallenge · Session) · `Brain Outputs/prd/modules/02-user-management/ENTITIES.md`
- [PRD] PRD-02 GAPS · `Brain Outputs/prd/modules/02-user-management/GAPS.md`
- [PRD] PRD-02 QUESTIONS (Q-UM-13 admin OTP path · OPEN) · `Brain Outputs/prd/modules/02-user-management/QUESTIONS.md`
- [BRAIN-OUT] Identity SERVICE_OVERVIEW · `Brain Outputs/understanding/backend/identity/SERVICE_OVERVIEW.md`
- [BRAIN-OUT] Identity ENDPOINT_REGISTRY · `Brain Outputs/understanding/backend/identity/ENDPOINT_REGISTRY.md:22-46` (User endpoints)
- [BRAIN-OUT] Identity DTO_DICTIONARY · `Brain Outputs/understanding/backend/identity/DTO_DICTIONARY.md`
- [BRAIN-OUT] Identity VALIDATIONS · `Brain Outputs/understanding/backend/identity/VALIDATIONS.md`
- [BRAIN-OUT] Identity ERRORS · `Brain Outputs/understanding/backend/identity/ERRORS.md`
- [BRAIN-OUT] Old-UI user-profile dossier · `Brain Outputs/datasets/old-ui-dataset/10-pages/host-shell/user-profile/00-README.md` (9-file dossier)

## Trigger / entry point

- **Page:** Organization Hierarchy (`apps/admin-console/.../organization-hierarchy-page`) or User Details host-shell page (`/profile/:nodeId`).
- **Action button:** "Edit User" (from a user row's kebab menu in Org Hierarchy) OR clicking a user row, which navigates to `/profile/:userId?mode=edit`.
- **Modal / drawer shell:** in old-UI, opens inside `UserProfileComponent` with three tabs (Personal / Role & Status / Permissions). In new UI, will live in a Falcon Drawer or right-pane Details view per Add Client's pattern.
- **Precondition:** authenticated user · target user belongs to a node the actor can manage · PES `FalconAccess.userRole.other(sourceRole, targetRole)` allows the role-edit permutation · IP on tenant allowlist.

## The 3 tabs

1. **Tab 1 — Personal Info** — First Name · Last Name · Username (immutable display-only) · Email (OTP gated) · Phone (OTP gated) · NationalId · Profile Picture (upload/delete). Detailed in [02-SECTION_PERSONAL_INFO](02-SECTION_PERSONAL_INFO.md).
2. **Tab 2 — Role & Status** — Status dropdown (per allowed transitions per BR-UM-08) · Role dropdown (per PES role-edit matrix). Detailed in [03-SECTION_ROLE_STATUS](03-SECTION_ROLE_STATUS.md).
3. **Tab 3 — Permissions** — PermissionGroup dropdown (one per user per BR-UM-42). Detailed in [04-SECTION_PERMISSIONS](04-SECTION_PERMISSIONS.md).

**Note from old-UI:** The Permissions tab in `apps/host-shell/.../user-profile/user-profile.component.ts:308-310` has `canEditPermissionGroup = false` (WIP). New-UI implementation must wire this per BR-UM-40 (Permission Group is editable).

## Save dispatch — 3-endpoint sequential chain

Unlike Add Client (one composite POST), Edit User dispatches up to **3 separate PUT calls** in sequence, only firing the ones whose diff is non-empty:

```
UserProfileService.updateUserProfile(payload, userId, originalProfile)
    │
    ▼
[Diff personalInfoChanged] → PUT /api/user/{id}/profile (UpdateUserProfileRequest)
    │ (success)
    ▼
[Diff statusChanged]       → PUT /api/user/status (ChangeUserStatusRequest{UserId, NewStatus})
    │ (success)
    ▼
[Diff roleChanged]         → PUT /api/user/{id}/role (UpdateUserRoleByIdRequest{Id, RoleKey})
    │ (success)
    ▼
Refresh local cache · navigate to View mode · toast success
```

Source: [CODE] `apps/host-shell/.../user-profile.service.ts:75-122` (`UserProfileService.updateUserProfile` chain via `profileUpdate$ → switchMap(runStatusUpdate) → switchMap(runRoleUpdate)`).

**Critical implementation note:** if user changes both Status and Role, BOTH endpoints fire. If only Personal Info changes, ONLY the profile endpoint fires. Each step runs only if the previous succeeded — a failure mid-chain leaves a partially-applied state (handled in [12-ERROR_STATES](12-ERROR_STATES.md)).

## Email/phone change side flow — OTP gate

If the admin types a new email or phone, a verification gate prevents save until OTP is verified:

```
[email field changes] → emailNeedsVerification flips true
    │
    ▼
[ProfileOtpModal opens] → POST /api/user/me/verify-email (body has new email)
    │ (success — code sent)
    ▼
[User enters 6-digit code] → POST /api/user/me/verify-email/confirm { code: otp }
    │ (success)
    ▼
[emailVerified = true] → save button enabled
```

Same path for phone. **Q-UM-13 OPEN:** PRD says BR-UM-36 "OTP to new email / new phone" — endpoints today are `/me/verify-*` (self-verifies own contact). Admin-edit-of-another-user OTP path is ambiguous — see [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md) GAP-UM-21.

## Cross-flow dependencies

- **Triggered by [[Organization Hierarchy]]:** the "Edit User" action on a user row in the right-pane menu invokes this flow.
- **Sister flow [[Add User Flow]]:** shares the `PersonalInformationStepComponent` and `RoleStatusStepComponent` (but with `mode='add'` vs `'edit'`).
- **Sister flow [[My Profile Flow]]:** uses the same `UserProfileComponent` shell with no `:nodeId` query param. Hides Role/Status/Permissions tabs per BR-UM-41.
- **Downstream PES** — changing a user's PermissionGroup invalidates PES decision cache for that user across all pages.
- **Identity webhook chain** — Zitadel emits `UserLocked/Unlocked/Deactivated/Reactivated` events; webhook handler updates Mongo status. Admin status change goes the OTHER direction (Mongo → Zitadel via the endpoint).

## Page sections this flow touches

- `org-hierarchy-page-menu` (admin-console) — kebab action that opens Edit User.
- Right-pane Details view — three tabs (Personal / Role & Status / Permissions).
- ProfileOtpModal — opens on top of the page when email/phone changes.
- ConfirmDialog (`deleteProfilePicture` key) — guard rail before avatar delete.

## Sequence diagram (textual)

```
Admin (Falcon admin / Account Owner / Node Admin)
    │
    ▼
[Admin Console — kebab "Edit User" on user row] ────► [System Gateway: 7256]
                                              │
                                              │ (loads target user)
                                              ▼
                         [Identity: GET /api/user/{id}] → UserResponse
                                              │
                                              ▼
                         [Personal Info tab opens] → user types new email
                                              │
                                              ▼
                         [ProfileOtpModal] → POST /api/user/me/verify-email
                                              │                                ┌──► Kafka: send OTP via Notifications svc
                                              ▼                                │
                                          OTP entered + confirm                │
                                              ▼                                │
                         [POST /api/user/me/verify-email/confirm]              │
                                              │                                │
                                              ▼                                │
                         [User clicks Save] → 3-endpoint chain:                │
                                              │                                │
                              PUT /api/user/{id}/profile                       │
                              PUT /api/user/status (if changed)                │
                              PUT /api/user/{id}/role (if changed)             │
                                              │                                │
                                              ▼                                ▼
                                          Zitadel sync ◄────  identity.user-updated.v1 (Kafka)
                                              │
                                              ▼
                              Returns ServiceOperationResult<bool>
                                              │
                                              ▼
[Admin Console — toast success · refresh list · re-fetch GET /api/user/{id}]
```

## See also (Edit User folder)

- [README](README.md) — folder index
- [01-PERMISSIONS](01-PERMISSIONS.md)
- [02-SECTION_PERSONAL_INFO](02-SECTION_PERSONAL_INFO.md)
- [03-SECTION_ROLE_STATUS](03-SECTION_ROLE_STATUS.md)
- [04-SECTION_PERMISSIONS](04-SECTION_PERMISSIONS.md)
- [05-SECTION_OTP_VERIFICATION](05-SECTION_OTP_VERIFICATION.md)
- [06-SECTION_PROFILE_PICTURE](06-SECTION_PROFILE_PICTURE.md)
- [07-VALIDATIONS](07-VALIDATIONS.md)
- [08-BACKEND_API](08-BACKEND_API.md)
- [09-COMPONENTS](09-COMPONENTS.md)
- [10-KAFKA_SIDE_EFFECTS](10-KAFKA_SIDE_EFFECTS.md)
- [11-STATE_TRANSITIONS](11-STATE_TRANSITIONS.md)
- [12-ERROR_STATES](12-ERROR_STATES.md)
- [13-GAPS_AND_DRIFTS](13-GAPS_AND_DRIFTS.md)
- [14-IMPLEMENTATION_CHECKLIST](14-IMPLEMENTATION_CHECKLIST.md)
- [PLAYBOOK](PLAYBOOK.md) — full single-doc version

## Hubs

- [[Organization Hierarchy]] · [[02 User Management]] · [[Identity Service]] · [[PES Service]] · [[Falcon Roles Permission Matrix]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[COMPONENT_INDEX]] · [[API_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]] · [[AMMAR_BRAIN_HOME]]
