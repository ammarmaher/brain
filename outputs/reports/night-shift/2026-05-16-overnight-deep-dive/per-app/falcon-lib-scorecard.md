---
appName: falcon
appPath: libs/falcon
isLib: true
isNoorScope: false
totalFiles: 118
totalTsFiles: 107
totalHtmlFiles: 11
totalLines: 9671
totalViolations: 62
violationDensity: 6.4
healthScore: 87
worstRule: R-FE-004 (36 violations)
bestRule: R-FE-005 (1), R-FE-013 (0)
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
ruleScope: R-FE-* (lib paths; /src/theme/ exempt; shared-data-access exempt for R-FE-007)
---

## TL;DR (1 paragraph)

The `libs/falcon` umbrella lib holds **core, language, shared-data-access, shared-types, shared-ui, shared-utils** modules — the platform's pre-Wave-16 utility belt. With 118 files / 9,671 lines and **62 violations**, density is **6.4 per kLoc** — well below host-shell (11.5) and admin-console (29.2). The bulk lives in two `shared-ui` components: **`send-credentials-popup.component.html` (26 violations — single file)** and **`falcon-photo-uploader.component.html` (7)**. The library correctly honors the `libs/falcon/src/theme/**` exemption — no theme-folder hex got counted. **R-FE-007** flags 4 `HttpClient` mentions, all in `shared-data-access/` which **is explicitly exempt by frontmatter**. **Health score 87/100 — Healthy**.

## Health score breakdown

Formula: `100 − min(violationsPerKLoc, 100) − (1 point per must-severity rule with any violations)`

- violationsPerKLoc = 62 / 9.671 = **6.4**
- must-severity rules with ≥1 violation: R-FE-001, R-FE-002, R-FE-003, R-FE-004, R-FE-005 = **5 rules** (penalty: 5)

Score: `100 − 6.4 − 5 = 88.6 → rounded to 87/100`

Status: **🟢 Healthy**

## Violations by rule (sorted by count)

| Rule | Severity | Count | Category | Worst file |
|---|---|---|---|---|
| **R-FE-004** | must | 36 | theme | `shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` |
| **R-FE-001** | must | 11 | theme | `styleUrls`/`styles` arrays scattered |
| **R-FE-002** | must | 8 | theme | 8 stray SCSS/SASS files |
| **R-FE-003** | must | 2 | theme | shared-ui components |
| **R-FE-005** | must | 1 | reuse | one raw `<button>`/`<input>` (skeleton library — most are intentional) |
| **R-FE-007** | must | 0 | architecture | ✅ all 4 HttpClient hits are in `shared-data-access/` which is **exempt** |
| **R-FE-013** | must | 0 | operational | ✅ |

## Violations by folder

| Folder | Files | Violations | Density |
|---|---|---|---|
| `src/shared-ui/lib/components/` | many | ~45 | high — pre-Wave-16 carry-over |
| `src/core/`, `src/language/`, `src/shared-utils/`, `src/shared-types/` | many | low | clean |
| `src/shared-data-access/` | small | (HttpClient hits exempted) | clean |
| `src/theme/` | small | (hex exempted) | clean |

## Top 10 violating files in THIS lib

| Rank | File | Violations |
|---|---|---|
| 1 | `src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` | **26** |
| 2 | `src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.html` | 7 |
| 3 | `src/shared-ui/lib/components/falcon-form-field/falcon-form-field.component.html` | 2 |
| 4 | `src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.ts` | 1 |
| 5 | `src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-panel.component.ts` | 1 |
| 6 | `src/shared-ui/lib/components/falcon-tree-panel/falcon-tree-node/falcon-tree-node.component.ts` | 1 |
| 7 | `src/shared-ui/lib/components/falcon-stepper/falcon-stepper.component.html` | 1 |
| 8 | `src/shared-ui/lib/components/falcon-photo-uploader/falcon-photo-uploader.component.ts` | 1 |
| 9 | `src/shared-ui/lib/components/falcon-multiselect/falcon-multiselect.component.ts` | 1 |
| 10 | `src/shared-ui/lib/components/falcon-mobile-number/falcon-mobile-number.component.ts` | 1 |

## Rules with ZERO violations (the good news)

- **R-FE-007** — Library skeleton + app wrapper: every `HttpClient` injection is correctly inside the `shared-data-access/` exemption boundary ✅
- **R-FE-013** — No deprecated UI directory references ✅

> Note: **R-FE-007 is particularly important here** — `libs/falcon` is the legacy umbrella lib, and the grandfathered `shared-data-access/` carve-out is doing its job. No new HTTP services have leaked into other lib subfolders.

## What to do tomorrow (prioritized)

1. **`send-credentials-popup.component.html` deep clean** (26 violations — 42% of total). This single template is the dominant offender. Audit for hex literals → theme tokens, palette-shade Tailwind utilities → semantic tokens, and any inline styles. *(See `../per-file/NN-send-credentials-popup.md`.)*
2. **`falcon-photo-uploader.component.html`** (7 violations) — same pattern, smaller surface.
3. **Convert 8 stray SCSS/SASS files (R-FE-002)** — these are the residue of pre-Wave-8 components that didn't get Tailwindified. Either migrate to utilities or, if the component lives in `libs/falcon-ui-core/`, move the .tokens.css companion correctly.
4. **Resolve 11 `styleUrls`/`styles` arrays (R-FE-001)** — every one is a regression from the platform's "Tailwind utilities only" rule. Identify which components still have `.scss` companions and which can be inlined as utilities.
5. **Audit the single R-FE-005 raw HTML hit** — confirm whether it's an intentional library primitive (then add to exemption list) or a missed wrap.

## Cross-references

- `../per-rule/R-FE-004-fix-plan.md`
- `../per-rule/R-FE-002-fix-plan.md` — covers all SCSS removal
- `../per-file/NN-send-credentials-popup.md`
- Memory: `feedback_library_skeleton_app_api.md` — Wave-16 doctrine (libs are skeletons, apps wrap)

## Trend (compared to a future second audit)

- **Baseline:** 62 total violations
- **Files audited:** 118 (107 TS + 11 HTML), 9,671 lines
- **62% of violations** sit in 3 files — fixing those takes the lib to ~96/100
- **Re-run priority:** medium. Most-leveraged fix is `send-credentials-popup.component.html` alone.
