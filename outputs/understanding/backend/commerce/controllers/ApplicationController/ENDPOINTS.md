# ApplicationController — Endpoints

> Class route prefix: `/api/Application` ([CODE] `ApplicationController.cs:10`). Inherits `[Authorize]` from class.

## Read Endpoints

| Method | Route | Action | Request | Response (T in SOR) | Handler |
|---|---|---|---|---|---|
| GET | `/api/Application` | `Get` | (no params) | `List<ApplicationResponse>` | `IListApplicationsHandler.ExecuteAsync()` |

### Source

[CODE] `ApplicationController.cs:24-30`

```csharp
[HttpGet]
public async Task<ActionResult<ServiceOperationResult<List<ApplicationResponse>>>> Get()
{
    var result = await _listApplicationsHandle.ExecuteAsync();
    return Ok(ServiceOperationResult<List<ApplicationResponse>>.Success(
        _mapper.Map<List<ApplicationResponse>>(result.Applications)));
}
```

### Request

No body, no query parameters, no route parameters.

### PES Key

| Endpoint | Frontend PES | Backend Gate |
|---|---|---|
| `GET /api/Application` | `falconAccess.adminConsole.applications.view` (inferred — verify) | `[Authorize]` only — any JWT |

### Status Codes

| Status | When |
|---|---|
| 200 | Success — `ServiceOperationResult<List<ApplicationResponse>>` (empty array if none) |
| 401 | No / invalid JWT |
| 500 | Mongo / translation failure |

### Default Sort / Order

[CODE] `ListApplicationsHandler.cs:22-29`: no explicit `.OrderBy(...)`. Mongo natural order is returned — may be insertion order or shard-dependent. **Drift candidate** — if PRD requires alphabetic order, this is a gap.

## Endpoint Count by HTTP Verb

| Verb | Count |
|---|---:|
| GET | 1 |
| **Total** | **1** |
