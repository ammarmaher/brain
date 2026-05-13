# Provisioning Service — Overview

> Service: `Falcon.Provisioning.Api`
> Repository: `C:\Falcon\Falcon\falcon-core-provisioning-svc`
> Solution: `Falcon.Provisioning.slnx`

## Purpose

Owns **per-account service subscriptions** — the mapping between an account and the catalog of communication channels + applications it can use. Tracks:
- Service subscription status (`eProductSubscriptionStatus`)
- Per-account service **visibility** (independent of subscription status)
- Available actions per subscription (`eFalconServiceAction`)
- Account-level service provisioning (create the initial set of services for a new account)

This service is the **smallest** Clean Architecture service (2 controllers, 6 endpoints), with no Kafka activity in the default config.

## Project Layout

```
src/
  Falcon.Provisioning.Api/             <- Controllers (2), Middlewares (UnitOfWorkFilter), Localization
  Falcon.Provisioning.Application/     <- Commands, Queries, Handlers, Mappers
  Falcon.Provisioning.Contracts/       <- Request/Response DTOs, ServiceOperationResult<T>,
                                            Hook<T>, MultiLanguage, IUnitOfWorkTrigger
  Falcon.Provisioning.Domain/          <- Entities, Constants (FalconKeys), Validations
  Falcon.Provisioning.Infrastructure/  <- Persistence (Mongo), Auth (Zitadel), Seeding,
                                            Repositories/MongoRepository.cs base
tests/Falcon.Provisioning.Tests/       <- xUnit
```

## Framework & Style

- **.NET 10**
- **Controllers** (2 controllers, 6 endpoints) using `[Route("api/[controller]")]` + `[ApiController]` + `[Authorize]`
- AutoMapper for request/response mapping
- `UnitOfWorkFilter` registered globally

## Ports

| Profile | URL |
|---|---|
| http | `http://localhost:5046` |
| https | `https://localhost:7163;http://localhost:5046` |

## Endpoint Surface

| Controller | Endpoints | Drilled? |
|---|---:|:---:|
| `ServicesController` | 5 | **yes — see `controllers/ServicesController/`** |
| `LookupController` | 1 | no |

See [`ENDPOINT_REGISTRY.md`](ENDPOINT_REGISTRY.md) for the full table.

## Kafka

**No Kafka configuration in `appsettings.json`** — Provisioning is **synchronous-only** in this scan. The Commerce → Provisioning flow goes through direct HTTP calls (Commerce's `ServicesClients:Provisioning` config), not Kafka.

(There is **no consumer** registered in `Program.cs` — confirmed.)

## MongoDB

- Database: **`FalconProvisioningDB`**
- Standard `MongoRepository<T>` base class
- Seeding via `Falcon.Provisioning.Infrastructure.Seeding.SeedAsync()`

## Other Infrastructure

`appsettings.json` is **minimal** — only `Serilog`, `Zitadel`, `Cors`, `Settings:Mongo`. No Redis, no Hangfire, no Kafka.

## Startup Flow (`Program.cs`)

```csharp
builder.Services.AddControllers(o => { o.Filters.Add<UnitOfWorkFilter>(); });
builder.Services.AddHealthChecks();
builder.Services.RegisterFalconDependencies(builder.Configuration);

app.ValidateErrrosResourceCompleteness();
app.UseHttpsRedirection();
app.UseCors();
app.UseAuthentication();
app.UseAuthorization();
app.UseFalconMiddlewares();
app.MapHealthChecks("/health").AllowAnonymous();
app.MapControllers();
```

Identical to Charging's startup minus the `RealTimeCharging` background services.
