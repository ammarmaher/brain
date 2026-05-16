# Components — wallet-balance-management

## Tree
```
WalletBalanceManagementComponent (selector: app-wallet-balance-management)
├── <falcon-organization-hierarchy-tree>          (left tree panel)
└── <app-balance-transfer> (BalanceTransferComponent — right-side drawer for transfer)
    └── <app-drawer>                              (falcon shared drawer)
```

## Per-component

### WalletBalanceManagementComponent
- File: `apps/admin-console/src/app/features/wallet-balance-management/wallet-balance-management.component.ts:63-885`
- Selector: `app-wallet-balance-management`
- Standalone: yes ([CODE] `:65 standalone: true`)
- Change detection: `OnPush` ([CODE] `:80 changeDetection: ChangeDetectionStrategy.OnPush`)
- Providers: `[MessageService]` (PrimeNG toast) ([CODE] `:77`)
- Inputs/Outputs: none — top-level route component
- Imports ([CODE] `:66-76`): `CommonModule, FormsModule, ToastModule, DecimalPipe, TranslatePipe, SvgIconComponent, FalconIconComponent, OrganizationHierarchyTreeComponent, BalanceTransferComponent`
- Services injected via `inject()` ([CODE] `:88-95`):
  - `WalletBalanceService` (feature service)
  - `MessageService` (PrimeNG toast)
  - `TranslateService` (`@falcon`)
  - `SessionProvider` (`@falcon`) — used to detect FALCON_USER
  - `OrgHierarchyApiService` (sibling feature service)
  - `ChangeDetectorRef`
  - `DestroyRef`
  - `AccessControlFacade` (`@falcon`)
- Forms: **no Reactive Forms** — radio/text inputs are plain `[(ngModel)]` + manual change handlers. The page does NOT use FormBuilder anywhere.
- State management:
  - **RxJS `BehaviorSubject`** for `isLoading$`, `isSaving$`, `selectedCurrency$`, `selectedDistribution$`, `selectedStructure$` ([CODE] `:101-115`)
  - Plain class fields for everything else — including `orgTreeRootNode`, `selectedOrgNode`, `accountInfo`, `channels`, `summary`, `walletTreeNodes`, `expandedKeys`, `canDoActions`, `canSave`, `showTransferDrawer`, `transferContext`, `transferErrorMessage`, `canViewWalletStrategy`, `canEditWalletStrategy`, `canViewMasterWallet`, `canTransferWallet` ([CODE] `:104-131`)
  - **No signals used** (only `BehaviorSubject` + getters that read from them)
- Snapshot/draft maps for unsaved edits: `snapshot = new Map<DraftKey, number | null>()`, `draft = new Map<DraftKey, number | null>()` ([CODE] `:158-159`). Used by `getCellValue` / `setCellValue` / `cancelChanges` / `hasUnsavedChanges`.
- Lifecycle:
  - `ngOnInit` ([CODE] `:166-170`): sets `isFalcon` from session, calls `primeAccess()` (async PES resolution), `loadRoot()` (tree).
  - `initializeDataStream()` ([CODE] `:580-599`): on node select, sets up a `combineLatest([selectedCurrency$, selectedDistribution$, selectedStructure$]).skip(1).distinctUntilChanged()` subscription that triggers `loadWalletData()` on changes.
- Template highlights:
  - `[NgClass]/*ngIf/*ngFor` used throughout — **NOT** `@if / @for` block syntax.
  - `<falcon-organization-hierarchy-tree>` consumed with extensive inputs/outputs (`[showActions]="false"`, `[disableRoot]="false"`, `(nodeSelected)`, …) ([CODE] `wallet-balance-management.component.html:9-25`).
  - Empty state: a 119-line inline SVG illustration ([CODE] `…component.html:107-148`).
  - Skeleton loaders embedded in template with `.wbs__*` classes ([CODE] `…component.html:33-101`, again at `:306-322`).
  - Tree rows rendered with `<ng-template #treeRow let-node let-level>` recursion (`*ngTemplateOutlet`) ([CODE] `…component.html:361-443`).
  - Decimal display uses `number:'1.3-3':'en-US'` (3 fractional digits) — see [[08-RULES-APPLIED]] for context.

