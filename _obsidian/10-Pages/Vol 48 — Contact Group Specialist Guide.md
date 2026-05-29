---
type: atlas-volume-graph-node
volume: 48
cluster: 10-pages
source: "[BRAIN-OUT] Brain Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-48-CONTACT-GROUP-SPECIALIST.md"
created: 2026-05-18
status: canonical
tags:
  - atlas/vol48
  - specialist/contact-group
  - specialist/recipient-targeting
---

# Vol 48 — Contact Group Specialist Guide

> Operating model for CG creation, edit, share, delete, download — 7-action permission matrix, creator-only Edit/Delete, Falcon-staff non-mutation invariant, opt-in records, upload validation.

## What's in it

15 sections:
- §1 Entity model (ContactGroup + ContactRecipient with per-channel optInStatus)
- §2 The 7-action permission matrix (Vol 44 §5 canonical)
- §3 Falcon-staff non-mutation invariant (CG-TT-01)
- §4 Creator-only Edit/Delete (CG-TT-02)
- §5 Share scopes per role (CG-TT-04)
- §6 Download CG vs Download Original Uploaded File (CG-TT-05)
- §7 CG vs Recipient lifecycle
- §8 Opt-in records (KSA CITC compliance)
- §9 Upload formats & validation pipeline
- §10 PES interactions (Falcon-staff explicit denials)
- §11 7-class edge cases
- §12 Error catalog
- §13 PR review checklist (14 items)
- §14 Cross-references
- §15 6 new open questions (Q-CG-01..06)

## Headline truth

> **Falcon staff cannot mutate** Contact Groups — strongest "Falcon does not touch customer data" enforcement in the platform. Creator-only Edit/Delete across all client roles. Share scope hierarchy: NU own-only, AO/NA scope-bounded. Per-channel opt-in records (WA/SMS/Email/Voice independent). Upload pipeline normalizes phone to E.164 via Vol 44 §8 destination-ID flow.

## See also

- [[VOL-44-TRUTH-TAUTOLOGIES]] §Contact Group (CG-TT-01..05)
- [[04 Contact Group Management]] — PRD Module 04
- [[Vol 46 — Campaigns Channels Specialist Guide]] §4.4 + §9.4 (opt-in compliance)
- [[Vol 47 — User Lifecycle Specialist Guide]] (creator gate depends on user status)
- [[ATLAS_MASTER_INDEX]]
