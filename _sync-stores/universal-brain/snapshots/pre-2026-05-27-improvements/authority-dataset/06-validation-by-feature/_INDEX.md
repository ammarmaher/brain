---
type: index
cluster: 06-validation-by-feature
purpose: "Answers 'where to look up V-rule × feature mappings + drift watch items'. Open to navigate to the 25-V-rule × 7-feature matrix."
---

# Validation × Feature Cross-Cut — Index

> [!tldr]
> The 25 V-rules indexed against the 7 features. Answers "which V-rules apply when implementing feature F?" Includes the 16-item drift watch (PRD ↔ backend gaps) and the 3-layer validation architecture recap.

## Files

| File | Content |
|---|---|
| [[MATRIX]] | The master 25 × 7 grid + per-feature drill-down + drift watch + architecture recap |

## Quick answers

- **Which V-rules govern Add Client wizard?** 9 V-rules + 5 cross-field rules. See MATRIX § organization-hierarchy.
- **Which V-rules govern Contact Groups?** 5 V-rules. See MATRIX § contact-groups.
- **What drift will surprise me?** 16 known drift items (username 30↔100, password-security enum, AccountName letter-prefix missing, etc.). See MATRIX § Drift Watch.

## Validation taxonomy (3 layers)

1. **Inline sync** — HTML attribute or Falcon directive (`maxlength`, `falconStartWithLetterMax30`)
2. **Cross-field** — FormGroup validator (`CountryRequiredWhenCityProvided`, `HiddenProductMustNotHavePricing`)
3. **Async backend** — debounced uniqueness check (`falconCheckExists` → `/exist`)

## See also

- Brain SK vault: `30-Validation/V-*.md` (25 atomic V-rule notes — the inputs)
- [[../04-feature-parity-matrix/MATRIX]]
- [[../08-entity-drift-by-feature/MATRIX]] — companion cross-cut
- [[../00-VERIFICATION-GATE]] — Q11 answered here
