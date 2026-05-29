---
type: per-module-conclusion-knowledge
volume: 40
module: 06-basic-send-application
title: "Module 06 — Basic Send Application (BSA) CONCLUSION KNOWLEDGE"
purpose: "CRITICAL NEW MODULE discovered 2026-05-19 via fresh BRD at C:\\Falcon\\PRD\\BRDs\\6- Basic Sending App. This is Falcon's BUILT-IN sending engine — what Atlas Vol 32 previously inferred was client-supplied is actually Falcon-provided."
authority: "CANONICAL for Module 06 — supersedes Vol 32 §5 'Application Layer' which incorrectly inferred client-built"
prd-source: "Basic Send Application-V2.docx (Drive 2026-05-19) — 446 lines"
correction-flag: "Vol 32 §5 was wrong — Application IS Falcon-built (BSA), not client-supplied"
---

# Module 06 — Basic Send Application (BSA) CONCLUSION

> Master answer key for the previously-undocumented sending engine. BSA is the WhatsApp + Voice IVR campaign engine built into Falcon, automatically available for every account with one-time pricing model (default 0 SAR).

---

## §1 — THE ONE-PARAGRAPH MODULE TRUTH

> **Basic Send Application (BSA) is Falcon's built-in lightweight sending application that enables WhatsApp messages and Voice IVR broadcasts to be sent from the Falcon UI or via APIs. It is AUTOMATICALLY AVAILABLE for every account on creation with: visibility enabled · one-time payment pricing · default cost of 0 SAR (modifiable by Falcon usertype). It contains 2 modules (WhatsApp + Voice IVR), each with 3 tabs (Outbox, Scheduled, Send Transaction action). Only Account Owner + Falcon User Types can purchase/activate applications from Marketplace; once activated, BSA is available to all Normal Users in the account unless Permission Groups restrict access. Critically, BSA balance handling has NO pre-reservation — deduction happens at execution time per batch/record — meaning a scheduled transaction may fail mid-execution if balance runs out (status = "Partially processed"). NO failover between CommChannels — users explicitly choose WhatsApp OR Voice per send. Only approved templates can be used (BOTH WhatsApp AND Voice IVR). Users can only access their own + shared assets (templates + contact groups). Send transactions support Send Now OR Schedule (with full edit/delete capability in Scheduled tab pre-execution). Recipients via Contact Groups (full mapping) OR Manual (max 3). Variable replacement happens immediately before dispatch to Meta (or voice provider). The BSA exposes 4 APIs for system-to-system integration: BSA Send API, Template Retrieval, Contact Group Retrieval, Sender ID Retrieval. Transaction statuses: Scheduled → In Progress → {Completed · Partially Processed · Failed · Canceled · Deleted}. Recipient delivery statuses (WhatsApp): Pending → Sent → Delivered → Read → Played → Seen.**

---

## §2 — WHAT THIS MODULE OWNS

### Domain entities

| Entity | Key fields | Lifecycle |
|---|---|---|
| **Transaction** | id (auto), senderId, templateId, templateLanguage, templateType, creationDate, scheduledDate, totalRecipientCount, totalTransactionCost, recipients[], status | Scheduled → In Progress → {Completed, Partially Processed, Failed, Canceled, Deleted} |
| **RecipientDelivery** | transactionId, mobileNumber, messageStatus, sendDate, deliveryDate, statusDate, messageCost, replyIndicator | Per-recipient status FSM (see §4) |
| **Conversation** | senderId, recipientNumber, messages[], 24h-window-flag | Active during 24h window |
| **SenderID** | commChannel, phoneNumber, accountId | Per-account; Permission Groups may restrict access |
| **BSA Configuration** (per-account) | visibility (enabled by default), pricingType (OneTimePayment), priceValueSar (default 0), enabled flags | Set at account creation; Falcon-only edit |

### Status enums

#### Transaction Status FSM
- **Scheduled** — created with future date; visible in Scheduled tab
- **In Progress** — currently executing
- **Completed** — all recipients processed successfully
- **Partially Processed** — some processed, then insufficient balance OR error
- **Failed** — aborted before any record processed (insufficient balance, asset missing)
- **Canceled** — user invoked Cancel action mid-execution (or before execution from Outbox)
- **Deleted** — user deleted scheduled transaction BEFORE due date

