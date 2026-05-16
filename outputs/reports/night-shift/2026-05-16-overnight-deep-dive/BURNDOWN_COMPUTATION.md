---
type: burndown-computation
runId: morning-2026-05-16-do-all-5
baseline: 275 platform violations (night-shift-2026-05-16-overnight)
generatedAt: 2026-05-16T08:00:00+03:00
---

*** Burndown — projected outcome of "do all 5" morning batch ***
*** Conservative + optimistic scenarios + post-week trajectory ***

# 📉 Burndown Computation

> Computed from the **275-violation platform baseline** (the accurate, scope-respecting figure from the Night Shift orchestrator run at 03:19). Quick-scan's 2,734 figure is over-broad and not used for burndown.

## Baseline (where we started this morning)

```
Total real violations across all 11 Falcon repos: 275
  Severity: must         255
  Severity: should        20
  Severity: nice           0

By rule (top 10):
  R-NOOR-003 Typography scale         146   53.1% of platform debt
  R-FE-002   No SCSS / no component CSS  44
  R-NOOR-005 Palette over intent        24
  R-FE-009   Folder structure pattern   20
  R-FE-012   Build green (FYI rows)     11
  R-NOOR-007 i18n / RTL logical         11
  R-BE-006   FalconException codes       7   ← false positives (test files)
  R-BE-007   No hardcoded secrets        6   ← false positives (test files)
  R-NOOR-008 Global selector hygiene     2
  R-BE-003   Internal services           2   ← false positives (prose comments)
```

## Per-item math

| Item | Removes | Mechanism | Confidence |
|---|---:|---|---|
| **1 — Glob fix** | **−13** | Closes the `**/Tests/**` matching bug; 7 R-BE-006 + 6 R-BE-007 false positives evaporate | 100% (6/6 smoke tests proved it) |
| **2 — Killshot file** | **−26** | One file, 26 R-NOOR-003 hardcoded typography literals → token scale | 95% (build-gated) |
| **3 — R-NOOR-007 sweep** | **−11** | Mechanical regex replace `ml→ms`, `mr→me`, `pl→ps`, `pr→pe` across admin-console | 95% (build-gated) |
| **4 — PATTERN-04 SCSS** | **−39 to −44** | Component-bound SCSS files removed; styles migrated to Tailwind. Some `::ng-deep` / animations may stay (≤5 documented blockers) | 80% (build-gated, some judgment) |
| **5 — AST wiring LIVE** | **+5 to +15** | Adds new detection signal for R-FE-007 / R-BE-002 / R-BE-004 / R-BE-008 — previously invisible architectural drift becomes visible | 70% (depends on what AST finds) |

## Two scenarios

### Conservative (worst-case assumptions)

```
Baseline:                275
  Item 1 glob fix:      −13   → 262
  Item 2 killshot:      −26   → 236
  Item 3 R-NOOR-007:    −11   → 225
  Item 4 PATTERN-04:    −39   → 186   (5 SCSS files stay as documented blockers)
  Item 5 AST adds:      +15   → 201   (lots of architectural drift surfaces)

Net after morning:      275 → 201  (−74, −27%)
```

### Optimistic (best-case assumptions)

```
Baseline:                275
  Item 1 glob fix:      −13   → 262
  Item 2 killshot:      −26   → 236
  Item 3 R-NOOR-007:    −11   → 225
  Item 4 PATTERN-04:    −44   → 181   (zero blockers, all SCSS migrated)
  Item 5 AST adds:       +5   → 186   (codebase mostly follows arch rules)

Net after morning:      275 → 186  (−89, −32%)
```

### Expected (midpoint)

```
Net after morning:      275 → ~193  (−82, −30%)
```

## Why Item 5 ADDS violations (and why that's good)

The AST runners detect **architectural drift** that the regex + structural engines can't see:

