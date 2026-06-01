---
type: pending-question
fork-id: F-009 (prereq missing — Q-UM-07 Permission Sheet Tab 2)
task-id: wave-2-02-user-Q-UM-07
halted-at: 2026-05-17T<night-shift>+03:00
night-shift-batch: forever-wave-2026-05-17
related:
  - "[[../19-night-shift-readiness/DECISION-PROTOCOL]]"
  - "[[../../../prd/modules/02-user-management/QUESTIONS]]"
  - "[[../../../prd/modules/02-user-management/attachments]]"
---

# Fork: Module 02 — Permission Sheet Tab 2 missing from local sync

## Why halted

The PRD `02-user-management` references "Permission list - Jawad" as the **authoritative role × action matrix**. The local sync (2026-04-24) captured **Tab 1 only**; **Tab 2 is referenced in the PRD body but not extracted**.

Implication: every Q-UM that depends on the full permission matrix (Q-UM-08 Client→Falcon role granting; Q-UM-15 PES 3-state vs 4-state encoding; Q-UM-16 Falcon admin skip-OTP) can be answered correctly ONLY against the full matrix. Tab 1 alone might say one thing; Tab 2 might contradict.

DECISION-PROTOCOL `F-009`: "Q-UM-07 still blocked (PRD Sheet Tab 2 uncaptured) → Proceed against captured Tab 1, mark decision as `conditional on Tab 2`. Log in decisions file. If conflict surfaces later, retroactively adjust."

Wave 2 has been proceeding against Tab 1 throughout. This pending-question file makes the conditional explicit.

## Sources reviewed

- [BRAIN-OUT] `Brain Outputs\prd\modules\02-user-management\attachments.md:13-17` — original capture note: "PRD body mentions 'sheet 1' and 'sheet 2'; sheet 2 was not captured"
- [BRAIN-OUT] `Brain Outputs\prd\modules\02-user-management\QUESTIONS.md` Q-UM-07 (existing entry)
- [BRAIN-OUT] `Brain Outputs\prd\modules\02-user-management\BUSINESS_RULES.md` BR-UM-43 + BR-UM-44 (current state: authoritative-sheet noted, 4-state values declared)
- [BRAIN-OUT] `Brain Outputs\datasets\authority-dataset\07-cross-cutting\permission-sheet-gaps.md` (if exists — referenced in DECISION-PROTOCOL F-009)
- [BRAIN-SK] `Brain SK\skills\imported-business\prd-knowledge\modules\02-user-management\latest-prd.md:122` (references "another sheet")
- [PRD] `latest-prd.md` reference to `Permission list - Jawad` Google Sheet

## Plausible answers

### A — Re-export Tab 2 from Google Drive (recommended)
- User authenticates with Drive + re-exports the multi-tab sheet to `Brain SK\skills\imported-business\prd-knowledge\modules\02-user-management\attachments\permission-list-jawad-tab2.csv`
- Update `attachments.md` to confirm both tabs captured
- Re-run Wave 2 verification on Tab 2 contents — most likely Tab 2 contains: Falcon-specific actions, Client-specific actions, sub-account-level overrides, or context-specific deny rules
- Consequences: full matrix available · Q-UM-08, Q-UM-15, Q-UM-16 resolvable · ~30 min of Drive sync work

### B — Proceed against Tab 1 only with the F-009 conditional flag (current state)
- Mark all decisions conditional on Tab 2
- Re-run audit retroactively when Tab 2 lands
- Consequences: tonight's mining completes · permission matrix possibly incomplete · risk of needing to revise BR-UM-43..44 + downstream V-rules

### C — Treat Tab 2 as deferred to Phase 2
- Halt all permission-matrix verification beyond Tab 1
- Block Q-UM-15 (PES 3-vs-4-state) as undecidable until Tab 2 lands
- Consequences: PES validator design stays ambiguous · no risk of incorrect implementation · pushes resolution to product team

## Recommended question for the human

**"For Q-UM-07: can you re-export the `Permission list - Jawad` Google Sheet with both Tab 1 AND Tab 2 to `Brain SK\skills\imported-business\prd-knowledge\modules\02-user-management\attachments\` so the full role × action matrix can be validated? Currently only Tab 1 is captured."**

## Blast radius

- **Blocks (until Tab 2 lands):** Q-UM-08 (Client → Falcon role granting), Q-UM-15 (PES encoding), Q-UM-16 (Falcon admin skip-OTP), Q-AM-16 (PES sheet sync) — all depend on full matrix
- **Does not block:** any individual BR-UM-* rule that doesn't touch permissions · all Login / Forgot Password / Change Password flows · all User Management endpoints already verified
- **Continues:** Wave 2 refreshes for module 02 (this pending-question is the only halt) · Waves 4/5/6/9 unrelated to permissions

## Decision audit-trail

Per DECISION-PROTOCOL F-009: proceeding against Tab 1 + marking conditional. This file makes the conditional explicit. Resolution requires either (A) Drive re-export OR (C) product-team-confirmed deferral.
