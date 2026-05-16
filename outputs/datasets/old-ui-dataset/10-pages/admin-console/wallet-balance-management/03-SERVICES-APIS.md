# Services & APIs — wallet-balance-management

## Services

| Service | File | Singleton? | Purpose |
|---|---|---|---|
| `WalletBalanceService` | `apps/admin-console/src/app/features/wallet-balance-management/services/wallet-balance.service.ts:15` | `providedIn: 'root'` | feature-owned — fetch wallet hierarchy + save strategy + execute transfer |
| `OrgHierarchyApiService` | `apps/admin-console/src/app/features/organization-hierarchy/services/org-hierarchy.api.service.ts:28` | `providedIn: 'root'` | **reused** from sibling org-hierarchy feature — populates left tree (root + children) |
| `AccessControlFacade` | `libs/falcon/src/core/lib/access-control/access-control.facade.ts` | `providedIn: 'root'` ([INFERRED]) | PES permission resolution — see [[05-PES]] |
| `SessionProvider` | `libs/falcon/src/core/lib/services/session-provider.service.ts` | `providedIn: 'root'` ([INFERRED]) | reads `session.userType` to detect FALCON_USER |
| `TranslateService` | `libs/falcon/src/language/lib/services/translate.service.ts` | `providedIn: 'root'` ([INFERRED]) | i18n |
| `MessageService` (PrimeNG) | component-scoped (`providers: [MessageService]`) | per-component | toast notifications |

## HTTP endpoints called (feature-owned)

| # | Method | URL pattern | Service.Method | Request DTO | Response DTO | Source |
|---|---|---|---|---|---|---|
| 1 | `GET` | `api/commerce/accounts/{encodeURIComponent(selectedNodeId)}/hierarchy?currency={1\|2}&balanceDistribution={1\|2}&walletStructure={1\|2}` | `WalletBalanceService.getWalletData(query)` | n/a (querystring) | `ServiceOperationResult<IWalletDataResponse>` | `wallet-balance.service.ts:20-38` |
| 2 | `POST` | `commerce/setting/wallets` | `WalletBalanceService.saveChanges(request)` | `ISaveBalancesRequest` | `ServiceOperationResult` (no payload) | `wallet-balance.service.ts:43-50` |
| 3 | `POST` | `charging/wallet/transfer` | `WalletBalanceService.transfer(request)` | `ITransferRequest` | `ServiceOperationResult<ITransferResponse>` | `wallet-balance.service.ts:63-68` |

### Verbatim source — every endpoint
[CODE] `apps/admin-console/src/app/features/wallet-balance-management/services/wallet-balance.service.ts:1-70`:
```typescript
@Injectable({ providedIn: 'root' })
export class WalletBalanceService {
  private readonly http = inject(HttpClient);
  private readonly hierarchyEndpoint = 'api/commerce/accounts';

  getWalletData(query: IWalletQuery): Observable<ServiceOperationResult<IWalletDataResponse>> {
    const accountId = encodeURIComponent(query.selectedNodeId?.toString() ?? '');
    const url = `${this.hierarchyEndpoint}/${accountId}/hierarchy`;

    let params = new HttpParams();
    if (query.currency != null) params = params.set('currency', query.currency.toString());
    if (query.balanceDistribution != null) params = params.set('balanceDistribution', query.balanceDistribution.toString());
    if (query.walletStructure != null) params = params.set('walletStructure', query.walletStructure.toString());

    return this.http.get<ServiceOperationResult<IWalletDataResponse>>(url, {
      params,
      ...useGateway(),
    });
  }

  saveChanges(request: ISaveBalancesRequest): Observable<ServiceOperationResult> {
    const url = 'commerce/setting/wallets';
    return this.http.post<ServiceOperationResult>(url, request, {
      ...useGateway(),
    });
  }

  transfer(request: ITransferRequest): Observable<ServiceOperationResult<ITransferResponse>> {
    const url = 'charging/wallet/transfer';
    return this.http.post<ServiceOperationResult<ITransferResponse>>(url, request, {
      ...useGateway(),
    });
  }
}
```

## HTTP endpoints called (shared / cross-page)

