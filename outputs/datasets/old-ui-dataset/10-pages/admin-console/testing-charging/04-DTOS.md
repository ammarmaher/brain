# DTOs — testing-charging

All DTOs declared in `apps/admin-console/src/app/features/testing-charging/models/testing-charging.models.ts`.

## Shared / generic

### TestingChargingPagedResponse&lt;T&gt;

[CODE] File:line `:1-6`

```typescript
export interface TestingChargingPagedResponse<T> {
  page: number;
  pageSize: number;
  totalCount: number;
  items: T[];
}
```

- Used by: `getAccounts`, `getReservations`, `getLedger`, `getRuns`

## Response DTOs

### TestingChargingAccount

[CODE] File:line `:8-26`

```typescript
export interface TestingChargingAccount {
  accountId: string;
  tenantId: string;
  accountName: string;
  subscribedApplications?: TestingChargingAccountApplication[];
  subscribedOwners?: TestingChargingAccountOwner[];
  walletStrategyConfigured: boolean;
  currency?: string;
  walletBalanceType?: string;
  walletStructure?: string;
  activeContractCount: number;
  totalContractCount: number;
  createdAt: string;
  walletCount?: number;
  available?: number;
  reserved?: number;
  consumed?: number;
  lastTestingRun?: TestingChargingRun;
}
```

- Used by: `getAccounts.items[]`
- Drives left-column account cards; only items where `walletStrategyConfigured === true` are rendered (`testing-charging.component.ts:134`).

### TestingChargingAccountApplication

[CODE] File:line `:28-32`

```typescript
export interface TestingChargingAccountApplication {
  applicationId: string;
  applicationName?: string;
  status: string;
}
```

- Nested inside `TestingChargingAccount.subscribedApplications`
- Feeds simulator `Application` dropdown via `applicationOptions` getter (`testing-charging.component.ts:147-154`).

### TestingChargingAccountOwner

[CODE] File:line `:34-38`

```typescript
export interface TestingChargingAccountOwner {
  ownerId: string;
  ownerName: string;
  ownerType: string;
}
```

- Nested inside `TestingChargingAccount.subscribedOwners`
- Used by `resolveOwnerDisplayName` to map `ownerId + ownerType` → human label in the owner-wallet dropdown (`testing-charging.component.ts:395-401`).

### TestingChargingOverview

[CODE] File:line `:40-53`

```typescript
export interface TestingChargingOverview {
  accountId: string;
  totalAvailable: number;
  totalReserved: number;
  totalConsumed: number;
  walletCount: number;
  bucketCount: number;
  activeReservations: number;
  committedReservations: number;
  releasedReservations: number;
  failedTestMessages: number;
  lastLedgerTimestamp?: string;
  lastRun?: TestingChargingRun;
}
```

- Used by: `getOverview` response
- Feeds Overview tab KPI grid (`testing-charging.component.html:66-79`).

### TestingChargingWallet

[CODE] File:line `:55-68`

```typescript
export interface TestingChargingWallet {
  walletId: string;
  accountId: string;
  ownerType: string;
  ownerId: string;
  channel: string;
  currency: string;
  version: number;
  available: number;
  reserved: number;
  consumed: number;
  buckets: TestingChargingBucket[];
  expanded?: boolean;       // UI-only state (not from server)
}
```

- Used by: `getWallets[]` response
- The `expanded` field is mutated by template clicks to expand the wallet row to show its bucket preview (`testing-charging.component.html:99`).

### TestingChargingBucket

[CODE] File:line `:70-92` — **this is the DTO updated by the recent `add localdatetime to test charging model` commit**:

```typescript
export interface TestingChargingBucket {
  walletId: string;
  bucketId: string;
  contractId?: string;
  bucketType: string;
  serviceScope: string;
  status: string;
  totalAmount?: number;
  availableAmount?: number;
  reservedAmount?: number;
  consumedAmount?: number;
  totalUnits?: number;
  remainingUnits?: number;
  quotaCode?: string;
  quotaCategory?: string;
  subService?: string;
  unit?: string;
  effectiveFrom: string;
  expiresAt: string;
  effectiveFromLocalDateTime?: string;   // ← added by recent commit
  expiresAtLocalDateTime?: string;       // ← added by recent commit
  businessTimeZone?: string;             // ← added by recent commit
}
```

[INFERRED] The three new optional fields (`effectiveFromLocalDateTime`, `expiresAtLocalDateTime`, `businessTimeZone`) carry the account's business-timezone-localized representation of the existing UTC `effectiveFrom` / `expiresAt` timestamps. They are presently **not rendered** in the template (the Buckets tab shows availableAmount / reservedAmount / consumedAmount / remainingUnits / quota but no time-window columns yet — `testing-charging.component.html:142-153`) — the DTO change is ahead of the UI display.

### TestingChargingReservation

[CODE] File:line `:94-106`

```typescript
export interface TestingChargingReservation {
  reservationId: string;
  walletId: string;
  status: string;
  policyCode: string;
  refType: string;
  refId: string;
  ratedAmount: number;
  quotaUnits: number;
  billedUnits: number;
  expiresAt: string;
  allocationSummary: string;
}
```

- Used by: `getReservations.items[]`

### TestingChargingLedgerEntry

[CODE] File:line `:108-119`

```typescript
export interface TestingChargingLedgerEntry {
  id: string;
  walletId: string;
  bucketId?: string;
  contractId?: string;
  type: string;
  refType: string;
  refId: string;
  amount: number;
  currency: string;
  createdAt: string;
}
```

- Used by: `getLedger.items[]`

### TestingChargingBalances

[CODE] File:line `:121-124`

