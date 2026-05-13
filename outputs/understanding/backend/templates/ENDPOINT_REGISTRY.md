# Templates Service — Endpoint Registry

> Route prefix: `/api`. Single group: `CommunicationChannelConfigEndpointGroup` → `/api/communication-channel-configs/*`. All endpoints inherit `RequireAuthorization()` from the group.

## CommunicationChannelConfigEndpointGroup

| Method | Route | Handler | Request | Response (T in SOR) | Auth | OpenAPI Status Codes |
|---|---|---|---|---|---|---|
| GET | `/api/communication-channel-configs?TenantId=` | `GetCommunicationChannelConfigsEndpoint` | `GetCommunicationChannelConfigsRequest { TenantId }` (query) | `List<CommunicationChannelConfigDto>` | (group) | 200, 400, 401 |
| GET | `/api/communication-channel-configs/user-checker-levels?UserId=&TenantId=` | `GetUserCheckerLevelsEndpoint` | `GetUserCheckerLevelsRequest { UserId, TenantId }` (query) | `List<UserCheckerLevelDto>` | (group) | 200, 400, 401 |
| PUT | `/api/communication-channel-configs/{id}` | `UpdateCommunicationChannelConfigsEndpoint` | `UpdateCommunicationChannelConfigsRequest { List<UpdateCommunicationChannelConfigItem> Configs }` (body) + route `id` | `List<UpdateCommunicationChannelConfigResponse>` | (group) | 200, 400, 401, 404 |

## Health

| Method | Route |
|---|---|
| GET | `/health` (`MapHealthEndpoints()`, anonymous) |

## Endpoint Count

3 (+ 1 health) — the smallest service in the platform.

## Tenant Resolution on PUT

The bulk-update endpoint pulls the tenant id from one of two places depending on caller type:

```csharp
var tenantId = currentUser.IsFalconUser
    ? Route<string>("id")!     // Falcon callers: tenant id comes from the route
    : currentUser.TenantId;     // Client callers: tenant id comes from JWT
```

For Falcon admins (via System Gateway), the route `id` parameter IS the tenant id. For client users (via Core Gateway), the route `id` is **ignored** and the JWT tenant claim is used. Frontend implementations must pass the right value depending on which gateway they're using — but in practice client users can just pass any id (e.g. their own tenant id, or a dummy) because it's ignored.

## Bulk Update Semantics

`UpdateCommunicationChannelConfigsRequest.Configs` is processed in a `foreach` with **fail-fast** semantics — the first item that fails business validation aborts the bulk call. Items already applied **stay committed** (no transactional rollback). The endpoint documentation explicitly calls this out as intentional.

The response is a `List<UpdateCommunicationChannelConfigResponse>` with one entry per **successfully** applied item up to the failure point.
