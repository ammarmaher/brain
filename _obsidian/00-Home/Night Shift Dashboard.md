---
type: hub
purpose: night-shift-dashboard
created: 2026-05-16
---

*** Night Shift Dashboard — overnight job control + outputs ***
*** Last run: 2026-05-16-overnight-deep-dive ***

# 🌙 Night Shift Dashboard

> Single entry point for everything the Falcon overnight brain does. Reviews queue, last run, run history, and direct links into the canonical Brain Outputs deep-dive folder.

## Latest run

| Run | Started | Targets | Violations | Status |
|---|---|---|---|---|
| [`2026-05-16-overnight-deep-dive`](../../../Brain%20Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/) | 2026-05-16 03:19 | falcon-web-platform-ui (focus) + 10 backend repos | 2,734 (raw) / ~1,014 (after expected exemptions) | 🟢 producing |

## Quick links into the latest run

| File | What it gives you |
|---|---|
| [TOP_PRIORITY_FIXES.md](../../../Brain%20Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/TOP_PRIORITY_FIXES.md) | **READ THIS FIRST** — top 10 morning fixes ranked by leverage |
| [BACKUP_AGGREGATES.md](../../../Brain%20Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/BACKUP_AGGREGATES.md) | Raw counts: per-rule, top-30 files, per-app |
| [COMPONENT_VIOLATION_HEATMAP.md](../../../Brain%20Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/COMPONENT_VIOLATION_HEATMAP.md) | Which Falcon components are nearby violations |
| [SESSION_3_REFINEMENT_PLAN.md](../../../Brain%20Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/SESSION_3_REFINEMENT_PLAN.md) | Rulebook + detector refinement plan for Session 3 |
| [MORNING_REPORT.md](../../../Brain%20Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/MORNING_REPORT.md) | Synthesis of all artifacts (final agent output) |

## Folder tour

```
2026-05-16-overnight-deep-dive/
├── TOP_PRIORITY_FIXES.md           ← morning action plan
├── BACKUP_AGGREGATES.md            ← raw aggregates
├── COMPONENT_VIOLATION_HEATMAP.md  ← Falcon component cross-ref
├── SESSION_3_REFINEMENT_PLAN.md    ← what Session 3 will land
├── MORNING_REPORT.md               ← final synthesis (added when ready)
├── synthesize-morning-report.ps1   ← regenerator
├── per-rule/                       ← 22 per-rule fix plans (Agent A)
├── per-file/                       ← top 30 file plans (Agent B)
├── patterns/                       ← refactor pattern atlas (Agent C)
└── per-app/                        ← per-app scorecards (Agent D)
```

## Tier-1 fixes (do these FIRST tomorrow)

1. **R-FE-004 exempt-paths cleanup** — adds `libs/falcon-studio/**` etc → -1,500 false positives
2. **R-FE-004 pattern tightening** — only fire inside `style=` / `[ngStyle]` / raw CSS
3. **Raw `<input>` → `<falcon-input>`** migration (~80 violations / 25 files)

After Tier 1: ~1,014 → ~854 violations. **63% noise eliminated in <15 min of config work.**

## How to launch a new run

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Falcon\Brain SK\tools\night-shift\night-shift.ps1"
```

Output lands at `C:\Falcon\Brain Outputs\reports\night-shift\<run-id>\`.

## Quick frontend-only scan (10 sec)

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Falcon\Brain Outputs\understanding\rules\detectors\quick-frontend-scan.ps1"
```

Use this between full nightly runs to measure drift after each fix batch.

## Boundary doctrine

[NIGHT_SHIFT_BOUNDARIES.md](../../../Brain/NIGHT_SHIFT_BOUNDARIES.md) — read this if you ever wonder what night shift can and cannot do alone.

Hard rules:
- 🚫 No commits on Falcon source repos
- 🚫 No pushes anywhere
- 🚫 No edits under `apps/`, `libs/`, `src/`
- ✅ Read-only audit + briefing only
- ✅ Brain repo CAN auto-commit pure brain artifacts (reports, plans, scorecards)

## Future runs queue

When you say `run night shift` or `night mode` we trigger another run. Suggested cadence:

| Cadence | What it produces |
|---|---|
| **Nightly** (2-3 hrs while you sleep) | Full audit + briefing + per-rule + per-file + patterns + scorecards |
| **Pre-PR check** | quick-frontend-scan only — under 30 sec |
| **Weekly Saturday** | Full audit + AST + semantic-judge (when wired in Session 3.1+) |

## Related hubs

- [[AMMAR_BRAIN_HOME]] · [[IMPLEMENTATION_KNOWLEDGE_MAP]] · [[🟢 Start Here]]
- [[RULES_INDEX]] — rulebook catalog
- [[Color Legend]] — visual taxonomy

## Tags

#type/hub #night-shift #rulebook #code-audit
