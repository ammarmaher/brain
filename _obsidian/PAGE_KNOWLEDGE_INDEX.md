*** Brain SK Obsidian — Page Knowledge Index ***
*** Path: _obsidian/PAGE_KNOWLEDGE_INDEX.md ***
*** Created: 2026-05-15 ***

# Page Knowledge Index

> Page-level knowledge sits under `C:\Falcon\Brain Outputs\understanding\pages\`. This index links the pages Falcon Eyes commonly compares.

## Organization Hierarchy page

- [Page knowledge folder](../../Brain%20Outputs/understanding/pages/organization-hierarchy/)
- Falcon Eyes default scope target — see [[FALCON_EYES_INDEX]].

### Default Falcon Eyes sections for this page

- `tabs-header`
- `comm-channels-tab`
- `apps-services-tab`
- `org-info-panel`
- `org-info-audit-mode`
- `org-info-rule-status`
- `org-info-permission-privilege`
- `settings-tab-view-mode`
- `settings-tab-edit-mode`
- `settings-ip-management`
- `settings-account-limitation`
- `otp-popup`

### Default Falcon Eyes URLs

| Side | URL |
|---|---|
| Source | `http://localhost:3000/T2%20Falcon%20Admin` |
| Destination | `http://localhost:4200/#/admin-console/org-hierarchy-page` |

### Per-page Falcon Eyes report layout

Each page run produces under `Brain Outputs/reports/falcon-eyes/<YYYY-MM-DD-HHmm>/`:

- A `sections/<section-name>/` folder for every section listed above, each with `SOURCE.png`, `DESTINATION.png`, `DIFF.png`, `SCREENSHOT_REPORT.md`, `SCREENSHOT_DATA.json`, `SEMANTIC_MISMATCHES.md`, `FALCON_COMPONENT_REPAIR_MAP.md`.
- `ALL_SCREENSHOTS_INDEX.md` linking every screenshot + per-section report.
- `ALL_SCREENSHOTS_SUMMARY_REPORT.md` combining the entire page (averages, sections below 90/60 %, top 10 mismatches, top Falcon components, top Tailwind/token issues, top missing dynamic APIs, recommended repair order).
- `SEMANTIC_MISMATCH_BACKLOG.md`, `SECTION_SCORECARD.md`, `FALCON_COMPONENT_REPAIR_MAP.md`, `FALCON_EYES_REPORT.md`, `FALCON_EYES_DATA.json`.

## Related indexes

- [[FALCON_EYES_INDEX]]
- [[VISUAL_QA_INDEX]]
- [[FRONTEND_INDEX]]
- [[PAGES_INDEX]] — broader page registry (NEEDS-ATTENTION pages, scoring, 4 dimensions per page)
- [[Frontend Components Index]]

## Conventions

- Pages live at `Brain Outputs/understanding/pages/<page-name>/`.
- Falcon Eyes reports are page-scoped — one run per page snapshot.
- The Falcon Eyes section list in `tools/falcon-eyes/section-capture.config.json` mirrors the section names listed in the page knowledge folder.
