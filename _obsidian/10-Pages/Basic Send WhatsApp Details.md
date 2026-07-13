---
type: page
slug: basic-send-whatsapp-details
prd-implements: [PRD-06]
has-flow-folder: false
status: stub
created: 2026-07-06
---
*** Page note — Basic Send Transaction Details (WhatsApp) ***
*** Vault file: 10-Pages/Basic Send WhatsApp Details.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\prd\modules\06-basic-send-application\ (page-learning folder not yet seeded) ***
*** Seeded 2026-07-06 by Brain SK basic-send-prd intake ***

# Basic Send Transaction Details (WhatsApp)

> **STUB — seeded from PRD-06.** Outbox/Scheduled detail takeover: header (template + status pill + created/type/txn-id + Export Details/Statistics — must be REAL exports), status banners (failReason / deleted / scheduled / in-progress live progress), KPI row, **Overview Stats** bars (Delivered/Read/Played/Seen/Failed/Reply + **Average Delivery Time displayed** — conflict C13), **Cost Breakdown** (totals + by destination + **by template type** — C10), **Recipients grid** (number · status 7-set incl. Failed — C1 ruling · Send/Delivery/Status dates · Reply flag · Message Cost · Conversation action gated) + per-recipient phone preview. Scheduled variant frozen: zeroed stats, Pending, 0 SAR, conversation disabled (BR-BSA-75).

## Entry point in Brain Outputs
- [OVERVIEW](../../../Brain%20Outputs/prd/modules/06-basic-send-application/OVERVIEW.md) · [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/06-basic-send-application/BUSINESS_RULES.md) · [REACT_REFERENCE](../../../Brain%20Outputs/prd/modules/06-basic-send-application/REACT_REFERENCE.md) · [IMPLEMENTATION_PLAN](../../../Brain%20Outputs/prd/modules/06-basic-send-application/IMPLEMENTATION_PLAN.md)
- PRD anchor: latest-prd L126-160 (outbox detail), L182-198 (scheduled detail)

## Implements PRDs
- [[06 Basic Send Application]] — **primary**

## Likely Falcon components
- [[Falcon Card]] · [[Falcon Data Table]] · [[Falcon Status Badge]] · [[Falcon Menu]] · [[Falcon Paginator]] · [[Falcon Button]] · [[Falcon Tooltip]] · [[Falcon Empty State]]

## Backend services
- [[Basic Send Service]] (planned) — per-recipient results + stats aggregation + exports (S3 presigned, CG-download precedent)
- Meta webhooks feed the per-recipient statuses (Sent/Delivered/Read/Played/Seen/Failed) + reply capture

## Related V-rules
- _None promoted yet_ — compose-gating + duplicate-normalization + channel-status candidates listed in the module's BUSINESS_RULES §1.5.

## Notes
- React reference: S4 (basic-app.jsx:1173-1360). Cancel dialog + race-aware outcome: S8 (:2867-2891) — adopt as the BR-BSA-56 UX contract.

## Tags

#type/page #status/stub #prd/06 #service/basic-send

## Hubs
- [[AMMAR_BRAIN_HOME]] · [[PAGE_LEARNING_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[Basic Send App]] · [[Templates List]] · [[Contact Groups List]] · [[Organization Hierarchy]]
