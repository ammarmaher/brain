---
type: graph-cluster
title: API + Business Rule + Architecture Sub-Graph
created: 2026-05-27
wave-introduced: 1
expanded-in-wave: 4
node-types: [Service, API, Endpoint, Controller, DTO, KafkaEvent, BusinessRule, ArchitectureRule, PESRule, Module]
up: "[[00_START_HERE]]"
tags: [graph, api, backend, business, architecture]
---

# API + Business + Architecture Sub-Graph

> [!summary]
> Wave 1 seeds the **backbone**: 9 Services + 25 E-* entities (DTO basis) + 21 Kafka events + 24 ArchitectureRule + 47 PESRule + 6 Module nodes. Wave 4 will expand Endpoint + Controller + DTO + USES_DTO + CONNECTS_TO_API + IMPLEMENTS_BUSINESS_RULE edges.

## Service nodes (9)

Sourced from [BRAIN-OUT] `understanding/backend/<svc>/` — each has a canonical 6-file dossier (DTO_DICTIONARY, ENDPOINT_REGISTRY, ERRORS, FRONTEND_CONTRACT, SERVICE_OVERVIEW, VALIDATIONS).

| # | Graph ID | Service | Dossier | Wave-1 MOC |
|---:|---|---|---|---|
| 1 | `svc:access` | Access PES service | `understanding/backend/access/` | [[../00-MOCs/Services]] |
| 2 | `svc:charging` | Falcon Core Charging | `understanding/backend/charging/` | [[../00-MOCs/Services]] |
| 3 | `svc:commerce` | Falcon Core Commerce | `understanding/backend/commerce/` | [[../00-MOCs/Services]] |
| 4 | `svc:contact-group` | Contact Group service | `understanding/backend/contact-group/` | [[../00-MOCs/Services]] |
| 5 | `svc:core-gateway` | Client-facing gateway | `understanding/backend/core-gateway/` | [[../00-MOCs/Services]] |
| 6 | `svc:identity` | Falcon Core Identity (Zitadel OIDC) | `understanding/backend/identity/` | [[../00-MOCs/Services]] |
| 7 | `svc:provisioning` | Falcon Provisioning | `understanding/backend/provisioning/` | [[../00-MOCs/Services]] |
| 8 | `svc:system-gateway` | Admin-facing gateway | `understanding/backend/system-gateway/` | [[../00-MOCs/Services]] |
| 9 | `svc:templates` | Templates service | `understanding/backend/templates/` | [[../00-MOCs/Services]] |

## Module nodes (6) — from PRD

Sourced from [BRAIN-OUT] `prd/modules/`:

| # | Graph ID | Module | PRD code |
|---:|---|---|---|
| 1 | `mod:account-mgmt` | Account Management | PRD-01 |
| 2 | `mod:user-mgmt` | User Management | PRD-02 |
| 3 | `mod:contract-charging-billing` | Contract / Packaging / Charging / Billing | PRD-03 |
| 4 | `mod:contact-group-mgmt` | Contact Group Management | PRD-04 |
| 5 | `mod:templates` | Templates | PRD-05 |
| 6 | `mod:root-documents` | Root documents (Identity / Auth shared) | (root) |

## DTO / Entity nodes (25) — E-* files

From [BRAIN-SK] `40-API/E-*.md` (entity reconciliation files). Wave-1 sample:

| Graph ID | Entity | PRD | Service | Drift count (from frontmatter) |
|---|---|---|---|---:|
| `dto:account` | account | PRD-01 | commerce | — |
| `dto:account-settings` | account-settings | PRD-01 | commerce | — |
| `dto:addon` | addon | PRD-03 | commerce | — |
| `dto:app-config` | app-config | — | commerce | — |
| `dto:audit-event` | audit-event | cross | — | — |
| `dto:contract` | contract | PRD-03 | commerce | **19** (per agent sample) |
| ... | (20 more) | | | |

Full list: see [BRAIN-SK] `40-API/` directory listing.

## Kafka event nodes (21)

From [BRAIN-SK] `47-Events/`. Wave-1 sample (5 of 21):

