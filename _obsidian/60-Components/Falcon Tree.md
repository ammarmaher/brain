---
type: falcon-component
component: Falcon Tree
folder-name: falcon-angular-tree
deprecated: false
primary-prds: []
created: 2026-05-15
---
*** Component note — Falcon Tree ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-tree/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Tree

> Recursive expandable tree with hover-path highlighting, rail SVG connectors, focus mode, programmatic select-and-scrollIntoView, exact 18px indentation rail, and chevron expand/collapse. The "Tier 7 locked-spec" component mirroring V0.2 React reference. Dual render-path (Shadow + Light + Angular wrapper).

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-tree/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-tree/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-tree/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-tree/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-tree/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-tree/DECISION.md)

> **Naming note:** for org-hierarchy use cases prefer [[Falcon Tree Panel]] (which composes `<falcon-tree>` + root row + per-row + root 3-dot menus). Use bare `<falcon-angular-tree>` when assembling custom panel chrome.

## Pages using this component

- [[Organization Hierarchy]] — Hierarchy tab (composed internally by [[Falcon Tree Panel]]).

## PRDs that use this component

- [[01 Account Management]] — organization hierarchy + category trees.

## Related gaps

- See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-tree/GAPS_AND_UPGRADES.md) — filter by component `falcon-tree`.

## Visual difference reports

- [[FALCON_EYES_INDEX]] — filter by component `falcon-tree`.

## Tags

#type/falcon-component #prd/01

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
