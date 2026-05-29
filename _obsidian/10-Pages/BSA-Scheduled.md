---
type: page-flow
page: bsa-scheduled
module: 06-basic-send-application
created: 2026-05-19
prd-source: "Basic Send Application-V2.docx §WhatsApp Scheduled Tab"
---

# BSA — Scheduled Tab

> Grid view for transactions created by the logged-in user whose due date is NOT yet satisfied.

## Columns

- Transaction ID
- Sender ID
- Template name + language + type
- Creation date
- Scheduled date
- Total recipient count + cost
- Recipients
- Status (Scheduled, Deleted)
- Actions (3dots): Details · Edit · Delete

## Edit action

Opens Transaction Detail in edit mode. Editable: WhatsApp template · Recipients · Send datetime · Sender ID. Constraint: only before scheduled date.

## Delete action

- Enabled ONLY if due date NOT yet satisfied
- Confirmation popup required
- Record stays in view but status → "Deleted"
- System ignores at execution time

## Edge cases

| Scenario | Behavior |
|---|---|
| CommChannel disabled before scheduled execution | Transaction fails automatically; failure reason recorded |
| Template revoked OR Contact Group deleted before scheduled execution | Transaction fails at execution time; reason logged ("Asset Missing") |
| Balance = 0 at scheduled start | "Failed – Insufficient Balance" status; no messages sent |

## Source

- [[06-Basic-Send-Application]]
- [[BSA-Outbox]]
- [Atlas Vol 40 §4 W5/W6](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-40-MODULE-06-CONCLUSION.md)

## Tags

#type/page-flow #module/bsa #tab/scheduled