```typescript
export interface TestingChargingBalances {
  walletSnapshots: TestingChargingBalanceSnapshot[];
  contractSummaries: TestingChargingContractBalanceSummary[];
}
```

### TestingChargingBalanceSnapshot

[CODE] File:line `:126-138`

```typescript
export interface TestingChargingBalanceSnapshot {
  walletId: string;
  ownerType: string;
  ownerId: string;
  channel: string;
  currency: string;
  walletVersion: number;
  availableBalance: number;
  reservedBalance: number;
  consumedBalance: number;
  remainingQuotaUnits: number;
  updatedAt: string;
}
```

### TestingChargingContractBalanceSummary

[CODE] File:line `:140-148`

```typescript
export interface TestingChargingContractBalanceSummary {
  contractId: string;
  currency: string;
  totalFundedAmount: number;
  availableAmount: number;
  reservedAmount: number;
  consumedAmount: number;
  updatedAt: string;
}
```

### TestingChargingRun

[CODE] File:line `:150-171`

```typescript
export interface TestingChargingRun {
  runId: string;
  accountId: string;
  ownerId: string;
  channel: string;
  applicationId: string;
  priority: string;
  destination: string;
  unit: string;
  currency: string;
  messageCount: number;
  quantityPerMessage: number;
  reservedCount: number;
  committedCount: number;
  releasedCount: number;
  failedCount: number;
  deliveryMode: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  messages: TestingChargingMessageRecord[];
}
```

- Used by: `getRuns.items[]` (lightweight summary, `messages` may be empty), `getRun` (full document with `messages` populated), `createWhatsappBatch`, `triggerDeliveries`
- [CODE] `selectRun` calls `getRun(run.runId)` because the paged list intentionally omits the message records — see comment at `testing-charging.component.ts:265-266`.

### TestingChargingMessageRecord

[CODE] File:line `:173-185`

```typescript
export interface TestingChargingMessageRecord {
  sequence: number;
  referenceType: string;
  referenceId: string;
  reservationId?: string;
  reservationStatus: string;
  deliveryStatus: string;
  ratedAmount: number;
  quotaUnits: number;
  billedUnits: number;
  error?: string;
  updatedAt: string;
}
```

- Nested inside `TestingChargingRun.messages[]`
- Renders into the per-run commit grid (`testing-charging.component.html:270-279`).

## Request DTOs

### TestingChargingCreateWhatsappBatchRequest

[CODE] File:line `:187-202`

```typescript
export interface TestingChargingCreateWhatsappBatchRequest {
  accountId: string;
  ownerId: string;
  channelId?: string;
  applicationId: string;
  priority: string;            // AUTHENTICATION | UTILITY | ADVERTISEMENT | SERVICE
  destination: string;         // ISO-3 country (SAU, ARE, OMN, QAT, KWT, YEM, JOR, EGY, USA, GBR, IND)
  unit: string;                // typically 'MESSAGE'
  currency: number;            // numeric currency code (not ISO string) — defaults to 1
  messageCount: number;        // template-constrained 1..1000
  quantityPerMessage: number;  // template-constrained min 1
  reservationTtlSeconds: number; // default 3600 — "Manual batches use at least 3600 seconds"
  parallelism: number;         // template-constrained 1..100
  deliveryMode: string;        // Manual | AutoDelivered | AutoFailed | MixedBySuccessRate
  successRate?: number;        // template-constrained 0..100
}
```

- Used by: `createWhatsappBatch` POST body
- Defaults set in `testing-charging.component.ts:53-68`

### TestingChargingTriggerDeliveryRequest

[CODE] File:line `:204-208`

```typescript
export interface TestingChargingTriggerDeliveryRequest {
  deliveryMode: string;
  successRate?: number;
  sequences?: number[];        // optional subset of message sequences to target
}
```

- Used by: `triggerDeliveries` POST body
- `sequences` is declared in the DTO but the current UI never sets it (`testing-charging.component.ts:248-251` only sends `deliveryMode` + `successRate`) — present for future per-message targeting.

## Shared / enums

[CODE] No formal TypeScript `enum` is declared in this feature. The following are **string-union literal types** declared inline in the component file:

| Type | Members | File:line |
|---|---|---|
| `TestingChargingTab` | `'overview' \| 'wallets' \| 'buckets' \| 'reservations' \| 'ledger' \| 'balances' \| 'runs' \| 'simulator'` | `testing-charging.component.ts:17` |
| `TestingChargingSelectOption` | `{ label: string; value: string }` | `:18` |
| `TestingChargingOwnerOption` | `TestingChargingSelectOption & { ownerId: string; channelId?: string; walletChannel: string }` | `:19-23` |

[INFERRED] `priority` and `deliveryMode` are typed as `string` rather than literal unions, but the valid runtime values come from the static option lists declared on the component (`priorityOptions` at `:81-86`, `deliveryMode` options hard-coded in the template at `:333-337`).

## DTO totals

- **Generic:** 1 (`TestingChargingPagedResponse<T>`)
- **Response:** 11 (`Account`, `AccountApplication`, `AccountOwner`, `Overview`, `Wallet`, `Bucket`, `Reservation`, `LedgerEntry`, `Balances`, `BalanceSnapshot`, `ContractBalanceSummary`) + 2 (`Run`, `MessageRecord`) = 13
- **Request:** 2 (`CreateWhatsappBatchRequest`, `TriggerDeliveryRequest`)
- **Inline tab-state types:** 3 (`TestingChargingTab`, `TestingChargingSelectOption`, `TestingChargingOwnerOption`)
- **Grand total:** **14 module-level interfaces** + 3 inline component-scoped types = 17
