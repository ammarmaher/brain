---
type: journey
journey-name: Send Campaign
crosses-pages: [contact-groups, templates, send-transaction, implementationknowledgemap, backendindex, validationindex]
prds-involved: [PRD-04, PRD-05]
created: 2026-05-15
---
*** Journey note — Send Campaign ***
*** Vault file: 16-Journeys/Send Campaign.md ***
*** Brain Outputs SoT: C:\Falcon\Brain Outputs\understanding\journeys\send-campaign\ ***
*** Created 2026-05-15 by Brain SK Phase 3B — User Journeys ***

# Send Campaign

> A Normal User picks a Contact Group, picks a Template, composes a Send Transaction, and confirms. Backend resolves the **nearest-expiring Active contract** for the relevant CommChannel and charges against its wallet bucket. Provisioning fans out delivery. The day-to-day transactional flow every other journey eventually leads to.
>
> **2026-07-06: PRD-06 productizes this journey.** The concrete application is the [[06 Basic Send Application]]; the fully-specified journey node is [[Basic Send Message]] (real pages seeded — the forward-refs below are superseded by [[Basic Send App]] / [[Send Whatsapp Message]] / [[Send Voice IVR Message]]).

## Entry point in Brain Outputs

- [Journey README](../../../Brain%20Outputs/understanding/journeys/send-campaign/README.md)
- [Journey PLAYBOOK](../../../Brain%20Outputs/understanding/journeys/send-campaign/PLAYBOOK.md)

## Pages traversed (in order)

1. [[Contact Groups]] — `forward-ref (page not yet seeded — PRD-04)` — user picks audience
2. [[Templates]] — `forward-ref (page not yet seeded — PRD-05)` — user picks template
3. [[Send Transaction]] — `forward-ref (page not yet seeded)` — user composes and confirms

## Flow playbooks used (in order)

- [[Contact Group Selection Flow]] — `forward-ref (flow not yet seeded)`
- [[Template Selection Flow]] — `forward-ref (flow not yet seeded)`
- [[Send Transaction Flow]] — `forward-ref (flow not yet seeded)`

## Kafka events fired

- `commerce.service-order-created.v1` — Commerce → Provisioning + Charging (Send accepted)
- `commerce.charging-debited.v1` — `forward-ref (event name TBC)` — post-confirm debit
- `templates.template-used.v1` — `forward-ref (event name TBC)` — analytics
- `provisioning.delivery-started.v1` — `forward-ref (event name TBC)` — downstream delivery adapter

## Hub backlinks

[[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[PRD_INDEX]] · [[BACKEND_INDEX]] · [[VALIDATION_INDEX]] · [[PAGES_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[16-Journeys/README|16-Journeys]]

## Tags

#type/journey #prd/04 #prd/05 #prd/06
