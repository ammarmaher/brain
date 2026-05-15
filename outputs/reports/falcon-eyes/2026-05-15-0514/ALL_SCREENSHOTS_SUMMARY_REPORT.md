# All Screenshots Summary Report

> Generated: 2026-05-15T02:14:40.069Z

## Run

- **Source:** http://localhost:3000/T2%20Falcon%20Admin
- **Destination:** http://localhost:4200/?visual-test=1#/admin-console/org-hierarchy-page
- **Viewport:** 1440x900 @ 1x
- **Total sections compared:** 12
- **Total screenshots captured:** 36
- **Average visual parity (pixel-derived):** 19.60%
- **Sections below 90% parity:** tabs-header, comm-channels-tab, apps-services-tab, org-info-panel, org-info-audit-mode, org-info-rule-status, org-info-permission-privilege, settings-tab-view-mode, settings-tab-edit-mode, settings-ip-management, settings-account-limitation, otp-popup
- **Sections below 60% parity:** tabs-header, comm-channels-tab, apps-services-tab, org-info-panel, org-info-audit-mode, org-info-rule-status, org-info-permission-privilege, settings-tab-view-mode, settings-tab-edit-mode, settings-ip-management, settings-account-limitation, otp-popup

## Section table

| Section | Source Screenshot | Destination Screenshot | Diff Screenshot | Score | P0 | P1 | P2 | P3 | Status |
|---|---|---|---|---:|---:|---:|---:|---:|---|
| tabs-header | source/tabs-header.png | destination/tabs-header.png | diff/tabs-header-diff.png | 19.60 | 0 | 0 | 0 | 0 | needs repair |
| comm-channels-tab | source/comm-channels-tab.png | destination/comm-channels-tab.png | diff/comm-channels-tab-diff.png | 19.60 | 0 | 0 | 0 | 0 | needs repair |
| apps-services-tab | source/apps-services-tab.png | destination/apps-services-tab.png | diff/apps-services-tab-diff.png | 19.60 | 0 | 0 | 0 | 0 | needs repair |
| org-info-panel | source/org-info-panel.png | destination/org-info-panel.png | diff/org-info-panel-diff.png | 19.60 | 0 | 0 | 0 | 0 | needs repair |
| org-info-audit-mode | source/org-info-audit-mode.png | destination/org-info-audit-mode.png | diff/org-info-audit-mode-diff.png | 19.60 | 0 | 0 | 0 | 0 | needs repair |
| org-info-rule-status | source/org-info-rule-status.png | destination/org-info-rule-status.png | diff/org-info-rule-status-diff.png | 19.60 | 0 | 0 | 0 | 0 | needs repair |
| org-info-permission-privilege | source/org-info-permission-privilege.png | destination/org-info-permission-privilege.png | diff/org-info-permission-privilege-diff.png | 19.60 | 0 | 0 | 0 | 0 | needs repair |
| settings-tab-view-mode | source/settings-tab-view-mode.png | destination/settings-tab-view-mode.png | diff/settings-tab-view-mode-diff.png | 19.60 | 0 | 0 | 0 | 0 | needs repair |
| settings-tab-edit-mode | source/settings-tab-edit-mode.png | destination/settings-tab-edit-mode.png | diff/settings-tab-edit-mode-diff.png | 19.60 | 0 | 0 | 0 | 0 | needs repair |
| settings-ip-management | source/settings-ip-management.png | destination/settings-ip-management.png | diff/settings-ip-management-diff.png | 19.60 | 0 | 0 | 0 | 0 | needs repair |
| settings-account-limitation | source/settings-account-limitation.png | destination/settings-account-limitation.png | diff/settings-account-limitation-diff.png | 19.60 | 0 | 0 | 0 | 0 | needs repair |
| otp-popup | source/otp-popup.png | destination/otp-popup.png | diff/otp-popup-diff.png | 19.60 | 0 | 0 | 0 | 0 | needs repair |

## Top 10 visual mismatches (pixel layer)

| Rank | Section | Pixel mismatch % | Per-section report |
|---:|---|---:|---|
| 1 | tabs-header | 80.40 | sections/tabs-header/SCREENSHOT_REPORT.md |
| 2 | comm-channels-tab | 80.40 | sections/comm-channels-tab/SCREENSHOT_REPORT.md |
| 3 | apps-services-tab | 80.40 | sections/apps-services-tab/SCREENSHOT_REPORT.md |
| 4 | org-info-panel | 80.40 | sections/org-info-panel/SCREENSHOT_REPORT.md |
| 5 | org-info-audit-mode | 80.40 | sections/org-info-audit-mode/SCREENSHOT_REPORT.md |
| 6 | org-info-rule-status | 80.40 | sections/org-info-rule-status/SCREENSHOT_REPORT.md |
| 7 | org-info-permission-privilege | 80.40 | sections/org-info-permission-privilege/SCREENSHOT_REPORT.md |
| 8 | settings-tab-view-mode | 80.40 | sections/settings-tab-view-mode/SCREENSHOT_REPORT.md |
| 9 | settings-tab-edit-mode | 80.40 | sections/settings-tab-edit-mode/SCREENSHOT_REPORT.md |
| 10 | settings-ip-management | 80.40 | sections/settings-ip-management/SCREENSHOT_REPORT.md |

## Top Falcon components causing mismatch

_Falcon Eyes (the skill) fills this — derived from each per-section `Falcon components involved` block._

## Top Tailwind / token issues

_Falcon Eyes (the skill) fills this — derived from each per-section `Tailwind / token issues` block._

## Top missing dynamic APIs

_Falcon Eyes (the skill) fills this — derived from each per-section `Dynamic API issues` and `Missing shared component capabilities` blocks._

## Recommended repair order

_Falcon Eyes (the skill) fills this once severities are finalized. Default ordering: P0 → P1 → P2 → P3, then by section weight._

## Reporting contract

Every run produces: one report per section under `sections/<name>/`, one combined summary (this file), one screenshot index (`ALL_SCREENSHOTS_INDEX.md`), one semantic mismatch backlog (`SEMANTIC_MISMATCH_BACKLOG.md`), and one Falcon component repair map (`FALCON_COMPONENT_REPAIR_MAP.md`).