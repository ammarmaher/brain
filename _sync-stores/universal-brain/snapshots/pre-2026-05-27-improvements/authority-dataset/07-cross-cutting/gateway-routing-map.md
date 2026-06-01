---
type: cross-cutting
topic: gateway-routing
purpose: "Answers 'which gateway (System :7256 vs Core :7038) does each app use + how is it wired'. Open when configuring app gateway, debugging auth/tenancy routing, or implementing a cross-console feature."
sources:
  - Falcon/falcon-web-platform-ui/apps/admin-console/src/app/app.config.ts
  - Falcon/falcon-web-platform-ui/apps/management-console/src/app/app.config.ts
  - Falcon/falcon-int-system-gateway-svc
  - Falcon/falcon-int-core-gateway-svc
---

# Gateway Routing Map — Falcon vs Client

> [!tldr]
> Two YARP gateways. Falcon staff (sys-*) hit System Gateway (`:7256`). Client users (acc-*) hit Core Gateway (`:7038`). Each Angular app sets a default gateway via `provideAppDefaultGateway()`. Both apps share the same backend services downstream — the gateway choice is a tenancy / auth-scope decision, not a feature-routing decision.

## Gateways

| Gateway | Port | YARP repo | Default for |
|---|---|---|---|
| System Gateway | `:7256` | `falcon-int-system-gateway-svc` | admin-console (Falcon staff) |
| Core Gateway | `:7038` | `falcon-int-core-gateway-svc` | management-console (Client tenants) |

Both gateways:
- Validate the JWT (signature, expiry, issuer)
- Forward the request to the downstream service (Commerce / Charging / Provisioning / Identity / Templates / Contact Group)
- Do **NOT** call PES — gating is FE-only per platform standing rule

## App default gateway

Admin console — `apps/admin-console/src/app/app.config.ts`:
```typescript
provideAppDefaultGateway(Gateway.SystemGateway)
```

Management console — `apps/management-console/src/app/app.config.ts`:
```typescript
provideAppDefaultGateway(Gateway.CoreGateway)
```

Services in either app that need to override the default use `useGateway(Gateway.X)` explicitly.

## What the gateway flip changes when copying admin → mgmt

| Aspect | admin-console (System Gateway) | management-console (Core Gateway) |
|---|---|---|
| Base URL token | `baseURLSystemGateway` | `baseURLCoreGateway` |
| App default | `Gateway.SystemGateway` | `Gateway.CoreGateway` |
| Falcon-only endpoints (master wallet, wallet-transfer) | Routed | Not routed (returns 404) |
| Tenant-scoping | None — Falcon staff sees all tenants | JWT tenant-id scopes every request |
| Auth header | Same JWT issued by Identity | Same JWT issued by Identity |
| YARP route table | Includes `sys.*` resource patterns | Includes `acc.*` resource patterns |

## Downstream services (shared)

Both gateways forward to the same downstream services. The downstream service uses the JWT's `user-type` and `tenant-id` claims to enforce tenancy:

| Service | Port | Owns |
|---|---|---|
| Identity | `:7777` | Users, sessions, OTP |
| Commerce | `:7045` | Tenants, contracts, contact groups, org hierarchy |
| Charging | `:7224` | Wallets, balance transfers, ledger |
| Provisioning | `:7163` | Service subscriptions |
| Contact Group | (subset of Commerce) | Contact-group CRUD |
| PES (Access) | `:5296` | Policy enforcement (FE calls directly) |

## Code-grounded gateway-aware service example

```typescript
// admin-console reads from System Gateway by default
// management-console reads from Core Gateway by default
@Injectable()
export class CommerceActionsService {
  // useGateway() — picks up the app default
  enableCommChannel(nodeId: string, channelId: string) {
    return this.http.post(useGateway() + `/commerce/Node/${nodeId}/comm-channels/${channelId}/enable`, {});
  }
}
```

## See also

- `04-feature-parity-matrix/MATRIX.md` — every feature's gateway choice
- [[../03-pes-keys/REGISTRY-RAW]] — PES key universe (gating is FE; gateway is forwarding)
- [[session-shape]] — what's in the JWT each gateway forwards
