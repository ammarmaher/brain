# DTOs — marketplace-applications

## Section A — Feature-owned DTOs (`models/models.ts`)

### `AppServiceItem`  (lines 8-24)
```typescript
interface AppServiceItem {
  id: string;
  accountId: string;                         // injected by service.getList (= nodeId)
  name: string;
  visibility: boolean;
  pricingType: PricingType | null;           // enum: Monthly=1 | Yearly=2 | OneTimePayment=3
  priceValue: number | null;
  firstActivationDate: string | null;        // ISO
  activationDate: string | null;             // ISO
  renewDate: string | null;                  // ISO
  renewDateDate?: Date | null;               // derived (Date object — for falcon-calendar)
  status?: FalconItemStatus;                 // enum: None=0 | InActive=1 | Active=2 | Expired=3 | Disabled=4
  allowedActions?: FalconRowAction[];        // backend-provided row-action whitelist
  canHide?: boolean;
  [key: string]: unknown;                    // permits 'details: PendingChange[]' etc.
}
```

The `[key: string]: unknown` escape hatch lets the backend ship a `details` array of pending price/type changes alongside the row. Component checks `row.details !== null` (line 1054-1055) to decide whether to expand a "details row".

Pending-change detail shape (informally typed as `Record<string, unknown>` in component):
```typescript
{
  type: 'priceType' | 'priceValue',
  newPriceTypeValue?: number,      // when type === 'priceType'
  newPriceType?: number,           // alternate field name
  effectiveDate?: string,          // ISO date
  newPriceValue?: number,          // when type === 'priceValue'
}
```

### `GetAppsServicesResponse`  (lines 26-28)
```typescript
interface GetAppsServicesResponse { items: AppServiceItem[]; }
```
[CODE] Declared but **not used** — `getList()` consumes `ServiceOperationResult<AppServiceItem[]>` directly (no `items` wrapper).

### `UpdateAppPriceTypeRequest` / `UpdateAppPriceTypeResponse`  (lines 30-40)
```typescript
interface UpdateAppPriceTypeRequest  { id: string; pricingType: number; effectiveDate: string; }
interface UpdateAppPriceTypeResponse { id: string; pricingType: number; effectiveDate: string; }
```
[CODE] Declared but **not used** — actual request shape is `ChangeApplicationPriceTypeRequest` from shared models.

### `UpdateAppPriceValueRequest` / `UpdateAppPriceValueResponse`  (lines 42-50)
```typescript
interface UpdateAppPriceValueRequest  { id: string; priceValue: number; }
interface UpdateAppPriceValueResponse { id: string; priceValue: number; }
```
[CODE] Declared but **not used** — actual request shape is `ChangeApplicationPriceValueRequest` from shared models.

### `toFalconItemStatus(value)`  (lines 52-71)
Status normalization helper — accepts number or string, returns `FalconItemStatus` enum value. Maps strings: `'active'` → Active, `'inactive'` → InActive, `'expired'` → Expired, `'disabled'` → Disabled, default → None.

---
## Section B — Shared mutation DTOs (`features/organization-hierarchy/.../models/models.ts`)

> All request types extend either `AccountApplicationScopedRequest` (`accountId` + `applicationId`) or `AccountCommChannelScopedRequest` (`accountId` + `commChannelId`).

### Base types  (lines 1-16)
```typescript
interface AccountScopedRequest                 { accountId: string; }
interface AccountApplicationScopedRequest extends AccountScopedRequest { applicationId: string; }
interface AccountCommChannelScopedRequest extends AccountScopedRequest { commChannelId: string; }

interface CommChannelPriority {
  commChannelPriorityId: number;
  channelId: string;
}
```

### Visibility mutation DTOs
```typescript
interface ChangeAccountApplicationServiceVisibilityRequest
  extends AccountApplicationScopedRequest { visibility: boolean; }      // lines 19-22

interface ChangeAccountCommunicationChannelServiceVisibilityRequest
  extends AccountCommChannelScopedRequest { visibility: boolean; }      // lines 24-27
```

