# Volume 46 — Campaigns & Channels Specialist Guide

> **Specialist depth:** Full background on every channel Falcon does and does NOT support, every integration boundary with Meta, every quality/rate/window/opt-in rule, every template-driven and free-form pattern. This volume is the unified single-source map.
>
> **Replaces:** the campaigns half of Vol 32 (which had a §5 correction landed via Vol 40). Vol 32 remains for narrative context; this volume is the **operating reference**.
>
> **Honesty axiom:** Every "implemented" claim in this volume is BRD-backed or code-verified. Every "NOT implemented" claim is explicitly flagged so the business team can decide whether to scope.

---

## §0 — The 5-Word Campaign Truth

> **WhatsApp + Voice + SMS implemented; Facebook/Instagram are NOT.**

That's the headline. Now the details.

---

## §1 — Channel Status Map (the Honest Table)

| Channel | Status in Falcon | Integration partner | Module owner | Notes |
|---|---|---|---|---|
| **WhatsApp Business** | ✅ Implemented | **Meta Business API** | Module 05 (Templates) + Module 06 (BSA) | Template-driven; quality-rating governed by Meta |
| **WhatsApp Cloud (Meta-hosted)** | ✅ Implemented (Meta runs the gateway) | Meta | same | Identical surface to BSP for Falcon's purposes |
| **Voice (IVR)** | ✅ Implemented (Falcon-native + provider routing) | SIP providers per region | Module 05 + Module 06 | Static + Dynamic IVR; Flow Builder; Voice Record Library |
| **SMS** | ✅ Implemented (provider-routed) | Per-country SMS aggregators (e.g., Twilio, regional providers) | Module 06 | Long-code + short-code; opt-in mandatory in KSA |
| **Email** | 🟡 Partial / unclear | n/a | Module 06 | BRD references but no detailed flow yet |
| **Facebook Messenger** | ❌ **NOT implemented** | n/a | n/a | Branding/marketing material may suggest; codebase is empty. See §6. |
| **Facebook Page Posts** | ❌ **NOT implemented** | n/a | n/a | Out of scope |
| **Instagram DM** | ❌ **NOT implemented** | n/a | n/a | Out of scope |
| **Instagram Posts** | ❌ **NOT implemented** | n/a | n/a | Out of scope |
| **Telegram** | ❌ **NOT implemented** | n/a | n/a | Not in PRD |
| **Twitter/X DM** | ❌ **NOT implemented** | n/a | n/a | Not in PRD |
| **TikTok DM** | ❌ **NOT implemented** | n/a | n/a | Not in PRD |
| **RCS** | ❌ **NOT implemented** | n/a | n/a | Mentioned in industry-trends Vol 21 as future-watch |

> **Why "honest"?** Earlier brain entries and marketing material occasionally reference "campaigns across Meta channels", which is misleading — Falcon does WhatsApp (a Meta channel), but **not Facebook, not Instagram, not Threads**.

---

## §2 — WhatsApp Specialist Deep-Dive

### §2.1 What Meta exposes to Falcon

Meta's WhatsApp Business Platform has 3 surfaces relevant here:

| Meta surface | What Falcon uses it for |
|---|---|
| **Cloud API** | Falcon-hosted WhatsApp accounts use Meta's cloud-hosted API for send/receive |
| **On-Premise API** (deprecated 2025) | Legacy; not used by Falcon |
| **Business Management API** | Template approval, phone number management, quality rating, business profile |
| **Webhooks** | Delivery reports, read receipts, inbound messages, status changes |

### §2.2 Phone numbers & quality

Each WhatsApp Business account is bound to one or more phone numbers. Meta assigns each a **quality rating**:

| Quality tier | Trigger | Effect on sending |
|---|---|---|
| **High** | Low block rate, high engagement | Normal sending limits |
| **Medium** | Some user complaints | Sending rate stepped down |
| **Low** | Many complaints; flagged for review | Heavily throttled; may be auto-paused |
| **Flagged / Restricted** | Repeated violations | Templates auto-paused; phone restricted |
| **Banned** | Repeated severe violations | Phone permanently blocked |

