*** Falcon Eyes Run Report — Organization Hierarchy ***
*** Run stamp: 2026-05-15-0450 ***

## Run location
`C:\Falcon\Brain Outputs\reports\falcon-eyes\2026-05-15-0450\`

## Run config
- Source: `http://localhost:3000/T2%20Falcon%20Admin`
- Destination: `http://localhost:4200/#/admin-console/org-hierarchy-page`
- Viewport: 1440 × 900 @ 1x
- Wait: networkidle + 750 ms
- Pixelmatch threshold: 0.10
- Headless: true

## Tool patch applied
The Brain SK Falcon Eyes tool at `C:\Falcon\Brain SK\tools\falcon-eyes\capture-and-compare.ts` shipped with an ESM-incompatible `__dirname` reference in default arg evaluation. Patched in this run with an `import.meta.url` shim — no functional behavior changed. The patch is local to the Brain SK tool only; no Falcon workspace files were modified.

## Sections captured
All 12 sections from `section-capture.config.json`:
`tabs-header`, `comm-channels-tab`, `apps-services-tab`, `org-info-panel`, `org-info-audit-mode`, `org-info-rule-status`, `org-info-permission-privilege`, `settings-tab-view-mode`, `settings-tab-edit-mode`, `settings-ip-management`, `settings-account-limitation`, `otp-popup`.

Every section uses full-page fallback because the section selectors are empty (per the tool's default config; selectors are intended to be filled per run once destination DOM is finalized).

## Pixel results (raw)
Every section: 17.57% mismatch. This is **not** a meaningful per-section signal — every destination screenshot is identical (the "Access Check Failed" card) because the route is auth-blocked. The 17.57% is constant because the destination card vs. the source Org Hierarchy page yields a constant pixel delta when both are scaled to the same crop.

## Semantic analysis
Cannot be completed. The destination never rendered the Organization Hierarchy page. No tabs, no tables, no panels, no validation states, no popups are visible. The semantic-mismatch backlog cannot be populated honestly — every mismatch would have only one description: *"destination shows auth-denied card instead of feature UI"*.

## Per-section result
| Section | Source captured | Destination captured | Diff produced | Semantic data |
|---|---|---|---|---|
| tabs-header | yes (Org Hierarchy page) | yes (auth card) | yes | not possible — destination blocked |
| comm-channels-tab | yes | yes (auth card) | yes | not possible — destination blocked |
| apps-services-tab | yes | yes (auth card) | yes | not possible — destination blocked |
| org-info-panel | yes | yes (auth card) | yes | not possible — destination blocked |
| org-info-audit-mode | yes | yes (auth card) | yes | not possible — destination blocked |
| org-info-rule-status | yes | yes (auth card) | yes | not possible — destination blocked |
| org-info-permission-privilege | yes | yes (auth card) | yes | not possible — destination blocked |
| settings-tab-view-mode | yes | yes (auth card) | yes | not possible — destination blocked |
| settings-tab-edit-mode | yes | yes (auth card) | yes | not possible — destination blocked |
| settings-ip-management | yes | yes (auth card) | yes | not possible — destination blocked |
| settings-account-limitation | yes | yes (auth card) | yes | not possible — destination blocked |
| otp-popup | yes | yes (auth card) | yes | not possible — destination blocked |

## Files produced by the tool (raw)
`source/<section>.png` × 12 + `_full-page.png`
`destination/<section>.png` × 12 + `_full-page.png`
`diff/<section>-diff.png` × 12
`sections/<section>/SOURCE.png + DESTINATION.png + DIFF.png + SCREENSHOT_REPORT.md + SCREENSHOT_DATA.json + SEMANTIC_MISMATCHES.md + FALCON_COMPONENT_REPAIR_MAP.md` × 12
`metadata/run.json + pixelmatch.json`
`FALCON_EYES_REPORT.md`, `FALCON_EYES_DATA.json`, `SEMANTIC_MISMATCH_BACKLOG.md`, `SECTION_SCORECARD.md`, `FALCON_COMPONENT_REPAIR_MAP.md`, `ALL_SCREENSHOTS_INDEX.md`, `ALL_SCREENSHOTS_SUMMARY_REPORT.md`

The pixel layer is complete and honest. The semantic templates are intentionally left in their "TBD" state because filling them without visible destination UI would be fabrication.

## Status — BLOCKED
Destination is auth-gated. Repair loop did NOT start. See `BLOCKER_REPORT.md`.
