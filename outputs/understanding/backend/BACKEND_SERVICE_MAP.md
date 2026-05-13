# Backend Service Map

> First-pass inventory of all 9 active Falcon backend services. Read this file first to orient yourself before diving into a specific service.
> Source-of-truth: `C:\Falcon\Falcon\*-svc\src\*.Api\` Program.cs + appsettings.json + launchSettings.json.
> Excludes `deprecated-*` and any path matching the standard exclusion list.

## Cross-Service Inventory

| # | Service | Default Port (https) | Endpoint Style | Endpoint Count | Clean Architecture | Kafka | MongoDB | Redis | gRPC |
|---|---|---:|---|---:|:---:|---|:---:|:---:|:---:|
| 1 | Identity (`Falcon.Identity.Api`) | 7777 | Minimal API via **FastEndpoints** + Mediator | 26 endpoints + 1 webhook | **No** (single Api project; layers exist as folders: Application / Domain / Infrastructure) | producer + consumer (3 topics) | yes (`FalconIdentityDb`) | yes (HybridCache) | no |
| 2 | Commerce (`Falcon.Commerce.Api`) | 7045 | **Controllers** (10) | 42 endpoints | **Yes** (Api / Application / Contracts / Domain / Infrastructure) | producer + consumer (11 topics) | yes (`FalconCommerceDB`) | yes | no |
| 3 | Charging (`Falcon.Charging.Api`) | 7224 | **Controllers** (4) | 20 endpoints | **Yes** (Api / Application / Contracts / Domain / Infrastructure) | producer + consumer (9 topics — OCS heavy) | yes (`FalconChargingDB`) | yes (real-time charging events) | no |
| 4 | Provisioning (`Falcon.Provisioning.Api`) | 7163 | **Controllers** (2) | 6 endpoints | **Yes** (Api / Application / Contracts / Domain / Infrastructure) | none observed in appsettings | yes (`FalconProvisioningDB`) | no | no |
| 5 | Access / PES (`T2.PES.API`) | 5296 (http only) | Minimal API `app.MapPost/Get/Put/Delete` | 12 endpoints | **No** (T2.PES + T2.PES.API monoliths) | consumer (1 topic) | configurable (MongoDb or SqlServer) | no | no |
| 6 | Contact Group (`Falcon.ContactGroup.Api`) | 7300 | Minimal API via **FastEndpoints** + Mediator | 14 endpoints (incl. 2 internal) | **No** (single Api project, internal folders Domain / Application / Infrastructure) | producer + consumer (1 topic) | yes (`FalconContactGroupDb`) | yes | no |
| 7 | Templates (`Falcon.Templates.Api`) | 7264 | Minimal API via **FastEndpoints** + Mediator | 3 endpoints | **Yes** (Api / Application / Contracts / Domain / Infrastructure) | consumer (4 topics) | yes (`FalconTemplateDb`) | no | no |
| 8 | Core Gateway (`Falcon.Core.Gateway`) | 7038 | **YARP** + **FastEndpoints** aggregations | 3 aggregation endpoints + YARP pass-through | n/a (gateway) | consumer (1 topic — IP allowlist) | no | yes (IP allowlist cache) | no |
| 9 | System Gateway (`Falcon.System.Gateway`) | 7256 | **YARP** + **FastEndpoints** aggregations | 10 aggregation endpoints + YARP pass-through | n/a (gateway) | none observed | no | no | no |

**Totals:** 9 services scanned, ~125 backend endpoints catalogued (excluding YARP pass-through routes which are handled at the gateway layer — see `GATEWAY_ROUTE_MAP.md`).

## Communication Topology

```
┌──────────────────────┐         ┌────────────────────────────┐
│ Browser (Angular)    │────────▶│ Core Gateway (7038)        │ Client users
└──────────────────────┘         │ - YARP proxy               │
        │                        │ - Aggregation endpoints     │
        │                        │ - IP allowlist enforcement │
        │                        └─────────────┬──────────────┘
        │                                      │
        │                        ┌─────────────▼──────────────┐
        └───────────────────────▶│ System Gateway (7256)      │ Falcon admin users
                                 │ - YARP proxy               │
                                 │ - Aggregation endpoints     │
                                 │ - Testing Charging BFF      │
                                 └────┬───┬───┬───┬───┬───────┘
                                      │   │   │   │   │
                  ┌───────────────────┘   │   │   │   └─────────┐
                  ▼                       ▼   ▼   ▼             ▼
       ┌──────────────────┐  ┌──────────────────┐  ┌────────────────────┐
       │ Identity (7777)  │  │ Commerce (7045)  │  │ Charging (7224)    │
       │ FastEndpoints    │  │ Controllers      │  │ Controllers + OCS  │
       └─────────┬────────┘  └─────────┬────────┘  └──────────┬─────────┘
                 │                     │                       │
                 │ Kafka (Confluent + Avro + Schema Registry)  │
                 └──┬──────────────────┴─────────┬─────────────┘
                    ▼                            ▼
       ┌──────────────────────┐    ┌──────────────────────────┐
       │ Provisioning (7163)  │    │ Templates (7264)         │
       │ Controllers          │    │ FastEndpoints (consumer- │
       │                      │    │ heavy)                   │
       └──────────────────────┘    └──────────────────────────┘
                    
       ┌──────────────────────┐    ┌──────────────────────────┐
       │ Contact Group (7300) │    │ PES / Access (5296)      │
       │ FastEndpoints + S3   │    │ Minimal API + policy DB  │
       └──────────────────────┘    └──────────────────────────┘
