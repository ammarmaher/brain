---
type: cross-cut-matrix
cluster: 100-Authority
axis: business-rules-by-feature
projection-source: _mounts/brain-outputs/datasets/authority-dataset/09-business-rules-by-feature/MATRIX.md
verified-at: 2026-05-16
purpose: "Answers 'which BR-* cross-field/workflow rules apply to each of the 7 features + how PES vs V-rule vs BR-* differ'. Open before implementing workflow logic."
---

> [!tldr]
> 180 BR-* business rules indexed against 7 features. Distinct from PES (who) and V-rules (data validity). Governs cross-field / workflow / domain logic.

# Business Rules × Feature

## The 3-axis taxonomy

| Concern | Question | Example |
|---|---|---|
| **PES** | Who can do this? | sys-admin can `sys.account.add`; acc-owner can't |
| **V-rule** | Is the data valid? | AccountName: required, ≤30 chars, unique |
| **BR-*** | What cross-field/workflow logic? | Visibility=Hide ⇒ Pricing empty; eContractStatus=Active ⇒ Name+Value+StartDate locked |

## The 4 BR-* clusters

| Cluster | Module | Count |
|---|---|---|
| `BR-AM-*` | PRD-01 Account Management | 42 |
| `BR-UM-*` | PRD-02 User Management | 50 |
| `BR-CC-*` | PRD-03 Contract / Charging / Billing | 50 |
| `BR-CGM-*` | PRD-04 Contact Group Management | 38 |
| **Total** | | **180** |

## Master matrix — BR cluster × feature

| Cluster | org-hierarchy | comms-hub | marketplace | contact-groups | wallet-balance | contracts-cost | testing-charging |
|---|---|---|---|---|---|---|---|
| BR-AM | 28/42 | 7/42 | 7/42 | 2/42 | 12/42 | 4/42 | 1/42 |
| BR-UM | 8/50 | 0 | 0 | 4/50 | 0 | 0 | 0 |
| BR-CC | 2/50 | 7/50 | 7/50 | 0 | 9/50 | 34/50 | 5/50 |
| BR-CGM | 0 | 0 | 0 | 36/38 | 0 | 0 | 0 |

## Canonical patterns

- **Cross-field rule** — Visibility ↔ Pricing coupling (BR-AM/CC): toggling Visibility=Hide clears `priceType` + `priceValue`, and any "hidden but priced" submission fails with `HiddenProductMustNotHavePricing`.
- **Status-aware rule** — eContractStatus drives BR-CC-15 (Pending = full edit) vs BR-CC-16 (Active/Expired = Name+Value+StartDate locked).
- **Ownership rule** — BR-CGM cluster uses `r.obj.createdby == r.sub.userid` expression for edit/delete/share by non-owners.

## Drill into Brain Outputs

[Full matrix → 09-business-rules-by-feature/MATRIX.md](../_mounts/brain-outputs/datasets/authority-dataset/09-business-rules-by-feature/MATRIX.md)

## See also

- `Brain Outputs/prd/modules/<module>/BUSINESS_RULES.md` (the 4 inputs)
- [[Validation-by-Feature]] — V-rules + BRs together govern form behaviour
- [[Falcon-vs-Client]] — feature classification