Falcon surfaces quality rating in the Account Management module (`commChannelStatus.qualityRating` field) but **does not** manipulate it — Meta is the sole arbiter.

### §2.3 Phone number tiers (Meta's send-rate limits)

| Tier | Daily unique recipients (cumulative 24h) | Trigger to upgrade |
|---|---|---|
| Tier 1 | 1,000 | new phone |
| Tier 2 | 10,000 | sustained >50% Tier 1 |
| Tier 3 | 100,000 | sustained >50% Tier 2 |
| Tier 4 | Unlimited | sustained >50% Tier 3 |

These limits are **per-phone, per-rolling-24h**. Falcon's BSA layer SHOULD throttle at the tier limit (currently INFERRED — needs verification).

### §2.4 Message categories (Meta's pricing/policy split)

| Category | Description | Falcon template type |
|---|---|---|
| **Authentication (Auth)** | OTP / 2FA codes | `WA-Auth` |
| **Utility (Util)** | Order updates, account alerts, post-purchase | `WA-Util` |
| **Marketing (Mark)** | Promotional, opt-in required | `WA-Mark` |
| **Service** (free-form within 24h customer-initiated window) | Reply within 24h of a user message | n/a — not a template category |

Falcon's per-contract rate columns (`WA-Auth`, `WA-Util`, `WA-Mark`) match this Meta category split.

### §2.5 Template lifecycle (per Vol 41 + Vol 44 §4)

```
        ┌──> Pending ────> Approved ────> Restricted (Meta paused)
        │      │                │
   submit      └─> Rejected─┐   └─> Deleted
        │       internally  │
        │            │      │
        │       (loop-back: │
        │       Edit allowed)
        │            │
        │            v
        │       Re-submit
        │            │
        │            v
        └──> Pending again

       Rejected final ──> (terminal, no recovery)
```

| State | Falcon view | Meta status (mirror) |
|---|---|---|
| Pending | In review queue | In-review |
| Approved | Live, sendable | Active |
| Rejected internally (V4) | Maker/checker rejected; loop-back to author | Not yet sent to Meta |
| Rejected final | Meta rejected | Rejected |
| Restricted | Meta paused | Paused / Disabled |
| Deleted | Soft-deleted | Deleted at Meta or never sent |

### §2.6 24-hour customer service window

Once a user sends a message to a WhatsApp Business number, a 24-hour "service window" opens. Within that window:
- **Free-form messages are allowed** (no template required).
- **No Meta charge** for outbound messages.

Outside the window:
- **Only template-based messages** are allowed.
- Each template send is charged per Meta's category pricing.

Falcon's Inbox/Conversation module SHOULD track the 24h window state per conversation. Sending free-form outside the window must be blocked at the API layer.

### §2.7 Restricted Body (maker/checker)

Per Vol 41 Template V4 deep refresh:
- **Free Body** = template auto-approves internally and goes to Meta.
- **Restricted Body** = template needs internal approval (1-Level or 2-Level) before going to Meta.

The maker/checker happens **before** the template hits Meta — so an internally-rejected template never reaches Meta's queue.

### §2.8 Maker/Checker level matrix

| Level | Maker | Checker | Default count |
|---|---|---|---|
| 1-Level | Author (any user) | Account Owner | 1 (the AO) |
| 2-Level | Author | Reviewer (NA/AO) + AO | 2 (cascading approvals) |

Vol 44 §4 confirms NU/NA/AO have differentiated authorities; for templates, NU is the maker, NA may be Reviewer, AO is always the final Checker.

---

## §3 — Voice (IVR) Specialist Deep-Dive

### §3.1 Two IVR sub-types

| Sub-type | Description | When to use |
|---|---|---|
| **Static IVR** | Fixed pre-recorded menu (1-press = Sales, 2-press = Support) | Simple FAQ |
| **Dynamic IVR** | Logic-driven menu with data lookup, conditional branches | Customer-specific routing |

### §3.2 Flow Builder

