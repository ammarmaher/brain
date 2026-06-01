# SecurityController — Frontend Contract

## Frontend Visibility

**This is NOT a frontend endpoint.** It is an east-west service-to-service contract between Commerce and the Core Gateway.

The web platform UIs (`admin-console`, `host-shell`, `management-console`) do NOT call this endpoint. Frontend developers should never wire HTTP services for it.

## Internal Service-to-Service URL

| Service URL | Caller | Auth |
|---|---|---|
| `GET commerce:7045/api/Security/ip-allowlists` (internal Docker / K8s) | Core Gateway (startup seed) | None — `[AllowAnonymous]` |

## Headers

- `Accept: application/json`

(No `Authorization` header. The Gateway and Commerce share a private network.)

## Request

No body, no params.

## Response (Success)

```json
{
  "isSuccessful": true,
  "result": {
    "tenants": {
      "tenant-acct-001": {
        "enabled": true,
        "allowedIps": ["10.0.0.0/24", "203.0.113.42"]
      },
      "tenant-acct-002": {
        "enabled": false,
        "allowedIps": []
      },
      "tenant-acct-003": {
        "enabled": true,
        "allowedIps": ["192.168.0.0/16"]
      }
    }
  },
  "errorMessages": []
}
```

- `tenants` is a JSON object keyed by tenant id
- `enabled` is server-derived (`allowedIps.length > 0`)
- `allowedIps` is the literal stored list (may be empty when `enabled: false`)

## Pagination

**Not paginated.** Returns all tenants in one shot. For a platform with thousands of tenants this is heavy — verify Gateway caches the response and refreshes infrequently.

## Multi-Step Flows

### Gateway cold-start seed

1. Gateway boots
2. Gateway issues `GET commerce:7045/api/Security/ip-allowlists`
3. Response is iterated; each tenant's allowlist is written to Redis at `tenant:{tenantId}:ipAllowlist:v1`
4. Subsequent requests through the gateway pass through the IP allowlist middleware which reads from Redis (sub-millisecond hit)

### Gateway mid-life sync (Kafka)

1. Falcon admin calls `PUT /commerce/setting` with `securitySettings.allowedIps: [...]`
2. Commerce writes Mongo + publishes `TenantIpAllowlistChangedEvent`
3. Gateway's Kafka consumer overwrites Redis `tenant:{tenantId}:ipAllowlist:v1`
4. The next request from that tenant uses the new allowlist immediately

(Note: **mid-life sync uses Kafka, not this HTTP endpoint.** This endpoint is cold-start only.)

## Casing & Path Conventions

- Route: `/api/Security/ip-allowlists` — note the **lowercase plural with hyphens** in the action segment
- JSON wire: camelCase fields

## Cross-References

- [VAULT] `falcon-wiki/Home/Software-Architecture-Design/Security-Architecture.md` — IP allowlist enforcement model + east-west contract
- [CODE] `falcon-int-core-gateway-svc/src/.../ipAllowlistMiddleware.cs` (inferred — verify in Gateway codebase)
- [CODE] `Falcon.Commerce.Application/Events/TenantIpAllowlistChangedEvent.cs` — Kafka counterpart
- [BRAIN-OUT] `Brain Outputs/understanding/backend/core-gateway/` (if present) — Gateway dossier
