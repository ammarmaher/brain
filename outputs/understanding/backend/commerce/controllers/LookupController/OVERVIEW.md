# LookupController — Drill-down

> File: `falcon-core-commerce-svc/src/Falcon.Commerce.Api/Controllers/LookupController.cs` (36 lines)
> 1 endpoint — generic lookup-value retrieval (countries, cities, sectors, classifications, etc.).

## Purpose

Provides **translated lookup values** for dropdowns / autocomplete inputs across the platform:
- Country list
- City list
- Sector list
- Classification categories
- Classification sub-categories
- Authority letter types
- Any other lookup-driven dropdown

Each lookup is keyed by `LookupId` (e.g. `"countries"`, `"cities"`, `"sectors"`). Lookups are stored in the `LookupValue` collection — each value has `LookupId`, `Code`, and `Name` (MultiLanguageName).

## Architecture

- Constructor injection (2 dependencies)
- AutoMapper wraps values in `Hook<LookupValueResponse>` (Hook is a `{ Value, Name }` pair — looks like a renderer pairing wrapper)

```csharp
public LookupController(IListLookupHandler lookupService, IMapper mapper)
{
    _lookupService = lookupService;
    _mapper = mapper;
}
```

[CODE] `LookupController.cs:19-23`

## Route Prefix

`/api/Lookup` (via `[Route("api/[controller]")]`).

## Authorization

- Class-level: `[ApiController] [Authorize]`
- No action-level overrides

## Collaborators

| Type | Used For |
|---|---|
| `IListLookupHandler` | Returns matching lookup values |
| `IRepository<LookupValue>` (inside handler) | Filtered Mongo query |
| `ITranslateHelper` | Translates `MultiLanguageName` to caller's language |

## Kafka Events

**None.** Pure read endpoint.

## Findings

1. **Search by `Name.En.Contains(query.Name) || Name.Ar.Contains(query.Name)`.** [CODE] `ListLookupHandler.cs:24-26`. **Both languages** are scanned regardless of caller's locale. Good for cross-lingual autocomplete; bad for performance on large lookups (uses `Contains`, no indexed search).

2. **Code matched by `StartsWith` (not `Contains`).** [CODE] `ListLookupHandler.cs:26`. Code search is more restrictive — caller typing `"SA"` matches `"SAUDI"` but typing `"AU"` would NOT match `"SAUDI"`. Intentional or drift?

3. **No paging.** Lookups are returned in full (after name/code filter). City lookup with thousands of entries returns all matches — frontend should pre-filter further or use pagination at the gateway.

4. **`Hook<LookupValueResponse>` wrapper** — the AutoMapper profile maps each value to a `Hook<T>` (with `Value` and `Name` fields). [CODE] `Hook.cs:1-9`:
   ```csharp
   public class Hook<T>
   {
       public T Value { get; set; }
       public string Name { get; set; }
   }
   ```
   Likely used to render a `{ display: "<translated name>", value: <LookupValueResponse> }` pair for dropdown consumers.

## Files Drilled

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
