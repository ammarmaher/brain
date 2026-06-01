# LookupController — Drill-down

> File: `falcon-core-charging-svc/src/Falcon.Charging.Api/Controllers/LookupController.cs` (~35 lines)
> A thin localization-aware key/code lookup endpoint. Mirrors Commerce's `LookupController` one-for-one.

## Purpose

Provides **one entry point** for resolving a Charging-side `Lookup` (parent dictionary) to its child `LookupValue` rows, with optional substring/prefix filtering. Used by frontends that need to populate a dropdown whose items are owned by Charging — for example, future bucket-status or rating-priority enumerations.

The endpoint returns `Hook<LookupValueResponse>` rows. A `Hook<T>` is the canonical Charging wrapper used to attach a localized display label (`Name`) to an opaque inner value (`Value`). The `Name` is resolved server-side using `ITranslateHelper.GetTranslation(MultiLanguageName)` so the request's `Accept-Language` header drives En/Ar selection — see `[CODE] falcon-core-charging-svc/src/Falcon.Charging.Application/Services/Handlers/ListLookupHandler.cs:40`.

## Architecture

Constructor injects:
- `IListLookupHandler` — query handler (note the field is misnamed `_lookupService` even though the type is a handler — see `[CODE] LookupController.cs:16`)
- `IMapper` — AutoMapper for `LookupValueResult` → `Hook<LookupValueResponse>` projection

The single action `Get`:
1. Reads `id` from the route and optional `name`, `code` from the query string.
2. Constructs a `ListLookupQuery(id, name, code)` and calls `IListLookupHandler.ExecuteAsync(query)`.
3. Maps the resulting `List<LookupValueResult>` to `List<Hook<LookupValueResponse>>` via AutoMapper.
4. Wraps in `ServiceOperationResult<List<Hook<LookupValueResponse>>>.Success(...)` and returns `200 OK`.

Globally registered `UnitOfWorkFilter` (from `[CODE] Program.cs:21`) wraps this read in a Mongo session even though it is purely a read — wasteful but harmless.

## Authorization

Class level: `[Authorize]`. No per-action policy. Any authenticated client or Falcon user can query any Charging lookup. There is no tenant-scoping on lookup queries — Charging treats lookups as global reference data (which is intentional — a `LookupValue` is a constant like `"COMMITTED"`, not a tenant-specific value).

## Filtering Semantics

| Query Param | Filter | Notes |
|---|---|---|
| `id` (route) | `LookupId == query.Id` | Required — picks the parent dictionary |
| `name` | `Name.En.Contains(name) \|\| Name.Ar.Contains(name)` | Substring match against either language |
| `code` | `Code.StartsWith(code)` | **Prefix** match — not contains, not equal |

See `[CODE] ListLookupHandler.cs:23-26`.

## Frontend Display Field — Caveat

The `Hook<T>` wrapper places the localized display string on `Hook.Name`. The inner `LookupValueResponse` deliberately does **not** include the localized name — only `Id` and `Code`. This is because the registry expects the consumer to read `hook.name` for display and use `hook.value.id` (or `hook.value.code`) as the persisted key.

The AutoMapper profile drops `LookupValueResult.LookupId` and `LookupValueResult.Name` from the inner value — they live exclusively on `Hook.Name` after mapping. See `[CODE] Mapping.cs:13-18`.

## Empty Seed Data — IMPORTANT

`[CODE] LookupSeedData.cs:7-16` returns empty lists for both `GetLookups()` and `GetLookupValues()`. As of this dossier, **the Charging service has no seeded lookup dictionaries**. Calling this endpoint with any `id` returns an empty list. If a frontend depends on Charging-side lookups (vs Commerce-side), that frontend is broken until seed data is added. See [BRAIN-OUT] `_pending-questions/wave-5c-lookup-empty-seed.md` for the open question to operator.

## Code Smells / Findings

1. **Misnamed field** — `_lookupService` should be `_listLookupHandler` to match the actual injected type `IListLookupHandler`. Low priority.
2. **Empty seed data** — see "Empty Seed Data" section above. Until seed populated, the endpoint is a no-op.
3. **No XML doc comments** on the action.
4. **Substring match on Name uses raw `Contains`** — case-sensitive on culture-invariant comparison. Frontend that types lowercase to find uppercase-stored values will see empty results. Verify if intentional.
5. **No paging** — `name` and `code` filters are applied server-side, but there is no `top` or `skip`. For a large `Lookup`, this returns the entire filtered set.
6. **`StartsWith` on `Code`** — verify with operator that prefix-match (not exact-match) is the intended product behavior. Exact-match is more typical for `Code`.

## Files Drilled

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
