---
type: backup-aggregates
generatedAt: 2026-05-16T03:36:02.8467109+03:00
source: quick-frontend/violations.jsonl
totalViolations: 2734
---

# Backup Aggregates — Frontend Code Audit

> Raw aggregations from the quick frontend scan. Use these tables if the per-rule/per-file agent reports are still in flight.

## Per-rule totals

| Rule | Severity | Count |
|---|---|---|
| `R-FE-004` | must | 2271 |
| `R-NOOR-003` | must | 148 |
| `R-FE-003` | must | 120 |
| `R-FE-005` | must | 111 |
| `R-FE-001` | must | 38 |
| `R-NOOR-005` | must | 24 |
| `R-NOOR-007` | must | 20 |
| `R-NOOR-008` | must | 2 |

## Top 30 offender files

| Rank | Violations | File |
|---|---|---|
| 1 | 1086 | `libs/falcon-studio/src/lib/registry/component-tokens.generated.ts` |
| 2 | 154 | `libs/falcon-theme/src/falcon-tailwind-tokens.css` |
| 3 | 154 | `apps/host-shell/src/app/features/falcon-ui-showcase/showcase-data/skeletons.ts` |
| 4 | 94 | `libs/falcon-theme/src/tokens.ts` |
| 5 | 91 | `libs/falcon-studio/src/lib/registry/abstraction-map.registry.ts` |
| 6 | 83 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/library-section.component.ts` |
| 7 | 78 | `apps/host-shell/src/app/features/falcon-ui-showcase/library-section/empty-data-section.component.ts` |
| 8 | 63 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-code-panel.component.ts` |
| 9 | 61 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` |
| 10 | 56 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` |
| 11 | 53 | `apps/host-shell/src/app/playground/playground.page.html` |
| 12 | 49 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` |
| 13 | 42 | `libs/falcon-studio/src/lib/registry/color-palette.config.ts` |
| 14 | 35 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` |
| 15 | 33 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` |
| 16 | 28 | `libs/falcon-studio/src/lib/components/falcon-studio-stat-card.component.ts` |
| 17 | 26 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` |
| 18 | 26 | `apps/admin-console/src/tailwind.css` |
| 19 | 19 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` |
| 20 | 19 | `apps/host-shell/src/app/features/falcon-ui-showcase/gallery/showcase-tabs-actions-demo.component.ts` |
| 21 | 18 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` |
| 22 | 18 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` |
| 23 | 17 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` |
| 24 | 17 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` |
| 25 | 16 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` |
| 26 | 16 | `libs/falcon-studio/src/lib/components/color-picker.component.ts` |
| 27 | 14 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-org-chart/falcon-org-chart.component.html` |
| 28 | 14 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` |
| 29 | 13 | `libs/falcon-studio/src/lib/services/preset.service.ts` |
| 30 | 13 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/add-client-wizard.component.html` |

## Per-app breakdown

| App / Lib | Violations |
|---|---|
| `libs/falcon-studio` | 1408 |
| `apps/host-shell` | 586 |
| `apps/admin-console` | 424 |
| `libs/falcon-theme` | 248 |
| `libs/falcon` | 68 |

## Known false-positive sources (suggested rule exempt-paths additions)

Based on this run, R-FE-004 (tokens only) needs exemptPaths additions:
- `libs/falcon-studio/**` — Studio is a token registry; hex literals are intentional
- `libs/falcon-theme/**` — Theme tokens SoT; hex literals are intentional
- `apps/host-shell/src/app/features/falcon-ui-showcase/**` — Showcase data; hex literals are intentional
- `libs/falcon-ui-tokens/**` (already covered)

If those four globs are added to R-FE-004's exemptPaths, the violation count drops from ~2271 to roughly **~300** — a more realistic real-world signal.

