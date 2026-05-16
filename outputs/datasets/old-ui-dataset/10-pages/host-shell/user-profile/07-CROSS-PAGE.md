# Cross-page dependencies — user-profile

## Inbound (user-profile depends on)

### From `@falcon` (unified workspace library)
- `SessionProvider`, `AccessControlFacade`, `FalconAccess`, `USER_TYPE_STRINGS`, `SYSTEM_ROLE_KEYS`, `ACCOUNT_ROLE_KEYS` — PES + session.
- `TranslateService`, `TranslatePipe` — i18n.
- `Helper`, `Hook<T>`, `UserStatus`, `UserStatusI18n` — option-building utilities.
- `SvgIconComponent`, `SVG_ICON_NAMES`, `getSvgIcon` — icon system.
- `FalconUploaderComponent`, `AttachmentRequestModel` — profile-picture upload.
- `FalconMobileNumberComponent` — phone input (and validator).
- `FalconDividerComponent` — section dividers.
- `OrganizationHierarchyTreeComponent`, `OrgHierarchyNode`, `OrgNodeAction`, `FALCON_ROOT_NODE` — left tree.
- `HttpService` — typed HttpClient wrapper used by org-hierarchy.api.service + role-catalog.service.
- `useGateway`, `Gateway` — gateway context tag.
- `SHELL_ENV_CONFIG` — used by `RoleCatalogService` to build PES URL.
- `VerifiableField`, `OtpScreenState`, `OTP_DEFAULTS`, `FlowStep`, `FALCON_PATTERNS` — OTP + email constants.
- `DynamicStepperComponent`, `StepperConfig`, `SelectedNodeInfo`, `FalconSendCredentialsPopupComponent`, `FalconFinishAlertDialogComponent`, `DeliveryMethod` — wizard chrome.
- `FalconFormValidateDirective`, `FalconCheckExistsDirective`, `FalconLettersDigitsMaxDirective`, `FalconUsernameFormatDirective`, `AccountValidationService` — wizard step-1 validation.
- `ServiceOperationResult` — response envelope.

### From host core
- `UserApiService` (from `core/user/user-api.service`) — every CRUD call.
- `core/user/user.models` types — `UserResponse`, `CreateUserRequest`, `UpdateUserProfileRequest`, `UpdateUserRoleRequest`, `ChangeUserStatusRequest`, `ProfilePictureInfo`, etc.

### From PrimeNG
- `ConfirmDialogModule`, `ConfirmationService`
- `InputTextModule`, `ButtonModule`, `SkeletonModule`, `SelectModule`, `InputGroupModule`, `InputGroupAddon`
- `DialogModule`, `InputOtpModule`

## Outbound (other features depend on user-profile)

- Linked from `LayoutComponent` user-profile-menu ("Profile" item routes to `/profile`).
- Linked from admin-console org-hierarchy page (`[INFERRED]` — `sourceRoute` history-state value is `/admin-console/organization-hierarchy`).
- Linked from management-console (`[INFERRED]` similar pattern).
- `OrgHierarchyApiService` (`providedIn: 'root'`) is technically reachable by any consumer, but in the current code only `UserProfileComponent` uses it.

## Shared state
- **Reads:**
  - `SessionProvider.session?.userType / tenantId / name / nodeId`.
  - `SessionProvider.node?.label / url`.
  - `window.history.state` (showTree, orgNodeLabel, orgNodeIconUrl, expandPath, sourceRoute, selectNodeId).
  - `route.queryParamMap` (mode, nodeId, orgNodeId).
  - `route.snapshot.paramMap.nodeId` (from `/profile/:nodeId`).
- **Writes:**
  - `router.navigate(['/profile'], { state: {...} })` — navigates with selectNodeId + expandPath when a tree node is clicked, OR navigates back to `sourceRoute` after wizard cancel/finish.
  - `router.navigate([sourceRoute], { state: { selectNodeId, expandPath } })` — informs the source page which node was selected/added.

## Navigation entry points
- Sidebar: "Profile" menu item in `UserProfileMenuComponent` → `/profile`.
- Org-hierarchy click flow (from admin-console / management-console): navigates `/profile/:nodeId` or `/profile?nodeId=...` with `state.showTree=true` and `state.sourceRoute=<origin>`.
- Add-user wizard launch: clicking "Add User" action on an org-hierarchy node → `router.navigate(['/profile'], { queryParams: { mode: 'add-wizard', nodeId }, state: { showTree: true, sourceRoute, orgNodeLabel, orgNodeIconUrl } })`.
- Wizard cancel/finish → `router.navigate([sourceRoute], { state: { selectNodeId, expandPath } })`.

## Module Federation considerations
- The user-profile feature is **inside** the host-shell app — it does NOT live in `admin-console` or `management-console`. This means user-profile code is bundled with the host and remains responsive even if a remote MFE fails to load.
- The remote `admin-console` and `management-console` apps can deep-link to `/profile/:nodeId` via shared `Router` (provided by host).
