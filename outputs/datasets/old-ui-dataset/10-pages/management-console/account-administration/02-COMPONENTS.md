# Components — account-administration

## Tree
```
OrganizationHierarchyComponent (selector: app-organization-hierarchy)
├── <falcon-organization-hierarchy-tree>            (from @falcon — shared tree component)
├── TabsLayoutComponent (selector: app-tabs-layout)
│   ├── HierarchyTabComponent (selector: app-hierarchy-tab)
│   │   ├── <falcon-table>                           (Users list)
│   │   └── InformationComponent (selector: app-information)
│   │       ├── <falcon-divider>
│   │       ├── <falcon-uploader>                    (profile picture)
│   │       └── <field-component> + Select/AutoComplete/InputText (form fields)
│   ├── CommChannelsServicesTabComponent (selector: app-comm-channels-services-tab)
│   │   ├── <falcon-table>                           (visible comm channels)
│   │   ├── InsufficientBalancePriorityDialogComponent (selector: app-insufficient-balance-priority-dialog)
│   │   └── InsufficientBalanceWarningDialogComponent (selector: app-insufficient-balance-warning-dialog)
│   ├── AppsServicesTabComponent (selector: app-apps-services-tab)
│   │   ├── <falcon-table>                           (applications)
│   │   ├── InsufficientBalancePriorityDialogComponent
│   │   └── InsufficientBalanceWarningDialogComponent
│   └── NodeSettingsTabComponent (selector: app-node-settings-tab)
│       ├── <p-radioButton>                          (password security level)
│       ├── <p-chip> + custom IP input              (allowed IPs list)
│       └── <p-inputNumber>                         (quota fields)
├── <p-contextMenu>                                 (right-click on tree)
└── <app-drawer>                                    (Add/Edit node drawer)
```

## Per-component

### OrganizationHierarchyComponent
- File: `apps/.../organization-hierarchy/organization-hierarchy.component.ts:44-982`
- Selector: `app-organization-hierarchy`
- Standalone: yes
- Inputs: **none**
- Outputs: **none**
- Services injected (via `inject()`): `OrgHierarchyApiService`, `ChangeDetectorRef`, `Router`, `TranslateService`, `NodeApiService`, `SessionProvider`, `DestroyRef`, `AccessControlFacade`
- ViewChild: `ContextMenu` (PrimeNG), `TabsLayoutComponent`
- Forms: reactive imports loaded but state is plain class-property (no FormBuilder here)
- State: hybrid — class properties + Set/Map for loading tracking
- Template highlights:
  - `<falcon-organization-hierarchy-tree>` (shared tree, accepts `loading`, `nodes`, `allowedActions`, `selectedNodeKey`, `expandedKeys`, `showRootFalcon`, `rootChildrenLabel`)
  - `<app-tabs-layout>` (right pane)
  - `<p-contextMenu #contextMenu>` (right-click)
  - `<app-drawer>` (Add/Edit node)
- Falcon components used: `DrawerComponent` (app-drawer), `OrganizationHierarchyTreeComponent`, `TranslatePipe`
- PrimeNG: `ContextMenuModule`, `InputText`, `TagModule`
- Key methods: `loadRoot()`, `onNodeExpand()`, `onNodeSelect()`, `loadNodeChildren()`, `handleDrawerAction()` (add/rename), `refreshTreePreservingState()`, `restoreExpandedState()`, `expandAlongPath()` (return-from-profile navigation)

### TabsLayoutComponent
- File: `apps/.../tabs-layout/tabs-layout.component.ts:14-225`
- Selector: `app-tabs-layout`
- Standalone: yes
- Inputs: `items`, `totalRecords`, `pageSize`, `loading`, `selectedNodeId`, `canViewAccount`, `canViewOrganization`, `canAddOrganization`, `canAddAccountUser`, `canAddOrgUser`, `canEditAccount`, `canViewUsers`, `selectedNode`, `tabsConfig`
- Outputs: `userSelected`, `addNode`, `addUser`, `makeUpdate`, `pageChange`
- ViewChild: `NodeSettingsTabComponent`, `HierarchyTabComponent`
- State: signals (`selectedNodeSig`, `tabsConfigSig`) + computed signals (`defaultTabsConfig`, `currentTabsConfig`, `isFalconMenuSig`, `isMainMenuSig`)
- Falcon components: `TranslatePipe`, `TabComponentType`
- PrimeNG: `TabsModule`
- Tabs:
  - `0 — Hierarchy` (always enabled)
  - `1 — CommChannels & Services` (only on root selection + `canViewServices`)
  - `2 — Apps & Services` (only on root selection + `canViewServices`)
  - `3 — Settings` (root → `canViewAccountSettings`, child → `canViewOrgSettings`)
