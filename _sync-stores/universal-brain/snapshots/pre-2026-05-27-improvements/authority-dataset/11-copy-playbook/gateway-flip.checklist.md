---
type: checklist
cluster: 11-copy-playbook
title: Gateway Flip — SystemGateway → CoreGateway (+ override-handling)
purpose: "Answers 'how to drop explicit useGateway(SystemGateway) overrides + which two overrides (ChargingGateway, IdentityGateway) stay'. Open during Step 4 of the 12-step port recipe."
extracted: 2026-05-16
---

# Checklist · Gateway Flip (Step 4)

> [!tldr]
> The mgmt-console default gateway is `Gateway.CoreGateway`, provided once at app boot via `provideAppDefaultGateway(Gateway.CoreGateway)` in `app.config.ts`. Most explicit `useGateway(Gateway.SystemGateway)` calls in copied services just need the override **dropped** — the default takes over. Two overrides stay: `Gateway.ChargingGateway` (wallet transfer) and `Gateway.IdentityGateway` (Identity is gateway-agnostic).

## How gateway resolution works

`[CODE] libs/falcon/src/shared-data-access/lib/runtime-config/runtime-api-config.ts:128-137` exposes `useGateway()`; the interceptor at `[CODE] runtime-base-url.interceptor.ts:29-39` reads `USE_GATEWAY_CONTEXT` + optional `SPECIFIC_GATEWAY_CONTEXT` per-call.

### Default-gateway wiring

`apps/admin-console/src/app/app.config.ts:52` (admin):
```typescript
provideAppDefaultGateway(Gateway.SystemGateway)
```

`apps/management-console/src/app/app.config.ts:52` (mgmt):
```typescript
provideAppDefaultGateway(Gateway.CoreGateway)
```

`[CODE] wallet-balance-management.compare.md:37` confirms the split: System Gateway (`:7256`) for admin; Core Gateway (`:7038`) for mgmt.

### Per-call override pattern

```typescript
// Admin-side — typically arg-less, inherits the System default
return this.useGateway()
  .get('commerce/Node/...')
  ...

// Or with an explicit override:
return this.useGateway(Gateway.IdentityGateway)
  .post('identity/auth/...')
  ...
```

When porting admin → mgmt, the **arg-less call** flips semantics automatically (now resolves to CoreGateway). It's the **explicit overrides** that need careful handling.

## Three rules for handling overrides

### Rule 1 — Drop `useGateway(Gateway.SystemGateway)` overrides

If you see explicit `useGateway(Gateway.SystemGateway)` in copied service code, **drop the argument**:

```typescript
// Before (admin source):
this.useGateway(Gateway.SystemGateway).get('commerce/Node/.../comm-channels')

// After (mgmt port):
this.useGateway().get('commerce/Node/.../comm-channels/visible/details')
```

Why: the mgmt app default already picks Core Gateway. Leaving the explicit `Gateway.SystemGateway` override forces a System call, which mgmt can't reach (Client users have no System token scope).

### Rule 2 — Preserve `useGateway(Gateway.ChargingGateway)` overrides (and add one to wallet transfer)

`[CODE] wallet-balance-management.compare.md:154` documents the one mgmt feature that explicitly overrides its default:

```typescript
// Admin (defaults to SystemGateway → charging/wallet/transfer):
return this.useGateway().post('charging/wallet/transfer', body)

// Mgmt (overrides default CoreGateway → ChargingGateway → wallet/transfer):
return this.useGateway(Gateway.ChargingGateway).post('wallet/transfer', body)
```

Note: the URL also changes (`charging/wallet/transfer` → `wallet/transfer`) because the gateway base-URL pattern differs.

Beyond wallet transfer, look for any `useGateway(Gateway.ChargingGateway)` calls in admin code (e.g. testing-charging features) — preserve the override on mgmt port if the call exists on both sides.

### Rule 3 — Preserve `useGateway(Gateway.IdentityGateway)` overrides

Identity is **gateway-agnostic** — both consoles can reach Identity via either gateway, and explicit `Gateway.IdentityGateway` overrides direct the call to Identity's own gateway. Preserve these unchanged.

Common admin-side patterns that stay on mgmt:

```typescript
this.useGateway(Gateway.IdentityGateway).post('identity/auth/login', body)
this.useGateway(Gateway.IdentityGateway).get('identity/user')
```

`[CODE] contact-groups.compare.md:144-145` quotes the pattern: "Identity calls (`identity/user`) → both sides route through their respective gateway → land on `falcon-core-identity-svc`." The override survives the gateway flip.

## Catalog of observed overrides per feature

Source: feature compare notes.

| Feature | Service | Override calls | Action on port |
|---|---|---|---|
| `wallet-balance-management` | `wallet-balance.service.ts` | `useGateway(Gateway.ChargingGateway)` on `wallet/transfer` | **Add** override on mgmt (admin uses arg-less); change URL `charging/wallet/transfer` → `wallet/transfer` |
| `comms-hub` | `comms-hub.service.ts` | None — arg-less throughout | Flip happens automatically via default |
| `marketplace-applications` | `commerce-actions.service.ts` (shared) | None — arg-less throughout | Same |
| `contact-groups` | `contact-groups-api.service.ts` | None — arg-less | Same |
| `contracts-cost-management` | `contracts-api.service.ts` | None — arg-less (all `useGateway()`) | Same; URL prefix also differs (`commerce/Contracts` → `api/commerce/contracts`) |
| `organization-hierarchy` | `org-hierarchy-api.service.ts` + tabs services | None — arg-less | Same |
| `testing-charging` | `testing-charging.service.ts` | Multiple `useGateway(Gateway.ChargingGateway)` calls | **N/A — feature is not portable** |

