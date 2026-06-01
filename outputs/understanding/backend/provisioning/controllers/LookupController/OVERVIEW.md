# LookupController — Drill-down

> File: [CODE] `falcon-core-provisioning-svc/src/Falcon.Provisioning.Api/Controllers/LookupController.cs` (35 lines)
> The smallest controller in the Provisioning service — a single read-only endpoint that returns localized lookup values.

## Purpose

Single operation: **read lookup values** by `lookupId`, optionally filtered by `name` (substring match across En/Ar) or `code` (prefix match). Returns the values wrapped in a `Hook<LookupValueResponse>` envelope so each row carries both a translated display `Name` (outer hook) and the stable `{ Id, Code }` (inner value) for binding into UI dropdowns/typeaheads.

This controller exists to give the frontend a uniform way to populate filter/picker UI elements without each tab having to know the names of the underlying `Lookup` and `LookupValue` collections. It is a structural mirror of the **same controller in Commerce, Charging, and Identity** — the wire shape (`/api/Lookup/{id}?name=&code=`) is identical across services so the frontend's `LookupApiService` can be reused unchanged.

[CODE] `LookupController.cs:25-33` is the entire surface — `[HttpGet("{id}")]` action delegates to `IListLookupHandler` and AutoMaps to `List<Hook<LookupValueResponse>>`.

## Architecture

Constructor injects 2 dependencies:
- `IListLookupHandler _listLookupHandler` — application-layer handler at [CODE] `Falcon.Provisioning.Application/Services/Handlers/ListLookupHandler.cs`
- `IMapper _mapper` — AutoMapper instance

Action shape ([CODE] `LookupController.cs:26-33`):
1. Bind route param `{id}` → `query.Id`
2. Bind query string `?name=&code=` → `query.Name`, `query.Code` (both nullable)
3. `_listLookupHandler.ExecuteAsync(new ListLookupQuery(id, name, code))` → `List<LookupValueResult>`
4. `_mapper.Map<List<Hook<LookupValueResponse>>>(values)` → public shape
5. Wrap in `ServiceOperationResult<List<Hook<LookupValueResponse>>>.Success(...)`

### Handler

[CODE] `ListLookupHandler.cs:21-43` filters via `IRepository<LookupValue>.GetListAsync`:
- **Required filter** — `lv.LookupId == query.Id` (the parent lookup)
- **Optional name filter** — `string.IsNullOrEmpty(query.Name) || lv.Name.En.Contains(query.Name) || lv.Name.Ar.Contains(query.Name)` (substring match, case-sensitive; matches if either En **or** Ar contains the search term)
- **Optional code filter** — `string.IsNullOrEmpty(query.Code) || lv.Code.StartsWith(query.Code)` (prefix match, case-sensitive)
- **Projection** — only `Id`, `LookupId`, `Code`, `Name` are pulled from Mongo

Each surviving row is then localized via [CODE] `TranslateHelper.GetTranslation(lv.Name)` — switches on `_currentCulture.CultureName` (`"ar"` or `"en"`) and returns the matching string. Anything else throws `NotSupportedException`.

### Culture Resolution

[CODE] `CurrentCulture.cs:14-30` reads `Accept-Language` request header:
- Empty/missing → `"en"`
- First language tag starts with `"ar"` (case-insensitive) → `"ar"`
- Otherwise → `"en"`

Frontend MUST send `Accept-Language: ar` (or `ar-SA`) for Arabic results; without it the response is English regardless of any in-app i18n flag.

## Authorization

- Class level: `[Authorize]` ([CODE] `LookupController.cs:13`) — requires a valid Zitadel JWT
- **No per-action policy overrides** — both Falcon admins **and** client users can call this endpoint
- Tenant scoping: **none** — `Lookup` and `LookupValue` are global catalogs, not per-tenant. Client users from different tenants see identical results for the same `lookupId`.

