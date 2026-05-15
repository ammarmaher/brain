*** Component note — Falcon Menu ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-menu/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Menu

> Popup action menu (PrimeNG `p-menu` parity carve-out). Two modes — `popup=true` (default trigger + panel) and `popup=false` (always-open inline panel) — plus external-anchor mode via `showAt(el)` for per-row data-table / tree-node menus. Full keyboard model. New in Revamp v3.1 (Wave 4-5).

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-menu/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-menu/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-menu/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-menu/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-menu/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-menu/DECISION.md)

## Pages using this component

- [[Organization Hierarchy]] — `organization-hierarchy-menu.component.ts` (admin-console) + twin pattern on management-console use `FalconMenuItem` via `FalconTreePanelComponent`, plus per-row data-table action menus (per dossier "Known consumers").

## PRDs that use this component

- [[01 Account Management]] — tree node action menus + per-row action menus across organization-hierarchy sections.
- [[02 User Management]] — per-row user-action menus (candidate adoption).
- _Cross-cutting kebab-menu primitive._

## Related gaps

- _See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-menu/GAPS_AND_UPGRADES.md) — filter by component `falcon-menu`. Tier-1: `appendTo="body"` portal mode (fixes overflow:hidden clipping); submenu support; icon component composition._

## Visual difference reports

- _[[FALCON_EYES_INDEX]] — filter by component `falcon-menu`._

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