```

## Conventions Observed

| Concern | Convention |
|---|---|
| Response wrapper | `ServiceOperationResult<T>` returned by **every** endpoint in **every** service. Three independent implementations (Identity has a record, Commerce/Charging/Provisioning each ship a struct in their Contracts project). |
| Auth | Zitadel-issued JWT Bearer tokens, `RoleClaimType: urn:zitadel:iam:org:project:roles`. Tenant id is read from the JWT for client users, from response bodies for Falcon admin users on the System Gateway side. |
| Error model | Throw `FalconException(FalconKeys.Error.<Code>)`. Each service ships its own `FalconKeys.Error` constants class — see `ERRORS.md` per service for the full registry. Commerce additionally decorates each code with `[ErrorHttpStatus(NNN)]` so the global middleware can map the code to an HTTP status. |
| Localization | Errors localized via a per-service `ErrorLocalizer` reading `Resources/ErrorMessages.en.resx` + `ErrorMessages.ar.resx`. Every service calls `app.ValidateResourceCompleteness()` (FastEndpoints) or `app.ValidateErrrosResourceCompleteness()` (controller services) on startup — fail-fast if any key is missing a translation. |
| Multi-language fields | `MultiLanguage { string En; string Ar; }` defined in Contracts. Commerce and Identity do **not** wrap user-facing names this way at the API layer (e.g. `CreateAccountRequest.Info.AccountName` is `string`) — see per-service `VALIDATIONS.md` for deviations. |
| Validators | FluentValidation — `AbstractValidator<T>` in Identity, `FastEndpoints.Validator<T>` in Contact Group / Templates / Identity FastEndpoints. Controller services (Commerce / Charging / Provisioning) use mixed strategy: `[Required]` DataAnnotations on DTOs + a custom `[ThrowIfNotPassed]` / `[ThrowIfMaxLengthExceed]` / `[ThrowIfNotEnumValue<T>]` attribute family in `Falcon.Commerce.Domain.Validations` (no FluentValidation observed). |
| Mediator | `IMediator` (the `Mediator` NuGet — *not* MediatR) used in Identity / Contact Group / Templates / Charging. Controllers (Commerce / Charging / Provisioning) inject handler interfaces directly (`IXxxHandler`) and call `.ExecuteAsync(...)` — no mediator dispatch. |
| Auto mapping | AutoMapper is used pervasively in the three controller-based services (Commerce / Charging / Provisioning) for `request → command` and `domain → response` translation. The FastEndpoints services prefer hand-written mappers in `Application/Mappers/`. |
| Logging | Serilog via `builder.Host.UseSerilog(...)` or `builder.AddSerilogLogging()` reading from `Serilog:*` config in appsettings. PES is the exception — uses `log4net`. |
| Swagger/OpenAPI | All controller services expose `/swagger` in Development. FastEndpoints services use the built-in `app.MapOpenApi()` (Identity launches `openapi/v1.json`). |
| Health checks | Every service registers `AddHealthChecks()` and exposes `/health` (FastEndpoints services use `MapHealthEndpoints()`). PES uses `pes/health`. |
| CORS | `Cors:AllowedOrigins` config section, defaulting to `http://localhost:4200`. All services consume the same configuration shape. |

