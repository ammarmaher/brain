*** Flow note — Add Node (sub-node creation) ***
*** Vault file: 10-Pages/Add Node Flow.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\understanding\pages\organization-hierarchy\flows\Add Node.md ***
*** PRD: PRD-01 Account Management · 2026-05-15 ***

# Add Node — Flow

> Sub-flow of [[Organization Hierarchy]]. Single-dialog creation of a sub-node under an existing parent. Backend: `POST /api/Node/create-SubNode` ([[Commerce Service]]). Bounded by `AccountSettings.MaxNodeLevel`. **Brain Outputs is the source of truth — every link below points into the SoT tree.**

## Canonical playbook

- [Add Node.md (canonical)](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/flows/Add%20Node.md) — fields, endpoint, errors, checklist

## Related PRD knowledge

- [[01 Account Management]] — primary PRD
- [BUSINESS_RULES.md](../../../Brain%20Outputs/prd/modules/01-account-management/BUSINESS_RULES.md) — `BR-AM-01` 3-level hierarchy; `BR-AM-11` `MaxNodeLevel`
- [WORKFLOWS.md](../../../Brain%20Outputs/prd/modules/01-account-management/WORKFLOWS.md) — sub-node creation mentioned alongside W1 / W7 (Account edit)
- [GAPS.md](../../../Brain%20Outputs/prd/modules/01-account-management/GAPS.md) — `GAP-AM-05` (CreateSubNode COVERED), `GAP-AM-29` (archive MISSING — see [[Edit Node Flow]])

## Backend (`[CODE]` source-prefix)

- [[Commerce Service]] — owner
- [NodeController/ENDPOINTS.md](../../../Brain%20Outputs/understanding/backend/commerce/controllers/NodeController/ENDPOINTS.md) — `POST /api/Node/create-SubNode`
- [NodeController/DTOS.md](../../../Brain%20Outputs/understanding/backend/commerce/controllers/NodeController/DTOS.md) — `CreateSubNodeRequest { ParentId, Name }`
- [NodeController/VALIDATIONS.md](../../../Brain%20Outputs/understanding/backend/commerce/controllers/NodeController/VALIDATIONS.md) — `[ThrowIfNotPassed]` + `[ThrowIfMaxLengthExceed(30)]`
- [NodeController/ERRORS.md](../../../Brain%20Outputs/understanding/backend/commerce/controllers/NodeController/ERRORS.md) — `ParentIdRequired`, `MaxNodeLevelReached`, `DuplicateNodeName`, `RootNodeCannotHaveSubNodes`, `ActionsNotAllowedOnDeletedNode`
- [NodeController/FRONTEND_CONTRACT.md](../../../Brain%20Outputs/understanding/backend/commerce/controllers/NodeController/FRONTEND_CONTRACT.md) — gateway-prefixed URL
- [[Core Gateway Service]] / [[System Gateway Service]] — route exposure for Client / Falcon users
- [[Access PES Service]] — `addSubNode` permission gate

## Entity reconciliation

- [[E-node]] — primary; ⚠ `type` drift (not on DTO); ❌ per-node `settings` missing on backend; ➕ `EffectiveDate?` extra on rename (Edit Node)
- [[E-account-settings]] — `MaxNodeLevel` gates this flow

## Validation rules (V-)

- [[V-subnode-name-maxlength-30]] — 30-char cap + required
- [[V-account-limits-zero-means-no-limit]] — `MaxNodeLevel` runtime cap (0 = no limit)
- [[V-account-name-format-uniqueness]] — sister rule on Main node (letter-prefix may apply to sub-node names — PRD silent)

## Permission gate

- [[Falcon Roles Permission Matrix]]
- System Admin / Product / Operation (Falcon) ✅ anywhere
- Account Owner (Client) ✅ inside own Main subtree
- Node Admin (Client) ✅ inside own sub-nodes only
- Normal User ❌

## Falcon components used

- [[Falcon Menu]] — 3-dot kebab on tree row → trigger
- [[Falcon Button]] — row-hover `+` icon-button (alt trigger)
- [[Falcon Dialog]] — primary container (desktop)
- [[Falcon Drawer]] — mobile/narrow fallback
- [[Falcon Input]] — Node Name field
- [[Falcon Tree]] · [[Falcon Tree Panel]] · [[Falcon Organization Hierarchy Tree TW]] — hierarchy surface

## Page section touched

- `hierarchy-tab` on [[Organization Hierarchy]] (the left tree panel)

## Cross-flow links

- Depends on [[Add Client Flow]] — account must exist first
- Children: [[Edit Node Flow]] · [[Add User Flow]]

## Drift / gaps

- ⚠ DRIFT — PRD `Node.type` enum not on `CreateSubNodeRequest` (per [[E-node]])
- ❌ MISSING — PRD-implied per-node `settings` has no backend DTO (per [[E-node]])
- ❓ OPEN — uniqueness scope of `Name` (per-parent / per-account / global) — PRD silent
- ❓ OPEN — letter-prefix rule on sub-node names — PRD silent; backend does not enforce

## Hubs

- [[Organization Hierarchy]] · [[Edit Node Flow]] · [[API_INDEX]] · [[VALIDATION_INDEX]] · [[BUSINESS_INDEX]] · [[GAPS_INDEX]] · [[COMPONENT_INDEX]] · [[AMMAR_BRAIN_HOME]]
