# Components — organization-hierarchy

## Tree
```
OrganizationHierarchyComponent  (selector: app-organization-hierarchy)
├── <falcon-organization-hierarchy-tree>          (left panel; from @falcon — see imports)
├── <p-contextMenu>                                (PrimeNG; appendTo body)
├── TabsLayoutComponent          (selector: app-tabs-layout, center panel — only when !showCreateClient)
│   ├── HierarchyTabComponent          (selector: app-hierarchy-tab; tab '0')
│   │   ├── <falcon-table>             (T2TableColumn / T2RowMenuAction)
│   │   ├── InformationComponent       (selector: app-information; rendered when viewMode === 'info')
│   │   ├── <p-skeleton>               (loading rows)
│   │   ├── <p-button>                 (toolbar)
│   │   └── <falcon-icon> + <button-icon>
│   ├── CommChannelsServicesTabComponent (selector: app-comm-channels-services-tab; tab '2'; enabled = !isFalcon && isMain)
│   │   ├── <falcon-table>             (with detailsRowTpl, editPriceTypeTpl, editPriceValueTpl, visibilityTpl, priceValueCellTpl)
│   │   ├── <falcon-calendar>          (effective-date picker)
│   │   ├── <p-select>                 (price-type select)
│   │   ├── <p-inputNumber>            (price-value input)
│   │   ├── <p-toggleSwitch>           (visibility column for Falcon users only)
│   │   ├── InsufficientBalancePriorityDialogComponent  (from apps/admin-console/src/app/shared/components/insufficient-balance-priority-dialog/)
│   │   └── InsufficientBalanceWarningDialogComponent   (from apps/admin-console/src/app/shared/components/insufficient-balance-warning-dialog/)
│   ├── AppsServicesTabComponent        (selector: app-apps-services-tab; tab '3'; enabled = !isFalcon && isMain)
│   │   └── same children as Comm Channels tab
│   └── NodeSettingsTabComponent        (selector: app-node-settings-tab; tab '1'; always enabled)
│       ├── <p-radioButton> (password security level — Normal | Advanced)
│       ├── <p-chip>        (allowed-IPs list)
│       ├── <p-inputText>   (IP input field)
│       ├── <p-inputNumber> (quota inputs: maxNormalUserLimit, maxSystemUserLimit, maxNodeLevels, balanceTransferLimitPercentage)
│       ├── <p-button>      (edit / save / cancel / add-ip)
│       ├── <falcon-icon>
│       └── <falcon-divider>
├── <app-drawer>                        (DrawerComponent from @falcon; Add Node + Edit Node UI; right side)
│   └── ng-template #drawerBodyTpl  →  <input pInputText> [(ngModel)]="nodeName" + preview card with <p-tag>
└── CreateClientWizardComponent   (selector: app-create-client-wizard; full center panel when showCreateClient)
    └── <app-dynamic-stepper>            (DynamicStepperComponent from @falcon)
        ├── Step 0  InformationClientStepComponent       (selector: app-information-client-step)
        ├── Step 1  ClientSettingsStepComponent          (selector: app-client-settings-step)
        ├── Step 2  CommChannelsStepComponent            (selector: app-comm-channels-step)
        ├── Step 3  ClientApplicationStepComponent       (selector: app-client-application-step)
        └── Step 4  AccountOwnerStepComponent            (selector: app-account-owner-step)
        + <falcon-send-credentials-popup>                 (delivery-method dialog)
        + <p-confirmDialog key="cancelWizard">            (cancel confirmation)
        + <falcon-finish-alert-dialog>                    (post-create success)
```

## Per-component