| # | Method | URL pattern | Service.Method | Source |
|---|---|---|---|---|
| 4 | `GET` | `commerce/Node` | `OrgHierarchyApiService.getRootNodes()` | `apps/admin-console/src/app/features/organization-hierarchy/services/org-hierarchy.api.service.ts:50-69` |
| 5 | `GET` | `commerce/Node?NodeId={parentId}` (NodeId omitted for Falcon root) | `OrgHierarchyApiService.getChildren(parentId)` | `apps/admin-console/src/app/features/organization-hierarchy/services/org-hierarchy.api.service.ts:71-98` |

Both shared endpoints also pass `...useGateway()` — they resolve to **System Gateway** under admin-console.

## Base URL resolution

[CODE] `apps/admin-console/src/app/app.config.ts:52`:
```typescript
provideAppDefaultGateway(Gateway.SystemGateway),
```

[CODE] `libs/falcon/src/shared-data-access/lib/runtime-config/runtime-api-config.ts:128-137`:
```typescript
export function useGateway(gateway?: Gateway): { context: HttpContext } {
  const context = new HttpContext();
  context.set(USE_GATEWAY_CONTEXT, true);
  if (gateway !== undefined) {
    context.set(SPECIFIC_GATEWAY_CONTEXT, gateway);
  }
  return { context };
}
```

[CODE] `libs/falcon/src/shared-data-access/lib/interceptors/runtime-base-url.interceptor.ts:29-39`:
```typescript
const useGateway = request.context.get(USE_GATEWAY_CONTEXT);
const specificGateway = request.context.get(SPECIFIC_GATEWAY_CONTEXT);
// 1. Specific gateway override
// 2. useGateway() without specific → APP_DEFAULT_GATEWAY
// 3. No APP_DEFAULT_GATEWAY → fallback to session-based user-type detection
// 4. No useGateway() → use defaultBaseUrl
const baseUrl = useGateway
  ? this.resolveGatewayUrl(specificGateway)
  : this.defaultBaseUrl;
```

[CODE] `runtime-api-config.ts:116-121`:
```typescript
export const GATEWAY_PATH_MAP: Record<Gateway, GatewayConfigKey> = {
  [Gateway.CoreGateway]: 'baseURLCoreGateway',
  [Gateway.SystemGateway]: 'baseURLSystemGateway',
  [Gateway.ChargingGateway]: 'baseURLChargingGateway',
  [Gateway.IdentityGateway]: 'baseURLIdentityGateway',
};
```

[CODE] `runtime-api-config.ts:77-94`: `provideShellEnvFromWindow(fallback)` — base URLs come from `window.FalconRuntimeConfig` (runtime injection).

## Effective backend mapping
All five endpoints are issued through **`Gateway.SystemGateway`** (admin-console default). [INFERRED] Per [`feedback_frontend_auth_identity_service`] and project doc, System Gateway forwards to:
- `commerce/*` → **Falcon Commerce Service** (`falcon-core-commerce-svc`, port 7045)
- `charging/*` → **Falcon Charging Service** (`falcon-core-charging-svc`, port 7224)

So:
| URL prefix | Backend service | Confidence |
|---|---|---|
| `api/commerce/accounts/{id}/hierarchy` | Commerce — `AccountsController` (likely; the URL begins with `api/commerce` whereas every other commerce endpoint here begins with just `commerce/` — see "Quirk" below) | [INFERRED — high] |
| `commerce/setting/wallets` | Commerce — `SettingController` for wallet strategy persistence | [INFERRED — high] |
| `charging/wallet/transfer` | **Falcon Charging Service** — `WalletController.Transfer` | [INFERRED — high] (URL prefix `charging/` + comment in `wallet-balance.service.ts:55-61` reading "Backend handles: Balance validation / Contract deduction algorithm / Transaction persistence") |
| `commerce/Node` | Commerce — `NodeController` (org hierarchy) | [INFERRED — high] (commented in `org-hierarchy.api.service.ts:33-34`: `// Controller route is [Route("api/[controller]")] which becomes "Node" from "NodeController"`) |

## Quirks / inconsistencies (worth porting clean)

