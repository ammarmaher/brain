---
type: context-package
purpose: load-on-next-session
generatedAt: 2026-05-16
runId: 2026-05-16-overnight-deep-dive
---

*** Context package for the next Claude session ***
*** Tomorrow's "open this first" — minimal load chain ***

# 📦 Context for the Next Session

> When you (or any future Claude session) sits down to act on tonight's work, **load these files in order**. After step 4 you have all the context to dispatch work tomorrow.

## Mandatory reads (in order)

1. **`MORNING_REPORT.md`** — the TL;DR. Counts + top rules + top files + per-repo.
2. **`TOP_PRIORITY_FIXES.md`** — the action plan ranked by leverage. Items 1-3 alone wipe out 63% of noise.
3. **`PROJECTED_BURNDOWN.md`** — what each refinement step actually removes (computed against real JSONL).
4. **`LEARNING_FROM_TONIGHT.md`** — 8 insights to consider promoting into permanent brain knowledge.

## Optional drill-downs

| If you're doing… | Read also |
|---|---|
| Detector/rule refinement | `SESSION_3_REFINEMENT_PLAN.md` |
| App-by-app prioritization | `per-app/APPS_RANKING.md` |
| A specific rule | `per-rule/r-<id>-fix-plan.md` |
| Per-file refactor | `per-file/<rank>-<sanitized>.md` (when Agent B finishes) |
| Pattern migration | `patterns/PATTERNS_INDEX.md` then specific PATTERN-NN |
| Matrix view | `RULE_X_APP_MATRIX.md` |
| Component impact | `COMPONENT_VIOLATION_HEATMAP.md` |
| Raw aggregates | `BACKUP_AGGREGATES.md` |

## What to dispatch tomorrow

The morning agent should be **`ammar-web-platform-ui`** for every code fix below (per the boundary doctrine, only that agent has write access to `falcon-web-platform-ui`).

### Tier 1 — Rulebook config (no code touched, you can do alone)

1. Edit `Brain Outputs/understanding/rules/frontend/R-FE-004-tokens-only.md` → add exemptPaths (see TOP_PRIORITY_FIXES.md #1)
2. Edit detector regex pattern (see TOP_PRIORITY_FIXES.md #2)
3. Re-run `quick-frontend-scan.ps1` — expect drop from 2734 → ~767

### Tier 2 — Code fixes (dispatch to ammar-web-platform-ui)

4. PATTERN-01 raw `<input>` → `<falcon-input>`
5. PATTERN-03 inline-style → Tailwind utility (focus on skeleton components)
6. PATTERN-07 physical → logical margin/padding (admin-console RTL)
7. PATTERN-05 intent → palette color (admin-console)

For each pattern: pass the corresponding patterns/PATTERN-NN file as the spec.

## Tomorrow's quick commands

```powershell
# 1. Quick scan baseline (before any fix)
powershell -ExecutionPolicy Bypass -File "C:\Falcon\Brain Outputs\understanding\rules\detectors\quick-frontend-scan.ps1"

# 2. After fix batch, re-scan to measure drift
powershell -ExecutionPolicy Bypass -File "C:\Falcon\Brain Outputs\understanding\rules\detectors\quick-frontend-scan.ps1"

# 3. Re-run synthesizer to refresh MORNING_REPORT
powershell -ExecutionPolicy Bypass -File "C:\Falcon\Brain Outputs\reports\night-shift\2026-05-16-overnight-deep-dive\synthesize-morning-report.ps1"

# 4. Run a fresh night shift tonight (for tomorrow's morning)
powershell -ExecutionPolicy Bypass -File "C:\Falcon\Brain SK\tools\night-shift\night-shift.ps1"
```

## What's intentionally DEFERRED

Not blockers — just confirmed not done tonight, to be done in future sessions:

- **AST runners** (FE TS Compiler API + BE Roslyn) — Session 3.1. Required for R-FE-007 (library skeleton service injection), R-BE-001/004/008.
- **Semantic-judge live calls** — Session 3.2. Required for R-FE-006/008/010/011, R-NOOR-002/006, R-XC-003/005/006/007/009.
- **Auto-apply patches** — boundary doctrine forbids. Always requires explicit approval.
- **Per-file agent (Agent B)** — was slowest tonight; if it didn't finish, the per-file plans are missing. PATTERNS still cover the file-by-file context via top file lists in each PATTERN.

## What you (the user) might want to say tomorrow

| You say | What I'll do |
|---|---|
| `start session 3` | Load this context, apply Tier 1 rulebook refinements, run quick-frontend-scan, confirm drop to ~767 |
| `apply tier 1` | Just the config edits, no code touched |
| `dispatch pattern-01` | Hand the raw-input-to-falcon-input migration to ammar-web-platform-ui agent |
| `run another night shift` | Tonight's run reproducible — kicks off another autonomous run |
| `approve insight N` | Promote the insight from LEARNING_FROM_TONIGHT.md into permanent brain knowledge |
| `show me the worst file` | I'll open per-file/01-* (when Agent B finishes) or look up live |
| `audit the backend too` | Run the full audit on commerce/charging/identity/provisioning |

## Hard rules carried forward

- 🚫 No commits on Falcon source repos without explicit "commit" in current message
- 🚫 No pushes without explicit "push" in current message
- 🚫 No edits under apps/ libs/ src/ unless dispatched to ammar-web-platform-ui
- ✅ Brain repo CAN auto-commit pure brain artifacts (this run's outputs + future reports)
- ✅ Read-only audit re-runs are always safe

## Related

- [NIGHT_SHIFT_BOUNDARIES.md](../../../../Brain/NIGHT_SHIFT_BOUNDARIES.md) — full boundary doctrine
- [tools/night-shift/night-shift.ps1](../../../tools/night-shift/night-shift.ps1) — orchestrator entry point
- This run's folder: [.](.)
