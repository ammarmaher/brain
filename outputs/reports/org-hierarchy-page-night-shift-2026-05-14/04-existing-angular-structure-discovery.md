# 04 — Existing Angular Structure Discovery (Reference Feature Catalog)

> **Source feature (mirror target):** `apps/management-console/src/app/features/organization-hierarchy-page/`
> **Destination feature (to scaffold):** `apps/admin-console/src/app/features/org-hierarchy-page/` (note the shorter slug)
> **Workspace root:** `C:\Falcon\Falcon\falcon-web-platform-ui\`
> **Inspection mode:** read-only — no edits performed.
> **Tags used:** ⚓ MUST mirror 1:1 · 🚩 deviation allowed

The destination folder is **empty** today (`apps/admin-console/src/app/features/` contains zero files). The admin-console `app.routes.ts` redirects `''` → `'organization-hierarchy'` (legacy entry) and has nothing else. The host-shell sidebar already declares a placeholder entry `'Organization Hierarchy (New Page)'` at path `${APP_ROUTES.admin_console_BASE}/organization-hierarchy-page` — that is the route the new feature must register against (see §15).

---

## 1. Full file tree (91 files / 43 directories / 0 SCSS)

| Path (relative to `apps/management-console/src/app/features/organization-hierarchy-page/`) | Size (B) | Purpose |
|---|---:|---|
| `organization-hierarchy-page.routes.ts` | 574 | Lazy-loads `OrganizationHierarchyPageMenuComponent` at path `''`. ⚓ |
| `guards/guards.ts` | 3 588 | `nodeExistsGuard`, `addNodeGuard` (depth ≤ 6), `addClientGuard` (root-only), `editNodeGuard` (no edit on root). ⚓ |
| `resolvers/resolvers.ts` | 1 728 | `ROOT_NODE_ID='root'`, `treeResolver`, `nodeResolver`, `usersResolver`, `userResolver`. ⚓ |
| `models/models.ts` | 13 830 | **Single consolidated domain models file** for the page (see §4). ⚓ |
| `services/services.ts` | 8 629 | `HierarchyService` — tree/sub-node/edit/account-name validation (see §5). ⚓ |
| `services/hierarchy-page-state.service.ts` | 23 888 | `HierarchyPageStateService` — page-scoped view state (see §5). ⚓ |
| `services/mock-tree.ts` | 5 317 | `MOCK_TREE` + `DEFAULT_ACCOUNT_SETTINGS` + `generateMockUsers` + helpers. 🚩 |
| `services/mock-applications.ts` | 5 158 | `ApplicationRow` + `getMockApps()` + `getMockChannels()`. 🚩 |
| `services/validators.ts` | 12 100 | 20+ `ValidatorFn`/`AsyncValidatorFn`s (account/node/user/email/phone/IP/depth). ⚓ |
| `services/validation-messages.ts` | 6 846 | `VALIDATOR_KEYS`, `LIVE_ERROR_KEYS`, `BACKEND_ERROR_KEY`, `ServiceErrorEnvelope`. ⚓ |
| `components/organization-hierarchy-page-menu.component.ts` | 5 138 | Top-level menu shell — composes everything (see §3). ⚓ |
| `components/organization-hierarchy-page-menu.component.html` | 10 581 | Template — tree-panel + tabs + view-toggles + dynamic tab body. ⚓ |
| `components/skeleton/org-hierarchy-skeleton.component.ts` | 9 490 | Inline-template loading skeleton (Tailwind only). ⚓ |
| `components/tab-components/applications-table/applications-table.component.ts` | 5 188 | Shared price-row editor (used by Apps + CommChannels tabs). ⚓ |
| `components/tab-components/applications-table/applications-table.component.html` | 10 540 | Table HTML — toggle/menu/edit-row patterns. ⚓ |
| `components/tab-components/applications-table/index.ts` | 87 | Barrel. ⚓ |
| `components/tab-components/apps-services-tab/apps-services-tab.component.ts` | 724 | Thin wrapper → `ApplicationsTableComponent`. ⚓ |
| `components/tab-components/apps-services-tab/apps-services-tab.component.html` | 154 | Wrapper template. ⚓ |
| `components/tab-components/apps-services-tab/index.ts` | 85 | Barrel. ⚓ |
| `components/tab-components/comm-channels-tab/comm-channels-tab.component.ts` | 729 | Thin wrapper → `ApplicationsTableComponent` (different mock seed). ⚓ |
| `components/tab-components/comm-channels-tab/comm-channels-tab.component.html` | 154 | Wrapper template. ⚓ |
| `components/tab-components/comm-channels-tab/index.ts` | 85 | Barrel. ⚓ |
| `components/tab-components/settings-tab/settings-tab.component.ts` | 2 335 | View/Edit toggle over `ClientSettingsStepComponent`. ⚓ |
| `components/tab-components/settings-tab/settings-tab.component.html` | 1 209 | Header + slot template. ⚓ |
| `components/tab-components/settings-tab/index.ts` | 75 | Barrel. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-chart/index.ts` | 851 | Public surface re-exports (component, card, toolbar, directive, layout svc, types). ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.ts` | 6 759 | Org-chart container — pan/zoom/focus orchestration. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 5 183 | Chart template — viewport, plane, SVG connectors, user circles, toolbar. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.ts` | 1 550 | Absolute-positioned card. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` | 2 718 | 3-template card (root / client / sub-node). ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.ts` | 1 044 | Zoom-in / -out / fit / reset. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-toolbar/falcon-chart-toolbar.component.html` | 3 071 | Toolbar template (SVG icons inline). ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-chart/directives/directives.ts` | 3 493 | `FalconPanZoomDirective` — wheel-zoom-at-cursor + drag-pan. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-chart/services/chart-layout.service.ts` | 3 525 | `ChartLayoutService` — left-to-right tidy-tree layout. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-chart/models/models.ts` | 1 008 | `ChartTreeNode`, `ChartCard`, `ChartLine`, `ChartPan`, `ChartLayoutResult/Options`. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.ts` | 1 929 | 17-field dossier panel. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 2 343 | Avatar header + 4 section blocks. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-info-panel/models/models.ts` | 575 | `OrgInfoSection`, `OrgInfoFieldKey`, re-exports `NodeDossier`. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-info-panel/index.ts` | 221 | Barrel. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-kanban/falcon-org-kanban.component.ts` | 2 507 | 5-column status board. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-kanban/falcon-org-kanban.component.html` | 1 474 | Kanban grid template. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-kanban/index.ts` | 222 | Barrel. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-kanban/falcon-org-user-card/falcon-org-user-card.component.ts` | 1 261 | User card model + initials computed. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-kanban/falcon-org-user-card/falcon-org-user-card.component.html` | 2 311 | Avatar + name + email/phone + role pill. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-kanban/falcon-org-user-card/index.ts` | 213 | Barrel. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.ts` | 2 196 | Single-input drawer (Add Node / Edit Node). ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 2 829 | Drawer header/body/footer using `<falcon-angular-drawer>`. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-node-drawer/index.ts` | 244 | Barrel. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-node-header/falcon-org-node-header.component.ts` | 1 546 | Identity + action buttons row. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-node-header/falcon-org-node-header.component.html` | 5 670 | Avatar/T2-mark + dynamic-action buttons template. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-node-header/index.ts` | 222 | Barrel. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-view-toggle/falcon-org-view-toggle.component.ts` | 1 079 | Generic 2-option pill toggle. ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-view-toggle/falcon-org-view-toggle.component.html` | 2 002 | Toggle template w/ inline SVG icons (`list-bullets` / `org-chart`). ⚓ |
| `components/tab-components/hierarchy-tab/falcon-org-view-toggle/index.ts` | 224 | Barrel. ⚓ |
| `components/wizard-components/add-client-wizard/add-client-wizard.component.ts` | 4 717 | 5-step Add-Client wizard shell. ⚓ |
| `components/wizard-components/add-client-wizard/add-client-wizard.component.html` | 5 140 | Topbar + `<falcon-stepper>` rail + step slots. ⚓ |
| `components/wizard-components/add-client-wizard/index.ts` | 122 | Barrel. ⚓ |
| `components/wizard-components/add-client-wizard/models/models.ts` | 9 783 | Wizard local types + wire DTOs + option lists + mappers. ⚓ |
| `components/wizard-components/add-client-wizard/services/services.ts` | 1 789 | `AddClientApiService` — owns POST `/commerce/Node/create-account`. ⚓ |
| `components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.ts` | 6 576 | Step 1 — info + address. ⚓ |
| `components/wizard-components/add-client-wizard/client-information-step/client-information-step.component.html` | 8 244 | 18-field form template. ⚓ |
| `components/wizard-components/add-client-wizard/client-information-step/index.ts` | 140 | Barrel. ⚓ |
| `components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.ts` | 5 526 | Step 2 — password policy + IP allowlist + limits. ⚓ (also reused by Settings tab) |
| `components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | 9 751 | Radio + chip-list + numeric inputs template. ⚓ |
| `components/wizard-components/add-client-wizard/client-settings-step/index.ts` | 131 | Barrel. ⚓ |
| `components/wizard-components/add-client-wizard/client-comm-channels-step/client-comm-channels-step.component.ts` | 1 327 | Step 3 — wraps service-row-table. ⚓ |
| `components/wizard-components/add-client-wizard/client-comm-channels-step/client-comm-channels-step.component.html` | 121 | Wrapper template. ⚓ |
| `components/wizard-components/add-client-wizard/client-comm-channels-step/index.ts` | 145 | Barrel. ⚓ |
| `components/wizard-components/add-client-wizard/client-applications-step/client-applications-step.component.ts` | 1 316 | Step 4 — wraps service-row-table. ⚓ |
| `components/wizard-components/add-client-wizard/client-applications-step/client-applications-step.component.html` | 121 | Wrapper template. ⚓ |
| `components/wizard-components/add-client-wizard/client-applications-step/index.ts` | 143 | Barrel. ⚓ |
| `components/wizard-components/add-client-wizard/client-account-owner-step/client-account-owner-step.component.ts` | 5 129 | Step 5 — owner identity + credentials. ⚓ |
| `components/wizard-components/add-client-wizard/client-account-owner-step/client-account-owner-step.component.html` | 4 505 | Owner form template. ⚓ |
| `components/wizard-components/add-client-wizard/client-account-owner-step/index.ts` | 145 | Barrel. ⚓ |
| `components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.ts` | 2 646 | Shared visible/priceType/priceValue rows for Step 3 + Step 4. ⚓ |
| `components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 4 074 | Toggle + dropdown + number-input rows. ⚓ |
| `components/wizard-components/add-client-wizard/client-service-row-table/index.ts` | 142 | Barrel. ⚓ |
| `components/wizard-components/add-user-wizard/add-user-wizard.component.ts` | 4 998 | 3-step Add-User wizard shell + credentials modal. ⚓ |
| `components/wizard-components/add-user-wizard/add-user-wizard.component.html` | 4 848 | Topbar + `<falcon-stepper>` + `<falcon-send-credentials-popup>`. ⚓ |
| `components/wizard-components/add-user-wizard/index.ts` | 116 | Barrel. ⚓ |
| `components/wizard-components/add-user-wizard/models/models.ts` | 5 594 | Wizard local types + Identity wire DTOs + dropdown option lists. ⚓ |
| `components/wizard-components/add-user-wizard/services/services.ts` | 5 366 | `AddUserApiService` — owns POST `/user`, PUT `/user/{id}/profile`, etc. ⚓ |
| `components/wizard-components/add-user-wizard/user-personal-step/user-personal-step.component.ts` | 4 304 | Step 1 — name/user/pwd/phone/email. ⚓ |
| `components/wizard-components/add-user-wizard/user-personal-step/user-personal-step.component.html` | 4 403 | Personal-info form template. ⚓ |
| `components/wizard-components/add-user-wizard/user-personal-step/index.ts` | 125 | Barrel. ⚓ |
| `components/wizard-components/add-user-wizard/user-role-status-step/user-role-status-step.component.ts` | 2 185 | Step 2 — status (disabled) + role. ⚓ |
| `components/wizard-components/add-user-wizard/user-role-status-step/user-role-status-step.component.html` | 893 | 2-dropdown grid template. ⚓ |
| `components/wizard-components/add-user-wizard/user-role-status-step/index.ts` | 133 | Barrel. ⚓ |
| `components/wizard-components/add-user-wizard/user-permissions-step/user-permissions-step.component.ts` | 2 109 | Step 3 — perm-group + per-channel checker level. ⚓ |
| `components/wizard-components/add-user-wizard/user-permissions-step/user-permissions-step.component.html` | 1 780 | Dropdown + radio-rows template. ⚓ |
| `components/wizard-components/add-user-wizard/user-permissions-step/index.ts` | 134 | Barrel. ⚓ |

