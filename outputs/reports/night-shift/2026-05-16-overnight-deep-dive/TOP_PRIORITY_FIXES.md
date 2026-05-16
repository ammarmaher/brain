---
type: priority-action-plan
generatedAt: 2026-05-16
audience: ammar-web-platform-ui (tomorrow morning)
basedOn: quick-frontend-scan 2734 violations / 1192 files
intentBurndown: 2734 → ~1014 → ~600 → ~200
---

*** Top 10 morning fixes — ranked by leverage ÷ effort ***
*** Read this FIRST. Then drill into per-rule/ or per-file/ ***

# 🌅 Top 10 Morning Fixes — Ranked by Leverage

> Open this when you wake up. Each fix is **ranked by `(violations eliminated) ÷ (effort)`** — highest-leverage first. Items 1–3 alone wipe out ~60% of the audit noise.

## Tier 1 — Configuration refinements (no code touched, 10 min total)

### #1 — R-FE-004 exempt-paths cleanup
**Eliminates:** ~1,500 false positives (~55% of total)
**Effort:** 5 min
**Action:** edit `C:\Falcon\Brain Outputs\understanding\rules\frontend\R-FE-004-tokens-only.md` → add to `scope.exemptPaths`:

```yaml
exemptPaths:
  - "libs/falcon-theme/**"
  - "libs/falcon-studio/**"
  - "apps/host-shell/src/app/features/falcon-ui-showcase/**"
  - "**/*tokens.css"
  - "**/*.tokens.ts"
  - "**/component-tokens.generated.*"
  - "**/abstraction-map.registry.*"
  - "**/color-palette.config.*"
```
**Verify:** `quick-frontend-scan.ps1` → R-FE-004 count should drop from 2271 to ~140.
**Why:** These are token registries and theme SoT — hex literals are intentional data, not violations.

### #2 — R-FE-004 detector pattern tightening
**Eliminates:** ~150 false positives (the remaining tail)
**Effort:** 5 min
**Action:** edit the rule's `detector.patterns` to ONLY match hex/px inside:
- `style="…"` attribute values
- `[ngStyle]="…"` / `[style.X]="…"` bindings
- raw CSS property values (`color: #fff`, `border: 1px solid #ccc`, etc.)

Not in: TypeScript object-literal token catalogs.

**Verify:** R-FE-004 final count should be ~140 (real signal — actual inline hardcoded values).

## Tier 2 — High-leverage refactors (Falcon library migration)

### #3 — Raw `<input>` → `<falcon-input>` migration
**Eliminates:** ~80 violations across ~25 files (R-FE-005)
**Effort:** ~3 hours
**Action:** Dispatch to `ammar-web-platform-ui`:
```
agent: ammar-web-platform-ui
plan: PATTERN-01 (when Agent C finishes)
files: top 25 offenders from per-file/
```
**Worst offender:** `apps/admin-console/.../org-hierarchy-page/components/tab-components/applications-tab/*`
**Verify:** Build green + visual smoke test on each migrated page.

### #4 — Skeleton component inline-style elimination
**Eliminates:** ~80 violations (R-FE-003)
**Effort:** ~2 hours
**Action:** The skeleton components in `apps/admin-console/.../org-hierarchy-page/components/skeleton/` use `style="…"` for placeholder dimensions. Replace with Tailwind utility classes (`w-32 h-4 bg-slate-200 animate-pulse`).
**File to start with:** `org-hierarchy-skeleton.component.ts` (49 violations in one file)

### #5 — Intent → palette color migration (admin-console)
**Eliminates:** 24 violations (R-NOOR-005)
**Effort:** ~1.5 hours
**Action:** Replace `bg-primary` / `text-success` / `text-warning` / `bg-danger` with Tailwind palette names in admin-console scope only.
**Top offender:** `apps/admin-console/src/tailwind.css` (the theme entry file itself has intent tokens — needs theme refactor too)

## Tier 3 — i18n + structural

