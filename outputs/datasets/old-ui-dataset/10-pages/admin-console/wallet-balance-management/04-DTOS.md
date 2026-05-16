# DTOs — wallet-balance-management

## Source files
- `apps/admin-console/src/app/features/wallet-balance-management/models/wallet-balance.models.ts:1-287` — hierarchy / strategy DTOs
- `apps/admin-console/src/app/features/wallet-balance-management/models/transfer.models.ts:1-232` — transfer DTOs

## Enums (numeric values mirror backend C# enums)

### Currency
[CODE] `wallet-balance.models.ts:16-19`:
```typescript
export enum Currency {
  SAR = 1,
  Points = 2,
}
```
Backend equivalent (per code comment): `eCurrency`. Only `SAR` is enabled in the transfer drawer; `Points` is disabled there but available on the page-level radio.

### WalletBalanceType (distribution)
[CODE] `wallet-balance.models.ts:27-30`:
```typescript
export enum WalletBalanceType {
  NodeBased = 1,
  UserBased = 2,
}
```
Backend equivalent: `eWalletBalanceType`. Drives Rule A (table tree filtering): NodeBased → show Organization/Service nodes only; UserBased → show User nodes only.

### WalletType (structure)
[CODE] `wallet-balance.models.ts:38-41`:
```typescript
export enum WalletType {
  SingleWallet = 1,
  MultipleWallets = 2,
}
```
Backend equivalent: `eWalletBaseType`. SingleWallet → one unified wallet per owner. MultipleWallets → separate wallets per communication channel.

### NodeType
[CODE] `wallet-balance.models.ts:46-50`:
```typescript
export enum NodeType {
  Organization = 1,
  Service = 2,
  User = 3,
}
```

### TransferMode
[CODE] `transfer.models.ts:29-32`:
```typescript
export enum TransferMode {
  SingleWallet = 1,
  MultipleWallets = 2,
}
```

### EntityType (backend-facing transfer entity type)
[CODE] `transfer.models.ts:37-42`:
```typescript
export enum EntityType {
  MASTER = '1',
  NODE = '2',
  USER = '3',
  COMM_CHANNEL = '4',
}
```
String-encoded numerics. Mapped via `toBackendEntityType()` (helper below).

### TransferEntityType (UI-facing entity type)
[CODE] `transfer.models.ts:47-52`:
```typescript
export enum TransferEntityType {
  MasterWallet = 'MASTER_WALLET',
  Node = 'NODE',
  User = 'USER',
  CommChannelWallet = 'COMM_CHANNEL_WALLET',
}
```

### TransferErrorCode
[CODE] `transfer.models.ts:135-145`:
```typescript
export enum TransferErrorCode {
  InsufficientBalance = 'INSUFFICIENT_BALANCE',
  NoActiveContracts = 'NO_ACTIVE_CONTRACTS',
  ContractDeductionFailed = 'CONTRACT_DEDUCTION_FAILED',
  InvalidSource = 'INVALID_SOURCE',
  InvalidDestination = 'INVALID_DESTINATION',
  InvalidAmount = 'INVALID_AMOUNT',
  SameSourceDestination = 'SAME_SOURCE_DESTINATION',
  Unauthorized = 'UNAUTHORIZED',
  Unknown = 'UNKNOWN',
}
```

---

## Request DTOs

### ISaveBalancesRequest
[CODE] `wallet-balance.models.ts:212-218`:
```typescript
export interface ISaveBalancesRequest {
  ownerId: string;
  currency: Currency;
  walletBalanceType: WalletBalanceType;
  walletType: WalletType;
  // changes: IBalanceChange[];   // ← commented out — page does NOT send per-cell edits
}
```
Used by: `WalletBalanceService.saveChanges()` → `POST commerce/setting/wallets`.

### IWalletQuery (querystring)
[CODE] `wallet-balance.models.ts:188-194`:
```typescript
export interface IWalletQuery {
  selectedNodeId: string;
  currency: Currency;
  balanceDistribution: WalletBalanceType;
  walletStructure: WalletType;
  parentNodeId?: string | null;     // declared but not used by GET hierarchy
}
```
Used by: `WalletBalanceService.getWalletData()` → `GET api/commerce/accounts/{selectedNodeId}/hierarchy?currency=…&balanceDistribution=…&walletStructure=…`. `parentNodeId` declared but never serialized.