**Confirmed totals:** 91 files, **0 `.scss` files**, **0 component CSS files**, **0 inline-styles strings other than runtime layout coords on the chart (15 `style.transform`/`style.left.px` etc.)** — every other style is Tailwind utility classes.

---

## 2. Routes — `organization-hierarchy-page.routes.ts`

| Property | Value |
|---|---|
| File | `organization-hierarchy-page.routes.ts` |
| Export | `organizationHierarchyPageRoutes: Routes` + `default` export |
| Path | `''` (mounted under whichever parent registers it) |
| `loadComponent` | `OrganizationHierarchyPageMenuComponent` lazy import |
| `data.breadcrumb` | `'Organization Hierarchy'` |
| Guards | **None at this level** — guards live in `guards/guards.ts` and are intended for nested deep-link routes (currently unwired in this single-route layout). |
| Resolvers | **None at this level** — `treeResolver`/`nodeResolver`/`usersResolver`/`userResolver` are exported for future nested routes. |

The parent `apps/management-console/src/app/app.routes.ts` registers:
```ts
{
  path: 'organization-hierarchy-page',
  loadChildren: () => import('./features/organization-hierarchy-page/organization-hierarchy-page.routes')
                       .then((m) => m.organizationHierarchyPageRoutes),
  data: { breadcrumb: 'Organization Hierarchy' },
}
```

⚓ The new admin-console feature mirrors this lazy-child registration pattern.

---

## 3. Top-level menu — `OrganizationHierarchyPageMenuComponent`

| Aspect | Value |
|---|---|
| Selector | `app-organization-hierarchy-page-menu` |
| Standalone | yes (omitted — Angular 21 default) |
| Change detection | `OnPush` |
| Host | `class: 'block h-full'` |
| Providers | `[HierarchyPageStateService]` — **page-scoped**, never `providedIn: 'root'`. ⚓ |
| Inputs | none |
| Outputs | none |
| State source | injected `HierarchyPageStateService` exposed as `protected readonly state` |
| Tabs hidden when | root selected → only `hierarchy` + `settings` tabs (see `visibleTabs` computed in state service) |
| Buttons swap when | `selectedNode.type === 'root'` → shows `addClient` + `addUser`; else → `addNode`/`editNode`/`addUser`. The `editNode` button label switches to "Edit Info" when the info panel is open. |

**Imports (16 dependencies):**
```
AddClientWizardComponent, AddUserWizardComponent, AppsServicesTabComponent,
CommChannelsTabComponent, FalconAngularDataTableComponent, FalconAngularInputComponent,
FalconAngularTabsComponent, FalconDataTableCellDirective, FalconOrgChartComponent,
FalconOrgInfoPanelComponent, FalconOrgKanbanComponent, FalconOrgNodeDrawerComponent,
FalconOrgNodeHeaderComponent, FalconOrgViewToggleComponent, FalconTreePanelComponent,
FormsModule, OrgHierarchySkeletonComponent, SettingsTabComponent, TranslatePipe
```

**Local constants:** `ROOT_ACTIONS` (addClient/addUser) and `NODE_ACTIONS` (addNode/editNode/addUser) — wired through `<falcon-tree-panel>` `(action)` event.

**Skeleton logic:** template renders `<falcon-org-hierarchy-skeleton>` when either:
- query-param `?skeleton=1` is present (preview override), OR
- `state.treeRoot() === null` (still loading).

⚓ This shell pattern is the single replicable entry point for the admin-console copy.

---

## 4. Models — `models/models.ts`

Confirms the **"ONE consolidated models file per context" rule** stated in shared memory `feedback_folder_structure_pattern.md`. The file declares:

**Type aliases**
- `NodeType = 'root' | 'client' | 'sub-node'`
- `ClientBrand = 'alrajhi' | 'snb' | 'bupa' | 'aramco' | (string & {…})`
- `UserStatus = 'active' | 'pending' | 'suspended' | 'locked' | 'deleted'`
- `NodeContextAction = 'addClient' | 'addNode' | 'editNode' | 'addUser'`
- `UserRoleKey = 'sys-admin' | 'sys-products' | 'sys-ops' | 'acc-owner' | 'acc-admin' | 'acc-user'`

**Interfaces**
- `ClientNode` (with optional `accountSettings`, `hasChildren`, `imageUrl`, `children`)
- `User`
- `AccountSettings`
- `NewClientPayload`, `NewUserPayload`, `NewSubNodePayload`, `ChangeNodeNamePayload`
- Commerce wire DTOs: `CreateSubNodeWireRequest`, `CreateSubNodeWireResult`, `ChangeNodeNameWireRequest`, `GetNodeResponse`, `CreateAccountRequest`, `CreateUserRequest`, `CreateSubNodeRequest`, `ChangeNodeNameRequest`
- Envelopes: `ServiceOperationResult<T>` (local), `BackendSOR<X>` (wire)
- Identity wire: `UserInfoWire`, `PagedListWire<T>`, `UsersPage`

