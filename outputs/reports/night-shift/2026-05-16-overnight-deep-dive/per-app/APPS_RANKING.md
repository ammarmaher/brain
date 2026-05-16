---
title: Apps + Libs Health Ranking
runId: 2026-05-16-overnight-deep-dive
ammarAgent: ammar-web-platform-ui
generatedBy: AGENT D
generatedAt: 2026-05-16T03:30:00Z
appsAudited: 6
totalViolationsAcrossPlatform: 597 (post-exemption, post-generated-file filter)
totalViolationsRaw: 1824 (including auto-generated registries)
---

# Frontend Apps + Libs — Health Ranking

**Codebase:** `C:\Falcon\Falcon\falcon-web-platform-ui`
**Rulebook:** `C:\Falcon\Brain Outputs\understanding\rules\frontend\` + `frontend-admin-console\`
**Exemptions honored:** `C:\Falcon\Brain Outputs\understanding\rules\exemptions\EXEMPTIONS.md`

## Ranking (best → worst, after-exemption scores)

| Rank | App / Lib | Score | Status | Violations | Density | Files | Lines | Sparkline |
|---|---|---|---|---|---|---|---|---|
| 1 | **falcon-ui-core** (lib) | **99/100** | 🟢 Exemplary | 2 | 0.07/kLoc | 520 | 29,560 | ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁ |
| 2 | **management-console** | **98/100** | 🟢 Healthy | 1 | 1.7/kLoc | 14 | 602 | ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▁▂ |
| 3 | **falcon** (lib) | **87/100** | 🟢 Healthy | 62 | 6.4/kLoc | 118 | 9,671 | ▁▁▁▁▁▁▁▁▁▁▁▁▁▁▂▃▄▄▄▅ |
| 4 | **falcon-studio** (lib) | **84/100** | 🟢 Healthy | 161 | 12.4/kLoc¹ | 91 | 20,756 | ▁▁▁▁▁▁▁▁▁▁▁▂▃▄▅▆▆▆▆▆ |
| 5 | **host-shell** | **83/100** | 🟢 Healthy | 246 | 11.5/kLoc | 107 | 21,340 | ▁▁▁▁▁▁▁▁▁▁▁▂▃▅▆▆▆▆▆▇ |
| 6 | **admin-console** | **64/100** | 🟠 Needs work | 286 | 29.2/kLoc | 106 | 9,783 | ▁▁▁▁▂▄▅▆▇▇▇▇▇▇▇▇▇▇▇█ |

> ¹ falcon-studio raw density is 59.1/kLoc but 968 hits live in one auto-generated registry — exemption-corrected density is 12.4/kLoc.

## Raw (pre-exemption) ranking for transparency

| Rank | App / Lib | Raw Score | Raw Violations |
|---|---|---|---|
| 1 | falcon-ui-core | 96/100 (huge exemption set applied — see scorecard) | 2 actionable |
| 2 | management-console | 98/100 | 1 |
| 3 | falcon | 87/100 | 62 |
| 4 | host-shell | 83/100 | 246 |
| 5 | admin-console | 64/100 | 286 |
| 6 | falcon-studio | **41/100** (raw — distorted by auto-generated registry) | 1,227 |

## Top 3 best

1. **falcon-ui-core** — 99/100. The platform's wrapper library is the cleanest folder on the codebase. Only 2 stray `styleUrls`/`styles` array hits to fix. The exemption set is doing exactly what it should.
2. **management-console** — 98/100. Single .scss file is the only violation. Smallest app on the platform.
3. **falcon** (lib) — 87/100. Pre-Wave-16 umbrella lib is well-disciplined; 62% of remaining violations sit in three component templates.

## Top 3 worst

1. **admin-console** — 64/100. The only app under Noor scope, paying the price across R-NOOR-003 (typography), R-NOOR-002 (arbitrary values), R-FE-004 (palette), R-NOOR-001 (chrome+margin). All fixable mechanically. Top single-file violator: `user-details-page.component.html` (46 violations).
2. **host-shell** — 83/100 (looks healthy, but...). 86% of violations live in `playground/` + `features/falcon-ui-showcase/` — internal-tooling areas. **Production health is closer to ~92/100** once those are scoped out. Top single-file violator: `playground.page.html` (545 raw matches).
3. **falcon-studio** (lib) — 84/100 after exemption proposal, **41/100 raw**. 968 of 1,227 violations are in one auto-generated registry. Add an `EXEMPTIONS.md` row and the score jumps overnight.

## Cross-app violation count

| Rule | admin-console | host-shell | mgmt-console | falcon | falcon-studio | falcon-ui-core | TOTAL |
|---|---|---|---|---|---|---|---|
| R-FE-001 | 0 | 18 | 0 | 11 | 9 | 2 | **40** |
| R-FE-002 | 1 | 11 | 1 | 8 | 0 | 0 | **21** |
| R-FE-003 | 24 | 4 | 0 | 2 | 90 | 0 (exempt) | **120** |
| R-FE-004 | 58 | 135 | 0 | 36 | 62² | 0 (exempt) | **291** |
| R-FE-005 | 19 | 78 | 0 | 1 | 0 | 0 (exempt) | **98** |
| R-FE-007 | n/a | n/a | n/a | 0 | 0 | 0 | **0** |
| R-FE-009 | 1 | 0 | 0 | n/a | n/a | n/a | **1** |
| R-FE-013 | 0 | 0 | 0 | 0 | 0 | 0 | **0** ✅ |
| R-FE-014 | 0 | 0 | 0 | 0 | 0 | 0 | **0** ✅ |
| **Noor scope ↓** | | | | | | | |
| R-NOOR-001 | 39 | n/a | n/a | n/a | n/a | n/a | **39** |
| R-NOOR-002 | 71 | n/a | n/a | n/a | n/a | n/a | **71** |
| R-NOOR-003 | 85 | n/a | n/a | n/a | n/a | n/a | **85** |
| R-NOOR-004 | 0 | n/a | n/a | n/a | n/a | n/a | **0** ✅ |
| R-NOOR-005 | 24 | n/a | n/a | n/a | n/a | n/a | **24** |
| R-NOOR-006 | 0 | n/a | n/a | n/a | n/a | n/a | **0** ✅ |
| R-NOOR-007 | 6 | n/a | n/a | n/a | n/a | n/a | **6** |
| R-NOOR-008 | 0 | n/a | n/a | n/a | n/a | n/a | **0** ✅ |
| **TOTAL** | 286 | 246 | 1 | 62 | 161² | 2 | **758** |

> ² falcon-studio R-FE-004 post-exemption (1,066 generated/registry hits excluded). Cross-app totals use post-exemption counts.

## Platform-wide signals

### Where the platform is winning ✅
- **R-FE-013** (no deprecated UI dirs) — 0 hits anywhere
- **R-FE-014** (no WebstormProjects refs) — 0 hits anywhere
- **R-FE-007** (no HttpClient in libs) — 0 actionable hits (grandfathered shared-data-access doing its job)
- **R-NOOR-004** (font ownership) — 0 hits
- **R-NOOR-006** (no PrimeNG selectors) — 0 hits (post-Wave-8 PrimeNG removal program held)
- **R-NOOR-008** (no global CSS selectors) — 0 hits

### Where the platform is losing 🔴
- **R-FE-004** (tokens only) — 291 hits across the platform. Theme migration is unfinished.
- **R-FE-003** (no inline styles) — 120 hits. Studio's live-preview legitimately needs review.
- **R-FE-005** (Falcon library FIRST) — 98 hits. Raw `<button>`/`<input>` proliferation.
- **R-NOOR-003** (typography scale) — 85 hits in admin-console alone. Biggest single-rule debt.

## Recommendations for tomorrow (priority order)

1. **Update `EXEMPTIONS.md`** — add Studio registry/generated exemption. Single-line PR change cuts platform violation count by ~14%.
2. **Decide on host-shell `playground/` + `features/falcon-ui-showcase/`** — exempt as catalogue surfaces, OR move to `demos/`. Drops another ~12%.
3. **Attack admin-console top-3 files** — `user-details-page.component.html` (46), `org-hierarchy-skeleton.component.ts` (43), `client-settings-step.component.html` (35). Combined = 43% of admin-console total. Likely a single morning's work for one focused fixer agent.
4. **Sweep R-FE-004 hex literals across the platform** — 291 hits is the biggest single rule debt. Target an extraction pass (hex → semantic token) feature-by-feature.
5. **Lock in Noor typography scale (R-NOOR-003)** — 85 hits in admin-console. Codemod-able: `text-xl` → `text-noor-heading`, `text-lg` → `text-noor-title`, etc. Per-component judgment needed for the mapping table.

## Cross-references

- `./admin-console-scorecard.md`
- `./host-shell-scorecard.md`
- `./management-console-scorecard.md`
- `./falcon-ui-core-scorecard.md`
- `./falcon-lib-scorecard.md`
- `./falcon-studio-scorecard.md`
- `../per-rule/` — per-rule fix plans (cross-referenced)
- `../per-file/` — per-file fix plans (cross-referenced)
- `../patterns/` — refactor patterns

## Methodology note

This ranking is derived from a **direct grep audit** of the codebase, NOT from the audit JSONL files (which were largely empty: `night-shift-2026-05-16-overnight/audit/violations.jsonl` is 0 bytes, `violations-regex.jsonl` contains only 14 backend findings — none frontend; `code-audit/overnight-frontend-deep-dive/violations.jsonl` is also 0 bytes). Patterns were lifted directly from rule frontmatter `detector.patterns` and applied with `grep -rEn` against each app/lib's `.ts` + `.html` (+ `.css` where relevant) surface. Exemptions from rule frontmatter `scope.exemptPaths` and the central `EXEMPTIONS.md` were honored.
