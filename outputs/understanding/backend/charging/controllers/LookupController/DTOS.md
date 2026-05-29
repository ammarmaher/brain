# LookupController — DTOs

See [`../../DTO_DICTIONARY.md`](../../DTO_DICTIONARY.md) for the full Charging dictionary. The subset relevant to `LookupController`:

## Request

No request DTO. All inputs are route/query primitives.

| Parameter | Source | Type | Required |
|---|---|---|---|
| `id` | route | `string` | yes |
| `name` | query | `string?` | no |
| `code` | query | `string?` | no |

## Internal Query Type (in `Falcon.Charging.Application/Queries`)

```csharp
// [CODE] ListLookupQuery.cs:3
public record ListLookupQuery(string Id, string Name, string Code);
```

Note: `Name` and `Code` are non-nullable in the record signature even though the controller passes nullable values. The handler defensively checks `string.IsNullOrEmpty(query.Name)` and `string.IsNullOrEmpty(query.Code)` to skip the predicate when the value is null — see `[CODE] ListLookupHandler.cs:25-26`.

## Response DTOs

### Outer (per Hook row)

```csharp
// [CODE] Hook.cs:3
public class Hook<T>
{
    public T Value { get; set; } = default!;
    public string Name { get; set; } = default!;
}
```

- `Value` carries the data (here: `LookupValueResponse`).
- `Name` carries the localized display string resolved via `ITranslateHelper`.

### Inner

```csharp
// [CODE] LookupValueResponse.cs:3
public class LookupValueResponse
{
    public string Id { get; set; } = default!;
    public string Code { get; set; } = default!;
}
```

Only `Id` and `Code`. Notably **`LookupId`** is dropped from the response — the consumer already knows `LookupId` because it provided it in the request path. Only `Id` (the lookup-value id) and `Code` (the business key) survive.

## Domain Entities

```csharp
// [CODE] Lookup.cs:10
public class Lookup : IBaseEntity { Id, Name (MultiLanguageName) }

// [CODE] LookupValue.cs:10
public class LookupValue : IBaseEntity { Id, LookupId, Code, Name (MultiLanguageName) }
```

`MultiLanguageName` is a `{ En, Ar }` value object — see `[VAULT] Conventions.md`.

## Internal Result Type

```csharp
// [CODE] LookupValueResult.cs:3
public class LookupValueResult
{
    public string Id { get; set; }
    public string LookupId { get; set; }
    public string Code { get; set; }
    public string Name { get; set; }    // already resolved to a single language
}
```

The handler reads each `LookupValue.Name` (which is bilingual) and projects it to a single-language string via `_translateHelper.GetTranslation(lv.Name)` before returning. See `[CODE] ListLookupHandler.cs:40`.

## AutoMapper Profile

```csharp
// [CODE] Mapping.cs:13-18
CreateMap<LookupValueResult, Hook<LookupValueResponse>>()
    .ForMember(dest => dest.Value, opt => opt.MapFrom(src => new LookupValueResponse
    {
        Id = src.Id,
        Code = src.Code
    }));
```

The mapping is partial — only `Value.Id` and `Value.Code` are filled. The mapping does **not** explicitly set `Hook.Name`, so AutoMapper falls back to the convention `src.Name → dest.Name` — which works because the source `LookupValueResult.Name` is already the resolved localized string. **Result on the wire**: `hook.name` is the localized name, `hook.value.id` is the row id, `hook.value.code` is the business code.

The mapping drops `LookupValueResult.LookupId` entirely. Acceptable because the consumer supplied it in the route.
