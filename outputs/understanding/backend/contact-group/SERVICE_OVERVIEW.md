# Contact Group Service — Overview

> Service: `Falcon.ContactGroup.Api`
> Repository: `C:\Falcon\Falcon\falcon-core-contact-group-svc`
> Solution: `Falcon.ContactGroup.sln`

## Purpose

Owns **contact group lifecycle**: a customer uploads a CSV/XLSX file containing contacts, the service validates it, persists the contacts, and exposes them as a group for downstream campaign tooling. Owns:
- **Upload sessions** — pre-signed S3 PUT URL generation, server-side validation, preview extraction
- **Contact groups** — CRUD on completed groups
- **Sharing** — share-with-all-users or share-with-specific-users-list
- **Pagination over contacts** with dynamic alias-keyed fields (CSV header → property name)
- **Pre-signed download URLs** for the original or validated file
- **Background cleanup** of orphaned upload sessions and soft-deleted groups (Hangfire)
- **Kafka producer** of `contactgroup.import-requested.v1` for downstream consumers

## Project Layout

Monolithic Api project (like Identity):

```
Falcon.ContactGroup.Api.csproj
├── Application/                      <- Commands, Queries, Handlers (per feature folder), Mappers, Abstractions
├── Domain/                           <- Constants (FalconKeys), Validations
├── Endpoints/                        <- FastEndpoints: ContactGroups/, Uploads/, Internal/
├── Infrastructure/                   <- Persistence (Mongo), Messaging (Kafka), Storage (S3), BackgroundJobs (Hangfire),
                                          Seeding, Identity (Zitadel)
└── Startup/                          <- Extensions, ExceptionHandlers, Localization, Constants

tests/Falcon.ContactGroup.Tests/      <- xUnit, ~80+ tests (most thoroughly tested service)
```

## Framework & Style

- **.NET 10**
- **Minimal API** via **FastEndpoints** + Mediator
- Endpoint route prefix: `/api`
- `Endpoint<TRequest, TResponse>` per endpoint; groups: `ContactGroupEndpointGroup` → `/api/contact-groups`, `UploadEndpointGroup` → `/api/contact-groups/uploads`
- FluentValidation (`Validator<T>` — FastEndpoints variant) auto-discovered
- `DontAutoSendResponse()` pattern — handlers manually call `HttpContext.Response.SendAsync(...)` to control status codes explicitly

## Ports

| Profile | URL |
|---|---|
| http | `http://localhost:7300` |
| https | `https://localhost:7300;http://localhost:7300` |

## Endpoint Surface

14 FastEndpoints endpoints across 4 groups:
- `ContactGroupEndpointGroup` (8 endpoints) — `/api/contact-groups/*`
- `UploadEndpointGroup` (3 endpoints) — `/api/contact-groups/uploads/*`
- Top-level under contact-groups (1 endpoint) — `/api/contact-groups/upload-config`
- Internal (2 endpoints) — `/api/_internal/*` (excluded from OpenAPI, dev-only)

See [`ENDPOINT_REGISTRY.md`](ENDPOINT_REGISTRY.md).

## Kafka

| Direction | Topic | Producer | Purpose |
|---|---|---|---|
| produce | `contactgroup.import-requested.v1` | `ImportJobRequestedEventPublisher` | Notify downstream consumers (likely campaign tooling) that a contact group is ready for import |
| consume | (same topic) | `ImportJobRequestedConsumer` | Internal — handles the import job (this is a producer/consumer-on-same-topic pattern; the service triggers itself via Kafka for async durability) |

Consumer group: `contactgroup-service`. Avro + Schema Registry.

## MongoDB

- Database: **`FalconContactGroupDb`**
- Collections (inferred): `ContactGroups`, `Contacts`, `UploadSessions`, `ImportJobs`, plus Hangfire's storage
- Standard `MongoRepository<T>` base class

## Other Infrastructure

- **Redis** (`Redis:ConnectionString`) — distributed locks, idempotency cache (verify)
- **S3** (`S3:*` config — region `me-central-2`, configurable bucket, force-path-style toggle, pre-signed URL expiry 15 min) — actual file storage (original + validated)
- **Hangfire** (`Hangfire:Enabled=true`) — recurring cleanup jobs:
  - `Hangfire:Jobs:CleanupCron = "0 0 * * *"` (daily midnight) — orphan purge
  - `Hangfire:Jobs:StuckJobWatchdogCron = "*/5 * * * *"` (every 5 min) — recover stuck imports
  - `Hangfire:Jobs:SoftDeleteRetentionDays = 7`
- **HttpClient** for Identity (`ServicesClients:Identity:BaseUrl`, 30s timeout) — east-west calls to validate sharing-target users
- **Zitadel** auth — same as other services

## File Import Constraints

`FileImport:*` config:
- `MaxFileSizeMB: 2048` (2 GB)
- `AllowedExtensions: ["csv", "xlsx", "xls"]`
- `PreviewRowCount: 5`
- `SessionExpiryMinutes: 1440` (24h)
- `UploadUrlExpiryMinutes: 5` (pre-signed PUT URL validity)
- `CsvPreviewRangeKB: 256`
- `MaxRowsPerImport: 10,000,000`
- `MaxImportRetries: 3`
- `ImportBatchSize: 1000`
- `LockTtlMinutes: 5`
- `CancellationCheckInterval: 5`
- `ExportBatchSize: 10000`

## Storage Paths

`StoragePaths:*` config defines the S3 key templates (tenant-scoped):
- TempUpload: `tenants/{tenantId}/contact-groups/temp/{uploadId}/original/{fileName}`
- GroupOriginal: `tenants/{tenantId}/contact-groups/{groupId}/original/{fileName}`
- GroupValidated: `tenants/{tenantId}/contact-groups/{groupId}/validated/{fileName}`

## Startup Flow (`Program.cs`)

```csharp
builder.Host.UseSerilog(...);
builder.Services.AddApiServices(builder.Configuration);    // OpenAPI, error handling, health, CORS, validation
builder.Services.AddContactGroupServices(...);             // Mongo, Redis, Zitadel, S3, Mediator, Identity client
builder.Services.AddFastEndpoints();

app.UseMiddlewarePipeline();
app.UseFastEndpoints(c => {
    c.Endpoints.RoutePrefix = "api";
    c.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    c.Errors.ResponseBuilder = (failures, ctx, _) => {
        var localizer = ctx.RequestServices.GetRequiredService<ErrorLocalizer>();
        var errors = failures.Select(f => localizer.Localize(f.ErrorMessage)).ToList();
        return ServiceOperationResult<object>.Failure(errors);
    };
    c.Errors.StatusCode = StatusCodes.Status400BadRequest;
});
app.ValidateResourceCompleteness();
app.MapHealthEndpoints();
await app.Services.SeedAsync();
app.UseHangfireJobs();   // Schedules recurring jobs

await app.RunAsync();
```
