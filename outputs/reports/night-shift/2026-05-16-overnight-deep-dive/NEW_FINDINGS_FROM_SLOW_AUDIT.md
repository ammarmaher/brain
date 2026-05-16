---
type: addendum
generatedAt: 2026-05-16
source: slow audit-orchestrator final pass (39 minutes)
addedToBaseline: 260 violations
---

*** What the slow full-audit caught that the quick scan missed ***

# 📊 New findings from slow audit (final)

> The full `audit-orchestrator.ps1` finally completed after 39 minutes. It added **260 violations** beyond the 2,734 from the quick scan, bringing the total to **2,994 real violations** on `falcon-web-platform-ui`.

## Where the new violations came from

### Structural walker — 66 new violations

The structural walker catches things the regex runner can't. Three rules fired:

| Rule | Severity | Count | What it caught |
|---|---|---|---|
| **R-FE-002** (No SCSS / no component CSS) | must | **44** | Files with `*.scss` extension or non-empty `styles:` arrays in `@Component({})` decorators |
| **R-FE-009** (Folder structure) | should | **20** | Feature folders named `models/`, `services/`, `resolvers/`, `directives/` that contain multiple `.ts` files instead of the canonical single file |
| **R-NOOR-001** (Layout ownership) | must | **1** | Admin Console page missing `<falcon-page-shell>` wrapper |
| R-FE-012 build placeholder | fyi | 1 | Out-of-band FYI (build verification deferred) |

### Regex runner — 194 violations (slightly different scope than quick scan)

The slow audit's regex runner has a stricter scope filter (it doesn't bypass `.angular/` etc. caches as aggressively as `quick-frontend-scan.ps1`). The 194 violations it produced overlap with the 2,734 quick-scan baseline. Treating them as confirmatory rather than additive.

## Combined picture

| Source | Violations |
|---|---|
| Quick scan (`quick-frontend-scan.ps1`) | 2,734 |
| Structural walker (slow audit) | +66 |
| **TOTAL real violations** | **~2,994** |
| After Tier-1 exemption refinements | **~1,028** (-66%) |

## What this changes about morning priorities

### R-FE-002 jumped to high priority

44 new SCSS / inline-styles-array hits. The patterns/PATTERN-04 (SCSS → Tailwind) refactor is now confirmed high-value. Top offenders likely include the host-shell auth flow (`change-password.component.ts`, `forgot-password-flow.component.ts`) that the quick scan also flagged.

**Action:** Promote PATTERN-04 from "Group B template surgery" to "Group A quick wins" in PATTERNS_INDEX.md.

### R-FE-009 (folder structure) is real

20 violations confirm the rule fires meaningfully. Most likely `apps/host-shell/src/app/features/auth/` and similar feature folders with multiple service files instead of one consolidated `services.ts`.

**Action:** Schedule as a Tier-2 mechanical refactor (consolidation, low risk). See per-rule/r-fe-009-fix-plan.md.

### R-NOOR-001 lone hit

1 admin-console page lacks `<falcon-page-shell>` wrapper. Most likely a recently-added page that bypassed the host-shell layout convention. 5-minute fix.

**Action:** Worth checking which page it is — likely the org-hierarchy-page (per project memory).

## Updated TL;DR for morning

The TOP_PRIORITY_FIXES.md plan still holds, with one addition:

**Insert as #2.5 (between Tier-1 exemptions and the Tailwind migrations):**

- Apply PATTERN-04 (component SCSS → Tailwind) — sweeps 44 R-FE-002 violations + an unknown number of R-FE-001 in the same files. Likely 1.5 hours.

## Where the slow audit lives

```
C:\Falcon\Brain Outputs\reports\code-audit\overnight-frontend-deep-dive\
  AUDIT_SUMMARY.md                 — auto-generated summary
  violations.jsonl                 — 2994 rows
  violations-regex.jsonl           — 194 rows (regex sweep)
  violations-structural.jsonl      — 66 rows (structural)
  violations-by-rule.md            — 510 KB (huge — every violation grouped by rule)
  violations-by-file.md            — 321 KB (every violation grouped by file)
  high-severity.md                 — 549 KB (must-only)
  engine-runtimes.md               — 39 min run time
```

These auto-generated reports are HUGE (file-by-file row tables) and not curated for human reading. The curated TOP_PRIORITY_FIXES.md + MORNING_REPORT.md + per-rule/ + per-file/ are still the morning entry points.

## Related

- [MORNING_REPORT.md](MORNING_REPORT.md) — updated with the new 2994 count
- [TOP_PRIORITY_FIXES.md](TOP_PRIORITY_FIXES.md) — needs PATTERN-04 insertion (still valid)
- [PROJECTED_BURNDOWN.md](PROJECTED_BURNDOWN.md) — burndown projection unchanged (Tier-1 exemptions still remove ~62%)
