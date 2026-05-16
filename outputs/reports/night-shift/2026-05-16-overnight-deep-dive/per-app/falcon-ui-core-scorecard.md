---
appName: falcon-ui-core
appPath: libs/falcon-ui-core
isLib: true
isNoorScope: false
totalFiles: 520
totalTsFiles: 468
totalHtmlFiles: 52
totalLines: 29560
totalViolations: 2
violationDensity: 0.07
healthScore: 99
worstRule: R-FE-001 (2 violations)
bestRule: every rule with a path-level exemption (R-FE-002, R-FE-003, R-FE-004, R-FE-005, R-FE-007, R-FE-013)
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
ruleScope: R-FE-* with EXTENSIVE EXEMPTIONS (the library IS the wrapper layer)
exemptions:
  - R-FE-002: libs/falcon-ui-core/**/*.tokens.css (Stencil companion SSOT — `EXEMPTIONS.md`)
  - R-FE-003: libs/falcon-ui-core/** (lib exempt by rule frontmatter)
  - R-FE-004: libs/falcon-ui-core/** (lib exempt by rule frontmatter)
  - R-FE-005: libs/falcon-ui-core/** (library IS the wrapper — `EXEMPTIONS.md`)
  - R-FE-007: libs/falcon-ui-core skeleton-only — no HttpClient → already clean
---

## TL;DR (1 paragraph)

Falcon UI Core is the **canonical wrapper library** — it deliberately contains raw HTML primitives (`<button>`, `<input>`, `<select>`, etc.), hex literals (component tokens are SSOT), `.tokens.css` companion files (Stencil convention), and the inline-style infrastructure other rules forbid. The rulebook acknowledges this with **explicit path-level exemptions in `EXEMPTIONS.md`** and in every rule's `scope.exemptPaths`. After honoring those, the lib has **2 actionable violations** (both R-FE-001 hits — likely Angular wrappers with a stray `styleUrls` array). With 520 files / 29,560 lines this is **the cleanest folder in the platform by density**. **Health score 99/100.**

## Health score breakdown

Formula: `100 − min(violationsPerKLoc, 100) − (1 point per must-severity rule with any violations)`

After applying exemptions (per `EXEMPTIONS.md` and each rule's `scope.exemptPaths`):
- violationsPerKLoc = 2 / 29.560 = **0.07**
- must-severity rules with ≥1 actionable violation: R-FE-001 = **1** (penalty: 1)

Score: `100 − 0.07 − 1 = 98.9 → rounded to 99/100`

Status: **🟢 Healthy** — exemplary

## Violations by rule (sorted by count, post-exemption)

| Rule | Severity | Count | Notes |
|---|---|---|---|
| **R-FE-001** | must | 2 | `styleUrls`/`styles` arrays — these survive the exemption (the lib exemption is on R-FE-002/-003/-004/-005, NOT R-FE-001) |
| **R-FE-002** | must | 0 (1 file before exemption: `.tokens.css` exempted) | ✅ |
| **R-FE-003** | must | 0 (1 raw — fully exempted) | ✅ |
| **R-FE-004** | must | 0 (13,473 hex + 1 palette — fully exempted; **this is correct — component tokens ARE the hex source**) | ✅ |
| **R-FE-005** | must | 0 (1 raw — fully exempted) | ✅ |
| **R-FE-007** | must | 0 | ✅ no HttpClient injection — skeleton library purity verified |
| **R-FE-013** | must | 0 | ✅ |

## Why the exemptions exist (must read before "fixing" anything here)

1. **R-FE-005 — Falcon library FIRST:** the LIBRARY contains the raw `<button>`/`<input>` primitives because *it IS the wrapper that apps wrap*. This is the foundation of the Wave-16 skeleton-vs-wrapper doctrine. (See `EXEMPTIONS.md` and `feedback_library_skeleton_app_api.md`.)
2. **R-FE-004 — Tokens only:** Stencil components publish their tokens via `.tokens.css` companion files (SSOT). Hex values in those files are the canonical token definitions for the whole platform.
3. **R-FE-002 — No SCSS / component CSS:** `.tokens.css` companions are exempt by name. Other CSS files in the lib should follow rule.
4. **R-FE-003 — No inline styles:** Some Stencil-rendered shadow DOM internals use programmatic styling. Exempted by frontmatter.

> **Hard rule:** *don't* try to remove hex literals from component `.tokens.css` files. *Do* fix the 2 `styleUrls`/`styles` array hits.

## Violations by folder

| Folder | Files | Actionable Violations |
|---|---|---|
| `src/components/` | many | mostly Stencil components — 0 actionable (all exemptions apply) |
| `src/angular-wrapper/` | small | likely 2 hits (R-FE-001 styleUrls) |
| `src/tailwind/` | small | 0 |
| `src/styles/` | small | 0 |
| `src/utils/`, `src/types/`, `src/configurations/` | mid | 0 |

## Top 10 violating files in THIS lib

Only 2 actionable violations exist platform-wide for this lib. Identify them with:
```bash
grep -rEn --include="*.ts" -e "styleUrls?\s*:\s*\[" -e "styles\s*:\s*\[" libs/falcon-ui-core
```

## Rules with ZERO violations (the good news)

Every must-severity rule except R-FE-001 is at 0 after honoring documented exemptions. That includes:
- **R-FE-002, R-FE-003, R-FE-004, R-FE-005** — all explicitly exempted (correctly)
- **R-FE-007** — zero `HttpClient` injection in lib (skeleton-only discipline)
- **R-FE-013** — zero deprecated UI references

## What to do tomorrow (prioritized)

1. **Locate and fix the 2 `styleUrls`/`styles` array hits (R-FE-001)** — these slipped past the exemption set. They're real violations even in the lib. Convert to Tailwind utilities on the Angular wrapper template, or to Stencil `styleUrl` on the underlying component.
2. **Do NOT** attempt mass token migration in `*.tokens.css` files. The tokens ARE the data — they're the source the rest of the rulebook references.
3. **Strategic check**: confirm `EXEMPTIONS.md` covers everything it needs to. Specifically, audit whether `src/angular-wrapper/` should be exempted from R-FE-001 (since some Angular wrappers may legitimately need `styles` arrays for shadow-DOM bridging). If yes, add a row.

## Cross-references

- `Brain Outputs/understanding/rules/exemptions/EXEMPTIONS.md` — canonical exemption registry
- Memory: `feedback_library_skeleton_app_api.md` — Wave-16 doctrine
- Memory: `feedback_shadow_is_token_ssot.md` — why `.tokens.css` is the source of truth
- Memory: `project_falcon_ui_library.md` — overall library status

## Trend (compared to a future second audit)

- **Baseline:** 2 actionable violations
- **Files audited:** 520 (468 TS + 52 HTML), 29,560 lines — by far the largest surface on the platform
- **Density:** 0.07 violations/kLoc — gold standard
- **Re-run priority:** low. Re-audit only after major Stencil-component additions or if the EXEMPTIONS.md changes.