### #6 — Physical → logical spacing (RTL)
**Eliminates:** 20 violations (R-NOOR-007)
**Effort:** ~1 hour
**Action:** Replace `ml-*` / `mr-*` / `pl-*` / `pr-*` with `ms-*` / `me-*` / `ps-*` / `pe-*` in admin-console.
**Why:** RTL support for Arabic UI. Without this, every margin is visually broken in `dir="rtl"`.

### #7 — Global selector hygiene (2 hits)
**Eliminates:** 2 violations (R-NOOR-008)
**Effort:** 15 min
**Action:** Find the two naked `body { … }` / `:root { … }` overrides in `apps/admin-console/.../wizard-components/add-client-wizard/*` and move them into `libs/falcon/src/theme/falcon.theme.css` `@theme` block.

## Tier 4 — Larger refactors (multi-session)

### #8 — Typography scale standardization
**Eliminates:** ~120 violations after exemptions (R-NOOR-003)
**Effort:** ~4 hours
**Action:** Adopt the V0.2 named scale. Replace raw `text-xl` / `text-2xl` in admin-console pages with `text-noor-display` / `text-noor-h1` / `text-noor-body` (define if missing).
**Blocker:** Confirm canonical token names with design. The skill file with the exact scale is missing on disk — recover it first.

### #9 — host-shell SCSS sweep
**Eliminates:** ~38 violations (R-FE-001 / R-FE-002)
**Effort:** ~3 hours
**Action:** Files like `change-password.component.ts` still have SCSS imports / `styles:` arrays. Migrate each to Tailwind utilities.
**Files:** R-FE-001 violations cluster in `apps/host-shell/src/app/features/auth/*`

### #10 — Library skeleton + app wrapper pattern audit
**Eliminates:** Unknown — requires AST runner (R-FE-007)
**Effort:** Session 3.1 prerequisite
**Action:** Wire `ast-runner-fe.ts` (currently scaffolded) so it actually executes. Will surface any service injection inside `libs/falcon-ui-core/`.

## Projected violation burndown

| After step | Total violations | % reduction |
|---|---|---|
| Baseline (right now) | 2,734 | 0% |
| After #1 + #2 (exempt paths) | ~1,014 | -63% |
| After #3 + #4 (raw input + skeleton) | ~854 | -69% |
| After #5 + #6 + #7 (admin-console i18n + palette) | ~808 | -70% |
| After #8 + #9 (typography + SCSS sweep) | ~650 | -76% |
| After #10 (AST runner) | + N AST-only findings | depends |

Aim for **< 200 real violations** after one focused week of cleanup.

## How to execute

For each item above (1–10):

1. Open the corresponding per-rule plan in `per-rule/r-<id>-fix-plan.md`
2. Open the corresponding per-file plans in `per-file/` if it's a file-by-file refactor
3. Cross-check with `patterns/PATTERN-NN-*.md` to see if a migration template fits
4. Dispatch to the right Ammar agent (always `ammar-web-platform-ui` for these)
5. After each batch, re-run `quick-frontend-scan.ps1` to measure drift

## Verification command

After each fix batch:

```powershell
powershell -ExecutionPolicy Bypass -File "C:\Falcon\Brain Outputs\understanding\rules\detectors\quick-frontend-scan.ps1"
```

Diff the violation count against the projected burndown above. If it doesn't move, the fix didn't land.

## Related night-shift artifacts

- [BACKUP_AGGREGATES.md](BACKUP_AGGREGATES.md) — raw counts
- [COMPONENT_VIOLATION_HEATMAP.md](COMPONENT_VIOLATION_HEATMAP.md) — which Falcon components are nearby violations
- [SESSION_3_REFINEMENT_PLAN.md](SESSION_3_REFINEMENT_PLAN.md) — rulebook + detector fixes
- [MORNING_REPORT.md](MORNING_REPORT.md) — the synthesis (written after agents finish)
- per-rule/, per-file/, patterns/, per-app/ — agent-produced detail
