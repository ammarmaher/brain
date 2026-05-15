*** Component note — Falcon Stepper ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-stepper/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Stepper

> Active dual-render-path step-progress indicator (Stencil Shadow + Light + Angular wrapper). Evenly-spaced dots connected by a fill track, plus optional labels / descriptions / tags / helper / error message. Owns visual feedback; navigation logic lives in the consumer or in [[Falcon Wizard]].

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-stepper/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-stepper/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-stepper/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-stepper/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-stepper/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-stepper/DECISION.md)

> **Naming note:** preferred replacement for [[Falcon Stepper Legacy]] (`falcon-stepper-legacy`) — same `falcon-stepper` selector, different implementation. Wizard consumers migrate per Wave plan.

## Pages using this component

- [[Organization Hierarchy]] — Add Client / Add User wizard headers (via [[Falcon Wizard]] composition).

## PRDs that use this component

- [[01 Account Management]] — Add Client wizard (5-step).
- [[02 User Management]] — Add User wizard (3-tab).
- [[03 Contract Packaging Charging Billing]] — Add Contract wizard (4-step).
- [[04 Contact Group Management]] — Create Contact Group wizard (4-step).

## Related gaps

- See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-stepper/GAPS_AND_UPGRADES.md) — filter by component `falcon-stepper`.

## Visual difference reports

- [[FALCON_EYES_INDEX]] — filter by component `falcon-stepper`.

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