Gateway routing:
- [CODE] System Gateway `appsettings.json:54-64` — `/provisioning/{**}` → `FalconOnly` policy → forwards `Path` to backend with `/api` prefix
- [CODE] Core Gateway `appsettings.json:80-91` — `/provisioning/{**}` → `ClientOnly` policy → same path transform

So in practice: Falcon admins hit `/provisioning/Lookup/{id}` via System Gateway; client users hit the same path via Core Gateway. Both work; backend doesn't differentiate.

## Empty Catalog

[CODE] `LookupSeedData.cs:7-17` — **both** `GetLookups()` **and** `GetLookupValues()` currently return empty lists. The Provisioning Mongo seed inserts **no** lookup data. This means:
- Calling `GET /api/Lookup/{anyId}` against a fresh database returns `200 OK` with `Result: []`
- The endpoint is wired and reachable, but the only way to get non-empty data is for someone to populate the `Lookup` + `LookupValue` collections **out of band** (manual Mongo insert, future migration, or via the seed file being expanded later)
- [INFERRED] Commerce and Charging have **populated** Lookup seed data; Provisioning's seed is **a placeholder reserved for future use**. The controller is duplicated structurally for consistency but currently has no real consumers in Provisioning's domain.

## Code Smells / Findings

1. **Empty seed** ([CODE] `LookupSeedData.cs`) — controller exists but has no canonical lookup values. The platform's pattern of "every service ships a Lookup endpoint" is followed for consistency, but this service has zero rows. Either populate the seed or remove the controller as dead code.
2. **No XML doc comments** — same as ServicesController. Swagger emits the route but no description.
3. **Case-sensitive `Contains` on `Name.En`/`Name.Ar`** ([CODE] `ListLookupHandler.cs:25`) — runs on MongoDB's translated LINQ. A user searching `"Whatsapp"` will not match a record stored as `"WhatsApp"`. **PENDING-QUESTION:** PRD-01 (Add Client wizard, lookup-backed Country/Industry pickers) implies case-insensitive search — should the handler use `lv.Name.En.ToLower().Contains(query.Name.ToLower())` (compiled to `$regex` with `'i'` flag) or rely on Mongo collation? [HALT-AND-FLAG → write to `pending-questions/` if no PRD answer exists].
4. **No paging** — `GetListAsync` materializes the entire filtered set. If the platform ever ships a Lookup with >10k values (e.g. global postal codes), this returns the full list. Acceptable for the current null seed; flagged as scale risk.
5. **No `lookupId` existence check** — calling with a bogus `{id}` returns `200 OK` with empty list rather than `404`. Behavior matches the rest of the platform (consistent), but means the frontend can't tell "lookup catalog missing" from "lookup has no rows" without an out-of-band check.
6. **`Hook<T>` envelope is a translation indirection** — see [DTO_DICTIONARY](../../DTO_DICTIONARY.md). `Hook.Name` is the **localized display label** (En or Ar based on Accept-Language); `Hook.Value` is the **machine identity** `{ Id, Code }`. Frontend binds `Hook.Name` to display and `Hook.Value.Id` to form state.

## Cross-Service Mirror

Each Falcon backend service ships a structurally identical `LookupController`:

| Service | Path | Status |
|---|---|---|
| Provisioning | `GET /api/Lookup/{id}` | **this controller** — empty seed |
| Commerce | `GET /api/Lookup/{id}` | populated seed (Country, Industry, etc.) |
| Charging | `GET /api/Lookup/{id}` | populated seed |
| Identity | `GET /api/Lookup/{id}` | populated seed |

[INFERRED] The frontend's lookup-resolution layer is expected to be aware of **which service owns which lookupId** — there is no cross-service Lookup federation. A frontend that needs both a Commerce-owned Country lookup and a Provisioning-owned … (TBD when Provisioning seeds its first lookup) … has to call each service independently. Document the per-service lookup catalog map when it materializes.

## Files Drilled

- `OVERVIEW.md` (this file)
- `ENDPOINTS.md`
- `DTOS.md`
- `VALIDATIONS.md`
- `ERRORS.md`
- `FRONTEND_CONTRACT.md`
