# Access (PES) Service — Endpoint Registry

> Minimal API. All routes registered directly in `Program.cs:151-275`. No `/api/` prefix — uses `pes/` instead.

## Authorization / Advise Endpoints

| Method | Route | Handler | Request | Response |
|---|---|---|---|---|
| POST | `/pes/authorize` | `decisionPoint.Evaluate(authRequest)` | `AuthRequest` (body) | `AuthResponse` (likely `{ Allowed, Reason }` — verify in T2.PES) |
| POST | `/pes/authorize/resources` | `decisionPoint.Evaluate(authRequest)` (overload) | `AuthorizationsRequest` (body — likely a batch of `AuthRequest`) | `AuthorizationsResponse` |
| POST | `/pes/advise` | `advisor.Advise(authRequest)` | `AuthRequest` (body) | Advice response (rules + obligations) |

## Policy Rule Endpoints

| Method | Route | Handler | Request | Response |
|---|---|---|---|---|
| GET | `/pes/policyrule` | `policyDataSource.GetAll()` | (none) | `PolicyRule[]` |
| GET | `/pes/policyrulesBySub` | `policyDataSource.GetBySub(sub.ToLower())` | `string sub` **from body (sic — GET with body)** | `PolicyRule[]` |
| GET | `/pes/policyrulesByFilter` | `policyDataSource.GetByFilter(f)` | `PolicyFilter f` **from body** (Subject + Object lowered) | `PolicyRule[]` |
| GET | `/pes/policyrulesByObj` | `policyDataSource.GetByObj(obj.ToLower())` | `string obj` from query | `PolicyRule[]` |
| POST | `/pes/policyrule` | `policyDataSource.Add(policyRule)` | `List<PolicyRule>` (body) | (the persisted list) |
| DELETE | `/pes/policyrule` | `policyDataSource.Delete(deletePermissions.Permissions, deletePermissions.DeletedBy)` | `DeletePermission { Permissions[], DeletedBy }` (body) | (deletion result) |

## Role Endpoints

| Method | Route | Auth | Handler | Request | Response |
|---|---|---|---|---|---|
| GET | `/pes/roles?targetUserType=&tenantId=` | `RequireAuthorization()` | `rolesDataSource.GetAll(...)` (with `IAccessCurrentUser.TryResolveRoleCatalogRequest` for permission) | `targetUserType`, `tenantId` from query | `Role[]` (or `Forbidden`/`BadRequest`) |
| GET | `/pes/user/roles/{user}/{scope}` | `RequireAuthorization()` | `rolesDataSource.GetSubRolesByScope(user, scope.Replace(":","+"), visibility)` | route params | `Role[]` |
| DELETE | `/pes/user/roles/{user}/{scope}` | `RequireAuthorization()` | `rolesDataSource.DeleteSubRoleByScope(user, scope, auditActor, visibility)` | route params | (void — implicit 200) |
| PUT | `/pes/user/primary-role` | `RequireAuthorization()` | `rolesDataSource.SyncPrimaryRoleLink(instruction, auditActor)` (after `currentUser.TryResolvePrimaryRoleLinkInstruction`) | `PrimaryRoleLinkSyncRequest` | `PrimaryRoleLinkSyncResult` |
| POST | `/pes/roles/bootstrap/account/{tenantId}` | `RequireAuthorization(AuthorizationPolicies.SystemOnly)` | `builtInRoleProvisioner.EnsureAccountRoles(tenantId, auditActor)` | route param | (created role list) |

## Operational Endpoints

| Method | Route | Handler |
|---|---|---|
| POST | `/pes/garbage-collector/run` | Manual `GC.Collect()` + log memory before/after. **Dev/ops tooling.** |
| GET | `/pes/health` | `MapHealthChecks("pes/health")` (anonymous) |

## Notes

1. **GET with body** is used on `/pes/policyrulesBySub` and `/pes/policyrulesByFilter` — HTTP anti-pattern. Some HTTP clients strip the body of a GET request. Verify cleanup in the next iteration.
2. **`scope` parameter is escape-coded** — `:` in the route is replaced with `+` before lookup. This is a workaround for ASP.NET routing rejecting `:` in path segments. Frontend must already replace `:` with `+` when building URLs.
3. **`/pes/roles/bootstrap/account/{tenantId}`** requires the `SystemOnly` policy — likely for system bootstrapping; not a frontend concern.

## Endpoint Count

- GET: 5
- POST: 5
- PUT: 1
- DELETE: 2
- Total: **13** (including `/pes/health`)
