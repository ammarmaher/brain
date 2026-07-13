---
type: page
slug: basic-send-voice-details
prd-implements: [PRD-06]
has-flow-folder: false
status: stub
created: 2026-07-06
---
*** Page note — Basic Send Transaction Details (Voice) ***
*** Vault file: 10-Pages/Basic Send Voice Details.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\prd\modules\06-basic-send-application\ (page-learning folder not yet seeded) ***
*** Seeded 2026-07-06 by Brain SK basic-send-prd intake ***

# Basic Send Transaction Details (Voice)

> **STUB — seeded from PRD-06.** Voice detail takeover: **Call Statistics** (Answered/Busy/No-Answer/Failed bars + IVR Completion % + Avg Duration), **Cost Breakdown** (Total/Average cost + Total/Average seconds + by destination + **by retry attempt** + **by IVR type** — C10), **Recipients grid** (expandable per-attempt sub-table: Attempt # · Status · Time · Wait · Cost; 11 voice statuses; **ADD Send Date + Message Cost columns** — conflict C2 ruling), selected-recipient **IVR canvas + call description + transcript**, recorded-call playback (design fresh — reference modal is orphaned), Conversation action → voice conversation with cross-channel follow-up.

## Entry point in Brain Outputs
- [OVERVIEW](../../../Brain%20Outputs/prd/modules/06-basic-send-application/OVERVIEW.md) · [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/06-basic-send-application/BUSINESS_RULES.md) · [REACT_REFERENCE](../../../Brain%20Outputs/prd/modules/06-basic-send-application/REACT_REFERENCE.md) · [IMPLEMENTATION_PLAN](../../../Brain%20Outputs/prd/modules/06-basic-send-application/IMPLEMENTATION_PLAN.md)
- PRD anchor: latest-prd L370-408 (outbox detail), L429-445 (scheduled detail; Attempts=0 — C9 ruling)

## Implements PRDs
- [[06 Basic Send Application]] — **primary**

## Likely Falcon components
- [[Falcon Card]] · [[Falcon Data Table]] · [[Falcon Status Badge]] · [[Falcon Menu]] · [[Falcon Paginator]] · [[Falcon Button]] · [[Falcon Tooltip]]

## Backend services
- [[Basic Send Service]] (planned) — attempt audit rows + voice stats + IVR walk capture + call recordings
- SIP provider adapter (status mapping sheet = prereq P-4)

## Related V-rules
- _None promoted yet_ — compose-gating + duplicate-normalization + channel-status candidates listed in the module's BUSINESS_RULES §1.5.

## Notes
- React reference: S5 + S7 (basic-app.jsx:1903-2161, 1759-1901). AI-handoff demo after IVR transfer = code-only #14, default CUT from v1.

## Tags

#type/page #status/stub #prd/06 #service/basic-send

## Hubs
- [[AMMAR_BRAIN_HOME]] · [[PAGE_LEARNING_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[Basic Send App]] · [[Templates List]] · [[Contact Groups List]] · [[Organization Hierarchy]]
