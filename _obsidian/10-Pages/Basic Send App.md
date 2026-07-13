---
type: page
slug: basic-send-app
prd-implements: [PRD-06]
has-flow-folder: false
status: stub
created: 2026-07-06
---
*** Page note — Basic Send App (landing) ***
*** Vault file: 10-Pages/Basic Send App.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\prd\modules\06-basic-send-application\ (page-learning folder not yet seeded) ***
*** Seeded 2026-07-06 by Brain SK basic-send-prd intake ***

# Basic Send App (landing)

> **STUB — seeded from PRD-06.** BSA landing inside Marketplace & Applications .Mng: channel tabs **WhatsApp | IVR Voice**, sub-tabs **Outbox | Scheduled** (grids: ID · Sender ID · Template/IVR Name · Language(WA) · Type · Creation Date · Scheduled Date(sched) · Recipient Count · Transaction Cost · Recipients +N popover · Status pill · 3-dot actions), search + type filter + date-range (must be REAL — reference chip is decorative), page size 10. Send button gated by commchannel status (BR-BSA-08..14) AND role/PES (Normal User sends; AO/Node-Admin read-only — Q-BSA-01). Row actions per status: Details always · Cancel only In-Progress · Edit/Delete only Scheduled. Deleted rows stay dimmed in place.

## Entry point in Brain Outputs
- [OVERVIEW](../../../Brain%20Outputs/prd/modules/06-basic-send-application/OVERVIEW.md) · [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/06-basic-send-application/BUSINESS_RULES.md) · [REACT_REFERENCE](../../../Brain%20Outputs/prd/modules/06-basic-send-application/REACT_REFERENCE.md) · [IMPLEMENTATION_PLAN](../../../Brain%20Outputs/prd/modules/06-basic-send-application/IMPLEMENTATION_PLAN.md)
- PRD anchor: Landing + grids: latest-prd L37-41, L99-124, L162-180, L285-286, L344-368, L410-427

## Implements PRDs
- [[06 Basic Send Application]] — **primary**

## Likely Falcon components
- [[Falcon Tabs]] · [[Falcon Data Table]] · [[Falcon Search Input]] · [[Falcon Dropdown]] · [[Falcon Date Picker]] · [[Falcon Status Badge]] · [[Falcon Menu]] · [[Falcon Paginator]] · [[Falcon Empty State]] · [[Falcon Confirm Dialog]]

## Backend services
- [[Basic Send Service]] (planned) — transactions list per channel+mode, scoped to logged-in user (BR-BSA-52)
- [[Commerce Service]] + [[Provisioning Service]] — commchannel + app status for Send gating
- [[Access PES Service]] — `acc.bsa*` resources (pending seed)

## Related V-rules
- _None promoted yet_ — compose-gating + duplicate-normalization + channel-status candidates listed in the module's BUSINESS_RULES §1.5.

## Notes
- React reference: S1/S2 in REACT_REFERENCE (basic-app.jsx:286-364, 2926-2989). Runtime-walked 2026-07-06.

## Tags

#type/page #status/stub #prd/06 #service/basic-send

## Hubs
- [[AMMAR_BRAIN_HOME]] · [[PAGE_LEARNING_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[Basic Send App]] · [[Templates List]] · [[Contact Groups List]] · [[Organization Hierarchy]]
