---
type: entity-reconciliation
entity: <EntityName>
prd: PRD-NN
service: <service-name>
drift-count: 0
high-severity-drifts: 0
created: <YYYY-MM-DD>
---

*** Entity Reconciliation E-<slug> — <Entity Name> ***
*** PRD: PRD-NN <module> · Backend service: <service> · <YYYY-MM-DD> ***

# E-<slug> — <Entity Name>

> One-sentence summary of what the entity represents in the business + which service(s) own it.

## PRD definition (business-conceptual)

- **PRD module:** [[NN <module name>]]
- **Source:** [ENTITIES.md](../../../Brain%20Outputs/prd/modules/NN-<slug>/ENTITIES.md)
- **PRD fields** (brief list — full schema in source):

## Backend DTO mapping

- **Service:** [[<Service Name> Service]]
- **DTO source:** [DTO_DICTIONARY.md](../../../Brain%20Outputs/understanding/backend/<service>/DTO_DICTIONARY.md)
- **Relevant DTOs:**

## Field reconciliation

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|

Severity icons: ✅ match · ⚠ drift · ❌ missing · ➕ extra-on-backend

## Drift / gaps summary

- **Drift items:**
- **Missing on backend:**
- **Extra on backend:**

## Related validation rules (V-rule notes)

## Pages using this entity

## Cross-service touches

## Hubs

- [[API_INDEX]] · [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
