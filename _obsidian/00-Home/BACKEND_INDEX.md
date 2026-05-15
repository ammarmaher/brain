---
type: hub
hub: backend
created: 2026-05-15
---
*** Backend Index — graph hub ***
*** Created 2026-05-15 by Brain SK Phase 2A — backend service vault layer ***

# Backend Index

> 9 Falcon backend services. Brain Outputs holds the deep contracts (6 files per service); this hub holds the graph.
>
> **Canonical knowledge root:** [`Brain Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md`](../../../Brain%20Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md). Per-service: `understanding/backend/<service>/` carries `SERVICE_OVERVIEW` · `ENDPOINT_REGISTRY` · `DTO_DICTIONARY` · `VALIDATIONS` · `ERRORS` · `FRONTEND_CONTRACT`.

## 🔍 Live queries (Dataview)

_If Dataview plugin is installed, queries return live results._

### All 9 services with their primary PRDs

```dataview
TABLE service AS "Service", primary-prds AS "Primary PRDs", repo AS "Repo" FROM "45-Backend"
WHERE type = "backend-service"
SORT service ASC
```

### Kafka events per service (producer side)

```dataview
TABLE producer-service AS "Producer", topic AS "Topic", consumer-services AS "Consumers" FROM "47-Events"
WHERE type = "kafka-event"
SORT producer-service ASC
```

### V-rules enforced per service

```dataview
TABLE length(rows) AS "V-rules" FROM "30-Validation"
WHERE type = "validation-rule"
GROUP BY service
SORT length(rows) DESC
```

## Services tracked

| Service | Vault note | Owner concept | Primary PRDs | Repo |
|---|---|---|---|---|
| Commerce | [[Commerce Service]] | Account · Hierarchy · Contracts · Pricing · Tenant settings | [[01 Account Management]] · [[03 Contract Packaging Charging Billing]] | `falcon-core-commerce-svc` |
| Charging (OCS) | [[Charging Service]] | Wallets · Reservation · Direct debit · Transfer · Real-time core | [[01 Account Management]] · [[03 Contract Packaging Charging Billing]] | `falcon-core-charging-svc` |
| Provisioning | [[Provisioning Service]] | Per-account service subscriptions · visibility · actions | [[01 Account Management]] · [[03 Contract Packaging Charging Billing]] | `falcon-core-provisioning-svc` |
| Identity | [[Identity Service]] | User lifecycle · auth · OTP · password · Zitadel | [[02 User Management]] · [[01 Account Management]] · [[04 Contact Group Management]] · [[05 Templates]] | `falcon-core-identity-svc` |
| Templates | [[Templates Service]] | CommChannel config templates · Maker/Checker · approval | [[05 Templates]] · [[04 Contact Group Management]] · [[01 Account Management]] | `falcon-core-templates-svc` |
| Contact Group | [[Contact Group Service]] | Contact group upload · validation · sharing | [[04 Contact Group Management]] | `falcon-core-contact-group-svc` |
| Access (PES) | [[Access PES Service]] | Policy rules · roles · auth decisions · advice | All (cross-cutting) | `falcon-core-access-svc` |
| Core Gateway | [[Core Gateway Service]] | Client-facing YARP + aggregations · IP allowlist · rate limit | All (cross-cutting) | `falcon-int-core-gateway-svc` |
| System Gateway | [[System Gateway Service]] | Admin-facing YARP + aggregations · Testing Charging BFF | All (cross-cutting) | `falcon-int-system-gateway-svc` |

## Per-PRD → service mapping (quick lookup)

| PRD | Owning services |
|---|---|
| [[01 Account Management]] | Commerce (primary) · Charging · Provisioning · Identity (Step 5) |
| [[02 User Management]] | Identity (primary) · Access · Commerce (Account binding) |
| [[03 Contract Packaging Charging Billing]] | Commerce (primary) · Charging · Provisioning |
| [[04 Contact Group Management]] | Contact Group (primary) · Access · Templates (link-to-template) |
| [[05 Templates]] | Templates (primary, with GAP-TM-01/02) · Commerce (CommChannelConfig) |

**Cross-cutting permission matrices** (enforced by [[Access PES Service]]): [[Falcon Roles Permission Matrix]] · [[Contact Group Permission Matrix]] · [[User Statuses]] · folder hub [[12-Permissions/README|12-Permissions]].

## Architecture rules (from Wiki)

- **Clean Architecture** — Domain → Application → Infrastructure → Api (dependencies inward)
- **Application Service CANNOT call another Application Service** — use Domain Services, events, or coordinators
- **Internal services NEVER call each other through gateways** — use gRPC/Kafka directly
- **Gateways use YARP** — 90% pass-through, 10% custom aggregation
- **Identity Service owns user lifecycle** — NOT Commerce, NOT Zitadel directly
- **Frontend NEVER calls Zitadel directly** — all auth runs through Identity Service

## Kafka topology (high-level)

- **Producers:** Commerce (UserCreationRequested · WalletConfigured · ContractLifecycle · ServiceOrderCreated · tenant-ip-allowlist-changed.v1) · Contact Group (contactgroup.import-requested.v1) · Identity (user events to Templates)
- **Consumers:** Charging (Commerce events) · Templates (Commerce + Identity events) · Identity (Zitadel webhooks) · Access (role/policy events)
- **Internal-only RPC:** gRPC where Kafka is the wrong tool (e.g. synchronous PES decisions)

## Known gateway gaps

- **GAP-TM-02** — Core Gateway is missing `/api/communication-channel-configs/*` route → Templates UI cannot ship until added

## Related hubs

- [[API_INDEX]] · [[VALIDATION_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]] · [[PRD_INDEX]] · [[FRONTEND_INDEX]] · [[COMPONENT_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[PAGE_LEARNING_INDEX]]

## Tags

#type/index #prd/01 #prd/02 #prd/03 #prd/04 #prd/05 #service/access #service/charging #service/commerce #service/contact-group #service/core-gateway #service/identity #service/provisioning #service/system-gateway #service/templates #gap #blocked #security