### OrganizationHierarchyComponent
- File: `apps/admin-console/src/app/features/organization-hierarchy/organization-hierarchy.component.ts:69-881`
- Selector: `app-organization-hierarchy`
- Standalone: yes
- Imports (Angular): `CommonModule`, `ReactiveFormsModule`, `FormsModule`
- Imports (PrimeNG): `ContextMenuModule`, `InputText`, `TagModule`
- Imports (@falcon): `OrganizationHierarchyTreeComponent`, `DrawerComponent`, `TranslatePipe`, `FALCON_ROOT_NODE`, `USER_TYPE_STRINGS`, `AccessControlFacade`, `FalconAccess`, `SessionProvider`, `TranslateService`
- Imports (local): `TabsLayoutComponent`, `CreateClientWizardComponent`
- Inputs / Outputs: none (top-level page component)
- Services injected (via `inject()`):
  - `OrgHierarchyApiService` (line 73)
  - `ChangeDetectorRef` (74)
  - `Router` (75)
  - `TranslateService` (76)
  - `NodeApiService` (77)
  - `SessionProvider` (78)
  - `DestroyRef` (79)
  - `AccessControlFacade` (130)
- ViewChild: `contextMenu: ContextMenu` (`@ViewChild('contextMenu') contextMenu!: ContextMenu`), `tabsLayoutComponent?: TabsLayoutComponent` (84-85)
- Forms: none directly (drawer uses `[(ngModel)]="nodeName"` template-driven)
- State (instance fields):
  - `rootNode: TreeNode | null = null`
  - `selectedNodeId: string | null = null`
  - `selectedNode: TreeNode | null = null`
  - `listItems: UserListItem[] = []`
  - `totalRecords = 0; pageNumber = 1; pageSize = 10`
  - `loadingRoot, loadingContent, loadingRootChildren: boolean`
  - `loadingChildrenIds: Set<string>`, `loadedChildrenIds: Set<string>`, `expandedKeys: Record<string, boolean>`
  - `showCreateNode, showCreateClient, isEditNode: boolean`
  - `nodeName, oldNodeName: string`
  - `isFalcon: boolean` (computed from `sessionProvider.session.userType === USER_TYPE_STRINGS.FALCON_USER`)
  - `allowedTreeActions: string[]` (one of `['add-node','edit-node','add-user']` or with `'add-client'`)
  - `canAddAccount, canEditAccountProfile: boolean` (PES flags)
  - `pendingSelectNodeId, pendingExpandPath` — picked up from `window.history.state` (line 138-148) for returning from user-profile.
- Key methods:
  - `loadRoot()` — `getRootNodes()` (skipped for Falcon — uses `FALCON_ROOT_NODE` constant) then `getChildren(rootKey)` and restore-expansion/select hooks.
  - `onNodeSelect(node)` — sets `selectedNode`, calls `tabsLayoutComponent.resetToUsersList()`, then `loadUsersPage(nodeKey)`.
  - `onNodeAction(action)` — dispatches `add-node | edit-node | add-client | add-user | view-details | delete` from the tree's right-click / 3-dot menu.
  - `onUserSelected(user)` — `router.navigate(['/profile'], { queryParams: { nodeId: user.id, orgNodeId }, state: { showTree, expandPath, orgNodeLabel, orgNodeIconUrl, sourceRoute } })`.
  - `handleDrawerAction()` — invokes `nodeApiService.updateNodeName | addNodeName` depending on `isEditNode`.
  - `refreshTreePreservingState()` — clears the tree then re-runs `loadRoot()` with a captured set of expanded keys + selected id, and then BFS-expands frontier nodes (`collectExpandFrontier` + `expandFrontier`) to restore visible state.
  - `expandAlongPath(index)` — walks `pendingExpandPath` lazily fetching children level-by-level (used when returning from `/profile`).
