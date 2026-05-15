*** Light Learning Events — organization-hierarchy ***
*** Append-only. Light intake records here; Deep run reads here. ***

# Light Learning Events

Every intake event is a row in the table below. Each event MUST carry every schema field. Status starts at `pending`. Approval is handled in Deep Page Learning only.

## Schema

| Field | Required | Notes |
|---|---|---|
| learningId | yes | `LE-<YYYYMMDD>-organization-hierarchy-<NNN>` |
| createdAt | yes | ISO 8601 with TZ |
| sourceType | yes | `prompt \| screenshot \| bug \| correction \| approval \| rejection` |
| pageName | yes | `organization-hierarchy` |
| sectionName | yes | section slug or `unknown` |
| relatedComponent | yes | Falcon component or `none` / `unknown` |
| userInstruction | yes | verbatim quote |
| extractedMeaning | yes | paraphrase |
| category | yes | `uiux \| validation \| api \| business \| component \| gap \| evidence` |
| status | yes | `pending \| approved \| rejected \| promoted \| deprecated` |
| confidence | yes | `low \| medium \| high` |
| relatedScreenshots | yes | paths under `evidence/<learningId>/` or `none` |
| relatedFiles | yes | repo paths or `none` |
| nextAction | yes | text |

## Events

| learningId | createdAt | sourceType | section | component | category | status | confidence | nextAction |
|---|---|---|---|---|---|---|---|---|
| LE-20260515-organization-hierarchy-001 | 2026-05-15T00:00:00+03:00 | correction | tables | falcon-data-table | component | pending | high | Await Ammar approval via Deep Page Learning |

## Full event entries

### LE-20260515-organization-hierarchy-001

- **createdAt:** 2026-05-15T00:00:00+03:00
- **sourceType:** correction
- **pageName:** organization-hierarchy
- **sectionName:** tables (cross-section: comm-channels-tab, apps-services-tab, org-info-rule-status, org-info-permission-privilege, settings-ip-management, settings-account-limitation)
- **relatedComponent:** falcon-data-table
- **userInstruction:** "Tables must use Falcon Data Table with ng-template custom cells for toggles, actions, dropdowns, inputs, and status rendering. No raw HTML table. Tailwind and Falcon tokens only."
- **extractedMeaning:** Every tabular UI section on this page must render via `<falcon-data-table>` with `ng-template` projections for cell types (toggle, action, dropdown, input, status). Raw HTML `<table>` is disallowed. Styling restricted to Tailwind utilities + Falcon design tokens.
- **category:** component
- **status:** pending
- **confidence:** high
- **relatedScreenshots:** none
- **relatedFiles:**
  - `apps/admin-console/src/app/.../organization-hierarchy-page/**`
  - `libs/falcon-ui-core/data-table/*`
- **nextAction:** Promote to `APPROVED_PAGE_PATTERNS.md` only after Ammar says `approve this pattern`. Candidate for global promotion via `PROMOTION_CANDIDATES.md` → `Brain Outputs/understanding/frontend/patterns/TABLE_PATTERN.md`.
