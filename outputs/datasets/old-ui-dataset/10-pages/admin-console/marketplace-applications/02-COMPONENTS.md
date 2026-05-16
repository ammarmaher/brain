# Components — marketplace-applications

## Tree
```
MarketplaceApplicationsComponent  (selector: app-marketplace-applications)
├── p-toast                                       [PrimeNG]   — feedback messages
├── ng-template #priceValueCellTpl               — currency-sar icon + formatted number cell
├── ng-template #editPriceValueTpl               — inline editor: p-inputNumber + Save/Cancel
├── ng-template #editPriceTypeTpl                — inline editor: p-select + falcon-calendar + Save/Cancel
├── ng-template #visibilityTpl                   — p-toggleswitch per row
├── ng-template #detailsRowTpl                   — expandable row showing pending priceType/priceValue change with edit/delete
│
├── OrganizationHierarchyTreeComponent           (selector: falcon-organization-hierarchy-tree)  [@falcon]    — left tree panel (30%)
│
├── FalconTableComponent                          (selector: falcon-table)                       [@falcon]    — right table (70%)
│   ├── visibilityTpl                                  (column 'visibility' — gated by canManageVisibility)
│   ├── 'name' field column
│   ├── 'pricingType' field column (with detailsNotchColumn pointer)
│   ├── priceValueCellTpl column
│   ├── 3 date columns (firstActivationDate, activationDate, renewDate)
│   ├── status render column
│   ├── rowMenuActions:  DoPayment | Disable | Enable | EditPriceType | EditPriceValue  (filtered by PES + row.allowedActions)
│   ├── detailsTemplate: detailsRowTpl  (visible when row.details !== null)
│   └── inlineRowTemplate: editPriceTypeTpl OR editPriceValueTpl  (opened by row-menu action)
│
├── InsufficientBalancePriorityDialogComponent   (selector: app-insufficient-balance-priority-dialog)  [shared/]
└── InsufficientBalanceWarningDialogComponent    (selector: app-insufficient-balance-warning-dialog)   [shared/]
```

## Per-component

### MarketplaceApplicationsComponent
- File: `apps/admin-console/src/app/features/marketplace-applications/marketplace-applications.component.ts:102-1248`
- Selector: `app-marketplace-applications`, standalone, `providers: [MessageService]`. **No `ChangeDetectionStrategy.OnPush` declared** — uses Default change detection.
- Imports (lines 79-97): `CommonModule, FormsModule, ButtonModule, ToggleSwitch (primeng), InputNumber (primeng), FalconTableComponent (@falcon), TranslatePipe, FalconIconComponent, SvgIconComponent, FalconCalendarComponent, Select (primeng), OrganizationHierarchyTreeComponent (@falcon), DialogModule (primeng), SkeletonModule (primeng), InsufficientBalancePriorityDialogComponent, InsufficientBalanceWarningDialogComponent, ToastModule (primeng)`.
- Inputs: none
- Outputs: none
- ViewChild references (lines 123-139): `editPriceValueTpl`, `detailsRowTpl`, `editPriceTypeTpl`, `visibilityTpl`, `priceValueCellTpl`, `falconTable`.
- Services injected (lines 107-119): `TranslateService`, `MessageService` (primeng), `ConfirmationService` (primeng), `MarketplaceApplicationsService`, `SessionProvider`, `Helper` (@falcon), `CommerceActionsService`, `OrgHierarchyApiService`, `ChangeDetectorRef`, `DestroyRef`, `SimplePollService`, `OrderStatusService`, `AccessControlFacade`.

#### State (verbose — 50+ fields)
**Tree state:**
- `rootNode: TreeNode | null` (PrimeNG TreeNode)
- `selectedNodeId: string | null`, `selectedNode: TreeNode | null`
- `loadingRoot`, `loadingChildrenIds: Set<string>`, `loadedChildrenIds: Set<string>`
- `expandedKeys: Record<string, boolean>`
- `isFalcon: boolean` (derived from session)

**Table state:**
- `items: AppServiceItem[]`
- `loading: boolean`
- `columns: T2TableColumn<AppServiceItem>[]`
- `rowMenuActions: T2RowMenuAction<AppServiceItem>[]`

