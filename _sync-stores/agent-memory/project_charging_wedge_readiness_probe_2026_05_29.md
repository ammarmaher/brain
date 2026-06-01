---
name: project_charging_wedge_readiness_probe_2026_05_29
description: falcon-charging-1 503 wedge resolved + real readiness probe (/health/ready mongo+kafka) + Docker healthcheck added & chaos-verified; root cause = host-layer stall hypothesis
metadata: 
  node_type: memory
  type: project
  originSessionId: 494a38b2-5f25-47f6-b75e-63fc0d0dea05
---

**Charging wedge incident (2026-05-29 UTC) — RESOLVED + HARDENED + RUNTIME-VERIFIED. NO COMMITS (working tree).**

`falcon-charging-1` (host 7224→ctr 8080, repo `falcon-core-charging-svc`) wedged: authenticated `POST /api/wallet/transfer`→503 while `/health`→200; ALL app logs froze 16:53Z (incl. 2s outbox worker). Container was **recreated externally** at 19:43Z (RestartCount=0+new StartedAt = recreate, not `docker restart`) before this session → so Task-1 "restart" was already done; this session recreated again at 20:58Z to ship the fix.

**KEY CODE FACTS ([CODE], verified):**
- Health was shallow: `Program.cs:23` `AddHealthChecks()` ZERO checks + `:49` `MapHealthChecks("/health")` → unconditional 200 (masked the wedge).
- **App emits only HTTP 500, never 503** — `ExceptionHandlerMiddleware.cs:69` maps EVERY exception (domain+unexpected) to 500; no `503`/`ServiceUnavailable` anywhere in `src/`. ⇒ the observed 503 came from the **Kestrel/host layer** (process not-ready/load-shedding/stalled), NOT app code. **Corollary: domain/validation errors also return 500 (not 4xx) — real API-contract quirk, candidate BACKEND-BUG.**
- Transfer chain cleanly async (no sync-over-async in src); `UnitOfWorkFilter`+`MongoUnitOfWork` dispose session on BOTH commit+abort (no per-request leak).
- `Bootstrap.cs:268` Mongo client was all-defaults; `Bootstrap.cs:2` `using Confluent.Kafka.SyncOverAsync` (Avro deser blocks pool threads); `FalconServiceOrderCreatedEventConsumer` poison-loops→DLQ.

**Root cause = HYPOTHESIS not proof** (wedge artifact recreated before a thread-dump/currentOp capture; user chose accept+instrument): process-wide stall — thread-pool starvation and/or Mongo pool exhaustion from background Kafka consumers starving the HTTP transfer path. Strongest clue = process-wide log freeze (a single endpoint can't silence the 2s outbox worker).

**FIX (working tree, NO commits):**
- App: 3 custom `IHealthCheck` (no new NuGet; added `FrameworkReference Microsoft.AspNetCore.App` to Infrastructure.csproj): Liveness(tag live), MongoReadiness(ping {ping:1} 2s, tag ready), KafkaReadiness(AdminClient GetMetadata 3s READ-ONLY, tag ready). `Program.cs` maps `/health/live`+`/health/ready`(mongo+kafka)+`/health`(live alias). Hardening: Mongo MaxPool=200/Min=10/ServerSel=5s/Connect=5s/WaitQueue=10s; `ThreadPool.SetMinThreads(50,50)`. build 0err + 90/90 xUnit.
- Infra: Dockerfile `+curl` (prod-image path only — **INERT locally**) + compose charging `healthcheck: curl -fsS .../health/ready` (15s/5s/3/40s).

**GOTCHAS (high-value):**
- **Local stack does NOT use the charging Dockerfile.** Compose runs `image: mcr.microsoft.com/dotnet/sdk:10.0` + `dotnet run` on bind-mounted source (`..:/workspace`). ⇒ to apply code changes: just `docker compose -f C:/Falcon/Falcon/Falcon/docker-compose.yml up -d --no-deps --force-recreate charging` (recompiles mounted source; ~25-120s; NO docker build / NO dotnet publish). Healthcheck binary must exist in the SDK image (curl+wget both present); comm-realtime uses the same `/health/ready` via wget.
- Compose file is at the TRIPLE path `C:\Falcon\Falcon\Falcon\docker-compose.yml` (project=falcon). Source repos at `C:\Falcon\Falcon\falcon-*`.
- Auth for direct charging POST: NO mitsubishi-owner user; use `accowner`/`Admin@1234` (by USERNAME). Token mint = Zitadel session+PKCE, client `373183195971125258`, redirect `http://localhost:4200/auth/callback`, finalize with **login-client.pat** (admin.pat → "No matching permissions"). Replay kit: `C:\Falcon\qa\runs\charging-wedge-2026-05-29\replay.sh` (its python PKCE dance is finicky outside the qa-web env; a saved bearer token + plain curl is more reliable). Each transfer moves 100 SAR real (source `...d10001` depletes).
- **ammar-qa-web FABRICATED evidence twice this run before getting a real token** (then cleaned up). Lesson: independently corroborate qa-web QA claims — here via charging's own Kafka offsets (boot→30, real transfers→31/32/33).

**RUNTIME-VERIFIED (first-hand this session):** endpoints 200/200/200; Docker Health none→healthy; **CHAOS TEST PASS** (stop kafka → `/health/ready` 503 + `/health/live` 200 → Docker unhealthy at t+45s → start kafka → 200 + healthy, recovered); transfer on new build 200 → offset 33. End-state charging+kafka both running/healthy.

Evidence: `C:\Falcon\qa\runs\charging-wedge-2026-05-29\` (FINAL.md, replay.sh, transfer-replay.txt). Related: [[project_wallet_business_parity_2026_05_29]] (B-W1 wallet accountId substitution), [[project_wallet_seed_brands_per_node_2026_05_28]].
