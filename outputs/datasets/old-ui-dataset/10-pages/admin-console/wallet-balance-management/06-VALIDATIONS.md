# Validations — wallet-balance-management

## Reactive form validators (sync)
**None.** Neither `WalletBalanceManagementComponent` nor `BalanceTransferComponent` uses `FormBuilder`, `FormGroup`, or `FormControl`. All inputs are template-driven with `[(ngModel)]` and validity is computed via plain getters.

## Async validators
**None.**

## Template-level validators
- `p-inputNumber` on transfer amount ([CODE] `balance-transfer.component.html:169-180`):
  - `[min]="0.01"`
  - `mode="decimal"`
  - `[minFractionDigits]="2"`
  - `[maxFractionDigits]="2"`
- `[forceSelection]="true"` on source + destination `p-autoComplete` ([CODE] `balance-transfer.component.html:56, :117`) — user must pick from the suggestion list, free text is rejected.

## Business rules in code (transfer drawer)

### Rule A — Balance distribution filtering (Table Tree only)
[CODE] `transfer.models.ts:7-12` (comment) + implementation `balance-transfer.component.ts:492-528`:
```typescript
private filterByBalanceType(entity: ITransferEntity): boolean {
  if (!this.context) return true;
  const isUserBased = this.context.balanceDistribution === WalletBalanceType.UserBased;
  if (entity.nodeType === undefined) return !isUserBased;
  return isUserBased ? entity.nodeType === NodeType.User : entity.nodeType !== NodeType.User;
}
```
- `NodeBased` → only `NodeType.Organization | NodeType.Service` entities are eligible
- `UserBased` → only `NodeType.User` entities are eligible

### Rule B — Multiple Wallets hierarchy
[CODE] `transfer.models.ts:13-18` (comment) + implementation `balance-transfer.component.ts:457-490` (`isTransferPathValid()`):
| Source type | Allowed destination types | Channel constraint |
|---|---|---|
| `MasterWallet` (in `MultipleWallets` mode) | `CommChannelWallet` ONLY | — |
| `CommChannelWallet` | `MasterWallet`, `Node`, `User` | dest channel must match source channel for Node/User |
| `Node` / `User` | `CommChannelWallet`, `Node`, `User` | source channel and destination channel must match |

[CODE] `balance-transfer.component.ts:467-489`:
```typescript
if (sourceType === TransferEntityType.MasterWallet) {
  return destinationType === TransferEntityType.CommChannelWallet;
}

if (sourceType === TransferEntityType.CommChannelWallet) {
  if (destinationType === TransferEntityType.MasterWallet) return true;
  if (destinationType === TransferEntityType.Node || destinationType === TransferEntityType.User) {
    return !!sourceChannel && !!destinationChannel && sourceChannel === destinationChannel;
  }
  return false;
}

if (sourceType === TransferEntityType.Node || sourceType === TransferEntityType.User) {
  if (destinationType === TransferEntityType.CommChannelWallet) {
    return !!sourceChannel && !!destinationChannel && sourceChannel === destinationChannel;
  }
  if (destinationType === TransferEntityType.Node || destinationType === TransferEntityType.User) {
    return !!sourceChannel && !!destinationChannel && sourceChannel === destinationChannel;
  }
}
```

### Rule C — Master Wallet entry-point only
[CODE] `transfer.models.ts:14-17` (comment) + enforcement in destination-entity filtering ([CODE] `balance-transfer.component.ts:403-419`):
```typescript
if (this.selectedSourceEntity.type === TransferEntityType.MasterWallet) {
  destinations = destinations.filter(d => {
    if (this.isMultipleWalletsMode) {
      return d.type === TransferEntityType.CommChannelWallet;
    }
    if (d.type === TransferEntityType.Node || d.type === TransferEntityType.User) {
      return this.filterByBalanceType(d);
    }
    return false;
  });
}
```
- Master is exposed only when the user clicks the master-wallet transfer button (`fromMasterWallet=true`). [CODE] `wallet-balance-management.component.ts:684-688, 704-708`: master wallet only added to `sourceEntities` / `destinationEntities` when `fromMasterWallet=true` in MultipleWallets mode; in SingleWallet mode it is always present in both lists.
- In MultipleWallets mode when `fromMasterWallet=false`, the master is excluded from destinations ([CODE] `balance-transfer.component.ts:449-451`).

