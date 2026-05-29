# TestingAccountsController — Endpoints

> Class route prefix: `/api/testing/accounts` ([CODE] `TestingAccountsController.cs:17`).

## Read Endpoint

| Method | Route | Action | Request | Response (T in SOR) | Handler |
|---|---|---|---|---|---|
| GET | `/api/testing/accounts?search=&page=&pageSize=` | `List` | (3 optional query params) | `TestingAccountListResponse` | `ITestingListAccountsHandler.ExecuteAsync(...)` |

### Source

[CODE] `TestingAccountsController.cs:25-42`

```csharp
[HttpGet]
public async Task<ActionResult<ServiceOperationResult<TestingAccountListResponse>>> List(
    [FromQuery] string? search,
    [FromQuery] int page,
    [FromQuery] int pageSize)
{
    if (!settings.Value.TestingCharging.Enabled)
        return NotFound();

    var result = await testingListAccountsHandler.ExecuteAsync(new TestingAccountListQuery
    {
        Search = search,
        Page = page <= 0 ? 1 : page,
        PageSize = pageSize <= 0 ? 50 : pageSize
    });
    return Ok(ServiceOperationResult<TestingAccountListResponse>.Success(result));
}
```

### Parameters

| Param | Type | Required | Default | Notes |
|---|---|---|---|---|
| `search` | string? | No | null | Case-insensitive substring on account `Name` |
| `page` | int | No | 1 if `<= 0` | 1-based page index |
| `pageSize` | int | No | 50 if `<= 0`, clamped `[1, 100]` | |

### Feature Flag

- `settings.Value.TestingCharging.Enabled = false` → endpoint returns **404 NotFound**
- This is the ONLY production guard — verify production `appsettings.json:Settings:TestingCharging:Enabled = false`

### PES Key

| Endpoint | Frontend PES | Backend Gate |
|---|---|---|
| `GET /api/testing/accounts` | N/A — internal QA tool | `[Authorize]` + feature flag |

### Status Codes

| Status | When |
|---|---|
| 200 | Success — paged response |
| 401 | No / invalid JWT |
| 404 | Feature flag off (`TestingCharging.Enabled = false`) |
| 500 | Mongo / Identity unreachable |

## Endpoint Count by HTTP Verb

| Verb | Count |
|---|---:|
| GET | 1 |
| **Total** | **1** |
