# ApplicationController — Validations

## DTO-Level Validation

**None.** Endpoint takes no parameters.

## Authorization Validation

- `[Authorize]` at class level → caller must have a valid JWT
- No `[Authorize(Policy=FalconOnly)]` override → Falcon AND Client JWTs both pass

## Handler-Level Validation

[CODE] `ListApplicationsHandler.cs:20-39` — no validation. The handler issues a `GetListAsync(_ => true)` and projects with translation.

```csharp
public async Task<ListApplicationsResult> ExecuteAsync()
{
    var applications = await _applicationRepo.GetListAsync(
        _ => true,
        app => new { app.Id, app.Name });
    return new ListApplicationsResult { ... };
}
```

## Cross-Field Validation

**None.**

## Order of Validations

1. `[Authorize]` JWT check → 401 if missing/invalid
2. Controller action → handler → Mongo → translation → AutoMapper

## Findings

- **No filtering, no search, no paging** — full catalog every call. For UI lazy-loading or autocomplete patterns, the frontend must filter client-side.
- **No tenant-scoped filtering** — the application catalog is global. Per-account visibility lives in `Node.Applications[]` (handled by `NodeController.GetAccountApplications`).
- **Translation is locale-bound** — calls to this endpoint from different `Accept-Language` headers return different `name` strings for the same `id`. Cache key planning must include locale.
