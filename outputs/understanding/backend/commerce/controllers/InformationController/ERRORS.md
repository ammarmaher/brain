# InformationController — Errors

## Error Codes per Endpoint

### `GET /api/Information`

| Code | HTTP | Trigger | Source |
|---|---:|---|---|
| `Unauthorized` | 401 | No / invalid JWT | Middleware |
| `InternalServerError` | 500 | Mongo unreachable | Middleware |
| `UnknownError` | 500 | Catch-all | Middleware |

**No 404** — if NodeId doesn't match, returns 200 with empty / null fields inside SOR.

### `PUT /api/Information`

| Code | HTTP | Trigger | Source |
|---|---:|---|---|
| `UpdateRequestCantBeNull` | 400 | Command is null | `UpdateMainNodeInfoHandler.cs:31` |
| `DuplicateTenantName` | 409 | Falcon admin tried name already used by another Main node | `UpdateMainNodeInfoHandler.cs:45` |
| `NodeNotFound` | 404 | NodeId doesn't resolve | `UpdateMainNodeInfoHandler.cs:115` |
| `Unauthorized` | 401 | No / invalid JWT | Middleware |
| `InternalServerError` | 500 | Mongo unreachable | Middleware |

### From Value Object Construction

| Code | HTTP | Trigger |
|---|---:|---|
| Various domain codes (Address, NodeName) | 400 / 422 | Invalid Address combos, NodeName too long |
| Image-validation codes (size, MIME) | 400 | Bad profile picture upload |

These bubble through the domain `Address.Create`, `NodeName.Create`, and `ExtractValidatedBytes` paths. Exact codes depend on the domain layer — verify against:
- [CODE] `Falcon.Commerce.Domain/ValueObjects/Node/Address.cs`
- [CODE] `Falcon.Commerce.Domain/ValueObjects/Node/NodeName.cs`
- [CODE] `Falcon.Commerce.Domain/Helpers/ImageValidationExtensions.cs` (inferred)

## Cross-Reference

- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/13-error-catalog/CATALOG.md`
- [CODE] `Falcon.Commerce.Domain/Constants/FalconKeys.cs`
