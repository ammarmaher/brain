# Services & APIs — contracts-cost-management

> THIS IS THE CRITICAL BACKEND-INTEGRATION FILE.

## Services
| Service | File | Singleton? | Purpose |
|---|---|---|---|
| `ContractsApiService` | `apps/admin-console/src/app/features/contracts-cost-management/services/contracts-api.service.ts:140-465` | `providedIn: 'root'` | All HTTP for the feature — contracts CRUD + lookups + balance summaries |
| `OrgHierarchyApiService` | `apps/admin-console/src/app/features/organization-hierarchy/services/org-hierarchy.api.service.ts:30-141` | `providedIn: 'root'` | Tree-panel data (`getRootNodes`, `getChildren`) — consumed by `ContractsAccountsPanelComponent` (shared) |
| `HttpService` | `libs/falcon/src/shared-data-access/lib/services/http.service.ts` | `providedIn: 'root'` | Falcon HTTP wrapper. Reads `useGateway()` context to swap base URL between Core / System / Charging / Identity gateways. |

## Base URL resolution
- `HttpService` is a thin wrapper over Angular `HttpClient` that interpolates the URL at runtime via the `runtime-base-url.interceptor.ts`. Source: `libs/falcon/src/shared-data-access/lib/runtime-config/runtime-api-config.ts:128-137`.
- `useGateway(gateway?: Gateway)` sets `USE_GATEWAY_CONTEXT = true` and optionally `SPECIFIC_GATEWAY_CONTEXT`. With no argument, the runtime falls back to the **app-default gateway** (admin-console → System Gateway).
- [INFERRED] So `commerce/Contracts` ⇒ `${baseURLSystemGateway}/commerce/Contracts`. The `charging/Wallet` call routes to the same default — System Gateway proxies it to Charging Service. (No explicit `useGateway(Gateway.ChargingGateway)` used.) Confirmed by audit: every `useGateway()` in the file is **arg-less**.

## HTTP endpoints called

> All endpoints below use `HttpService.get/post/put` + `{ ...useGateway() }` HttpContext. Auth: JWT Bearer attached by global interceptor (see runtime-base-url.interceptor + auth interceptor in `libs/falcon/src/shared-data-access/lib/interceptors`).

### Contracts CRUD (Falcon Core Commerce Service)
| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| GET    | `commerce/Contracts?accountId={accountId}`        | `ContractsApiService.listContracts(accountId)`   | n/a (HttpParams `accountId`)        | `ServiceOperationResult<ApiContractListResponse>` → mapped to `ContractRow[]` | `contracts-api.service.ts:148-163` |
| GET    | `commerce/Contracts/{contractId}`                  | `ContractsApiService.getContract(contractId)`     | n/a                                  | `ServiceOperationResult<ApiContractResponse>` → mapped to `ContractDetails` | `contracts-api.service.ts:165-176` |
| POST   | `commerce/Contracts`                                | `ContractsApiService.createContract(accountId, form)` | `toCreatePayload(accountId, form)` (see DTO file) | `ServiceOperationResult<ApiContractResponse>` → `ContractDetails`        | `contracts-api.service.ts:178-182` |
| PUT    | `commerce/Contracts/{contractId}`                  | `ContractsApiService.updateContract(contractId, form)` | `toUpdatePayload(form)`            | `ServiceOperationResult<ApiContractResponse>` → `ContractDetails`        | `contracts-api.service.ts:184-188` |

### Wallet strategy lookup (Falcon Core Commerce Service — settings module)
| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| GET    | `commerce/Setting/wallets/{accountId}`              | `ContractsApiService.getWalletStrategy(accountId)` | n/a              | `ServiceOperationResult<ApiWalletSettings \| null>` (404 mapped to `null`) → `WalletStrategySettings \| null` | `contracts-api.service.ts:190-215` |

### Account lookups (Falcon Core Commerce Service — node controller)
| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| GET    | `commerce/Node/{accountId}/applications`            | `ContractsApiService.getApplicationOptions(accountId)` | n/a             | `ServiceOperationResult<ApiApplicationOption[]>` → filtered (`visibility !== false`) → `ContractsSelectOption[]` | `contracts-api.service.ts:217-231` |
| GET    | `commerce/Node/{accountId}/comm-channels/visible`   | `ContractsApiService.getChannelOptions(accountId)`    | n/a             | `ServiceOperationResult<ApiChannelOption[]>` → sorted by `priorityOrder` → `ContractsSelectOption[]`           | `contracts-api.service.ts:233-247` |

