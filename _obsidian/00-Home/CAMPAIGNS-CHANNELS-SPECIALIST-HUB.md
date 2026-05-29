---
type: specialist-hub
hub: campaigns-channels-specialist
created: 2026-05-18
authority: "Vol 46 (specialist guide) + Vol 41 (Template V4) + Vol 40 (BSA) + Vol 32 (campaigns honest map, replaced operationally)"
status: canonical
tags:
  - specialist/campaigns
  - specialist/channels
  - specialist/whatsapp
  - specialist/voice
  - specialist/sms
  - hub
---

# 📡 Campaigns & Channels — Specialist Hub

> **Your entry point** for anything channel-related (WhatsApp/Voice/SMS/Email) and the explicit NOT-implementation rationale for Facebook/Instagram/Telegram/Twitter/TikTok/RCS.

## 🚀 5-word truth

> **WhatsApp + Voice + SMS implemented; Facebook/Instagram are NOT.**

## 🚀 Quick triage

| If you're asking... | Start here |
|---|---|
| "Does Falcon do Facebook / Instagram / Telegram?" | **NO** — [Vol 46 §6](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-46-CAMPAIGNS-CHANNELS-SPECIALIST.md) |
| "How does WhatsApp send work end-to-end?" | [Vol 46 §12 OTP example](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-46-CAMPAIGNS-CHANNELS-SPECIALIST.md) |
| "Template lifecycle WA + Voice" | [Vol 46 §2.5 + §3.4](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-46-CAMPAIGNS-CHANNELS-SPECIALIST.md) + [[VOL-44-TRUTH-TAUTOLOGIES]] §Template |
| "Meta status mapping (Approved/Restricted/...)" | [Vol 46 §8](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-46-CAMPAIGNS-CHANNELS-SPECIALIST.md) |
| "Phone quality tiers + send rate limits" | [Vol 46 §2.2 + §2.3 + §9.2](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-46-CAMPAIGNS-CHANNELS-SPECIALIST.md) |
| "KSA CITC compliance for SMS" | [Vol 46 §4.2](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-46-CAMPAIGNS-CHANNELS-SPECIALIST.md) |
| "BSA vs Campaign — what's the diff?" | [Vol 46 §7](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-46-CAMPAIGNS-CHANNELS-SPECIALIST.md) |
| "I'm reviewing a send-related PR — checklist?" | [Vol 46 §14](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-46-CAMPAIGNS-CHANNELS-SPECIALIST.md) |
| "Maker/checker for templates" | [Vol 46 §2.7 + §2.8](../../../Brain%20Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-46-CAMPAIGNS-CHANNELS-SPECIALIST.md) + [[VOL-44-TRUTH-TAUTOLOGIES]] §Template TM-TT |

## 🧠 The mental model (one paragraph)

Falcon's send capability has two surfaces: (1) **BSA (Module 06)** — single-recipient or scheduled-single, transactional or one-off marketing; (2) hypothetical-future **Campaign module** — bulk-fanout via Contact Groups (Module 04), drip, A/B, engagement-driven. Channels: **WhatsApp** via Meta Cloud API (4 phone tiers, 4 message categories, 6 template states); **Voice** Falcon-native + SIP routing (Static IVR + Dynamic Flow Builder + Voice Record Library); **SMS** via per-country aggregators (KSA CITC opt-in mandatory, alphanumeric Sender ID dominant); **Email** partial (gaps Q-CHN-01..04). The destination identification flow ([[VOL-44-TRUTH-TAUTOLOGIES]] §DI-TT) feeds **all** channels with CC × NDC × Operator × Provider × Length tables. Templates have **maker/checker** workflows (V4 Free vs Restricted body, 1-Level vs 2-Level). The 24h customer service window allows free-form WA replies; outside it, only templates. Quality, rate, window, opt-in/out are the four compliance gates every send must clear.

## 📚 Sources of truth (priority order)

1. **`[CODE]` falcon-core-commerce-svc** + **`falcon-core-charging-svc`** — actual send pipeline
2. **`[BRAIN-OUT]` Vol 46** — specialist operating guide
3. **`[BRAIN-OUT]` Vol 41** — Template V4 deep refresh (lifecycle)
4. **`[BRAIN-OUT]` Vol 40** — Module 06 BSA (transaction states)
5. **`[BRD-EXTRACTED]` Statuses-for-Template.txt** — canonical Meta↔Falcon status mapping
6. **`[BRD-EXTRACTED]` WA-Templates-Existing-Actions.txt** — template tab action matrix
7. **`[BRD-EXTRACTED]` Destination-Identification.txt** + Research-Phone-Number-V3.txt — destination ID
8. **`[BRAIN-OUT]` Vol 32** — original campaigns honest map (kept for narrative; superseded operationally by Vol 46)

