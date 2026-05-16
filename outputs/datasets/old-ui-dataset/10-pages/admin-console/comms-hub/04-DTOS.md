# DTOs — comms-hub

## Domain row DTO

### `CommChannelServiceItem`

- File: `apps/admin-console/src/app/features/comms-hub/models/models.ts:11-32`
- The single row entity. Wide model — list response, table row, edit context, and pending-change details all share this shape.

```typescript
export interface CommChannelServiceItem {
  id: string;
  accountId: string;
  name: string;
  visibility: boolean;
  pricingType: PricingType | null;
  priceValue: number | null;
  firstActivationDate: string | null;
  activationDate: string | null;
  renewDate: string | null;
  renewDateDate?: Date | null;
  status: FalconItemStatus;
  /** Allowed actions for this item (provided by backend) */
  allowedActions?: FalconRowAction[];
  /** Details row data - new/pending price type change */
  newPriceType?: string;
  effectiveDate?: string;
  /** Details row data - new/pending price value change */
  newPriceValue?: number;
  canHide?: boolean;
  [key: string]: unknown;
}
```

- The component overlays per-row `accountId` in `loadData` ([CODE] `comms-hub.component.ts:1124-1127`) so each row carries the parent node id, used by mutation calls (`resolveAccountId`).
- The component injects `pricingType` defaults and a parsed `renewDateDate: Date` in `CommsHubService.getList` ([CODE] `comms-hub.service.ts:38-50`).
- `[key: string]: unknown` is used because details-row sub-items are keyed by `'type' = 'priceType' | 'priceValue'` plus `newPriceType`, `newPriceTypeValue`, `effectiveDate`, `newPriceValue` ([CODE] component lines 670-705).

### `GetCommChannelsServicesResponse`

- File: `models/models.ts:37-39`
- Shape: `{ items: CommChannelServiceItem[] }`
- **Not actually wired** — the service maps `res.result` (a bare array) directly. [INFERRED] Wrapper kept for documentation parity with backend.

### `UpdateCommChannelPriceTypeRequest`

- File: `models/models.ts:44-48`
- Shape:
```typescript
{
  id: string;
  pricingType: number;
  effectiveDate: string;
}
```
- [INFERRED] Dead in this feature — the live mutation goes through `ChangeCommunicationChannelPriceTypeRequest` (below).

### `UpdateCommChannelPriceTypeResponse`

- File: `models/models.ts:53-57`
- Shape: `{ id: string; pricingType: number; effectiveDate: string }`

### `UpdateCommChannelPriceValueRequest`

- File: `models/models.ts:62-65`
- Shape: `{ id: string; priceValue: number }`

### `UpdateCommChannelPriceValueResponse`

- File: `models/models.ts:70-73`
- Shape: `{ id: string; priceValue: number }`

### `PriceType` (TS string union)

- File: `models/models.ts:78`
- `'Monthly' | 'Yearly' | 'One-time'` — **not used in code**; the live enum is `PricingType` numeric (below).

### `toFalconItemStatus(value)`

- File: `models/models.ts:80-99`
- Maps either a numeric `FalconItemStatus` or a string ("active"/"inactive"/"expired"/"disabled") into the enum. Default = `FalconItemStatus.None`. Used by `CommsHubService.getList`.

## Shared commerce request / response DTOs

All in `apps/admin-console/src/app/features/organization-hierarchy/components/tabs-layout/components/models/models.ts`.

### Base shapes

```typescript
// line 1-3
interface AccountScopedRequest { accountId: string; }
// line 5-7
interface AccountApplicationScopedRequest extends AccountScopedRequest { applicationId: string; }
// line 9-11
interface AccountCommChannelScopedRequest extends AccountScopedRequest { commChannelId: string; }
// line 13-16
interface CommChannelPriority { commChannelPriorityId: number; channelId: string; }
```

### Request DTOs hit by comms-hub

