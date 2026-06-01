---
type: cluster-index
cluster: 14-flow-playbook-integration
flows: 4
files: 5
extracted: 2026-05-16
upstream:
  - 01-roles/
  - 02-statuses/
  - 03-pes-keys/REGISTRY-RAW.md
  - 04-feature-parity-matrix/organization-hierarchy.compare.md
  - 07-cross-cutting/gateway-routing-map.md
playbook-sources:
  - Brain Outputs/understanding/pages/organization-hierarchy/Add Client/ (folder, 17 files)
  - Brain Outputs/understanding/pages/organization-hierarchy/flows/Add User.md
  - Brain Outputs/understanding/pages/organization-hierarchy/flows/Add Node.md
  - Brain Outputs/understanding/pages/organization-hierarchy/flows/Edit Node.md
purpose: "Answers 'where to find each flow-integration file + how to bridge authority dataset with implementation playbooks'. Open to navigate to a specific flow or its integration matrix."
---

# Cluster 14 — Flow Playbook Integration

> [!tldr]
> Indexes the 4 canonical Organization-Hierarchy flow playbooks by **authority lens**: PES gate · roles allowed · V-rules consumed · entities created · status transitions · error codes · Kafka events. This is the bridge between the authority dataset (clusters 01–09) and the implementation playbooks under `Brain Outputs/understanding/pages/.../flows/`.
>
> A session asked to **implement** any of these flows should land here first to see the cross-cluster shape, then drill into the playbook for step-by-step detail. A session asked **"who can run X"** should land here first to get the role list, then drill into the role notes for the seed-rule citations.

## Files in this folder

| File | Read when... |
|---|---|
| [_INDEX](_INDEX.md) | (this file) — landing page · trigger phrases · cross-references |
| [MATRIX](MATRIX.md) | You need the master 4-flows × authority-lens table in one view |
| [Add-Client.integration](Add-Client.integration.md) | Building or auditing the 5-step Add Client wizard |
| [Add-User.integration](Add-User.integration.md) | Building or auditing the 3-tab Add User wizard |
| [Add-Node-and-Edit-Node.integration](Add-Node-and-Edit-Node.integration.md) | Building or auditing the Add Node dialog or Edit Node (rename / scheduled rename) operations |

## Trigger phrases (auto-load)

| You type | First file loaded | Then drill |
|---|---|---|
| `implement Add Client` | [Add-Client.integration](Add-Client.integration.md) | `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/` folder · `01-PERMISSIONS` · `07-VALIDATIONS` · `08-BACKEND_API` |
| `implement Add User` | [Add-User.integration](Add-User.integration.md) | `Brain Outputs/understanding/pages/organization-hierarchy/flows/Add User.md` |
| `implement Add Node` | [Add-Node-and-Edit-Node.integration](Add-Node-and-Edit-Node.integration.md) | `Brain Outputs/understanding/pages/organization-hierarchy/flows/Add Node.md` |
| `implement Edit Node` / `rename node` / `scheduled rename` | [Add-Node-and-Edit-Node.integration](Add-Node-and-Edit-Node.integration.md) | `Brain Outputs/understanding/pages/organization-hierarchy/flows/Edit Node.md` |
| `who can run Add Client` / `who can run Add User` / `who can add a sub-node` | [MATRIX](MATRIX.md) | `01-roles/<role>.md` for the seed-rule citation |
| `Add Client V-rules` / `Add User V-rules` / `Add Node V-rules` | per-flow integration file → V-rules section | upstream V-rule wiki-links in the playbooks |
| `Add Client status transitions` / `Add User lifecycle` | per-flow integration file → Status section | `02-statuses/<status>.md` |
| `Add Client error codes` / `Add User error codes` | per-flow integration file → Errors section | `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/12-ERROR_STATES.md` |
| `Add Client Kafka events` / `partial-failure UX` | [Add-Client.integration](Add-Client.integration.md) → Kafka section | `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/10-KAFKA_SIDE_EFFECTS.md` |

## What this cluster does NOT cover

- **Step-by-step UI markup** — drill into the playbook step files (e.g. `Add Client/02-STEP_1_BASIC_INFO.md`).
- **Component picking** — drill into the playbook's `09-COMPONENTS.md` (Add Client) or the per-flow `Falcon components used` table.
- **PRD source** — drill into `Brain Outputs/understanding/prd/modules/01-account-management/` and `02-user-management/`.
- **Backend handler internals** — drill into `Brain Outputs/understanding/backend/commerce/controllers/` and `backend/identity/`.
- **Phase 2 cross-cluster matrices (V-rule × feature, BR × feature, entity-drift × feature, non-PES gates × feature, error catalog)** — these clusters (06, 08, 09, 10, 13) are NOT YET MATERIALIZED. This cluster cites the **per-flow playbook authoritative source** for every cross-cutting fact until those Phase-2 matrices exist. When they do, every per-flow integration file below should be re-pointed at the matrix line.

## Cross-references

- Upstream — authority dataset
  - [01-roles/_INDEX](../01-roles/_INDEX.md) (6 roles)
  - [02-statuses/_INDEX](../02-statuses/_INDEX.md) (account-creation-status · user-status · service-status · contract-status)
  - [03-pes-keys/REGISTRY-RAW](../03-pes-keys/REGISTRY-RAW.md) (47 PES factory methods)
  - [04-feature-parity-matrix/organization-hierarchy.compare](../04-feature-parity-matrix/organization-hierarchy.compare.md)
  - [07-cross-cutting/gateway-routing-map](../07-cross-cutting/gateway-routing-map.md)
- Downstream — playbooks (the implementation spec)
  - `Brain Outputs/understanding/pages/organization-hierarchy/Add Client/` (folder · 17 files)
  - `Brain Outputs/understanding/pages/organization-hierarchy/flows/Add User.md`
  - `Brain Outputs/understanding/pages/organization-hierarchy/flows/Add Node.md`
  - `Brain Outputs/understanding/pages/organization-hierarchy/flows/Edit Node.md`
- Sibling — Brain SK
  - `Brain SK/_obsidian/00-Home/IMPLEMENTATION_KNOWLEDGE_MAP.md`

## Source-prefix convention

- `[BRAIN-OUT]` — anything from `Brain Outputs/` (dataset, playbooks, understanding folder)
- `[CODE]` — direct citation from a Falcon repo file (`Falcon/falcon-*-svc/...` or `Falcon/falcon-web-platform-ui/...`)
- `[INFERRED]` — reasoning that is not directly cited (flagged so the next reader can sanity-check)