- Force-redraw on node change (`forceRedrawTabs()`) — destroys + recreates tab components to clear their internal state

### HierarchyTabComponent
- File: `apps/.../hierarchy-tab/hierarchy-tab.component.ts:28-391`
- Selector: `app-hierarchy-tab`
- Standalone: yes
- Inputs: same as TabsLayout + `isMainMenu`
- Outputs: `userSelected`, `addNode`, `addUser`, `makeUpdate`, `pageChange`
- Services: `SessionProvider`, `TranslateService`, `Helper`, `MessageService`, `InformationService`
- Falcon: `FalconTableComponent`, `T2TableColumn`, `T2RowMenuAction`, `ButtonIconDirective`, `FalconIconComponent`, `Hook`, `ClassificationCategory`, `ClassificationCategoryI18n`, `ClassificationSubCategory`, `ClassificationSubCategoryI18n`, `AuthorityLetterType`, `AuthorityLetterTypeI18n`, `FalconFormValidateDirective`, `UserStatus`
- PrimeNG: `ButtonModule`, `Skeleton`, `Button`
- State: `viewMode: 'users' | 'info'`, `mode: View | Edit`, `accountInfo: AccountInformationModel`, `originalInfoModel` (snapshot for cancel)
- Status badges: `UserStatus` → CSS class map (Active/Pending/Suspended/Locked/Deleted)
- Methods: `onEditInfo()` (switches to info view + loads via `InformationService.get`), `onEdit()` (mode → Edit), `onCancel()` (restores from original), `onSave(form: NgForm)` (`InformationService.update`)

### InformationComponent
- File: `apps/.../hierarchy-tab/components/information/information.component.ts:40-428`
- Selector: `app-information`
- Standalone: yes
- Inputs: `disabled` (default true = read-only), `model` (required), `nodeId`, `classificationCategoryOptions`, `classificationSubCategoryOptions`, `authorityLetterTypeOptions`
- Outputs: `makeUpdate`
- Services: `TranslateService`, `Helper`, `SessionProvider`, `LookupService`, `ChangeDetectorRef`
- Falcon: `FieldComponent`, `FalconStartWithLetterMax30Directive`, `FalconDividerComponent`, `FalconUploaderComponent`, `LOOKUP_IDS`, `LookupValueResponse`
- PrimeNG: `Select`, `InputTextModule`, `AutoComplete`
- ControlContainer: uses `NgForm` of parent (`viewProviders`)
- Sections (`AccessSection` enum):
  - AccountInformation — `accountName`, `accountId`, `financeId`, `classificationCategory`, `classificationSubCategory`
  - AccountOfficial — `entityName`, `authorityLetterType`, `sector`, `budgetNo`
  - Address — `country` (autocomplete), `city` (autocomplete, cascaded on country), `district`, `street`, `buildingNumber`, `postalCode`, `additionalAddress`, `anotherId`, `vatRegistrationNumber`
  - ProfilePicture — handled via `FalconUploaderComponent` w/ base64 conversion
- `canEdit(section)` is user-type aware (`FALCON_USER` can edit AccountInformation; `FALCON_USER` & `CLIENT_USER` can edit AccountOfficial)
- Country lookup → `LOOKUP_IDS.Country`; City lookup → `LOOKUP_IDS.City` with `code` (country code) param

