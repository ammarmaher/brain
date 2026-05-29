---
type: atlas-volume-graph-node
volume: 49
cluster: 10-pages
source: "[BRAIN-OUT] Brain Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-49-TEMPLATE-LIFECYCLE-SPECIALIST.md"
created: 2026-05-18
status: canonical
tags:
  - atlas/vol49
  - specialist/template
  - specialist/maker-checker
  - specialist/meta-integration
---

# Vol 49 — Template Lifecycle Specialist Guide

> Unified operating model for template creation, maker/checker workflow (V4 Free/Restricted, 1L/2L), 6-status lifecycle, Meta integration boundary, hierarchy-axis action matrix, Meta↔Falcon status mapping, variable interpolation, i18n.

## What's in it

13 sections:
- §1 Template concept (per-channel, why templates exist)
- §2 The 6-status lifecycle (Pending/Approved/Rejected-int/Rejected-final/Restricted/Deleted) + transition graph + Meta mapping
- §3 Free Body vs Restricted Body (V4)
- §4 Maker/Checker workflow (4 modes — Free, R-1L, R-2L, R-2L-Reject)
- §5 Per-status × hierarchy action matrix (Vol 44 §4 canonical, all 3 tabs × 2 axes × 4 user types × 6 statuses)
- §6 Meta integration boundary (Business Mgmt API + webhooks)
- §7 Variable interpolation ({{1}} placeholders, max 10 per Meta)
- §8 Internationalization (Ar/En variants, RTL handling)
- §9 7-class edge cases
- §10 Error catalog
- §11 PR review checklist (14 items)
- §12 Cross-references
- §13 6 new open questions (Q-TM-V4-15..20)

## Headline truth

> Templates have **6 status states** (Pending/Approved/Rejected-int/Rejected-final/Restricted/Deleted). **Rejected internally is the ONLY status where Edit is allowed** (maker/checker loop-back, TM-TT-05). Free Body auto-approves; Restricted Body needs 1-Level OR 2-Level internal approval before Meta submission. Falcon User has ZERO access on "His Node" Templates tab (TM-TT-03) but full visibility into sub-hierarchy. Restricted (Meta-paused) is READ-ONLY everywhere (TM-TT-06).

## Supersedes

- Vol 38 (Module 05 Templates Conclusion) — historical, replaced by Vol 41 + this volume

## See also

- [[VOL-44-TRUTH-TAUTOLOGIES]] §Template Tab Matrix (TM-TT-01..08)
- [[05 Templates]] — PRD Module 05
- [[Vol 41 — Template Module V4 Deep Refresh]] — canonical predecessor
- [[Vol 46 — Campaigns Channels Specialist Guide]] §2 (WhatsApp template lifecycle within Campaigns)
- [[Vol 47 — User Lifecycle Specialist Guide]] (creator gate)
- [[Vol 48 — Contact Group Specialist Guide]] (templates consume CG recipients)
- [[ATLAS_MASTER_INDEX]]
