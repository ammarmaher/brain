---
type: hub
hub: approved_patterns
created: 2026-05-15
---
*** Approved Patterns Index — graph hub ***
*** Updated 2026-05-15 ***

# Approved Patterns Index

> Two layers: **page-specific approved** (lives in each page's `APPROVED_PAGE_PATTERNS.md`) and **globally-promoted** (lives in `outputs/understanding/frontend/patterns/`). Promotion requires Ammar to say `promote this globally`.

## Page-specific approved patterns

| Page | File | Count |
|---|---|---|
| organization-hierarchy | [APPROVED_PAGE_PATTERNS.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/APPROVED_PAGE_PATTERNS.md) | 0 rows in `APPROVED_PAGE_PATTERNS.md` _(SoT sync gap — see below)_. PP-001 still pending in [PENDING_PAGE_PATTERNS.md](../../../Brain%20Outputs/understanding/pages/organization-hierarchy/PENDING_PAGE_PATTERNS.md). Effective approvals from [[LE-20260515-commchannels-shadow-row-notch-alignment]]: 5 (UIUX-SHADOW-001..005, promoted directly into `UI_UX_RULES.md` without an `APPROVED_PAGE_PATTERNS.md` row) |

## SoT sync gap (logged 2026-05-15)

The shadow-row event `LE-20260515-commchannels-shadow-row-notch-alignment` carries `status: approved` in `LIGHT_LEARNING_EVENTS.md` and its 5 promoted rules landed in `UI_UX_RULES.md` — but no matching row was added to `APPROVED_PAGE_PATTERNS.md`. Recording here so the next Deep Page Learning run reconciles the registry.

## Globally-promoted patterns

| Pattern | File | Status |
|---|---|---|
| Table | [TABLE_PATTERN.md](../../outputs/understanding/frontend/patterns/TABLE_PATTERN.md) | seed (PP-001 promotion candidate inbound) |
| Tabs | [TABS_PATTERN.md](../../outputs/understanding/frontend/patterns/TABS_PATTERN.md) | seed |
| Form | [FORM_PATTERN.md](../../outputs/understanding/frontend/patterns/FORM_PATTERN.md) | seed |
| Button | [BUTTON_PATTERN.md](../../outputs/understanding/frontend/patterns/BUTTON_PATTERN.md) | seed |
| Popup | [POPUP_PATTERN.md](../../outputs/understanding/frontend/patterns/POPUP_PATTERN.md) | seed |
| Validation | [VALIDATION_PATTERN.md](../../outputs/understanding/frontend/patterns/VALIDATION_PATTERN.md) | seed |
| API | [API_PATTERN.md](../../outputs/understanding/frontend/patterns/API_PATTERN.md) | seed |
| Page section | [PAGE_SECTION_PATTERN.md](../../outputs/understanding/frontend/patterns/PAGE_SECTION_PATTERN.md) | seed |
| Component customization order | [FALCON_COMPONENT_CUSTOMIZATION_PATTERN.md](../../outputs/understanding/frontend/patterns/FALCON_COMPONENT_CUSTOMIZATION_PATTERN.md) | seed |

## Promotion candidates (not approved yet)

| id | Page | Target global file |
|---|---|---|
| PP-001 | organization-hierarchy | [TABLE_PATTERN.md](../../outputs/understanding/frontend/patterns/TABLE_PATTERN.md) |

## Related hubs

- [[PAGE_LEARNING_INDEX]] · [[FRONTEND_INDEX]] · [[COMPONENT_INDEX]] · [[UI_UX_INDEX]] · [[VALIDATION_INDEX]] · [[API_INDEX]] · [[BUSINESS_INDEX]]

## Tags

#type/index #gap
