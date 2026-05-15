---
type: falcon-component
component: Falcon Popup
folder-name: falcon-popup
deprecated: false
primary-prds: []
created: 2026-05-15
---
*** Component note — Falcon Popup ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-popup/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Popup

> Action-required modal with 4 canonical variants — `error` / `delete` / `unsaved` / `save`. Each variant ships pre-defined intent, icon, default copy, and confirm tone. Angular-only (no Stencil tag). Wave 5.

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-popup/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-popup/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-popup/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-popup/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-popup/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-popup/DECISION.md)

## Pages using this component

- [[Organization Hierarchy]] — Add User wizard + Add Client wizard (confirm destructive actions, unsaved-changes guard, save confirmation, error fallback).

## PRDs that use this component

- [[01 Account Management]] — Add Client wizard delete/unsaved/save confirmations.
- [[02 User Management]] — Add User wizard delete/unsaved/save confirmations.
- Cross-cutting — error fallback across all PRDs.

## Related gaps

- See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-popup/GAPS_AND_UPGRADES.md) — slot-friendly variant needed for radio-group bodies (see [[Send Credentials Popup]] migration candidate).

## Visual difference reports

- [[FALCON_EYES_INDEX]] — filter by component `falcon-popup`.

## Tags

#type/falcon-component #prd/01 #prd/02 #security

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
