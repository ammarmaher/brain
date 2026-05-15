*** /reject-pattern — reject a single pending page pattern ***

# /reject-pattern <learningId> <reason>

Reject one pending pattern. Mode 5 of the [Learning-First Task Routing protocol](../../protocols/LEARNING_FIRST_TASK_ROUTING.md). Aliases: `reject this pattern`, `reject <id> <reason>`.

Behavior:

1. Move the entry from `PENDING_PAGE_PATTERNS.md` to `REJECTED_PAGE_PATTERNS.md` with the given reason.
2. Update the event row in `LIGHT_LEARNING_EVENTS.md` to status `rejected`.
3. Append an audit row to `LEARNING_CHANGE_HISTORY.md`.
4. Refresh Obsidian indexes.

Skill: `domains/frontend/page-learning/SKILL.md`.
