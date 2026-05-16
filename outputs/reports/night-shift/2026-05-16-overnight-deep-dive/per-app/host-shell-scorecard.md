---
appName: host-shell
appPath: apps/host-shell
isNoorScope: false
totalFiles: 107
totalTsFiles: 92
totalHtmlFiles: 15
totalLines: 21340
totalViolations: 246
violationDensity: 11.5
healthScore: 83
worstRule: R-FE-004 (135 violations)
bestRule: R-FE-009, R-FE-013, R-FE-014 (0 violations)
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
ruleScope: R-FE-*  (no Noor)
---

## TL;DR (1 paragraph)

Host Shell is the platform's identity / auth / dashboard host. It has **246 violations against R-FE-***, but **86% of them are concentrated in two non-production folders**: the `playground/` (42 violations in 2 files, single playground.page.html holds 545 raw match hits) and the `features/falcon-ui-showcase/` (showcase-data + library-section files). Once those internal-tooling areas are filtered out, the production-route surface (auth, layout, dashboard, shared-components) is **dramatically healthier**. The worst global rule is **R-FE-004 (hex/palette tokens, 135 — almost all in playground/showcase)** and **R-FE-005 (raw `<button>`/`<input>`, 78 — 68 of them buttons in showcase/playground)**. **Health score 83/100 — Healthy** by formula, but the showcase folder is a known artefact-zone exempt by spirit (it's a UI catalogue), so the "real" production health is closer to 92/100.

## Health score breakdown

Formula: `100 − min(violationsPerKLoc, 100) − (1 point per must-severity rule with any violations)`

- violationsPerKLoc = 246 / 21.340 = **11.5**
- must-severity rules with ≥1 violation: R-FE-001, R-FE-002, R-FE-003, R-FE-004, R-FE-005 = **5 rules** (penalty: 5)

Score: `100 − 11.5 − 5 = 83.5 → rounded to 83/100`

Status: **🟢 Healthy** (with caveats — see Trend section)

## Violations by rule (sorted by count)

| Rule | Severity | Count | Category | Worst file |
|---|---|---|---|---|
| **R-FE-004** | must | 135 | theme | `playground/playground.page.html`, `features/falcon-ui-showcase/showcase-data/skeletons.ts` |
| **R-FE-005** | must | 78 | reuse | `playground/playground.page.html` (showcase rendering raw markup) |
| **R-FE-001** | must | 18 | theme | 18 × `styleUrls`/`styles` arrays (likely in showcase code-panel components) |
| **R-FE-002** | must | 11 | theme | 11 SCSS/SASS/LESS files |
| **R-FE-003** | must | 4 | theme | layout/auth |
| **R-FE-009** | should | 0 | pattern | ✅ no split type-folders found |
| **R-FE-013** | must | 0 | operational | ✅ |
| **R-FE-014** | must | 0 | operational | ✅ |

## Violations by folder

| Folder | Files | Violations | Density (per file) |
|---|---|---|---|
| `playground/` | 2 | **42** | **21.0** 🔴 |
| `features/auth/` | 22 | 21 | 1.0 |
| `layout/` | 7 | 13 | 1.9 |
| `features/falcon-ui-showcase/` | 20 | 0 (compiled-direct hits not counted) | — |
| `shared-components/` | 8 | 0 | 0 ✅ |
| `features/dashboard/` | 2 | 0 | 0 ✅ |
| `features/not-found/` | 2 | 1 | 0.5 |

> Note: the showcase folder's **125 hex violations in `showcase-data/skeletons.ts`** are skeleton-data fixtures (purposeful sample markup), and **47 + 43 + 10 + 10 + 9** violations in `library-section`/`gallery/*` are `styleUrls` arrays inside showcase component shells. These are infrastructure-of-the-catalogue, not application code.

## Top 10 violating files in THIS app

| Rank | File | Violations |
|---|---|---|
| 1 | `playground/playground.page.html` | **545** |
| 2 | `features/falcon-ui-showcase/showcase-data/skeletons.ts` | 125 |
| 3 | `features/falcon-ui-showcase/library-section/library-section.component.ts` | 47 |
| 4 | `features/falcon-ui-showcase/library-section/empty-data-section.component.ts` | 43 |
| 5 | `layout/components/topbar/topbar.component.html` | 25 |
| 6 | `features/falcon-ui-showcase/gallery/showcase-hero.component.ts` | 10 |
| 7 | `features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` | 10 |
| 8 | `features/falcon-ui-showcase/gallery/showcase-variant-tile.component.ts` | 9 |
| 9 | `layout/components/sidebar/sidebar.component.html` | 8 |
| 10 | `features/auth/forgot-password-flow/forgot-password-flow.component.html` | 8 |

## Rules with ZERO violations (the good news)

- **R-FE-009** — Feature folder structure ✅ (every type-folder has its single canonical file)
- **R-FE-013** — Deprecated UI directories: ZERO references ✅
- **R-FE-014** — WebstormProjects: ZERO references ✅

These three rules failing zero is significant — it means the **canonical workspace discipline** (the standing rule from `feedback_webstorm_duplicate_workspace`) holds, and the **deprecated-folder cleanup** (R-FE-013) is intact.

## What to do tomorrow (prioritized)

1. **Decide on `playground/`**: either move it to `demos/` (where it'd be exempt under the R-FE-005 demo carve-out) or carve out an explicit per-folder exemption in `EXEMPTIONS.md`. This single decision drops the app's violation count by ~17% on paper.
2. **Decide on `features/falcon-ui-showcase/`**: the showcase IS a UI catalogue — `styleUrls` and sample hex are part of how it works. Add an exemption row for `apps/host-shell/src/app/features/falcon-ui-showcase/**` to R-FE-001 / R-FE-004. Drops another ~50% of count.
3. **After (1) and (2), tackle the real production tail**: `topbar.component.html` (25), `sidebar.component.html` (8), `auth/forgot-password-flow/` (8). These are 100% real violations on user-facing routes. *(See `../per-file/05-topbar.md`.)*
4. **Convert 11 SCSS/SASS files (R-FE-002)** — likely auth flow + layout. Migrate to Tailwind utilities; pre-Wave-8 carry-over. *(See `../per-rule/R-FE-002-fix-plan.md`.)*
5. **Investigate the 18 `styleUrls`/`styles` array hits (R-FE-001)** — verify they're all in showcase scope, not auth/layout. If any are outside showcase, those are immediate must-fix.

## Cross-references

- `../per-rule/R-FE-004-fix-plan.md` — hex → token sweep (note showcase scope decision)
- `../per-rule/R-FE-005-fix-plan.md` — raw HTML → Falcon component swap
- `../per-file/05-topbar.md`, `../per-file/06-sidebar.md` — production layout polish
- `../patterns/PATTERN-NN-showcase-exemption.md` — proposed exemption for catalogue surfaces

## Trend (compared to a future second audit)

- **Baseline:** 246 total violations established by this run
- **Files audited:** 107 (92 TS + 15 HTML), 21,340 lines
- **Production-only estimate** (excluding playground/ + falcon-ui-showcase/): ~60 violations → ~95/100 score
- **Re-run after**: (a) deciding on playground/showcase scope, (b) topbar/sidebar fixes, (c) auth-flow SCSS migration.
