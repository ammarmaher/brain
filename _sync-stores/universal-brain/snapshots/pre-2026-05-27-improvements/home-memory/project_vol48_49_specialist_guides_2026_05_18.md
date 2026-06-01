---
name: Vol 48 + Vol 49 Specialist Guides (Contact Group + Template Lifecycle)
description: Two specialist Atlas volumes building on Vol 44 §4 + §5 tautologies — CG creator-only Edit/Delete + Falcon-staff non-mutation, template 6-status lifecycle + Free/Restricted Body + 1L/2L maker-checker
type: project
originSessionId: f6ecc776-1773-4495-92d7-3bd75ebceecd
---
# Vol 48 + Vol 49 Specialist Guides — 2026-05-18

**Status:** 🟢 LANDED 2026-05-18 (Waves 15-16 autopilot).

## What landed

- `Brain Outputs/.../BUSINESS-SCENARIOS-ATLAS-VOL-48-CONTACT-GROUP-SPECIALIST.md` — 15 sections
- `Brain Outputs/.../BUSINESS-SCENARIOS-ATLAS-VOL-49-TEMPLATE-LIFECYCLE-SPECIALIST.md` — 13 sections
- Obsidian graph nodes for both volumes in 10-Pages
- Atlas Master Index updated
- PRD Module 04 + Module 05 notes updated with cross-refs

## Vol 48 — Contact Group highlights

- **The Falcon-Cannot-Mutate Invariant** (CG-TT-01) — strongest enforcement of "Falcon does not touch customer data" in the platform. Even FalconSystemAdmin role cannot Create/Edit/Share/Delete a CG.
- **Creator-Only Edit/Delete** (CG-TT-02) — accountability + over-write protection. Forced ownership trail.
- **Per-Channel Opt-In** (CITC compliance) — `optInStatus.whatsapp.{granted, timestamp, source}`, `.sms.…`, `.email.…`, `.voice.…` — independent. Opt-out of WA does NOT affect SMS.
- **Upload Pipeline** — E.164 normalization via Vol 44 §8 destination-ID flow; per-channel opt-in column auto-detection; canonical schema mapping.
- **Download CG vs Download Original** — paired (CG-TT-05). Both pass the same privacy gate.

## Vol 49 — Template Lifecycle highlights

- **The 6 Status States** — Pending / Approved / Rejected-internally / Rejected-final / Restricted / Deleted. Each with own UI surface and transition rules.
- **Free Body vs Restricted Body** (V4 introduced) — Free Body auto-approves; Restricted Body needs 1-Level or 2-Level internal maker/checker before going to Meta.
- **Maker/Checker 4 modes** — Free / Restricted-1L / Restricted-2L / Restricted-2L-with-Rejection (the rejection loop).
- **The Edit Loop** — Rejected-internally is the **only** status where Edit is allowed (TM-TT-05); it loops back to Pending for re-submission.
- **Falcon Zero-Access on His Node** (TM-TT-03) — Falcon staff cannot see "His Node" Templates tab; only sub-hierarchy visibility for governance.
- **Meta-Restricted = Read-Only** (TM-TT-06) — once Meta pauses a template, no client actor can edit/delete/appeal it through Falcon.

## Open questions added

CG: Q-CG-01 (ownership transfer) · Q-CG-02 (upload cap) · Q-CG-03 (original file retention) · Q-CG-04 (opt-in source enum) · Q-CG-05 (cross-CG dedup) · Q-CG-06 (NU sees peer CGs)

Template: Q-TM-V4-15 re-opened (Rejected-final ownership) · Q-TM-V4-16 (Meta restrict recovery) · Q-TM-V4-17 (variable count cap) · Q-TM-V4-18 (multi-language linking) · Q-TM-V4-19 (Deleted semantics) · Q-TM-V4-20 (Maker suspension mid-cycle)

## Total Atlas state after these waves

- **Volumes:** 49 (Vols 1-49)
- **Specialist Hubs:** 3 (Wallet, Campaigns, User Lifecycle)
- **Truth Tautology Families:** 8 (W-TT, MC-TT, US-TT, TM-TT, CG-TT, CC-TT, MP-TT, DI-TT)
- **Code-verified volumes:** Vol 45 (Wave 11), Vol 47 (Wave 14)
- **Code-mining queued for:** Vol 46 (Wave 18), Vol 48 (Wave 18), Vol 49 (Wave 19)
- **Open questions:** 30+ across all Q-* prefixes
- **Live bugs flagged:** 3 (from Wave 14)

## Trigger phrases

- `vol 48 contact group specialist` / `CG creator-only edit delete`
- `falcon cannot mutate contact group` / `CG-TT-01`
- `per-channel opt-in` / `CITC compliance contact group`
- `vol 49 template lifecycle specialist` / `template 6 states`
- `free body restricted body` / `1L 2L maker checker`
- `rejected internally loop-back` / `template edit loop`
- `meta integration boundary template` / `TM-TT-03 falcon zero access`
- `restricted template read only` / `TM-TT-06`
