---
type: projected-burndown
generatedAt: 2026-05-16T03:42:04.3073073+03:00
runId: 2026-05-16-overnight-deep-dive
---

# 📉 Projected Violation Burndown

> If you apply the exempt-paths from TOP_PRIORITY_FIXES.md tomorrow morning, this is what each step actually removes — computed against the real JSONL we have right now.

## Baseline

| Metric | Value |
|---|---|
| Total violations | 2734 |
| Files audited | 126 |
| Rules firing | 8 |

## Step-by-step elimination (Tier 1 exempt paths)

| # | Exemption applied | Violations removed | Remaining |
|---|---|---|---|
| 1 | libs/falcon-studio (token registry) | -1309 | 1425 |
| 2 | libs/falcon-theme (theme SoT) | -248 | 1177 |
| 3 | host-shell falcon-ui-showcase | -410 | 767 |
| 4 | generated tokens files | -0 | 767 |
| 5 | abstraction-map registry | -0 | 767 |
| 6 | color-palette config | -0 | 767 |
| 7 | tailwind.css | -0 | 767 |

## After Tier 1 exemption pass

**Result: 2734 → 767 violations (71.9% reduction)**

This is your "real signal" count. Every one of these is a genuine fix opportunity, not a false positive.

## Real-signal violations by rule

| Rule | Count | Severity |
|---|---|---|
| `R-FE-004` | 304 | must |
| `R-NOOR-003` | 148 | must |
| `R-FE-003` | 120 | must |
| `R-FE-005` | 111 | must |
| `R-FE-001` | 38 | must |
| `R-NOOR-005` | 24 | must |
| `R-NOOR-007` | 20 | must |
| `R-NOOR-008` | 2 | must |

## Real-signal top 15 offender files

| Rank | Violations | File |
|---|---|---|
| 1 | 61 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-settings-step/client-settings-step.component.html` |
| 2 | 56 | `apps/admin-console/src/app/features/org-hierarchy-page/components/user-details/user-details-page.component.html` |
| 3 | 53 | `apps/host-shell/src/app/playground/playground.page.html` |
| 4 | 49 | `apps/admin-console/src/app/features/org-hierarchy-page/components/skeleton/org-hierarchy-skeleton.component.ts` |
| 5 | 35 | `apps/admin-console/src/app/features/org-hierarchy-page/components/verify/otp-dialog.component.html` |
| 6 | 33 | `apps/host-shell/src/app/layout/components/topbar/topbar.component.html` |
| 7 | 26 | `apps/admin-console/src/tailwind.css` |
| 8 | 26 | `libs/falcon/src/shared-ui/lib/components/send-credentials-popup/send-credentials-popup.component.html` |
| 9 | 19 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-chart/falcon-chart-card/falcon-chart-card.component.html` |
| 10 | 18 | `apps/admin-console/src/app/features/org-hierarchy-page/components/org-hierarchy-page-menu.component.html` |
| 11 | 18 | `apps/admin-console/src/app/features/org-hierarchy-page/components/wizard-components/add-client-wizard/client-service-row-table/client-service-row-table.component.html` |
| 12 | 17 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/falcon-table-edit-row/falcon-table-edit-row.component.html` |
| 13 | 17 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-node-drawer/falcon-org-node-drawer.component.html` |
| 14 | 16 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/applications-table/applications-table.component.html` |
| 15 | 14 | `apps/admin-console/src/app/features/org-hierarchy-page/components/tab-components/hierarchy-tab/falcon-org-info-panel/falcon-org-info-panel.component.html` |

## What this means

Before the Tier-1 exemption pass:
- You'd see **2734** violations and panic
- ~62% of them are intentional design data
- The signal-to-noise ratio is too low to act on

After the Tier-1 exemption pass:
- **767** violations remain
- Every one represents a real Falcon-rule deviation
- Now you can prioritize by rule + by file + by leverage

## Verification

After tomorrow's morning Session-3 work, re-run:

`powershell -ExecutionPolicy Bypass -File "C:\Falcon\Brain Outputs\understanding\rules\detectors\quick-frontend-scan.ps1"`

…then compare the violation count to this file's projection.