#### Falcon shared components consumed by container
- `<falcon-organization-hierarchy-tree>` — left tree (host-shell shared component used directly here)
- `<falcon-icon>` — building icon when no node logo
- `<falcon-svg-icon>` — currency icon, transfer icon, etc. (`SVG_ICON_NAMES.TRANSFER`, `SVG_ICON_NAMES.CURRENCY_SAR`)
- `<p-toast>` (PrimeNG)

#### Public API (used by template)
| Member | Type | Purpose |
|---|---|---|
| `orgTreeNodes` | getter `TreeNode[]` | wraps root for tree input |
| `treeChildrenLabel` | getter `string \| null` | Falcon-user "Clients" label |
| `selectedNodeLabel` | getter `string` | header label |
| `selectedNodeIconUrl` | getter `string \| null` | header avatar |
| `hasSelectedNode` | getter `boolean` | gates main content visibility |
| `accountName` | getter `string` | falls back through `accountInfo.accountName` → selectedNodeLabel → 'Falcon Admin' |
| `accountImage` | getter | accountInfo or selected node icon |
| `isSettingsDisabled` | getter | `!canEditWalletStrategy \|\| !canSave` |
| `hasUnsavedChanges` | getter | diff of draft vs snapshot |
| `isSaveEnabled` | getter | `canEditWalletStrategy && canSave` |
| `isMultipleWallets` | getter | true when `selectedStructure$.value === WalletType.MultipleWallets` |
| `isUserBased` | getter | true when `selectedDistribution$.value === WalletBalanceType.UserBased` |
| `isFalconUser` | getter | `sessionProvider.session?.userType === USER_TYPE_STRINGS.FALCON_USER` |
| `selectedCurrency` | getter | unwrap BehaviorSubject |
| `t(key, params?)` | method | translate shortcut |
| `loadRoot()` | method | fetch root nodes + auto-expand |
| `onNodeExpand(node)` / `onNodeCollapse(node)` / `onNodeSelect(node)` | methods | tree lifecycle |
| `refreshData()` | method | re-fetch wallet data |
| `selectCurrency(v)` / `selectDistribution(v)` / `selectStructure(v)` | methods | radio change handlers |
| `toggleNodeExpansion(node)` | method | toggles per-row expand in wallet tree table |
| `getNodeIcon(node)` / `isSvgIcon(icon)` | methods | icon helpers |
| `shouldShowInput(node)` / `isCellEditable(node)` / `isCellDisabled(node, channelId?)` | methods | row UI gating |
| `getCellValue(node, channelId?)` / `setCellValue(node, value, channelId?)` | methods | draft store accessors |
| `onInputBlur(event, node, channelId?)` | method | parse + commit (note: parseFloat + comma strip) |
| `getChannelTotal(channelId)` / `hasAccountChannelWallet(channelId)` / `hasNodeChannelWallet(node, channelId)` | methods | channel helpers |
| `cancelChanges()` | method | revert draft to snapshot |
| `saveChanges()` | async method | save wallet strategy |
| `onTransferClick(node)` / `onMasterWalletTransferClick()` / `onTransferDrawerClose()` / `onTransferCancel()` / `onTransferSubmit(req)` | methods | transfer flow |

---

### BalanceTransferComponent
- File: `apps/admin-console/src/app/features/wallet-balance-management/components/balance-transfer/balance-transfer.component.ts:32-700`
- Selector: `app-balance-transfer`
- Standalone: yes ([CODE] `:34`)
- Change detection: default (no `ChangeDetectionStrategy` set — manual `cdr.markForCheck()` calls regardless)
- Imports ([CODE] `:35-45`): `CommonModule, FormsModule, AutoCompleteModule, SelectModule, InputTextModule, InputNumberModule, TextareaModule, DrawerComponent, TranslatePipe`
- @Inputs ([CODE] `:62-65`):
  - `visible: boolean = false`
  - `context: ITransferContext | null = null`
  - `isSaving: boolean = false`
  - `errorMessage: string | null = null`
- @Outputs ([CODE] `:67-69`):
  - `visibleChange: EventEmitter<boolean>` (two-way binding)
  - `transfer: EventEmitter<ITransferRequest>` (the actual submit signal)
  - `cancelTransfer: EventEmitter<void>`
