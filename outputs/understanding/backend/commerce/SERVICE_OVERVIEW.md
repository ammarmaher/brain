# Commerce Service — Overview

> Service: `Falcon.Commerce.Api`
> Repository: `C:\Falcon\Falcon\falcon-core-commerce-svc`
> Solution: `Falcon.Commerce.slnx`

## Purpose

The platform's account, contract, hierarchy, and pricing service. Owns:
- **Account hierarchy** (organizations, nodes, sub-nodes)
- **Service catalog** (Applications + Communication Channels and their visibility/pricing per account)
- **Contracts** (rate plans, quotas, unit conversions, overage rates)
- **Tenant settings** (password policy, wallet config, IP allowlist source-of-truth — the gateway *enforces* it, Commerce *owns* it)
- **Orchestration of cross-service workflows** via Kafka (UserCreationRequested → Identity; WalletConfigured → Charging; ContractLifecycle → Charging; ServiceOrderCreated → Charging payment)

## Project Layout

Clean Architecture (Wiki-compliant):

```
src/
  Falcon.Commerce.Api/             <- ASP.NET Core entry, Controllers/ (10), Middlewares/, Mappings/, Localization/
  Falcon.Commerce.Application/     <- Commands, Queries, Interfaces/Services/Handlers, Interfaces/Services/Processes,
                                       DTOs, Mappers (AutoMapper profiles), Events, Services/Handlers, Testing/
  Falcon.Commerce.Contracts/       <- Public DTOs (RequestsDtos/, ResponseDtos/), ServiceOperationResult<T>, Hook<T>, MultiLanguage
  Falcon.Commerce.Domain/          <- Entities, Constants (FalconKeys + ErrorHttpStatus attribute), Validations attrs, Interfaces
  Falcon.Commerce.Infrastructure/  <- Persistence (Mongo + Hangfire), Messaging (Kafka producers + consumers), Auth (Zitadel),
                                       Seeding, Configurations
tests/Falcon.Commerce.Tests/       <- xUnit
```

## Framework & Style

- **.NET 10**
- **Controllers** (10 controllers, 42 endpoints) using ASP.NET MVC attribute routing — `[Route("api/[controller]")]`, `[ApiController]`, `[Authorize]`
- AutoMapper for request → command and domain → response translation
- Hand-written `CreateMainNodeProcess` / `CreateFalconServiceOrderHandler` orchestrators (Application services pattern)
- Hangfire (optional, gated by `Settings:Hangfire:Enabled`) for background jobs (contract lifecycle worker, etc.)

## Key NuGet Packages (from Program.cs imports)

- `Microsoft.AspNetCore.OpenApi` (`Microsoft.OpenApi`)
- `AutoMapper` — request/command/response mapping
- `Serilog` — logging
- `MongoDB.Driver` — persistence
- `Confluent.Kafka` + `Confluent.SchemaRegistry.Serdes.Avro` — event bus
- `Hangfire` (conditional) — background jobs

## Ports

| Profile | URL |
|---|---|
| http | `http://localhost:7045` |
| https | `https://localhost:7045;http://localhost:7045` (same port both schemes — unusual) |

## Endpoint Surface

10 controllers, 42 HTTP endpoints. Largest controllers:

| Controller | Endpoints | Drilled? |
|---|---:|:---:|
| `NodeController` | 26 | **yes — see `controllers/NodeController/`** |
| `ContractsController` | 4 | no |
| `SettingController` | 4 | no |
| `InformationController` | 2 | no |
| `AccountHierarchyController` | 1 | no |
| `ApplicationController` | 1 | no |
| `CommunicationChannelController` | 1 | no |
| `LookupController` | 1 | no |
| `SecurityController` | 1 (east-west, **AllowAnonymous**) | no |
| `TestingAccountsController` | 1 (gated by feature flag) | no |

See [`ENDPOINT_REGISTRY.md`](ENDPOINT_REGISTRY.md) for the full table.

## Kafka

| Direction | Topic | Producer/Consumer | Purpose |
|---|---|---|---|
| produce | `commerce.user-wallet-create.v1` | `UserCreatedEventPublisher` | Tell Charging to create a user wallet |
| produce | `commerce.subnode-wallet-create.v1` | `SubNodeCreatedEventPublisher` | Tell Charging to create a sub-node wallet |
| produce | `commerce.comm-channel-shown.v1` | `CommChannelShownEventPublisher` | Tell Charging a comm channel was made visible |
| produce | `commerce.order-created.v1` | `FalconServiceOrderCreatedEventPublisher` | Order created — Charging picks up payment processing |
| produce | `commerce.wallet-configured.v1` | `WalletConfiguredEventPublisher` | Wallet settings configured for an account |
| produce | `commerce.contract-lifecycle.v1` | `ContractActivatedEventPublisher`, `ContractExpiredEventPublisher` | Contract activated / expired |
| produce | `commerce.user-creation-requested.v1` | `UserCreationRequestedEventPublisher` | Tell Identity to provision a user |
| produce | `commerce.identity-settings-sync.v1` | `TenantIdentitySettingsSyncEventPublisher` | Tell Identity (and others) tenant identity settings changed |
| produce | `commerce.tenant-ip-allowlist-changed.v1` | `TenantIpAllowlistChangedEventPublisher` | Tell Core Gateway to refresh IP allowlist |
| consume | `charging.order-payment-processed.v1` | `FalconServiceOrderPaymentProcessedEventConsumer` | Charging finished processing payment — Commerce updates order status |
| consume | `commerce.test-event` | (test) | Dev-only verification |

Consumer group: `commerce-service`. Schema Registry: Avro + BACKWARD compatibility.

## MongoDB

- Database: **`FalconCommerceDB`**
- Aggregator: `NodeAggregator.cs` (custom Mongo aggregation pipelines)
- Common patterns: `MongoRepository.cs` base class in `Infrastructure/Persistence/Repositories/`

## Other Infrastructure

- **Redis** (`Settings:Redis:ConnectionString`, `InstanceName: FalconCommerce_`) — distributed cache
- **FileStorage** (`PhysicalPath`, `VirtualPath`) — for uploaded profile pictures and account icons
- **Image Constraints** (`MaxSizeKB: 1024`, `AllowedExtensions: jpg, png, webp, jpeg, gif, bmp, x-icon`) — enforced on `CreateAccountRequest.Info.ProfilePictureInfo`
- **Hangfire** (`Settings:Hangfire:Enabled`) — periodic jobs
- **HTTP Clients** (`ServicesClients:Provisioning`, `ServicesClients:Identity`) — for east-west HTTP calls

## Startup Flow (`Program.cs`)

```csharp
builder.Services.AddControllers();
builder.Services.AddSwaggerGen(...);     // includes BearerAuth security
builder.Services.AddCors(...);           // allowedOrigins from config
builder.Services.RegisterFalconDependencies(builder.Configuration);  // Application + Infrastructure layers
// ...
app.ValidateErrrosResourceCompleteness();  // sic — typo in method name
app.UseHttpsRedirection();
app.UseCors();
if (settings.Hangfire.Enabled) app.UseFalconHangfire(builder.Configuration);
app.UseAuthentication();
app.UseAuthorization();
app.UseFalconMiddlewares();              // exception → ServiceOperationResult mapping
app.MapHealthChecks("/health").AllowAnonymous();
app.MapControllers();
```