## Hard Deviations / Anti-Patterns Flagged

| Service | Deviation | Where |
|---|---|---|
| All controller services | DTO names use suffix `Respose` (typo of `Response`) for provisioning DTOs — `GetAccountApplicationServiceRespose`, `GetAccountCommunicationChannelServiceRespose`. | Provisioning Contracts |
| Charging | `OcsChargeKinds.Usage` magic string and inconsistent default values (`"NONE"`, `"ANY"`) in `ReserveWalletChargeRequest`. | `ReserveWalletChargeRequest` |
| Commerce | Domain enums (`eCurrency`, `eWalletBalanceType`, `eWalletBaseType`, `ePricingType`, `eUserRoles`, `eClassificationCategory`...) are passed in requests as raw ints (e.g. `?currency=1`); no `EnumDataType` validation on `AccountHierarchyController.GetAccountHierarchy`. | `AccountHierarchyController` |
| Commerce | `NodeController` action `ChangeCommunicationChannelPriceType` is method-overloaded — two C# methods share the same name with different signatures, mapped to different routes (`/comm-channel/price-type` and `/application/price-type`). Reflection-based OpenAPI may emit one of them with `[FromBody]` collision. | `NodeController.cs:194,212` |
| PES | All endpoints use `Microsoft.AspNetCore.Mvc.FromBodyAttribute` on `Get` actions in two cases (`policyrulesBySub`, `policyrulesByFilter`) which is an HTTP anti-pattern (GET with body). | `Program.cs:175,179` |
| Provisioning | `appsettings.json` is nearly empty (only Serilog + Zitadel + Mongo). No Kafka config — implies Provisioning is read-only from the events perspective. | `appsettings.json` |
| Templates | Bulk-update endpoint `PUT /communication-channel-configs/{id}` runs items in a `foreach` with no transaction — partial-apply if any item fails. **Documented** in the endpoint summary, not a bug. | `UpdateCommunicationChannelConfigsEndpoint.cs:18-23` |

## File Layout Cheat-Sheet

Each Clean Architecture service follows:
```
falcon-<service>-svc/
  src/
    Falcon.<Service>.Api/            <- ASP.NET Core entry, Program.cs, Controllers/ or Endpoints/, Middlewares/
    Falcon.<Service>.Application/    <- Commands, Queries, Handlers, IInterfaces, Mappers
    Falcon.<Service>.Contracts/      <- Request/Response DTOs, ServiceOperationResult<T>, Enums consumed by clients
    Falcon.<Service>.Domain/         <- Entities, Constants (FalconKeys.cs), Validations attributes, Interfaces (domain-level)
    Falcon.<Service>.Infrastructure/ <- Persistence (Mongo), Messaging (Kafka), Auth (Zitadel), Seeding, Hangfire
  tests/
    Falcon.<Service>.Tests/
```

Identity, Contact Group and Access (PES) are **monolithic Api projects** — no Application/Contracts/Domain/Infrastructure project split — but folder structure inside the single Api project matches the same layering.