**Const enums (Identity numeric parity)**
- `eUserRoles` `{1..6}` — mirror Identity Domain
- `ePasswordSecurityLevel` `{Normal=1, Advanced=2}`
- `eDeliveryMethod` `{Email=1, Sms=2, Both=3}`
- `eUserType` `{Falcon=1, Client=2}`

**Const sets / maps**
- `ROLE_KEY_BY_ENUM`, `VALID_ROLE_KEYS`, `ADMIN_ROLE_KEYS`, `USER_STATUS_BY_NUM`

**Helper functions (side-effect-free)**
- `toNodeImageSrc()`
- `buildCreateAccountRequest()`, `buildCreateUserRequest()`, `buildCreateSubNodeRequest()`, `buildChangeNodeNameRequest()`
- `validateValue()`, `failure()`, `extractServerError()`, `httpFailure()`, `mapBackendEnvelope()`
- Pure tree mutators: `insertChild()`, `renameNode()`, `mergeChildrenIntoTree()`
- Mappers: `mapUserWireToUser()`, `mapGetNodeResponseToClientNode()`

⚓ This file is the most important reference asset — the admin-console copy can largely reuse this verbatim because the domain shape is identical.

---

## 5. Services

### 5.1 `HierarchyService` — `services/services.ts`

| Aspect | Value |
|---|---|
| Decorator | `@Injectable({ providedIn: 'root' })` ⚓ |
| Injected deps | `HttpService`, `AccountValidationService` (both from `@falcon`) |
| Private state | `treeSignal = signal<ClientNode>(MOCK_TREE)` |
| `currentTree()` | sync snapshot of the signal |
| `getTree()` | GET `commerce/Node` via SystemGateway → maps to nested `ClientNode` tree, sets the signal, falls back to mock on failure |
| `loadNodeChildren(nodeId)` | GET `commerce/Node?NodeId=…` (omits param for root) → merges children into the existing tree (lazy expansion) |
| `getUsers(nodeId, page, size)` | GET `user` via IdentityGateway with `Role` repeated query params. **Visual-test bypass:** when `?visual-test=1` or `sessionStorage.falcon-visual-test=='1'`, returns `generateMockUsers(nodeId)`. |
| `createSubNode(payload)` | sync-validates with `parentMustExist` + `hierarchyDepthGuard` + `nodeNameValidator` → POST `commerce/Node/create-SubNode` |
| `changeNodeName(payload)` | sync-validates + PUT `commerce/Node/ChangeNodeName` |
| `addNode(parentId, name)` | local-only optimistic mutator (in-memory tree) |
| `editNode(nodeId, name)` | local-only optimistic mutator |
| `validateAccountName(name)` | proxies to `AccountValidationService.checkAccountNameExists` |

### 5.2 `HierarchyPageStateService` — `services/hierarchy-page-state.service.ts`

| Aspect | Value |
|---|---|
| Decorator | `@Injectable()` — **not root**, page-scoped via menu component `providers: [...]`. ⚓ |
| Injected deps | `HierarchyService`, `AddClientApiService`, `AddUserApiService`, `TranslateService`, `DestroyRef`, optional `FalconNotifierFacade` |
| **Drawer state signals** | `addClientOpen`, `addUserOpen`, `addUserNodeId`, `nodeDrawer`, `nodeDrawerBusy` |
| **Tab state** | `clientTabs`, `activeClientTab`, `visibleTabs` (computed by `isRootSelected`) |
| **View toggles** | `structureView` ('tree' / 'chart'), `usersView` ('list' / 'board'), `structureOptions`, `usersOptions` |
| **Tree state** | `tree` (private), `treeRoot` (computed), `expandedNodeIds`, `treeNodes` (PrimeNG-shaped), `selectedTreeNode`, `chartNodes` |
| **Selection computeds** | `selectedNode`, `selectedNodeId`, `isRootSelected`, `effectiveNodeId`, `infoDossier`, `canAddClient`, `showOrgChart` |
| **Info panel** | `infoOpen` signal + `openInfo()`/`closeInfo()`/`toggleInfo()` |
| **Users** | `users`, `selectedUsers`, `usersPageNumber/Size/TotalCount`, `searchQuery`, `filterOpen`, `userColumns`, `userRowMenuItems` |
| **Menus** | `rootMenuItems`, `treeMenuItems`, `treeMenuTargetId`, `nodeMenuItemsForFn` |
| **Effects** | (1) keep chart selection sync'd with tree selection · (2) close info panel on selection change · (3) reset to hierarchy tab if active tab becomes hidden · (4) reset page to 1 on node change |
| **Sub** | RxJS `combineLatest([effectiveNodeId, usersPageNumber, usersPageSize]) → switchMap(hierarchy.getUsers)` with `takeUntilDestroyed()` |
| **Actions** | `onHeaderAddClient/Node/Edit/User`, `onNodeDrawerSave`, `onAddClientSubmit`, `onAddUserSubmit`, `onTreeToggle`, `onTreeSelect`, `onTreeContextAction`, `onUsersLazyLoad`, `onBulkSuspend/Activate`, `onKanbanAction`, `onChartSelect/Change`, `saveSettings`, `getSettingsForNode`, `fromAccountSettings` |
| **Helpers** | local `BRAND` color map, `ACTION_KEY` i18n map, `initialsFor()`, `parentNameOf()` |
| **Internal pure fns** | `toPrimeNode`, `findPrimeNode`, `toChartNode`, `findChartNode`, `findClientNode`, `findParentOf`, `computeInitialState` |

⚓ This is the **brain of the page** and the single biggest porting target.

### 5.3 Mock data

- `mock-tree.ts` — exports `MOCK_TREE` (4 clients: aramco/alrajhi/snb/bupa, aramco has a 10-level deep chain), `DEFAULT_ACCOUNT_SETTINGS`, helpers `findNode`, `collectAccountNames`, `findAccountAncestor`, `pathToNode`, `depthOf`, `generateMockUsers` (7 deterministic Saudi names), and `RESERVED_USERNAMES`.
- `mock-applications.ts` — `ApplicationRow` type + `APPS_DEFAULT` (8 rows) + `CHANNELS_DEFAULT` (9 rows) + per-node variants keyed by `aramco/bmw/snb/rajhi/bupa`.

### 5.4 Validators (`validators.ts`)

20+ pure `ValidatorFn`/`AsyncValidatorFn` exports — `lettersAndDigits`, `lettersDigitsOrEmail`, `nationalIdValidator` (10-digit), `anyStringValidator(min,max,required)`, `accountNameValidator`, `accountNameUniqueValidator(treeProvider, exceptId?)`, `nodeNameValidator`, `personNameValidator`, `userNameValidator`, `userNameUniqueValidator(existingUsernames?)`, `emailValidator`, `phoneValidator` (E.164), `saudiPhoneValidator`, `passwordValidator(level)`, `roleAssignmentValidator(callerRole?)`, `permissionGroupValidator`, `maxNodeLevelsValidator(hardCap)`, `userLimitValidator`, `allowedIpListValidator`, `hierarchyDepthGuard(treeProvider, parentIdField?)`, `passwordsMatch(newField, confirmField)`, `parentMustExist`, `cannotMoveUnderSelf`, `runValidators`.

### 5.5 Validation messages (`validation-messages.ts`)

Maps validator error keys (e.g. `lettersAndDigits`) to i18n keys under `hierarchy.validation.*`. Also publishes:
- `ValidationMessage` interface
- `hasLiveError()` set (drives "show error after typing vs. only after blur")
- `messageFor()`, `messagesFor()`
- `BACKEND_ERROR_KEY` map (Identity/Commerce error codes → i18n keys)
- `ServiceErrorEnvelope` + `toServiceErrors()` + `keyForBackendCode()`

---

## 6. Tab components

| Tab | Component | Inputs | Subcomponents used | Data source |
|---|---|---|---|---|
| `applications-table` (shared) | `ApplicationsTableComponent` | `rows: input.required<ApplicationRow[]>()`, `titleKey: input<string>` | `FalconCalendarComponent`, `TranslatePipe`, `FormsModule` | rows passed in; internal `apps` signal cloned via effect |
| `apps-services-tab` | `AppsServicesTabComponent` | `nodeId: input<string \| null>(null)` | `ApplicationsTableComponent` | `getMockApps(nodeId)` |
| `comm-channels-tab` | `CommChannelsTabComponent` | `nodeId: input<string \| null>(null)` | `ApplicationsTableComponent` | `getMockChannels(nodeId)` |
| `settings-tab` | `SettingsTabComponent` | `nodeId: input<string \| null>(null)` | `FalconAngularButtonComponent`, `ClientSettingsStepComponent`, `TranslatePipe` | injects `HierarchyPageStateService.getSettingsForNode/saveSettings` + view/edit mode signal |
| `hierarchy-tab` | — *(NOT a single component; it is the default tab body composed inline in the menu template — tree-view + chart-view + users list + kanban + info-panel + node-header + node-drawer)* | — | All `FalconOrg…` subcomponents below | `HierarchyPageStateService` |

