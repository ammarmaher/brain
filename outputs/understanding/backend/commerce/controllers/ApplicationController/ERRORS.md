# ApplicationController — Errors

> Subset of `commerce/ERRORS.md`. Cross-link: [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/13-error-catalog/CATALOG.md`.

## Error Codes per Endpoint

### `GET /api/Application`

| Code | HTTP | Trigger | Source |
|---|---:|---|---|
| `Unauthorized` | 401 | No / invalid JWT | Middleware |
| `InternalServerError` | 500 | Mongo unreachable | Middleware |
| `UnknownError` | 500 | Translation helper failure (corrupt locale data) | Middleware |

No business-level errors are raised — this is a pure read with no validation gates.

## Empty-Catalog Behavior

When the `Application` collection is empty, returns:

```json
{ "isSuccessful": true, "result": [], "errorMessages": [] }
```

(NOT 404, NOT an error — empty array is the expected unconfigured state.)

## Cross-Reference

- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/13-error-catalog/CATALOG.md`
- [CODE] `Falcon.Commerce.Domain/Constants/FalconKeys.cs`
