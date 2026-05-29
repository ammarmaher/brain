---
type: prd-module
module: 06-basic-send-application
prd-source: "Basic Send Application-V2.docx (Drive 2026-05-19, 446 lines)"
status: "Discovered 2026-05-19 — Atlas Vol 40 conclusion"
created: 2026-05-19
maintained-by: Vol 43 enhancement run
---

# PRD-06 — Basic Send Application (BSA)

> Falcon's **built-in** WhatsApp + Voice IVR sending engine. Automatically available for every account on creation. The functional equivalent of "campaign" engine — but called "Send Transaction".

## TL;DR

BSA is the missing piece I was previously inferring as "client-supplied Application". It's actually **Falcon-built infrastructure**: 2 modules (WhatsApp + Voice IVR) × 3 tabs (Outbox + Scheduled + Send action) × 4 APIs. Auto-active per account with default 0 SAR cost.

## Canonical references

- **Vol 40 (Full Conclusion)** → [`BUSINESS-SCENARIOS-ATLAS-VOL-40-MODULE-06-CONCLUSION`](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-40-MODULE-06-CONCLUSION.md)
- **Vol 42 §2.1** (Discovery context) → [`BUSINESS-SCENARIOS-ATLAS-VOL-42-BRD-REFRESH-REPORT`](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-42-BRD-REFRESH-REPORT.md)
- **Source BRD** → `C:\Falcon\PRD\BRDs\6- Basic Sending App\Basic Send Application-V2.docx`
- **Extracted** → `C:\Falcon\PRD\BRDs\_extracted\Basic-Send-Application-V2.txt`

## Module structure

```
Basic Send Application (BSA)
├── WhatsApp Module
│   ├── Outbox tab
│   ├── Scheduled tab
│   ├── Send WhatsApp Message action
│   └── Transaction Details + Conversation pages
├── Voice (IVR) Module
│   ├── Outbox tab
│   ├── Scheduled tab
│   ├── Send IVR Voice Message action
│   └── Transaction Details page
└── APIs (4)
    ├── BSA Send API
    ├── Template Retrieval API
    ├── Contact Group Retrieval API
    └── Sender ID Retrieval API
```

## Page nodes (Brain SK Obsidian)

- [[BSA-WhatsApp-Send]]
- [[BSA-Voice-IVR-Send]]
- [[BSA-Outbox]]
- [[BSA-Scheduled]]
- [[BSA-Conversation]]

## Backend service

- [[BSA-Service]] (NEW — backend dossier pending)

## Transaction status FSM

`Scheduled → In Progress → {Completed, Partially Processed, Failed, Canceled, Deleted}`

## Recipient delivery status (WhatsApp)

`Pending → Sent → Delivered → Read → Played → Seen`

## Critical business rules

- BR-BSA-02: Once activated, BSA available to ALL Normal Users (unless Permission Group restricts)
- BR-BSA-11: NO balance reservation at creation; deduction at execution
- BR-BSA-14: Mid-batch insufficient balance → "Partially Processed"
- BR-BSA-15: NO failover between CommChannels (user chooses)
- BR-BSA-17: Only Approved templates can be used

## Cross-module dependencies

- → [[01 Account Management]]: BSA AppConfig per account; CommChannel state gates SEND
- → [[02 User Management]]: NU permission groups; Maker = template creator
- → [[03 Contract Packaging Charging Billing]]: Cost estimation uses Contract Detail matrix
- → [[04 Contact Group Management]]: CGs feed recipients + variable mapping
- → [[05 Templates]]: Approved templates required (both WhatsApp + Voice IVR)
- → Meta: WhatsApp dispatch
- → Voice Providers: Voice IVR dispatch (SIP)
- → core Wallet Engine: refund processing on third-party rejections

## Corrects earlier Atlas claims

- **Vol 32 §5 was WRONG** — Application IS partially Falcon-built (BSA), not exclusively client-supplied
- **Vol 33 §4 Hard Nots — revised:**
  - "Falcon does NOT have send scheduling" → REVISED: HAS via BSA Scheduled tab
  - "Falcon does NOT have a Campaign entity" → REVISED: HAS BSA Transaction (campaign by another name)

## Open gaps

🟡 BSA backend service dossier NOT yet built (`understanding/backend/bsa/` doesn't exist)
🟡 BSA controllers not yet deep-mined
🟡 Voice Record Library UI not yet documented
🟡 Conversation module enhancements (future per BR-BSA-47)

## See also

- [[PRD_INDEX]] · [[AMMAR_BRAIN_HOME]] · [[ATLAS_MASTER_INDEX]]

## Tags

#type/prd-module #prd/06 #module/bsa #status/new


---

## Vol 44 cross-reference (added 2026-05-18)

The [[VOL-44-TRUTH-TAUTOLOGIES]] atomic note carries direct BRD-extracted facts relevant to this module. See [[Vol 44 — Supporting Artifacts Research]] for the long-form treatment.



## Vol 46 specialist cross-reference (added 2026-05-18)

For channels/campaigns/templates deep dive, see:
- [[CAMPAIGNS-CHANNELS-SPECIALIST-HUB]] (entry point)
- [[Vol 46 — Campaigns Channels Specialist Guide]] (graph node)
- 5-word truth: WhatsApp + Voice + SMS implemented; Facebook/Instagram are NOT.