`ApplicationsTableComponent` internals: `editingId`, `menuFor`, `editForm` (priceType/effDate/priceValue) signals; methods `toggleVisibility`, `toggleMenu`, `openEdit`, `cancelEdit`, `applyEdit`, `deleteRow`, `wrapTwo` (2-word-per-line header), `parseEffDate`, `formatEffDate`. Effect resets local apps state when `rows()` changes.

`SettingsTabComponent`: `mode = signal<'view'|'edit'>`, `formValue`, `formValid`, `formDirty` signals. Effect re-hydrates form whenever `nodeId()` changes; resets to `'view'` mode after save.

---

## 7. Hierarchy-tab inner components

### 7.1 `<falcon-org-chart>` (`falcon-org-chart/`)

| Sub | File | Inputs | Outputs | Notes |
|---|---|---|---|---|
| `FalconOrgChartComponent<T extends ChartOrgNode<T>>` | `falcon-org-chart/falcon-org-chart.component.{ts,html}` | `root: input<T \| null>(null)`, `selectedId: input<string \| null>(null)` | `cardSelect: output<T>()`, `cardAction: output<{nodeId; action}>()` | Owns `zoom`/`pan`/`focusedId` signals. Layout via `ChartLayoutService.layout()`. Focus mode = teleport-zoom on click; ESC/exitFocus restores prevView. Uses `<falcon-chart-card>` + `<falcon-chart-toolbar>` + `[falconPanZoom]` directive. |
| `FalconChartCardComponent<T extends ChartCardData>` | `falcon-chart-card/*.{ts,html}` | `card: input.required<ChartCard<T>>()`, `isFocused/isSelected/isDimmed: input<boolean>` | `select: output<void>()` | 3-template card (root teal bg, client w/ initials, sub-node w/ mint avatar). Absolutely positioned by `[style.left.px]`/`[style.top.px]`. |
| `FalconChartToolbarComponent` | `falcon-chart-toolbar/*.{ts,html}` | `zoom, minZoom, maxZoom` | `zoomIn, zoomOut, fit, reset` | Disabled buttons via `canZoomIn`/`canZoomOut` computeds. |
| `FalconPanZoomDirective` | `directives/directives.ts` | `zoom: model<number>(1)`, `pan: model<ChartPan>`, `minZoom`, `maxZoom`, `disabled` | none | Listens to wheel (zoom-at-cursor) + mousedown/move/up (drag-pan). Adds `.panning` class on drag. |
| `ChartLayoutService` | `services/chart-layout.service.ts` | — | — | Left-to-right tidy tree layout; defaults: cardW=180, cardH=56, hGap=60, vGap=14, pad=24. Returns `{cards, lines, width, height}`. |
| Models | `models/models.ts` | — | — | `ChartTreeNode<T>`, `ChartCard<T>`, `ChartLine`, `ChartPan`, `ChartLayoutResult/Options`. |

### 7.2 `<falcon-org-info-panel>` (`falcon-org-info-panel/`)

- Component: `FalconOrgInfoPanelComponent`
- Inputs: `dossier: input.required<NodeDossier|null>`, `loading: input<boolean>`, `nodeName: input<string>`, `editable: input<boolean>`
- Output: `back: output<void>()`
- Sections (4 fixed): `identity` (4 fields), `business` (4 fields), `address` (7 fields), `identifiers` (2 fields) — **17 total fields**
- Renders skeleton boxes when `loading()`; reads each field via `valueOf(key)` → `dossier()[key] ?? '—'`
- Renders `<falcon-angular-input>` when `editable()` else static text (read-only by default)

### 7.3 `<falcon-org-kanban>` + `<falcon-org-user-card>` (`falcon-org-kanban/`)

- `FalconOrgKanbanComponent`: 5-column board, columns = `['active','pending','suspended','locked','deleted']`. Input `users: input<readonly FalconOrgKanbanUser[]>`. Output `userAction: output<{userId; action}>()`. Per-status pill + dot colors. Empty cell renders "—".
- `FalconOrgUserCardComponent`: avatar (initials), name + `@username`, email/phone icon rows, role/perm pills. Output `action: output<string>()` (currently emits `'menu'`).

### 7.4 `<falcon-org-node-drawer>` (`falcon-org-node-drawer/`)

- Mode-aware: `'add'` | `'edit'`. Inputs: `mode`, `visible: model.required<boolean>`, `initialName`, `parentName`, `busy`. Outputs: `save: output<string>()`, `cancel: output<void>()`.
- Local validation: required, min 2, max 120, no edge whitespace.
- Wraps `<falcon-angular-drawer position="right" size="md">`. Uses HTML truth bottom-underline input (no border).

### 7.5 `<falcon-org-node-header>` (`falcon-org-node-header/`)

- Inputs: `nodeName: input.required<string>`, `nodeType` (root/client/sub-node), `imageUrl`, plus 6 boolean `can…` toggles + `infoOpen`.
- Outputs: 5 (`addClient`, `addNode`, `editNode`, `addUser`, `toggleInfo`).
- Avatar: `<img>` when `imageUrl()`, else T2 SVG mark for root, else initials disc. "Edit Node" button morphs into "Edit Info" when `infoOpen()`.

### 7.6 `<falcon-org-view-toggle>` (`falcon-org-view-toggle/`)

- Generic 2-option pill toggle: `options: input.required<readonly FalconOrgViewToggleOption<TKey>[]>`, `value: model.required<TKey>`.
- Renders inline SVG icons for `iconSvg: 'list-bullets' | 'org-chart'` or a `falcon-icon falcon-icon-{name}` for `icon`.

---

## 8. Wizard components

### 8.1 Add-Client wizard (`wizard-components/add-client-wizard/`)

| Aspect | Value |
|---|---|
| Component | `AddClientWizardComponent` |
| Outputs | `cancel: output<void>()`, `submit: output<NewClientWizardPayload>()` |
| Total steps | 5 |
| Steps | 1) `client-information-step` · 2) `client-settings-step` · 3) `client-comm-channels-step` · 4) `client-applications-step` · 5) `client-account-owner-step` |
| Shared sub | `client-service-row-table` reused by Step 3 + Step 4 |
| Chrome | Topbar with Falcon mark + Cancel/Back/Next/Create buttons. Step counter chip. |
| Stepper | `<falcon-stepper [(currentStep)] [valid] [linear]="true">` with `<falcon-step [label]>` per step, each step using `<ng-template>` for the panel body. Footer template `<ng-template falconStepperFooter>` suppresses default footer (custom buttons live in the topbar). |
| Exit confirm | `<falcon-angular-popup variant="unsaved">` shown when any step dirty + user cancels |
| Per-step model contract | Every step has `value: model.required<T>`, `valid: model<boolean>`, `dirty: model<boolean>` — wizard reads `valid`/`dirty` for navigation gating; reads `value` at submit time |
| Wizard models | `ClientInfoFormValue` (Step 1 — 18 fields), `ClientSettingsFormValue` (Step 2), `ClientCommChannelsFormValue` + `ClientApplicationsFormValue` (3+4), `ClientAccountOwnerFormValue` (Step 5), plus `NewClientWizardPayload` union |
| API service | `AddClientApiService` (`providedIn:'root'`) — `createClientFull(wire)` POSTs `commerce/Node/create-account` via SystemGateway |
| Validation source | step components use the **page-level** `services/validators.ts` (not duplicated). Step 1 also calls `state.treeRoot()` to dedupe account name. |
| Wire mapper | `buildCreateAccountWireRequest(info, settings, channels, apps, owner)` lives in the wizard's `models/models.ts` |

Step-to-step communication is via signals (no event bus, no shared state singleton). The wizard owns 5 step signals; each child step has a 2-way `model()` for value/valid/dirty.

