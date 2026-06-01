# LookupController — Endpoints

> Class route prefix: `/api/Lookup` (via `[Route("api/[controller]")]`). All endpoints inherit `[Authorize]` from class. All endpoints return `ServiceOperationResult<T>`.

| Method | Route | Action | Request | Response (T) | Handler |
|---|---|---|---|---|---|
| GET | `/api/Lookup/{id}?name=&code=` | `Get` | (route + query) | `List<Hook<LookupValueResponse>>` | `IListLookupHandler.ExecuteAsync(new ListLookupQuery(id, name, code))` |

## Verb Convention

The route uses PascalCase for the class token (`Lookup`) and **no kebab-case** for the action (this controller has only one action mapped to the class root via `[HttpGet("{id}")]`). Frontend URL:

```
GET /charging/Lookup/{id}
GET /charging/Lookup/{id}?name=foo
GET /charging/Lookup/{id}?code=PREFIX
GET /charging/Lookup/{id}?name=foo&code=PREFIX
```

## Parameters

| Parameter | Source | Type | Required | Default | Filter Behavior |
|---|---|---|---|---|---|
| `id` | route | `string` | yes | — | `lv.LookupId == id` — equals match |
| `name` | query | `string?` | no | `null` | If non-empty: `lv.Name.En.Contains(name) \|\| lv.Name.Ar.Contains(name)` |
| `code` | query | `string?` | no | `null` | If non-empty: `lv.Code.StartsWith(code)` |

See `[CODE] falcon-core-charging-svc/src/Falcon.Charging.Application/Services/Handlers/ListLookupHandler.cs:23-26`.

## Response Shape

```jsonc
{
  "isSuccessful": true,
  "errorMessages": [],
  "result": [
    {
      "value": { "id": "<lookupValueId>", "code": "<code>" },
      "name": "<localized display name>"
    },
    // ...
  ]
}
```

The outer envelope is `ServiceOperationResult<T>`. The inner `result` is `List<Hook<LookupValueResponse>>`. Each `Hook<T>` has `value` (the data) and `name` (the localized display string). The display name is resolved against `Accept-Language` by `ITranslateHelper.GetTranslation(MultiLanguageName)`.

## Endpoint Count

- GET: 1
- POST: 0
- Total: 1

## Mirror of Commerce

This controller is a one-to-one mirror of Commerce's `LookupController`. The pattern is shared across services so the same Hook-wrapper UI component on the FE can hydrate from any service.
