# Brain Gap Registry — Audit #1

> Severity legend: **HIGH** = blocks ship / blocks downstream skills · **MEDIUM** = degrades quality · **LOW** = hygiene.
> Every row cites the evidence path. No invented severities.

## Summary

| Severity | Count |
|---|---:|
| 🔺 **HIGH**   | **5** |
| ◼ **MEDIUM** | **6** |
| ● **LOW**    | **1** |
| **Total**    | **12** |

_Caption: `Brain Outputs` filesystem evidence 2026-05-14 · chart authored under `shared/analytics/data-visualization/templates/gap-severity.md`._

---

## Brain-level gaps (this audit)

| ID | Area | Gap | Severity | Source |
|---|---|---|---|---|
| BCA-001 | registries | 13 of 15 registry files are stubs (≤6 lines, ≤0.3 KB) | HIGH | `C:/Falcon/Brain SK/registries/*.md` filesystem scan |
| BCA-002 | tests | Zero `*.spec.ts` on Falcon UI core components | HIGH | `understanding/frontend/READINESS_SCORES.md` § Test / a11y confidence (70 %) |
| BCA-003 | readiness folder | `Brain Outputs/readiness/` is empty | MEDIUM | filesystem scan |
| BCA-004 | backend deep coverage | 6 of 9 backend services have only the 6 service-level files (no per-controller dossier) | MEDIUM | `understanding/backend/<svc>/` file counts (access, contact-group, core-gateway, identity, system-gateway, templates) |
| BCA-005 | PRD severity | PRD `GAPS.md` files do not yet classify gaps with HIGH/MEDIUM/LOW | MEDIUM | grep over `prd/modules/*/GAPS.md` |
| BCA-006 | wiki-architect freshness | Wiki mirror dated 2026-05-13; no automated freshness watcher recorded | LOW | `wiki-architect/` last-write 2026-05-13 21:34 |
| BCA-007 | data-visualization | Skill created 2026-05-14 — no CI harness yet | MEDIUM | `shared/analytics/data-visualization/SKILL.md` last-write 2026-05-14 |
| BCA-008 | scan-metadata root | Only `bootstrap-health.json` present — no per-domain scan ledgers | MEDIUM | `Brain Outputs/scan-metadata/` (1 file) |

---

## Top 10 platform risks (mirrored from prior frontend coverage report)

> Brain-level audits inherit risks from the most recent domain coverage report when those risks are still un-actioned in code.

| Severity | ID | Component | Issue | Source |
|---|---|---|---|---|
| HIGH (P0) | UP-3-02 | popup | Focus trap missing (WCAG)                              | `understanding/frontend/FINAL_COVERAGE_REPORT.md` |
| HIGH (P0) | UC-W02  | wizards | 4 wizards still on legacy stepper                      | same |
| HIGH (P0) | UC-P0-01 | table | PrimeIcons residual in row-action button               | same |
| HIGH (P0) | UC-W04  | uploader | PrimeIcons residual (4 occurrences)                    | same |
| HIGH (P0) | UC-W01  | tree    | No per-row template / actions slot                     | same |
| HIGH (P0) | UP-01   | tokens  | Component-token fallback hex drifts from SSOT (3)      | same |
| HIGH (P0) | UP-3-01 | tabs    | MutationObserver lift is fragile                       | same |
| HIGH (P0) | UP-03   | feature SCSS | 20+ feature SCSS files violate no-SCSS rule       | same |
| HIGH (P0) | UC-D01  | shared-directives | FalconFormValidateDirective heavy + console.log | same |
| MEDIUM (P1) | UC-P1-06 | all  | Zero `*.spec.ts` (also tracked as BCA-002)             | same |

---

## Not-yet-known (gap categories we have not measured at all)

These are dimensions for which **no evidence exists in Brain Outputs**. Recording them as gaps prevents silent drift.

| ID | Dimension | Why it's unknown | Severity |
|---|---|---|---|
| BCA-U-001 | Production usage telemetry of Falcon UI components | No telemetry/analytics file under `Brain Outputs/` | MEDIUM |
| BCA-U-002 | Backend API response-time benchmarks | No perf JSON under `understanding/backend/<svc>/` | MEDIUM |
| BCA-U-003 | Test coverage % (Jest/Cypress) per app | No coverage report under `Brain Outputs/reports/` | HIGH |
| BCA-U-004 | Accessibility (axe-core) automated pass-rate | No axe-core report under `Brain Outputs/reports/` | MEDIUM |
| BCA-U-005 | Bundle-size / Lighthouse trend | No `lighthouse/` or `bundle/` folder under `Brain Outputs/` | LOW |

---

## How to close these gaps

| Gap ID | Suggested skill to close it |
|---|---|
| BCA-001 | Each domain skill exports its `*_REGISTRY.md` from its own evidence files |
| BCA-002 | `frontend-master-router` + `testing-qa` introduce spec scaffolding for every component |
| BCA-003 | This skill emits `Brain Outputs/readiness/BRAIN_READINESS.json` each run |
| BCA-004 | `backend-api-understanding` extends per-controller dossier to the 6 remaining services |
| BCA-005 | `business-understanding` adopts severity field in `GAPS.md` template |
| BCA-006 | `shared/git-sync` adds a wiki-mirror watcher |
| BCA-007 | `task-report-generator` is updated to always delegate charts → data-visualization (done in v0.1) |
| BCA-008 | `shared/context-output` adds per-domain scan ledger files |
| BCA-U-003 | New skill `frontend-test-coverage-import` to ingest Jest/Cypress JSON |
| BCA-U-004 | New skill `a11y-audit-import` to ingest axe-core JSON |
