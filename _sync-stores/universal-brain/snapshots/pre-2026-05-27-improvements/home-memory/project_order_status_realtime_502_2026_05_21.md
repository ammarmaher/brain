---
name: project-order-status-realtime-502-2026-05-21
description: Do-payment 502 on /hubs/order-status/negotiate — root cause was falcon-comm-realtime container not running. Infra fix + FE console-noise reduction (G-24). Branch fix/order-status-realtime-502 commit a3a8eb53.
metadata: 
  node_type: memory
  type: project
  originSessionId: 276b5eac-e45c-41f3-8004-7835a02f7f36
---

# Do-payment 502 root-cause + fix — 2026-05-21

🟢 INFRA FIX 2026-05-21. Container `falcon-comm-realtime-1` started via `docker compose up -d comm-realtime`. FE hardening commit `a3a8eb53` on branch `fix/order-status-realtime-502` (off `polishing-v0.4`).

## Symptom

User screenshot: do-payment for Node Honda + App "Basic Send App" — network panel showed:
- `do-payment` → 200 ✓
- `negotiate?negotiateVersion=1` → **502** (the alarming one)
- `status` → 200 with `{isSuccessful: true, result: {status: 1, failureReason: null, walletType: 1}}`

User reported "data is null", "users not loading", "apps empty" — and asked: "is this from backend or normal behavior?"

## Root cause

The 502 is from the **System Gateway** YARP route `realtime-hubs-proxy` (appsettings.json:98-103, path match `/hubs/{**remainder}`, clusterId `realtime-cluster`). The cluster destination in dev is `http://comm-realtime:8080` (docker-compose.yml:721) / `http://host.docker.internal:5210` (Development overrides:51).

The gateway's YARP error middleware (WebApplicationExtensions.cs:73-86) catches `ForwarderError.*` other than `RequestTimedOut` and returns:
```json
HTTP 502 { "isSuccessful": false, "errorMessages": ["Downstream service unavailable: <error>"] }
```

When the user took the screenshot, the **`falcon-comm-realtime-1` container was not running**. Verified:
- Container defined in [CODE] `Falcon/docker-compose.yml:645-689` (dotnet sdk image, command `dotnet run --project src/Falcon.Comm.Realtime/Falcon.Comm.Realtime.csproj`)
- `docker ps` did NOT list it before the fix
- `docker ps -a` also did not list it (never created in this compose session — likely added to compose AFTER the user's last `docker compose up`)
- After `docker compose up -d comm-realtime` → container starts, listens on 0.0.0.0:8080 (mapped to host :5210)
- Kafka consumer for `commerce.order-finalized.v1` subscribed
- /health/ready returns 200
- Gateway /hubs/order-status/negotiate now returns 401 (auth required) — proper behavior, no longer 502

## Backend architecture (verified)

| Component | Role | Path |
|---|---|---|
| `falcon-comm-realtime-svc` (separate service) | Hosts `OrderStatusHub` SignalR | Mongo wire `/hubs/order-status` |
| `Falcon.Comm.Realtime.Realtime.OrderStatusHub` | Hub class, `JoinOrder` + `LeaveOrder` methods | `OrderStatusHub.cs:31-113` |
| System Gateway YARP route | Forwards `/hubs/*` to realtime cluster | `appsettings.json:98-103` + `appsettings.Development.json:48-54` |
| Realtime service Kafka consumer | Subscribes `commerce.order-finalized.v1` | logs at startup |
| Commerce produces the event | `do-payment` POST → order created → on terminal → Kafka emit | (verified by Hub doc comments) |
| FE SignalR client | `OrderStatusRealtimeService` | `apps/host-shell/src/app/core/realtime/order-status-realtime.service.ts` |

Flow:
1. FE `do-payment` POST → 200 with `orderId`
2. FE `OrderStatusRealtimeService.joinOrder(orderId)` → connects to `{gateway}/hubs/order-status`
3. Commerce processes order → emits Kafka `commerce.order-finalized.v1`
4. Realtime service consumer picks up event → pushes `OrderFinalized` to the order's group
5. FE receives push → calls `handleTerminal`

If SignalR fails (realtime service down), FE has 3 fallbacks:
- `joinOrder` `.catch()` → fires immediate reconcile `getOrderStatus` GET
- Bounded fallback timer after `environment.orderStatus.pollTimeoutMs` → fires reconcile
- Manual user retry

So the polling fallback was working correctly during the user's 502 — `status` 200 in the screenshot is proof.

## Fixes shipped

### Operational (no code change)

`docker compose up -d comm-realtime` brought the container up. No commit needed — the service was always defined in compose, just not running.

### Code (FE hardening — G-24)

`apps/host-shell/src/app/core/realtime/order-status-realtime.service.ts:160-189`

Downgraded `console.error` to `console.warn` when the connection close error matches transport-failure patterns (negotiate/gateway/502/503/504/network/failed-to-fetch/err_connection). True hub-side errors (auth drop mid-session, server-side JoinOrder exception, etc.) still log `console.error` so they surface loudly.

Rationale: the polling fallback already handles transport failures transparently — user never sees broken UX — so the `console.error` was alarm-fatigue noise that masked the few REAL hub-side errors.

## What the user also flagged (not fully resolved this commit)

### "Apps & Services empty for Honda"

Screenshot shows skeleton bars in the data table — that's the LOADING state during my Wave 7 3-second post-save reload delay. The "Showing 0-0 from 0" footer text is rendered alongside skeleton bars because the data-table's footer doesn't suppress its count display while `loading=true`. This is a UX inconsistency, not a data-loss bug. The data-table component improvements are the parallel loader session's territory (`local_cd96445a`).

### "Users do not come for some nodes"

After G-02/G-03 (commit `df6973b2`), the users list call is reverted to the proven main-branch contract — only sends `NodeId + Role[]` for non-root, `IncludeDeleted=true` for Falcon admins. The reactive chain in `UsersStateSlice` (users-state.signals.ts:132-168) fires correctly on every node change via `combineLatest`. If certain nodes return empty users list, the most likely cause is:
- The BE has no users assigned to that node (genuinely empty)
- The role filter (ACCOUNT_USER_ROLES for non-root) excludes Falcon-typed users on that node
- Permissions issue scoped to the caller's tenant

Cannot diagnose further without a network trace showing the actual request/response per the empty-user nodes.

## Branch + commit

- Branch: `fix/order-status-realtime-502` (off `polishing-v0.4`)
- Commit: `a3a8eb53`
- Pushed to origin
- Per user's branching strategy: each issue gets its own branch; subsequent issues branch off the previous or off main (active baseline)

## Build status

🟢 host-shell green post-G-24.

## Rules emitted

- The local stack `docker compose up` MUST include `comm-realtime` for the do-payment SignalR flow to work without falling to polling. If a developer's stack is missing it, `docker compose up -d comm-realtime` brings it up.
- FE error-logging contract: transport failures (negotiate/gateway/5xx/network) on the SignalR hub MUST log `console.warn`, not `console.error` — the polling fallback handles them transparently. True hub-protocol errors stay `console.error`.
- For backend-host-status questions (is the hub up?), the gateway's 502 envelope (`Downstream service unavailable: <error>`) is the clear signal.

## See also

- [[project_service_pricing_visibility_and_reload_delay_2026_05_21]] — preceding Wave 7 3s reload delay commit `31d13af9`
- [[project_org_hierarchy_fe_be_integration_realign_2026_05_21]] — Waves 1-5 commit `df6973b2`
- `Brain Outputs/understanding/backend/system-gateway/ENDPOINT_REGISTRY.md` — gateway routing
