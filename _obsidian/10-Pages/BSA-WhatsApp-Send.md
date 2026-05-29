---
type: page-flow
page: bsa-whatsapp-send
module: 06-basic-send-application
created: 2026-05-19
prd-source: "Basic Send Application-V2.docx §WhatsApp Module"
---

# BSA — Send WhatsApp Message Flow

> Page-flow node for BSA WhatsApp Module. Normal User clicks "Send WhatsApp Message" → composition wizard → review → Send Now or Schedule.

## TL;DR

5-step composition: Select Sender ID → Select Template → Add Recipients → Message Preview → Sending Time (Now/Schedule) → Confirmation (with duplicate handling + cost estimate) → Submit.

## Steps

1. **Select Sender ID** — WhatsApp phone number linked to Meta; Permission Groups may restrict access
2. **Select Template** — only Approved templates (own + shared); flow: Category → Language → Template Name
3. **Add Recipients** — Contact Groups (with destination column + variable mapping) OR manual (max 3)
4. **Message Preview** — live with variable replacement using first recipient from first CG
5. **Sending Time** — Send Now OR Schedule for future
6. **Confirmation** — duplicate handling option + cost estimation
7. **Submit** — instant for "now", stored for scheduled

## Send logic at execution time

Per BR-BSA-11/12: No balance reservation; deduction during execution per batch/record. Processing order: Manual recipients first → CGs in insertion order. Variable replacement immediately before Meta dispatch.

## Transaction statuses

`Scheduled → In Progress → {Completed, Partially Processed, Failed, Canceled, Deleted}`

## Permissions

| Role | Send WhatsApp |
|---|---|
| Falcon (SA/OP/PR) | ❌ Falcon doesn't initiate client sends |
| Account Owner | ✅ (default) |
| Node Admin | ✅ (default) |
| Normal User | ✅ (default; restricted via Permission Groups) |

## Source

- [[06-Basic-Send-Application]] (PRD module)
- [[BSA-Outbox]] (post-send view)
- [[BSA-Scheduled]] (future-dated view)
- [Atlas Vol 40 §4 W1](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-40-MODULE-06-CONCLUSION.md)
- BRD: `C:\Falcon\PRD\BRDs\6- Basic Sending App\Basic Send Application-V2.docx`

## Tags

#type/page-flow #module/bsa #flow/send-whatsapp
