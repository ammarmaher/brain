---
name: session-backup-commerce-comm-channels-stability-gate
description: Diagnosed flaky 503/hang on :7038/commerce/Node/.../comm-channels; freed memory; proved stable 200x3
metadata: 
  node_type: memory
  type: project
  agent: ammar-essentials
  date: 2026-05-30
  status: completed
  originSessionId: 00a79046-a402-495b-8012-3fa266bbb9ca
---

## What Was Done
- Goal: make `GET :7038/commerce/Node/690000000000000000c10001/comm-channels` (+ `/applications`) return HTTP 200 RELIABLY for mgmt-console card QA. Browser trace had shown 503 + hanging `pending` + occasional 200.
- **DIAGNOSIS — commerce was NOT actually OOM/stuck.** `falcon-commerce-1`: RestartCount=0, OOMKilled=false, State=running, 7h uptime, **Health=none (no healthcheck defined — that's why `docker ps` shows no `(healthy)` tag; it is NOT a failure)**, memory **423 MB / 15.43 GiB (2.68%)**, cgroup Memory cap = 0 (unlimited → cannot be OOM-killed by a cap). Commerce logs healthy: `ContractLifecycleRecurringJob` ticking every 60s, identity `/api/user/count` calls 200, zero exceptions. Clock note: host is JST, containers UTC — same instant (host 01:01 JST == container 22:01 UTC); the 22:01 log IS live.
- Core-gateway (`:7038`, the YARP reverse proxy that fronts commerce): RestartCount=0, no OOM, running. Recent log shows it proxying to `commerce:8080` with **200s** (`/api/setting`, `/api/Node`, `/api/information`, `/api/Lookup`). The only errors were `TaskCanceledException`/`RequestCanceled` on `/identity/user` = CLIENT-side cancellations (browser navigated away / Angular cancelled in-flight), not a commerce outage.
- **CONCLUSION:** the 503/pending in the browser trace was TRANSIENT saturation during the two FE dev-server containers' cold bring-up/compile (host briefly RAM-squeezed). By the time I probed, the endpoint was already healthy (first probe HTTP 200 in 83ms). I did **NOT** force-recreate commerce — it was demonstrably healthy and a cold `dotnet run` recompile would have caused needless downtime and risked destabilizing a green endpoint. (User step 3 was conditional on "if unhealthy/stuck"; it wasn't.)
- **Freed memory anyway for headroom:** stopped 4 clearly non-essential containers — `falcon-comm-realtime-1` (was unhealthy), `falcon-mongo-express-1`, `falcon-minio-1`, `falcon-minio-init-1` (already exited 0). Docker in-use **11.6 → 10.22 GiB; headroom 5.21 GiB**. No `admin-console` container exists (already absent). NO stray host `nx serve <app>` listeners found — only the harmless Nx daemon (PID 163816, 135 MB), small nx/npm helper workers (~26-60 MB) spawned by the FE containers' bind-mount tooling, and the user's WebStorm IDE language-service node procs (1.2 GB tailwind/JS — left alone, they're the editor). Nothing to kill.

## What Remains
- Nothing for the gate. User to drive Chrome to verify the mgmt-console cards render.
- comm-realtime is still STOPPED (was unhealthy pre-existing). minio/mongo-express stopped. Restart with `docker compose up -d comm-realtime minio mongo-express` from `C:\Falcon\Falcon\Falcon` if needed later (minio is used by contact-group presigned uploads).

## Key Decisions
- Did NOT `--force-recreate commerce` — healthy, would only add risk + a slow cold .NET JIT window.
- minio safe to stop for THIS gate: only contact-group needs it (presigned PUT), and contact-group is not in the keep-list.

## Files Changed
- None (no source, no compose, no commit). Only `docker stop` on 4 non-essential containers. Temp probe/parser files created under C:\Falcon were deleted.

## Context for Next Agent
- GATE GREEN. Login `POST :7777/api/auth/login {"username":"mitsubishi-owner","password":"Admin@1234"}` → `result.tokens.accessToken`.
- `GET :7038/commerce/Node/690000000000000000c10001/comm-channels` Bearer → **200 x3 consecutive** (7-83ms), `isSuccessful:true`, **9 channels**, every row has `availableActions`. Status values 1/2/3/4 all present.
  - WhatsApp s2 aa[2] · Voice s3 aa[1,2] · AI s4 aa[3] · SMS s2 aa[2] · Email Relay s2 aa[2] · Push Notifications s3 aa[1,2] · RCS Messaging s4 aa[3] · Telegram Bot s1 aa[1,2] · Apple Business Chat s1 aa[1,2].
- `/applications` → 200, **8 rows**, all with availableActions (Basic Send App, Survey Pro, Campaign Engine, Workflow Builder, Analytics Suite, Form Builder, Reporting Hub, AI Assistant).
- FE still up: host-shell `:4200/` HTTP 200, mgmt `:4301/remoteEntry.mjs` HTTP 200.
- LESSON: commerce has NO docker healthcheck → absence of `(healthy)` on `docker ps` is normal, not a red flag. Always confirm via RestartCount/OOM/logs/live-probe, not the health tag.
