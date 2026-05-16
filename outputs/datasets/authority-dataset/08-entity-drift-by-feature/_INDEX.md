---
type: index
cluster: 08-entity-drift-by-feature
purpose: "Answers 'where to look up entity × feature drift mappings + verdict legend (match/drift/missing/extra)'. Open to navigate the 15-entity × 7-feature drift grid."
---

# Entity Drift × Feature Cross-Cut — Index

> [!tldr]
> The 15 E-* entity reconciliation notes indexed against the 7 features. Answers "which entities does feature F consume + what drift items apply?" 179 total drift items across the catalog.

## Files

| File | Content |
|---|---|
| [[MATRIX]] | The master 15 × 7 grid + per-feature inventory + per-verdict examples + cross-service touches |

## Drift verdicts

- ✅ **match** — PRD and DTO agree
- ⚠ **DRIFT** — both exist but disagree
- ❌ **MISSING** — PRD says yes, backend doesn't have it
- ➕ **EXTRA** — backend has features the PRD doesn't document

## Quick answers

- **Highest-drift entity?** E-contact-group (19) tied with E-contract (19); E-wallet (17); E-account (16); E-account-settings (14).
- **Which entity drifts will I hit porting org-hierarchy?** E-node (type implied, EffectiveDate extra) + E-account + E-account-settings + E-user (username 30↔100). See MATRIX § organization-hierarchy.
- **Highest-severity drift?** E-rate-card-entry missing `commChannelId` on backend DTO — structurally blocks Add Contract Step 2 per-CommChannel rate matrix.

## See also

- Brain SK vault: `40-API/E-*.md` (15 atomic entity-reconciliation notes — the inputs)
- [[../04-feature-parity-matrix/MATRIX]]
- [[../06-validation-by-feature/MATRIX]] — companion (V-rules often catch the drift)
- [[../00-VERIFICATION-GATE]] — Q12 answered here