| Graph ID | Event | Producer service (inferred) |
|---|---|---|
| `evt:charging-ocs-wallet-events` | Charging OCS Wallet Events | charging |
| `evt:charging-order-payment-processed` | Charging Order Payment Processed | charging |
| `evt:commerce-comm-channel-init` | Commerce Comm-Channel Init | commerce |
| `evt:commerce-comm-channel-shown` | Commerce Comm-Channel Shown | commerce |
| `evt:commerce-comm-channel-visibility-changed` | Commerce Comm-Channel Visibility Changed | commerce |
| ... | (16 more) | |

PRODUCES_EVENT + CONSUMES_EVENT edges are Wave 4 — they require reading the canonical `understanding/pages/<page>/10-KAFKA_SIDE_EFFECTS.md` files to determine consumers.

## ArchitectureRule nodes (24, inc. 8 ADRs)

From [BRAIN-SK] `35-Architecture/`. ADRs:

| Graph ID | ADR | Topic |
|---|---|---|
| `arch:adr-001` | ADR-001 | (Wave 4 will populate topic) |
| `arch:adr-002` | ADR-002 | (Wave 4) |
| ... | ... | ... |
| `arch:adr-008` | ADR-008 | (Wave 4) |

Non-ADR architecture files include "Auth and Facade Patterns", "Component Usage Matrix" — Wave 4 expands these into nodes with proper `GOVERNED_BY_ARCHITECTURE_RULE` edges from affected nodes.

## PESRule nodes (47)

From [BRAIN-OUT] `datasets/authority-dataset/03-pes-keys/REGISTRY-RAW.md` per Master Index claim of "47 PES key factories". Code source: [CODE] `falcon-access.registry.ts:1-185`.

Each PES key (e.g., `app.management-console.view`, `acc.services.add`, `app.admin-console.view`) becomes a `PESRule` node. Wave 5 emits `GOVERNED_BY_PES_RULE` edges from pages/endpoints to the matching key.

## BusinessRule nodes — Wave 1 partial

[BRAIN-SK] `67-Business-Rules/` only has 3 active topic files. The 180 BR-* rules referenced in Master Index live in [BRAIN-OUT] `prd/modules/<m>/BUSINESS_RULES.md`. Wave 1 seeds the 6 module-level BR-rule clusters; Wave 5 enumerates each BR-* individually.

| Graph ID | Module | BR-rules count (per Master Index) |
|---|---|---:|
| `br-cluster:am` | account-mgmt | 42 (BR-AM-*) |
| `br-cluster:um` | user-mgmt | 50 (BR-UM-*) |
| `br-cluster:cc` | contract-charging-billing | 50 (BR-CC-*) |
| `br-cluster:cgm` | contact-group-mgmt | 38 (BR-CGM-*) |
| `br-cluster:templates` | templates | TBD |
| `br-cluster:root` | root-documents | TBD |

**Total: 180+ BR-* rules** to be enumerated by Wave 5.

## SoT priority in this subgraph

Per [BRAIN-OUT] `19-night-shift-readiness/DECISION-PROTOCOL.md` Class C entity-drift forks:
- **PRD wins on labels** (display strings)
- **Backend wins on transport shape** (DTO field names, enum codes)
- **Code wins on actual behavior** (`[CODE]` evidence trumps doc claims)

When the graph detects PRD ↔ backend disagreement, it emits a `Conflict` node + CONFLICTS_WITH edges + a REPLACES edge per the SoT priority.

## Wave 4 expansion plan

1. For each of 9 services, read `ENDPOINT_REGISTRY.md` → emit `Endpoint` + `Controller` nodes + USES_DTO edges
2. For each `Page`, read `08-BACKEND_API.md` (where present) → emit CONNECTS_TO_API + USES_DTO edges from page to endpoints
3. For each `Page`, read `10-KAFKA_SIDE_EFFECTS.md` (where present) → emit PRODUCES_EVENT / CONSUMES_EVENT edges
4. Enumerate 47 PES keys → emit PESRule nodes + GOVERNED_BY_PES_RULE edges (from pages with PES gates)
5. Read `prd/modules/<m>/BUSINESS_RULES.md` → emit each BR-* as a node + IMPLEMENTS_BUSINESS_RULE edges

## See also

- [[COMPONENT_REGISTRY_GRAPH]] — frontend side
- [[PAGE_TO_COMPONENT_USAGE_GRAPH]] — page side
- [[../00-MOCs/Services]] / [[../00-MOCs/Endpoints]] / [[../00-MOCs/Authorization-Security-MOC]] — vault MOCs