### NodeSettingsTabComponent
- File: `apps/.../tabs-layout/components/node-settings-tab/node-settings-tab.component.ts:31-383`
- Selector: `app-node-settings-tab`
- Standalone: yes
- Inputs: `selectedNodeId`, `selectedNode`
- Outputs: `settingsChanged`
- Services: `ConfirmationService`, `TranslateService`, `SettingsApiService`, `DestroyRef`, `Helper`, `AccessControlFacade`
- Falcon: `FalconFormValidateDirective`, `FalconIpAddressDirective`, `FalconIconComponent`, `TranslatePipe`, `PasswordSecurityLevel`, `PasswordSecurityLevelI18n`, `isValidIpv4`, `isValidIpv6`, `FalconDividerComponent`
- PrimeNG: `RadioButtonModule`, `InputTextModule`, `InputNumberModule`, `ChipModule`, `ButtonModule`
- State: `ClientSettingsModel` (nested: `quotaSettings: QuotaSettingsDto`, `securitySettings: SecuritySettings`), `originalSettingsModel` (cancel snapshot)
- Sections (PBAC-gated):
  - Password Security Level (Normal / Advanced radio)
  - Allowed IPs (chips with add/remove + v4/v6 validation + duplicate check)
  - Quotas (max normal users, max system users, max node levels, balance transfer limit %)

### CommChannelsServicesTabComponent
- File: `apps/.../comm-channels-services-tab/comm-channels-services-tab.component.ts:99-1114`
- Selector: `app-comm-channels-services-tab`
- Standalone: yes
- Inputs: `selectedNodeId`, `selectedNode`
- Outputs: **none**
- Services: `TranslateService`, `MessageService`, `ConfirmationService`, `CommChannelsServicesService`, `SessionProvider`, `Helper`, `CommerceActionsService`, `DestroyRef`, `SimplePollService`, `OrderStatusService`, `ChangeDetectorRef`, `AccessControlFacade`
- Falcon: `FalconTableComponent`, `FalconRowAction`, `FALCON_ACTION_REGISTRY`, `FALCON_ROW_ACTION_I18N_KEY`, `FALCON_STATUS_I18N_KEY`, `FalconItemStatus`, `Helper`, `PricingType`, `FalconIconComponent`, `SvgIconComponent`, `FalconCalendarComponent`, `ProcessState`, `OrderFailureReason`, `GetOrderStatusResponse`, `SimplePollService`, `OrderStatusService`
- PrimeNG: `ButtonModule`, `Select`, `InputNumber`, `ToggleSwitch`, `DialogModule`, `SkeletonModule`, `ToastModule`
- State: rows = `CommChannelServiceItem[]`, edit-context with inline templates (priceType, priceValue), insufficient-balance dialog state
- Columns (Falcon table): visibility toggle (Falcon user only), name, priceType, priceValue, firstActivationDate, activationDate, renewDate, status
- Row actions (dynamic from `availableActions`): DoPayment, Disable, Enable, EditPriceType, EditPriceValue
- Payment flow: confirmation → POST do-payment → switchMap → poll order status via `SimplePollService` (2-second interval, 30-minute timeout) → handle InsufficientFunds (priority dialog) / WalletNotConfigForTheNode / CommChannelPriorityOrderRequired

### AppsServicesTabComponent
- File: `apps/.../apps-services-tab/apps-services-tab.component.ts:100-1103`
- Selector: `app-apps-services-tab`
- Identical structure to `CommChannelsServicesTabComponent` but for `AppServiceItem` (no visibility template difference — same Falcon-user-only column rule)
- Calls `disableApplication / enableApplication / changeApplicationVisibility / changeApplicationPriceType / changeApplicationPriceValue / doPaymentApplication / deleteApplicationNewPriceType / deleteApplicationNewPriceValue` via `CommerceActionsService`

## Insufficient-balance dialogs (app-level shared)
| Component | Selector | Role |
|---|---|---|
| `InsufficientBalancePriorityDialogComponent` | `app-insufficient-balance-priority-dialog` | Lets user drag-drop comm-channel priority order then retry payment |
| `InsufficientBalanceWarningDialogComponent` | `app-insufficient-balance-warning-dialog` | Read-only warning (insufficient funds / wallet not configured) |
