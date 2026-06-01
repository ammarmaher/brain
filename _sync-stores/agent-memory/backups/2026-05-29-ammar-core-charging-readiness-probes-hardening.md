---
name: session-backup-charging-readiness-probes-mongo-threadpool-hardening
description: Post-incident (falcon-charging-1 16:53Z wedge) custom IHealthCheck readiness + Mongo pool + ThreadPool floor
metadata: 
  node_type: memory
  type: project
  agent: ammar-core-charging
  date: 2026-05-29
  status: completed
  originSessionId: 494a38b2-5f25-47f6-b75e-63fc0d0dea05
---

## What Was Done
Charging APP CODE ONLY (working tree, NO commits, Dockerfile/compose untouched per constraint). Repo: C:\Falcon\Falcon\falcon-core-charging-svc.

NOTE: the incident-context "before" code snippets did NOT match this repo (e.g. Bootstrap had a DI-FACTORY `ConnectWithMongoDB(this IServiceCollection)` with `sp => new MongoClient(...)`, NOT a `(services, settings)` form with `AddSingleton(database)`; Program.cs was the OLD `namespace{class Program{Main}}` shape with `app.MapHealthChecks("/health")` at line 49, NOT top-level statements; there was NO `AddKafkaServices`/`KafkaEventConsumer`). All edits were re-derived against the ACTUAL files.