#### WhatsApp Recipient Delivery Status
- **Pending** — message queued
- **Sent** — dispatched to Meta
- **Delivered** — Meta confirmed delivery
- **Read** — recipient opened
- **Played** — voice/media played (likely for media messages)
- **Seen** — interaction confirmed

---

## §3 — MODULE STRUCTURE

```
Basic Send Application (BSA)
├── WhatsApp Module
│   ├── Outbox tab (executed transactions)
│   ├── Scheduled tab (future-dated transactions)
│   ├── Send WhatsApp Message action
│   ├── Transaction Details page
│   └── Conversation page (24h window tracking)
├── Voice (IVR) Module
│   ├── Outbox tab
│   ├── Scheduled tab
│   ├── Send IVR Voice Message action
│   ├── Transaction Details page
│   └── Voice preview page
└── APIs (4)
    ├── BSA Send API
    ├── Template Retrieval API
    ├── Contact Group Retrieval API
    └── Sender ID Retrieval API
```

---

## §4 — WORKFLOWS

### W1 — Send WhatsApp Message

**Trigger:** NU clicks "Send WhatsApp Message"
**Steps:**
1. **Select Sender ID** — WhatsApp phone number linked to Meta; Permission Groups may restrict
2. **Select Template** — one approved template only; flow: Category → Language → Template Name
3. **Add Recipients** — Contact Groups (with destination column + variable mapping) OR manual (max 3)
4. **Message Preview** — live with variable replacement using first recipient from first CG
5. **Sending Time** — Send Now OR Schedule for future
6. **Confirmation** — duplicate handling option + estimated cost (calculated from destination + template category + recipient count + contract pricing)
7. **Submit** — instant for "now", stored for scheduled

### W2 — WhatsApp Send Logic (at execution time)

**Per BRD §"WhatsApp Send Logic":**
1. **Balance Validation** — no pre-reservation; deduction starts during execution; per batch/record
2. **Processing Sequence** — Manual recipients first, then Contact Groups in insertion order
3. **Variable Replacement** — immediately before dispatching payload to Meta
4. **Duplicate Handling** — if disabled: only first occurrence processed
5. **Refund on internal failures** — automatic via core Wallet Engine (NOT BSA)

### W3 — Send IVR Voice Message

**Same architecture as WhatsApp** with Voice-specific differences:
- Sender ID = Voice phone number linked to Voice CommChannel
- Template = Static IVR OR Dynamic IVR
- Preview: replay nodes + variable replacements + call termination behavior
- Payload dispatched to SIP/Voice providers

### W4 — Cancel In-Progress Transaction

**Trigger:** User clicks "Cancel" in Outbox row's 3-dots menu
**Behavior:**
- System stops processing next batch
- Records updated to reflect partial completion
- Status → "Canceled"
- Confirmation popup shown indicating if cancellation took place mid-progress vs after all recipients processed

### W5 — Delete Scheduled Transaction

**Trigger:** User clicks "Delete" in Scheduled tab row
**Constraint:** Only enabled if due date NOT yet reached
**Behavior:**
- Confirmation popup
- Record stays in view but status → "Deleted"
- System ignores at execution time

### W6 — Edit Scheduled Transaction

**Trigger:** User clicks "Edit" in Scheduled tab row
**Editable fields:**
- WhatsApp template
- Recipients
- Send datetime
- Sender ID
**Constraint:** Only before execution time

### W7 — View Transaction Details

**Sections:**
- General Information: Transaction ID · Sender ID · Template Details · Creation Date · Total Recipients · Total Cost · Status
- Recipient Details Grid: per-recipient mobile · message status · send date · delivery date · status date · message cost · reply indicator
- Available Actions: Conversation (open chat history) · Message Preview (final rendered) · Export (transaction details + statistics)

### W8 — View WhatsApp Conversation

