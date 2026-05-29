# LookupController — Validations

## DTO-Level Validation

**None.** Route param `id` is a string with no `[Required]` attribute; query params `name` / `code` are optional.

## Authorization Validation

- `[Authorize]` at class level → caller must have valid JWT
- No `FalconOnly` override

## Handler-Level Validation

[CODE] `ListLookupHandler.cs:21-43` — **no validation**.

```csharp
public async Task<List<LookupValueResult>> ExecuteAsync(ListLookupQuery query)
{
    var values = await _lookupValueRepo.GetListAsync(
        lv => lv.LookupId == query.Id &&
              (string.IsNullOrEmpty(query.Name) || lv.Name.En.Contains(query.Name) || lv.Name.Ar.Contains(query.Name)) &&
              (string.IsNullOrEmpty(query.Code) || lv.Code.StartsWith(query.Code)),
        ...);
    return values?.Select(...).ToList() ?? new List<LookupValueResult>();
}
```

- Unknown `LookupId` → returns empty list (not 404)
- Empty filters → returns all values for the lookup
- `Name.En.Contains(...)` is case-sensitive **C# `string.Contains`** — verify whether the Mongo provider translates this to a case-insensitive regex
- `Code.StartsWith(...)` — likewise

## Cross-Field Validation

**None.**

## Order of Validations

1. `[Authorize]` JWT check → 401 on miss
2. Controller → handler → Mongo → translation → AutoMapper to Hook<T>

## Findings

1. **Unknown lookup id returns empty list.** No 404 — frontend must distinguish "this lookup has no values" from "this lookup doesn't exist".
2. **Search is case-sensitive C# `string.Contains`.** May or may not be translated by Mongo provider — verify against actual production behavior.
3. **No paging** — large lookups (e.g. cities of all countries) return all matches.
4. **Locale-bound translation** — same caveat as other catalog endpoints.

## Cross-Reference to V-rules

V-rules don't typically gate lookup reads — they apply to forms that consume lookups. The lookup endpoint is a pure utility.
