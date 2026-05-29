# CommunicationChannelController — Errors

## Error Codes per Endpoint

### `GET /api/CommunicationChannel`

| Code | HTTP | Trigger | Source |
|---|---:|---|---|
| `Unauthorized` | 401 | No / invalid JWT | Middleware |
| `InternalServerError` | 500 | Mongo unreachable | Middleware |
| `UnknownError` | 500 | Translation helper failure | Middleware |

No business-level errors are raised — pure read with no validation gates.

## Empty-Catalog Behavior

```json
{ "isSuccessful": true, "result": [], "errorMessages": [] }
```

## Cross-Reference

- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/13-error-catalog/CATALOG.md`
- [CODE] `Falcon.Commerce.Domain/Constants/FalconKeys.cs`