**Payment processing state:**
- `isProcessing: boolean`, `processingRowId: string | null`, `loadingRowIds: (string|number)[]`
- `orderStatus?: GetOrderStatusResponse | null`
- `showInsufficientBalanceDialog: boolean`, `showInsufficientBalanceWarning: boolean`, `insufficientBalanceWarningMessage: string | null`
- `errorMsg?: string | null`
- `currentPaymentRow: AppServiceItem | null`
- `hasShownPaymentSuccess: boolean` (deduplicates the success toast across polling completions)

**Inline-edit state:**
- `editingRowId: string | null`, `editMode: 'priceType' | 'priceValue' | null`
- `editingPriceType: PricingType | null`
- `editingEffectiveDate: Date | null`
- `editingPriceValue: number | null`
- `editCtx: { target, type, row, detailItem } | null` — context for details-row pen/trash actions
- `priceTypeOptions: Hook<number>[]` (derived from `PricingType` enum)
- `isSaving: boolean`, `visibilitySavingIds: Set<string>`

**PES flags:**
- `canManageVisibility: boolean`, `canDoPayments: boolean`, `canEditPriceType: boolean`, `canEditPriceValue: boolean`

#### Lifecycle
- `ngOnInit()` (line 202-212): sets `isFalcon`, builds `priceTypeOptions` from enum, calls `initializeColumns()`, `primeAccess()` (PES), `loadRoot()` (tree).
- `ngAfterViewInit()` (line 214-218): `initializeRowMenuActions()` if items already loaded.
- `ngOnDestroy()` (line 220-223): completes `destroy$: Subject<void>` (unused; subscriptions actually use `takeUntilDestroyed(destroyRef)`).

#### Key public methods
- `loadRoot()` (252-340) — load tree, auto-expand root if has children, auto-select first child.
- `onNodeExpand`, `onNodeCollapse`, `onNodeSelect` — tree wiring.
- `onDisable(row)`, `onEnable(row)` (367-402, 532-567) — visibility wrappers.
- `onVisibilityChange(row)` (569-612) — debounced (single in-flight per row via `visibilitySavingIds`).
- `onDoPayment(row, commChannelPriorityIds?)` (404-515) — primary action; see "Payment flow" below.
- `onEditDetail(detailItem, row)` (623-662) — opens inline editor on a pending change row.
- `onDeleteDetail(detailItem, row)` (668-692) — confirms then deletes pending change.
- `onSaveEdit()` (694-813) — submits the inline editor based on `editMode`.
- `onInsufficientBalanceDialogClose`, `onInsufficientBalanceProceed(commChannelPriorityIds)` — dialog hooks.

#### Payment flow (`onDoPayment` — 404-515)
1. Validate `canDoPayments` PES flag.
2. Set `isProcessing = true`, push row id into `loadingRowIds`, reset error state, set `currentPaymentRow`.
3. Build `DoPaymentApplicationRequest` (accountId + applicationId + optional `commChannelPriorityIds` from priority dialog).
4. Call `commerceActions.doPaymentApplication(payload)` → switchMap into `SimplePollService.watch({ serviceMethod: () => OrderStatusService.getOrderStatus(orderId), intervalSeconds: 2, maxDurationMinutes: 30, shouldStop: x => Completed | Failed })`.
5. Each poll tick updates `orderStatus` and dispatches:
   - **Completed** → toast success (once, via `hasShownPaymentSuccess` guard), `loadData()` refresh.
   - **Failed + WalletNotConfigForTheNode** → warning dialog with `warning.walletNotConfigured` translation.
   - **Failed + CommChannelPriorityOrderRequired** → priority dialog (drag-drop reorder). User submits ordered ids and we re-call `onDoPayment` with `commChannelPriorityIds`.
   - **Failed + InsufficientFunds** → warning dialog with no specific message.
   - **Failed + other** → error toast.
6. Polling cancelled via `takeUntilDestroyed(this.destroyRef)`.