## 🌐 Channel inventory

| ✅ Implemented | 🟡 Partial | ❌ NOT implemented |
|---|---|---|
| WhatsApp Business (Cloud API) | Email | Facebook Messenger |
| Voice / IVR (Static + Dynamic) |  | Facebook Pages/Posts |
| SMS (provider-routed) |  | Instagram DM |
|  |  | Instagram Posts |
|  |  | Telegram |
|  |  | Twitter/X DM |
|  |  | TikTok DM |
|  |  | RCS (industry-watch) |

## 🔑 Meta integration boundaries

**Meta surfaces Falcon uses:**
- Cloud API (send/receive WhatsApp)
- Business Management API (template approval, phone management, quality)
- Webhooks (delivery reports, inbound messages, status changes)

**Meta surfaces Falcon does NOT use:**
- Facebook Graph API (Pages/Posts)
- Instagram Graph API (DM/Posts/Stories)
- Threads API
- WhatsApp on-premise API (deprecated)

## 🧩 Truth tautologies (clickable)

### Template tab matrix — TM-TT-01..08
1. NU has MORE template-edit power on his own node than NA/AO
2. NA/AO only Edit/Delete templates **they created**
3. Falcon User has ZERO access on "His Node" Templates tab
4. Falcon User is the only actor with access to **Deleted** column (audit)
5. **Rejected internally** is the only state where Edit is allowed (loop-back)
6. Restricted templates (Meta-paused) are READ-ONLY everywhere
7. Shared Templates tab is NU-only on His Node
8. Pending Review tab is per-hierarchy-level (never sub-node)

### Destination Identification — DI-TT-01..06
1. CC × NDC × Operator × Provider × Length tables required
2. NANP (CC=1) NOT subdivisible fixed-vs-mobile by NDC alone
3. KSA mobile NDC = 2 digits (50-59); leading '5' alone insufficient
4. MVNO sub-allocation under NDC 57 needs first-SN-digit lookup
5. Universal length: 7-15 digits (E.164)
6. Service numbers (premium/toll-free/short) explicitly excluded

## ⚠️ The 4 compliance gates

| Gate | Falcon authority | KSA mandatory? |
|---|---|---|
| Quality (Meta rating, provider GoS, sender reputation) | Surface; can't override Meta | Yes (Meta enforces) |
| Rate (per-phone tier, per-account, per-provider) | Throttle; queue over-limit | Yes |
| Window (quiet hours, 24h WA service window) | Block sends outside window | Yes (CITC marketing 21:00-09:00) |
| Opt-in/Opt-out | Enforce opt-in for marketing; honor opt-out keyword | Yes (CITC) |

## ❓ Still open questions

| ID | Topic |
|---|---|
| Q-CHN-01..04 | Email channel — provider, templates, DKIM/SPF/DMARC, depth |
| Q-CHN-05 | Campaign orchestration scope (full module or bulk-fanout) |
| Q-CHN-06 | Scheduling granularity (per-recipient or per-batch) |
| Q-CHN-07 | 24h window enforcement code path |
| Q-CHN-08 | Flow Builder visual config vs JSON-only |
| Q-CHN-09 | Phone quality drop — auto-pause or surface only? |
| Q-CHN-10 | CITC opt-in records — timestamp + source stored? |

## 🔗 See also

- [[WALLET-SPECIALIST-HUB]] — channels are the wallet's consumers
- [[VOL-44-TRUTH-TAUTOLOGIES]] — atomic tautology list (TM-TT, DI-TT)
- [[05 Templates]] — Module 05 (template entity)
- [[06-Basic-Send-Application]] — Module 06 (send pipeline)
- [[04 Contact Group Management]] — Module 04 (recipient targeting)
- [[ATLAS_MASTER_INDEX]] — full 46-volume Atlas
- [[AMMAR_BRAIN_HOME]] — vault root

#specialist/campaigns #specialist/channels #specialist/whatsapp #specialist/voice #specialist/sms #hub #canonical
