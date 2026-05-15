---
type: falcon-component
component: Falcon Confirm Dialog
folder-name: falcon-angular-dialog
deprecated: false
primary-prds: []
created: 2026-05-15
---
*** Component note — Falcon Confirm Dialog ***
*** SoT: Brain Outputs/understanding/frontend/components/falcon-confirm-dialog/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Falcon Confirm Dialog

> Specialised composed variant of `<falcon-angular-dialog>` providing a fixed accept / reject layout with icon, message, severity-driven accent. Wave 9.F. For "Are you sure?" prompts with non-canonical button labels (Approve/Reject, Continue/Go back). Use `<falcon-angular-popup>` for the 4 canonical decision flows instead.

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/falcon-confirm-dialog/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/falcon-confirm-dialog/API.md)
- [USAGE](../../outputs/understanding/frontend/components/falcon-confirm-dialog/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/falcon-confirm-dialog/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-confirm-dialog/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/falcon-confirm-dialog/DECISION.md)

## Pages using this component

- [[Organization Hierarchy]] — candidate for `otp-popup` and other confirmation flows (dossier notes "no matches in apps/" — current confirmation patterns use `falcon-angular-popup`).

## PRDs that use this component

- [[01 Account Management]] — Approve / Reject confirmations on account actions.
- [[02 User Management]] — Activate / Deactivate user confirmations.
- _Cross-cutting confirmation primitive._

## Related gaps

- _See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/falcon-confirm-dialog/GAPS_AND_UPGRADES.md) — filter by component `falcon-confirm-dialog`. Tier-1 upgrades needed: button composition with `<falcon-angular-button>`, `loading` / `acceptDisabled` / `rejectDisabled`, icon composition._

## Visual difference reports

- _[[FALCON_EYES_INDEX]] — filter by component `falcon-confirm-dialog`._

## Tags

#type/falcon-component #prd/01 #prd/02

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