The Falcon admin console exposes a node-based Flow Builder for Dynamic IVR:
- **Nodes:** Play (audio), Gather (DTMF), Branch (if/else), Transfer (to agent), Hangup, API Call (data lookup).
- **Connections:** Sequential flow + conditional branches.
- **Variables:** Customer phone, custom payload, lookup results.

The Flow is stored as a directed graph in MongoDB; runtime engine traverses it on each call.

### §3.3 Voice Record Library

Reusable audio assets:
- **Recorded by:** AO-uploaded MP3/WAV OR text-to-speech generated.
- **Multilingual:** Each asset has language-tagged variants (Ar, En, ...).
- **Versioning:** New uploads create new versions; flows reference asset-id (latest active version is used).

### §3.4 Voice template (free vs restricted)

Same maker/checker model as WhatsApp:
- **Voice Free Body** = auto-approved.
- **Voice Restricted Body** = 1-Level or 2-Level internal approval.

Voice templates do NOT go through Meta — they're Falcon-internal.

### §3.5 Voice provider routing

Outbound voice calls route through SIP carriers. Per-destination routing depends on:
- Country code (CC) and NDC — to find the operator.
- Account's enabled providers (per Module 03 contracts).
- Provider availability + cost.

The routing decision is taken by the Voice service per Vol 44 §8 (destination identification).

### §3.6 Voice call duration billing

Voice is billed **per-minute** (rounded up to nearest second/minute per contract).
Falcon's per-contract rate columns include `Voice-{Country}-{Tier}` rates.

---

## §4 — SMS Specialist Deep-Dive

### §4.1 SMS provider routing

Same as Voice (§3.5): per-destination operator → provider mapping → outbound send.

### §4.2 KSA-specific opt-in compliance

CITC (Saudi telecom regulator) requires:
1. **Sender ID registration** — every brand-name sender ID must be pre-approved.
2. **Opt-in records** — every recipient must have a documented opt-in.
3. **Opt-out keyword** — every marketing SMS must include opt-out (e.g., "STOP").
4. **Quiet hours** — no marketing SMS between 21:00 and 09:00 local time.

Falcon's BSA layer must enforce all 4. Sender IDs are stored in the Account; opt-in records are stored per contact group; quiet hours are configurable per account.

### §4.3 Long-code vs short-code vs alphanumeric

| Type | Description | Use case in Falcon |
|---|---|---|
| Long-code | Standard phone number (e.g., +966 5x xxx xxxx) | Conversational SMS, lower cost |
| Short-code | 4-6 digit special number (e.g., 90001) | Mass campaigns, branded |
| Alphanumeric Sender ID | Brand name (max 11 chars) in From field | Notification/branding |

KSA uses **alphanumeric Sender ID** dominantly; short-codes require additional regulatory approval.

### §4.4 SMS template-driven vs free-form

Unlike WhatsApp, SMS does NOT require pre-approved templates — but Falcon's compliance layer treats SMS templates the same way:
- Marketing SMS → maker/checker before send.
- Transactional SMS (OTP) → less restrictive.

### §4.5 Delivery report (DLR) handling

Outbound SMS gets a DLR from the carrier:
- `Delivered` — message reached handset.
- `Failed` — undeliverable (wrong number, off-net, etc.).
- `Expired` — TTL hit before delivery.
- `Rejected` — operator blocked (content policy).

DLRs feed into BSA's transaction status (see Vol 40).

---

## §5 — Email Specialist (Partial Status)

### §5.1 What we know

The PRD references email as a CommChannel, but the BRDs do not provide detailed flow. The CommChannels table in Account Mgmt (Vol 34) lists "Email" as a channel, but the BSA module (Vol 40) does not document an email send flow in detail.

### §5.2 Gaps to clarify

| Gap ID | Question | Owner |
|---|---|---|
| **Q-CHN-01** | Is Email send fully implemented as a CommChannel, or only the channel concept (without send pipeline)? | Module 06 architect |
| **Q-CHN-02** | If email IS implemented — which provider? SES? SendGrid? Self-hosted SMTP? | Module 06 |
| **Q-CHN-03** | Email templates — do they go through maker/checker like WhatsApp/Voice? | Module 05 |
| **Q-CHN-04** | Email DKIM/SPF/DMARC setup per-account? | Module 01 + 06 |

