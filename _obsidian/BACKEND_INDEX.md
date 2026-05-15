---
type: hub
hub: backend
created: 2026-05-15
---
# Backend Index

This index is auto-updated by Brain SK TouchBase and report generation.

## Latest

### 2026-05-13 · Backend / API discovery (first-pass)

- [BACKEND_SERVICE_MAP](../outputs/understanding/backend/BACKEND_SERVICE_MAP.md) — one-row-per-service portfolio map (9 services, ~125 endpoints)
- [GATEWAY_ROUTE_MAP](../outputs/understanding/backend/GATEWAY_ROUTE_MAP.md) — YARP + aggregation surface for Core + System gateways

### Per service (each folder has SERVICE_OVERVIEW · ENDPOINT_REGISTRY · DTO_DICTIONARY · VALIDATIONS · ERRORS · FRONTEND_CONTRACT)

| Service | Folder |
|---|---|
| Identity | [folder](../outputs/understanding/backend/falcon-core-identity-svc/) |
| Commerce | [folder](../outputs/understanding/backend/falcon-core-commerce-svc/) · [NodeController deep](../outputs/understanding/backend/falcon-core-commerce-svc/controllers/NodeController/OVERVIEW.md) |
| Charging | [folder](../outputs/understanding/backend/falcon-core-charging-svc/) · deep drill-down on representative controller |
| Provisioning | [folder](../outputs/understanding/backend/falcon-core-provisioning-svc/) · deep drill-down on representative controller |
| Access (PES) | [folder](../outputs/understanding/backend/falcon-core-access-svc/) |
| Contact Group | [folder](../outputs/understanding/backend/falcon-core-contact-group-svc/) |
| Templates | [folder](../outputs/understanding/backend/falcon-core-templates-svc/) |
| Core Gateway | [folder](../outputs/understanding/backend/falcon-int-core-gateway-svc/) |
| System Gateway | [folder](../outputs/understanding/backend/falcon-int-system-gateway-svc/) |

### Key conventions observed
- `ServiceOperationResult<T>` adopted in 8 of 9 services (PES is the outlier) — **5 distinct shapes exist** (HIGH gap).
- Zitadel JWT Bearer auth everywhere.
- Endpoint-style split: Commerce/Charging/Provisioning use Controllers; Identity/Contact Group/Templates use FastEndpoints; Access uses Minimal API.
- Serilog universally, except Access uses log4net.

## Tags

#type/index #gap
