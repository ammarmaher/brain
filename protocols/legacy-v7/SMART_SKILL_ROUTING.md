# Smart Skill Routing Protocol

## Purpose

This protocol tells Falcon Brain Genius v2 how to load only the right skills for the current task.

## Rule

Do not load every skill blindly. Classify the source and load the minimum correct chain.

## Source Classification

Classify the task as one or more of:

- React project / JSX / TSX / live React screen
- HTML/CSS/JS static prototype
- screenshot / image / visual reference
- PRD / BRD / business requirements
- backend API / controller / DTO / entity / service
- Angular frontend feature / bug / refactor
- sprint planning / report / PDF artifact
- QA / test matrix / regression review
- architecture / migration / bundle / performance

## Routing Table

| Source | Skill chain |
|---|---|
| React to Angular | `60-falcon-project-abstraction-understanding` → `61-falcon-react-to-angular-rage-mode` → `20-claude-implementation-engineer` |
| HTML clone | `62-rage-html-to-falcon-angular` → `20-claude-implementation-engineer` |
| Screenshot clone | `30-gemini-visual-chart-qa` → `20-claude-implementation-engineer` → RAGE verification |
| PRD gaps | `40-business-knowledge-pipeline` → `10-chatgpt-codex-business-analyst` |
| Backend task | backend skill if available → `10-chatgpt-codex-business-analyst` → `20-claude-implementation-engineer` |
| Frontend implementation | `60-falcon-project-abstraction-understanding` → `20-claude-implementation-engineer` |
| Full feature | `40-business-knowledge-pipeline` → `60-falcon-project-abstraction-understanding` → `20-claude-implementation-engineer` |
| Visual QA | `30-gemini-visual-chart-qa` |
| Artifact/report/PDF | `10-chatgpt-codex-business-analyst` → Generated Artifact Governance |

## Conflict Resolution

Architecture rules win over visual cloning.

Falcon components win over raw HTML.

Business/backend contracts win over frontend assumptions.

RAGE MODE accuracy must be achieved without over-engineering.

