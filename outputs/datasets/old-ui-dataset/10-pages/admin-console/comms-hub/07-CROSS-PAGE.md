# Cross-page dependencies — comms-hub

## Inbound (this feature depends on)

### From `apps/admin-console/src/app/features/organization-hierarchy/`

This is the **heaviest dependency** — the comms-hub feature pulls 4 separate artifacts out of the `organization-hierarchy` feature:

| Symbol | File | Used for |
|---|---|---|
| `CommerceActionsService` | `organization-hierarchy/components/tabs-layout/components/service/commerce-actions.service.ts` | Façade for all 11 commerce mutations (visibility / price-type / price-value / do-payment / disable / enable / delete-new-price-type / delete-new-price-value) |
| `CommerceGatewayService` | `…/service/commerce-gateway.service.ts` (transitively) | Real HTTP implementations |
| `OrgHierarchyApiService` | `organization-hierarchy/services/org-hierarchy.api.service.ts` | Loading root and child nodes for the left tree |
| `OrgHierarchyNode` | `organization-hierarchy/models/org-hierarchy.models.ts` | Tree node type |
| `mapOrgNodeToTreeNode`, `updateTreeNodeChildren` | `organization-hierarchy/utils/org-hierarchy.mapper.ts` | Converting backend node → PrimeNG `TreeNode` |
| `DoPaymentCommunicationChannelRequest` (+ peers) | `organization-hierarchy/components/tabs-layout/components/models/models.ts` | All request / response shapes |

[INFERRED] These names suggest these were extracted from the originally-tabbed organization-hierarchy page (the same content used to be a tab there — see memory `feedback_orchestrator_failure_modes_org_hierarchy`). The new `comms-hub` standalone page re-uses the tab's commerce backend wiring without lifting it into `libs/falcon`.

### From `apps/admin-console/src/app/shared/`

| Symbol | File | Used for |
|---|---|---|
| `InsufficientBalancePriorityDialogComponent` + `CommChannelPriority` | `shared/components/insufficient-balance-priority-dialog/insufficient-balance-priority-dialog.component.ts` | Dialog shown on `CommChannelPriorityOrderRequired` order failure |
| `InsufficientBalanceWarningDialogComponent` | `shared/components/insufficient-balance-warning-dialog/insufficient-balance-warning-dialog.component.ts` | Dialog shown on `InsufficientFunds` / `WalletNotConfigForTheNode` |
| `CommunicationChannelsApiService` (transitively, via the priority dialog) | `shared/services/communication-channels-api.service.ts` | `getVisibleChannels(nodeId)` for the priority list |

### From `libs/falcon/`

| Symbol | Used for |
|---|---|
| `AccessControlFacade` | PES capability resolution |
| `FalconAccess` registry | Permission keys |
| `SessionProvider`, `USER_TYPE_STRINGS` | userType / tenant / clientId |
| `Helper` | `enumToOptions`, `parseDateOnly`, `formatDateOnly`, `getDateFromStringOrDash`, `getPricingTypeLabel`, `toPricingType` |
| `Hook<T>`, `PricingType`, `PricingTypeI18n`, `FalconItemStatus`, `FalconRowAction`, `FALCON_STATUS_I18N_KEY`, `FALCON_ACTION_REGISTRY`, `FALCON_ROW_ACTION_I18N_KEY` | UI enums + i18n maps |
| `TranslatePipe`, `TranslateService` | i18n |
| `FalconTableComponent`, `T2TableColumn`, `T2RowMenuAction`, `FalconRowAction`, `FalconRowActionEvent`, `FalconInlineRowContext`, `FalconCellContext`, `FalconDetailsRowContext` | Generic Falcon table primitives |
| `OrganizationHierarchyTreeComponent` | Shared tree component (the new wrapper rolled out 2026-05-15 per memory `project_org_hierarchy_tree_shared_component`) |
| `FalconCalendarComponent` | The inline date editor with `useEffectiveDateValidation` |
| `FalconIconComponent`, `SvgIconComponent` | Icons (`buildings`, `currency-sar`) |
| `FALCON_ROOT_NODE` | Synthetic root for Falcon users |
| `ProcessState`, `OrderFailureReason`, `WalletType` | Order-status enums |
| `GetOrderStatusResponse`, `SimplePollService`, `OrderStatusService` | Order polling |
| `HttpService`, `ServiceOperationResult`, `useGateway` | Transport |
| `getCssVariable` | Reading `--color-primary` for the confirm-dialog icon |
| `shellAccessGuard`, `adminConsoleGuard` (transitive) | Route guards |

### From PrimeNG

`ButtonModule`, `ToggleSwitch`, `Select`, `InputNumber`, `DialogModule`, `SkeletonModule`, `ToastModule`, `MessageService`, `ConfirmationService`, `TreeNode` (`primeng/api`).

## Outbound (other features that depend on this)

**None directly.** The comms-hub feature exposes no services / state via `providedIn: 'root'`, no public components, no shared models. It is purely a consumer.

The only outward-facing identity is the route segment `comm-mgmt` which the host-shell layout links to ([CODE] `apps/host-shell/src/app/layout/layout.component.ts:75`).

## Shared state

- **Reads:** `SessionProvider.session?.userType / tenantId / client_id` (component lines 227, 880-883).
- **Writes:** nothing global. All state is component-local. The `loadedChildrenIds`, `loadingChildrenIds`, `expandedKeys` etc. for the tree are NOT shared with the organization-hierarchy page — each page rebuilds its own tree on demand.

[INFERRED] This creates a memory-graph caching opportunity: navigating away and back rebuilds the tree from scratch.

## Navigation entry points

- Menu item: built dynamically in `apps/host-shell/src/app/layout/layout.component.ts` based on user type. The link constant `admin_console_PATH_COMM_MGMT = '/admin-console/comm-mgmt'` ([CODE] line 75).
- Deep link supported: `/admin-console/comm-mgmt` (no params; no resolver).
- Mirror for client users: `/management-console/comm-mgmt` ([CODE] layout line 81 + the management-console's own `apps/management-console/src/app/features/comms-hub/routes.ts`).

## Cross-app mirror

`apps/management-console/src/app/features/comms-hub/` exists in parallel — Grep returned matches at:
- `apps/management-console/src/app/features/comms-hub/routes.ts` (shellAccessGuard usage)
- `apps/management-console/src/app/shared/components/insufficient-balance-priority-dialog/...` (a sibling copy)
- `apps/management-console/src/app/shared/services/communication-channels-api.service.ts` (a sibling copy)

[INFERRED] The admin-console page is the Falcon-user variant (`sys.services` resource), the management-console page is the client-user variant (`acc.services` resource). They are **two separate but parallel implementations** sharing only the `libs/falcon` primitives. Code duplication is non-trivial: `CommerceActionsService`, `CommerceGatewayService`, `OrgHierarchyApiService`, and the two dialogs are duplicated across the two apps.