Step files breakdown (each step has `*.component.ts` + `*.component.html` + `index.ts` barrel):
- `client-information-step` — 18 fields (account name, finance id, classCat/classSub, entity name, authority, sector, budget no, country, city, district, street, bldg, postal, addressExtra, anotherId, vat) + `<falcon-photo-uploader>`. Uses `FalconAngularDropdownComponent`, `FalconAngularInputComponent`, `FalconFormFieldComponent`. Per-field `touched` Set drives "show after blur" UX.
- `client-settings-step` — radio (Normal/Advanced password) + IP allowlist chips (with `[falconIpAddress]` directive + `isValidIp` helper) + 3 numeric inputs (maxNormal, maxSystem, maxNode). Has `readonly: input<boolean>` so it doubles as the Settings tab editor. `@HostBinding('attr.data-readonly')` mirrors the flag.
- `client-comm-channels-step` / `client-applications-step` — both delegate to `<app-client-service-row-table>` and re-emit row changes.
- `client-service-row-table` — toggle visibility, FalconAngularDropdown for priceType, number input for priceValue, status pill ("Inactive"/"------").
- `client-account-owner-step` — first/last/userName/password (read-only displayed)/nationalId/phone (`<falcon-mobile-number>`)/email/role (disabled dropdown). Includes async username-unique check via debounced `userNameUniqueValidator(()=>[])`.

### 8.2 Add-User wizard (`wizard-components/add-user-wizard/`)

| Aspect | Value |
|---|---|
| Component | `AddUserWizardComponent` |
| Inputs | `nodeId: input.required<string>()` |
| Outputs | `cancel: output<void>()`, `submit: output<NewUserPayload>()` |
| Total steps | 3 |
| Steps | 1) `user-personal-step` · 2) `user-role-status-step` · 3) `user-permissions-step` |
| Chrome | Topbar (same shape as Add-Client) + Cancel/Back/Next/Finish |
| Credentials modal | `<falcon-send-credentials-popup>` shown after last step's `onFinish()`; emits `submit: DeliveryMethod` which is coerced to `eDeliveryMethod` before building the payload |
| Exit confirm | identical pattern to Add-Client |
| Wizard models | `UserPersonalFormValue`, `UserRoleStatusFormValue`, `UserPermissionsFormValue` + `NewUserWizardPayload` + Identity wire DTOs (`CreateUserWireRequest/Result`, `UpdateUserProfileWireRequest`, `UpdateUserRoleWireRequest`, `UpdateUserOutcome`) + `GeneratePasswordWire*` |
| API service | `AddUserApiService` (`providedIn:'root'`) — `createUser(payload, securityLevel?, tenantId?, path?)`, `updateUser(id, profile, roleKey)`, `checkUsernameExists(username, email?, phone?)`, `generatePassword(level)` |
| Step contracts | identical `value/valid/dirty` model() pattern as Add-Client |

Step files:
- `user-personal-step` — name/userName/password (`<falcon-angular-password>`)/nationalId/phone (`<falcon-mobile-number>`)/email + `<falcon-photo-uploader>`.
- `user-role-status-step` — 2 dropdowns (status disabled, role required).
- `user-permissions-step` — 1 dropdown (perm group) + 2 channel rows each with 3 radio options (none/level1/level2) via `<falcon-angular-radio>`.

---

## 9. Conventions detected (uniform across the feature)

| Convention | Enforced everywhere? | Notes |
|---|---|---|
| Standalone components (no NgModule) | ✅ all 38 components | Some omit explicit `standalone: true` (Angular 21 default) |
| `changeDetection: ChangeDetectionStrategy.OnPush` | ✅ all components | |
| Signal-based state (`signal`, `computed`, `effect`) | ✅ ubiquitous | `model.required<T>` / `input.required<T>` / `output<T>` |
| `inject()` over constructor injection | ✅ everywhere | No legacy `constructor(private …)` pattern found |
| Angular control flow `@if`/`@for`/`@switch`/`@let` | ✅ everywhere | Zero `*ngIf`/`*ngFor`/`*ngSwitch` |
| Tailwind utilities for styling | ✅ everywhere | Tokens used throughout (`bg-falcon-teal-700`, `text-falcon-neutral-900`, etc.) |
| No SCSS / no component CSS | ✅ enforced | `0` `.scss` files, `0` `styleUrls`, `0` `styles:` arrays |
| Inline-template only for the skeleton | 1 component (`OrgHierarchySkeletonComponent`) uses `template:` because it is a pure visual stub |
| File naming: `kebab-case.component.{ts,html}` | ✅ everywhere | Skeleton is the lone exception (`org-hierarchy-skeleton.component.ts` — still kebab-case, just stripped of the "falcon" prefix) |
| Folder pattern `models/models.ts` · `services/services.ts` · `guards/guards.ts` · `resolvers/resolvers.ts` · `directives/directives.ts` | ✅ enforced | Single file per type-folder. Matches `feedback_folder_structure_pattern.md`. |
| Per-component `index.ts` barrel | ✅ enforced | Every component folder has an `index.ts` re-exporting the component + types |
| `takeUntilDestroyed()` for subscription cleanup | ✅ everywhere | Always uses `inject(DestroyRef)` or zero-arg form |
| `host: { class: '…' }` in component decorator (no `:host` SCSS) | ✅ multiple components | `block h-full` / `flex flex-col` / etc. |
| Comment style `/*** … ***/` terse banners | ✅ everywhere | Matches `feedback_comment_style.md` |

---

## 10. Falcon imports used (distinct list, frequency-ranked)

**Import paths used (4):**

| Path | Count |
|---|---:|
| `from '@falcon'` | 26 |
| `from '@falcon/ui-core/angular'` | 5 |
| `from '@falcon/sdk'` | 5 |
| `from '@falcon/ui-core/angular/falcon-input'` | 1 |

**Distinct Falcon symbols imported (frequency-ranked from `*.ts` files, top 50):**

| Symbol | Source | Usages |
|---|---|---:|
| `TranslatePipe` | `@falcon` | 38 |
| `Gateway` | `@falcon` | 24 |
| `DeliveryMethod` | `@falcon` | 15 |
| `useGateway` | `@falcon` | 13 |
| `TranslateService` | `@falcon` | 13 |
| `FalconFormFieldComponent` | `@falcon` | 10 |
| `FalconAngularInputComponent` | `@falcon` | 10 |
| `FalconAngularDropdownComponent` | `@falcon` | 10 |
| `FalconNotifierFacade` | `@falcon/sdk` | 9 |
| `FALCON_NOTIFIER` | `@falcon/sdk` | 9 |
| `FALCON_ROOT_NODE` | `@falcon` | 7 |
| `HttpService` | `@falcon` | 6 |
| `FalconPhotoUploaderComponent` | `@falcon` | 6 |
| `FalconStepperFooterDirective` | `@falcon` | 4 |
| `FalconStepperComponent` | `@falcon` | 4 |
| `FalconStepDirective` | `@falcon` | 4 |
| `FalconMobileNumberComponent` | `@falcon` | 4 |
| `FalconAngularPopupComponent` | `@falcon/ui-core/angular` | 4 |
| `FalconAngularButtonComponent` | `@falcon` | 4 |
| `AccountValidationService` | `@falcon` | 4 |
| `isValidIp` | `@falcon` | 3 |
| `FalconTreeAction` | `@falcon` | 3 |
| `SYSTEM_USER_ROLES` / `ACCOUNT_USER_ROLES` | `@falcon` | 2 each |
| `FalconTreePanelComponent` | `@falcon` | 2 |
| `FalconTreePanelActionEvent` | `@falcon` | 2 |
| `FalconTreeContextAction` | `@falcon` | 2 |
| `FalconTabOption` | `@falcon` | 2 |
| `FalconSendCredentialsPopupComponent` | `@falcon` | 2 |
| `FalconIpAddressDirective` | `@falcon` | 2 |
| `FalconAngularPasswordComponent` | `@falcon` | 1 |
| `FalconAngularRadioComponent` | `@falcon` | 1 |
| `FalconAngularDrawerComponent` | `@falcon/ui-core/angular` | 1 |
| `FalconAngularDataTableComponent` | `@falcon/ui-core/angular` | 1 |
| `FalconAngularTabsComponent` | `@falcon/ui-core/angular` | 1 |
| `FalconDataTableCellDirective` | `@falcon/ui-core/angular` | 1 |
| `FalconCalendarComponent` | `@falcon` | 1 |
| `NodeDossier` | `@falcon/sdk` | 3 |
| `FalconLegacyTreeNode<T>` | `@falcon/ui-core/angular` | 1 |
| `ColumnDef`, `FalconDataTableMenuItem`, `FalconDataTableRowAction<T>` | `@falcon/ui-core/angular` | 1 each |

**Distinct `<falcon-*>` selectors used in HTML (27):**
`<falcon-angular-button>`, `<falcon-angular-data-table>`, `<falcon-angular-drawer>`, `<falcon-angular-dropdown>`, `<falcon-angular-input>`, `<falcon-angular-password>`, `<falcon-angular-popup>`, `<falcon-angular-radio>`, `<falcon-angular-tabs>`, `<falcon-calendar>`, `<falcon-chart-card>`, `<falcon-chart-toolbar>`, `<falcon-form-field>`, `<falcon-mobile-number>`, `<falcon-org-chart>`, `<falcon-org-hierarchy-skeleton>`, `<falcon-org-info-panel>`, `<falcon-org-kanban>`, `<falcon-org-node-drawer>`, `<falcon-org-node-header>`, `<falcon-org-user-card>`, `<falcon-org-view-toggle>`, `<falcon-photo-uploader>`, `<falcon-send-credentials-popup>`, `<falcon-step>`, `<falcon-stepper>`, `<falcon-tree-panel>`.