### Rule D — Source ≠ Destination
[CODE] `balance-transfer.component.ts:155, 158-164`:
```typescript
if (this.selectedSourceEntity.id === this.selectedDestinationEntity.id) return false;
...
if (this.isMultipleWalletsMode && this.selectedSourceWallet && this.selectedDestinationWallet) {
  // Only block when both entity AND channel are the same (true same-wallet transfer)
  if (this.selectedSourceEntity.id === this.selectedDestinationEntity.id
    && this.selectedSourceWallet.channelId === this.selectedDestinationWallet.channelId) {
    return false;
  }
}
```
Same-entity-different-channel transfers ARE allowed (a node can transfer between its own channel wallets). True same-wallet transfers are blocked.

### Rule E — Amount ≤ Source balance
[CODE] `balance-transfer.component.ts:189-192`:
```typescript
get isAmountExceedsBalance(): boolean {
  if (this.sourceBalance === null || this.transferAmount === null) return false;
  return this.transferAmount > this.sourceBalance;
}
```
Visual error hint at `balance-transfer.component.html:186-189`. The form is blocked from submitting via `isFormValid` ([CODE] `:139`).

### Rule F — Description required for CommChannel transfers
Helper `isDescriptionRequired` from `transfer.models.ts:197-214` (see [[04-DTOS]]). Enforced at [CODE] `balance-transfer.component.ts:154`:
```typescript
if (this.isDescriptionRequired && !this.transferDescription.trim()) return false;
```
Description field shows `*` and a hint message when required ([CODE] `balance-transfer.component.html:195-207`).

### Rule G — Multiple-wallet requires wallet selection
[CODE] `balance-transfer.component.ts:141-152`:
```typescript
if (this.isMultipleWalletsMode) {
  const sourceIsMasterOrChannel = this.selectedSourceEntity.type === TransferEntityType.MasterWallet || this.selectedSourceEntity.type === TransferEntityType.CommChannelWallet;
  const destIsMasterOrChannel = this.selectedDestinationEntity.type === TransferEntityType.MasterWallet || this.selectedDestinationEntity.type === TransferEntityType.CommChannelWallet;

  if (!sourceIsMasterOrChannel && (!this.selectedSourceWallet || !this.selectedSourceWallet.channelId)) {
    return false;
  }
  if (!destIsMasterOrChannel && (!this.selectedDestinationWallet || !this.selectedDestinationWallet.channelId)) {
    return false;
  }
}
```
Node/User selections in multiple-wallet mode REQUIRE a wallet (channel) pick. Master and CommChannel selections do not.

## Page-level validators

### Wallet-strategy save: server-driven `canSave`
The hierarchy response includes a `canSave: boolean` ([CODE] `wallet-balance.models.ts:206`) that overrides client-side intent. Client also blocks save when `!canEditWalletStrategy`.

### Save target: account-level ID required
[CODE] `wallet-balance-management.component.ts:859-866`:
```typescript
private resolveSelectedAccountId(): string | null {
  const accountId = this.accountInfo?.accountId
    ?? this.selectedOrgNode?.data?.raw?.id
    ?? this.selectedOrgNodeId;
  if (!accountId || accountId === FALCON_ROOT_NODE.id) return null;
  return accountId;
}
```
- Falls through three sources for the account ID
- **Falcon synthetic root is rejected** — Save against `FALCON_ROOT_NODE.id` returns `null` and the toast says "select a node".

### Cell-input parsing
[CODE] `wallet-balance-management.component.ts:401-412`:
```typescript
onInputBlur(event: Event, node: IBalanceNode, channelId?: string): void {
  const input = event.target as HTMLInputElement;
  const rawValue = input.value.replace(/,/g, '');
  const parsedValue = rawValue ? parseFloat(rawValue) : null;
  if (parsedValue !== null && !isNaN(parsedValue)) {
    this.setCellValue(node, parsedValue, channelId);
  }
  const currentValue = this.getCellValue(node, channelId);
  input.value = currentValue !== null ? currentValue.toLocaleString('en-US') : '';
}
```
- Strips commas (en-US grouping)
- `parseFloat` (lax — accepts trailing garbage)
- Reformats with `toLocaleString('en-US')`
- [INFERRED] All cell inputs are currently rendered `[disabled]="true"` in the template ([CODE] `…component.html:393, :411`), so this handler is effectively dead code — the cell-edit feature is half-built.

## Validators count summary
- Reactive validators: 0
- Async validators: 0
- Template attribute validators: 4 (`min`, `forceSelection`, `minFractionDigits`, `maxFractionDigits`)
- Business-rule predicates: **7** (Rules A–G above)
- Composite form validity: `isFormValid` getter ([CODE] `balance-transfer.component.ts:134-167`) ties all of B–G together
