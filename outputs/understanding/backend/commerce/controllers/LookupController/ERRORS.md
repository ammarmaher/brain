# LookupController — Errors

## Error Codes per Endpoint

### `GET /api/Lookup/{id}`

| Code | HTTP | Trigger | Source |
|---|---:|---|---|
| `Unauthorized` | 401 | No / invalid JWT | Middleware |
| `InternalServerError` | 500 | Mongo / translation failure | Middleware |

No business-level errors. Unknown `id` returns empty list (HTTP 200).

## Empty / Unknown Lookup ID

```json
{ "isSuccessful": true, "result": [], "errorMessages": [] }
```

Frontend cannot distinguish:
- "this lookup is empty"
- "this lookup id doesn't exist"

If PRD requires distinguishing these, **F-004 drift candidate**.

## Cross-Reference

- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/13-error-catalog/CATALOG.md`
- [CODE] `Falcon.Commerce.Domain/Constants/FalconKeys.cs`