### Price-value mutation DTOs
```typescript
interface ChangeApplicationPriceValueRequest
  extends AccountApplicationScopedRequest { priceValue: number; }       // lines 29-32

interface ChangeCommunicationChannelPriceValueRequest
  extends AccountCommChannelScopedRequest { priceValue: number; }       // lines 34-37
```

### Price-type mutation DTOs
```typescript
interface ChangeApplicationPriceTypeRequest
  extends AccountApplicationScopedRequest {
    pricingType: number;        // PricingType enum value (1 | 2 | 3)
    effectiveDate: string;      // YYYY-MM-DD (per Helper.formatDateOnly — see [[06-VALIDATIONS]])
  }                                                                      // lines 39-43

interface ChangeCommunicationChannelPriceTypeRequest
  extends AccountCommChannelScopedRequest {
    pricingType: number;
    effectiveDate: string;
  }                                                                      // lines 45-49
```

### DoPayment DTOs
```typescript
interface DoPaymentApplicationRequest
  extends AccountApplicationScopedRequest {
    commChannelPriorityIds?: CommChannelPriority[] | null;   // included on retry after priority dialog
  }                                                                      // lines 51-54

interface DoPaymentCommunicationChannelRequest
  extends AccountCommChannelScopedRequest {
    commChannelPriorityIds?: CommChannelPriority[] | null;
  }                                                                      // lines 56-59
```

Response from `/do-payment` (per component line 432): `Record<string, unknown>` with at least `{ orderId: string }` (key is sometimes `OrderId` per defensive read at line 432).

### Enable / Disable DTOs (empty bodies — only scope fields)
```typescript
interface EnableApplicationRequest extends AccountApplicationScopedRequest {}           // line 61
interface DisableApplicationRequest extends AccountApplicationScopedRequest {}          // line 63
interface EnableCommunicationChannelRequest extends AccountCommChannelScopedRequest {}  // lines 65-66
interface DisableCommunicationChannelRequest extends AccountCommChannelScopedRequest {} // lines 68-69
```

### Delete-pending DTOs (empty bodies — only scope fields, sent in DELETE `body`)
```typescript
interface DeleteApplicationNewPriceTypeRequest extends AccountApplicationScopedRequest {}   // lines 71-72
interface DeleteApplicationNewPriceValueRequest extends AccountApplicationScopedRequest {}  // lines 74-75
interface DeleteCommunicationChannelNewPriceTypeRequest extends AccountCommChannelScopedRequest {}   // lines 77-78
interface DeleteCommunicationChannelNewPriceValueRequest extends AccountCommChannelScopedRequest {}  // lines 80-81
```

### Response types (all opaque)
All 15 response types are declared as `Record<string, unknown>` — backend likely returns a confirmation envelope but the UI doesn't read fields beyond success flag (lines 84-117).

---
## Section C — Shared types from `@falcon`

### `PricingType`  (`libs/falcon/src/shared-types/lib/enums/globels.ts:57-61`)
```typescript
enum PricingType {
  Monthly = 1,
  Yearly = 2,
  OneTimePayment = 3,
}
```

### `FalconRowAction`  (lines 110-116)
```typescript
enum FalconRowAction {
  DoPayment = 1,
  Disable = 2,
  Enable = 3,
  EditPriceType = 4,
  EditPriceValue = 5,
}
```

### `FalconItemStatus`  (lines 118-124)
```typescript
enum FalconItemStatus {
  None = 0,
  InActive = 1,
  Active = 2,
  Expired = 3,
  Disabled = 4,
}
```

### `ProcessState`  (`libs/falcon/src/shared-types/lib/enums/order-status.enums.ts:1-6`)
```typescript
enum ProcessState {
  Pending = 1,
  Running = 2,
  Completed = 3,
  Failed = 4,
}
```

### `OrderFailureReason`  (lines 8-13)
```typescript
enum OrderFailureReason {
  None = 0,
  InsufficientFunds = 1,
  CommChannelPriorityOrderRequired = 2,
  WalletNotConfigForTheNode = 3,
}
```

