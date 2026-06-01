# AccountHierarchyController — Errors

> Subset of `commerce/ERRORS.md` relevant to the single GET endpoint. Cross-link: [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/13-error-catalog/CATALOG.md`.

## Error Code Map per Endpoint

### `GET /api/accounts/hierarchy`

| Code | HTTP Status | Trigger | Source line |
|---|---:|---|---|
| `AccountIdRequired` | 400 | `query.AccountId` is null/empty | `GetAccountHierarchyHandler.cs:106` |
| `NodeNotFound` | 404 | Account node lookup miss | `GetAccountHierarchyHandler.cs:51` |
| `MainNodeOnlyOperation` | 422 | `accountNode.NodeType != Main` (caller passed a sub-node id) | `GetAccountHierarchyHandler.cs:54` |
| `NodeNotFound` (subtree) | 404 | Subtree root node (from `_currentUser.NodeId` clamp) missing | `GetAccountHierarchyHandler.cs:117` |
| `Unauthorized` | 401 | No / invalid JWT | Middleware |

## Validation Errors (not raised by this endpoint)

None of the `[ThrowIf*]`-family errors fire — the controller binds primitives without attributes. See `VALIDATIONS.md` for the gap analysis.

## Infrastructure / External Errors

| Code | HTTP Status | When |
|---|---:|---|
| `InternalServerError` | 500 | Mongo unreachable, deserialization failure, etc. |
| `UnknownError` | 500 | Catch-all in `ExceptionHandlerMiddleware` |

## Missing Errors (drift candidates)

The handler does **not** raise `OwnerIdNotMatchWithTenantId` when a client user requests another tenant's `accountId`. Compared to `GetSettingsHandler` (which does) and `GetWalletSettingsHandler` (which does), this is an **entity-drift gap (F-004)**. See `_pending-questions/wave-5a-AccountHierarchyController-tenant-isolation.md`.

## Error response shape

```json
{
  "isSuccessful": false,
  "result": null,
  "errorMessages": ["Account id is required"]
}
```

with the HTTP status from the table above.

## Cross-References

- [BRAIN-OUT] `Brain Outputs/datasets/authority-dataset/13-error-catalog/CATALOG.md` — full Commerce error catalog
- [VAULT] `falcon-wiki/Home/Software-Architecture-Design/Account-Management-Module.md` — account-management rules (Wiki)
- [CODE] `Falcon.Commerce.Domain/Constants/FalconKeys.cs` — error code constants + `[ErrorHttpStatus(NNN)]` decorations
