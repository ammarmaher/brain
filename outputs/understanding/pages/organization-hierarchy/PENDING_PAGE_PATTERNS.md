*** Pending Page Patterns — organization-hierarchy ***
*** These patterns are NOT binding. Ammar approval required. ***

# Pending Page Patterns

Patterns proposed for the Organization Hierarchy page but not yet approved. Approve via `/approve-pattern <learningId>` or `approve this pattern` during Deep Page Learning.

## PP-001 — Falcon Data Table for every tabular section

- **learningId:** LE-20260515-organization-hierarchy-001
- **status:** pending
- **proposedOn:** 2026-05-15
- **category:** component
- **scope:** page-specific (candidate for global promotion to `patterns/TABLE_PATTERN.md`)
- **rule:** Tables must use `<falcon-data-table>` with `ng-template` custom cells for toggles, actions, dropdowns, inputs, and status rendering. No raw HTML table. Tailwind utilities and Falcon design tokens only — no SCSS, no inline styles, no PrimeNG.
- **applies to sections:**
  - `comm-channels-tab`
  - `apps-services-tab`
  - `org-info-rule-status`
  - `org-info-permission-privilege`
  - `settings-ip-management`
  - `settings-account-limitation`
- **customization order to honor:** inputs → templates → slots → variants → upgrade → new component → wrapper → raw (GAP)
- **rationale:** Aligns the page with the absolute standing rule [`feedback_falcon_custom_library_mandatory`](../../../../../Users/User/.claude/projects/C--Falcon/memory/feedback_falcon_custom_library_mandatory.md) and the Falcon UI library doctrine.
- **decision:** PENDING — awaiting Ammar approval.
- **next action:** Ammar must say `approve this pattern` or `approve PP-001` to promote.