### §5.3 Working assumption [INFERRED]

The email channel is **probably** implemented as a CommChannel with a basic send pipeline, but the depth (templates, maker/checker, deliverability) is unclear without deeper code mining. **Treat email as "thin" for now** — confirm before quoting a client commitment.

---

## §6 — Facebook & Instagram — Explicitly NOT Implemented

### §6.1 What people sometimes assume

Casual references to "social campaigns" or "multi-channel" may suggest Facebook/Instagram are in scope. **They are not.**

### §6.2 What's true

| Asset | Reality |
|---|---|
| Code in falcon-core-charging-svc for Facebook? | None |
| Code in falcon-core-commerce-svc for Instagram? | None |
| BSA module endpoints for Meta non-WhatsApp channels? | None |
| Template-management for Facebook/Instagram posts? | None |
| Meta Business API integration for Pages/Posts/Stories? | None — only WhatsApp surface used |

### §6.3 What it would take to add (if scoped)

Adding Facebook Messenger or Instagram DM would require:
1. Meta App + Page admin connect flow (OAuth + webhook subscription).
2. New CommChannel types (`FB-Messenger`, `IG-DM`).
3. New template lifecycle for FB/IG (Meta has different rules per channel).
4. New billing rates per channel (Module 03).
5. New BSA send flows.
6. New status mapping (Meta surfaces different statuses for FB/IG).
7. Compliance review (FB/IG have stricter content policies than WhatsApp).

**Effort estimate [INFERRED, ROUGH]:** 2-3 sprints for FB Messenger, 1-2 additional for IG DM (shared infrastructure).

### §6.4 Why it's not done

The PRD scope explicitly excludes them. The strategic reasoning:
- Saudi/MENA market preference for WhatsApp is overwhelming (>80% messaging penetration).
- Facebook/Instagram engagement is lower in target verticals (B2B, government).
- Resource focus on perfecting WhatsApp + Voice + SMS first.

### §6.5 What to say if asked

> "Falcon supports the **WhatsApp** part of Meta's platform. Facebook Messenger and Instagram are not implemented. If your use case requires them, we can scope a delivery roadmap, but it's not in the current product."

---

## §7 — Campaign Constructs vs BSA Constructs

### §7.1 BSA (Module 06) — Basic Send Application

BSA is the **single-recipient, immediate-or-scheduled send**:
- `Send WA-Util to single recipient` → BSA endpoint
- `Send WA-Mark scheduled for tomorrow` → BSA + Scheduler
- `Send Voice OTP synchronously` → BSA blocking call

