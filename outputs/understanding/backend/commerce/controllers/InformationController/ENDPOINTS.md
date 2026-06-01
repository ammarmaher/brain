# InformationController — Endpoints

> Class route prefix: `/api/Information` ([CODE] `InformationController.cs:13`). **No class-level `[Authorize]`**.

## Read Endpoint

| Method | Route | Action | Request | Response (T in SOR) | Handler |
|---|---|---|---|---|---|
| GET | `/api/Information?NodeId=` | `Get` | (query `NodeId?`) | `GetMainNodeInfoResponse` | `IGetMainNodeInfoHandler.ExecuteAsync(new GetMainNodeInfoQuery(NodeId))` |

### Source

[CODE] `InformationController.cs:30-36`

```csharp
[HttpGet]
public async Task<ActionResult> Get(string? NodeId)
{
    var result = await _getMainNodeInfoHandler.ExecuteAsync(new GetMainNodeInfoQuery(NodeId));
    return Ok(ServiceOperationResult<GetMainNodeInfoResponse>.Success(
        _mapper.Map<GetMainNodeInfoResponse>(result)));
}
```

- `NodeId` is **nullable** — but the handler filters by `x.Id == query.NodeId && x.NodeType == eNodeType.Main`. With `NodeId == null` the filter becomes `x.Id == null && x.NodeType == Main` → no node matches → returns `null` → AutoMapper produces an empty response

## Mutation Endpoint

| Method | Route | Action | Request | Response (T) | Handler |
|---|---|---|---|---|---|
| PUT | `/api/Information` | `Update` | `UpdateMainNodeInfoRequest` | `UpdateMainNodeInfoResponse` | `IUpdateMainNodeInfoHandler` |

### Source

[CODE] `InformationController.cs:38-44`

```csharp
[HttpPut]
public async Task<ActionResult> Update(UpdateMainNodeInfoRequest request)
{
    var result = await _updateMainNodeInfoHandler.ExecuteAsync(_mapper.Map<UpdateMainNodeInfoCommand>(request));
    return Ok(ServiceOperationResult<UpdateMainNodeInfoResponse>.Success(
        _mapper.Map<UpdateMainNodeInfoResponse>(result)));
}
```

- Body: `UpdateMainNodeInfoRequest` (see DTOS.md for ~18 fields)
- Falcon vs Client field-level branching happens **inside** the handler — Client can still send the full request but `AccountName` / `FinanceId` writes are dropped silently

## PES Keys

| Endpoint | Frontend PES | Backend Gate |
|---|---|---|
| `GET /api/Information` | `falconAccess.adminConsole.accountInfo.view` (inferred) | None — any JWT |
| `PUT /api/Information` | `falconAccess.adminConsole.accountInfo.edit` (inferred) | Handler `[FalconOnly]` for AccountName + FinanceId (silently dropped for Client) |

**Drift:** Two distinct PES keys would be more correct — one for Falcon-only fields (AccountName, FinanceId) and one for shared fields (address, profile picture, etc.). Currently there is no FE PES-level distinction. F-021 candidate.

## Status Codes

| Endpoint | Possible Codes |
|---|---|
| `GET /api/Information` | 200 (with empty body if NodeId null/unmatched), 401, 500 |
| `PUT /api/Information` | 200, 400 (`UpdateRequestCantBeNull`), 401, 404 (`NodeNotFound`), 409 (`DuplicateTenantName` for Falcon), 500 |

[CODE] `UpdateMainNodeInfoHandler.cs:31, 45, 115`.

## Endpoint Count by HTTP Verb

| Verb | Count |
|---|---:|
| GET | 1 |
| PUT | 1 |
| **Total** | **2** |
