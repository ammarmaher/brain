# DIFF — contracts-cost-management (management-console vs admin-console)

> Mgmt-console version: `apps/management-console/src/app/features/contracts-cost-management/`
> Admin-console version: `apps/admin-console/src/app/features/contracts-cost-management/`

## Routing diff
| Path | Admin-console | Management-console | Why |
|---|---|---|---|
| Path slug | `contracts-cost-management` | `contracts-cost-management` | Same URL |
| Component loader | `loadComponent` (lazy) | `loadComponent` (lazy) | Same |
| Guard | **No explicit guard** (admin route has no `canActivate` other than app-level) | **No explicit `shellAccessGuard`** (mgmt route has no `canActivate`) | Notable — this is one of the only mgmt routes without `shellAccessGuard`. App-level `managementConsoleGuard` still applies. |
| PBAC key | None | `FalconAccess.managementConsole.contract.view()` | Mgmt sets `data.access` (informational/breadcrumb; without `shellAccessGuard` the data isn't enforced — likely a bug or intentional soft-gate) |

## Component diff
- **Mgmt component (`ContractsCostManagementComponent`) is a thin wrapper** — it directly imports and reuses **3 admin-console components**:
  - `ContractsDataTableComponent` (`../../../../../admin-console/src/app/shared/components/contracts-data-table/contracts-data-table.component`)
  - `ContractsNodeHeaderComponent` (`../../../../../admin-console/src/app/shared/components/contracts-node-header/contracts-node-header.component`)
  - `ContractsViewContractComponent` (`../../../../../admin-console/src/app/features/contracts-cost-management/components/contracts-view-contract/contracts-view-contract.component`)
- These are imported via **relative path traversal across apps** — architecturally fragile (cross-app sibling imports) and a clear anti-pattern.
- Both apps have:
  - List → Details flow (`mode: 'list' | 'view'`)
  - Row-class theming (`bg-falcon-green-25` for pending, `bg-falcon-lilac-25` for expired)
  - Column definitions for: contract ID, name, farabi reference, creation/start/expiration dates, value, remaining, status
- **Mgmt is VIEW-ONLY** — `canEdit: false` hardcoded on every row (`management-console/.../contracts-api.service.ts:135, 145`). Admin-console computes `canEdit: canEditContractStatus(status)` based on contract status enum.

### Components only in admin-console
- Edit/Create wizard components (referenced in `admin-console/.../contracts-cost-management/components/` — full multi-step contract creation + edit)
- `ContractsViewContractComponent` actually lives in admin-console and is **reused** by mgmt-console via cross-app import

### Components only in mgmt-console
- None — the mgmt component is a thin reuse wrapper.

## Service / API diff

### Endpoint structure differs significantly
| Method | Admin-console | Management-console | Why |
|---|---|---|---|
| List | `commerce/Contracts?accountId={id}` (`contracts-api.service.ts:148-163`) — **also** parallel call to `charging/Wallet/contract-balance-summaries?accountId={id}` for live balances | `api/commerce/contracts` (`contracts-api.service.ts:104-114`) — **no balance lookup** | Mgmt list shows committedValue/remainingBalance from the contracts endpoint itself; admin separately enriches with charging summaries |
| Detail | `commerce/Contracts/{contractId}` + `charging/Wallet/contract-balance-summaries?accountId={accountId}` (parallel) | `api/commerce/contracts/{contractId}` (no parallel charging call) | Same divergence |
| Create | `POST commerce/Contracts` | — | Admin-only (mgmt is read-only) |
| Update | `PUT commerce/Contracts/{contractId}` | — | Admin-only |
| Wallet strategy | `GET commerce/Setting/wallets/{accountId}` | — | Admin-only (needed for editing) |
| Application options | `GET commerce/Node/{accountId}/applications` | — | Admin-only |
| Channel options | `GET commerce/Node/{accountId}/comm-channels/visible` | — | Admin-only |

**Critical URL prefix difference**:
- Admin: `commerce/Contracts` (no `api/` prefix — gateway adds it)
- Mgmt: `api/commerce/contracts` (explicit `api/` prefix, lowercase `contracts`)

The mgmt service uses `api/commerce/contracts` directly — gateway then strips and re-prepends. The leading `api/` is **unusual** vs. other services in this app (which use `commerce/Node`, `commerce/Setting` etc. with no `api/` prefix). Likely a leftover or this endpoint is on a different gateway route.

### Different gateway routing
- Admin → System Gateway → backend Commerce
- Mgmt → Core Gateway → backend Commerce (same upstream service, different gateway proxy)

## DTO diff
- **Both apps import from `admin-console/.../contracts.models.ts`** — `ContractRow`, `ContractDetails`, `ContractUnitConversionRow`, `ContractRateRow`, `ContractQuotaRow`, `ContractOverageRateRow`, helpers (`currencyCodeFromEnum`, `normalizeContractStatus`, `createDefaultUnitConversions`).
- Mgmt only consumes — does not define its own DTOs.

### Admin-only DTOs
- `ContractFormValue` (used by admin's create/edit forms)
- `WalletStrategySettings` (used by admin's edit dialog)
- `ContractsSelectOption` (option-list type for admin's selects)
- Server response types: `ApiWalletSettings`, `ApiContractBalanceSummariesResponse`, `ApiContractBalanceSummary`, `ApiApplicationOption`, `ApiChannelOption`

### Mgmt mapping
- Mgmt's `ManagementContractsApiService.mapSummary` hardcodes `canEdit: false, currencyCode: 'SAR'` and uses `contract.committedValue` for `valueSar`, `contract.remainingBalance` for `remainingSar`. Admin uses **charging balance summary** for `remainingSar` (lazy enrichment).

## PES diff
| Aspect | Admin-console | Management-console | Why |
|---|---|---|---|
| Route guard | None | None | Both rely on app-level guard (`adminConsoleGuard` / `managementConsoleGuard`) |
| Route PBAC key | None set | `FalconAccess.managementConsole.contract.view()` (declared but not enforced — no `shellAccessGuard`) | Mgmt declares the key on `data.access` but the route has no `canActivate: [shellAccessGuard]` — informational only |
| Edit / Create | Permission-gated (admin only) | **Hardcoded view-only** (`canEdit: false` everywhere) | Mgmt does not implement editing |

## Other architectural diff
- **Mgmt uses `ChangeDetectionStrategy.OnPush`** (`contracts-cost-management.component.ts:30`). Admin's version — likely the same; not directly inspected.
- **Mgmt component has `host: { class: 'block h-full min-h-0' }`** (`contracts-cost-management.component.ts:20`). Direct host class binding — possibly an admin pattern as well.
- **Cross-app sibling imports** — `contracts-cost-management.component.ts:6-14` (and `services/contracts-api.service.ts:14`) read from `../../../../../admin-console/...`. This is the most architecturally fragile aspect of management-console: contracts-cost-management is effectively **a slim "view-only" facade over admin-console's full contracts implementation**.
- Both apps are module-federation remotes — not hosts. The reuse comes via TypeScript-relative path imports at compile time, not at runtime federation.
