# Templates Service — Frontend Contract

## Base URLs

| Environment | Direct | Via Gateways? |
|---|---|---|
| Local dev | `https://localhost:7264/api` | **Not currently exposed through either gateway** |

The `Falcon.Core.Gateway` and `Falcon.System.Gateway` route maps in `appsettings.json` **do not** list a `templates-cluster`. Templates is reachable only **directly** at `localhost:7264` (or its deployed equivalent) in this scan.

The frontend likely currently does not consume Templates — verify before integrating. If Templates is intended to be public, the gateway route maps must be updated.

## Authentication

`Authorization: Bearer <zitadel-jwt>` on all three endpoints. `RequireAuthorization()` at group level.

## Response Wrapper

`ServiceOperationResult<T>` with camelCase JSON.

## Frontend Flow: Configure Approval Workflow

```typescript
// 1) Read current config per tenant
const configs = await api.get('/api/communication-channel-configs?TenantId=tenant-1');
// → { isSuccessful, result: [CommunicationChannelConfigDto, ...], errorMessages }

// 2) For each channel, render the body type + checker level UI
// 3) When user assigns a checker, look up who's eligible:
const eligible = await api.get('/api/communication-channel-configs/user-checker-levels?UserId=user-9&TenantId=tenant-1');
// → { isSuccessful, result: [{ levelNumber, ... }, ...] }

// 4) Save the bulk update
await api.put(`/api/communication-channel-configs/${tenantId}`, {
  configs: [
    { id: 'cfg-1', bodyType: 'Restricted', levelsCount: 2, checkerLevels: [
      { levelNumber: 1, users: [{ userId: 'u1' }, { userId: 'u2' }] },
      { levelNumber: 2, users: [{ userId: 'u3' }] }
    ]},
    // ...
  ]
});
// → 200 { isSuccessful, result: [UpdateCommunicationChannelConfigResponse, ...] }
// OR 400 with the first failing code if a config fails business rules — earlier items stay committed
```

## Important: Tenant ID on PUT

The bulk update endpoint uses route `{id}` as the tenant id **only for Falcon admins** (`ICurrentUser.IsFalconUser == true`). For client users, the route id is **ignored** and the tenant id from the JWT is used. Frontend impact:
- Client UI: pass any `id` value (e.g. the user's own tenant id, but it doesn't matter)
- Falcon admin UI: pass the **target tenant id** explicitly

This is awkward — consider exposing two different routes (`/admin/communication-channel-configs/{tenantId}` and `/communication-channel-configs/me`) in a future refactor.

## Bulk Failure Semantics

Bulk updates are **non-transactional**. If item N fails, items 1..N-1 stay committed. Frontend should:
1. Re-fetch the config after a partial failure to see the actual state
2. Re-display the failing item with its error for the user to correct
3. Resubmit only the unprocessed + corrected items

Use `RuleLevelCascadeMode = Stop` semantics in the validator — frontend gets exactly one error per failing item.

## Pagination

None — config lists are returned in full.

## Status Codes

| Status | Cause |
|---|---|
| 200 | OK |
| 400 | Validation, business rule violation |
| 401 | No JWT |
| 404 | Config id unknown (per item in bulk) |
| 500 | Internal error |

## Multi-Language

No multi-language fields on Templates DTOs.

## CORS

Templates `appsettings.json` is missing the standard `Cors` section. Verify before exposing publicly.

## OpenAPI / Swagger

In dev: `https://localhost:7264/openapi/v1.json`.

## Deviations

| Standard | Status |
|---|---|
| `ServiceOperationResult<T>` | Conformant |
| camelCase JSON | Conformant (explicit) |
| Gateway exposure | **Not exposed** — verify whether intentional |
| MultiLanguage | Not used |
