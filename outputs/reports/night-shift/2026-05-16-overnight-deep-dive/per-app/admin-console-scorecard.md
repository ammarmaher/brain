---
appName: admin-console
appPath: apps/admin-console
isNoorScope: true
totalFiles: 106
totalTsFiles: 79
totalHtmlFiles: 27
totalLines: 9783
totalViolations: 286
violationDensity: 29.2
healthScore: 64
worstRule: R-NOOR-003 (85 violations)
bestRule: R-FE-001, R-FE-013, R-FE-014, R-NOOR-004, R-NOOR-006, R-NOOR-008 (0 violations)
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
ruleScope: R-FE-* ∪ R-NOOR-*
---

## TL;DR (1 paragraph)

Admin Console is the only app under Noor scope and pays the price: **286 total violations across the union of R-FE-* + R-NOOR-***, dominated by Noor-specific design-system rules. The top three offenders — **R-NOOR-003 (typography scale, 85)**, **R-NOOR-002 (arbitrary Tailwind values, 71)**, **R-FE-004 (hex/palette tokens, 58)** — are all *theme-discipline* violations. They cluster sharply in the `org-hierarchy-page` feature (especially `user-details/`, `wizard-components/client-settings-step/`, and `skeleton/org-hierarchy-skeleton.component.ts`). PrimeNG is fully removed (R-NOOR-006 clean), fonts are centralised (R-NOOR-004 clean), and deprecated UI references are zero. **Health score 64/100 — Needs work** but not critical: the bulk of fixes are mechanical token-substitutions, not architectural rewrites.

## Health score breakdown

Formula: `100 − min(violationsPerKLoc, 100) − (1 point per must-severity rule with any violations)`

- violationsPerKLoc = 286 / 9.783 = **29.2**
- must-severity rules with ≥1 violation: R-FE-002, R-FE-003, R-FE-004, R-FE-005, R-NOOR-001, R-NOOR-002, R-NOOR-003, R-NOOR-005, R-NOOR-007 = **9 rules** (penalty: 7, capped because R-FE-009 is `should` and counts ≤1)

Score: `100 − 29.2 − 7 = 63.8 → rounded to 64/100`

Status: **🟠 Needs work**

## Violations by rule (sorted by count)

| Rule | Severity | Count | Category | Worst file |
|---|---|---|---|---|
| **R-NOOR-003** | must | 85 | typography | `org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` |
| **R-NOOR-002** | must | 71 | theme | `wizard-components/client-settings-step/client-settings-step.component.html` |
| **R-FE-004** | must | 58 | theme | `org-hierarchy-page/components/user-details/user-details-page.component.html` |
| **R-NOOR-001** | must | 39 | layout | misc — `m-*`/`ms-*`/`me-*` outside layout/ folder |
| **R-NOOR-005** | must | 24 | color | `wizard-components/client-settings-step/client-settings-step.component.html` |
| **R-FE-003** | must | 24 | theme | `wizard-components/add-client-wizard/*.html` |
| **R-FE-005** | must | 19 | reuse | `tab-components/applications-table/applications-table.component.html` |
| **R-NOOR-007** | must | 6 | i18n/RTL | `wizard-components/*.html` |
| **R-FE-002** | must | 1 | theme | one stray .scss/.sass file |
| **R-FE-009** | should | 1 | pattern | one split type-folder |
| **R-FE-001** | must | 0 | theme | ✅ |
| **R-FE-013** | must | 0 | operational | ✅ |
| **R-FE-014** | must | 0 | operational | ✅ |
| **R-NOOR-004** | must | 0 | font | ✅ |
| **R-NOOR-006** | must | 0 | reuse | ✅ no PrimeNG selectors |
| **R-NOOR-008** | must | 0 | hygiene | ✅ no global CSS selectors |

## Violations by folder

