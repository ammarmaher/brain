---
type: falcon-component
component: Falcon Notification
folder-name: falcon-angular-notification-stack
deprecated: false
primary-prds: []
created: 2026-05-15
---
*** Component note — Falcon Notification ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-notification/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Notification

> Passive intent-keyed message card with 4 intents (success / info / warning / error). Card layout with intent-coloured icon chip, title + optional subtitle, optional left-accent border, optional countdown bar, glossy gradient backdrop optional. Companion `<falcon-angular-notification-stack>` mounts at fixed top-right and renders the global notification queue managed by `FalconNotificationService.push()`. Active / preferred for business-status messages — modern signal-based alternative to [[Falcon Message Host]] (BehaviorSubject-driven). Angular-only (no Stencil tag).

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-notification/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-notification/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-notification/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-notification/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-notification/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-notification/DECISION.md)

## Pages using this component

- Per dossier "Known consumers": `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` and `falcon-ui-showcase.component.ts`. No feature-page seeded yet — used through `FalconNotificationService.push()` rather than direct template tag.

## PRDs that use this component

- _cross-cutting platform component_ — async-action results + validation feedback across every PRD (preferred over toast for net-new code).

## Related gaps

- _See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-notification/GAPS_AND_UPGRADES.md) — filter by component `falcon-notification`. Tier-1: hover-pause auto-dismiss; `<falcon-angular-icon>` composition for intent icons; body slot for rich content; stack position config._

## Visual difference reports

- _[[FALCON_EYES_INDEX]] — filter by component `falcon-notification`._

## Tags

#type/falcon-component

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
