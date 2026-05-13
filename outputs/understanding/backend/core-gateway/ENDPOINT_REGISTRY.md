# Core Gateway — Endpoint Registry

> Two surfaces: **YARP routes** (90% pass-through) and **aggregation endpoints** (10% custom).

## Aggregation Endpoints (FastEndpoints)

Class-level `CommerceEndpointGroup` applies `RequireAuthorization(AuthorizationPolicies.ClientOnly)` and the `Commerce Aggregation` tag.

| Method | Route | Handler | Aggregates | Description |
|---|---|---|---|---|
| GET | `/api/commerce/accounts/{Id}/hierarchy` | `GetAccountHierarchyEndpoint` | Commerce + Identity + Charging | Calls Commerce's `accounts/hierarchy?accountId=<JWT.TenantId>` (always — route `{Id}` is for shape compatibility only; tenant id is **always** taken from JWT). Optional query params: `currency`, `balanceDistribution`, `walletStructure`. If `WalletBalanceType == UserBased`, calls Identity `user/by-tenant?TenantId=<JWT.TenantId>&ExcludeRole=4` to enrich the hierarchy. If `!CanSave`, calls Charging `wallet/get-account-wallets` to fetch balances. Returns merged `AccountHierarchyResponse`. |
| GET | `/api/commerce/contracts` | `ListAccountContractsEndpoint` | Commerce + Charging | Lists contracts for the JWT tenant. Overlays per-contract remaining balance from Charging `wallet/contract-balance-summaries`. |
| GET | `/api/commerce/contracts/{ContractId}` | `GetAccountContractEndpoint` | Commerce + Charging | Reads one contract, **enforces** `contract.AccountId == JWT.TenantId` (defense in depth), overlays balance, forces `CanEdit=false` (client users can only view contracts). |

## YARP Pass-Through Routes (defined in `appsettings.json`)

| Route ID | Match Path | Order | Auth Policy | Rate Limiter | Cluster | Path Transform |
|---|---|---:|---|---|---|---|
| `identity-auth-proxy` | `/identity/auth/{**remainder}` | 0 | **Anonymous** | none | `identity-cluster` | strip `/identity`, prepend `/api` |
| `identity-proxy` | `/identity/{**remainder}` | 1 | `ClientOnly` | `PerTenant` | `identity-cluster` | strip `/identity`, prepend `/api` |
| `commerce-proxy` | `/commerce/{**remainder}` | — | `ClientOnly` | `PerTenant` | `commerce-cluster` | strip `/commerce`, prepend `/api` |
| `provisioning-proxy` | `/provisioning/{**remainder}` | — | `ClientOnly` | `PerTenant` | `provisioning-cluster` | strip `/provisioning`, prepend `/api` |
| `charging-proxy` | `/charging/{**remainder}` | — | `ClientOnly` | `PerTenant` | `charging-cluster` | strip `/charging`, prepend `/api` |
| `contactgroup-proxy` | `/contactgroup/{**remainder}` | — | `ClientOnly` | `PerTenant` | `contactgroup-cluster` | strip `/contactgroup`, prepend `/api` |

## Cluster Destinations (Dev)

- commerce-cluster → `http://localhost:7045`
- provisioning-cluster → `http://localhost:7163`
- charging-cluster → `http://localhost:7224`
- identity-cluster → `http://localhost:7777`
- contactgroup-cluster → `http://localhost:7300`

## Health

| Method | Route |
|---|---|
| GET | `/health` (`MapHealthEndpoints()`, anonymous) |

## Ordering & Conflict Resolution

Both `identity-auth-proxy` (Order 0) and `identity-proxy` (Order 1) match `/identity/*`. YARP picks the lower-order route first. The `/identity/auth/login` request matches the more-specific Anonymous route; `/identity/user/me` falls through to `identity-proxy` (which requires `ClientOnly`).

## What Doesn't Exist

- **No `templates-cluster`** in the route map — Templates is not reachable through Core Gateway
- **No `pes-cluster`** — PES is internal-only
- **No direct route to `/api/security/ip-allowlists` on Commerce** — that endpoint is reached **east-west** by Core Gateway itself at startup (to seed the IP allowlist cache); not exposed to clients
