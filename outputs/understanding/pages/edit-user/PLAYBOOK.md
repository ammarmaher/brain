*** Edit User — Playbook (single-doc synthesis) ***
*** Full implementation spec rolled up · 2026-05-17 ***

# Edit User — Playbook

> Single-document version of the Edit User folder. Use as a complete brief when full-stack context is needed. Drill into per-file sources for deeper detail.

## TL;DR

**Edit User** is the admin-actor flow for editing an existing Falcon user. Triggered from Organization Hierarchy or User Details page. Three tabs (Personal Info · Role & Status · Permissions). Save dispatches up to 3 sequential PUT calls to Identity Service: `/api/user/{id}/profile`, `/api/user/status`, `/api/user/{id}/role`. Email/phone changes require OTP verification via a dedicated modal. Distinct from My Profile (self-edit, narrower scope) and Add User (3-tab wizard with username uniqueness).

**PRD anchor:** BR-UM-36..40 (admin edit rules) + BR-UM-21 (email/phone not simultaneous) + BR-UM-08 (status transitions) + BR-UM-19 (username immutable).

**Critical halt:** Q-UM-13 — admin OTP path for editing another user's contact is undefined. Either bypass for Falcon admins OR define new endpoints `POST /api/user/{id}/verify-{email|phone}`.

## Sections

### 1. Permissions

- Route guard: `authGuard` + `shellPrimeAccessGuard` (inherited from `LayoutComponent`).
- Role-edit matrix: dynamic PES `FalconAccess.userRole.other(sourceRoleKey, targetRoleKey)`.
- `canEditStatus = !!nodeId` (admin only · not self-edit).
- `canEditRole = !!nodeId && roleSelectionEditable` (PES allows ≥1 transition).
- `canEditPermissionGroup = false` (WIP in old-UI; new-UI must wire per BR-UM-40).
- Deleted→Active restoration: Falcon usertype only.

### 2. Personal Info tab

Fields: firstName · lastName · userName (immutable) · email (OTP gated) · phoneNumber (OTP gated) · nationalId · profilePicture (upload/delete).

Cross-field: BR-UM-21 — Email AND Phone cannot be edited in same save (not enforced FE in old-UI — GAP-UM-22 fix).

Save gate: `isSaveDisabled` = !firstName OR !lastName OR !emailValid OR !phoneValid OR emailNeedsVerification OR phoneNeedsVerification.

### 3. Role & Status tab

- Status: `<falcon-select>` filtered by BR-UM-08 from-status (old-UI does NOT filter; new UI should).
- Role: `<falcon-select>` filtered by PES `userRole.other`.
- Side effects: changing to Normal User re-validates `MaxNormalUserLimit`; changing to Account Owner enforces singleton.

### 4. Permissions tab

WIP in old-UI. New UI: TBD catalog endpoint; one PermissionGroup per user (BR-UM-42).

### 5. OTP verification modal

- 6-digit OTP, 120s expiry (drift vs PRD's 60s — GAP-UM-25).
- Endpoints: `POST /api/user/me/verify-{email|phone}` send → `POST /api/user/me/verify-{email|phone}/confirm`.
- Masked display: email `t**@example.com` / phone `****1234`.
- Auto-submit on 6 digits entered.

### 6. Profile picture

- `<falcon-uploader>` · `image/*` · ≤4 MB.
- Delete requires `<falcon-confirm-dialog>` (key='deleteProfilePicture').
- `URL.revokeObjectURL` on destroy.

### 7. Validations

V-rules (12): see [07-VALIDATIONS](07-VALIDATIONS.md) for full table.

### 8. Backend API

3 PUT endpoints + 4 OTP endpoints + 1 GET for load + 1 PES roles catalog. All responses wrapped in `ServiceOperationResult<T>`. Identity uses camelCase wire.

Routing: Falcon admin → System Gateway · Client admin → Core Gateway. Resolve via `useGateway()`.

### 9. Components

Old-UI is PrimeNG-heavy. New UI replaces all with `<falcon-*>` (F-016). No SCSS (F-017). No `*ngIf`/`*ngFor` (F-018). Reactive Forms (F-022).

### 10. Kafka side effects

Identity emits (per save endpoint): `user-updated`, `user-status-changed`, `user-role-changed`, `contact-verified`. Consumed by Commerce, PES, Notifications. Also Zitadel HTTP sync (direct call) + Zitadel webhook back (reflects external changes).

### 11. State transitions

`UserStatus` FSM (Pending · Active · Suspended · Locked · Deleted). Edit User can drive Active↔Suspended, Active↔Locked, Active↔Deleted (Deleted→Active Falcon-only). Cannot drive: Pending←anywhere except first-login flow.

### 12. Error states

HTTP-status-routed UX. Per-endpoint FalconKey enumeration. Partial-state recovery on chained-save failure (GAP-UM-28 needs new UI fix).

### 13. Gaps & drifts

- HIGH: Q-UM-13 admin OTP path · GAP-UM-22 simultaneous edit guard · GAP-UM-24 PG tab WIP
- MEDIUM: GAP-UM-25 OTP expiry drift · GAP-UM-26 Kafka events undocumented · GAP-UM-27 status filter missing · GAP-UM-28 partial recovery · GAP-UM-29 Deleted restore UX · GAP-UM-30 AO demotion silent · GAP-UM-31 RoleCatalog bypasses gateway
- LOW: GAP-UM-32 NgForm · GAP-UM-33 PrimeNG · GAP-UM-34 slash inconsistency · GAP-UM-35 email mask · GAP-UM-36 picture format silent

### 14. Implementation checklist

8-question verification gate. Pre-flight: Q-UM-13 resolved. FE list. BE list. Full-stack E2E list.

## Source-of-truth pointers

- [PRD] `Brain Outputs/prd/modules/02-user-management/BUSINESS_RULES.md:74-80` (BR-UM-36..40)
- [BRAIN-OUT] `Brain Outputs/understanding/backend/identity/ENDPOINT_REGISTRY.md:22-46`
- [CODE] `apps/host-shell/src/app/features/user-profile/user-profile.component.ts:64-1491`
- [CODE] `apps/host-shell/src/app/features/user-profile/user-profile.service.ts:21-122`
- [CODE] `apps/host-shell/src/app/features/user-profile/services/profile-otp.service.ts:23-60`
- [CODE] `apps/host-shell/src/app/core/user/user-api.service.ts:87-165`

## Hubs

[[Edit User Flow]] · [[Organization Hierarchy]] · [[02 User Management]] · [[Identity Service]] · [[PES Service]] · [[AMMAR_BRAIN_HOME]]