BSA does NOT do:
- Bulk send to contact groups (that's "Campaign")
- A/B testing
- Drip sequences
- Engagement-based branching

### §7.2 Campaign module (if/when scoped)

A **Campaign** as a business construct typically includes:
- Multi-recipient targeting (via Contact Group from Module 04)
- Scheduling (one-time, recurring, time-zone aware)
- A/B variant testing
- Engagement tracking (opens, clicks, replies)
- Drip sequences (send-then-wait-then-send-conditional)
- Funnel reporting

**Current Falcon scope:** Campaign-level constructs are **partially scoped** in BRDs but not fully implemented. The Module 04 Contact Group is the targeting input; BSA is the send engine; but the orchestration layer (A/B, drip, engagement) is INFERRED-not-yet-present.

> **Q-CHN-05:** What's the canonical campaign-orchestration scope — is it a full Campaign module or just bulk-fanout from BSA?

### §7.3 The "Basic" in BSA

Vol 40 introduced BSA as Module 06. The "Basic" qualifier is significant — Falcon's send capability today is **transactional + scheduled-single**, not full campaign orchestration. A "Campaign" capability would be Module 07+ in a future roadmap.

---

## §8 — Status Mapping (Meta ↔ Falcon)

(Cross-references Statuses-for-Template.txt + Vol 41.)

### §8.1 WhatsApp Templates — Unrestricted Body

| Falcon status | Meta equivalent | Direction |
|---|---|---|
| Pending | In-review / Appealed | Falcon submits to Meta |
| Approved | Active | Meta approves |
| Rejected | Rejected | Meta rejects |
| Restricted | Paused / Disabled | Meta pauses (quality issue) |
| Deleted | Deleted | Either side |

### §8.2 WhatsApp Templates — Restricted Body L1

| Falcon status | Internal flow | Meta involvement |
|---|---|---|
| Pending | Awaiting L1 checker | Not yet sent to Meta |
| L1-Approved | Going to Meta | Submitted |
| Then: Pending/Approved/Rejected/Restricted | Meta lifecycle takes over | Standard |

### §8.3 WhatsApp Templates — Restricted Body L1+L2

| Falcon status | Internal flow | Meta involvement |
|---|---|---|
| Pending | Awaiting L1 checker | None |
| L1-Approved | Awaiting L2 checker | None |
| L2-Approved | Going to Meta | Submitted |

### §8.4 Voice Templates — Free Body / Restricted Body

Voice templates never touch Meta. Falcon-internal only.

### §8.5 Transition graph (cross-channel)

```
                    Pending
                   /        \
            Approved      Rejected (internal)
              /  \              \
         Restricted  Deleted   Pending (loop-back via Edit)
              |
           Approved (recovered)
```

`Rejected final` (from Meta) is a terminal state — no recovery.

---

## §9 — Quality, Rate, Window, Opt-in/out Rules

### §9.1 Quality

| Channel | Quality concept | Owner |
|---|---|---|
| WhatsApp | Phone quality rating (High/Medium/Low/Flagged/Banned) | Meta |
| Voice | Provider grade-of-service (GoS) + per-destination success rate | Provider + Falcon analytics |
| SMS | Per-route delivery rate; Sender ID reputation | Provider + Falcon analytics |
| Email | Sender reputation (SPF/DKIM/DMARC pass rates) | Email provider + Falcon |

### §9.2 Rate limits

| Channel | Limit dimension | Source |
|---|---|---|
| WhatsApp | Per-phone, per-24h-rolling, by tier (1k/10k/100k/Unlimited) | Meta |
| Voice | Per-account, per-provider concurrent calls | Provider contract |
| SMS | Per-account, per-sender-ID, per-day | Aggregator agreement |
| Email | Per-account, per-day (likely SES warm-up curve) | Provider |

Falcon must throttle at the rate limit; over-limit sends should queue (not fail).

### §9.3 Quiet hours / send windows

| Channel | Quiet hour rule | Authority |
|---|---|---|
| WhatsApp | No explicit Meta rule; cultural respect window 22:00-08:00 | Account-level configurable |
| Voice | KSA TDRA: no robocalls 21:00-09:00 | Mandatory |
| SMS Marketing | KSA CITC: 21:00-09:00 quiet | Mandatory |
| Email | None (typically) | Marketing best practice |

Falcon's send-orchestration layer must check the local time at the recipient's location.

### §9.4 Opt-in / Opt-out

| Channel | Opt-in requirement | Opt-out keyword | Storage |
|---|---|---|---|
| WhatsApp Marketing | Mandatory (per Meta policy) | "STOP" (case-insensitive) | Per-recipient flag in Contact Group |
| WhatsApp Util/Auth | Implicit (transactional) | Not required | n/a |
| SMS Marketing | Mandatory per CITC | "STOP" / "إيقاف" | Per-recipient flag |
| SMS Util/Auth | Implicit | n/a | n/a |
| Voice | Implicit transactional; pre-registered for marketing | DTMF "0" to opt-out | Per-account opt-out registry |
| Email | Mandatory (CAN-SPAM, GDPR) | Unsubscribe link required | Suppression list |

---

## §10 — Failed-Message Handling

### §10.1 Failure classes

| Class | Example | Recoverable? |
|---|---|---|
| Recipient-level (transient) | Phone temporarily off | Yes — retry within TTL |
| Recipient-level (permanent) | Number not on WhatsApp | No — mark as terminal failure |
| Content-level | Template rejected at send time (rare; template changed status) | No — surface to author |
| Account-level | Phone quality dropped to Banned | No — block all sends until lifted |
| Operator-level | Provider outage | Yes — retry with alternate provider if configured |
| Compliance-level | Quiet hours, opt-out | No — log + suppress |

### §10.2 Status mapping per Vol 40 BSA

BSA transaction states:
- Created → Validated → Funded → Submitted → Sent → Delivered (terminal-success)
- ... or: Created → Validated → Funded → Submitted → Failed (terminal-failure)
- ... or: Created → Validated → InsufficientFunds (terminal-failure)
- ... or: Created → Invalid (terminal-failure)

7 states total. Failed transactions DO consume balance (the wallet was deducted at "Funded" — Meta's failure refunds the funded amount via saga).

### §10.3 Refund mechanics

Per Vol 45 §10.8 — failed sends emit a `RefundRequested` event; Charging service compensates using `FundingDecisionRecord`.

---

## §11 — Conversation Modes (Bidirectional)

### §11.1 Inbound message handling

When a user sends a message to a Falcon-managed WhatsApp number:
1. Meta webhook fires → Falcon Conversation/Inbox endpoint.
2. Falcon opens/updates conversation thread.
3. 24h service window opens (free-form replies allowed).
4. Agent or automated reply via Flow Builder (similar concept to IVR but text-based).
5. Conversation closes when (a) agent ends OR (b) 24h window expires.

### §11.2 Where the Inbox UI lives

Per Vol 40 BSA + Module 06 BSA — there's a `Conversation` page in the admin console. Agents triage inbound messages, reply within the 24h window, and close conversations.

### §11.3 Outbox

A queue/list of pending-or-scheduled outbound messages (template + free-form). UI lets users:
- Inspect status
- Cancel a scheduled send
- Re-trigger a failed send (with new funding decision)

### §11.4 Scheduled sends

Per Vol 40 — BSA supports scheduling sends to a future timestamp. The Scheduler processes the queue and triggers sends at the target time.

> **Q-CHN-06:** Is scheduling per-recipient or per-batch? Can a batch be partially-scheduled (some recipients now, others later)?

---

## §12 — Concrete End-to-End Send Flow (WhatsApp OTP Example)

```
[1] User in Falcon Admin Console: triggers OTP send for User-X
     │
     ▼
[2] BSA endpoint: POST /api/bsa/send
     payload: { templateId, recipientPhone, variables: { code: '123456' } }
     │
     ▼
[3] BSA service:
     - Validate recipient via Destination Identification (Vol 44 §8) — OK, KSA Mobile +96650...
     - Validate template (Approved? Within rate limit? Within send window?) — OK
     - Look up rate: contract C#1 WA-Auth rate = 2.5 SAR
     - Charging service: ConsumeBalance(needed=2.5, ctx={action:'WA-Auth', acc, channel:'WA'})
         - Walk contracts nearest-expiry: C#1 has 100 SAR → fund fully, cost 2.5
         - MW[ACC, C#1] -= 2.5 → 97.5
         - FundingDecision returns { sources: [{C#1, units:1, cost:2.5}], totalCost: 2.5 }
     - BSA status: Funded
     │
     ▼
[4] WhatsApp send service:
     - Render template with variables → "Your code is 123456"
     - POST to Meta Cloud API
     - Meta returns wamid
     - BSA status: Submitted
     │
     ▼
[5] Meta webhook (delivery report):
     - 'sent' event → BSA status: Sent
     - 'delivered' event → BSA status: Delivered (terminal)
     │
     ▼
[6] Ledger entry written:
     - { type: 'Deduct', from: 'MW:ACC:C#1', amount: 2.5, reason: 'WA-Auth-Send', correlationId: bsaTxId }
```

If step 4 fails (Meta rejects the template), the BSA emits `RefundRequested` → Charging credits 2.5 back to MW[C#1] → BSA status: Failed (with refund evidence).

---

## §13 — Specialist Mental Model: Channel Decision Tree

```
What does the user want to send?

  Is it a 1-on-1 transactional message?
     │
     ├── Yes, urgent (OTP, alert) → BSA → WhatsApp Util / SMS Util (provider choice based on cost)
     │
     ├── Yes, scheduled (reminder) → BSA + Scheduler → WhatsApp Util
     │
     └── Yes, voice (IVR-driven) → Voice Flow Builder → Voice provider

  Is it marketing to many recipients?
     │
     ├── Yes, WhatsApp → BSA bulk + WhatsApp Mark template (opt-in required)
     │
     ├── Yes, SMS → BSA bulk + Sender ID (KSA opt-in required)
     │
     └── Yes, Facebook/Instagram → ❌ NOT SUPPORTED — out of scope

  Is it a conversation (inbound reply)?
     │
     └── Always WhatsApp Inbox (24h window) → Agent / Flow Builder reply
```

---

## §14 — Specialist Operating Checklist (review send-related PRs)

- [ ] Is the destination validated against Vol 44 §8 CC × NDC table?
- [ ] Is the template Approved (not Pending/Rejected/Restricted/Deleted)?
- [ ] Is the recipient opt-in'd for marketing-class sends?
- [ ] Is the quiet-hours rule honored?
- [ ] Is the per-phone rate limit (Meta tier) honored?
- [ ] Is the funding decision pre-computed atomically (Vol 45 §5)?
- [ ] Is the per-contract rate looked up correctly (Vol 44 §2.5)?
- [ ] Is the ledger entry written for audit (Vol 45 §8)?
- [ ] Is the BSA status machine respected (Vol 40)?
- [ ] Is the refund path wired for failed sends?
- [ ] Is the language correct (Ar vs En) for the recipient locale?
- [ ] Is the SAMA audit hook triggered for high-value sends?
- [ ] Is the conversation 24h window respected for free-form replies?
- [ ] Is the BSA in "Basic" mode (single-or-batch fanout, NOT campaign orchestration)?

---

## §15 — New Open Questions Surfaced

| ID | Question | Owner |
|---|---|---|
| Q-CHN-01 | Email channel — fully implemented or partial? Which provider? | Module 06 |
| Q-CHN-02 | Email provider — SES/SendGrid/SMTP? | Module 06 |
| Q-CHN-03 | Email templates — maker/checker scope? | Module 05 |
| Q-CHN-04 | Email DKIM/SPF/DMARC setup per-account? | Module 01+06 |
| Q-CHN-05 | Campaign orchestration scope — full Campaign module or bulk-fanout from BSA? | Product |
| Q-CHN-06 | Scheduling — per-recipient or per-batch granularity? | Module 06 |
| Q-CHN-07 | What's the canonical 24h-window enforcement code path? | Module 06 |
| Q-CHN-08 | Voice IVR Flow Builder — visual config in admin console or JSON-only? | Module 05+06 |
| Q-CHN-09 | Meta phone quality dropping to Low/Flagged — does Falcon auto-pause sends or just surface the warning? | Module 06 |
| Q-CHN-10 | KSA CITC opt-in records — does Falcon store the consent timestamp + source? | Module 04 (Contact Groups) |

---

## §16 — Cross-References

- **Vol 32** — original Campaigns honest map (this volume replaces it as operating reference)
- **Vol 40** — Module 06 BSA (transaction states feed this volume)
- **Vol 41** — Template V4 deep refresh (template lifecycle feeds §2.5 here)
- **Vol 44** — §4 (template tab matrix) + §8 (destination identification)
- **Vol 45** — Wallet specialist (funding decisions referenced in §12)

---

**End of Volume 46 — Campaigns & Channels Specialist Guide**
**Authored:** 2026-05-18 (night-shift continuation)
**Replaces operationally:** Vol 32 §1-§4 (campaigns chapter)
**Cross-refs:** Vol 40, Vol 41, Vol 44 §4 + §8, Vol 45