### Contract balance summaries (Falcon Core Charging Service)
| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| GET    | `charging/Wallet/contract-balance-summaries?accountId={accountId}` | `ContractsApiService.getContractBalanceSummaries(accountId)` (private) | HttpParams `accountId` | `ServiceOperationResult<ApiContractBalanceSummariesResponse>` → `ApiContractBalanceSummary[]`. **Errors swallowed → `[]`** (line 446). | `contracts-api.service.ts:433-447` |

### Tree data (consumed via `ContractsAccountsPanelComponent`, not by `ContractsApiService`)
| Method | URL pattern | Service.Method | Request DTO | Response DTO | Source file:line |
|---|---|---|---|---|---|
| GET    | `commerce/Node`                                     | `OrgHierarchyApiService.getRootNodes()`           | n/a                                  | `ServiceOperationResult<GetNodeResponse[]>`                 | `org-hierarchy.api.service.ts:50-69` |
| GET    | `commerce/Node?NodeId={parentId}` (omitted if root) | `OrgHierarchyApiService.getChildren(parentId)`    | HttpParams `NodeId` (optional)       | `ServiceOperationResult<GetNodeResponse[]>`                 | `org-hierarchy.api.service.ts:71-98` |

## Total endpoint count
**8 distinct endpoints** owned by this feature:
- 4 contract CRUD (`commerce/Contracts*`)
- 1 wallet strategy (`commerce/Setting/wallets/*`)
- 2 node lookups (`commerce/Node/*/applications`, `commerce/Node/*/comm-channels/visible`)
- 1 contract balance (`charging/Wallet/contract-balance-summaries`)

Plus 2 endpoints called by the shared `ContractsAccountsPanelComponent` (tree-loading).

## Response wrapper
Every endpoint returns `ServiceOperationResult<T>`:
```typescript
interface ServiceOperationResult<T> {
  isSuccessful: boolean;
  result: T;
  errors?: string[];
  errorMessages?: string[];
}
```
Unwrapping helper (lines 411-417):
```typescript
private unwrap<T>(response: ServiceOperationResult<T>, defaultMessage: string): T {
  if (!response?.isSuccessful) {
    throw new Error(response?.errors?.[0] ?? response?.errorMessages?.[0] ?? defaultMessage);
  }
  return response.result;
}
```

## Auth / interceptors
- JWT Bearer attached upstream by Falcon auth interceptor (lives in `libs/falcon/src/shared-data-access/lib/interceptors/`, not in this feature).
- `runtime-base-url.interceptor.ts:29` reads `USE_GATEWAY_CONTEXT` to swap base URL between gateway URLs at runtime.
- No tenant header explicitly added by this feature.

## Backend service mapping (per repo CLAUDE.md routing rules)
| Endpoint prefix | Backend service |
|---|---|
| `commerce/Contracts`, `commerce/Setting/wallets`, `commerce/Node` | Falcon Core Commerce Service (`falcon-core-commerce-svc`) |
| `charging/Wallet`                                                  | Falcon Core Charging Service (`falcon-core-charging-svc`) |

All requests flow through the **System Gateway** (`falcon-int-system-gateway-svc` :7256) because admin-console runs the Falcon-user side. [INFERRED] (the explicit `useGateway()` with no arg uses the app-default gateway which is configured at the host-shell level).

## Caching / batching
- `forkJoin({walletStrategy, contracts})` in the container `loadSelectedNodeData()` (line 209) — two parallel calls.
- `forkJoin({contracts, balances})` inside `listContracts()` (line 151) — list + balance lookup paralleled.
- `getContract()` then chains `switchMap → getContractBalanceSummaries(accountId)` (lines 165-176) — sequential because balance API needs the contract's `accountId`.
- No caching layer. Each navigation re-fetches.

## Error handling
- Wallet strategy 404 mapped to `null` (line 208) — the page guards `onAddContract()` on `isWalletStrategyConfigured`.
- Balance summaries swallow errors and return `[]` so the contracts list stays usable when charging is briefly down (lines 445-446, comment: *"The contract screens should stay usable even if the balance projection is temporarily empty or the charging service is briefly unavailable."*).
- Other endpoints surface `error.message` via component's `pageError` / `errorMessage` state.

## Date serialization quirk
`toLocalContractDateValue` (lines 419-431) emits `YYYY-MM-DDT00:00:00` (no `Z`) — comment in code:
> *"Contract dates are business dates in Asia/Riyadh. Send a date-like local value and let Commerce normalize start/end boundaries; do not use toISOString(), which shifts the day."*
