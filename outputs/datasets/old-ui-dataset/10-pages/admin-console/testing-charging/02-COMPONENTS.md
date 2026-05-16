# Components — testing-charging

## Tree

```
TestingChargingComponent (selector: app-testing-charging)
└── (no sub-components — entire UI is rendered inline via tabs)
    ├── Accounts aside (left)
    ├── Selected-account header
    ├── Tab nav (8 tabs)
    └── Tab panels:
        ├── overview     — KPI grid (8 cards)
        ├── wallets      — expandable table with bucket preview row
        ├── buckets      — flattened-bucket table
        ├── reservations — reservations table
        ├── ledger       — ledger entries table
        ├── balances     — wallet snapshots + contract summaries (2-col)
        ├── runs         — commit-record cards + selected-run messages table
        └── simulator    — WhatsApp simulator form
```

[CODE] One component, zero composition. The component file is 414 lines and the template is 346 lines. Source: `apps/admin-console/src/app/features/testing-charging/testing-charging.component.ts:25-32` and `.component.html`.

## Per-component

### TestingChargingComponent

- File: `apps/admin-console/src/app/features/testing-charging/testing-charging.component.ts`
- Selector: `app-testing-charging`
- Standalone: `true` (`testing-charging.component.ts:27`)
- Imports: `CommonModule`, `FormsModule` (`testing-charging.component.ts:28`)
- Inputs: none
- Outputs: none
- Implements: `OnInit` (`testing-charging.component.ts:32`)

#### Services injected (via inject())

| Service | Source | File:line |
|---|---|---|
| `TestingChargingApiService` | `./services/testing-charging-api.service` | `testing-charging.component.ts:33` |

[CODE] Single-service component — `private readonly api = inject(TestingChargingApiService);` — no other DI.

#### Component state (plain class fields, no signals)

| Field | Type | Initial | Purpose |
|---|---|---|---|
| `search` | `string` | `''` | Accounts search box (template `[(ngModel)]`) |
| `loadingAccounts` | `boolean` | `false` | Spinner gate for accounts list |
| `loadingDetails` | `boolean` | `false` | Spinner gate for forkJoin refresh |
| `runningBatch` | `boolean` | `false` | Disables form during create/trigger |
| `error` | `string \| undefined` | `undefined` | Error banner text |
| `activeTab` | `TestingChargingTab` | `'overview'` | Tab selector — union of 8 string literals |
| `accounts` | `TestingChargingAccount[]` | `[]` | All accounts returned by `getAccounts()` |
| `selectedAccount` | `TestingChargingAccount \| undefined` | `undefined` | Currently selected row |
| `overview` | `TestingChargingOverview \| undefined` | `undefined` | KPI tab data |
| `wallets` | `TestingChargingWallet[]` | `[]` | Wallets tab data (also feeds buckets via `allBuckets` getter) |
| `reservations` | `TestingChargingReservation[]` | `[]` | Reservations tab data |
| `ledger` | `TestingChargingLedgerEntry[]` | `[]` | Ledger tab data |
| `balances` | `TestingChargingBalances \| undefined` | `undefined` | Wallet snapshots + contract summaries |
| `runs` | `TestingChargingRun[]` | `[]` | Commit records list |
| `selectedRun` | `TestingChargingRun \| undefined` | `undefined` | Selected run's message list |
| `selectedOwnerWalletKey` | `string` | `''` | `${ownerId}::${channelId}` composite key for simulator dropdown |
| `simulator` | `TestingChargingCreateWhatsappBatchRequest` | see below | Simulator form model bound via `[(ngModel)]` |

#### Simulator default state (`testing-charging.component.ts:53-68`)

```typescript
simulator: TestingChargingCreateWhatsappBatchRequest = {
  accountId: '',
  ownerId: '',
  channelId: undefined,
  applicationId: '',
  priority: 'UTILITY',
  destination: 'JOR',
  unit: 'MESSAGE',
  currency: 1,
  messageCount: 10,
  quantityPerMessage: 1,
  reservationTtlSeconds: 3600,
  parallelism: 20,
  deliveryMode: 'Manual',
  successRate: 80,
};
```

#### Tab catalogue (`testing-charging.component.ts:70-79`)

```typescript
readonly tabs: { id: TestingChargingTab; label: string }[] = [
  { id: 'overview',     label: 'Overview' },
  { id: 'wallets',      label: 'Wallets' },
  { id: 'buckets',      label: 'Buckets' },
  { id: 'reservations', label: 'Reservations' },
  { id: 'ledger',       label: 'Ledger' },
  { id: 'balances',     label: 'Balances' },
  { id: 'runs',         label: 'Commit Records' },
  { id: 'simulator',    label: 'WhatsApp Simulator' },
];
```

#### Static option lists

[CODE] Priority options (`testing-charging.component.ts:81-86`): `AUTHENTICATION`, `UTILITY`, `ADVERTISEMENT`, `SERVICE`.

[CODE] Destination options (`testing-charging.component.ts:88-100`): 11 ISO-3 codes — `SAU`, `ARE`, `OMN`, `QAT`, `KWT`, `YEM`, `JOR`, `EGY`, `USA`, `GBR`, `IND`.

#### Lifecycle

- `ngOnInit()` → `loadAccounts()` (`testing-charging.component.ts:102-104`)
- No `ngOnDestroy` — all subscriptions are `finalize()`-bounded and complete after a single emission via the unwrap pipeline

#### Public methods (template-callable)

