---
type: page
slug: whatsapp-conversation
prd-implements: [PRD-06]
has-flow-folder: false
status: stub
created: 2026-07-06
---
*** Page note — WhatsApp Conversation ***
*** Vault file: 10-Pages/WhatsApp Conversation.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\prd\modules\06-basic-send-application\ (page-learning folder not yet seeded) ***
*** Seeded 2026-07-06 by Brain SK basic-send-prd intake ***

# WhatsApp Conversation

> **STUB — seeded from PRD-06.** Per-recipient conversation from a WA details row: **Message Info panel** (sender/type + Created/Send/Delivery/Read dates; mirrors a message on its info action), chronological **thread** (sender right / recipient left; 11 message types — reference lacks Video/Location/Contacts/Interactive, ADD them; ticks; reactions), **message actions** (Reply/Info/React/Download — gated by window), **in-thread search** (highlight + prev/next), **24h Customer-Service-Window countdown** (LIVE, server-computed `windowExpiresAt`, resets on every recipient inbound, expiry flips composer — reference is a static 22:30:15 demo), **composer** (text/emoji/attachment/voice-record/template). After expiry: template-only → compose fromConversation (recipient locked) → staged card → send creates a **NEW conversation record chained to the previous** (BR-BSA-83/84 — reference posts into same thread, C8 ruling: PRD wins).

## Entry point in Brain Outputs
- [OVERVIEW](../../../Brain%20Outputs/prd/modules/06-basic-send-application/OVERVIEW.md) · [BUSINESS_RULES](../../../Brain%20Outputs/prd/modules/06-basic-send-application/BUSINESS_RULES.md) · [REACT_REFERENCE](../../../Brain%20Outputs/prd/modules/06-basic-send-application/REACT_REFERENCE.md) · [IMPLEMENTATION_PLAN](../../../Brain%20Outputs/prd/modules/06-basic-send-application/IMPLEMENTATION_PLAN.md)
- PRD anchor: latest-prd L200-283

## Implements PRDs
- [[06 Basic Send Application]] — **primary**

## Likely Falcon components
- [[Falcon Card]] · [[Falcon Input]] · [[Falcon Button]] · [[Falcon Search Input]] · [[Falcon Badge]] · [[Falcon Tooltip]] · [[Falcon Drawer]]

## Backend services
- [[Basic Send Service]] (planned) — conversation store + CS-window logic + free-form send via Meta within window
- Meta inbound webhooks (message + reply capture) start/reset the window; charging of window messages = Q-BSA-22

## Related V-rules
- _None promoted yet_ — compose-gating + duplicate-normalization + channel-status candidates listed in the module's BUSINESS_RULES §1.5.

## Notes
- React reference: S6 (basic-app.jsx:2371-2706). Voice counterpart (IVR walk playback) documented in [[Basic Send Voice Details]].

## Tags

#type/page #status/stub #prd/06 #service/basic-send

## Hubs
- [[AMMAR_BRAIN_HOME]] · [[PAGE_LEARNING_INDEX]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[Basic Send App]] · [[Templates List]] · [[Contact Groups List]] · [[Organization Hierarchy]]
