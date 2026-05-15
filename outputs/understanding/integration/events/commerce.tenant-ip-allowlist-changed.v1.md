*** Kafka Event — Tenant IP Allowlist Changed ***
*** Discovered 2026-05-15 by Brain SK Phase 3C — Kafka topology ***
*** Source: commerce/SERVICE_OVERVIEW.md + core-gateway/SERVICE_OVERVIEW.md + core-gateway/VALIDATIONS.md + GATEWAY_ROUTE_MAP.md ***

# commerce.tenant-ip-allowlist-changed.v1

> Commerce broadcasts that a tenant's IP allowlist was updated. Core Gateway invalidates its Redis cache so the next request uses the new list.

## Topic / channel

- **Topic name (verbatim):** `commerce.tenant-ip-allowlist-changed.v1`
- **Channel type:** Kafka
- **Schema:** Avro

## Producer

- **Service:** [[Commerce Service]]
- **Publisher class:** `TenantIpAllowlistChangedEventPublisher`
- **Trigger:** Admin saves the IP allowlist on the tenant Settings page (Account Limitations / IP allowlist section). Commerce is the source of truth for the allowlist; Identity enforces at preprocessor time; Core Gateway enforces at middleware time with a Redis cache.
- **Payload shape:** `inferred` — likely `{ TenantId, AllowlistVersion, IpEntries: [{ Cidr, Label }], UpdatedAt, ActorUserId, CorrelationId }`. **`not documented in Brain Outputs · would need source code scan`**.

## Consumer(s)

- **Service:** [[Core Gateway Service]] — `TenantIpAllowlistChangedConsumer`
  - Updates the Redis key `tenant:<id>:ipAllowlist:v1` (`IpAllowlistKey(tenantId)`) so the IP allowlist middleware reads the new list on the next request.
  - Tests: `tests/Falcon.Core.Gateway.Tests/TenantIpAllowlistChangedConsumerTests.cs` cover the consumer paths.

## Idempotency

- **Partially documented.** The consumer overwrites the Redis key — idempotent by overwrite semantics. No documented dedup-on-version-number check, so out-of-order delivery could roll back to an older allowlist briefly.

## Error path

- **Documented in part.** The IP allowlist middleware (which reads from Redis) has `GatewaySettings:IpAllowlist:FailOpenOnRedisError: true` — if Redis is unreadable, the gateway **allows** the request rather than blocks (liveness-over-security tradeoff). The Kafka consumer's behavior on Redis-write failure: log + skip rather than retry indefinitely (per VALIDATIONS.md). **No DLQ documented.**

## Side effects (chain)

- Next request from this tenant uses the new allowlist.
- System Gateway has **no** consumer for this topic — admin traffic is not allowlist-gated (admins are tenant-less; trusted).
- Identity enforces the allowlist at its `IpAllowlistPreProcessor` separately (reads from Commerce, not from the Redis cache).

## Related PRDs

- [[01 Account Management]] — primary (tenant settings)
- [[02 User Management]] — login-side enforcement

## Related V-rules

- [[V-account-ip-allowlist-enforcement]] — `IpNotAllowed` (403) — enforced at both gateway and Identity preprocessor

## Related entity reconciliation

- E-AccountSettings.IpAllowlist (Commerce) ↔ Redis cache (Core Gateway) ↔ Identity IpAllowlistPreProcessor reads

## Gaps / drift

- Out-of-order delivery — no version-number check documented, so a late-arriving older snapshot could overwrite a newer one.
- Fail-open on Redis error is a documented liveness/security tradeoff — should be reviewed for production.
- DLQ not defined.

## Hubs

- [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[AMMAR_BRAIN_HOME]]
