# TestingAccountsController — Errors

## Error Codes per Endpoint

### `GET /api/testing/accounts`

| Code | HTTP | Trigger | Source |
|---|---:|---|---|
| (none — empty body) | 404 | Feature flag `TestingCharging.Enabled = false` | `TestingAccountsController.cs:32` |
| `Unauthorized` | 401 | No / invalid JWT | Middleware |
| `InternalServerError` | 500 | Mongo / Identity unreachable | Middleware |
| `ExternalServiceError` | 500 | `IIdentityClient.GetUsersByTenantAsync` failure | Middleware |

No business-level errors. Validation logic is parameter normalization only.

## 404 Behavior (Feature Flag Off)

`return NotFound();` — produces a bare 404 with no JSON body. Frontend / tooling must distinguish:
- 404 with empty body → feature off
- 404 with `ServiceOperationResult` body → resource missing (not applicable to this endpoint)

## Empty Result Behavior

When no accounts match the filter:

```json
{
  "isSuccessful": true,
  "result": { "page": 1, "pageSize": 50, "totalCount": 0, "items": [] },
  "errorMessages": []
}
```

## Cross-Reference

- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/13-error-catalog/CATALOG.md`
