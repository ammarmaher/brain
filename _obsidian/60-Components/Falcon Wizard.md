*** Component note — Falcon Wizard ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-wizard/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Wizard

> Multi-step workflow shell composing [[Falcon Stepper]] + `[slot="step-{index}"]` content area + Next/Back/Finish/Draft footer. Adds per-step validation gating (`validateStep` callback OR Reactive Forms `stepControls` bridge). Architect §5.12.3 contract. Dual render-path.

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-wizard/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-wizard/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-wizard/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-wizard/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-wizard/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-wizard/DECISION.md)

## Pages using this component

- [[Organization Hierarchy]] — Add Client / Add User wizards. Per dossier: production wizards currently use [[Falcon Stepper Legacy]] directly; migration to this wizard is the long-term target.

## PRDs that use this component

- [[01 Account Management]] — Add Client wizard (5-step).
- [[02 User Management]] — Add User wizard (3-tab).
- [[03 Contract Packaging Charging Billing]] — Add Contract wizard (4-step).
- [[04 Contact Group Management]] — Create Contact Group wizard (4-step).

## Related gaps

- See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-wizard/GAPS_AND_UPGRADES.md) — production adoption gap (currently consumed in playground only); migration target for legacy stepper-based wizards.

## Visual difference reports

- [[FALCON_EYES_INDEX]] — filter by component `falcon-wizard`.

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
