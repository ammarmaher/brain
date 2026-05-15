*** Component note — Falcon Tree Panel ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-tree-panel/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Tree Panel

> _LEGACY-BESPOKE / ACTIVE-IN-USE._ Fully self-contained org-hierarchy tree panel: aside chrome, root row (Falcon brand OR client/imageUrl with initials fallback), recursive internal `<falcon-tree-node>` (NOT `<falcon-angular-tree>`), per-row + root 3-dot menus, hover-path mirror, chevron-overlap auto-scroll. Parallel implementation to [[Falcon Tree]] — candidate for Stencil promotion.

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-tree-panel/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-tree-panel/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-tree-panel/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-tree-panel/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-tree-panel/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-tree-panel/DECISION.md)

> **Naming note:** bespoke Angular component (no Stencil core). Coexists in parallel with [[Falcon Tree]] — the two may drift. Per dossier: panel SCSS still present (violates "no per-component SCSS" rule).

## Pages using this component

- [[Organization Hierarchy]] — left-rail Hierarchy tab on both admin-console + management-console (current production consumer).

## PRDs that use this component

- [[01 Account Management]] — Organization Hierarchy left rail.

## Related gaps

- See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-tree-panel/GAPS_AND_UPGRADES.md) — Stencil promotion + SCSS cleanup + parallel-with-[[Falcon Tree]] drift.

## Visual difference reports

- [[FALCON_EYES_INDEX]] — filter by component `falcon-tree-panel`.

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
