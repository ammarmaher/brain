---
type: moc
cluster: 40-Authority
title: Night-Shift Readiness — 4 protocols for autonomous AI work
projection-source: C:\Falcon\Brain Outputs\datasets\authority-dataset\19-night-shift-readiness\
verified-at: 2026-05-16
purpose: "Answers 'what 4 protocols + 1 script must run for unsupervised AI work to be safe'. Open before starting any night-shift task."
---

> [!tldr]
> 4 protocols + 1 verification-chain script that push the dataset from ~80% night-shift-ready to ~95%. Without them, autonomous AI produces ambiguous specs + arbitrary forks + visually-wrong UI + false-positive "done" claims.

# Night-Shift Readiness

## The 4 protocols

| File | Answers | Phase |
|---|---|---|
| SPEC-PROTOCOL | "Turn prose into falsifiable SPEC.md" | Before any code |
| DECISION-PROTOCOL | "Which rule applies when AI hits a fork + when to halt" | During plan + during build |
| VISUAL-TARGETS | "What should feature F look like" | Before UI code |
| NIGHT-SHIFT-LOOP | "Chain build → scanner → backend verify → done-or-halt" | Automated verification |

## The 5-check readiness gate

Before any night-shift task, all 5 must be 🟢:

1. SPEC ready
2. Decision protocol applies (every fork has a rule or default)
3. Visual target exists
4. Verification automatable (build + scanner + backend PES)
5. Decision-log destination ready

If any 🔴 → escalate to supervised session.

## 25-fork catalog (6 classes)

| Class | Count | Default escalation |
|---|---|---|
| A · Authority | 5 | Halt-and-flag |
| B · Validation | 6 | Rule or default |
| C · Entity drift | 3 | Rule (PRD wins) |
| D · Business rule | 5 | Rule or halt |
| E · UI/UX | 4 | Conservative default |
| F · Operational | 3 | Halt-and-flag |

## Visual fidelity hierarchy

1. Old-UI proven implementation
2. PRD wireframe
3. Falcon UI Core component default
4. AI inference (must flag)

## The 4-gate loop

```
Gate 1 — nx build green
Gate 2 — scanner clean
Gate 3 — backend PES verify
Gate 4 — done marker
[Gate 5 — FE runtime: DEFERRED]
```

Halts produce `_pending-questions/<task>.md`, never fake completion.

## Drill into Brain Outputs

- `C:\Falcon\Brain Outputs\datasets\authority-dataset\19-night-shift-readiness\SPEC-PROTOCOL.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\19-night-shift-readiness\DECISION-PROTOCOL.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\19-night-shift-readiness\VISUAL-TARGETS\_INDEX.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\19-night-shift-readiness\NIGHT-SHIFT-LOOP.md`
- `C:\Falcon\Brain Outputs\datasets\authority-dataset\19-night-shift-readiness\NIGHT-SHIFT-LOOP.ps1`

## See also

- [[Master-Index]] — every night-shift session starts here
- [[Verification-Status]] — readiness-gate input
- [[Copy-Playbook]] · [[Auto-Sync]]
