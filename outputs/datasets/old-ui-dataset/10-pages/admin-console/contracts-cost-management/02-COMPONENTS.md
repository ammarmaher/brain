# Components — contracts-cost-management

## Tree
```
ContractsCostManagementComponent  (selector: app-contracts-cost-management)
├── ContractsAccountsPanelComponent   (selector: app-contracts-accounts-panel)              [shared/]
├── ContractsEmptyStateComponent      (selector: app-contracts-empty-state)                 [shared/]   — placeholder when no node
├── ContractsNodeHeaderComponent      (selector: app-contracts-node-header)                 [shared/]   — header with action slot
│
├── ContractsAddWizardComponent       (selector: app-contracts-add-wizard)                  — mode === 'add'
│   ├── DynamicStepperComponent       (selector: dynamic-stepper)                           [@falcon]
│   ├── FalconCalendarComponent       (selector: falcon-calendar)                           [@falcon]   — Step 1 (dates)
│   ├── ContractsNumberInputComponent (selector: app-contracts-number-input)                — Step 1 (committed value)
│   ├── ContractsRateCardSectionComponent       (selector: app-contracts-rate-card-section)             — Step 2
│   ├── ContractsContractDetailsSectionComponent(selector: app-contracts-contract-details-section)      — Step 3
│   └── ContractsAddonsSectionComponent         (selector: app-contracts-addons-section)                — Step 4
│
├── ContractsViewContractComponent    (selector: app-contracts-view-contract)               — mode === 'view'
│   ├── ContractsRateCardSectionComponent          (editable=false)
│   ├── ContractsContractDetailsSectionComponent   (editable=false)
│   └── ContractsAddonsSectionComponent            (editable=false)
│
├── ContractsEditContractComponent    (selector: app-contracts-edit-contract)               — mode === 'edit'
│   ├── FalconCalendarComponent                                                             [@falcon]
│   ├── ContractsNumberInputComponent
│   ├── ContractsRateCardSectionComponent          (editable=true)
│   ├── ContractsContractDetailsSectionComponent   (editable=true)
│   └── ContractsAddonsSectionComponent            (editable=true)
│
├── ContractsDataTableComponent       (selector: app-contracts-data-table)                  — mode === 'list' (table of rows)
├── PrimaryButtonComponent            (selector: app-primary-button)                        [shared/]
└── SecondaryButtonComponent          (selector: app-secondary-button)                      [shared/]
```

## Per-component

### ContractsCostManagementComponent
- File: `apps/admin-console/src/app/features/contracts-cost-management/contracts-cost-management.component.ts:57-355`
- Selector: `app-contracts-cost-management`, standalone, `ChangeDetectionStrategy.OnPush`
- Inputs: none
- Outputs: none
- Services injected: `TranslateService` (`@falcon`), `ContractsApiService`, `DestroyRef`, `ChangeDetectorRef`
- ViewChild: `ContractsEditContractComponent` (calls `.submit()` from header save button)
- State (plain class fields; **not signals**):
  - `selectedNodeId: string | null`, `selectedNode: TreeNode | null` (PrimeNG TreeNode)
  - `currentContract: ContractDetails | null`
  - `walletStrategy: WalletStrategySettings | null`
  - `mode: 'list' | 'add' | 'view' | 'edit'` — drives template `@if`/`@else if` chain
  - `rows: ContractRow[]`, `loadingList`, `loadingContract`, `pageError: string | null`
- Mode transitions:
  - `onNodeSelect(node)` → mode = `'list'`, `forkJoin({walletStrategy, contracts})`
  - `onAddContract()` → mode = `'add'` (guarded: `isWalletStrategyConfigured`)
  - `onViewContract(row)` → mode = `'view'` + `getContract(row.id)`
  - `onViewEdit()` → mode = `'edit'` (guarded: `currentContract.canEdit`)
  - `onContractCreated`/`onContractUpdated` → mode = `'view'` + `refreshList()`
