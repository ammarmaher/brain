---
type: learning-capture
generatedAt: 2026-05-16
runId: 2026-05-16-overnight-deep-dive
promotionStatus: pending-review
---

*** Insights captured during the overnight run ***
*** Each entry is a candidate for promotion into the brain knowledge base ***

# 🧠 Learning from Tonight

> What the audit + the agents uncovered that should permanently enrich the Falcon brain.

## Insight 1 — The "token registry" anti-pattern in rule design

**Observation:** R-FE-004 (tokens only) generated 2,271 violations on first run. Investigation showed:
- 1,086 from `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts`
- 248 from `libs/falcon-theme/src/falcon-tailwind-tokens.css`
- 154 from `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts`
- 94 from `libs/falcon-theme/src/tokens.ts`
- 91 from `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts`

**Learning:** Rules that ban "hardcoded literals" need to distinguish between:
- **Authorship intent** — the file is a *registry* / *catalog* / *generated artifact* whose literals ARE the data
- **Usage intent** — a feature file with a hardcoded `#FFF` snuck in

**Action:**
1. Every R-FE-* / R-NOOR-* rule that targets "no hardcoded X" must enumerate **token registry exempt paths** in its frontmatter
2. Detector should auto-detect `@generated` / `THIS FILE IS GENERATED` markers and skip those files
3. New rule candidate: **R-FE-015 — Generated artifacts shall not be hand-edited** (different rule, different intent)

**Promotion target:** `Brain Outputs/understanding/rules/frontend/R-FE-004-tokens-only.md` + new R-FE-015

## Insight 2 — The "skeleton component" rule-violation cluster

**Observation:** The Org Hierarchy page's skeleton components (loading states) account for ~60% of R-FE-003 (inline styles) and a significant chunk of R-NOOR-003 (typography scale).

**Files identified:**
- `apps/admin-console/.../org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` — 49 violations
- Other skeleton components in the same folder

**Learning:** Loading-state markup is structurally different from data markup. It uses placeholder dimensions (`w-32 h-4`) and pulse animations. Two paths forward:
1. **Path A** — refactor to use `<falcon-skeleton-row width="32" height="4">` library component (none exists today — opportunity to add)
2. **Path B** — accept the pattern but tighten via Tailwind utilities (`w-32 h-4 bg-slate-200 animate-pulse rounded`)

**Promotion target:**
- New refactor pattern note: `patterns/PATTERN-skeleton-component-refactor.md`
- Possibly add `<falcon-skeleton-*>` to the Falcon UI Core component backlog

## Insight 3 — Admin Console's tailwind.css itself violates Noor

**Observation:** `apps/admin-console/src/tailwind.css` contains intent tokens (`bg-primary`, `text-success` derivations) — the theme file IS the violator.

**Learning:** The Noor "palette over intent" rule needs a theme-file pass before the page-level fixes. Otherwise pages migrate to palette names but the theme file still ships intent tokens, causing confusion.

**Promotion target:** R-NOOR-002 (Theme promotion) — add a `mustPrecede: [R-NOOR-005]` field to the frontmatter. Theme refactor before palette-token migration.

## Insight 4 — The 80/20 of violations sits in 5 paths

**Observation:** 5 paths produce ~62% of all violations:
1. `libs/falcon-studio/` — 1,408 violations (token registry — false positive)
2. `apps/host-shell/src/app/features/falcon-ui-showcase/` — 586 violations (showcase data — false positive)
3. `apps/admin-console/src/app/features/org-hierarchy-page/` — many real violations
4. `libs/falcon-theme/` — 248 violations (token SoT — false positive)
5. `libs/falcon/` — 68 violations (library)

**Learning:** Pareto distribution holds. Exempt false-positive paths first; then focus actual fix-work on the top 1-2 real-violation hotspots — the Org Hierarchy page complex is the single biggest real-debt cluster.

**Promotion target:** A new vault hub note `00-Home/Debt Hotspots.md` listing the top 10 paths to clean up across the platform.

## Insight 5 — The audit-orchestrator stalls on monorepo caches

**Observation:** The full audit-orchestrator never completed against falcon-web-platform-ui because its file-collection fallback walks `.angular/cache/`, `.nx/cache/`, and `node_modules/` — yielding millions of files × 11 rules.

**Learning:** Every detector engine must short-circuit cache/dependency folders BEFORE the rule loop. The `quick-frontend-scan.ps1` written tonight implements this and runs in 10 sec.

**Promotion target:** `regex-runner.ps1` and `structural-walker.ps1` need a shared excluded-folder list at file-collection time. Already documented in `SESSION_3_REFINEMENT_PLAN.md`.

## Insight 6 — Per-component analysis works

**Observation:** Of 62 Falcon component dossiers, 49 had violations nearby. That means most components are well-known and used. The 13 with zero nearby violations are either:
1. Well-adopted (perfect — keep)
2. Under-used (the component exists but pages bypass it — investigate)

**Learning:** Component dossier file existence ≠ component adoption. Need a separate scan: "which Falcon component each violation could have prevented if used correctly."

**Promotion target:** Add a `componentAdoptionScore` field to each component dossier — computed nightly.

## Insight 7 — Rule frontmatter is a contract, treat it like API

**Observation:** Every refinement above is a **frontmatter edit** — `exemptPaths`, `detector.patterns`, `severity`, `relatedRules`. The rule body (prose) didn't need to change.

**Learning:** The rulebook's frontmatter IS the machine surface. Body is for humans. This separation is working — small surgical frontmatter edits move thousands of violations.

**Promotion target:** Add a versioning convention — `frontmatterVersion: 1`. Future detector engines key off this to detect schema drift.

## Insight 8 — Detector test fixtures pay back

**Observation:** Session 2's 17 test fixtures (8/8 PASS) caught all the issues before the broader audit ran. The fixtures continue to pay back as rules are refined.

**Learning:** Every detector refinement (e.g. tightening R-FE-004's pattern) should land with a *new* fixture demonstrating the refinement intent. Otherwise refinements drift silently.

**Promotion target:** A protocol note `detectors/REFINEMENT_PROTOCOL.md` codifying: every detector change requires a fixture test.

## How to promote these

Each insight above is a candidate for permanent brain enrichment. Tomorrow morning, you can:

1. **Approve insight N** → I'll write it as a permanent note under the right brain location
2. **Reject insight N** → I'll add a justification record so future runs don't re-surface it
3. **Modify and approve** → red-pen the wording, then commit

This follows the Light Learning → Deep Page Learning gate documented in `Brain SK/CLAUDE.md`. Tonight's run is the **Light Learning** intake. Promotion to "approved" requires your explicit OK.

## Related artifacts

- [BACKUP_AGGREGATES.md](BACKUP_AGGREGATES.md)
- [SESSION_3_REFINEMENT_PLAN.md](SESSION_3_REFINEMENT_PLAN.md)
- [TOP_PRIORITY_FIXES.md](TOP_PRIORITY_FIXES.md)
- [COMPONENT_VIOLATION_HEATMAP.md](COMPONENT_VIOLATION_HEATMAP.md)
