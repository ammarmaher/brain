---
type: journey
journey-name: Basic Send Message
crosses-pages: [basic-send-app, send-whatsapp-message, send-voice-ivr-message, basic-send-whatsapp-details, basic-send-voice-details, whatsapp-conversation]
prds-involved: [PRD-06, PRD-05, PRD-04, PRD-03, PRD-01]
created: 2026-07-06
---
*** Journey note — Basic Send Message ***
*** Vault file: 16-Journeys/Basic Send Message.md ***
*** Brain Outputs SoT: Brain Outputs/prd/modules/06-basic-send-application/WORKFLOWS.md (journey playbook folder not yet seeded) ***
*** Created 2026-07-06 by Brain SK basic-send-prd intake ***

# Basic Send Message (PRD-06 — the productized [[Send Campaign]])

> A Normal User opens the purchased **Basic Send Application**, picks a channel (WhatsApp or Voice), composes against an approved own/shared template with contact-group variable mapping (+ ≤3 manual recipients), confirms cost + duplicate handling, sends now or schedules — the engine charges at execution (WA per-batch reserve→commit|release; Voice per-second realtime), tracks per-recipient delivery, and (WA) opens a 24h customer-service-window conversation per recipient. [[Send Campaign]] sketched this flow cross-module; PRD-06 turns it into a concrete application with full state machines.

## Steps → pages

1. Purchase + activate (AO/Falcon) → Marketplace ([[01 Account Management]]; BR-BSA-01..05)
2. Open app → [[Basic Send App]] (channel/status/role gating)
3. Compose → [[Send Whatsapp Message]] or [[Send Voice IVR Message]] (assets from [[Templates List]]-managed templates + [[Contact Groups List]]-managed groups)
4. Confirm (quote + duplicates) → engine executes (WORKFLOWS §4.1/4.2; charging per [[03 Contract Packaging Charging Billing]] W6)
5. Track → [[Basic Send WhatsApp Details]] / [[Basic Send Voice Details]] (cancel at batch edge · exports)
6. Converse (WA) → [[WhatsApp Conversation]] (CS window · template re-initiation · record chaining)

## Backend

- [[Basic Send Service]] — planned owner (GAP-BSA-01); consumes [[Charging Service]] · [[Templates Service]] · [[Contact Group Service]] · [[Commerce Service]] · [[Provisioning Service]] · [[Access PES Service]]

## Tags

#type/journey #prd/06 #prd/05 #prd/04 #prd/03 #prd/01 #service/basic-send #gap

## Hubs

- [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[PAGES_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[Send Campaign]] · [[16-Journeys/README|16-Journeys]]
