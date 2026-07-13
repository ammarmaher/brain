---
name: session-backup-contract-aggregation-two-follow-up-fixes-route-prefix-trim-dto
description: "Fixed the System GW admin contract-detail aggregation so admin's real no-api path reaches it, and trimmed the Charging breakdown DTO to 3 fields; updated PR + redeployed"
metadata: 
  node_type: memory
  type: project
  agent: ammar-system-gateway
  date: 2026-06-06
  status: completed
  originSessionId: 918e11de-f829-4009-aef9-bceeffe3dbe8
---

## What Was Done

Two follow-up fixes to the System Gateway admin contract-detail aggregation endpoint
(added in the prior 2026-06-06 session, commit a1bc47d on branch
`feature/contract-quota-consumed-admin-aggregation`).

### FIX 1 (CRITICAL) — route prefix
- BUG (from prior session): endpoint registered at `api/commerce/contracts/{id}`
  (global `c.Endpoints.RoutePrefix = "api"` in Program.cs + `CommerceEndpointGroup`
  prefix "commerce" + `Get("contracts/{ContractId}")`). The prior session log even
  "confirmed precedence (FE /api/commerce/... disjoint from YARP /commerce/...)" — that
  WAS the bug. The admin FE actually calls `commerce/Contracts/{id}` with **NO api/**
  prefix, like every other admin System-GW call (commerce/Node, commerce/Setting,
  commerce/Contracts) which ride the YARP `/commerce/{**remainder}` passthrough. So
  admin's call never reached the aggregating endpoint → fell through to YARP → Commerce
  → no consumed enrichment.
- FIX: added `RoutePrefixOverride(string.Empty);` in `Configure()`.
  Effective route is now **`commerce/contracts/{ContractId}`** (no api prefix).
- IMPORTANT API NOTE: the task said `RoutePrefixOverride(null)`, but FastEndpoints 8.0.1's
  param is **non-nullable `string`** — `RoutePrefixOverride(null)` fails the build with
  `CS8625: Cannot convert null literal to non-nullable reference type`. FastEndpoints'
  XML doc states the documented way to drop the global prefix is **`string.Empty`**.
  Same runtime effect, supported API. Used `string.Empty`.

### FIX 2 — trim DTO
- Charging trimmed its per-quota breakdown to `{ quotaCode, consumedAmount?, consumedUnits? }`.
- Mirrored: trimmed `ContractQuotaBreakdownResponse` (in
  `Features/Contracts/Models/ContractGatewayModels.cs`) from 11 fields to those 3.
  Removed 8: `SubService`, `ChannelId`, `QuotaCategory`, `Unit`, `IncludedAmount`,
  `RemainingAmount`, `IncludedUnits`, `RemainingUnits`.
- `ApplyConsumedQuotas` reads only QuotaCode + ConsumedAmount + ConsumedUnits → safe.
- Output `ContractQuotaResponse` UNCHANGED (keeps IncludedAmount/IncludedUnits offered
  from Commerce + ConsumedAmount?/ConsumedUnits? consumed from Charging).

## How It Was Verified (the important part)

curl is **useless** here for routing: `ZitadelAuthorizationExtensions` sets
`options.FallbackPolicy = ...RequireAuthenticatedUser()`. A FallbackPolicy challenges
ALL unauthenticated requests **including no-route requests** → every unauthenticated
path returns 401 (even `/nonexistent/xyz` → 401). So 401-vs-401-vs-(should-be-404) tells
you nothing about which endpoint matched. (The prior session's "curl = 401 => FE matched"
was a false signal.)

Proved FIX 1 with a throwaway TestHost probe (built+ran in %TEMP%, then deleted) that:
- referenced the built `Falcon.System.Gateway.dll` (the same DLL the container runs),
- registered FastEndpoints with the SAME `RoutePrefix="api"` as Program.cs,
- loaded the REAL `appsettings.json` YARP routes (with dummy destination addresses +
  a no-op FalconOnly policy so YARP's InitialLoadAsync validation passed),
- captured the endpoint selected by the REAL ASP.NET matcher via a terminal middleware
  after `UseRouting()`.

Matcher decisions (gateway FastEndpoints + YARP catch-all coexisting):
| Request | Selected route | Result |
|---|---|---|
| GET /commerce/contracts/abc123 | `commerce/contracts/{ContractId}` | FastEndpoint (no api) ✅ |
| GET /commerce/Contracts (list)  | `/commerce/{**remainder}` | YARP → Commerce ✅ |
| POST /commerce/contracts        | `/commerce/{**remainder}` | YARP → Commerce ✅ |
| PUT /commerce/contracts/abc123  | `/commerce/{**remainder}` | YARP → Commerce ✅ |
| GET /api/commerce/contracts/abc123 | `(none)` | old api route gone ✅ |

Also independently dumped the whole FastEndpoint route table: contract route is
`commerce/contracts/{ContractId}` (no api) while ALL other FE routes still have the api
prefix (e.g. `/api/commerce/accounts/{Id}/hierarchy`, `/api/testing/charging/*`) →
RoutePrefixOverride affected ONLY this endpoint, no global leak.

Confirmed precedence reasoning matches the empirical result: ASP.NET matcher ranks a
literal segment / parameter above a `{**catchall}`, so `commerce/contracts/{ContractId}`
(2 literals + 1 param) beats `/commerce/{**remainder}` (1 literal + catchall).

## Gates
- `dotnet build Falcon.System.Gateway.slnx` = 0 warnings / 0 errors on BOTH the main
  working tree and the PR worktree.
- Endpoint count UNCHANGED at 12 (no endpoint added/removed; only the route changed).

## Files Changed
- `src/Falcon.System.Gateway/Features/Contracts/GetAccountContractEndpoint.cs`
  (Configure(): added `RoutePrefixOverride(string.Empty);` + explanatory comment)
- `src/Falcon.System.Gateway/Features/Contracts/Models/ContractGatewayModels.cs`
  (`ContractQuotaBreakdownResponse` trimmed 11→3 fields + updated doc comment)

## Git / Deploy State
- PR branch `feature/contract-quota-consumed-admin-aggregation`: new commit **`f0ab392`**
  (parent a1bc47d), 2 files changed +16/−10, **pushed to origin**
  (t2development.visualstudio.com/Falcon, az CLI n/a — branch push updates the PR).
- PR worktree created via `git worktree add C:/Falcon/.worktrees/sysgw-contract-quota-pr
  feature/contract-quota-consumed-admin-aggregation` → edited → built → committed →
  pushed → `git worktree remove` (clean; `git worktree list` shows main only).
- MAIN working tree: still on `feature/signalr-realtime-only`; `Features/Contracts/`
  remains **untracked/uncommitted** carrying both fixes (as required). Pre-existing
  unrelated `appsettings.Development.json` modification (signalr work) left untouched.
- Container `falcon-system-gateway-1` (image dotnet/sdk:10.0, runs `dotnet run` against
  bind-mounted C:\Falcon\Falcon → /workspace): `docker restart` → recompiled fixed source
  (dll build time 18:01:02 UTC, after restart) → "Now listening on http://0.0.0.0:8080" +
  "Registered 12 endpoints" + "Application started".

## Context for Next Agent
- The aggregating endpoint is now reachable by admin's real path. To live-verify with a
  real consumed value you need an authenticated Falcon JWT + an account/contract that has
  Charging contract-balance-summaries data (curl alone always 401 due to FallbackPolicy).
- Deploy model reminder: this container runs source via `dotnet run` over a bind mount, so
  editing the MAIN tree + `docker restart falcon-system-gateway-1` is the local deploy
  (no image rebuild). The PR branch is committed separately via worktree.
- If anyone re-reads the prior session entry: its routing claim is wrong; this fix corrects it.
- Pattern worth remembering: in a FastEndpoints+YARP gateway with a global RoutePrefix,
  to expose a specific aggregating route on the SAME path the FE rides through YARP,
  use `RoutePrefixOverride(string.Empty)` so the literal route out-prioritizes the
  `/{**}` catch-all. GET-by-id only → list/POST/PUT still pass through.