| Interface | Extends | Adds | Source line |
|---|---|---|---|
| `ChangeAccountCommunicationChannelServiceVisibilityRequest` | `AccountCommChannelScopedRequest` | `visibility: boolean` | 24-27 |
| `ChangeCommunicationChannelPriceValueRequest` | `AccountCommChannelScopedRequest` | `priceValue: number` | 34-37 |
| `ChangeCommunicationChannelPriceTypeRequest` | `AccountCommChannelScopedRequest` | `pricingType: number; effectiveDate: string` | 45-49 |
| `DoPaymentCommunicationChannelRequest` | `AccountCommChannelScopedRequest` | `commChannelPriorityIds?: CommChannelPriority[] \| null` | 56-59 |
| `EnableCommunicationChannelRequest` | `AccountCommChannelScopedRequest` | — | 65-66 |
| `DisableCommunicationChannelRequest` | `AccountCommChannelScopedRequest` | — | 68-69 |
| `DeleteCommunicationChannelNewPriceTypeRequest` | `AccountCommChannelScopedRequest` | — | 77-78 |
| `DeleteCommunicationChannelNewPriceValueRequest` | `AccountCommChannelScopedRequest` | — | 80-81 |

### Response DTOs (all returned wrapped in `ServiceOperationResult<T>`)

| Type alias | Shape | Source line |
|---|---|---|
| `ChangeAccountCommunicationChannelServiceVisibilityResponse` | `Record<string, unknown>` | 87-88 |
| `ChangeCommunicationChannelPriceValueResponse` | `Record<string, unknown>` | 92-93 |
| `ChangeCommunicationChannelPriceTypeResponse` | `Record<string, unknown>` | 97 |
| `DoPaymentCommunicationChannelResponse` | `Record<string, unknown>` (carries `orderId` / `OrderId` at runtime — read via `(res.result as any)?.orderId` at `comms-hub.component.ts:472`) | 101 |
| `EnableCommunicationChannelResponse` | `Record<string, unknown>` | 107 |
| `DisableCommunicationChannelResponse` | `Record<string, unknown>` | 109 |
| `DeleteCommunicationChannelNewPriceTypeResponse` | `Record<string, unknown>` | 115 |
| `DeleteCommunicationChannelNewPriceValueResponse` | `Record<string, unknown>` | 117 |

## Tree node DTOs

### `OrgHierarchyNode`

- File: `apps/admin-console/src/app/features/organization-hierarchy/models/org-hierarchy.models.ts` (referenced; not read in full — used by `OrgHierarchyApiService`).
- Component-side mapping uses `mapOrgNodeToTreeNode` and `updateTreeNodeChildren` from `apps/admin-console/src/app/features/organization-hierarchy/utils/org-hierarchy.mapper.ts` ([CODE] component line 67).
- Tree library type used by template: `TreeNode` from `primeng/api`.

### `GetNodeResponse`

- File: `apps/admin-console/src/app/features/organization-hierarchy/models/node-api.models.ts` (referenced by `org-hierarchy.api.service.ts:7`). The mapping function `mapToOrgHierarchyNode` copies `id, label, icon, url, hasChildren, children` ([CODE] `org-hierarchy.api.service.ts:39-48`).

### `VisibleCommunicationChannelResponse`

- File: `libs/falcon/src/shared-types/lib/models/communication-channel.models.ts:1-5`
- Shape:
```typescript
{
  PriorityOrder: number;
  ChannelId: string;
  ChannelName: string;
}
```
- Note PascalCase keys ([INFERRED] backend may also send camelCase — `CommunicationChannelsApiService.getVisibleChannels` normalises both at runtime, lines 24-32).

## Order-status DTOs

### `GetOrderStatusResponse`

- File: `libs/falcon/src/shared-types/lib/models/order-status.models.ts:3-7`
- Shape:
```typescript
{
  status: ProcessState;
  failureReason?: OrderFailureReason | null;
  walletType: WalletType;
}
```

## Enums

### `PricingType`

