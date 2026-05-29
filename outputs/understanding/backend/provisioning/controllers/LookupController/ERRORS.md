# LookupController — Errors

> Subset of [`provisioning/ERRORS.md`](../../ERRORS.md) relevant to LookupController.

## By Endpoint

| Endpoint | Possible Errors | HTTP Status |
|---|---|---|
| `GET /api/Lookup/{id}` | (none — no `FalconException` paths in the handler) | `200 OK` (empty list for unknown `id` or no matches) |

LookupController is the **only Falcon backend endpoint with no business-error vocabulary** — every input path either succeeds with a list (possibly empty) or hits a framework-level error (401/403/500) that is not Provisioning-owned.

## Domain Error Codes (None Raised Here)

[CODE] `Falcon.Provisioning.Domain/Constants/FalconKeys.cs`:
```csharp
public class Error
{
    public const string DuplicateTenantName = nameof(DuplicateTenantName);
    public const string InternalServerError = nameof(InternalServerError);
    public const string CommChannelNotFound = nameof(CommChannelNotFound);
    public const string ApplicationNotFound = nameof(ApplicationNotFound);
    public const string CannotHideActiveService = nameof(CannotHideActiveService);
    public const string UnauthorizedAction = nameof(UnauthorizedAction);
    public const string UnauthorizedUserToPerformThisAction = nameof(UnauthorizedUserToPerformThisAction);
}
```

**None** of these are thrown from `ListLookupHandler` or `LookupController`. The only one that could surface here is `InternalServerError`, and only if the global exception filter catches a Mongo connectivity exception.

## Framework-Level Errors

| Cause | HTTP | Body Shape |
|---|---|---|
| No `Authorization` header | `401 Unauthorized` | Empty / framework default |
| Invalid/expired JWT | `401 Unauthorized` | Empty / framework default |
| JWT valid but gateway policy fails (e.g. Falcon user via Core Gateway → `ClientOnly` mismatch, or vice versa) | `403 Forbidden` | Depends on gateway — typically empty |
| Route param missing (`/api/Lookup` instead of `/api/Lookup/some-id`) | `404 Not Found` | Empty / framework default |
| MongoDB unreachable | `500 Internal Server Error` | `ServiceOperationResult<T>.Failure(new FalconError(FalconKeys.Error.InternalServerError))` via global exception filter |
| Unsupported `Accept-Language` reaching `TranslateHelper` | (cannot happen — `CurrentCulture` always returns `"ar"` or `"en"`) | — |

## Edge Cases

| Input | Behavior |
|---|---|
| `{id}` is whitespace | LINQ filter `lv.LookupId == query.Id` won't match (Mongo `ObjectId` field) → `200 OK` with `result: []` |
| `{id}` is a non-ObjectId string | Same as above — no match → `200 OK` with `result: []` |
| `?name=` (empty) | Treated as null → no `name` filter applied |
| `?code=` (empty) | Treated as null → no `code` filter applied |
| `?name` with regex metachars (`?name=.*`) | [INFERRED] **PENDING-QUESTION** — depends on whether the MongoDB.Driver expression translator escapes regex metacharacters. If not, this is a low-severity wildcard-search exposure. See VALIDATIONS.md #PENDING. |
| Mongo collection has no matching `LookupId` | `200 OK`, `result: []` |
| Mongo collection has matches, all in different culture | Translation still succeeds (both `En` and `Ar` are non-nullable on `MultiLanguageName`); response carries the chosen culture |

## Idempotency

GET is **idempotent** by HTTP spec. Calling the same URL twice returns the same result (modulo concurrent writes to `LookupValues` collection, which the platform doesn't currently emit).

## Concurrency

No write path. No optimistic concurrency. No locking.

## Internal Server Error Behavior

When `IRepository<LookupValue>.GetListAsync` throws (Mongo connectivity, deserialization mismatch, etc.):
1. Global exception filter catches it
2. Logs via Serilog
3. Returns `500` with `ServiceOperationResult<T>.Failure(InternalServerError)` body — the standard Falcon shape

[INFERRED] Inferring from [VAULT] `Home/Software-Architecture-Design/Design-Patterns-&-Guidelines.md` (platform standard) — verify the actual implementation in `Falcon.Provisioning.Api/Middlewares/` if not previously catalogued at service-level [`provisioning/ERRORS.md`](../../ERRORS.md).

## Pending Questions

1. **Regex metacharacter escaping** in `string.Contains` / `string.StartsWith` LINQ-to-Mongo translation. Flagged in VALIDATIONS.md. Low-severity but should be confirmed before exposing the endpoint publicly without rate-limiting on the search params.
2. **Case-sensitivity of `Contains`** — flagged in OVERVIEW.md Findings #3. PRD-01 (Add Client wizard) implies case-insensitive search but the LINQ expression compiles to case-sensitive Mongo match. Recommend PRD clarification.
