*** Component note — Falcon Table ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-table/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Table

> Native HTML `<table>`-based data grid (Stencil Shadow + Light + deprecated basic Angular wrapper). The rendering substrate behind [[Falcon Data Table]]. _Generic / legacy primitive — most consumers should use [[Falcon Data Table]] instead._ The basic `<falcon-angular-table>` wrapper is `@deprecated` per JSDoc.

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-table/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-table/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-table/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-table/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-table/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-table/DECISION.md)

> **Naming note:** for app-level use prefer [[Falcon Data Table]] (which composes `<falcon-table-tw>` + Strategy E Angular cell projection). Use `<falcon-table>` / `<falcon-table-tw>` directly only when framework-agnostic (React/Vue) or per-column `render()` is sufficient.

## Pages using this component

- Indirectly via [[Falcon Data Table]] — every page using a Falcon table renders through this substrate. No direct `<falcon-angular-table>` consumers in production (basic wrapper is deprecated).

## PRDs that use this component

- Cross-cutting (substrate of [[Falcon Data Table]]) — [[01 Account Management]] · [[02 User Management]] · [[03 Contract Packaging Charging Billing]] · [[04 Contact Group Management]] · [[05 Templates]].

## Related gaps

- See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-table/GAPS_AND_UPGRADES.md) — filter by component `falcon-table`.

## Visual difference reports

- [[FALCON_EYES_INDEX]] — filter by component `falcon-table`.

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
