# Templates Service — Overview

> Service: `Falcon.Templates.Api`
> Repository: `C:\Falcon\Falcon\falcon-core-templates-svc`
> Solution: `Falcon.Templates.slnx`

## Purpose

Owns **communication channel configuration templates** for tenants — body type per channel (e.g. plain / template / interactive), required checker levels, and checker assignments. The service is **consumer-heavy**: it materializes state from Commerce + Identity events and exposes a small read+update surface to the frontend.

Specific responsibilities:
- Track per-tenant communication channel configurations (body type, levels count, checker level assignments)
- Maintain user-checker assignment projections from Identity events
- Surface "which checker levels can a given user be assigned to" for the admin UX

## Project Layout

Clean Architecture:

```
src/
  Falcon.Templates.Api/                 <- Endpoints/, Startup/, Localization
  Falcon.Templates.Application/         <- Commands, Queries, Use Cases, Abstractions (incl. ICurrentUser)
  Falcon.Templates.Contracts/           <- Common (ServiceOperationResult), CommunicationChannelConfigs/{Requests,Responses}
  Falcon.Templates.Domain/              <- Constants (FalconKeys), Validations
  Falcon.Templates.Infrastructure/      <- Persistence (Mongo), Messaging (Kafka consumers)
tests/Falcon.Templates.Tests/           <- xUnit
```

## Framework & Style

- **.NET 10**
- **Minimal API** via **FastEndpoints** + Mediator
- Endpoint route prefix: `/api`
- Single group: `CommunicationChannelConfigEndpointGroup` → `/api/communication-channel-configs/*`
- All endpoints require authorization (group-level `Options(x => x.RequireAuthorization())`)
- FluentValidation auto-discovered
- `DontAutoSendResponse()` pattern with explicit `HttpContext.Response.SendAsync(...)`

## Ports

| Profile | URL |
|---|---|
| http | `http://localhost:5208` |
| https | `https://localhost:7264;http://localhost:5208` |

## Endpoint Surface

3 endpoints — the smallest user-facing surface in the platform:

| Method | Route | Handler | Notes |
|---|---|---|---|
| GET | `/api/communication-channel-configs?TenantId=` | `GetCommunicationChannelConfigsEndpoint` | Returns the channel config list for a tenant |
| GET | `/api/communication-channel-configs/user-checker-levels?UserId=&TenantId=` | `GetUserCheckerLevelsEndpoint` | Returns which checker levels a user can be assigned to (driven by Identity events) |
| PUT | `/api/communication-channel-configs/{id}` | `UpdateCommunicationChannelConfigsEndpoint` | Bulk update: route `id` carries target tenant id (for Falcon callers) or is ignored (for Client callers — tenant comes from JWT) |

See [`ENDPOINT_REGISTRY.md`](ENDPOINT_REGISTRY.md).

## Kafka

| Direction | Topic | Consumer | Purpose |
|---|---|---|---|
| consume | `commerce.comm-channel-init.v1` | `CommChannelInitEventConsumer` | When Commerce creates a new comm channel for a tenant, materialize the default config |
| consume | `commerce.comm-channel-visibility-changed.v1` | `CommChannelVisibilityChangedEventConsumer` | Visibility flip — update local projection |
| consume | `identity.user-checker-assigned.v1` | `UserCheckerAssignedEventConsumer` | A user was assigned as a checker — sync local state |
| consume | `identity.user-checker-assignments-updated.v1` | `UserCheckerAssignmentsUpdatedEventConsumer` | Bulk update of checker assignments |

No producers. Consumer group: `templates-service`. Avro + Schema Registry.

The service is fundamentally a **read-model / projection** of Commerce + Identity state — adding an update endpoint only for the rare case where the tenant configures checker levels independently of upstream events.

## MongoDB

- Database: **`FalconTemplateDb`** (note: `FalconTemplateDb` not `FalconTemplatesDb` — verify if intentional)
- Standard `MongoRepository<T>` base class

## No Redis, No Hangfire

Smallest infrastructure footprint of any service. Just Mongo + Kafka + Zitadel.

## Startup Flow (`Program.cs`)

```csharp
builder.Host.UseSerilog(...);
builder.Services.AddApiServices(builder.Configuration);
builder.Services.AddTemplatesApplication();
builder.Services.AddTemplatesInfrastructure(builder.Configuration, builder.Environment);
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
await app.RunAsync();
```