---

## 11. i18n keys used (231 distinct)

All keys live under three namespaces. The `hierarchy.*` namespace is fully present in both `libs/falcon/src/language/i18n/en.json` and `libs/falcon/src/language/i18n/ar.json` (4 hits each — i.e. nested objects already defined). The `hierarchyTab.*` namespace exists at en.json line 426.

**Namespace summary**

| Namespace prefix | Count | Examples |
|---|---:|---|
| `hierarchy.actions.*` | 9 | `.addClient`, `.addNode`, `.addUser`, `.backToUsers`, `.editInfo`, `.editNode`, `.filter`, `.information`, `.search` |
| `hierarchy.addClient.*` | ~65 | `.title`, `.stepCounter`, `.actions.create`, `.steps.{info,settings,channels,apps,owner}`, `.fields.{accountName,financeId,…}.label/.placeholder/.helper`, `.fields.security.{normalDesc,advancedDesc}`, `.exitConfirm.{title,body,stay,discard}`, `.accountLimitations`, `.allowedIps`, `.ipAddressBtn`, `.ipPlaceholder`, `.ipsVersionHint`, `.statusInactive`, `.clientPicture`, `.ownerPicture`, `.photoHint`, `.dragHint`, `.uploadPhoto`, `.service.{visibility,name,priceType,priceValue,status}`, `.passwordSecurity`, `.security.{normal,advanced}`, `.success`, `.error` |
| `hierarchy.addUser.*` | ~40 | `.title`, `.stepCounter`, `.finish`, `.steps.{personal,role,permissions}`, `.fields.{firstName,lastName,userName,password,nationalId,phone,email}.label/.placeholder`, `.status.{active,inactive,suspended,pending}`, `.role.{systemAdmin,products,operation}`, `.permGroup.{admin,readonly,ops,support}`, `.permGroupPlaceholder`, `.checker.{none,level1,level2}`, `.channel.{whatsapp,voice}`, `.assignedPermissionGroup`, `.commCheckerLevel`, `.userStatus`, `.userRole`, `.userPicture`, `.creds.accountOwner`, `.exitConfirm.{title,body,stay,discard}`, `.success`, `.error` |
| `hierarchy.applications.*` | ~21 | `.title`, `.col.{visibility,name,priceType,priceValue,firstActivation,activationDate,renewDate,status,action}`, `.status.{active,expired,disable,inactive}`, `.priceType.{oneTime,monthly,quarterly,yearly}`, `.actions.{edit,delete,cancel}`, `.edit.{newPriceType,effectiveDate,newPriceValue,set}`, `.next`, `.of` |
| `hierarchy.chart.*` | 13 | `.legendRoot`, `.legendClient`, `.legendNode`, `.hint`, `.usersSuffix`, `.exitFocus`, `.fitToView`, `.zoomIn`, `.zoomOut`, `.reset`, `.child`, `.children` |
| `hierarchy.col.*` | 7 | `.username`, `.firstName`, `.email`, `.phone`, `.role`, `.permGroup`, `.status` |
| `hierarchy.drawer.*` | 14 | `.addNode.{title,save}`, `.editNode.{title,save}`, `.nameLabel`, `.namePlaceholder`, `.under`, `.errors.{required,minLength,maxLength,noEdgeWhitespace}`, `.success.{add,edit}`, `.error` |
| `hierarchy.error.*` | 5 | `.network`, `.nodeNotFound`, `.maxDepthReached`, `.addClientRootOnly`, `.cannotEditRoot` |
| `hierarchy.info.*` | ~21 | `.title`, `.clientPicture`, `.empty`, `.sections.{identity,business,address,identifiers}`, `.fields.{accountName,financeId,classification,subClassification,entityName,authorityType,sector,budget,country,city,district,street,building,postal,addlAddr,anotherId,vat}` |
| `hierarchy.kanban.col.*` | 5 | `.active`, `.pending`, `.suspended`, `.locked`, `.deleted` |
| `hierarchy.settings.*` | 2 | `.title`, `.saved` |
| `hierarchy.status.*` | 5 | `.active`, `.pending`, `.suspended`, `.locked`, `.deleted` |
| `hierarchy.tabs.*` | 4 | `.hierarchy`, `.commChannels`, `.apps`, `.settings` |
| `hierarchy.users.*` | 5 | `.title`, `.empty`, `.moreDetails`, `.bulk.{bulkSuspend,bulkActivate}` |
| `hierarchy.validation.*` | ~30 | error keys mapped in `validation-messages.ts` (all keys consumed via `messageFor()` / `messagesFor()`) |
| `hierarchy.view.*` | 3 | `.list`, `.tree`, `.board` |
| `hierarchyTab.tree.*` | 5 | `.actions.{addClient,addNode,addUser,editNode}`, `.clientsLabel` |
| `common.*` | 5 | `.cancel`, `.back`, `.next`, `.edit`, `.save` |

⚓ **All 231 keys must remain identical when copied into admin-console** — same i18n source file, same translations, zero rename.

---

## 12. Mock data shape

### `mock-tree.ts`

```ts
MOCK_TREE: ClientNode = {
  id: 'root', name: 'Falcon', type: 'root', level: 0,
  children: [
    { id: 'aramco',  name: 'Saudi Aramco',        type: 'client', brand: 'aramco',  parentId: 'root', level: 1,
      accountSettings: DEFAULT_ACCOUNT_SETTINGS,
      children: [Finance, Operations (→ IT, HR), Legal, …10-level deep chain via buildDeepChain()] },
    { id: 'alrajhi', name: 'Al Rajhi Bank',       type: 'client', brand: 'alrajhi', parentId: 'root', level: 1, … },
    { id: 'snb',     name: 'Saudi National Bank', type: 'client', brand: 'snb',     parentId: 'root', level: 1, … },
    { id: 'bupa',    name: 'Bupa Arabia',         type: 'client', brand: 'bupa',    parentId: 'root', level: 1, … },
  ],
};

DEFAULT_ACCOUNT_SETTINGS = {
  passwordSecurityLevel: Normal,
  allowedIPs: [],
  maxNormalUserLimit: 100,
  maxSystemUserLimit: 5,
  maxNodeLevel: 10,
  balanceTransferLimit: 50,
};

generateMockUsers(nodeId): readonly User[] // 7 deterministic Saudi names
RESERVED_USERNAMES: ReadonlySet<string>     // {'admin','root','system','falcon','test','ahmed.alsaud','fatima.khan'}
```

### `mock-applications.ts`

```ts
ApplicationRow = { id, name, priceType, priceValue, firstActivation, activation, renew, status, visible }
APPS_DEFAULT     — 8 rows  (Basic Send App, Survey Pro, Campaign Engine, Workflow Builder, Analytics Suite, Form Builder, Reporting Hub, AI Assistant)
CHANNELS_DEFAULT — 9 rows  (SMS Gateway, WhatsApp Business, Email Relay, Voice IVR, Push Notifications, AI-ChatGPT, RCS Messaging, Telegram Bot, Apple Business Chat)
APPS_BY_NODE / CHANNELS_BY_NODE — keyed by node id (aramco/bmw/snb/rajhi/bupa)
getMockApps(nodeId)     / getMockChannels(nodeId)
```

🚩 Mocks can be slimmed or replaced in the admin-console copy if the new feature is intended to demonstrate empty/loaded states or different seed data. But the **shape is canonical** — keep `ApplicationRow`/`ClientNode` types.

---

## 13. DI patterns (non-trivial)

- `HierarchyPageStateService` is **explicitly NOT** `providedIn: 'root'`. It is page-scoped via `providers: [HierarchyPageStateService]` on the menu component. ⚓ This is critical: every navigation to the page gets a fresh state machine.
- `HierarchyService`, `AddClientApiService`, `AddUserApiService` ARE `providedIn: 'root'`.
- `FALCON_NOTIFIER` is consumed with `inject<FalconNotifierFacade | null>(FALCON_NOTIFIER, { optional: true })` — optional bridge so the component works in preview/standalone without a host shell.
- The org-chart `FalconPanZoomDirective` uses `inject(DestroyRef)` + `inject(ElementRef<HTMLElement>)` and binds `fromEvent(…)` streams; no manual unsubscribe.
- Guards use `inject(Router)`, `inject(HierarchyService)`, optional `inject<FalconNotifierFacade>(FALCON_NOTIFIER, { optional: true })` — they return either `boolean | UrlTree`.
- Resolvers use `inject(HierarchyService)` and pull route params via the `ResolveFn` signature.
- The chart's `<falcon-chart-card>` has a generic type parameter `<T extends ChartCardData>` — Angular DI is unaffected since this is a structural type.
- No `useExisting` / no `useFactory` / no manual `Injector.create()` is used anywhere in the feature.