1. **Inconsistent URL casing/prefix** ([CODE] `wallet-balance.service.ts:18` vs `:46` vs `:64`):
   - `'api/commerce/accounts'` (the hierarchy endpoint) — prefixed with `api/`
   - `'commerce/setting/wallets'` — no `api/` prefix
   - `'charging/wallet/transfer'` — no `api/` prefix
   - Sibling service `OrgHierarchyApiService` uses `'commerce/Node'` (no `api/`, capital N)
   [INFERRED] The `api/` segment for the hierarchy URL is significant — comment in the service explicitly says: *"This page needs the System Gateway aggregation endpoint: Commerce supplies account hierarchy and configured strategy. Charging supplies the canonical OCS master/channel/owner balances. Calling `/commerce/accounts/hierarchy?accountId=...` goes through the generic Commerce proxy and cannot populate the master wallet balance."* So `api/commerce/accounts/{id}/hierarchy` hits a System-Gateway aggregator that joins Commerce + Charging before returning.

2. **Money math** — all three response fields are plain TypeScript `number`s:
   - `IWalletSummary.totalBalance: number`
   - `IBalanceNode.balance?: number | null`
   - `IChannelBalance.balance: number`
   No `decimal.js`, no string-encoded money. Risk: JS Number loses precision past 2^53. [INFERRED] For SAR the present UI format `'1.3-3':'en-US'` shows 3 fractional digits, so backend-side precision is assumed to fit in `double`.

3. **Parsing on input blur** ([CODE] `wallet-balance-management.component.ts:401-412`):
   ```typescript
   const rawValue = input.value.replace(/,/g, '');
   const parsedValue = rawValue ? parseFloat(rawValue) : null;
   ```
   `parseFloat` accepts arbitrary trailing garbage and is locale-sensitive in a different way than `Intl.NumberFormat` — the strip-commas pre-step works for `en-US` but would break under other locale grouping (e.g. ar-SA uses `٬` or ` `).

4. **Currency dropdown** offers `SAR` (active) + `Points` (disabled in the transfer drawer — [CODE] `balance-transfer.component.ts:97`). On the main page it is enabled (`disabled: false` ([CODE] `wallet-balance-management.component.ts:139-140`)), but the transfer drawer hard-disables Points.

5. **Save payload omits the changes** — the `ISaveBalancesRequest` body (see [[04-DTOS]]) includes only `ownerId`, `currency`, `walletBalanceType`, `walletType`. The commented `changes: IBalanceChange[]` ([CODE] `wallet-balance.models.ts:217`) is OFF. So the Save button persists **wallet strategy only**, not per-cell balance edits — and the table inputs are all rendered with `[disabled]="true"` in the template ([CODE] `…component.html:393, 411`). Cell editing scaffolding is half-built dead code.

## Auth / interceptors
- `RuntimeBaseUrlInterceptor` ([CODE] `app.config.ts:53-57`) resolves gateway base URL per-request.
- [INFERRED] No explicit `AuthInterceptor` in this code — JWT bearer is presumably attached by a system-level interceptor in `host-shell` provided to the federated remote. None is visible in the admin-console code path.

## Per-operation summary

| Operation | Endpoint | UI surface | PES gate |
|---|---|---|---|
| Read wallet hierarchy + balances + strategy + channels | `GET api/commerce/accounts/{id}/hierarchy?…` | initial load + on filter change | none (load is conditioned by node selection; values surfaced subject to `canViewMasterWallet` / `canViewWalletStrategy`) |
| Save wallet strategy | `POST commerce/setting/wallets` | "Save" button on header | `FalconAccess.adminConsole.walletStrategy.edit()` |
| Transfer balance (Master ↔ CommChannel ↔ Node/User wallets) | `POST charging/wallet/transfer` | Transfer drawer | `FalconAccess.adminConsole.wallet.transfer()` |
| Load org root | `GET commerce/Node` | tree mount | [INFERRED] none here; presumably gated upstream via `adminConsoleGuard` |
| Load org children | `GET commerce/Node?NodeId={parentId}` | tree expand | [INFERRED] none |

## Endpoint count (final)
- **3 feature-owned endpoints** (in `WalletBalanceService`)
- **2 reused endpoints** (in `OrgHierarchyApiService`)
- **5 total HTTP endpoints** issued by this page
