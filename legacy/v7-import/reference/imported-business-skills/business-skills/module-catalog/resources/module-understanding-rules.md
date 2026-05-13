*** Module Understanding Rules — module-catalog ***
*** Migrated verbatim from OLD claude-falcon-skills — 15-section understanding.md schema ***

# Module Understanding Rules

`understanding.md` is Claude's digested, structured interpretation of a module. It is NOT a copy of the PRD.

## Required sections

- module purpose
- actors / users
- screens / pages
- main actions
- business rules
- permission rules (when applicable)
- main workflows
- edge cases
- validations
- dependencies on other modules
- data entities
- API expectations (if mentioned)
- assumptions
- risks / unclear areas
- suggested clarifying questions

## Writing rules

- Use clear structured language.
- Do not copy-paste from the PRD — explain what the requirement means.
- Be explicit about assumptions. Never hide them.
- Flag contradictions between the PRD and attachments.
- Flag every unclear area as a clarifying question.
- Keep the tone neutral and descriptive — no marketing language.

## Sourcing

- Primary source: the selected latest PRD.
- Supporting sources: attachments noted as "used for understanding" in `attachments.md`.
- Never invent behavior not backed by the PRD or a supporting file.

## Cross-module links

- When the PRD references another module, link to the slug of that module's local folder.
- If the referenced module is not yet synced, note it under "dependencies" and under "clarifying questions".

## Keep in sync

When a new PRD version is synced:

- Rewrite `understanding.md` against the new version.
- Preserve any previously captured clarifying questions that remain unanswered.
- Mark sections that changed vs the previous version in a brief "Changes since previous version" note at the top of `understanding.md`.