- Template highlights (`organization-hierarchy.component.html`):
  - Three-column layout: tree panel (`org-hierarchy-tree-panel`) + list panel (`org-hierarchy-list-panel`, only when `!showCreateClient`) + wizard panel (only when `showCreateClient`)
  - `<falcon-organization-hierarchy-tree>` props: `[loading]`, `[nodes]`, `[allowedActions]`, `[loadingChildrenIds]`, `[selectedNodeKey]`, `[expandedKeys]`, `[disableRoot]="false"`, `[showRootFalcon]="isFalcon"`, `[showFalconExpandArrow]="false"`, `[rootChildrenLabel]`, events `(nodeExpandRequested)`, `(nodeCollapseRequested)`, `(nodeSelected)`, `(nodeAction)`
  - Center panel: a hand-rolled skeleton (`oh-skeleton__*` 7-row table) shown while `loadingContent`, otherwise `<app-tabs-layout>` (only when `selectedNode || rootNode`)
  - Drawer: `<app-drawer [(show)]="showCreateNode" position="right" [headerName]="isEditNode ? 'hierarchyTab.drawer.editNode' : 'hierarchyTab.drawer.addNode'" [isEdit]="isEditNode" [disableSave]="!nodeName.trim()" [templateContent]="drawerBodyTpl" (onCancel) (onClose) (onAction)>` — body is an `<input pInputText [(ngModel)]="nodeName" name="nodeName" maxlength="32" />` + a preview card showing parent + new child node (or rename from→to)
  - Wizard panel: `<app-create-client-wizard (cancel)="onClientCancel()" (finishClosed)="updatePage()">`
- Falcon components used: `<falcon-organization-hierarchy-tree>`, `<app-drawer>` (DrawerComponent), `<p-tag>`, `<p-contextMenu>`, `<p-button>`, `<falcon-icon>` (indirectly via tabs).

### TabsLayoutComponent
- File: `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/tabs-layout.component.ts:34-220`
- Selector: `app-tabs-layout`
- Standalone: yes
- Imports: `CommonModule`, `FormsModule`, `TabsModule` (PrimeNG), `TranslatePipe`, `NodeSettingsTabComponent`, `HierarchyTabComponent`, `CommChannelsServicesTabComponent`, `AppsServicesTabComponent`
- Inputs: `items: UserListItem[]` (line 35), `totalRecords: number` (36), `pageSize` (37), `loading` (38), `selectedNodeId: string | null` (39), `canAddClient: boolean` (40), `canEditAccountProfile: boolean` (41), `selectedNode: TreeNode | null` (setter at 42 — triggers `forceRedrawTabs()` when node key changes), `tabsConfig: TabConfig[] | null` (setter at 57)
- Outputs (EventEmitter): `userSelected` (63), `addNode` (64), `addClient` (65), `addUser` (66), `makeUpdate` (67), `pageChange` (68)
- ViewChild: `nodeSettingsComponent?: NodeSettingsTabComponent` (70), `hierarchyTabComponent?: HierarchyTabComponent` (71)
- Services injected: `SessionProvider` (73), `ChangeDetectorRef` (74)
- State:
  - `activeTab = '0'`, `tabsVisible = true`
  - `selectedNodeSig: signal<TreeNode | null>` (80) — signal mirror of `_selectedNode`
  - `tabsConfigSig: signal<TabConfig[] | null>` (81)
  - `isFalconMenuSig = computed(() => !!this.selectedNodeSig()?.data?.isFalconNode)` (83-85)
  - `isMainMenuSig  = computed(() => !!this.selectedNodeSig()?.data?.isMainMenu)` (87-89)
  - `defaultTabsConfig = computed<TabConfig[]>(() => [...])` (91-125) — produces an array of 4 tab configs each with `enabled`, `order`, `componentType` (`Hierarchy`, `CommChannelsServices`, `AppsServices`, `Settings`)
    - Hierarchy: `enabled: true` always
    - CommChannelsServices: `enabled: !isFalcon && isMain`
    - AppsServices: `enabled: !isFalcon && isMain`
    - Settings: `enabled: true` always
  - `currentTabsConfig` (127-130) — falls back to default when `tabsConfigSig()` is null
- Key methods:
  - `get tabs` (132-142) — filters enabled, sorts by `order`, auto-snaps `activeTab` to the first enabled tab if previous one disappeared.
  - `onTabChange(value)` (144-159) — special-case for Settings tab: `setTimeout(() => nodeSettingsComponent.loadSettings())` because settings are lazy-loaded on tab-activate.
  - `forceRedrawTabs()` (178-187) — toggles `tabsVisible = false` then back to `true` to destroy/recreate tab components when node changes.
  - `resetToUsersList()` (213-219) — resets to default tab and `hierarchyTabComponent.resetToUsersView()`.
