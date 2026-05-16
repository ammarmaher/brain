---
type: cross-cut-matrix
cluster: 40-Authority
axis: entity-drift-by-feature
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\08-entity-drift-by-feature\MATRIX.md
verified-at: 2026-05-16
purpose: "Answers 'which entities does each feature touch + which DTO drift items will surprise me when porting (179 total drift items)'. Open before wiring DTOs for any port."
---

> [!tldr]
> 15 E-* entities × 7 features. 179 total drift items. Answers "what DTO surprises hit me when porting feature F?"

# Entity Drift × Feature

## Verdicts
- ✅ match · ⚠ DRIFT · ❌ MISSING · ➕ EXTRA

## Top 5 highest-drift entities

| Entity | Count | Why |
|---|---|---|
| E-contact-group | 19 | Upload session + share policy + ownership overlay |
| E-contract | 19 | Status-aware DTOs + addon nesting + rate cards |
| E-wallet | 17 | Master/Node/User wallet shapes |
| E-account | 16 | Classification + sector + uploader |
| E-account-settings | 14 | IP list + password policy + quota |

## Cross-service touches
- `E-user`: Identity owns, Commerce+Provisioning consume; eUserStatus duplicated
- `E-node`: Commerce owns, Identity carries NodeId, Access uses Path; type implied by position
- `E-wallet`: Charging owns; Commerce calls on insufficient balance
- `E-contract`: Commerce owns; Charging consumes rate cards; status drives BR-CC-15/16

## Drill into Brain Outputs

`C:\Falcon\Brain Outputs\datasets\authority-dataset\08-entity-drift-by-feature\MATRIX.md`

## See also
- 40-API/E-*.md — atomic entity-reconciliation notes
- [[Validation-by-Feature]] · [[Falcon-vs-Client]]