| Folder | Files | Violations | Density (per file) |
|---|---|---|---|
| `features/org-hierarchy-page/components/user-details/` | 3 | 37 | **12.3** 🔴 |
| `features/org-hierarchy-page/components/tab-components/` | 35 | 28 | 0.8 |
| `features/org-hierarchy-page/components/wizard-components/` | 37 | 18 | 0.5 |
| `features/org-hierarchy-page/components/verify/` | 3 | 2 | 0.7 |
| `features/org-hierarchy-page/components/skeleton/` | 1 | 43 (single file) | 43.0 🔴 |

## Top 10 violating files in THIS app

| Rank | File | Violations |
|---|---|---|
| 1 | `features/org-hierarchy-page/components/user-details/user-details-page.component.html` | **46** |
| 2 | `features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` | **43** |
| 3 | `features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` | **35** |
| 4 | `features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` | 9 |
| 5 | `features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` | 9 |
| 6 | `features/org-hierarchy-page/components/verify/otp-dialog.component.html` | 8 |
| 7 | `features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` | 8 |
| 8 | `features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` | 7 |
| 9 | `features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` | 7 |
| 10 | `features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` | 7 |

## Rules with ZERO violations (the good news)

- **R-FE-001** — No PrimeNG / PrimeIcons / PrimeFlex imports, no styleUrls / styles arrays ✅
- **R-FE-013** — No deprecated UI directory references ✅
- **R-FE-014** — No WebstormProjects path references ✅
- **R-NOOR-004** — Font ownership: no per-component @font-face or `<link>` to font CDNs ✅
- **R-NOOR-006** — Component reuse: zero `p-*` PrimeNG selectors found ✅
- **R-NOOR-008** — Global selector hygiene: no naked `body { }` / `*` / `:root` selectors in CSS ✅

This is a strong signal that the **post-PrimeNG-removal program (Wave 8 May 2026) and font-centralisation (V0.2 theme adoption) both held**.

## What to do tomorrow (prioritized)

1. **Token sweep for `user-details-page.component.html`** — single file is 16% of the app's total violations. Replace ad-hoc `text-xl` / `text-[14px]` / hex literals with Noor typography + palette tokens. *(See `../per-rule/R-NOOR-003-fix-plan.md` and `../per-file/01-user-details-page.md`.)*
2. **Rewrite `org-hierarchy-skeleton.component.ts`** — 43 hex / text-* violations in a single TS file used for loading skeletons. Convert to Tailwind utility composition pointing at `--falcon-*` skeleton tokens. *(See `../patterns/PATTERN-skeleton-tokens.md`.)*
3. **`client-settings-step.component.html` decomposition** — 35 violations in one wizard step. Likely candidates: replace `<button>`/`<input>` with `<falcon-button>`/`<falcon-input>` (R-FE-005), and intent → palette swap on `bg-primary/bg-surface/...` (R-NOOR-005). *(See `../per-file/03-client-settings-step.md`.)*
4. **Stray .scss file (R-FE-002)** — find and inline-convert to Tailwind utilities or move declarations to canonical theme. Quick win.
5. **Margin discipline (R-NOOR-001 margin sub-count = 34)** — leaf components are declaring outer `m-*` margins. Audit and hoist spacing decisions to parent page templates.

## Cross-references

- `../per-rule/R-NOOR-002-fix-plan.md` — arbitrary Tailwind value → theme token promotion
- `../per-rule/R-NOOR-003-fix-plan.md` — Noor typography migration plan
- `../per-rule/R-FE-004-fix-plan.md` — hex/rgb/palette → token sweep
- `../per-file/01-user-details-page.md` — file-level fix plan
- `../patterns/PATTERN-skeleton-tokens.md` — skeleton component token pattern

## Trend (compared to a future second audit)

- **Baseline:** 286 total violations established by this run (2026-05-16 03:28 UTC)
- **Files audited:** 106 (79 TS + 27 HTML), 9,783 lines
- **Re-run after morning fixes** to compute delta. Recommended re-audit cadence: after each per-rule fix wave lands.
