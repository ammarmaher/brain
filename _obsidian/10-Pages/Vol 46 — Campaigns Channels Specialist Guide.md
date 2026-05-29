---
type: atlas-volume-graph-node
volume: 46
cluster: 10-pages
source: "[BRAIN-OUT] Brain Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-46-CAMPAIGNS-CHANNELS-SPECIALIST.md"
created: 2026-05-18
status: canonical
replaces-operationally: "[[Vol 32]]"
tags:
  - atlas/vol46
  - specialist/campaigns
  - specialist/channels
  - specialist/whatsapp
  - specialist/voice
  - specialist/sms
---

# Vol 46 — Campaigns & Channels Specialist Guide

> Unified operating reference for every channel Falcon does and does NOT support.

## 5-word truth

> **WhatsApp + Voice + SMS implemented; Facebook/Instagram are NOT.**

## What's in it

16 sections:
- §0 5-word truth
- §1 Channel status map (honest table)
- §2 WhatsApp specialist deep-dive (Meta surfaces, quality, tiers, categories, template lifecycle, 24h window, maker/checker)
- §3 Voice IVR (Static/Dynamic, Flow Builder, Voice Record Library, provider routing)
- §4 SMS (KSA CITC compliance, opt-in, sender ID types, DLR handling)
- §5 Email partial status + 4 gaps
- §6 Facebook/Instagram explicit NOT-implemented + 7-step add-cost estimate
- §7 BSA vs Campaign constructs
- §8 Status mapping Meta↔Falcon (3 template tracks)
- §9 Quality/Rate/Window/Opt-in-out rules per channel
- §10 Failed-message handling
- §11 Conversation modes (24h window, Inbox, Outbox)
- §12 End-to-end WhatsApp OTP send example
- §13 Channel decision tree
- §14 PR review checklist (14 items)
- §15 10 new open questions
- §16 Cross-references

## What it replaces

- **Operationally:** Vol 32 §1-§4 (campaigns chapter)
- Vol 32 kept for narrative context

## Channel status (one-line)

✅ WhatsApp · ✅ Voice (IVR Static + Dynamic) · ✅ SMS · 🟡 Email (partial) · ❌ Facebook Messenger · ❌ Facebook Pages · ❌ Instagram DM · ❌ Instagram Posts · ❌ Telegram · ❌ Twitter/X · ❌ TikTok · ❌ RCS

## 10 new open questions

| ID | Topic |
|---|---|
| Q-CHN-01 | Email channel — fully implemented? |
| Q-CHN-02 | Email provider — SES/SendGrid/SMTP? |
| Q-CHN-03 | Email templates — maker/checker scope? |
| Q-CHN-04 | Email DKIM/SPF/DMARC setup per-account? |
| Q-CHN-05 | Campaign orchestration scope (full module or bulk-fanout from BSA) |
| Q-CHN-06 | Scheduling granularity (per-recipient or per-batch) |
| Q-CHN-07 | 24h window enforcement code path |
| Q-CHN-08 | Voice IVR Flow Builder visual vs JSON config |
| Q-CHN-09 | Phone quality drop — auto-pause or surface only |
| Q-CHN-10 | KSA CITC opt-in records — timestamp + source stored? |

## See also

- [[CAMPAIGNS-CHANNELS-SPECIALIST-HUB]] — entry point hub
- [[VOL-44-TRUTH-TAUTOLOGIES]] — atomic tautologies (TM-TT, DI-TT)
- [[Vol 32 — Campaigns + WhatsApp + Facebook Honest Map]] — predecessor (narrative)
- [[05 Templates]] — Module 05 (template entity)
- [[06-Basic-Send-Application]] — Module 06 (send pipeline)
- [[04 Contact Group Management]] — Module 04 (recipient targeting)
- [[ATLAS_MASTER_INDEX]]
