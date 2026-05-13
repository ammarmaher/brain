# System Gateway — Validations

## DTO-Level Validation

None observed. The gateway forwards requests largely untouched — validation is delegated to the downstream service.

## Authorization-Level Validation

Class-level `FalconOnly` policy on both endpoint groups (`CommerceEndpointGroup`, `TestingChargingEndpointGroup`). Every endpoint requires:
- Valid Zitadel JWT
- JWT has Falcon user-type claim

YARP routes also enforce `FalconOnly`. So a non-Falcon JWT is rejected at the gateway boundary regardless of route.

## Feature Flag Gating

`Settings:TestingCharging:Enabled` — bound from config. When `false`, all 10 TestingCharging endpoints return HTTP 404 with body:

```json
{
  "isSuccessful": false,
  "result": null,
  "errorMessages": ["TestingChargingDisabled"]
}
```

(Or the localized message — depends on whether the gateway runs through `ErrorLocalizer`. Verify.)

## Defense-in-Depth on Aggregations

`GetAccountHierarchyEndpoint` (System Gateway version):
- Tenant id is read from Commerce's response (`commerceResult.TenantId`) — defensive because admins have no tenant claim
- If `TenantId` is empty in Commerce response when `WalletBalanceType == UserBased`, the gateway returns HTTP 502 with `IdentityTenantIdMissing` error code. This is a degraded-service indicator: Commerce should have a tenant id for any node that has UserBased wallets.

## No IP Allowlist Enforcement

The System Gateway **does not** enforce per-tenant IP allowlists. Falcon admins are presumed to come from trusted networks (VPN, office IP whitelist managed elsewhere). Verify whether there's a global IP filter at the load-balancer level in production.

## No Per-Tenant Rate Limiter

The `RateLimiting` config section is absent in System Gateway's `appsettings.json`. Verify whether any global rate limiter applies — if not, admin actions are unrate-limited.

## No Kafka Consumer

System Gateway is **stateless** — no IP allowlist refresh, no event-driven cache invalidation.

## Multi-Language

n/a — gateway is transport-only.

## ServiceOperationResult Pass-Through

YARP routes preserve the downstream envelope. Aggregation endpoints emit `ServiceOperationResult<T>`. Forwarding endpoints (TestingCharging) re-wrap the downstream response as the gateway's own SOR when needed (only on the 404 disabled case — successful forwards pass through the original payload).

## Implicit Trust Model

Admins are highly privileged — they can:
- Read any tenant's data (no tenant-scoping)
- Mutate real wallet balances via `whatsapp/batches` (BFF for Charging Lab)
- Update price types and visibility on any account's services (via Commerce passthrough → FalconOnly endpoints)

The gateway does **not** add audit logging — verify this happens at the downstream services.
