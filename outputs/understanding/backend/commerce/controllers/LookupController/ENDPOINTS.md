# LookupController — Endpoints

> Class route prefix: `/api/Lookup`. Inherits `[Authorize]`.

## Read Endpoint

| Method | Route | Action | Request | Response (T in SOR) | Handler |
|---|---|---|---|---|---|
| GET | `/api/Lookup/{id}?name=&code=` | `Get` | (route `id` + 2 optional query params) | `List<Hook<LookupValueResponse>>` | `IListLookupHandler.ExecuteAsync(new ListLookupQuery(id, name, code))` |

### Source

[CODE] `LookupController.cs:25-33`

```csharp
[HttpGet("{id}")]
public async Task<ActionResult<ServiceOperationResult<List<Hook<LookupValueResponse>>>>> Get(
    string id,
    [FromQuery] string? name = null,
    [FromQuery] string? code = null)
{
    var values = await _lookupService.ExecuteAsync(new ListLookupQuery(id, name, code));
    var response = _mapper.Map<List<Hook<LookupValueResponse>>>(values);
    return Ok(ServiceOperationResult<List<Hook<LookupValueResponse>>>.Success(response));
}
```

### Parameters

| Param | Type | Source | Required | Notes |
|---|---|---|---|---|
| `id` | string | Route | **Yes** | Lookup id (e.g. `"countries"`, `"sectors"`) |
| `name` | string? | Query | No | Substring match — scans both `En` and `Ar` |
| `code` | string? | Query | No | **Prefix** match (`StartsWith`) |

### PES Key

| Endpoint | Frontend PES | Backend Gate |
|---|---|---|
| `GET /api/Lookup/{id}` | _none_ (any authenticated user) | `[Authorize]` only |

### Status Codes

| Status | When |
|---|---|
| 200 | Success — list possibly empty |
| 401 | No / invalid JWT |
| 500 | Mongo / translation failure |

## Known Lookup IDs

(Inferred from PRD + AccountInfo DTO enum fields — verify the exact `LookupId` keys in `LookupValue` collection)

- `countries` — country codes / names
- `cities` — city codes / names (likely scoped by country)
- `sectors` — business sector codes / names
- `classification-categories` (verify)
- `classification-sub-categories` (verify)
- `authority-letter-types` (verify)

The frontend uses these in the Add Client wizard Step 1 (account info) and elsewhere.

## Endpoint Count by HTTP Verb

| Verb | Count |
|---|---:|
| GET | 1 |
| **Total** | **1** |