### `WalletType`  (lines 15-18)
```typescript
enum WalletType {
  SingleWallet = 1,
  MultipleWallets = 2,
}
```

### `GetOrderStatusResponse`  (`libs/falcon/src/shared-types/lib/models/order-status.models.ts:3-7`)
```typescript
interface GetOrderStatusResponse {
  status: ProcessState;
  failureReason?: OrderFailureReason | null;
  walletType: WalletType;
}
```

### `VisibleCommunicationChannelResponse`  (used by priority dialog — referenced via `@falcon` barrel)
[CODE] Component file: `apps/admin-console/src/app/shared/services/communication-channels-api.service.ts:6` imports from `@falcon`. Shape per the mapping at lines 25-31:
```typescript
interface VisibleCommunicationChannelResponse {
  PriorityOrder: number;     // PascalCase from backend (also accepts camelCase 'priorityOrder')
  ChannelId: string;
  ChannelName: string;
}
```

### `T2TableColumn<T>` / `T2RowMenuAction<T>` (Falcon Table column + row-menu typings)
[CODE] Imported from `@falcon` barrel (line 26 of component). Used by table configuration; component does not redefine.

### `FALCON_ACTION_REGISTRY`, `FALCON_ROW_ACTION_I18N_KEY`, `FALCON_STATUS_I18N_KEY`
[CODE] All from `@falcon` (line 30-34 of component imports). Map enum values → icon name / translation key.

---
## Section D — Pricing model — narrative summary

For the marketplace-applications page, the pricing model is simpler than contracts:

1. **Per-account, per-application price** — one `{ pricingType, priceValue }` pair per `(accountId, applicationId)`. No tiering. No destination/priority matrix.
2. **PricingType** — `Monthly | Yearly | OneTimePayment`. Drives the renewal lifecycle.
3. **Effective-dated changes** — a price-type change is staged with `effectiveDate: 'YYYY-MM-DD'`. The page shows pending changes in an expandable "details row" with edit/delete actions. Until effective date, the OLD price is in effect.
4. **Currency** — implicit SAR (component prefixes `'SAR '` to the input number and shows `<falcon-svg-icon name="currency-sar">`). [INFERRED] Backend must store SAR or per-account currency — not modeled in feature-level DTOs.
5. **Visibility toggle** — boolean per `(accountId, applicationId)`. Hidden applications still exist; toggling does not delete the configuration.
6. **Payment activation** — `do-payment` initiates an async order. The order is **either** the activation (first time, sets `firstActivationDate`) **or** the renewal (sets `activationDate` + `renewDate`).
7. **Order failure reasons** drive UX:
   - **`InsufficientFunds` (1)** → warning dialog → user funds wallet → retry.
   - **`CommChannelPriorityOrderRequired` (2)** → priority dialog → user reorders comm-channels by priority (drag-drop) → retry with `commChannelPriorityIds`. **[INFERRED] When the application is multi-channel and the wallet covers only some channels, the user must specify which channels to fund first.**
   - **`WalletNotConfigForTheNode` (3)** → warning dialog → user must configure wallet strategy (Wallet & Balance Management page).
8. **Activation / Renewal lifecycle (implied state machine):**
   - `Inactive → Pending → Active → (renewable) Active → (lapses) Expired → Disabled`
   - Backend exposes the legal next-actions via `row.allowedActions: FalconRowAction[]` so the UI does not need to encode the FSM transitions itself.

---
## Section E — Total DTO count
- Feature `models/models.ts`: **5** interfaces + 1 helper function. (3 are dead code — present, not consumed.)
- Shared mutation models: **15** request types + **15** response types + **1** scoped base + **1** `CommChannelPriority` helper. 8 of the 15 are application-related; the other 8 mirror for comm-channels.
- Shared `@falcon` enums + models touched: **6** enums + **1** poll response interface + **1** comm-channel response.
- **Total DTO surface area for this page: ~28 types**.
