---
type: hub
purpose: decisions-queue
created: 2026-05-16
status: active
---

*** Falcon Decisions Queue ***
*** What needs your call — sorted by impact, ranked by urgency ***
*** Each row links to evidence + a proposed action ***

# 🎯 Decisions Queue

> The single morning view of everything the Brain wants you to decide. Each row is one outstanding question with explicit options. Click into the linked evidence; check ✅ or ❌; the brain cascades the change.

## 🟢 Open decisions — morning of 2026-05-16

### D-2026-05-16-01 — Should the `tests/**` glob fix change which rules consider test code "in scope"?

**Status:** open
**Linked:** [glob fix commit 20e6186](https://github.com/ammarmaher/brain/commit/20e6186) · [[NIGHT_SHIFT_BOUNDARIES]] · [PLATFORM_AUDIT_FINDINGS](../../../Brain%20Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/PLATFORM_AUDIT_FINDINGS.md)
**Context:** The glob fix means `**/Tests/**` now correctly matches `tests/Foo.cs`. This evaporates 13 test-file false positives BUT — should some rules still apply inside tests?

| Rule | Test-applicable? | Default |
|---|---|---|
| R-BE-005 MultiLanguageName | NO — test entities don't need EN/AR | exempt ✅ |
| R-BE-006 FalconException | NO — tests simulate failures with bare throws | exempt ✅ |
| R-BE-007 No hardcoded secrets | NO — test fixtures own their own conn strings | exempt ✅ |
| R-BE-002 App-service-to-app-service | YES — integration tests still violate the principle | apply 🚫 |
| R-BE-004 ServiceOperationResult<T> | YES — tests asserting on result type need it | apply 🚫 |

**Options:**
- ☐ Accept the default split above (most rules exempt tests, architecture rules still apply)
- ☐ Make EVERY rule exempt `tests/**` (less noise, weaker enforcement)
- ☐ Make NO rule exempt `tests/**` (strongest enforcement, lots of noise)

**Recommended:** Option 1 (current state after Item 1). Document in `EXEMPTIONS.md`.

---

### D-2026-05-16-02 — R-NOOR-003 typography migration: do we go file-by-file or one big sweep?

**Status:** open
**Linked:** [r-noor-003-fix-plan](../../../Brain%20Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/per-rule/r-noor-003-fix-plan.md) · 146 violations
**Context:** 146 R-NOOR-003 typography-scale violations in admin-console. Item 2 will kill 26 in one file. The other 120 are spread across 20+ files. Two strategies:

**Options:**
- ☐ **File-by-file** — open the audit's per-file report, fix the worst offender, build, commit, repeat. Slow but visible. (~6h)
- ☐ **One mega-sweep** — single agent run with regex replacements for all `text-[Npx]` → token equivalents. Risky but fast. (~1h)
- ☐ **Hybrid** — kill 5 biggest offenders manually (already started with Item 2), then mega-sweep the rest.

**Recommended:** Hybrid. Item 2 proves the migration pattern on one file; if its build is green and the page renders correctly, mega-sweep the remaining 120 with confidence.

---

### D-2026-05-16-03 — PATTERN-04 SCSS→Tailwind: how to handle load-bearing CSS (`::ng-deep`, animations, focus rings)?

**Status:** open
**Linked:** [PATTERN-04 playbook](../../../Brain%20Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/patterns/PATTERN-04-scss-file-to-tailwind.md)
**Context:** Some component SCSS contains rules that don't translate to Tailwind utilities (e.g. `::ng-deep` selectors styling PrimeNG children, keyframe animations, focus-visible polyfills). The Ammar agent will document each one as a blocker in `scratch/PATTERN-04-blockers.md`.

**Options:**
- ☐ **Migrate everything possible**, document blockers, ship a partial fix (e.g. 40/44)
- ☐ **All-or-nothing** — every SCSS must go, port load-bearing rules into the canonical theme file
- ☐ **Keep the file, just normalize** — leave SCSS in place but ensure it uses tokens, not hex values

**Recommended:** Option 1. Each blocker becomes a separate Decisions Queue row tomorrow.

---

### D-2026-05-16-04 — Re-run the night-shift audit at noon to confirm burndown?

**Status:** open
**Context:** If you accept Items 1–4 and they land, the platform audit should drop from 275 → ~181. A re-run validates the math. Cost: 53 minutes of background CPU.

**Options:**
- ☐ Yes — re-run at noon
- ☐ No — wait until end-of-week to re-baseline

**Recommended:** Yes. Burndown is only real if measured.

---

### D-2026-05-16-05 — Should the AST runners be invoked on EVERY night-shift run, or only on Saturdays?

**Status:** pending Item 5 completion
**Linked:** [Session 3 detector wiring](../../../Brain%20Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/SESSION_3_PLAN.md)
**Context:** AST runners are slower than regex (tsx must compile each file). On 11 repos with ~900 TS + ~600 CS files, expected runtime is 10-30 min per night.

**Options:**
- ☐ Every night — slower but always-current
- ☐ Mondays + Saturdays only — twice-weekly snapshot
- ☐ Pre-PR only — wire to `git pre-push` instead of night shift

**Recommended:** Every night. Compounds learning. If runtime balloons past 30 min, revisit.

---

## 🟡 Decisions awaiting closure (carry-over from last run)

(none — this is the first Decisions Queue note)

## 🔴 Halted / blocked

(none — all morning agents working)

## ⚪ Closed decisions (history)

(none yet — each closed decision adds a row here with the choice + date)

## How the brain reads this note

Each ☐ checkbox is parsed by `tools/decisions/process-queue.ps1` (Session 4 deliverable). When you check ✅:

1. The brain updates the relevant rule, exemption, or job
2. Cascades through dependent notes (`PATTERNS_INDEX`, `TOP_PRIORITY_FIXES`, `NIGHT_SHIFT_BOUNDARIES`)
3. Logs the decision to `outputs/decisions/D-<id>.md` with the choice + timestamp + cascade summary
4. Removes the row from this queue → moves to "Closed decisions"

Until the processor exists, treat this as a human checklist + log your choice manually below the row.

## Related

- [PLATFORM_AUDIT_FINDINGS](../../../Brain%20Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/PLATFORM_AUDIT_FINDINGS.md)
- [TOP_PRIORITY_FIXES](../../../Brain%20Outputs/reports/night-shift/2026-05-16-overnight-deep-dive/TOP_PRIORITY_FIXES.md)
- [[NIGHT_SHIFT_BOUNDARIES]]
- [[RULES_INDEX]]
- [[AMMAR_BRAIN_HOME]]

## Tags

#type/hub #decisions-queue #morning-of/2026-05-16
