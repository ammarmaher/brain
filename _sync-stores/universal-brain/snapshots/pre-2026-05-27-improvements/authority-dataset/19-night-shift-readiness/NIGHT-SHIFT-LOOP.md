---
type: protocol
cluster: 19-night-shift-readiness
purpose: "Answers 'how does an autonomous AI chain build → scanner → backend PES verify → mark done or halt with evidence'. Open when wiring a night-shift task to its verification gates."
audience: autonomous AI agents (night-shift mode)
---

# NIGHT-SHIFT-LOOP — Automated verification chain

> [!tldr]
> PowerShell script (`NIGHT-SHIFT-LOOP.ps1`) that chains the 5 verification gates an autonomous AI must pass before marking a task done. Brain health → build green → scanner clean → backend PES verify → mark done OR halt with evidence. Each step has an explicit exit code.

## The 5 gates (Gate 0 added 2026-05-16)

```
┌────────────────────────────────────────────────────────────┐
│  GATE 0 — Brain health (pre-flight)                        │
│    brain-audit.ps1 (cluster 20)                            │
│    exit 0 (GREEN) → continue                               │
│    exit 1 (YELLOW) → continue with warnings                │
│    exit 2 (RED · CRITICAL) → halt, fix wikilinks/orphans   │
├────────────────────────────────────────────────────────────┤
│  GATE 1 — Build green                                      │
│    nx build <app>                                          │
│    exit 0 → continue · non-zero → halt with build log      │
├────────────────────────────────────────────────────────────┤
│  GATE 2 — Scanner clean                                    │
│    .\scan-authority.ps1 -CheckOnly                         │
│    exit 0 (67/67 clean) → continue                         │
│    exit 1 (drift) → halt with drift report path            │
├────────────────────────────────────────────────────────────┤
│  GATE 3 — Backend PES verify                               │
│    POST /api/auth/login × 3 users                          │
│    POST /pes/authorize × N PES queries from SPEC.md        │
│    all match expected → continue                           │
│    any mismatch → halt with diff                           │
├────────────────────────────────────────────────────────────┤
│  GATE 4 — Done marker                                      │
│    Write completion report                                 │
│    Update _runtime-verification/decisions-<date>.md        │
│    Mark SPEC.md verdict = `complete`                       │
│    Emit memory-grow reminder (cluster 20)                  │
│    exit 0 — task safely marked done                        │
└────────────────────────────────────────────────────────────┘
```

## Exit codes (refreshed)

| Code | Gate failed | Meaning |
|---|---|---|
| 0 | — | All gates passed; task marked done |
| 1 | Gate 1 (Build) | nx build failed |
| 2 | Gate 2 (Scanner) | Drift detected on watched files |
| 3 | Gate 3 (Backend) | PES mismatch OR backend unreachable |
| 4 | Gate 0 (Brain health) | brain-audit returned CRITICAL findings |
| 10 | Pre-flight | SPEC.md missing or invalid verdict |
| 99 | Internal | Exception in the loop itself |

## Brain-grounding (cluster 18 + 20 + 21 awareness)

The loop is brain-aware as of 2026-05-16:

- **Gate 0** runs `brain-audit.ps1` (cluster 20) before any task work — proves the dataset
  itself is healthy before its claims are trusted.
- **Completion report (Gate 4)** embeds the cluster 20 MEMORY-GROW reminder (decide if the
  task is memory-worthy) and the cluster 21 brain-grounding declaration (what cluster-18
  trace the task consulted, what pitfalls were checked, what verification-gate questions
  the SPEC implicitly answered).
- **If the task is a port of Add Client / Add User / Add Node / Edit Node**, the loop
  expects the SPEC.md to reference the matching A→Z trace at `18-a-to-z-traces/*.trace.md`.
  The trace is 1029/1041/899/979 lines and answers all 18 implementation layers in one place.

## Gate 5 (deferred) — FE runtime via QA-Web

**Currently blocked** on workspace compile errors (per VERIFICATION-STATUS.md). When the 40+ Stencil/Angular errors are fixed, add Gate 5:
- Launch `nx serve host-shell` + `nx serve management-console` in background
- Poll for ready state
- Dispatch Ammar QA-Web agent with 3-user verification brief
- Pass/fail on QA-Web report

