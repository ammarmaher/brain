# SecurityController — Errors

## Error Codes per Endpoint

### `GET /api/Security/ip-allowlists`

| Code | HTTP | Trigger | Source |
|---|---:|---|---|
| `InternalServerError` | 500 | Mongo unreachable | Middleware |
| `UnknownError` | 500 | Catch-all | Middleware |

**No 401 / 403** — endpoint is anonymous.

No business-level errors are raised.

## Empty Behavior

If no tenants have IP allowlists configured:

```json
{
  "isSuccessful": true,
  "result": { "tenants": {} },
  "errorMessages": []
}
```

## Cross-Reference

- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/13-error-catalog/CATALOG.md`
- [VAULT] `falcon-wiki/Home/Software-Architecture-Design/Security-Architecture.md`
