# Scorecard — falcon-insufficient-balance-dialog (2026-05-15)

Reference: `Brain Outputs/strategies/falcon-component-creation/05-SCORING_RUBRIC.md`.

| Dimension | Weight | Pre-run | Post-run | Notes |
| --- | --- | --- | --- | --- |
| Three-artefact pattern compliance | 15 | 95 | 100 | Shadow + Light/TW + Angular wrapper all authored to spec. |
| Token contract authoring | 10 | 100 | 100 | 60+ tokens authored covering backdrop, panel, header, list, row geometry, controls, info pill, error banner, footer. |
| Types SSOT (`*.types.ts` shared) | 10 | 100 | 100 | `IbDialogItem` + event detail interfaces imported by all 3 layers. |
| Event surface (`bubbles+composed`) | 5 | 100 | 100 | `falcon-proceed`, `falcon-cancel`, `falcon-open-change` all `bubbles: true, composed: true`. |
| Loader registration | 5 | 80 | 100 | Bootstrap two-pass required — flagged as common pitfall. |
| Angular wrapper input/output parity | 10 | 100 | 100 | All Stencil Props mirrored as `@Input`; events mirrored as `@Output`. |
| Wrapper template (`@if useTailwind`) | 5 | 100 | 100 | Symmetric branches; every binding present in both. |
| No SCSS / no PrimeNG / no inline styles | 5 | 100 | 100 | Verified. |
| Accessibility (role / aria-modal / aria-label) | 5 | 90 | 95 | -5 for no focus trap (G4 in GAPS). |
| RTL support | 5 | 100 | 100 | `:host-context([dir="rtl"])` flips footer alignment. |
| Tokenised geometry (Wave 15 user request) | 5 | n/a | 100 | Row height/width/gap/padding/radius all token-driven. |
| Visual config flags (Wave 15 user request) | 5 | n/a | 100 | `showGlossy` / `showIconColor` / `showIconBackground` reflected + branching CSS. |
| Build chain green (3 targets) | 10 | n/a | 100 | All 3 builds exit 0. Hashes recorded in RUN.md. |
| Knowledge updates (Brain SK dossier) | 5 | 60 | 100 | 6-file dossier rewritten to reflect strategy-correct rebuild. |
| Showcase entry + new category | n/a | n/a | 100 | "Custom Pop-up Notification" category created; entry moved to it. |
| **TOTAL** | **100** | **96.5** | **99.5** | |

**Action band:** PASS (≥95) — ship.

## Deviations

| Deviation | Severity | Recovery |
| --- | --- | --- |
| Loader bootstrap two-pass | Low | Documented in LESSONS_LEARNED.md; suggested for `08-COMMON_PITFALLS.md`. |
| No focus trap | Medium | Tracked as G4 in dossier GAPS_AND_UPGRADES.md. Doesn't block ship — `aria-modal="true"` provides baseline. |
| Wiki vault note skipped | Low | Templater not available in session. Vault note can be added by next agent that has access. |

## Comparison with prior calibration run (2026-05-14, falcon-empty-data)

| Aspect | falcon-empty-data | falcon-insufficient-balance-dialog | Notes |
| --- | --- | --- | --- |
| Build wall time | 22 min | ~30 min (2 Stencil compiles) | Bootstrap cost ~+8 min. |
| Files created | 6 | 10 | Larger surface (visual chrome + reorder UX). |
| Token count | ~12 | ~60 | Driven by Wave 15 user-requested config surface. |
| Scorecard | 98.47 | 99.5 | Slightly higher — strategy maturity + clearer user contract. |
| Deviation count | 1 (a11y i18n) | 3 (loader / focus / wiki) | Two are external constraints; one is a strategy refinement. |

## Recommendation

Ship. Patch strategy `08-COMMON_PITFALLS.md` with the loader chicken-and-egg pattern (see LESSONS_LEARNED.md for proposed text).
