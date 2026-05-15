---
type: falcon-component
component: Falcon Stepper Legacy
folder-name: falcon-stepper-legacy
deprecated: true
primary-prds: []
created: 2026-05-15
---
*** Component note — Falcon Stepper Legacy ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-stepper-legacy/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Stepper Legacy

> _LEGACY-IN-USE._ Bespoke Angular-only stepper at `libs/falcon/src/shared-ui/lib/components/falcon-stepper/`. Originally wrapped PrimeNG `<p-stepper>`; refactored in Wave 3 to drop PrimeNG entirely while preserving the public selector + inputs/outputs. Marked for deprecation once wizards migrate to [[Falcon Stepper]] (Stencil-paired dual-render).

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-stepper-legacy/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-stepper-legacy/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-stepper-legacy/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-stepper-legacy/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-stepper-legacy/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-stepper-legacy/DECISION.md)

> **Naming note:** selector collision — both this bespoke component and the new [[Falcon Stepper]] use `falcon-stepper`; resolved at import level via `@falcon` barrel. Per dossier: `*.scss` still present (violates "no per-component SCSS" rule — pending cleanup).

## Pages using this component

- [[Organization Hierarchy]] — Add Client wizard + Add User wizard on both admin-console and management-console (current production consumer).

## PRDs that use this component

- [[01 Account Management]] — Add Client wizard.
- [[02 User Management]] — Add User wizard.

## Related gaps

- See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-stepper-legacy/GAPS_AND_UPGRADES.md) — SCSS cleanup + migration to Stencil [[Falcon Stepper]].

## Visual difference reports

- [[FALCON_EYES_INDEX]] — filter by component `falcon-stepper-legacy`.

## Tags

#type/falcon-component #status/deprecated #prd/01 #prd/02

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