- Template (`tabs-layout.component.html`): a PrimeNG `<p-tabs>` with `<p-tablist>` of `<p-tab>` per filtered tab config and `<p-tabpanels>` containing the 4 *ngIf-gated child components.
- Falcon components used: 4 internal tab components; no direct Falcon library components except the inherited stack.

### HierarchyTabComponent
- File: `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/hierarchy-tab/hierarchy-tab.component.ts:49-333`
- Selector: `app-hierarchy-tab`
- Standalone: yes
- Imports (Angular): `CommonModule`, `FormsModule`
- Imports (PrimeNG): `ButtonModule`, `Skeleton`, `Button`
- Imports (@falcon): `FalconTableComponent`, `T2TableColumn`, `T2RowMenuAction`, `ButtonIconDirective`, `FalconIconComponent`, `FalconFormValidateDirective`, `TranslatePipe`, `TranslateService`, `Helper`, `Hook`, `ClassificationCategory`, `ClassificationCategoryI18n`, `ClassificationSubCategory`, `ClassificationSubCategoryI18n`, `AuthorityLetterType`, `AuthorityLetterTypeI18n`, `SessionProvider`, `USER_TYPE_STRINGS`, `UserStatus`
- Imports (local): `InformationComponent`
- Inputs: `items: UserListItem[]` (50), `totalRecords` (51), `pageSize` (52), `loading` (53), `selectedNode: TreeNode | null` (54), `selectedNodeId: string | null` (55), `isMainMenu` (56), `isFalconMenu` (57), `canAddClient` (58), `canEditAccountProfile` (59)
- Outputs: `userSelected` (60), `addNode` (61), `addClient` (62), `addUser` (63), `makeUpdate` (64), `pageChange` (65)
- ViewChild: `@ViewChild('infoForm') infoForm!: NgForm` (93)
- Services injected: `SessionProvider`, `TranslateService`, `Helper`, `MessageService`, `InformationService` (76-80)
- State:
  - `selectedUser: UserListItem | null`
  - `accountInfo: AccountInformationModel` (75) — populated when entering info view
  - `viewMode: 'users' | 'info' = 'users'`
  - `mode: HierarchyTabMode = HierarchyTabMode.View` (`enum { View='VIEW', Edit='EDIT' }`, line 23-26)
  - `isSaving: boolean`, `loadingInformation: boolean`
  - `originalInfoModel: AccountInformationModel | null`
  - `columns: T2TableColumn<UserListItem>[]` (95)
  - `rowMenuActions: T2RowMenuAction<UserListItem>[]` (96)
  - `classificationCategoryOptions`, `classificationSubCategoryOptions`, `authorityLetterTypeOptions` — `Hook<number>[]` (89-91)
  - `statusConfig: Record<number, { cssClass; label }>` (175-181) — maps `UserStatus.Active / Pending / Suspended / Locked / Deleted` to badge classes
- Key methods:
  - `ngOnInit()` — initializes `columns` (the user table — username, firstName, email, phoneNumber, role, permissionGroup, status badge) and a single `rowMenuActions` entry `view` (line 121-134).
  - `renderUsernameWithAvatar(row)` — builds an HTML string with `user-avatar` / `user-avatar-initials` div + `<span class="username-text">`.
  - `renderStatusBadge(row)` — emits a `status-badge` HTML span with the appropriate dot class.
  - `onEmitAction()` (203-212) — if Falcon root + canAddClient → emit `addClient`, else emit `addNode`.
  - `onEditInfo()` (217-237) — switches viewMode to `info`, loads `informationAPIService.get(selectedNodeId)` and stores `originalInfoModel` (deep clone).
  - `onEdit()`, `onCancel()`, `onSave(form)` (239-298) — edit-mode lifecycle for account information; `onSave` calls `informationAPIService.update(selectedNodeId, accountInfo)`.
  - `canShow()` (321-328) — returns true only if user type is FALCON_USER or CLIENT_USER AND `isMainMenu` AND `!isFalconMenu`.
  - `canShowEditButton` getter (330-332) — additional `canEditAccountProfile` check.

