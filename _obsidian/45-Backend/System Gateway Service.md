---
type: backend-service
service: system-gateway
primary-prds: []
repo: falcon-int-system-gateway-svc
created: 2026-05-15
---
*** Backend Service — System Gateway (Falcon-admin-facing) ***
*** SoT: Brain Outputs/understanding/backend/system-gateway/ ***
*** Repository: C:\Falcon\Falcon\falcon-int-system-gateway-svc ***

# System Gateway Service

> The **Falcon-admin-facing** gateway. Serves authenticated platform administrators (non-tenant-scoped users — Falcon role) from the Admin Console UI. Mirror of [[Core Gateway Service]] but with:
> - `FalconOnly` policy as the default (instead of `ClientOnly`)
> - No per-tenant rate limiting (admins share a single bucket)
> - No IP allowlist consumer (admin traffic is trusted)
> - **Larger aggregation surface**, including the **Testing Charging BFF** (10 endpoints to drive the WhatsApp simulator from the Admin Console without exposing [[Charging Service]] directly to the frontend)

## Source-of-truth files

- [SERVICE_OVERVIEW](../../../Brain%20Outputs/understanding/backend/system-gateway/SERVICE_OVERVIEW.md)
- [ENDPOINT_REGISTRY](../../../Brain%20Outputs/understanding/backend/system-gateway/ENDPOINT_REGISTRY.md)
- [DTO_DICTIONARY](../../../Brain%20Outputs/understanding/backend/system-gateway/DTO_DICTIONARY.md)
- [VALIDATIONS](../../../Brain%20Outputs/understanding/backend/system-gateway/VALIDATIONS.md)
- [ERRORS](../../../Brain%20Outputs/understanding/backend/system-gateway/ERRORS.md)
- [FRONTEND_CONTRACT](../../../Brain%20Outputs/understanding/backend/system-gateway/FRONTEND_CONTRACT.md)

## PRDs this service supports (cross-cutting routing)

- [[01 Account Management]] · [[02 User Management]] · [[03 Contract Packaging Charging Billing]] · [[04 Contact Group Management]] · [[05 Templates]]

## Pages served

All Falcon-admin pages — Admin Console UI, Testing Charging Lab, etc.

## Tenant-id resolution (inverted from Core Gateway)

- Falcon admin JWTs **do not** carry a tenant claim
- For aggregations that need a tenant id, the gateway reads it from the **downstream service's response body** (e.g. Commerce's hierarchy response includes `TenantId`)
- Documented in `GetAccountHierarchyEndpoint`: *"the tenant id is taken from the Commerce response body (the node the admin requested), which Commerce already authorized via the user-type=Falcon JWT claim"*

## Backend services proxied

- [[Commerce Service]] → admin views of account hierarchy + contracts
- [[Identity Service]] → user admin
- [[Charging Service]] → **Testing Charging BFF (10 endpoints)** — only exposed here
- [[Provisioning Service]] · [[Contact Group Service]] · [[Templates Service]]

## Tags

#type/backend-service #prd/01 #prd/02 #prd/03 #prd/04 #prd/05 #service/charging #service/commerce #service/contact-group #service/core-gateway #service/identity #service/provisioning #service/templates #security

## Hubs

- [[BACKEND_INDEX]] · [[API_INDEX]] · [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[GAPS_INDEX]]
