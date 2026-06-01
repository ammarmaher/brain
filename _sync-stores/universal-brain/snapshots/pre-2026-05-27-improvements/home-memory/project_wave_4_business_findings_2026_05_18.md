---
name: Wave 4 - 5 surprising business findings from page mining 2026-05-18
description: Five business-critical findings from 13-page mining. Bring these to business meetings. Most useful for the data sovereignty / wallet topology / OTP asymmetry conversations.
type: project
originSessionId: f6ecc776-1773-4495-92d7-3bd75ebceecd
---
Wave 4 (13-page mining) surfaced 5 surprising business findings that come up in business meetings:

**1. Master Wallet is an abstract aggregate — NO physical row exists.**
Master Wallet value = `SUM(WalletRecords WHERE contract.status == Active)` (BR-AM-28). There is NO "deposit to Master Wallet" operation. Funds only enter via contract activations. When clients ask "can we deposit to Master Wallet?" → answer NO.

**2. Forgot-password silently ignores wrong OTPs (BR-UM-32) — anti-abuse design.**
OPPOSITE of Login flow (BR-UM-27) which locks after 3 wrong OTPs. Intentional: if Forgot Password locked on wrong OTPs, attackers could lock arbitrary users out by knowing usernames. For SOC 2/SAMA audits, document explicitly as "asymmetric OTP lockout = intentional anti-DoS control, not inconsistency."

**3. Template CRUD endpoints DO NOT EXIST yet (CRITICAL gap).**
Templates microservice has NO Template entity API. Only CommChannelConfig editor (3 endpoints). Maker/Checker, Meta webhook, template body/variables/buttons, Voice + AI flows — all unbuilt. When clients ask "can my users author WhatsApp templates?" → answer NO at Falcon level. Phase 2 backend work blocked on architecture decision.

**4. API casing/prefix inconsistency in wallet management.**
`api/commerce/accounts/{id}/hierarchy` (has `api/` prefix - System Gateway aggregator) vs `commerce/setting/wallets` (no prefix) vs `charging/wallet/transfer` (no prefix). Contact Group has camelCase `page` vs PascalCase `Page` between siblings. Tech debt — 1-day cleanup PR worth it.

**5. Falcon admin permissions = data sovereignty pattern.**
Falcon admins CANNOT create: Templates, Contact Groups (CLIENT business assets — sovereignty preserved).
Falcon admins CAN create: Accounts, Wallets, Contracts (FALCON commercial assets — relationship records).
Answer for "vendor lock-in / data sovereignty" enterprise client questions.

**Why:** These are the kind of "small things" business teams ask about constantly. Source: 13 page folders + Wave 4 completion report.

**How to apply:** Cite these in business meetings. All findings are in `Brain Outputs/reports/night-shift/2026-05-17/MORNING-BRIEF.md` section 13, with full source-prefixed evidence.
