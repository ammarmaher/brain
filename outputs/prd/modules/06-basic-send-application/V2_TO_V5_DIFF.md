*** PRD Understanding - Basic Send Application - V2_TO_V5_DIFF ***

# 06-basic-send-application - V2_TO_V5_DIFF

> Source PRD: `latest-prd.md` in this folder (extracted from `C:\Users\User\Downloads\lab dirver\Basic Send Application-V5.docx`, user-supplied 2026-07-06; V5 is current & authoritative).
> Derived 2026-07-06 by the bsa-deep-understanding intake (prd-analyst agent, verbatim-quoted, line-anchored to `latest-prd.md`).
> React reference implementation: `C:\Falcon\Source_of_truth_theme\latest 07062026\falcon-ux (4)\admin\basic-app.jsx` — see `REACT_REFERENCE.md` + `GAPS.md`.
> Evolution of the spec between the user's V2 (May 2026) and V5 (2026-07-06) documents.

---

## 8. V2 → V5 EVOLUTION DIFF

### 8.1 Structural
- V2 was a numbered spec (§1, §2.x, §3.x) with a duplicated "## 3" heading collision (BSA Features AND IVR Voice Module) [PRD-V2 L28, L178]. V5 flattens to named sections, adds three brand-new top sections: "BSA (Assumptions and Conditions)" [V5 L6–15], "Application Purchase, Activation, and Navigation" [V5 L17–24], "BSA Behavior Based on WhatsApp/ Voice Communication Channel Status" [V5 L26–35].
- V5 grew 370 → 508 lines; conversation page and voice details are the biggest expansions.

### 8.2 REMOVED in V5 (present only in V2)
1. **Default pricing & visibility**: "visible by default to any account … One-Time Payment price type configured at 0 SAR by default … overridden exclusively by a user with the Falcon Usertype role." [PRD-V2 §2.1, L11] — V5 has no default-price/visibility statement (ABSENT in V5).
2. **Explicit rollback clause**: "If an internal platform-side failure occurs after balance deduction has succeeded but before the API payload is handed off … immediate programmatic rollback refund of the exact charged amount to the source wallet." [PRD-V2 §2.3, L25] — V5 keeps only the shorter per-batch "refund in case of any internal failures" [V5 L82].
3. **Specific error code**: "system log will write the specific error code 'CommChannel is not active/disabled'" [PRD-V2 §2.2, L20] — V5 softens to "failure reason shall indicate that the selected Communication Channel is not active" [V5 L33].
4. **Centralized WhatsApp Conversation hub**: V2's Conversation Page was "an independent submenu item under the communication channel (WhatsApp)" aggregating ALL conversations "regardless of the sender ID, application, or client user", with overview grid (Recipient, Last Message Timestamp/Snippet, Sender ID Used, Application Name, Conversation Status Open/Closed/Awaiting Reply/Resolved, Unread Count, Actions incl. Assign to User), filters (Sender ID/Application/User/Status/Date Range) and an application-agnostic unified timeline [PRD-V2 §C.5, L147–176]. — REMOVED from V5's body; only "The conversation menu item" survives in Pending [V5 L502].
5. **In-details Edit Mode on scheduled detail pages** with enumerated editable fields (WA: template/recipients/send datetime/sender ID [V2 L141–145]; Voice: + retry logic update [V2 L298–303]) — replaced in V5 by grid-level Edit reopening the full compose screen [V5 L177, L424].
6. **"(confirm with Noor if Meta returns this date or its our submission date)"** on Sent [PRD-V2 L120] — RESOLVED in V5: Send Date is Falcon's submission timestamp [V5 L152].
7. **Voice deduct-then-refund batch charging** (V2 gave Voice the SAME per-batch deduct/refund rule as WA [PRD-V2 §B, L202]) — REPLACED in V5 (see 8.3.2).
8. **Standalone "F. Voice Preview" section** detailing "Highlight the nodes which are actually played or selected by the recipient" [PRD-V2 §F, L305–308] — V5 compresses to one bullet ("recorded message including when the user closes or hangs the call" [V5 L408]); the node-highlighting detail is ABSENT in V5.