**Displays:** All historical + future conversation messages between Recipient × Sender ID across all applications, all users, all transactions
**Components:**
- Left: Message details (Sender ID · Message type · Status history)
- Right: Conversation timeline (sent messages + recipient replies)
**Supports:**
- WhatsApp messaging features
- 24-hour window restrictions
- Interactive conversations

### W9 — API: BSA Send

**Endpoint:** API call from external system
**Capabilities:**
- Authentication + user authorization
- Specify CommChannel (WhatsApp OR Voice)
- Specify Sender ID (phone number)
- Specify message body (Template ID — auto-generated or Reference ID)
- Specify recipients:
  - One contact group per request (with destination column + variable mapping)
  - Manual list (key = variable name, value = per-recipient)
- Duplicate handling flag
- Send date (now if not given; must be > now if given)
- Detailed error responses

### W10 — API: Template Retrieval

**Returns:** List of approved templates eligible for this user (own + shared)
**Per template:** type · name · language (WhatsApp only) · template ID · reference ID · variables

### W11 — API: Contact Group Retrieval

**Returns:** List of CGs eligible for this user (own + shared + active/not-deleted)
**Per CG:** name · ID · reference ID · column names

### W12 — API: Sender ID Retrieval

**Returns:** Per-CommChannel list of available Sender IDs

---

## §5 — BUSINESS RULES (NEW — from BRD V2)

### Access & Activation (BR-BSA-01..03)
- BR-BSA-01: Only Account Owner + Falcon User Types can purchase/activate applications from Marketplace
- BR-BSA-02: Once activated, BSA is available to all Normal Users in the account
- BR-BSA-03: Permission Groups may override default access rights

### CommChannel Availability (BR-BSA-04..06)
- BR-BSA-04: If CommChannel disabled or not activated, SEND action disabled
- BR-BSA-05: Users can still access Outbox + Scheduled tabs when CommChannel disabled
- BR-BSA-06: No transactions can be created while CommChannel is disabled

### Scheduled Transaction Behavior (BR-BSA-07..09)
- BR-BSA-07: If CommChannel becomes disabled before scheduled execution, transaction fails automatically
- BR-BSA-08: Failure reason recorded
- BR-BSA-09: Deleted Template or CG before scheduled execution → transaction fails at execution time with "Asset Missing" reason

### Balance Handling (BR-BSA-10..14)
- BR-BSA-10: BSA follows configured platform balance strategy (Single/Multiple × User/Node)
- BR-BSA-11: NO balance reservation at transaction creation
- BR-BSA-12: Balance deduction at execution time per batch/record
- BR-BSA-13: NO balance failover mechanism between CommChannels
- BR-BSA-14: If final wallet/bucket insufficient mid-execution → transaction aborted as "Partially Processed" OR "Failed"

### CommChannel Isolation (BR-BSA-15..16)
- BR-BSA-15: No failover between CommChannels
- BR-BSA-16: Users explicitly choose WhatsApp OR Voice per send

### Template Usage Rules (BR-BSA-17..18)
- BR-BSA-17: Only approved templates can be used (both WhatsApp + Voice IVR)
- BR-BSA-18: For Voice channels, approved templates required even if unrestricted body mode enabled

### Asset Visibility (BR-BSA-19..21)
- BR-BSA-19: Users access only Approved Templates they created
- BR-BSA-20: Users access only Contact Groups they created
- BR-BSA-21: Users access templates + CGs shared with them

### Variable & Send Logic (BR-BSA-22..26)
- BR-BSA-22: Manual recipient max 3 per transaction
- BR-BSA-23: Variable replacement immediately before dispatching to Meta/Voice provider
- BR-BSA-24: Processing order: Manual recipients first, then CGs in insertion order
- BR-BSA-25: Duplicate handling option per transaction (if disabled: only first occurrence processed)
- BR-BSA-26: Cost estimation based on: Destination + Template category + Recipient count + Contract pricing

