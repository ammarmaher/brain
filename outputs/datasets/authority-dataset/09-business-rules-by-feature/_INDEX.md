---
type: index
cluster: 09-business-rules-by-feature
purpose: "Answers 'where to look up BR-* × feature mappings + the 3-axis (PES / V-rule / BR) taxonomy'. Open to navigate the 180-rule × 7-feature matrix."
---

# Business Rules × Feature Cross-Cut — Index

> [!tldr]
> 180 BR-* business rules (BR-AM:42 + BR-UM:50 + BR-CC:50 + BR-CGM:38) indexed against the 7 features. Answers "what cross-field / workflow / domain logic applies to feature F?" Distinct from PES (who) and V-rules (data validity).

## Files

| File | Content |
|---|---|
| [[MATRIX]] | The master 4-cluster × 7-feature grid + per-feature inventory + cross-field BR pattern + status-aware BR pattern |

## The 3-axis taxonomy

| Concern | Question | Example |
|---|---|---|
| **PES** | Who can do this action? | sys-admin can `sys.account.add`, acc-owner can't |
| **V-rule** | Is this data structurally + semantically valid? | AccountName: required, ≤30 chars, starts with letter, unique |
| **BR-*** | What cross-field / workflow / domain logic applies? | Visibility=Hide ⇒ Pricing must be empty; eContractStatus=Active ⇒ Name+Value+StartDate locked |

## Quick answers

- **Most BR-heavy feature?** contact-groups (42 rules — entire PRD-04 BR-CGM cluster).
- **Cross-field rule pattern?** Visibility ↔ Pricing coupling — the canonical example from BR-AM/CC.
- **Status-aware rule pattern?** eContractStatus drives BR-CC-15/16 (Pending = full edit · Active/Expired = restricted edit).

## See also

- `Brain Outputs/prd/modules/<module>/BUSINESS_RULES.md` (the 4 inputs)
- [[../04-feature-parity-matrix/MATRIX]]
- [[../06-validation-by-feature/MATRIX]] — companion (V-rules + BRs together govern form behaviour)
- [[../00-VERIFICATION-GATE]] — Q13 answered here
