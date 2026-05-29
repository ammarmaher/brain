# SecurityController — Endpoints

> Class route prefix: `/api/Security`. **No class-level `[Authorize]`**; the single endpoint uses `[AllowAnonymous]`.

## Read Endpoint

| Method | Route | Action | Request | Response (T in SOR) | Handler |
|---|---|---|---|---|---|
| GET | `/api/Security/ip-allowlists` | `GetAllIpAllowlists` | (none) | `GetAllIpAllowlistsResponse` | `IGetAllIpAllowlistsHandler.ExecuteAsync(new GetAllIpAllowlistsQuery())` |

### Source

[CODE] `SecurityController.cs:27-34`

```csharp
[HttpGet("ip-allowlists")]
[AllowAnonymous]
public async Task<ActionResult<ServiceOperationResult<GetAllIpAllowlistsResponse>>> GetAllIpAllowlists()
{
    var result = await _getAllIpAllowlistsHandler.ExecuteAsync(new GetAllIpAllowlistsQuery());
    var response = _mapper.Map<GetAllIpAllowlistsResponse>(result);
    return Ok(ServiceOperationResult<GetAllIpAllowlistsResponse>.Success(response));
}
```

### Request

No body, no params.

### PES Key

| Endpoint | Frontend PES | Backend Gate |
|---|---|---|
| `GET /api/Security/ip-allowlists` | N/A — **NOT a frontend endpoint** | `[AllowAnonymous]` — relies on network isolation |

This endpoint is **not exposed through the public Gateways**. It's an internal service-to-service contract between Commerce and the Core Gateway only.

### Status Codes

| Status | When |
|---|---|
| 200 | Success |
| 500 | Mongo unreachable |

(No 401 — endpoint is anonymous.)

### Default Sort / Order

Dictionary keyed by tenant `OwnerId` — order is dictionary iteration order, not deterministic.

## Endpoint Count by HTTP Verb

| Verb | Count |
|---|---:|
| GET | 1 |
| **Total** | **1** |