### Refund (BR-BSA-27..29)
- BR-BSA-27: Refund occurs automatically for internal processing failures (core Wallet Engine, NOT BSA)
- BR-BSA-28: WhatsApp later-rejected messages (e.g., number blocked) status = "Failed" but BSA does NOT handle refund — core Wallet Engine processes per contract rules
- BR-BSA-29: Third-party rejections (Meta/Voice provider) are logged with reason but refund logic is Wallet Engine concern

### Transaction Cancel (BR-BSA-30..32)
- BR-BSA-30: User can Cancel from Outbox (in-progress transactions); confirmation popup required
- BR-BSA-31: Cancel stops next batch processing; updates fields accordingly
- BR-BSA-32: Cancel popup indicates if cancellation took place mid-progress OR after all records processed

### Edit Scheduled (BR-BSA-33..34)
- BR-BSA-33: Edit allowed only before scheduled date is reached
- BR-BSA-34: Editable: WhatsApp template, Recipients, Send datetime, Sender ID

### Delete Scheduled (BR-BSA-35..36)
- BR-BSA-35: Delete enabled only if scheduled date not yet reached
- BR-BSA-36: Confirmation popup; status → "Deleted" but record retained in view

### APIs (BR-BSA-37..40)
- BR-BSA-37: BSA Send API supports both Web UI parity (same functionality)
- BR-BSA-38: Send API accepts ONE contact group per request
- BR-BSA-39: Template Retrieval returns only approved templates (own + shared)
- BR-BSA-40: Contact Group Retrieval returns only active groups (not deleted)

### Future Enhancements (BR-BSA-41..49 — explicitly Future per BRD)
- BR-BSA-41: Callback and status management configuration (Future)
- BR-BSA-42: Transaction status inquiry APIs (Future)
- BR-BSA-43: Balance inquiry APIs (Future)
- BR-BSA-44: Partial processing configuration toggle (Future)
- BR-BSA-45: Reporting module (Future)
- BR-BSA-46: Detailed CommChannel pages (Future)
- BR-BSA-47: Conversation module enhancements (Future)
- BR-BSA-48: API documentation requirements (Future)
- BR-BSA-49: Other roles behaviour and screens (Future — Pending list)

---

## §6 — PERMISSIONS MATRIX (Module 06 specific)

| Action | SA/PR | OP | AO | NA | NU |
|---|---|---|---|---|---|
| Purchase/Activate from Marketplace | ✅ | ✅ | ✅ | ❌ | ❌ |
| Modify BSA default config | ✅ | ✅ | ❌ | ❌ | ❌ |
| Send Transaction (WhatsApp) | ❌ | ❌ | ✅ | ✅ | ✅ (default) |
| Send Transaction (Voice) | ❌ | ❌ | ✅ | ✅ | ✅ (default) |
| Cancel In-Progress | n/a | n/a | own | own | own |
| Edit Scheduled | n/a | n/a | own | own | own |
| Delete Scheduled | n/a | n/a | own | own | own |
| View Outbox | ✅ | ✅ | ✅ | ✅ (per scope) | ✅ (own) |
| View Conversations | ✅ | ✅ | ✅ | ✅ | ✅ |
| Restrict NU access via Permission Group | ✅ | ✅ | ✅ | ❌ | ❌ |

Note: Permission Groups may further restrict access; defaults shown.

---

## §7 — WHAT'S IMPLEMENTED (verified by BRD V2)

✅ **BSA module documented** in fresh BRD (2026-05-19 sync) — 446 lines / 17K chars
✅ **WhatsApp + Voice IVR modules** with Outbox + Scheduled + Send Action tabs
✅ **Send Now + Schedule** options
✅ **Duplicate handling** option
✅ **Cost estimation** before submission
✅ **Variable replacement** at dispatch time
✅ **Conversation tracking** with 24-hour window
✅ **4 APIs** documented for system-to-system integration
✅ **Transaction status FSM** with 7 states
✅ **Recipient delivery status** with 6 states (WhatsApp)
✅ **Cancel + Edit + Delete** actions on scheduled transactions
✅ **Default activation** for every account with 0 SAR cost
✅ **CommChannel isolation** rule (no failover)
✅ **Balance deduction at execution** (no pre-reservation)

