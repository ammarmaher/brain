---
type: pending-question
fork-id: F-010 (PRD-inconsistency, two readings contradict)
task-id: wave-2-03-contract-Q-CC-01
halted-at: 2026-05-17T<night-shift>+03:00
night-shift-batch: forever-wave-2026-05-17
related:
  - "[[../19-night-shift-readiness/DECISION-PROTOCOL]]"
  - "[[../../../prd/modules/03-contract-packaging-charging-billing-management/GAPS]]"
  - "[[../../../prd/modules/root-documents/OVERVIEW]]"
---

# Fork: Module 03 folder title vs PRD body — Packaging + Billing scope contradiction

## Why halted

The Drive folder for module 03 is named **`3- Contract, Packaging, Charging, Billing Mngmnt Module`** — four concerns. The PRD body inside (`Contract & Cost Management V2`, 105 lines synced 2026-04-24) covers **two concerns only: Contract + Cost**.

Two readings of "what is the scope of module 03":

- **Reading A (folder-title literalism):** Module 03 owns Contract + Packaging + Charging + Billing. The body PRD is incomplete; product team has not yet written the Packaging and Billing sub-PRDs.
- **Reading B (body literalism):** Module 03 owns Contract + Cost only. The folder name is aspirational / historical; Packaging and Billing belong elsewhere or are out of scope.

These readings have **opposite operational implications** for tonight's autonomous mining:

- Under Reading A: every "missing" Packaging / Billing endpoint is a known-Phase-2 gap that should remain visible. Add `GAP-CC-34..35` (already in dossier) and continue.
- Under Reading B: Packaging and Billing are not "missing" — they were never in scope. Remove `GAP-CC-34..35` and rename the folder.

DECISION-PROTOCOL `F-010` requires halt-and-flag when two PRD readings contradict — escalate to product team, never resolve autonomously.

## Sources reviewed

- [BRAIN-OUT] `Brain SK\skills\imported-business\prd-knowledge\modules\03-contract-packaging-charging-billing-management\latest-prd.md:1-115` (full PRD body)
- [BRAIN-OUT] `Brain SK\skills\imported-business\prd-knowledge\modules\03-contract-packaging-charging-billing-management\latest-prd.md:5` (folder name `3- Contract, Packaging, Charging, Billing Mngmnt Module`)
- [BRAIN-OUT] `Brain SK\skills\imported-business\prd-knowledge\modules\03-contract-packaging-charging-billing-management\latest-prd.md:99-100` (PRD's own first open question: "'Packaging' and 'Billing' (reports) are named in the folder title but the PRD covers Contract + Cost only.")
- [BRAIN-OUT] `Brain Outputs\prd\modules\03-contract-packaging-charging-billing-management\GAPS.md` GAP-CC-34, GAP-CC-35 (current dossier reading)
- [BRAIN-OUT] `Brain Outputs\prd\modules\03-contract-packaging-charging-billing-management\BUSINESS_RULES.md` BR-CC-41 (currently OPEN tagged)
- [BRAIN-OUT] `Brain Outputs\prd\modules\root-documents\latest-prd.md` — has no cross-cutting "Packaging" / "Billing" backlog item, supporting Reading B
- [BRAIN-OUT] `Brain Outputs\understanding\backend\commerce\ENDPOINT_REGISTRY.md` — no `Packaging*` or `Billing*` controllers visible; only `Contracts*` and `Lookup*` and others, supporting Reading B currently
- [CODE] Commerce + Charging service code: no Packaging or Billing types in any DTO_DICTIONARY or controllers/ folder

## Plausible answers

### A — Reading A: Packaging + Billing are Phase 2 (folder is aspirational)
- Consequences: keep GAP-CC-34, GAP-CC-35 visible as known Phase 2 gaps · BR-CC-41 stays OPEN with "Phase 2 — scope deferred" tag · folder name stays · two new PRDs are scheduled for product team to write · backlog visible for stakeholders
- Risk: if it turns out these were never planned, the dossier carries phantom gaps forever

### B — Reading B: Folder name is legacy; only Contract + Cost is in scope
- Consequences: remove GAP-CC-34, GAP-CC-35 from dossier · close BR-CC-41 as out-of-scope · request product team to rename the Drive folder to `3- Contract & Cost Mngmnt Module` · audit other folder titles for similar drift
- Risk: if Packaging or Billing was actually planned, we lose visibility

### C — Reading C: Packaging and Billing are part of a different module not yet captured
- Consequences: scaffold a new module `06-packaging-billing` (or whatever Product wants to call it) · move BR-CC-41 / GAP-CC-34..35 to that new module · keep the folder title in module 03 explicit about Contract + Cost · accept the temporary cross-cutting gap
- Risk: introduces dossier complexity before product team has even decided the scope

## Recommended question for the human

**"For module 03: is the folder title `3- Contract, Packaging, Charging, Billing Mngmnt Module` (A) aspirational — Packaging + Billing are Phase 2 PRDs not yet written; (B) legacy — only Contract + Cost is in scope and the folder should be renamed; or (C) the Packaging + Billing PRDs exist elsewhere and need to be discovered?"**

## Blast radius

- **Blocks:** any PDF morning brief that needs accurate scope counts · accurate Phase 2 roadmap for product team · accurate Phase 2 hiring/sizing decisions
- **Does not block:** any Contract or Cost work — both are fully captured and verified against backend
- **In-flight:** the rest of Wave 2 (modules 01, 02, 04, 05, root-documents) can complete normally · Wave 4/5/6/7/9 can proceed (none touch Packaging or Billing today)

## Decision audit-trail

This pending-question file was raised by Wave 2 PRD Deep Read on 2026-05-17. The triggering rule is `F-010` (PRD-inconsistency). Resolution requires explicit human decision from product team (Jawad most likely owner per other open questions in module 03).
