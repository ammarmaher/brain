---
type: cross-cut-matrix
cluster: 100-Authority
axis: entity-drift-by-feature
projection-source: _mounts/brain-outputs/datasets/authority-dataset/08-entity-drift-by-feature/MATRIX.md
verified-at: 2026-05-16
purpose: "Answers 'which entities does each feature touch + which DTO drift items will surprise me when porting (179 total drift items)'. Open before wiring DTOs for any port."
---

> [!tldr]
> 15 E-* entities × 7 features cross-cut. 179 total drift items across the catalog. Answers "what surprises will hit me when I port feature F's DTOs to the new theme?"

# Entity Drift × Feature

## Drift verdicts

- ✅ **match** — PRD and DTO agree
- ⚠ **DRIFT** — both exist but disagree (e.g. `node.type` implied by position but not on response DTO)
- ❌ **MISSING** — PRD says yes, backend doesn't have it (e.g. per-node `settings`)
- ➕ **EXTRA** — backend has features the PRD doesn't document (e.g. `EffectiveDate?` scheduled rename)

## Top 5 highest-drift entities

| Entity | Drift count | Why it matters |
|---|---|---|
| `E-contact-group` | 19 | Upload session + share policy + ownership overlay = complex DTO |
| `E-contract` | 19 | Status-aware DTOs + addon nesting + rate-card linking |
| `E-wallet` | 17 | Master vs Node vs User wallet shapes |
| `E-account` | 16 | Classification + sector + authority letter + uploader |
| `E-account-settings` | 14 | IP list + password policy + quota all in one DTO |

## Cross-service touches (which entities cross boundaries)

| Entity | Owned by | Used by | Trap |
|---|---|---|---|
| `E-user` | Identity | Commerce, Provisioning | Username cap 30↔100; eUserStatus duplicated |
| `E-node` | Commerce | Identity (NodeId on User), Access (Path on policy subject) | Type implied by position, EffectiveDate extra |
| `E-wallet` | Charging | Commerce (insufficient-balance handler) | Wallet types diverge with eFalconServiceStatus |
| `E-contract` | Commerce | Charging (rate cards) | Status drives BR-CC-15/16 edit gates |

## Drill into Brain Outputs

[Full matrix → 08-entity-drift-by-feature/MATRIX.md](../_mounts/brain-outputs/datasets/authority-dataset/08-entity-drift-by-feature/MATRIX.md)

## See also

- Brain SK vault: `40-API/E-*.md` — 15 atomic entity-reconciliation notes
- [[Validation-by-Feature]] — V-rules often catch the drift
- [[Falcon-vs-Client]] — feature classification