| New rule | What it catches | Likely findings |
|---|---|---|
| R-FE-007 | Library skeleton injecting an app-service | low — most libs follow the pure-presentational pattern |
| R-BE-002 | Application Service calling another Application Service | medium — easy to slip, harder to detect without AST |
| R-BE-004 | Public app-service method NOT returning `ServiceOperationResult<T>` | medium — newer services tend to drift |
| R-BE-008 | Controller missing `[Authorize]` / `[AllowAnonymous]` | low — gateway middleware typically enforces |

Surfacing these is **net positive**: drift was always there, we just couldn't see it. The audit gets *honester*, not noisier.

## What's left after the morning (193-violation projection)

Breakdown of the remaining ~193 violations, ranked by leverage:

| Rule | Remaining | Single biggest lever? |
|---|---:|---|
| R-NOOR-003 typography | **120** | YES — the rest of the 146, not in the killshot file |
| Item 5 new finds (R-BE-002 / R-BE-004 / R-FE-007) | 10–15 | architectural — slow review |
| R-NOOR-005 palette over intent | 24 | mechanical, ~2h |
| R-FE-009 folder structure | 20 | mechanical, ~1h |
| R-FE-012 build-green FYIs | 11 | informational, not blockers |
| R-NOOR-008 global selectors | 2 | 10 min |
| Other misc | 1–6 | one-offs |

## Week trajectory (if you keep going)

```
Start of week:            275
After morning batch:    ~193
After R-NOOR-003 sweep:  ~73   (kills the remaining 120)
After R-NOOR-005:        ~49
After R-FE-009:          ~29
After Item-5 follow-up:  ~14
After last cleanups:     ~10

End of week target:     <20 violations
Total reduction:         275 → 10  (−96%)
```

## Compounding effect (what you DON'T see in the numbers)

Three multipliers that aren't captured by violation count:

1. **Audit accuracy** — the glob fix means **every future rule** that uses `**/Tests/**` exemption now works correctly. The fix compounds across the rulebook.
2. **New detection dimension** — Item 5 unlocks AST detection permanently. Tomorrow's night shift detects architectural drift the night before couldn't.
3. **Pattern reinforcement** — Item 2 (killshot) + Item 4 (PATTERN-04) establish the migration playbook. The next 20 R-NOOR-003 files use the same recipe, 2× faster.

So while the raw violation drops 30% this morning, the **audit's effective power** roughly doubles (more accurate + new signal + proven playbooks).

## The single most leveraged action remaining

After this morning: **the R-NOOR-003 sweep of the other ~120 typography violations.**

- One agent run with the proven file-by-file recipe from Item 2
- Estimated 6 hours of agent time
- Removes 120 of the remaining ~193 violations (−62%)
- Brings the platform total from ~193 → ~73 in one task

That's the biggest single lever in the entire rulebook right now. The killshot file (Item 2) was the rehearsal; this is the show.

## Open question — D-2026-05-16-02

In the Decisions Queue, you have an open call on how to do the remaining R-NOOR-003 work:

- **File-by-file** (slow, visible, low-risk) — ~6h
- **Mega-sweep** (fast, big-bang, RTL-risk) — ~1h
- **Hybrid** (5 worst files manually, then sweep) — ~3h

Recommended: **hybrid** — Item 2 is already one of the worst, so 4 more manual then sweep the long tail.

## Where this lives

- This file: `outputs/reports/night-shift/2026-05-16-overnight-deep-dive/BURNDOWN_COMPUTATION.md`
- Underlying data: [PLATFORM_AUDIT_FINDINGS.md](PLATFORM_AUDIT_FINDINGS.md)
- Original burndown sketch: [PROJECTED_BURNDOWN.md](PROJECTED_BURNDOWN.md) (overnight version, less accurate)
- Decisions Queue: `_obsidian/00-Home/Decisions Queue.md`

## Validation plan

When BOTH background agents complete:

1. **Re-run `night-shift.ps1`** (53 min, all 11 repos, with LIVE AST runners + glob fix)
2. Compare actual vs projected
3. Update this file's "actual" column
4. Close out the Decisions Queue rows that the result settles
