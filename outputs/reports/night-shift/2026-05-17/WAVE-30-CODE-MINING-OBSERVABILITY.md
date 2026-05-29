# WAVE 30 — CODE MINING: OBSERVABILITY, LOGGING, TELEMETRY, APM

**Date:** 2026-05-18
**Scope:** Falcon backend services (Commerce, Identity, Provisioning, Charging, Templates, ContactGroup, Core-Gateway, System-Gateway, Access/PES) + falcon-web-platform-ui
**Method:** Static code mining. All facts carry `file:line` citations.

---

## TL;DR

| Area | Status |
|---|---|
| Serilog (all services) | **PRESENT** — console-only, identical template |
| Correlation ID middleware | **PRESENT** (gateways only) — propagates HTTP via JwtForwardingHandler + YARP transforms; propagates Kafka via Avro `EventContext` |
| OpenTelemetry | **MISSING** — zero references platform-wide |
| Metrics (`Meter`/`Counter`) | **PARTIAL** — only in `OcsObservabilityService` (Charging) — no exporter wired |
| Application Insights | **MISSING** — zero references |
| Prometheus / Grafana / Datadog | **MISSING** — zero references in code + docker-compose |
| Health checks `/health/live` + `/health/ready` | **PARTIAL** — Identity / ContactGroup / Templates / Gateways have split; Commerce / Charging / Provisioning have single `/health`; Access uses `pes/health` |
| AuditLog destination | **PARTIAL** — only Identity has `AuditLogs` Mongo collection. Commerce/Provisioning/Charging/Templates/ContactGroup have NO audit log table |
| Operational log separate from ledger | **MISSING** — wallet domain writes only `Ledger` + `WalletLedgerEntry` |
| `correlationId` in error envelope | **MISSING** — logged, never serialized in `ServiceOperationResult<T>` body |
| Frontend telemetry (Sentry / App Insights JS) | **MISSING** — only `console.error` |
| Mongo slow-query / profiling | **MISSING** |
| Kafka consumer-lag monitoring | **MISSING** — only `LogError` on `ConsumeException` + Gateway `SetErrorHandler` writing to stderr |
| Aggregated log collector (fluentd/vector/logstash) | **MISSING** |
| Dashboard URLs (Grafana / Datadog) | **MISSING** |

**Bottom line:** Falcon ships zero distributed-tracing, zero metrics scraping, zero centralized logging. Observability is **console logs + correlation header + 1 unwired `Meter`**. K8s liveness/readiness probes are the only operational signal that survives the process boundary.

---

## 1. Serilog Configuration — PRESENT (uniform, console-only)

Every backend service uses Serilog via `builder.Host.UseSerilog((ctx, ...) => lc.ReadFrom.Configuration(ctx.Configuration).Enrich.FromLogContext())` reading from `Serilog` section in `appsettings.json`.

### Per-service setup

| Service | Bootstrap call | appsettings sink |
|---|---|---|
| Commerce | `Program.cs:12-14` | `appsettings.json:2-23` Console only, `Microsoft.AspNetCore=Warning` |
| Identity | `Program.cs:9` → `ServiceCollectionExtensions.cs:38-44` | `appsettings.json:2-27` Console only, enrichers `FromLogContext + WithMachineName + WithThreadId` |
| Charging | `Program.cs:14-17` (inline `WriteTo.Console()`) | `appsettings.json:2-23` |
| Provisioning | `Program.cs:14-17` (inline `WriteTo.Console()`) | `appsettings.json:2-23` |
| Templates | `Program.cs:13-14` | `appsettings.json:2-20` enrichers `FromLogContext + WithMachineName + WithThreadId`, `MongoDB=Warning` override |
| ContactGroup | `Program.cs:12-13` | `appsettings.json:2-20` (same as Templates) |
| Core Gateway | `Program.cs:6` → `ServiceCollectionExtensions.cs:29-35` | `appsettings.json:2-23` Console only |
| System Gateway | `Program.cs:6` → `ServiceCollectionExtensions.cs:20-26` (inline `WriteTo.Console()`) | `appsettings.json:2-23` Console only |
| Access (PES) | **DOES NOT USE SERILOG** — uses `builder.Logging.AddLog4Net()` at `Program.cs:112` |

### Structured logging shape

Output template (uniform across Commerce / Charging / Provisioning / Templates / ContactGroup / both Gateways):
```
[{Timestamp:yyyy-MM-dd HH:mm:ss.fff zzz} {Level:u3}] {SourceContext} {Message:lj}{NewLine}{Exception}
```
(Identity slightly different: `HH:mm:ss` only — `falcon-core-identity-svc/.../appsettings.json:18`.)

