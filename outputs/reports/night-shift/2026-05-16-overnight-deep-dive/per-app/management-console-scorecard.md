---
appName: management-console
appPath: apps/management-console
isNoorScope: false
totalFiles: 14
totalTsFiles: 13
totalHtmlFiles: 1
totalLines: 602
totalViolations: 1
violationDensity: 1.7
healthScore: 98
worstRule: R-FE-002 (1 violation)
bestRule: R-FE-001, R-FE-003, R-FE-004, R-FE-005, R-FE-009, R-FE-013, R-FE-014 (0 violations)
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
ruleScope: R-FE-*  (no Noor)
---

## TL;DR (1 paragraph)

Management Console is the **healthiest frontend app on the platform** — 14 source files, 602 lines of code, and **exactly 1 violation** (a single stray .scss/.sass/.less file). Every other R-FE-* rule is clean. This is partly because the app is **deliberately thin**: it's a remote-entry shell that delegates almost all UI to host-shell / shared components / federated remotes. It does not (yet) own any user-facing feature surfaces — the `features/` folder exists but is sparse. **Health score 98/100 — Healthy**.

## Health score breakdown

Formula: `100 − min(violationsPerKLoc, 100) − (1 point per must-severity rule with any violations)`

- violationsPerKLoc = 1 / 0.602 = **1.7**
- must-severity rules with ≥1 violation: R-FE-002 = **1 rule** (penalty: 1)

Score: `100 − 1.7 − 1 = 97.3 → rounded to 98/100`

Status: **🟢 Healthy**

## Violations by rule (sorted by count)

| Rule | Severity | Count | Category | Worst file |
|---|---|---|---|---|
| **R-FE-002** | must | 1 | theme | one stray `.scss`/`.sass`/`.less` file |
| **R-FE-001** | must | 0 | theme | ✅ |
| **R-FE-003** | must | 0 | theme | ✅ |
| **R-FE-004** | must | 0 | theme | ✅ |
| **R-FE-005** | must | 0 | reuse | ✅ |
| **R-FE-009** | should | 0 | pattern | ✅ |
| **R-FE-013** | must | 0 | operational | ✅ |
| **R-FE-014** | must | 0 | operational | ✅ |

## Violations by folder

| Folder | Files | Violations | Density |
|---|---|---|---|
| `src/app/features/` | (sparse) | 0 | 0 |
| `src/app/remote-entry/` | small | 0 | 0 |
| (anywhere) — stray styling file | 1 | 1 | — |

## Top 10 violating files in THIS app

| Rank | File | Violations |
|---|---|---|
| 1 | one stray `.scss` / `.sass` / `.less` file (R-FE-002) | 1 |
| 2–10 | — | 0 |

> Note: with 14 source files and 1 violation, there is no meaningful "top 10". The entire violation surface fits in a single bullet.

## Rules with ZERO violations (the good news)

Effectively every rule:

- **R-FE-001** — no PrimeNG / PrimeIcons / PrimeFlex / styleUrls / styles arrays ✅
- **R-FE-003** — no inline styles ✅
- **R-FE-004** — no hex / rgb / palette literals ✅
- **R-FE-005** — no raw `<button>` / `<input>` / `<select>` / `<textarea>` / `<table>` / `<dialog>` ✅
- **R-FE-009** — feature folder structure intact ✅
- **R-FE-013** — no deprecated UI directory references ✅
- **R-FE-014** — no WebstormProjects path references ✅

## What to do tomorrow (prioritized)

1. **Find and delete (or convert) the one stray styling file** to take the score to 100/100. `find apps/management-console -type f \( -name '*.scss' -o -name '*.sass' -o -name '*.less' \)` will locate it. If it's a Tailwind v4 `@theme`-style file, it should move to `libs/falcon/src/theme/`; otherwise, the rules its declarations express belong in `tailwind.css` or the component's template via utilities.
2. **Strategic question for the morning brief**: management-console is still small (14 files, 602 lines). Decide whether owned features are being added soon — if so, lock in the canonical folder structure (R-FE-009) before scale arrives. If it remains a thin remote-entry shell, document that as an architectural decision.
3. **No tactical rule debt remains** — every other rule is clean. The platform discipline shows.

## Cross-references

- `../per-rule/R-FE-002-fix-plan.md` — SCSS/SASS/LESS removal
- `../patterns/PATTERN-NN-remote-entry-shell.md` — thin-shell architecture pattern

## Trend (compared to a future second audit)

- **Baseline:** 1 violation. The lowest in the platform.
- **Files audited:** 14 (13 TS + 1 HTML), 602 lines
- **Re-run priority:** lowest. Re-audit only after the app gains owned features, OR after the .scss file is removed (to confirm 100/100).
