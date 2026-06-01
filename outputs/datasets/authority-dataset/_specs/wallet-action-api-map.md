---
type: feature-action-api-map
task: wallet-balance-mgmt-reskin
created: 2026-05-28
purpose: "Per-action mapping from FE intent to backend endpoint + DTO + PES key + error codes for Wallet & Balance .Mng across both consoles."
---

# Wallet & Balance .Mng — Per-Action API Mapping

> [!summary]
> Every action visible in the T2 mockup mapped to the **existing** backend endpoint, DTO shape, gateway, and PES gate. **Zero backend additions required.** Source of truth: `origin/main` (FE wiring) + `Charging Service ENDPOINT_REGISTRY.md` (BE contracts).

## Action → API table

| # | FE Action (mockup UI label) | FE Method | Endpoint | HTTP | Gateway (admin) | Gateway (mgmt) | Request DTO | Response DTO | PES Key (admin) | Server-driven gate (mgmt) | Possible error codes |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | **Load page** (initial mount → wallet hierarchy + summary + channels) | `walletService.getWalletData(query)` | `api/commerce/accounts/{accountId}/hierarchy?currency=&balanceDistribution=&walletStructure=` | GET | `SystemGateway` (default arg-less `useGateway()`) | `CoreGateway` (default arg-less `useGateway()`) | `IWalletQuery { selectedNodeId, currency, balanceDistribution, walletStructure }` | `IWalletDataResponse { accountInfo, channels[], summary, nodeTree, canSave, canTransfer, canDoActions }` | (route guard: `app.admin-console.view`) | (route guard: `app.management-console.view`); response `canSave`/`canTransfer` drive per-button gating | 401 (unauthenticated), 403 (no `view` on console), 404 (account not found), 500 (service error) |
| 2 | **Switch tree node** (click node in Falcon view tree picker) | re-issues `getWalletData(query)` with new `selectedNodeId` | same as #1 | GET | `SystemGateway` | n/a — mgmt has no tree | same | same | same | n/a | same |
| 3 | **Change Currency** (`SAR` ↔ `Points` dropdown) | re-issues `getWalletData(query)` with new `currency` | same as #1 | GET | same | same | same w/ new `currency` | same | same | same | same |
| 4 | **Change Balance Type** (`Node Based` ↔ `User Based` segmented control) — **Falcon-only** | re-issues `getWalletData(query)` with new `balanceDistribution` | same as #1 | GET | `SystemGateway` | n/a (control hidden) | same w/ new `balanceDistribution` | same | requires `canViewWalletStrategy` | n/a | same |
| 5 | **Change Wallet Type** (`Single` ↔ `Multiple` segmented control) | re-issues `getWalletData(query)` with new `walletStructure` | same as #1 | GET | same | same | same w/ new `walletStructure` | same | requires `canViewWalletStrategy` (admin); always-visible (mgmt) | same | same |
| 6 | **Save Strategy** (admin Edit→Save flow) — **Falcon-only effective; mgmt dormant** | `walletService.saveChanges(request)` | `commerce/setting/wallets` | POST | `SystemGateway` | `CoreGateway` | `ISaveBalancesRequest { accountId, currency, balanceDistribution, walletStructure, balanceChanges[] }` | `ServiceOperationResult<unknown>` | requires `canEditWalletStrategy` (admin); `canSave===true` (mgmt server flag) | mgmt server flag | 400 (validation), 403, 409 (conflicting state), 422 (rule violation), 500 |
| 7 | **Open Transfer drawer from row** (per-row Transfer icon button) | opens `BalanceTransferComponent` w/ `preSelectedSource=row` | n/a (UI only) | n/a | n/a | n/a | n/a — UI state only | n/a | requires `canTransferWallet` + `canDoActions` (admin) | `canTransfer === true` (mgmt server flag) | n/a |
| 8 | **Open Transfer drawer from Master Wallet card** (admin only) | opens drawer w/ `fromMasterWallet=true` + `preSelectedSource=masterWallet` | n/a (UI only) | n/a | n/a | n/a (no Master on mgmt per parity) | n/a | n/a | requires `isFalconUser && canTransferWallet` | n/a (Master Wallet absent) | n/a |
| 9 | **Confirm Transfer** (drawer Save button — "Send Money" / "Transfer Money") | `walletService.transfer(request)` | admin: `charging/wallet/transfer`; mgmt: `wallet/transfer` (**different prefix on mgmt**) | POST | `SystemGateway` (arg-less `useGateway()`; the `charging/` prefix routes via SystemGateway → Charging service) | **`ChargingGateway`** (`useGateway(Gateway.ChargingGateway)` — explicit override; one of only 2 places mgmt overrides default) | `ITransferRequest { amount, currency, description, source: { walletId, channelId }, destination: { walletId, channelId } }` | `ServiceOperationResult<ITransferResponse> { isSuccessful, errors[], errorCodes[], result: { success, message, transactionId, errorCode } }` | requires `canTransferWallet` (admin) | `canTransfer === true` (mgmt server flag) — plus backend rejects ANY mgmt user trying to transfer across accounts | `INSUFFICIENT_BALANCE`, `NO_ACTIVE_CONTRACTS`, `CONTRACT_DEDUCTION_FAILED`, `INVALID_SOURCE`, `INVALID_DESTINATION`, `INVALID_AMOUNT`, `SAME_SOURCE_DESTINATION`, `UNAUTHORIZED`, `UNKNOWN` |
| 10 | **Cancel Transfer** (drawer Cancel button) | closes drawer | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| 11 | **Pagination** (10 / 20 / 30 / 40 rows per page) | client-side slice over `nodeTree` | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a | n/a |
| 12 | **Switch Perspective** (Falcon ↔ Client mockup switcher) — **Falcon-only affordance** | route navigation: `/admin/...` ↔ `/mgmt/...` (host-shell handoff) | n/a | n/a | n/a | n/a | n/a | n/a | requires `isFalconUser` | n/a | n/a |
| 13 | **Edit** button (admin Falcon view header) | toggles `editMode` signal; enables Settings card form controls | n/a (UI only) | n/a | n/a | n/a | n/a | n/a | requires `canEditWalletStrategy` | n/a | n/a |

