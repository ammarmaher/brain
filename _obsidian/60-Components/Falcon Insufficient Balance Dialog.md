---
type: falcon-component
component: Falcon Insufficient Balance Dialog
folder-name: falcon-insufficient-balance-dialog
deprecated: false
primary-prds: []
created: 2026-05-15
---
*** Component note — Falcon Insufficient Balance Dialog ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-insufficient-balance-dialog/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Insufficient Balance Dialog

> Self-contained priority-reorder pop-up dialog shipped Wave 15 (2026-05-15) as the strategy-correct 3-artefact rebuild (Stencil Shadow + Stencil Light/TW + Angular wrapper + token contract). Accepts generic `{id, label}[]` items, emits ordered IDs on confirm. Three visual modes (`showGlossy`, `showIconColor`, `showIconBackground`), token-driven row geometry, HTML5 native drag-drop. Caller owns API. Reuse-open: campaign recipient prioritization, route preference, any flat-list ranking.

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-insufficient-balance-dialog/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-insufficient-balance-dialog/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-insufficient-balance-dialog/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-insufficient-balance-dialog/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-insufficient-balance-dialog/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-insufficient-balance-dialog/DECISION.md)

## Pages using this component

- [[Organization Hierarchy]] — applications-table caller orchestrates this dialog via the app-level `<app-do-payment-priority-popup>` wrapper (Wave 14/15). Dossier confirms backend wiring (`CommChannelPaymentService`, `OrderStatusService`, `SimplePollService`) was preserved across the strategy-correct rebuild.

## PRDs that use this component

- [[03 Contract Packaging Charging Billing]] — comm-channel wallet prioritization on insufficient balance.
- [[01 Account Management]] — account-level payment-priority popups (cross-cutting reuse target).

## Related gaps

- _See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-insufficient-balance-dialog/GAPS_AND_UPGRADES.md) — filter by component `falcon-insufficient-balance-dialog`. Open: G1 inline SVG → icon font (`grip-vertical`/`chevrons-*` glyphs); G4 focus trap._

## Visual difference reports

- _[[FALCON_EYES_INDEX]] — filter by component `falcon-insufficient-balance-dialog`._

## Tags

#type/falcon-component #prd/01 #prd/03

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