#### Falcon Table integration
- `T2TableColumn<AppServiceItem>` typings from `@falcon`.
- `T2RowMenuAction<AppServiceItem>` typings from `@falcon`.
- `FalconRowAction` enum (DoPayment=1, Disable=2, Enable=3, EditPriceType=4, EditPriceValue=5).
- `FALCON_ACTION_REGISTRY[actionEnum]` → `{ icon, ... }` lookup.
- `FALCON_ROW_ACTION_I18N_KEY[actionEnum]` → translation key.
- `FALCON_STATUS_I18N_KEY[FalconItemStatus]` → translation key.
- Actions are filtered by **both** PES (computed at `primeAccess`) AND `row.allowedActions: FalconRowAction[]` from backend (line 1032-1043). [INFERRED] This double-gate means UI shows the menu item only when the user has the permission AND the backend says the action is allowed for that row.
- Inline editors are opened by registering `inlineTemplate` on the row-menu action (lines 991-1000).
- Details-row (expandable) is configured via `detailsTemplate` + `detailsVisible` predicate (lines 1051-1057) + `detailsNotchColumn: 'pricingType'` in template (line 355).

#### `initializeColumns` (915-972)
8 columns built: visibility (if `canManageVisibility`), name, pricingType, priceValue, firstActivationDate, activationDate, renewDate, status. Widths fixed for status (100px) and visibility (100px). Date columns render via `helper.getDateFromStringOrDash(...)`.

### Shared dialog components

#### InsufficientBalancePriorityDialogComponent
- File: `apps/admin-console/src/app/shared/components/insufficient-balance-priority-dialog/insufficient-balance-priority-dialog.component.ts:34-150+`
- Selector: `app-insufficient-balance-priority-dialog`, standalone, OnPush, `styleUrls: [...]` (SCSS used).
- Imports: `CommonModule, DialogModule, ButtonModule, SkeletonModule, DragDropModule (CDK)`.
- Inputs: `[visible]: boolean` required, `[nodeId]: string` required.
- Outputs: `(visibleChange): boolean`, `(proceedPayment): CommChannelPriority[]`.
- State: `loading`, `submitting`, `channels: VisibleCommunicationChannelResponse[]`.
- On show: `CommunicationChannelsApiService.getVisibleChannels(nodeId)` → sorted by `PriorityOrder`.
- User drags rows to reorder, presses confirm → emits ordered array `[{ commChannelPriorityId: number, channelId: string }]`.

#### InsufficientBalanceWarningDialogComponent
- File: `apps/admin-console/src/app/shared/components/insufficient-balance-warning-dialog/insufficient-balance-warning-dialog.component.ts:25-45`
- Selector: `app-insufficient-balance-warning-dialog`, standalone, OnPush.
- Imports: `CommonModule, DialogModule, ButtonModule, TranslatePipe`.
- Inputs: `[visible]: boolean` required, `[message]: string | null`.
- Output: `(visibleChange): boolean`.
- Pure UI dialog with OK button.

### Falcon components used (imported from `@falcon`)
- `FalconTableComponent` (`<falcon-table>`)
- `OrganizationHierarchyTreeComponent` (`<falcon-organization-hierarchy-tree>`)
- `FalconIconComponent`, `SvgIconComponent`
- `FalconCalendarComponent` (with `useEffectiveDateValidation` directive activated)
- `TranslatePipe`

### PrimeNG components used (direct)
- `p-toast`
- `p-toggleswitch`
- `p-inputNumber`
- `p-select`
- `p-button`
- `p-dialog`
- `p-skeleton`

### `ChangeDetectionStrategy.OnPush` is NOT used here
[CODE] The `@Component({...})` decorator at line 76 of `marketplace-applications.component.ts` does **not** set `changeDetection`. Defaults to `Default`. The component still manually calls `cdr.markForCheck()` / `cdr.detectChanges()` in many places — suggesting the author migrated from OnPush or planned to. The shared dialogs ARE OnPush.

## Inline templates used as cell renderers (advanced Falcon Table feature)
The component declares 5 `<ng-template #*>` blocks at the top of its HTML (lines 1-115) and registers them via `@ViewChild` references. The Falcon Table picks them up as:
- **`column.template`** — replaces a cell's renderer.
- **`column.render`** — alternative — returns a plain string.
- **`rowMenuAction.commands[].inlineTemplate`** — replaces the row inline (closes the row's content area) with an editor that has `let-row let-close="close" let-mode="mode"`.
- **`detailsTemplate`** — replaces the expanded-row content (visible when `detailsVisible(row)` returns true).

This is a Falcon-table-specific protocol. **The new theme will need this same protocol shape** for the inline editor + details-row expansions.
