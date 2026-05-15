*** Brain SK Obsidian — Page Knowledge Index ***
*** Path: _obsidian/PAGE_KNOWLEDGE_INDEX.md ***
*** Created: 2026-05-15 ***

# Page Knowledge Index

> Page-level knowledge sits under `C:\Falcon\Brain Outputs\understanding\pages\`. This index links the pages Falcon Eyes commonly compares.

## Organization Hierarchy page (1 pending)

- [Page knowledge folder](../../Brain%20Outputs/understanding/pages/organization-hierarchy/)
- Falcon Eyes default scope target — see [[FALCON_EYES_INDEX]].

### Page Learning System files

- [PAGE_LEARNING](../../Brain%20Outputs/understanding/pages/organization-hierarchy/PAGE_LEARNING.md) — entry point + mode + scoring
- [LIGHT_LEARNING_EVENTS](../../Brain%20Outputs/understanding/pages/organization-hierarchy/LIGHT_LEARNING_EVENTS.md)
- [PENDING_PAGE_PATTERNS](../../Brain%20Outputs/understanding/pages/organization-hierarchy/PENDING_PAGE_PATTERNS.md) — **PP-001** Falcon Data Table mandate (pending Ammar approval)
- [APPROVED_PAGE_PATTERNS](../../Brain%20Outputs/understanding/pages/organization-hierarchy/APPROVED_PAGE_PATTERNS.md)
- [REJECTED_PAGE_PATTERNS](../../Brain%20Outputs/understanding/pages/organization-hierarchy/REJECTED_PAGE_PATTERNS.md)
- [PROMOTION_CANDIDATES](../../Brain%20Outputs/understanding/pages/organization-hierarchy/PROMOTION_CANDIDATES.md) — PP-001 proposed for global `TABLE_PATTERN.md`
- [API_RULES](../../Brain%20Outputs/understanding/pages/organization-hierarchy/API_RULES.md)
- [EVIDENCE_INDEX](../../Brain%20Outputs/understanding/pages/organization-hierarchy/EVIDENCE_INDEX.md)
- [COMPONENT_USAGE_DECISIONS](../../Brain%20Outputs/understanding/pages/organization-hierarchy/COMPONENT_USAGE_DECISIONS.md)
- [LEARNING_CHANGE_HISTORY](../../Brain%20Outputs/understanding/pages/organization-hierarchy/LEARNING_CHANGE_HISTORY.md)

Skill: [page-learning](../domains/frontend/page-learning/SKILL.md). Approval gate: [APPROVAL_LEARNING_GATE](../protocols/APPROVAL_LEARNING_GATE.md). Global patterns: see [[FRONTEND_INDEX]] → "Global Frontend Patterns".

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
