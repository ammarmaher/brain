# Cross-page dependencies — organization-hierarchy

## Inbound (this feature depends on)

### Shared services (consumed but owned elsewhere)
| Symbol | Imported from | Use site (file) |
|---|---|---|
| `HttpService` | `@falcon` (`libs/falcon/src/core/lib/http/`) | every API service in the feature (7 services × 1 inject each) |
| `useGateway`, `Gateway` | `@falcon` | every API service — for picking the gateway context (default Core Gateway, `Gateway.IdentityGateway` only in `UserApiService`) |
| `ServiceOperationResult<T>` | `@falcon` | every API service's response wrapper |
| `SessionProvider` | `@falcon` (host-shell session) | `OrganizationHierarchyComponent` (user-type check), `HierarchyTabComponent` (canShow logic), `NodeSettingsTabComponent` (isFalconUser), `InformationComponent` (canEdit logic), `AppsServicesTabComponent` + `CommChannelsServicesTabComponent` (column visibility) |
| `TranslateService` + `TranslatePipe` | `@falcon` | every component for i18n |
| `AccessControlFacade` + `FalconAccess` | `@falcon` | container component + `NodeSettingsTabComponent` for PES checks |
| `Helper` | `@falcon` | enum-to-options mapping, lookup-to-UI mapping, date formatting, deep clone, pricing-type label, IP validation helpers |
| `LookupService`, `LOOKUP_IDS`, `LookupValueResponse` | `@falcon` | country / city autocompletes in info view + wizard step 0 |
| `AccountValidationService` | `@falcon` | account-name uniqueness (wizard step 0), username uniqueness (wizard step 4) |
| `UserApiService` (this feature owns it, but also exports it for use by) | own | feature-local (only consumed inside org-hierarchy services + wizard step 4) |
| `SimplePollService`, `OrderStatusService` | `@falcon` | payment-status polling in apps/comm-channel tabs (`GetOrderStatusResponse`, `ProcessState`, `OrderFailureReason`) |
| `FALCON_ROOT_NODE` (sentinel) | `@falcon` | container component for synthetic Falcon-user root + `OrgHierarchyApiService.getChildren` (special-cases root) + `SettingsApiService.getSecuritySettings` (skips `ownerId` param for root) + `InformationService.get` |
| `USER_TYPE_STRINGS`, `SYSTEM_USER_ROLES`, `ACCOUNT_USER_ROLES`, `UserRoles`, `UserStatus`, `getRoleDisplayNameFromRoleKey` | `@falcon` | user-type branching + role display |
| `FALCON_PATTERNS.EMAIL_STRING` | `@falcon` | email validator in wizard step 4 |

