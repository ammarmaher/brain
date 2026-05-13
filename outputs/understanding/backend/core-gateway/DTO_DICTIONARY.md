# Core Gateway — DTO Dictionary

> Source: `Falcon.Core.Gateway/Contracts/Shared/` + `Falcon.Core.Gateway/Features/{AccountHierarchy,Contracts}/Models/`.

## Aggregation DTOs

### AccountHierarchy

| Name | Direction | Notes |
|---|---|---|
| `GetAccountHierarchyRequest` | request | `string Id, eCurrency? Currency, eWalletBalanceType? BalanceDistribution, eWalletBaseType? WalletStructure` |
| `AccountHierarchyResponse` | response | Combined node tree with merged user data + wallet balances |
| `CommerceGetAccountHierarchyResponse` | internal | The shape returned by Commerce's `/api/accounts/hierarchy` — used only inside the gateway to deserialize before merging |
| `ChargingGetAccountWalletsRequest` | internal | Request shape forwarded to Charging |
| `ChargingGetAccountWalletsResponse` | internal | Response shape from Charging — merged into the final `AccountHierarchyResponse` |
| `IdentityTenantUserResponse` | internal | Shape returned by Identity's east-west `GET /user/by-tenant` — merged into hierarchy nodes |
| `AccountHierarchyMapper` (static) | logic | `MergeUsersIntoHierarchy(hierarchy, users)`, `MapToResponse(chargingResult, commerceResult)` |

### Contracts

| Name | Direction | Notes |
|---|---|---|
| `GetAccountContractRequest` | request | `string ContractId` (route) |
| `ContractListResponse` | response | Reused from Commerce contracts shape; the gateway just overlays `RemainingBalance` |
| `ContractResponse` | response | Single-contract shape (Commerce's), with `RemainingBalance` and `CanEdit=false` overlaid |
| `ContractBalanceSummariesResponse` | internal | Shape from Charging — used for balance overlay |
| `ContractBalanceSummaryResponse` | internal element | `{ ContractId, AvailableAmount }` |

### Service Operation Result

`ServiceOperationResult<T>` is reused from a shared contracts library or re-defined in the gateway — verify. The `HttpResponseHandler` class envelopes upstream responses and unwraps the SOR shape transparently.

## HTTP Plumbing

| Type | Purpose |
|---|---|
| `HttpResponseHandler` (static) | Generic helper: `HandleResponseAsync<T>(HttpResponseMessage)` returns `(IsSuccess, ErrorResponse, Result)` where `Result` is the deserialized SOR wrapper. Lets gateway handlers translate downstream failures into HTTP responses without ad-hoc try/catch. |
| `ServiceOperationResult<T>` envelope | All upstream Falcon services return this shape; gateway unwraps `IsSuccessful` to decide whether to forward error to client (with original HTTP status) or extract `Result` to use. |

## Vocabulary

| Term | Meaning |
|---|---|
| `Cluster` | YARP destination group — keyed by `FalconKeys.Clusters.<Name>` (`commerce-cluster`, etc.) |
| `Route` | YARP route definition — `Match.Path` + `ClusterId` + `AuthorizationPolicy` + `RateLimiterPolicy` + `Transforms` |
| `Transform` | YARP path-rewrite step — `{ PathRemovePrefix: "/commerce" }` then `{ PathPrefix: "/api" }` |
| `ClientOnly` policy | Caller's JWT must have a tenant claim |
| `Anonymous` policy | No auth required (used for `identity-auth-proxy`) |
| `PerTenant` rate limit policy | Bucket per tenant id, 100 requests / 60 seconds, queue limit 0 |
