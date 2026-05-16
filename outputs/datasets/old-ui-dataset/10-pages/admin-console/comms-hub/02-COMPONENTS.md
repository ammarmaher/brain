# Components — comms-hub

## Tree

```
CommsHubComponent (app-comms-hub)
├── <falcon-organization-hierarchy-tree>     [from libs/falcon]
│     (left 30% — tree picker for hierarchy node)
├── <falcon-table #falconTable>              [from libs/falcon]
│     ├── ng-template #priceValueCellTpl     (cell renderer for price-value column)
│     ├── ng-template #editPriceTypeTpl      (inline editor — opened via FalconRowAction.EditPriceType)
│     ├── ng-template #editPriceValueTpl     (inline editor — opened via FalconRowAction.EditPriceValue)
│     ├── ng-template #detailsRowTpl         (sub-row showing pending price-type/value changes + edit/delete icons)
│     └── ng-template #visibilityTpl         (toggle switch column for show/hide channel)
├── <app-insufficient-balance-priority-dialog>   [from apps/admin-console/src/app/shared/components]
│     (drag-drop reorder of visible channels + Proceed → re-runs onDoPayment with priorities)
└── <app-insufficient-balance-warning-dialog>    [from apps/admin-console/src/app/shared/components]
      (info dialog with single OK button)
```

Skeleton + brand-header + empty-state SVG live in the same template; no per-state child component.

## Per-component

### CommsHubComponent

- File: `apps/admin-console/src/app/features/comms-hub/comms-hub.component.ts:76-1264`
- Selector: `app-comms-hub`
- Standalone: `true` (`comms-hub.component.ts:78`)
- Change detection: default (no `OnPush`)
- Providers (component-level): `MessageService` ([CODE] line 98)
- Imports (line 79-97): `CommonModule`, `FormsModule`, `ButtonModule`, `Select`, `FalconCalendarComponent`, `InputNumber`, `FalconTableComponent`, `TranslatePipe`, `FalconIconComponent`, `SvgIconComponent`, `ToggleSwitch`, `OrganizationHierarchyTreeComponent`, `DialogModule`, `SkeletonModule`, `InsufficientBalancePriorityDialogComponent`, `InsufficientBalanceWarningDialogComponent`, `ToastModule`
- Lifecycle hooks: `OnInit`, `OnDestroy`, `AfterViewInit`
- Inputs: none (this is a routed page component)
- Outputs: none
- Services injected (via `inject()`, lines 107-119):
  - `TranslateService` — i18n
  - `MessageService` (PrimeNG) — toast notifications
  - `ConfirmationService` (PrimeNG) — payment confirm + delete confirm
  - `CommsHubService` — local list/update API (only list endpoint actually used)
  - `SessionProvider` — `userType`, `tenantId`, `client_id`
  - `Helper` — date format/parse, enum-to-options, pricing label
  - `CommerceActionsService` — actual CRUD façade (commerce gateway)
  - `OrgHierarchyApiService` — tree node loading
  - `ChangeDetectorRef` — manual CD in tree async paths
  - `DestroyRef` — for `takeUntilDestroyed`
  - `SimplePollService` — poll order status during do-payment
  - `OrderStatusService` — get order status endpoint
  - `AccessControlFacade` — PES capability resolution

#### ViewChildren / Template refs

| Field | TemplateRef type | Source line |
|---|---|---|
| `editPriceTypeTpl` | `FalconInlineRowContext<CommChannelServiceItem>` | 124-125 |
| `editPriceValueTpl` | `FalconInlineRowContext<CommChannelServiceItem>` | 127-128 |
| `detailsRowTpl` | `FalconDetailsRowContext<CommChannelServiceItem>` | 130-131 |
| `visibilityTpl` | `FalconCellContext<CommChannelServiceItem>` | 133-134 |
| `priceValueCellTpl` | `FalconCellContext<CommChannelServiceItem>` | 135-136 |
| `falconTable` | `FalconTableComponent<CommChannelServiceItem>` | 138-139 |

#### State

Tree state (lines 169-176): `rootNode`, `selectedNodeId`, `selectedNode`, `loadingRoot`, `loadingChildrenIds`, `loadedChildrenIds`, `expandedKeys`, `isFalcon`.

Table state (lines 179-182): `items: CommChannelServiceItem[]`, `loading`, `columns: T2TableColumn[]`, `rowMenuActions: T2RowMenuAction[]`.

Payment processing state (lines 185-193): `isProcessing`, `processingRowId`, `loadingRowIds`, `orderStatus`, `showInsufficientBalanceDialog`, `showInsufficientBalanceWarning`, `insufficientBalanceWarningMessage`, `errorMsg`, `currentPaymentRow`.

Edit state (lines 198-211): `editingRowId`, `editingPriceType`, `editingEffectiveDate`, `editingPriceValue`, `editMode`, `editCtx`.

PES flags (lines 219-222): `canManageVisibility`, `canDoPayments`, `canEditPriceType`, `canEditPriceValue` — populated by `primeAccess()` (line 1252-1262).

#### Template highlights

