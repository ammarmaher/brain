*** /approve-pattern — approve a single pending page pattern ***

# /approve-pattern <learningId>

Approve one pending pattern by its `learningId` (e.g. `LE-20260515-organization-hierarchy-001`).

Behavior:

1. Locate the pending pattern by `learningId` in the page's `PENDING_PAGE_PATTERNS.md`.
2. Move it to `APPROVED_PAGE_PATTERNS.md`.
3. Append the rule to the matching domain file (`UI_UX_RULES.md`, `VALIDATION_RULES.md`, `API_RULES.md`, `BUSINESS_RULES.md`) based on its category.
4. Update the event row in `LIGHT_LEARNING_EVENTS.md` to status `approved`.
5. Recompute the affected `PAGE_SCORECARD.md` dimension.
6. Append an audit row to `LEARNING_CHANGE_HISTORY.md`.
7. Refresh Obsidian indexes.
8. Approval is page-specific — does NOT promote globally. For global, use `/promote-pattern`.

Skill: `domains/frontend/page-learning/SKILL.md`.
