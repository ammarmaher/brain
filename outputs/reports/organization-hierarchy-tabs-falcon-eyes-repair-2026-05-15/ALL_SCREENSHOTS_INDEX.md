*** All Screenshots Index — Org Hierarchy Falcon Eyes (2026-05-15) ***

## Top-level evidence (copied into this report folder)
| File | Description |
|---|---|
| `evidence/source/source_full-page.png` | Source full Organization Hierarchy page (port 3000) |
| `evidence/destination/destination_full-page.png` | Destination access-denied card (port 4200, auth-blocked) |
| `evidence/diff/tabs-header-diff.png` | Sample diff showing the source-vs-auth-card delta |

## Full Falcon Eyes run output (canonical)
`C:\Falcon\Brain Outputs\reports\falcon-eyes\2026-05-15-0450\`

| Section | Source | Destination | Diff | Per-section report | Status |
|---|---|---|---|---|---|
| tabs-header | source/tabs-header.png | destination/tabs-header.png | diff/tabs-header-diff.png | sections/tabs-header/SCREENSHOT_REPORT.md | blocked (destination = auth-denied card) |
| comm-channels-tab | source/comm-channels-tab.png | destination/comm-channels-tab.png | diff/comm-channels-tab-diff.png | sections/comm-channels-tab/SCREENSHOT_REPORT.md | blocked |
| apps-services-tab | source/apps-services-tab.png | destination/apps-services-tab.png | diff/apps-services-tab-diff.png | sections/apps-services-tab/SCREENSHOT_REPORT.md | blocked |
| org-info-panel | source/org-info-panel.png | destination/org-info-panel.png | diff/org-info-panel-diff.png | sections/org-info-panel/SCREENSHOT_REPORT.md | blocked |
| org-info-audit-mode | source/org-info-audit-mode.png | destination/org-info-audit-mode.png | diff/org-info-audit-mode-diff.png | sections/org-info-audit-mode/SCREENSHOT_REPORT.md | blocked |
| org-info-rule-status | source/org-info-rule-status.png | destination/org-info-rule-status.png | diff/org-info-rule-status-diff.png | sections/org-info-rule-status/SCREENSHOT_REPORT.md | blocked |
| org-info-permission-privilege | source/org-info-permission-privilege.png | destination/org-info-permission-privilege.png | diff/org-info-permission-privilege-diff.png | sections/org-info-permission-privilege/SCREENSHOT_REPORT.md | blocked |
| settings-tab-view-mode | source/settings-tab-view-mode.png | destination/settings-tab-view-mode.png | diff/settings-tab-view-mode-diff.png | sections/settings-tab-view-mode/SCREENSHOT_REPORT.md | blocked |
| settings-tab-edit-mode | source/settings-tab-edit-mode.png | destination/settings-tab-edit-mode.png | diff/settings-tab-edit-mode-diff.png | sections/settings-tab-edit-mode/SCREENSHOT_REPORT.md | blocked |
| settings-ip-management | source/settings-ip-management.png | destination/settings-ip-management.png | diff/settings-ip-management-diff.png | sections/settings-ip-management/SCREENSHOT_REPORT.md | blocked |
| settings-account-limitation | source/settings-account-limitation.png | destination/settings-account-limitation.png | diff/settings-account-limitation-diff.png | sections/settings-account-limitation/SCREENSHOT_REPORT.md | blocked |
| otp-popup | source/otp-popup.png | destination/otp-popup.png | diff/otp-popup-diff.png | sections/otp-popup/SCREENSHOT_REPORT.md | blocked |

The tool also generated per-section `SOURCE.png`, `DESTINATION.png`, `DIFF.png` copies inside each `sections/<name>/` folder for self-contained section bundles.