| Method | Purpose | Endpoints fired | Source |
|---|---|---|---|
| `loadAccounts()` | Fetch accounts, restore prior selection, auto-select first wallet-strategy account | `getAccounts` | `:106-131` |
| `selectAccount(account)` | Set selected account, default simulator app/owner, fetch all details | `getOverview`, `getWallets`, `getReservations`, `getLedger`, `getBalances`, `getRuns` (via `forkJoin`) | `:137-145` |
| `selectSimulatorOwner(key)` | Decode `${ownerId}::${channelId}` composite key into `simulator.ownerId` + `simulator.channelId` | none | `:187-195` |
| `loadAccountDetails(accountId, preferredRun?)` | `forkJoin` of 6 endpoints + re-sync selected run | 6 in parallel | `:197-224` |
| `createBatch()` | POST a new WhatsApp batch run | `createWhatsappBatch` then `loadAccountDetails` | `:226-241` |
| `triggerDeliveries(mode)` | POST delivery callbacks on the selected run | `triggerDeliveries` then `loadAccountDetails` | `:243-260` |
| `selectRun(run)` | Set selected run from summary and load message detail | `getRun` | `:262-271` |

#### Public getters (template-bound)

| Getter | Returns | Source |
|---|---|---|
| `walletStrategyAccounts` | `accounts.filter(a => a.walletStrategyConfigured)` | `:133-135` |
| `applicationOptions` | `{ label, value }[]` from `selectedAccount.subscribedApplications` | `:147-154` |
| `ownerOptions` | `{ label, value, ownerId, channelId, walletChannel }[]` from wallets filtered to `NODE`/`USER` ownerType + WhatsApp channel detection | `:156-185` |
| `allBuckets` | `wallets.flatMap(w => w.buckets ?? [])` | `:273-275` |
| `canCreateBatch` | Boolean derived from selected account + form completeness + not currently running | `:277-284` |

#### Private logic (orchestration helpers)

[CODE] The component contains nontrivial **wallet-channel resolution logic** (`testing-charging.component.ts:286-401`) because the simulator is WhatsApp-specific but the OCS reserve path needs concrete owner-wallet + activated channel id:

- `applySimulatorWalletDefaults()` — sorts `ownerOptions` by available balance, picks the wallet with positive availability
- `applySimulatorApplicationDefault(account)` — picks first subscribed application; protects against stale demo values like `SurveyApp`
- `syncSelectedRunAfterRefresh(preferredRun, preferredRunId)` — keeps the selected run sticky across `loadAccountDetails` refresh
- `replaceRunSummary(run)` — merges the detail run into the paged list
- `hasAvailableWalletBalance(key)` — looks up by composite owner-channel key
- `buildOwnerWalletKey(ownerId, channelId)` — `${ownerId}::${channelId}`
- `resolveWhatsappChannelId()` — searches wallets and buckets for explicit channel id (used when only `ALL` channel wallets exist)
- `walletLooksLikeWhatsapp(wallet)` — fuzzy match on `channel` / `quotaCode` / `subService` / `bucketId`
- `normalizeChannel(channel)` — trim + uppercase, defaulting to `'ALL'`
- `isAllChannel(channel)` — boolean
- `sameId(left, right)` — case-insensitive trim equality
- `resolveOwnerDisplayName(ownerId, ownerType)` — joins back to `subscribedOwners` for human-readable label

#### TrackBy functions

- `trackByAccount` → `account.accountId` (`:403-405`)
- `trackByWallet` → `wallet.walletId` (`:407-409`)
- `trackByBucket` → `${wallet.walletId}:${bucket.bucketId}` (`:411-413`)

## Template highlights

[CODE] `testing-charging.component.html`:

| Region | Lines | Purpose |
|---|---|---|
| Accounts aside (search + list) | 2-34 | Input + Refresh button + scrollable card list, filtered to `walletStrategyAccounts` |
| Header + Refresh OCS State | 36-51 | Active account title + global refresh button |
| Error banner | 53 | `*ngIf="error"` red panel |
| Tab nav | 55-64 | `*ngFor` over `tabs` |
| Overview panel | 66-79 | 8 KPI cards in grid + `lastLedgerTimestamp` meta |
| Wallets panel | 81-121 | Expandable rows (`wallet.expanded`) with inline bucket preview |
| Buckets panel | 123-157 | Flat bucket table |
| Reservations panel | 159-191 | Reservation table |
| Ledger panel | 193-221 | Ledger table |
| Balances panel | 223-241 | Two-column grid (wallet snapshots, contract summaries) |
| Runs panel | 243-282 | Run cards + 3 delivery-trigger buttons + messages table |
| Simulator panel | 284-344 | 11-field form + Create Testing Batch button |

## Falcon components used

[CODE] **None.** The page uses zero `<falcon-*>` components — every UI primitive is raw HTML (`<button>`, `<input>`, `<select>`, `<table>`) styled by the scoped SCSS. This is consistent with its QA-tool intent and predates the Falcon UI Core component library.

## PrimeNG components used

[CODE] **None.** No PrimeNG imports in `testing-charging.component.ts`. The component never imports `primeng/*`.

## SCSS observations

[CODE] `testing-charging.component.scss` is 320 lines of hand-rolled CSS — hardcoded palette (`#173d35` deep green, `#2d6f5d` mid green, `#fffdf8` cream, `#9d4c2f` rust), serif `h1/h2` via `Georgia, 'Times New Roman'`, radial-gradient background, pill `border-radius: 999px` buttons. No token variables, no Tailwind utilities, no theme integration.
