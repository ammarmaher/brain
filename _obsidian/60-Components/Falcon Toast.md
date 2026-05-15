---
type: falcon-component
component: Falcon Toast
folder-name: falcon-angular-notification
deprecated: true
primary-prds: []
created: 2026-05-15
---
*** Component note — Falcon Toast ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-toast/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Toast

> _@deprecated_ — prefer `<falcon-angular-notification>` for new code. Single auto-dismissing toast (severity / title / message / icon / action), stacked inside `<falcon-toast-host>` at one of 6 positions. Drop-in for PrimeNG `MessageService` + `<p-toast>` via `FalconMessageService` queue.

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-toast/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-toast/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-toast/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-toast/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-toast/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-toast/DECISION.md)

> **Naming note:** Stencil source does NOT have a JSDoc `@deprecated` annotation — deprecation is documented in project memory + registry but not enforced at the API surface.

## Pages using this component

- Cross-cutting (transient feedback after async actions). New code should prefer `<falcon-angular-notification>` + `FalconNotificationService`.

## PRDs that use this component

- Cross-cutting — every PRD's async action feedback ([[01 Account Management]] · [[02 User Management]] · [[03 Contract Packaging Charging Billing]] · [[04 Contact Group Management]] · [[05 Templates]]).

## Related gaps

- See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-toast/GAPS_AND_UPGRADES.md) — migration to `<falcon-angular-notification>`.

## Visual difference reports

- [[FALCON_EYES_INDEX]] — filter by component `falcon-toast`.

## Tags

#type/falcon-component #status/deprecated #prd/01 #prd/02 #prd/03 #prd/04 #prd/05

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