### ITransferRequest
[CODE] `transfer.models.ts:104-119`:
```typescript
export interface ITransferRequest {
  amount: number;
  currency: Currency;
  description?: string;     // mandatory for CommChannel transfers (see isDescriptionRequired)
  source: ITransferEndpoint;
  destination: ITransferEndpoint;
}
```
Used by: `WalletBalanceService.transfer()` → `POST charging/wallet/transfer`.

### ITransferEndpoint
[CODE] `transfer.models.ts:93-99`:
```typescript
export interface ITransferEndpoint {
  walletId?: string;
  channelId?: string;
}
```
Source + destination identification. `channelId` is `undefined` for MasterWallet endpoints; present for CommChannelWallet and for Node/User in multiple-wallet mode.

---

## Response DTOs

### IWalletDataResponse (root response for hierarchy + balances + strategy + channels)
[CODE] `wallet-balance.models.ts:200-207`:
```typescript
export interface IWalletDataResponse {
  accountInfo: IWalletAccountInfo;
  channels: IChannel[];
  summary: IWalletSummary;
  node: IBalanceNode;
  canSave: boolean;
}
```

### IWalletAccountInfo
[CODE] `wallet-balance.models.ts:112-116`:
```typescript
export interface IWalletAccountInfo {
  accountId: string;
  accountName: string;
  accountImage: string;
}
```

### IWalletSummary
[CODE] `wallet-balance.models.ts:122-133`:
```typescript
export interface IWalletSummary {
  masterWalletId: string;
  totalBalance: number;
  currency: Currency;
  channelWallet?: IChannelBalance[];     // populated only in MultipleWallets mode
  walletBalanceType: WalletBalanceType;  // current distribution from backend
  walletType: WalletType;                // current structure from backend
}
```

### IChannel
[CODE] `wallet-balance.models.ts:87-91`:
```typescript
export interface IChannel {
  id: string;
  name: string;
  displayOrder: number;
}
```

### IChannelBalance (account-level channel wallet)
[CODE] `wallet-balance.models.ts:97-106`:
```typescript
export interface IChannelBalance {
  channelId: string;
  walletId: string | null;
  balance: number;
  name: string;
}
```

### IBalanceNode (tree node)
[CODE] `wallet-balance.models.ts:139-160`:
```typescript
export interface IBalanceNode {
  id: string;
  parentId?: string | null;
  nodeType: NodeType;
  name: string;
  expandable: boolean;
  icon?: string;
  balance?: number | null;                          // single-wallet mode
  channelBalances?: Array<IWalletChannelBalance>;   // multiple-wallet mode
  disabled?: boolean;
  children?: IBalanceNode[];
}
```

### IWalletChannelBalance (per-node, per-channel)
[CODE] `wallet-balance.models.ts:162-166`:
```typescript
export interface IWalletChannelBalance {
  balance: number;
  channelId: string;
  walletId: string | null;
}
```

