# Cross-page dependencies — marketplace-applications

## Inbound (this feature depends on)

### Other feature folders (sibling apps/admin-console paths)
| What | Source path | Purpose |
|---|---|---|
| `OrgHierarchyApiService` | `apps/admin-console/src/app/features/organization-hierarchy/services/org-hierarchy.api.service.ts` | Tree-panel data loading (`getRootNodes`, `getChildren`) |
| `OrgHierarchyNode` type | `apps/admin-console/src/app/features/organization-hierarchy/models/org-hierarchy.models.ts` | Account-tree node interface |
| `mapOrgNodeToTreeNode`, `updateTreeNodeChildren` | `apps/admin-console/src/app/features/organization-hierarchy/utils/org-hierarchy.mapper.ts` | Map service models to PrimeNG TreeNode |
| `CommerceActionsService` | `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/service/commerce-actions.service.ts` | Mutation facade (visibility / price / payment / enable / disable / delete-pending) for both applications + comm-channels |
| `CommerceGatewayService` | `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/service/commerce-gateway.service.ts` | HTTP layer for all `commerce/node/*` mutations |
| `DoPaymentApplicationRequest` type | `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/models/models.ts` | Used directly by container for type-safe payment payload |
| `CommChannelPriority` type | (same file) | Returned from priority dialog |

[INFERRED] Note that `CommerceActionsService`, `CommerceGatewayService`, and their request/response models live **inside the `organization-hierarchy` feature folder**, even though they are platform-wide commerce mutations. This is a folder-hygiene problem: these are not specific to org-hierarchy. They should likely move to `shared/services/` in the new theme.

### Shared components (`apps/admin-console/src/app/shared/`)
| Component | File |
|---|---|
| `InsufficientBalancePriorityDialogComponent` | `shared/components/insufficient-balance-priority-dialog/insufficient-balance-priority-dialog.component.ts` |
| `InsufficientBalanceWarningDialogComponent` | `shared/components/insufficient-balance-warning-dialog/insufficient-balance-warning-dialog.component.ts` |

Both dialogs are also used by `comms-hub`. The priority dialog itself pulls `CommunicationChannelsApiService` from `shared/services/`.

### `@falcon` library (`libs/falcon/`)
| Symbol | Used for |
|---|---|
| `FalconTableComponent` | Right-hand table — column templates, row-menu, inline editors, details-row |
| `T2TableColumn`, `T2RowMenuAction`, `FalconRowAction`, `FalconRowActionEvent`, `FalconInlineRowContext`, `FalconCellContext`, `FalconDetailsRowContext`, `FALCON_ACTION_REGISTRY`, `FALCON_ROW_ACTION_I18N_KEY`, `FALCON_STATUS_I18N_KEY`, `FalconItemStatus` | All `<falcon-table>` typing + registries |
| `OrganizationHierarchyTreeComponent` | `<falcon-organization-hierarchy-tree>` left panel |
| `FalconIconComponent`, `SvgIconComponent`, `FalconCalendarComponent` | Sub-components |
| `Helper`, `Hook`, `PricingType`, `PricingTypeI18n`, `TranslatePipe`, `TranslateService` | i18n + utilities (`getPricingTypeLabel`, `enumToOptions`, `parseDateOnly`, `formatDateOnly`, `getDateFromStringOrDash`, `toPricingType`) |
| `SessionProvider`, `USER_TYPE_STRINGS`, `FALCON_ROOT_NODE` | Falcon-user detection |
| `FalconAccess`, `AccessControlFacade` | 4 PES queries — see [[05-PES]] |
| `ProcessState`, `OrderFailureReason`, `WalletType`, `GetOrderStatusResponse`, `SimplePollService`, `OrderStatusService` | Payment polling |
| `getCssVariable` | Reads `--color-primary` for confirm-dialog icon color (line 1136) |
| `HttpService`, `ServiceOperationResult`, `useGateway` | All HTTP |
| `VisibleCommunicationChannelResponse` | Priority dialog channel rows |

### PrimeNG (direct imports)
- `ButtonModule`, `ToggleSwitch`, `InputNumber`, `DialogModule`, `SkeletonModule`, `ToastModule`, `Select`
- `TreeNode`, `ConfirmationService`, `MessageService` from `primeng/api`