## Special cases by host service

### Commerce (`falcon-core-commerce-svc`)

All Commerce endpoints reach the same backend service regardless of gateway prefix.

| Admin URL (System Gateway) | Mgmt URL (Core Gateway) | Backend |
|---|---|---|
| `commerce/Node/{nodeId}/comm-channels` | `commerce/Node/{nodeId}/comm-channels/visible/details` | Commerce — same |
| `commerce/Node/{nodeId}/applications` | `commerce/Node/{nodeId}/applications` (same) | Commerce — same |
| `commerce/Contracts?accountId=...` | `api/commerce/contracts` (lowercase + `api/` prefix) | Commerce — same (gateway routing artifact) |
| `commerce/setting/wallets/{id}` | `commerce/setting/wallets/{id}` (same) | Commerce — same |
| `commerce/accounts/{id}/hierarchy?...` | `commerce/accounts/{id}/hierarchy?...` (same) | Commerce — same |

`[CODE] contracts-cost-management.compare.md:121` flags the `commerce/Contracts` vs `api/commerce/contracts` casing/prefix difference: "this is unusual and likely a leftover or alternate gateway route". Mirror what the mgmt-side already uses — don't invent.

### Charging (`falcon-core-charging-svc`)

Charging is reached via two paths:
1. Through the default app gateway (System for admin / Core for mgmt) at `charging/...` URLs.
2. Through the explicit `Gateway.ChargingGateway` override at `wallet/...` URLs.

`[CODE] wallet-balance-management.compare.md:127-130` shows both paths in use.

| Operation | Admin path (System default) | Mgmt path (Core default + Charging override) |
|---|---|---|
| Wallet transfer | `POST charging/wallet/transfer` (default System Gateway) | `POST wallet/transfer` with `useGateway(Gateway.ChargingGateway)` |
| Order-status poll | `GET commerce/Node/order/{orderId}/status` (Commerce-hosted) | Same — also Commerce-hosted |
| Direct debit / reserve | `POST charging/wallet/...` (default System) | `POST charging/wallet/...` (default Core — both gateways route to Charging) |

### Identity (`falcon-core-identity-svc`)

Always via explicit `useGateway(Gateway.IdentityGateway)`. Survives the flip unchanged.

```typescript
// Same on both consoles:
this.useGateway(Gateway.IdentityGateway).post('identity/auth/login', body)
```

`[CODE] contact-groups.compare.md:144-145` confirms.

### Contact Group (`falcon-core-contact-group-svc`)

Gateway-routed at `contactgroup/contact-groups/*` → upstream `api/contact-groups/*`. Arg-less calls work; the gateway handles the prefix rewrite. `[CODE] contact-groups.compare.md:143` quotes the rewrite ("Gateway strips `/contactgroup` and prepends `/api`").

## Verification

After flipping, run:

```bash
# Should return ZERO hits — no SystemGateway override should remain on mgmt-side
grep -rn "useGateway(Gateway.SystemGateway)" apps/management-console/

# Should match ONLY wallet transfer (per Rule 2)
grep -rn "useGateway(Gateway.ChargingGateway)" apps/management-console/

# Should match Identity calls only (per Rule 3)
grep -rn "useGateway(Gateway.IdentityGateway)" apps/management-console/

# Should return ZERO hits for any provideAppDefaultGateway override beyond CoreGateway
grep -rn "provideAppDefaultGateway" apps/management-console/
```

`[CODE] wallet-balance-management.compare.md:154` calls this out: "Change `POST charging/wallet/transfer` (admin) to `POST wallet/transfer` with `useGateway(Gateway.ChargingGateway)` explicitly".

## Common mistakes

1. **Leaving `useGateway(Gateway.SystemGateway)` override in place after a copy** — Client JWT doesn't have System-scope tokens; the call fails at the gateway with 401/403.
2. **Copying `provideAppDefaultGateway(Gateway.SystemGateway)` from admin `app.config.ts`** — `[CODE] wallet-balance-management.compare.md:153`: "Remove `provideAppDefaultGateway(Gateway.SystemGateway)` if you copied `app.config.ts`. The mgmt app is configured with `Gateway.CoreGateway` as its default."
3. **Forgetting to flip URLs that have gateway-specific prefixes** — e.g. `charging/wallet/transfer` (System path) → `wallet/transfer` (Charging override path). Don't just swap gateway — verify the URL path the gateway expects.
4. **Forgetting that mgmt-side `commerce/Contracts` → `api/commerce/contracts`** — even on the same gateway, the URL casing + prefix differs for contracts. `[CODE] contracts-cost-management.compare.md:146`.
5. **Over-correcting Identity calls** — Identity is gateway-agnostic. Leaving the `Gateway.IdentityGateway` override unchanged is correct.

## Cross-references

- [`copy-admin-feature-to-mgmt.md`](copy-admin-feature-to-mgmt.md) — full 12-step recipe (this is Step 4)
- [`endpoint-suffix.catalog.md`](endpoint-suffix.catalog.md) — URL-suffix flips (related to gateway routing artifacts)
- [`../07-cross-cutting/`](../07-cross-cutting/) — gateway architecture overview
- [CODE] `libs/falcon/src/shared-data-access/lib/runtime-config/runtime-api-config.ts:128-137` — `useGateway()` source
- [CODE] `libs/falcon/src/shared-data-access/lib/.../runtime-base-url.interceptor.ts:29-39` — interceptor
- `[CODE] wallet-balance-management.compare.md:62-78` — the only mgmt-side feature that overrides default
