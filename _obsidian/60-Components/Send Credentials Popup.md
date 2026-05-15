---
type: falcon-component
component: Send Credentials Popup
folder-name: falcon-angular-dialog
deprecated: true
primary-prds: []
created: 2026-05-15
---
*** Component note — Send Credentials Popup ***
*** SoT: Brain Outputs/understanding/frontend/components/send-credentials-popup/ ***
*** Created 2026-05-15 by Brain SK Phase 2F — component vault layer ***

# Send Credentials Popup

> _LEGACY-IN-USE._ Bespoke confirmation popup for "send credentials to account owner": `<falcon-angular-dialog>` shell + `DeliveryMethod` radio group (email / sms / both / etc.) + Submit. Used after creating a new client or user to confirm credential delivery. Owns its own SCSS (violates project rule).

## Dossier (linked)

- [OVERVIEW](../../outputs/understanding/frontend/components/send-credentials-popup/OVERVIEW.md)
- [API](../../outputs/understanding/frontend/components/send-credentials-popup/API.md)
- [USAGE](../../outputs/understanding/frontend/components/send-credentials-popup/USAGE.md)
- [TOKENS](../../outputs/understanding/frontend/components/send-credentials-popup/TOKENS.md)
- [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/send-credentials-popup/GAPS_AND_UPGRADES.md)
- [DECISION](../../outputs/understanding/frontend/components/send-credentials-popup/DECISION.md)

> **Naming note:** Angular standalone component at `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/`. Selector `<falcon-send-credentials-popup>`. No Stencil tag. Migration target: [[Falcon Popup]] once a slot-friendly variant supports radio-group bodies.

## Pages using this component

- [[Organization Hierarchy]] — Add Client wizard final step + Add User wizard final step (per dossier: verify with grep).

## PRDs that use this component

- [[01 Account Management]] — Add Client wizard credential delivery confirmation.
- [[02 User Management]] — Add User wizard credential delivery confirmation.

## Related gaps

- See [GAPS_AND_UPGRADES](../../outputs/understanding/frontend/components/send-credentials-popup/GAPS_AND_UPGRADES.md) — SCSS cleanup + migration to [[Falcon Popup]] (requires slot-friendly variant first).

## Visual difference reports

- [[FALCON_EYES_INDEX]] — filter by component `send-credentials-popup`.

## Tags

#type/falcon-component #prd/01 #prd/02 #security

## Hubs

- [[COMPONENT_INDEX]] · [[FRONTEND_INDEX]] · [[GAPS_INDEX]] · [[FALCON_EYES_INDEX]] · [[BACKEND_INDEX]] · [[AMMAR_BRAIN_HOME]]