### IBalanceChange (declared but unused in payload — half-finished)
[CODE] `wallet-balance.models.ts:173-179`:
```typescript
export interface IBalanceChange {
  nodeId: string;
  nodeType: NodeType;
  channelId?: string;
  walletId?: string;
  amount: number | null;
}
```
Imported nowhere outside its declaration file. Save endpoint payload does not include changes (see [[03-SERVICES-APIS]] Quirk #5).

### ITransferResponse
[CODE] `transfer.models.ts:124-130`:
```typescript
export interface ITransferResponse {
  success: boolean;
  message?: string;
  transactionId?: string;
  errorCode?: TransferErrorCode;
}
```

### ITransferEntity (UI selection model)
[CODE] `transfer.models.ts:61-78`:
```typescript
export interface ITransferEntity {
  id: string;
  name: string;
  type: TransferEntityType;
  icon?: string;
  channelId?: string;                  // for CommChannel entities
  balance?: number | null;
  nodeType?: NodeType;                 // for Rule A balance-type filter
  channelBalances?: Array<{
    balance: number;
    channelId: string;
    walletId: string | null;
  }>;
}
```

### ITransferWallet (UI selection model)
[CODE] `transfer.models.ts:83-88`:
```typescript
export interface ITransferWallet {
  id: string;
  name: string;
  channelId?: string;
  balance?: number | null;
}
```

### ITransferContext (drawer input model)
[CODE] `transfer.models.ts:150-187`:
```typescript
export interface ITransferContext {
  mode: TransferMode;
  fromMasterWallet: boolean;
  isFalconUser: boolean;
  preSelectedSource?: ITransferEntity;
  sourceEntities: ITransferEntity[];
  destinationEntities: ITransferEntity[];
  availableWallets: ITransferWallet[];
  masterWallet: ITransferEntity;
  currency: Currency;
  balanceDistribution: WalletBalanceType;
  channels: Array<{ id: string; name: string; displayOrder: number; }>;
}
```

---

## Type aliases
| Alias | Definition | Use |
|---|---|---|
| `DraftKey` | `string` ([CODE] `wallet-balance.models.ts:229`) | composite key `${nodeId}::${channelId\|'single'}` for snapshot/draft maps |
| `DraftMap` | `Map<DraftKey, number \| null>` ([CODE] `wallet-balance.models.ts:234`) | (declared, but component uses ad-hoc `Map<DraftKey, number\|null>`) |

## Constants
- `WALLET_BALANCE_TRANSLATION_KEYS` ([CODE] `wallet-balance.models.ts:59-77`) — translation-key lookup for each enum value
- `FALCON_ROOT_NODE` (from `@falcon`) — synthetic root used for Falcon-user view
- `SVG_ICON_NAMES.TRANSFER`, `SVG_ICON_NAMES.CURRENCY_SAR` (from `@falcon`) — icon name constants

## Helper functions

### createDraftKey
[CODE] `wallet-balance.models.ts:245-247`:
```typescript
export function createDraftKey(nodeId: string, channelId?: string): DraftKey {
  return `${nodeId}::${channelId || 'single'}`;
}
```

### parseDraftKey
[CODE] `wallet-balance.models.ts:253-259`:
```typescript
export function parseDraftKey(key: DraftKey): { nodeId: string; channelId?: string } {
  const [nodeId, channelOrSingle] = key.split('::');
  return {
    nodeId,
    channelId: channelOrSingle === 'single' ? undefined : channelOrSingle,
  };
}
```

### isDescriptionRequired (business rule)
[CODE] `transfer.models.ts:197-214`:
```typescript
export function isDescriptionRequired(
  sourceType: TransferEntityType,
  destinationType: TransferEntityType,
  mode: TransferMode
): boolean {
  if (mode !== TransferMode.MultipleWallets) {
    return false;
  }

  return (
    sourceType === TransferEntityType.CommChannelWallet ||
    destinationType === TransferEntityType.CommChannelWallet ||
    (sourceType !== TransferEntityType.MasterWallet &&
      destinationType !== TransferEntityType.MasterWallet)
  );
}
```

### toBackendEntityType (UI → backend enum)
[CODE] `transfer.models.ts:219-232`:
```typescript
export function toBackendEntityType(uiType: TransferEntityType): EntityType {
  switch (uiType) {
    case TransferEntityType.MasterWallet: return EntityType.MASTER;
    case TransferEntityType.Node:         return EntityType.NODE;
    case TransferEntityType.User:         return EntityType.USER;
    case TransferEntityType.CommChannelWallet: return EntityType.COMM_CHANNEL;
    default: return EntityType.NODE;
  }
}
```
[INFERRED] **Not actually called in the page code** — `ITransferRequest` carries `source.walletId / channelId` only. The `EntityType` enum + `toBackendEntityType()` are unused in v0.

### getCurrencyTranslationKey / getBalanceDistributionTranslationKey / getWalletStructureTranslationKey / getNodeTypeTranslationKey
[CODE] `wallet-balance.models.ts:264-287` — simple lookups against `WALLET_BALANCE_TRANSLATION_KEYS`.

## Final DTO count
- **8 enums** (Currency, WalletBalanceType, WalletType, NodeType, TransferMode, EntityType, TransferEntityType, TransferErrorCode)
- **13 interfaces** (ISaveBalancesRequest, IWalletQuery, ITransferRequest, ITransferEndpoint, IWalletDataResponse, IWalletAccountInfo, IWalletSummary, IChannel, IChannelBalance, IBalanceNode, IWalletChannelBalance, IBalanceChange, ITransferResponse, ITransferEntity, ITransferWallet, ITransferContext) — **15** when counting the transfer-only ones split out
- **5 helper functions**
- **2 type aliases**
- **1 const map**
