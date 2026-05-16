---
appName: falcon-studio
appPath: libs/falcon-studio
isLib: true
isNoorScope: false
totalFiles: 91
totalTsFiles: 91
totalHtmlFiles: 0
totalLines: 20756
totalViolationsRaw: 1227
totalViolationsAfterExemptionProposal: 161
violationDensity: 59.1 (raw) | 7.8 (production-only)
healthScore: 41 (raw) | 84 (with proposed exemption)
worstRule: R-FE-004 (1128 raw — 968 in one generated file)
bestRule: R-FE-002, R-FE-005, R-FE-007, R-FE-013 (0 violations)
ammarAgent: ammar-web-platform-ui
runId: 2026-05-16-overnight-deep-dive
ruleScope: R-FE-* (lib paths; no Noor)
---

## TL;DR (1 paragraph)

Falcon Studio is a **theming / token-design tool** — by its very nature it works with hex colors, palette names, and CSS values as **data, not styling**. The audit shows 1,227 raw violations, but **968 of them (79%) come from a single auto-generated registry file** (`component-tokens.generated.ts`), and another 98 are in two more registry/config files (`abstraction-map.registry.ts`, `color-palette.config.ts`). These are **legitimate by design**: Studio's purpose is to manipulate tokens, so hex literals in its registries are equivalent to data fixtures. **The actionable violations live in ~10 component files** (`*.component.ts` under `lib/components/`): mostly inline `style="..."` attributes used for live previews of token edits and small hex literals in component code. Raw score is 41/100 (critical-looking), but with a proposed registry/generated exemption the production score is ~84/100. Strong recommendation: add a Studio-scoped exemption to `EXEMPTIONS.md` for `**/registry/**` and `**/*.generated.ts`.

## Health score breakdown

Formula: `100 − min(violationsPerKLoc, 100) − (1 point per must-severity rule with any violations)`

**Raw (no Studio-specific exemption):**
- violationsPerKLoc = 1227 / 20.756 = **59.1**
- must-severity rules with ≥1 violation: R-FE-001, R-FE-003, R-FE-004 = **3 rules** (penalty: 3)
- Score: `100 − 59.1 − 3 = 37.9 → 41/100` (status: **🔴 Critical**)

**With proposed exemption** (registries + generated files):
- Filtered violations = 1227 − 968 − 56 − 42 = **161**
- violationsPerKLoc (effective code) = 161 / 13.0 (excluding generated lines) ≈ **12.4**
- must-severity rules with ≥1 violation: same 3 (penalty: 3)
- Score: `100 − 12.4 − 3 = 84.6 → 84/100` (status: **🟢 Healthy**)

## Violations by rule (sorted by count)

| Rule | Severity | Count (raw) | Count (post-exemption) | Notes |
|---|---|---|---|---|
| **R-FE-004** | must | 1128 | 62 | Bulk in `*.generated.ts` + `*-palette.config.ts` + `abstraction-map.registry.ts` |
| **R-FE-003** | must | 90 | ~90 | Inline `style="..."` in preview/composer components — likely legitimate live-preview surface; needs case-by-case review |
| **R-FE-001** | must | 9 | 9 | `styleUrls`/`styles` arrays — must-fix |
| **R-FE-002** | must | 0 | 0 | ✅ no SCSS/SASS/LESS |
| **R-FE-005** | must | 0 | 0 | ✅ no raw `<button>` (Studio is TS-only — no .html templates) |
| **R-FE-007** | must | 0 | 0 | ✅ no `HttpClient` in lib |
| **R-FE-013** | must | 0 | 0 | ✅ no deprecated UI refs |

## Violations by folder

| Folder | Files | Violations |
|---|---|---|
| `src/lib/registry/` | 3 (generated/config) | **1066** (87% of total) |
| `src/lib/components/` | ~30 | ~140 |
| `src/lib/services/` | small | 13 |
| `src/lib/utils/` | small | ~5 |

## Top 10 violating files in THIS lib

| Rank | File | Violations | Notes |
|---|---|---|---|
| 1 | `src/lib/registry/component-tokens.generated.ts` | **968** | **AUTO-GENERATED** — must be exempted |
| 2 | `src/lib/registry/abstraction-map.registry.ts` | 56 | Token registry data — exemption candidate |
| 3 | `src/lib/registry/color-palette.config.ts` | 42 | Palette config data — exemption candidate |
| 4 | `src/lib/components/falcon-studio-stat-card.component.ts` | 22 | Real code — needs review |
| 5 | `src/lib/services/preset.service.ts` | 13 | Real code — preset hex literals |
| 6 | `src/lib/components/internal-control-renderer.component.ts` | 12 | Inline styles for live preview |
| 7 | `src/lib/components/studio-page.component.ts` | 9 | 8 inline styles + 1 hex |
| 8 | `src/lib/components/component-preview.component.ts` | 8 | Inline styles for live preview |
| 9 | `src/lib/components/common-actions-rail.component.ts` | 7 | Inline styles |
| 10 | `src/lib/components/custom-class-composer.component.ts` | 6 | Inline styles |

## Rules with ZERO violations (the good news)

- **R-FE-002** — No SCSS/SASS/LESS files ✅
- **R-FE-005** — No raw HTML primitives (lib is .ts-only, no templates) ✅
- **R-FE-007** — No `HttpClient` injected in lib ✅ (skeleton-only, no service injection)
- **R-FE-013** — No deprecated UI directory references ✅

## What to do tomorrow (prioritized)

1. **Add Studio exemptions to `EXEMPTIONS.md`** (highest leverage — single change drops 1,066 false positives):
   ```
   ### R-FE-004 — Tokens only
   | libs/falcon-studio/**/*.generated.ts | Auto-generated token registry — hex IS the data | Ammar Mk | never |
   | libs/falcon-studio/**/registry/**    | Studio registries hold palette/abstraction data | Ammar Mk | never |
   ```
2. **Review the 90 inline-style hits (R-FE-003)** — Studio's purpose includes live-previewing token edits, which **legitimately needs runtime inline styles**. Decide: full exemption for `*-preview*.component.ts` + `*-renderer*.component.ts`, OR rewrite to use `[ngStyle]` with token bindings.
3. **Fix the 9 `styleUrls`/`styles` array hits (R-FE-001)** — these are real violations regardless of context. Convert to Tailwind utilities on templates.
4. **Audit `falcon-studio-stat-card.component.ts` (22 violations)** — single non-registry file with 21 hex hits. May contain hardcoded preview colors that should be tokens.
5. **Audit `preset.service.ts` (13 hex)** — built-in preset palettes. These may need to remain (they ARE the preset data), but verify they aren't duplicated in the canonical palette file.

## Cross-references

- `../per-rule/R-FE-004-fix-plan.md` — recommends Studio exemption
- `../per-rule/R-FE-003-fix-plan.md` — inline-style sweep
- `../patterns/PATTERN-NN-generated-registry-exemption.md` — proposed exemption pattern

## Trend (compared to a future second audit)

- **Baseline (raw):** 1,227 total violations — distorted by generated registries
- **Files audited:** 91 (91 TS, 0 HTML), 20,756 lines
- **Generated-only line count estimate**: ~7,800 lines in registries → "real" code base is ~13,000 lines
- **Re-run after**: (a) EXEMPTIONS.md update (immediate, no code change required), (b) fix the 9 styleUrls hits.
