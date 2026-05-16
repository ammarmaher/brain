---
type: cross-cut-matrix
cluster: 40-Authority
axis: business-rules-by-feature
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\09-business-rules-by-feature\MATRIX.md
verified-at: 2026-05-16
purpose: "Answers 'which BR-* cross-field/workflow rules apply to each of the 7 features + how PES vs V-rule vs BR-* differ'. Open before implementing workflow logic."
---

> [!tldr]
> 180 BR-* business rules × 7 features. Distinct from PES (who) + V-rules (data validity). Governs cross-field / workflow / domain logic.

# Business Rules × Feature

## 3-axis taxonomy

| Concern | Question |
|---|---|
| PES | Who? |
| V-rule | Is the data valid? |
| BR-* | What cross-field/workflow logic? |

## The 4 BR clusters

| Cluster | Module | Count |
|---|---|---|
| BR-AM-* | PRD-01 | 42 |
| BR-UM-* | PRD-02 | 50 |
| BR-CC-* | PRD-03 | 50 |
| BR-CGM-* | PRD-04 | 38 |

## Canonical patterns

- **Cross-field**: Visibility ↔ Pricing coupling
- **Status-aware**: eContractStatus → BR-CC-15 (Pending edit all) / BR-CC-16 (Active locked)
- **Ownership**: `r.obj.createdby == r.sub.userid` for non-owner CRUD

## Drill into Brain Outputs

`C:\Falcon\Brain Outputs\datasets\authority-dataset\09-business-rules-by-feature\MATRIX.md`

## See also
- Brain Outputs/prd/modules/*/BUSINESS_RULES.md — the 4 inputs
- [[Validation-by-Feature]] · [[Falcon-vs-Client]]
