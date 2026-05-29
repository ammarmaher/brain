---
type: page-flow
page: bsa-outbox
module: 06-basic-send-application
created: 2026-05-19
prd-source: "Basic Send Application-V2.docx §WhatsApp Outbox + §Voice Outbox"
---

# BSA — Outbox Tab

> Displays all transactions whose execution time has been reached. Per module (WhatsApp + Voice).

## Columns (WhatsApp Outbox)

- Transaction ID (auto)
- Sender ID
- Template name
- Template language
- Template type
- Creation date
- Total recipient count
- Total transaction cost
- Recipients (CG names + manual)
- Status (In Progress, Canceled, Partially Processed, Failed, Completed)
- Actions (3dots): Details · Cancel

## Voice Outbox specifics

Same shape as WhatsApp + Voice-specific fields: IVR Name · IVR Type

## Cancel action

User clicks "Cancel" in 3dots → confirmation popup → system stops next batch → fields update (status → "Canceled", count/cost reflect partial completion).

## Details page

- General Information: Transaction ID · Sender ID · Template Details · Creation Date · Total Recipients · Total Cost · Status
- Recipient Details Grid: per-recipient mobile · message status · send date · delivery date · status date · message cost · reply indicator
- Available Actions: Conversation · Message Preview · Export (transaction details + statistics)

## Source

- [[06-Basic-Send-Application]]
- [[BSA-Scheduled]]
- [[BSA-Conversation]]
- [Atlas Vol 40 §4 W4](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-40-MODULE-06-CONCLUSION.md)

## Tags

#type/page-flow #module/bsa #tab/outbox