- Table columns built in `buildColumns()` (lines 261-322): 9 columns — id, name, farabi-ref, creation, start, expiration, value, remaining, status. Date format: `Intl.DateTimeFormat(locale, {day:'2-digit', month:'short', year:'numeric'}).format(...).replace(/ /g,'-')`. Locale = `'ar'` for RTL else `'en-US'` (lines 348-354).
- Row class hook `contractRowClass(row)` (190-199): pending → `bg-falcon-green-25`, expired → `bg-falcon-lilac-25`.
- Falcon components used: `TranslatePipe`. No `<falcon-table>` — uses local `<app-contracts-data-table>`.

### ContractsAddWizardComponent
- File: `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-add-wizard/contracts-add-wizard.component.ts:54-326`
- Selector: `app-contracts-add-wizard`, standalone, OnPush
- Inputs (decorator-style, NOT `input()`): `[accountId]` required, `[nodeTitle]` required, `[nodeIconUrl]`, `[walletSettings]`
- Outputs: `(cancel)`, `(saved)` emits `ContractDetails`
- Services injected: `TranslateService`, `ContractsApiService`, `DestroyRef`, `ChangeDetectorRef`
- State:
  - `currentStep = 0`, `loadingLookups`, `saving`, `errorMessage`
  - `applicationOptions`, `channelOptions: ContractsSelectOption[]`
  - `form: ContractFormValue = createEmptyContractForm()` — **ngModel-driven**, not Reactive Forms
- `stepperConfig: StepperConfig` (lines 78-94) — 4 steps: contractInformation / rateCard / contractDetails / addons. `allowNavigation: false`, `disableBackButtonOnFirstStep: true`.
- `isCurrentStepValid` getter (lines 118-139) — dispatches to `isContractInfoValid` / `areUnitConversionsValid` / `isRateMatrixValid` / `areAddonsValid`.
- Lookup load (lines 141-171): `forkJoin({applications, channels})` on `ngOnChanges` when `accountId` or `walletSettings` change. On success: `form.unitConversions = createUnitConversionsForChannels(channels, this.form.unitConversions)`.
- Save: `contractsApi.createContract(accountId, form)` → emit `(saved)`.

### ContractsEditContractComponent
- File: `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-edit-contract/contracts-edit-contract.component.ts:52-291`
- Selector: `app-contracts-edit-contract`, OnPush
- Inputs: `[contract]` required, `[accountId]` required, `[walletSettings]`
- Outputs: `(saved)` emits `ContractDetails`
- Tabs (state field `activeTab: EditTabKey`): `contractInformation | rateCard | contractDetails | addons`
- `hasRestrictedCommercialFields` (line 122-124): when contract status is `'active'` or `'expired'`, commercial fields render with disabled-style class `commercialFieldInputClass` (lines 126-130, with `!important` Tailwind utilities).
- `submit()` (lines 132-156) is called externally via `@ViewChild` from container (no internal save button).
- Restricted-field comment in code (lines 76-79): *"Keep derived date objects stable. Binding a calendar CVA to a getter that creates `new Date(...)` on every change-detection pass can continuously rewrite the child ngModel and freeze the page when edit mode renders."*

### ContractsViewContractComponent
- File: `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-view-contract/contracts-view-contract.component.ts:30-231`
- Selector: `app-contracts-view-contract`, OnPush
- Inputs: `[contract]` required
- Outputs: none
- Builds **filtered** rate matrix per (application × channel) via `createRateMatrixForSelection` — lines 179-208, comment: *"Building from all rates can mix WhatsApp and Voice priorities, which leaves the selected grid cells empty until the user changes channel."*
- Status pill classes (lines 137-146): pending → neutral-300 border + neutral-75 bg; expired → red-300+75; active → teal-900 border + green-150 bg.

### ContractsRateCardSectionComponent
- File: `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-rate-card-section/contracts-rate-card-section.component.ts:14-71`
- Selector: `app-contracts-rate-card-section`, OnPush
- Inputs: `[rows]: ContractUnitConversionRow[]` required, `[editable] = true`
- Channel-specific price-unit lock: `priceUnitOptionsFor(row)` — returns only the matching unit if catalog has one (WhatsApp must be ONE_KSA_TRANSACTION, Voice must be ONE_KSA_SECOND, AI-ChatGPT must be ONE_API_CALL).
- `ngOnChanges` (lines 35-48) auto-corrects `row.priceUnit` to the catalog-required value on every input change. Comment: *"Unit conversion is channel-specific: WhatsApp cannot be priced by seconds or API calls, Voice cannot be priced by transactions, etc."*

