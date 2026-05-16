# DIFF — wallet-balance-management (management-console vs admin-console)

> Mgmt-console version: `apps/management-console/src/app/features/wallet-balance-management/`
> Admin-console version: `apps/admin-console/src/app/features/wallet-balance-management/`

## Routing diff
| Path | Admin-console | Management-console | Why |
|---|---|---|---|
| Path slug | `wallet-balance-management` | `wallet-balance-management` | Same URL |
| Component loader | `loadComponent` (lazy) | `component: WalletBalanceManagementComponent` (synchronous) | Mgmt uses synchronous imports |
| Guard | `shellAccessGuard` | **NO `shellAccessGuard`** — only inherits app-level `managementConsoleGuard` | Mgmt's wallet route is the only one with no route-level guard (notable gap or intentional). Admin enforces shellAccessGuard. |
| PBAC key | No explicit `data.access` (relies on `shellAccessGuard`) | No `data.access` declared either | Wallet routes have no documented PBAC key in either app — relies on app-level guard |

## Component diff

### Architecture diverges significantly
- **Admin-console**: provides a full org-hierarchy tree picker on the left and lets Falcon admins configure ANY account's wallets. The selected tree node drives the wallet load.
- **Mgmt-console**: **no tree picker** — `selectedOrgNodeId` is hardcoded to the current session's `accountId` (`session.tenantId || session.client_id`). Client users can ONLY configure their own account's wallet.

```typescript
// management-console/wallet-balance-management.component.ts:381-400 (initializeAccountContext)
const accountId = this.sessionProvider.session?.tenantId
  || this.sessionProvider.session?.client_id
  || this.sessionProvider.node?.tenantId
  || this.sessionProvider.node?.id
  || null;
// ... "Management-console users can only configure their own account."
this.selectedOrgNodeId = accountId;
```

### Components only in mgmt
- `BalanceTransferComponent` (drawer-based wallet → wallet transfer wizard) — under `components/balance-transfer/`
- Mgmt has all the master-wallet ↔ channel-wallet transfer logic (Source/Destination autocomplete, channel-restricted destination matching when source is a channel wallet, etc.)

### Components only in admin
- Admin's tree-picker scaffolding (the left-pane tree, node loading)
- Admin-console's wallet page has its own equivalent transfer flow but may not have the BalanceTransferComponent under `components/` folder (admin's transfer flow is integrated inline, vs mgmt's component extraction).

### Identical features
- Currency selector (SAR / Points)
- Distribution mode selector (Node-based / User-based)
- Structure selector (Single wallet / Multiple wallets)
- Tree of nodes with balance editing per node (and per channel in multi-wallet mode)
- Draft / snapshot pattern for unsaved changes detection
- Save / Cancel flow

## Service / API diff

### Wallet data endpoint
| Method | URL | Service | Notes |
|---|---|---|---|
| GET | `api/commerce/accounts/{accountId}/hierarchy?currency=N&balanceDistribution=N&walletStructure=N` | `WalletBalanceService.getWalletData(query)` | **Same URL in both apps** |

The URL is unusual — it starts with `api/` (vs other services starting with `commerce/` directly). Mgmt comment (`wallet-balance.service.ts:18-19`) calls this the "Core Gateway aggregation endpoint" — different from the generic Commerce proxy.

### Save endpoint — SAME
| Method | URL | Service |
|---|---|---|
| POST | `commerce/setting/wallets` | `WalletBalanceService.saveChanges(request)` |

### Transfer endpoint — DIFFERS in routing
| App | URL | Gateway used |
|---|---|---|
| Admin-console | `charging/wallet/transfer` (`admin-console/.../wallet-balance.service.ts:64`) | Default (System Gateway → Charging via System Gateway proxy) |
| Mgmt-console | `wallet/transfer` (`management-console/.../wallet-balance.service.ts:62`) — **with explicit `useGateway(Gateway.ChargingGateway)`** | Explicit Charging Gateway (not Core, not System) |

So mgmt **uses a different gateway** for the transfer call — explicitly `Gateway.ChargingGateway`, bypassing the default `Gateway.CoreGateway`. This is one of the only places in the entire management-console app where the gateway is explicit instead of inherited.

