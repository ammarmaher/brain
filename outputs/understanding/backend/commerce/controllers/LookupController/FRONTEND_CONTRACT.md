# LookupController — Frontend Contract

## Public URL

| Frontend URL | Maps to | Auth |
|---|---|---|
| `GET /commerce/Lookup/<id>?name=<q>&code=<q>` | Commerce `/api/Lookup/<id>?name=<q>&code=<q>` | Any JWT |

## Headers

- `Authorization: Bearer <jwt>`
- `Accept: application/json`
- `Accept-Language: en | ar` (drives the `Hook.Name` translation)

## Request

- `id` (route, required) — lookup id (e.g. `"countries"`)
- `name` (query, optional) — substring to filter by display name (both English and Arabic scanned)
- `code` (query, optional) — prefix to filter by code

## Response (Success)

```json
{
  "isSuccessful": true,
  "result": [
    { "value": { "id": "lk-sa", "code": "SA" }, "name": "Saudi Arabia" },
    { "value": { "id": "lk-ae", "code": "AE" }, "name": "United Arab Emirates" },
    { "value": { "id": "lk-us", "code": "US" }, "name": "United States" }
  ],
  "errorMessages": []
}
```

- Each item is `{ value: { id, code }, name: <translated> }`
- `name` is in the caller's locale (per `Accept-Language` or default)

## Response (Empty / Unknown lookup)

```json
{ "isSuccessful": true, "result": [], "errorMessages": [] }
```

HTTP 200. **No 404 for unknown `id`** — empty list is returned.

## Pagination

Not paginated. Large lookups return all matches.

## Frontend Use Cases

1. **Add Client wizard Step 1** — populate dropdowns for Country, City, Sector, Classification Category/SubCategory, Authority Letter Type, etc.
2. **Edit Account info** — same dropdowns
3. **Search/autocomplete** — pre-filter by `name` or `code` to narrow large lists

## Casing & Path Conventions

- Route: `/api/Lookup/{id}` (PascalCase) — path id is lowercased by convention (`"countries"`, `"sectors"`)
- Query params: lowercase camelCase (`name`, `code`)
- JSON: camelCase fields

## Cross-References

- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/15-lookup-catalog/` (if present)
- [CODE] `apps/admin-console/.../shared/services/lookup.service.ts` (inferred)
- [BRAIN-SK] `Brain SK/_obsidian/30-Validation/V-002-address-cross-field.md` — Country/City/District/Street validations consume lookup data