Until then, Gate 5 = manual.

## Usage

```powershell
# Run all gates for a task whose SPEC is at _specs/comms-hub-port.md
.\NIGHT-SHIFT-LOOP.ps1 -SpecPath "C:\Falcon\Brain Outputs\datasets\authority-dataset\_specs\comms-hub-port.md"

# Skip backend verify if backend is down (gate 3)
.\NIGHT-SHIFT-LOOP.ps1 -SpecPath "..." -SkipBackend

# Verbose mode for debugging
.\NIGHT-SHIFT-LOOP.ps1 -SpecPath "..." -Verbose

# Dry-run (validate SPEC.md only, no gates)
.\NIGHT-SHIFT-LOOP.ps1 -SpecPath "..." -DryRun
```

## Exit codes

| Code | Meaning | Next action |
|---|---|---|
| 0 | All gates passed | Task safely complete |
| 1 | Build red (Gate 1) | Read build log; if anti-pattern from ANTI-PATTERNS.md, fix; else halt-and-flag |
| 2 | Scanner drift (Gate 2) | Read drift report; verify intentional; MarkChecked if yes, halt if no |
| 3 | Backend PES mismatch (Gate 3) | Dataset claim contradicts runtime; high-severity — halt-and-flag immediately |
| 4 | Gate 5 (FE runtime) failure | Currently won't trigger (gate is deferred) |
| 10 | SPEC.md missing or malformed | Run SPEC-PROTOCOL first |
| 99 | Tooling unavailable (nx, docker, etc.) | Environment issue |

## Output artifacts

For every run, the loop writes:

```
Brain Outputs/datasets/authority-dataset/_runtime-verification/
├── loop-<task-id>-<YYYY-MM-DD-HHMM>.md     ← completion report
├── decisions-<YYYY-MM-DD>.md                ← appended decision log
└── (gate-specific evidence files as needed)
```

## Completion report shape

```markdown
---
type: night-shift-loop-report
task: <task-id>
run-at: <ISO>
verdict: pass | halt
exit-code: 0..99
purpose: "Answers 'did this night-shift task pass all 4 gates'. Open after every night-shift run."
---

# Loop report · <task-id>

## TL;DR
<verdict in 1 sentence>

## Gates
| Gate | Status | Detail |
|---|---|---|
| 1 Build | ✅ / 🔴 | <link to build log> |
| 2 Scanner | ✅ / 🔴 | <link to drift report if any> |
| 3 Backend PES | ✅ / 🔴 | <matrix snippet> |
| 4 Done marker | ✅ / 🔴 | <link to SPEC.md updated> |
| 5 FE runtime | 🟡 DEFERRED | Workspace compile errors |

## Decisions logged this run
- F-XXX · ... · ...

## Halt details (if halted)
- Gate failed: <number>
- Reason: <one line>
- Evidence file: <path>
- Recommended next action: <one line>

## Pending questions queued
- <path to _pending-questions/*.md>
```

## Integration with the other protocols

- **SPEC-PROTOCOL** produces the SPEC.md that this loop consumes
- **DECISION-PROTOCOL** is consulted at every gate failure (which fork applies? what's the rule?)
- **VISUAL-TARGETS** is consulted by the human-review step that follows Gate 4 (no visual verification automated yet)

## The full night-shift run pattern

```
1. SPEC-PROTOCOL produces SPEC.md → ambiguity score check → proceed/halt
2. AI implements the SPEC (writes code, edits files)
3. NIGHT-SHIFT-LOOP runs Gates 1-4
4. If pass: SPEC.md marked complete, decisions logged, task done
5. If halt: pending-question file written, partial progress preserved, human reviews next morning
```

## See also

- [[SPEC-PROTOCOL]]
- [[DECISION-PROTOCOL]]
- [[VISUAL-TARGETS/_INDEX]]
- `NIGHT-SHIFT-LOOP.ps1` (same folder)
- `_runtime-verification/comms-hub-2026-05-16.md` (real example of a partial run that produced the backend-only verification this loop automates)
- `falcon-wiki/scripts/scan-authority.ps1` (Gate 2 implementation)
