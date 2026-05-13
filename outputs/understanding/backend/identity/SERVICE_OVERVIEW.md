# Identity Service — Overview

> Service: `Falcon.Identity.Api`
> Repository: `C:\Falcon\Falcon\falcon-core-identity-svc`
> Solution: `Falcon.Identity.sln`

## Purpose

Owns the **complete user lifecycle**: authentication (login, OTP, refresh tokens), password management, user CRUD, email/phone verification, role assignment, IP allowlist enforcement, and Zitadel integration (auth provider, user backend). Per Falcon Wiki: *"Identity Service owns user lifecycle — NOT Commerce, NOT Zitadel directly."*

## Project Layout

Single-project layout (monolithic Api project) — Clean Architecture layering exists at the folder level inside `Falcon.Identity.Api/`:

```
Falcon.Identity.Api.csproj
├── Application/          <- Commands, Queries, Models (DTOs), Mappers, Policies, Auth, Users, Security
├── Domain/               <- Constants (FalconKeys), Exceptions, Policies (business rules)
├── Endpoints/            <- FastEndpoints handlers: Auth/, Users/, Security/, Webhooks/
├── Infrastructure/       <- Persistence (Mongo), Messaging (Kafka), Identity (Zitadel adapters), Seeding, Security
└── Startup/              <- Extensions, ExceptionHandlers, Localization (ErrorLocalizer)

tests/Falcon.Identity.Tests/    <- xUnit, ~340 tests
```

## Framework & Style

- **.NET 10** (target framework from csproj)
- **Minimal API** via **FastEndpoints** (v6.x) + Mediator (`IMediator` from the Mediator NuGet) for command/query dispatch
- Endpoint route prefix: `/api`
- All endpoints inherit from `Endpoint<TRequest, TResponse>` or `EndpointWithoutRequest<TResponse>`; grouped via `Group<TGroup>()` (`AuthEndpointGroup`, `UserEndpointGroup`, `SecurityEndpointGroup`, `WebhookEndpointGroup`)
- Validation: FluentValidation (`AbstractValidator<T>`) auto-discovered by FastEndpoints; failures funneled through a custom `ErrorLocalizer.Localize(...)` → `ServiceOperationResult<object>.Failure(errors)` with HTTP 400

## Key NuGet Packages (from Program.cs imports)

- `FastEndpoints` — endpoint framework
- `Mediator` (Martin Othamar) — source-generated mediator
- `FluentValidation` — validators
- `Serilog` — logging
- `MongoDB.Driver` — persistence
- `Microsoft.Extensions.Caching.Hybrid` (`HybridCache`) — user-status cache
- Zitadel REST + management SDK adapters under `Infrastructure/Identity`

## Ports

| Profile | URL |
|---|---|
| http | `http://localhost:7777` |
| https | `https://localhost:7777` |

`launchSettings.json` only configures `7777` for both http and https (uses the same port). Container profile maps to 8080/8081.

## Endpoint Surface

- **0 controllers**
- **26 user-facing endpoints + 1 Zitadel webhook + 1 east-west user-status endpoint** (FastEndpoints)
- Route prefix: `/api/`
- Groups:
  - `AuthEndpointGroup` → `/api/auth/*` (all `AllowAnonymous`, IP-allowlist-gated, throttled 5–20 per 60s)
  - `UserEndpointGroup` → `/api/user/*` (auth-required by default; `generate-password` is anonymous)
  - `SecurityEndpointGroup` → `/api/security/*` (anonymous, east-west status checks)
  - `WebhookEndpointGroup` → `/api/webhook/*` (anonymous + `x-zitadel-signature` HMAC verification)

See [`ENDPOINT_REGISTRY.md`](ENDPOINT_REGISTRY.md) for the full route table.

## Kafka

| Direction | Topic | Producer/Consumer | Purpose |
|---|---|---|---|
| consume | `commerce.user-created.v1` | `UserCreationRequestedConsumer` | Commerce-triggered user creation (east-west) |
| consume | `commerce.identity-settings-sync.v1` | `IdentitySettingsSyncConsumer` | Sync tenant settings (password policy, login policy) from Commerce |
| produce | `identity.user-events.v1` | `UserRoleLinkSyncRequestedEventPublisher` | Notify PES / Charging of user/role linkage changes |

Consumer group: `falcon-identity-svc`. Security protocol: `Plaintext` (Avro + Schema Registry).

## MongoDB

- Database: **`FalconIdentityDb`**
- Collections (inferred from `IRepository<T>` calls): `Users`, `AuditLog` (via `MongoAuditLogger`)
- Index init on startup via seeded indexes

## Other Infrastructure

- **Redis** (`Settings:Redis:ConnectionString`) — used by `HybridCache` for `CacheKeys.UserStatus(identityUserId)` cache invalidated on Zitadel webhook
- **Zitadel** (`Zitadel:*` config) — auth provider, user backend; signed webhook callbacks; OTP/TOTP registration; password/login policy management; session listing
- **SMTP / SMS** — email + OTP delivery via configurable providers (`Smtp:*`, `Sms:*` — RiCH provider in default config)
- **Field Encryption** (`FieldEncryption:Key`) — sensitive fields encrypted at rest

## Startup Flow (`Program.cs`)

```csharp
builder.AddSerilogLogging();
builder.Services.AddApiServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration, builder.Environment);
builder.Services.AddFastEndpoints();

app.UseMiddlewarePipeline();
app.UseFastEndpoints(c => {
    c.Endpoints.RoutePrefix = "api";
    c.Serializer.Options.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
    c.Errors.ResponseBuilder = (failures, ctx, statusCode) => {
        var localizer = ctx.RequestServices.GetRequiredService<ErrorLocalizer>();
        var errors = failures.Select(f => localizer.Localize(f.ErrorMessage)).ToList();
        return ServiceOperationResult<object>.Failure(errors);
    };
    c.Errors.StatusCode = StatusCodes.Status400BadRequest;
});
app.MapHealthEndpoints();
await app.Services.SeedAsync();
await app.ConfigureZitadelOnStartup();   // Bootstraps Zitadel organization, project, system user on first run
await app.RunAsync();
```
