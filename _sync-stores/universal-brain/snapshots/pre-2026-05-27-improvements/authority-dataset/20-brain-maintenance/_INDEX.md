---
type: index
cluster: 20-brain-maintenance
verified-at: 2026-05-16
purpose: "Answers 'how does the brain stay fresh + how do I prove it's still healthy'. Open at start-of-session (to know obligations) + once a week (to run the audit)."
---

# 20-brain-maintenance - Keep the brain fresh

> [!tldr]
> The authority dataset, vault projections, and shared memory only stay valuable if they stay current. This cluster codifies the maintenance contract every session implicitly carries and provides a script to prove the brain is healthy.

## Contents

| File | Answers | Cadence |
|---|---|---|
| [MEMORY-GROW-PROTOCOL.md](MEMORY-GROW-PROTOCOL.md) | "What does every session owe the brain at start + end?" | Read at session start/end |
| [brain-audit.ps1](brain-audit.ps1) | "Is the brain healthy right now?" | Weekly + before any large change |

## The maintenance contract (one-screen summary)

| Phase | Obligation | Cost |
|---|---|---|
| **Start** | Read MASTER-INDEX + VERIFICATION-STATUS | ~30s |
| **During** | Source-prefix every Falcon fact | inline |
| **At fork** | Consult DECISION-PROTOCOL; halt-and-flag if no rule | ~1min/fork |
| **End** | Add 1-line memory entry if substantive | ~2min |

Total cost: ~3min per session. Total benefit: every future session inherits what this one learned.

## Quick-run the audit

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File ".\Brain Outputs\datasets\authority-dataset\20-brain-maintenance\brain-audit.ps1"
```

Exit codes: 0 = GREEN, 1 = YELLOW (warnings), 2 = RED (critical).

Reports written to `Brain Outputs/datasets/authority-dataset/_runtime-verification/brain-audit-<date>.md`.

## See also

- `0-MASTER-INDEX.md` - what the brain knows
- `VERIFICATION-STATUS.md` - what's runtime-verified vs not
- `19-night-shift-readiness/` - protocols that depend on brain freshness
- `MEMORY.md` (in `.claude/projects/.../memory/`) - the shared memory index every session reads
- `falcon-wiki/scripts/scan-authority.ps1` - code-source drift detection (different concern)
