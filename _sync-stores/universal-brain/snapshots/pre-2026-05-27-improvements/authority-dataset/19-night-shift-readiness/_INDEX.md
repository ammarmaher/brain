---
type: index
cluster: 19-night-shift-readiness
purpose: "Answers 'what 4 protocols + 1 script must run for autonomous night-shift work to be safe'. Open at the START of any unsupervised AI session that will produce code without human review."
audience: autonomous AI agents (night-shift mode)
---

# Night-Shift Readiness — Cluster Index

> [!tldr]
> 4 protocols + 1 script that turn the authority dataset from ~80% night-shift-ready to ~95%. Without these, autonomous AI shifts produce ambiguous specs, arbitrary fork resolutions, visually-wrong UI, and false-positive "done" claims. WITH these, autonomous AI can safely port well-specified features overnight.

## The 4 protocols

| File | What it answers | Phase in the night-shift flow |
|---|---|---|
| [[SPEC-PROTOCOL]] | "How do I turn ambiguous prose into a falsifiable SPEC.md?" | Step 1 — before any code |
| [[DECISION-PROTOCOL]] | "When the AI hits a fork, which rule applies + when to halt vs proceed?" | Step 2 — during planning + during build |
| [[VISUAL-TARGETS/_INDEX]] | "What should feature F LOOK like — components, tokens, layout, states?" | Step 3 — before writing UI code |
| [[NIGHT-SHIFT-LOOP]] | "How does the AI chain build → scanner → backend verify → halt-or-mark-done?" | Step 4 — automated verification |

## The night-shift readiness gate (6 checks — updated 2026-05-16)

Before running ANY task in night-shift mode, confirm all 6 are 🟢:

1. **Brain healthy** — `brain-audit.ps1` (cluster 20) returns exit 0 (GREEN) or 1 (YELLOW). Exit 2 (RED · CRITICAL) blocks the run.
2. **SPEC ready** — task has a complete `SPEC.md` per SPEC-PROTOCOL (or task is a port/playbook with locked scope)
3. **Decision protocol applies** — every fork the task will hit has a rule in DECISION-PROTOCOL OR is in the conservative-defaults catalog
4. **Visual target exists** — task has a visual fidelity reference (old-UI page · wireframe · component default)
5. **Verification automatable** — task can be checked via `nx build` + scanner + backend PES verify (no manual visual review needed)
6. **Decision-log destination ready** — `_runtime-verification/decisions-<date>.md` will be auto-populated by NIGHT-SHIFT-LOOP

If any of these 6 is 🔴, the task is **not safe for night-shift** — escalate to a supervised session.

### What's new in the readiness gate (2026-05-16)

- **Check 1 (Brain healthy)** is new. It uses the cluster 20 `brain-audit.ps1` to prove the
  dataset is healthy before the task starts. NIGHT-SHIFT-LOOP.ps1 runs this as Gate 0.
- **For port tasks**: if the SPEC.md references one of the Org Hierarchy flows, an A→Z trace
  exists at `18-a-to-z-traces/<flow>.trace.md` covering all 18 implementation layers in
  one document. The night-shift agent should consult it before starting.
- **At task end**: the loop's Gate 4 completion report now embeds a memory-grow reminder
  per cluster 20 MEMORY-GROW-PROTOCOL and a brain-grounding declaration per cluster 21
  PR-TEMPLATE.

## When does this cluster apply?

- ✅ Autonomous AI sessions (no human review during the run)
- ✅ Scheduled/cron AI tasks
- ✅ Multi-agent pipelines where intermediate steps must be unsupervised
- ❌ Interactive sessions (use `/gsd-spec-phase` + human review instead)
- ❌ Tasks where the human is on-call during the run

## Honest scoring

| Capability | Pre-cluster-19 | Post-cluster-19 |
|---|---|---|
| Locked-scope spec for the task | 🔴 ad-hoc | 🟢 SPEC.md |
| Fork resolution without human input | 🔴 arbitrary | 🟢 DECISION rules |
| Visual fidelity | 🔴 generic | 🟢 per-feature target |
| Self-verification | 🟡 manual | 🟢 LOOP script |
| **Overall night-shift readiness** | **~80%** | **~95%** |

The last 5% is workspace-state issues (the 40+ Stencil/Angular compile errors documented in `VERIFICATION-STATUS.md`) — out of dataset scope.

## See also

- [[../0-MASTER-INDEX]] — Falcon-wide knowledge router
- [[../VERIFICATION-STATUS]] — what's runtime-verified vs not
- [[../00-VERIFICATION-GATE]] — the 19 falsifiable questions
- [[../18-a-to-z-traces/Add-Client.trace]] — canonical A→Z exemplar a night-shift agent should mimic
- [[../15-implementation-pitfalls/_INDEX]] — known pitfalls every night-shift task should check