---

## 14. Anti-patterns spotted (do NOT replicate)

> Survey scope: `apps/management-console/src/app/features/organization-hierarchy-page/**` only.

| Anti-pattern | Count | Notes |
|---|---:|---|
| `.scss` files in feature | **0** ✅ | clean |
| Component `styleUrls`/`styles:`/`styleUrl:` | **0** ✅ | clean |
| `*ngIf` / `*ngFor` / `*ngSwitch` legacy directives | **0** ✅ | all uses `@if`/`@for`/`@switch`/`@let` |
| `[ngClass]` legacy directive | **0** ✅ | uses `[class.xxx]` predicates |
| `primeng` imports / `<p-…>` tags | **0** ✅ | clean |
| `pi pi-*` icon classes | **0** ✅ | uses `falcon-icon falcon-icon-*` exclusively (vendored font) |
| Constructor-based DI | **0** ✅ | uses `inject()` exclusively |
| `BehaviorSubject` for in-component state | **0** ✅ | signals everywhere |
| `any` types in new code | several legitimate uses around `unknown`-cast event handlers and `as never` in async validators | acceptable — narrow and isolated |
| Inline `style=`/`style.*` bindings | **15 occurrences across 3 files** (`skeleton`, `falcon-org-chart`, `falcon-chart-card`) | **JUSTIFIED** — runtime layout coordinates that can't be expressed via Tailwind utilities (e.g. `[style.left.px]="card.x"`, `[style.transform]="planeTransform()"`). These are coordinate bindings, not visual tokens. ✅ acceptable, do not refactor. |
| Hardcoded hex colors in TS literals | **5 in `hierarchy-page-state.service.ts` `BRAND` const + 2 stroke colors in chart HTML** (`#7C82A9`, `#0d3f44`) | 🚩 **AVOID in admin-console copy** — replace with token CSS variables (`--falcon-neutral-…`) or move into a Tailwind config token. The teal `#0d3f44` is already `bg-falcon-teal-700` in Tailwind; the chart SVG strokes should use `var(--falcon-neutral-200)` etc. |
| Empty stub event handlers | 2 (`onUserRowAction`, `onKanbanAction` are `/* no-op stub */`) | 🚩 fine to leave as no-op while admin-console copy is being built; flag for real wiring later. |
| Visual-test bypass (`?visual-test=1`) in `getUsers()` | 1 spot in `HierarchyService` | ⚓ replicate verbatim — it lets QA force mock data |

---

## 15. Host-shell sidebar integration — exact entry needed

**Files inspected:**
- `apps/host-shell/src/app/layout/layout.component.ts` (lines 51-53, 178-188 → already declares the New Page entry)
- `apps/host-shell/src/app/layout/layout.component.html` (binds `[navItems]="visibleNavItems"`)
- `apps/host-shell/src/app/layout/components/sidebar/sidebar.component.ts` (consumes `navItems: input<readonly NavItem[]>([])`, builds `realSections` by grouping on `section`, computes `safePath` via `RouteAccessService`)
- `apps/host-shell/src/app/layout/model/models.ts` (NavItem interface)

### How NavItem[] is sourced
`LayoutComponent.ngOnInit` subscribes to `SessionProvider.session$`; on every emission it calls `buildNavItems()` which:
1. Reads `userType` from session (`'1'` Falcon, `'2'` Client, `'0'` none).
2. Builds the static `NavItem[]` array via `createNavItems(userType)`.
3. Computes `safePath` for each item via `RouteAccessService.getSafeLink(item, userType)`.
4. Resolves async permission checks via `AccessControlFacade.ensure(…)` and re-runs `applyItemAccess` → sets `hidden` and `safePath` final.
5. The sidebar renders `visibleNavItems` (filter on `!hidden`).

When `navItems` input is empty, the sidebar falls back to the **MOCK_SECTIONS** static catalog (`/#/preview` mode only).

### The entry already wired (lines 178-188 of `layout.component.ts`)

```ts
/*** New page-shell feature — placed first so it lands above the legacy entry. No async access
 *** gate (legacy 'sys.acc-hierarchy' resource can hide siblings when pending); FalconUser only. ***/
{
  label: 'Organization Hierarchy (New Page)',
  path: this.admin_console_PATH_ORGANIZATION_HIERARCHY_PAGE,  // = `${APP_ROUTES.admin_console_BASE}/organization-hierarchy-page`
  iconClass: FALCON_ICONS.ORGANIZATION,
  section: 'Account Administration',
  scope: AppRouteScope.AdminConsole,
  requiredUserTypes: [USER_TYPE_STRINGS.FALCON_USER],
  hidden: isClient,
},
```

⚓ **No edit to layout.component.ts is required IF the new feature uses path `organization-hierarchy-page` exactly.**

But the night-shift spec says the new feature lives at slug **`org-hierarchy-page`** (shorter — no "organization-"). 🚩 Therefore one of two things must happen:

**Option A — rename slug to match the existing constant.** Use `organization-hierarchy-page` in admin-console `app.routes.ts` (matches the constant `admin_console_PATH_ORGANIZATION_HIERARCHY_PAGE`). Folder may still be named `org-hierarchy-page/` for shorter file paths; only the route path needs to match.

**Option B — add a new constant and a new sidebar entry pointing at `/admin-console/org-hierarchy-page`.** Requires layout.component.ts edit:

```ts
private readonly admin_console_PATH_ORG_HIERARCHY_PAGE =
  `${APP_ROUTES.admin_console_BASE}/org-hierarchy-page`;

// In createNavItems(), append a sibling NavItem at the top of 'Account Administration':
{
  label: 'Org Hierarchy (Admin)',
  path: this.admin_console_PATH_ORG_HIERARCHY_PAGE,
  iconClass: FALCON_ICONS.ORGANIZATION,
  section: 'Account Administration',
  scope: AppRouteScope.AdminConsole,
  requiredUserTypes: [USER_TYPE_STRINGS.FALCON_USER],
  hidden: isClient,
},
```

🚩 **Recommendation: Option B** — keep the route slug as documented in the spec (`org-hierarchy-page`) and add the second NavItem. Reason: the existing "Organization Hierarchy (New Page)" entry already exists; if the admin-console copy uses the same slug there would be a naming collision (the sidebar would route to the same path and load the management-console implementation). Two distinct NavItems → two distinct routes → both visible during the migration window.

### Admin-console `app.routes.ts` change required

```ts
import { Routes } from '@angular/router';
// import { adminConsoleGuard } from '@falcon'; // (currently commented out)

export const appRoutes: Routes = [
  {
    path: '',
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'organization-hierarchy' },
      {
        path: 'org-hierarchy-page',                                       // ⚓ new entry
        loadChildren: () =>
          import('./features/org-hierarchy-page/org-hierarchy-page.routes').then(
            (m) => m.orgHierarchyPageRoutes,
          ),
        data: { breadcrumb: 'Org Hierarchy' },
      },
    ],
  },
  { path: '**', redirectTo: '' },
];

export const routes = appRoutes;
export default appRoutes;
```

(Admin-console is a remote MFE — Module Federation exposes `./Routes` via `app.routes.ts`; the host loads it dynamically.)

---

## 16. Recommended new-folder structure for `apps/admin-console/src/app/features/org-hierarchy-page/`

The structure below mirrors the reference 1:1 with shorter `org-` prefix on top-level filenames. Deviations are explicitly justified.

