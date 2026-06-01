# LookupController — Endpoints

> Class route prefix: `/api/Lookup` (via `[Route("api/[controller]")]`). Single endpoint inherits `[Authorize]` from class.

## Endpoint Table

| Method | Route | Action | Request | Response (T) | Per-Action Auth |
|---|---|---|---|---|---|
| GET | `/api/Lookup/{id}?name={?}&code={?}` | `Get` | route `id` + query `name`, `code` | `List<Hook<LookupValueResponse>>` | (class only — both Falcon and client users) |

## Verb Count

- GET: 1
- POST: 0
- PUT: 0
- DELETE: 0
- Total: **1**

## Route Binding

| Source | Binding | Type | Required |
|---|---|---|---|
| Route | `{id}` → `string id` | path segment | **yes** |
| Query | `?name={?}` → `string? name = null` | `string?` | no |
| Query | `?code={?}` → `string? code = null` | `string?` | no |
| Header | `Accept-Language` → `ICurrentCulture.CultureName` | implicit | no (defaults to `"en"`) |

[CODE] `LookupController.cs:26`:
```csharp
public async Task<ActionResult<ServiceOperationResult<List<Hook<LookupValueResponse>>>>> Get(
    string id,
    [FromQuery] string? name = null,
    [FromQuery] string? code = null)
```

## Response Shape (Wire Format)

```json
{
  "isSuccessful": true,
  "errorMessages": [],
  "result": [
    {
      "value": { "id": "65a1c2…", "code": "SA" },
      "name": "Saudi Arabia"        // localized via Accept-Language
    },
    {
      "value": { "id": "65a1c3…", "code": "AE" },
      "name": "United Arab Emirates"
    }
  ]
}
```

- `Hook.Value` carries machine identity (`Id` for backend FK binding, `Code` for human-readable shortcut).
- `Hook.Name` carries the **localized** display label, resolved by [CODE] `TranslateHelper.GetTranslation(lv.Name)` based on `Accept-Language` header.

## Filter Semantics

| Param | Behavior | Mongo Query | Case Sensitivity |
|---|---|---|---|
| `id` (route) | exact match on `LookupValue.LookupId` | `{ lookupId: id }` | (ObjectId — N/A) |
| `name` (query) | substring match on **either** En or Ar | `{ $or: [ { 'name.en': { $regex: name } }, { 'name.ar': { $regex: name } } ] }` (compiled LINQ — actual regex flags depend on driver) | **case-sensitive** (see Findings #3 in OVERVIEW) |
| `code` (query) | prefix match on `Code` | `{ code: { $regex: '^code' } }` | **case-sensitive** |

[CODE] `ListLookupHandler.cs:23-33`:
```csharp
var values = await _lookupValueRepo.GetListAsync(
    lv => lv.LookupId == query.Id &&
          (string.IsNullOrEmpty(query.Name)
              || lv.Name.En.Contains(query.Name)
              || lv.Name.Ar.Contains(query.Name)) &&
          (string.IsNullOrEmpty(query.Code)
              || lv.Code.StartsWith(query.Code)),
    lv => new { Id = lv.Id!, lv.LookupId, lv.Code, lv.Name });
```

## Status Codes (Inferred)

| Outcome | HTTP | Body |
|---|---|---|
| Success (any number of rows, including 0) | `200 OK` | `ServiceOperationResult<T>.Success` with `result: []` or populated array |
| Missing/invalid JWT | `401 Unauthorized` | framework default (no Falcon body) |
| Valid JWT, gateway policy mismatch | `403 Forbidden` | depends on gateway |
| `id` route param empty | (won't bind — route returns `404`) | — |
| Mongo connection error | `500 Internal Server Error` | `ServiceOperationResult<T>.Failure(InternalServerError)` via global exception filter |

**No** 404 for "lookup id has no values" — empty list is a success per the handler contract (see OVERVIEW Findings #5).

## Health Endpoint

Separate from this controller — see service-level [`SERVICE_OVERVIEW.md`](../../SERVICE_OVERVIEW.md) for `GET /health` (AllowAnonymous).
