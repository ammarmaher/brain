*** /promote-pattern — promote a page pattern to global ***

# /promote-pattern <learningId>

Promote an APPROVED page pattern to the global frontend patterns folder. Mode 6 of the [Learning-First Task Routing protocol](../../protocols/LEARNING_FIRST_TASK_ROUTING.md). Aliases: `promote this globally`, `Promote this to global <pattern> pattern` (e.g. `Promote this to global Falcon table pattern`). Page-specific rules never become global automatically — this command runs only on explicit Ammar approval.

Behavior:

1. Verify the pattern is in `APPROVED_PAGE_PATTERNS.md`. If still pending, ask Ammar to approve first.
2. Pick the target global file under `Brain Outputs/understanding/frontend/patterns/` based on category:
   - component (tables) → `TABLE_PATTERN.md`
   - component (tabs) → `TABS_PATTERN.md`
   - component (form) → `FORM_PATTERN.md`
   - component (button) → `BUTTON_PATTERN.md`
   - component (popup) → `POPUP_PATTERN.md`
   - validation → `VALIDATION_PATTERN.md`
   - api → `API_PATTERN.md`
   - business / section-level → `PAGE_SECTION_PATTERN.md`
   - customization-order refinement → `FALCON_COMPONENT_CUSTOMIZATION_PATTERN.md`
3. Append the rule to the chosen global file with origin page + learningId + promotedOn.
4. Move the row in the page's `PROMOTION_CANDIDATES.md` to status `promoted`.
5. Update the event row in `LIGHT_LEARNING_EVENTS.md` to status `promoted`.
6. Append an audit row to `LEARNING_CHANGE_HISTORY.md`.
7. If the global file already carries a conflicting rule, do NOT overwrite — append under a `Conflict` section and ping Ammar.

Skill: `domains/frontend/page-learning/SKILL.md`.