### Shared UI components (consumed)
| Component | From | Used in |
|---|---|---|
| `<falcon-organization-hierarchy-tree>` (`OrganizationHierarchyTreeComponent`) | `@falcon` (see memory entry `project_org_hierarchy_tree_shared_component.md`) | container — the entire left panel tree. Inputs: `[loading], [nodes], [allowedActions], [loadingChildrenIds], [selectedNodeKey], [expandedKeys], [disableRoot], [showRootFalcon], [showFalconExpandArrow], [rootChildrenLabel]`. Outputs: `(nodeExpandRequested), (nodeCollapseRequested), (nodeSelected), (nodeAction)` |
| `<app-drawer>` (`DrawerComponent`) | `@falcon` | Add/Edit node drawer — Inputs: `[(show)], position, [headerName], [isEdit], [disableSave], [templateContent]`. Outputs: `(onCancel), (onClose), (onAction)` |
| `<falcon-table>` (`FalconTableComponent<T>`) | `@falcon` | hierarchy-tab user list + apps/comm-channel tab pricing tables; uses `T2TableColumn<T>`, `T2RowMenuAction<T>`, `FalconInlineRowContext<T>`, `FalconCellContext<T>`, `FalconDetailsRowContext<T>`, `FalconRowAction`, `FalconRowActionEvent<T>`, `FALCON_ACTION_REGISTRY`, `FALCON_ROW_ACTION_I18N_KEY`, `FALCON_STATUS_I18N_KEY`, `FalconItemStatus` |
| `<falcon-icon>`, `<falcon-svg-icon>` | `@falcon` | icons; `SVG_ICON_NAMES` constants for known IDs |
| `<falcon-divider>` | `@falcon` | section dividers in wizard step 0, account-owner step, info view, settings tab |
| `<falcon-uploader>` (`FalconUploaderComponent`) | `@falcon` | profile-picture upload in wizard step 0, step 4, info view |
| `<falcon-mobile-number>` (`FalconMobileNumberComponent`) | `@falcon` | phone-number input in wizard step 4 |
| `<falcon-calendar>` (`FalconCalendarComponent`) | `@falcon` | effective-date picker in apps/comm-channel inline edit |
| `<falcon-send-credentials-popup>` (`FalconSendCredentialsPopupComponent`) | `@falcon` | wizard finish delivery-method picker (Sms/Email/Both via `DeliveryMethod` enum) |
| `<falcon-finish-alert-dialog>` (`FalconFinishAlertDialogComponent`) | `@falcon` | wizard post-create success dialog |
| `<app-dynamic-stepper>` (`DynamicStepperComponent`) | `@falcon` | wizard scaffold; consumed via `WizardHostComponent`, `WizardState`, `StepperConfig` |
| `<button-icon>` (`ButtonIconDirective`) | `@falcon` | icon buttons in hierarchy tab |
| `<app-field>` (`FieldComponent`) | `@falcon` | label-wrapper used in `InformationComponent` |
| `getCssVariable(name, fallback)` | `@falcon` (`libs/falcon/src/utils`) | apps/comm-channel tabs — used to read `--color-primary` for the payment-confirmation icon color |
| `InsufficientBalancePriorityDialogComponent` | `apps/admin-console/src/app/shared/components/insufficient-balance-priority-dialog/` | apps/comm-channel tabs — opened when `OrderFailureReason.CommChannelPriorityOrderRequired`. Outputs `proceed: CommChannelPriority[]` and a close emit |
| `InsufficientBalanceWarningDialogComponent` | `apps/admin-console/src/app/shared/components/insufficient-balance-warning-dialog/` | apps/comm-channel tabs — opened on `InsufficientFunds` or `WalletNotConfigForTheNode` |

### Shared types / models (consumed)
- `AccessQuery` — `libs/falcon/src/shared-types/lib/models/access-query.models.ts` (consumed by guards + facade)
- `APP_ROUTES` — `libs/falcon/src/shared-types` — `UNAUTHORIZED`, `ERROR` route names used by guards
- `AttachmentRequestModel` (class) — `@falcon` — wraps profile-picture base64 payloads
- `TabComponentType`, `TabComponentTypeI18n` — re-exported in `tabs-layout/model/models.ts:18`
- Enums: `PricingType`, `PricingTypeI18n`, `ChannelStatus`, `ChannelStatusI18n`, `ChannelStatusToString`, `PasswordSecurityLevel`, `PasswordSecurityLevelI18n`, `UserRoles`, `UserRolesI18n`, `ClassificationCategory`, `ClassificationCategoryI18n`, `ClassificationSubCategory`, `ClassificationSubCategoryI18n`, `AuthorityLetterType`, `AuthorityLetterTypeI18n`, `Hook<T>` — all from `@falcon`

### Guards / route data (consumed)
- `adminConsoleGuard` (root) — `libs/falcon/src/core/lib/guards/admin-console.guard.ts`
- `shellAccessGuard` (per-route, via `route.data['access']`) — `libs/falcon/src/core/lib/access-control/shell-access.guard.ts`

## Outbound (other features depend on this)

### Services / components exported
**None.** This feature is a leaf consumer:
- No service in the feature is consumed outside `apps/admin-console/src/app/features/organization-hierarchy/`.
- No component is exported to other features.
- The `index.ts` in `components/create-client-wizard/` only barrels the wizard internals (`CreateClientWizardComponent`, `InformationClientStepComponent`, `ClientSettingsStepComponent`, `CommChannelsStepComponent`, `ClientApplicationStepComponent`, `AccountOwnerStepComponent`, `FalconFinishAlertDialogComponent`) and is consumed only by the feature container.

### State / events emitted
- **Navigation out**: `onUserSelected(user)` → `router.navigate(['/profile'], { queryParams: { nodeId, orgNodeId }, state: { showTree, expandPath, orgNodeLabel, orgNodeIconUrl, sourceRoute } })`. Consumed by the `/profile` route (lives in **host-shell**, NOT admin-console).
- **Navigation out**: `navigateToAddUser(nodeId)` → `router.navigate(['/profile'], { queryParams: { mode: 'add-wizard', nodeId, orgNodeId }, state: { showTree, expandPath, orgNodeLabel, orgNodeIconUrl, sourceRoute } })`. Same destination, different mode.
- **History-state contract** (set by this feature, read by `/profile`):
  - `showTree: boolean` — tells `/profile` to render the embedded org tree
  - `expandPath: string[]` — array of node keys from root → selected (for tree auto-expand)
  - `orgNodeLabel: string`
  - `orgNodeIconUrl: string`
  - `sourceRoute: string` — for return-navigation breadcrumb
