---
type: falcon-component
component: Falcon Drawer
folder-name: falcon-drawer
deprecated: false
primary-prds: []
created: 2026-05-15
---
*** Component note — Falcon Drawer ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-drawer/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Drawer

> Edge-anchored slide-in panel (drawer / off-canvas). Position-driven sizing (right/left → width; top/bottom → height). ARIA `role=dialog` + `aria-modal=true`, focus trap, focus restore on close, Esc + backdrop dismiss. Production component — used as Add/Edit node drawer on Org Hierarchy. Replaces PrimeNG `<p-sidebar>`.

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-drawer/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-drawer/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-drawer/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-drawer/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-drawer/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-drawer/DECISION.md)

## Pages using this component

- [[Organization Hierarchy]] — `falcon-org-node-drawer` on both admin-console and management-console (Add / Edit node), per dossier "Known consumers".

## PRDs that use this component

- [[01 Account Management]] — Add Node / Edit Node side panels in the Organization Hierarchy module.
- [[02 User Management]] — Add User / Edit User wizards (candidate adoption).
- _Cross-cutting primitive for any side-anchored detail panel._

## Related gaps

- _See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-drawer/GAPS_AND_UPGRADES.md) — filter by component `falcon-drawer`. Tier-1: `closeAriaLabel` i18n, `header-actions` slot, `dismissable`/`dismissible` alias._

## Visual difference reports

- _[[FALCON_EYES_INDEX]] — filter by component `falcon-drawer`._

## Tags

#type/falcon-component #prd/01 #prd/02

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