1. Custom IHealthCheck (NO new NuGet packages):
   - NEW src/Falcon.Charging.Infrastructure/HealthChecks/LivenessHealthCheck.cs (tag "live", trivial Healthy)
   - NEW MongoReadinessHealthCheck.cs (tag "ready"): ctor injects IMongoClient + IOptions<ConfigurationSettings> (codebase convention; NOT bare ConfigurationSettings — DI only exposes IOptions<>) + ILogger; pings GetDatabase(settings.Mongo.DatabaseName).RunCommandAsync<BsonDocument>({ping:1}); HARD 2s via linked CTS (CancelAfter); Unhealthy on timeout (OperationCanceledException guarded) / exception.
   - NEW KafkaReadinessHealthCheck.cs (tag "ready"): singleton IAdminClient.GetMetadata(3s) READ-ONLY (no probe produce); Unhealthy on exception/zero-brokers.
   - Infrastructure.csproj: added <FrameworkReference Include="Microsoft.AspNetCore.App" /> so IHealthCheck/HealthCheckResult resolve in the non-web library WITHOUT a NuGet package. (Health checks placed in Infrastructure beside Mongo/Kafka; Api references Infra so AddCheck<T> works.) THIS edit landing late was the cause of the 3x CS0246 mid-run.
   - Bootstrap.cs RegisterKafkaInfrastructure: registered singleton IAdminClient via AdminClientBuilder(new AdminClientConfig{BootstrapServers=string.Join(",",settings.Kafka.BootstrapServers)}) using sp.GetRequiredService<IOptions<ConfigurationSettings>>().Value = cached, no churn. (BootstrapServers is string[] in ConfigurationSettings; must be Join'd — same as CreateConsumerConfig/CreateProducerConfig.)
   - Program.cs (inside Main): AddHealthChecks().AddCheck<LivenessHealthCheck>("self",["live"]).AddCheck<MongoReadinessHealthCheck>("mongo",["ready"]).AddCheck<KafkaReadinessHealthCheck>("kafka",["ready"]).
   - Endpoints (all AllowAnonymous), replacing the single app.MapHealthChecks("/health"): /health/live (Predicate r=>r.Tags.Contains "live"), /health/ready (Tags "ready" = mongo+kafka), /health alias -> "live". Default HealthCheckOptions => Unhealthy=503, Healthy=200. CONTRACT MET: /health/ready 503 when Mongo OR Kafka down, 200 when both up. Added `using Microsoft.AspNetCore.Diagnostics.HealthChecks;` + `using Falcon.Charging.Infrastructure.HealthChecks;`.

2. Hardening:
   - Bootstrap.cs ConnectWithMongoDB (singleton IMongoClient factory): MongoClientSettings.FromConnectionString(settings.Mongo.ConnectionString) + MaxConnectionPoolSize=200, MinConnectionPoolSize=10, ServerSelectionTimeout=5s, ConnectTimeout=5s, WaitQueueTimeout=10s; new MongoClient(mcs). The scoped IMongoDatabase factory (separate AddScoped that does GetRequiredService<IMongoClient>().GetDatabase(DatabaseName)) was left UNCHANGED. Console.WriteLine effective pool once.
   - Program.cs Main TOP (before `var builder = WebApplication.CreateBuilder`): ThreadPool.GetMinThreads -> SetMinThreads(worker=Max(cur,50), iocp=Max(cur,50)) -> GetMinThreads; Console.WriteLine before/after.
   (Console used for both because Serilog/logging pipeline not built yet at that point.)

## Verify (RUNTIME-CONFIRMED this session, output channel recovered)
- `dotnet build Falcon.Charging.slnx --no-incremental` => Build succeeded, 0 Errors, 36 Warnings (EXITCODE=0). All 6 projects incl Falcon.Charging.Tests compiled.
- `dotnet test tests/Falcon.Charging.Tests --no-build` => Passed! Failed:0 Passed:90 Skipped:0 Total:90.
- All 36 warnings are PRE-EXISTING/benign and NOT from my code: NU1902/NU1903 (AutoMapper/SharpCompress/Snappier CVEs), CS8632 (#nullable annotation in non-nullable files), CS0618 (ServiceOperationResult.Failure obsolete in ExceptionHandlerMiddleware), and NU1510 prune hints. The NU1510 "will not be pruned" hints appeared because the new FrameworkReference makes 4 Microsoft.Extensions.* PackageReferences redundant — harmless, not removed to keep edits minimal.

## Key Decisions
- Health checks in Infrastructure (not Api) via FrameworkReference (zero NuGet) because Api does NOT reference Confluent.Kafka and IAdminClient needs it; Mongo/Kafka concerns belong in Infra.
- Singleton IAdminClient (preferred "cached" path) over per-check create/dispose.
- Redis SKIPPED (RealTimeCharging.Enabled=false) per task — no Redis readiness check added.
- Used IOptions<ConfigurationSettings> in Mongo health check ctor (28 other classes do this; bare type is not DI-registered).

## Files Changed
- M src/Falcon.Charging.Api/Program.cs
- M src/Falcon.Charging.Infrastructure/Bootstrap.cs
- M src/Falcon.Charging.Infrastructure/Falcon.Charging.Infrastructure.csproj
- A src/Falcon.Charging.Infrastructure/HealthChecks/LivenessHealthCheck.cs
- A src/Falcon.Charging.Infrastructure/HealthChecks/MongoReadinessHealthCheck.cs
- A src/Falcon.Charging.Infrastructure/HealthChecks/KafkaReadinessHealthCheck.cs

## Context for Next Agent
- NO COMMITS (working tree). Sibling agent owns Dockerfile/compose; their container healthcheck must target GET /health/ready (503=down, 200=both Mongo+Kafka up).
- Build + 90 unit tests GREEN. NOT runtime-verified against a live Mongo/Kafka (no stack brought up this session) — the 503/200 contract is by-construction (default HealthCheckOptions status codes + tag predicates) not yet probed live.
- appsettings.json has a PRE-EXISTING malformed/duplicate brace structure around the Kafka/Topics + OcsResilience blocks (out of scope, untouched).
- Scratch files (_build_out.txt, _AMMAR_CHANGE_MANIFEST.md, C:/Falcon/_charging_test_out.txt) were created then DELETED — tree is clean of them.
- TOOLING LESSON: mid-session the Bash/PowerShell/Read output channel went fully dark for ~6 calls (every tool returned empty) right after a heavy parallel batch; it recovered on its own. When that happens, redirect build/test output to a file and re-Read once the channel is back rather than re-running. Also: the very first parallel batch returned several PHANTOM/CORRUPTED file contents (a stray `var client2 = client;` that was never actually in the file, plus duplicated reads) — always confirm against a fresh single-tool read before acting.
