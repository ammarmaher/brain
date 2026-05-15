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
| LE-20260515-commchannels-shadow-row-notch-alignment | 2026-05-15T00:00:00+03:00 | bug | comm-channels-tab | falcon-data-table (shadow rows) | uiux | approved | high | Fix landed Wave 20; QA-web verifies notch alignment on `priceType` + `priceValue` shadow rows |

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

### LE-20260515-commchannels-shadow-row-notch-alignment

- **createdAt:** 2026-05-15T00:00:00+03:00
- **sourceType:** bug
- **pageName:** organization-hierarchy
- **sectionName:** comm-channels-tab (also apps-services-tab — shared `applications-table` component)
- **relatedComponent:** falcon-data-table (shadow rows feature, Wave 19/20)
- **userInstruction:** "Notch not found" — user annotation on screenshot of `http://localhost:4200/#/admin-console/org-hierarchy-page` CommChannels & Services tab.
- **extractedMeaning:** The shadow row's green band, edit form, and Cancel/Save buttons all render, but the arrow notch (▲) at the top edge — which should point UP at the target column header — is not visible. Root cause traced to Tailwind class `top-0 -translate-y-full` being a no-op on `w-0 h-0` (percentage translate is relative to element's own CSS height = 0). Triangle stayed at `top:0` with the visible bottom-border extending DOWN INTO the green band — same colour = invisible. Fix: explicit `top-[calc(-1*var(--falcon-data-table-shadow-arrow-size))]`.
- **category:** uiux
- **status:** approved (resolved Wave 20)
- **confidence:** high
- **relatedScreenshots:** `evidence/org-hierarchy/2026-05-15-commchannels-notch-missing/SCREENSHOT_NOTES.md`
- **relatedFiles:**
  - `libs/falcon-ui-core/src/components/falcon-table-tw/falcon-table-tw.tsx` — position-update logic + JSX cleanup
  - `libs/falcon-ui-core/src/tailwind/table-tailwind-classes.ts` — `falconTableShadowArrowClasses()` rewrite
  - `libs/falcon-ui-tokens/src/components/data-table.tokens.css` — new `--falcon-data-table-shadow-arrow-z` token
- **nextAction:** Promoted to `UI_UX_RULES.md` as UIUX-SHADOW-001 through UIUX-SHADOW-005. Closed gap GAP-COMMCHANNELS-NOTCH-001. Open follow-ups (FDT-SHADOW-FU-01 through FU-08) tracked in `Brain Outputs/understanding/frontend/components/falcon-data-table/GAPS_AND_UPGRADES.md`. QA-web phase to verify on next browser session.

## Detailed Light Learning event files (one per event, mirrored to the canonical `light-learning/` folder)

- [`light-learning/2026-05-15-commchannels-shadow-row-notch-alignment.md`](./light-learning/2026-05-15-commchannels-shadow-row-notch-alignment.md)
