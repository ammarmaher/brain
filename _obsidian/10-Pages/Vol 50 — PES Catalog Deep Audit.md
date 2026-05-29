---
type: atlas-volume-graph-node
volume: 50
cluster: 10-pages
source: "[BRAIN-OUT] Brain Outputs/reports/night-shift/2026-05-17/BUSINESS-SCENARIOS-ATLAS-VOL-50-PES-CATALOG-DEEP-AUDIT.md"
created: 2026-05-18
status: canonical-code-verified
closes: Q-AM-16
tags:
  - atlas/vol50
  - specialist/pes
  - specialist/security
  - q-am-16-closure
---

# Vol 50 — PES Catalog Deep Audit

> The authoritative audit of Falcon's Permission Enforcement System. Closes Q-AM-16 (the long-standing PES↔PRD drift audit).

## What's in it

14 sections:
- §1 The 6 canonical roles (3 Falcon + 3 Client, no inheritance)
- §2 The 58-key factory inventory (vs PRD-stated 47 — drift D)
- §3 The 412-seeded p-rule grid (68/56/67/74/72/75)
- §4 9 orphan keys (factory but no seed) — including 3 wizard-blocking HIGH severity
- §5 **Q-AM-16 CLOSURE — 12 PRD↔code drifts** with severity + resolution
- §6 Status-conditional gating — NOT in PES, handler-layer
- §7 Creator-gated rules — confined to Contact Group (7 rules)
- §8 Hierarchy/node-scope — OFF the PES surface
- §9 Tenant boundary — IS in PES via PolicySubjectContract
- §10 The 3-layer enforcement stack mental model
- §11 PR review checklist (10 items)
- §12 Cross-references
- §13 7 open questions surfaced
- §14 Q-AM-16 final status

## Headline truths

> Falcon has **6 canonical roles** at `BuiltInRoleCatalog.cs:77-290`, **58 key factories** at `falcon-access.registry.ts:1-185` (PRD said 47 — drift), **412 seeded p-rules** total (68/56/67/74/72/75). **Status-gating is handler-layer, NOT PES**. **Hierarchy/node-scope is handler-layer, NOT PES**. **Tenant boundary IS PES** via `PolicySubjectContract`. Creator-gated rules exist ONLY for Contact Group (7 rules with `r.obj.createdby == r.sub.userid` expression).

## 12 drifts (Q-AM-16 closure)

5 HIGH (Template entirely PES-blind, Contract no Falcon-view, 3 wizard-blocking orphans) + 7 MED. Task chips spawned for HIGH bundle + CRITICAL PolicySubjectContract regression test.

## See also

- [[PES-CATALOG-SPECIALIST-HUB]] — entry point hub
- [[VOL-44-TRUTH-TAUTOLOGIES]] — atomic tautologies
- [[Vol 47 — User Lifecycle Specialist Guide]] (status enforced at handler, not PES)
- [[Vol 48 — Contact Group Specialist Guide]] (creator-gate is PES-enforced)
- [[Vol 49 — Template Lifecycle Specialist Guide]] (HIGH drift: PES-blind)
- [[ATLAS_MASTER_INDEX]]
