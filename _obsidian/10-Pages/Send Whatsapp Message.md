---
type: page
slug: send-whatsapp-message
prd-implements: [PRD-06, PRD-05, PRD-04]
has-flow-folder: false
status: stub
created: 2026-07-06
---
*** Page note — Send Whatsapp Message ***
*** Vault file: 10-Pages/Send Whatsapp Message.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\prd\modules\06-basic-send-application\ (page-learning folder not yet seeded) ***
*** Seeded 2026-07-06 by Brain SK basic-send-prd intake ***

# Send Whatsapp Message

> **STUB — seeded from PRD-06.** 3-section compose takeover: **Message Details** (Sender ID → Category Marketing/Utility/Authentication → Language → Template Name cascade with resets; VARIABLES chips; Meta-status warning forces reselect; Delivery Immediate|Schedule), **Recipients** (locked until template; multi-CG picker Created-by-me|Shared-with-me; per-CG mapping card — destination column + 1:1 variable map, move-on-reassign, red invalid, progress pill, add-CG gated until mapped; manual ≤3 with ALL variables enforced at send — conflict C3 ruling; E.164 validation to ADD), **Preview** (phone mockup, first-recipient substitution). Confirm overlay: server cost quote + 'Allow duplicate recipients' (value MUST persist — reference discards it). Summary strip.

## Entry point in Brain Outputs
- [OVERVIEW](../../../Brain%20Outputs/prd/modules/06-basic-send-application/OVERVIEW.md) · [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/06-basic-send-application/BUSINESS_RULES.md) · [REACT_REFERENCE](../../../Brain%20Outputs/prd/modules/06-basic-send-application/REACT_REFERENCE.md) · [IMPLEMENTATION_PLAN](../../../Brain%20Outputs/prd/modules/06-basic-send-application/IMPLEMENTATION_PLAN.md)
- PRD anchor: latest-prd L43-97 (compose, send logic, statuses)

## Implements PRDs
- [[06 Basic Send Application]] — **primary**
- [[05 Templates]] — template/IVR pickers embed template assets
- [[04 Contact Group Management]] — contact groups as recipient source + column mapping

## Likely Falcon components
- [[Falcon Dropdown]] · [[Falcon Card]] · [[Falcon Input]] · [[Falcon Toggle]] · [[Falcon Date Picker]] · [[Falcon Dialog]] · [[Falcon Button]] · [[Falcon Status Badge]] · [[Falcon Tooltip]]

## Backend services
- [[Basic Send Service]] (planned) — POST transactions + quote; templates/CG/sender facades
- [[Templates Service]] — approved own/shared WA templates (3-tier data)
- [[Contact Group Service]] — own/shared groups + columns + sample rows
- [[Charging Service]] — rating input for quote (no dry-run API yet — prereq P-3)

## Related V-rules
- _None promoted yet_ — compose-gating + duplicate-normalization + channel-status candidates listed in the module's BUSINESS_RULES §1.5.

## Notes
- React reference: S3/S3a/S3b (basic-app.jsx:693-1097). fromConversation mode locks recipient (conversation re-initiation path).

## Tags

#type/page #status/stub #prd/06 #prd/05 #prd/04 #service/basic-send

## Hubs
- [[AMMAR_BRAIN_HOME]] · [[PAGE_LEARNING_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[Basic Send App]] · [[Templates List]] · [[Contact Groups List]] · [[Organization Hierarchy]]
