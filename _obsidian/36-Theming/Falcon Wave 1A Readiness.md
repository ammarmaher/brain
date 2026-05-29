---
type: reference
library: "[[Tailwind CSS]]"
topic: wave-1a-readiness
priority: critical
scope: current-angular-first
created: 2026-05-20
---
*** Falcon Wave 1A Readiness — pre-Wave-1 readiness gate ***
*** Verifies prerequisites before any Tailwind implementation work begins ***
*** Read-only assessment — no implementation, no commits ***

# Falcon Wave 1A Readiness

> Wave 1 (semantic Tier-2 promotion + component-contract rewire + template utility swap) cannot start until certain prerequisites are confirmed. Wave 1A is the **readiness gate** — a checklist of verifications. This note documents the gate status as of 2026-05-20.

## Why Wave 1A exists

Wave 1 plans to:
1. Promote semantic Tier-2 tokens into the SSOT `@theme` block
2. Rewire component contracts to chain through Tier 2
3. Update Angular templates to use the new utilities

Before doing any of that, we need to confirm:
- ✅ The token generation flow is stable
- ✅ Generated-file boundaries are clear
- ✅ Folder structure is understood
- ✅ Component library architecture is mapped
- ✅ Studio registry doesn't drift on contract changes
- ✅ Visual-diff CI gate is in place
- ✅ Light values won't change (per the "100% value preservation" mathematical claim)

If any item fails, Wave 1 either blocks or proceeds with elevated risk.

## Wave 1A readiness checklist

### A — Knowledge foundation

- [x] [[Tailwind Mental Model]] documented (3-layer token doctrine)
- [x] [[Falcon Theme Folder Structure]] audited (5 libraries mapped, 64+ token files inventoried)
- [x] [[Falcon Token Generation Flow]] audited (8-stage pipeline documented, 3 codegen scripts identified)
- [x] [[Falcon Generated Files Rules]] documented (DO-NOT-EDIT contracts enumerated)
- [x] [[Falcon Component Library Structure]] audited (103 Stencil dirs, 62 wrappers, 95 class-maps, 51 contracts)
- [x] [[Falcon Studio Token Registry Flow]] audited (14 registry files mapped)
- [x] [[Falcon Tailwind Theme]] governance rules (5 rules locked)
- [x] [[Falcon Component Theme Contract]] (9-section contract defined)
- [x] [[Falcon Component Audit Scorecard]] (6-dimension scoring framework defined)
- [x] [[Falcon Component Tailwind Audit 2026-05-20]] (first audit run — 77% overall + 124-item backlog)
- [x] [[Tailwind Falcon Alignment Scorecard]] (71% → 93% projection across waves)

### B — Codegen and tooling

- [x] `nx run falcon-theme:generate-tokens-ts` exists + cached (verified)
- [x] `tokens.ts` carries DO-NOT-EDIT banner ✅
- [ ] Stencil-emitted `.ts` aggregators carry DO-NOT-EDIT banner ❌ — recommended addition (audit finding from [[Falcon Generated Files Rules]])
- [ ] `falcon-ui-tokens/scripts/build-token-registry.mjs` purpose audited (TBD)
- [ ] `falcon-ui-tokens/scripts/scope-component-tokens.mjs` runtime status verified (TBD)
- [ ] Studio `component-tokens.generated.ts` regeneration step audited (TBD — Wave 1A residual)

### C — Test / regression safety net

- [ ] Visual-diff CI gate in place (Percy / Chromatic / Playwright screenshots) ❌ — required before Phase E (palette consolidation)
- [ ] 6-10 reference screens snapshotted for light-mode pixel diff ❌
- [ ] Sample component-build smoke test (verify 3 apps still build green) — recommended pre-Wave-1
- [x] Zero `*.spec.ts` files on Falcon UI core today (documented per `narrative/READINESS_SCORES.md`) — known gap

### D — Folder / structure invariants

- [x] `libs/falcon-theme/` is the SSOT (verified file path)
- [x] `libs/falcon-ui-tokens/` is the per-component contract layer (51 files verified)
- [x] `libs/falcon-ui-core/` holds Stencil + Angular wrappers + Tailwind class-maps (103 + 62 + 95 verified)
- [x] `libs/falcon-studio/` is the registry/UI layer (14 registry files verified)
- [x] Per-app `tailwind.css` entries imported SSOT correctly (verified host-shell)
- [x] Triple-selector dark mode is wired (`@custom-variant dark (&:where(.app-dark, .app-dark *));`) per [[Tailwind Dark Mode]]
- [x] `@layer theme, base, falcon-base, utilities;` layer order declared

### E — Process governance

- [x] [[Tailwind Implementation Review Checklist]] exists (per-PR pre-merge gate)
- [x] [[Component Theme Contract Template]] exists (per new component)
- [x] Brain SK CLAUDE.md "Permanent Rules" cover theming work
- [ ] Wave 1 PR template documented ❌ — recommended addition
- [ ] Designer sign-off process documented ❌ — recommended for Phase E

