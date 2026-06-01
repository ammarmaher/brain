---
type: entity-reconciliation
entity: node
prd: PRD-01
service: commerce
drift-count: 8
created: 2026-05-15
---
*** Entity Reconciliation E-node — Node (hierarchy element) ***
*** PRD: PRD-01 Account Management · Backend service: Commerce · 2026-05-15 ***

# E-node — Node

> Tree element in the Falcon hierarchy. Three node types: **Root** (the Falcon platform top), **Main** (= Client / Account anchor — 1:1 with Account), and **Sub** (recursive nodes under a Main, bounded by `AccountSettings.maxNodeLevels`). Owned by [[Commerce Service]].

## PRD definition (business-conceptual)

- **PRD module:** [[01 Account Management]]
- **Source:** [ENTITIES.md](../../../Brain%20Outputs/prd/modules/01-account-management/ENTITIES.md)
- **PRD fields:**
  - `id`: identifier
  - `type`: enum `root | main | sub`
  - `parentId`: identifier (null only for Root)
  - `settings`: inferred — node-level settings (inheritance from Account / Main)
- **Diagram (per PRD ENTITIES.md):**
  ```
  Root Node ──┐
              └─ Main Node ──┬─ Sub-Node (recursive)
                             ├─ Account ─...
                             └─ User (02-user-management)
  ```

## Backend DTO mapping (concrete request/response shapes)

- **Service:** [[Commerce Service]]
- **DTO source:** [DTO_DICTIONARY.md](../../../Brain%20Outputs/understanding/backend/commerce/DTO_DICTIONARY.md)
- **Validations source:** [VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/commerce/VALIDATIONS.md)
- **Relevant DTOs:**
  - `CreateSubNodeRequest` — `POST /Node/create-SubNode` (write side); fields `ParentId, Name`
  - `ChangeNodeNameRequest` — `PUT /Node/ChangeNodeName`; fields `NodeId, NewName, EffectiveDate?`
  - `GetHierarchyNodeResponse` — `GET /Node?nodeId=` (raw node read)
  - `AccountHierarchyNodeResponse` (nested in `GetAccountHierarchyResponse`) — recursive shape `NodeId, NodeName, List<AccountHierarchyNodeResponse> SubNodes`
  - `CreateAccountRequest` (Main Node creation is implicit — the Account create endpoint creates the Main Node bound to the Account)

## Field reconciliation

| PRD field | Backend DTO field | Type (PRD → Backend) | Drift / status |
|---|---|---|---|
| `id` | `AccountHierarchyNodeResponse.NodeId` · `ChangeNodeNameRequest.NodeId` · `GetHierarchyNodeResponse.NodeId` (inferred) | identifier → identifier | ✅ match |
| `type` (`root/main/sub`) | _no documented `Type` field on the response DTO_ | enum → not documented | ⚠ DRIFT — node type is implied by the hierarchy position (Root has no parent; Main is bound to Account; Sub is anything under Main) but not explicitly carried on `AccountHierarchyNodeResponse`. Documentation gap. |
| `parentId` | `CreateSubNodeRequest.ParentId` `[ThrowIfNotPassed]` (write side) | identifier → string with required check | ✅ match on write side. On read side, parent relationship is implied by tree nesting in `AccountHierarchyNodeResponse.SubNodes`. |
| Node `name` (PRD: implied via Account flow; sub-node name is explicit) | `CreateSubNodeRequest.Name` `[ThrowIfNotPassed][ThrowIfMaxLengthExceed(30)]` · `ChangeNodeNameRequest.NewName` · `AccountHierarchyNodeResponse.NodeName` | string → string (30-char cap on create) | ✅ match. Same 30-char rule as `AccountName` (see [[V-subnode-name-maxlength-30]]). |
| `settings` (inferred per-node settings) | _no per-node settings DTO_ — settings flow from Account via [[E-account-settings]] | n/a → none | ❌ MISSING on backend — PRD hints at node-level settings inheritance but no DTO surfaces it. May be enforced implicitly via Account scope. |
| _(none)_ | `ChangeNodeNameRequest.EffectiveDate?` | n/a → DateTime? | ➕ Backend supports a scheduled-future rename via `EffectiveDate`. PRD does not document this. |

## Drift / gaps summary

- **Drift items:**
  - `type` (root/main/sub) not explicitly exposed on response DTOs — clients must infer from position
- **Missing on backend:**
  - Per-node `settings` — PRD hints at it; backend does not have a DTO for it (settings live on Account via [[E-account-settings]])
- **Extra on backend:**
  - `ChangeNodeNameRequest.EffectiveDate?` — scheduled rename feature

## Related validation rules (V-rule notes)

- [[V-subnode-name-maxlength-30]] — `Name` 30-char cap + required on sub-node create
- [[V-account-name-format-uniqueness]] — sister rule on Main Node (Account) name
- [[V-account-limits-zero-means-no-limit]] — `MaxNodeLevel` constraint from `AccountSettings` controls how deep Sub-Nodes can nest

## Pages using this entity

- [[Organization Hierarchy]] — primary page (the entire `Hierarchy` tab renders `AccountHierarchyNodeResponse`)

## Cross-service touches

- [[Identity Service]] — Users carry `NodeId` (see [[E-user]]); node deletion has cascade implications
- [[Access PES Service]] — node-path is part of PES tenant scoping (`Path` field in [[E-user]])
- Q-AM-18 (PRD QUESTIONS.md) — move-node operation not yet implemented; GAP-AM-29 (account archive) tied here

## Tags

#type/e-entity #prd/01 #service/access #service/commerce #service/identity #severity/high #drift #gap

## Hubs

- [[API_INDEX]] · [[BACKEND_INDEX]] · [[PRD_INDEX]] · [[VALIDATION_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]]