- File: `libs/falcon/src/shared-types/lib/enums/globels.ts:57-61`
- Values: `Monthly = 1 | Yearly = 2 | OneTimePayment = 3`

### `FalconItemStatus` — **the status pill**

- File: `libs/falcon/src/shared-types/lib/enums/globels.ts:118-124`
- Values: `None = 0 | InActive = 1 | Active = 2 | Expired = 3 | Disabled = 4`
- **5 states**, NOT 4 — `None` is a fallback used when backend value is unrecognised (see `toFalconItemStatus` line 80-99 of local models). The recent memory note saying "4-state (Active / Expired / Disable / Inactive / -----)" matches **the 4 explicit values plus the `-----` shown when status is `None`**.
- i18n keys (`FALCON_STATUS_I18N_KEY`, `globals.ts:130-136`):
  - `None → status.none`
  - `InActive → status.inactive`
  - `Active → status.active`
  - `Expired → status.expired`
  - `Disabled → status.disabled`
- Severity map (`FALCON_STATUS_STYLE`, `globals.ts:138-147`):
  - `None → info`
  - `InActive → secondary`
  - `Active → success`
  - `Expired → danger`
  - `Disabled → secondary`

### `FalconRowAction`

- File: `libs/falcon/src/shared-types/lib/enums/globels.ts:110-116`
- Values: `DoPayment = 1 | Disable = 2 | Enable = 3 | EditPriceType = 4 | EditPriceValue = 5`
- Each row's `allowedActions: FalconRowAction[]` (from backend) filters which actions appear ([CODE] component line 1061-1073). Implementation only checks `row.allowedActions` — if the array is missing or falsy the action is **hidden** (default-deny).

### `ProcessState`

- File: `libs/falcon/src/shared-types/lib/enums/order-status.enums.ts:1-6`
- Values: `Pending = 1 | Running = 2 | Completed = 3 | Failed = 4`

### `OrderFailureReason`

- File: `order-status.enums.ts:8-13`
- Values: `None = 0 | InsufficientFunds = 1 | CommChannelPriorityOrderRequired = 2 | WalletNotConfigForTheNode = 3`

### `WalletType`

- File: `order-status.enums.ts:15-18`
- Values: `SingleWallet = 1 | MultipleWallets = 2`

## Dialog DTOs

### `CommChannelPriority` (priority dialog interface)

- File: `apps/admin-console/src/app/shared/components/insufficient-balance-priority-dialog/insufficient-balance-priority-dialog.component.ts:21-24`
- Shape: `{ commChannelPriorityId: number; channelId: string }`
- **Duplicate** of `models/models.ts:13-16` — same shape declared in two places. [INFERRED] Refactor opportunity.

## Wrappers

### `ServiceOperationResult<T>`

- Imported from `@falcon` ([CODE] every service). Standard Falcon response wrapper:
  - `isSuccessful: boolean`
  - `result: T | undefined`
  - `errors?: string[]`
  - (At least one untyped usage: `(response as any).errorMessages?.[0]` at `org-hierarchy.api.service.ts:56` — implies backend sometimes returns `errorMessages`.)

## Total count

**22 named DTOs / type aliases / enums** wired into this feature:
- 7 local row / request / response DTOs in `comms-hub/models/models.ts`
- 8 shared commerce request DTOs + 8 response type aliases in `tabs-layout/components/models/models.ts` (only the 8 comm-channel ones are wired here)
- 1 base + 1 priority interface in the shared models (`AccountCommChannelScopedRequest`, `CommChannelPriority`)
- 1 visible-channel response (`VisibleCommunicationChannelResponse`)
- 1 order-status response (`GetOrderStatusResponse`)
- 6 enums (`PricingType`, `FalconItemStatus`, `FalconRowAction`, `ProcessState`, `OrderFailureReason`, `WalletType`)
- Plus `OrgHierarchyNode` / `TreeNode` / `GetNodeResponse` for tree wiring
