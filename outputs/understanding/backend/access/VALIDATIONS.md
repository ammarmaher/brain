# Access (PES) Service — Validations

## DTO-Level Validation

None observed. `Program.cs` binds DTOs via `[FromBody]` / `[FromQuery]` / `[FromRoute]` and trusts the JSON deserializer to produce a valid `AuthRequest` / `PolicyFilter` / `PolicyRule` / `DeletePermission` / `PrimaryRoleLinkSyncRequest`. Malformed JSON produces framework-level 400.

## Authorization-Side Validation

The most interesting validation gates are inside the endpoint handlers:

| Endpoint | Validation |
|---|---|
| `GET /pes/roles` | `currentUser.TryResolveRoleCatalogRequest(targetUserType, tenantId, out request, out error, out forbidden)` — returns `Results.BadRequest({ error })` on validation fail, `Results.Forbid()` on auth fail |
| `PUT /pes/user/primary-role` | `currentUser.TryResolvePrimaryRoleLinkInstruction(request, out instruction, out error, out forbidden)` — same pattern |
| `POST /pes/roles/bootstrap/account/{tenantId}` | `RequireAuthorization(AuthorizationPolicies.SystemOnly)` — only system bootstrap callers |

## Policy Policy

Policies registered by `AddPesAuthorization()`:
- `AuthorizationPolicies.SystemOnly` — system bootstrapping caller

Other endpoints just call `.RequireAuthorization()` without a policy, which is the framework's "any authenticated user".

## No `FalconException` Throwing

PES does not use the `FalconException` + `FalconKeys.Error` family. It returns `IResult`-based responses:

```csharp
return forbidden
    ? Results.Forbid()
    : Results.BadRequest(new { error });
```

This is a deviation from the platform standard but acceptable for a legacy service.

## CORS

`AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()` registered as `allowAll` policy and applied via `app.UseCors("allowAll")`. **Permissive** — appropriate for an internal-only service, but if PES becomes externally reachable this needs tightening.

## Audit

`IAccessCurrentUser.GetAuditActor()` and `IAccessCurrentUser.GetRoleVisibility()` are used to attach audit metadata to mutations. Auditing happens inside the data-source repositories.

## Data Store Migration

On startup:
- Mongo path: `MongoIndexInitializer.EnsureIndexesAsync()`
- SQL path: `context.Database.Migrate()` — runs any pending EF Core migrations

Both paths bootstrap built-in system roles and per-account roles via `IBuiltInRoleProvisioner`. If this step fails, the service won't start.

## Multi-Language

n/a. PES is a decision service, not user-facing.

## ServiceOperationResult Wrapper

**Deviation** — not used. Responses are raw objects (`PolicyRule[]`, `Role[]`, `AuthResponse`, etc.) or `IResult` problem details.