### InformationComponent
- File: `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/hierarchy-tab/components/information/information.component.ts:59-428`
- Selector: `app-information`
- Standalone: yes
- `viewProviders: [{ provide: ControlContainer, useExisting: NgForm }]` (55) — so the contained inputs participate in the parent `infoForm` (template-driven).
- Imports (@falcon): `FieldComponent`, `TranslatePipe`, `TranslateService`, `Helper`, `ClassificationCategory`, `ClassificationCategoryI18n`, `ClassificationSubCategory`, `ClassificationSubCategoryI18n`, `AuthorityLetterType`, `AuthorityLetterTypeI18n`, `Hook`, `FalconStartWithLetterMax30Directive`, `SessionProvider`, `USER_TYPE_STRINGS`, `FalconDividerComponent`, `LookupService`, `LOOKUP_IDS`, `LookupValueResponse`, `FalconUploaderComponent`
- Imports (PrimeNG): `Select`, `InputTextModule`, `AutoComplete`
- Inputs:
  - `disabled = true` (60)
  - `model!: AccountInformationModel` — `@Input({ required: true })` (61)
  - `nodeId: string | null = null` (62)
  - `classificationCategoryOptions: Hook<number>[] = []` (64)
  - `classificationSubCategoryOptions: Hook<number>[] = []` (65)
  - `authorityLetterTypeOptions: Hook<number>[] = []` (66)
- Outputs: `makeUpdate = new EventEmitter<void>()` (68)
- State (17 model fields rendered, matching memory entry):
  1. `profilePicture` (data URL string OR `ProfilePictureInfo { extension, fileBase64String }`)
  2. `accountName` (Letters + digits, max 30, starts with letter)
  3. `accountId`
  4. `financeId`
  5. `classificationCategory` (lookup from `ClassificationCategory` enum)
  6. `classificationSubCategory` (lookup from `ClassificationSubCategory` enum)
  7. `entityName`
  8. `authorityLetterType` (lookup from `AuthorityLetterType` enum)
  9. `sector`
  10. `budgetNo`
  11. `country` / `countryId` (autocomplete via `LookupService.getLookup(LOOKUP_IDS.Country)`)
  12. `city` / `cityId` (autocomplete via `LookupService.getLookup(LOOKUP_IDS.City, { name, code: countryCode })`)
  13. `district`
  14. `street`
  15. `buildingNumber`
  16. `postalCode`
  17. `additionalAddress`
  18. `anotherId`
  19. `vatRegistrationNumber`
