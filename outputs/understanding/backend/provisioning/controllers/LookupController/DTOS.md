# LookupController — DTOs

See [`../../DTO_DICTIONARY.md`](../../DTO_DICTIONARY.md) for the full Provisioning dictionary.

## Request

No request body. Inputs are bound from route + query string.

| Source | Binding | Type | Required | Default |
|---|---|---|---|---|
| Route | `{id}` | `string` | **yes** | — |
| Query | `name` | `string?` | no | `null` |
| Query | `code` | `string?` | no | `null` |

## Response DTO

### Top-level shape

`ServiceOperationResult<List<Hook<LookupValueResponse>>>`

### `Hook<T>` envelope

[CODE] `Falcon.Provisioning.Contracts/Models/ResponseDtos/Hook.cs`:
```csharp
public class Hook<T>
{
    public T Value { get; set; } = default!;
    public string Name { get; set; } = default!;
}
```

Properties:
- `Value` (T) — the typed payload (here `LookupValueResponse`)
- `Name` (string) — the **localized display name**, populated by AutoMapper from `LookupValueResult.Name` which itself was localized by `TranslateHelper.GetTranslation(lv.Name)` against the current request's `Accept-Language` header

### `LookupValueResponse`

[CODE] `Falcon.Provisioning.Contracts/Models/ResponseDtos/LookupValueResponse.cs`:
```csharp
public class LookupValueResponse
{
    public string Id { get; set; } = default!;
    public string Code { get; set; } = default!;
}
```

Properties:
- `Id` (string) — Mongo ObjectId of the `LookupValue` document; stable identity for binding to backend FKs
- `Code` (string) — human-readable shortcode (e.g. `"SA"`, `"AE"` for countries); meant for display alongside `Hook.Name` or for code-keyed lookups in the frontend

Notably **not** in the response:
- `LookupId` — present on the result, **stripped** by the mapper (the caller already knows it — they sent it as the route param)
- `Name` (the multi-language struct) — **stripped**; only the localized string survives, surfaced as `Hook.Name` at the parent level

## Internal Query/Result Types

### Query — `ListLookupQuery`

[CODE] `Falcon.Provisioning.Application/Queries/ListLookupQuery.cs`:
```csharp
public record ListLookupQuery(string Id, string? Name, string? Code);
```

Used by: `Get` action → constructed inline as `new ListLookupQuery(id, name, code)`.

### Result — `LookupValueResult`

[CODE] `Falcon.Provisioning.Application/Results/LookupValueResult.cs`:
```csharp
public class LookupValueResult
{
    public string Id { get; set; } = default!;
    public string LookupId { get; set; } = default!;
    public string Code { get; set; } = default!;
    public string Name { get; set; } = default!;  // already localized
}
```

Used by: `IListLookupHandler.ExecuteAsync` → returns `List<LookupValueResult>`.

`Result.Name` is the **already-translated** English or Arabic string, not the multi-language struct. The translation happens in the handler before the result type exits the Application layer.

## AutoMapper Profile

[CODE] `Falcon.Provisioning.Api/Mappings/Mapping.cs:13-18`:
```csharp
CreateMap<LookupValueResult, Hook<LookupValueResponse>>()
    .ForMember(dest => dest.Value, opt => opt.MapFrom(src => new LookupValueResponse
    {
        Id = src.Id,
        Code = src.Code
    }));
```

The mapping:
- Constructs the inner `LookupValueResponse` inline (only `Id` + `Code` survive)
- `Hook.Name` is mapped **implicitly** from `LookupValueResult.Name` (convention-based, same property name)
- `Result.LookupId` is **dropped** (no destination property has that name on `Hook<T>` or `LookupValueResponse`)

## Domain Entities (Backing Store)

### `Lookup` (parent catalog)

[CODE] `Falcon.Provisioning.Domain/Entities/Lookup/Lookup.cs`:
```csharp
public class Lookup : IBaseEntity
{
    public string Id { get; set; }                     // BsonObjectId
    public MultiLanguageName Name { get; private set; } // ITranslate
}
```

Mongo collection (per platform convention): `Lookups`. Currently **empty** — see [CODE] `LookupSeedData.cs:7-10`.

### `LookupValue` (rows under a parent)

[CODE] `Falcon.Provisioning.Domain/Entities/Lookup/LookupValue.cs`:
```csharp
public class LookupValue : IBaseEntity
{
    public string Id { get; set; }                     // BsonObjectId
    public string LookupId { get; private set; }       // FK to Lookup.Id
    public string Code { get; private set; }
    public MultiLanguageName Name { get; private set; }
}
```

Mongo collection: `LookupValues`. Currently **empty** — see [CODE] `LookupSeedData.cs:11-16`.

### `MultiLanguageName`

[CODE] `Falcon.Provisioning.Domain/ValueObjects/MultiLanguageName.cs`:
```csharp
public class MultiLanguageName : ITranslate
{
    public string En { get; set; } = default!;
    public string Ar { get; set; } = default!;
}
```

Both fields **non-nullable** in the Provisioning Domain (different from `Provisioning.Contracts.Models.Shared.MultiLanguage` which is nullable — see [DTO_DICTIONARY](../../DTO_DICTIONARY.md) Cross-Cutting Types).

## Wire Field Casing

[CODE] [INFERRED] .NET 6+ default — JSON serialization uses camelCase. Frontend sees:
- `result[i].value.id`
- `result[i].value.code`
- `result[i].name`
- `isSuccessful`, `errorMessages`
