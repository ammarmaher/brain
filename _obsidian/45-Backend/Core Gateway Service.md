---
type: backend-service
service: core-gateway
primary-prds: [PRD-01]
repo: falcon-int-core-gateway-svc
created: 2026-05-15
---
*** Backend Service — Core Gateway (Client-facing) ***
*** SoT: Brain Outputs/understanding/backend/core-gateway/ ***
*** Repository: C:\Falcon\Falcon\falcon-int-core-gateway-svc ***

# Core Gateway Service

> The **Client-facing** gateway. Serves authenticated end-user (account / tenant-scoped) traffic from the Web Platform UI.
>
> Two responsibilities:
> 1. **YARP reverse proxy** — strip `/<service>` prefix → prepend `/api/` → forward to the right cluster. **~90% of traffic.**
> 2. **Custom aggregation endpoints** (FastEndpoints) — fan-out + merge across Commerce + Identity + Charging for cross-service queries. **~10% of traffic.** All registered under `/api/commerce/*` with `ClientOnly` policy enforcement at the gateway.
>
> Plus critical security cross-cuts:
> - **IP allowlist enforcement** — Redis-cached per-tenant allowlist, refreshed on `commerce.tenant-ip-allowlist-changed.v1` Kafka events
> - **Per-tenant rate limiting** — `PerTenant` policy: `PermitLimit: 100`, `WindowInSeconds: 60`, `QueueLimit: 0`

## Source-of-truth files

- [SERVICE_OVERVIEW](../../../Brain%20Outputs/understanding/backend/core-gateway/SERVICE_OVERVIEW.md)
- [ENDPOINT_REGISTRY](../../../Brain%20Outputs/understanding/backend/core-gateway/ENDPOINT_REGISTRY.md)
- [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/core-gateway/DTO_DICTIONARY.md) — shared aggregation DTOs
- [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/core-gateway/VALIDATIONS.md)
- [ERRORS](../../../Brain%20Outputs/understanding/backend/core-gateway/ERRORS.md)
- [FRONTEND_CONTRACT](../../../Brain%20Outputs/understanding/backend/core-gateway/FRONTEND_CONTRACT.md)

## PRDs this service supports (cross-cutting routing)

- [[01 Account Management]] · [[02 User Management]] · [[03 Contract Packaging Charging Billing]] · [[04 Contact Group Management]] · [[05 Templates]]

## Pages served

All Client-facing pages — anything reached from the Web Platform UI as a logged-in account/tenant user.

## Falcon components backed

All — Core Gateway is the entry point for every Falcon component's data fetches.

## Backend services proxied

- [[Commerce Service]] → `/api/commerce/*` (proxy + aggregations)
- [[Identity Service]] → `/api/identity/*` (proxy) · `/api/auth/*` (auth flows)
- [[Charging Service]] → `/api/charging/*` (proxy + select aggregations)
- [[Provisioning Service]] → `/api/provisioning/*`
- [[Contact Group Service]] → `/api/contact-groups/*` (proxy)
- [[Templates Service]] → currently MISSING route for `/api/communication-channel-configs/*` (GAP-TM-02)

## Security cross-cuts

- IP allowlist (Redis-cached, Kafka-refreshed)
- Per-tenant rate limiting (100 req / 60 s, no queue)
- JWT validation → `ClientOnly` policy

## Architecture rule (Wiki)

> *"Internal services NEVER call each other through gateways"* — use gRPC/Kafka directly. Gateway is for FE↔BE only.

## Validation rules enforced here (1 — gateway layer)

PRD-01 Account Management:
- [[V-account-ip-allowlist-enforcement]] — Redis-cached per-tenant allowlist · refreshed on `commerce.tenant-ip-allowlist-changed.v1` Kafka events · companion to [[Identity Service]] `IpAllowlistPreProcessor`. This is the **gateway layer** of the IP check (the data owner is Commerce; the per-request enforcement happens here and at Identity).

Plus cross-cutting per-tenant rate limiting (`PerTenant` policy: 100 req / 60s / no queue) — not a PRD rule, but a gateway-level guardrail.

Full validation index: [[VALIDATION_INDEX]] → "Triangulated validation rules" section.

## Tags

#type/backend-service #prd/01 #prd/02 #prd/03 #prd/04 #prd/05 #service/charging #service/commerce #service/contact-group #service/identity #service/provisioning #service/templates #gap #blocked #security

## Hubs

- [[BACKEND_INDEX]] · [[API_INDEX]] · [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[VALIDATION_INDEX]] · [[GAPS_INDEX]]