### ContractsContractDetailsSectionComponent (rate matrix)
- File: `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-contract-details-section/contracts-contract-details-section.component.ts:23-107`
- Selector: `app-contracts-contract-details-section`, OnPush
- Inputs: `[matrix]: ContractRateMatrixState` required, `[rates]`, `[unitConversions]` required, `[applicationOptions]`, `[channelOptions]`, `[currencyCode] = 'SAR'`, `[editable] = true`
- The grid is application × channel selectors driving a `rows[].cells[]` 2D matrix of `(priority, destination) → ratePerUnit`.
- Sync flow: on rate change → `syncRateMatrixIntoRates(rates, matrix)` mutates the parent `rates` array in-place via `splice(0, length, ...syncedRates)` (line 96).

### ContractsAddonsSectionComponent
- File: `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-addons-section/contracts-addons-section.component.ts:23-162`
- Selector: `app-contracts-addons-section`, OnPush
- Inputs: `[quotas]: ContractQuotaRow[]` required, `[overageRates]: ContractOverageRateRow[]` required, `[channelOptions]`, `[editable] = true`
- Catalog-driven: filters `CONTRACT_ADDON_CATALOG` by `isChannelAvailable(channelCode)`.
- `valueKind` per addon: `'amount'` (writes `includedAmount`) vs `'units'` (writes `includedUnits`). Mutates `quotas` array in-place via `splice(...)`.
- Overage rates filtered to entries with `billingCycle` set (line 39).

### ContractsNumberInputComponent
- File: `apps/admin-console/src/app/features/contracts-cost-management/components/contracts-number-input/contracts-number-input.component.ts:27-112`
- Selector: `app-contracts-number-input`, OnPush, inline template
- Inputs: `[value]: number | null = null`, `[suffix] = ''`, `[decimals] = 6`, `[min]: number | null = 0`, `[disabled] = false`
- Outputs: `(valueChange): number | null`
- On focus → strip thousands separators for editing; on blur → re-format with `Intl.NumberFormat('en-US', {maximumFractionDigits: this.decimals})`. NOT a `ControlValueAccessor` — manual binding via Input/Output.

### Shared components

#### ContractsAccountsPanelComponent (`shared/components/contracts-accounts-panel/`)
- Selector: `app-contracts-accounts-panel`, OnPush, imports `NgClass`, `FalconIconComponent`
- Output: `(nodeSelected): TreeNode`
- Loads `OrgHierarchyApiService.getRootNodes()` then `getChildren()`; flattens to single-level account list (every child marked `leaf: true`, `hasChildren: false`).
- Auto-selects first visible node on load (line 165-172).
- For Falcon users (`session.userType === USER_TYPE_STRINGS.FALCON_USER`), uses synthetic `FALCON_ROOT_NODE` and panel title `common.falconClients`.

#### ContractsDataTableComponent (`shared/components/contracts-data-table/`)
- Selector: `app-contracts-data-table`, OnPush, imports `NgClass, NgStyle`
- Inputs: `title`, `columns: ContractsTableColumn[]`, `rows`, `rowKey`, `rowClass`, `pageSize = 10`, `actionLabel`, `actionsHeader`, `emptyLabel`
- Outputs: `(rowSelected)`, `(actionSelected)`
- Custom paginator (no PrimeNG `p-paginator`), single overflow-menu per row triggered by 3-dot action.
- Closes overflow menus on document click (HostListener).

#### ContractsNodeHeaderComponent / ContractsEmptyStateComponent
- Both trivial — title/iconUrl/message inputs.

#### PrimaryButtonComponent / SecondaryButtonComponent
- File: `apps/admin-console/src/app/shared/components/primary-button/primary-button.component.ts:9-43`
- Inputs: `[disabled]`, `[type]: 'button' | 'submit' | 'reset' = 'button'`
- Output: `(pressed): MouseEvent`
- Inline templates with hard-coded Tailwind utility classes for primary/secondary visual states.

## Standalone / module status
All components above are `standalone: true`. No NgModules in this feature.
