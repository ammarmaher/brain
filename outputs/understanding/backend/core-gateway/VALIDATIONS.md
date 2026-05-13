# Core Gateway — Validations

## DTO-Level Validation

Gateway aggregation DTOs are simple request shapes (`GetAccountHierarchyRequest`, `GetAccountContractRequest`). No FluentValidation observed — validation is delegated to:
1. The downstream service's validation (gateway is a thin shim)
2. Tenant scoping enforced by the gateway endpoint itself (`currentUser.TenantId` always wins)

## Authorization-Level Validation

| Surface | Policy |
|---|---|
| YARP `identity-auth-proxy` | `Anonymous` |
| YARP `identity-proxy`, `commerce-proxy`, `provisioning-proxy`, `charging-proxy`, `contactgroup-proxy` | `ClientOnly` |
| All 3 aggregation endpoints (`CommerceEndpointGroup`) | `ClientOnly` |

`ClientOnly` policy: defined in `Falcon.Core.Gateway.Infrastructure.Auth.AuthorizationPolicies`. Requires:
- Valid Zitadel JWT
- Has the tenant claim (`currentUser.TenantId` non-empty)

## Defense-in-Depth Validation in Aggregations

| Check | Code Location |
|---|---|
| Tenant id from JWT is non-empty before downstream calls | `GetAccountHierarchyEndpoint`, `GetAccountContractEndpoint`, `ListAccountContractsEndpoint` — all `return Send.UnauthorizedAsync()` if tenant claim is missing |
| Cross-tenant contract access prevented | `GetAccountContractEndpoint`: after fetching the contract from Commerce, **enforces** `contract.AccountId == JWT.TenantId` and returns `Send.ForbiddenAsync()` otherwise. This is a **defense-in-depth** check — even if Commerce returns a contract the client shouldn't see, the gateway blocks it. |
| `CanEdit = false` overlay | `GetAccountContractEndpoint`: regardless of what Commerce reports, the gateway forces `CanEdit = false` for client users (management-console only allows view). |

## Rate Limiting

`RateLimiting:PermitLimit = 100`, `WindowInSeconds = 60`, `QueueLimit = 0`. Applied as the `PerTenant` policy on every authenticated route. Bucket key: tenant id from JWT.

Exceeded → HTTP 429.

## IP Allowlist

Pre-middleware that runs **before** YARP forwarding. Per-tenant allowlist looked up in Redis (`tenant:<id>:ipAllowlist:v1`). On Redis error, gateway fails open (`FailOpenOnRedisError: true` — allows the request). On allowlist mismatch, returns HTTP 403 with `IpNotAllowed`.

(Note: I have not deep-read the middleware code — verify whether the implementation matches this inferred behavior.)

## Kafka Consumer Validation

`TenantIpAllowlistChangedConsumer` processes events from `commerce.tenant-ip-allowlist-changed.v1`. The consumer should:
- Validate the event payload shape (Avro deserialization handles this)
- Update the Redis cache for the affected tenant
- Handle Redis failures gracefully (log + skip rather than retry indefinitely)

Tests at `tests/Falcon.Core.Gateway.Tests/TenantIpAllowlistChangedConsumerTests.cs` cover the consumer paths.

## Multi-Language

n/a — gateway is transport-only.

## ServiceOperationResult Pass-Through

Gateway aggregation endpoints return `ServiceOperationResult<T>` directly. YARP proxy routes preserve the downstream response shape byte-for-byte — Commerce/Charging/Identity/Provisioning/ContactGroup all return `ServiceOperationResult<T>`, so the client sees a consistent envelope regardless of route.
