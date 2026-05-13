# Access (PES) Service — Overview

> Service: `T2.PES.API`
> Repository: `C:\Falcon\Falcon\falcon-core-access-svc`
> Solution: `t2.PES.sln`

## Purpose

**Policy Enforcement System (PES)** — the platform's authorization decision point. Owns:
- **Policy rules** (CRUD over fine-grained access rules)
- **Roles** (system roles + per-account roles, with subject/scope/role linkage)
- **Authorization decisions** (`Evaluate(AuthRequest) → AuthResponse`)
- **Authorization advice** (`Advise(AuthRequest)` — like Evaluate but returns the matching rules + obligations rather than just allow/deny)
- **Built-in role provisioning** at startup (`EnsureSystemRoles`, `EnsureAllExistingAccountRoles`)
- **Garbage collector** trigger endpoint (manual `GC.Collect()` invocation)

The service is the **odd one out** in the platform — it's a Falcon legacy component (`T2.PES.*` namespace, `t2.PES.sln` solution) being kept alive while a replacement is built. Wiki notes call it "Permissions & Authorization Module (Policy-Based Access Control)".

## Project Layout

```
src/
  T2.PES.API/                          <- Minimal API entry (Program.cs), Auth/, Messaging/ (Avro consumer)
  T2.PES/                              <- Authorization, ExpressionEvaluation, PolicyDataSource (Mongo + EF),
                                            DecisionPoint, Advisor, Matcher, Effect, RoleProvisioner
  T2.PES.Test/                         <- xUnit (UserRoleLinkSyncRequestedConsumer test)
```

Note the **flat T2.PES library** structure — not Clean Architecture. Single library project with sub-folders for different concerns.

## Framework & Style

- **.NET 10** (likely; verify in csproj)
- **Minimal API** — endpoints registered directly with `app.MapGet/Post/Put/Delete` (no controllers, no FastEndpoints)
- **Dual data store** support — runtime-switchable between SQL Server (EF Core, `AuthorizationContext`) and MongoDB based on `DataStore:Provider` config (`MongoDb` or `SqlServer`). Local dev defaults to SqlServer.
- log4net for logging (everyone else uses Serilog) — flagged
- Confluent.Kafka + Confluent.SchemaRegistry.Serdes (Avro) for the consumer

## Ports

| Profile | URL |
|---|---|
| http | `http://localhost:5296` (only http — no https profile observed) |

`appsettings.json` also defines `Kestrel:Endpoints:Http:Url = http://0.0.0.0:5296`.

## Endpoint Surface

12 endpoints, all Minimal API, all under no consistent route prefix (no `/api` prefix). Route names are camelCased verbs (`getPolicyRules`, `addPolicyRule`, etc.) — set via `.WithName(...)`.

See [`ENDPOINT_REGISTRY.md`](ENDPOINT_REGISTRY.md) for the full table.

## Kafka

| Direction | Topic | Producer/Consumer | Purpose |
|---|---|---|---|
| consume | `identity.user-events.v1` | `UserRoleLinkSyncRequestedConsumer` | Identity-triggered user/role link sync (cleanup on user deletion, role changes, etc.) |

Consumer group: `falcon-pes-svc`. Security protocol: `Plaintext`. Avro deserialization.

## Persistence

**MongoDB path** (default in `appsettings.qc.json`):
- Database: **`PES`** (configurable)
- Collections: `PolicyRules`, `DeletedPolicyRules`, `Roles`
- Index init on startup: `MongoIndexInitializer.EnsureIndexesAsync()`

**SQL Server path** (default in `appsettings.json`):
- Connection string under `ConnectionStrings:Default`
- `AuthorizationContext` (EF Core DbContext)
- `Database.Migrate()` on startup

## Authentication

`AddPesAuthentication(configuration)` — likely reads `AuthServer:Authority` (Zitadel) and configures JWT Bearer validation. Uses the same `RoleClaimType: urn:zitadel:iam:org:project:roles` as the rest of the platform.

`AddPesAuthorization()` — defines a `SystemOnly` policy (referenced by `pes/roles/bootstrap/account/{tenantId}` endpoint).

## Startup Flow (`Program.cs` — 277 lines, the most complex)

```csharp
builder.Configuration
  .AddJsonFile("config/appsettings.json", ...)
  .AddJsonFile("config/appsettings.{env}.json", ...);
builder.Services.AddPesAuthentication(...);
builder.Services.AddPesAuthorization();
builder.Services.AddHealthChecks();
builder.Services.AddScoped<IPolicyDataSource, PolicyDbDataSource>();
builder.Services.AddScoped<IRoleDataSource, RoleDbDataSource>();
builder.Services.AddTransient<...>();  // regex/expression/matcher/effect/advisor chain
builder.Services.Configure<KafkaOptions>(...);
builder.Services.AddSingleton<ISchemaRegistryClient>(...);
builder.Services.AddSingleton<IConsumer<...>>(...);
builder.Services.AddHostedService<UserRoleLinkSyncRequestedConsumer>();

if (Provider == MongoDb) {
    builder.Services.AddSingleton<IMongoClient>(...);
    builder.Services.AddScoped<I{Policy,DeletedPolicy,Role}Repository, Mongo*Repository>();
}
else {
    builder.Services.AddDbContext<AuthorizationContext>(...);
    builder.Services.AddScoped<I{Policy,DeletedPolicy,Role}Repository, *Repository>();
}

var app = builder.Build();
app.UseCors("allowAll");  // allows anyone — unusual for a security-critical service
app.UseAuthentication();
app.UseAuthorization();
app.MapHealthChecks("pes/health");

// Startup-time data prep
using (var scope = app.Services.CreateScope()) {
    if (Mongo) await EnsureIndexesAsync();
    else context.Database.Migrate();
    await builtInRoleProvisioner.EnsureSystemRoles("system-bootstrap");
    await builtInRoleProvisioner.EnsureAllExistingAccountRoles("system-bootstrap");
}

app.MapPost(...); app.MapGet(...); // 12 endpoints, all listed below
app.Run();
```

## Deviations

| From Standard | Status |
|---|---|
| `ServiceOperationResult<T>` wrapper | **Deviation** — PES endpoints return raw domain objects (`PolicyRule[]`, `Role[]`) or `IResult` (problem details). No `ServiceOperationResult<T>` wrapper. |
| Serilog | **Deviation** — uses `log4net` |
| Route prefix `/api/` | **Deviation** — uses `pes/` prefix without `/api/` |
| Clean Architecture | **Deviation** — flat structure |
| FalconException + FalconKeys | **Deviation** — no `FalconException` thrown; PES uses raw `Results.BadRequest`, `Results.Forbid`, `Results.Ok` |
| Multi-language | n/a — PES is a low-level decision service, not user-facing |
