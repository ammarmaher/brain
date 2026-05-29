---
type: page-flow
page: bsa-conversation
module: 06-basic-send-application
created: 2026-05-19
prd-source: "Basic Send Application-V2.docx §WhatsApp Conversation Page"
---

# BSA — WhatsApp Conversation Page

> Displays all historical + future conversation messages between Recipient × Sender ID across all applications, all users, all transactions.

## TL;DR

Single-page chat view per (recipient × sender). Combines all interactions across the entire WhatsApp Business Account.

## Layout

**Left Section — Message Details:**
- Sender ID
- Message type
- Message status history

**Right Section — Conversation Timeline:**
- Sent messages
- Recipient replies

## Messaging support

- WhatsApp messaging features
- **24-hour window restrictions** (Meta rule)
- Interactive conversations

## 24-hour window rule

Per WhatsApp Business API:
- Business cannot initiate without pre-approved template
- After recipient reply, 24-hour window opens → business can send freely (templates OR free-form)
- Window expires → new approved template required

## Source

- [[06-Basic-Send-Application]]
- [[BSA-Outbox]] (Conversation accessed via Outbox row Details)
- [Atlas Vol 40 §4 W8](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-40-MODULE-06-CONCLUSION.md)
- [Atlas Vol 41 — Template V4 §11 (24-hour window)](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-41-TEMPLATE-V4-DEEP-REFRESH.md)

## Tags

#type/page-flow #module/bsa #page/conversation