### Sinks present / missing

- **PRESENT:** `Serilog.Sinks.Console` (only) — see e.g. `falcon-core-commerce-svc/src/Falcon.Commerce.Api/Falcon.Commerce.Api.csproj:16-17` lists `Serilog.AspNetCore` + `Serilog.Sinks.Console`.
- **MISSING:** File sink, Seq sink, Elasticsearch sink, OpenTelemetry sink, Application Insights sink — none referenced.

### Hard fact
The platform writes structured JSON-shaped messages to **stdout only**. Persistence depends entirely on the docker / kubernetes log driver (no in-app rotation, no in-app aggregation).

---

## 2. Correlation ID — PRESENT (gateways) / propagated to services via headers + Kafka

### Middleware (gateway-only)

- **Core Gateway:** `falcon-int-core-gateway-svc/src/Falcon.Core.Gateway/Startup/Middleware/CorrelationIdMiddleware.cs:8-32`
- **System Gateway:** `falcon-int-system-gateway-svc/src/Falcon.System.Gateway/Startup/Middleware/CorrelationIdMiddleware.cs:9-33`

Both implementations are identical: read `X-Correlation-Id` header (constant `falcon-int-core-gateway-svc/.../FalconKeys.cs:16` / `falcon-int-system-gateway-svc/.../FalconKeys.cs:16`), generate `Guid.NewGuid().ToString()` if absent, write to `HttpContext.Items["CorrelationId"]` (line 22-23), echo on response via `Response.OnStarting` (line 24-28).

Middleware is registered in `WebApplicationExtensions.UseMiddlewarePipeline`:
- Core: `falcon-int-core-gateway-svc/.../WebApplicationExtensions.cs:31`
- System: `falcon-int-system-gateway-svc/.../WebApplicationExtensions.cs:31`

**MISSING:** Backend services (Commerce, Identity, Provisioning, Charging, Templates, ContactGroup) do **NOT** run their own CorrelationIdMiddleware. They depend on the gateway to inject `X-Correlation-Id` and rely on `HttpContext.TraceIdentifier` if the header is absent.

### HTTP propagation downstream

`JwtForwardingHandler` reads from `HttpContext.Items["CorrelationId"]` and forwards to outbound HTTP calls:
- Core: `falcon-int-core-gateway-svc/src/Falcon.Core.Gateway/Http/JwtForwardingHandler.cs:23-31`
- System: `falcon-int-system-gateway-svc/src/Falcon.System.Gateway/Http/JwtForwardingHandler.cs:26-31`

YARP request transforms strip any client-spoofed `X-Correlation-Id` and re-inject from `HttpContext.Items`:
- Core: `falcon-int-core-gateway-svc/.../ServiceCollectionExtensions.cs:140-157`
- System: `falcon-int-system-gateway-svc/.../ServiceCollectionExtensions.cs:103-109`

### Kafka propagation

`EventContext` Avro record carries `CorrelationId` field. Schema definitions:
- Commerce: `falcon-core-commerce-svc/src/Falcon.Commerce.Infrastructure/Messaging/Kafka/AvroEvent/EventContext.cs:22` (field 5, also includes UserId/Username/TenantId/IpAddress/UserAgent)
- Identity: `falcon-core-identity-svc/src/Falcon.Identity.Api/Infrastructure/Messaging/Kafka/AvroEvent/EventContext.cs:16` (UserId/Username/TenantId/CorrelationId)
- ContactGroup: `falcon-core-contact-group-svc/src/Falcon.ContactGroup.Api/Infrastructure/Messaging/Kafka/AvroEvent/EventContext.cs`
- Charging: `falcon-core-charging-svc/src/Falcon.Charging.Infrastructure/Messaging/Kafka/AvroEvent/EventContext.cs`
- Access: `falcon-core-access-svc/src/T2.PES.API/Messaging/AvroEvent/EventContext.cs`

Commerce populates correlation from `HttpContext.TraceIdentifier`, not the gateway-injected header:

```csharp
// falcon-core-commerce-svc/src/Falcon.Commerce.Infrastructure/Messaging/EventContextProvider.cs:23
CorrelationId = httpContextAccessor.HttpContext?.TraceIdentifier
```

