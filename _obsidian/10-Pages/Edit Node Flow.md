---
type: flow
flow-name: Edit Node
page-slug: organization-hierarchy
prd: PRD-01
form: single-file
created: 2026-05-15
---
*** Flow note — Edit Node (rename · scheduled rename · move · archive · settings) ***
*** Vault file: 10-Pages/Edit Node Flow.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\understanding\pages\organization-hierarchy\flows\Edit Node.md ***
*** PRD: PRD-01 Account Management · 2026-05-15 ***

# Edit Node — Flow

> Sub-flow of [[Organization Hierarchy]]. Family of node-mutation operations: rename (immediate), scheduled rename (`EffectiveDate?` — backend ➕), move (MISSING), archive/delete (MISSING), edit AccountSettings on Main (LIVE — separate Settings tab sub-flow). **Brain Outputs is the source of truth — every link below points into the SoT tree.**

## Canonical playbook

- [Edit Node.md (canonical)](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/flows/Edit%20Node.md) — operations, fields, errors, checklist, gap notes

## Operations covered (status)

| Op | Status | Endpoint |
|---|---|---|
| Rename (immediate) | ✅ LIVE | `PUT /api/Node/ChangeNodeName` |
| Scheduled rename (`EffectiveDate?`) | ✅ LIVE (backend ➕; PRD silent) | `PUT /api/Node/ChangeNodeName` |
| Move node | ❌ MISSING (Q-AM-18 / GAP-AM-07) | — do not expose |
| Archive / delete node | ❌ MISSING (GAP-AM-29 / Q-AM-08) | — do not expose |
| Edit AccountSettings on Main | ✅ LIVE (Main-node only) | `PUT /api/Setting` ([[E-account-settings]]) |

## Related PRD knowledge

- [[01 Account Management]] — primary PRD
- [BUSINESS_RULES.md](../../../Brain%20Outputs/prd/modules/01-account-management/BUSINESS_RULES.md) — `BR-AM-01` hierarchy; `BR-AM-09..13` settings
- [WORKFLOWS.md](../../../Brain%20Outputs/prd/modules/01-account-management/WORKFLOWS.md) — `W7` Account Edit
- [QUESTIONS.md](../../../Brain%20Outputs/prd/modules/01-account-management/QUESTIONS.md) — `Q-AM-08` archive state; `Q-AM-18` move node
- [GAPS.md](../../../Brain%20Outputs/prd/modules/01-account-management/GAPS.md) — `GAP-AM-06` ChangeNodeName COVERED; `GAP-AM-07` move-node MISSING; `GAP-AM-29` archive MISSING; `GAP-AM-09` AccountSettings edit COVERED

## Backend (`[CODE]` source-prefix)

- [[Commerce Service]] — owner of Node + AccountSettings
- [NodeController/ENDPOINTS.md](../../../Brain%20Outputs/understanding/backend/commerce/controllers/NodeController/ENDPOINTS.md) — `PUT /api/Node/ChangeNodeName`
- [NodeController/DTOS.md](../../../Brain%20Outputs/understanding/backend/commerce/controllers/NodeController/DTOS.md) — `ChangeNodeNameRequest { NodeId, NewName, EffectiveDate? }`
- [NodeController/VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/commerce/controllers/NodeController/VALIDATIONS.md) — `NodeNameRequired`, `NewNodeNameNotApplyed`, `NoChangesToUpdate`, `MaxLengthExceeded`, `ActionsNotAllowedOnDeletedNode`
- [NodeController/ERRORS.md](../../../Brain%20Outputs/understanding/backend/commerce/controllers/NodeController/ERRORS.md) — error catalog + HTTP codes
- [NodeController/FRONTEND_CONTRACT.md](../../../Brain%20Outputs/understanding/backend/commerce/controllers/NodeController/FRONTEND_CONTRACT.md) — gateway-prefixed URL
- [[Core Gateway Service]] / [[System Gateway Service]] — route exposure
- [[Access PES Service]] — `renameNode` / `scheduleRenameNode` permission gates

