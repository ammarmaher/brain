# LookupController — Validations

## DTO-Level Validation

No `[Required]`, `[Range]`, `[ThrowIfNotPassed]`, FluentValidation, or any other DTO-level validation. There is no request DTO — only route/query primitives.

| Parameter | Routing-Level Validation | Effect on Empty/Invalid |
|---|---|---|
| `id` (route) | Implicit non-null because it is a required route token | If missing → routing returns 404 (no action match) |
| `name` (query) | None | Empty string or null → predicate skipped |
| `code` (query) | None | Empty string or null → predicate skipped |

## Handler-Level Validation

`IListLookupHandler.ExecuteAsync(ListLookupQuery)` performs **no** validation. It runs the predicate against the MongoDB collection and returns whatever matches.

| Edge Case | Behavior |
|---|---|
| `id` does not match any `LookupValue.LookupId` | Returns `[]` — no error, no exception |
| `id` is an arbitrary string (not even an ObjectId) | Returns `[]` — silent no-match |
| `name` is whitespace | Treated as non-empty → applied as `Contains(" ")` predicate which matches every row whose name contains a space (likely all rows) |
| `code` is whitespace | Treated as non-empty → applied as `StartsWith(" ")` predicate which matches no rows |

`[CODE] ListLookupHandler.cs:25` uses `string.IsNullOrEmpty(...)` not `string.IsNullOrWhiteSpace(...)` — whitespace gets through. Minor bug.

## Idempotency / Caching

No idempotency layer. No Redis cache. Each call hits MongoDB directly via `IRepository<LookupValue>.GetListAsync(...)`.

## Optimistic Concurrency

Not applicable — read-only endpoint.

## UnitOfWork Wrap

`UnitOfWorkFilter` (global on `AddControllers`) wraps this read in a Mongo session even though no writes occur. The filter likely short-circuits commit on `IUnitOfWorkTrigger` interface check — verify in `Falcon.Charging.Application/Services/UnitOfWork`.

## No Authorization Beyond Class-Level `[Authorize]`

Any authenticated user — Falcon admin or client user — can query any Charging lookup. There is no tenant-scoping because lookups are global reference data (constants, not tenant-owned values).

## Multi-Language

The handler resolves `LookupValue.Name` (a `MultiLanguageName { En, Ar }`) to a single string via `_translateHelper.GetTranslation(lv.Name)` — the `Accept-Language` header on the request determines which language wins. See `[CODE] ListLookupHandler.cs:40`.

If the request omits `Accept-Language`, the translator likely falls back to a default — verify with `ITranslateHelper` implementation in Charging Api project.

## Empty Seed Data — Implication for Validation

`[CODE] LookupSeedData.cs:7-16` ships an empty list of `Lookup` + `LookupValue`. In current builds the endpoint always returns `[]`. The frontend cannot tell the difference between "you searched an invalid lookupId" and "the lookup exists but is empty" — both look identical. See [BRAIN-OUT] `_pending-questions/wave-5c-lookup-empty-seed.md`.

## Resource Completeness

`app.ValidateErrrosResourceCompleteness()` fails service startup if any error code in `FalconKeys.Error` lacks an English or Arabic translation. This endpoint does not throw any `FalconKeys.Error` codes, so it is unaffected.
