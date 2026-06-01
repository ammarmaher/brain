# LookupController — DTOs

> Public contract: `Falcon.Commerce.Contracts/Models/ResponseDtos/{LookupValueResponse, Hook}.cs`
> Internal: `Falcon.Commerce.Application/Queries/ListLookupQuery.cs`, `Results/LookupValueResult.cs`

## Request DTO

No public Request DTO. Endpoint uses `[FromQuery]` primitives + `{id}` route param.

### Internal Query Type

[CODE] `Falcon.Commerce.Application/Queries/ListLookupQuery.cs:1-3`

```csharp
public record ListLookupQuery(string Id, string? Name, string? Code);
```

A `record` — first occurrence in this scan; the rest of Commerce uses classes for queries. Style inconsistency.

## Response DTO

### `Hook<LookupValueResponse>` (the wrapping container)

[CODE] `Falcon.Commerce.Contracts/Models/ResponseDtos/Hook.cs:1-8`

```csharp
public class Hook<T>
{
    public T Value { get; set; } = default!;
    public string Name { get; set; } = default!;
}
```

The wrapper carries:
- `Value` — the typed underlying value (a `LookupValueResponse` for this endpoint)
- `Name` — the **translated display name** (so the frontend can render `{name} ({code})`-style without re-translating)

### `LookupValueResponse`

[CODE] `Falcon.Commerce.Contracts/Models/ResponseDtos/LookupValueResponse.cs:1-8`

```csharp
public class LookupValueResponse
{
    public string Id { get; set; }
    public string Code { get; set; }
}
```

| Field | Type | Notes |
|---|---|---|
| `Id` | string | `LookupValue._id` (Mongo ObjectId stringified) |
| `Code` | string | Business code (e.g. `"SA"`, `"US"`, `"TELECOM"`) |

Note: `LookupValueResponse` does NOT carry the name — the name is in the parent `Hook<T>.Name`. The shape is:

```json
{ "value": { "id": "...", "code": "SA" }, "name": "Saudi Arabia" }
```

### Internal Result Type

[CODE] `Falcon.Commerce.Application/Results/LookupValueResult.cs` (inferred from handler):

```csharp
public class LookupValueResult
{
    public string Id { get; set; }
    public string LookupId { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }  // translated
}
```

AutoMapper flattens this to `Hook<LookupValueResponse>`:
- `Hook.Value` = `{ Id, Code }` (drops `LookupId` and `Name`)
- `Hook.Name` = result's `Name`

## Cross-Reference to Entity

[CODE] `Falcon.Commerce.Domain/Entities/Lookup/LookupValue.cs` (inferred):

```csharp
public class LookupValue
{
    public string Id { get; set; }
    public string LookupId { get; set; }            // e.g. "countries"
    public string Code { get; set; }                // e.g. "SA"
    public MultiLanguageName Name { get; set; }    // { En: "Saudi Arabia", Ar: "..." }
}
```

## Cross-Reference

- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/15-lookup-catalog/` (if present) — full lookup id registry
- [VAULT] `falcon-wiki/Conventions.md` — domain term normalization
