# ApplicationController — Drill-down

> File: `falcon-core-commerce-svc/src/Falcon.Commerce.Api/Controllers/ApplicationController.cs` (32 lines)
> 1 endpoint — global Application catalog read.

## Purpose

Returns the **global application catalog** (all `Application` documents in Mongo). Used by:
- Falcon admin Application-management page (list)
- Add Client wizard Step 3/4 — to populate the per-account application list (each account's `Applications` array references these global IDs)

Note: **Per-account** application data (visibility, pricing, status, scheduled changes) is owned by `NodeController` — see [`../NodeController/`](../NodeController/).

## Architecture

- Constructor injection (3 dependencies)
- AutoMapper maps `List<ApplicationResult>` → `List<ApplicationResponse>`

```csharp
public ApplicationController(IMapper mapper, IListApplicationsHandler listApplicationsHandle)
{
    _mapper = mapper;
    _listApplicationsHandle = listApplicationsHandle;
}
```

[CODE] `ApplicationController.cs:14-22`

## Route Prefix

`/api/Application` (via `[Route("api/[controller]")]`).

## Authorization

- Class-level: `[Authorize]` and `[ApiController]`
- No action-level overrides → any authenticated JWT (Falcon or Client)

## Collaborators

| Type | Used For |
|---|---|
| `IListApplicationsHandler` | Returns all applications |
| `IRepository<Application>` (inside handler) | `_applicationRepo.GetListAsync(_ => true, ...)` |
| `ITranslateHelper` | Translates `MultiLanguageName` to caller's language |

## Kafka Events

**None.** Pure read endpoint.

## Findings

1. **Returns full catalog with no pagination, filter, or search.** For a small catalog (< 50 entries) this is fine; large catalogs will require lazy-load or paging. Verify Application document count.

2. **Translation happens server-side** ([CODE] `ListApplicationsHandler.cs:35`) — `_translateHelper.GetTranslation(a.Name)`. The translation source is `ICurrentUser.Language` (or `Accept-Language` header — verify). Frontend receives a single translated string per app, not the multi-language tuple.

3. **No `[Authorize(Policy=FalconOnly)]` override** — both Falcon and Client users can list applications. This is appropriate: clients need the global list to render their per-account app rows.

4. **Field misnamed in controller constructor:** `_listApplicationsHandle` (missing `r` at the end — should be `Handler`). Cosmetic.

## Files Drilled

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
