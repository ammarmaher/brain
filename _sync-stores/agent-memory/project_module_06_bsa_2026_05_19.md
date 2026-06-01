---
name: Module 06 Basic Send Application (BSA) discovered 2026-05-19
description: Falcon has a 6th module — built-in WhatsApp + Voice IVR sending engine, auto-available per account. Corrects Atlas Vol 32 §5 (Application is partially Falcon-built, not exclusively client-supplied).
type: project
originSessionId: f6ecc776-1773-4495-92d7-3bd75ebceecd
---
Falcon has a **6th PRD module**: Basic Send Application (BSA). Discovered 2026-05-19 when user dropped fresh BRDs at `C:\Falcon\PRD\BRDs\`.

**Source:** `C:\Falcon\PRD\BRDs\6- Basic Sending App\Basic Send Application-V2.docx` (446 lines / 17K chars)

**Key facts:**
- AUTOMATICALLY AVAILABLE for every account on creation
- Default config: Visibility enabled · One-time payment pricing · 0 SAR cost (Falcon-editable)
- 2 sub-modules: WhatsApp + Voice IVR
- Each has 3 tabs: Outbox · Scheduled · Send Action
- 7-state Transaction FSM: Scheduled → In Progress → {Completed, Partially Processed, Failed, Canceled, Deleted}
- 6-state Recipient FSM (WhatsApp): Pending → Sent → Delivered → Read → Played → Seen
- 4 APIs: BSA Send · Template Retrieval · Contact Group Retrieval · Sender ID Retrieval
- Conversation tracking with 24-hour WhatsApp window
- NO pre-reservation; balance deducted at execution per batch
- NO failover between CommChannels
- Cancel + Edit + Delete actions on scheduled transactions

**Major corrections forced by this discovery:**
- Atlas Vol 32 §5 was WRONG: "Application is client's own software" → REVISED: Falcon HAS BSA (built-in)
- Vol 33 §4 Hard Nots: "Falcon does NOT have send scheduling" → REVISED: HAS via BSA Scheduled tab
- Vol 33 §4 Hard Nots: "Falcon does NOT have Campaign entity" → REVISED: HAS BSA Transaction (campaign by different name)

**How to apply:**
- Future Claude sessions: BSA exists, treat as full 6th module
- Full coverage in Atlas Vol 40
- BRD refresh log: Vol 42 §2 Discovery 1
- When discussing campaigns/sending → cite BSA + Vol 40 not the inferred client-app assumption