- **History-state contract** (set by `/profile` on return, read by this feature):
  - `selectNodeId: string` — node to auto-select after tree reloads (read in `ngOnInit`, line 138-148)
  - `expandPath: string[]` — path to expand to reveal that node (`expandAlongPath(1)`, line 315-316)

This is the only cross-feature flow inside the platform that uses `window.history.state` rather than route params — flag for normalization.

## Shared state

### Reads
- `SessionProvider.session?.userType` — read in 5 places to branch behavior:
  - `OrganizationHierarchyComponent.ngOnInit` → `isFalcon`
  - `HierarchyTabComponent.canShow` → tab-content visibility
  - `NodeSettingsTabComponent.isFalconUser` → settings tab user-type check
  - `InformationComponent.canEdit` → section edit gating
  - `AppsServicesTabComponent.initializeColumns` + `CommChannelsServicesTabComponent.initializeColumns` → visibility column shown only for Falcon users
- `window.history.state` — read in `ngOnInit` for pending node-select and expand-path
- `AccessControlFacade.resolveFlags(...)` — used in 2 places to bulk-load PES flags
- `LookupService.getLookup(LOOKUP_IDS.Country | LOOKUP_IDS.City, ...)` — country/city autocompletes

### Writes
- The feature does NOT publish any global state. All state lives inside the container component (`OrganizationHierarchyComponent`) and is passed to children via `@Input()` chains.
- `MessageService` toasts are scoped per-component (each tab has its own `providers: [MessageService]` to avoid leakage).
- `ConfirmationService` is shared at the app level (provided in app-root) and used via DI.

## Navigation entry points

| Entry | Source | URL produced |
|---|---|---|
| Host-shell sidenav menu item "Organization Hierarchy" | (in host-shell, not this scope) | `/<admin-console-remote>/organization-hierarchy` |
| Direct deep link (browser address / email) | n/a | same |
| Return from `/profile` (with `selectNodeId` in history state) | `/profile` page navigates back via Router with custom state | route is the same; tree auto-expands |

The feature itself does NOT have deep-link query params (`:id`-style). It always loads the full tree and uses history state to focus a specific node.

## Cross-feature contracts to preserve in the new UI

1. **`/profile` history-state contract** — `selectNodeId` + `expandPath` are how the user-profile page tells this page where to land after a back-navigation. Must remain compatible until both pages migrate.
2. **`FALCON_ROOT_NODE` synthetic root** — Falcon users see this constant instead of a real backend node. Both `getRootNodes` (skipped for Falcon) and `getChildren(null)` (root children) depend on this.
3. **`<falcon-organization-hierarchy-tree>` shared library** — already lives in `libs/falcon`. Its inputs/outputs are the contract. (See memory entry `project_org_hierarchy_tree_shared_component.md` for full surface.) New UI must use the same library — do not rebuild the tree.
4. **`row.allowedActions` server-side contract** — both apps + comm-channel tabs trust the backend to populate the array of `FalconRowAction` values per row. New UI must not start gating actions client-side.
5. **`notShowToaster: 'true'` header on do-payment endpoints** — required to suppress the global error toaster so the page-specific insufficient-balance dialogs can take over.
6. **Order-polling via `SimplePollService`** — 2-second interval, 30-min cap. Backend produces `orderId` from `do-payment`; frontend polls `OrderStatusService.getOrderStatus(orderId)` until terminal state.
7. **PascalCase `UpdateMainNodeInfoRequest`** on `PUT commerce/information` — backend mismatch with platform standard camelCase. Either the backend gets normalized OR the new UI keeps the PascalCase shim.

## Modules / remotes
- This feature lives inside the `admin-console` Module Federation remote.
- The remote's app.routes.ts (`apps/admin-console/src/app/app.routes.ts`) exports `routes` + default — required by host-shell's `remote-route.service.ts findRoutes` method.
- All paths declared inside `accountAdministrationRoutes` (`apps/admin-console/src/app/features/routes.ts:10-96`) are mounted under the admin-console remote's mount point in host-shell.