## Backend controller mapping

| FE endpoint | Service | Controller | Action | File:line |
|---|---|---|---|---|
| `api/commerce/accounts/{accountId}/hierarchy` | Commerce (via Gateway aggregator) | `WalletAggregatorController` (or equivalent) | `GetHierarchy` | `[BRAIN-OUT] understanding/backend/commerce/ENDPOINT_REGISTRY.md` (Commerce service) + System/Core gateway aggregation layer |
| `commerce/setting/wallets` | Commerce | `WalletSettingController` (or similar) | `SaveStrategy` | same |
| `charging/wallet/transfer` (admin) / `wallet/transfer` (mgmt via ChargingGateway override) | Charging | `WalletController` | `TransferBalance` | `[BRAIN-OUT] understanding/backend/charging/ENDPOINT_REGISTRY.md:18` |

## Kafka side-effects (transfer)

Per `[BRAIN-OUT] understanding/backend/charging/SERVICE_OVERVIEW.md:65-79`:

| Direction | Topic | Triggered by |
|---|---|---|
| produce | `charging.ocs-wallet-events.v1` | Successful `TransferBalance` → outbox → `OcsWalletEventPublisher` → downstream Ledger consumption |

**FE impact**: none directly. The FE only reacts to the synchronous `ServiceOperationResult<TransferBalanceResponse>` response. SignalR realtime updates may surface the resulting balance change via the existing `falcon-comm-realtime-svc` channel (see `[MEMORY] project_signalr_realtime_loader_skeleton_handoff_2026_05_19.md`), but that's existing infra — not new for this work.

## Error display contract (per FE-CONTRACT.md)

For action #9 (Transfer):

| HTTP status / `errorCode` | FE behavior |
|---|---|
| 200 + `isSuccessful=true` | Toast success "Transfer of {amount} {currency} completed (txn {transactionId})" + close drawer + reload hierarchy |
| 200 + `isSuccessful=false` + `errorCode=INSUFFICIENT_BALANCE` | Show `falcon-insufficient-balance-dialog` w/ source balance details |
| 200 + `isSuccessful=false` + `errorCode=NO_ACTIVE_CONTRACTS` / `CONTRACT_DEDUCTION_FAILED` | Inline drawer error: "Transfer rejected — {errorMessage}" + drawer stays open |
| 200 + `isSuccessful=false` + `errorCode=INVALID_*` / `SAME_SOURCE_DESTINATION` / `INVALID_AMOUNT` | Inline form-level error highlighting offending field |
| 200 + `isSuccessful=false` + `errorCode=UNAUTHORIZED` | Toast error + close drawer + redirect to login (or page-level NotAuthorized) |
| 4xx / 5xx | Inline drawer error from `errorMessages[0]` (localized) per FE-CONTRACT.md F-005 |

All toasts via `FalconNotificationService` (Falcon UI Core) — NEVER `MessageService` (PrimeNG).

## Account ID resolution

| Console | Source | Code |
|---|---|---|
| admin | Selected tree node id (cross-account) | `[CODE] origin/main admin component.ts` (tree picker integration) |
| mgmt | `session.tenantId \|\| session.client_id` (always main account, never sub-node) | `[CODE] mgmt wallet-balance.service.ts:48-51 resolveSelectedAccountId()` |

## See also

- Investigation: `_investigation/wallet-balance-mgmt-2026-05-28.md`
- SPEC admin: `_specs/wallet-admin-2026-05-28.md`
- SPEC mgmt: `_specs/wallet-mgmt-2026-05-28.md`
- Parity: `04-feature-parity-matrix/wallet-balance-management.compare.md`
- Charging registry: `Brain Outputs/understanding/backend/charging/ENDPOINT_REGISTRY.md`