### 8.3 ADDED in V5 (not in V2)
1. **Governance/assumption layer**: approved-templates-only even for free Voice body [V5 L14]; no-balance-failover extended "in all applications in future" [V5 L12]; marketplace purchase path, instant Active, auto-submenu, dual navigation [V5 L17–24]; channel-status matrix incl. read-only mode when BOTH channels are down and NO auto-retry after channel recovery [V5 L26–35].
2. **Voice realtime charging model (major change)**: NO reservation; per-second deduction; terminate call on exhaustion; pre-call 1-second-cost gate; bulk = sequential single calls [V5 L330–331]. V2 charged Voice like WA per-batch.
3. **WA reserve-commit-return charging sentence** [V5 L86] layered on top of V2's deduct-refund rule (source of Q-BSA-08).
4. **Template governance at compose time**: Meta-sync suggestion [V5 L50]; forced reselection when template not Approved/Active [V5 L52].
5. **Compose gating buttons**: "add contact group" disabled until mapping done [V5 L62]; "Add recipient" disabled until variables filled [V5 L68].
6. **Full per-recipient date semantics** (Send/Delivery/Status Date definitions) [V5 L152–154] vs V2's bare field names [V2 L125–127].
7. **Scheduled Detailed View content spec**: zeroed statistics, Pending recipients, empty dates, "0 SAR", disabled Conversation; Voice adds Attempts=0 and Duration [V5 L182–198, L429–445]. V2's scheduled details had no recipient-grid freeze spec.
8. **Per-recipient WhatsApp Conversation page (reworked scope)**: header/message-info/thread rules, 11 message types, message actions gated by CS window, in-conversation search, 24h Customer-Service-Window countdown with reset-on-recipient-message and expiry, template-after-expiry flow creating a NEW conversation record, conversation-record chaining with per-record lifecycle, and the composer content set (text/attachments/emojis/voice record/templates with locked recipient) [V5 L200–283]. V2 had none of the CS-window mechanics — its 24h mention was one line ("considering the 24-hour window and whatsapp messaging limitations" [V2 L176]).
9. **Voice per-recipient Conversation action** with cross-channel follow-ups (open send-WA or send-IVR prefilled) [V5 L406] — absent in V2 (V2 recipient actions were Preview-only [V2 L269–270]).
10. **Voice cancellation parity**: full Cancellation Rule + dynamic confirmation dialog + post-cancellation recalculation duplicated into the Voice outbox [V5 L359–368]; V2 had the detailed rule only for WA [V2 L76] and a bare Cancel bullet for Voice [V2 L232].
11. **Explicit Voice sending-time bullet** [V5 L295] (V2 implied it only in the confirmation paragraph).
12. **API audience futureproofing**: "(Normal user & in future only system user)" [V5 L448] vs "(Normal user)" [V2 L311]; V5 also adds "all needed APIs … all app functionalities" phrasing.
13. **WA compose screen 3-section layout** (Message details / Recipients / preview) [V5 L44].

### 8.4 REWORDED / DRIFTED
- WA compose preview: V2's "Real-Time Message Preview … smartphone mockup UI component" [V2 L43] → V5 plain "Message Preview" in compose [V5 L73] while the smartphone-mockup wording moved to the scheduled detail [V5 L198].
- Cancellation text reorganized from one dense paragraph [V2 L76] into structured bullets (Cancellation Rule / Confirmation Dialog / Post-Cancellation System Updates) [V5 L115–124] — substance unchanged.
- WA Cost Breakdown gains sub-lines "Cost of messages sent / Average cost per message" [V5 L139–142] vs V2's single line [V2 L115].
- Channel-disabled rule moved from §2.2 architecture into both the Assumptions [V5 L9–10] and the dedicated channel-status section [V5 L26–35], adding recovery semantics (no auto-retry) that V2 lacked.
- Send Logic, Transaction statuses, Outbox/Scheduled grids, API body, Near-future, Pending, and Edge Cases blocks are otherwise carried near-verbatim from V2 to V5.

### 8.5 Evolution story (one paragraph)
[INFERRED] V2 was an architecture-flavored draft: it priced and defaulted the app (0 SAR one-time), described a centralized WhatsApp conversation hub, gave both channels the same batch deduct-refund charging, and embedded edit modes inside detail pages. V5 matured into a behavior-first spec: it moved commercial defaults out (pricing gone), formalized purchase/activation/navigation and channel-status gating (adding read-only mode and no-auto-retry), split Voice charging into a realtime per-second model with call termination, hardened compose-time governance (button gating, template re-validation, Meta-sync suggestion), fully specified the frozen state of scheduled transactions, replaced the conversation hub with a deeply specified per-recipient conversation page built around the 24-hour customer-service window and template re-initiation with conversation-record chaining, simplified edit-scheduled to "reopen the compose screen", and resolved V2's open question about the Sent date (now Falcon's submission timestamp) — while deferring the conversation menu item, reports, other roles, and the API contract to Pending.

---
END OF REPORT
