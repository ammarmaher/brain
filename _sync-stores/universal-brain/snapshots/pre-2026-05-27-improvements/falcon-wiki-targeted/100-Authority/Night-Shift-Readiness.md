---
type: moc
cluster: 100-Authority
title: Night-Shift Readiness — 4 protocols for autonomous AI work
projection-source: _mounts/brain-outputs/datasets/authority-dataset/19-night-shift-readiness/
verified-at: 2026-05-16
purpose: "Answers 'what 4 protocols + 1 script must run for unsupervised AI work to be safe'. Open before starting any night-shift task; consulted at every fork during the build."
---

> [!tldr]
> 4 protocols + 1 chained-verification script that turn the authority dataset from ~80% night-shift-ready to ~95%. Without these, autonomous AI shifts produce ambiguous specs, arbitrary fork resolutions, visually-wrong UI, and false-positive "done" claims.

# Night-Shift Readiness

## The 4 protocols

| Protocol | Answers | When invoked |
|---|---|---|
| **SPEC-PROTOCOL** | "How do I turn prose into a falsifiable SPEC.md?" | Step 1 — before any code |
| **DECISION-PROTOCOL** | "When the AI hits a fork, which rule applies + when to halt?" | Step 2 — during plan + during build |
| **VISUAL-TARGETS** | "What should feature F LOOK like — components, tokens, states?" | Step 3 — before writing UI code |
| **NIGHT-SHIFT-LOOP** | "How does the AI chain build → scanner → backend verify → done-or-halt?" | Step 4 — automated verification |

## The 5-check readiness gate

Before running ANY task in night-shift mode, all 5 must be 🟢:

1. **SPEC ready** — task has a complete `SPEC.md` per SPEC-PROTOCOL (or task is a port/playbook with locked scope)
2. **Decision protocol applies** — every fork the task will hit has a rule OR is in the conservative-defaults catalog
3. **Visual target exists** — task has a visual fidelity reference (old-UI · wireframe · component default)
4. **Verification automatable** — task can be checked via `nx build` + scanner + backend PES verify
5. **Decision-log destination ready** — `_runtime-verification/decisions-<date>.md` will be auto-populated

If any of these 5 is 🔴, the task is **not safe for night-shift** — escalate to a supervised session.

## The 25-fork catalog (DECISION-PROTOCOL highlights)

| Class | Count | Default escalation |
|---|---|---|
| A — Authority | 5 | Halt-and-flag |
| B — Validation | 6 | Apply rule or default |
| C — Entity drift | 3 | Apply rule (PRD wins on labels) |
| D — Business rule | 5 | Apply rule or halt |
| E — UI/UX | 4 | Apply conservative default |
| F — Operational | 3 | Halt-and-flag |

Each fork has: name · class · trigger · canonical resolution · escalation criteria · logging.

## The 12 conservative defaults (SPEC-PROTOCOL highlights)

For common forks where the rule is clear but the spec doesn't say it explicitly: username cap (PRD wins · 30) · PasswordSecurityLevel mapping · empty-state shown not hidden · loading state = skeleton not spinner · error UI inline + toast · locale fallback en-US · date format ISO 8601 transport / PRD display · boolean default false · enum first non-None · pagination size 20 · status badge color per `02-statuses/<entity>-status.md`.

## Visual fidelity hierarchy (VISUAL-TARGETS rule)

If sources disagree on what the UI should look like:
1. **Old-UI proven implementation** wins (shipped + worked)
2. **PRD wireframe** (if available)
3. **Falcon UI Core component default** (unstyled baseline)
4. **AI inference** (last resort — must flag as Class E fork)

## The 4-gate loop (NIGHT-SHIFT-LOOP)

```
Gate 1 — nx build green
Gate 2 — scan-authority -CheckOnly clean
Gate 3 — Backend PES verify (login + authorize for users defined in SPEC)
Gate 4 — Done marker (completion report + decisions log)
[Gate 5 — FE runtime: DEFERRED on workspace compile errors]
```

Each gate has an explicit exit code (0 / 1 / 2 / 3 / 4 / 10 / 99). Halts produce a `_pending-questions/<task>.md` instead of fake completion.

## Drill into Brain Outputs

- [SPEC-PROTOCOL](../_mounts/brain-outputs/datasets/authority-dataset/19-night-shift-readiness/SPEC-PROTOCOL.md)
- [DECISION-PROTOCOL](../_mounts/brain-outputs/datasets/authority-dataset/19-night-shift-readiness/DECISION-PROTOCOL.md)
- [VISUAL-TARGETS / _INDEX](../_mounts/brain-outputs/datasets/authority-dataset/19-night-shift-readiness/VISUAL-TARGETS/_INDEX.md)
  - [comms-hub.visual](../_mounts/brain-outputs/datasets/authority-dataset/19-night-shift-readiness/VISUAL-TARGETS/comms-hub.visual.md)
  - [organization-hierarchy.visual](../_mounts/brain-outputs/datasets/authority-dataset/19-night-shift-readiness/VISUAL-TARGETS/organization-hierarchy.visual.md)
- [NIGHT-SHIFT-LOOP.md](../_mounts/brain-outputs/datasets/authority-dataset/19-night-shift-readiness/NIGHT-SHIFT-LOOP.md) — protocol
- `NIGHT-SHIFT-LOOP.ps1` — chained verification script

## See also

- [[Master-Index]] — Falcon-wide knowledge router (every night-shift session starts here)
- [[Verification-Status]] — what's runtime-verified vs not (consulted by the readiness gate)
- [[Copy-Playbook]] — 12-step recipe night-shift tasks will execute
- [[Auto-Sync]] — Gate 2 implementation
