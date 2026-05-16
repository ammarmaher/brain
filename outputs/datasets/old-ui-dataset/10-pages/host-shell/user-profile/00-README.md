---
type: page-dataset
app: host-shell
feature: user-profile
source: origin/main @ 803ac1d1
extracted: 2026-05-16
extracted-by: P7
---

# User Profile (with Org-Hierarchy Tree + Add-User Wizard + OTP-Verify-Contact)

## TL;DR
The biggest feature in host-shell. Routes: `/profile` (own profile) and `/profile/:nodeId` (admin viewing another user). Supports three modes via `?mode=` query param: `view` (default), `edit`, `add`, `add-wizard` (opens a 2-step `AddUserWizardComponent`). Left panel shows an org-hierarchy tree (PrimeNG `<p-tree>` wrapping `<falcon-organization-hierarchy-tree>`) — fetched via `/commerce/Node`. Right panel has three tabs: Personal Info, Role & Status, Permissions. Email/phone changes require OTP verification via a dedicated modal (`<app-profile-otp-modal>` calls `identity/user/me/verify-email|phone[/confirm]`). Save dispatches across three Identity endpoints in sequence: `PUT identity/user/{id}/profile`, `PUT identity/user/status`, `PUT identity/user/{id}/role` (only the ones that changed). Heavy use of role-edit PES matrix to filter the role dropdown.

## Manifest
- [[01-ROUTING]] — 2 routes (`/profile`, `/profile/:nodeId`)
- [[02-COMPONENTS]] — 7 components (UserProfile, AddUserWizard, PersonalInformationStep, RoleStatusStep, PermissionsPrivilegeStep, ProfileOtpModal, plus reused FacadeStatusComponent)
- [[03-SERVICES-APIS]] — 5 services + UserApiService (host core) + OrgHierarchyApiService + RoleCatalogService + ProfileOtpService + UserWizardService + UserProfileService; total ~14 endpoints invoked (4 GET, 5 POST, 5 PUT)
- [[04-DTOS]] — 12+ DTOs (UserProfile, SaveUserProfileRequest, ProfilePageMode, UserCreateRequest, PersonalInformationModel, RoleStatusModel, SendProfileOtpRequest, VerifyProfileOtpRequest, GetNodeResponse, RoleCatalogItem, RoleOption, TargetRoleUserType)
- [[05-PES]] — 1 dynamic PES family (`FalconAccess.userRole.other(sourceRoleKey, targetRoleKey)` per role-option × source-role) + reads `accessControlFacade.can()` per cell
- [[06-VALIDATIONS]] — many (required fields on first/last/userName/phone/email/nationalId, async username-existence via FalconCheckExistsDirective, FALCON_PATTERNS.EMAIL_STRING regex, custom letters-digits-max + username-format directives, file size <= 4MB, file type `image/*`)
- [[07-CROSS-PAGE]] — heavy dep on `@falcon` (`OrganizationHierarchyTreeComponent`, `FALCON_ROOT_NODE`, `UserStatus`, etc.) + host core (`UserApiService`, `core/user/user.models.ts`)
- [[08-RULES-APPLIED]] — Template-driven forms (NgForm), Reactive-style `route.queryParamMap` subscription, `window.history.state` reads, ConfirmationService for profile-picture deletion, `setTimeout(0)` for view-child re-checks

## Source files (TS files)
| File | Role |
|---|---|
| `apps/host-shell/src/app/features/user-profile/user-profile.component.ts` | Container (1491 lines) — owns tree, tabs, save flow, OTP verify hook |
| `apps/host-shell/src/app/features/user-profile/user-profile.service.ts` | Screen-level service wrapping UserApiService |
| `apps/host-shell/src/app/features/user-profile/user-profile.models.ts` | UserProfile, SaveUserProfileRequest, ProfilePageMode |
| `apps/host-shell/src/app/features/user-profile/services/org-hierarchy.api.service.ts` | `/commerce/Node` calls (root + children) |
| `apps/host-shell/src/app/features/user-profile/services/role-catalog.service.ts` | `/pes/roles` catalog fetch |
| `apps/host-shell/src/app/features/user-profile/services/profile-otp.service.ts` | `identity/user/me/verify-{email,phone}[/confirm]` |
| `apps/host-shell/src/app/features/user-profile/models/node-api.models.ts` | GetNodeResponse |
| `apps/host-shell/src/app/features/user-profile/models/profile-otp.models.ts` | SendProfileOtpRequest, VerifyProfileOtpRequest |
| `apps/host-shell/src/app/features/user-profile/utils/org-hierarchy.mapper.ts` | OrgHierarchyNode → PrimeNG TreeNode mapper |
| `apps/host-shell/src/app/features/user-profile/components/add-user-wizard/add-user-wizard.component.ts` | 2-step wizard host |
| `apps/host-shell/src/app/features/user-profile/components/add-user-wizard/services/user-wizard.service.ts` | Maps wizard model → `CreateUserRequest` |
| `apps/host-shell/src/app/features/user-profile/components/add-user-wizard/models/user-create-request.model.ts` | UserCreateRequest |
| `apps/host-shell/src/app/features/user-profile/components/add-user-wizard/models/personal-information.model.ts` | PersonalInformationModel |
| `apps/host-shell/src/app/features/user-profile/components/add-user-wizard/models/role-status.model.ts` | RoleStatusModel |
| `apps/host-shell/src/app/features/user-profile/components/add-user-wizard/steps/personal-information-step/personal-information-step.component.ts` | Step 1 — form + async username validation |
| `apps/host-shell/src/app/features/user-profile/components/add-user-wizard/steps/role-status-step/role-status-step.component.ts` | Step 2 — role+status dropdowns, role-edit matrix |
| `apps/host-shell/src/app/features/user-profile/components/add-user-wizard/steps/permissions-privilege-step/permissions-privilege-step.component.ts` | Permissions step (currently NOT in active stepper config) |
| `apps/host-shell/src/app/features/user-profile/components/profile-otp-modal/profile-otp-modal.component.ts` | OTP modal for email/phone verification |
