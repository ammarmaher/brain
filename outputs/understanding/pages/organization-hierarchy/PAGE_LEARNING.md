*** Page Learning — organization-hierarchy ***
*** Path: Brain Outputs/understanding/pages/organization-hierarchy/PAGE_LEARNING.md ***
*** Created: 2026-05-15 ***

# Organization Hierarchy — Page Learning Entry

This file is the entry point for the Brain SK Page Learning System on the Organization Hierarchy page. It links every learning artifact, references the two-mode learning workflow, and tracks the approval-only promotion rule.

Skill: [domains/frontend/page-learning/SKILL.md](../../../../../Brain%20SK/domains/frontend/page-learning/SKILL.md)
Governance gate: [protocols/APPROVAL_LEARNING_GATE.md](../../../../../Brain%20SK/protocols/APPROVAL_LEARNING_GATE.md)

## Modes active on this page

- **Light Learning Intake** — ON (automatic, every prompt/screenshot/bug/correction).
- **Deep Page Learning** — explicit only. Triggers: `deep learn this page`, `update vault`, `approve this pattern`, `promote this globally`, `learn this page`.

## Folder contents

| File | Purpose |
|---|---|
| [PAGE_LEARNING.md](PAGE_LEARNING.md) | This entry point. |
| [LIGHT_LEARNING_EVENTS.md](LIGHT_LEARNING_EVENTS.md) | Every Light Learning intake event (append-only). |
| [PENDING_PAGE_PATTERNS.md](PENDING_PAGE_PATTERNS.md) | Patterns awaiting Ammar approval. |
| [APPROVED_PAGE_PATTERNS.md](APPROVED_PAGE_PATTERNS.md) | Patterns Ammar approved for this page. |
| [REJECTED_PAGE_PATTERNS.md](REJECTED_PAGE_PATTERNS.md) | Patterns Ammar explicitly rejected. |
| [PROMOTION_CANDIDATES.md](PROMOTION_CANDIDATES.md) | Patterns proposed for global promotion. |
| [UI_UX_RULES.md](UI_UX_RULES.md) | Approved UI/UX rules (existing baseline). |
| [VALIDATION_RULES.md](VALIDATION_RULES.md) | Approved validation rules (existing baseline). |
| [API_RULES.md](API_RULES.md) | Approved API contract rules. |
| [BUSINESS_RULES.md](BUSINESS_RULES.md) | Approved business rules (existing baseline). |
| [GAP_REGISTRY.md](GAP_REGISTRY.md) | Unresolved gaps (existing baseline). |
| [EVIDENCE_INDEX.md](EVIDENCE_INDEX.md) | Every screenshot / quote / file pointer. |
| [COMPONENT_USAGE_DECISIONS.md](COMPONENT_USAGE_DECISIONS.md) | Per-section Falcon component decisions. |
| [PAGE_SCORECARD.md](PAGE_SCORECARD.md) | Scored dimensions (existing baseline). |
| [LEARNING_CHANGE_HISTORY.md](LEARNING_CHANGE_HISTORY.md) | Audit of every approve/reject/promote action. |
| `evidence/<learningId>/` | Raw screenshots, quotes, exports keyed by learningId. |

## Approval rule

Nothing in `PENDING_PAGE_PATTERNS.md` is binding. Approval requires Ammar to say so in words. Promotion to the global frontend patterns folder requires Ammar to say `promote this globally`. Page-specific rules stay page-specific by default.

## Tracked dimensions

| Dimension | Source file | Status |
|---|---|---|
| UI/UX | UI_UX_RULES.md | from baseline scorecard |
| Validation | VALIDATION_RULES.md | from baseline scorecard |
| API | API_RULES.md | bootstrapped 2026-05-15 (empty) |
| Business | BUSINESS_RULES.md | from baseline scorecard |
| Component Usage | COMPONENT_USAGE_DECISIONS.md | bootstrapped 2026-05-15 (1 pending) |
| Gap Resolution | GAP_REGISTRY.md | from baseline scorecard |
| Evidence Coverage | EVIDENCE_INDEX.md | bootstrapped 2026-05-15 (0 evidence) |
| Test Coverage | linked through GAP_REGISTRY / NEXT_ACTIONS | from baseline scorecard |

Any dimension < 60 % → `NEEDS ATTENTION` regardless of aggregate.

## Defaults

- Source URL: `http://localhost:3000/T2%20Falcon%20Admin`
- Destination URL: `http://localhost:4200/#/admin-console/org-hierarchy-page`
- Default sections list (mirrors `_obsidian/PAGE_KNOWLEDGE_INDEX.md`):
  `tabs-header`, `comm-channels-tab`, `apps-services-tab`, `org-info-panel`, `org-info-audit-mode`, `org-info-rule-status`, `org-info-permission-privilege`, `settings-tab-view-mode`, `settings-tab-edit-mode`, `settings-ip-management`, `settings-account-limitation`, `otp-popup`.

## Companion baseline files

The page already carries the following pre-learning artifacts; the Page Learning System reads them but does not rewrite them automatically:

- [PAGE_OVERVIEW.md](PAGE_OVERVIEW.md)
- [SOURCE_OF_TRUTH.md](SOURCE_OF_TRUTH.md)
- [SOURCE_DESTINATION_COMPARISON.md](SOURCE_DESTINATION_COMPARISON.md)
- [COMPONENT_MAPPING.md](COMPONENT_MAPPING.md)
- [VISUAL_PARITY_SCORECARD.md](VISUAL_PARITY_SCORECARD.md)
- [IMPLEMENTATION_SCORECARD.md](IMPLEMENTATION_SCORECARD.md)
- [PAGE_RULE_REGISTRY.md](PAGE_RULE_REGISTRY.md)
- [EDIT_ROW_SPEC.md](EDIT_ROW_SPEC.md)
- [CHANGE_HISTORY.md](CHANGE_HISTORY.md)
- [NEXT_ACTIONS.md](NEXT_ACTIONS.md)
