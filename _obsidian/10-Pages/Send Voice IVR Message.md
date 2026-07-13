---
type: page
slug: send-voice-ivr-message
prd-implements: [PRD-06, PRD-05, PRD-04]
has-flow-folder: false
status: stub
created: 2026-07-06
---
*** Page note — Send Voice IVR Message ***
*** Vault file: 10-Pages/Send Voice IVR Message.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\prd\modules\06-basic-send-application\ (page-learning folder not yet seeded) ***
*** Seeded 2026-07-06 by Brain SK basic-send-prd intake ***

# Send Voice IVR Message

> **STUB — seeded from PRD-06.** Voice compose: 2-tier cascade (Category **Dynamic|Static** → Template Name), **Retry Logic toggle** (trigger statuses No Answer/Busy/Cancel/Failed; ≤3 attempts each with wait-minutes 1..1440 — config MUST persist to the transaction; reference drops it), same Recipients block as WA (CG mapping + manual ≤3), **Preview = read-only IVR canvas** (node-tap prompt playback per PRD L317-318). Confirm overlay adds expected-call-time to the estimate (Q-BSA-03). Send logic: per-second realtime charging, no reservation, terminate on exhaustion, pre-call 1-second gate (BR-BSA-21/22).

## Entry point in Brain Outputs
- [OVERVIEW](../../../Brain%20Outputs/prd/modules/06-basic-send-application/OVERVIEW.md) · [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/06-basic-send-application/BUSINESS_RULES.md) · [REACT_REFERENCE](../../../Brain%20Outputs/prd/modules/06-basic-send-application/REACT_REFERENCE.md) · [IMPLEMENTATION_PLAN](../../../Brain%20Outputs/prd/modules/06-basic-send-application/IMPLEMENTATION_PLAN.md)
- PRD anchor: latest-prd L288-342

## Implements PRDs
- [[06 Basic Send Application]] — **primary**
- [[05 Templates]] — template/IVR pickers embed template assets
- [[04 Contact Group Management]] — contact groups as recipient source + column mapping

## Likely Falcon components
- [[Falcon Dropdown]] · [[Falcon Toggle]] · [[Falcon Checkbox]] · [[Falcon Input Number]] · [[Falcon Card]] · [[Falcon Dialog]] · [[Falcon Button]]

## Backend services
- [[Basic Send Service]] (planned) — voice engine + retry scheduler + SIP adapter (greenfield; SIP mapping sheet = prereq P-4)
- [[Templates Service]] — IVR trees (`flow.nodes[].content[].voiceRecordId`) + voice records (S3 presigned audio)
- [[Charging Service]] — realtime substrate (`ocs:realtime-events` VOICE hot channel; per-second loop is NEW)

## Related V-rules
- _None promoted yet_ — compose-gating + duplicate-normalization + channel-status candidates listed in the module's BUSINESS_RULES §1.5.

## Notes
- React reference: S3 voice branches (basic-app.jsx:713, 857-897, 1061-1064). Voice sender IDs come from a registry that DOES NOT EXIST (prereq P-2).

## Tags

#type/page #status/stub #prd/06 #prd/05 #prd/04 #service/basic-send

## Hubs
- [[AMMAR_BRAIN_HOME]] · [[PAGE_LEARNING_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[Basic Send App]] · [[Templates List]] · [[Contact Groups List]] · [[Organization Hierarchy]]