- Toolbar: there is no separate toolbar. The header is a `brand-header` div (line 300-313) showing the selected node logo + label.
- Empty-state: large SVG illustration when `!hasSelectedNode` (line 245-295) with translated title / message keys `common.selectNode` / `common.selectNodeMessage`.
- Skeleton loader: when `loading`, renders a 1-bar header + 8-row table skeleton (line 316-336).
- The `<falcon-table>` is configured with:
  - `[rowsPerPage]="10"` — fixed page size
  - `[showFilters]="false"` — no filter bar
  - `[showSettings]="false"` — no column settings
  - `[enableRowRightClickActions]="true"` — right-click opens row menu
  - `[paginator]="true"`
  - `[selectable]="false"` — no row selection
  - `[detailsTemplate]`/`[detailsVisible]` — pending price-change sub-row
  - `[showDetailsToggle]="true"` + `[detailsNotchColumn]="'pricingType'"`
  - `[loadingRowIds]` — driven by payment-processing row id
- Dark-mode + RTL + responsive-768px breakpoints are present in SCSS (line 226-275 of `.scss`).

#### Key methods

- `loadRoot()` — `comms-hub.component.ts:276-364`: pulls root nodes via `OrgHierarchyApiService.getRootNodes()`, auto-substitutes `FALCON_ROOT_NODE` for Falcon users, expands root and loads first level of children, auto-selects first child (or root itself if no children).
- `onNodeSelect()` — line 378-382: sets `selectedNodeId/Node` and triggers `loadData()`.
- `loadData()` — line 1111-1142: calls `CommsHubService.getList(nodeId)`, populates `items`, re-initializes row menu actions.
- `onDoPayment()` — line 444-555: 3-stage flow — POST `comm-channel/do-payment` → poll `Node/order/{orderId}/status` every 2 s (max 30 min) via `SimplePollService` → branch on `OrderFailureReason` to show priority dialog (CommChannelPriorityOrderRequired), warning dialog (InsufficientFunds or WalletNotConfigForTheNode), or success/failure toast.
- `onVisibilityChange()` — line 613-656: optimistic toggle → POST visibility → revert on error.
- `onSaveEdit()` — line 739-861: branches on `editMode` (`priceType` | `priceValue`) and calls the matching Commerce mutation.
- `onEditDetail()` — line 670-706: opens inline editor from the **details sub-row** (the "pending change" pencil icon) and prefills from the pending values.
- `onDeleteDetail()` — line 712-737: confirmation → calls `deleteCommChannelNewPriceType/Value` to cancel a pending change.
- `initializeColumns()` — line 939-1001: 8 columns total when `canManageVisibility=true` (visibility, name, priceType, priceValue, firstActivationDate, activationDate, renewDate, status); 7 otherwise.
- `initializeRowMenuActions()` — line 1003-1078: builds row-action menu dynamically based on PES flags. Per-row visibility further filters via `row.allowedActions` from backend ([CODE] line 1061-1073).
- `primeAccess()` — line 1252-1262: async `AccessControlFacade.resolveFlags` → re-init columns + row menu.

### `<falcon-organization-hierarchy-tree>`

- File: `libs/falcon/src/shared-ui/lib/components/organization-hierarchy-tree/organization-hierarchy-tree.component.ts:34`
- Selector: `falcon-organization-hierarchy-tree`
- Inputs used here (HTML line 221-233): `[loading]`, `[nodes]`, `[loadingChildrenIds]`, `[selectedNodeKey]`, `[expandedKeys]`, `[enableRightClick]="false"`, `[showActions]="false"`, `[disableRoot]="true"`, `[showFalconExpandArrow]="false"`, `[showRootFalcon]="false"`, `[rootChildrenLabel]`, `[showExpandArrow]="false"`
- Outputs used: `(nodeExpandRequested)`, `(nodeCollapseRequested)`, `(nodeSelected)`

### `<app-insufficient-balance-priority-dialog>`

- File: `apps/admin-console/src/app/shared/components/insufficient-balance-priority-dialog/insufficient-balance-priority-dialog.component.ts:34-121`
- Selector: `app-insufficient-balance-priority-dialog`
- Standalone: true
- Imports: `CommonModule`, `DialogModule`, `ButtonModule`, `SkeletonModule`, `DragDropModule` (line 29)
- `changeDetection: ChangeDetectionStrategy.OnPush` (line 32)
- Inputs: `visible: boolean` (required), `nodeId: string` (required)
- Outputs: `visibleChange: EventEmitter<boolean>`, `proceedPayment: EventEmitter<CommChannelPriority[]>`
- Services injected: `DestroyRef`, `ChangeDetectorRef`, `CommunicationChannelsApiService`
- Logic: on show → fetch `getVisibleChannels(nodeId)` → render drag-droppable list of channels (sorted by PriorityOrder); proceed → emit ordered `CommChannelPriority[]` (1-based `commChannelPriorityId`).
- Local interface: `CommChannelPriority { commChannelPriorityId: number; channelId: string }` (line 21-24) — **duplicate** of the one in `tabs-layout/components/models/models.ts:13-16`.

### `<app-insufficient-balance-warning-dialog>`

- File: `apps/admin-console/src/app/shared/components/insufficient-balance-warning-dialog/insufficient-balance-warning-dialog.component.ts:17-45`
- Selector: `app-insufficient-balance-warning-dialog`
- Standalone: true; `ChangeDetectionStrategy.OnPush`
- Imports: `CommonModule`, `DialogModule`, `ButtonModule`, `TranslatePipe`
- Inputs: `visible: boolean` (required), `message: string | null`
- Outputs: `visibleChange: EventEmitter<boolean>`
- Pure presentational. `OnChanges → markForCheck` on `visible` or `message`.

### `<falcon-table>`

- File: `libs/falcon/src/shared-ui/lib/components/falcon-table/...` (referenced via `@falcon` barrel)
- Used in HTML line 341-361.
- Generic typed: `FalconTableComponent<CommChannelServiceItem>` ([CODE] component line 138-139).