Comment in mgmt code says:
```typescript
// management-console/.../wallet-balance.service.ts:60-66
transfer(request: ITransferRequest): Observable<ServiceOperationResult<ITransferResponse>> {
  const url = 'wallet/transfer';
  return this.http.post<...>(url, request, {
    ...useGateway(Gateway.ChargingGateway),
  });
}
```

## DTO diff
- `IWalletQuery`, `IWalletDataResponse`, `ISaveBalancesRequest`, `IBalanceChange`, `IBalanceNode`, `IChannel`, `IChannelBalance`, `IWalletAccountInfo`, `IWalletSummary`, `IWalletChannelBalance` — present in both apps.
- `ITransferRequest`, `ITransferResponse`, `ITransferContext`, `ITransferEntity`, `ITransferEndpoint`, `ITransferWallet` — present in both (mgmt has them in `models/transfer.models.ts:55-220`).
- `TransferMode`, `EntityType`, `TransferEntityType`, `TransferErrorCode` enums — same in both.
- Both apps share enums: `Currency` (SAR=1, Points=2), `WalletBalanceType` (NodeBased=1, UserBased=2), `WalletType`/`WalletStructure` (SingleWallet=1, MultipleWallets=2), `NodeType` (Organization=1, Service=2, User=3).
- `isDescriptionRequired`, `toBackendEntityType`, `getTransferCase` helpers — same.

## PES diff
| Aspect | Admin-console | Management-console |
|---|---|---|
| Route guard | `shellAccessGuard` | **No route-level guard** (only app-level) |
| Route PBAC key | Not declared | Not declared |
| Component-level flag | Likely uses tree-based per-node permissions | `canSave` from response (server-driven) + `canDoActions = !response.canSave` (UI flag) |
| Permission namespace | `adminConsole.*` not used here | `managementConsole.*` not used here either |

**Critical observation**: wallet-balance-management has **no `FalconAccess.*` key declared** in either app's route. It relies entirely on:
1. App-level guard (`adminConsoleGuard` / `managementConsoleGuard`)
2. Server-driven `canSave: boolean` returned in the wallet data response

This is the **most permissive route** in both apps from a route-PBAC perspective.

## Other architectural diff

### Account ID resolution
- **Admin**: derives `selectedOrgNodeId` from a tree-picker click (admin chooses ANY account)
- **Mgmt**: hardcoded to session's own `accountId`. Mgmt comment explicitly explains this:
  > Management-console users can only configure their own account. The Core Gateway still owns authorization and account scoping, but this page no longer needs the admin org-tree picker to decide which account to load.

### Save account-id resolution differs subtly
```typescript
// management-console/.../wallet-balance-management.component.ts:710-721
private resolveSelectedAccountId(): string | null {
  return this.accountInfo?.accountId
    ?? this.sessionProvider.session?.tenantId
    ?? this.sessionProvider.session?.client_id
    ?? this.sessionProvider.node?.tenantId
    ?? this.selectedOrgNodeId
    ?? null;
}
```
Comment in code: "Wallet strategy is configured at account level. In management-console the selected tree node may be an Account Admin's child node, so the save command must use the tenant/main account id instead of the selected node id."

This indicates that mgmt-console wallet ops are scoped to the **main account**, not whichever child node a user might be viewing.

### Different transfer gateway
As noted above, mgmt **explicitly routes transfers through the Charging Gateway** (`useGateway(Gateway.ChargingGateway)`) — admin uses default System Gateway. The Core Gateway is the mgmt-console default but is bypassed for this specific call.

### Change detection
- Mgmt uses `ChangeDetectionStrategy.OnPush` (`wallet-balance-management.component.ts:71`). Admin's version likely the same.
- Mgmt uses `BehaviorSubject<...>` for state (`isLoading$`, `isSaving$`, `selectedDistribution$`, `selectedStructure$`) with `combineLatest + distinctUntilChanged` to react to distribution/structure changes. Manual rxjs orchestration.

### MF
Both apps are module-federation remotes; not hosts.
