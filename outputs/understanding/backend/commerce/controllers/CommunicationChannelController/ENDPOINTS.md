# CommunicationChannelController — Endpoints

> Class route prefix: `/api/CommunicationChannel` ([CODE] `CommunicationChannelController.cs:10`). Inherits `[Authorize]` from class.

## Read Endpoints

| Method | Route | Action | Request | Response (T in SOR) | Handler |
|---|---|---|---|---|---|
| GET | `/api/CommunicationChannel` | `Get` | (no params) | `List<CommunicationChannelResponse>` | `IListCommunicationChannelHandler.ExecuteAsync()` |

### Source

[CODE] `CommunicationChannelController.cs:24-30`

```csharp
[HttpGet]
public async Task<ActionResult<ServiceOperationResult<List<CommunicationChannelResponse>>>> Get()
{
    var channels = await _listCommunicationChannelHandler.ExecuteAsync();
    return Ok(ServiceOperationResult<List<CommunicationChannelResponse>>.Success(
        _mapper.Map<List<CommunicationChannelResponse>>(channels.CommunicationChannels)));
}
```

### Request

No body, no query parameters, no route parameters.

### PES Key

| Endpoint | Frontend PES | Backend Gate |
|---|---|---|
| `GET /api/CommunicationChannel` | `falconAccess.adminConsole.communicationChannels.view` (inferred — verify) | `[Authorize]` only — any JWT |

### Status Codes

| Status | When |
|---|---|
| 200 | Success — `ServiceOperationResult<List<CommunicationChannelResponse>>` (empty array if none) |
| 401 | No / invalid JWT |
| 500 | Mongo / translation failure |

### Default Sort / Order

[CODE] `ListCommunicationChannelHandler.cs:22-29`: no explicit `.OrderBy(...)`. Mongo natural order returned.

## Endpoint Count by HTTP Verb

| Verb | Count |
|---|---:|
| GET | 1 |
| **Total** | **1** |
