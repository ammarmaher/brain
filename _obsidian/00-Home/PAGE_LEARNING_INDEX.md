*** Page Learning — vault entry point ***
*** Updated 2026-05-15 ***

# Page Learning Index

> Two-mode learning per page. Brain Outputs holds rules; this note holds the graph. The `pages/` tree is the source of truth, not Obsidian.

- Canonical knowledge root: [`Brain Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md`](../../../Brain%20Outputs/understanding/KNOWLEDGE_ROOT_INDEX.md) (pages live at `understanding/pages/<page>/`)
- Skill: [page-learning](../../domains/frontend/page-learning/SKILL.md)
- Approval gate: [APPROVAL_LEARNING_GATE](../../protocols/APPROVAL_LEARNING_GATE.md)
- Global patterns: [[APPROVED_PATTERNS_INDEX]]
- Per-page entry notes live under `10-Pages/`.

## Pages

| Page | Note | Pending | Approved | Last update |
|---|---|---|---|---|
| organization-hierarchy | [[Organization Hierarchy]] | 1 (PP-001) | 0 | 2026-05-15 |

## Trigger phrases (Deep Mode)

- `deep learn this page`
- `update vault`
- `approve this pattern`
- `promote this globally`
- `learn this page`

## Slash commands

- `/light-learn` · `/deep-learn-page <page>` · `/approve-pattern <id>` · `/reject-pattern <id> <reason>` · `/promote-pattern <id>` · `/learn-screenshot` · `/falcon-eyes-norepair` · `/falcon-eyes-repair-scoped <section>`

## Learning-First Task Routing

Canonical: [LEARNING_FIRST_TASK_ROUTING](../../protocols/LEARNING_FIRST_TASK_ROUTING.md). Every page task starts here.

| Mode | Use when | Command / alias |
|---|---|---|
| 1 Light Learning | any prompt with page/screenshot/bug | `/light-learn`, "Light learn this screenshot" |
| 2 Page implementation | implement / build / convert | (no command — load 12 artifacts, plan, code) |
| 3 Bug fix | fix / broken | (save evidence first; learning event before fix) |
| 4 Falcon Eyes (no repair) | compare screenshots | `/falcon-eyes-norepair`, "Run Falcon Eyes, no repair" |
| 4b Falcon Eyes (scoped repair) | repair only a named section | `/falcon-eyes-repair-scoped <section>`, "Run Falcon Eyes and repair only the table" |
| 5 Deep learning | `deep learn`, `update vault`, `approve this pattern`, `learn this page`, `this is the approved way` | `/deep-learn-page <page>` |
| 6 Global promotion | `promote this globally` | `/promote-pattern <id>` |

**Permanent rule:** Brain SK must not jump directly into implementation when the user provides screenshots, source pages, visual bugs, or page instructions. It must first create a Light Learning event and load page/component knowledge.