**GAP:** Commerce uses `TraceIdentifier` (per-process random ID) for Kafka `EventContext.CorrelationId` instead of the gateway-supplied `X-Correlation-Id` from `HttpContext.Items["CorrelationId"]`. End-to-end correlation across HTTP → Kafka → consumer breaks at the Commerce boundary unless the gateway value happens to overwrite `TraceIdentifier` (it doesn't — middleware writes to `Items`, not the trace).

### Echo in response

Gateways set `X-Correlation-Id` on the outgoing response (line 26-27 of each middleware). Backend services do **not** — there is no analog middleware in Commerce / Identity / Charging / Provisioning / Templates / ContactGroup.

---

## 3. OpenTelemetry — MISSING (confirms Wave 24)

Grep for `OpenTelemetry`, `ActivitySource`, `Activity.Current`, `Microsoft.ApplicationInsights`, `Prometheus`, `Datadog`, `Jaeger` across all `*.cs` and `*.csproj` files in `C:\Falcon\Falcon\` returns **zero matches**.

Confirms Wave 24's "no OTel on gateways" — and extends it: **NO OTel anywhere in Falcon**. Not on Commerce, Identity, Charging, Provisioning, Templates, ContactGroup, Access/PES, nor the two gateways.

The only `System.Diagnostics.Metrics` usage is `OcsObservabilityService` (see §4).

### Tracing infrastructure (alternative)

- ASP.NET built-in `Activity` flows through automatically (W3C TraceContext on outbound HTTP via `HttpClient` factory), but **no listener / exporter is registered**, so traces are produced and dropped.
- YARP forwards `traceparent` / `tracestate` headers by default. End-to-end correlation **could** work via W3C TraceContext if any service were configured to export, but none are.
- No `OpenTelemetry.Instrumentation.AspNetCore`, no `OpenTelemetry.Exporter.OpenTelemetryProtocol`, no `OpenTelemetry.Instrumentation.Http` packages.

---

## 4. Metrics — PARTIAL (1 service, no exporter)

Only `falcon-core-charging-svc/src/Falcon.Charging.Infrastructure/Services/OcsObservabilityService.cs` instruments `Meter` / `Counter` / `Histogram`:

```csharp
// OcsObservabilityService.cs:18-23
private static readonly Meter Meter = new("Falcon.Charging.Ocs", "1.0.0");
private static readonly Histogram<double> WalletLoadLatencyMs = Meter.CreateHistogram<double>("ocs.wallet.load.latency.ms");
private static readonly Histogram<double> ReservationAgeMs = Meter.CreateHistogram<double>("ocs.reservation.age.ms");
private static readonly Histogram<double> ProjectionLagMs = Meter.CreateHistogram<double>("ocs.projection.lag.ms");
private static readonly Counter<long> IdempotencyHits = Meter.CreateCounter<long>("ocs.idempotency.hits");
private static readonly Counter<long> RetryScheduled = Meter.CreateCounter<long>("ocs.retry.scheduled");
```

Threshold-based warning logs at: 50ms wallet load (`appsettings.json:109` `SlowWalletLoadWarningMs`), 300s stale reservation (`StaleReservationWarningMs`), 60s projection lag (`SlowProjectionLagWarningMs`).

**Critical caveat in the file's own comment** (`OcsObservabilityService.cs:13-15`):
> "The meter-based metrics are **passive until a diagnostics/OTel pipeline subscribes to them**, while the threshold-based warnings give operators an immediate signal in plain service logs."

No `MeterListener`, no `MeterProvider`, no Prometheus exporter is configured anywhere. The metrics are emitted to the .NET diagnostic source but never collected.

**No Prometheus / OpenMetrics endpoint** — grep for `UseMetricServer`, `MapPrometheusScrapingEndpoint`, `prometheus-net` returns zero matches.

---

## 5. Application Insights — MISSING

Zero references to `Microsoft.ApplicationInsights`, `AddApplicationInsights`, `TelemetryClient`, `applicationinsights.config` across the entire codebase (frontend + backend).

---

## 6. Health Checks — PARTIAL (split for K8s in some, single endpoint in others)

### Service-by-service

| Service | Liveness | Readiness | Checks |
|---|---|---|---|
| **Identity** | `/health/live` (`Predicate=_=>false`) | `/health/ready` | MongoDB + Redis + Kafka — `falcon-core-identity-svc/.../Startup/Extensions/WebApplicationExtensions.cs:46-47` + `ServiceCollectionExtensions.cs:146-149` |
| **ContactGroup** | `/health/live` | `/health/ready` | MongoDB (if configured) + Redis (if configured) — `falcon-core-contact-group-svc/.../WebApplicationExtensions.cs:101-106` + `ServiceCollectionExtensions.cs:57-61` |
| **Templates** | `/health/live` | `/health/ready` | MongoDB — `falcon-core-templates-svc/.../WebApplicationExtensions.cs:41-46` + `DependencyInjection.cs:64-65` |
| **Core Gateway** | `/health/live` | `/health/ready` | **NO dependency checks** — bare `AddHealthChecks()` at `ServiceCollectionExtensions.cs:58`, mapped at `WebApplicationExtensions.cs:90-91` |
| **System Gateway** | `/health/live` | `/health/ready` | **NO dependency checks** — bare `AddHealthChecks()` at `ServiceCollectionExtensions.cs:45`, mapped at `WebApplicationExtensions.cs:85-86` |
| **Commerce** | single `/health` | (no separate ready) | **NO dependency checks** — `Program.cs:23` `AddHealthChecks()` then `Program.cs:86` `MapHealthChecks("/health")` |
| **Charging** | single `/health` | (no separate ready) | **NO dependency checks** — `Program.cs:23` + `Program.cs:49` `MapHealthChecks("/health")` |
| **Provisioning** | single `/health` | (no separate ready) | **NO dependency checks** — `Program.cs:23` + `Program.cs:49` |
| **Access (PES)** | `pes/health` | (no separate ready) | **NO dependency checks** — `T2.PES.API/Program.cs:29` + `Program.cs:118` |

### What `_=>false` means

The predicate `_ => false` (Identity, ContactGroup, Templates, both Gateways at `/health/live`) **disables all registered checks for that endpoint**, returning healthy as long as the process can respond — proper liveness semantics for K8s.

### Gap: 4 services have a single `/health` only

Commerce, Charging, Provisioning, Access (PES) only expose `/health` (or `pes/health`) with **no registered dependency checks**. They behave like liveness probes that always pass — readiness (DB/Kafka/Redis up) is not testable via HTTP. This is a documented gap for K8s deployments since "ready" cannot be distinguished from "alive".

---

## 7. Wallet Domain — Operational Log vs. Ledger — MISSING

Two ledger collections in Charging:
- `Ledger` — `falcon-core-charging-svc/src/Falcon.Charging.Domain/Entities/Ledger.cs:8-87`. Fields: tenantId, walletId, commChannelSubWalletId, type (`eLedgerType`), amount, currency, refType (`eLedgerRefType`), refId, balanceBefore, balanceAfter, description, createdAt, createdBy.
- `WalletLedgerEntry` — `falcon-core-charging-svc/src/Falcon.Charging.Domain/LedgerIntegration/Entities/WalletLedgerEntry.cs:11-77` (OCS hot-path mirror). Fields: walletId, accountId, bucketId, contractId, type (`eOcsLedgerType`), refType, refId, amount, currency, metadataJson, createdAt.

**Both are financial double-entry ledgers. Neither is an operational/business log.**

**No operational log separate from the ledger exists.** Operational events (reservation expired, hot-state sync failed, projection lagged) are emitted only via:
1. `_logger.LogWarning` / `LogError` from `OcsObservabilityService` (see §4) — into stdout, no persistence collection.
2. The `Meter`-based histograms/counters — never collected.

If business needs an "audit trail of wallet operations" distinct from accounting entries, **it doesn't exist**.

---

## 8. Audit Log Destination — PARTIAL (Identity only)

### Identity — has audit log

- Collection: `AuditLogs` in `FalconIdentityDb`.
- Writer: `falcon-core-identity-svc/src/Falcon.Identity.Api/Infrastructure/Persistence/MongoAuditLogger.cs:10-83`
- Mongo collection bind: line 16-17 `database.GetCollection<AuditLog>("AuditLogs")`
- Entity: `falcon-core-identity-svc/src/Falcon.Identity.Api/Domain/Entities/AuditLog.cs:7-60` — fields: tenantId, entityType, entityId, action (`eAuditAction` Created/Updated/Deleted), changes, snapshot (BsonDocument), performedBy, performedByName, performedAt, ipAddress, userAgent, httpMethod, requestUrl.
- Best-effort: failures swallowed with `LogWarning` (lines 30-32, 45-47, 60-63) — auditing failure does not roll back the user-visible operation.

### Commerce / Provisioning / Charging / Templates / ContactGroup — NO audit log

`Grep "AuditLog|IAuditLogger" type=cs` in each service's tree:
- Commerce → 3 hits all in tests + `Node.cs` (not an audit log table; a `NodeAudit` field on the Node entity itself)
- Provisioning → 0 hits
- Charging → 0 hits
- Templates → 0 hits
- ContactGroup → 0 hits

**No centralized Kafka topic for audit either** — search for `audit.v1`, `audit-log.v1`, `audit-events` in topic configurations returns nothing. Identity's audit collection is the only persistent audit trail on the platform. Wave 23's finding is confirmed and extended: audit is **Identity-only, not cross-service**.

---

## 9. Error Response Envelope — MISSING correlationId

All services use the same `ServiceOperationResult<T>` record/struct, but **none of the shapes carry `correlationId`**.

### Shape variants

| Service | File | Fields |
|---|---|---|
| Identity | `falcon-core-identity-svc/src/Falcon.Identity.Api/Application/Models/ServiceOperationResult.cs:10-13` | `IsSuccessful, Result, ErrorMessages` |
| Commerce | `falcon-core-commerce-svc/src/Falcon.Commerce.Api/Common/ServiceOperationResult.cs:3-7` | `IsSuccessful, Result, ErrorCodes, ErrorMessages` (different — has ErrorCodes) |
| Charging | `falcon-core-charging-svc/src/Falcon.Charging.Contracts/ServiceOperationResult.cs:3-8` | `IsSuccessful, Result, ErrorMessages` (struct) |
| Provisioning | `falcon-core-provisioning-svc/src/Falcon.Provisioning.Contracts/ServiceOperationResult.cs:3-8` | `IsSuccessful, Result, ErrorMessages` (struct) |
| Templates | `falcon-core-templates-svc/src/Falcon.Templates.Contracts/Common/ServiceOperationResult.cs` | `IsSuccessful, Result, ErrorMessages` |
| ContactGroup | `falcon-core-contact-group-svc/src/Falcon.ContactGroup.Api/Application/Models/ServiceOperationResult.cs:9-13` | `IsSuccessful, Result, ErrorMessages` |
| Core Gateway | `falcon-int-core-gateway-svc/src/Falcon.Core.Gateway/Contracts/Shared/ServiceOperationResult.cs` | (matches above) |
| System Gateway | `falcon-int-system-gateway-svc/src/Falcon.System.Gateway/Contracts/Shared/ServiceOperationResult.cs` | (matches above) |

**No envelope has a `CorrelationId` / `TraceId` property.**

The Core Gateway global handler **logs** the correlation ID but writes it only to stdout, not the body:

```csharp
// falcon-int-core-gateway-svc/src/Falcon.Core.Gateway/Startup/ExceptionHandlers/GlobalExceptionHandler.cs:15-21
var correlationId = httpContext.Items.TryGetValue("CorrelationId", out var corrId)
    ? corrId as string
    : null;
logger.LogError(exception,
    "Unhandled exception | CorrelationId: {CorrelationId} | Path: {Path}",
    correlationId, httpContext.Request.Path);
// ... then writes ServiceOperationResult<object>.Failure("InternalServerError") — no correlationId in body
```

**Practical impact:** when a user sees an error popup, there is no correlation token they can quote to support. The gateway response header `X-Correlation-Id` is set, but the response body has no field for it.

---

## 10. Frontend Telemetry — MISSING

### Package scan
`falcon-web-platform-ui/package.json` — no entries for `@sentry/*`, `@microsoft/applicationinsights-web`, `@datadog/browser-rum`, `posthog-js`, `fullstory`.

### Code scan
Grep `applicationinsights|sentry|datadog|posthog|fullstory|trackEvent|trackPageView|telemetry` across `falcon-web-platform-ui/`:
- 3 hits — all comments forward-looking, not actual integrations:
  - `apps/admin-console/.../tab-components/_shared/services/commerce-actions.service.ts:5` — `cross-cutting telemetry (mutation count, latency)` (TODO comment in service-doc)
  - `apps/admin-console/.../tab-components/_shared/services/commerce-gateway.service.ts` (similar comment)
  - `libs/falcon/src/shared-data-access/lib/interceptors/runtime-base-url.interceptor.ts` (similar)

### Global ErrorHandler
No custom Angular `ErrorHandler` provider — grep for `provideErrorHandler|class.*ErrorHandler|ErrorHandler.*useClass` returns no matches. Default Angular `ErrorHandler` just `console.error`s.

### Window-level
No `window.onerror`, no `window.addEventListener('unhandledrejection')` registered anywhere. Errors die in the console.

### What DOES exist
`apps/host-shell/src/app/core/interceptors/response-interceptor.ts:32-182` — HTTP `ResponseInterceptor`:
- 401 → triggers `AuthService.refreshTokenIfNeeded` (line 95-106).
- 4xx/5xx/network → `dispatcher.dispatchError(err, request)` (line 109) — shows a toast/popup based on per-call `FalconHttpMessages` config.
- 200 with `isSuccessful:false` → `dispatcher.dispatchApplicationError(detail, request)` (line 66).
- Catch-block of the catch (line 110-113) emits `console.error('[ResponseInterceptor] Exception in error handler:', e)` — only console.

User-facing only. No outbound telemetry.

---

## 11. Mongo Slow-Query Detection — MISSING

Grep `slowMs|profiling|setProfilingLevel|EnableProfiling|slow.*query` across the codebase returns **zero matches** (all "Profile" hits are `ZitadelProfileRequest` — user profile, not Mongo profiling).

The `MongoDB: Warning` Serilog override at e.g. `falcon-core-templates-svc/src/Falcon.Templates.Api/appsettings.json:8`, `falcon-core-contact-group-svc/src/Falcon.ContactGroup.Api/appsettings.json:8` **suppresses** the Mongo driver's own log spam — the opposite of slow-query logging.

Docker-compose `mongo` service (`Falcon/docker-compose.yml:4-33`) starts Mongo with replica set `rs0`. There is no `--profile 1 --slowms 100` or any equivalent `mongod` arg. Mongo profiling collection (`system.profile`) is not configured.

---

## 12. Kafka Observability — PARTIAL

### Consumer lag monitoring
Grep `consumer.*lag|ConsumerLag|monitorLag|kafkaLag` returns **zero matches**. No JMX, no AdminClient queries for consumer-group lag, no `cp-kafka-exporter` in docker-compose. Lag is unmonitored.

### Producer error logging
`falcon-core-commerce-svc/src/Falcon.Commerce.Infrastructure/Messaging/Kafka/Base/KafkaAvroProducer.cs:51-68` — wraps `ProduceAsync` in `try/catch (ProduceException<string,T>)` and `catch (Exception)`, both `LogError` then `throw`. Same pattern in `falcon-core-charging-svc/.../KafkaAvroProducer.cs`.

### Consumer error handling
`falcon-core-commerce-svc/src/Falcon.Commerce.Infrastructure/Messaging/Kafka/Base/KafkaAvroConsumerBase.cs:24-93`:
- `catch (ConsumeException ex)` → `LogError ... Reason` (line 72-75) then `Task.Delay(1000)`.
- `catch (Exception ex)` → `LogError` + `PublishToDeadLetterAsync` (line 77-80).
- `PublishToDeadLetterAsync` (line 97-108) is a **stub** — logs `Publishing to DLQ: {DLQTopic}, ReferenceId: ...` then `Task.CompletedTask`. **Does not actually publish to a DLQ topic.**

### Gateway Kafka consumer error handler
`falcon-int-core-gateway-svc/src/Falcon.Core.Gateway/Startup/Extensions/ServiceCollectionExtensions.cs:252-257`:
```csharp
.SetErrorHandler((_, error) =>
{
    if (error.IsFatal)
        Console.Error.WriteLine($"[KAFKA FATAL] {typeof(T).Name}: {error.Reason}");
})
```
Fatal Kafka errors go to **`Console.Error.WriteLine`** — bypassing Serilog. Non-fatal errors are dropped silently.

### Verdict
Kafka observability is "log when something explodes, never know if anything is keeping up." No lag, no DLQ destination, no per-topic SLO metrics.

---

## 13. Aggregated Log Collector — MISSING

Grep `fluentd|fluent-bit|logstash|vector\.dev|filebeat|grafana|prometheus` across:
- All `*.cs` — 0 matches
- All `*.yml`, `*.yaml`, `*.json`, `*.env` in `C:/Falcon/` — 0 matches
- `Falcon/docker-compose.yml`, `Falcon/docker-compose-qc.yml` — services list is `mongo / postgres / redis / minio / zookeeper / kafka / schema-registry / zitadel / pes / identity / charging / commerce / provisioning / contact-group / core-gateway / system-gateway` + frontend. No log shipper sidecar.

No aggregated log destination exists. Logs are stdout-only and read via `docker compose logs` / `kubectl logs` per-pod.

---

## 14. Dashboard URLs — MISSING

Grep `grafana.com|datadoghq.com|app.datadoghq|newrelic|dashboard.url|prometheus.io|kibana` across all config files and code → **zero matches**.

The only "dashboard" referenced is the Hangfire dashboard (Commerce + ContactGroup), gated behind `IsDevelopment()`:
- Commerce: `falcon-core-commerce-svc/src/Falcon.Commerce.Api/Program.cs:75-78` `app.UseFalconHangfire(builder.Configuration)` (config at `appsettings.json:62-66` `Hangfire.DashboardPath: "/hangfire"`)
- ContactGroup: `falcon-core-contact-group-svc/.../WebApplicationExtensions.cs:55-66` `UseHangfireDashboard(hangfireOpts.DashboardPath, ...)` with `HangfireDevAuthFilter` (dev only)

The Hangfire dashboard is for background-job state, not platform observability.

---

## Summary table — per-Wave-30 question

| # | Question | Verdict | Anchor file(s) |
|---|---|---|---|
| 1 | Serilog config / sinks / shape | **PRESENT** Console-only, uniform template, no file/Seq/ES sinks | `*/Program.cs` + `*/appsettings.json` Serilog section |
| 2 | Correlation ID middleware + propagation | **PRESENT** (gateways) + Kafka EventContext; **GAP** backend services have no own middleware, Commerce uses `TraceIdentifier` not `Items["CorrelationId"]` for Kafka | `falcon-int-*-gateway-svc/.../CorrelationIdMiddleware.cs` |
| 3 | OpenTelemetry status | **MISSING** — confirmed across ALL services | (zero matches) |
| 4 | Metrics (Meter/Counter) | **PARTIAL** — 1 service has Meter, no exporter wired | `falcon-core-charging-svc/.../OcsObservabilityService.cs:18-23` |
| 5 | Application Insights | **MISSING** | (zero matches) |
| 6 | Health checks live + ready | **PARTIAL** — Identity / ContactGroup / Templates / Gateways have split; Commerce / Charging / Provisioning / Access only single `/health` (`pes/health`), no dep checks | per §6 table |
| 7 | Wallet operational log distinct from ledger | **MISSING** — only `Ledger` + `WalletLedgerEntry` (both financial) | `falcon-core-charging-svc/.../Domain/Entities/Ledger.cs` |
| 8 | Audit log destination | **PARTIAL** — Identity only (`AuditLogs` collection in `FalconIdentityDb`). Commerce / Provisioning / Charging / Templates / ContactGroup have NONE. No centralized Kafka audit topic | `falcon-core-identity-svc/.../MongoAuditLogger.cs:17` |
| 9 | `correlationId` in error envelope | **MISSING** — logged but never serialized into `ServiceOperationResult<T>` body. Set in `X-Correlation-Id` response header only | per §9 table |
| 10 | Frontend telemetry | **MISSING** — only `console.error`, no Sentry / AI JS / Datadog / global ErrorHandler | `apps/host-shell/.../response-interceptor.ts:111` |
| 11 | Mongo slow-query / profiling | **MISSING** — Serilog `MongoDB: Warning` overrides actually SUPPRESS driver logs | (zero matches + `appsettings.json:8`) |
| 12 | Kafka observability | **PARTIAL** — try/catch LogError on Produce + Consume; `PublishToDeadLetterAsync` is a stub; gateway fatal goes to `Console.Error.WriteLine` | `*/KafkaAvroProducer.cs`, `KafkaAvroConsumerBase.cs:97-108` |
| 13 | Aggregated log collector | **MISSING** — no fluentd / vector / logstash / filebeat in code or compose | (zero matches) |
| 14 | Dashboard URLs | **MISSING** — only dev-only Hangfire dashboard | (zero matches) |

---

## Risk register (mined, not invented)

1. **Cross-service tracing impossible** — no OTel exporter, correlation ID lives in HTTP header + Avro field but never lands in a sink that ties them together.
2. **Commerce-Kafka correlation broken** — `EventContextProvider.cs:23` uses `TraceIdentifier` not the gateway header. Events published by Commerce lose the gateway correlation token.
3. **Audit gap on Commerce / Provisioning / Charging** — billing changes, wallet operations, service activations are not audited. Identity is the only service with persistent who-did-what.
4. **Half of services can't tell K8s "ready vs. alive"** — Commerce / Charging / Provisioning / Access only expose one bare `/health` with no dep checks.
5. **Wallet operational events disappear** — `OcsObservabilityService` writes histograms + counters to `Meter` with no listener, and only log lines remain. After log retention, ops-state is unrecoverable.
6. **DLQ is a TODO** — `PublishToDeadLetterAsync` (Commerce Kafka base) is a log-only stub. Poison messages aren't quarantined.
7. **Fatal Kafka errors bypass Serilog** — gateway `Console.Error.WriteLine` writes outside the structured pipeline.
8. **Error envelope has no traceability** — users can't quote a correlation ID from error popups because the body doesn't carry one.

---

## Files cited (absolute paths)

Serilog setup:
- `C:\Falcon\Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Api\Program.cs` (Serilog at L12-14)
- `C:\Falcon\Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Program.cs` (L9 → ServiceCollectionExtensions.cs L38-44)
- `C:\Falcon\Falcon\falcon-core-charging-svc\src\Falcon.Charging.Api\Program.cs` (L14-17)
- `C:\Falcon\Falcon\falcon-core-provisioning-svc\src\Falcon.Provisioning.Api\Program.cs` (L14-17)
- `C:\Falcon\Falcon\falcon-core-templates-svc\src\Falcon.Templates.Api\Program.cs` (L13-14)
- `C:\Falcon\Falcon\falcon-core-contact-group-svc\src\Falcon.ContactGroup.Api\Program.cs` (L12-13)
- `C:\Falcon\Falcon\falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\Program.cs` (L6 → ServiceCollectionExtensions.cs L29-35)
- `C:\Falcon\Falcon\falcon-int-system-gateway-svc\src\Falcon.System.Gateway\Program.cs` (L6 → ServiceCollectionExtensions.cs L20-26)
- `C:\Falcon\Falcon\falcon-core-access-svc\src\T2.PES.API\Program.cs:112` (Log4Net, not Serilog)

Correlation:
- `C:\Falcon\Falcon\falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\Startup\Middleware\CorrelationIdMiddleware.cs`
- `C:\Falcon\Falcon\falcon-int-system-gateway-svc\src\Falcon.System.Gateway\Startup\Middleware\CorrelationIdMiddleware.cs`
- `C:\Falcon\Falcon\falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\Http\JwtForwardingHandler.cs`
- `C:\Falcon\Falcon\falcon-int-system-gateway-svc\src\Falcon.System.Gateway\Http\JwtForwardingHandler.cs`
- `C:\Falcon\Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Infrastructure\Messaging\EventContextProvider.cs`
- `C:\Falcon\Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Infrastructure\Messaging\Kafka\AvroEvent\EventContext.cs`
- `C:\Falcon\Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Infrastructure\Messaging\Kafka\AvroEvent\EventContext.cs`

Metrics:
- `C:\Falcon\Falcon\falcon-core-charging-svc\src\Falcon.Charging.Infrastructure\Services\OcsObservabilityService.cs`
- `C:\Falcon\Falcon\falcon-core-charging-svc\src\Falcon.Charging.Api\appsettings.json` (OcsObservability section L108-112)

Health:
- `C:\Falcon\Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Startup\Extensions\WebApplicationExtensions.cs` (L44-49)
- `C:\Falcon\Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Startup\Extensions\ServiceCollectionExtensions.cs` (L139-151)
- `C:\Falcon\Falcon\falcon-core-contact-group-svc\src\Falcon.ContactGroup.Api\Startup\Extensions\WebApplicationExtensions.cs` (L99-107)
- `C:\Falcon\Falcon\falcon-core-templates-svc\src\Falcon.Templates.Api\Startup\Extensions\WebApplicationExtensions.cs` (L39-47)
- `C:\Falcon\Falcon\falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\Startup\Extensions\WebApplicationExtensions.cs` (L88-93)
- `C:\Falcon\Falcon\falcon-int-system-gateway-svc\src\Falcon.System.Gateway\Startup\Extensions\WebApplicationExtensions.cs` (L83-87)

Wallet ledger / audit:
- `C:\Falcon\Falcon\falcon-core-charging-svc\src\Falcon.Charging.Domain\Entities\Ledger.cs`
- `C:\Falcon\Falcon\falcon-core-charging-svc\src\Falcon.Charging.Domain\LedgerIntegration\Entities\WalletLedgerEntry.cs`
- `C:\Falcon\Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Infrastructure\Persistence\MongoAuditLogger.cs` (L16-17 collection name)
- `C:\Falcon\Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Domain\Entities\AuditLog.cs`

Error envelope:
- `C:\Falcon\Falcon\falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\Startup\ExceptionHandlers\GlobalExceptionHandler.cs` (L15-28)
- `C:\Falcon\Falcon\falcon-core-identity-svc\src\Falcon.Identity.Api\Startup\ExceptionHandlers\FalconExceptionHandler.cs`
- `C:\Falcon\Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Api\Common\ServiceOperationResult.cs` (different shape with ErrorCodes)

Frontend:
- `C:\Falcon\Falcon\falcon-web-platform-ui\apps\host-shell\src\app\core\interceptors\response-interceptor.ts`

Kafka observability:
- `C:\Falcon\Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Infrastructure\Messaging\Kafka\Base\KafkaAvroProducer.cs`
- `C:\Falcon\Falcon\falcon-core-commerce-svc\src\Falcon.Commerce.Infrastructure\Messaging\Kafka\Base\KafkaAvroConsumerBase.cs`
- `C:\Falcon\Falcon\falcon-int-core-gateway-svc\src\Falcon.Core.Gateway\Startup\Extensions\ServiceCollectionExtensions.cs` (L252-257)

Docker / infra:
- `C:\Falcon\Falcon\Falcon\docker-compose.yml` (no fluentd / grafana / prometheus services)

— END WAVE 30 —