[BRAIN-OUT] BRD source: `C:\Falcon\PRD\BRDs\6- Basic Sending App\Basic Send Application-V2.docx`

---

## §8 — WHAT'S NOT IMPLEMENTED / FUTURE / GAPS

🟡 **Callback and status management config** (BR-BSA-41 — Future per BRD)
🟡 **Transaction status inquiry APIs** (BR-BSA-42 — Future)
🟡 **Balance inquiry APIs** (BR-BSA-43 — Future)
🟡 **Partial processing configuration toggle** (BR-BSA-44 — Future)
🟡 **Reporting module** (BR-BSA-45 — Future)
🟡 **Detailed CommChannel pages** (BR-BSA-46 — Future)
🟡 **Conversation module enhancements** (BR-BSA-47 — Future)
🟡 **API documentation** (BR-BSA-48 — Future)
🟡 **Other roles behaviour and screens** (BR-BSA-49 — Future, pending)
🟡 **Detailed Marketplace application subpages** (Pending per BRD)
🟡 **Conversation menu item** (Pending per BRD)
🟡 **Edge cases** (Pending per BRD)
🟡 **Implementation state UNCONFIRMED** — BRD describes design; code verification not yet done in any backend dossier
🔴 **Falcon backend service for BSA** — no `understanding/backend/bsa/` dossier exists yet; need controller deep-dive

---

## §9 — CROSS-MODULE DEPENDENCIES

| Direction | Flow |
|---|---|
| **06 → 01** | BSA AppConfig per account (visibility + pricing); CommChannel state (enabled/disabled) gates SEND |
| **06 → 02** | NU permission groups; Maker = NU/NA/AO for templates; AO activates BSA |
| **06 → 03** | Cost estimation uses Contract Details matrix; nearest-expiring contract drains; refund via Wallet Engine |
| **06 → 04** | Contact Groups feed recipients + column-to-variable mapping |
| **06 → 05** | Approved templates required (WhatsApp + Voice IVR); Maker creates templates used by BSA |
| **06 → Meta** | WhatsApp dispatch via Meta API |
| **06 → Voice Providers** | Voice IVR dispatch via SIP/Voice providers |
| **06 → core Wallet Engine** | Refund processing on third-party rejections |

---

## §10 — TOP 10 BUSINESS QUESTIONS

| # | Question | Answer | Citation |
|---|---|---|---|
| 1 | Does Falcon have a built-in sending application? | YES — Basic Send Application (BSA), automatically available for every account | BR-BSA default activation |
| 2 | What's the default cost? | 0 SAR with One-time Payment pricing model (Falcon-editable) | BRD §Overview |
| 3 | Who can send via BSA? | AO + NA + NU by default; Permission Groups may restrict | BR-BSA-02/03 |
| 4 | Can sends fail mid-execution? | YES — "Partially Processed" status when balance runs out mid-batch | BR-BSA-14 |
| 5 | Is balance reserved at create time? | NO — only deducted at execution per batch/record (no pre-reservation) | BR-BSA-11/12 |
| 6 | Can a CommChannel auto-failover? | NO — users explicitly choose WhatsApp OR Voice | BR-BSA-15/16 |
| 7 | What templates can be used? | Only Approved templates (both WhatsApp + Voice IVR); auth required even with unrestricted Voice | BR-BSA-17/18 |
| 8 | Can we schedule sends? | YES — Send Now OR future date; editable + deletable before due date | W1, W5, W6 |
| 9 | Are APIs available? | YES — 4 APIs (BSA Send, Template Retrieval, CG Retrieval, Sender ID Retrieval) | W9-W12 |
| 10 | Who refunds on Meta rejection? | core Wallet Engine, NOT BSA — based on contract rules | BR-BSA-28 |

---

## §11 — CORRECTIONS TO PRIOR ATLAS

### Vol 32 §5 was WRONG

Atlas Vol 32 §5 "Application Layer (The Hidden Layer)" claimed:
> "❌ **NOT in Falcon itself.** The Application is the **client's own software** that..."