### Angular CDK
- `DragDropModule` + `CdkDragDrop` + `moveItemInArray` — used inside the priority dialog only.

## Outbound (other features depend on this)

### Direct imports from this feature folder
**None.** [CODE] grep shows zero imports of any symbol from `features/marketplace-applications/` outside the feature itself.

### Service registry (providedIn: 'root')
- `MarketplaceApplicationsService` is `providedIn: 'root'` but has **no external callers**.

## Shared state
- **Reads:**
  - PrimeNG `TreeNode` selected via tree-panel `(nodeSelected)`.
  - `SessionProvider.session.userType`, `.tenantId`, `.client_id`.
- **Writes:**
  - Nothing global. All state component-scoped.

## Navigation entry points
- Menu item: "Marketplace & Applications" (breadcrumb in `apps/admin-console/src/app/features/routes.ts:40`).
- Deep links: `/admin-console/marketplace-applications` — no `:id` segment; row selection is in-page.

## Related features (peer-level)

| Page | Path | Relation |
|---|---|---|
| `comms-hub` (`comm-mgmt`) | `/admin-console/comm-mgmt` | The **comm-channel equivalent** of this page — uses the **same** `CommerceActionsService` + `CommerceGatewayService` but calls the `/comm-channel/*` endpoints. Also uses the **same** 4 PES flags + same priority/warning dialogs. |
| `contracts-cost-management` | `/admin-console/contracts-cost-management` | Downstream consumer of `commerce/Node/{id}/applications` (filtered to `visibility !== false`) to populate the Step-3 application options in the contract wizard. So **this page's visibility toggle directly affects which apps are available to contracts**. |
| `organization-hierarchy` | `/admin-console/organization-hierarchy` | Source of the tree-panel data API. |
| `wallet-balance-management` | `/admin-console/wallet-balance-management` | When payment fails with `WalletNotConfigForTheNode`, user is directed here to configure wallet strategy. |

## Cross-feature shared dependencies (highlighted for new theme)
1. **`CommerceActionsService` + `CommerceGatewayService`** — used by **both** marketplace-applications AND comms-hub. **MUST** be moved out of the org-hierarchy feature folder in the new theme.
2. **`InsufficientBalance*Dialog` components** — used by **both** marketplace + comms-hub.
3. **`CommunicationChannelsApiService`** — used by the priority dialog (and `commerce/Node/{id}/comm-channels/visible` is also called by `ContractsApiService.getChannelOptions`).
4. **PrimeNG `TreeNode`** — same cross-page leak as contracts.
5. **`row.allowedActions: FalconRowAction[]`** convention — backend-controlled FSM disclosure. Marketplace + comms-hub both consume this.

## Provides nothing outbound
This feature does **not** export services or types to peer features. All mutation services were originally authored elsewhere (org-hierarchy folder) and consumed here.

## Cross-page evidence in code
[CODE] `marketplace-applications.component.ts:62-70` imports:
```typescript
import { CommerceActionsService } from '../organization-hierarchy/components/tabs-layout/components/service/commerce-actions.service';
import { OrgHierarchyApiService } from '../organization-hierarchy/services/org-hierarchy.api.service';
import { OrgHierarchyNode } from '../organization-hierarchy/models/org-hierarchy.models';
import { mapOrgNodeToTreeNode, updateTreeNodeChildren } from '../organization-hierarchy/utils/org-hierarchy.mapper';
import { InsufficientBalancePriorityDialogComponent, CommChannelPriority } from '../../shared/components/insufficient-balance-priority-dialog/insufficient-balance-priority-dialog.component';
import { InsufficientBalanceWarningDialogComponent } from '../../shared/components/insufficient-balance-warning-dialog/insufficient-balance-warning-dialog.component';
import { DoPaymentApplicationRequest } from '../organization-hierarchy/components/tabs-layout/components/models/models';
```

This is a smell — `marketplace-applications` reaches **across feature boundaries** into `organization-hierarchy/components/tabs-layout/components/service/...`. The new theme should restructure this — those `commerce-*` files belong in `shared/services/commerce/` or a separate Nx library.
