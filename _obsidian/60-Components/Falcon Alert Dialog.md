---
type: falcon-component
component: Falcon Alert Dialog
folder-name: falcon-alert-dialog
deprecated: false
primary-prds: []
created: 2026-05-15
---
*** Component note — Falcon Alert Dialog ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-alert-dialog/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Alert Dialog

> Severity-styled centered-icon dialog (icon → title → subtitle → body slot → Cancel/Confirm footer). Specialized composition of `<falcon-dialog>` with 4 severity variants; built Round 4 (2026-05-15) to replace the slot-projection shim used for the "Insufficient Balance Detected" modal.

## Dossier (linked)

- [SPEC](../../outputs/understanding/frontend/components/falcon-alert-dialog/SPEC.md)
- [API](../../outputs/understanding/frontend/components/falcon-alert-dialog/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-alert-dialog/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-alert-dialog/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-alert-dialog/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-alert-dialog/DECISION.md)

> SoT note: this dossier has `SPEC.md` instead of `OVERVIEW.md` (component was speced + built in Round 4 — no separate overview file).

## Pages using this component

- [[Organization Hierarchy]] — `otp-popup` section uses dialog-family components; alert-dialog is the Round 4 replacement for the slot-shim that prototyped the Insufficient Balance Detected modal.

## PRDs that use this component

- [[01 Account Management]] — confirmations / wallet alerts on Account flows.
- [[03 Contract Packaging Charging Billing]] — insufficient-balance + payment alerts.
- _Cross-cutting for any centered severity callout._

## Related gaps

- _See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-alert-dialog/GAPS_AND_UPGRADES.md) — filter by component `falcon-alert-dialog`._

## Visual difference reports

- _[[FALCON_EYES_INDEX]] — filter by component `falcon-alert-dialog`._

## Tags

#type/falcon-component #prd/01 #prd/03

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
