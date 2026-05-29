---
type: reference
library: "[[Tailwind CSS]]"
topic: component-audit-run
audit-date: 2026-05-20
scope: current-angular-first
created: 2026-05-20
---
*** Falcon Component Tailwind Audit — first run 2026-05-20 ***
*** 60 components scored across 6 dimensions; read-only audit ***
*** Falcon SoT: Brain Outputs/understanding/frontend/theme/falcon-component-tailwind-audit-2026-05-20.md ***

# Falcon Component Tailwind Audit — 2026-05-20

> First run of [[Falcon Component Audit Scorecard]] against the 60-component Falcon UI library. Angular-first. Read-only. Anchored on the 2026-05-13 deep Brain Outputs audit + Tailwind v4 knowledge cluster. Full table + gap lists + Wave 1/2 backlog live in Brain Outputs SoT.

## Headline numbers

| Metric | Value |
|---|---|
| Components scored | 60 |
| Overall readiness (weighted) | **77%** |
| Production-ready (90+) | 1 (`falcon-icon`) |
| Good (75-89) | 35 |
| Cleanup needed (60-74) | 13 |
| Risky (40-59) | 7 |
| Not ready (<40) | 4 |

## Per-dimension scores

| Dimension | Score |
|---|---|
| Theme score | 82% |
| Token score | 75% |
| State score | 80% |
| Dark score | 74% |
| Resize score | 78% |
| Wrapper score | 74% |
| **Overall** | **77%** |

## Top 10 highest-risk components

1. falcon-photo-uploader (35) — LEGACY · 6 wizards depend
2. falcon-tree-panel (40) — LEGACY · 4 menu files depend · no tokens · SCSS
3. falcon-stepper-legacy (42) — 4 production wizards · P0-02 migration
4. falcon-calendar-legacy (44) — LEGACY facade · no dark mode
5. falcon-mobile-number (47) — LEGACY · migrate to phone-field
6. falcon-form-field (49) — 131 call sites · deprecation backlog
7. send-credentials-popup (49) — retire via popup variant=slot
8. shared-directives (57) — FalconFormValidate refactor (P0-11)
9. falcon-organization-hierarchy-tree-tw (64) — no Angular wrapper · no production
10. falcon-popup (66) — **WCAG focus-trap violation (P0-01)** · no tokens

**Honorable mentions:** falcon-table (76), falcon-tree (75), falcon-uploader (77), falcon-tabs (82) — all have active P0 backlog items.

## Wave projections

| Milestone | Overall | Days |
|---|---|---|
| Today | 77% | — |
| After Wave 1 | 87% | ~27 days |
| After Wave 2 | 93% | +46 days |

## Wave 1 highlights (Angular-first P0 + critical P1)

15 actions covering ~27 days of work. Top blockers:
- P0-02 wizard migration (5 days, HIGH revenue risk)
- P0-01 popup focus trap (3 days)
- P0-06 tree per-row template (2 days)
- P0-08 token fallback reconciliation (1 day)
- P1-37 intent palette → SSOT @theme (2 days)
- P0-11 FalconFormValidate refactor (2 days)

## Wave 2 highlights

22 actions covering ~46 days. Big tickets:
- P1-01 universal `FalconOptionTemplateDirective` (5 days)
- P2-13/33 retire falcon-form-field (10 days — 131 call sites)
- P1-15 organization-hierarchy-tree wrapper (3 days)
- P1-39 collapse 178-line dark bypass (3 days)

## Gap categories — quick links

Full lists in the SoT:

- **Token gaps** — P0-08 fallback drift (7 components) · 6 incomplete contracts · 2 missing (popup, notification) · 178-line dark bypass
- **Sizing gaps** — tree no per-row · tree-table O(rows×cols) · phone eager render · range mode · density input · icon xl+ scale
- **State gaps** — popup focus trap · table keyboard sort · 4 CVA gaps · 14 method-proxy harmonization · ariaLabel parity
- **Dark gaps** — 178-line bypass · 7 LEGACY with no dark · 38 hex-in-SVG
- **Wrapper gaps** — 4 wizards on legacy stepper · tree no slot · org-hierarchy-tree no wrapper · paginator 6 inputs missing · 4 CVA gaps · errorMessage/errorText drift

## Audit closure

| Verification | Status |
|---|---|
| Read-only audit | ✅ no code changes |
| Angular-first scope | ✅ React/Vue not scored |
| Used 36-Theming knowledge | ✅ all 8 new notes referenced |
| Anchored on Brain Outputs | ✅ 124-item backlog + 15-col matrix + 60 dossiers |
| Honest scoring | ✅ evidence-anchored; no inflation |

## See also

- [[Falcon Component Audit Scorecard]] — scoring framework
- [[Falcon Component Theme Contract]] — 9-section contract
- [[Tailwind Falcon Alignment Scorecard]] — system-level alignment
- [[Component Theme Contract Template]] — per-component fill template
- [[Tailwind Implementation Review Checklist]] — pre-merge checklist
- Brain Outputs SoT: [falcon-component-tailwind-audit-2026-05-20](../../Brain%20Outputs/understanding/frontend/theme/falcon-component-tailwind-audit-2026-05-20.md) ★ (full audit detail)
- `COMPONENT_UPGRADE_BACKLOG.md` · `FALCON_COMPONENT_CAPABILITY_MATRIX.md` · `narrative/READINESS_SCORES.md`

## Tags

#type/reference #layer/frontend #priority/critical #audit

## Hubs

- [[36-Theming/README|36-Theming]] · [[Tailwind CSS]] · [[FALCON_COMPONENT_INDEX]] · [[FRONTEND_INDEX]]
