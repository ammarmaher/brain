---
type: atlas-volume-graph-node
volume: 55
cluster: 10-pages
source: "[BRAIN-OUT] Brain Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-55-MARKETPLACE-VISIBILITY-PRICING-SPECIALIST.md"
created: 2026-05-18
status: canonical
tags:
  - atlas/vol55
  - specialist/marketplace
  - specialist/pricing
  - specialist/visibility
---

# Vol 55 — Marketplace Visibility & Pricing Specialist Guide

> Falcon's commercial controls (Visibility + Pricing Type + Pricing Value + Scheduled Change) vs Client's operational controls (DoPayment + Enable + Disable). Closes the Marketplace circuit + flags MP-TT-04 unimplemented gap.

## What's in it

13 sections:
- §1 Two parallel menu items (CommChannels & Services Mng + Marketplace & Applications Mng) + dual-page sync (MP-TT-01)
- §2 Visibility commercial gate (MP-TT-02) — CODE-VERIFIED enforced
- §3 Falcon-only pricing edits (MP-TT-03) — PARTIAL: filter exists, handlers missing
- §4 **Scheduled price change (MP-TT-04) — ENTIRELY MISSING** — task chip spawned
- §5 Inactive (First Time) vs Inactive (MP-TT-05) — likely broken (StatusHistory empty)
- §6 Falcon-side 5-action menu (Edit Type/Value, DoPayment, Enable, Disable)
- §7 Client-side card/table view
- §8 End-to-end pricing edit flow (with unimplemented gap)
- §9 Cross-reference to Vol 44 MP-TT-01..05
- §10 6-class edge cases
- §11 Mental model (Falcon owns commerce; Client owns operation)
- §12 Cross-references
- §13 6 new open questions (Q-MP-01..06)

## Headline truths

> Two menu items, ONE entity store (Provisioning Mongo). Visibility is Falcon-only commercial gate (CODE-VERIFIED at `ServicesActionsPolicy.cs:28-29`). Pricing Type/Value should be Falcon-only too (filter exists, **handlers don't**). Scheduled price change (`NewPricingType` + `NewPricingValue` + `EffectiveDate` triplet) is **100% unimplemented** — task chip open. Inactive (First Time) distinction likely broken because `StatusHistory[]` is empty in current code.

## See also

- [[MARKETPLACE-PRICING-SPECIALIST-HUB]] — entry point hub (this volume)
- [[VOL-44-TRUTH-TAUTOLOGIES]] §Marketplace (MP-TT-01..05)
- [[Vol 53 — Order Payment Polling Specialist]] — DoPayment runtime
- [[CAMPAIGNS-CHANNELS-SPECIALIST-HUB]] — channel-side dependency
- [[ATLAS_MASTER_INDEX]]
