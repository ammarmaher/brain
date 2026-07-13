---
name: session-backup-system-gw-admin-contract-detail-aggregation
description: "Added aggregating commerce/contracts/{id} endpoint to System Gateway (admin) mirroring Core GW"
metadata: 
  node_type: memory
  type: project
  agent: ammar-system-gateway
  date: 2026-06-06
  status: completed
  originSessionId: 918e11de-f829-4009-aef9-bceeffe3dbe8
---

## What Was Done
Added a FastEndpoints aggregating contract-detail endpoint to the **System Gateway** (Falcon-admin) at route `commerce/contracts/{ContractId}` (effective `/api/commerce/contracts/{id}`), so admin's existing `commerce/Contracts/{id}` call is composed server-side (offered contract from Commerce + per-quota consumed + contract-level RemainingBalance from Charging) instead of the YARP passthrough. Mirrors Core GW's `GetAccountContractEndpoint`.

Files ADDED (both on PR worktree AND replicated uncommitted on main tree):
- `src/Falcon.System.Gateway/Features/Contracts/GetAccountContractEndpoint.cs`
- `src/Falcon.System.Gateway/Features/Contracts/Models/ContractGatewayModels.cs`

NO changes needed to HTTP-client/cluster setup or the commerce endpoint group — they already existed on origin/main.

## Key Decisions
- **Auth = FalconOnly** (NOT Core GW's ClientOnly), inherited via `Group<CommerceEndpointGroup>()` — same as `GetAccountHierarchyEndpoint`. NO tenant ownership check (System GW admins carry no tenant-id claim by design; Commerce authorizes via user-type=Falcon JWT). AccountId for the Charging query is taken from the **Commerce response body** (`contract.AccountId`), not a JWT claim — mirrors the AccountHierarchy rationale.
- **CanEdit NOT forced false** (admins edit contracts) — left as Commerce returns. Core GW forces false for read-only account users.
- **Charging fail-soft**: swallow + `LogWarning`, return offered contract if Charging unreachable/lagging (remaining/consumed → N/A). Mirrors Core GW `LoadBalanceAsync`.
- **Per-quota consumed mapping** (`ApplyConsumedQuotas`): match Charging quota breakdown → tariff-plan quotas by `QuotaCode` (OrdinalIgnoreCase), set `ConsumedAmount`/`ConsumedUnits`. This is the TARGET behavior the Core GW rework is adding in parallel — Core GW's CURRENT model has no `quotas[]` yet, but the **charging service already returns it** (`GetContractBalanceSummaryResponse.Quotas` = `List<ContractQuotaBreakdownResponse>{ QuotaCode, SubService, ChannelId, QuotaCategory, Unit, IncludedAmount?, RemainingAmount?, ConsumedAmount?, IncludedUnits?, RemainingUnits?, ConsumedUnits? }` in `falcon-core-charging-svc/.../GetContractBalanceSummariesResponse.cs`). Built the System GW model against the real charging contract.

## Routing Precedence (CONFIRMED safe)
- `Program.cs`: `app.UseFastEndpoints(RoutePrefix="api")` then `app.MapGatewayEndpoints()` (= `MapReverseProxy`). Identical to Core GW.
- FastEndpoint path = `/api/commerce/contracts/{id}`; YARP `commerce-proxy` matches `/commerce/{**remainder}` (NO `api` segment). **Disjoint** — no `/api`-prefixed YARP route exists (all YARP routes match bare prefixes: /commerce /charging /provisioning /identity /contactgroup /hubs). Admin FE base URL includes `api/` (proven by existing AccountHierarchy at /api/commerce/accounts/{id}/hierarchy already consumed by admin FE). The literal `/commerce/contracts/x` (no api) still hits YARP passthrough — but that is NOT the FE's path.
- NOTE: `AddFalconAuthorization` sets `FallbackPolicy=RequireAuthenticatedUser()` → EVERY anonymous request returns 401 (incl. unmatched routes + YARP), so status code alone can't distinguish FastEndpoint vs YARP for anon probes. Proof was via endpoint-count delta instead.

## Build / Deploy / Verify
- `dotnet build Falcon.System.Gateway.slnx`: **0 warnings, 0 errors** (both worktree and main tree).
- PR: worktree `../sg-consumed`, branch `feature/contract-quota-consumed-admin-aggregation` off `origin/main`, commit **a1bc47d**, pushed. Worktree removed. az unavailable → PR link: `https://t2development.visualstudio.com/DefaultCollection/Falcon/_git/falcon-int-system-gateway-svc/pullrequestcreate?sourceRef=feature/contract-quota-consumed-admin-aggregation&targetRef=main`
- LOCAL DEPLOY: `falcon-system-gateway-1` runs `dotnet run` over a **bind mount** `C:\Falcon\Falcon -> /workspace` (image=mcr sdk:10.0), so uncommitted host edits are live. `docker restart` → "Building..." → **"Registered 12 endpoints"** (was **11** on EVERY prior restart 05-30→06-06 08:24; +1 = my endpoint) → "Now listening on: http://0.0.0.0:8080". `curl /api/commerce/contracts/x` → **401 Bearer** (endpoint matched + FalconOnly enforced, Server: Kestrel, no proxy hop, no downstream leak). Container reaches commerce/charging via compose DNS `http://commerce:8080`/`http://charging:8080` (env overrides the dev-config localhost addresses; startup logs show 200s).

## Files Changed
ADDED ×2 (listed above). Main-tree WIP `appsettings.Development.json` left untouched/uncommitted. No other files modified.

## Context for Next Agent
- When the parallel Core GW rework lands its `quotas[]` on `ContractBalanceSummaryResponse` + `ConsumedAmount/Units` on quotas, the System GW model here is already aligned field-for-field — no follow-up needed.
- There is a stale `origin/feature_contract` remote branch (pre-existing, unrelated) — did NOT use it; used a fresh branch off origin/main per task.
- If admin FE ever calls without the `api/` prefix it would hit YARP passthrough (raw commerce) and bypass aggregation — verify FE base URL keeps `api/`.
- No tests added (System GW has no test project in this repo; AccountHierarchy also has none). Build + runtime route-resolution were the verification.