### F — Scope clarity

- [x] **Angular-first scope confirmed** (per Ammar directive 2026-05-20)
- [x] **React/Vue marked future-placeholder** in all 36-Theming notes
- [x] Wave 1 vs Wave 2 split documented (per [[Tailwind Falcon Alignment Scorecard]])
- [x] No code changes this turn (read-only audit confirmed)

### G — Conflict / drift checks

- [x] **P0-08 — Token fallback hex drift** documented (button/input/dropdown/multi-select/phone/email/combobox)
- [x] **P0-09 — `@config` legacy bridge** is empty (`module.exports = {}`) — harmless, can be removed
- [x] **P1-39 — 178-line dark bypass** documented (Wave 1+ target)
- [x] **3-app safelist drift** documented (host-shell 2113, admin 2050, mgmt 0) — Wave 2 target

## Readiness score: **75% — partially ready**

| Block | Status |
|---|---|
| A — Knowledge foundation | ✅ 100% (11 of 11) |
| B — Codegen and tooling | 🟡 33% (2 of 6) — 4 items TBD |
| C — Test / regression safety net | 🔴 25% (1 of 4) — visual-diff CI gate is the critical missing piece |
| D — Folder / structure invariants | ✅ 100% (7 of 7) |
| E — Process governance | 🟡 60% (3 of 5) |
| F — Scope clarity | ✅ 100% (4 of 4) |
| G — Conflict / drift checks | ✅ 100% (4 of 4) |

**Weighted overall: 75% (partially ready).**

## What MUST happen before Wave 1 starts

| # | Action | Owner | Effort |
|---|---|---|---|
| 1 | Set up visual-diff CI gate (Percy / Chromatic / Playwright) | Frontend lead | 1 day |
| 2 | Snapshot 6-10 reference screens in light mode | Frontend lead | 0.5 day |
| 3 | Smoke-test 3 apps build green (baseline) | Frontend lead | 0.5 day |
| 4 | Audit `falcon-ui-tokens/scripts/build-token-registry.mjs` and `scope-component-tokens.mjs` | Architect | 0.5 day |
| 5 | Confirm Studio `component-tokens.generated.ts` regeneration step | Studio author | 0.5 day |
| 6 | Add DO-NOT-EDIT banner to Stencil-emitted aggregator files | Architect | 0.5 day |
| 7 | Document Wave 1 PR template + designer sign-off process | Architect | 0.5 day |

**Total Wave 1A residual effort: ~4 days.** After this, Wave 1 can proceed at low-medium risk.

## What CAN happen now (Wave 1A-parallel)

These are knowledge-graph items that don't touch code:

- ✅ More Obsidian notes covering anything missing from this audit
- ✅ Per-component theme contract fills (`Component Theme Contract Template` × 60)
- ✅ Cross-link 60 component notes to relevant Tailwind topics where direct dependencies exist
- ✅ Update Brain Outputs evidence index with new audit references

## Risk if Wave 1 starts WITHOUT 1A completion

| If skipped | Likely outcome |
|---|---|
| Visual-diff CI gate | Pixel-perfect light-mode parity claim becomes unverifiable; regressions slip in |
| Reference screenshots | No ground-truth to compare against |
| Stencil aggregator banners | New contributor edits a generated file, gets surprised on next build |
| Wave 1 PR template | Reviews are inconsistent — Tailwind alignment rules drift |
| Designer sign-off process | Phase E (palette consolidation) ships unauthorized color changes |

## See also

- [[Falcon Theme Folder Structure]] — full library map
- [[Falcon Token Generation Flow]] — token pipeline + invariants
- [[Falcon Generated Files Rules]] — DO-NOT-EDIT enumeration
- [[Falcon Component Library Structure]] — component anatomy
- [[Falcon Studio Token Registry Flow]] — Studio consumption pattern
- [[Falcon Tailwind Theme]] — 5 governance rules
- [[Falcon Component Theme Contract]] — 9-section per-component contract
- [[Falcon Component Audit Scorecard]] — scoring framework
- [[Tailwind Implementation Review Checklist]] — pre-merge checklist
- [[Tailwind Falcon Alignment Scorecard]] — Wave 1 + 2 plan
- Supporting evidence (linked, not authoritative): [FALCON_THEME_AND_TAILWIND_REPORT](../../Brain%20Outputs/understanding/frontend/FALCON_THEME_AND_TAILWIND_REPORT.md) · [READINESS_SCORES](../../Brain%20Outputs/understanding/frontend/narrative/READINESS_SCORES.md)

## Tags

#type/reference #layer/frontend #priority/critical #readiness-gate

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FRONTEND_INDEX]] · [[FALCON_COMPONENT_INDEX]]
