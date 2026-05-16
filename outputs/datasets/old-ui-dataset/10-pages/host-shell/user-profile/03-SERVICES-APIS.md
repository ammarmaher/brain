# Services & APIs — user-profile

## Services
| Service | File | Singleton? | Purpose |
|---|---|---|---|
| `UserProfileService` | `user-profile.service.ts:21` | `providedIn: 'root'` | Maps `UserResponse` ↔ `UserProfile`; orchestrates `runProfileUpdate → runStatusUpdate → runRoleUpdate` chain |
| `OrgHierarchyApiService` | `services/org-hierarchy.api.service.ts:21` | `providedIn: 'root'` | Calls `commerce/Node` for tree population |
| `RoleCatalogService` | `services/role-catalog.service.ts:24` | `providedIn: 'root'` | Calls `/pes/roles` for role catalog + filtering helpers |
| `ProfileOtpService` | `services/profile-otp.service.ts:23` | `providedIn: 'root'` | Send + verify OTP for email/phone field changes |
| `UserWizardService` | `components/add-user-wizard/services/user-wizard.service.ts:19` | `providedIn: 'root'` | Maps wizard model → `CreateUserRequest`, calls `UserApiService.create()` |

## HTTP endpoints called (full table — all user-profile feature)

### Profile fetch + update (via UserProfileService → UserApiService, dynamic gateway)

| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| GET | `identity/user/me` | `UserProfileService.getUserProfile()` → `UserApiService.getMe()` | n/a | `ServiceOperationResult<UserProfile>` (mapped from `UserResponse`) | `user-profile.service.ts:28-32` |
| GET | `identity/user/{id}` | `UserProfileService.getUserProfileById(userId)` → `UserApiService.getById(id)` | n/a | `ServiceOperationResult<UserProfile>` | `user-profile.service.ts:38-42` |
| PUT | `identity/user/profile` (when `userId` omitted) | `UserApiService.updateOwnProfile()` | `UpdateUserProfileRequest` | `ServiceOperationResult<boolean>` | `user-api.service.ts:133-141` |
| PUT | `identity/user/{id}/profile` | `UserApiService.updateUserProfile(id, payload)` | `UpdateUserProfileRequest` | `ServiceOperationResult<boolean>` | `user-api.service.ts:144-153` |
| PUT | `identity/user/status` | `UserApiService.changeStatus({userId, newStatus})` | `ChangeUserStatusRequest` | `ServiceOperationResult<object>` | `user-api.service.ts:122-130` |
| PUT | `identity/user/{id}/role` | `UserApiService.updateUserRole(id, {roleKey})` | `UpdateUserRoleRequest` | `ServiceOperationResult<boolean>` | `user-api.service.ts:156-165` |

### Org-hierarchy tree (Core/System Gateway → `commerce/Node`)

| Method | URL pattern | Service.Method | Request | Response | Source file:line |
|---|---|---|---|---|---|
| GET | `commerce/Node` | `OrgHierarchyApiService.getRootNodes()` | (no params) | `ServiceOperationResult<GetNodeResponse[]>` → mapped to `OrgHierarchyNode[]` | `org-hierarchy.api.service.ts:44-65` |
| GET | `commerce/Node?NodeId={parentId}` | `OrgHierarchyApiService.getChildren(parentId)` | params: `NodeId` (omitted for Falcon root) | `ServiceOperationResult<GetNodeResponse[]>` → mapped to `OrgHierarchyNode[]` | `org-hierarchy.api.service.ts:67-97` |

### Role catalog (PES Service)

| Method | URL pattern | Service.Method | Params | Response | Source file:line |
|---|---|---|---|---|---|
| GET | `<baseURLPes>/pes/roles?targetUserType={system\|account}&tenantId={...}` | `RoleCatalogService.getRoles(targetUserType, tenantId)` | targetUserType, tenantId (when account) | `RoleCatalogItem[]` | `role-catalog.service.ts:29-45` |

Note: URL building (`role-catalog.service.ts:39-43`) prepends `envConfig.baseURLPes` directly OR falls back to relative `pes/roles` — bypasses the gateway-context system.

### Contact verification OTP (Identity Gateway → `identity/user/me/verify-*`)

| Method | URL pattern | Service.Method | Request DTO | Response | Source file:line |
|---|---|---|---|---|---|
| POST | `/user/me/verify-phone` | `ProfileOtpService.sendOtp({field: Phone, value})` | empty body `{}` | `ServiceOperationResult<boolean>` | `profile-otp.service.ts:30-42` (line 33-35) |
| POST | `/user/me/verify-email` | `ProfileOtpService.sendOtp({field: Email, value})` | empty body `{}` | `ServiceOperationResult<boolean>` | `profile-otp.service.ts:30-42` |
| POST | `user/me/verify-phone/confirm` | `ProfileOtpService.verifyOtp({field: Phone, otp})` | `{ code: otp }` | `ServiceOperationResult<boolean>` | `profile-otp.service.ts:48-60` |
| POST | `user/me/verify-email/confirm` | `ProfileOtpService.verifyOtp({field: Email, otp})` | `{ code: otp }` | `ServiceOperationResult<boolean>` | `profile-otp.service.ts:48-60` |

Note: The send endpoints use a leading slash (`/user/me/verify-phone`) while confirm endpoints do not (`user/me/verify-phone/confirm`). `[INFERRED]` Inconsistency likely due to manual editing; the `RuntimeBaseUrlInterceptor` likely normalizes both, but worth flagging.

### Wizard create user (Identity Gateway → `identity/user`)

| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| POST | `identity/user` | `UserWizardService.createUser(payload)` → `UserApiService.create(backendPayload)` | `CreateUserRequest` (with `personalInfo`, `roleKey`, `tenantId`, `nodeId`, `path`, `deliveryMethod`, empty `permissionGroupId`) | `ServiceOperationResult<CreateUserResponse>` | `user-wizard.service.ts:33-60` + `user-api.service.ts:87-95` |

### Validation / async-check (used by Step 1)
- `FalconCheckExistsDirective` (`@falcon`) invokes `AccountValidationService.isUserExist(username, email, phoneNumber)` → `[INFERRED]` calls `POST identity/user/exist` (see `UserApiService.checkExist`) but the call site is inside `@falcon`, not in the feature code.

## Base URL resolution
- Profile + status + role updates → dynamic via `useGateway()` based on session.userType. (See `_core/03-SERVICES-APIS.md`.)
- OTP sends/confirms → `useGateway(Gateway.IdentityGateway)`.
- Role catalog → bypasses gateway, uses `envConfig.baseURLPes` directly.
- Org-hierarchy tree → `useGateway()` (dynamic).
- Wizard create user → `useGateway()` (dynamic).

## Auth / interceptors
- All requests go through `RequestInterceptor` (Bearer token) and `ResponseInterceptor` (toast + 401 refresh).
- Some calls suppress error toasts implicitly via the design of `ServiceOperationResult` (the component handles `isSuccessful === false` paths inline).

## Backend service mapping
- `identity/user/*` → Identity Service (via Identity Gateway in prod).
- `commerce/Node` → Falcon Core Commerce Service (NodeController) — confirmed by the URL prefix and the `OrgHierarchyApiService.apiEndpoint = 'commerce/Node'` constant.
- `pes/roles` → PES (Permission Eligibility Service) — confirmed by the `baseURLPes` env variable usage.