- Services injected ([CODE] `:55-56`): `TranslateService`, `ChangeDetectorRef`
- Forms: `[(ngModel)]`-only; **no Reactive Forms**; validity computed in `get isFormValid` ([CODE] `:134-167`).
- State ([CODE] `:75-90`): `selectedSourceEntity / selectedSourceWallet / selectedDestinationEntity / selectedDestinationWallet / transferAmount / transferDescription / sourceSuggestions / destinationSuggestions / filteredDestinationEntities / filteredSourceWallets / filteredDestinationWallets / isDestinationWalletLocked / showSourceWallet / showDestinationWallet`.
- Initial snapshot for dirty-check ([CODE] `:100-108`): `initialFormState` — used by `hasFormChanges` getter ([CODE] `:198-208`).
- Lifecycle:
  - `ngOnInit` → `initializeForm()`
  - `ngOnChanges(visible | context)` → re-`initializeForm()` ([CODE] `:117-124`)
- Search handlers (PrimeNG AutoComplete): `searchSourceEntities(event)` ([CODE] `:244-253`), `searchDestinationEntities(event)` ([CODE] `:255-258`)
- Selection handlers: `onSourceEntitySelect`, `onDestinationEntitySelect`, `onSourceEntityClear`, `onDestinationEntityClear`, `onSourceEntityChange`, `onSourceWalletChange`, `onDestinationEntityChange`
- Business-rule engine (private methods):
  - `updateDestinationEntities()` ([CODE] `:391-455`) — large rule-based filter (Master → CommChannel only in multiple-wallet mode; CommChannel → Master/Node/User in same channel; Node/User → Master/CommChannel/peer Node/User in same channel)
  - `isTransferPathValid()` ([CODE] `:457-490`) — final-gate validator before form is considered valid
  - `filterByBalanceType()` / `applyBalanceTypeFilterToNodes()` / `applyBalanceTypeFilter()` — implement Rule A (NodeBased → Org/Service only; UserBased → User only)
  - `updateSourceWallets()` / `autoSelectSourceWallet()` / `updateDestinationWallets()` — wallet-selection logic for multiple-wallet mode (locks destination channel when source channel is set)
  - `buildTransferEndpoint(entity, wallet)` ([CODE] `:652-681`) — converts UI selection into `ITransferEndpoint { walletId, channelId }` sent to backend
- Template highlights ([CODE] `balance-transfer.component.html`):
  - Wraps a PrimeNG-based form in `<app-drawer>` from `@falcon` (template content via `[templateContent]="transferFormTpl"`)
  - PrimeNG `p-autoComplete` for source + destination entity pickers
  - PrimeNG `p-select` for source + destination wallet pickers (with locked-wallet display when channel-pinned)
  - PrimeNG `p-inputNumber` (`min=0.01`, `mode=decimal`, `minFractionDigits=2`, `maxFractionDigits=2`)
  - Plain `<textarea pInputTextarea>` for description (mandatory display via `*ngIf="isDescriptionRequired"`)
  - Error banner `<div class="bt-error">` driven by `errorMessage` input

---

### Shared component consumed: `<falcon-organization-hierarchy-tree>`
- Library file: `libs/falcon/src/shared-ui/lib/components/organization-hierarchy-tree/organization-hierarchy-tree.component.ts`
- Inputs used (verbatim from container template): `loading`, `nodes`, `loadingChildrenIds`, `selectedNodeKey`, `expandedKeys`, `enableRightClick`, `showActions`, `disableRoot`, `showFalconExpandArrow`, `showRootFalcon`, `rootChildrenLabel`, `showExpandArrow`
- Outputs used: `nodeExpandRequested`, `nodeCollapseRequested`, `nodeSelected`

---

### Shared component consumed: `<app-drawer>` (`DrawerComponent` from `@falcon`)
- Inputs used by `BalanceTransferComponent.html:1-12`: `show` (two-way), `position`, `headerName`, `isEdit`, `disableSave`, `disableCancel`, `templateContent`
- Outputs used: `onCancel`, `onClose`, `onAction`