- (Source DTO: `AccountInformationModel` in `models/models.ts` — has 19 explicit fields plus `nodeId` and `profilePicture`. The "17 per memory" likely counts user-facing form rows; this file's truth is 19 form fields rendered, organized into `AccessSection.AccountInformation` (Account Information section) and `AccessSection.AccountOfficial` (Account Official section).)
- `AccessSection` enum (models/models.ts:40-43): `AccountInformation = 'account-information'`, `AccountOfficial = 'account-official'`.
- `canEdit(section)` (357-377) — returns true for AccountInformation only for FALCON_USER; for AccountOfficial for FALCON_USER OR CLIENT_USER.

### NodeSettingsTabComponent
- File: `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/node-settings-tab/node-settings-tab.component.ts:54-347`
- Selector: `app-node-settings-tab`
- Standalone: yes
- Imports (@falcon): `AccessControlFacade`, `FalconAccess`, `FalconFormValidateDirective`, `FalconIpAddressDirective`, `FalconIconComponent`, `TranslatePipe`, `TranslateService`, `isValidIpv4`, `isValidIpv6`, `PasswordSecurityLevel`, `PasswordSecurityLevelI18n`, `SessionProvider`, `USER_TYPE_STRINGS`, `Helper`, `FalconDividerComponent`
- Imports (PrimeNG): `RadioButtonModule`, `InputTextModule`, `InputNumberModule`, `ChipModule`, `ButtonModule`
- Inputs: `selectedNodeId: string | null` (55), `selectedNode: TreeNode | null` (56)
- Outputs: `settingsChanged = new EventEmitter<void>()` (57)
- ViewChild: `settingsForm!: NgForm`, `ipInputEl?: ElementRef<HTMLInputElement>` (136-137)
- Services injected: `FormBuilder`, `ConfirmationService`, `TranslateService`, `SettingsApiService`, `SessionProvider`, `DestroyRef`, `Helper`, `AccessControlFacade` (66-73)
- State:
  - `settingsModel: ClientSettingsModel` (62) — `{ ownerId?, quotaSettings: QuotaSettingsDto, securitySettings: SecuritySettings }`
  - `originalSettingsModel: ClientSettingsModel` (63)
  - `loadingSettings: boolean`, `isEditingSettings: boolean`
  - `currentIPInput = new FormControl<string>('', { nonNullable: true })` (139)
  - `ipInputError: string | null`, `showIPInput: boolean`
  - 6 PES flags (75-80): `canViewRootPasswordSecurityLevel`, `canEditRootPasswordSecurityLevel`, `canEditAccountPasswordSecurityLevel`, `canEditRootAllowedIps`, `canEditAccountAllowedIps`, `canEditAccountQuota`
  - `passwordSecurityLevelOptions` (144-155) — 2 options (Normal / Advanced) with descriptions.
- Key methods:
  - `loadSettings()` (175-197) — called by parent `TabsLayoutComponent.onTabChange` when settings tab activates; calls `settingsApiService.getSecuritySettings(selectedNodeId)`.
  - `onSaveSettings()` (216-253) — sets `settingsModel.ownerId = selectedNodeId` then PUTs; on success emits `settingsChanged`.
  - `addCurrentIP()` (261-296) — validates with `isValidIpv4(ip) || isValidIpv6(ip)`, rejects duplicates (case-insensitive), pushes to `securitySettings.allowedIps`.
  - `removeIP(ip)` (312-330) — opens `<p-confirmDialog>` then filters list.
  - `ensureAccess()` (332-345) — `accessControlFacade.resolveFlags(...)` for all 6 PES flags.
- Visibility getters: `isRootSelection`, `isMainNodeSelection`, `canViewPasswordSecuritySection`, `canEditPasswordSecurityLevel`, `canViewAllowedIpsSection`, `canEditAllowedIps`, `canViewQuotaSection`, `canEditSelectedSettings` (95-134) — each composes PES flags + node type (root vs. main vs. sub) to gate UI sections.

### CommChannelsServicesTabComponent
- File: `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/comm-channels-services-tab/comm-channels-services-tab.component.ts:97-1064`
- Selector: `app-comm-channels-services-tab`
- Standalone: yes
- Imports include `FalconTableComponent` + extensive template refs + `InsufficientBalancePriorityDialogComponent`, `InsufficientBalanceWarningDialogComponent` (cross-feature).
- Inputs: `selectedNodeId: string | null` (118), `selectedNode: TreeNode | null` (119)
- 5 `@ViewChild` templates: `editPriceTypeTpl`, `editPriceValueTpl`, `detailsRowTpl`, `visibilityTpl`, `priceValueCellTpl`, plus `falconTable: FalconTableComponent`
- Services injected: `TranslateService`, `MessageService`, `ConfirmationService`, `CommChannelsServicesService`, `SessionProvider`, `Helper`, `CommerceActionsService`, `DestroyRef`, `SimplePollService`, `OrderStatusService`, `ChangeDetectorRef` (103-114)
- Columns initialized (606-671): visibility (Falcon users only), name, priceType, priceValue (template), firstActivationDate, activationDate, renewDate, status
- Row menu actions from `FALCON_ACTION_REGISTRY` (673-748): `DoPayment`, `Disable`, `Enable`, `EditPriceType`, `EditPriceValue` — visibility computed from `row.allowedActions` array delivered by backend
- Payment flow (843-973): `showPaymentConfirmation()` → user confirms → `executePayment()` → `commerceActions.doPaymentCommChannel(payload)` → poll `orderStatusService.getOrderStatus(orderId)` via `simplePoll.watch` (`intervalSeconds: 2, maxDurationMinutes: 30`) until `ProcessState.Completed | Failed` → if `Failed` & `failureReason === CommChannelPriorityOrderRequired` → opens `InsufficientBalancePriorityDialog`; if `InsufficientFunds` or `WalletNotConfigForTheNode` → opens `InsufficientBalanceWarningDialog`.
- Delete pending price changes from details row (1002-1054): opens confirm dialog, calls `commerceActions.deleteCommChannelNewPriceType` or `...NewPriceValue`.

### AppsServicesTabComponent
- File: `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/apps-services-tab/apps-services-tab.component.ts:98-1054`
- Selector: `app-apps-services-tab`
- Identical structural pattern to CommChannelsServicesTabComponent — same 5 row actions, same payment + polling flow, same insufficient-balance dialogs. Only difference is the service (`AppsServicesService`) and the request shape (`DoPaymentApplicationRequest` instead of `DoPaymentCommunicationChannelRequest`).

### CreateClientWizardComponent
- File: `apps/admin-console/src/app/features/organization-hierarchy/components/create-client-wizard/create-client-wizard.component.ts:36-393`
- Selector: `app-create-client-wizard`
- Standalone: yes
- Imports (@falcon): `DynamicStepperComponent`, `StepperConfig`, `DeliveryMethod`, `FalconSendCredentialsPopupComponent`, `FalconFinishAlertDialogComponent`, `TranslateService`, `SvgIconComponent`, `SVG_ICON_NAMES`
- Outputs: `submit: EventEmitter<CreateClientWizardRequestDto>` (37), `cancel: EventEmitter<void>` (38), `finishClosed: EventEmitter<void>` (39)
- ViewChild references all 5 step components (57-61) — used for `checkCurrentStepValidity()` to merge their `form: NgForm` value/status changes.
- State:
  - `currentStep: number = 0`
  - `isCurrentStepValid: boolean = true`
  - `isCreatingAccount, showSendCard, showFinishDialog: boolean`
  - `wizardState: { model: CreateClientWizardRequestDto }` (83-137) — initialized with empty defaults for all 6 sub-DTOs (info, settings, commChannels, applications, accountOwner, deliveryMethod)
  - `stepperConfig: StepperConfig` (139-169) — title `'Create New Client'`, steps `['Client Information','Settings','CommChannels','Application','Account Owner']`, all `completed: false` initially, `allowNavigation: true`
- Key methods:
  - `checkCurrentStepValidity()` (183-282) — switches by `currentStep` index, pushes each step's `form: NgForm` (and `ipForm: FormGroup` for the settings step) into a forms array, evaluates `form.valid === true && form.pending === false`, then `merge(...valueChanges + statusChanges)` to re-evaluate on changes.
  - `onStepChange(stepIndex)` (299-314) — marks the previous step as `completed = true` when moving forward; debounces validation check via two nested `setTimeout`.
  - `onWizardFinish()` (316-318) — shows the `<falcon-send-credentials-popup>` (SMS / Email / Both delivery method picker).
  - `onWizardCancel()` (320-333) — `confirmationService.confirm({ key: 'cancelWizard', ... })`.
  - `buildWizardModel()` (335-355) — pre-submit transform: filters comm-channel & application services to only `visibility === true`, lowercases userName.
  - `onSendCredentials($event)` (357-385) — `nodeApiService.createAccount(wizardModel)` → on success shows `<falcon-finish-alert-dialog>`; on failure raises `alert(...)`.

### Wizard Step 0 — InformationClientStepComponent
- File: `.../create-client-wizard/steps/information-client-step/information-client-step.component.ts:69-395`
- Standalone, selector `app-information-client-step`
- Imports include `FalconUploaderComponent`, `FalconStartWithLetterMax30Directive`, `FalconLettersDigitsMaxDirective`, `FalconCheckExistsDirective`, `FalconFormValidateDirective`, `FalconDividerComponent`, `WizardStepFormDirective`, PrimeNG `InputText`, `Select`, `AutoComplete`
- Inputs: `state: WizardState & { model: CreateClientWizardRequestDto }` (70-72), `wizard!: WizardHostComponent` (73)
- Services: `ChangeDetectorRef`, `TranslateService`, `AccountValidationService` (uniqueness check), `LookupService` (countries / cities), `Helper`
- Uses `checkAccountNameExists = (name) => accountValidationService.checkAccountNameExists(name)` — passed as input to `<input falconCheckExists>` directive
- Profile picture: handles `<falcon-uploader>` `onFilesSelected` — converts to base64, attaches via `AttachmentRequestModel`

### Wizard Step 1 — ClientSettingsStepComponent
- File: `.../create-client-wizard/steps/client-settings-step/client-settings-step.component.ts:57-184`
- Imports `PasswordSecurityLevel`, `PasswordSecurityLevelI18n`, `isValidIpv4`, `isValidIpv6`, `FalconIpAddressDirective`
- 2 forms: `form: NgForm` + `ipForm: FormGroup` (with `currentIP: FormControl<string>` non-nullable)
- Defaults applied if missing: `passwordSecurityLevel = Advanced`, `allowedIPs = ['192.168.0.1','95.158.55.17']`, `maxNormalUserLimit = 20`, `maxSystemUserLimit = 5`, `maxNodeLevel = 0` (lines 111-118 — these are hard-coded defaults for new clients)
- IP validation/dedup logic identical to NodeSettingsTabComponent.

### Wizard Step 2 — CommChannelsStepComponent
- File: `.../create-client-wizard/steps/comm-channels-step/comm-channels-step.component.ts:35-171`
- Imports `CommunicationChannelApiService`
- On `ngOnInit`: if `state.model.commChannels.services` already populated → restore; else fetch via `serviceChannel.list()` and map each global comm-channel DTO into a `CreateClientServiceDto` with `visibility: false`, `priceType: undefined`, `priceValue: undefined`, `status: ChannelStatusToString[ChannelStatus.Inactive]`

### Wizard Step 3 — ClientApplicationStepComponent
- File: `.../create-client-wizard/steps/client-application-step/client-application-step.component.ts:36-174`
- Imports `ApplicationApiService`
- Same pattern as Step 2 — fetches global applications and maps into `CreateClientServiceDto[]`.

### Wizard Step 4 — AccountOwnerStepComponent
- File: `.../create-client-wizard/steps/account-owner-step/account-owner-step.component.ts:68-213`
- Imports `FalconMobileNumberComponent`, `FalconUsernameFormatDirective`, `FalconLettersDigitsMaxDirective`, `FalconCheckExistsDirective`, `FalconUploaderComponent`, `UserApiService`, `UserRoles`, `UserRolesI18n`
- Role options filtered to `[AccountOwner, NodeAdmin, NormalUser]` (line 121); defaults `role = AccountOwner`
- `checkUsernameExists` validator (91-96) — `accountValidationService.isUserExist(username, email, phoneNumber)`
- `generatePassword()` (191-211) — calls `userApiService.generatePassword(state.model.settings.passwordSecurityLevel)` on init AND on state changes (so when user changes password security in Step 1, this regenerates).
- Profile-picture deletion uses `<p-confirmDialog key="deleteAccountOwnerPicture">`.

## Tree of templates (template-only constructs of note)
- **Skeleton table** (`organization-hierarchy.component.html:32-67`) — hand-rolled `oh-skeleton__*` 7-row table shown while `loadingContent`.
- **Drawer body** (`organization-hierarchy.component.html:105-188`) — single text input + preview card with `<p-tag>` "Add" or "Edit" badge and a tree-connector visual ("From → To" for rename; "Parent → New child" for add).
- **Wizard cancel confirmation** (`create-client-wizard.component.html:49-65`) — uses custom `<falcon-svg-icon>` (key `SVG_ICON_NAMES.DEFAULT_CONFIRMATION`) inside `<p-confirmDialog key="cancelWizard">`.