```
apps/admin-console/src/app/features/org-hierarchy-page/
│
├── org-hierarchy-page.routes.ts                                      ⚓ rename of organization-hierarchy-page.routes.ts
│
├── guards/
│   └── guards.ts                                                     ⚓ verbatim (nodeExistsGuard, addNodeGuard, addClientGuard, editNodeGuard)
│
├── resolvers/
│   └── resolvers.ts                                                  ⚓ verbatim (treeResolver, nodeResolver, usersResolver, userResolver, ROOT_NODE_ID)
│
├── models/
│   └── models.ts                                                     ⚓ verbatim (single consolidated domain types file)
│
├── services/
│   ├── services.ts                                                   ⚓ verbatim — HierarchyService (providedIn: 'root')
│   ├── hierarchy-page-state.service.ts                               ⚓ verbatim — HierarchyPageStateService (PAGE-SCOPED)
│   ├── mock-tree.ts                                                  🚩 may shrink mock — keep DEFAULT_ACCOUNT_SETTINGS + helpers
│   ├── mock-applications.ts                                          🚩 may shrink — keep ApplicationRow type
│   ├── validators.ts                                                 ⚓ verbatim
│   └── validation-messages.ts                                        ⚓ verbatim
│
└── components/
    ├── org-hierarchy-page-menu.component.{ts,html}                   ⚓ rename of organization-hierarchy-page-menu.component.{ts,html}
    │                                                                    Selector: `app-org-hierarchy-page-menu` (renamed for admin-console scope)
    │
    ├── skeleton/
    │   └── org-hierarchy-skeleton.component.ts                       ⚓ verbatim (selector already neutral: falcon-org-hierarchy-skeleton)
    │
    ├── tab-components/
    │   │
    │   ├── applications-table/
    │   │   ├── applications-table.component.{ts,html}                ⚓ verbatim
    │   │   └── index.ts                                              ⚓ verbatim
    │   │
    │   ├── apps-services-tab/
    │   │   ├── apps-services-tab.component.{ts,html}                 ⚓ verbatim
    │   │   └── index.ts                                              ⚓ verbatim
    │   │
    │   ├── comm-channels-tab/
    │   │   ├── comm-channels-tab.component.{ts,html}                 ⚓ verbatim
    │   │   └── index.ts                                              ⚓ verbatim
    │   │
    │   ├── settings-tab/
    │   │   ├── settings-tab.component.{ts,html}                      ⚓ verbatim
    │   │   └── index.ts                                              ⚓ verbatim
    │   │
    │   └── hierarchy-tab/
    │       │
    │       ├── falcon-org-chart/
    │       │   ├── index.ts                                          ⚓ verbatim public surface
    │       │   ├── falcon-org-chart/
    │       │   │   └── falcon-org-chart.component.{ts,html}          ⚓ verbatim
    │       │   ├── falcon-chart-card/
    │       │   │   └── falcon-chart-card.component.{ts,html}         ⚓ verbatim
    │       │   ├── falcon-chart-toolbar/
    │       │   │   └── falcon-chart-toolbar.component.{ts,html}      ⚓ verbatim
    │       │   ├── directives/
    │       │   │   └── directives.ts                                 ⚓ verbatim — FalconPanZoomDirective
    │       │   ├── services/
    │       │   │   └── chart-layout.service.ts                       ⚓ verbatim — ChartLayoutService
    │       │   └── models/
    │       │       └── models.ts                                     ⚓ verbatim
    │       │
    │       ├── falcon-org-info-panel/
    │       │   ├── falcon-org-info-panel.component.{ts,html}         ⚓ verbatim
    │       │   ├── models/
    │       │   │   └── models.ts                                     ⚓ verbatim
    │       │   └── index.ts                                          ⚓ verbatim
    │       │
    │       ├── falcon-org-kanban/
    │       │   ├── falcon-org-kanban.component.{ts,html}             ⚓ verbatim
    │       │   ├── index.ts                                          ⚓ verbatim
    │       │   └── falcon-org-user-card/
    │       │       ├── falcon-org-user-card.component.{ts,html}      ⚓ verbatim
    │       │       └── index.ts                                      ⚓ verbatim
    │       │
    │       ├── falcon-org-node-drawer/
    │       │   ├── falcon-org-node-drawer.component.{ts,html}        ⚓ verbatim
    │       │   └── index.ts                                          ⚓ verbatim
    │       │
    │       ├── falcon-org-node-header/
    │       │   ├── falcon-org-node-header.component.{ts,html}        ⚓ verbatim
    │       │   └── index.ts                                          ⚓ verbatim
    │       │
    │       └── falcon-org-view-toggle/
    │           ├── falcon-org-view-toggle.component.{ts,html}        ⚓ verbatim
    │           └── index.ts                                          ⚓ verbatim
    │
    └── wizard-components/
        │
        ├── add-client-wizard/
        │   ├── add-client-wizard.component.{ts,html}                 ⚓ verbatim
        │   ├── index.ts                                              ⚓ verbatim
        │   ├── models/
        │   │   └── models.ts                                         ⚓ verbatim
        │   ├── services/
        │   │   └── services.ts                                       ⚓ verbatim — AddClientApiService
        │   ├── client-information-step/
        │   │   ├── client-information-step.component.{ts,html}       ⚓ verbatim
        │   │   └── index.ts                                          ⚓ verbatim
        │   ├── client-settings-step/
        │   │   ├── client-settings-step.component.{ts,html}          ⚓ verbatim
        │   │   └── index.ts                                          ⚓ verbatim
        │   ├── client-comm-channels-step/
        │   │   ├── client-comm-channels-step.component.{ts,html}     ⚓ verbatim
        │   │   └── index.ts                                          ⚓ verbatim
        │   ├── client-applications-step/
        │   │   ├── client-applications-step.component.{ts,html}      ⚓ verbatim
        │   │   └── index.ts                                          ⚓ verbatim
        │   ├── client-account-owner-step/
        │   │   ├── client-account-owner-step.component.{ts,html}     ⚓ verbatim
        │   │   └── index.ts                                          ⚓ verbatim
        │   └── client-service-row-table/
        │       ├── client-service-row-table.component.{ts,html}      ⚓ verbatim
        │       └── index.ts                                          ⚓ verbatim
        │
        └── add-user-wizard/
            ├── add-user-wizard.component.{ts,html}                   ⚓ verbatim
            ├── index.ts                                              ⚓ verbatim
            ├── models/
            │   └── models.ts                                         ⚓ verbatim
            ├── services/
            │   └── services.ts                                       ⚓ verbatim — AddUserApiService
            ├── user-personal-step/
            │   ├── user-personal-step.component.{ts,html}            ⚓ verbatim
            │   └── index.ts                                          ⚓ verbatim
            ├── user-role-status-step/
            │   ├── user-role-status-step.component.{ts,html}         ⚓ verbatim
            │   └── index.ts                                          ⚓ verbatim
            └── user-permissions-step/
                ├── user-permissions-step.component.{ts,html}         ⚓ verbatim
                └── index.ts                                          ⚓ verbatim
```

**Total file count: 91** (same as reference).

### Explicit deviations from 1:1 mirror

| Deviation | Rationale | Tag |
|---|---|---|
| Top-level routes file renamed: `organization-hierarchy-page.routes.ts` → `org-hierarchy-page.routes.ts` | matches new feature slug per spec | 🚩 |
| Top-level menu component renamed: `organization-hierarchy-page-menu.component.{ts,html}` → `org-hierarchy-page-menu.component.{ts,html}` | matches new feature slug per spec; selector also renamed `app-organization-hierarchy-page-menu` → `app-org-hierarchy-page-menu` | 🚩 |
| Inner Falcon* component selectors stay identical (`falcon-org-chart`, `falcon-org-info-panel`, etc.) | These are scoped per standalone component imports, no global collision. Keeping selectors identical reduces churn in templates. | ⚓ |
| Mock seed data may shrink in admin-console copy | The mocks are illustrative; production may not need 4 banking clients or 10-level depth chain | 🚩 |
| `BRAND` hex constants in `hierarchy-page-state.service.ts` | Replace with token-driven CSS vars to align with `feedback_no_inline_styles_tokens_only.md` | 🚩 |
| SVG stroke colors `#7C82A9` / `#0d3f44` in chart HTML | Replace with `stroke="var(--falcon-neutral-…)"` to align with token SSOT | 🚩 |
| Admin-console-specific gateways/roles | `HierarchyService.getUsers()` currently calls `useGateway(Gateway.IdentityGateway)` and `getTree()` uses `Gateway.SystemGateway`. Admin-console flow may need to flip to `Gateway.CoreGateway`/`Gateway.SystemGateway` depending on user type. **Decide during architecture phase.** | 🚩 |
| `adminConsoleGuard` should likely be enabled on the new route | Currently commented out in admin-console `app.routes.ts`. Uncomment + scope on the new entry. | 🚩 |

---

## Summary

- **File written:** `C:\Falcon\Brain Outputs\reports\org-hierarchy-page-night-shift-2026-05-14\04-existing-angular-structure-discovery.md`
- **Approximate line count:** ~640 lines
- **Components catalogued:** 38 (menu + skeleton + 4 tab wrappers + applications-table + 13 hierarchy-tab innards + 18 wizard pieces incl. wizard hosts + step components)
- **Services catalogued:** 6 (HierarchyService, HierarchyPageStateService, AddClientApiService, AddUserApiService, ChartLayoutService) + 5 ancillary data/util files (mock-tree, mock-applications, validators, validation-messages, models)
- **Distinct Falcon imports (symbols):** ~48 unique symbol names across 4 module paths (`@falcon`, `@falcon/sdk`, `@falcon/ui-core/angular`, `@falcon/ui-core/angular/falcon-input`)
- **Anti-patterns found:** 1 mild (hardcoded hex colors in `BRAND` const + 2 SVG strokes — flagged for token migration during admin-console copy)
