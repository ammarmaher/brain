# LookupController — Validations

## DTO-Level Validation

**None.** The endpoint has no request DTO body — inputs are bound directly from the URL.

| Input | Validation Mechanism | Behavior on Invalid |
|---|---|---|
| `{id}` route param | Route binding (must be present, any string) | Missing → ASP.NET returns `404` (no route match) |
| `?name=` query | None — accepts any string or `null` | No validation; passes through to Mongo as-is |
| `?code=` query | None — accepts any string or `null` | No validation; passes through to Mongo as-is |

The handler treats empty/whitespace `name`/`code` as **"unfiltered"** ([CODE] `ListLookupHandler.cs:25-26` — `string.IsNullOrEmpty(query.Name) || …`).

## Handler-Level Validation

[CODE] `ListLookupHandler.cs`:

| Concern | Behavior |
|---|---|
| Unknown `LookupId` | Returns `[]` — **no exception**. Frontend cannot distinguish "catalog does not exist" from "catalog has no values". |
| Tenant scoping | **None.** Lookup tables are global; no `_currentUser.TenantId` filter is applied. Any authenticated user sees the same data for a given `lookupId`. |
| Pagination | **None.** All matching values are materialized in one round-trip. |
| Filter sanitization | **None.** The `name`/`code` strings are inserted directly into the LINQ expression (which compiles to a Mongo `$regex` via the driver's expression translator). [INFERRED] **PENDING-QUESTION:** does the Mongo driver auto-escape regex metacharacters (`. * + ? [ ] ( ) { } | ^ $ \`) when translating `string.Contains` / `string.StartsWith`? If not, a search for `name=.*` would execute a wildcard match. Verify by inspecting `MongoDB.Driver` expression translator behavior or write a unit test. [HALT-AND-FLAG → see Findings #4]. |

## Authorization

- Class-level `[Authorize]` requires a valid Zitadel JWT ([CODE] `LookupController.cs:13`)
- **No** per-action `[Authorize(Policy = …)]` — both Falcon and client users may call it
- The gateway layer enforces:
  - System Gateway → `FalconOnly` policy applied at YARP route
  - Core Gateway → `ClientOnly` policy applied at YARP route
- Provisioning itself does **not** filter results based on `eUserType` or `TenantId` — see "tenant scoping" above

## Resource Completeness

`app.ValidateErrrosResourceCompleteness()` (sic — typo in the framework helper name) runs at startup. Since this controller currently raises **no** `FalconException` codes (no errors are thrown for any input), the resource check is a no-op for this surface.

## UnitOfWork

Global `UnitOfWorkFilter` wraps every controller action ([CODE] `Program.cs` — `AddControllers(o => { o.Filters.Add<UnitOfWorkFilter>(); })`). For this pure-read GET endpoint it is **wasteful but harmless** — no writes are queued so no commit happens.

The action doesn't return an `IUnitOfWorkTrigger`-flagged result, so even if the filter did inspect for triggers it would not commit anything.

## Multi-Language

The endpoint **is** multi-language aware, but via the **request header** (`Accept-Language`) rather than the DTO.

Pipeline:
1. [CODE] `CurrentCulture.cs:14-30` reads `Accept-Language` on construction (`IHttpContextAccessor.HttpContext.Request.Headers["Accept-Language"]`)
2. Picks the **first** language tag from a comma-separated list, strips quality factors (`;q=0.9`)
3. If primary starts with `"ar"` (case-insensitive) → `CultureName = "ar"`, otherwise → `"en"`
4. [CODE] `TranslateHelper.GetTranslation(translate)` switches on `CultureName`:
   - `"ar"` → return `translate.Ar`
   - `"en"` → return `translate.En`
   - anything else → **throws** `NotSupportedException` (cannot happen given CurrentCulture only returns `"ar"` or `"en"`)
5. The translated string is set on `LookupValueResult.Name` before exiting the handler
6. AutoMapper carries it through to `Hook.Name` on the response

**Frontend implication:** sending `Accept-Language: fr` results in **English** (default fallback), not a 4xx. Sending `Accept-Language: ar-SA,en;q=0.9` → primary is `ar-SA` → `StartsWith("ar")` → returns Arabic.

## No Cross-Field Validations

Single-field route + two independent optional query params — no cross-field rule could exist.

## No Domain Policy Involvement

Unlike `ServicesController` which threads through `IServicesActionsPolicy` for `availableActions[]` computation, LookupController has **no** domain policy invocation. The handler is a thin Mongo query wrapped in a translator.