**This is INCORRECT.** Per BSA V2 BRD: Falcon HAS a built-in sending application (BSA) that is automatically available for every account. It's not client-supplied — it's Falcon-built infrastructure.

The previous statement should be revised:
- **Some Applications can be client-built** (custom apps via APIs)
- **BSA is Falcon's built-in default Application** for WhatsApp + Voice IVR

### Vol 32 §1.1 was PARTIALLY WRONG

Atlas Vol 32 §1.1 "Does Falcon have a 'Campaign' entity?" claimed:
> "**NO.** [VERIFIED via codebase + PRD search]"

**The codebase grep was performed BEFORE the BSA BRD was visible.** The functional analog of "Campaign" is the BSA Transaction:
- **Transaction** (Module 06) is the campaign entity
- Has Status FSM, scheduling, recipient lists, cost tracking, audit
- The word "Campaign" still isn't used (Falcon vocab = "Transaction" / "Send Transaction")

### Vol 33 §4 — Hard Nots update needed

Vol 33 §4 listed:
> ❌ Falcon does NOT have a "Campaign" entity

**Revised:** Falcon does not have a "Campaign" entity. It has a **Transaction** entity in BSA module (Module 06) which IS the campaign functionality with a different name.

Vol 33 §4 also listed:
> ❌ Falcon does NOT have send scheduling

**Revised:** Falcon HAS send scheduling — built into BSA. Scheduled tab in WhatsApp + Voice modules.

---

## §12 — MODULE 06 NEW INSTRUCTIONS

1. **BSA IS BUILT-IN** — not a client-supplied feature. Defaults to every account.
2. **Default cost = 0 SAR** — Falcon may charge later via config changes
3. **No pre-reservation** — balance only deducted at execution; downstream design must handle this
4. **"Campaign" = Transaction** — the vocabulary is different but functionally equivalent
5. **CommChannel isolation is by design** — never assume failover; tell clients explicitly
6. **API-first design** — Falcon supports BSA Send via 4 APIs; document each
7. **Permission Group can restrict NU access** — make this clear in onboarding docs
8. **Future capabilities listed** are NOT yet built (BR-BSA-41..49)
9. **Voice IVR Flow Builder is rich** — Static IVR + Dynamic IVR (with Digits/Number/Date variables); not yet captured in implementation depth
10. **Conversation page handles 24h window** — WhatsApp Business API constraint

---

## §13 — NEXT STEPS

🔴 **Spawn `ammar-core-commerce` or similar agent** to mine BSA backend service:
- Find BSA-related controllers in `falcon-core-commerce-svc` or new service
- Document Transaction entity + APIs
- Verify against BRD specifications

🔴 **Update Vol 32 + Vol 33** with corrections (Campaign vocabulary + scheduled sends)

🔴 **Update Obsidian Ammar Brain Home** to add Module 06 BSA section

🟡 **Mine Voice Record Library** specifics — referenced in BSA + Templates V4 but not deep-mined

🟡 **Add `understanding/pages/`** for BSA Outbox + Scheduled + Send Transaction Detail pages

🟡 **Add `understanding/backend/bsa/`** dossier if BSA has its own service, OR document under Commerce/Charging where relevant

---

## §14 — CROSS-LINKS

- [BRAIN-OUT] BRD source: `C:\Falcon\PRD\BRDs\6- Basic Sending App\Basic Send Application-V2.docx`
- [BRAIN-OUT] Extracted text: `C:\Falcon\PRD\BRDs\_extracted\Basic-Send-Application-V2.txt`
- [Atlas] Vol 32 (corrections needed) · Vol 33 §4 (Hard Nots update) · Vol 38 (Module 05 Templates — BSA uses these templates)
- [Atlas] Vol 30 Cascade 10 (Send Transaction) — now ground-truth via BSA
- [Future] Vol 41 (Template Module V4 refresh — significant updates)
- [Future] Vol 42 (BRD Refresh Report — cross-module delta)

---

*Vol 40 · Module 06 Basic Send Application CONCLUSION · 2026-05-19 · Truth-grounded from fresh BRD · Major correction to Vol 32 §5 + Vol 33 §4 acknowledged.*