## Entity reconciliation

- [[E-node]] — primary
  - ➕ `ChangeNodeNameRequest.EffectiveDate?` — backend extra; PRD doesn't document scheduled rename
  - ⚠ `Node.type` enum not on response DTO (clients infer from position)
  - ❌ per-node `settings` missing on backend
- [[E-account-settings]] — Operation 5 (edit settings on Main node)

## Validation rules (V-)

- [[V-subnode-name-maxlength-30]] — `NewName` 30-char cap + required
- [[V-account-name-format-uniqueness]] — sister rule on Main; letter-prefix may apply (PRD silent)
- [[V-account-limits-zero-means-no-limit]] — Operation 5 (settings)
- [[V-password-security-level-enum]] — Operation 5 (settings); ⚠ `Normal/Advanced` ↔ `Low/Medium/High/Strict` drift
- [[V-account-ip-allowlist-enforcement]] — Operation 5 (settings)

## Permission gate

- [[Falcon Roles Permission Matrix]]
- Rename: System Admin / Product / Operation (Falcon) ✅ anywhere; AO inside own subtree; Node Admin inside own sub-nodes
- Settings edit: Falcon-only with Operation = `Not Allow` on Account Limitations / Password Security per W7

## Falcon components used

- [[Falcon Menu]] — kebab on tree row exposing `Rename` + `Schedule rename`
- [[Falcon Tree]] · [[Falcon Tree Panel]] · [[Falcon Organization Hierarchy Tree TW]] — tree surface; possible inline edit on double-click
- [[Falcon Dialog]] — rename dialog
- [[Falcon Drawer]] — narrow-viewport fallback
- [[Falcon Input]] — New Name field
- [[Falcon Date Picker]] — `EffectiveDate` (scheduled rename only)
- [[Falcon Status Badge]] — annotate row with pending scheduled rename (Wave 20 shadow-row pattern)
- [[Falcon Button]] — Save / Cancel
- ⛔ [[Falcon Confirm Dialog]] — reserved for Archive / Delete; **do NOT wire** until backend exists

## Page sections touched

- `hierarchy-tab` on [[Organization Hierarchy]] — rename + scheduled rename
- `settings-tab-edit-mode` — Operation 5 (Edit AccountSettings on Main)

## Cross-flow links

- Depends on [[Add Node Flow]] (node must exist) and [[Add Client Flow]] (for Main node rename)
- Sibling: [[Add User Flow]] — unaffected; rename does not cascade

## Drift / gaps

- ➕ EXTRA — `EffectiveDate?` on `ChangeNodeNameRequest` (scheduled rename — PRD does not document)
- ❌ MISSING — Move node (`Q-AM-18` / `GAP-AM-07`)
- ❌ MISSING — Archive / delete node (`GAP-AM-29` / `Q-AM-08`); error codes `ActionsNotAllowedOnDeletedNode` + `RootNodeDeletionNotAllowed` exist but no write path
- ❓ OPEN — cancel a pending scheduled rename: no explicit DELETE endpoint observed (price changes have one; rename does not)
- ❓ OPEN — uniqueness scope of `NewName` (per-parent / per-account / global) — PRD silent
- ❓ OPEN — letter-prefix rule on sub-node rename — PRD silent
- ❓ OPEN — audit trail on rename — PRD silent
- ⚠ DRIFT — `passwordSecurityLevel` enum vocabulary (Operation 5; Q-UM-12)
- ⚠ TYPO — backend error key `NewNodeNameNotApplyed` (should be `NewNodeNameNotApplied`)

## Tags

#type/flow #prd/01 #service/access #service/commerce #service/core-gateway #service/system-gateway #drift #gap #security

## Hubs

- [[Organization Hierarchy]] · [[Add Node Flow]] · [[API_INDEX]] · [[VALIDATION_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]] · [[COMPONENT_INDEX]] · [[AMMAR_BRAIN_HOME]]
