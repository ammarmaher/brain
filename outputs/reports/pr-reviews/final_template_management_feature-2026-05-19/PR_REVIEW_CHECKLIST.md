# PR Review Checklist — PR #41631 (Re-review v2)

> Reviewer: Brain SK · 2026-05-19 · ✅ pass · ❌ fail · ⚠️ partial/unverified · N/A.

## 1. Scope
- [x] ✅ Source/target branch · 77 files · domains classified
- [x] ✅ Affected apps/libs/components/APIs listed

## 2. Knowledge loaded
- [x] ✅ `KNOWLEDGE_ROOT_INDEX.md`, frontend + Falcon component knowledge
- [x] ✅ Backend understanding `understanding/backend/templates/` (exists — used for cross-check)
- [x] ⚠️ Template Management PRD NOT found (F4)

## 3. Architecture & structure
- [x] ✅ Feature folder structure / placement / route conventions
- [x] ❌ Shared-vs-feature-local — duplicated across 2 apps (F1)
- [x] ❌ No duplicated logic — duplicated (F1)
- [x] ⚠️ Nx lib boundaries — shared code not promoted

## 4. Falcon frontend rules
- [x] ✅ Falcon components used; new lib component presentation-only
- [x] ✅ No raw table/input/select where a Falcon component exists
- [x] ✅ Tailwind + tokens only · 0 CSS/SCSS · 0 hex · 0 inline style
- [x] ✅ PrimeNG — sanctioned in this repo (canonical confirmed); F6 resolved

## 5. Validation & API / DTO
- [x] ✅ API services typed, error-handled, endpoints match registry
- [x] ✅ No mock data · i18n keys added
- [x] ⚠️ FE↔BE DTO contract — conflict with backend doc (B1)
- [x] ⚠️ Templates browser reachability / CORS unverified (B2)

## 6. Business logic
- [x] ✅ Design proposal documented
- [x] ⚠️ PRD flow / lifecycle / permissions — unverified (F4, F3)

## 7. Security / PES
- [x] ✅ No secrets · no sensitive logging · no guard removed
- [x] ⚠️ Permissions / maker-checker — needs PES pass (F3)

## 8. Quality gates
- [x] ❌ Tests — 0 spec files (F2)
- [x] ⚠️ Build / lint — NOT RUN (needs PR-branch checkout); author confirms
- [x] ✅ Subscription safety — 18/18 guarded with `takeUntilDestroyed`
- [x] ✅ Regression — shared-lib changes additive → LOW
- [x] ✅ No `any` holes / unsafe casts in changed services/mappers
- [x] ⚠️ 1 intentional `console.error` (F5)

## 9. Code-level error pass
- [x] ⚠️ C1 — order-sensitive dirty-tracking (`serializeChannels`)
- [x] ✅ No null-deref / unhandled-observable / dead-code defects found

## 10. Output
- [x] ✅ 6 MD docs + HTML produced (consistent — 9 findings)
- [x] ✅ Risk matrix · required fixes filled
- [x] ✅ Obsidian `PR_REVIEW_INDEX.md` updated
- [x] ✅ Additive mirror done
- [x] ✅ Silent review — nothing posted to the PR
